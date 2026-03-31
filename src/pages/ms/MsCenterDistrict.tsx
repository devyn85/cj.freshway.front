/*
 ############################################################################
 # FiledataField	: MsCenterDistrict.tsx
 # Description		: 센터권역 관리
 # Author			:  손인성
 # Since			:  26.03.20
 ############################################################################
 */

// Lib
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { flatMap, isArray } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCenterDistrictDetail from '@/components/ms/centerDistrict/MsCenterDistrictDetail';
import MsCenterDistrictSearch from '@/components/ms/centerDistrict/MsCenterDistrictSearch';
import MsCenterDistrictPlatformOrderTypePopup from '@/components/ms/popup/MsCenterDistrictPlatformOrderTypePopup';

// API
import {
	apiGetCenterDistrictPolygon,
	apiGetMasterList,
	apiGetNewCreatedHjdongWithoutPolygon,
	apiGetOrdGrpList,
	apiPostNewHjdongList,
} from '@/api/ms/apiMsCenterDistrict';

// Util
import { showAlert } from '@/util/MessageUtil';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { dccodeIncludePriorityCenterList, getUserDccodeList } from '@/store/core/userStore';

// Types
import { NewHjdongListType } from '@/components/ms/centerDistrict/types';

// 파일 정의
const MsCenterDistrict = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm(); // Antd Form

	const [searchParams, setSearchParams] = useState(null); // 검색 조건
	const [centerGridData, setCenterGridData] = useState(); // 센터 권역 데이터
	const [hasSearched, setHasSearched] = useState(false); // 조회 여부
	const [centerPolygonData, setCenterPolygonData] = useState([]); // 센터 권역 폴리곤 데이터
	const [selectedRowInCenterGrid, setSelectedRowInCenterGrid] = useState(null); // 센터 행정동 1개 행 선택 (주문그룹 리스트 요청 + )

	const [newHjdongList, setNewHjdongList] = useState<NewHjdongListType[]>([]); // 미사용 행정동 리스트

	const [newCreatedHjdongWithoutPolygonList, setNewCreatedHjdongWithoutPolygonList] = useState<NewHjdongListType[]>([]); // 신설 행정동 리스트
	const [isNewCreatedHjdongWithoutPolygonGridOpen, setIsNewCreatedHjdongWithoutPolygonGridOpen] = useState(false); // 신설 행정동 그리드 열림/닫힘

	// 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	const [gridTick, setGridTick] = useState(0);
	const bumpGridTick = useCallback(() => setGridTick(t => t + 1), []); // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	const clearGridTick = useCallback(() => setGridTick(0), []); // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 초기화 처리 (지도 클릭 폴리곤 재계산 처리)

	// React Ref 정의
	const centerGridRef = useRef(null); // 센터 권역 그리드 ref

	// 플랫폼주문유형 팝업 관련 참조 및 상태
	const platformOrderTypePopupModal: any = useRef(null);
	const platformOrderTypePopupRef: any = useRef(null);
	const [platformOrderTypeCodeList, setPlatformOrderTypeCodeList] = useState<any[]>([]);
	const [fwCenterList, setFwCenterList] = useState<any[]>([]);
	const [foCenterList, setFoCenterList] = useState<any[]>([]);

	// 초기값 정의
	const [searchBox] = useState({
		effectiveDate: dayjs(), // 날짜
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode) || null, // 물류센터코드
		hjdongCd: null, // 행정동
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 * @param {string} effectiveDate - 적용일자
	 * @param {string} dccode - 물류센터
	 * @param {string} hjdongCd - 행정동
	 */
	const searchList = async () => {
		try {
			// 조회 조건 검증
			await form.validateFields();

			const params = form.getFieldsValue();
			if (params?.dccode) {
				if (isArray(params?.dccode)) {
					params.dccode = flatMap(params.dccode, (dccode: any) => (isArray(dccode) ? dccode : [dccode])).join(',');
				}
			}

			setSearchParams(params);

			// 조회
			searchListImp(params);
			// 조회 시 선택한 센터권역 열 선택 초기화
			setSelectedRowInCenterGrid(null);
		} catch (error: any) {
			showAlert(null, error.errorFields[0].errors[0]);
		}
	};

	const formatAbolitionHjdongAlertMessage = (list: any[]) => {
		const lines = Array.from(
			new Set(
				(list ?? [])
					.map(x => [x?.ctpKorNm, x?.sigKorNm, x?.hjdongNm].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim())
					.filter(Boolean),
			),
		);

		return `아래의 행정동 리스트는 개편/조정 예정입니다.\n\n${lines.join('\n')}`;
	};

	// 미사용 행정동 리스트 조회 및 폐지 예정 행정동 알림 처리
	const fetchNewHjdongListAndCheckAbolition = async (params: any, masterListPromise: Promise<any[]>) => {
		try {
			const res = await apiPostNewHjdongList(params);
			if (!res?.data) return;

			const filteredData = res.data.filter((x: any) => x.showYn === 'Y');
			setNewHjdongList(filteredData);

			const centerList = await masterListPromise;
			const unfilteredData = res.data.filter((x: any) => x.showYn === 'N');
			const filteredAlertHjdongList = unfilteredData.filter((x: any) =>
				(centerList ?? []).some((y: any) => y.hjdongCd === x.hjdongCd),
			);

			if (filteredAlertHjdongList.length > 0) {
				showAlert(null, formatAbolitionHjdongAlertMessage(filteredAlertHjdongList));
			}
		} catch (err) {
			//console.warn('apiPostNewHjdongList error', err);
		}
	};

	// 메인그리드 조회 함수
	const requestCenterDistrictSearch = useCallback(
		(params: any) => {
			clearGridTick(); // 조회 시작 시 폴리곤 초기화 신호

			const masterListPromise = apiGetMasterList({
				effectiveDate: params.effectiveDate.format('YYYYMMDD'),
				dccode: params.dccode,
				hjdongCd: params.hjdongCd || [],
			})
				.then((res: any) => {
					if (res.statusCode === 0) {
						// 초기 데이터 주입 시 rowStatus 'R' 로 주입 처리
						const initialGridData = (res.data ?? []).map((item: any) => ({ ...item, rowStatus: 'R' }));
						setCenterGridData(initialGridData);
						// 조회 성공 시 행추가/행삭제/저장 버튼 활성화 처리
						setHasSearched(true);
						bumpGridTick();
						return initialGridData;
					} else {
						// 조회 실패 시 행추가/행삭제/저장 버튼 비활성화 처리
						setHasSearched(false);
						return [];
					}
				})
				.catch((error: any): any[] => {
					setHasSearched(false);
					return [];
				});

			// 폴리곤 데이터 조회
			apiGetCenterDistrictPolygon({
				effectiveDate: params.effectiveDate.format('YYYYMMDD'),
				dccode: params.dccode,
				hjdongCd: params.hjdongCd || [],
			})
				.then((res: any) => {
					if (res?.data) {
						// // TODO: 프론트에서 센터권역 폴리곤 합성 처리 (해당 함수는 import 해서 사용)
						// // 함수는 만들어 놨음
						// const merged = mergeCenterPolygonByDccode(res.data);
						setCenterPolygonData(res.data);
					}
				})
				.catch((err: any) => {
					//console.warn('apiGetCenterDistrictPolygon error', err);
				});

			// FO/FW 센터 존재 여부 체크
			const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

			const filteredCommonCodeListExcludeChildPriorityCenter = allCommonCodeList.filter(
				v => !dccodeIncludePriorityCenterList.includes(v.comCd),
			);

			const fwCenters = filteredCommonCodeListExcludeChildPriorityCenter.filter(v => v.convcode === '0');
			const foCenters = filteredCommonCodeListExcludeChildPriorityCenter.filter(v => v.convcode === '1');
			const selectedDccodes = (params?.dccode ?? '')
				.split(',')
				.map((v: any) => v.trim())
				.filter(Boolean);

			// 전체, FW, FO 센터 존재 여부 체크
			const filteredSelected = selectedDccodes.filter((v: any) => !['0000', '0001', '0002'].includes(v));

			const fwSet = new Set(fwCenters.map(v => v.comCd));
			const foSet = new Set(foCenters.map(v => v.comCd));

			const hasFw = filteredSelected.some((cd: any) => fwSet.has(cd));
			const hasFo = filteredSelected.some((cd: any) => foSet.has(cd));

			let group: string | undefined;
			if (hasFw && hasFo) {
				group = 'all';
			} else if (hasFw) {
				group = 'fw';
			} else if (hasFo) {
				group = 'fo';
			}
			// 미사용 행정동 리스트 조회
			const paramsNewHjdongList: any = {
				effectiveDate: params.effectiveDate.format('YYYYMMDD'),
				dcgroup: group,
			};

			fetchNewHjdongListAndCheckAbolition(paramsNewHjdongList, masterListPromise);

			// 신설 행정동 리스트 조회
			apiGetNewCreatedHjdongWithoutPolygon()
				.then((res: any) => {
					if (res?.data) {
						setNewCreatedHjdongWithoutPolygonList(res.data);
					}
				})
				.catch((err: any) => {
					//console.warn('apiGetNewCreatedHjdongWithoutPolygon error', err);
					setNewCreatedHjdongWithoutPolygonList([]);
				});
		},
		[clearGridTick, bumpGridTick, formatAbolitionHjdongAlertMessage],
	);

	// 전체 조회 함수
	const searchListImp = (params: any) => {
		// 센터권역 + 센터권역 폴리곤 데이터 조회
		requestCenterDistrictSearch(params);
		// 전체 조회 시 지도 클릭 폴리곤 영역 재 설정 처리
		// clearGridTick();
	};

	// 재조회 함수
	const refetchList = useCallback(
		async (requestType: 'ALL' | 'MAIN', searchParams: any) => {
			// ALL: 모두 조회, MAIN: 센터 권역 조회

			switch (requestType) {
				case 'ALL':
					searchListImp(searchParams);
					break;
				case 'MAIN':
					requestCenterDistrictSearch(searchParams);
					break;
				default:
					break;
			}
		},
		[searchParams],
	);

	// 플랫폼주문유형 팝업 열기 헬퍼 함수
	const openPlatformOrderTypePopup = (effectiveDate: Dayjs, tempOrderTypeCodeList: any[]) => {
		platformOrderTypePopupModal.current?.handlerOpen();
		setTimeout(() => {
			if (effectiveDate && platformOrderTypePopupRef.current) {
				platformOrderTypePopupRef.current.setEffectiveDate(effectiveDate);
			}
			if (tempOrderTypeCodeList.length > 0 && platformOrderTypePopupRef.current) {
				platformOrderTypePopupRef.current.setOrderTypeCode(tempOrderTypeCodeList[0].comCd);
			}
		}, 300);
	};

	// 플랫폼주문유형 팝업 열기
	const handleOpenPlatformOrderTypePopup = () => {
		// 1) FO/FW 센터 존재 여부 체크 (CmGMultiDccodeSelectBox 로직 축약본)
		const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];
		const userDccodeList = getUserDccodeList('') ?? [];

		// 사용자 권한이 있는 센터만 필터
		const filteredCommonCodeList = allCommonCodeList.filter(v =>
			userDccodeList.some(userDccode => userDccode.dccode === v.comCd),
		);

		// 우선순위 센터(1000, 2170 등) 제외
		const filteredCommonCodeListExcludeChildPriorityCenter = filteredCommonCodeList.filter(
			v => !dccodeIncludePriorityCenterList.includes(v.comCd),
		);

		// convcode 기준으로 FO/FW 분리
		const fwCenters = filteredCommonCodeListExcludeChildPriorityCenter.filter(v => v.convcode === '0');
		const foCenters = filteredCommonCodeListExcludeChildPriorityCenter.filter(v => v.convcode === '1');

		// 둘 중 하나라도 0개면 팝업 막기
		if (fwCenters.length === 0 || foCenters.length === 0) {
			showAlert(null, 'FO 센터와 FW 센터가 모두 권한 존재 시 플랫폼 주문유형을 설정할 수 있습니다.');
			return;
		}

		// FO/FW 센터 리스트 설정
		setFwCenterList(fwCenters);
		setFoCenterList(foCenters);

		const effectiveDate = form.getFieldValue('effectiveDate');
		let tempOrderTypeCodeList: any[] = [];
		// // 주문그룹 조회 처리 후 팝업 창 열고 해당 결과값 넣기
		apiGetOrdGrpList({
			effectiveDate: effectiveDate.format('YYYYMMDD'),
			dccode: [form.getFieldValue('dccode')],
		})
			.then((res: any) => {
				if (res.statusCode === 0) {
					const orderTypeCodeList = res.data
						?.map((item: any) => ({
							comCd: item.ordGrp,
							cdNm: item.ordGrpNm,
						}))
						.filter((item: any) => item.comCd !== 'A100'); // 레가시 목록 제거
					setPlatformOrderTypeCodeList(orderTypeCodeList);
					tempOrderTypeCodeList = orderTypeCodeList;
				}
			})
			.catch((error: any) => {
				const orderTypeCodeList = getCommonCodeList('ORDR_GROUP').filter((item: any) => item.comCd !== 'A100') ?? []; // 레가시 목록 제거
				setPlatformOrderTypeCodeList(orderTypeCodeList);
			})
			.finally(() => {
				openPlatformOrderTypePopup(effectiveDate, tempOrderTypeCodeList);
			});
	};
	// 플랫폼주문유형 팝업 닫기
	const handleClosePlatformOrderTypePopup = () => {
		platformOrderTypePopupModal.current?.handlerClose();
	};

	// 공통 button 정의
	const titleFunc = {
		searchYn: searchList,
		setting: () => {
			handleOpenPlatformOrderTypePopup();
		},
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 메뉴 영역 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 검색 영역 */}
			<SearchFormResponsive form={form} initialValues={searchBox} initialExpanded={true} groupClass={'grid-column-4'}>
				<MsCenterDistrictSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 */}
			<MsCenterDistrictDetail
				form={form}
				searchParams={searchParams}
				centerGridData={centerGridData}
				centerGridRef={centerGridRef}
				centerPolygonData={centerPolygonData}
				selectedRowInCenterGrid={selectedRowInCenterGrid}
				setSelectedRowInCenterGrid={setSelectedRowInCenterGrid}
				newHjdongList={newHjdongList}
				newCreatedHjdongWithoutPolygonList={newCreatedHjdongWithoutPolygonList}
				isNewCreatedHjdongWithoutPolygonGridOpen={isNewCreatedHjdongWithoutPolygonGridOpen}
				setIsNewCreatedHjdongWithoutPolygonGridOpen={setIsNewCreatedHjdongWithoutPolygonGridOpen}
				gridTick={gridTick}
				bumpGridTick={bumpGridTick}
				hasSearched={hasSearched}
				refetchList={refetchList}
			/>
			{/* 플랫폼주문유형 팝업 */}
			<CustomModal ref={platformOrderTypePopupModal} width="85vw">
				<MsCenterDistrictPlatformOrderTypePopup
					ref={platformOrderTypePopupRef}
					close={handleClosePlatformOrderTypePopup}
					platformOrderTypeCodeList={platformOrderTypeCodeList}
					fwCenterList={fwCenterList}
					foCenterList={foCenterList}
				/>
			</CustomModal>
		</>
	);
};

export default MsCenterDistrict;
