/*
 ############################################################################
 # FiledataField	: StStockLotMonitoring.tsx
 # Description		: 재고 > 재고현황 > 유통기한점검
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiGetDurationList, apiGetMasterList, apiGetStoragetypeList } from '@/api/st/apiStStockLotMonitoring';
import StStockLotMonitoringDetail from '@/components/st/stockLotMonitoring/StStockLotMonitoringDetail';
import StStockLotMonitoringSearch from '@/components/st/stockLotMonitoring/StStockLotMonitoringSearch';

// lib

const StStockLotMonitoring = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const gridRef = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);

	const [activeTabKey, setActiveTabKey] = useState('1');

	// 기타(4/4)
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		stocktype: 'GOOD' /* 재고 위치 */,
		stockgrade: 'STD' /* 재고 속성 */,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		const params = form.getFieldsValue();
		const searchZone = form.getFieldValue('zone');
		params.zone = searchZone ? String(searchZone) : null;

		if (activeTabKey === '1') {
			gridRef.current?.clearGridData();
			apiGetMasterList(params).then(res => {
				setTotalCnt(res.data.length);
				if (res.data != null && res.data.length > 0) {
					setGridData(res.data);
				}
			});
		} else if (activeTabKey === '2') {
			gridRef2.current?.clearGridData();
			apiGetDurationList(params).then(res => {
				setTotalCnt2(res.data.length);
				if (res.data != null && res.data.length > 0) {
					setGridData2(res.data);
				}
			});
		} else if (activeTabKey === '3') {
			gridRef3.current?.clearGridData();
			apiGetStoragetypeList(params).then(res => {
				setTotalCnt3(res.data.length);
				if (res.data != null && res.data.length > 0) {
					setGridData3(res.data);
				}
			});
		}
	};

	/**
	 * 공통버튼 클릭
	 */
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
				<StStockLotMonitoringSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockLotMonitoringDetail
				ref={gridRef}
				gridRef2={gridRef2}
				gridRef3={gridRef3}
				form={form}
				gridData={gridData}
				totalCnt={totalCnt}
				gridData2={gridData2}
				totalCnt2={totalCnt2}
				gridData3={gridData3}
				totalCnt3={totalCnt3}
				activeTabKey={activeTabKey}
				setActiveTabKey={setActiveTabKey}
			/>
		</>
	);
};

export default StStockLotMonitoring;
