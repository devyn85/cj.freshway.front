import { apiGetDistrictPolygonMasterList, apiGetMasterListOfFile } from '@/api/ms/apiMsCenterDistrict';
import setupIndexedDB, { useEnsureDailyStore, useIndexedDBStore } from '@/hooks/useIndexedDB';
import { storeNamePrefix } from '@/hooks/useIndexedDB/constants';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
import { useProgressStore } from '@/store/progressStore';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect } from 'react';
import { toFeatureCollection } from '../utils/dataConverter';

dayjs.extend(utc);
dayjs.extend(timezone);

type TDistrictKey = 'sido' | 'sgg' | 'dem';
type TFileDistrictType = 'CTP' | 'SIG' | 'HJDONG';
export interface IPolygonData {
	type: 'FeatureCollection';
	features: any[];
}
export interface IListenerSource {
	dem: IPolygonData;
	sgg: IPolygonData;
	sido: IPolygonData;
}

interface DistrictCache {
	id: TDistrictKey;
	data: IListenerSource[TDistrictKey];
	updatedAt: string;
}

const KST_TZ = 'Asia/Seoul';
const REFRESH_HOUR = 12;

/**
 * KST 기준으로 "업데이트 기준일자"를 반환
 * - 22:00 이전: 전날(YYYYMMDD)
 * - 22:00 이후: 당일(YYYYMMDD)
 */
function getBoundaryYmdKst() {
	const now = dayjs().tz(KST_TZ);
	const effective = now.hour() < REFRESH_HOUR ? now.subtract(1, 'day') : now;
	return effective.format('YYYYMMDD');
}

// 파일에서 내려오는 행정동 JSON 문자열을 배열로 변환
/**
 *
 * @param raw
 */
function parseHjdongObjects(raw: string): any[] {
	const result: any[] = [];

	// "{"hjdongCd" 기준으로 split
	const parts = raw.split(/(?=\{"hjdongCd")/g);

	for (const part of parts) {
		const trimmed = part.trim();

		// JSON 형태가 아니면 skip
		if (!trimmed.startsWith('{"hjdongCd"')) continue;

		try {
			// 끝에 "}"가 여러 개 있을 수 있어 안전하게 trim
			const jsonStr = trimmed.replace(/\}\s*$/, '}');

			const parsed = JSON.parse(jsonStr);
			result.push(parsed);
		} catch (err) {
			console.warn('JSON parse error:', err, trimmed);
		}
	}

	return result;
}

// CTP 앞2자리 목록 캐시(런타임 1회 계산)
let __ctpPrefixCache: string[] | null = null;

/**
 *
 * @param ctpItems
 * @param items
 */
function extractCtpPrefixesFromItems(items: any[]): string[] {
	const set = new Set<string>();
	for (const it of items ?? []) {
		const cd = String(it?.hjdongCd ?? '');
		if (cd.length < 2) continue;
		const prefix = cd.slice(0, 2);
		if (!/^\d{2}$/.test(prefix)) continue;
		set.add(prefix);
	}
	return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 *
 */
async function ensureCtpPrefixes(): Promise<string[]> {
	if (__ctpPrefixCache?.length) return __ctpPrefixCache;

	const raw = await apiGetMasterListOfFile({ districtType: 'CTP' });
	const text = typeof raw === 'string' ? raw : String(raw ?? '');
	const items = parseHjdongObjects(text);

	__ctpPrefixCache = extractCtpPrefixesFromItems(items);
	return __ctpPrefixCache;
}

// 파일 기반으로 전체 geojson 로딩 + 진행률 콜백
/**
 *
 * @param districtType
 * @param onProgress
 */
async function fetchGeojsonFromFileWithProgress(
	districtType: TFileDistrictType,
	onProgress?: (absCount: number, ctx: { districtType: TFileDistrictType }) => void,
) {
	try {
		// CTP, SIG는 기존 방식(1회 요청)
		if (districtType === 'CTP' || districtType === 'SIG') {
			const raw = await apiGetMasterListOfFile({ districtType });
			const text = typeof raw === 'string' ? raw : String(raw ?? '');
			const items = parseHjdongObjects(text);

			// CTP면 prefix 캐시도 함께 채움(선택)
			if (districtType === 'CTP') {
				__ctpPrefixCache = extractCtpPrefixesFromItems(items);
			}

			if (onProgress) {
				let done = 0;
				for (const _ of items) {
					done += 1;
					if (done % 100 === 0 || done === items.length) onProgress(done, { districtType });
				}
			}

			return { data: items };
		}

		// HJDONG만 분할 요청 적용
		const prefixes = await ensureCtpPrefixes();
		const concurrency = 4;
		let done = 0;
		const merged: any[] = [];

		// worker 인덱스 기반으로 4개 워커가 prefixes를 나눠 처리
		let cursor = 0;

		const worker = async () => {
			while (cursor < prefixes.length) {
				const i = cursor++;
				const searchCtp = prefixes[i];

				const raw = await apiGetMasterListOfFile({ districtType: 'HJDONG', searchCtp });
				const text = typeof raw === 'string' ? raw : String(raw ?? '');
				const items = parseHjdongObjects(text);

				// 결과 합치기
				merged.push(...items);

				// chunk 완료마다 1회 progress 누적 증가
				done += items.length;
				if (onProgress) onProgress(done, { districtType: 'HJDONG' });
			}
		};

		// 워커 4개만 실행
		const workerCount = Math.min(concurrency, prefixes.length);
		await Promise.all(Array.from({ length: workerCount }, () => worker()));
		return { data: merged };
	} catch (e) {
		return { data: [] as any[] };
	}
}

// 스토어가 실제 존재하지 않으면 강제 업그레이드로 생성
/**
 *
 * @param dbName
 * @param storeName
 * @param version
 */
function forceCreateStoreIfMissing(dbName: string, storeName: string, version: number): Promise<void> {
	return new Promise<void>(resolve => {
		try {
			const req = indexedDB.open(dbName);
			req.onsuccess = () => {
				const db = req.result;
				const exists = db.objectStoreNames.contains(storeName);
				db.close();

				if (exists) return resolve();

				// 강제 업그레이드로 스토어 생성
				const req2 = indexedDB.open(dbName, version + 1);
				req2.onupgradeneeded = () => {
					const udb = req2.result;
					if (!udb.objectStoreNames.contains(storeName)) {
						udb.createObjectStore(storeName, { keyPath: 'id' });
					}
				};
				req2.onsuccess = () => {
					try {
						req2.result.close();
					} catch {}
					resolve();
				};
				req2.onerror = () => resolve();
				req2.onblocked = () => resolve();
			};
			req.onerror = () => resolve();
			req.onblocked = () => resolve();
		} catch {
			resolve();
		}
	});
}

/**
 *
 * @param {any} opts
 * @param {any} opts.databaseName
 * @param {any} opts.version
 * @param {any} opts.storeName
 * @param {any} opts.date
 * @param {any} opts.loadBoundaryDataOnLoad
 */
export function useDistrictBoundariesData(opts?: {
	databaseName?: string;
	version?: number;
	storeName?: string;
	date?: string;
	loadBoundaryDataOnLoad?: boolean;
}) {
	const today = opts?.date ?? getBoundaryYmdKst();
	const databaseNameFinal = opts?.databaseName ?? 'WMS-IDB';
	const versionFinal = opts?.version ?? 1;
	const storeNameFinal = opts?.storeName ?? `${storeNamePrefix}${today}`;
	const { getByID, update } = useIndexedDBStore<DistrictCache>(storeNameFinal);
	const setAll = useDistrictBoundaryStore(s => s.setAll);

	const { ensure: ensureDaily } = useEnsureDailyStore();

	const ensureIDB = useCallback(async () => {
		try {
			// 1) 오늘자 스토어 외 과거 스토어 정리 + 최종 버전 획득
			const finalVersion = await ensureDaily({
				databaseName: databaseNameFinal,
				version: versionFinal,
				todayStore: storeNameFinal,
				prefix: storeNamePrefix, // 'HJDONG_POLYGON_'
			});

			// 2) 오늘자 스토어 보장 연결 + 전역 config 갱신
			await setupIndexedDB({
				databaseName: databaseNameFinal,
				version: finalVersion,
				stores: [{ name: storeNameFinal, id: { keyPath: 'id' }, indices: [] }],
			});

			// 3) 생성 검증: 스토어가 실제 존재하지 않으면 즉시 업그레이드로 생성
			await forceCreateStoreIfMissing(databaseNameFinal, storeNameFinal, finalVersion);
		} catch (e) {
			try {
				await setupIndexedDB({
					databaseName: databaseNameFinal,
					version: versionFinal,
					stores: [{ name: storeNameFinal, id: { keyPath: 'id' }, indices: [] }],
				});
			} catch (e2) {}
		}
	}, [databaseNameFinal, versionFinal, storeNameFinal]);

	const isValidFeatureDoc = (doc?: DistrictCache) => {
		const features = doc?.data?.features;
		if (!Array.isArray(features) || features.length === 0) return false;
		return true;
	};

	// IndexedDB 캐시 조회 → Zustand 저장 → 누락 키 반환
	const loadCachedData = useCallback(async (): Promise<TDistrictKey[]> => {
		let sidoDoc: DistrictCache | undefined;
		let sggDoc: DistrictCache | undefined;
		let demDoc: DistrictCache | undefined;

		try {
			[sidoDoc, sggDoc, demDoc] = await Promise.all([getByID('sido'), getByID('sgg'), getByID('dem')]);
		} catch {
			await setupIndexedDB({
				databaseName: databaseNameFinal,
				version: versionFinal,
				stores: [{ name: storeNameFinal, id: { keyPath: 'id' }, indices: [] }],
			});
		}

		if (sidoDoc || sggDoc || demDoc) {
			setAll({
				...(isValidFeatureDoc(sidoDoc) ? { sido: sidoDoc!.data } : {}),
				...(isValidFeatureDoc(sggDoc) ? { sgg: sggDoc!.data } : {}),
				...(isValidFeatureDoc(demDoc) ? { dem: demDoc!.data } : {}),
			});
		}

		const missing: TDistrictKey[] = [];
		if (!isValidFeatureDoc(sidoDoc)) missing.push('sido');
		if (!isValidFeatureDoc(sggDoc)) missing.push('sgg');
		if (!isValidFeatureDoc(demDoc)) missing.push('dem');
		return missing;
	}, [getByID, databaseNameFinal, versionFinal, storeNameFinal, setAll]);

	// 누락된 타입을 API에서 로드 → GeoJSON 변환 → Zustand + IndexedDB 저장
	const fetchAndStoreMissing = useCallback(
		async (missing: TDistrictKey[]) => {
			const typeMap: Record<TDistrictKey, TFileDistrictType> = { sido: 'CTP', sgg: 'SIG', dem: 'HJDONG' };
			const today = dayjs().format('YYYYMMDD');

			// 1) 타입별 기본 목록(pg:false) 먼저 모두 수집
			const types = missing.map(k => typeMap[k]);
			let baseListResults: any[] = [];
			try {
				baseListResults = await Promise.all(
					types.map(t => apiGetDistrictPolygonMasterList({ districtType: t, searchDate: today, pg: false })),
				);
			} catch (e) {
				baseListResults = types.map(() => ({ data: [] as any[] }));
			}

			const baseByType: Partial<Record<TFileDistrictType, any>> = {};
			types.forEach((t, i) => (baseByType[t] = baseListResults[i]));

			// 2) 합계 계산 안전화
			const countMissing = (res: any) =>
				(Array.isArray(res?.data) ? res.data : []).filter((r: any) => !r?.geojson || r.geojson === 'null').length;
			const totals: Record<TFileDistrictType, number> = { CTP: 0, SIG: 0, HJDONG: 0 };
			(Object.keys(baseByType) as Array<TFileDistrictType>).forEach(t => {
				try {
					totals[t] = countMissing(baseByType[t]);
				} catch {
					totals[t] = 0;
				}
			});
			const totalAll = (totals.CTP || 0) + (totals.SIG || 0) + (totals.HJDONG || 0);

			if (totalAll <= 0) {
				useProgressStore.getState().reset?.();
				return;
			}

			// 3) 진행 스토어 시작
			const runId = Date.now();
			const progress = useProgressStore.getState();
			progress.start(runId, totalAll);

			const perTypeDone: Record<TFileDistrictType, number> = { CTP: 0, SIG: 0, HJDONG: 0 };
			const onProgress = (absCount: number, ctx: { districtType: TFileDistrictType }) => {
				const t = ctx.districtType;
				if (absCount > perTypeDone[t]) {
					perTypeDone[t] = absCount;
					const sum = perTypeDone.CTP + perTypeDone.SIG + perTypeDone.HJDONG;
					progress.report(runId, sum);
				}
			};

			// 4) 상세 채우기
			const tasks = missing.map(async k => {
				const type = typeMap[k];
				try {
					const filled = await fetchGeojsonFromFileWithProgress(type, onProgress);
					try {
						const fc = toFeatureCollection(filled, k);
						return { key: k, fc };
					} catch (e) {
						return { key: k, fc: { type: 'FeatureCollection', features: [] as any[] } };
					}
				} catch (e) {
					return { key: k, fc: { type: 'FeatureCollection', features: [] } };
				}
			});

			const results = await Promise.allSettled(tasks);
			for (const r of results) {
				if (r.status === 'fulfilled') {
					const { key, fc } = r.value as { key: TDistrictKey; fc: IListenerSource[TDistrictKey] };
					try {
						setAll({ [key]: fc });
					} catch (e) {}
					try {
						await update({ id: key, data: fc, updatedAt: dayjs().toISOString() });
					} catch (e) {}
				}
			}

			// 5) 완료
			progress.finish(runId);
		},
		[setAll, update],
	);

	const load = useCallback(async () => {
		try {
			await ensureIDB();
			const missing = await loadCachedData();
			if (missing.length) {
				await fetchAndStoreMissing(missing);
			}
		} catch (error) {
			useProgressStore.getState().reset();
		}
	}, [ensureIDB, loadCachedData, fetchAndStoreMissing]);

	useEffect(() => {
		if (opts?.loadBoundaryDataOnLoad) {
			load();
		}
	}, [load]);

	return { reload: load };
}
