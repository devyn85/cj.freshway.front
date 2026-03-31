/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByRouteListGrid.tsx
 # Description		: 모니터링 > 배송 > 배송현황 > 경로별 탭 그리드
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
 */
// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { adjustProps } from '@/lib/AUIGrid/auIGridUtil';
import { forwardRef } from 'react';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// css
import AGrid from '@/assets/styled/AGrid/AGrid';

// API

// Util
import { useTranslation } from 'react-i18next';

// Store

// Const

// Types

// 파일 정의
const TmDeliveryStatusByRouteListGrid = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 변수 정의(1/4)
	const { t } = useTranslation(); // 다국어 처리
	/**
	 * [ props ]
	 * @param {string} gridData - 그리드 데이터
	 * @param {ref} gridRef - 그리드 Ref
	 * @param {Array} hjDongSelect - 행정동
	 * @param {state} setSelectedRowInCenterGrid - 그리드 선택 row state
	 * @param {ref} orderGroupGridRef - 주문 그룹 Ref
	 * @param {Function} searchList - 조회 function
	 * @param {form} form - 조회 조건
	 */
	const { gridData, totalCount, gridRef, searchList, form } = props;

	// React Ref 정의(2/4)

	// 초기값 정의(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 그리드 props
	const gridProps = adjustProps({
		editable: false, // 데이터 수정 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		enableCellMerge: true, // 셀 병합 실행
		showRowNumColumn: true, // 행번호
		noDataMessage: t('lbl.NO_DATA'), // 조회 결과가 없습니다.
		showFooter: true, // 푸터 표시
	});

	const footerLayout = [
		{ dataField: 'alertCustCnt', positionField: 'alertCustCnt', operation: 'SUM', formatString: '#,##0' },
		{ dataField: 'alertCnt', positionField: 'alertCnt', operation: 'SUM', formatString: '#,##0' },
		{ dataField: 'alertRate', positionField: 'alertRate', operation: 'AVG', formatString: '#,##0.00' },
	];

	// 그리드 columnLayout
	const gridCol = [
		// 물류센터
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
		},
		// 경로코드
		{
			dataField: 'course',
			dataType: 'code',
			headerText: '경로코드', // 경로코드
		},
		// 경로
		{
			dataField: 'courseName',
			headerText: '경로', // 경로
			dataType: 'code',
		},
		// 전체
		{
			dataField: 'alertCustCnt',
			dataType: 'numeric',
			headerText: '전체', // 전체
		},
		// 출/도착 보고
		{
			dataField: 'alertCnt',
			dataType: 'numeric',
			headerText: '출/도착 보고', // 출/도착 보고
		},
		// 보고율
		{
			dataField: 'alertRate',
			dataType: 'numeric',
			headerText: '보고율(%)', // 보고율
			formatString: '#,##0.00',
		},
	];

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 그리드 크기 조정
	useEffect(() => {
		if (gridRef.current) {
			gridRef.current?.resize();
		}
	}, []);

	/**
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 */
	return (
		<>
			<AGrid dataProps={'row-pull'}>
				<GridTopBtn gridTitle="목록" totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default TmDeliveryStatusByRouteListGrid;
