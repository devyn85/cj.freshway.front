/*
 ############################################################################
 # FiledataField	: KpWdShortageResultDetail.tsx
 # Description		: 지표/모니터링 > 센터운영지표 > 출고결품실적 조회 Grid Header
 # Author			: KimDongHan
 # Since			: 2025.12.02
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const KpWdShortageResultDetail = ({
	gridRef,
	gridRef1,
	gridRef2,
	gridData,
	gridData1,
	gridData2,
	activeKey,
	setActiveKey,
	colList,
	searchDetailList,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	/////////////////////////// 월요약 상단 그리드 ///////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const baseCols = useMemo(
		() => [
			{
				// 상품구분
				dataField: 'skupartname',
				headerText: t('lbl.SKUPART'),
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				// 누계
				dataField: 'total',
				headerText: t('lbl.TOTAL_WD'),
				dataType: 'numeric',
				editable: false,
				width: 100,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			},
			{
				// 평균
				dataField: 'average',
				headerText: t('lbl.AVERAGE'),
				dataType: 'numeric',
				editable: false,
				width: 100,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			},
			{
				// 목표
				dataField: 'goal',
				headerText: t('lbl.GOAL'),
				dataType: 'numeric',
				editable: true,
				width: 100,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			},
		],
		[],
	);

	/////////////////////////// 월요약 하단 그리드 ///////////////////////////
	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const baseCols1 = useMemo(
		() => [
			{
				// 결품사유
				dataField: 'reasoncodename',
				headerText: t('lbl.REASONCODE_WD'),
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				// 누계
				dataField: 'total',
				headerText: t('lbl.TOTAL_WD'),
				dataType: 'numeric',
				editable: false,
				width: 100,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			},
			{
				// 평균
				dataField: 'average',
				headerText: t('lbl.AVERAGE'),
				dataType: 'numeric',
				editable: false,
				width: 100,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			},
			{
				// 목표
				dataField: 'goal',
				headerText: t('lbl.GOAL'),
				dataType: 'numeric',
				editable: true,
				width: 100,
			},
		],
		[],
	);

	// 일짜 컬럼(다이나믹)
	const dynamicDayCols = useMemo(() => {
		// 우선 colList를 사용 (각 항목에 colnm, day 필드 존재)
		if (Array.isArray(colList) && colList.length > 0) {
			return colList.map((it: any) => ({
				dataField: it.colField,
				headerText: it.colHeader,
				dataType: 'numeric',
				editable: false,
				width: 90,
				formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
			}));
		}
		// 반드시 배열 반환
		return [];
	}, [colList]);

	// 최종 그리드
	const gridCol = useMemo(() => [...baseCols, ...dynamicDayCols], [baseCols, dynamicDayCols]);
	const gridCol1 = useMemo(() => [...baseCols1, ...dynamicDayCols], [baseCols1, dynamicDayCols]);
	const colKey = useMemo(() => gridCol.map(c => String(c.dataField)).join('|') || 'base', [gridCol]);
	const colKey1 = useMemo(() => gridCol1.map(c => String(c.dataField)).join('|') || 'base', [gridCol1]);

	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	const gridProps2 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	// 그리드 초기화
	const gridCol2 = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			required: true,
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
		let prevSelectedRowJson: string | null = null;
		gridRef.current?.bind('selectionChange', (e: any) => {
			const selectedRow = gridRef.current?.getSelectedRows()[0];
			const selectedRowJson = selectedRow ? JSON.stringify(selectedRow) : null;
			if (prevSelectedRowJson !== null && selectedRowJson === prevSelectedRowJson) {
				return;
			}
			prevSelectedRowJson = selectedRowJson;

			//상세 조회
			searchDetailList(selectedRow);
		});
	};

	useEffect(() => {
		initEvent();
	}, [colKey]);

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
				//gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef.current?.setFocus();
	}, [gridData1]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef2.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef2.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: t('lbl.KP_WD_SHORTAGE_RESULT_TAB_1'),
			children: (
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid key={colKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridTitle={t('lbl.DETAIL')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid key={colKey1} ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
							</GridAutoHeight>
						</>,
					]}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.KP_WD_SHORTAGE_RESULT_TAB_2'),
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</GridAutoHeight>
				</>
			),
		},
	];

	return (
		<>
			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />
		</>
	);
};

export default KpWdShortageResultDetail;
