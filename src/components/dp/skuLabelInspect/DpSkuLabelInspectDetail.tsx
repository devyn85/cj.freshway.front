/*
 ############################################################################
 # FiledataField	: DpSkuLabelInspectDetail.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(검수) 조회 Grid Header
 # Author			: YangChangHwan
 # Since			: 25.06.24
 ############################################################################
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Type
import { GridBtnPropsType } from '@/types/common';

// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import commUtil from '@/util/commUtil';

// API

// Store

// Libs

// Utils

const DpSkuLabelInspectDetail = ({
	gridData,
	gridDataDetail,
	searchDetailList,
	gridRef,
	gridRef1,
	printDetailList,
}: any) => {
	const fnMathSum = (columnValues: any) => {
		const sum = (columnValues && columnValues.reduce((acc: number, currVal: number) => acc + currVal, 0)) || 0; // p1203(6월) 최대값 - 최소값
		return sum % 1 === 0 ? sum : sum.toFixed(1);
	};

	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 프린트
				btnLabel: '인쇄',
				callBackFn: printDetailList,
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{ dataField: 'slipno', headerText: t('lbl.SLIPNO_DP'), dataType: 'code' },
		{ dataField: 'slipdt', headerText: t('lbl.DOCDT_DP'), dataType: 'date' },
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code' },
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code' },
		{ dataField: 'ordertypename', headerText: t('lbl.ORDERTYPE_DP'), dataType: 'code' },
		{
			headerText: t('lbl.VENDORINFO'),
			children: [
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.CUSTKEY_KP'),
					filter: {
						showIcon: true,
					},
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current.openPopup(
								{
									custkey: e.item.fromCustkey,
									custtype:
										e.item.ordertypeName == '표준센터이동'
											? 'C'
											: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'fromCustname',
					dataType: 'string',
					headerText: t('lbl.CUSTNAME_KP'),
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{ dataField: 'storerkey', headerText: t('lbl.STORERKEY'), dataType: 'code', visible: false },
		{ dataField: 'doctype', headerText: t('lbl.DOCTYPE'), dataType: 'code', visible: false },
		{ dataField: 'sku', headerText: t('lbl.SKU'), dataType: 'code', visible: false },
		{ dataField: 'statusname', headerText: t('lbl.STATUS'), dataType: 'code' },
		{ dataField: 'ordertype', headerText: t('lbl.ORDERTYPE'), dataType: 'code', visible: false },
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code', visible: false },
	];

	const gridCol1 = [
		{ dataField: 'docline', headerText: t('lbl.DOCLINE'), dataType: 'code', editable: false },
		{ dataField: 'statusDp', headerText: t('lbl.STATUS_DP'), dataType: 'code', visible: false },
		{ dataField: 'statusname', headerText: t('lbl.STATUS_DP'), dataType: 'code', editable: false },
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					filter: {
						showIcon: true,
					},
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.sku,
								skuDescr: e.item.skuName,
							};
							gridRef1.current.openPopup(params, 'sku');
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'printyn',
			headerText: t('lbl.ORDERQTY_PRINTYN'),
			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric', editable: true },
		{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false },
		{ dataField: 'uom', headerText: t('lbl.UOM_DP'), dataType: 'code', editable: false },
		{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY_DP'), dataType: 'numeric', editable: false },
		{ dataField: 'inspectqty', headerText: t('lbl.INSPECTQTY_DP'), dataType: 'numeric', editable: false },
		{ dataField: 'convBoxqty', headerText: t('lbl.CONV_BOXQTY'), dataType: 'numeric', visible: false, editable: false },

		{
			headerText: t('lbl.STOCKINFO'),
			children: [
				{ dataField: 'lot', headerText: t('lbl.LOT'), dataType: 'numeric', editable: false },
				{
					dataField: 'durationBegin',
					headerText: '기준일(제조)',
					dataType: 'code',
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'durationEnd',
					headerText: '기준일(소비)',
					dataType: 'code',
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM'),
					dataType: 'code',
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
			],
		},
	];

	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps1 = {
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	const footerLayout1 = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'docline',
			colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'printedqty',
			positionField: 'printedqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			dataType: 'numeric',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			expFunction: fnMathSum,
			formatString: '#,##0.###',
			dataType: 'numeric',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			expFunction: fnMathSum,
			formatString: '#,##0.###',
			dataType: 'numeric',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef.current.bind('selectionChange', function () {
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		});

		gridRef1.current.bind('cellEditEnd', (e: any) => {
			//주문수량출력여부 체크시
			if (['printyn'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { printyn, inspectqty } = gridRef1.current.getGridData()[rowIndex];

				if (printyn === '1') {
					gridRef1.current.setCellValue(rowIndex, 'printedqty', inspectqty);
				} else {
					gridRef1.current.setCellValue(rowIndex, 'printedqty', '1');
				}
			}
		});
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
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataDetail);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridDataDetail]);

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
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn1} totalCnt={gridDataDetail?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default DpSkuLabelInspectDetail;
