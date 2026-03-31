/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfo.tsx
 # Description		: 거래처기준정보 > 마감기준정보 > 사업부상세조직분류
 # Author			: YeoSeungCheol
 # Since			: 25.12.08
 ############################################################################
*/
// CSS

// Lib

// Util
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';

// Type

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCostCenterCtgyInfoSearch from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoSearch';

// Store

// API
import { getMasterListTab1, getMasterListTab2, getMasterListTab3 } from '@/api/ms/apiMsCostCenterCtgyInfo';
import MsCostCenterCtgyInfoTab1 from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoTab1';
import MsCostCenterCtgyInfoTab2 from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoTab2';
import MsCostCenterCtgyInfoTab3 from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoTab3';

const MsCostCenterCtgyInfo = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { TabPane } = Tabs;

	// grid data Tab순서대로
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);

	// 조회 총 건수
	const [totalCount1, setTotalCount1] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);
	const [totalCount3, setTotalCount3] = useState(0);

	// 현재 탭 정보
	const [activeTabKey, setActiveTabKey] = useState('1');

	const [form] = Form.useForm();

	// searchForm data 초기화
	const [searchBox] = useState({
		applyYm: dayjs(),
		deptNm: '',
		lclNm: '',
		mclNm: '',
		sclNm: '',
		sku: '',
	});
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 탭 별 조회함수 분리
	 */
	const searchMasterList = () => {
		switch (activeTabKey) {
			case '1':
				searchMasterListTab1();
				break;
			case '2':
				searchMasterListTab2();
				break;
			case '3':
				searchMasterListTab3();
				break;
			default:
				break;
		}
	};

	// 목록 조회
	const searchMasterListTab1 = async () => {
		try {
			const params = form.getFieldsValue();

			params.applyYm = params.applyYm.format('YYYYMM');

			const res = await getMasterListTab1(params);
			setGridData1(res.data || []);
			setTotalCount1(res.data.length || 0);
		} catch (error) {}
	};

	// 고객 군납 현황 조회
	const searchMasterListTab2 = async () => {
		try {
			// 페이지 내 조회조건과 무관
			const params = form.getFieldsValue();
			params.applyYm = params.applyYm.format('YYYYMM');

			const res = await getMasterListTab2(params);
			setGridData2(res.data || []);
			setTotalCount2(res.data.length || 0);
		} catch (error) {}
	};

	// 상품 미곡 현황 조회
	const searchMasterListTab3 = async () => {
		try {
			// 페이지 내 조회조건과 무관
			const params = form.getFieldsValue();
			params.applyYm = params.applyYm.format('YYYYMM');

			const res = await getMasterListTab3(params);
			setGridData3(res.data || []);
			setTotalCount3(res.data.length || 0);
		} catch (error) {}
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * 탭 클릭
	 * @param key
	 */
	const tabClick = (key: string) => {
		setActiveTabKey(key);
		searchMasterList();
		if (key === '1') {
			setGridData1([]);
			setTotalCount1(0);
			gridRef1.current?.resize('100%', '100%');
		} else if (key === '2') {
			setGridData2([]);
			setTotalCount2(0);
			gridRef2.current?.resize('100%', '100%');
		} else if (key === '3') {
			setGridData3([]);
			setTotalCount3(0);
			gridRef3.current?.resize('100%', '100%');
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (activeTabKey === '1') {
			gridRef1.current?.resize('100%', '100%');
		} else if (activeTabKey === '2') {
			gridRef2.current?.resize('100%', '100%');
		} else if (activeTabKey === '3') {
			gridRef3.current?.resize('100%', '100%');
		}
	}, [activeTabKey]);

	return (
		<>
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsCostCenterCtgyInfoSearch form={form} activeTabKey={activeTabKey} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<Tabs activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="고객마스터" key="1">
					{/* 고객마스터 */}
					<MsCostCenterCtgyInfoTab1
						ref={gridRef1}
						data={gridData1}
						totalCnt={totalCount1}
						callBackFn={searchMasterListTab1}
					/>
				</TabPane>
				<TabPane tab="미곡 상품 마스터" key="2">
					{/* 미곡 상품 마스터 */}
					<MsCostCenterCtgyInfoTab2
						ref={gridRef2}
						data={gridData2}
						totalCnt={totalCount2}
						callBackFn={searchMasterListTab2}
					/>
				</TabPane>
				<TabPane tab="전용 상품 마스터" key="3">
					{/* 전용 상품 마스터 */}
					<MsCostCenterCtgyInfoTab3
						ref={gridRef3}
						data={gridData3}
						totalCnt={totalCount3}
						callBackFn={searchMasterListTab3}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default MsCostCenterCtgyInfo;
