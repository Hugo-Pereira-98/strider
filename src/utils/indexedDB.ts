const DB_NAME = 'posterr-db';
const DB_VERSION = 1;
import {
  Post,
  User,
  Comment,
  ThemePreference,
  RetweetFrom,
} from '@/utils/interfaces';

const STORE_NAMES = {
  users: 'users',
  posts: 'posts',
};

import {
  postsOptions,
  firstNameOptions,
  lastNameOptions,
  commentsOptions,
} from '@/data/index';

const inMemoryDB: { [key: string]: any } = {
  [STORE_NAMES.users]: [] as User[],
  [STORE_NAMES.posts]: [] as Post[],
};

export async function createPost(
  db: IDBDatabase | typeof inMemoryDB,
  userId: number,
  postContent: string,
  taggedUsers: Pick<User, 'userId' | 'userName' | 'email'>[] = [],
  retweetFrom: RetweetFrom | null = null
): Promise<Post> {
  const newPost: Post = {
    userId,
    post: postContent,
    postDate: new Date(),
    retweets: [],
    likes: [],
    comments: [],
    tagged: taggedUsers,
    retweetFrom,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.add(newPost);

    request.onsuccess = async () => {
      newPost.id = request.result as number;

      if (retweetFrom) {
        // Increment the retweets array of the referenced post
        const getRequest = store.get(retweetFrom.postId);

        getRequest.onsuccess = () => {
          const referencedPost = getRequest.result as Post;
          if (referencedPost) {
            referencedPost.retweets.push(newPost.id!);
            const updateRequest = store.put(referencedPost);

            updateRequest.onsuccess = () => {
              resolve(newPost);
            };

            updateRequest.onerror = (event: any) => {
              console.error(
                'IndexedDB update retweets error:',
                (event.target as IDBRequest).error
              );
              reject(
                `IndexedDB update retweets error: ${
                  (event.target as IDBRequest).error
                }`
              );
            };
          } else {
            resolve(newPost);
          }
        };

        getRequest.onerror = (event: any) => {
          console.error(
            'IndexedDB get referenced post error:',
            (event.target as IDBRequest).error
          );
          reject(
            `IndexedDB get referenced post error: ${
              (event.target as IDBRequest).error
            }`
          );
        };
      } else {
        resolve(newPost);
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB create post error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB create post error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function getAllPosts(
  db: IDBDatabase | typeof inMemoryDB,
  offset: number,
  limit: number,
  searchTerm: string = ''
): Promise<{ post: Post; user: User }[]> {
  const posts: Post[] = await new Promise<Post[]>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.openCursor(null, 'prev');

    const result: Post[] = [];
    let count = 0;

    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const post = cursor.value as Post;
        const isQuotePost =
          post.retweetFrom &&
          post.post &&
          post.post.toLowerCase().includes(searchTerm.toLowerCase());

        if (
          count >= offset &&
          result.length < limit &&
          !post.retweetFrom &&
          post.post.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          result.push(post);
        } else if (isQuotePost) {
          result.push(post);
        }
        count++;
        cursor.continue();
      } else {
        resolve(result);
      }
    };

    request.onerror = (event: Event) => {
      console.error(
        'IndexedDB get posts error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get posts error: ${(event.target as IDBRequest).error}`
      );
    };
  });

  const postUserPairs: { post: Post; user: User }[] = [];

  for (const post of posts) {
    const user = await getUserById(db, post.userId);
    postUserPairs.push({ post, user });
  }

  return postUserPairs;
}

function getUserById(
  db: IDBDatabase | typeof inMemoryDB,
  userId: number
): Promise<User> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.get(userId);

    request.onsuccess = () => {
      resolve(request.result as User);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get user by id error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get user by id error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function getPostsFromFollowedUsers(
  db: IDBDatabase | typeof inMemoryDB,
  email: string,
  offset: number,
  limit: number,
  searchTerm: string = ''
): Promise<{ post: Post; user: User }[]> {
  const users = await getUsers(db);
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  const followedUsers = user.following.map((f) => f.userId);
  const allPosts: Post[] = [];

  for (const userId of followedUsers) {
    const userPosts = await getPostsByUserId(db, userId);
    allPosts.push(...userPosts);
  }

  allPosts.sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  );

  const filteredPosts = allPosts.filter((post) => {
    const isQuotePost =
      post.retweetFrom &&
      post.post &&
      post.post.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      (!post.retweetFrom &&
        post.post.toLowerCase().includes(searchTerm.toLowerCase())) ||
      isQuotePost
    );
  });

  const paginatedPosts = filteredPosts.slice(offset, offset + limit);

  const postUserPairs: { post: Post; user: User }[] = [];

  for (const post of paginatedPosts) {
    const postUser = users.find((u) => u.userId === post.userId);
    if (postUser) {
      postUserPairs.push({ post, user: postUser });
    }
  }

  return postUserPairs;
}

function getPostsByUserId(
  db: IDBDatabase | typeof inMemoryDB,
  userId: number
): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onsuccess = () => {
      resolve(request.result as Post[]);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get user posts error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get user posts error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function populateDB(
  db: IDBDatabase | typeof inMemoryDB
): Promise<void> {
  const users: User[] = [];
  for (let i = 1; i <= 20; i++) {
    const userId = i;
    const email = `user${i}@example.com`;
    const firstName =
      firstNameOptions[Math.floor(Math.random() * firstNameOptions.length)];
    const lastName =
      lastNameOptions[Math.floor(Math.random() * lastNameOptions.length)];
    const password = btoa('123456');
    const dateJoined = getRandomDate(
      new Date(2022, 0, 1),
      new Date(2023, 0, 1)
    );
    const themePreference = 'light';
    const userName = `${firstName}-${lastName}`;

    const user: User = {
      userId,
      userName,
      email,
      password,
      dateJoined,
      themePreference,
      following: [],
      followers: [],
    };
    users.push(user);
    await addUser(db, user);
  }

  for (let user of users) {
    const followingCount = Math.floor(Math.random() * 11);
    const followedUsers = new Set<number>();

    while (followedUsers.size < followingCount) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      if (
        randomUser.userId !== user.userId &&
        !followedUsers.has(randomUser.userId)
      ) {
        followedUsers.add(randomUser.userId);
        user.following.push({
          userId: randomUser.userId,
          userName: randomUser.userName,
          email: randomUser.email,
        });
        randomUser.followers.push({
          userId: user.userId,
          userName: user.userName,
          email: user.email,
        });
      }
    }
  }

  for (let user of users) {
    await updateUser(db, user);
  }

  const posts: Post[] = [];
  for (let i = 0; i < 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.userId;
    const postString =
      postsOptions[Math.floor(Math.random() * postsOptions.length)];
    const tagged: Pick<User, 'userId' | 'userName' | 'email'>[] = [];
    const tagCount = Math.floor(Math.random() * 3);

    for (let j = 0; j < tagCount; j++) {
      const randomTaggedUser = users[Math.floor(Math.random() * users.length)];
      if (
        randomTaggedUser.userId !== userId &&
        !tagged.includes(randomTaggedUser)
      ) {
        tagged.push({
          userId: randomTaggedUser.userId,
          userName: randomTaggedUser.userName,
          email: randomTaggedUser.email,
        });
      }
    }

    const postDate = getRandomDate(new Date(2024, 0, 1), new Date(2024, 4, 1));

    const post: Post = {
      id: i + 1,
      userId,
      post: postString,
      postDate,
      retweets: [],
      likes: [],
      retweetFrom: null,
      comments: [],
      tagged,
    };

    const commentCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < commentCount; j++) {
      const randomCommentUser = users[Math.floor(Math.random() * users.length)];
      const commentString =
        commentsOptions[Math.floor(Math.random() * commentsOptions.length)];
      const commentDate = addRandomDays(postDate, 1, 2);

      const comment: Comment = {
        id: post.comments.length + 1,
        userId: randomCommentUser.userId,
        userName: randomCommentUser.userName,
        email: randomCommentUser.email,
        comment: commentString,
        commentDate,
      };

      post.comments.push(comment);
    }

    const likeCount = Math.floor(Math.random() * 21);
    for (let k = 0; k < likeCount; k++) {
      const randomLikeUser = users[Math.floor(Math.random() * users.length)];
      if (!post.likes.includes(randomLikeUser.userId)) {
        post.likes.push(randomLikeUser.userId);
      }
    }

    posts.push(post);
  }

  for (let post of posts) {
    if (Math.random() < 0.5 && post.retweetFrom === null) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      if (randomPost.id !== post.id && randomPost.retweetFrom === null) {
        post.retweetFrom = {
          postId: randomPost.id!,
          postDate: randomPost.postDate,
          post: randomPost.post ? randomPost.post : '',
          tagged: randomPost.tagged,
          userId: randomPost.userId,
          userName: users.find((u) => u.userId === randomPost.userId)!.userName,
          email: users.find((u) => u.userId === randomPost.userId)!.email,
        };
        randomPost.retweets.push(post.id!);
      }
    }
  }

  await addPosts(db, posts);
}

export async function addComment(
  db: IDBDatabase | typeof inMemoryDB,
  postId: number,
  comment: Comment
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.get(postId);

    request.onsuccess = () => {
      const post = request.result as Post;
      if (post) {
        post.comments.unshift(comment);
        const updateRequest = store.put(post);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = (event: any) => {
          console.error(
            'IndexedDB add comment error:',
            (event.target as IDBRequest).error
          );
          reject(
            `IndexedDB add comment error: ${(event.target as IDBRequest).error}`
          );
        };
      } else {
        reject('Post not found');
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get post by id error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get post by id error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function toggleLike(
  db: IDBDatabase | typeof inMemoryDB,
  postId: number,
  userId: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.get(postId);

    request.onsuccess = () => {
      const post = request.result as Post;
      if (post) {
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1);
        } else {
          post.likes.push(userId);
        }
        const updateRequest = store.put(post);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = (event: any) => {
          console.error(
            'IndexedDB toggle like error:',
            (event.target as IDBRequest).error
          );
          reject(
            `IndexedDB toggle like error: ${(event.target as IDBRequest).error}`
          );
        };
      } else {
        reject('Post not found');
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get post by id error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get post by id error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function toggleRetweet(
  db: IDBDatabase | typeof inMemoryDB,
  postId: number,
  userId: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.get(postId);

    request.onsuccess = () => {
      const post = request.result as Post;
      if (post) {
        const retweetIndex = post.retweets.indexOf(userId);
        if (retweetIndex > -1) {
          post.retweets.splice(retweetIndex, 1);
        } else {
          post.retweets.push(userId);
        }
        const updateRequest = store.put(post);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = (event: any) => {
          console.error(
            'IndexedDB toggle retweet error:',
            (event.target as IDBRequest).error
          );
          reject(
            `IndexedDB toggle retweet error: ${
              (event.target as IDBRequest).error
            }`
          );
        };
      } else {
        reject('Post not found');
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get post by id error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get post by id error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export function updateUser(
  db: IDBDatabase | typeof inMemoryDB,
  user: User
): Promise<void> {
  if (db === inMemoryDB) {
    const index = (db as typeof inMemoryDB)[STORE_NAMES.users].findIndex(
      (u: User) => u.userId === user.userId
    );
    if (index !== -1) {
      (db as typeof inMemoryDB)[STORE_NAMES.users][index] = user;
    }
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.put(user);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB update user error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB update user error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export function openDB(): Promise<IDBDatabase | typeof inMemoryDB> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(inMemoryDB);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAMES.users)) {
        const userStore = db.createObjectStore(STORE_NAMES.users, {
          keyPath: 'userId',
          autoIncrement: true,
        });
        userStore.createIndex('email', 'email', { unique: true });
      } else {
        const userStore = request.transaction!.objectStore(STORE_NAMES.users);
        if (!userStore.indexNames.contains('email')) {
          userStore.createIndex('email', 'email', { unique: true });
        }
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.posts)) {
        const postsStore = db.createObjectStore(STORE_NAMES.posts, {
          keyPath: 'id',
          autoIncrement: true,
        });
        postsStore.createIndex('userId', 'userId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error(
        'IndexedDB error:',
        (event.target as IDBOpenDBRequest).error
      );
      reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });
}

export function addUser(
  db: IDBDatabase | typeof inMemoryDB,
  user: User
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.users].push(user);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.add(user);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB add user error:',
        (event.target as IDBRequest).error
      );
      reject(`IndexedDB add user error: ${(event.target as IDBRequest).error}`);
    };
  });
}

export function addPosts(
  db: IDBDatabase | typeof inMemoryDB,
  posts: Post[]
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.posts].push(...posts);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.posts);

    posts.forEach((post) => {
      const request = store.add(post);
      request.onerror = (event: any) => {
        console.error(
          'IndexedDB add post error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB add post error: ${(event.target as IDBRequest).error}`
        );
      };
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event: any) => {
      console.error(
        'IndexedDB transaction error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB transaction error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export function getUsersFiltered(
  db: IDBDatabase | typeof inMemoryDB,
  filter: string
): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.getAll();

    request.onsuccess = () => {
      const allUsers = request.result as User[];
      const filteredUsers = allUsers.filter((user) =>
        user.userName.toLowerCase().includes(filter.toLowerCase())
      );
      resolve(filteredUsers);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get users filtered error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get users filtered error: ${
          (event.target as IDBRequest).error
        }`
      );
    };
  });
}

export function getUsers(db: IDBDatabase | typeof inMemoryDB): Promise<User[]> {
  if (db === inMemoryDB) {
    return Promise.resolve((db as typeof inMemoryDB)[STORE_NAMES.users]);
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result as User[]);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get users error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get users error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export function updateUserThemePreference(
  db: IDBDatabase | typeof inMemoryDB,
  email: string,
  themePreference: ThemePreference
): Promise<void> {
  console.log(
    'Starting updateUserThemePreference with themePreference:',
    themePreference
  );

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.users);
    const index = store.index('email');
    const request = index.get(email);

    request.onsuccess = () => {
      const user = request.result as User;
      if (user) {
        console.log('User before update:', user);
        user.themePreference = themePreference;
        const updateRequest = store.put(user);

        updateRequest.onsuccess = () => {
          console.log('User after update:', user);
          resolve();
        };

        updateRequest.onerror = (event: any) => {
          console.error(
            'IndexedDB update user theme preference error:',
            (event.target as IDBRequest).error
          );
          reject(
            `IndexedDB update user theme preference error: ${
              (event.target as IDBRequest).error
            }`
          );
        };
      } else {
        console.log('User not found with email:', email);
        reject('User not found');
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get user by email error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB get user by email error: ${
          (event.target as IDBRequest).error
        }`
      );
    };
  });
}

export async function createUser(
  db: IDBDatabase | typeof inMemoryDB,
  userName: string,
  email: string,
  password: string
): Promise<User> {
  const encodedPassword = btoa(password);
  const dateJoined = new Date();
  const themePreference = 'system';
  const userId = (await getUsers(db)).length + 1;
  const newUser: User = {
    userId,
    userName,
    email,
    password: encodedPassword,
    dateJoined,
    themePreference,
    following: [],
    followers: [],
  };

  await addUser(db, newUser);

  const allUsers = await getUsers(db);

  const followingCount = Math.floor(Math.random() * 11);
  const followingSet = new Set<number>();

  while (followingSet.size < followingCount) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    if (
      randomUser.userId !== newUser.userId &&
      !followingSet.has(randomUser.userId)
    ) {
      followingSet.add(randomUser.userId);
      newUser.following.push({
        userId: randomUser.userId,
        userName: randomUser.userName,
        email: randomUser.email,
      });
      randomUser.followers.push({
        userId: newUser.userId,
        userName: newUser.userName,
        email: newUser.email,
      });
      await updateUser(db, randomUser);
    }
  }

  const followerCount = Math.floor(Math.random() * 11) + 10;
  const followersSet = new Set<number>();

  while (followersSet.size < followerCount) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    if (
      randomUser.userId !== newUser.userId &&
      !followersSet.has(randomUser.userId)
    ) {
      followersSet.add(randomUser.userId);
      newUser.followers.push({
        userId: randomUser.userId,
        userName: randomUser.userName,
        email: randomUser.email,
      });
      randomUser.following.push({
        userId: newUser.userId,
        userName: newUser.userName,
        email: newUser.email,
      });
      await updateUser(db, randomUser);
    }
  }

  await updateUser(db, newUser);
  return newUser;
}
function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function addRandomDays(date: Date, minDays: number, maxDays: number): Date {
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
