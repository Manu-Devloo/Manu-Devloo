import { SECTIONS } from "../../netlify/functions/utils/constants";

const DB_NAME = 'PortfolioDB';
const STORE_NAME = 'cache';
const DB_VERSION = 1;
const EXPIRY_DAYS = 5;

export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedData(key) {
  if (key == 'all') {
    let data = {};
    let isData = false;

    for (const section of SECTIONS) {
      const cache = await getCachedData(section);
      if (cache) {
        data[section] = cache;
        isData = true
      }
    }

    if (isData) {
      return data;
    }

    return null;
  }


  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const now = Date.now();
        const ageInDays = (now - result.timestamp) / (1000 * 60 * 60 * 24);
        if (ageInDays < EXPIRY_DAYS) {
          resolve(result.data); // valid cache
        } else {
          resolve(null); // expired
        }
      } else {
        resolve(null); // no cache
      }
    };

    request.onerror = () => reject(request.error);
  });
}

export async function setCachedData(key, data) {

  if (key == 'all') {
    for (const section of SECTIONS) {
      setCachedData(section, data[section]);
    }
    return;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, data, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}