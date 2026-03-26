/*
 ############################################################################
 # FiledataField	: DpInspectDailyPrintDetail.tsx
 # Description		: 입고 > 입고작업 > 일배입고검수출력 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.07.10
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type PropsType = {
	form: any;
	gridData: any[];
	gridDataDetail: any[];
	gridDataPoNot: any[];
	searchDetailList: (row: any) => void;
	savePoMapping: (row: any) => void;
	printMasterList: (row: any) => void;
	gridRef: any;
	gridRef1: any;
	gridRef2: any;
};

const DpInspectDailyPrintDetail = ({
	form,
	gridData,
	gridDataDetail,
	gridDataPoNot,
	searchDetailList,
	savePoMapping,
	printMasterList,
	gridRef,
	gridRef1,
	gridRef2,
}: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [activeMaster, setActiveMaster] = useState('1');

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				callBackFn: printMasterList,
			},
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: 'PO맵핑',
				authType: 'btn1',
				callBackFn: () => {
					savePoMapping(form.getFieldsValue());
				},
			},
		],
	};
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'slipno',
			headerText: t('lbl.SLIPNO_DP'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'ordertypeName',
			headerText: t('lbl.ORDERTYPE_DP'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_DP'),
			align: 'center',
			dataType: 'date',
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			dataType: 'string',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS_DP'),
			align: 'center',
			dataType: 'code',
		},
	];

	const gridCol1 = [
		{
			dataField: 'slipno',
			headerText: t('lbl.SLIPNO_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'ordertypeName',
			headerText: t('lbl.ORDERTYPE_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'),
			align: 'center',
			dataType: 'date',
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'),
			align: 'center',
			dataType: 'string',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS_WD'),
			align: 'center',
			dataType: 'code',
		},
	];

	const gridCol2 = [
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					gridRef2.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			dataType: 'string',
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'orderadjustqty',
			headerText: t('lbl.INPLANQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'confirmweight',
			headerText: t('lbl.CONFIRMWEIGHT'),
			align: 'center',
			dataType: 'code',
			formatString: '#,##0.###',
		},
		{
			dataField: 'ifAuditFile',
			headerText: t('lbl.IF_AUDIT_FILE_SAP'),
			align: 'center',
			dataType: 'code',
		},
		{
			dataField: 'ifSendFile',
			headerText: t('lbl.IF_SEND_FILE_SAP'),
			align: 'center',
			dataType: 'code',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			//표준센터이동 KX이체오더 체크 X
			if (['ZKUB', 'ZUB'].includes(item.ordertype) || !item?.slipno?.startsWith('IV') || item?.channel == '1') {
				return false;
			}
			return true;
		},
	};
	const gridProps1 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps2 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
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
		gridRef.current.bind('selectionChange', function () {
			setActiveMaster('1');
			searchDetailList({ ...gridRef.current.getSelectedRows()[0], isPoNotMap: false });
		});
		gridRef1.current.bind('selectionChange', function () {
			setActiveMaster('2');
			searchDetailList({ ...gridRef1.current.getSelectedRows()[0], isPoNotMap: true });
		});
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

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataPoNot);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridDataPoNot]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridDataDetail);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current.setColumnSizeList(colSizeList);
			}
		}
		(activeMaster == '1' ? gridRef : gridRef1).current.setFocus();
	}, [gridDataDetail]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="DpInspectDailyPrint-top-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridTitle={'PO미매핑 거래처 목록'} gridBtn={gridBtn1} totalCnt={gridDataPoNot?.length} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
								</GridAutoHeight>
							</>,
						]}
					/>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn2} totalCnt={gridDataDetail?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default DpInspectDailyPrintDetail;
