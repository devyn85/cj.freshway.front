/*
 ############################################################################
 # FiledataField	: DpReceiptDetail.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.08.22
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import { InputText, LabelText, SelectBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import Splitter from '@/components/common/Splitter';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType, GridBtnType } from '@/types/common';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpReceiptDetail2 = ({
	form,
	form2,
	isShow,
	gridRef2,
	gridRef3,
	gridRef5,
	gridData2,
	gridDataDetail2,
	searchDetailList,
	gridDataExcel2,
	openModal,
	applyReason,
	saveExcept,
	saveDpReceiptMaster,
	saveDpReceiptDetail,
	savePlt,
	applyQty,
	printDetailList,
	searchExcelList,
	reverseSto,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 아이콘 JSON any 타입으로 담기
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_DP');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			cdNm: item.cdNm,
			storagetype,
			start,
			end,
			rate,
		};
	});
	const icoSvgDataAny: any = icoSvgData;
	const getExcelFileName = () => {
		const dt1 = commUtil.isNull(form.getFieldValue('slipdt')) ? '' : form.getFieldValue('slipdt')[0].format('YYYYMMDD');
		const dt2 = commUtil.isNull(form.getFieldValue('slipdt')) ? '' : form.getFieldValue('slipdt')[1].format('YYYYMMDD');

		const dateStr = dt1 && dt2 ? `_${dayjs(dt1).format('YYYYMMDD')}_${dayjs(dt2).format('YYYYMMDD')}` : '';
		//
		return `입고확정처리_이력상품_${dateStr}`;
	};
	const excelParams = {
		fileName: getExcelFileName(),
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
		exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '기준마스터',
				authType: 'new',
				callBackFn: openModal,
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcelList,
			},
			{
				btnType: 'print',
				btnLabel: '인쇄',
				callBackFn: () => {
					printDetailList(2);
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					saveDpReceiptMaster(2);
				},
			},
		],
	};
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
		// btnArr: [
		// 	{
		// 		btnType: 'btn2', // 사용자 정의버튼1
		// 		btnLabel: '선택적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			applyReason(3);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn6', // 사용자 정의버튼1
		// 		btnLabel: '수량적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			applyQty(3);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn4', // 사용자 정의버튼1
		// 		btnLabel: '대상확정',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			saveDpReceiptDetail(3);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'copy', // 행복사
		// 		initValues: {
		// 			menuId: '',
		// 			regId: '',
		// 			regDt: '',
		// 		},
		// 	},
		// 	{
		// 		btnType: 'delete', // 행삭제
		// 	},
		// 	{
		// 		btnType: 'btn3', // 사용자 정의버튼1
		// 		btnLabel: '예외저장',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			saveExcept(3);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn5', // 사용자 정의버튼1
		// 		btnLabel: 'PLT(방단)적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			savePlt(3);
		// 		},
		// 	},
		// ],
	};

	// 그리드 초기화
	const gridCol2 = [
		{
			headerText: t('lbl.SLIPINFO'),
			children: [
				{
					dataField: 'slipno',
					headerText: t('lbl.SLIPNO_DP'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_DP'),
					dataType: 'date',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.PURCHASEINFO'),
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_DP'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'docdt',
					headerText: t('lbl.DOCDT_DP_PO'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'ordertypeName',
					headerText: t('lbl.ORDERTYPE_DP'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'route',
			headerText: t('lbl.CDELIVERYROUTE_NAME_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TODCINFO'),
			children: [
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
			],
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stotype',
			headerText: t('lbl.STOTYPE'),
			dataType: 'code',
			editable: false,
		},
	];

	const gridCol3 = [
		{
			dataField: 'restono',
			headerText: t('역STO번호'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'restoqty',
			headerText: t('역STO 수량'),
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
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			cellMerge: false,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			cellMerge: false,
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item?.sku,
						skuDescr: e.item?.skuName,
					};
					gridRef3.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			cellMerge: false,
			filter: {
				showIcon: true,
			},
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'countryoforigin',
			headerText: t('lbl.COUNTRYOFORIGIN'),
			cellMerge: false,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			cellMerge: false,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			cellMerge: false,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'),
			cellMerge: false,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'excptYn',
			headerText: t('lbl.EXCPT_YN'),
			dataType: 'code',
			editable: true,
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: true,
			},
		},
		{
			dataField: 'editwhoName',
			headerText: t('lbl.EXCPT_WHO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'openqtyEa',
			headerText: '예정수량(EA)',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'openqtyBox',
			headerText: '예정수량(BOX)',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'pltqty',
			headerText: 'PLT환산',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'boxperlayer',
			headerText: 'PLT(방)',
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
			},
		},
		{
			dataField: 'layerperplt',
			headerText: 'PLT(단)',
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
			},
		},
		{
			dataField: 'boxperplt',
			headerText: 'PLT(BOX)',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'docorderqty',
			headerText: t('lbl.ORDERQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: '입고예정량',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'orderweight',
			headerText: t('lbl.ORDERWEIGHT_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'confirmweight',
			headerText: t('lbl.CONFIRMWEIGHT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			headerText: t('lbl.INSPECTQTY'),
			children: [
				{
					dataField: 'inspectqtyWd',
					headerText: t('lbl.WD'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'inspectqty',
					headerText: t('lbl.DP'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY'),
			children: [
				{
					dataField: 'confirmqtyWd',
					headerText: t('lbl.WD'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.stoFlag == '1') {
							if (item?.confirmqtyWd != item?.confirmqty) {
								return { color: 'red' };
							} else {
								return { color: 'blue' };
							}
						} else {
							return { color: 'black' };
						}
					},
				},
				{
					dataField: 'confirmqty',
					headerText: t('lbl.DP'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.stoFlag == '1') {
							if (item?.confirmqtyWd != item?.confirmqty) {
								return { color: 'red' };
							} else {
								return { color: 'blue' };
							}
						} else {
							return { color: 'black' };
						}
					},
				},
			],
		},
		{
			headerText: t('lbl.SHORTAGEQTY'),
			children: [
				{
					dataField: 'shortageqtyWd',
					headerText: t('lbl.WD'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.stoFlag == '1') {
							if (item?.shortageqtyWd != item?.shortageqty) {
								return { color: 'red' };
							} else {
								return { color: 'blue' };
							}
						} else {
							return { color: 'black' };
						}
					},
				},
				{
					dataField: 'shortageqty',
					headerText: t('lbl.DP'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.stoFlag == '1') {
							if (item?.shortageqtyWd != item?.shortageqty) {
								return { color: 'red' };
							} else {
								return { color: 'blue' };
							}
						} else {
							return { color: 'black' };
						}
					},
				},
			],
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.TRANQTY_DP'),
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
			dataField: 'shortagetranqty',
			headerText: t('lbl.SHORTAGETRANQTY'),
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
			headerText: t('lbl.REASONINFO'),
			children: [
				{
					dataField: 'reasoncode',
					headerText: t('lbl.REASONCODE_DP'),
					dataType: 'code',
					commRenderer: {
						type: 'dropDown',
						list: getCommonCodeList('REASONCODE_DP'),
					},
					editable: true,
				},
				{
					dataField: 'reasonmsg',
					headerText: t('lbl.RESULTMSG'),
					dataType: 'code',
					editable: true,
				},
			],
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
				gridRef3.current.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'isEdit');
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
				gridRef3.current.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'isEdit');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef3.current.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'isEdit');
			},
		},
		{
			dataField: 'durationRate',
			headerText: t('lbl.DURATION_RATE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lastlottable01',
			headerText: t('lbl.LASTDURATION'),
			dataType: 'code',
			editable: false,
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
				/*
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
					dataType: 'code',
					editable: false,
				},*/
			],
		},
		{
			dataField: 'isPossible',
			headerText: t('입고가능여부'),
			dataType: 'code',
			editable: false,
			labelFunction: (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
				cItem: any,
			) => {
				return commUtil.isDpPossible(item, expCodeListMap) ? '입고가능' : '입고불가';
			},
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: commUtil.isDpPossible(item, expCodeListMap) ? 'blue' : 'red',
				};
			},
		},
		{
			dataField: 'draftNo',
			headerText: t('lbl.DRAFT_NO'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				onClick: async (e: any) => {
					const width = 1200;
					const height = 900;
					const left = window.screenX + (window.outerWidth - width) / 2;
					const top = window.screenY + (window.outerHeight - height) / 2;
					const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;
					const newWindow = window.open(
						`https://www.ifresh.co.kr/Approval/Document/DocFrame?DocFolderType=doc&DocID=${e.item?.draftNo}&refDocID=`,
						'EDMS',
						windowFeatures,
					);
					/*post 요청X 단순조회로 변경*/
					// const params = {
					// 	formSerial: 'SCM03',
					// 	systemID: 'SCM',
					// 	DATA_KEY1: dayjs().format('YYYYMMDD'),
					// 	DATA_KEY2: e.item.draftNo,
					// 	// OTU_ID: data, //유틸에서 sso티켓 호출
					// };
					//
					// extUtil.openApproval(params);
				},
			},
		},
	];

	const gridCol5 = [
		{
			headerText: t('lbl.SLIPINFO'),
			children: [
				{
					dataField: 'slipno',
					headerText: t('lbl.SLIPNO_DP'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_DP'),
					dataType: 'date',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.PURCHASEINFO'),
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_DP'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'docdt',
					headerText: t('lbl.DOCDT_DP_PO'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'ordertypeName',
					headerText: t('lbl.ORDERTYPE_DP'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'string',
			editable: false,
		},
		{
			headerText: t('lbl.TODCINFO'),
			children: [
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
			],
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
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'countryoforigin',
			headerText: t('lbl.COUNTRYOFORIGIN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channelName',
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
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'openqtyEa',
			headerText: t('예정수량(EA)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'openqtyBox',
			headerText: t('예정수량(BOX)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'pltqty',
			headerText: t('PLT환산'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'orderweight',
			headerText: t('lbl.ORDERWEIGHT_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC_DP'),
			dataType: 'code',
			editable: false,
		},
		// {
		// 	dataField: 'lottable01',
		// 	headerText: t('lbl.LOTTABLE01'),
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			// 제조일자
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
		},
		{
			// 소비일자
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lastlottable01',
			headerText: t('lbl.LASTDURATION'),
			dataType: 'code',
			editable: false,
		},
		// Hidden 컬럼들
		{ dataField: 'lottable01', headerText: 'lottable01', dataType: 'code', visible: false }, // lottable01
		{ dataField: 'duration', headerText: 'duration', dataType: 'code', visible: false }, // duration
		{ dataField: 'durationtype', headerText: 'durationtype', dataType: 'code', visible: false }, // durationtype
	];

	// 그리드 footer 설정
	const footerLayout5 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			//positionField: gridCol5[0].dataField, // 첫 번째 dataField 사용
			positionField: 'slipno',
		},
		{
			dataField: 'qtyperbox',
			positionField: 'qtyperbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'openqtyEa',
			positionField: 'openqtyEa',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'openqtyBox',
			positionField: 'openqtyBox',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param btn
	 */
	const preCallBackFn = (btn: GridBtnType) => {
		// 콜백 Function 호출 전 처리 사용 유무 로직 추가
		const { isActionEvent = true } = btn;
		if (isActionEvent) {
			switch (btn.btnType) {
				// 행복사
				case 'copy': {
					let selectedRowTmp = [];
					selectedRowTmp = gridRef3.current?.getCheckedRowItems();

					if (selectedRowTmp && selectedRowTmp.length > 0) {
						selectedRowTmp?.forEach((selectedRowItem: any, index: number) => {
							const item = Object.assign({}, selectedRowItem['item'], btn.initValues);
							const addedRowIndex = selectedRowItem['rowIndex'] + index + 1;

							// 제외 대상 체크
							if (btn?.excludeFn && btn?.excludeFn instanceof Function) {
								if (btn?.excludeFn(item)) {
									return false;
								}
							}

							if (gridProps3?.flat2tree) {
								// 트리 구조일 경우 function이 다름
								gridRef3.current.addTreeRowByIndex(item, addedRowIndex);
							} else {
								gridRef3.current.addRow(item, addedRowIndex);
							}
						});
					}
					break;
				}

				// 행삭제
				case 'delete':
					gridRef3?.current?.deleteRowItems();
					break;
			}
		}

		// 콜백 처리
		if (btn.callBackFn && btn.callBackFn instanceof Function) {
			btn.callBackFn();
		}
	};

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 속성{
	//     headerText: t('lbl.SERIALINFO'),
	//     children: [
	//       {
	//         dataField: "serialno",
	//         headerText: t('lbl.SERIALNO'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "barcode",
	//         headerText: t('lbl.BARCODE'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "convserialno",
	//         headerText: t('lbl.BLNO'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "butcherydt",
	//         headerText: t('lbl.도축일자'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "factoryname",
	//         headerText: t('lbl.FACTORYNAME'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "contracttype",
	//         headerText: t('lbl.계약유형'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "contractcompany",
	//         headerText: t('lbl.CONTRACTCOMPANY'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "contractcompanyname",
	//         headerText: t('lbl.CONTRACTCOMPANYNAME'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "fromvaliddt",
	//         headerText: t('lbl.FROM'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "tovaliddt",
	//         headerText: t('lbl.TO'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "serialorderqty",
	//         headerText: t('lbl.SERIALORDERQTY'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "serialinspectqty",
	//         headerText: t('lbl.SERIALINSPECTQTY'),
	//         dataType: "code",
	//         editable: false
	//       },
	//       {
	//         dataField: "serialscanweight",
	//         headerText: t('lbl.SERIALSCANWEIGHT'),
	//         dataType: "code",
	//         editable: false
	//       }
	//     ]
	//   }
	const gridProps2: any = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		// showFooter: true,
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item?.status == '90') {
				return false;
			}
			return true;
		},
	};
	const gridProps3: any = {
		enablecellMerge: false, // 그리드 머지에 필요한 속성
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		// showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	const gridProps5: any = {
		enablecellMerge: false, // 그리드 머지에 필요한 속성
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
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
	let prevRowIndex: any = null;
	const initEvent = () => {
		gridRef2.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef2.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef2.current.getSelectedRows()[0]);
		});

		gridRef3.current.bind('cellEditBegin', (e: any) => {
			if (['lotManufacture', 'lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { channel } = gridRef3.current.getGridData()[rowIndex];
				if (channel != '1') {
					return false;
				} else {
					return true;
				}
			}
		});

		gridRef3.current.bind('cellEditEnd', (e: any) => {
			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationtype } = gridRef3.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');

				gridRef3.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				gridRef3.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef3.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef3.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationtype } = gridRef3.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');

				gridRef3.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				gridRef3.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef3.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef3.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//방단변경
			if (['boxperlayer', 'layerperplt'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { boxperlayer, layerperplt, boxperplt } = gridRef3.current.getGridData()[rowIndex];
				const num1 = Number(boxperlayer);
				const num2 = Number(layerperplt);
				const result = num1 * num2;
				if (!result) {
					return;
				}

				gridRef3.current.setCellValue(rowIndex, 'boxperplt', result);
			}
		});

		//기존행 수정막기
		// gridRef3.current.bind('cellEditBegin', (e: any) => {
		// 	//console.log(e);
		// 	// 행이 추가된 경우에만 실행
		// 	if (e.item.rowStatus === 'I') {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// });
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	useEffect(() => {
		if (gridRef3.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(
				gridDataDetail2.map((item: any) => ({
					...item,
					durationRate: commUtil.calcDurationRate(item.lotExpire, item.duration),
				})),
			);
			gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef3.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef3.current.setColumnSizeList(colSizeList);
			}
			gridRef2.current.setFocus();
		}
	}, [gridDataDetail2]);

	useDidMountEffect(() => {
		if (gridRef5.current) {
			// 그리드 초기화
			gridRef5.current?.setGridData(gridDataExcel2);
			gridRef5.current?.setSelectionByIndex(0, 0);

			if (gridDataExcel2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef5.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef5.current.setColumnSizeList(colSizeList);
				gridRef5.current?.exportToXlsxGrid(excelParams);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		}
	}, [gridDataExcel2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn3} totalCnt={gridDataDetail2?.length}>
								<Form layout="inline" form={form2}>
									<li>
										<LabelText label="역STO" />
									</li>
									<li>
										<Button onClick={() => reverseSto(3)}>{'역STO'}</Button>
									</li>
									<li>
										<LabelText label="입고확정처리" />
									</li>
									<li>
										<Button onClick={() => applyQty(3)}>{'수량적용'}</Button>
									</li>
									<li>
										<Button onClick={() => saveDpReceiptDetail(3)}>{'대상확정'}</Button>
									</li>
									<li>
										<CustomTooltip key={`copyYn`} placement="bottomLeft" title={'행복사'}>
											<Button
												key={`copyYn`}
												icon={<IcoSvg data={icoSvgDataAny['icoCopy']} />}
												onClick={() => {
													preCallBackFn({ btnType: 'copy' });
												}}
												// type={'copy' === 'save' ? 'primary' : null}
											></Button>
										</CustomTooltip>
									</li>
									<li>
										<CustomTooltip key={`deleteYn`} placement="bottomLeft" title={'행삭제'}>
											<Button
												key={`deleteYn`}
												icon={<IcoSvg data={icoSvgDataAny['icoMinus']} />}
												onClick={() => {
													preCallBackFn({ btnType: 'delete' });
												}}
												// type={'delete' === 'save' ? 'primary' : null}
											></Button>
										</CustomTooltip>
									</li>
									<li>
										<LabelText label="결품처리" />
									</li>
									<li>
										<SelectBox
											name="reasonCode"
											placeholder="선택해주세요"
											options={getCommonCodeList('REASONCODE_DP', t('lbl.ALL'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											label={t('lbl.REASONCODE_DP')}
											className="bg-white"
											style={{ width: '200px' }}
										/>
									</li>
									<li>
										<InputText
											name="reasonMsg"
											placeholder={t('msg.placeholder1', [t('lbl.REASONMSG_DPINSPECT')])}
											label={t('lbl.RESULTMSG')}
											className="bg-white"
										/>
									</li>
									<li>
										<Button onClick={() => applyReason(3)}>{'선택적용'}</Button>
									</li>
									<li>
										<LabelText label="예외처리" />
									</li>
									<li>
										<Button onClick={() => saveExcept(3)}>{'예외저장'}</Button>
									</li>
									<li>
										<Button onClick={() => savePlt(3)}>{'PLT(방단)적용'}</Button>
									</li>
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef5} columnLayout={gridCol5} gridProps={gridProps5} footerLayout={footerLayout5} />
			</AGrid>
		</>
	);
};

export default DpReceiptDetail2;
