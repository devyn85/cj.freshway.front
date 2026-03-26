/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForDc.tsx
 # Description		: 주문 > 주문등록 > 저장품센터간이체
 # Author			: YeoSeungCheol
 # Since			: 25.09.18
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCreationSTOForDcSearch from '@/components/om/orderCreationSTOForDc/OmOrderCreationSTOForDcSearch';
import OmOrderCreationSTOForDcTab1 from '@/components/om/orderCreationSTOForDc/OmOrderCreationSTOForDcTab1';
import OmOrderCreationSTOForDcTab2 from '@/components/om/orderCreationSTOForDc/OmOrderCreationSTOForDcTab2';

// API Call Function
import { apiPostMasterList, apiPostResultList } from '@/api/om/apiOmOrderCreationSTOForDc';

// Hooks
import dayjs from 'dayjs';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const OmOrderCreationSTOForDc = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	// Antd Form 사용
	const [form] = Form.useForm();
	const { TabPane } = Tabs;

	// grid data Tab순서대로
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	// 현재 탭 정보
	const [activeTabKey, setActiveTabKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		// timezoneCd: 'Asia/Seoul',
		storagetype: null,
		deliverydate: dayjs(),
	});
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = () => {
		switch (activeTabKey) {
			case '1':
				searchTab1List();
				break;
			case '2':
				searchTab2List();
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
		const searchParams: any = form.getFieldsValue();

		// 필수 입력 값 검증
		const fromDccode = searchParams.fromDccode;
		const toDccode = searchParams.toDccode;
		const deliverydate = searchParams.deliverydate;
		if (!deliverydate) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DOCDT_STO')]));
			return;
		}
		if (!fromDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.FROM_DCCODE')]));
			return;
		}
		if (!toDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.TO_DCCODE')]));
			return;
		}

		// 공급센터와 공급받는센터가 같은지 검증
		if (fromDccode === toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		const openCenterList = getCommonCodeList('OPENCENTER');

		// 공급받는 센터가 오픈센터에 존재하는지 확인
		// const isExist = openCenterList.some((center: any) => center.comCd === toDccode);

		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// } else {
		// API 호출
		const params = {
			DC_A: fromDccode,
			DC_B: toDccode,
			DELIVERYDATE: dayjs(deliverydate).format('YYYYMMDD'),
			STORAGETYPE: searchParams.storagetype,
			MULTI_SKU: searchParams.skuCode,
			SERIALYN: searchParams.serialyn,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData1(res.data ?? []);
			setTotalCount(res.data.length);
		});
		// }
	};

	/**
	 * Tab2 조회 (처리결과)
	 * @returns {void}
	 */
	const searchTab2List = () => {
		//상세 영역 초기화
		setGridData2([]);

		// API 호출
		apiPostResultList({}).then(res => {
			if (res?.statusCode === 0) {
				setGridData2(res.data ?? []);
			}
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
	const tabClick = (key: string, e: any) => {
		setActiveTabKey(key);
		if (key === '1') {
			gridRef1.current?.resize('100%', '100%');
		} else {
			gridRef2.current?.resize('100%', '100%');
		}
		return;
	};

	/**
	 * 저장 성공 콜백 (Tab1에서 호출)
	 * @param {any} resultData 저장 결과 데이터
	 */
	const handleSaveSuccess = (resultData?: any) => {
		// 저장 결과 데이터가 있으면 바로 설정, 없으면 API 호출
		if (resultData && resultData.length > 0) {
			setGridData2(resultData);
		} else {
			setTimeout(() => {
				searchTab2List();
			}, 100);
		}
		// Tab2로 이동
		setActiveTabKey('2');
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		if (activeTabKey === '1') {
			gridRef1.current?.resize('100%', '100%');
		} else if (activeTabKey === '2') {
			gridRef2.current?.resize('100%', '100%');
		}
	}, [activeTabKey]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmOrderCreationSTOForDcSearch form={form} activeTabKey={activeTabKey} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<Tabs activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="이체대상" key="1">
					<OmOrderCreationSTOForDcTab1
						gridRef={gridRef1}
						data={gridData1}
						totalCount={totalCount}
						searchForm={form}
						onSaveSuccess={handleSaveSuccess}
					/>
				</TabPane>
				<TabPane tab="처리결과" key="2">
					<OmOrderCreationSTOForDcTab2 gridRef={gridRef2} data={gridData2} />
				</TabPane>
			</Tabs>
		</>
	);
};
export default OmOrderCreationSTOForDc;
