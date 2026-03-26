/*
 ############################################################################
 # FiledataField	: StDisuseRequeStExDCDetail.tsx
 # Description		: 저장위치정보 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib
import { v4 as uuidv4 } from 'uuid';

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// api

// util

// hook

// type
import { GridBtnPropsType } from '@/types/common';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dateUtil from '@/util/dateUtil';
import dayjs from 'dayjs';

interface StDisuseReqeustExDCARequestResultDetailProps {
	data: any;
	totalCnt: any;
}

const StDisuseReqeustExDCARequestResultDetail = forwardRef(
	(props: StDisuseReqeustExDCARequestResultDetailProps, ref: any) => {
		/**
		 * =====================================================================
		 *	01. 변수 선언부
		 * =====================================================================
		 */
		const { t } = useTranslation();

		const today = dayjs(dateUtil.getToDay('YYYY-MM-DD'));

		// grid Ref
		ref.gridRef = useRef();
		const refModal = useRef(null);

		//마스터 그리드 생성시 필요한 변수들
		const gridId = uuidv4() + '_gridWrap';
		const gridCol = [
			{
				headerText: t('lbl.PROCESSFLAG') /*처리결과*/,
				children: [
					{
						headerText: t('lbl.PROCESSFLAG'),
						/*처리결과*/ dataField: 'processflag',
						dataType: 'code',
						editable: false,
						width: 120,
					},
					{
						headerText: t('lbl.PROCESSMSG'),
						/*처리메시지*/ dataField: 'processmsg',
						dataType: 'string',
						editable: false,
						width: 250,
					},
				],
			},
			{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false },
			{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'text', editable: false },
			{
				dataField: 'organizename',
				headerText: t('lbl.ORGANIZENAME'), // 창고명
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.STOCKTYPE') /*재고위치*/,
				children: [
					{ dataField: 'stocktype', headerText: t('lbl.CODE'), dataType: 'code', visible: false, editable: false },
					{ dataField: 'stocktypenm', headerText: t('lbl.DESCR'), dataType: 'text', visible: false, editable: false },
				],
			},
			{ dataField: 'stockgrade', headerText: t('lbl.STOCKGRADE'), dataType: 'code', visible: false, editable: false },
			{ dataField: 'stockgradename', headerText: '재고속성명', dataType: 'text', editable: false },
			{
				headerText: t('lbl.SKUINFO'),
				children: [
					{ dataField: 'sku', headerText: '상품코드', dataType: 'code', editable: false },
					{ dataField: 'skuname', headerText: '상품명', dataType: 'text', editable: false },
				],
			},
			{ dataField: 'uom', headerText: '단위', dataType: 'code', editable: false },
			{
				ataField: 'tranqty',
				eaderText: '현재고수량',
				ataType: 'numeric',
				editable: false,
				formatString: '#,##0.###',
			},
			{
				dataField: 'openqty',
				headerText: '가용재고수량',
				dataType: 'numeric',
				editable: false,
				formatString: '#,##0.###',
			},
			{
				dataField: 'qtyallocated',
				headerText: '재고할당수량',
				dataType: 'numeric',
				editable: false,
				formatString: '#,##0.###',
			},
			{
				dataField: 'qtypicked',
				headerText: '피킹재고',
				dataType: 'numeric',
				editable: false,
				formatString: '#,##0.###',
			},
			{ dataField: 'tranqty', headerText: '조정수량', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
			{
				dataField: 'disusetype',
				headerText: '폐기유형',
				dataType: 'code',
				editable: false,
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					const result = getCommonCodeList('DISUSETYPE')?.find(v => v['comCd'] === value);
					if (result === undefined) return value;
					return result['cdNm'];
				},
			},
			{
				dataField: 'reasoncode',
				headerText: '발생사유',
				dataType: 'code',
				editable: false,
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					const result = getCommonCodeList('REASONCODE_DISUSE')?.find(v => v['comCd'] === value);
					if (result === undefined) return value;
					return result['cdNm'];
				},
			},
			{
				headerText: '박스환산정보',
				children: [
					{
						dataField: 'avgweight',
						headerText: '평균중량',
						dataType: 'numeric',
						editable: false,
						formatString: '#,##0.###',
					},
					{
						dataField: 'calbox',
						headerText: '환산박스',
						dataType: 'numeric',
						editable: false,
						formatString: '#,##0.###',
					},
					{ dataField: 'realorderbox', headerText: '실박스예정', dataType: 'numeric', editable: false },
					{ dataField: 'realcfmbox', headerText: '실박스확정', dataType: 'numeric', editable: false },
					{ dataField: 'tranbox', headerText: '작업박스수량', dataType: 'numeric', editable: false },
				],
			},
			{
				headerText: '귀속부서',
				children: [
					{ dataField: 'costcd', headerText: '부서코드', dataType: 'code', editable: false },
					{ dataField: 'costcdname', headerText: '부서명', dataType: 'text', editable: false },
				],
			},
			{
				headerText: '거래처',
				children: [
					{ dataField: 'custkey', headerText: '거래처코드', dataType: 'code', editable: false },
					{ dataField: 'custname', headerText: '거래처명', dataType: 'text', editable: false },
				],
			},
			{
				dataField: 'lottable01',
				headerText: '기준일(유통/제조)',
				width: 140,
				dataType: 'code',
				editable: false,
			},
			{ dataField: 'zone', headerText: '피킹존', dataType: 'code', editable: false, visible: false },
			{ dataField: 'loc', headerText: '로케이션', dataType: 'code', editable: false, visible: false },
			{ dataField: 'lot', headerText: 'LOT', dataType: 'code', editable: false, visible: false },
			{ dataField: 'stockid', headerText: 'STOCK ID', dataType: 'text', editable: false, visible: false },
			{ dataField: 'area', headerText: 'AREA', dataType: 'code', editable: false, visible: false },
		];

		// FooterLayout Props
		const footerCol = [
			{
				dataField: 'tranqty',
				positionField: 'tranqty',
				operation: 'SUM',
				formatString: '#,##0.###',
				postfix: '',
				style: 'right',
				rounding: 'round',
			},
		];

		// AUIGrid 옵션
		const gridProps = {
			editable: false,
			//Row Status 영역 여부
			showStateColumn: true, // row 편집 여부
			fillColumnSizeMode: false,
			enableColumnResize: true, // 열 사이즈 조정 여부
			showRowCheckColumn: false,
			showFooter: true,
			// row Styling 함수
			rowStyleFunction: function (rowIndex: any, item: any) {
				if (item.processflag === 'Y') {
					return { backgroundColor: '' };
				} else {
					return { backgroundColor: 'darkorange' };
				}
			},
		};

		/**
		 * =====================================================================
		 *	02. 함수 선언부
		 * =====================================================================
		 */

		/**
		 * 그리드 이벤트 초기화
		 */
		//	const initEvent = () => {};

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

		// 최초 마운트시 초기화
		useEffect(() => {
			//	initEvent();
			ref.gridRef?.current.resize(); // 그리드 크기 조정
		});

		useImperativeHandle(ref, () => ({
			resetGrid: () => {
				ref.gridRef.current.clearGridData();
			},
		}));

		useEffect(() => {
			const gridRefCur = ref.gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(props.data);
				gridRefCur?.setSelectionByIndex(0, 0);
				if (props.data.length > 0) {
					// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
					// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
					const colSizeList = gridRefCur.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					gridRefCur.setColumnSizeList(colSizeList);
				}
			}
		}, [props.data]);

		return (
			<>
				<AGrid className="h100">
					<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.REQ_PROCESSFLAG')} totalCnt={props.totalCnt} />
					<AUIGrid
						ref={ref.gridRef}
						name={gridId}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={footerCol}
					/>
				</AGrid>
				<CmSearchWrapper ref={refModal} />
			</>
		);
	},
);

export default StDisuseReqeustExDCARequestResultDetail;
