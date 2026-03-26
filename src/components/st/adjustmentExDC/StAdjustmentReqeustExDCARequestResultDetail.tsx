/*
 ############################################################################
 # FiledataField	: StAdjustmentRequeStExDCDetail.tsx
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
import dateUtil from '@/util/dateUtil';
import dayjs from 'dayjs';

interface StAdjustmentReqeustExDCARequestResultDetailProps {
	data: any;
	totalCnt: any;
}

const StAdjustmentReqeustExDCARequestResultDetail = forwardRef(
	(props: StAdjustmentReqeustExDCARequestResultDetailProps, ref: any) => {
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
		const initValues = {
			rowStatus: 'I',
			apprreqdt: today,
		};

		//마스터 그리드 생성시 필요한 변수들
		const gridId = uuidv4() + '_gridWrap';
		const gridCol = [
			{ dataField: 'dccode', headerText: '물류센터', dataType: 'code', editable: false },
			{ dataField: 'organize', headerText: '창고', dataType: 'text', editable: false },
			{
				headerText: '재고위치',
				children: [
					{ dataField: 'stocktype', headerText: '재고위치', dataType: 'code', editable: false },
					{ dataField: 'stocktypename', headerText: '재고위치명', dataType: 'text', editable: false },
				],
			},
			{
				headerText: '재고속성',
				children: [
					{ dataField: 'stockgrade', headerText: '재고속성', dataType: 'code', editable: false },
					{ dataField: 'stockgradename', headerText: '재고속성명', dataType: 'text', editable: false },
				],
			},
			{ dataField: 'zone', headerText: '피킹존', dataType: 'text', editable: false },
			{ dataField: 'loc', headerText: '로케이션', dataType: 'text', editable: false },
			{
				headerText: '상품정보',
				children: [
					{ dataField: 'sku', headerText: '상품코드', dataType: 'text', editable: false },
					{ dataField: 'skuname', headerText: '상품명', dataType: 'text', editable: false },
				],
			},
			{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
			{ dataField: 'qty', headerText: '현재고수량', dataType: 'number', editable: false },
			{ dataField: 'openqty', headerText: '가용재고수량', dataType: 'number', editable: false },
			{ dataField: 'qtyallocated', headerText: '재고할당수량', dataType: 'number', editable: false },
			{ dataField: 'qtypicked', headerText: '피킹재고', dataType: 'number', editable: false },
			{
				dataField: 'tranqty',
				headerText: '조정수량',
				dataType: 'number',
				editable: false,
			},
			{ dataField: 'adjustmenttypename', headerText: '감모유형', dataType: 'code', editable: false },
			{ dataField: 'reasoncodename', headerText: '발생사유', dataType: 'code', editable: false },
			{
				headerText: '박스환산정보',
				children: [
					{ dataField: 'avgweight', headerText: '평균중량', dataType: 'number', editable: false },
					{ dataField: 'calbox', headerText: '환산박스', dataType: 'number', editable: false },
					{ dataField: 'realorderbox', headerText: '실박스예정', dataType: 'number', editable: false },
					{ dataField: 'realcfmbox', headerText: '실박스확정', dataType: 'number', editable: false },
					{ dataField: 'tranbox', headerText: '작업박스수량', dataType: 'number', editable: false },
				],
			},
			{ dataField: 'imputetype', headerText: '귀책', dataType: 'code', editable: false, visible: false },
			{ dataField: 'imputetypename', headerText: '귀책', dataType: 'code', editable: false },
			{ dataField: 'processmain', headerText: '물류귀책배부', dataType: 'code', editable: false },
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
				headerText: '기준일(유통,제조)',
				children: [
					{ dataField: 'fromvaliddt', headerText: '제조일자', dataType: 'date', editable: false },
					{ dataField: 'tovaliddt', headerText: '유통기한', dataType: 'date', editable: false },
				],
			},
			{ dataField: 'lot', headerText: 'LOT', dataType: 'text', editable: false },
			{ dataField: 'stockid', headerText: 'STOCK ID', dataType: 'text', editable: false },
			{ dataField: 'area', headerText: 'AREA', dataType: 'text', editable: false },

			{
				headerText: '처리결과',
				children: [
					{ dataField: 'processflag', headerText: '처리결과', dataType: 'code', editable: false },
					{ dataField: 'processmsg', headerText: '처리메시지', dataType: 'text', editable: false },
				],
			},
		];

		// AUIGrid 옵션
		const gridProps = {
			editable: true,
			//editBeginMode: 'doubleClick',
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
			enableFilter: true,
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
			btnArr: [
				// {
				// 	btnType: 'save', // 저장
				// 	callBackFn: saveMaster,
				// },
			],
		};

		/**
		 * =====================================================================
		 *  03. react hook event
		 * =====================================================================
		 */

		// 최초 마운트시 초기화
		useEffect(() => {
			//	initEvent();
			ref.gridRef?.current.resize();
		}, []);

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
			}
		}, [props.data]);

		return (
			<>
				<AGrid>
					<GridTopBtn gridBtn={gridBtn} gridTitle="요청 결과" totalCnt={props.totalCnt} />
					<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				<CmSearchWrapper ref={refModal} />
			</>
		);
	},
);

export default StAdjustmentReqeustExDCARequestResultDetail;
