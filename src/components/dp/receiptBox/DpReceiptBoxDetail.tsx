/*
 ############################################################################
 # FiledataField	: DpReceiptBoxDetail.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리(수원3층) 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.09.08
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

const DpReceiptBoxDetail = ({
	form1,
	isShow,
	gridRef,
	gridRef1,
	gridRef2,
	gridData,
	gridDataDetail,
	gridDataExcel,
	searchDetailList,
	openModal,
	applyReason,
	saveExcept,
	saveDpReceiptBoxMaster,
	saveDpReceiptBoxDetail,
	savePlt,
	applyQty,
	printDetailList,
	searchExcelList,
	applyPlt,
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
	const excelParams = {
		fileName: '입고확정처리(수원3층)',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
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
				btnType: 'save',
				callBackFn: () => {
					saveDpReceiptBoxMaster(0);
				},
			},
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		// btnArr: [
		// 	{
		// 		btnType: 'btn2', // 사용자 정의버튼1
		// 		btnLabel: '선택적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			applyReason(1);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn6', // 사용자 정의버튼1
		// 		btnLabel: '수량적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			applyQty(1);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn7', // 사용자 정의버튼1
		// 		btnLabel: 'PLT ID 자동부여',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			applyPlt(1);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn4', // 사용자 정의버튼1
		// 		btnLabel: '대상확정',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			saveDpReceiptBoxDetail(1);
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
		// 			saveExcept(1);
		// 		},
		// 	},
		// 	{
		// 		btnType: 'btn5', // 사용자 정의버튼1
		// 		btnLabel: 'PLT(방단)적용',
		// 		authType: 'new',
		// 		callBackFn: () => {
		// 			savePlt(1);
		// 		},
		// 	},
		// ],
	};

	// 그리드 초기화
	const gridCol = [
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
	];

	const gridCol1 = [
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			// cellMerge: true,
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					gridRef1.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			// cellMerge: true,
			filter: {
				showIcon: true,
			},
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			// cellMerge: true,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			// cellMerge: true,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'),
			// cellMerge: true,
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
			dataField: 'boxInfo',
			headerText: t('입수정보'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('박스입수'),
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
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.ORDERQTY_STO_KP'),
			children: [
				{
					dataField: 'confirmqtyBoxWd',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'confirmqtyEaWd',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.ORDERQTY_DP'),
			children: [
				{
					dataField: 'orderqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'orderqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.INSPECTQTY_DP'),
			children: [
				{
					dataField: 'inspectqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'inspectqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY_DP'),
			children: [
				{
					dataField: 'confirmqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'confirmqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SHORTAGEQTY'),
			children: [
				{
					dataField: 'shortageqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'shortageqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TRANQTY_DP'),
			children: [
				{
					dataField: 'pltid',
					headerText: t('팔레트ID'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'tranqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowNegative: true, //음수허용
						// allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					},
				},
				{
					dataField: 'tranqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowNegative: true, //음수허용
						// allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					},
				},
			],
		},
		{
			headerText: t('lbl.SHORTAGETRANQTY'),
			children: [
				{
					dataField: 'shortagetranqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowNegative: true, //음수허용
						// allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					},
				},
				{
					dataField: 'shortagetranqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowNegative: true, //음수허용
						// allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					},
				},
			],
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
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lastlottable01',
			headerText: t('lbl.LASTDURATION'),
			dataType: 'code',
			editable: false,
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
						`https://www.ifresh.co.kr/Approval/Document/DocFrame?DocFolderType=doc&DocID=${e.item.draftNo}&refDocID=`,
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
			dataField: 'boxInfo',
			headerText: t('입수정보'),
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
			headerText: t('lbl.ORDERQTY_DP'),
			children: [
				{
					dataField: 'orderqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'orderqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.INSPECTQTY_DP'),
			children: [
				{
					dataField: 'inspectqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'inspectqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY_DP'),
			children: [
				{
					dataField: 'confirmqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'confirmqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SHORTAGEQTY'),
			children: [
				{
					dataField: 'shortageqtyBox',
					headerText: t('lbl.BOX'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'shortageqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'),
			dataType: 'code',
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
					selectedRowTmp = gridRef1.current?.getCheckedRowItems();

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

							if (gridProps1?.flat2tree) {
								// 트리 구조일 경우 function이 다름
								gridRef1.current.addTreeRowByIndex(item, addedRowIndex);
							} else {
								gridRef1.current.addRow(item, addedRowIndex);
							}
						});
					}
					break;
				}

				// 행삭제
				case 'delete':
					gridRef1?.current?.deleteRowItems();
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
	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		// showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.status == '90') {
				return false;
			}
			return true;
		},
	};
	const gridProps1: any = {
		enableCellMerge: true, // 그리드 머지에 필요한 속성
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		// showFooter: true,
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
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		});

		gridRef1.current.bind('cellEditEnd', (e: any) => {
			//주문수량출력여부 체크시
			if (['printyn'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { printyn, convBoxqty } = gridRef1.current.getGridData()[rowIndex];

				if (printyn === '1') {
					gridRef1.current.setCellValue(rowIndex, 'printedqty', convBoxqty);
				} else {
					setTimeout(() => {
						gridRef1.current.setCellValue(rowIndex, 'printedqty', '4');
					}, 0);
				}
			}

			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationtype } = gridRef1.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');

				gridRef1.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				gridRef1.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationtype } = gridRef1.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');

				gridRef1.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				gridRef1.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//방단변경
			if (['boxperlayer', 'layerperplt'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { boxperlayer, layerperplt, boxperplt } = gridRef1.current.getGridData()[rowIndex];
				const num1 = Number(boxperlayer);
				const num2 = Number(layerperplt);
				const result = num1 * num2;
				if (!result) {
					return;
				}

				gridRef1.current.setCellValue(rowIndex, 'boxperplt', result);
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(
				gridData.map((item: any) => ({
					...item,
					durationRate: commUtil.calcDurationRate(item.lotExpire, item.duration),
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

	useDidMountEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataExcel);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataExcel.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
				gridRef1.current?.exportToXlsxGrid(excelParams);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		}
	}, [gridDataExcel]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
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
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn1} totalCnt={gridDataDetail?.length}>
								<Form layout="inline" form={form1}>
									<li>
										<LabelText label="입고확정처리" />
									</li>
									<li>
										<Button onClick={() => applyQty(1)}>{'수량적용'}</Button>
									</li>
									<li>
										<Button onClick={() => saveDpReceiptBoxDetail(1)}>{'대상확정'}</Button>
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
										<Button onClick={() => applyReason(1)}>{'선택적용'}</Button>
									</li>
									<li>
										<LabelText label="예외처리" />
									</li>
									<li>
										<Button onClick={() => saveExcept(1)}>{'예외저장'}</Button>
									</li>
									<li>
										<Button onClick={() => applyPlt(1)}>{'PLT ID 자동부여'}</Button>
									</li>
									<li>
										<Button onClick={() => savePlt(1)}>{'PLT(방단)적용'}</Button>
									</li>
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* <AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef1} columnLayout={gridCol2} />
			</AGrid> */}
		</>
	);
};
export default DpReceiptBoxDetail;
