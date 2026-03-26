/*
############################################################################
# FiledataField	: RoInvoiceDetail.tsx
# Description		: 입고 > 입고작업 > 반출명세서출력 조회 Grid Header
# Author			: KimDongHyeon
# Since			: 2025.07.16
############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RoInvoiceDetail = ({
	gridData,
	gridDataDetail,
	totalCount,
	totalCountDetail,
	searchDetailList,
	gridRef,
	gridRef1,
	printMasterList,
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
			{
				btnType: 'print', // 인쇄
				btnLabel: '인쇄',
				callBackFn: () => printMasterList(true),
			},
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				btnLabel: '거래처별 인쇄',
				callBackFn: () => printMasterList(false),
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'shortno',
			headerText: '단축번호', // domainid가 없고 text로만 있음
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'custcnt',
			headerText: t('lbl.CUST_CNT'),
			align: 'right',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'slipcnt',
			headerText: t('lbl.SLIPCNT'),
			align: 'right',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
	];

	const gridCol1 = [
		{
			dataField: 'custkey',
			headerText: t('lbl.VENDOR'), // domainid와 colid가 다르지만 의미상 VENDOR->CUSTKEY 매핑
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.custkey,
						custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{
			dataField: 'custname',
			headerText: t('lbl.VENDORNAME'),
			filter: {
				showIcon: true,
			},
			align: 'left',
			dataType: 'string',
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'invoicetypedesc',
			headerText: t('lbl.INVOICETYPE'),
			align: 'left',
			dataType: 'code',
		},
		{
			dataField: 'ordertype',
			headerText: t('lbl.ORDERTYPE_WD'),
			align: 'left',
			dataType: 'code',
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
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps1 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'carno',
			// colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'custcnt',
			positionField: 'custcnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'slipcnt',
			positionField: 'slipcnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef.current.getSelectedRows()[0]);
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
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCount} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn1} totalCnt={totalCountDetail} />
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
export default RoInvoiceDetail;
