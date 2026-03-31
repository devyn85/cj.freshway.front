/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: MsExDCSimulation.tsx
 # Description		: 외부창고정산 시뮬레이션
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.23
 ############################################################################
*/
// CSS

// Lib
import { Form, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsExDCSimulationDetail1 from '@/components/ms/exDCSimulation/MsExDCSimulationDetail1';
import MsExDCSimulationDetail2 from '@/components/ms/exDCSimulation/MsExDCSimulationDetail2';
import MsExDCSimulationSearch1 from '@/components/ms/exDCSimulation/MsExDCSimulationSearch1';
import MsExDCSimulationSearch2 from '@/components/ms/exDCSimulation/MsExDCSimulationSearch2';

// Util

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostSaveMasterList, apiPostSaveSkuList } from '@/api/ms/apiMsExDCSimulation';

// Hooks

const MsExDCSimulation = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 탭
	const { TabPane } = Tabs;

	// 탭 번호
	const [activeTabKey, setActiveTabKey] = useState('1');

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// searchForm data 초기화
	const [searchBox] = useState({});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 창고비교 시뮬레이션
	 */
	const saveSimpluationOranize = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = searchForm.getFieldsValue();
		searchParams.stockmonth = searchParams.stockmonth.format('YYYYMM');

		if (searchParams.baseOrganize === searchParams.cfOrganize) {
			const msg = '기준창고, 비교창고는 서로 다른 창고를 선택하셔야 합니다.';
			showMessage({
				content: msg,
				modalType: 'warning',
			});
			return;
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_024'), () => {
			const params = {
				...searchParams,
				avc_COMMAND: 'CALC_MONTHLY',
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					// showMessage({
					// 	content: t('msg.MSG_COM_SUC_003'),
					// 	modalType: 'info',
					// });

					setGridData(res.data);
				}
			});
		});
	};

	/**
	 * 상품 시뮬레이션
	 */
	const saveSimpluationSku = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		const checkedItems = refs.gridRef2.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!refs.gridRef2.current.validateRequiredGridData()) {
			return;
		}

		const searchParams = searchForm.getFieldsValue();

		if (activeTabKey === '1') {
			searchParams.stockmonth = searchParams.stockmonth.format('YYYYMM');
		} else {
			searchParams.stockmonth = searchParams.stockmonth2.format('YYYYMM');
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_024'), () => {
			const params = {
				...searchParams,
				avc_COMMAND: 'CALC_SKU',
				saveList: checkedItems,
			};

			apiPostSaveSkuList(params).then(res => {
				if (res.statusCode === 0) {
					// showMessage({
					// 	content: t('msg.MSG_COM_SUC_003'),
					// 	modalType: 'info',
					// });

					setGridData2(res.data);
				}
			});
		});
	};

	/**
	 * 탭 클릭 이벤트
	 * @param {string} activeKey 탭 번호
	 */
	const onTabChange = (activeKey: string) => {
		setActiveTabKey(activeKey);

		if (activeKey === '1') {
			refs.gridRef?.current?.resize();
		} else if (activeKey === '2') {
			refs.gridRef2?.current?.resize();
		}
	};

	/**
	 * 시뮬레이션 실행
	 */
	const searchMasterList = () => {
		if (activeTabKey === '1') {
			saveSimpluationOranize();
		} else if (activeTabKey === '2') {
			saveSimpluationSku();
		}
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm}>
				{activeTabKey === '1' && (
					<MsExDCSimulationSearch1 form={searchForm} activeTabKey={activeTabKey}></MsExDCSimulationSearch1>
				)}
				{activeTabKey === '2' && (
					<MsExDCSimulationSearch2 form={searchForm} activeTabKey={activeTabKey}></MsExDCSimulationSearch2>
				)}
			</SearchFormResponsive>

			{/* 상세 영역 정의  */}
			<Tabs defaultActiveKey="1" onChange={onTabChange} className="contain-wrap">
				<TabPane tab={'창고'} key="1">
					<MsExDCSimulationDetail1 ref={refs} gridData={gridData} saveFn={saveSimpluationOranize} />
				</TabPane>
				<TabPane tab={'상품'} key="2">
					<MsExDCSimulationDetail2 ref={refs} gridData={gridData2} saveFn={saveSimpluationSku} />
				</TabPane>
			</Tabs>
		</>
	);
};

export default MsExDCSimulation;
