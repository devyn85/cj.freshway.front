/*
 ############################################################################
 # FiledataField	: StStockSNDetail.tsx
 # Description		: 이력재고조회
 # Author			    : sss
 # Since			    : 25.07.04
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
import commUtil from '@/util/commUtil';
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import { useAppSelector } from '@/store/core/coreHook';

const StStockSNDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'code' }, // 센터코드
		{ headerText: t('lbl.ORGANIZE'), dataField: 'organize', dataType: 'code' }, // 조직코드
		{ headerText: t('lbl.STOCKTYPE'), dataField: 'stocktype', dataType: 'code' }, // 재고유형
		{ headerText: t('lbl.STOCKGRADE'), dataField: 'stockgrade', dataType: 'code' }, // 재고등급
		{ headerText: t('lbl.ZONE'), dataField: 'zone', dataType: 'code' }, // 존
		{ headerText: t('lbl.LOC'), dataField: 'loc', dataType: 'code' }, // 로케이션
		// {
		// 	dataField: 'sku',
		// 	headerText: t('lbl.SKU'),
		// 	width: 80,
		// 	editable: false,
		// 	filter: { showIcon: true },
		// 	dataType: 'code',
		// 	commRenderer: {
		// 		type: 'popup',
		// 		onClick: function (e: any) {
		// 			ref.gridRef.current.openPopup(e.item, 'sku');
		// 		},
		// 	},
		// }, // 상품코드
		{
			// 상품코드
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
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
					ref.gridRef.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', dataType: 'code' }, // 보관유형(저장조건)
		{
			headerText: t('lbl.CURRENT_STOCK'), // 현재고 그룹
			headerStyle: 'color-green--900',
			children: [
				{
					headerText: t('lbl.QTY'),
					headerStyle: 'color-green--900',
					dataField: 'qty1',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 현재고수량1
				{
					headerText: t('lbl.UOM'),
					headerStyle: 'color-green--900',
					dataField: 'uom1',
					dataType: 'code',
					disableMoving: true,
				}, // 단위1
				{
					headerText: t('lbl.QTY'),
					headerStyle: 'color-green--900',
					dataField: 'qty2',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 현재고수량2
				{
					headerText: t('lbl.UOM'),
					headerStyle: 'color-green--900',
					dataField: 'uom2',
					dataType: 'code',
					disableMoving: true,
				}, // 단위2
			],
		},
		{
			headerText: t('lbl.STOCKINFO_WD'), // 재고정보
			children: [
				{ headerText: t('lbl.UOM_ST'), dataField: 'uom', dataType: 'code', disableMoving: true }, // 단위
				{
					headerText: t('lbl.QTY_ST'), // 현재고수량
					dataField: 'qty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return {
							fontWeight: 'bold',
						};
					},
				},
				{
					headerText: t('lbl.OPENQTY_ST'), // 가용재고수량
					dataField: 'openqty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 가용재고수량
				{
					headerText: t('lbl.QTYALLOCATED_ST'), // 재고할당수량
					dataField: 'qtyallocated',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				},
				{
					headerText: t('lbl.QTYPICKED_ST'), // 피킹재고
					dataField: 'qtypicked',
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 피킹재고
			],
		},
		{
			headerText: t('lbl.NEARDURATIONYN'),
			dataField: 'neardurationyn',
			dataType: 'code',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유통기한임박여부
		//
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'),
			dataField: 'manufacturedt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 제조일자
		{
			headerText: t('lbl.EXPIREDT'),
			dataField: 'expiredt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비일자
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			formatString: 'yyyy-mm-dd',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유효기간-소비기간(잔여/전체)
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'),
			dataField: 'usebydatefreert',
			dataType: 'numeric',
			//formatString: '#,##0',
		}, // 소비기한잔여(%)
		// END.제조일자/소비일자/유효기간/소비기한잔여(%)
		//

		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{ headerText: t('lbl.SERIALNO'), dataField: 'serialno', dataType: 'code', disableMoving: true }, // 이력번호
				{ headerText: t('lbl.BARCODE'), dataField: 'barcode', dataType: 'code', disableMoving: true }, // 바코드
				{ headerText: t('lbl.CONVSERIALNO'), dataField: 'convserialno', dataType: 'code', disableMoving: true }, // B/L번호-변환일련번호
				{ headerText: t('lbl.BUTCHERYDT'), dataField: 'butcherydt', dataType: 'date', disableMoving: true }, // 도축일자
				{ headerText: t('lbl.FACTORYNAME'), dataField: 'factoryname', disableMoving: true }, // 도축장-생산지명
				{ headerText: t('lbl.CONTRACTTYPE'), dataField: 'contracttype', dataType: 'code', disableMoving: true }, // 계약유형
				{ headerText: t('lbl.CONTRACTCOMPANY'), dataField: 'contractcompany', dataType: 'code', disableMoving: true }, // 계약고객
				{ headerText: t('lbl.CONTRACTCOMPANYNAME'), dataField: 'contractcompanyname', disableMoving: true }, // 계약고객명
				{
					headerText: t('lbl.FROMVALIDDT'),
					dataField: 'fromvaliddt',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					disableMoving: true,
				}, // 유효기간시작일자
				{
					headerText: t('lbl.TOVALIDDT'),
					dataField: 'tovaliddt',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					disableMoving: true,
				}, // 유효기간종료일자
			],
		},
		{ headerText: t('lbl.POKEY'), dataField: 'pokey', dataType: 'code' }, // 구매번호
		{ headerText: t('lbl.POLINE'), dataField: 'poline', dataType: 'code' }, // 구매라인번호

		//{ headerText: t('lbl.DURATION'), dataField: 'duration', dataType: 'code' }, // 유효기간
		//{ headerText: t('lbl.DURATIONTYPE'), dataField: 'durationtype', dataType: 'code' }, // 유효기간유형
	];

	// 그리드 footer
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'qty1',
			positionField: 'qty1',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // CURRENT_STOCK - 수량1
		{
			dataField: 'qty2',
			positionField: 'qty2',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // CURRENT_STOCK - 수량2
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // STOCKINFO_WD - 현재고수량
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // STOCKINFO_WD - 가용재고수량
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // STOCKINFO_WD - 재고할당수량
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // STOCKINFO_WD - 피킹재고
	];

	// 그리드 엑셀 다운로드
	// const excelDownload = () => {
	// 	const params = {
	// 		fileName: storeUtil.getMenuInfo().progNm || t('lbl.EXCEL_DOWNLOAD'),
	// 		exportWithStyle: true, // 스타일 적용 여부
	// 		progressBar: true,
	// 	};
	// 	ref.gridRef.current?.exportToXlsxGrid(params);
	// };

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
		/**
		 * 그리드 셀 더블클릭 시 상품상세 팝업
		 * @param {any} event 이벤트
		 */
		// ref.gridRef?.current.bind('cellDoubleClick', (e: any) => {
		// 	if (e.dataField === 'sku') {
		// 		ref.gridRef.current.openPopup(e.item, 'sku');
		// 	}
		// });
	}, []);

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// START.skuname 칼럼 인덱스 찾기
				const idx = gridCol.findIndex((col: any) => col.dataField === 'skuname');
				if (idx !== -1) {
					colSizeList[idx] = 200; // skuname 열 너비 200으로 고정
				}
				// END.skuname 칼럼 인덱스 찾기

				gridRef.setColumnSizeList(colSizeList);
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
export default StStockSNDetail;
