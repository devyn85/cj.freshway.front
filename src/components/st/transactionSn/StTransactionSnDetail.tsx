/*
 ############################################################################
 # FiledataField    : StTransactionSnDetail.tsx
 # Description      : 이력재고처리현황
 # Author               : YangChangHwan
 # Since                : 25.07.04
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

const StTransactionSnDetail = forwardRef((props: any, ref: any) => {
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

	// ...existing code...
	const gridCol = useMemo(
		() => [
			{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), dataType: 'code' }, // 테이블시리얼번호
			{ dataField: 'trandate', headerText: t('lbl.TRANDATE'), dataType: 'code' }, // 발생일자
			{ dataField: 'trantypename', headerText: t('lbl.TRANTYPE'), dataType: 'code' }, // 트랜잭션유형
			{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code' }, // 창고
			{ dataField: 'serialynname', headerText: t('lbl.SERIALYN_ST'), dataType: 'code' }, // 이력유무
			{
				headerText: t('lbl.SKUINFO'),
				children: [
					{
						dataField: 'sku',
						headerText: t('lbl.SKU'),
						width: 80,
						editable: false,
						filter: { showIcon: true },
						dataType: 'code',
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
					}, // 상품명
				],
			},
			{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code' }, // 단위
			{ dataField: 'qty', headerText: t('lbl.QTY'), dataType: 'numeric', formatString: '#,##0.###' }, // 수량
			{
				headerText: t('lbl.FROMLOCLABEL'),
				children: [
					{ dataField: 'fromLoc', headerText: t('lbl.FROM_LOC'), disableMoving: true }, // FROM 로케이션
					{ dataField: 'fromLot', headerText: t('lbl.FROM_LOT'), disableMoving: true },
					{ dataField: 'fromLottable01', headerText: t('lbl.LOTTABLE01'), disableMoving: true },
					{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), disableMoving: true },
					{ dataField: 'fromStocktype', headerText: t('lbl.FROM_STOCKTYPE'), disableMoving: true },
					{ dataField: 'fromStockgrade', headerText: t('lbl.FROM_STOCKGRADE'), disableMoving: true },
					{
						dataField: 'fromStockqty',
						headerText: t('lbl.FROM_STOCKQTY'),
						dataType: 'numeric',
						formatString: '#,##0.###',
						disableMoving: true,
					},
				],
			},
			{
				headerText: t('lbl.TOLOCLABEL'),
				children: [
					{ dataField: 'toLoc', headerText: t('lbl.TO_LOC'), disableMoving: true }, // TO 로케이션
					{ dataField: 'toLot', headerText: t('lbl.TO_LOT'), disableMoving: true }, // TO LOT
					{ dataField: 'toLottable01', headerText: t('lbl.LOTTABLE01'), disableMoving: true }, // TO LOT정보1
					{ dataField: 'toStockid', headerText: t('lbl.TO_STOCKID'), disableMoving: true }, // TO 재고ID
					{ dataField: 'toStocktype', headerText: t('lbl.TO_STOCKTYPE'), disableMoving: true }, // TO 재고유형
					{ dataField: 'toStockgrade', headerText: t('lbl.TO_STOCKGRADE'), disableMoving: true }, // TO 재고등급
					{
						dataField: 'toStockqty',
						headerText: t('lbl.TO_STOCKQTY'),
						dataType: 'numeric',
						formatString: '#,##0.###',
						disableMoving: true,
					}, // TO 재고수량
				],
			},
			{
				headerText: t('lbl.REGINFO'),
				children: [
					{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), disableMoving: true }, // 등록일자
					{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), disableMoving: true }, // 등록자
					{ dataField: 'username', headerText: t('lbl.USERNAME'), disableMoving: true }, // 사용자이름
				],
			},
			{
				headerText: t('lbl.FROM_SERIALINFO'),
				children: [
					{ dataField: 'fromSerialno', headerText: t('lbl.SERIALNO'), disableMoving: true }, // 이력번호
					{ dataField: 'fromBarcode', headerText: t('lbl.BARCODE'), disableMoving: true }, // 바코드
					{ dataField: 'fromConvserialno', headerText: t('lbl.BLNO'), disableMoving: true }, // B/L 번호
					{ dataField: 'fromButcherydt', headerText: t('lbl.BUTCHERYDT'), disableMoving: true }, // 도축일자
					{ dataField: 'fromFactoryname', headerText: t('lbl.FACTORYNAME'), disableMoving: true }, // 도축장
					{ dataField: 'fromContracttype', headerText: t('lbl.CONTRACTTYPE'), disableMoving: true }, // 계약유형
					{ dataField: 'fromContractcompany', headerText: t('lbl.CONTRACTCOMPANY'), disableMoving: true }, // 계약업체
					{ dataField: 'fromContractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME'), disableMoving: true }, // 계약업체명
					{ dataField: 'fromFromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'code', disableMoving: true }, // 유효일자(FROM)
					{ dataField: 'fromTovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'code', disableMoving: true }, // 유효일자(TO)
				],
			},
			{
				headerText: t('lbl.TO_SERIALINFO'),
				children: [
					{ dataField: 'toSerialno', headerText: t('lbl.SERIALNO'), dataType: 'code', disableMoving: true }, // 이력번호
					{ dataField: 'toBarcode', headerText: t('lbl.BARCODE'), dataType: 'code', disableMoving: true }, // 바코드
					{ dataField: 'toConvserialno', headerText: t('lbl.BLNO'), dataType: 'code', disableMoving: true }, // B/L 번호
					{ dataField: 'toButcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'code', disableMoving: true }, // 도축일자
					{ dataField: 'toFactoryname', headerText: t('lbl.FACTORYNAME'), disableMoving: true }, // 도축장
					{ dataField: 'toContracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code', disableMoving: true }, // 계약유형
					{
						dataField: 'toContractcompany',
						headerText: t('lbl.CONTRACTCOMPANY'),
						dataType: 'code',
						disableMoving: true,
					}, // 계약업체
					{ dataField: 'toContractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME'), disableMoving: true }, // 계약업체명
					{ dataField: 'toFromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'code', disableMoving: true }, // 유효일자(FROM)
					{ dataField: 'toTovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'code', disableMoving: true }, // 유효일자(TO)
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

	// 그리드 엑셀 다운로드
	const excelDownload = () => {
		const params = {
			fileName: storeUtil.getMenuInfo().progNm || t('lbl.EXCEL_DOWNLOAD'),
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true,
		};
		ref.gridRef.current?.exportToXlsxGrid(params);
	};

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
export default StTransactionSnDetail;
