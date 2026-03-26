/*
 ############################################################################
 # FiledataField	: StInquiryMoveDetail.tsx
 # Description		: 재고 > 재고조사 > 재고조사결과처리 Header(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux

// API Call Function

const StInquiryMoveDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'status', headerText: t('lbl.INQUIRYSTATUS'), width: 80, editable: false, dataType: 'code' }, // 조회상태
		{ dataField: 'inquirydt', headerText: t('lbl.INQUIRYDT'), width: 80, editable: false, dataType: 'date' }, // 조회일자
		{ dataField: 'inquiryName', headerText: t('lbl.INQUIRY_ALIAS'), editable: false, width: 65 }, // 재고조사별칭
		{
			headerText: t('lbl.INQUIRYINFO'), // 조회정보
			disableMoving: true,
			children: [
				{ dataField: 'loccnt', headerText: t('lbl.LOCCNT'), width: 80, editable: false, dataType: 'numeric' }, // 로케이션수
				{ dataField: 'skucnt', headerText: t('lbl.SKUCNT'), width: 80, editable: false, dataType: 'numeric' }, // 상품수
				{
					dataField: 'lastpriority',
					headerText: '최종차수',
					width: 40,
					editable: false,
					dataType: 'numeric',
					style: 'right',
				}, // 최종차수
				// {
				// 	dataField: 'sourcekey',
				// 	headerText: t('lbl.SOURCEKEY_INQUIRY'),
				// 	width: 80,
				// 	editable: false,
				// 	dataType: 'code',
				// }, // 원천키
				{ dataField: 'memo', headerText: t('lbl.MEMO'), width: 80, editable: false, dataType: 'string' }, // 메모
			],
		},
		{
			headerText: t('lbl.REGINFO'), // 등록정보
			disableMoving: true,
			children: [
				{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), width: 100, editable: false, dataType: 'date' }, // 등록일자
				{
					dataField: 'addwho',
					headerText: t('lbl.ADDWHO'),
					width: 100,
					editable: false,
					dataType: 'manager', // dataType을 'manager'로 설정
					managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
				}, // 등록자
				{ dataField: 'username', headerText: t('lbl.USERNAME'), width: 100, editable: false, dataType: 'code' }, // 사용자명
			],
		},
		/*START.hidden 컬럼*/
		{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), width: 80, visible: false }, // 조회번호
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		independentAllCheckBox: true,
		fillColumnSizeMode: true,
		showFooter: true,
		selectionMode: 'singleRow',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
		selectionChangedFunction: function (event: any) {
			if (event.selectedIndex.length > 0 && props.onRowSelect) {
				const selectedRowData = event.item;
				props.onRowSelect(selectedRowData);
			}
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'loccnt',
			positionField: 'loccnt',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 로케이션 수량 합계
		{
			dataField: 'skucnt',
			positionField: 'skucnt',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 상품 수량 합계
		{
			dataField: 'toOrderqty',
			positionField: 'toOrderqty',
			operation: 'SUM',
			formatString: '#,##0',
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
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			{/* 상품 LIST 그리드 */}
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});
export default StInquiryMoveDetail;
