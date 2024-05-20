const DB_NAME = 'posterr-db';
const DB_VERSION = 1;
import {
  Following,
  Post,
  User,
  Retweet,
  Like,
  Comment,
} from '@/utils/interfaces';

const STORE_NAMES = {
  users: 'users',
  following: 'following',
  posts: 'posts',
  retweets: 'retweets',
  likes: 'likes',
  comments: 'comments',
};

import {
  postsOptions,
  firstNameOptions,
  lastNameOptions,
  commentsOptions,
} from '@/data/index';

const inMemoryDB: { [key: string]: any } = {
  [STORE_NAMES.users]: [] as User[],
  [STORE_NAMES.following]: [] as Following[],
  [STORE_NAMES.posts]: [] as Post[],
  [STORE_NAMES.retweets]: [] as Retweet[],
  [STORE_NAMES.likes]: [] as Like[],
  [STORE_NAMES.comments]: [] as Comment[],
};

export async function getAllPosts(
  db: IDBDatabase | typeof inMemoryDB,
  offset: number,
  limit: number
): Promise<{ post: Post; user: User }[]> {
  const posts: Post[] = await new Promise<Post[]>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const request = store.openCursor(null, 'prev'); // Open cursor in reverse order for descending sort

    const result: Post[] = [];
    let count = 0;

    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        if (count >= offset && result.length < limit) {
          result.push(cursor.value as Post);
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
    post.retweets = await countRetweets(db, post.id!);
    post.likes = await countLikes(db, post.id!);
    const user = await getUserByEmail(db, post.email);
    postUserPairs.push({ post, user });
  }

  return postUserPairs;
}

function getUserByEmail(
  db: IDBDatabase | typeof inMemoryDB,
  email: string
): Promise<User> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.get(email);

    request.onsuccess = () => {
      resolve(request.result as User);
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

function countRetweets(
  db: IDBDatabase | typeof inMemoryDB,
  postId: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.retweets], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.retweets);
    const index = store.index('postId');
    const request = index.getAll(postId);

    request.onsuccess = () => {
      resolve((request.result as Retweet[]).length);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB count retweets error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB count retweets error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

function countLikes(
  db: IDBDatabase | typeof inMemoryDB,
  postId: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.likes], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.likes);
    const index = store.index('postId');
    const request = index.getAll(postId);

    request.onsuccess = () => {
      resolve((request.result as Like[]).length);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB count likes error:',
        (event.target as IDBRequest).error
      );
      reject(
        `IndexedDB count likes error: ${(event.target as IDBRequest).error}`
      );
    };
  });
}

export async function getPostsFromFollowedUsers(
  db: IDBDatabase | typeof inMemoryDB,
  email: string,
  offset: number,
  limit: number
): Promise<{ post: Post; user: User }[]> {
  const followings = await new Promise<Following[]>((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAMES.following], 'readonly');
      const store = transaction.objectStore(STORE_NAMES.following);
      const index = store.index('following');
      const request = index.getAll(email);

      request.onsuccess = () => {
        resolve(request.result as Following[]);
      };

      request.onerror = (event: any) => {
        console.error(
          'IndexedDB get followings error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB get followings error: ${
            (event.target as IDBRequest).error
          }`
        );
      };
    } catch (error) {
      console.error('Error during getPostsFromFollowedUsers:', error);
      reject(error);
    }
  });

  const followedEmails = followings.map((following) => following.followed);
  const allPosts: Post[] = [];

  for (const followedEmail of followedEmails) {
    const userPosts = await getPostsByUser(db, followedEmail);
    allPosts.push(...userPosts);
  }

  // Sort by postDate in descending order
  allPosts.sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  );

  // Paginate the results
  const paginatedPosts = allPosts.slice(offset, offset + limit);

  const postUserPairs: { post: Post; user: User }[] = [];

  for (const post of paginatedPosts) {
    post.retweets = await countRetweets(db, post.id!);
    post.likes = await countLikes(db, post.id!);
    const user = await getUserByEmail(db, post.email);
    postUserPairs.push({ post, user });
  }

  return postUserPairs;
}

function getPostsByUser(
  db: IDBDatabase | typeof inMemoryDB,
  email: string
): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.posts], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.posts);
    const index = store.index('email');
    const request = index.getAll(email);

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
  for (let i = 1; i <= 500; i++) {
    const email = `user${i}@example.com`;
    const firstName =
      firstNameOptions[Math.floor(Math.random() * firstNameOptions.length)];
    const lastName =
      lastNameOptions[Math.floor(Math.random() * lastNameOptions.length)];
    const password = btoa('123456');
    const themePreference = 'light';

    const user: User = {
      email,
      firstName,
      lastName,
      password,
      themePreference,
    };
    users.push(user);
    await addUser(db, user);
  }

  const followings: Following[] = [];
  let followingId = 1;
  for (let user of users) {
    const userEmail = user.email;
    const followingCount = Math.floor(Math.random() * 16) + 5;
    const followedUsers = new Set<string>();

    while (followedUsers.size < followingCount) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      if (
        randomUser.email !== userEmail &&
        !followedUsers.has(randomUser.email)
      ) {
        followedUsers.add(randomUser.email);
        followings.push({
          id: followingId++,
          following: userEmail,
          followed: randomUser.email,
        });
      }
    }
  }

  await addFollowings(db, followings);

  const posts: Post[] = [];
  let postId = 1;
  for (let user of users) {
    const userEmail = user.email;
    const postCount = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < postCount; i++) {
      const postString =
        postsOptions[Math.floor(Math.random() * postsOptions.length)];
      const tagged: string[] = [];
      const tagCount = Math.floor(Math.random() * 3);

      for (let j = 0; j < tagCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (
          !tagged.includes(randomUser.email) &&
          randomUser.email !== userEmail
        ) {
          tagged.push(randomUser.email);
        }
      }

      const postDate = getRandomDate(
        new Date(2024, 0, 1),
        new Date(2024, 4, 1)
      );

      const post: Post = {
        id: postId++,
        email: userEmail,
        post: postString,
        tagged,
        postDate,
      };
      posts.push(post);
    }
  }

  await addPosts(db, posts);

  const retweets: Retweet[] = [];
  for (let i = 0; i < 200; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const retweetedDate = addRandomDays(randomPost.postDate, 1, 2);

    retweets.push({
      userId: randomUser.email,
      postId: randomPost.id!,
      retweetedDate,
    });
  }

  await addRetweets(db, retweets);

  const likes: Like[] = [];
  for (let user of users) {
    const likedPosts = new Set<number>();
    while (likedPosts.size < 20) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      if (!likedPosts.has(randomPost.id!)) {
        likedPosts.add(randomPost.id!);
        const likeDate = addRandomDays(randomPost.postDate, 1, 2);
        likes.push({
          userId: user.email,
          postId: randomPost.id!,
          likeDate,
        });
      }
    }
  }

  await addLikes(db, likes);

  const comments: Comment[] = [];
  for (let post of posts) {
    const commentCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < commentCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const comment =
        commentsOptions[Math.floor(Math.random() * commentsOptions.length)];
      const commentDate = addRandomDays(post.postDate, 1, 2);

      comments.push({
        userId: randomUser.email,
        postId: post.id!,
        comment,
        commentDate,
      });
    }
  }

  await addComments(db, comments);
}

export function openDB(): Promise<IDBDatabase | typeof inMemoryDB> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(inMemoryDB);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;

      if (!db.objectStoreNames.contains(STORE_NAMES.users)) {
        db.createObjectStore(STORE_NAMES.users, { keyPath: 'email' });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.following)) {
        const followingStore = db.createObjectStore(STORE_NAMES.following, {
          keyPath: 'id',
          autoIncrement: true,
        });
        followingStore.createIndex('following', 'following', { unique: false });
        followingStore.createIndex('followed', 'followed', { unique: false });
      } else if (transaction) {
        const followingStore = transaction.objectStore(STORE_NAMES.following);
        if (!followingStore.indexNames.contains('following')) {
          followingStore.createIndex('following', 'following', {
            unique: false,
          });
        }
        if (!followingStore.indexNames.contains('followed')) {
          followingStore.createIndex('followed', 'followed', {
            unique: false,
          });
        }
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.posts)) {
        const postsStore = db.createObjectStore(STORE_NAMES.posts, {
          keyPath: 'id',
          autoIncrement: true,
        });
        postsStore.createIndex('email', 'email', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.retweets)) {
        const retweetsStore = db.createObjectStore(STORE_NAMES.retweets, {
          keyPath: 'id',
          autoIncrement: true,
        });
        retweetsStore.createIndex('postId', 'postId', { unique: false });
        retweetsStore.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.likes)) {
        const likesStore = db.createObjectStore(STORE_NAMES.likes, {
          keyPath: 'id',
          autoIncrement: true,
        });
        likesStore.createIndex('postId', 'postId', { unique: false });
        likesStore.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.comments)) {
        db.createObjectStore(STORE_NAMES.comments, {
          keyPath: 'id',
          autoIncrement: true,
        });
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

export function addRetweets(
  db: IDBDatabase | typeof inMemoryDB,
  retweets: Retweet[]
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.retweets].push(...retweets);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.retweets], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.retweets);

    retweets.forEach((retweet) => {
      const request = store.add(retweet);
      request.onerror = (event: any) => {
        console.error(
          'IndexedDB add retweet error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB add retweet error: ${(event.target as IDBRequest).error}`
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

export function addLikes(
  db: IDBDatabase | typeof inMemoryDB,
  likes: Like[]
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.likes].push(...likes);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.likes], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.likes);

    likes.forEach((like) => {
      const request = store.add(like);
      request.onerror = (event: any) => {
        console.error(
          'IndexedDB add like error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB add like error: ${(event.target as IDBRequest).error}`
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

export function addComments(
  db: IDBDatabase | typeof inMemoryDB,
  comments: Comment[]
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.comments].push(...comments);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.comments], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.comments);

    comments.forEach((comment) => {
      const request = store.add(comment);
      request.onerror = (event: any) => {
        console.error(
          'IndexedDB add comment error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB add comment error: ${(event.target as IDBRequest).error}`
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
  themePreference: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.get(email);

    request.onsuccess = () => {
      const user = request.result as User;
      if (user) {
        user.themePreference = themePreference;
        const updateRequest = store.put(user);

        updateRequest.onsuccess = () => {
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
        reject('User not found');
      }
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get user error:',
        (event.target as IDBRequest).error
      );
      reject(`IndexedDB get user error: ${(event.target as IDBRequest).error}`);
    };
  });
}

export async function createUser(
  db: IDBDatabase | typeof inMemoryDB,
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> {
  const encodedPassword = btoa(password);
  const themePreference = 'system';
  const user: User = {
    email,
    firstName,
    lastName,
    password: encodedPassword,
    themePreference,
  };

  await addUser(db, user);
}

export async function createRandomFollowingsAndFollowers(
  db: IDBDatabase | typeof inMemoryDB,
  email: string
): Promise<void> {
  const transaction = db.transaction([STORE_NAMES.users], 'readonly');
  const store = transaction.objectStore(STORE_NAMES.users);
  const request = store.get(email);

  request.onsuccess = async () => {
    const newUser = request.result as User;

    if (newUser) {
      const followings: Following[] = [];
      const followers: Following[] = [];

      const followingCount = Math.floor(Math.random() * 6) + 15;

      const followedUsers = new Set<string>();

      while (followedUsers.size < followingCount) {
        const randomUser = await getRandomUser(db, email);

        if (
          randomUser &&
          randomUser.email !== email &&
          !followedUsers.has(randomUser.email)
        ) {
          followedUsers.add(randomUser.email);
          const following = {
            following: email,
            followed: randomUser.email,
          };
          followings.push(following);
          if (followings.length === 1) {
          }
        }
      }

      const followerCount = Math.floor(Math.random() * 10) + 90;

      const followerUsers = new Set<string>();

      while (followerUsers.size < followerCount) {
        const randomUser = await getRandomUser(db, email);

        if (
          randomUser &&
          randomUser.email !== email &&
          !followerUsers.has(randomUser.email)
        ) {
          followerUsers.add(randomUser.email);
          const follower = {
            following: randomUser.email,
            followed: email,
          };
          followers.push(follower);
          if (followers.length === 1) {
          }
        }
      }

      await addFollowings(db, [...followings, ...followers]);
    } else {
    }
  };

  request.onerror = (event: any) => {
    console.error(
      'IndexedDB get user error:',
      (event.target as IDBRequest).error
    );
  };
}

export function addFollowings(
  db: IDBDatabase | typeof inMemoryDB,
  followings: Following[]
): Promise<void> {
  if (db === inMemoryDB) {
    (db as typeof inMemoryDB)[STORE_NAMES.following].push(...followings);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.following], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.following);

    followings.forEach((following) => {
      const request = store.add(following);
      request.onerror = (event: any) => {
        console.error(
          'IndexedDB add following error:',
          (event.target as IDBRequest).error
        );
        reject(
          `IndexedDB add following error: ${(event.target as IDBRequest).error}`
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

async function getRandomUser(
  db: IDBDatabase | typeof inMemoryDB,
  excludeEmail: string
): Promise<User> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.getAll();

    request.onsuccess = () => {
      const users = request.result as User[];
      const filteredUsers = users.filter((user) => user.email !== excludeEmail);
      const randomUser =
        filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
      resolve(randomUser);
    };

    request.onerror = (event: any) => {
      console.error(
        'IndexedDB get users error:',
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
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
