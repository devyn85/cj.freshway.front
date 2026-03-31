import { IDB_KEY } from './constants';
import { IndexedDBConfig } from './interfaces';
import { waitUntil } from './utils';

function validateStore(db: IDBDatabase, storeName: string) {
	return db.objectStoreNames.contains(storeName);
}

export function validateBeforeTransaction(db: any, storeName: string, reject: Function) {
	if (!db) {
		reject('Queried before opening connection');
	}
	if (!validateStore(db, storeName)) {
		reject(`Store ${storeName} not found`);
	}
}

export function createTransaction(
	db: IDBDatabase,
	dbMode: IDBTransactionMode,
	currentStore: string,
	resolve: any,
	reject?: any,
	abort?: any,
): IDBTransaction {
	let tx: IDBTransaction = db.transaction(currentStore, dbMode);
	tx.onerror = reject;
	tx.oncomplete = resolve;
	tx.onabort = abort;
	return tx;
}

export async function getConnection(config?: IndexedDBConfig): Promise<IDBDatabase> {
	const idbInstance = typeof window !== 'undefined' ? window.indexedDB : null;
	let _config = config;

	if (!config && idbInstance) {
		try {
			//@ts-ignore
			await waitUntil(() => window?.[IDB_KEY]?.['init'] === 1);
			//@ts-ignore
			_config = window[IDB_KEY]?.['config'];
		} catch (error) {
			throw new Error('IndexedDB initialization failed');
		}
	}

	if (!_config) {
		throw new Error('IndexedDB configuration is missing');
	}

	return new Promise<IDBDatabase>((resolve, reject) => {
		if (idbInstance) {
			//@ts-ignore
			const request: IDBOpenDBRequest = idbInstance.open(_config.databaseName, _config.version);

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = (e: any) => {
				reject(e.target.error.name);
			};

			request.onupgradeneeded = (e: any) => {
				const db = e.target.result;
				//@ts-ignore
				config.stores.forEach(s => {
					if (!db.objectStoreNames.contains(s.name)) {
						const store = db.createObjectStore(s.name, s.id);
						s.indices.forEach(c => {
							store.createIndex(c.name, c.keyPath, c.options);
						});
					}
				});
				db.close();
				//@ts-ignore
				resolve(undefined);
			};
		} else {
			reject('Failed to connect');
		}
	});
}

//@ts-ignore
export function getActions<T>(currentStore) {
	return {
		getByID(id: string | number) {
			return new Promise<T>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.get(id);
						request.onsuccess = (e: any) => {
							resolve(e.target.result as T);
						};
					})
					.catch(reject);
			});
		},
		getOneByKey(keyPath: string, value: string | number) {
			return new Promise<T | undefined>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let index = objectStore.index(keyPath);
						let request = index.get(value);
						request.onsuccess = (e: any) => {
							resolve(e.target.result);
						};
					})
					.catch(reject);
			});
		},
		getManyByKey(keyPath: string, value: string | number) {
			return new Promise<T[]>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let index = objectStore.index(keyPath);
						let request = index.getAll(value);
						request.onsuccess = (e: any) => {
							resolve(e.target.result);
						};
					})
					.catch(reject);
			});
		},
		getAll() {
			return new Promise<T[]>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.getAll();
						request.onsuccess = (e: any) => {
							resolve(e.target.result as T[]);
						};
					})
					.catch(reject);
			});
		},

		add(value: T, key?: any) {
			return new Promise<number>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.add(value, key);
						request.onsuccess = (e: any) => {
							(tx as any)?.commit?.();
							resolve(e.target.result);
						};
					})
					.catch(reject);
			});
		},

		update(value: T, key?: any) {
			return new Promise<any>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.put(value, key);
						request.onsuccess = (e: any) => {
							(tx as any)?.commit?.();
							resolve(e.target.result);
						};
					})
					.catch(reject);
			});
		},

		deleteByID(id: any) {
			return new Promise<any>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.delete(id);
						request.onsuccess = (e: any) => {
							(tx as any)?.commit?.();
							resolve(e);
						};
					})
					.catch(reject);
			});
		},
		deleteAll() {
			return new Promise<any>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.clear();
						request.onsuccess = (e: any) => {
							(tx as any)?.commit?.();
							resolve(e);
						};
					})
					.catch(reject);
			});
		},

		//@ts-ignore
		openCursor(cursorCallback, keyRange?: IDBKeyRange) {
			return new Promise<IDBCursorWithValue | void>((resolve, reject) => {
				getConnection()
					.then(db => {
						validateBeforeTransaction(db, currentStore, reject);
						let tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
						let objectStore = tx.objectStore(currentStore);
						let request = objectStore.openCursor(keyRange);
						request.onsuccess = e => {
							cursorCallback(e);
							resolve();
						};
					})
					.catch(reject);
			});
		},
	};
}

// 오늘 날짜 로된 스토어가 존재하는지 확인하고, 없으면 생성하고, 있으면 버전을 올린다.
export async function ensureDailyStore(opts: {
	databaseName: string;
	version: number;
	todayStore: string;
	prefix: string; // 예: 'HJDONG_POLYGON_'
}): Promise<number> {
	const { databaseName, version, todayStore, prefix } = opts;

	// 1) 현재 버전/스토어 목록 조회
	let currVersion = version;
	let storeNames: string[] = [];

	await new Promise<void>(resolve => {
		try {
			const req = indexedDB.open(databaseName);
			req.onsuccess = () => {
				try {
					const db = req.result;
					currVersion = db.version;
					storeNames = Array.from(db.objectStoreNames as any);
					db.close();
				} catch {}
				resolve();
			};
			req.onerror = () => resolve();
			req.onblocked = () => resolve();
		} catch {
			resolve();
		}
	});

	// 2) 오늘자만 남기고 접두사(prefix) 기반으로 과거 스토어 삭제 대상 수집
	const toDelete = storeNames.filter(n => n.startsWith(prefix) && n !== todayStore);
	const needCreate = !storeNames.includes(todayStore);

	// 3) 삭제/생성 필요 시 버전 + 1 업그레이드에서 처리
	let finalVersion = currVersion;
	if (toDelete.length || needCreate) {
		finalVersion = currVersion + 1;

		await new Promise<void>(resolve => {
			try {
				const req = indexedDB.open(databaseName, finalVersion);
				req.onupgradeneeded = () => {
					const db = req.result;
					// 삭제
					for (const name of toDelete) {
						try {
							if (db.objectStoreNames.contains(name)) {
								db.deleteObjectStore(name);
							}
						} catch (e) {}
					}
					// 오늘자 생성
					try {
						if (!db.objectStoreNames.contains(todayStore)) {
							db.createObjectStore(todayStore, { keyPath: 'id' });
						}
					} catch (e) {}
				};
				req.onsuccess = () => {
					try {
						req.result.close();
					} catch {}
					resolve();
				};
				req.onerror = () => {
					resolve();
				};
				req.onblocked = () => {
					console.warn('[IDB] open upgrade blocked');
				};
			} catch {
				resolve();
			}
		});
	}

	return finalVersion;
}
