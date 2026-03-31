/*
 ############################################################################
 # FiledataField	: IbTirdPartyMastDetail.tsx
 # Description		: 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.25
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Button, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const IbTirdPartyMastDetail = ({
	form,
	form1,
	activeKey,
	changeReasonCode,
	applyReason,
	gridRef,
	gridRef1,
	gridRef2,
	gridRef3,
	gridRef4,
	gridData,
	gridData1,
	gridData2,
	gridData3,
	gridData4,
	searchDetailList,
	saveMasterT1List,
	saveMasterT2List,
	saveMasterT3List,
	saveMasterT4List,
	updateMasterT4List,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	//const dccode = Form.useWatch('dccode', form);
	const gDccode = Form.useWatch('dccode', form);

	const gDcname = useMemo(
		() => getUserDccodeList().find((o: any) => o.dccode == gDccode)?.dcnameOnlyNm || '',
		[gDccode],
	);

	const refModalPop = useRef(null);
	const refModal = useRef(null);

	const [popupType, setPopupType] = useState('');

	//const imageRendererFakeURL = '/img/icon/calcalFrame-Gnb-Ci.svg';

	/////////////////////////////////////////// 1. 단가마스터_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// 행추가
				btnType: 'plus' as const,
				initValues: {
					dccode: gDccode,
					dcname: gDcname,
					pricetype: '',
					pickprice: 0,
					rowStatus: 'I', // 신규행으로 표시
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},

			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterT1List();
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
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			gridRef.current?.exportToXlsxGrid(params);
		},
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 80,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 100,
		},
		{
			// 02. 단가유형
			dataField: 'pricetype',
			headerText: t('lbl.PRICE_TYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('3PL_STATUS', t('lbl.SELECT'), ''),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					if (item.rowStatus !== 'I') {
						return true;
					}
					return false;
				},
			},
			editable: true,
			required: true,
			width: 100,
		},
		{
			// 03. 피킹대행단가(원)
			dataField: 'pickprice',
			headerText: t('lbl.PICKING_FEE_WON'),
			dataType: 'numeric',
			editable: true,
			required: true,
			width: 100,
		},
		{
			// 04. 등록자
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			// 05. 등록일시
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 06. 수정자
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			// 07. 수정일시
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
	];

	/////////////////////////////////////////// 2. 협력사관리_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	// 행추가
			// 	btnType: 'plus' as const,
			// 	initValues: {
			// 		dccode: gDccode,
			// 		dcname: gDcname,
			// 		usYn: '',
			// 		rowStatus: 'I', // 신규행으로 표시
			// 	},
			// },
			// {
			// 	// 행삭제
			// 	btnType: 'delete',
			// },
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterT2List();
				},
			},
		],
	};
	// 그리드 속성
	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			gridRef1.current?.exportToXlsxGrid(params);
		},
	};
	// 그리드 초기화 Bacth 이전
	// const gridCol1 = [
	// 	{
	// 		// 물류센터
	// 		dataField: 'dccode',
	// 		headerText: t('lbl.DCCODE'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		required: true,
	// 		width: 80,
	// 	},
	// 	{
	// 		// 물류센터명
	// 		dataField: 'dcname',
	// 		headerText: t('lbl.DCNAME'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		required: true,
	// 		width: 100,
	// 	},
	// 	{
	// 		/* 06. 협력사코드 */
	// 		dataField: 'custkey',
	// 		headerText: t('lbl.VENDOR'),
	// 		dataType: 'code',
	// 		editable: true,
	// 		commRenderer: {
	// 			type: 'search',
	// 			align: 'center',
	// 			popupType: 'partner',
	// 			searchDropdownProps: {
	// 				dataFieldMap: {
	// 					custkey: 'code',
	// 					custname: 'name',
	// 				},
	// 			},
	// 			onClick: function (e: any) {
	// 				if (e.item?.rowStatus === 'I') {
	// 					refModal.current?.open({
	// 						gridRef: gridRef1,
	// 						codeName: e.text,
	// 						rowIndex: e.rowIndex,
	// 						dataFieldMap: {
	// 							custkey: 'code',
	// 							custname: 'name',
	// 						},
	// 						popupType: 'partner',
	// 					});
	// 				} else {
	// 					gridRef1.current?.openPopup(
	// 						{
	// 							custkey: e.item.custkey,
	// 							custtype: 'P',
	// 						},
	// 						'cust',
	// 					);
	// 				}
	// 			},
	// 		},
	// 		style: 'isEdit',
	// 		filter: {
	// 			showIcon: true,
	// 		},
	// 		required: true,
	// 		width: 80,
	// 	},

	// 	{
	// 		// 03. 협력사명
	// 		dataField: 'custname',
	// 		headerText: t('lbl.FROM_CUSTNAME_DP'),
	// 		dataType: 'text',
	// 		editable: false,
	// 		width: 450,
	// 	},
	// 	{
	// 		// 04. 중분류
	// 		dataField: 'labelClYn',
	// 		headerText: t('lbl.CLASS_MIDDLE'),
	// 		dataType: 'code',
	// 		editable: true,
	// 		editRenderer: {
	// 			type: 'DropDownListRenderer',
	// 			list: [
	// 				{
	// 					cdNm: t('lbl.SELECT'),
	// 					comCd: '',
	// 				},
	// 				{
	// 					cdNm: 'Y',
	// 					comCd: '1',
	// 				},
	// 				{
	// 					cdNm: 'N',
	// 					comCd: '0',
	// 				},
	// 			],
	// 			keyField: 'comCd', // key 에 해당되는 필드명
	// 			valueField: 'cdNm',
	// 		},
	// 		labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
	// 			if (value === '1') return 'Y';
	// 			if (value === '0') return 'N';
	// 			return t('lbl.SELECT');
	// 		},
	// 		required: true,
	// 		width: 80,
	// 	},
	// 	{
	// 		// 05. 사용여부
	// 		dataField: 'usYn',
	// 		headerText: t('lbl.USE_YN'),
	// 		dataType: 'code',
	// 		editable: true,
	// 		editRenderer: {
	// 			type: 'DropDownListRenderer',
	// 			list: [
	// 				{
	// 					cdNm: t('lbl.SELECT'),
	// 					comCd: '',
	// 				},
	// 				{
	// 					cdNm: 'Y',
	// 					comCd: '1',
	// 				},
	// 				{
	// 					cdNm: 'N',
	// 					comCd: '0',
	// 				},
	// 			],
	// 			keyField: 'comCd', // key 에 해당되는 필드명
	// 			valueField: 'cdNm',
	// 		},
	// 		labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
	// 			if (value === '1') return 'Y';
	// 			if (value === '0') return 'N';
	// 			return t('lbl.SELECT');
	// 		},
	// 		required: true,
	// 		width: 80,
	// 	},
	// 	{
	// 		// 06. 등록자
	// 		dataField: 'addwho',
	// 		headerText: t('lbl.ADDWHO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		width: 100,
	// 	},
	// 	{
	// 		// 07. 등록일시
	// 		dataField: 'adddate',
	// 		headerText: t('lbl.ADDDATE'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		width: 150,
	// 	},
	// 	{
	// 		// 08. 수정자
	// 		dataField: 'editwho',
	// 		headerText: t('lbl.EDITWHO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		width: 100,
	// 	},
	// 	{
	// 		// 09. 수정일시
	// 		dataField: 'editdate',
	// 		headerText: t('lbl.EDITDATE'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		width: 150,
	// 	},
	// ];

	const gridCol1 = [
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
			/* 06. 협력사코드 */
			dataField: 'custkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current?.openPopup(
						{
							custkey: e.item.fromcustkey,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			width: 80,
		},

		{
			// 03. 협력사명
			dataField: 'custname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'text',
			editable: false,
			width: 450,
		},
		{
			// 04. 중분류
			dataField: 'labelClYn',
			headerText: t('lbl.CLASS_MIDDLE'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: [
					{
						cdNm: t('lbl.SELECT'),
						comCd: '',
					},
					{
						cdNm: 'Y',
						comCd: '1',
					},
					{
						cdNm: 'N',
						comCd: '0',
					},
				],
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === '1') return 'Y';
				if (value === '0') return 'N';
				return t('lbl.SELECT');
			},
			// /required: true,
			width: 80,
		},
		{
			// 05. 사용여부
			dataField: 'usYn',
			headerText: t('lbl.USE_YN'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: [
					{
						cdNm: t('lbl.SELECT'),
						comCd: '',
					},
					{
						cdNm: 'Y',
						comCd: '1',
					},
					{
						cdNm: 'N',
						comCd: '0',
					},
				],
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === '1') return 'Y';
				if (value === '0') return 'N';
				return t('lbl.SELECT');
			},
			//required: true,
			width: 80,
		},
		{
			// 06. 등록자
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			// 07. 등록일시
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 08. 수정자
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			// 09. 수정일시
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
	];

	/////////////////////////////////////////// 3. 검수관리_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 그리드 속성
	const gridProps2 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			gridRef2.current?.exportToXlsxGrid(params);
		},
	};
	// 그리드 초기화
	const gridCol2 = [
		{
			// 01. 배송일자
			dataField: 'deliverydate',
			headerText: t('lbl.DELIVERYDATE_WD'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 02. 협력사코드
			dataField: 'fromcustkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current?.openPopup(
						{
							custkey: e.item.fromcustkey,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			width: 80,
		},
		{
			// 03. 협력사명
			dataField: 'fromcustnm',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'text',
			editable: false,
			width: 250,
		},
		{
			// 04. 일배구분
			dataField: 'deliverytype',
			headerText: t('lbl.PUTAWAYTYPE_WD'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 05. 검수예정건수
			dataField: 'barCnt',
			headerText: t('lbl.INSPECTPLANCNT_DP'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 06. 검수완료건수
			dataField: 'scanCnt',
			headerText: t('lbl.INSPECTEDCNT_DP'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 07. 확정건수
			dataField: 'cfcnt',
			headerText: t('lbl.CONFIRMED_COUNT'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 08. 미완료건수
			dataField: 'ncfcnt',
			headerText: t('lbl.INCOMPLETE_COUNT'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 09. 미입고건수
			dataField: 'ndpCnt',
			headerText: t('lbl.NOT_RECEIVED_COUNT'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 10. 검수완료율(%)
			dataField: 'rate',
			headerText: t('lbl.INSPECTRATE_DP'),
			dataType: 'code',
			style: 'ta-r',
			editable: false,
			width: 80,
		},
		{
			// 11. 진행상태
			dataField: 'status',
			headerText: t('lbl.STATUS_RT'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
	];
	/////////////////////////////////////////// 3. 검수관리_탭 상세 ///////////////////////////////////////////
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 그리드 속성
	const gridProps3 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			gridRef3.current?.exportToXlsxGrid(params);
		},
	};
	// 그리드 초기화
	const gridCol3 = [
		{
			// 01. 배송일자
			dataField: 'deliverydate',
			headerText: t('lbl.DELIVERYDATE_WD'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 02. 협력사코드
			dataField: 'fromcustkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef3.current?.openPopup(
						{
							custkey: e.item.fromcustkey,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			// 03. 협력사명
			dataField: 'fromcustnm',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 04. 배송채널
			dataField: 'channel',
			headerText: t('lbl.CHANNEL'),
			dataType: 'code',
			editable: false,
		},
		{
			// 05. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 06. 거래처코드
			dataField: 'tocustkey',
			headerText: t('lbl.CUST_CODE'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef3.current?.openPopup(
						{
							custkey: e.item.tocustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			// 07. 거래처명
			dataField: 'tocustnm',
			headerText: t('lbl.CUST_NAME'),
			dataType: 'text',
			editable: false,
			width: 150,
		},
		{
			// 검수완료
			headerText: t('lbl.INSPECTION_COMPLETED'),
			children: [
				{
					// 08. 라벨건수
					dataField: 'barCnt',
					headerText: t('lbl.LABEL_COUNT'),
					dataType: 'numeric',
					editable: false,
					width: 80,
				},
				{
					// 09. 스캔완료
					dataField: 'scanCnt',
					headerText: t('lbl.SCAN_COMPLETE'),
					dataType: 'numeric',
					editable: false,
					width: 80,
				},
				{
					// 10. 강제확정(3PL)
					dataField: 'cfPl3',
					headerText: t('lbl.FORCE_CONFIRM_3PL'),
					dataType: 'numeric',
					editable: true,
					width: 80,
				},
				{
					// 11. 강제확정사유(3PL)
					dataField: 'reasoncode2',
					headerText: t('lbl.FORCE_CONFIRM_REASON_3PL'),
					dataType: 'text',
					editable: false,
					width: 80,
				},
				{
					// 12. 귀책
					dataField: 'reasonwho2',
					headerText: t('lbl.REASONCODE2_WD'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 13. 세부내역
					dataField: 'reasontext2',
					headerText: t('lbl.REASONMSG_RT'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 14. 강제확정(협력사)
					dataField: 'cfCust',
					headerText: t('lbl.FORCE_CONFIRM_PARTNER'),
					dataType: 'numeric',
					editable: true,
					width: 100,
				},
				{
					// 15. 강제확정사유(협력사)
					dataField: 'reasoncode',
					headerText: t('lbl.FORCE_CONFIRM_REASON_PARTNER'),
					dataType: 'text',
					editable: false,
					width: 150,
				},
				{
					// 16. 귀책
					dataField: 'reasonwho',
					headerText: t('lbl.REASONCODE2_WD'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 17. 세부내역
					dataField: 'reasontext',
					headerText: t('lbl.REASONMSG_RT'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 18. 미입고
					dataField: 'ndpCnt',
					headerText: t('lbl.NOT_RECEIVED'),
					dataType: 'numeric',
					editable: true,
					width: 100,
				},
				{
					// 19. 강제확정사유(미입고)
					dataField: 'reasoncode3',
					headerText: t('lbl.FORCE_CONFIRM_REASON_NOT_RECEIVED'),
					dataType: 'text',
					editable: false,
					width: 150,
				},
				{
					// 20. 귀책
					dataField: 'reasonwho3',
					headerText: t('lbl.REASONCODE2_WD'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 21. 세부내역
					dataField: 'reasontext3',
					headerText: t('lbl.REASONMSG_RT'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 22. 미완료
					dataField: 'ncf',
					headerText: t('lbl.INCOMPLETE'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
			],
		},
		{
			// 23. 확정시간
			dataField: 'cfdate',
			headerText: t('lbl.CONFIRMDT'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
	];

	/////////////////////////////////////////// 4. 정산관리_탭 ///////////////////////////////////////////
	const gridBtn4: GridBtnPropsType = {
		tGridRef: gridRef4, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3', // 사용자 정의버튼1 MODIFY
				btnLabel: t('lbl.MODIFY'),
				authType: 'new',
				callBackFn: () => {
					updateMasterT4List();
				},
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterT4List();
				},
			},
		],
	};
	// 그리드 속성
	const gridProps4 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		exportToXlsxGridCustom: () => {
			const params = {
				exceptColumnFields: ['allocCarStatus'], // 제외컬럼
				drmUseYn: 'N', // DRM 해제
			};
			gridRef4.current?.exportToXlsxGrid(params);
		},
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};
	// 그리드 초기화
	const gridCol4 = [
		{
			// 01. 마감현황
			dataField: 'allocCarStatus',
			headerText: t('lbl.CLOSURE_STATUS'),
			style: 'ta-c',
			editable: false,
			renderer: {
				type: 'imageRenderer',
				imgHeight: 11,
				iconWidth: 11,
				srcFunction: (rowIndex: number, columnIndex: number, value: any) => {
					return `/img/icon/${value}.bmp`;
				},
			},
			width: 80,
		},
		{
			// 02. 배송일자
			dataField: 'deliverydate',
			headerText: t('lbl.DELIVERYDATE'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			//  거래처코드
			dataField: 'toCustkey',
			headerText: t('lbl.CUST_CODE'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef4.current?.openPopup(
						{
							custkey: e.item.fromcustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			//  거래처명
			dataField: 'toCustname',
			headerText: t('lbl.CUST_NAME'),
			dataType: 'text',
			editable: false,
			width: 150,
		},
		{
			// 03. 협력사코드
			dataField: 'fromcustkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef4.current?.openPopup(
						{
							custkey: e.item.fromcustkey,
							custtype: 'P',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			// 04. 협력사명
			dataField: 'fromcustnm',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'text',
			editable: false,
			width: 150,
		},
		{
			// 05. 일배구분
			dataField: 'channel',
			headerText: t('lbl.PUTAWAYTYPE_WD'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 06. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 07. 라벨건수
			dataField: 'barCnt',
			headerText: t('lbl.LABEL_COUNT'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 중분류
			dataField: 'labelClYn',
			headerText: t('lbl.CLASS_MIDDLE'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === '1') return 'Y';
				if (value === '0') return 'N';
			},
			width: 80,
		},
		{
			// 검수건수
			headerText: t('lbl.INSPECT_COUNT'),
			children: [
				{
					// 08. 스캔건수
					dataField: 'scanCnt',
					headerText: t('lbl.SCAN_COUNT'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
				{
					// 09. 강제확정(3PL)
					dataField: 'cfPl3',
					headerText: t('lbl.FORCE_CONFIRM_3PL'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
				{
					// 10. 강제확정(협력사)
					dataField: 'cfCust',
					headerText: t('lbl.FORCE_CONFIRM_PARTNER'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
				{
					// 11. 미확정
					dataField: 'ncf',
					headerText: t('lbl.UNCONFIRMED'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
			],
		},
		{
			// 12. 미입고
			dataField: 'ndpCnt',
			headerText: t('lbl.NOT_RECEIVED'),
			dataType: 'numeric',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.SETTLEMENT_COUNT'),
			children: [
				{
					// 13. 검수
					dataField: 'other01Cnt',
					headerText: t('lbl.INSPECT'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
				{
					// 14. 미검수
					dataField: 'other02Cnt',
					headerText: t('lbl.UNINSPECTED'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
				{
					// 15. 광역일배
					dataField: 'other03Cnt',
					headerText: t('lbl.DCSTODAILY'),
					dataType: 'numeric',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.CLOSURE_CONFIRM'),
			children: [
				{
					// 16. FW
					dataField: 'ibcffw',
					headerText: t('lbl.FW_TAG'),
					dataType: 'code',
					editable: false,
					colSpan: 2,
					width: 100,
				},
				{
					// 17. FW
					dataField: 'ibcffwdate',
					//headerText: t('lbl.FW_TAG'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 18. 3PL
					dataField: 'ibcf3pl',
					headerText: t('lbl.THIRD_PARTY_LOGISTICS'),
					dataType: 'code',
					editable: false,
					colSpan: 2,
					width: 100,
				},
				{
					// 19. 3PL
					dataField: 'ibcf3pldate',
					//headerText: t('lbl.THIRD_PARTY_LOGISTICS'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
			],
		},
		{
			// 18. 물류비
			dataField: 'logiprice',
			headerText: t('lbl.LOGISTICS_FEE'),
			dataType: 'numeric',
			editable: false,
			width: 100,
		},
		{
			// 19. 확정유무
			dataField: 'ibcfyn',
			headerText: t('lbl.CONFIRM_YN'),
			dataType: 'code',
			editable: false,
		},
		{
			// 20. 확정시간
			dataField: 'ifcfdate',
			headerText: t('lbl.CONFIRMDT'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
	];

	const footerLayout4 = [
		// 라벨건수
		{
			dataField: 'barCnt',
			positionField: 'barCnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 스캔건수
		{
			dataField: 'scanCnt',
			positionField: 'scanCnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 강제확정(3PL)
		{
			dataField: 'cfPl3',
			positionField: 'cfPl3',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 강제확정(협력사)
		{
			dataField: 'cfCust',
			positionField: 'cfCust',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 미확정
		{
			dataField: 'ncf',
			positionField: 'ncf',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 미입고
		{
			dataField: 'ndpCnt',
			positionField: 'ndpCnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 검수
		{
			dataField: 'other01Cnt',
			positionField: 'other01Cnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 미검수
		{
			dataField: 'other02Cnt',
			positionField: 'other02Cnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 광역일배
		{
			dataField: 'other03Cnt',
			positionField: 'other03Cnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		// 물류비
		{
			dataField: 'logiprice',
			positionField: 'logiprice',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
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
		let prevSelectedRowJson: string | null = null;
		gridRef2.current?.bind('selectionChange', (e: any) => {
			const selectedRow = gridRef2.current?.getSelectedRows()[0];
			const selectedRowJson = selectedRow ? JSON.stringify(selectedRow) : null;
			if (prevSelectedRowJson !== null && selectedRowJson === prevSelectedRowJson) {
				return;
			}
			prevSelectedRowJson = selectedRowJson;

			//상세 조회
			searchDetailList(selectedRow);
		});

		gridRef1.current?.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'custkey') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}
			return true;
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
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef2.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef2.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	useEffect(() => {
		if (gridRef3.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(gridData3);
			gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridData3.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef3.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef3.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef2.current?.setFocus();
	}, [gridData3]);

	useEffect(() => {
		if (gridRef4.current) {
			// 그리드 초기화
			gridRef4.current?.setGridData(gridData4);
			gridRef4.current?.setSelectionByIndex(0, 0);

			if (gridData4.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef4.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef4.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData4]);

	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'partner') {
			gridRef1.current?.setCellValue(gridRef1.current?.getSelectedIndex()[0], 'custkey', selectedRow[0].code);
			gridRef1.current?.setCellValue(gridRef1.current?.getSelectedIndex()[0], 'custname', selectedRow[0].name);
		}

		closeEvent();
	};

	const closeEvent = () => {
		refModalPop.current?.handlerClose();
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 단가마스터 목록 */}
			{activeKey === '1' && (
				<>
					<AGrid style={{ paddingTop: 10 }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>
			)}

			{/* 협력사관리 목록 */}
			{activeKey === '2' && (
				<>
					<AGrid style={{ paddingTop: 10 }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
					</GridAutoHeight>
				</>
			)}

			{/* 검수관리 목록 */}
			{activeKey === '3' && (
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							{/* 수직 2분할 - 위쪽 */}
							<AGrid style={{ paddingTop: 10 }}>
								<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
							</GridAutoHeight>
						</>,
						<>
							{/* 수직 2분할 - 아래쪽 */}
							<AGrid>
								<GridTopBtn gridTitle={t('lbl.DETAIL')} gridBtn={gridBtn3} totalCnt={gridData3?.length}>
									<Form form={form1} layout="inline" initialValues={{ reasonCode: '' }}>
										{/* 강제확정 사유 */}
										<SelectBox
											name="reasonCode"
											label={t('lbl.FORCE_CONFIRM_REASON')}
											options={[{ comCd: '', cdNm: t('lbl.SELECT') }, ...getCommonCodeList('REASONCODE_CONFIRM')]}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
											style={{ width: '150px' }}
											onChange={async () => {
												changeReasonCode(); // 센터에 해당되는 zone 정보 조회
											}}
											className="bg-white"
										/>
										{/* 귀책 */}
										<InputText
											label={t('lbl.REASONCODE2')}
											name="reasonWho"
											className="bg-white"
											span={20}
											disabled
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
										{/* 세부내역 */}
										<InputText
											label={t('lbl.REASONMSG_RT')}
											name="reasonText"
											className="bg-white"
											span={20}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
										<div>
											<Button style={{ marginRight: 8 }} onClick={() => applyReason()}>
												{/* 선택적용 */}
												{t('lbl.SELECT_APPLY')}
											</Button>
											<Button style={{ marginRight: 8 }} onClick={() => saveMasterT3List()}>
												{/* 강제확정 */}
												{t('lbl.FORCE_CONFIRM')}
											</Button>
										</div>
									</Form>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
							</GridAutoHeight>
						</>,
					]}
				/>
			)}
			{/* 정산관리 목록 */}
			{activeKey === '4' && (
				<>
					<AGrid style={{ paddingTop: 10 }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn4} totalCnt={gridData4?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef4} columnLayout={gridCol4} gridProps={gridProps4} footerLayout={footerLayout4} />
					</GridAutoHeight>
				</>
			)}
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default IbTirdPartyMastDetail;
