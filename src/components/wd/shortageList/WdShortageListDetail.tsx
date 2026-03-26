/*
 ############################################################################
 # FiledataField	: WdShortageListDetail.tsx
 # Description		: 출고결품현황(Detail)
 # Author			: 공두경
 # Since			: 26.03.05
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

const WdShortageListDetail = forwardRef((props: any, ref: any) => {
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
		{ headerText: t('lbl.DOCDT_WD'), /*출고일자*/ dataField: 'slipdt', dataType: 'date' },
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code' },
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*관리처코드*/ dataField: 'custkey',
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
		{
			headerText: t('lbl.TO_CUSTNAME_WD'),
			/*관리처명*/ dataField: 'custname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.SALEGROUP'), /*영업조직*/ dataField: 'saleorganize', dataType: 'code' },
		{ headerText: t('lbl.SALEDEPARTMENT'), /*사업장*/ dataField: 'saledepartment', dataType: 'code' },
		{ headerText: t('lbl.CUSTGROUP'), /*영업그룹*/ dataField: 'salegroup', dataType: 'code' },
		{ headerText: t('lbl.MA_CODE'), /*MA*/ dataField: 'ma', dataType: 'code' },
		{ headerText: t('lbl.MD_CODE'), /*MD*/ dataField: 'somdname', dataType: 'code' },
		{ headerText: t('lbl.SALECUSHRC1'), /*영업경로(대)*/ dataField: 'salecushrc1', dataType: 'code' },
		{ headerText: t('lbl.SALECUSHRC2'), /*영업경로(중)*/ dataField: 'salecushrc2', dataType: 'code' },
		{ headerText: t('lbl.SALECUSHRC3'), /*영업경로(소)*/ dataField: 'salecushrc3', dataType: 'code' },
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
		{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plantDescr', dataType: 'code' },
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{
			headerText: t('lbl.CANCELQTY'),
			/*취소량*/ dataField: 'cancelqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.REASONCODE'), /*사유코드*/ dataField: 'reasoncode', dataType: 'code' },
		{ headerText: t('lbl.REASONMSG'), /*사유메시지*/ dataField: 'reasonmsg', dataType: 'code' },
		{
			headerText: t('lbl.VENDOR'),
			/*협력사코드*/ dataField: 'fromCustkey',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.VENDORNAME'),
			/*협력사명*/ dataField: 'fromCustname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.CANCELDATE'), /*결품처리시간*/ dataField: 'canceldate', dataType: 'date' },
		{ headerText: t('lbl.CANCELWHO'), /*결품처리자*/ dataField: 'cancelwho', dataType: 'code' },
		{ headerText: t('lbl.DELIVERYGROUP'), /*POP번호*/ dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{ headerText: t('lbl.CHUTENO'), /*슈트번호*/ dataField: 'dockno', dataType: 'code' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = useMemo(
		() => ({
			editable: false,
			//autoGridHeight: true, // 자동 높이 조절
			//Row Status 영역 여부
			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: false,
			showFooter: true,
		}),
		[],
	);

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
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
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="출고결품현황목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdShortageListDetail;
