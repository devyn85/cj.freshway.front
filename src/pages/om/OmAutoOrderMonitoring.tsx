/*
 ############################################################################
 # FiledataField	: OmAutoOrderMonitoring.tsx
 # Description		: 시스템운영 > 시스템운영현황 > 자동발주 모니터링
 # Author			: JiSooKim
 # Since			: 2025.08.12
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';

//Api
// import { apiPostMasterList } from '@/api/om/apiOmAutoOrderMonitoring';
import { apiGetMasterList } from '@/api/om/apiOmAutoOrderMonitoring';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { getCommonCodeList } from '@/store/core/comCodeStore';
// import { getCommonCodeList } from '@/store/core/comCodeStore';

//Util
import OmAutoOrderMonitoringDetail from '@/components/om/autoOrderMonitoring/OmAutoOrderMonitoringDetail';
import OmAutoOrderMonitoringSearch from '@/components/om/autoOrderMonitoring/OmAutoOrderMonitoringSearch';
import dayjs from 'dayjs';

// store

// lib
const OmAutoOrderMonitoring = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();

	const [gridData, setGridData] = useState([]);
	const [dataList, setDataList] = useState([]);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null,
		sku: null,
		skuName: null,
		stocktype: null,
		storagetype: null,
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 * @param {string} dt1 - 시작 납품일자
	 * @param {string} dt2 - 종료 납품일자
	 * @param {string} invoiceprinttype - 인쇄유형 (WD: 일반, CD: 세금계산서, SD: 매출전표)
	 */
	const searchMasterList = () => {
		refs.gridRef?.current?.clearGridData();
		refs.gridRef1?.current?.clearGridData();
		const params = {
			taskDtRt: dayjs(form.getFieldValue('taskDtRt')).format('YYYYMMDD'),
		};

		searchMasterListImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 * @param {any} params.gridData
	 * @param {any} params.dataList
	 */

	const searchMasterListImp = (params: any) => {
		// API 호출
		apiGetMasterList(params).then(res => {
			// const carGroupOptions = getCommonCodeList('PURCHASE_AUTOTIME', '전체');

			// setDataList(res.data);
			// setGridData(getCommonCodeList('PURCHASE_AUTOTIME', '전체'));

			setGridData(getCommonCodeList('PURCHASE_AUTOTIME', '전체'));
			setDataList(res.data);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmAutoOrderMonitoringSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<OmAutoOrderMonitoringDetail ref={refs} form={form} data={gridData} dataList={dataList} />
		</>
	);
};

export default OmAutoOrderMonitoring;
/**
 *
 * @param {any} arg0
 * @param {any} arg0.gridData
 * @param {any} arg0.dataList
 */
