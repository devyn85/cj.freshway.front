/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDailyTap1Detail.tsx
 # Description		: 일배분류서출력-일배 Detail
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
import { apiGetTab1PrintList } from '@/api/wd/apiWdDeliveryLabelDaily';

const WdDeliveryLabelDailyTap1Detail = forwardRef((props: any, ref: any) => {
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
			searchParams = {
				...searchParams,
				toCustkey: commUtil.nvl(form.getFieldValue('toCustkey'), []).toString(),
				carno: commUtil.nvl(form.getFieldValue('carno'), []).toString(),
			};
			apiGetTab1PrintList(searchParams).then(res => {
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
					TITLE: '일배분류서출력(일배)',
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
		{ headerText: t('lbl.CENTER_CODE'), /*센터코드*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.CENTER_NAME'), /*센터명*/ dataField: 'dcname' },
		{ headerText: t('lbl.INVOICEDT_WD'), /*납품일자*/ dataField: 'deliverydate', dataType: 'date' },
		{ headerText: t('lbl.ORDERTYPE_WD'), /*주문유형*/ dataField: 'ordertype', dataType: 'code' },
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
		{ headerText: t('lbl.SKUNM'), /*상품명*/ dataField: 'skuname' },
		{ headerText: t('lbl.STORAGETYPE_WD'), /*보관유형*/ dataField: 'storagetypenm', dataType: 'code' },
		{ headerText: t('lbl.SALEGROUP_WD'), /*담당부서*/ dataField: 'salegroup', dataType: 'code' },
		{ headerText: t('lbl.TO_EMPNAME1'), /*영업사원*/ dataField: 'toEmpname', dataType: 'code' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code' },
		{ headerText: t('lbl.LBL_DELIVERYGROUP'), /*POP*/ dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: t('lbl.DRIVERNAME'), /*기사명*/ dataField: 'drivername', dataType: 'code' },
		{
			headerText: t('lbl.CUSTKEY_WD'),
			/*고객코드*/ dataField: 'toCustkey',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup(
						{
							custkey: e.item.toCustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		},
		{ headerText: t('lbl.CUSTNAME_WD'), /*고객명*/ dataField: 'toCustname' },
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY_WD'),
			/*주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.ORDERTIME'), /*주문시간*/ dataField: 'adddate', dataType: 'date' },
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code' },
		{ headerText: t('lbl.LINENO'), /*항번*/ dataField: 'docline', dataType: 'code' },
		{ headerText: t('lbl.POKEY_EXDC'), /*발주번호*/ dataField: 'pokey', dataType: 'code' },
		{ headerText: t('lbl.CUSTKEY_PO'), /*구매처*/ dataField: 'fromCustkey', dataType: 'code' },
		{ headerText: t('lbl.CUSTNAME_PO'), /*구매처명*/ dataField: 'fromCustname' },
		{ headerText: '비고(물류요청사항)', /*비고(물류요청사항)*/ dataField: 'memo1' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

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
export default WdDeliveryLabelDailyTap1Detail;
