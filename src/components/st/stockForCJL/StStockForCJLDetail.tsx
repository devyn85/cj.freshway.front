/*
 ############################################################################
 # FiledataField	: StStockForCJLDetail.tsx
 # Description		: 재고 > 재고현황 > 저장품재고조회(CJ대한통운)
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
// Utils
//types
// API Call Function
interface StStockForCJLDetailProps {
	form?: any;
	gridData?: Array<object>;
	totalCnt?: number;
}

const StStockForCJLDetail = forwardRef((props: StStockForCJLDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, gridData, totalCnt } = props;
	const { t } = useTranslation();

	// 그리드 헤더 세팅
	const gridCol = [
		{
			dataField: 'sku',
			headerText: '제품코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: '제품명',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'lot4',
			headerText: '유통기한',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (!value) return '';
				return value.substring(0, 10);
			},
			// formatString: 'yyyy-MM-dd',
		},
		{
			dataField: 'tare',
			headerText: '출고기한',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (!value) return '';
				return value.substring(0, 10);
			},
		},
		{ dataField: 'custname', headerText: '보관센터', dataType: 'code' },
		{
			dataField: 'flag',
			headerText: '상태',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const nameSet: any = { NONE: '가용', HOLD: '제한', DAMAGE: '불량' };
				return nameSet[value] || value;
			},
			dataType: 'code',
		},
		{ dataField: 'qty', headerText: '총재고량', dataType: 'numeric' },
		{ dataField: 'locqty', headerText: '가용재고량', dataType: 'numeric' },
		{ dataField: 'lot3', headerText: '중량', dataType: 'numeric' },
		{ dataField: 'lot1', headerText: '제조일자', dataType: 'date', formatString: 'yyyy-MM-dd' },
		{
			dataField: 'lot5',
			headerText: '입고일자',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (!value) return '';
				return value.substring(0, 10);
			},
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		// showRowCheckColumn: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'dccode') {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// setTotalCount(props.gridData.length);
				gridRefCur.setGridData(gridData);
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});
export default StStockForCJLDetail;
