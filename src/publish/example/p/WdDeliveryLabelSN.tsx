// Lib
import { Form, Tabs } from 'antd';
import { useSelector } from 'react-redux';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
// import WdDeliveryLabelSNSearch from '@/components/om/inplanMonitoring/WdDeliveryLabelSNSearch';
// import WdDeliveryLabelSNTab1 from '@/components/om/inplanMonitoring/WdDeliveryLabelSNTab1';
// import WdDeliveryLabelSNTab2 from '@/components/om/inplanMonitoring/WdDeliveryLabelSNTab2';
// import WdDeliveryLabelSNTab3 from '@/components/om/inplanMonitoring/WdDeliveryLabelSNTab3';

// API Call Function
// import { getTotalMasterList } from '@/api/om/apiWdDeliveryLabelSN';
import dayjs from 'dayjs';

// Hooks

const WdDeliveryLabelSN = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const { TabPane } = Tabs;

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// grid data Tab순서대로
	// const [gridData1, setGridData1] = useState([]);
	// const [gridData2, setGridData2] = useState([]);
	// const [gridData3, setGridData3] = useState([]);

	// 그리드 접근을 위한 Ref Tab순서대로
	// const gridRef1 = useRef(null);
	// const gridRef2 = useRef(null);
	// const gridRef3 = useRef(null);

	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: gDccode,
		deliveryDt: dayjs(),
		custOrderCloseType: null,
		channel: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// const searchMasterList = () => {
	// 	switch (activeKey) {
	// 		case '1':
	// 			searchTab1List();
	// 			break;
	// 		case '2':
	// 			searchTab2List();
	// 			break;
	// 		case '3':
	// 			searchTab3List();
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// };

	// /**
	//  * Tab1 조회
	//  * @returns {void}
	//  */
	// const searchTab1List = () => {
	// 	//상세 영역 초기화
	// 	setGridData1([]);

	// 	// 조회 조건 설정
	// 	const params = {
	// 		...form.getFieldsValue(),
	// 		deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
	// 	};

	// 	// API 호출
	// 	getTotalMasterList(params).then(res => {
	// 		setGridData1(res.data);
	// 	});
	// };

	// /**
	//  * Tab2 조회
	//  * @returns {void}
	//  */
	// const searchTab2List = () => {
	// 	//상세 영역 초기화
	// 	setGridData2([]);

	// 	// 조회 조건 설정
	// 	const params = form.getFieldsValue();

	// 	// API 호출
	// 	getTotalMasterList(params).then(res => {
	// 		setGridData2(res.data);
	// 	});
	// };

	// /**
	//  * Tab3 조회
	//  * @returns {void}
	//  */
	// const searchTab3List = () => {
	// 	//상세 영역 초기화
	// 	setGridData3([]);

	// 	// 조회 조건 설정
	// 	const params = form.getFieldsValue();

	// 	// API 호출
	// 	getTotalMasterList(params).then(res => {
	// 		setGridData3(res.data);
	// 	});
	// };

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKey(key);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			{/* <MenuTitle func={titleFunc} /> */}

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				{/* <WdDeliveryLabelSNSearch form={form} activeKey={activeKey} /> */}
			</SearchFormResponsive>

			<Tabs activeKey={activeKey} onTabClick={tabClick}>
				<TabPane tab="분류표생성" key="1">
					11
					{/* <WdDeliveryLabelSNTab1 gridRef={gridRef1} data={gridData1} /> */}
				</TabPane>
				<TabPane tab="분류표출력" key="2">
					22
					{/* <WdDeliveryLabelSNTab2 gridRef={gridRef2} data={gridData2} /> */}
				</TabPane>
				<TabPane tab="회수리스트" key="3">
					33
					{/* <WdDeliveryLabelSNTab3 gridRef={gridRef3} data={gridData3} /> */}
				</TabPane>
			</Tabs>
		</>
	);
};
export default WdDeliveryLabelSN;
