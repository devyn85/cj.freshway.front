/*
 ############################################################################
 # FiledataField	: RtReceiptConfirmDetail.tsx
 # Description		: 반품 > 반품작업 > 반품확정처리 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.09.16
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtReceiptConfirmDetail = ({
	form1,
	gridRef,
	gridRef1,
	gridRef2,
	gridData,
	activeKey,
	setActiveKey,
	gridDataDetail,
	gridDataDetail2,
	searchDetailList,
	searchDetailList2,
	tempSaveMasterList,
	openEmailModal,
	saveMasterList,
	cancelMasterList,
	openModal,
	modalRef3,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const excelParams = {
		fileName: '반품확정처리',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			/* 2025-12-28 FWNEXTWMS-5283 삭제요청*/
			// {
			// 	btnType: 'btn4', // 사용자 정의버튼1
			// 	btnLabel: '확정기준마스터',
			// 	authType: 'new',
			// 	callBackFn: openModal,
			// },
			// {
			// 	btnType: 'btn1', // 사용자 정의버튼1
			// 	btnLabel: '임시저장',
			// 	authType: 'new',
			// 	callBackFn: () => {
			// 		tempSaveMasterList();
			// 	},
			// },
			// {
			// 	btnType: 'btn2', // 사용자 정의버튼1
			// 	btnLabel: '이메일',
			// 	authType: 'new',
			// 	callBackFn: () => {
			// 		openEmailModal();
			// 	},
			// },
			// {
			// 	btnType: 'btn3', // 사용자 정의버튼1
			// 	btnLabel: '취소',
			// 	authType: 'new',
			// 	callBackFn: () => {
			// 		cancelMasterList();
			// 	},
			// },
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save',
				callBackFn: () => {
					saveMasterList(0);
				},
			},
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
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
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'),
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
			dataField: 'cnt',
			headerText: t('lbl.RETURN_CNT'),
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
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
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
					dataType: 'string',
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
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
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.UNRETURNQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			align: 'center',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.TRANQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'shortagetranqty',
			headerText: t('lbl.UNRETURNTRANQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
		},
		{
			headerText: t('lbl.UNRETURNINFO'),
			children: [
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
					headerText: t('lbl.REMARK'),
					dataType: 'code',
					editable: true,
				},
			],
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
			dataField: 'confirmdate',
			headerText: t('lbl.CONFIRMDATE_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'packingmethod',
			headerText: t('lbl.PACKINGMETHOD'),
			dataType: 'code',
			editable: false,
		},
		// {
		// 	dataField: 'reasonmsg',
		// 	headerText: t('lbl.REASONMSG_RT'),
		// 	dataType: 'code',
		// 	editable: false,
		// },
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
		/* 2025-12-28 FWNEXTWMS-5283 삭제요청*/
		// {
		// 	dataField: 'chgReqDeptCd',
		// 	headerText: t('lbl.REASONTYPE_CHAN'),
		// 	dataType: 'code',
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('OTHER01_DMD'),
		// 	},
		// 	editable: true,
		// },
		// {
		// 	dataField: 'emailSendDate',
		// 	headerText: t('lbl.EMAIL_SENDTIME'),
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'ordertypename',
			headerText: t('lbl.ORDERTYPE_RT'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'saleorganize',
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
			dataField: 'salegroup',
			headerText: t('lbl.CUSTGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
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
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'billtocustkey',
			headerText: t('lbl.TO_VATNO'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.billtocustkey,
						custtype: 'C' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{
			dataField: 'billtocustname',
			headerText: t('lbl.TO_VATOWNER'),
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					modalRef3.current?.handlerOpen();
				},
			},
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
	];

	const gridCol1 = [
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
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
					dataType: 'string',
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
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
			dataField: 'channel',
			headerText: t('lbl.CHANNEL'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.CUSTORDERQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			align: 'center',
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			align: 'center',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'butcherydt',
					headerText: t('도축일자'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('계약유형'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROM'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TO'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
	];

	const gridCol2 = [
		{
			headerText: t('lbl.CLAIMNO'),
			/*클레임번호*/ dataField: 'sapclaimno',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			width: 100,
		},
		{
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			dataType: 'string',
			filter: {
				showIcon: true,
			},
			width: 500,
		},
		{
			headerText: t('lbl.CLAIMMSG') /*세부내역*/,
			dataField: 'memo',
			// wrapText: true,
			style: 'memo-cell',
			// width: 347,
		},
		{
			headerText: t('lbl.WRITER'),
			/*작성자*/ dataField: 'writer',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: t('lbl.WRITERDATE'),
			/*작성일자*/ dataField: 'writedate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			width: 100,
		},
		{
			headerText: t('lbl.WRITETIME'),
			/*작성시간*/ dataField: 'writetime',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4, 6); // 시간 형식으로 변환
			},
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
	const gridProps1 = {
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps2 = {
		editable: false,
		wordWrap: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
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
	let prevRowIndex: any = null;
	const initEvent = () => {
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			setActiveKey('2');
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
			searchDetailList2(gridRef.current.getSelectedRows()[0]);
		});

		gridRef.current.bind('rowCheckClick', (e: any) => {
			const { orderqty, confirmqty, shortageqty } = e.item;
			if (e.checked) {
				gridRef.current.setCellValue(
					e.rowIndex,
					'tranqty',
					parseFloat(orderqty) - parseFloat(confirmqty) - parseFloat(shortageqty),
				);
			}
		});

		gridRef.current.bind('rowAllCheckClick', (checked: boolean) => {
			const gridData = gridRef.current.getGridData();
			if (checked) {
				gridRef.current.updateRowsById(
					gridData.map((item: any) => ({
						...item,
						tranqty: parseFloat(item.orderqty) - parseFloat(item.confirmqty) - parseFloat(item.shortageqty),
					})),
				);
			}
		});

		gridRef.current.bind('cellEditBegin', (e: any) => {
			if (['lotManufacture', 'lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { inspectserialkey } = gridRef.current.getGridData()[rowIndex];
				if (inspectserialkey) {
					return false;
				}
			}
		});

		gridRef.current.bind('cellEditEnd', (e: any) => {
			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationtype } = gridRef.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');

				gridRef.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				gridRef.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationtype } = gridRef.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');

				gridRef.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				gridRef.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	//탭1조회
	useEffect(() => {
		if (activeKey == '1') {
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		}
	}, [activeKey]);

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

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataDetail);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
			gridRef.current.setFocus();
		}
	}, [gridDataDetail]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridDataDetail2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				// gridRef2.current.setColumnSizeList(colSizeList);
			}
			gridRef.current.setFocus();
		}
	}, [gridDataDetail2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	const tabItems = [
		{
			key: '1',
			label: '이력정보',
			children: (
				<>
					<GridTopBtn
						gridTitle={t('lbl.LIST')}
						gridBtn={gridBtn1}
						totalCnt={gridDataDetail?.length}
						style={{ marginTop: '15px', marginBottom: '15px' }}
					/>

					<GridAutoHeight id="history-information">
						<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '클레임내역',
			children: (
				<>
					<GridTopBtn
						gridTitle={t('lbl.LIST')}
						gridBtn={gridBtn2}
						totalCnt={gridDataDetail2?.length}
						style={{ marginTop: '15px', marginBottom: '15px' }}
					/>
					<GridAutoHeight id="claim-details">
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</GridAutoHeight>
				</>
			),
		},
	];

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight id="return-receipt-confirmed-grid">
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<TabsArray
						key="receipt-confirm-detail-tab"
						activeKey={activeKey}
						onChange={key => setActiveKey(key)}
						items={tabItems}
					/>,
				]}
			/>
		</>
	);
};
export default RtReceiptConfirmDetail;
