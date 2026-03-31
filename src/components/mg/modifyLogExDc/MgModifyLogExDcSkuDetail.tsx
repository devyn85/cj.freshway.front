/*
 ############################################################################
 # FiledataField	: StDailyInoutExDcDetail.tsx
 # Description		: 외부비축상품별수불현황(변경이력)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
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

// API Call Function
//type
import { GridBtnPropsType } from '@/types/common';

//hooks

//store

const MgModifyLogExDcSkuDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();

	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [{}];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 Pros 설정
	const gridProps = {
		editable: false,
		showFooter: true,
	};

	const footerLayout = [
		{
			dataField: 'organizeNm',
			positionField: 'organizeNm',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	//데이터 세팅
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
		<AGrid>
			<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
			<AUIGrid
				ref={ref.gridRef}
				name={gridId}
				columnLayout={gridCol}
				gridProps={gridProps}
				footerLayout={footerLayout}
			/>
		</AGrid>
	);
});
export default MgModifyLogExDcSkuDetail;
