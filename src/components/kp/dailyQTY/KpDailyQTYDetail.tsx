/*
 ############################################################################
 # FiledataField	: KpDailyQTYDetail.tsx
 # Description		: 지표 > 센터 운영 > 일일 물동량 조회 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.02
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpDailyQTYDetail = ({ gridData, gridRef }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성 Master
	const gridProps = {
		groupingFields: ['dccode'],
		groupingSummary: {
			dataFields: ['orderweight', 'ordercustcount', 'confirmweight', 'confirmcustcount'],
			labelTexts: [''], // 소계 행 라벨 텍스트
			rows: [
				{
					// 썸머리 필드에 임의의 텍스트 설정
					text: {
						custstrategy3: [t('lbl.SUBTOTAL')],
					},
				},
			],
		},
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성

		//showFooter: true,           // 불필요한 경우 삭제 해도 됨
		displayTreeOpen: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false, // 여백 윗줄 지우기.
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				// 계층형의 depth 비교 연산
				switch (item._$depth) {
					case 2:
						return 'bg-lavender';
					// case 3:
					// 	return 'aui-grid-row-depth2-style';
					// case 4:
					// 	return 'aui-grid-row-depth3-style';
					// default:
					// 	return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	// 그리드 초기화
	const gridCol = [
		// 물류센터
		{
			headerText: t('lbl.DCCODE'),
			children: [
				{
					// 01. 물류센터
					dataField: 'dccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
					width: 80,
				},
				{
					// 02. 물류센터명
					dataField: 'dcname',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
					cellMerge: true,
					width: 150,
				},
				{
					// 03. 창고
					dataField: 'organizename',
					headerText: t('lbl.STORE'),
					dataType: 'code',
					cellMerge: true,
					width: 300,
				},
				{
					// 04. 경로
					dataField: 'custstrategy3',
					headerText: t('lbl.COURSE'),
					dataType: 'text',
					width: 300,
				},
			],
		},
		// 주문량
		{
			headerText: t('lbl.STOREROPENQTY'),
			children: [
				{
					// 05. 물동량
					dataField: 'orderweight',
					headerText: t('lbl.QUANTITY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					disableGrouping: true, // 그룹핑의 직접적인 대상이 될 수 없음
					width: 200,
				},
				{
					// 06. 거래처수
					dataField: 'ordercustcount',
					headerText: t('lbl.VENDOR_CNT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					disableGrouping: true, // 그룹핑의 직접적인 대상이 될 수 없음
					width: 200,
				},
			],
		},
		// 출고량
		{
			headerText: t('lbl.WDQTY'),
			children: [
				{
					// 07. 물동량
					dataField: 'confirmweight',
					headerText: t('lbl.QUANTITY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					disableGrouping: true, // 그룹핑의 직접적인 대상이 될 수 없음
					width: 200,
				},
				{
					// 08. 거래처수
					dataField: 'confirmcustcount',
					headerText: t('lbl.VENDOR_CNT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					disableGrouping: true, // 그룹핑의 직접적인 대상이 될 수 없음
					width: 200,
				},
			],
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

	return (
		<>
			{/* 일일물동량조회(기간별) 목록 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default KpDailyQTYDetail;
