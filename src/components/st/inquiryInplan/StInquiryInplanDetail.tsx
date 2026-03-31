/*
 ############################################################################
 # FiledataField	: StInquiryInplanDetail.tsx
 # Description		: 재고 > 재고작업 > 재고 실사 지시 Grid
 # Author			: KimDongHan
 # Since			: 2025.10.28
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StInquiryInplanDetail = ({
	gridData,
	gridData1,
	gridRef,
	gridRef1,
	saveMasterList,
	move,
	form1,
	form2,
	searchTypeList,
	gridCount,
	moveDelete,
	clear,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

	// Declare react Ref(2/4)

	////////////////////////////////////////////////// 재고 목록 //////////////////////////////////////////////////
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 80 }, // 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
		{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'code', colSpan: 2, editable: false, width: 100 }, // 창고
		{ dataField: 'organizename', dataType: 'code', editable: false, width: 100 }, // 창고
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = { sku: e.item.sku, skuDescr: e.item.skuname };
					gridRef.current?.openPopup(params, 'sku');
				},
			},
			width: 70,
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', editable: false, width: 400 }, // 상품명칭
		{ dataField: 'storagetypeNm', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false, width: 60 }, // 저장조건
		{ dataField: 'stockgradeNm', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false, width: 60 }, // 재고속성
		{ dataField: 'stocktypeNm', headerText: t('lbl.STOCKTYPE'), dataType: 'code', editable: false, width: 80 }, // 재고위치
		{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), dataType: 'numeric', editable: false, width: 60 }, // 창고층
		{ dataField: 'zone', headerText: t('lbl.ZONE'), dataType: 'code', editable: false, width: 80 }, // 피킹존
		{ dataField: 'loccategory', headerText: t('lbl.LOCCATEGORY'), dataType: 'code', editable: false, width: 90 }, // 로케이션종류
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false, width: 100 }, // 로케이션
		{
			headerText: t('lbl.CURRENT_STOCK'), // 현재고
			children: [
				{
					dataField: 'qty',
					headerText: t('lbl.QTY'), // 수량
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 70,
				},
				{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false, width: 70 }, // 단위
				{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false, width: 70 }, // 박스입수
				{ dataField: 'box', headerText: t('lbl.BOX_ENG'), dataType: 'numeric', editable: false, width: 70 }, // BOX
				{ dataField: 'ea', headerText: t('lbl.EA_ENG'), dataType: 'numeric', editable: false, width: 70 }, // EA
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 소비기한임박여부
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataType: 'code',
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
			editable: false,
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataType: 'code',
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
			editable: false,
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'), // 유통기간(잔여/전체)
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			dataField: 'usebydatefreert',
			headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여(%)
			headerTooltip: {
				show: true,
				tooltipHtml: '※소비기한일을 관리하지 않으면 빈값으로 표시되고<br>잔여율이 -인 경우는 0으로 표시됩니다.',
			},
			dataType: 'numeric',
			formatString: '#,##0',
			editable: false,
		},
		{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false, width: 100 }, // 이력번호
		{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false, width: 100 }, // B/L번호
		// START.Hidden Column
		{ dataField: 'serialkey', dataType: 'code', visible: islVisibleCol }, // serialkey
		// END.Hidden Column
	];

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// 지시 이동
				btnType: 'btn1', //  행추가
				btnLabel: t('lbl.INSTRUCTION_MOVE'),
				isActionEvent: false,
				callBackFn: move,
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	////////////////////////////////////////////////// 지시 목록 //////////////////////////////////////////////////

	/**
	 * 그리드 초기화 - 상세
	 */
	const gridCol1 = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 80 }, // 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
		{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'code', colSpan: 2, editable: false, width: 60 }, // 창고
		{ dataField: 'organizename', dataType: 'code', editable: false, width: 100 }, // 창고
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = { sku: e.item.sku, skuDescr: e.item.skuname };
					gridRef1.current?.openPopup(params, 'sku');
				},
			},
			width: 70,
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', editable: false, width: 400 }, // 상품명칭
		{ dataField: 'storagetypeNm', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false, width: 60 }, // 저장조건
		{ dataField: 'stockgradeNm', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false, width: 60 }, // 재고속성
		{ dataField: 'stocktypeNm', headerText: t('lbl.STOCKTYPE'), dataType: 'code', editable: false, width: 80 }, // 재고위치
		{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), dataType: 'numeric', editable: false, width: 60 }, // 창고층
		{ dataField: 'zone', headerText: t('lbl.ZONE'), dataType: 'code', editable: false, width: 80 }, // 피킹존
		{ dataField: 'loccategory', headerText: t('lbl.LOCCATEGORY'), dataType: 'code', editable: false, width: 90 }, // 로케이션종류
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false, width: 100 }, // 로케이션
		{
			headerText: t('lbl.CURRENT_STOCK'), // 현재고
			children: [
				{
					dataField: 'qty',
					headerText: t('lbl.QTY'), // 수량
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 70,
				},
				{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false, width: 70 }, // 단위
				{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false, width: 70 }, // 박스입수
				{ dataField: 'box', headerText: t('lbl.BOX_ENG'), dataType: 'numeric', editable: false, width: 70 }, // BOX
				{ dataField: 'ea', headerText: t('lbl.EA_ENG'), dataType: 'numeric', editable: false, width: 70 }, // EA
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 소비기한임박여부
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataType: 'code',
			editable: false,
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataType: 'code',
			editable: false,
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'), // 유통기간(잔여/전체)
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			dataField: 'usebydatefreert',
			headerText: t('lbl.USEBYDATE_FREE_RT'), // 소비기한잔여(%)
			headerTooltip: {
				show: true,
				tooltipHtml: '※소비기한일을 관리하지 않으면 빈값으로 표시되고<br>잔여율이 -인 경우는 0으로 표시됩니다.',
			},
			dataType: 'numeric',
			formatString: '#,##0',
			editable: false,
		},
		{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false, width: 100 }, // 이력번호
		{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false, width: 100 }, // B/L번호
		// START.Hidden Column
		{ dataField: 'serialkey', dataType: 'code', visible: islVisibleCol }, // serialkey
		// END.Hidden Column
	];

	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				// 행삭제
				btnType: 'delete',
				//btnLabel: t('lbl.INSTRUCTION_MOVE'),
				isActionEvent: false,
				callBackFn: moveDelete,
			},
			// {
			// 	// 초기화
			// 	btnType: 'btn1',
			// 	btnLabel: t('lbl.RESET'),
			// 	isActionEvent: false,
			// 	callBackFn: clear,
			// },

			{
				// 저장
				btnType: 'save',
				//btnLabel: t('lbl.INSTRUCTION_MOVE'),
				isActionEvent: false,
				callBackFn: () => saveMasterList('save'), // 저장 후 행이동까지 같이 처리
			},
		],
	};

	const gridProps1 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		// 그리드 이벤트 설정
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef1.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				sizes={[60, 40]}
				items={[
					<>
						{/* 수직 2분할 - 위쪽(재고 목록) */}
						{/* 상단 그리드 박의병님 지시에 따라  재고 목록이라고 사용함. */}
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.ST_INQUIRY_INPLAN_LIST1')} gridBtn={gridBtn} totalCnt={gridCount}>
								<Form form={form1} initialValues={{ searchtype: '' }} layout="inline">
									{/* 실사구분 */}
									<SelectBox
										name="searchtype"
										label={t('lbl.INV_CHECK_TYPE')}
										options={searchTypeList}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
										className="bg-white"
										style={{ width: '200px' }}
									/>
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						{/* 수직 2분할 - 아래쪽(지시 목록) */}
						<AGrid>
							<GridTopBtn
								gridTitle={t('lbl.ST_INQUIRY_INPLAN_LIST2')}
								gridBtn={gridBtn1}
								totalCnt={gridData1?.length}
								extraContentLeft={<span className="msg">{t('msg.MSG_ST_INQUIRY_INPLAN_001')}</span>}
							>
								<Form form={form2} initialValues={{}} layout="inline">
									{/* 재고조사 별칭 */}
									<InputText name="inquiryAlias" className="bg-white" label={t('lbl.INQUIRY_ALIAS')} readOnly />
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default StInquiryInplanDetail;
