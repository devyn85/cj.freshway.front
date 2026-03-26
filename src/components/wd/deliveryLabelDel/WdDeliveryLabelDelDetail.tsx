/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDelDetail.tsx
 # Description		: 배송라벨삭제현황 Detail
 # Author			: 공두경
 # Since			: 25.06.23
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

const WdDeliveryLabelDelDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
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
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'code' }, //물류센터
		{ headerText: t('lbl.DOCNO_WD'), dataField: 'docnoWd', dataType: 'code' }, //주문번호
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataField: 'toCustkeyWd',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkeyWd,
						},
						'cust',
					);
				},
			},
		}, //관리처코드
		{
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataField: 'tocustname',
			filter: {
				showIcon: true,
			},
		}, //배송인도처명
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
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.DELIVERYGROUP_WD'), dataField: 'deliverygroup', dataType: 'code' }, //POP번호
		{ headerText: t('lbl.UOM_WD'), dataField: 'storeruom', dataType: 'code' }, //주문단위
		{ headerText: t('lbl.ORDERQTY_WD'), dataField: 'orderqty', dataType: 'numeric' }, //주문수량
		{ headerText: t('lbl.CLOSEQTY_WD'), dataField: 'openqty', dataType: 'numeric' }, //마감수량
		{ headerText: t('lbl.DIFFQTY_WD'), dataField: 'diffqty', dataType: 'numeric' }, //차이수량
		{ headerText: t('lbl.CARNO'), dataField: 'carno', dataType: 'code' }, //차량번호
		{ headerText: t('lbl.PRINTTIME'), dataField: 'printtime', dataType: 'date' }, //출력시간
		{ headerText: t('lbl.PRINTQTY'), dataField: 'printqty', dataType: 'numeric' }, //출력수량
		{ headerText: t('lbl.INVOICENO'), dataField: 'invoiceno', dataType: 'code' }, //인보이스번호
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'diffqty',
			positionField: 'diffqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'printqty',
			positionField: 'printqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

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
				<GridTopBtn gridBtn={gridBtn} gridTitle="배송라벨삭제목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdDeliveryLabelDelDetail;
