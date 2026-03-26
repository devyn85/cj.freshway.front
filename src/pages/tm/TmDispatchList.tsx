// lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';

// hooks
import { usePersistedTabStateOnPage } from '@/hooks/usePersistedTabStateOnPage';
import { useThrottle } from '@/hooks/useThrottle';

// components
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmDispatchListArea from '@/components/tm/order/gridList/TmDispatchListArea';
import TmDispatchListCustomer from '@/components/tm/order/gridList/TmDispatchListCustomer';
import TmDispatchListHistory from '@/components/tm/order/gridList/TmDispatchListHistory';
import TmDispatchListPop from '@/components/tm/order/gridList/TmDispatchListPop';
import TmDispatchListVehicle from '@/components/tm/order/gridList/TmDispatchListVehicle';
import TmDispatchListSearchSelector from '@/components/tm/order/search/TmDispatchListSearchSelector';

// apis
import {
	apiGetCarHistoryMasterGridList, // 차량 변경내역
	apiGetCarMasterGridList, // 차량별
	apiGetCustomerMasterGridList, // 거래처별
	apiGetDistrictMasterGridList, // 권역별
	apiGetPopMasterGridList, // POP별
} from '@/api/tm/apiTmDispatchList';

export type tabKeyUnion = 'vehicle' | 'customer' | 'pop' | 'area' | 'history';

const TmDispatchList = () => {
	// 다국어
	const { t } = useTranslation();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	/**
	 * 물류센터 코드 리스트
	 */
	const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	/**
	 * 사용자 권한에 따른 물류센터 코드 리스트
	 */
	const userDccodeList = getUserDccodeList('ALL');

	/**
	 * 사용자 권한에 해당하는 물류센터 코드들로 필터링 처리
	 */
	const filteredCommonCodeList = allCommonCodeList.filter(v =>
		userDccodeList.some(userDccode => userDccode.dccode === v.comCd),
	);

	const [form] = Form.useForm();
	const [activeTabKey, setActiveTabKey] = usePersistedTabStateOnPage<tabKeyUnion>(
		'tm-dispatch-list-active-tab',
		'vehicle',
		['vehicle', 'customer', 'pop', 'area', 'history'],
	);

	// 탭별 독립적인 데이터 상태 관리
	const [tabData, setTabData] = useState<
		Record<
			tabKeyUnion,
			{
				gridData: any[];
				totalCnt: number;
				currentPage: number;
				hasSearched: boolean;
				formData: any; // 각 탭의 검색 조건 저장
			}
		>
	>(() => {
		// 초기값 설정
		const initialData: Record<tabKeyUnion, any> = {} as any;
		const tabs: tabKeyUnion[] = ['vehicle', 'customer', 'pop', 'area', 'history'];

		tabs.forEach(tab => {
			initialData[tab] = {
				gridData: [],
				totalCnt: 0,
				currentPage: 0, // 아직 검색되지 않은 상태는 0으로 초기화 설정
				hasSearched: false,
				formData: null, // 처음에는 null, 검색 시 설정
			};
		});

		return initialData;
	});

	//   현재 탭의 데이터를 computed로 가져오기
	const currentTabData = tabData[activeTabKey];
	const gridData = currentTabData.gridData;
	const totalCnt = currentTabData.totalCnt;
	const [customerCurrentPage, setCustomerCurrentPage] = useState(0);

	const initialSearchBoxes = useMemo(() => {
		const currentUserCdInfo = filteredCommonCodeList.find(item => item.comCd == globalVariable.gDccode) ?? null;

		return {
			vehicle: {
				dccode: currentUserCdInfo ? [currentUserCdInfo.comCd] : [],
				deliveryDt: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
				contracttype: null as string | null,
				carcapacity: null as string | null,
				tmDeliverytype: null as string | null,
				carno: '',
			},
			customer: {
				dccode: currentUserCdInfo ? [currentUserCdInfo.comCd] : [],
				deliveryDt: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
				tmDeliverytype: null as string | null,
				districtgroup: '',
				districtcode: '',
				popno: '',
				truthcustkeyList: '',
				carno: '',
				ordercloseroute: null as string | null,
			},
			pop: {
				dccode: currentUserCdInfo ? [currentUserCdInfo.comCd] : [],
				deliveryDt: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
				popno: '',
				carno: '',
			},
			area: {
				dccode: currentUserCdInfo ? [currentUserCdInfo.comCd] : [],
				deliveryDt: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
				administrativeRegion: '',
			},
			history: {
				dccode: currentUserCdInfo ? [currentUserCdInfo.comCd] : [],
				deliveryDt: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
				popno: '',
				custkeyList: '',
				carno: '',
			},
		};
	}, [globalVariable, filteredCommonCodeList, activeTabKey]);

	// 페이지당 아이템 수 (고정값)
	const LIST_COUNT = 100000;

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 탭별 요청 파라미터 생성 함수
	const createRequestParams = useCallback(
		(values: any, pageNum: number) => {
			const baseParams = {
				pageNum,
				listCount: LIST_COUNT,
			};
			const [deliveryDtFrom, deliveryDtTo] = values.deliveryDt;

			switch (activeTabKey) {
				case 'vehicle':
					return {
						...baseParams,
						// 차량별 검색 조건
						deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '',
						deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '',
						dccode: Array.isArray(values.dccode) ? values.dccode[0] : values.dccode,
						contracttype: values.contracttype ?? '',
						carnoList: values.carno ? values.carno.trim().split(',') : [], // 요청은 carno -> carnoList 변경됨
						tmDeliverytype: values.tmDeliverytype ?? '',
						carcapacity: values.carcapacity ?? '',
					};

				case 'customer':
					return {
						...baseParams,
						// 거래처별 검색 조건 (날짜 범위)
						dccode: Array.isArray(values.dccode) ? values.dccode[0] : values.dccode, // 물류센터
						deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '', // 배송일자-시작일
						deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '', // 배송일자-종료일
						tmDeliverytype: values.tmDeliverytype, // 배송유형
						districtgroup: values.districtgroup, // 권역그룹
						districtcode: values.districtcode, // 권역
						popno: values.popno ? values.popno.trim() : '', // pop번호
						popnoMulti: values.popno
							? values.popno
									.split(',')
									.map((item: string) => item.trim())
									.filter((item: string) => item.length > 0)
							: [], // popnoMulti(empty제외)
						truthcustkeyList: values.truthcustkeyList ? values.truthcustkeyList.trim().split(',') : [], // 거래처코드/명
						carnoList: values.carno ? values.carno.trim().split(',') : [], // 요청은 carno -> carnoList 변경됨
						ordercloseroute: values.ordercloseroute, // 주문마감경로
					};

				case 'pop':
					return {
						...baseParams,
						// POP별 검색 조건
						deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '',
						deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '',
						dccode: Array.isArray(values.dccode) ? values.dccode[0] : values.dccode,
						popno: values.popno ? values.popno.trim() : '',
						popnoMulti: values.popno
							? values.popno
									.split(',')
									.map((item: string) => item.trim())
									.filter((item: string) => item.length > 0)
							: [], // popnoMulti(empty제외)
						carnoList: values.carno ? values.carno.trim().split(',') : [],
					};

				case 'area':
					return {
						...baseParams,
						// 권역별 검색 조건
						dccode: Array.isArray(values.dccode) ? values.dccode[0] : values.dccode, // 물류센터
						deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '', // 배송일자-시작일
						deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '', // 배송일자-종료일
						administrativeRegion: values.administrativeRegion, // 행정구역
					};

				case 'history':
					return {
						...baseParams,
						// 차량 변경내역 검색 조건 (날짜 범위)
						dccode: Array.isArray(values.dccode) ? values.dccode[0] : values.dccode, // 물류센터
						deliverydtFrom: deliveryDtFrom ? dayjs(deliveryDtFrom).format('YYYYMMDD') : '', // 배송일자-시작일
						deliverydtTo: deliveryDtTo ? dayjs(deliveryDtTo).format('YYYYMMDD') : '', // 배송일자-종료일
						tmDeliverytype: values.tmDeliverytype, // 배송유형
						popno: values.popno ? values.popno.trim() : '', // POP
						popnoMulti: values.popno
							? values.popno
									.split(',')
									.map((item: string) => item.trim())
									.filter((item: string) => item.length > 0)
							: [], // popnoMulti(empty제외)
						custkeyList: values.custkeyList ? values.custkeyList.trim().split(',') : [], // 거래처코드/명
						carnoList: values.carno ? values.carno.trim().split(',') : [], // 차량번호/기사
					};

				default:
					return baseParams;
			}
		},
		[activeTabKey, LIST_COUNT],
	);

	const onSearch = useCallback(async () => {
		const values = form.getFieldsValue();

		//   현재 탭의 검색 조건과 페이지 초기화
		setTabData(prev => ({
			...prev,
			[activeTabKey]: {
				...prev[activeTabKey],
				currentPage: 1, // 검색 시에만 페이지 초기화
				formData: { ...values }, // 현재 탭의 검색 조건 저장
			},
		}));
		setCustomerCurrentPage(1);

		// 탭별 요청 파라미터 생성
		const params = createRequestParams(values, 1);

		try {
			let responseData = null;
			switch (activeTabKey) {
				case 'vehicle':
					responseData = await apiGetCarMasterGridList(params);
					break;
				case 'customer':
					responseData = await apiGetCustomerMasterGridList(params);
					break;
				case 'pop':
					responseData = await apiGetPopMasterGridList(params);
					break;
				case 'area':
					responseData = await apiGetDistrictMasterGridList(params);
					break;
				case 'history':
					responseData = await apiGetCarHistoryMasterGridList(params);
					break;
				default:
					break;
			}

			// 현재 탭의 데이터만 업데이트
			setTabData(prev => ({
				...prev,
				[activeTabKey]: {
					...prev[activeTabKey],
					gridData: responseData?.data?.list ?? [],
					totalCnt: responseData?.data?.totalCount ?? 0,
					currentPage: 1,
					hasSearched: true,
				},
			}));
		} catch (error) {
		} finally {
		}
	}, [activeTabKey, form, createRequestParams]);

	// 스크롤 페이징을 위한 추가 데이터 로드 함수
	const loadMoreData = useCallback(async () => {
		// 함수형 업데이트로 최신 상태 접근
		let latestTabData: any;
		let nextPage: number;
		let savedFormData: any;

		setTabData(prev => {
			latestTabData = prev[activeTabKey];
			savedFormData = latestTabData.formData || form.getFieldsValue();
			nextPage = latestTabData.currentPage + 1;

			return prev; // 상태 변경 없이 반환
		});

		setCustomerCurrentPage(nextPage);
		const params = createRequestParams(savedFormData, nextPage);

		try {
			let responseData = null;
			switch (activeTabKey) {
				case 'vehicle':
					responseData = await apiGetCarMasterGridList(params);
					break;
				case 'customer':
					responseData = await apiGetCustomerMasterGridList(params);
					break;
				case 'pop':
					responseData = await apiGetPopMasterGridList(params);
					break;
				case 'area':
					responseData = await apiGetDistrictMasterGridList(params);
					break;
				case 'history':
					responseData = await apiGetCarHistoryMasterGridList(params);
					break;
				default:
					break;
			}

			if (responseData?.data?.list && responseData.data.list.length > 0) {
				// 함수형 업데이트로 최신 상태에 추가
				setTabData(prev => ({
					...prev,
					[activeTabKey]: {
						...prev[activeTabKey],
						gridData: [...prev[activeTabKey].gridData, ...responseData.data.list],
						currentPage: nextPage,
					},
				}));
			}
		} catch (error) {}
	}, [activeTabKey, form, createRequestParams]); // tabData 의존성 제거

	// throttle을 별도로 적용
	const throttledLoadMoreData = useCallback(throttle(loadMoreData, 500), [loadMoreData]);

	const titleFunc = useMemo(() => ({ searchYn: onSearch }), [onSearch]);

	const handleTabChange = (key: string) => {
		const newTabKey = key as tabKeyUnion;

		// 현재 탭의 폼 데이터 저장 (검색했던 경우에만)
		const currentFormValues = form.getFieldsValue();
		if (currentTabData.hasSearched) {
			setTabData(prev => ({
				...prev,
				[activeTabKey]: {
					...prev[activeTabKey],
					formData: { ...currentFormValues },
				},
			}));
		}

		// 새로운 탭으로 변경
		setActiveTabKey(newTabKey);

		// 새로운 탭의 폼 데이터 복원
		const newTabData = tabData[newTabKey];
		const formDataToRestore = newTabData.formData || initialSearchBoxes[newTabKey];

		// 탭 전환 애니메이션 완료 후 폼 복원
		setTimeout(() => {
			form.setFieldsValue({
				...formDataToRestore,
				dccode: currentFormValues.dccode,
				deliveryDt: currentFormValues.deliveryDt,
			});
		}, 50);
	};

	// 탭 변경 시 저장된 폼 데이터로 초기화
	useEffect(() => {
		const currentTabData = tabData[activeTabKey];
		const formDataToSet = currentTabData.formData || initialSearchBoxes[activeTabKey];

		form.setFieldsValue(formDataToSet);
	}, [activeTabKey, tabData]);

	return (
		<>
			<MenuTitle func={titleFunc}></MenuTitle>
			<SearchFormResponsive
				form={form}
				key={`${activeTabKey}-${currentTabData.hasSearched}`} // 탭과 검색 상태 기준으로 리렌더링
				initialValues={initialSearchBoxes[activeTabKey]}
			>
				<TmDispatchListSearchSelector activeTabKey={activeTabKey} form={form} />
			</SearchFormResponsive>

			{/* 검색영역과 그리드 사이 간격 */}
			<div style={{ height: 12 }} />

			<Tabs
				activeKey={activeTabKey}
				onChange={handleTabChange}
				destroyOnHidden
				className="contain-wrap"
				items={[
					{
						key: 'vehicle',
						label: '차량별',
						children: (
							<TmDispatchListVehicle
								data={gridData}
								totalCnt={totalCnt}
								onLoadMore={throttledLoadMoreData}
								customerCurrentPage={customerCurrentPage}
							/>
						),
					},
					{
						key: 'customer',
						label: '거래처별',
						children: (
							<TmDispatchListCustomer
								data={gridData}
								totalCnt={totalCnt}
								onLoadMore={throttledLoadMoreData}
								customerCurrentPage={customerCurrentPage}
								pForm={form}
							/>
						),
					},
					{
						key: 'pop',
						label: 'POP별',
						children: (
							<TmDispatchListPop
								data={gridData}
								totalCnt={totalCnt}
								onLoadMore={throttledLoadMoreData}
								customerCurrentPage={customerCurrentPage}
							/>
						),
					},
					{
						key: 'area',
						label: '권역별',
						children: (
							<TmDispatchListArea
								data={gridData}
								totalCnt={totalCnt}
								onLoadMore={throttledLoadMoreData}
								customerCurrentPage={customerCurrentPage}
							/>
						),
					},
					{
						key: 'history',
						label: '차량 변경내역',
						children: (
							<TmDispatchListHistory
								data={gridData}
								totalCnt={totalCnt}
								onLoadMore={throttledLoadMoreData}
								customerCurrentPage={customerCurrentPage}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default TmDispatchList;
