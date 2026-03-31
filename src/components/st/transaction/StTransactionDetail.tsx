/*
 ############################################################################
 # FiledataField    : StTransactionDetail.tsx
 # Description      : 재고처리현황
 # Author           : sss
 # Since            : 25.07.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import { useAppSelector } from '@/store/core/coreHook';

const StTransactionDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	// ...existing code...
	const gridCol = useMemo(
		() => [
			{ dataField: 'trandate', headerText: t('lbl.TRANDATE'), dataType: 'date' }, // 발생일자
			{ dataField: 'trantypename', headerText: t('lbl.TRANTYPE'), dataType: 'code' }, // 트랜잭션유형
			{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code' }, // 창고
			{ dataField: 'serialynname', headerText: t('lbl.SERIALYN_ST'), dataType: 'code' }, // 이력유무
			{
				headerText: t('lbl.SKUINFO'), // 상품정보
				children: [
					{
						dataField: 'sku',
						headerText: t('lbl.SKU'),
						width: 80,
						editable: false,
						filter: { showIcon: true },
						dataType: 'code',
						disableMoving: true,
						commRenderer: {
							type: 'popup',
							onClick: function (e: any) {
								ref.gridRef.current.openPopup(e.item, 'sku');
							},
						},
					}, // 상품코드
					{
						dataField: 'skuname',
						headerText: t('lbl.SKUNAME'),
						width: 120,
						editable: false,
						dataType: 'name',
						filter: { showIcon: true },
						disableMoving: true,
					}, // 상품명
				],
			},
			{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code' }, // 단위
			{ dataField: 'qty', headerText: t('lbl.QTY'), dataType: 'numeric', formatString: '#,##0.##' }, // 수량
			{
				headerText: t('lbl.FROMLOCLABEL'), // FROM 로케이션
				children: [
					{ dataField: 'fromLoc', headerText: t('lbl.FROM_LOC'), disableMoving: true }, // LOC
					{ dataField: 'fromLot', headerText: t('lbl.FROM_LOT'), disableMoving: true }, // LOT
					{ dataField: 'fromLottable01', headerText: t('lbl.LOTTABLE01'), minWidth: 120, disableMoving: true }, // 기준일(소비,제조)
					{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), disableMoving: true }, // 재고ID
					{ dataField: 'fromStocktype', headerText: t('lbl.FROM_STOCKTYPE'), disableMoving: true }, // 재고위치
					{ dataField: 'fromStockgrade', headerText: t('lbl.FROM_STOCKGRADE'), disableMoving: true }, // FROM 재고 속성
					{
						dataField: 'fromStockqty',
						headerText: t('lbl.FROM_STOCKQTY'),
						dataType: 'numeric',
						style: 'right',
						formatString: '#,##0.##',
						disableMoving: true,
					}, // FROM재고량ㅔ
				],
			},
			{
				headerText: t('lbl.TOLOCLABEL'), // TO 로케이션
				headerStyle: 'color-green--900',
				children: [
					{
						dataField: 'toLoc',
						headerText: t('lbl.TO_LOC'), // LOC
						headerStyle: 'color-green--900',
						disableMoving: true,
					}, // LOC
					{ dataField: 'toLot', headerText: t('lbl.TO_LOT'), headerStyle: 'color-green--900', disableMoving: true }, // LOT
					{
						dataField: 'toLottable01',
						headerText: t('lbl.LOTTABLE01'), // 기준일(소비,제조)
						dataType: 'code',
						headerStyle: 'color-green--900',
						disableMoving: true,
						labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
							return commUtil.nvl(value, '').length == 8
								? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) // 날짜 형식으로 변환
								: value;
						},
					}, // 기준일(소비,제조)
					{
						dataField: 'toStockid',
						headerText: t('lbl.TO_STOCKID'), // 재고ID
						headerStyle: 'color-green--900',
						disableMoving: true,
					}, // 재고ID
					{
						dataField: 'toStocktype',
						headerText: t('lbl.TO_STOCKTYPE'), // 재고위치
						headerStyle: 'color-green--900',
						disableMoving: true,
					}, // 재고위치
					{
						dataField: 'toStockgrade',
						headerText: t('lbl.TO_STOCKGRADE'), // TO 재고 속성
						headerStyle: 'color-green--900',
						disableMoving: true,
					}, // TO 재고 속성
					{
						dataField: 'toStockqty',
						headerText: t('lbl.TO_STOCKQTY'), // TO재고량
						dataType: 'numeric',
						formatString: '#,##0.##',
						headerStyle: 'color-green--900',
						disableMoving: true,
					}, // TO재고량
				],
			},
			{ dataField: 'docno', headerText: t('lbl.DOCNO'), disableMoving: true }, // 문서번호
			{ dataField: 'docline', headerText: t('lbl.DOCLINE'), disableMoving: true }, // 문서라인

			{
				headerText: t('lbl.REGINFO'), // 등록정보
				children: [
					{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), disableMoving: true }, // 등록일시
					{
						dataField: 'addwho',
						headerText: t('lbl.ID'),
						dataType: 'manager',
						managerDataField: 'addwho',
						disableMoving: true,
					}, // ID
					{
						dataField: 'username',
						headerText: t('lbl.NAME'),
						dataType: 'manager',
						managerDataField: 'addwho',
						disableMoving: true,
					}, // 이름
				],
			},
		],
		[t],
	);

	// 그리드 footer
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},

		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 수량1
		{
			dataField: 'fromStockqty',
			positionField: 'fromStockqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // FROM수량
		{
			dataField: 'toStockqty',
			positionField: 'toStockqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // TO수량
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// 	callBackFn: excelDownload,
			// },
		],
	};

	//그리드 Props
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false, // 자동 컬럼 크기 조정 비활성화
		enableFilter: true,
		showFooter: true,
		groupingFields: [] as string[], // 로케이션/상품별 합계 표시 여부
		// 합계(소계) 설정
		groupingSummary: {
			dataFields: ['qty', 'openqty', 'qtyallocated', 'qtypicked'],
		},
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: false,
		// 그룹핑 후 셀 병합 실행
		enableCellMerge: true,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고(rowspan 적용 시키지 않고) 최상단에 값만 출력 시킵니다.
		cellMergeRowSpan: false,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'aui-grid-row-depth1-style';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
						return 'aui-grid-row-depth3-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	// 화면 초기 세팅
	useEffect(() => {
		//
	}, []);

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
		</>
	);
});
export default StTransactionDetail;
