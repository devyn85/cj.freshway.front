/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDailyTap2Detail.tsx
 # Description		: 일배분류서출력-광역일배 Detail
 # Author			: 공두경
 # Since			: 26.02.19
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { apiGetTab2PrintList } from '@/api/wd/apiWdDeliveryLabelDaily';

const WdDeliveryLabelDailyTap2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 인쇄(목록그리드)
	 */
	const onPrintHeader = () => {
		let searchParams = props.form.getFieldsValue();

		if (commUtil.isNull(searchParams.searchDate)) {
			showAlert('', '납품일자를 선택해주세요.');
			return;
		}
		searchParams.slipdt = searchParams.searchDate.format('YYYYMMDD');

		const comfirmMsg = t('msg.MSG_COM_PRT_003', []);

		showConfirm(null, comfirmMsg, () => {
			// 광역일배
			searchParams = {
				...searchParams,
				toCustkey: commUtil.nvl(form.getFieldValue('toCustkey'), []).toString(),
				carno: commUtil.nvl(form.getFieldValue('carno'), []).toString(),
			};
			apiGetTab2PrintList(searchParams).then(res => {
				const { data } = res;
				if (data.length === 0) {
					showAlert(null, '인쇄할 정보가 없습니다.');
					return;
				}

				// 1. 리포트 파일명
				let fileName = 'WD_DeliveryLabel_Daily_Pop.mrd';
				if (searchParams.searchtype === '0') {
					fileName = 'WD_DeliveryLabel_Daily_Pop.mrd';
				} else if (searchParams.searchtype === '1') {
					fileName = 'WD_DeliveryLabel_Daily_Cust.mrd';
				} else if (searchParams.searchtype === '2') {
					fileName = 'WD_DeliveryLabel_Daily_Car.mrd';
				}

				const dataSet = {
					ds_reportHeader: data.reportHeaderList,
					ds_reportDetail: data.reportDetailList,
				};

				// 3. 리포트에 전송할 파라미터
				const params = {
					TITLE: '일배분류서출력(광역일배)',
				};

				reportUtil.openAgentReportViewer(fileName, dataSet, params);
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCSTODAILYINFO'), //광역일배정보
			children: [
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_WD'),
					dataType: 'date',
				},
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_WD'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.FROM_DCCODE'), //공급센터
			children: [
				{
					dataField: 'wdDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
				},
				{
					dataField: 'wdDcname',
					headerText: t('lbl.DCNAME'),
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), //공급받는센터
			children: [
				{
					dataField: 'dpDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
				},
				{
					dataField: 'dpDcname',
					headerText: t('lbl.DCNAME'),
				},
			],
		},
		{
			headerText: t('lbl.VENDORINFO'), //공급업체
			children: [
				{
					dataField: 'cpCustkey',
					headerText: t('lbl.FROM_CUSTKEY_DP'),
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current?.openPopup(
								{
									custkey: e.item.cpCustkey,
									custtype: 'P',
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'cpCustname',
					headerText: t('lbl.FROM_CUSTNAME_DP'),
				},
			],
		},
		{
			headerText: t('lbl.CUSTINFO'),
			children: [
				{
					dataField: 'ccCustkey',
					headerText: t('lbl.TO_CUSTKEY_WD'),
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current?.openPopup(
								{
									custkey: e.item.ccCustkey,
									custtype: 'C',
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'ccCustname',
					headerText: t('lbl.TO_CUSTNAME_WD'),
				},
			],
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuname,
					};
					ref.gridRef.current?.openPopup(params, 'sku');
				},
			},
		},
		{ headerText: t('lbl.SKUNAME'), /*상품명칭*/ dataField: 'skuname' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code' },
		{ headerText: t('lbl.LBL_DELIVERYGROUP'), /*POP*/ dataField: 'deliverygroup', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO'),
			children: [
				{
					dataField: 'orderqty',
					headerText: t('lbl.ORDERQTY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'wdInspectqty',
					headerText: t('lbl.INSPECTQTY_WD_STO'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'dpInspectqty',
					headerText: t('lbl.INSPECTQTY_DP_STO'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			headerText: t('lbl.STATUS_INSPECT'),
			children: [
				{
					dataField: 'statusInspectWd',
					headerText: t('lbl.WD'),
					dataType: 'code',
				},
				{
					dataField: 'statusInspectDp',
					headerText: t('lbl.DP'),
					dataType: 'code',
				},
			],
		},
	];
	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'wdInspectqty',
			positionField: 'wdInspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'dpInspectqty',
			positionField: 'dpInspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print',
				callBackFn: () => {
					onPrintHeader();
				},
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default WdDeliveryLabelDailyTap2Detail;
