/*
 ############################################################################
 # FiledataField	: WdPickingListSNDetail.tsx
 # Description		: 이력상품출고현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.10
 ############################################################################
*/

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

const WdPickingListSNDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DCNAME'), //물류센터명
			dataField: 'dcname',
		},
		{
			headerText: t('lbl.PLANT'), //플랜트
			dataField: 'plant',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCDT_WD'), //출고일자
			dataField: 'slipdt',
			dataType: 'date',
		},
		{
			headerText: t('lbl.DOCNO_WD'), //주문번호
			dataField: 'docno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCLINE'), //품목번호
			dataField: 'docline',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataField: 'toCustkey',
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
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.SKU'), //상품코드
			dataField: 'sku',
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
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.TRANQTY_PK'), //피킹작업량
			dataField: 'pickedqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMQTY'), //확정수량
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CANCELQTY'), //취소량
			dataField: 'cancelqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.STATUS'), //진행상태
			dataField: 'status',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PRINTER04'), //배송라벨
			dataField: 'invoiceno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.INVOICEQTY'), //운송장수량
			dataField: 'invoiceqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.UOM'), //단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.WORK_DCCODE'), //작업센터코드
			dataField: 'fromDccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.WORK_DCNAME'), //작업센터명
			dataField: 'fromDcname',
		},
		{
			headerText: t('lbl.SERIALNO'), //이력번호
			dataField: 'serialno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STOCKID'), //개체식별/유통이력
			dataField: 'stockid',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TRANQTY_PK'), //피킹작업량
			dataField: 'invoicepickedqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: 'STO확정수량',
			dataField: 'invoicestoconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMQTY_STO'), //확정수량
			dataField: 'invoiceconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.ORDERTYPE'), //주문유형
			dataField: 'ordertype',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.PICKING_WHO'), //피킹입력자
			dataField: 'addwho',
			dataType: 'code',
		},
		{
			headerText: t('lbl.INSERT_TIME'), //입력시간
			dataField: 'adddate',
			dataType: 'date',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
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
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="이력피킹현황목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdPickingListSNDetail;
