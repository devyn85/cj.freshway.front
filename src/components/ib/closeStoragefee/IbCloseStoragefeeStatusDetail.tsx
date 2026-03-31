/*
 ############################################################################
 # FiledataField	: IbCloseStoragefeeStatusDetail.tsx
 # Description		: 보관료 마감 처리 (현황)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.29
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function

//types
import { GridBtnPropsType } from '@/types/common';
//store

const IbCloseStoragefeeStatusDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';

	const refModal = useRef(null);

	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //'창고',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizeNm',
			headerText: t('lbl.ORGANIZENAME'), //'창고명',
			editable: false,
		},
		{
			dataField: 'totalAmount',
			headerText: t('lbl.STORAGEFEE'), //'보관료',
			dataType: 'numeric',
			formatString: '#,###.##',
			editable: false,
		},
		{
			dataField: 'expenseResult',
			headerText: t('lbl.ACCOUNTS_YN'), //'정산여부',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === 'Y' ? t('lbl.SLIPNO') : t('lbl.SLIPNO');
			},
		},
		{
			dataField: 'slipNo',
			headerText: t('lbl.SLIPNO'), //'전표번호',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'keyNo',
			headerText: t('lbl.DOCNO'), //'문서번호',
			dataType: 'code',
			editable: false,
		},
	];

	const gridProps = {
		showFooter: true,
	};

	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'sku',
			// colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'totalAmount',
			positionField: 'totalAmount',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
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
		<>
			<AGrid>
				<GridTopBtn gridTitle="정산현황" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default IbCloseStoragefeeStatusDetail;
