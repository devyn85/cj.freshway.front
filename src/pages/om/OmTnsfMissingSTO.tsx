/*
 ############################################################################
 # FiledataField	: OmTnsfMissingSTO.tsx
 # Description		: 주문 > 주문등록 > 누락분STO이체
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import { apiGetMasterList, apiGetMasterList1 } from '@/api/om/apiOmTnsfMissingSTO';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmTnsfMissingSTODetail from '@/components/om/tnsfMissingSTO/OmTnsfMissingSTODetail';
import OmTnsfMissingSTOSearch from '@/components/om/tnsfMissingSTO/OmTnsfMissingSTOSearch';

// API Call Function
// hooks
// Store
import OmTnsfMissingToSTODetail from '@/components/om/tnsfMissingSTO/OmTnsfMissingToSTODetail';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Tabs } from 'antd/lib';
import dayjs from 'dayjs';

const OmTnsfMissingSTO = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [searchVal, setSearchVal] = useState({});
	const [searchParams, setSearchParams] = useState({});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridRef1: any = useRef(null);
	const refs: any = useRef(null);

	//탭
	const [activeTabKey, setActiveTabKey] = useState('1');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 출력 버튼
	const savePrintList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			// 1. 리포트 파일명
			const fileName = 'St_TplOnhandQty.mrd';

			// 2. 리포트 파라미터로 사용할 조회 조건 데이터 생성 (배열 안에 객체 형태로)
			const searchParams = form.getFieldsValue();
			const reportParams = [
				{
					// FROMDATE: searchParams.date[0].format('YYYY-MM-DD'),
					// TODATE: searchParams.date[1].format('YYYY-MM-DD'),
					TPLUSERNAME: searchParams.tplUserName,
					PRINTDATE: dayjs().format('YYYYMMDD'), // 테스트용 고정 날짜
				},
			];

			// 3. 리포트에 전달할 데이터 가공 (체크된 항목에서 특정 열만 추출)
			const reportData = checkedItems.map((item: any, index: number) => ({
				no: index + 1, // 순번으로 표시
				sku: item.sku, // 예시: 'sku' 열만 포함
				skunm: item.skuNm,
				convSerialNo: item.convserialno,

				qty: item.qty,
				uom: item.uom,
				boxqty: item.boxqty,
				// 필요에 따라 다른 열들을 여기에 추가할 수 있습니다.
				// skunm: item.skunm,
				// qty: item.qty,
			}));

			// 4. 리포트에 전달할 전체 데이터셋 구성
			const dataSet = {
				ds_report: reportData, // 가공된 데이터 전달
			};

			reportUtil.openAgentReportViewer(fileName, dataSet, reportParams[0]);
		});
	};
	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	const searchMasterListRun = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const params = form.getFieldsValue();
		params.deliverydate = form.getFieldValue('deliverydate').format('YYYYMMDD');

		const openCenterList = getCommonCodeList('OPENCENTER');

		// 공급받는 센터가 오픈센터에 존재하는지 확인
		// const isExist = openCenterList.some((center: any) => center.comCd === params.dccode);

		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// } else {
		// apiGetMasterList(params).then(res => {
		// 	if (res.data) {
		// 		setGridData(res.data);
		// 		setSearchParams(params);
		// 	}
		// });
		if (activeTabKey === '1') {
			gridRef.current.clearGridData();
			apiGetMasterList(params).then(res => {
				if (res.data) {
					setGridData(res.data);
					setSearchParams(params);
				}
			});
		} else {
			gridRef1.current.clearGridData();
			apiGetMasterList1(params).then(res => {
				if (res.data) {
					setGridData1(res.data);
					setSearchParams(params);
				}
			});
		}
		// }
	};
	const tabs = [
		{
			key: '1',
			label: '공급받는센터',
			children: (
				<OmTnsfMissingSTODetail
					ref={gridRef}
					gridData={gridData}
					search={searchMasterListRun}
					searchVal={searchVal}
					searchParams={searchParams}
					savePrintList={savePrintList}
				/>
			),
		},
		{
			key: '2',
			label: '공급센터',
			children: (
				<OmTnsfMissingToSTODetail
					ref={gridRef1}
					gridData={gridData1}
					search={searchMasterListRun}
					searchVal={searchVal}
					searchParams={searchParams}
				/>
			),
		},
	];
	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef?.current?.resize?.();
		gridRef1?.current?.resize?.();
	}, [activeTabKey]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<OmTnsfMissingSTOSearch form={form} activeKey={activeTabKey} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			{/* <OmTnsfMissingSTODetail
				ref={gridRef}
				gridData={gridData}
				search={searchMasterListRun}
				searchVal={searchVal}
				searchParams={searchParams}
			/> */}
			<Tabs items={tabs} activeKey={activeTabKey} onChange={setActiveTabKey} className="contain-wrap" />
		</>
	);
};
export default OmTnsfMissingSTO;
