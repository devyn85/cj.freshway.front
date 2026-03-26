/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrict.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Util
import Constants from '@/util/constants';
import dateUtils from '@/util/dateUtil';
import { showMessage } from '@/util/MessageUtil';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import {
	RedefinePopList,
	mergeGroupPopListByPopNo,
} from '@/components/ms/deliveryDistrict/common/deliveryDistrictUtils';
import { validateDistrictGroupPop } from '@/components/ms/deliveryDistrict/districtGroup/validations';
import MsDeliveryDistrictDetail from '@/components/ms/deliveryDistrict/MsDeliveryDistrictDetail';
import MsDeliveryDistrictSearchSelector from '@/components/ms/deliveryDistrict/search/MsDeliveryDistrictSearchSelector';

// API Call Function
import { apiGetCenterDistrictPolygon as apiGetDeliveryDistrictCenterPolygon } from '@/api/ms/apiMsCenterDistrict';
import {
	apiGetDlvDistrictPolygon,
	apiPostExistsRepPop,
	apiPostGetCenterDistrictUsageList,
	apiPostGetDistrictGroupList,
	apiPostGetDistrictGroupXPop,
	apiPostGetDlvDistrictgroupPopList,
	apiPostGetMasterList,
	apiPostGetPopList,
	apiPostgetCenterHjdongIntersectionList,
	apiPostgetHjdongList,
} from '@/api/ms/apiMsDeliveryDistrict';

// Hooks
import { usePersistedTabStateOnPage } from '@/hooks/usePersistedTabStateOnPage';
import { useStateReducer } from '@/hooks/useStateReducer';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setGlobalVariable } from '@/store/core/globalStore';

export type TTabKeyUnion = 'district' | 'districtGroup' | 'pop';

export interface IDistrictTabDataState {
	districtGroupList: any[];
	subGridData: any[];
	hjdongPeriodList: any[];
	centerPolygonData: any[];
	districtGroupPolygonData: any[];
	districtPolygonData: any[];
	usageHjdongList: any[];
	unUsageHjdongList: any[];
}

const MsDeliveryDistrict = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const commonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];
	const dispatch = useAppDispatch();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 새로고침 시 활성화된 탭 상태 유지
	const [activeTabKey, setActiveTabKey] = usePersistedTabStateOnPage<TTabKeyUnion>(
		'ms-delivery-district-active-tab',
		'district',
		['district', 'districtGroup', 'pop'],
	);

	// 각 탭별 그리드 데이터 저장
	const [tabGridData, setTabGridData] = useState<Record<TTabKeyUnion, any[]>>({
		district: [],
		districtGroup: [],
		pop: [],
	});

	// 요청 페이지 번호
	const [currentPage, setCurrentPage] = useState<Record<TTabKeyUnion, number>>({
		district: 1,
		districtGroup: 1,
		pop: 1,
	});

	// 요청 건수
	const PAGE_SIZE = Constants.PAGE_INFO.PAGE_SIZE;

	// 총 건수 설정
	const [totalCnt, setTotalCnt] = useState<Record<TTabKeyUnion, number>>({
		district: 0,
		districtGroup: 0,
		pop: 0,
	});

	// 권역 탭 데이터들 (메인 그리드 조회 시 같이 조회 처리 - 탭 변경해도 유지 하도록 상위 페이지 컴포넌트에서 정의 처리)
	const [districtTabDatasState, setDistrictTabDataState] = useStateReducer<IDistrictTabDataState>({
		districtGroupList: [], // 메인 그리드 권역그룹 옵션 리스트 (셀 편집기에서 사용)
		subGridData: [], // 서브 그리드 데이터 (행정동)
		hjdongPeriodList: [], // 서브 그리드 행정동 데이터 (권역의 기간에 맞는 min/max 행정동리스트)
		centerPolygonData: [], // 센터 폴리곤 데이터 (지도 데이터) - 바로 보여주기
		districtGroupPolygonData: [], // 권역그룹 폴리곤 데이터 (지도 데이터) - 바로 보여주기
		districtPolygonData: [], // 권역 폴리곤 데이터 (지도 데이터) - 다 넣어두고 권역 선택 시만 보여주기(1개씩)
		usageHjdongList: [], // 현재 등록된 행정동 리스트 (지도에서 권역에 포함된 구역만 클릭이 가능하도록 처리할때 사용)
		unUsageHjdongList: [], // 미사용중인 행정동 리스트 (미사용중인 행정동 리스트 노랑색 색상을 표시 && 서브그리드 에서도 사용)
	});

	// 권역 그룹 탭 데이터들 (메인 그리드 조회 시 같이 조회 처리 - 탭 변경해도 유지 하도록 상위 페이지 컴포넌트에서 정의 처리)
	const [districtGroupTabDatasState, setDistrictGroupTabDataState] = useStateReducer<any>({
		subGridData: [], // 서브 그리드 데이터 (대표 POP)
		popList: [], // POP 리스트 (권역그룹에 속한 POP 리스트)
		selectMainGridRowData: null, // 선택된 메인 그리드 행 데이터
	});

	// 각 탭별 검색 초기값 정의 (useMemo로 최적화)
	const initialSearchBoxes = useMemo(
		() => ({
			district: {
				dccode: globalVariable.gDccode || null, // 물류센터코드
				effectiveDate: dayjs(), // 날짜
				searchKeyword: '', // 대표Pop,
				searchDistrictGroup: '', // 권역그룹
				searchDistrict: '', // 권역
			},
			districtGroup: {
				dccode: globalVariable.gDccode || null, // 물류센터코드
				effectiveDate: dayjs(), // 날짜
				searchKeyword: '', // 권역 그룹
			},
			pop: {
				effectiveDate: dayjs(), // 날짜
				dccode: globalVariable.gDccode || null, // 물류센터코드
				searchKeyword: '', // 검색 키워드
			},
		}),
		[globalVariable],
	);

	// 각 탭별 검색 조건 저장
	const [tabSearchConditions, setTabSearchConditions] = useState<Record<TTabKeyUnion, any>>({
		district: initialSearchBoxes['district'],
		districtGroup: initialSearchBoxes['districtGroup'],
		pop: initialSearchBoxes['pop'],
	});

	// 조회 여부 플래그(탭별)
	const [hasSearched, setHasSearched] = useState<Record<TTabKeyUnion, boolean>>({
		district: false,
		districtGroup: false,
		pop: false,
	});

	// 그리드 탭별 ref
	const districtGridRefs = {
		masterGridRef: useRef(null),
		subGridRef: useRef(null),
	};
	// DistrictGroup용 refs 객체 추가 (두 개의 그리드가 있으므로)
	const districtGroupRefs = {
		masterGridRef: useRef(null), // 권역그룹 그리드
		subGridRef: useRef(null), // 상세 POP 그리드
	};
	const popGridRef = useRef(null);

	const currentGridData = useMemo(() => tabGridData[activeTabKey] || [], [tabGridData, activeTabKey]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param r
	 */
	// 공통 유틸
	const isFulfilled = <T,>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> => r.status === 'fulfilled';
	const fmtDate = (d: any) => dayjs(d).format('YYYYMMDD');

	// [리팩토링] 서브 그리드 데이터 조회 및 처리 함수 분리
	const handleSubGridData = async (effectiveDateStr: string, mainGridRow: any, selectedMasterGridRow: any) => {
		const dlvdistrictId = selectedMasterGridRow?.dlvdistrictId ?? mainGridRow?.dlvdistrictId;
		const dlvgroupId = selectedMasterGridRow?.dlvgroupId ?? mainGridRow?.dlvgroupId;

		try {
			const [subGridRes, intersectionRes] = await Promise.all([
				apiPostgetHjdongList({
					effectiveDate: effectiveDateStr,
					dccode: mainGridRow?.dccode,
					dlvdistrictId,
					dlvgroupId,
				}),
				apiPostgetCenterHjdongIntersectionList({
					effectiveDate: effectiveDateStr,
					dccode: mainGridRow?.dccode,
					dlvdistrictId,
				}),
			]);

			const subGridData = (subGridRes?.data ?? []).map((x: any) => ({ ...x, rowStatus: 'R' }));

			const hjdongPeriodList = Array.isArray(intersectionRes?.data)
				? intersectionRes.data
				: intersectionRes?.data ?? [];

			setDistrictTabDataState({
				subGridData,
				hjdongPeriodList,
			});
		} catch (error) {
			setDistrictTabDataState({
				subGridData: [],
				hjdongPeriodList: [],
			});
		}
	};

	// 메인 그리드 조회 결과 처리 함수 분리
	const handleMainGridSuccess = async (masterRes: any, page: number, values: any, selectedMasterGridRow: any) => {
		// 조회 성공 시 버튼 활성화 처리
		setHasSearched(prev => ({ ...prev, district: true }));

		const data = masterRes?.data?.list ?? masterRes?.data ?? [];
		const total = masterRes?.data?.totalCount ?? masterRes?.data?.length ?? 0;

		// rowStatus: 'R' 추가
		const rows = data.map((x: any) => ({ ...x, rowStatus: 'R' }));

		setTotalCnt(prev => ({ ...prev, district: total }));

		// 해당 탭의 그리드 데이터 저장
		setTabGridData(prev => ({
			...prev,
			district: page === 1 ? rows : [...(prev.district || []), ...rows],
		}));

		// 최초 검색(1페이지)이고 데이터가 있을 때만 서브그리드 조회
		if (page === 1) {
			if (data.length > 0) {
				await handleSubGridData(fmtDate(values.effectiveDate), data[0], selectedMasterGridRow);
			} else {
				setDistrictTabDataState({ subGridData: [] });
			}
		}
	};

	// 병렬 데이터 조회 결과 처리 함수 분리
	const handleParallelDataResults = (
		groupListRes: PromiseSettledResult<any>,
		centerPolygonRes: PromiseSettledResult<any>,
		groupPolygonRes: PromiseSettledResult<any>,
		districtPolygonRes: PromiseSettledResult<any>,
		usageListRes: PromiseSettledResult<any>,
	) => {
		// 2) 권역그룹 리스트
		if (isFulfilled(groupListRes)) {
			const allGroupList = (groupListRes.value?.data || []).map((x: any) => ({
				...x,
				groupPopList: mergeGroupPopListByPopNo(x.groupPopList),
			}));
			setDistrictTabDataState({ districtGroupList: allGroupList });
		}

		// 3) 폴리곤들
		if (isFulfilled(centerPolygonRes)) {
			// 센터 폴리곤 데이터 주입
			setDistrictTabDataState({ centerPolygonData: centerPolygonRes.value?.data || [] });
		}
		if (isFulfilled(groupPolygonRes)) {
			// 권역그룹 폴리곤 데이터 주입
			setDistrictTabDataState({ districtGroupPolygonData: groupPolygonRes.value?.data || [] });
		}
		if (isFulfilled(districtPolygonRes)) {
			// 권역 폴리곤 데이터 주입
			setDistrictTabDataState({ districtPolygonData: districtPolygonRes.value?.data || [] });
		}

		// 4) 미사용 행정동 리스트
		if (isFulfilled(usageListRes)) {
			// 센터에 등록된 행정동 리스트 (지도에서 권역에 포함된 구역만 클릭이 가능하도록 처리할때 사용)
			const usageHjdongList = (usageListRes.value?.data || []).filter((x: any) => x.showYn === 'Y');
			// 미사용중인 행정동 리스트 (미사용중인 행정동 리스트 노랑색 색상을 표시 && 서브그리드 에서도 사용)
			const unUsageHjdongList = usageHjdongList.filter((x: any) => !x.fromDate || !x.toDate);

			setDistrictTabDataState({
				usageHjdongList: usageHjdongList,
				unUsageHjdongList: unUsageHjdongList,
			});
			// 선택 행정동 옶션 리스트가 없을 때 얼럿 띄우기ß
			if (usageHjdongList.length === 0) {
				showAlert(
					null,
					'현재 선택 가능한 행정동이 없습니다.\n 센터관할권역을 추가로 등록한 후 배송권역 설정이 가능합니다.',
				);
			}
		}
	};

	// 권역 탭 조회 함수
	const fetchDistrictTab = useCallback(
		async (values: any, page = 1, selectedMasterGridRow?: any) => {
			// 필수값 (물류센터, 적용일자)없으면 얼럿 띄우고 해당 함수 종료
			const missingFields: string[] = [];
			if (!values.dccode) {
				missingFields.push('물류센터코드');
			}
			if (!values.effectiveDate) {
				missingFields.push('적용일자');
			}

			if (missingFields.length > 0) {
				showAlert(null, `${missingFields.join(', ')}는(은) 필수입력값입니다.`);
				return;
			}

			const params = {
				dccode: values.dccode,
				effectiveDate: fmtDate(values.effectiveDate),
			};

			// 중복 문자열 제거
			const rawSearchKeyword = String(values.searchKeyword || '').trim();
			const searchKeyword = rawSearchKeyword ? [...new Set(rawSearchKeyword.split(','))].join(',') : '';
			const rawSearchDistrictGroup = String(values.searchDistrictGroup || '').trim();
			const searchDistrictGroup = rawSearchDistrictGroup
				? [...new Set(rawSearchDistrictGroup.split(','))].join(',')
				: '';

			// 1-1. 메인 그리드 리스트 -> 검색영역 (센터 배송 권역 조회)
			const masterRes = await apiPostGetMasterList({
				...params,
				searchKeyword: searchKeyword,
				searchDistrictGroup: searchDistrictGroup,
				searchDistrict: values.searchDistrict?.trim() || '',
				// 스크롤 페이지 처리
				startRow: (page - 1) * PAGE_SIZE,
				pageSize: PAGE_SIZE,
			});

			const [
				// masterRes,
				groupListRes,
				centerPolygonRes,
				groupPolygonRes,
				districtPolygonRes,
				usageListRes,
			] = await Promise.allSettled([
				// 권역 탭 > 권역그룹 리스트 (권역그룹 그리드 select box 리스트)
				apiPostGetDlvDistrictgroupPopList(params),
				// 센터 폴리곤 요청
				// (센터권역 api 사용)권역 탭 > 센터 폴리곤 데이터
				apiGetDeliveryDistrictCenterPolygon({ ...params, page: 'delivery' }),
				// 권역그룹 폴리곤 요청
				// 권역 탭 > 권역 그룹 폴리곤 데이터
				apiGetDlvDistrictPolygon({ ...params, dlvDistrictType: 'GROUP' }),
				// 권역 폴리곤 요청
				// 권역 탭 > 권역 폴리곤 데이터
				apiGetDlvDistrictPolygon({ ...params, dlvDistrictType: 'DISTRICT' }),
				// 센터에 등록된 모든 행정동 리스트 (fromDate, toDate null | '' 인값만 넣어주기)
				// - 괄호 조건으로 미사용행정동 리스트 추출
				// 권역 탭 > 센터에 등록된 모든 행정동 리스트
				apiPostGetCenterDistrictUsageList(params),
			]);

			// 2. 메인 그리드 결과 처리
			if (masterRes?.statusCode === 0) {
				await handleMainGridSuccess(masterRes, page, values, selectedMasterGridRow);
			} else {
				// 조회 실패시 버튼 비활성화 처리
				setHasSearched(prev => ({ ...prev, district: false }));
				// 데이터가 없을 때 해당 탭 그리드 빈배열로 초기화 처리
				setTabGridData(prev => ({ ...prev, district: [] }));
				setDistrictTabDataState({ subGridData: [] });
			}

			// 3. 병렬 요청 결과 데이터 처리 (State 업데이트)
			handleParallelDataResults(groupListRes, centerPolygonRes, groupPolygonRes, districtPolygonRes, usageListRes);
		},
		[setDistrictTabDataState],
	);

	// 권역그룹 탭 - 서브 그리드 및 POP 리스트 조회 처리
	const handleDistrictGroupSubData = async (rows: any[], values: any, isSearch: boolean) => {
		// 1개 이상일 때 서브 그리드 요청 처리
		if (rows.length > 0) {
			const orderByGroupIdList = [...rows].sort((a: any, b: any) => a.dlvgroupId.localeCompare(b.dlvgroupId));
			const requestRow = isSearch ? orderByGroupIdList[0] : orderByGroupIdList[orderByGroupIdList.length - 1];

			// 권역그룹 메인 그리드 첫번째 행 선택 처리
			setDistrictGroupTabDataState({ selectMainGridRowData: requestRow });

			const [subRes, popListRes] = await Promise.allSettled([
				// 2-3. 센터 배송 권역 그룹 X POP 조회 (서브 그리드 리스트)
				apiPostGetDistrictGroupXPop({
					dccode: requestRow?.dccode,
					dlvgroupId: requestRow?.dlvgroupId,
					effectiveDate: fmtDate(values.effectiveDate),
				}),
				// 3-1. 센터 권역 POP 조회 (대표 POP 리스트) - 전체 조회 처리
				apiPostGetPopList({
					dccode: requestRow?.dccode,
					effectiveDate: fmtDate(values.effectiveDate),
					searchKeyword: '',
					popCode: '',
					multiSelect: '',
					// // 페이지 요청 처리
					startRow: 0,
					pageSize: PAGE_SIZE * 100,
				}),
			]);

			if (isFulfilled(subRes)) {
				// rowStatus R 로 처리후 추가 처리 + 시작시간,종료시간 포메팅 처리
				const subRows = (subRes.value?.data || []).map((x: any) => ({
					...x,
					rowStatus: 'R',
					fromHour: dateUtils.formatTimeToDisplay(x.fromHour, '00:00'),
					toHour: dateUtils.formatTimeToDisplay(x.toHour, '23:59'),
				}));
				setDistrictGroupTabDataState({ subGridData: subRows });
				// pop 리스트 유효성 검사 처리
				validateDistrictGroupPop(
					subRows,
					dayjs(requestRow?.fromDate, 'YYYYMMDD'),
					dayjs(requestRow?.toDate, 'YYYYMMDD', false),
				);
			}
			if (isFulfilled(popListRes)) {
				// 서브 그리드 행에 들어갈 pop 리스트 주입
				// setDistrictGroupTabDataState({ popList: popListRes.value?.data || [] });
				setDistrictGroupTabDataState({ popList: RedefinePopList(popListRes.value?.data || []) });
			}
		} else {
			// 데이터가 없다면 서브그리드 관련 데이터도 초기화 처리
			setDistrictGroupTabDataState({ subGridData: [], popList: [], selectMainGridRowData: null });
		}
	};

	// 권역그룹 탭 조회 함수
	const fetchDistrictGroupTab = useCallback(
		async (values: any, page = 1, isSearch = true) => {
			// isSearch: true 일 때는 검색 조회, false 일 때는 권역그룹 저장 후 리스트 조회
			// (현재 권역그룹 탭에서 하위 그리드 데이터 조회 시 사용)

			// 필수값 (물류센터, 적용일자)없으면 얼럿 띄우고 해당 함수 종료
			const missingFields: string[] = [];
			if (!values.dccode) {
				missingFields.push('물류센터코드');
			}
			if (!values.effectiveDate) {
				missingFields.push('적용일자');
			}

			if (missingFields.length > 0) {
				showAlert(null, `${missingFields.join(', ')}는(은) 필수입력값입니다.`);
				return;
			}

			// 2-1. 권역그룹 리스트 조회
			const res = await apiPostGetDistrictGroupList({
				dccode: values.dccode,
				effectiveDate: fmtDate(values.effectiveDate),
				searchKeyword: values.searchKeyword?.trim() || '', // dlvgroupNm, dlvgroupId 는 searchKeyword 로 like 검색 처리
				dlvgroupId: '',
				dlvgroupNm: '',
				multiSelect: '',
				// 페이징 처리 추가
				startRow: (page - 1) * PAGE_SIZE,
				pageSize: PAGE_SIZE,
			});

			if (res?.statusCode === 0) {
				// 조회 후 버튼 활성화 처리
				setHasSearched(prev => ({ ...prev, districtGroup: true }));

				const data = res.data?.list ?? res.data ?? [];

				const total = res?.data?.totalCount ?? res?.data?.length ?? 0;

				const rows = data.map((x: any) => ({ ...x, rowStatus: 'R' }));

				setTotalCnt(prev => ({ ...prev, districtGroup: total }));

				setTabGridData(prev => ({
					...prev,
					districtGroup: page === 1 ? rows : [...(prev.districtGroup || []), ...rows],
				}));

				// 최초 검색 시 만 아래의 부분 추가 요청 처리 (페이지 카운트 증가시 요청 막기)
				if (page === 1) {
					await handleDistrictGroupSubData(rows, values, isSearch);
				}
			} else {
				// 조회 실패시 버튼 비활성화 처리
				setHasSearched(prev => ({ ...prev, districtGroup: false }));
			}
		},
		[setDistrictGroupTabDataState],
	);

	// POP 탭 조회 함수
	const fetchPopTab = useCallback(
		async (values: any, page = 1) => {
			// 필수값 (물류센터, 적용일자)없으면 얼럿 띄우고 해당 함수 종료
			const missingFields: string[] = [];
			if (!values.dccode) {
				missingFields.push('물류센터코드');
			}
			if (!values.effectiveDate) {
				missingFields.push('적용일자');
			}

			if (missingFields.length > 0) {
				showAlert(null, `${missingFields.join(', ')}는(은) 필수입력값입니다.`);
				return;
			}

			// 3-1. POP 리스트 조회
			const res = await apiPostGetPopList({
				dccode: values.dccode,
				effectiveDate: fmtDate(values.effectiveDate),
				searchKeyword: values.searchKeyword?.trim() || '',
				multiSelect: '',
				// 페이지 요청 처리
				startRow: (page - 1) * PAGE_SIZE,
				pageSize: PAGE_SIZE,
			});

			if (res?.statusCode === 0) {
				// 조회 후 버튼 활성화 처리
				setHasSearched(prev => ({ ...prev, pop: true }));

				const total = res?.data?.totalCount ?? res?.data?.length ?? 0;
				const list = res?.data?.list ?? res?.data;

				const rows = list.map((x: any) => ({ ...x, rowStatus: 'R' }));

				setTotalCnt(prev => ({ ...prev, pop: total }));

				setTabGridData(prev => ({
					...prev,
					pop: page === 1 ? rows : [...(prev.pop || []), ...rows],
				}));
			} else {
				// 조회 실패시 버튼 비활성화 처리
				setHasSearched(prev => ({ ...prev, pop: false }));
			}

			// POP 테이블에 데이터 존재 유무 판단 api
			const existsRepPopRes = await apiPostExistsRepPop({ dccode: values.dccode });

			if (existsRepPopRes?.data && existsRepPopRes?.data?.statusCode === 0) {
				if (!existsRepPopRes?.data?.data) {
					const centerObj = commonCodeList.find(c => c.comCd === values.dccode);
					// 중첩 템플릿 리터럴 분리
					const centerPrefix = centerObj ? `${centerObj?.cdNm}(${centerObj?.comCd})\n` : '현재 센터의 ';
					showMessage({
						modalType: 'warning',
						title: '',
						// @ts-ignore
						content: <div style={{ whiteSpace: 'pre-wrap' }}>{`${centerPrefix}대표POP를 설정해 주세요`}</div>,
						okText: '확인',
						keybard: false,
						Icon: <></>,
						centered: true,
						transitionName: '',
						maskTransitionName: '',
					});

					return;
				}
			}
		},
		[commonCodeList, setTotalCnt],
	);

	/**
	 * 조회
	 */
	const onSearch = useCallback(
		async (forceRequest?: TTabKeyUnion, isSearch?: boolean) => {
			// isSearch: true 일 때는 검색 조회, false 일 때는 권역그룹 저장 후 리스트 조회
			// (현재 권역그룹 탭에서 하위 그리드 데이터 조회 시 사용)
			const values = form.getFieldsValue();
			const requestKey = forceRequest || activeTabKey;

			switch (requestKey) {
				case 'district':
					setCurrentPage(prev => ({ ...prev, district: 1 }));
					setTotalCnt(prev => ({ ...prev, district: 0 }));
					await fetchDistrictTab(values, currentPage[activeTabKey]);
					break;
				case 'districtGroup':
					setCurrentPage(prev => ({ ...prev, districtGroup: 1 }));
					setTotalCnt(prev => ({ ...prev, districtGroup: 0 }));
					await fetchDistrictGroupTab(values, currentPage[activeTabKey], isSearch);
					break;
				case 'pop':
					setCurrentPage(prev => ({ ...prev, pop: 1 }));
					setTotalCnt(prev => ({ ...prev, pop: 0 }));
					await fetchPopTab(values, currentPage[activeTabKey]);
					break;
				default:
					break;
			}

			setTabSearchConditions(prev => {
				const values = form.getFieldsValue();
				const dccode = values.dccode;

				// 1) 실제 요청한 탭(requestKey)의 검색조건 저장
				const next = {
					...prev,
					[requestKey]: values,
				};

				// 2) dccode, effectiveDate 가 있는 경우, 모든 탭의 dccode, effectiveDate 를 동일하게 맞춰줌
				if (dccode !== undefined) {
					const effectiveDate = values.effectiveDate;
					return {
						district: { ...next.district, dccode, effectiveDate },
						districtGroup: { ...next.districtGroup, dccode, effectiveDate },
						pop: { ...next.pop, dccode, effectiveDate },
					};
				}

				return next;
			});
		},
		[activeTabKey, form, fetchDistrictTab, fetchDistrictGroupTab, fetchPopTab, setCurrentPage, setTotalCnt],
	);

	// 페이지 버튼 함수 바인딩
	const titleFuncBtn = useMemo(() => ({ searchYn: onSearch }), [onSearch]);

	const handleTabChange = (key: string) => {
		const newKey = key as TTabKeyUnion;
		setActiveTabKey(newKey);
		dispatch(setGlobalVariable({ ...globalVariable, gMultiDccode: globalVariable.gDccode }));

		const saved = tabSearchConditions[newKey] || initialSearchBoxes[newKey];
		form.setFieldsValue(saved);
	};

	const handleTabClick = useCallback(
		(key: string) => {
			setTimeout(() => {
				if (key === 'district') {
					districtGridRefs.masterGridRef.current?.setColumnSizeList?.(
						districtGridRefs.masterGridRef.current?.getFitColumnSizeList(true),
					);
				}
				if (key === 'districtGroup') {
					districtGroupRefs.masterGridRef.current?.setColumnSizeList?.(
						districtGroupRefs.masterGridRef.current?.getFitColumnSizeList(true),
					);
					districtGroupRefs.subGridRef.current?.setColumnSizeList?.(
						districtGroupRefs.subGridRef.current?.getFitColumnSizeList(true),
					);
				}
				if (key === 'pop') {
					popGridRef.current?.setColumnSizeList?.(popGridRef.current?.getFitColumnSizeList(true));
				}
			}, 100);
		},
		[districtGridRefs, districtGroupRefs, popGridRef],
	);

	// 스크롤 페이징 - 권역 탭
	const onLoadMoreDistrict = useCallback(async () => {
		if (tabGridData?.district?.length < totalCnt?.district) {
			const nextPage = currentPage['district'] + 1;
			await fetchDistrictTab(tabSearchConditions['district'] || initialSearchBoxes['district'], nextPage);
			setCurrentPage(prev => ({ ...prev, district: nextPage }));
		}
	}, [tabGridData, totalCnt, currentPage, tabSearchConditions, initialSearchBoxes, fetchDistrictTab]);

	// 스크롤 페이징 - 권역그룹 탭
	const onLoadMoreGroup = useCallback(async () => {
		if (tabGridData?.districtGroup?.length < totalCnt?.districtGroup) {
			const nextPage = currentPage['districtGroup'] + 1;
			await fetchDistrictGroupTab(
				tabSearchConditions['districtGroup'] || initialSearchBoxes['districtGroup'],
				nextPage,
			);
			setCurrentPage(prev => ({ ...prev, districtGroup: nextPage }));
		}
	}, [tabGridData, totalCnt, currentPage, tabSearchConditions, initialSearchBoxes, fetchDistrictGroupTab]);

	// 스크롤 페이징 - POP 탭
	const onLoadMorePop = useCallback(async () => {
		if (tabGridData?.pop?.length < totalCnt?.pop) {
			const nextPage = currentPage['pop'] + 1;
			await fetchPopTab(tabSearchConditions['pop'] || initialSearchBoxes['pop'], nextPage);
			setCurrentPage(prev => ({ ...prev, pop: nextPage }));
		}
	}, [tabGridData, totalCnt, currentPage, tabSearchConditions, initialSearchBoxes, fetchPopTab]);

	/**
	 * =====================================================================
	 *  03. react hook
	 * =====================================================================
	 */
	// activeTabKey 변경 시 복원 로직 수정
	useEffect(() => {
		const saved = tabSearchConditions[activeTabKey] || initialSearchBoxes[activeTabKey];
		form.setFieldsValue(saved);
	}, [activeTabKey, tabSearchConditions]);

	return (
		<>
			{/* 타이틀 */}
			<MenuTitle func={titleFuncBtn} />
			{/* 검색 영역 */}
			<SearchFormResponsive form={form} initialValues={initialSearchBoxes[activeTabKey]}>
				<MsDeliveryDistrictSearchSelector activeTabKey={activeTabKey} form={form} />
			</SearchFormResponsive>
			{/* 화면 영역 */}
			<MsDeliveryDistrictDetail
				activeTabKey={activeTabKey}
				onTabChange={handleTabChange}
				onTabClick={handleTabClick}
				onSearch={onSearch}
				currentGridData={currentGridData}
				currentPage={currentPage}
				totalCnt={totalCnt}
				districtTabDatasState={districtTabDatasState}
				setDistrictTabDataState={setDistrictTabDataState}
				districtGroupTabDatasState={districtGroupTabDatasState}
				setDistrictGroupTabDataState={setDistrictGroupTabDataState}
				districtGridRefs={districtGridRefs}
				districtGroupRefs={districtGroupRefs}
				popGridRef={popGridRef}
				hasSearched={hasSearched}
				tabSearchConditions={tabSearchConditions}
				tabGridData={tabGridData}
				onLoadMoreDistrict={onLoadMoreDistrict}
				onLoadMoreGroup={onLoadMoreGroup}
				onLoadMorePop={onLoadMorePop}
				fetchDistrictTab={fetchDistrictTab}
				form={form}
			/>
		</>
	);
};

export default MsDeliveryDistrict;
