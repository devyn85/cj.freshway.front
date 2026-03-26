/*
 ############################################################################
 # FiledataField	: KpCenterDayTMDlvStateDetail.tsx
 # Description		: 지표 > 센터 운영 > 배송조별 출자 평균시간 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.01
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpCenterDayTMDlvStateDetail = ({ gridData, gridRef }: any) => {
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
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
	};

	// 지표
	const getDlvtype = (value: any) => {
		let codeNm = '';

		if (value === 'START') {
			// 출차시작
			codeNm = t('lbl.OUT_START');
		} else if (value === 'END') {
			// 출차완료
			codeNm = t('lbl.OUT_END');
		} else {
			// 출차평균
			codeNm = t('lbl.OUT_AVG');
		}
		return codeNm;
	};

	// 단위
	const getUom = () => {
		return t('lbl.TIME_MIN');
	};

	// 그리드 초기화
	const gridCol = [
		// 01. 물류센터
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			cellMerge: true,
			width: 150,
		},
		// 02. 구분
		{
			dataField: 'cargroup',
			headerText: t('lbl.GUBUN_2'),
			dataType: 'code',
			cellMerge: true,
			width: 100,
		},
		// 03. 지표
		{
			dataField: 'dlvtype',
			headerText: t('lbl.INDICATOR'),
			dataType: 'code',
			labelFunction: getDlvtype,
			width: 120,
		},
		// 04. 단위
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			labelFunction: getUom,
			width: 120,
		},
		// 월 단위
		{
			headerText: t('lbl.MONTH_UOM'),
			children: [
				{
					// 05. 전월 일평균
					dataField: 'avgPremonth',
					headerText: t('lbl.PRE_MONTH_DAY_AVG'),
					dataType: 'code',
					width: 150,
					//style: 'ta-r',
				},
				{
					// 06. 당월 일평균
					dataField: 'avgMonth',
					headerText: t('lbl.CUR_MONTH_DAY_AVG'),
					dataType: 'code',
					width: 150,
					//style: 'ta-r',
				},
				{
					// 전월 比 증감
					headerText: t('lbl.PRE_MONTH_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 07. 증감량
							dataField: 'diffMonth',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'code',
							width: 150,
							//style: 'ta-r',
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
					// 08. 전일
					dataField: 'avgPreday',
					headerText: t('lbl.PRE_DAY'),
					dataType: 'code',
					width: 150,
					//style: 'ta-r',
				},
				{
					// 09. 당일
					dataField: 'avgDay',
					headerText: t('lbl.THEDAY'),
					dataType: 'code',
					width: 150,
					//style: 'ta-r',
				},
				{
					// 전일 比 증감
					headerText: t('lbl.PRE_DAY_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 10. 증감량 (전일 比 증감)
							dataField: 'diffDay',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'code',
							width: 150,
							//style: 'ta-r',
						},
					],
				},
				{
					// 전월 比 증감
					headerText: t('lbl.PRE_MONTH_DIFF_IN_DE_CREASE'),
					children: [
						{
							// 11. 증감량 (전월 比 증감)
							dataField: 'diffMonthday',
							headerText: t('lbl.IN_DE_CREASE'),
							dataType: 'code',
							width: 150,
							//style: 'ta-r',
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
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default KpCenterDayTMDlvStateDetail;
