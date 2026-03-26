// CSS

// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// Type

// API

const KpKxCloseT04Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = () => {
		return [
			{
				headerText: t('lbl.DOCDT'), // DOCDT
				dataField: 'docdt',
				dataType: 'text',
			},
			{
				headerText: 'KX' + t('lbl.ORDERTYPE_2'), // ORDERTYPE_2
				dataField: 'kxordertype',
				dataType: 'text',
			},
			{
				headerText: t('lbl.DOCTYPE'), // DOCTYPE
				dataField: 'doctype',
				dataType: 'text',
			},
			{
				headerText: t('lbl.ORIGIN_SLIPNO'), //ORIGIN_SLIPNO
				dataField: 'sourcekey',
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
				headerText: t('lbl.ORIGIN_DOCLINE'), //ORIGIN_DOCLINE
				dataField: 'sourceline',
				dataType: 'text',
			},
			{
				headerText: t('lbl.SKUCD'), // SKUCD
				dataField: 'sku',
				dataType: 'text',
			},
			{
				headerText: t('lbl.CONFIRMQTY'), // CONFIRMQTY
				dataField: 'confirmqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.UOM'), // UOM
				dataField: 'uom',
				dataType: 'text',
			},
			{
				headerText: t('lbl.WD_CONFIRM_YN'), // WD_CONFIRM_YN
				dataField: 'wdYn',
				dataType: 'text',
			},
			{
				headerText: t('lbl.CS_IF_YN'), // CS_IF_YN
				dataField: 'csIfYn',
				dataType: 'text',
			},
			{
				headerText: t('lbl.RT_RECEIVE_YN'), // RT_RECEIVE_YN
				dataField: 'rtYn',
				dataType: 'text',
			},
			{
				headerText: t('lbl.ORDERTYPE_2'), // ORDERTYPE_2
				dataField: 'ordertypeWd',
				dataType: 'text',
			},
			{
				headerText: t('lbl.FIRST_ADDDATE'), // FIRST_ADDDATE
				dataField: 'adddate',
				dataType: 'text',
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 그리드 속성 설정
	const gridProps = {
		enableCellMerge: true, // 셀 병합 기능 활성화
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		ref.gridRef?.current.bind('cellClick', function (event: any) {
			// 예: 문서번호 컬럼 클릭 시
			if (event.dataField === 'sourcekey') {
				// 원하는 탭 key로 이동
				event.item.docno = event.item.sourcekey;
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
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default KpKxCloseT04Detail;
