/*
 ############################################################################
 # FiledataField	: WdLoadDetail2.tsx
 # Description		: 출고 > 출차지시 > 출차지시처리 (상세)
 # Author					: JiHoPark
 # Since					: 2025.11.12.
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

interface WdLoadDetail2Props {
	data: any;
	totalCnt: any;
}

const WdLoadDetail2 = forwardRef((props: WdLoadDetail2Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.TRUTH_CUSTKEY'), /*실착지코드*/ dataField: 'truthcustkey', dataType: 'code' },
		{ headerText: t('lbl.TRUTH_CUSTNAME'), /*실착지명*/ dataField: 'truthcustname', dataType: 'string' },
		{ headerText: t('lbl.FROM_CUSTKEY_RT'), /*관리처코드*/ dataField: 'toCustkey', dataType: 'code' },
		{ headerText: t('lbl.FROM_CUSTNAME_RT'), /*관리처명*/ dataField: 'toCustname', dataType: 'string' },
		{ headerText: t('lbl.SALEGROUP'), /*영업조직*/ dataField: 'saleorganize', dataType: 'string' },
		{ headerText: t('lbl.SALEDEPARTMENT'), /*사업장*/ dataField: 'saledepartment', dataType: 'string' },
		{ headerText: t('lbl.CUSTGROUP'), /*영업그룹*/ dataField: 'salegroup', dataType: 'string' },
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			dataType: 'string',
		},
		{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plantDescr', dataType: 'string' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY'),
			/*주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.INSPECTQTY_WD'),
			/*출고검수량*/ dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.WORKQTY_WD'),
			/*피킹량*/ dataField: 'workqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.INSPECTSTATUS_WD'), /*검수진행상태*/ dataField: 'status', dataType: 'code' },
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: true,
	};

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
			ref?.current.setSelectionByIndex(0);
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
			gridRef?.setSelectionByIndex(0, 0);

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
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</GridAutoHeight>
		</>
	);
});

export default WdLoadDetail2;
