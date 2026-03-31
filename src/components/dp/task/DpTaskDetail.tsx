/*
 ############################################################################
 # FiledataField	: DpTaskDetail.tsx
 # Description		: 입고 > 입고작업 > 입고검수지정 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.07.31
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

const DpTaskDetail = ({ gridData, gridDataDetail, gridRef, gridRef1, saveDpTask }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '삭제',
				authType: 'new',
				callBackFn: () => {
					saveDpTask(0);
				},
			},
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '삭제',
				authType: 'new',
				callBackFn: () => {
					saveDpTask(1);
				},
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'custname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
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
			dataField: 'fromtaskdt',
			headerText: t('lbl.INSPINPLANFROMDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'totaskdt',
			headerText: t('lbl.INSPINPLANTODT_DP'),
			dataType: 'date',
		},
	];

	const gridCol1 = [
		{
			dataField: 'skugroup1',
			headerText: t('lbl.SKUGROUP1'),
			dataType: 'code',
		},
		{
			dataField: 'skugroup2',
			headerText: t('lbl.SKUGROUP2'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
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
			dataType: 'string',
		},
		{
			dataField: 'putawaytype',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'fromtaskdt',
			headerText: t('lbl.INSPINPLANFROMDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'totaskdt',
			headerText: t('lbl.INSPINPLANTODT_DP'),
			dataType: 'date',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps1 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

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
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default DpTaskDetail;
