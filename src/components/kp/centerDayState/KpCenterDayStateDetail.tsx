/*
 ############################################################################
 # FiledataField	: KpCenterDayStateDetail.tsx
 # Description		: 지표 > 센터 운영 > 출고 유형별 물동 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.03
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReact';
import { GridBtnPropsType } from '@/types/common';

import TabPane from 'antd/es/tabs/TabPane';

import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpCenterDayStateDetail = ({
	activeKey,
	setActiveKey,
	gridRef,
	gridRef1,
	gridRef2,
	gridData,
	gridData1,
	gridData2,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	/////////////////////////////////////////// 1. 배송물류 ///////////////////////////////////////////
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
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.course === '00') {
				return 'bg-gray';
			} else {
				return '';
			}
		},
	};
	// 그리드 초기화
	const gridCol = [
		// 01. 물류센터
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'course', // 대분류(course 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict', // mergeRef 필드의 값이 같은 경우에만 셀머지 실행
			width: 150,
		},
		// 02. 경로
		{
			dataField: 'coursenm',
			headerText: t('lbl.COURSE'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
		},
		// 03. 저장유무
		{
			dataField: 'channelnm',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
		},
		// 04. 지표
		{
			dataField: 'indicator',
			headerText: t('lbl.INDICATOR'),
			dataType: 'code',
			width: 150,
		},
		// 05. 단위
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			width: 150,
			//labelFunction: getUomNm,
			//styleFunction,
		},
		// 월 단위
		{
			headerText: t('lbl.MONTH_UOM'),
			children: [
				{
					// 06. 전월 일평균
					dataField: 'premonth',
					headerText: t('lbl.PRE_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 07. 당월 일평균
					dataField: 'month',
					headerText: t('lbl.CUR_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전월 比 증감
					headerText: t('lbl.PRE_MONTH_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 08. 증감량
							dataField: 'monthincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 09. 증감율
							dataField: 'monthincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
				},
			],
		},

		// 일 단위
		{
			headerText: t('lbl.DAY_UOM'),
			children: [
				{
					// 10. 전일
					dataField: 'preday',
					headerText: t('lbl.PRE_DAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 11. 당일
					dataField: 'day',
					headerText: t('lbl.THEDAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전일 比 증감
					headerText: t('lbl.PRE_DAY_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 12. 증감량 (전일 比 증감)
							dataField: 'dayincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 13. 증감율 (전일 比 증감)
							dataField: 'dayincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
				},
			],
		},
	];

	/////////////////////////////////////////// 2. 수송물동 ///////////////////////////////////////////
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
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,           // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.course === '00') {
				return 'bg-gray';
			} else {
				return '';
			}
		},
	};
	// 그리드 초기화
	const gridCol1 = [
		// 01. 물류센터
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'course', // 대분류(course 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict', // mergeRef 필드의 값이 같은 경우에만 셀머지 실행
			width: 150,
			//styleFunction,
		},
		// 02. 구간
		{
			dataField: 'coursenm',
			headerText: t('lbl.SECTION'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
			//labelFunction: getTotalNm,
			//styleFunction,
		},
		// 03. 저장유무
		{
			dataField: 'channelnm',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
			//labelFunction: getSubTotalNm,
			//styleFunction,
		},
		// 04. 지표
		{
			dataField: 'indicator',
			headerText: t('lbl.INDICATOR'),
			dataType: 'code',
			width: 150,
			//labelFunction: getIndicatorNm,
			//styleFunction,
		},
		// 05. 단위
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			width: 150,
			//labelFunction: getUomNm,
			//styleFunction,
		},
		// 월 단위
		{
			headerText: t('lbl.MONTH_UOM'),
			children: [
				{
					// 06. 전월 일평균
					dataField: 'premonth',
					headerText: t('lbl.PRE_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 07. 당월 일평균
					dataField: 'month',
					headerText: t('lbl.CUR_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전월 比 증감
					headerText: t('lbl.PRE_MONTH_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 08. 증감량
							dataField: 'monthincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 09. 증감율
							dataField: 'monthincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
				},
			],
		},

		// 일 단위
		{
			headerText: t('lbl.DAY_UOM'),
			children: [
				{
					// 10. 전일
					dataField: 'preday',
					headerText: t('lbl.PRE_DAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 11. 당일
					dataField: 'day',
					headerText: t('lbl.THEDAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전일 比 증감
					headerText: t('lbl.PRE_DAY_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 12. 증감량 (전일 比 증감)
							dataField: 'dayincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 13. 증감율 (전일 比 증감)
							dataField: 'dayincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
				},
			],
		},
	];

	/////////////////////////////////////////// 3. 배송차량 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 그리드 속성
	const gridProps2 = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,           // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.course === '00') {
				return 'bg-gray';
			} else {
				return '';
			}
		},
	};
	// 그리드 초기화
	const gridCol2 = [
		// 01. 물류센터
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'course', // 대분류(course 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict', // mergeRef 필드의 값이 같은 경우에만 셀머지 실행
			width: 150,
			//styleFunction,
		},
		// 02. 차량종류
		{
			dataField: 'coursenm',
			headerText: t('lbl.CARCONTRACTTYPE'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
			//labelFunction: getTotalNm,
			//styleFunction,
		},
		// 03. 차량톤수
		{
			dataField: 'capacitynm',
			headerText: t('lbl.CARCAPACITY'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
			//labelFunction: getSubTotalNm,
			//styleFunction,
		},
		// 04. 지표
		{
			dataField: 'indicator',
			headerText: t('lbl.INDICATOR'),
			dataType: 'code',
			width: 150,
			//labelFunction: getIndicatorNm,
			//styleFunction,
		},
		// 05. 단위
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			width: 150,
			//labelFunction: getUomNm,
			//styleFunction,
		},
		// 월 단위
		{
			headerText: t('lbl.MONTH_UOM'),
			children: [
				{
					// 06. 전월 일평균
					dataField: 'premonth',
					headerText: t('lbl.PRE_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 07. 당월 일평균
					dataField: 'month',
					headerText: t('lbl.CUR_MONTH_DAY_AVG'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전월 比 증감
					headerText: t('lbl.PRE_MONTH_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 08. 증감량
							dataField: 'monthincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 09. 증감율
							dataField: 'monthincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
				},
			],
		},

		// 일 단위
		{
			headerText: t('lbl.DAY_UOM'),
			children: [
				{
					// 10. 전일
					dataField: 'preday',
					headerText: t('lbl.PRE_DAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 11. 당일
					dataField: 'day',
					headerText: t('lbl.THEDAY'),
					dataType: 'numeric',
					width: 150,
					//styleFunction,
				},
				{
					// 전일 比 증감
					headerText: t('lbl.PRE_DAY_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 12. 증감량 (전일 比 증감)
							dataField: 'dayincdec',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
						{
							// 13. 증감율 (전일 比 증감)
							dataField: 'dayincdecper',
							headerText: t('lbl.IN_DE_CREASE_RATE'),
							dataType: 'numeric',
							width: 150,
							//styleFunction,
						},
					],
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
				const colSizeList = gridRef.current?.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current?.setColumnSizeList(colSizeList);
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
				const colSizeList = gridRef1.current?.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current?.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	return (
		<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} className="contain-wrap">
			{/* 배송물동 */}
			<TabPane tab={t('lbl.DELIVERY_QTY')} key="1">
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</TabPane>
			{/* 수송물동 */}
			<TabPane tab={t('lbl.TRANSPORT_QTY')} key="2">
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
					<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
				</AGrid>
			</TabPane>
			{/* 배송차량 */}
			<TabPane tab={t('lbl.DELIVERY_CAR')} key="3">
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length} />
					<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
				</AGrid>
			</TabPane>
		</Tabs>
	);
};

export default KpCenterDayStateDetail;
