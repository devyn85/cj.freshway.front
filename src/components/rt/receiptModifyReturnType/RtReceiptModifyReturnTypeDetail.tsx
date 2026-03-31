/*
 ############################################################################
 # FiledataField	: RtReceiptModifyReturnTypeDetail.tsx
 # Description		: 반품 > 반품작업 > 반품회수/미회수변경 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.09.10
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtReceiptModifyReturnTypeDetail = ({
	form1,
	isShow,
	gridRef,
	gridRef1,
	gridRef4,
	gridData,
	gridDataDetail,
	gridDataExcel,
	searchDetailList,
	openModal,
	applyReason,
	saveExcept,
	saveRtReceiptModifyReturnTypeMaster,
	saveRtReceiptModifyReturnTypeDetail,
	savePlt,
	applyQty,
	printDetailList,
	searchExcelList,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const excelParams = {
		fileName: '반품회수/미회수변경',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: () => {
					saveRtReceiptModifyReturnTypeMaster(0);
				},
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'), //창고명
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docnoWd',
			headerText: t('lbl.DOCNO_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docdtWd',
			headerText: t('lbl.SOURCECONFIRMDATE_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.SOURCEKEY_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'potypename',
			headerText: t('lbl.POTYPE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'returncarno',
			headerText: t('lbl.RETURNCARNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			editable: false,
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
					gridRef.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			editable: false,
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channelname',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.CUSTORDERQTY_RT'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.RETURNQTY_RT'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.UNRETURNQTY_RT'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'confirmdate',
			headerText: t('lbl.RETURNDATE_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'packingmethod',
			headerText: t('lbl.PACKINGMETHOD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'returntype',
			headerText: t('lbl.RETURNTYPE_RT'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('RETURNTYPE_RT'),
			},
			editable: true,
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.NOTRECALLREASON_RT'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_RT'),
			},
			editable: true,
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.NOTRECALLREASONMSG_RT'),
			dataType: 'code',
			editable: true,
		},
		{
			dataField: 'other01',
			headerText: t('lbl.REASONTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'blngdeptname',
			headerText: t('lbl.BLNGDEPTCD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ordertypename',
			headerText: t('lbl.ORDERTYPE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'salegroup',
			headerText: t('lbl.SALEGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'saledepartment',
			headerText: t('lbl.SALEDEPARTMENT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custgroup',
			headerText: t('lbl.CUSTGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.CUSTKEY_WD'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			editable: false,
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.fromCustkey,
						custtype: 'C' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.CUSTNAME_WD'),
			filter: {
				showIcon: true,
			},
			align: 'center',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'other03',
			headerText: t('lbl.CLAIMDTLIDS'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other04',
			headerText: t('lbl.CLAIMDTLID'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'vendoreturn',
			headerText: t('lbl.VENDORETURNYN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'ifAuditFile',
			headerText: t('lbl.IF_AUDIT_FILE_SAP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ifSendFile',
			headerText: t('lbl.IF_SEND_FILE_SAP'),
			dataType: 'code',
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
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
    showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(
				gridData.map((item: any) => ({
					...item,
					other03: item.other03 == 'UNKNOWN' ? '' : item.other03,
					other04: item.other04 == 'UNKNOWN' ? '' : item.other04,
				})),
			);
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
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
};
export default RtReceiptModifyReturnTypeDetail;
