import { useCallback, useMemo } from 'react';

import { IDB_KEY } from '../useIndexedDB/constants';
import { ensureDailyStore, getActions, getConnection } from './db';
import { IndexedDBConfig } from './interfaces';

async function setupIndexedDB(config: IndexedDBConfig) {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await getConnection(config);
			//@ts-ignore
			window[IDB_KEY] = { init: 1, config };
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}

export function useIndexedDBStore<T>(storeName: string) {
	const _actions = useMemo(() => getActions<T>(storeName), [storeName]);
	return _actions;
}

export function useEnsureDailyStore() {
	return {
		ensure: useCallback(async (p: { databaseName: string; version: number; todayStore: string; prefix: string }) => {
			return await ensureDailyStore(p);
		}, []),
	};
}

export default setupIndexedDB;
