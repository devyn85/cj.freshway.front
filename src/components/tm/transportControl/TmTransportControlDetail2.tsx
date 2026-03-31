/*
 ############################################################################
 # FiledataField	: TmTransportControlDetail2.tsx
 # Description		: 정산 > 운송비정산 > 수송배차조정 (상세)
 # Author					: JiHoPark
 # Since					: 2025.11.05.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface TmTransportControlDetail2Props {
	data: any;
	totalCnt: any;
}

const TmTransportControlDetail2 = forwardRef((props: TmTransportControlDetail2Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.PLTNO'), /*파레트번호*/ dataField: 'pltId', dataType: 'code' },
		{
			headerText: t('lbl.SKUCD'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'string',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'sku');
				},
			},
		},
		{ headerText: t('lbl.SKUNM'), /*상품명*/ dataField: 'skuname', dataType: 'string' },
		{
			headerText: t('lbl.CHANNEL_DMD'),
			dataField: 'channelname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			dataType: 'code',
		},
		{ headerText: t('lbl.SKU_WEIGHT'), dataField: 'grossweight', dataType: 'numeric', formatString: '#,##0.###' },
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.QTY'), /*수량*/ dataField: 'qty', dataType: 'numeric', formatString: '#,##0.###' },
		{ headerText: t('lbl.LOAD_WEIGHT'), dataField: 'inspecweight', dataType: 'numeric', formatString: '#,##0.###' },
		{ headerText: t('lbl.LOAD_CUBE'), dataField: 'inspecCube', dataType: 'numeric', formatString: '#,##0.###' },
		{ headerText: t('lbl.ADDWHO'), dataField: 'addwhonm', dataType: 'manager', managerDataField: 'addwho' },
		{ headerText: t('lbl.REGDATTM'), /*등록일시*/ dataField: 'adddate', dataType: 'date' },
		{
			headerText: t('lbl.EDITPERSON'),
			dataField: 'editwhonm',
			dataType: 'manager',
			managerDataField: 'editwho',
		},
		{ headerText: t('lbl.EDITDT') /*수정일시*/, dataField: 'editdate', dataType: 'date' },
		{ dataField: 'addwho', visible: false },
		{ dataField: 'editwho', visible: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,
		showFooter: true,
	};

	// 그리드 푸터 레이아웃 설정
	const footerLayout = [
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.###',
		},
		{
			dataField: 'inspecweight',
			positionField: 'inspecweight',
			operation: 'SUM',
			formatString: '#,##0.###',
		},
		{
			dataField: 'inspecCube',
			positionField: 'inspecCube',
			operation: 'SUM',
			formatString: '#,##0.###',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			//ref?.current.setSelectionByIndex(0);
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DETAIL')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} ref={ref} />
			</GridAutoHeight>
		</>
	);
});

export default TmTransportControlDetail2;
