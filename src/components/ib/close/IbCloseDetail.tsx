/*
 ############################################################################
 # FiledataField	: IbCloseDetail.tsx
 # Description		: Admin > 모니터링 > 마감상태 관리 Grid
 # Author			: KimDongHan
 # Since			: 2025.08.21
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const IbCloseDetail = ({ gridData, gridRef, saveMasterList }: any) => {
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
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: false,        // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 컬럼 설정
	const gridCol = [
		// 1. 년월
		{
			dataField: 'closedt',
			headerText: t('lbl.YEARMONTH'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calenderYM',
			},
			width: 120,
		},
		// 2. 물류센터
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		// 3. 물류센터명
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		// 4. 플랜트
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
			width: 200,
		},
		// 5. 삭제여부(필수, 수정가능)
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: [
					{ comCd: 'Y', cdNm: 'Y' },
					{ comCd: 'N', cdNm: 'N' },
				],
			},
			required: true,
			width: 100,
		},
		// 6. SAP마감상태
		{
			dataField: 'sapYn',
			headerText: t('lbl.SAP_CLOSE_STATUS'),
			dataType: 'code',
			editable: false,
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
		// 이벤트
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
				{/* 마감상태 관리 목록 */}
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default IbCloseDetail;
