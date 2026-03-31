/*
 ############################################################################
 # FiledataField	: StStockDetail.tsx
 # Description		: 재고 > 재고현황 > 재고조회(Detail)
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
//types
// API Call Function
import { useAppSelector } from '@/store/core/coreHook';
import { GridBtnPropsType } from '@/types/common';

const StStockOutOrgDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const gridId = uuidv4() + '_gridWrap';

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	// 컬럼 정의
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'code' }, // 물류센터
		{ headerText: t('lbl.ORGANIZE'), dataField: 'organize', dataType: 'code' }, // 창고
		{ headerText: t('lbl.STOCKTYPE'), dataField: 'stocktype', dataType: 'code' }, // 재고위치
		{ headerText: t('lbl.STOCKGRADE'), dataField: 'stockgrade', dataType: 'code' }, // 재고속성
		{ headerText: t('lbl.ZONE'), dataField: 'zone', dataType: 'code' }, // 존
		{ headerText: t('lbl.LOC'), dataField: 'loc', dataType: 'code' }, // 로케이션
		{ headerText: t('lbl.LOCTYPE'), dataField: 'loctype', dataType: 'code' }, // 로케이션유형
		{
			headerText: t('lbl.PLTFLG'), // 렉타입
			dataField: 'pltFlgNm',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: t('lbl.SKU'), // 상품코드
			dataField: 'sku',
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.gridRef.current.openPopup(params, 'sku');
				},
			},
		},
		{
			headerText: t('lbl.SKUNAME'), // 상품명
			dataField: 'skuname',
			filter: { showIcon: true },
			dataType: 'name',
			width: 150,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'left',
				onClick: function (event: { dataField: string; value: any; rowIndex: number; item: any }) {
					const params = {
						aprvflag: '2',
						attrid: '100',
						id: user.userNo,
						pw: user.userNo,
						mode: '2',
						doctype: '1309',
						requestno: event.item.sku, // sku 속성 사용
						procflag: '1',
					};
					extUtil.openEdms(params);
				},
			},
		},
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', dataType: 'code' }, // 보관유형
		{ headerText: t('lbl.QTYPERBOX'), dataField: 'qtyperbox', dataType: 'numeric' }, // 박스당수량
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
			headerText: t('lbl.STOCK_INFO'), // 재고정보 그룹
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
					dataField: 'qtyexpected',
					headerText: t('입고예정수량'), // 입고예정수량
					width: 80,
					dataType: 'numeric',
					formatString: '#,##0.###',
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
				{
					headerText: t('lbl.UNITPRICE'), //단가
					dataField: 'purchaseprice',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			headerText: t('lbl.NEARDURATIONYN'), // 소비기한임박여부
			dataField: 'neardurationyn',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		//
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataField: 'manufacturedt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataField: 'expiredt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATION_TERM'), // 유효기간-소비기간(잔여/전체)
			dataField: 'durationTerm',
			dataType: 'code',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'), // 소비기한잔여(%)
			headerTooltip: {
				show: true,
				tooltipHtml: '※소비기한일을 관리하지 않으면 빈값으로 표시되고<br>잔여율이 -인 경우는 0으로 표시됩니다.',
			},
			dataField: 'usebydatefreert',
			dataType: 'numeric',
			filter: { showIcon: true },
			//formatString: '#,##0',
		}, // 소비기한잔여(%)
		// END.제조일자/소비일자/유효기간/소비기한잔여(%)
		//
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보 그룹
			children: [
				{ headerText: t('lbl.SERIALNO'), dataField: 'serialno', dataType: 'code', disableMoving: true }, // 이력번호
			],
		},
		{
			headerText: t('lbl.WEIGHT_KG'), // 중량 그룹
			children: [
				{
					headerText: t('lbl.CURRENT_STOCK'),
					dataField: 'stockQtyWeight',
					dataType: 'numeric',
					disableMoving: true,
					formatString: '#,##0.##',
				}, // 현재고(중량)
				{
					headerText: t('이동가능중량'),
					dataField: 'stockOpenqtyWeight',
					dataType: 'numeric',
					disableMoving: true,
					formatString: '#,##0.##',
				}, // 이동가능중량
			],
		},
		/*START.hidden 컬럼*/
		{ dataField: 'lottable01', visible: false }, // lottable01
		{ dataField: 'durationtype', visible: false }, // durationtype
		{ dataField: 'duration', visible: false }, // duration
		/*END.hidden 컬럼*/
	];

	// footerLayout: 그리드 하단 합계(footer) 행 정의
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'qty', // 현재고수량 합계
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'openqty', // 가용재고수량 합계
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'qtyallocated', // 재고할당수량 합계
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'qtypicked', // 피킹재고 합계
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 22~25: 빈 셀 (footer에 표시하지 않음)
		// 26~27: 중량 합계(소수점 2자리)
		{
			dataField: 'stockQtyWeight', // 현재고(중량) 합계
			positionField: 'stockQtyWeight',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'stockOpenqtyWeight', // 가용재고(중량) 합계
			positionField: 'stockOpenqtyWeight',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];

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
			labelTexts: [''], // 소계 행 라벨 텍스트
			rows: [
				{
					// 썸머리 필드에 임의의 텍스트 설정
					text: {
						sku: '소계',
					},
				},
			],
			// text: '소계', // 그룹 합계 텍스트를 "소계"로 변경
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

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// 	callBackFn: excelDownload,
			// 	isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
			// },
		],
	};

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	// 그리드 엑셀 다운로드
	// const excelDownload = () => {
	// 	const params = {
	// 		fileName: storeUtil.getMenuInfo().progNm || t('lbl.EXCEL_DOWNLOAD'),
	// 		exportWithStyle: true, // 스타일 적용 여부
	// 		progressBar: true,
	// 	};
	// 	ref.gridRef.current?.exportToXlsxGrid(params);
	// };

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
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(
				props.data.map((item: any) => {
					return {
						...item,
						manufacturedt: commUtil.isEmpty(item.manufacturedt) ? 'STD' : item.manufacturedt,
						expiredt: commUtil.isEmpty(item.expiredt) ? 'STD' : item.expiredt,
						neardurationyn: commUtil.isEmpty(item.expiredt) || item.expiredt == 'STD' ? 'N' : item.neardurationyn,
					};
				}),
			);
			gridRef?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// START.skuname 칼럼 인덱스 찾기
				const idx = gridCol.findIndex((col: any) => col.dataField === 'skuname');
				if (idx !== -1) {
					colSizeList[idx] = 400; // skuname 열 너비 200으로 고정
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
export default StStockOutOrgDetail;
