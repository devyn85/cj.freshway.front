/*
 ############################################################################
 # FiledataField	: DpInplanTimeDetail.tsx
 # Description		: 입고 > 입고현황 > 입고 예정진행 현황(입차시간) Grid
 # Author			: KimDongHan
 # Since			: 2025.12.01
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpInplanTimeDetail = ({ gridData, gridRef, complyList }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 준수여부
	const complyLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		const found = complyList.find((it: any) => it?.comCd == value);
		return found?.cdNm ?? '';
	};

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
		showRowCheckColumn: false, // 체크박스
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		headerHeight: 36,
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 입고일자
			dataField: 'deliverydate',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// FROM 입고예정시간
			dataField: 'fromIntime',
			headerText: t('lbl.FROM_EXPECTDLVTIME'),
			dataType: 'code',
			editable: false,
			width: 70,
		},
		{
			// TO 입고예정시간
			dataField: 'toIntime',
			headerText: t('lbl.TO_EXPECTDLVTIME'),
			dataType: 'code',
			editable: false,
			width: 70,
		},
		{
			// 협력사코드
			dataField: 'fromCustkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current?.openPopup(
						{
							custkey: e.item.fromCustkey,
							//custtype: e.item.fromCusttype,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			width: 80,
		},
		{
			// 협력사명
			dataField: 'custname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'text',
			editable: false,
			width: 290,
		},
		{
			// 입고전표번호
			dataField: 'docno',
			headerText: t('lbl.SLIPNO_DP'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// QR 입문시간
			dataField: 'realIntime',
			headerText: t('lbl.QR_ENTRY_TIME'),
			dataType: 'code',
			editable: false,
			width: 70,
		},
		{
			// 시간차이
			dataField: 'diffHhmi',
			headerText: t('lbl.TIME_DIFF'),
			dataType: 'code',
			editable: false,
			width: 70,
		},
		{
			// 준수여부
			dataField: 'comply30min',
			headerText: t('lbl.COMPLY_YN'),
			dataType: 'code',
			editable: false,
			labelFunction: complyLabelFunc,
			width: 70,
		},
		{
			// 냉장온도
			dataField: 'temperature1',
			headerText: t('lbl.REFRIGETEMPERATURE'),
			dataType: 'numeric',
			editable: false,
			width: 60,
		},
		{
			// 냉동온도
			dataField: 'temperature2',
			headerText: t('lbl.FREEZINGTEMPERATURE'),
			dataType: 'numeric',
			editable: false,
			width: 60,
		},
		{
			// 하차검수시간
			dataField: 'deliverytime',
			headerText: t('lbl.UNLOADINSPECT_TIME'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 저장유무
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
			width: 80,
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
			{/* <AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid> */}

			<AGrid className="contain-wrap">
				<GridTopBtn
					gridBtn={gridBtn}
					gridTitle={t('lbl.LIST')}
					totalCnt={gridData?.length}
					extraContentLeft={<span className="msg">{t('msg.MSG_DP_INPLAN_TIME_003')}</span>}
				/>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default DpInplanTimeDetail;
