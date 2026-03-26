/*
 ############################################################################
 # FiledataField	: TmInvoicelogMgrDetail.tsx
 # Description		: 납품서출력로그(관리자)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.06.30
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

const TmInvoicelogMgrDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		/* 식별 정보 */
		{ headerText: '물류센터', dataField: 'dcCode', dataType: 'code' },
		{ headerText: '센터명', dataField: 'dcName' },

		/* 전표 기본 */
		{
			headerText: '전표일자',
			dataField: 'slipDt',
			dataType: 'date',
			dateInputFormat: 'yyyymmdd', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd',
		}, // YYYYMMDD → 2025-06-30
		{ headerText: '문서번호', dataField: 'docNo' },
		// { headerText: '거래처', dataField: 'custKey' },
		{ headerText: '거래처', dataField: 'description' },
		/* 출력 데이터(원본 문자열) – 필요 시 숨김/툴팁 처리 */
		// {
		// 	headerText: '출력일시',
		// 	dataField: 'prtData01',
		// 	dataType: 'date',
		// 	dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
		// 	formatString: 'yyyy-mm-dd HH:MM:ss',
		// },
		// { headerText: 'PRT_DATA02', dataField: 'prtData02' },
		// { headerText: 'PRT_DATA03', dataField: 'prtData03' },
		// { headerText: 'PRT_DATA04', dataField: 'prtData04' },
		// { headerText: 'PRT_DATA05', dataField: 'prtData05' },

		/* 출력 이력 */
		// { headerText: 'PARTWHO', dataField: 'prtWho' },
		// { headerText: '출력인', dataField: 'prtWho' },
		{
			headerText: '출력인',
			dataField: 'prtUserNm',
			width: 65,
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addWho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},
		{
			headerText: '출력일시',
			dataField: 'prtDate',
			dataType: 'date',
			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		},
	];
	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridProps = {
		editable: false,
		// showFooter: true,
	};
	const footerLayout = [
		{
			dataField: 'slipDt',
			positionField: 'slipDt',
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
		<AGrid className="contain-wrap">
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
export default TmInvoicelogMgrDetail;
