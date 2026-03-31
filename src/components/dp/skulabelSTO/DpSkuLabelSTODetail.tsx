/*
 ############################################################################
 # FiledataField	: DpSkuLabelSTODetail.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(광역) 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.07.07
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpSkuLabelSTODetail = ({
	gridData,
	gridDataDetail,
	searchDetailList,
	gridRef,
	gridRef1,
	printDetailList,
}: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'down', // 아래로
			// },
			// {
			// 	btnType: 'up', // 위로
			// },
			// {
			// 	btnType: 'excelForm', // 엑셀양식
			// },
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			// {
			// 	btnType: 'copy', // 행복사
			// 	initValues: {
			// 		menuId: '',
			// 		regId: '',
			// 		regDt: '',
			// 	},
			// },
			// {
			// 	btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			// },
			// {
			// 	btnType: 'plus', // 행추가
			// 	initValues: {
			// 		menuYn: 0,
			// 		useYn: 0,
			// 	},
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
			// {
			// 	btnType: 'detailView', // 상세보기
			// },
			// {
			// 	btnType: 'btn1', // 사용자 정의버튼1
			// },
			// {
			// 	btnType: 'btn2', // 사용자 정의버튼2
			// },
			// {
			// 	btnType: 'btn3', // 사용자 정의버튼3
			// },
			// {
			// 	btnType: 'print', // 인쇄
			// },
			// {
			// 	btnType: 'new', // 신규
			// },
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: null,
			// },
			// {
			// 	btnType: 'elecApproval', // 전자결재
			// },
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				btnLabel: '인쇄',
				callBackFn: printDetailList,
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'ordertype',
			headerText: t('lbl.ORDERTYPE_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DCSTOINFO'),
			align: 'center',
			children: [
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_WD_STO'),
					align: 'center',
					dataType: 'date',
				},
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_WD_STO'),
					align: 'center',
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.FROM_DCCODE'),
			align: 'center',
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'),
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'),
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.ORGANIZE'),
					filter: {
						showIcon: true,
					},
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'fromCustname',
					headerText: t('lbl.ORGANIZENAME'),
					filter: {
						showIcon: true,
					},
					align: 'center',
					dataType: 'string',
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'),
			align: 'center',
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'),
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'),
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'toCustkey',
					headerText: t('lbl.ORGANIZE'),
					align: 'center',
					dataType: 'code',
				},
				{
					dataField: 'toCustname',
					headerText: t('lbl.ORGANIZENAME'),
					align: 'center',
					dataType: 'string',
				},
			],
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'dcdeparturedt',
			headerText: t('lbl.OUTCARTIME'),
			align: 'center',
			dataType: 'date',
		},
	];

	const gridCol1 = [
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKUINFO'),
			align: 'center',
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					filter: {
						showIcon: true,
					},
					align: 'center',
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
					filter: {
						showIcon: true,
					},
					align: 'center',
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			dataField: 'storagetypedescr',
			headerText: t('lbl.STORAGETYPE'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'printedqty',
			headerText: t('lbl.LABELPRINTEDQTY'),
			align: 'center',
			dataType: 'code',
			editable: true,
		},
		{
			headerText: t('lbl.STOCKINFO'),
			align: 'center',
			children: [
				{
					dataField: 'lot',
					headerText: t('lbl.LOT'),
					align: 'center',
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'lotManufacture',
					headerText: '기준일(제조)',
					align: 'center',
					dataType: 'code',
					editable: true,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'lotExpire',
					headerText: '기준일(소비)',
					align: 'center',
					dataType: 'code',
					editable: true,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM'),
					align: 'center',
					dataType: 'code',
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
			],
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'workqty',
			headerText: t('lbl.WORKQTY'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY'),
			align: 'center',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'),
			align: 'center',
			dataType: 'code',
			editable: false,
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

	// 그리드 속성
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
		gridRef.current.bind('selectionChange', function () {
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		});

		gridRef1.current.bind('cellEditEnd', (e: any) => {
			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration } = gridRef1.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');

				gridRef1.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration } = gridRef1.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');

				gridRef1.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
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
			gridRef.current.setFocus();
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
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};
export default DpSkuLabelSTODetail;
