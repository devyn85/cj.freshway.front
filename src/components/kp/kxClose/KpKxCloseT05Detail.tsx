// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// Type

// API

const KpKxCloseT05Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = [
		{
			headerText: t('lbl.DATE'), //DATE
			dataField: 'deliverydate',
			dataType: 'text',
			// cellMerge: true,
		},
		{
			headerText: t('lbl.LBL_SKU'), // LBL_SKU
			dataField: 'sku',
			dataType: 'text',
			cellMerge: true,
		},
		{
			headerText: t('lbl.SKUNM'), //SKUNM
			dataField: 'skuname',
			dataType: 'text',
			cellMerge: true,
		},
		{
			headerText: t('lbl.STORAGELOC'), //STORAGELOC
			dataField: 'organize',
			dataType: 'text',
			cellMerge: true,
		},
		{
			headerText: t('lbl.DOCNO'), //DOCNO
			dataField: 'docno',
			dataType: 'text',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function () {
					//
				},
			},
		},

		{
			headerText: t('lbl.DP') + '(STO)', // DP
			dataField: 'dpSto',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.DP') + '(SO)', // DP
			dataField: 'dpSo',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.RT'), // RT
			dataField: 'rt',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.WD') + '(STO)', // WD
			dataField: 'wdSto',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.WD') + '(SO)', // WD
			dataField: 'wdSo',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.WD') + '(JASO)', // WD
			dataField: 'wdJaso',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.WD') + '(PO)', // WD
			dataField: 'wdPo',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.DECREASEQTY'), // DECREASEQTY
			dataField: 'wdAj',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.SURPLUSQTY'), //SURPLUSQTY
			dataField: 'dpAj',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.DD') + t('lbl.TOTAL'), //DD TOTAL
			dataField: 'dayTotal',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.TOTAL_SUM'), // TOTAL_SUM
			dataField: 'total',
			dataType: 'numeric',
			styleFunction: function (rowIndex: any, dataField: any, value: any, item: any) {
				if (value < 0) {
					return 'color-danger';
				} else if (value > 0) {
					return 'color-info';
				} else {
					return '';
				}
			},
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 그리드 속성 설정
	const gridProps = {
		enableCellMerge: true, // 셀 병합 기능 활성화
		groupingFields: ['deliverydate'],
		groupingSummary: {
			// 합계 필드 지정
			dataFields: ['dpSto', 'dpSo', 'rt', 'wdSto', 'wdSo', 'wdJaso', 'wdPo', 'wdAj', 'dpAj', 'dayTotal'],
			labelTexts: [''], // 소계 행 라벨 텍스트
		},
		showFooter: true, // 전체 합계(footer) 표시
		displayTreeOpen: true, // 트리 펼침(기본값 false, true면 펼쳐진 상태)
		showBranchOnGrouping: false, // 그룹핑 브랜치 행 표시 여부
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						// return 'bg-lavender';
						return 'aui-grid-row-depth1-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	const footerLayout = [
		{
			dataField: 'dpSto',
			positionField: 'dpSto',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'dpSo',
			positionField: 'dpSo',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'rt',
			positionField: 'rt',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'wdSto',
			positionField: 'wdSto',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'wdSo',
			positionField: 'wdSo',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'wdJaso',
			positionField: 'wdJaso',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'wdPo',
			positionField: 'wdPo',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'wdAj',
			positionField: 'wdAj',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'dpAj',
			positionField: 'dpAj',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'dayTotal',
			positionField: 'dayTotal',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// { dataField: 'total', positionField: 'total', operation: 'SUM', formatString: '#,##0.##' },
	];

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		ref.gridRef?.current.bind('cellClick', function (event: any) {
			// 예: 문서번호 컬럼 클릭 시
			if (event.dataField === 'docno') {
				// 원하는 탭 key로 이동
				props.setSelectedEvent(event.item); // 문서내역 탭으로 param전달
				props.setActiveTabKey('3'); // 예시: 두 번째 탭으로 이동
			}
		});
	}, []);

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
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={{ tGridRef: ref.gridRef }} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});

export default KpKxCloseT05Detail;
