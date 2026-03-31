/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenterDetail3.tsx
 # Description		: 재고 > 재고현황 > 요청처리결과(3/5)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
// Redux
// API Call Function

const StDisuseRequestCenterDetail3 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKey } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 스타일 함수
	 * @param rowIndex 행 인덱스
	 * @param columnIndex 열 인덱스
	 * @param value 셀 값
	 * @param headerText 헤더 텍스트
	 * @param item 데이터 항목
	 * @returns 스타일 객체
	 */
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		// 디버깅을 위한 로그 (필요시 제거)

		if (item.processflag === 'E') {
			return { backgroundColor: 'darkorange' };
		} else if (item.processflag === 'Y') {
			return { backgroundColor: '' }; // 명시적으로 배경색 제거
		}
		return {}; // 기본값
	};

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), // 물류센터
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), // 조직
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			headerText: t('lbl.STOCKTYPE'), // 재고유형
			children: [
				{
					dataField: 'stocktype',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'stocktypeNm',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{
					dataField: 'stockgrade',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'stockgradename',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'), // 존
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'left',
			styleFunction,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'), // 로케이션
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'left',
			styleFunction,
		},
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
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
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
					styleFunction,
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'), // 단위
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY_ST'), // 수량
			width: 80,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY_ST'), // 가용수량
			width: 80,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'), // 할당수량
			width: 80,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'qtypicked',
			headerText: t('lbl.QTYPICKED_ST'), // 피킹수량
			width: 80,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.ADJUSTQTY'), // 조정수량
			width: 80,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'disusetypename',
			headerText: t('lbl.DISUSETYPE'), // 폐기유형
			width: 80,
			editable: false,
			dataType: 'combo',
			align: 'left',
			styleFunction,
		},
		{
			dataField: 'reasoncodename',
			headerText: t('lbl.REASONCODE_AJ'), // 발생사유
			width: 80,
			editable: false,
			dataType: 'combo',
			align: 'left',
			styleFunction,
		},
		{
			dataField: 'imputetype',
			headerText: t('lbl.OTHER01_DMD_AJ'), // 귀책
			width: 80,
			editable: false,
			dataType: 'combo',
			align: 'left',
			styleFunction,
		},
		{
			dataField: 'processmain',
			headerText: t('lbl.OTHER05_DMD_AJ'), // 물류귀책배부
			width: 80,
			editable: false,
			dataType: 'combo',
			align: 'left',
			styleFunction,
		},
		{
			headerText: t('lbl.COSTCENTER'), // 귀속부서
			children: [
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'), // 귀속부서코드
					width: 109,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					autosizing: 'keep',
					disableMoving: true,
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), // 귀속부서명
					width: 156,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					autosizing: 'keep',
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.CUST'), // 거래처
			children: [
				{
					dataField: 'chgCustkey',
					headerText: t('lbl.CUST'), // 거래처코드
					width: 109,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					autosizing: 'keep',
					disableMoving: true,
				},
				{
					dataField: 'chgCustname',
					headerText: t('lbl.CUST_NAME'), // 거래처명
					width: 156,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					autosizing: 'keep',
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'rmk',
			headerText: t('lbl.REMARK'), // 비고
			dataType: 'name',
			width: 300,
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), // 소비기한
			width: 80,
			editable: false,
			dataType: 'code',
			styleFunction,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.nvl(value, '').length == 8
					? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) // 날짜 형식으로 변환
					: value;
			},
		},
		{
			dataField: 'lot',
			headerText: 'LOT', // LOT
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'stockid',
			headerText: 'STOCKID', // 재고ID
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'left',
			styleFunction,
		},
		// {
		// 	dataField: 'area',
		// 	headerText: 'AREA', // 영역
		// 	width: 80,
		// 	editable: false,
		// 	dataType: 'code',
		// 	align: 'left',
		// 	styleFunction,
		// },
		{
			headerText: t('lbl.PROCESSFLAG'), // 처리결과
			children: [
				{
					dataField: 'processflag',
					headerText: t('lbl.PROCESSFLAG'), // 처리결과
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'processmsg',
					headerText: t('lbl.PROCESSMSG'), // 처리메시지
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag === 'E') {
				return 'aui-grid-row-error'; // 에러 행 스타일
			} else if (item.processflag === 'Y') {
				return 'aui-grid-row-success'; // 성공 행 스타일 (또는 빈 문자열로 기본 스타일)
			}
			return '';
		},
	};
	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0' }, // 수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0' }, // 가용수량 합계
		{ dataField: 'qtyallocated', positionField: 'qtyallocated', operation: 'SUM', formatString: '#,##0' }, // 할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0' }, // 피킹수량 합계
		{ dataField: 'tranqty', positionField: 'tranqty', operation: 'SUM', formatString: '#,##0' }, // 조정수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 요청처리결과 */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default StDisuseRequestCenterDetail3;
