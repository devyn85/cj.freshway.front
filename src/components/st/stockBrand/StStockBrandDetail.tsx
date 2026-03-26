/*
 ############################################################################
 # FiledataField	: StStockBrandDetail.tsx
 # Description		: 재고 > 재고현황 > 재고조회(Detail)
 # Author			: JeongHyeongCheol
 # Since			: 25.09.12
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
interface StStockBrandDetailProps {
	form?: any;
	gridData?: Array<object>;
	totalCnt?: number;
	setTotalCnt?: any;
}

const StStockBrandDetail = forwardRef((props: StStockBrandDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, gridData, totalCnt, setTotalCnt } = props;
	const { t } = useTranslation();
	// 그리드 헤더 세팅
	const gridCol = [
		{
			dataField: 'custkey',
			headerText: '본점코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'description',
			headerText: '본점',
			filter: {
				showIcon: true,
			},
		},
	];
	// const [gridCol, setGridCol] = useState<GridColumn[]>(gridHeader);

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
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
			const colCount = gridRefCur.getColumnCount();

			// 본점코드, 본점 제외 삭제(그리드 데이터 초기화)
			if (colCount > 2) {
				const indicesToRemove = [];
				for (let i = 2; i < colCount; i++) {
					indicesToRemove.push(i);
				}

				gridRefCur.removeColumn(indicesToRemove);
			}

			// gridcol 월별 set
			const uniqueInoutDates = [...new Set(gridData.map((item: any) => item?.inoutdt))];

			const dynamicCols = uniqueInoutDates.map((date: any, index: number, array: any) => {
				const isLastColumn = index === array.length - 1;
				return {
					dataField: 'monthcnt' + date,
					headerText: date,
					dataType: 'numeric',
					style: 'ta-r',
					formatString: '#,##0',
					editable: false,
					// 마지막 컬럼에만 sortType 적용
					...(isLastColumn && { sortType: -1 }),
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: string,
					) => {
						if (index > 0) {
							const prevDate = array[index - 1];
							const prevValue = item['monthcnt' + prevDate];
							if (value > prevValue) return 'fc-red';
							if (value < prevValue) return 'fc-blue';
						}
						return 'ta-r';
					},
				};
			});
			gridRefCur.addColumn(dynamicCols, 'last');

			// 데이터 그룹화(본점 코드 동일할 시 한행으로)
			const groupedData = gridData.reduce((acc: any, curr: any) => {
				const { custkey, inoutdt, monthcnt, ...rest } = curr;
				if (!acc[custkey]) {
					acc[custkey] = {
						custkey,
						...rest,
					};
				}
				acc[custkey][`monthcnt${inoutdt}`] = monthcnt;
				return acc;
			}, {});
			const finalData = Object.values(groupedData);

			// 정렬에 사용했던 originalIndex 필드는 삭제
			finalData.forEach((item: any) => delete item.originalIndex);

			// data set
			gridRefCur?.setGridData(finalData);
			setTotalCnt(finalData.length);

			// sort
			const lastColumn = dynamicCols[dynamicCols.length - 1];
			gridRefCur?.setSorting(lastColumn);

			gridRefCur?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// setTotalCount(props.gridData.length);
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
export default StStockBrandDetail;
