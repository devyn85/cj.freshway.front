/*
 ############################################################################
 # FiledataField	: Ms3plMapingDetail.tsx
 # Description		: 기준정보 > 기준정보작업 > 3PL전산기준목록 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.11.18
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Ms3plMapingDetail = ({ gridRef, gridData }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const excelParams = {
		fileName: '3PL전산기준목록',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'courier',
			headerText: t('lbl.THIRD_PARTY_VENDOR'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.courier,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{
			dataField: 'couriernm',
			headerText: t('lbl.THIRD_PARTY_VENDOR_NAME'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.PARTNER1'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.custkey,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{
			dataField: 'custnm',
			headerText: t('lbl.PARTNER_NAME1'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'startDate',
			headerText: t('lbl.OPERATION_START_DATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'contractyn',
			headerText: t('전자계약완료'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'addwho',
			headerText: t('등록자'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('등록일시'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('수정자'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('수정일시'),
			dataType: 'date',
			editable: false,
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
	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

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
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};
export default Ms3plMapingDetail;
