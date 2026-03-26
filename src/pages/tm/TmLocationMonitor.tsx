/*
 ############################################################################
 # FiledataField	: TmLocationMonitor.tsx
 # Description		: 지표모니터링 > 차량관제 > 차량위치모니터링
 # Author			: BS.kim
 # Since			: 2025.09.08
 ############################################################################
 */
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmLocationMonitorLeftDetail from '@/components/tm/LocationMonitor/TmLocationMonitorLeftDetail';
import TmLocationMonitorRightDetail from '@/components/tm/LocationMonitor/TmLocationMonitorRightDetail';
import TmLocationMonitorSearch from '@/components/tm/LocationMonitor/TmLocationMonitorSearch';

// API
import {
	apiTmLocationMonitorPopupPostGetVehicleCustomerList,
	apiTmLocationMonitorPopupPostGetVehicleInfo,
	apiTmLocationMonitorPostGetActualRouteList,
	apiTmLocationMonitorPostGetCustomerLocationList,
	apiTmLocationMonitorPostGetPlanRouteList,
	apiTmLocationMonitorPostGetVehicleConditionCountList,
	apiTmLocationMonitorPostGetVehicleDetailMonitoringList,
	apiTmLocationMonitorPostGetVehicleGroupMonitoringList,
	apiTmLocationMonitorPostGetVehicleLocationList,
	apiTmLocationMonitorPostGetVehicleMonitoringList,
	apiTmLocationMonitorPostGetVehicleStatusCountList,
	apiTmLocationMonitorPostGetVehicleStatusList,
	type MonitorType,
} from '@/api/tm/apiTmLocationMonitor';

// Util
import commUtil from '@/util/commUtil';

// Store
import {
	ActualRouteItem,
	CustomerLocationItem,
	LocationMonitorSearchForm,
	PlanRouteItem,
	PopupVehicleCustomerItem,
	SummaryDataItem,
	VehicleCenterListItem,
	VehicleConditionCountItem,
	VehicleLocationItem,
	VehicleShippingStatusItem,
} from '@/types/tm/locationMonitor';
import _ from 'lodash';

interface DefaultSearchValues {
	deliverydt: string | null;
	dccode: string;
	contracttype: string[];
	tmDeliverytype: string | null;
	carnoList: string[] | null;
}

interface VehicleDetailSearchContext {
	deliverydt: string;
	tmDeliverytype: string;
	monitorType: MonitorType | undefined;
	isCarrier: boolean;
}

const MAIN_NUMBER_ONLY_CONTRACT_TYPES = ['DELIVERY', 'MONTHLY', 'FIX', 'FIXTEMPORARY', 'TEMPORARY'];

interface ShowMainNumberOnlyParams {
	contracttype?: string[] | null;
	carno?: string | null;
}

interface BuildFallbackCenterListParams {
	prevDataList: VehicleCenterListItem[];
	dccode?: string;
}

// 파일 정의
/**
 * 배송유형에 따른 모니터링 타입 반환
 * @param {string} tmDeliverytype - 배송유형 코드 (1: 배송, 7: 수송, 3: 조달(일배), 4: 조달(저장))
 * @returns {MonitorType | undefined} 수송(7)일 경우 'carrier', 그 외 undefined
 */
const getMonitorType = (tmDeliverytype?: string): MonitorType | undefined => {
	return tmDeliverytype === '7' ? 'carrier' : undefined;
};

const findSubRowByDeliveryStatus = (
	conditionData: VehicleConditionCountItem[],
	deliveryStatus: string,
): VehicleConditionCountItem | undefined => {
	return conditionData.find(row => row.deliveryStatus === deliveryStatus);
};

const buildSummaryData = (
	statusData: VehicleConditionCountItem[],
	conditionData: VehicleConditionCountItem[],
): SummaryDataItem[] => {
	return statusData.map(row => {
		const findSubRow = findSubRowByDeliveryStatus(conditionData, row.deliveryStatus);
		return { ...row, subCnt: findSubRow?.cnt || 0 };
	});
};

const filterDccarGroupsByDccode = (dcCarGroup: any[], dccode: string): any[] => {
	return dcCarGroup.filter(dccarRow => dccarRow.dccode === dccode);
};

const mapCarGroupItem = (dccarGroupItem: any, threeDepthGroup: Record<string, any[]>) => {
	const groupKey = `${dccarGroupItem.dccode}@${dccarGroupItem.cargroup}`;
	return {
		groupNo: dccarGroupItem.cargroup,
		carCount: dccarGroupItem.cnt,
		cargroupName: dccarGroupItem.cargroupName,
		shippingStatusList: threeDepthGroup?.[groupKey] || [],
	};
};

const isShowMainNumberOnly = (params: ShowMainNumberOnlyParams) => {
	const contracttype = params.contracttype || [];
	const carno = params.carno || '';
	const isAllContractType =
		contracttype.length === MAIN_NUMBER_ONLY_CONTRACT_TYPES.length &&
		MAIN_NUMBER_ONLY_CONTRACT_TYPES.every(type => contracttype.includes(type));
	const isCarnoEmpty = carno === '' || carno === null || carno === undefined;
	return isAllContractType && isCarnoEmpty;
};

const getStatusCountByDeliveryStatus = (
	statusCountData: VehicleConditionCountItem[] | undefined,
	deliveryStatus: string,
): number | null => {
	if (!statusCountData) return null;
	const statusRow = statusCountData.find(row => row.deliveryStatus === deliveryStatus);
	return typeof statusRow?.cnt === 'number' ? statusRow.cnt : null;
};

const shouldKeepCenterFrameWhenEmpty = (
	searchParams: ShowMainNumberOnlyParams,
	statusCountData: VehicleConditionCountItem[] | undefined,
): boolean => {
	const allStatusCount = getStatusCountByDeliveryStatus(statusCountData, '00');
	const hasAllStatusCount = allStatusCount !== null && allStatusCount >= 0;
	return !isShowMainNumberOnly(searchParams) && hasAllStatusCount;
};

const buildFallbackCenterList = ({ prevDataList, dccode }: BuildFallbackCenterListParams): VehicleCenterListItem[] => {
	if (!dccode) return [];

	const prevCenter = prevDataList.find(row => row.dccode === dccode);
	return [
		{
			centerNm: prevCenter?.centerNm || dccode,
			carCount: 0,
			dccode,
			list: [],
		},
	];
};

const buildVehicleListData = (
	dcGroup: any[],
	dcCarGroup: any[],
	threeDepthGroup: Record<string, any[]>,
): VehicleCenterListItem[] => {
	const rtnList: VehicleCenterListItem[] = [];

	dcGroup.forEach(masterDepthRow => {
		const findDccarGroups = filterDccarGroupsByDccode(dcCarGroup, masterDepthRow.dccode);
		if (findDccarGroups.length > 0) {
			rtnList.push({
				centerNm: masterDepthRow.dcname,
				carCount: masterDepthRow.cnt,
				dccode: masterDepthRow.dccode,
				list: findDccarGroups.map(item => mapCarGroupItem(item, threeDepthGroup)),
			});
		}
	});

	return rtnList;
};

/**
 * 차량위치모니터링 메인 컴포넌트
 * @returns {React.FC} 차량위치모니터링 컴포넌트
 */
const TmLocationMonitor: React.FC = () => {
	/**
	 * =====================================================================
	 *  01. 상태 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm<LocationMonitorSearchForm>();

	// search/list state
	const [summData, setSummData] = useState<SummaryDataItem[]>([]); // 요약 데이터
	const [dataList, setDataList] = useState<VehicleCenterListItem[]>([]); // 목록 데이터

	// map/detail state
	const [selectedCarRouteData, setSelectedCarRouteData] = useState<ActualRouteItem[]>(null); // 선택된 차량의 실제 경로 데이터
	const [selectedCarCustomerLocationData, setSelectedCarCustomerLocationData] = useState<{
		locations: CustomerLocationItem[];
		customers: PopupVehicleCustomerItem[];
	} | null>(null); // 선택된 차량의 실착지 위치 데이터
	const [selectedCarPlanRouteData, setSelectedCarPlanRouteData] = useState<PlanRouteItem[]>(null); // 선택된 차량의 계획 경로 데이터
	const [selectedCarLocationData, setSelectedCarLocationData] = useState<VehicleLocationItem[]>(null); // 선택된 차량의 위치 데이터
	const [allVehicleLocationData, setAllVehicleLocationData] = useState<any>(null); // 모든 차량의 위치 데이터 (미선택 시)
	const [selectedVehiclePopupData, setSelectedVehiclePopupData] = useState<any>(null); // 선택된 차량의 팝업 데이터

	// selection state
	const [selectedVehicleInfo, setSelectedVehicleInfo] = useState<VehicleShippingStatusItem | null>(null); // 선택된 차량 정보 (하이라이트용)
	const [selectedVehiclePriority, setSelectedVehiclePriority] = useState<number>(1); // 선택된 차량의 우선순위
	const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined); // 선택된 주문 ID (custKey)

	const lastMarkerClickRef = useRef(0);

	// initial/default search value
	const defaultDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const defaultSearchValues = useMemo<DefaultSearchValues>(
		() => ({
			deliverydt: null, // 배송일자
			dccode: defaultDccode, // 센터
			contracttype: ['FIX', 'FIXTEMPORARY', 'TEMPORARY'],
			tmDeliverytype: null, // 배송유형
			carnoList: null, // 키워드검색
		}),
		[defaultDccode],
	);

	/**
	 * =====================================================================
	 *  02. 데이터 조회 파이프라인
	 * =====================================================================
	 */
	const resetSelectionDetailState = () => {
		setSelectedCarRouteData(null);
		setSelectedCarCustomerLocationData(null);
		setSelectedCarPlanRouteData(null);
		setSelectedCarLocationData(null);
		setSelectedVehiclePopupData(null);
		setSelectedVehicleInfo(null);
		setSelectedVehiclePriority(1);
	};

	const loadSearchResult = async (params: LocationMonitorSearchForm) => {
		const monitorType = getMonitorType(params.tmDeliverytype);

		const conditionCountPromise = apiTmLocationMonitorPostGetVehicleConditionCountList(params, monitorType);
		const statusCountPromise = apiTmLocationMonitorPostGetVehicleStatusCountList(params, monitorType);
		const vehicleStatusPromise = apiTmLocationMonitorPostGetVehicleStatusList(params, monitorType);

		const summaryResponses = {
			conditionCount: await conditionCountPromise,
			statusCount: await statusCountPromise,
			vehicleStatus: await vehicleStatusPromise,
		};

		if (summaryResponses.statusCount.statusCode === 0) {
			const nextSummData = buildSummaryData(summaryResponses.statusCount.data, summaryResponses.conditionCount.data);
			setSummData(nextSummData);
		}
		if (summaryResponses.vehicleStatus.statusCode === 0) {
			setAllVehicleLocationData(summaryResponses.vehicleStatus.data);
		}

		const centerGroupPromise = apiTmLocationMonitorPostGetVehicleMonitoringList(params, monitorType);
		const carGroupPromise = apiTmLocationMonitorPostGetVehicleGroupMonitoringList(params, monitorType);
		const detailListPromise = apiTmLocationMonitorPostGetVehicleDetailMonitoringList(
			{
				...params,
				cargroup: '',
			},
			monitorType,
		);
		const vehicleListResponses = {
			centerGroup: await centerGroupPromise,
			carGroup: await carGroupPromise,
			detailList: await detailListPromise,
		};

		if (vehicleListResponses.centerGroup.statusCode === 0) {
			const dcGroup = vehicleListResponses.centerGroup.data;
			const dcCarGroup = vehicleListResponses.carGroup.data;
			const carList = vehicleListResponses.detailList.data;
			const threeDepthGroup = _.groupBy(carList, threeDepthRow => `${threeDepthRow.dccode}@${threeDepthRow.cargroup}`);
			const keepCenterFrameWhenEmpty = shouldKeepCenterFrameWhenEmpty(
				{
					contracttype: params.contracttype,
					carno: params.carno,
				},
				summaryResponses.statusCount.statusCode === 0 ? summaryResponses.statusCount.data : undefined,
			);

			const nextDataList = buildVehicleListData(dcGroup, dcCarGroup, threeDepthGroup);
			if (nextDataList.length > 0) {
				setDataList(nextDataList);
				return;
			}
			if (!keepCenterFrameWhenEmpty) {
				setDataList([]);
				return;
			}

			setDataList(prevDataList => buildFallbackCenterList({ prevDataList, dccode: params.dccode }));
		}
	};

	const loadSelectedVehicleDetail = async (
		vehicleInfo: VehicleShippingStatusItem,
		priority: number,
		searchContext: VehicleDetailSearchContext,
	) => {
		const actualRoutePromise = apiTmLocationMonitorPostGetActualRouteList(
			{
				carno: vehicleInfo.carno,
				dccode: vehicleInfo.dccode,
				deliverydt: searchContext.deliverydt,
				priority: priority.toString(),
				tmDeliverytype: searchContext.tmDeliverytype,
			},
			searchContext.monitorType,
		);

		const planRoutePromise = searchContext.isCarrier
			? Promise.resolve({ statusCode: 0, data: null })
			: apiTmLocationMonitorPostGetPlanRouteList({
					carno: vehicleInfo.carno,
					dccode: vehicleInfo.dccode,
					deliverydt: searchContext.deliverydt,
					tmDeliverytype: searchContext.tmDeliverytype,
					priority: priority.toString(),
			  });

		const vehicleLocationPromise = apiTmLocationMonitorPostGetVehicleLocationList(
			{
				carnoList: [vehicleInfo.carno],
				dccode: vehicleInfo.dccode,
				deliverydt: searchContext.deliverydt,
				tmDeliverytype: searchContext.tmDeliverytype,
				contracttype: [vehicleInfo.contracttype],
				cargroup: vehicleInfo.cargroup,
			},
			searchContext.monitorType,
		);

		const customerLocationPromise = apiTmLocationMonitorPostGetCustomerLocationList(
			{
				carno: vehicleInfo.carno,
				dccode: vehicleInfo.dccode,
				deliverydt: searchContext.deliverydt,
				priority: priority.toString(),
				tmDeliverytype: searchContext.tmDeliverytype,
			},
			searchContext.monitorType,
		);

		const popupHeaderPromise = apiTmLocationMonitorPopupPostGetVehicleInfo(
			{
				...vehicleInfo,
				deliverydt: searchContext.deliverydt,
				prepriority: priority.toString(),
				tmDeliverytype: searchContext.tmDeliverytype,
			},
			searchContext.monitorType,
		);
		const popupListPromise = apiTmLocationMonitorPopupPostGetVehicleCustomerList(
			{
				...vehicleInfo,
				deliverydt: searchContext.deliverydt,
				prepriority: priority.toString(),
				tmDeliverytype: searchContext.tmDeliverytype,
			},
			searchContext.monitorType,
		);

		const detailResponses = {
			route: await actualRoutePromise,
			plan: await planRoutePromise,
			location: await vehicleLocationPromise,
			customerLocations: await customerLocationPromise,
			popupHeader: await popupHeaderPromise,
			popupList: await popupListPromise,
		};

		if (detailResponses.route.statusCode === 0) setSelectedCarRouteData(detailResponses.route.data);
		if (detailResponses.plan.statusCode === 0) setSelectedCarPlanRouteData(detailResponses.plan.data);
		if (detailResponses.location.statusCode === 0) setSelectedCarLocationData(detailResponses.location.data);

		if (detailResponses.customerLocations.statusCode === 0 && detailResponses.popupList.statusCode === 0) {
			setSelectedCarCustomerLocationData({
				locations: detailResponses.customerLocations.data,
				customers: detailResponses.popupList.data,
			});
		}

		if (
			detailResponses.popupHeader.statusCode === 0 &&
			detailResponses.popupList.statusCode === 0 &&
			!commUtil.isEmpty(detailResponses.popupHeader.data)
		) {
			setSelectedVehiclePopupData({
				header: detailResponses.popupHeader.data,
				list: detailResponses.popupList.data,
			});
		} else {
			setSelectedVehiclePopupData(null);
		}
	};

	/**
	 * =====================================================================
	 *  03. 이벤트 핸들러
	 * =====================================================================
	 */
	/**
	 * 조회 핸들러
	 * @param {string} [deliveryStatus] - 요약 카드에서 선택한 배송상태
	 * @returns {Promise<void>}
	 */
	const handleSearch = async (deliveryStatus?: string): Promise<void> => {
		const isValid = await form
			.validateFields()
			.then(() => true)
			.catch(() => false);
		if (!isValid) return showAlert('', '필수 조회조건을 입력해주세요.');

		const params: any = {
			...defaultSearchValues,
			...form.getFieldsValue(),
		};

		const dateFormat = 'YYYYMMDD';

		params.deliverydt = dayjs(params.deliverydt).format(dateFormat);

		if (commUtil.isEmpty(params.type)) {
			params.type = 'ALL';
		}

		// deliveryStatus 인자가 있으면 폼 값보다 우선 적용
		if (deliveryStatus) {
			params.deliveryStatus = deliveryStatus;
		}
		params.carnoList = commUtil.isEmpty(params.carno) ? [] : params.carno.split(',');

		resetSelectionDetailState();
		loadSearchResult(params);
	};

	/**
	 * 차량 선택 핸들러
	 * @param {VehicleShippingStatusItem} vehicleInfo - 선택된 차량 정보
	 * @param {number} [priority] - 선택된 회차 (없으면 1회차)
	 */
	const handleSelectVehicle = async (vehicleInfo: VehicleShippingStatusItem, priority?: number) => {
		if (!vehicleInfo) {
			resetSelectionDetailState();
			return;
		}

		const currentPriority = priority ?? 1;
		setSelectedVehicleInfo(vehicleInfo);
		setSelectedVehiclePriority(currentPriority);

		const formValues = form.getFieldsValue();
		const rawDeliverydt = formValues.deliverydt;
		const deliverydt =
			rawDeliverydt && typeof rawDeliverydt === 'object' && (rawDeliverydt as any).format
				? (rawDeliverydt as any).format('YYYYMMDD')
				: rawDeliverydt || dayjs().format('YYYYMMDD');
		const tmDeliverytype = formValues.tmDeliverytype || '';
		const searchContext: VehicleDetailSearchContext = {
			deliverydt,
			tmDeliverytype,
			monitorType: getMonitorType(tmDeliverytype),
			isCarrier: tmDeliverytype === '7',
		};

		loadSelectedVehicleDetail(vehicleInfo, currentPriority, searchContext);
	};

	/**
	 * 주문 선택 핸들러 (지도 마커 포커싱용)
	 * @param {string | undefined} orderId - 선택된 주문의 custKey
	 */
	const handleSelectOrder = (orderId: string | undefined) => {
		lastMarkerClickRef.current = Date.now();
		setSelectedOrderId(orderId);
	};

	const handleResetPopup = () => {
		setSelectedVehiclePopupData(null);
		setSelectedVehiclePriority(1);
		setSelectedOrderId(undefined);
	};

	const titleFunc = {
		searchYn: handleSearch,
	};

	/**
	 * =====================================================================
	 *  04. react hook event
	 * =====================================================================
	 */

	// 초기 데이터 로드
	useEffect(() => {
		const mapDivId = 'divMap';
		const contentDivId = 'divContent';
		const tmapDivHeight = document.documentElement.clientHeight - 200 + 'px';
		const mapEl = document.getElementById(mapDivId);
		const contentEl = document.getElementById(contentDivId);
		mapEl.style.height = tmapDivHeight;
		contentEl.style.height = tmapDivHeight;

		if (summData.length === 0) {
			handleSearch();
		}
	}, []);

	useEffect(() => {
		if (selectedVehicleInfo && selectedVehiclePopupData !== null) {
			handleSelectVehicle(selectedVehicleInfo, selectedVehiclePriority);
		}
	}, [selectedVehiclePriority]);

	/**
	 * =====================================================================
	 *  05. jsx
	 * =====================================================================
	 */
	return (
		<>
			<div style={{ width: '95% !important' }}>
				<MenuTitle func={titleFunc} authority="searchYn" />
			</div>
			<div style={{ display: 'flex' }}>
				<div id="divContent" style={{ width: '500px', display: 'flex', flexDirection: 'column' }}>
					<SearchFormResponsive
						form={form}
						initialValues={defaultSearchValues}
						initialExpanded={true}
						groupClass={'grid-column-1'}
						hideToggleButton={true}
					>
						<TmLocationMonitorSearch form={form} />
					</SearchFormResponsive>
					<TmLocationMonitorLeftDetail
						form={form}
						summData={summData}
						data={dataList}
						search={handleSearch}
						onVehicleSelect={handleSelectVehicle}
						selectedVehicle={selectedVehicleInfo}
					/>
				</div>
				<TmLocationMonitorRightDetail
					routeData={selectedCarRouteData}
					customerLocationData={selectedCarCustomerLocationData}
					planRouteData={selectedCarPlanRouteData}
					carLocationData={selectedCarLocationData}
					allVehicleLocationData={allVehicleLocationData}
					onVehicleSelect={handleSelectVehicle}
					selectedVehicle={selectedVehicleInfo}
					searchParams={form.getFieldsValue()}
					selectedOrderId={selectedOrderId}
					lastMarkerClickTime={lastMarkerClickRef.current}
					onOrderClick={handleSelectOrder}
					popupData={selectedVehiclePopupData}
					onChangePriority={setSelectedVehiclePriority}
					onReset={handleResetPopup}
				/>
			</div>
		</>
	);
};

export default TmLocationMonitor;
