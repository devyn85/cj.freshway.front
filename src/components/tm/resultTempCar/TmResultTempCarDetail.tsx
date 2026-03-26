/*
 ############################################################################
 # FiledataField	: TmResultTempCarDetail.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 # issues 			  : 추후 단가,운행 횟수 수정(운송비정산 완료후)
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
//store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

const TmResultTempCarDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const carTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_DELIVERYTYPE', value)?.cdNm;
	};

	const gridCol = [
		// {
		// 	dataField: 'deliverydt',
		// 	headerText: t('lbl.YEARMONTH'),
		// 	dataType: 'date',
		// 	formatString: 'YYYY-MM',
		// 	cellMerge: true,
		// 	editable: false,
		// 	commRenderer: {
		// 		type: 'calenderYM',
		// 	},
		// },
		{
			dataField: 'deliverydt',
			headerText: t('lbl.YEARMONTH'),
			cellMerge: true,
			editable: false,
			dataType: 'code',
			labelFunction: function (rowIndex, columnIndex, value) {
				const v = String(value ?? '');
				return v.length === 6 ? `${v.slice(0, 4)}-${v.slice(4, 6)}` : v;
			},
		},
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			cellMerge: true,
			editable: false,
			dataType: 'code', // 센터코드 → 코드성
		},
		{
			dataField: 'carrierName',
			headerText: '운송사',
			cellMerge: true,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'carAgentName',
			headerText: '2차운송사',
			cellMerge: true,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'tmDeliverytypeName',
			headerText: '배송유형',
			cellMerge: true,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'carno',
			headerText: '차량번호',
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'driverName',
			headerText: '기사명',
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'deliveryCnt',
			headerText: '운행회수',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'weight',
			headerText: '물량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'cube',
			headerText: '체적',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'custKeyCnt',
			headerText: '납품거래처수(店)',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'unitPrice',
			headerText: '단가',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 설정
	const gridProps = {
		editable: false,
		enableCellMerge: true,
		// showFooter: true,
		// 값이 비어있을 때(null, undefined, "")도 병합을 시도합니다.
		// "default": 기본값, 동일한 값 끼리만 병합
		// "withNull": null, undefined, "" 값을 모두 같은 값으로 간주하여 병합
		cellMergePolicy: 'withNull',
	};

	// 그리드 푸터 설정
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
			<GridTopBtn gridTitle="배차내역" totalCnt={props.totalCnt} gridBtn={gridBtn} />
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

export default TmResultTempCarDetail;
