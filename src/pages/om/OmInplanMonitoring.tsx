/*
 ############################################################################
 # FiledataField	: OmInplanMonitoring.tsx
 # Description		: 주문 > 주문현황 > 주문수신모니터링
 # Author			: jangjaehyun
 # Since			: 25.07.09
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';
import { useSelector } from 'react-redux';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmInplanMonitoringSearch from '@/components/om/inplanMonitoring/OmInplanMonitoringSearch';
import OmInplanMonitoringTab1 from '@/components/om/inplanMonitoring/OmInplanMonitoringTab1';
import OmInplanMonitoringTab2 from '@/components/om/inplanMonitoring/OmInplanMonitoringTab2';
import OmInplanMonitoringTab3 from '@/components/om/inplanMonitoring/OmInplanMonitoringTab3';
import OmInplanMonitoringTab4 from '@/components/om/inplanMonitoring/OmInplanMonitoringTab4';
import OmInplanMonitoringTab5 from '@/components/om/inplanMonitoring/OmInplanMonitoringTab5';

// API Call Function
import {
	getChkFsMasterList,
	getChkRsltFsMasterList,
	getCloseWdMasterList,
	getCustCloseTypeMasterList,
	getTotalMasterList,
} from '@/api/om/apiOmInplanMonitoring';
import TabsArray from '@/components/common/TabsArray';
import dayjs from 'dayjs';

// Hooks

const OmInplanMonitoring = () => {
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
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [gridData5, setGridData5] = useState([]);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);
	const gridRef4 = useRef(null);
	const gridRef5 = useRef(null);

	const detailGridRef1 = useRef(null);
	const detailGridRef2 = useRef(null);
	const detailGridRef3 = useRef(null);
	const detailGridRef4 = useRef(null);
	const detailGridRef5 = useRef(null);

	const detail2GridRef4 = useRef(null);
	const detail2GridRef5 = useRef(null);

	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		deliveryDt: dayjs(),
		custOrderCloseType: null,
		channel: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = () => {
		switch (activeKey) {
			case '1':
				searchTab1List();
				break;
			case '2':
				searchTab2List();
				break;
			case '3':
				searchTab3List();
				break;
			case '4':
				searchTab4List();
				break;
			case '5':
				searchTab5List();
				break;
			default:
				break;
		}
	};

	/**
	 * Tab1 조회
	 * @returns {void}
	 */
	const searchTab1List = () => {
		//상세 영역 초기화
		setGridData1([]);

		// 조회 조건 설정
		const params = {
			...form.getFieldsValue(),
			deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
		};

		// API 호출
		getTotalMasterList(params).then(res => {
			setGridData1(res.data);
		});
	};

	/**
	 * Tab2 조회
	 * @returns {void}
	 */
	const searchTab2List = () => {
		//상세 영역 초기화
		setGridData2([]);

		// 조회 조건 설정
		const params = {
			...form.getFieldsValue(),
			deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
		};

		// API 호출
		getCustCloseTypeMasterList(params).then(res => {
			setGridData2(res.data);
		});
	};

	/**
	 * Tab3 조회
	 * @returns {void}
	 */
	const searchTab3List = () => {
		//상세 영역 초기화
		setGridData3([]);

		// 조회 조건 설정
		const params = {
			...form.getFieldsValue(),
			deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
		};

		// API 호출
		getCloseWdMasterList(params).then(res => {
			setGridData3(res.data);
		});
	};

	/**
	 * Tab4 조회
	 * @returns {void}
	 */
	const searchTab4List = () => {
		//상세 영역 초기화
		setGridData4([]);

		// 조회 조건 설정
		const params = {
			...form.getFieldsValue(),
			deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
		};

		// API 호출
		getChkFsMasterList(params).then(res => {
			setGridData4(res.data);
		});
	};

	/**
	 * Tab5 조회
	 * @returns {void}
	 */
	const searchTab5List = () => {
		//상세 영역 초기화
		setGridData5([]);

		// 조회 조건 설정
		const params = {
			...form.getFieldsValue(),
			deliveryDt: form.getFieldValue('deliveryDt') ? form.getFieldValue('deliveryDt').format('YYYYMMDD') : '',
		};

		// API 호출
		getChkRsltFsMasterList(params).then(res => {
			setGridData5(res.data);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveKey('1');
			gridRef1.current.resize('100%', '100%');
			detailGridRef1.current.resize('100%', '100%');
		} else if (key === '2') {
			setActiveKey('2');
			gridRef2?.current?.resize('100%', '100%');
			detailGridRef2?.current?.resize('100%', '100%');
		} else if (key === '3') {
			setActiveKey('3');
			gridRef3?.current?.resize('100%', '100%');
			detailGridRef3?.current?.resize('100%', '100%');
		} else if (key === '4') {
			setActiveKey('4');
			gridRef4?.current?.resize('100%', '100%');
			detailGridRef4?.current?.resize('100%', '100%');
			detail2GridRef4?.current?.resize('100%', '100%');
		} else if (key === '5') {
			setActiveKey('5');
			gridRef5?.current?.resize('100%', '100%');
			detailGridRef5?.current?.resize('100%', '100%');
			detail2GridRef5?.current?.resize('100%', '100%');
		}
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: 'WMS진행현황',
			children: <OmInplanMonitoringTab1 gridRef={gridRef1} detailGridRef={detailGridRef1} data={gridData1} />,
		},
		{
			key: '2',
			label: '경로별마감',
			children: (
				<OmInplanMonitoringTab2
					gridRef={gridRef2}
					detailGridRef={detailGridRef2}
					data={gridData2}
					onSearch={searchTab2List}
				/>
			),
		},
		{
			key: '3',
			label: '출고마감',
			children: <OmInplanMonitoringTab3 gridRef={gridRef3} detailGridRef={detailGridRef3} data={gridData3} />,
		},
		{
			key: '4',
			label: '영업오더차이',
			children: (
				<OmInplanMonitoringTab4
					gridRef={gridRef4}
					detailGridRef={detailGridRef4}
					detail2GridRef={detail2GridRef4}
					data={gridData4}
				/>
			),
		},
		{
			key: '5',
			label: '영업실적차이',
			children: (
				<OmInplanMonitoringTab5
					gridRef={gridRef5}
					detailGridRef={detailGridRef5}
					detail2GridRef={detail2GridRef5}
					data={gridData5}
				/>
			),
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmInplanMonitoringSearch form={form} activeKey={activeKey} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={tabClick} items={tabItems} />
		</>
	);
};
export default OmInplanMonitoring;
