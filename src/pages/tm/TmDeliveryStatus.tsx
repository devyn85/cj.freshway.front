/*
 ############################################################################
 # FiledataField	: TmDeliveryStatus.tsx
 # Description		: 모니터링 > 배송 > 배송현황
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
 */
// Lib
import { Form, Tabs } from 'antd';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmDeliveryStatusByCarListGrid from '@/components/tm/deliveryStatus/TmDeliveryStatusByCarListGrid';
import TmDeliveryStatusByCarSearch from '@/components/tm/deliveryStatus/TmDeliveryStatusByCarSearch';
import TmDeliveryStatusByCustomerListGrid from '@/components/tm/deliveryStatus/TmDeliveryStatusByCustomerListGrid';
import TmDeliveryStatusByCustomerSearch from '@/components/tm/deliveryStatus/TmDeliveryStatusByCustomerSearch';
import TmDeliveryStatusByRouteListGrid from '@/components/tm/deliveryStatus/TmDeliveryStatusByRouteListGrid';
import TmDeliveryStatusByRouteSearch from '@/components/tm/deliveryStatus/TmDeliveryStatusByRouteSearch';

// API
import {
	apiTmDeliveryStatusByCarDayList,
	apiTmDeliveryStatusByCarMonthList,
	apiTmDeliveryStatusByCustomerList,
	apiTmDeliveryStatusByRouteList,
} from '@/api/tm/apiTmDeliveryStatus';

// Util
import commUtil from '@/util/commUtil';

// Store

// 파일 정의
const TmDeliveryStatus = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 변수 정의(1/4)
	const [byRouteform] = Form.useForm();
	const [byCustomerform] = Form.useForm();
	const [byCarform] = Form.useForm();

	const [activeKey, setActiveKey] = useState('byRoute');

	// React Ref 정의(2/4)
	const byRouteRefs: any = useRef(null);
	const byCustomerRefs: any = useRef(null);
	const byCarDayRefs: any = useRef(null);
	const byCarMonthRefs: any = useRef(null);
	const byCarDetailRefs: any = useRef(null);
	const byCarListGridRef: any = useRef(null);

	// 초기값 정의(3/4)
	const [byRouteSearchBox] = useState({
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode), // 센터
		deliverydt: null, // 배송일자
		carnoList: [], // 차량번호/기사
	}); // 검색영역-경로별
	const [byRouteGridData, setByRouteGridData] = useState([]); // 경로별-그리드
	const [byRouteTotalCount, setByRouteTotalCount] = useState(null); // 경로별-총row개수

	const [byCustomerSearchBox] = useState({
		deliverydt: null, // 배송일자
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode), // 센터
		contracttype: null, // 계약유형
		tmDeliverytype: null, // POP
		carno: null, // 차량번호/기사
	}); // 검색영역-거래처별
	const [byCustomerGridData, setByCustomerGridData] = useState([]); // 거래처별-그리드
	const [byCustomerTotalCount, setByCustomerTotalCount] = useState(null); // 거래처별-총row개수

	const [byCarSearchBox] = useState({
		deliverydt: null, // 배송일자
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode), // 센터
	}); // 검색영역-차량별
	const [byCarDayGridData, setByCarDayGridData] = useState([]); // 차량별-그리드(당일)
	const [byCarMonthGridData, setByCaMonthrGridData] = useState([]); // 차량별-그리드(당월)
	const [byCarDayCount, setByCarDayCount] = useState(null); // 당일일-총row개수
	const [byCarMonthCount, setByCarMonthCount] = useState(null); // 당월월-총row개수

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 	조회
	 */
	const searchList = async () => {
		if (activeKey === 'byRoute') {
			/**
			 * @description : 경로별
			 * @param {string} dccode - 센터
			 * @param {string} deliverydt - 배송일자
			 * @param {string} carnoList - 키워드검색(차량번호, 기사)
			 */

			await byRouteform.validateFields();

			const params = byRouteform.getFieldsValue();
			params.deliverydt = commUtil.isEmpty(params.deliverydtOri) ? '' : params.deliverydtOri.format('YYYYMMDD'); // 배송일자

			byRouteRefs.current?.clearGridData();
			setByRouteTotalCount(null);

			apiTmDeliveryStatusByRouteList(params).then(res => {
				if (res.statusCode === 0) {
					setByRouteTotalCount(res.data.totalCount);
					setByRouteGridData(res.data.list);
					byRouteRefs.current?.setGridData(res.data.list);
					setTimeout(() => {
						if (res.data.list.length > 0) {
							const colSizeList = byRouteRefs.current.getFitColumnSizeList(true);
							byRouteRefs.current.setColumnSizeList(colSizeList);
						}
					}, 10);
				}
			});
		} else if (activeKey === 'byCustomer') {
			/**
			 * @description : 거래처별
			 * @param {string} dccode - 센터
			 * @param {string} deliverydt - 배송일자
			 * @param {string} contracttype - 계약유형(: 지입, : 고정, : 임시, : 실비)
			 * @param {string} tmDeliverytype - 배송유형(: 배송, : 조달, : 수송)
			 * @param {string} carno - 키워드검색(차량번호, 기사)
			 */

			await byCustomerform.validateFields();

			const params = byCustomerform.getFieldsValue();
			params.deliverydt = commUtil.isEmpty(params.deliverydtOri) ? '' : params.deliverydtOri.format('YYYYMMDD'); // 배송일자
			params.carnoList = commUtil.isEmpty(params.carnoList)
				? []
				: params.carnoList.indexOf(',') > -1
				? params.carnoList.split(',')
				: [params.carnoList]; // 차량번호/기사
			params.popnoList = commUtil.isEmpty(params.popno)
				? []
				: params.popno.indexOf(',') > -1
				? params.popno.split(',')
				: [params.popno];

			byCustomerRefs.current?.clearGridData();
			setByCustomerTotalCount(null);

			apiTmDeliveryStatusByCustomerList(params).then(res => {
				if (res.statusCode === 0) {
					setByCustomerTotalCount(res.data.totalCount);
					setByCustomerGridData(res.data.list);
					byCustomerRefs.current?.setGridData(res.data.list);
					setTimeout(() => {
						if (res.data.list.length > 0) {
							const colSizeList = byCustomerRefs.current.getFitColumnSizeList(true);
							byCustomerRefs.current.setColumnSizeList(colSizeList);
						}
					}, 10);
				}
			});
		} else if (activeKey === 'byCar') {
			/**
			 * @description : 차량별
			 * @param {string} dccode - 센터
			 * @param {string} deliverydt - 배송일자
			 */

			await byCarform.validateFields();

			const params = byCarform.getFieldsValue();
			params.deliverydt = commUtil.isEmpty(params.deliverydtOri) ? '' : params.deliverydtOri.format('YYYYMMDD'); // 배송일자
			params.carnoList = commUtil.isEmpty(params.carnoList)
				? []
				: params.carnoList.indexOf(',') > -1
				? params.carnoList.split(',')
				: [params.carnoList]; // 차량번호/기사

			byCarDayRefs.current?.clearGridData();
			byCarMonthRefs.current?.clearGridData();
			byCarDetailRefs.current?.clearGridData();
			setByCarDayCount(null);
			setByCarMonthCount(null);

			axios.all([apiTmDeliveryStatusByCarDayList(params), apiTmDeliveryStatusByCarMonthList(params)]).then(result => {
				// 당일
				if (result[0].statusCode === 0) {
					setByCarDayGridData(result[0].data);
					byCarDayRefs.current?.setGridData(result[0].data);
					setByCarDayCount(result[0].data.length);
					if (result[0].data?.length) {
						byCarListGridRef.current?.searchDetailList?.(result[0].data[0]);
					}
					setTimeout(() => {
						if (result[0].data.length > 0) {
							const colSizeList = byCarDayRefs.current.getFitColumnSizeList(true);
							byCarDayRefs.current.setColumnSizeList(colSizeList);
						}
					}, 10);
				}
				// 당월
				if (result[1].statusCode === 0) {
					setByCaMonthrGridData(result[1].data);
					byCarMonthRefs.current?.setGridData(result[1].data);
					setByCarMonthCount(result[1].data.length);
					setTimeout(() => {
						if (result[1].data.length > 0) {
							const colSizeList = byCarMonthRefs.current.getFitColumnSizeList(true);
							byCarMonthRefs.current.setColumnSizeList(colSizeList);
						}
					}, 10);
				}
			});
		}
	};

	const titleFunc = {
		searchYn: searchList,
	};

	/**
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 * @param key
	 */
	return (
		<>
			{/* 메뉴 영역 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 */}
			<div style={{ display: activeKey === 'byRoute' ? 'block' : 'none' }}>
				<SearchFormResponsive
					key={1}
					form={byRouteform}
					initialValues={byRouteSearchBox}
					initialExpanded={true}
					groupClass={'grid-column-4'}
				>
					<TmDeliveryStatusByRouteSearch form={byRouteform} />
				</SearchFormResponsive>
			</div>
			<div style={{ display: activeKey === 'byCustomer' ? 'block' : 'none' }}>
				<SearchFormResponsive
					key={2}
					form={byCustomerform}
					initialValues={byCustomerSearchBox}
					initialExpanded={true}
					groupClass={'grid-column-4'}
				>
					<TmDeliveryStatusByCustomerSearch form={byCustomerform} />
				</SearchFormResponsive>
			</div>
			<div style={{ display: activeKey === 'byCar' ? 'block' : 'none' }}>
				<SearchFormResponsive
					key={3}
					form={byCarform}
					initialValues={byCarSearchBox}
					initialExpanded={true}
					groupClass={'grid-column-4'}
				>
					<TmDeliveryStatusByCarSearch form={byCarform} />
				</SearchFormResponsive>
			</div>

			{/* 탭 */}
			<Tabs
				activeKey={activeKey}
				onChange={(key: string) => {
					let beforeForm = {};
					if (activeKey === 'byRoute') {
						beforeForm = byRouteform.getFieldsValue();
					} else if (activeKey === 'byCustomer') {
						beforeForm = byCustomerform.getFieldsValue();
					} else if (activeKey === 'byCar') {
						beforeForm = byCarform.getFieldsValue();
					}

					byRouteform.setFieldsValue({ ...beforeForm });
					byCustomerform.setFieldsValue({ ...beforeForm });
					byCarform.setFieldsValue({ ...beforeForm });

					setActiveKey(key);
					if (key === 'byRoute') {
						byRouteRefs.current?.resize();
					} else if (key === 'byCustomer') {
						byCustomerRefs.current?.resize();
					} else if (key === 'byCar') {
						byCarDayRefs.current?.resize();
						byCarMonthRefs.current?.resize();
						byCarDetailRefs.current?.resize();
					}
				}}
				className="h100"
				style={{ paddingBottom: '20px' }}
				items={[
					{
						key: 'byRoute',
						label: '경로별',
						children: (
							<TmDeliveryStatusByRouteListGrid
								gridData={byRouteGridData}
								totalCount={byRouteTotalCount}
								gridRef={byRouteRefs}
								searchList={searchList}
								form={byRouteform}
							/>
						),
					},
					{
						key: 'byCustomer',
						label: '거래처별',
						children: (
							<TmDeliveryStatusByCustomerListGrid
								gridData={byCustomerGridData}
								totalCount={byCustomerTotalCount}
								gridRef={byCustomerRefs}
								searchList={searchList}
								form={byCustomerform}
							/>
						),
					},
					{
						key: 'byCar',
						label: '차량별',
						children: (
							<TmDeliveryStatusByCarListGrid
								ref={byCarListGridRef}
								gridData={[byCarDayGridData, byCarMonthGridData]}
								dayCount={byCarDayCount}
								monthCount={byCarMonthCount}
								gridDayRef={byCarDayRefs}
								gridMonthRef={byCarMonthRefs}
								gridDetailRef={byCarDetailRefs}
								searchList={searchList}
								form={byCarform}
								isActive={activeKey === 'byCar'}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default TmDeliveryStatus;
