const DB_NAME = 'strider-db';
const DB_VERSION = 1;
const STORE_NAME = 'users';

const inMemoryDB: { [key: string]: any } = {
  [STORE_NAME]: [],
};

export function openDB(): Promise<any> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(inMemoryDB);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'email' });
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
    db[STORE_NAME].push(user);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
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

export function getUsers(db: any): Promise<any[]> {
  if (db === inMemoryDB) {
    return Promise.resolve(db[STORE_NAME]);
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
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
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
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
