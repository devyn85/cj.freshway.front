/*
 ############################################################################
 # FiledataField	: StLocMoveDetail2.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function

const StLocMoveDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
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
		//return item.processflag === 'E' ? { backgroundColor: 'darkorange' } : '';
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), // 물류센터
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), // 조직
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'stocktype',
			headerText: t('lbl.STOCKTYPE'), // 재고유형
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'stockgrade',
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'), // 로케이션
			width: 80,
			editable: false,
			dataType: 'code',
		},
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
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장조건
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.STOCK_INFO'), // 재고정보
			children: [
				{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 80, editable: false, dataType: 'code' }, // 단위
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'), // 현재고수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtyexpected',
					headerText: t('입고예정수량'), // 입고예정수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'), // 재고할당수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'), // 피킹재고
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.MOVE_POSSIBLE_QTY'), // 이동가능수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
			],
		},
		{
			dataField: 'fixloc',
			headerText: t('lbl.FIXLOC'), // 고정로케이션
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.MOVE_INFO'), // 이동정보
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.MOVE_LOC'), // 이동로케이션
					width: 100,
					editable: false,
					style: 'user12',
					dataType: 'code',
				},
				{
					dataField: 'toOrderqty',
					headerText: t('lbl.MOVE_QTY'), // 이동수량
					width: 80,
					editable: false,
					style: 'user12',
					dataType: 'numeric',
					formatString: '#,###.###',
				},
			],
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE'), // 사유코드
			dataType: 'code',
			width: 120,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_MV'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONMSG'), // 사유메시지
			dataType: 'code',
			width: 200,
			editable: false,
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 소비임박여부
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), // 소비기한
			width: 80,
			editable: false,
			dataType: 'date',
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'), // 소비기간(잔여/전체)
			width: 80,
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.SERIALINFO'), // 이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					width: 80,
					editable: false,
					dataType: 'code',
				}, // 이력번호
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 바코드
				{
					dataField: 'convserialno',
					headerText: t('lbl.CONVSERIALNO'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 변환이력번호
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 도축일
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 공장명
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약유형
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
				}, // 계약업체명
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 출발유효일자
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 도착유효일자
			],
		},
		{
			headerText: t('lbl.PROCESS_RESULT'), // 처리결과
			children: [
				{
					dataField: 'processflag',
					headerText: t('lbl.PROCESSFLAG'), // 처리플래그
					width: 80,
					editable: false,
					dataType: 'code',
				}, // 처리결과
				{
					dataField: 'processmsg',
					headerText: t('lbl.PROCESSMSG'), // 처리메시지
					width: 120,
					editable: false,
					dataType: 'name',
				}, // 처리메시지
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
				return { backgroundColor: 'darkorange' }; // CSS 클래스 이름 반환
			} else if (item.processflag === 'Y') {
				return { backgroundColor: '' }; // 성공 행 스타일
			}
			return {};
		},
	};
	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: 'skuname',
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 현재고수량 합계
		{
			dataField: 'qtyexpected',
			positionField: 'qtyexpected',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 입고예정수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 재고할당수량 합계
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 피킹재고 합계
		{
			dataField: 'posbqty',
			positionField: 'posbqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 이동가능수량 합계
		{
			dataField: 'toOrderqty',
			positionField: 'toOrderqty',
			operation: 'SUM',
			formatString: '#,###.###',
			style: 'right',
		}, // 이동수량 합계
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
				{/* 상품LIST */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={`${t('lbl.STOCK_SKU')} LIST`} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default StLocMoveDetail2;
