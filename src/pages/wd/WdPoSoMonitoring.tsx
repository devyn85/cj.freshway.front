/*
 ############################################################################
 # FiledataField	: WdPoSoMonitoring.tsx
 # Description		: 출고 > 출고현황 > 일배PO/SO연결모니터링
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdPoSoMonitoringDetail from '@/components/wd/poSoMonitoring/WdPoSoMonitoringDetail';
import WdPoSoMonitoringSearch from '@/components/wd/poSoMonitoring/WdPoSoMonitoringSearch';

// API

// Hooks

// Utils
import { apiSearchWdPoSoMonitoringList } from '@/api/wd/apiWdPoSoMonitoring';
import dayjs from 'dayjs';

// Store

const WdPoSoMonitoring = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const requestParams = {};
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [dt, setDt] = useState(() => dayjs());
	const [gridData, setGridData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: null,
		slipdt: dt,
	}); // 검색영역 초기값

	// 기타(4/4)

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		refs.gridRef2.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.slipdt)) {
			showAlert('', '전표일자를 선택해주세요.');
			return;
		}
		params.slipdt = params.slipdt.format('YYYYMMDD');

		apiSearchWdPoSoMonitoringList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});
	};
	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdPoSoMonitoringSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdPoSoMonitoringDetail ref={refs} data={gridData} totalCount={totalCount} />
		</>
	);
};

export default WdPoSoMonitoring;
