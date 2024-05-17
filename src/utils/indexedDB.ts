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
  console.log('Attempting to add user:', user);
  if (db === inMemoryDB) {
    // Use in-memory store
    console.log('Adding user to in-memory DB');
    db[STORE_NAME].push(user);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(user);

    request.onsuccess = () => {
      console.log('User added to IndexedDB');
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
  console.log('Fetching users from db:', db);
  if (db === inMemoryDB) {
    // Use in-memory store
    console.log('Getting users from in-memory DB');
    return Promise.resolve(db[STORE_NAME]);
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('Users fetched from IndexedDB');
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
