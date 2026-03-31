/*
 ############################################################################
 # FiledataField	: MsLocationPrintDetail.tsx
 # Description		: 기준정보 > 물류센터 정보 > 로케이션 라벨 출력 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.24
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MsLocationPrintDetail = ({ gridData, gridRef, printQr, printBarcode }: any) => {
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
				btnLabel: t('lbl.QR_PRINT'),
				authType: 'new',
				callBackFn: () => {
					printQr();
				},
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
				btnLabel: t('lbl.BARCODE_PRINT'),
				authType: 'new',
				callBackFn: () => {
					printBarcode();
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
		showFooter: false, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 02. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 03. 로케이션 그룹
			dataField: 'locGroup',
			headerText: t('lbl.LOC_GROUP'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 04. 로케이션 그룹설명
			dataField: 'locName',
			headerText: t('lbl.LOC_GROUP_DESC'),
			dataType: 'text',
			editable: false,
			width: 300,
		},
		{
			// 05. 단수
			dataField: 'layer',
			headerText: t('lbl.LAYER'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 06. 피킹존
			dataField: 'pickingZone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			editable: false,
			width: 150,
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
				//const colSizeList = gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				{/* 목록 */}
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default MsLocationPrintDetail;
