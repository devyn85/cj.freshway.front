/*
 ############################################################################
 # FiledataField	: KpWdShortageResultTab2Detail.tsx
 # Description		: 지표/모니터링 > 센터운영지표 > 출고결품실적 조회 Grid Header
 # Author			: 공두경
 # Since			: 2026.03.23
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
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function

const KpWdShortageResultTab2Detail = forwardRef((props: any, ref: any) => {
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

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DOCDT_WD'), /*출고일자*/ dataField: 'slipdt', dataType: 'date' },
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code' },
		{ headerText: t('lbl.SALEGROUP'), /*영업조직*/ dataField: 'saleorganize', dataType: 'code' },
		{
			headerText: t('lbl.CUSTKEY_WD'),
			/*고객코드*/ dataField: 'custkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.custkey,
						},

						'cust',
					);
				},
			},
		},
		{ headerText: t('lbl.CUSTNAME_WD'), /*고객명*/ dataField: 'custname' },
		{
			headerText: t('lbl.TO_CUSTKEY'),
			/*배송인도처코드*/ dataField: 'billtocustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.billtocustkey,
						},

						'cust',
					);
				},
			},
		},
		{ headerText: t('lbl.TO_CUSTNAME'), /*배송인도처명*/ dataField: 'billtocustname' },
		{ headerText: t('lbl.DELIVERYGROUP_WD'), /*POP번호*/ dataField: 'delierygroup', dataType: 'code' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
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
		{ headerText: t('lbl.SKUNAME'), /*상품명칭*/ dataField: 'skuname' },
		{ headerText: t('lbl.UOM_SO'), /*판매단위*/ dataField: 'storeruom', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY_WD'),
			/*주문수량*/ dataField: 'storeropenqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.SHORTAGEQTY'),
			/*결품수량*/ dataField: 'storercancelqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.REASONCODE_WD'), /*결품사유*/ dataField: 'reasoncode', dataType: 'code' },
		{
			headerText: t('lbl.VENDOR'),
			/*협력사코드*/ dataField: 'vendor',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.vendor,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},

						'cust',
					);
				},
			},
		},
		{ headerText: t('lbl.VENDORNAME'), /*협력사명*/ dataField: 'vendorname' },
		{ headerText: t('lbl.MACODE'), /*담당MA*/ dataField: 'maname', dataType: 'code' },
		{ headerText: t('lbl.MDCODE'), /*MD코드*/ dataField: 'mdname', dataType: 'code' },
		{ headerText: t('lbl.POMDCODE'), /*수급담당*/ dataField: 'pomdcode', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: false, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'storeropenqty',
			positionField: 'storeropenqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'storercancelqty',
			positionField: 'storercancelqty',
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

			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});

export default KpWdShortageResultTab2Detail;
