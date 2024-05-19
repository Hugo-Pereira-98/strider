const DB_NAME = 'posterr-db';
const DB_VERSION = 1;
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
  [STORE_NAMES.users]: [],
  [STORE_NAMES.following]: [],
  [STORE_NAMES.posts]: [],
  [STORE_NAMES.retweets]: [],
  [STORE_NAMES.likes]: [],
  [STORE_NAMES.comments]: [],
};

export async function populateDB(db: any): Promise<void> {
  const users = [];
  for (let i = 1; i <= 500; i++) {
    const email = `user${i}@example.com`;
    const firstName =
      firstNameOptions[Math.floor(Math.random() * firstNameOptions.length)];
    const lastName =
      lastNameOptions[Math.floor(Math.random() * lastNameOptions.length)];
    const password = btoa('123456');
    const themePreference = 'light';

    const user = {
      email,
      firstName,
      lastName,
      password,
      themePreference,
    };
    users.push(user);
    await addUser(db, user);
  }

  const followings = [];
  let followingId = 1;
  for (let user of users) {
    const userEmail = user.email;
    const followingCount = Math.floor(Math.random() * 16) + 5;
    const followedUsers = new Set();

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

  const posts = [];
  let postId = 1;
  for (let user of users) {
    const userEmail = user.email;
    const postCount = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < postCount; i++) {
      const postString =
        postsOptions[Math.floor(Math.random() * postsOptions.length)];
      const tagged = [] as any;
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

      const post = {
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

  const retweets = [];
  for (let i = 0; i < 200; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const retweetedDate = addRandomDays(randomPost.postDate, 1, 2);

    retweets.push({
      userId: randomUser.email,
      postId: randomPost.id,
      retweetedDate,
    });
  }

  await addRetweets(db, retweets);

  const likes = [];
  for (let user of users) {
    const likedPosts = new Set();
    while (likedPosts.size < 20) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      if (!likedPosts.has(randomPost.id)) {
        likedPosts.add(randomPost.id);
        const likeDate = addRandomDays(randomPost.postDate, 1, 2);
        likes.push({
          userId: user.email,
          postId: randomPost.id,
          likeDate,
        });
      }
    }
  }

  await addLikes(db, likes);

  const comments = [];
  for (let post of posts) {
    const commentCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < commentCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const comment =
        commentsOptions[Math.floor(Math.random() * commentsOptions.length)];
      const commentDate = addRandomDays(post.postDate, 1, 2);

      comments.push({
        userId: randomUser.email,
        postId: post.id,
        comment,
        commentDate,
      });
    }
  }

  await addComments(db, comments);
}

export function openDB(): Promise<any> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(inMemoryDB);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAMES.users)) {
        db.createObjectStore(STORE_NAMES.users, { keyPath: 'email' });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.following)) {
        db.createObjectStore(STORE_NAMES.following, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.posts)) {
        db.createObjectStore(STORE_NAMES.posts, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.retweets)) {
        db.createObjectStore(STORE_NAMES.retweets, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.likes)) {
        db.createObjectStore(STORE_NAMES.likes, {
          keyPath: 'id',
          autoIncrement: true,
        });
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

export function addUser(db: any, user: any): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.users].push(user);
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

export function addFollowings(db: any, followings: any[]): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.following].push(...followings);
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

export function addPosts(db: any, posts: any[]): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.posts].push(...posts);
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

export function addRetweets(db: any, retweets: any[]): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.retweets].push(...retweets);
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

export function addLikes(db: any, likes: any[]): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.likes].push(...likes);
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

export function addComments(db: any, comments: any[]): Promise<void> {
  if (db === inMemoryDB) {
    db[STORE_NAMES.comments].push(...comments);
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

export function getUsers(db: any): Promise<any[]> {
  if (db === inMemoryDB) {
    return Promise.resolve(db[STORE_NAMES.users]);
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
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
  db: any,
  email: string,
  themePreference: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.get(email);

    request.onsuccess = () => {
      const user = request.result;
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
  db: any,
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> {
  const encodedPassword = btoa(password);
  const themePreference = 'system';
  const user = {
    email,
    firstName,
    lastName,
    password: encodedPassword,
    themePreference,
  };

  await addUser(db, user);

  const transaction = db.transaction([STORE_NAMES.users], 'readonly');
  const store = transaction.objectStore(STORE_NAMES.users);
  const request = store.get(email);

  request.onsuccess = async () => {
    const newUser = request.result;

    if (newUser) {
      const followings = [];
      const followers = [];
      let followingId = 1;

      const followingCount = Math.floor(Math.random() * 6) + 15;
      const followedUsers = new Set();

      while (followedUsers.size < followingCount) {
        const randomUser = await getRandomUser(db, email);
        if (
          randomUser &&
          randomUser.email !== email &&
          !followedUsers.has(randomUser.email)
        ) {
          followedUsers.add(randomUser.email);
          followings.push({
            id: followingId++,
            following: email,
            followed: randomUser.email,
          });
        }
      }

      const followerCount = Math.floor(Math.random() * 10) + 90;
      const followerUsers = new Set();

      while (followerUsers.size < followerCount) {
        const randomUser = await getRandomUser(db, email);
        if (
          randomUser &&
          randomUser.email !== email &&
          !followerUsers.has(randomUser.email)
        ) {
          followerUsers.add(randomUser.email);
          followers.push({
            id: followingId++,
            following: randomUser.email,
            followed: email,
          });
        }
      }

      await addFollowings(db, [...followings, ...followers]);
    }
  };

  request.onerror = (event: any) => {
    console.error(
      'IndexedDB get user error:',
      (event.target as IDBRequest).error
    );
  };
}

async function getRandomUser(db: any, excludeEmail: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.users], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.users);
    const request = store.getAll();

    request.onsuccess = () => {
      const users = request.result;
      const filteredUsers = users.filter(
        (user: any) => user.email !== excludeEmail
      );
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
