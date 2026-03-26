/*
 ############################################################################
 # FiledataField	: StLocMoveRPTab2Detail.tsx
 # Description		: 출고재고보충(수원3층)(Detail2)
 # Author			: 공두경
 # Since			: 25.07.14
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const StLocMoveRPTab2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '요청번호', dataField: 'docno', dataType: 'code' },
		{ headerText: '회사', dataField: 'storerkey', dataType: 'code' },
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
		{
			headerText: 'FROM 로케이션',
			children: [
				{ headerText: '로케이션종류', dataField: 'loccategory', dataType: 'code' },
				{ headerText: 'FROM 로케이션', dataField: 'fromloc', dataType: 'code' },
			],
		},
		{ headerText: 'TO 로케이션', dataField: 'toloc', dataType: 'code' },
		{ headerText: '팔레트ID', dataField: 'pltid', dataType: 'code' },
		{
			headerText: '처리수량',
			children: [
				{ headerText: 'BOX', dataField: 'confirmqtyBox', dataType: 'numeric' },
				{ headerText: 'EA', dataField: 'confirmqtyEa', dataType: 'numeric' },
			],
		},
		{ headerText: '처리소스키', dataField: 'docline', dataType: 'code' },
		{ headerText: '진행상태', dataField: 'statusname', dataType: 'code' },
		{ headerText: 'ASRS지시여부', dataField: 'ifFlag', dataType: 'code' },
		{ headerText: 'ASRS처리결과', dataField: 'ifSendFile', dataType: 'code' },
		{ headerText: '전송시간', dataField: 'ifDate', dataType: 'date' },
		{ headerText: '등록일자', dataField: 'adddate', dataType: 'date' },
		{ headerText: '최종변경시간', dataField: 'editdate', dataType: 'date' },
		{ headerText: '생성인', dataField: 'addwho', dataType: 'manager', managerDataField: 'addwho' },
		{ headerText: '최종변경자', dataField: 'editwho', dataType: 'manager', managerDataField: 'addwho' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

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
			{/* 그리드 영역 */}

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="ASRS결과" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default StLocMoveRPTab2Detail;
