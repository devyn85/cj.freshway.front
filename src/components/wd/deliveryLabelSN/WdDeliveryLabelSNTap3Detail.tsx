/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSNTap3Detail.tsx
 # Description		: 이력배송라벨출력-회수리스트 Detail
 # Author			: 공두경
 # Since			: 25.10.15
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { apiGetPrintReturnList } from '@/api/wd/apiWdDeliveryLabelSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';

const WdDeliveryLabelSNTap3Detail = forwardRef((props: any, ref: any) => {
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

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 회수리스트
	 */
	const printList = async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_023', ['회수리스트']), () => {
			const searchParams = props.form.getFieldsValue();

			const params = {
				dccode: searchParams.fixdccode,
				slipdt: searchParams.searchDate.format('YYYYMMDD'),
				custkey: searchParams.custkey,
			};

			apiGetPrintReturnList(params).then(res => {
				//rd리포트 호출

				const fileNm = 'WD_DeliveryLabel_SN.mrd';

				const dataSet = {
					ds_report: res.data.reportReturnList,
				};

				const params = {
					TITLE: '배송분류표회수리스트',
				};

				reportUtil.openAgentReportViewer(fileNm, dataSet, params);
			});
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터코드*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.DCNAME'), /*물류센터명*/ dataField: 'dcname', dataType: 'code' },
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*출고처관리코드*/ dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD2'),
			/*관리처명(배송인도처)*/ dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
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
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.DELIVERYGROUP'), /*배송그룹*/ dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: t('lbl.STATUS'), /*진행상태*/ dataField: 'status', dataType: 'code' },
		{
			headerText: t('lbl.RETURNTARGET_INVOICE_CRT') /*회수대상(배송분류표)*/,
			children: [
				{ headerText: t('lbl.INVOICENO'), /*인보이스번호*/ dataField: 'invoicenoPre', dataType: 'code' },
				{ headerText: t('lbl.QTY'), /*수량*/ dataField: 'invoiceqtyPre', dataType: 'numeric' }, // QTY 필드이므로 'numeric' 변환
				{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'storeruom', dataType: 'code' },
			],
		},
		{
			headerText: t('lbl.TRADETARGET_INVOICE_CRT') /*교환대상(배송분류표)*/,
			children: [
				{ headerText: t('lbl.INVOICENO'), /*인보이스번호*/ dataField: 'invoiceno', dataType: 'code' },
				{ headerText: t('lbl.QTY'), /*수량*/ dataField: 'invoiceqty', dataType: 'numeric' }, // QTY 필드이므로 'numeric' 변환
				{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'storeruom', dataType: 'code' },
			],
		},
		{
			headerText: t('lbl.RETURNTARGET_SN') /*회수대상(이력상품)*/,
			children: [
				{ headerText: t('lbl.SERIALNO'), /*이력번호*/ dataField: 'serialno', dataType: 'code' },
				{ headerText: t('lbl.BARCODE'), /*바코드*/ dataField: 'stockid', dataType: 'code' },
				{ headerText: t('lbl.QTY'), /*수량*/ dataField: 'cancelqty', dataType: 'numeric' }, // QTY 필드이므로 'numeric' 변환
				{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'storeruom', dataType: 'code' },
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
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
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
					printList();
				},
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

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
			<AGrid style={{ padding: '10px 0 ', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdDeliveryLabelSNTap3Detail;
