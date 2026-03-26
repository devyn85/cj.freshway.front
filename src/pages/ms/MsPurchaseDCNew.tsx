/*
 ############################################################################
 # FiledataField	: MsPurchaseDCNew.tsx
 # Description		: 기준정보 > 센터기준정보 > 수급마스터관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';

// Utils

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsPurchaseDCNewAvgDetail from '@/components/ms/purchaseDCNew/MsPurchaseDCNewAvgDetail';
import MsPurchaseDCNewAvgSearch from '@/components/ms/purchaseDCNew/MsPurchaseDCNewAvgSearch';
import MsPurchaseDCNewDetail from '@/components/ms/purchaseDCNew/MsPurchaseDCNewDetail';
import MsPurchaseDCNewSearch from '@/components/ms/purchaseDCNew/MsPurchaseDCNewSearch';

// API Call Function
import { apiGetMasterAvgList, apiGetMasterList } from '@/api/ms/apiMsPurchaseDCNew';
// hooks

const MsPurchaseDCNew = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [avgForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridAvgData, setGridAvgData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridAvgRef = useRef(null);
	const dates = dayjs();
	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('1');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회버튼
	 * @returns {void}
	 */
	const searchMasterList = () => {
		let isChangedData = false;
		if (activeKey === '1' && gridRef.current) {
			isChangedData = gridRef.current.getChangedData({ validationYn: false }).length > 0;
		} else if (activeKey === '2' && gridAvgRef.current) {
			isChangedData = gridAvgRef.current.getChangedData({ validationYn: false }).length > 0;
		}

		if (isChangedData) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		let params: any;
		let searchDccode: string;
		if (activeKey === '1') {
			gridRef.current.clearGridData();
			params = form.getFieldsValue();

			searchDccode = form.getFieldValue('dccode');
			params.dccode = searchDccode ? String(searchDccode) : null;
		} else if (activeKey === '2') {
			gridAvgRef.current.clearGridData();
			params = avgForm.getFieldsValue();

			searchDccode = avgForm.getFieldValue('dccode');
			params.dccode = searchDccode ? String(searchDccode) : null;
			params.lastday = dates.endOf('month').date();
		}

		params.chkyn = 'N';
		if (params.fromCustkey || params.buyerkey) {
			params.chkyn = 'Y';
		}

		if (activeKey === '1') {
			const targetDate = params.yyyymmdd;
			params.prevMMStart = targetDate.subtract(1, 'months').startOf('month').format('YYYYMMDD'); //전월 시작
			params.prevMMEnd = targetDate.subtract(1, 'months').endOf('month').format('YYYYMMDD'); //전월 종료
			params.yyyymmdd = targetDate.format('YYYYMMDD');

			apiGetMasterList(params).then(res => {
				setGridData(res.data);
			});
		} else {
			const targetDate = params.yyyymm;
			params.prevMMStart = targetDate.subtract(1, 'months').startOf('month').format('YYYYMMDD'); //전월 시작
			params.prevMMEnd = targetDate.subtract(1, 'months').endOf('month').format('YYYYMMDD'); //전월 종료
			params.yyyymm = targetDate.format('YYYYMM');

			apiGetMasterAvgList(params).then(res => {
				setGridAvgData(res.data);
			});
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '일별',
			children: (
				<>
					{/* 화면 상세 영역 정의 */}
					<MsPurchaseDCNewDetail ref={gridRef} gridData={gridData} />
				</>
			),
		},
		{
			key: '2',
			label: '월평균',
			children: (
				<>
					{/* 화면 상세 영역 정의 */}
					<MsPurchaseDCNewAvgDetail ref={gridAvgRef} gridData={gridAvgData} />
				</>
			),
		},
	];

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 탭 변경시 그리드 리사이즈
	useEffect(() => {
		if (activeKey === '1' && gridRef.current) {
			gridRef.current.resize();
		} else if (activeKey === '2' && gridAvgRef.current) {
			gridAvgRef.current.resize();
		}
	}, [activeKey]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			{activeKey === '1' && (
				<SearchFormResponsive
					form={form}
					initialValues={{
						yyyymmdd: dates, // Form의 initialValues로 초기값 설정
					}}
				>
					<MsPurchaseDCNewSearch form={form} />
				</SearchFormResponsive>
			)}
			{/* 검색 영역 정의 */}
			{activeKey === '2' && (
				<SearchFormResponsive
					form={avgForm}
					initialValues={{
						yyyymm: dates, // Form의 initialValues로 초기값 설정
					}}
				>
					<MsPurchaseDCNewAvgSearch form={avgForm} />
				</SearchFormResponsive>
			)}
			<Tabs items={tabs} activeKey={activeKey} onChange={setActiveKey} className="contain-wrap" />
		</>
	);
};
export default MsPurchaseDCNew;
