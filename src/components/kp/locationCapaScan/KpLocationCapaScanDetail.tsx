/*
 ############################################################################
 # FiledataField	: KpLocationCapaScanDetail.tsx
 # Description		: 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.09
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpLocationCapaScanDetail = ({
	activeKey,
	//activeKeyRef,
	gridRef,
	gridRef1,
	gridData,
	gridData1,
	setActiveKey,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	/////////////////////////////////////////// 1. 요약_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		fillValueGroupingSummary: true, // true 설정시 그룹핑 소계 행에서 그룹핑 필드에 해당되는 셀도 세로 병합의 대상
		groupingFields: ['dccode', 'dcname', 'storagetype', 'zoneNm'], // 그룹핑 할 필드명
		groupingSummary: {
			dataFields: ['totCnt', 'statusCnt', 'keepCnt'], // 합계할 필드명
			excepts: ['dccode', 'dcname', 'storagetype'], // 합계에서 제외할 필드명
			rows: [
				{
					// 썸머리 필드에 임의의 텍스트 설정
					text: {
						zoneNm: '$value',
						locZone: [t('lbl.SUBTOTAL')],
					},
				},
			],
		},

		displayTreeOpen: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false, // 여백 윗줄 지우기.
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 계층형의 depth 비교 연산
				switch (item._$depth) {
					case 5:
						//return 'bg-lavender ta-r';
						return 'bg-lavender';
				}
			}
		}, // end of rowStyleFunction
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			width: 80,
		},
		{
			// 02. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			width: 100,
		},
		{
			// 03. 저장조건
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			width: 100,
		},
		{
			// 04. 피킹존
			dataField: 'zoneNm',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			width: 100,
		},
		{
			// 05. zone세부
			dataField: 'locZone',
			headerText: t('lbl.ZONE_DTL'),
			dataType: 'code',
			cellMerge: true,
			width: 100,
		},
		{
			// 06. 피킹/보관
			dataField: 'locType',
			headerText: t('lbl.PICKING_KEEP'),
			dataType: 'code',
			width: 100,
		},
		{
			// 07. 전체 CAPA
			dataField: 'totCnt',
			headerText: t('lbl.TOTAL_CAPA'),
			dataType: 'numeric',
			width: 100,
		},
		{
			// 08. 잔여 CAPA(스캔내역)
			dataField: 'statusCnt',
			headerText: t('lbl.REMAIN_CAPA_SCAN'),
			dataType: 'numeric',
			width: 100,
		},
		{
			// 09. 현재보관
			dataField: 'keepCnt',
			headerText: t('lbl.CURRENT_KEEP'),
			dataType: 'numeric',
			width: 100,
		},
	];

	/////////////////////////////////////////// 2. 센터별 상세_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps1 = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	// 그리드 초기화
	const gridCol1 = [
		{
			// 01. 일자
			dataField: 'confirmDate',
			headerText: t('lbl.DATE'),
			dataType: 'date',
			width: 100,
		},
		{
			// 02. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			width: 80,
		},
		{
			// 02. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			width: 100,
		},
		{
			// 03. 피킹존
			dataField: 'locZone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			width: 100,
		},
		{
			// 04. 로케이션
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			width: 100,
		},
		{
			// 05. 상태
			dataField: 'statusNm',
			headerText: t('lbl.STATUS_1'),
			dataType: 'code',
			width: 100,
		},
		{
			// 06. 저장조건
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			width: 100,
		},
		{
			// 07. 확정자
			dataField: 'confirmUser',
			headerText: t('lbl.CONFIRMWHO'),
			dataType: 'code',
			width: 100,
		},
		{
			// 08. 확정일시
			dataField: 'confirmDate2',
			headerText: t('lbl.CONFIRMDATE'),
			dataType: 'code',
			width: 100,
		},
	];

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
		// 초기화 이벤트
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
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
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
				//const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	return (
		<>
			<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} className="contain-wrap">
				{/* 요약 */}
				<TabPane tab={t('lbl.KP_LOCATION_CAPA_SCAN_T1')} key="1">
					<AGrid>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</AGrid>
				</TabPane>
				{/* 센터별 상세 */}
				<TabPane tab={t('lbl.KP_LOCATION_CAPA_SCAN_T2')} key="2">
					<AGrid>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
						<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
					</AGrid>
				</TabPane>
			</Tabs>
		</>
	);
};

export default KpLocationCapaScanDetail;
