/*
 ############################################################################
 # FiledataField	: IbStoWeightMasterPopup.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import {
	apiPostCopyMasterList,
	apiPostExcelValChk,
	apiPostMasterList2,
	apiPostSaveMasterList,
} from '@/api/ib/apiIbStoWeight';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import dateUtils from '@/util/dateUtil';
import fileUtil from '@/util/fileUtils';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// API Call Function
type TabInfoType = {
	[key: string]: {
		[subKey: string]: {
			isBind: boolean;
			checkType: string;
			masterkey: string;
			gridRef: any;
		};
	};
};

const IbStoWeightMasterPopup = forwardRef(
	({ form, closeModal, searchForm, parentTab, parentTabRef }: any, ref: any) => {
		/**
		 * =====================================================================
		 *	01. 변수 선언부
		 * =====================================================================
		 */
		// 채널 옵션
		const channelOptions = getCommonCodeList('PUTAWAYTYPE');
		const userDccodeList = getUserDccodeList('') ?? [];
		const [activeKey, setActiveKey] = useState('1');
		const [title, setTitle] = useState('');
		const excelUploadFileRef = useRef(null);
		const activeKeyRef = useRef(activeKey);
		const dateFormat = 'YYYY-MM-DD';
		const { t } = useTranslation();
		const refModal = useRef(null);
		const gridRef = useRef(null);
		const gridRef1 = useRef(null);
		const gridRef2 = useRef(null);
		const gridRef3 = useRef(null);
		const gridRef4 = useRef(null);
		const gridRef5 = useRef(null);
		const gridRef6 = useRef(null);
		const gridRef7 = useRef(null);
		const gridRef8 = useRef(null);
		const gridRef9 = useRef(null);
		const gridRef10 = useRef(null);
		const gridRef11 = useRef(null);
		const gridRef12 = useRef(null);
		const gridRef13 = useRef(null);
		const gridRef14 = useRef(null);
		const gridRef15 = useRef(null);
		const gridRef16 = useRef(null);
		const gridRef17 = useRef(null);
		const gridRef18 = useRef(null);
		const gridRef19 = useRef(null);
		const gridRef20 = useRef(null);
		const modalRef = useRef(null);
		const [gridData, setGridData] = useState([]);
		const [tabItems, setTabItems] = useState([]);
		const [loopTrParams, setLoopTrParams] = useState({});

		const tabInfo: TabInfoType = {
			//총량
			'1': {
				'1': {
					masterkey: 'STO_DC',
					gridRef: gridRef,
					isBind: false,
					checkType: 'dccode',
				},
				'2': {
					masterkey: 'STO_DC_WD',
					gridRef: gridRef1,
					isBind: false,
					checkType: 'cust',
				},
				'3': {
					masterkey: 'STO_DC_WD_JEJU',
					gridRef: gridRef20,
					isBind: false,
					checkType: 'cust',
				},
				'4': {
					masterkey: 'STO_ETC_SKU_ADD',
					gridRef: gridRef2,
					isBind: false,
					checkType: 'sku',
				},
				'5': {
					masterkey: 'STO_ETC_SKU',
					gridRef: gridRef3,
					isBind: false,
					checkType: 'sku',
				},
				'6': {
					masterkey: 'STO_EX_CUST',
					gridRef: gridRef4,
					isBind: false,
					checkType: 'cust',
				},
				'7': {
					masterkey: 'STO_EX_SKU',
					gridRef: gridRef5,
					isBind: false,
					checkType: 'sku',
				},
			},
			//분류
			'2': {
				'1': {
					masterkey: 'SO_DC',
					gridRef: gridRef6,
					isBind: false,
					checkType: 'channel',
				},
				'2': {
					masterkey: 'SO_EX_SKU_ADD',
					gridRef: gridRef7,
					isBind: false,
					checkType: 'sku',
				},
				'3': {
					masterkey: 'SO_ETC_SKU',
					gridRef: gridRef8,
					isBind: false,
					checkType: 'sku',
				},
				'4': {
					masterkey: 'SO_ETC_SKU_ETC',
					gridRef: gridRef9,
					isBind: false,
					checkType: 'sku',
				},
				'5': {
					masterkey: 'SO_ETC_CUST_GUN',
					gridRef: gridRef10,
					isBind: false,
					checkType: 'cust',
				},
				'6': {
					masterkey: 'SO_ETC_CUST_ETC',
					gridRef: gridRef11,
					isBind: false,
					checkType: 'cust',
				},
				'7': {
					masterkey: 'SO_EX_CUST',
					gridRef: gridRef12,
					isBind: false,
					checkType: 'cust',
				},
				'8': {
					masterkey: 'SO_ETC_SKU_ICE',
					gridRef: gridRef13,
					isBind: false,
					checkType: 'sku',
				},
				'9': {
					masterkey: 'SO_ETC_PARTNER',
					gridRef: gridRef14,
					isBind: false,
					checkType: 'partner',
				},
				'10': {
					masterkey: 'SO_EX_SKU',
					gridRef: gridRef15,
					isBind: false,
					checkType: 'sku',
				},
			},
			//입고
			'3': {
				'1': {
					masterkey: 'DP_DC',
					gridRef: gridRef16,
					isBind: false,
					checkType: 'channel',
				},
				'2': {
					masterkey: 'DP_EX_SKU',
					gridRef: gridRef17,
					isBind: false,
					checkType: 'sku',
				},
				'3': {
					masterkey: 'DP_EX_VENDOR',
					gridRef: gridRef18,
					isBind: false,
					checkType: 'partner',
				},
				'4': {
					masterkey: 'DP_EX_SKU_ADD',
					gridRef: gridRef19,
					isBind: false,
					checkType: 'sku',
				},
			},
		};

		/**
		 * =====================================================================
		 *	02. 함수
		 * =====================================================================
		 */

		/* 업로드 완료 후 필터키 유효성검사 */
		const filterkeyValidationCheck = async () => {
			const saveList = tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.getGridData();
			const { data } = await apiPostExcelValChk({
				saveList,
				checkType: tabInfo[parentTabRef.current][activeKeyRef.current].checkType,
			});

			tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.clearGridData();
			tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.addRow(data);

			// 칼럼 사이즈 재조정
			const colSizeList = gridRef.current?.getFitColumnSizeList(true);
			gridRef.current?.setColumnSizeList(colSizeList);
		};

		/**
		 * 새로고침 버튼 클릭
		 */
		const onClickSearch = async () => {
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}
			const requestParams = form.getFieldsValue();
			requestParams.masterkey = tabInfo[parentTabRef.current][activeKeyRef.current].masterkey;
			requestParams.yyyymm = requestParams.yyyymm.format('YYYYMM');
			if (['STO_DC', 'SO_DC', 'DP_DC'].includes(requestParams.masterkey)) {
				requestParams.yyyymm = '';
			}

			const { data } = await apiPostMasterList2(requestParams);
			setGridData(data || []);
		};

		/**
		 * 새로고침 버튼 클릭
		 */
		const onClickRefreshButton = () => {
			form.resetFields();
			form.setFieldValue('yyyymm', searchForm.getFieldValue('yyyymm'));
			gridRef.current?.clearGridData();
			gridRef.current?.clearGridData();
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
			gridRef3.current?.clearGridData();
			gridRef4.current?.clearGridData();
			gridRef5.current?.clearGridData();
			gridRef6.current?.clearGridData();
			gridRef7.current?.clearGridData();
			gridRef8.current?.clearGridData();
			gridRef9.current?.clearGridData();
			gridRef10.current?.clearGridData();
			gridRef11.current?.clearGridData();
			gridRef12.current?.clearGridData();
			gridRef13.current?.clearGridData();
			gridRef14.current?.clearGridData();
			gridRef15.current?.clearGridData();
			gridRef16.current?.clearGridData();
			gridRef17.current?.clearGridData();
			gridRef18.current?.clearGridData();
			gridRef19.current?.clearGridData();
			gridRef20.current?.clearGridData();
		};

		const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			fileUtil.excelImport(
				e,
				0,
				tabInfo[parentTabRef.current][activeKeyRef.current].gridRef,
				1,
				filterkeyValidationCheck,
			);
		};

		//저장
		const onSave = async () => {
			const curGrid = tabInfo[parentTabRef.current][activeKeyRef.current].gridRef;
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}
			const requestParams = form.getFieldsValue();
			requestParams.masterkey = tabInfo[parentTab][activeKey].masterkey;
			requestParams.yyyymm = requestParams.yyyymm.format('YYYYMM');

			const checkedItems = curGrid.current.getChangedData({
				validationYn: false,
				andCheckedYn: true,
			});

			if (checkedItems.length < 1) {
				showAlert(null, t('msg.noChange'));
				return;
			}

			curGrid.current.showConfirmSave(async () => {
				const params = {
					gDccode: form.getFieldValue('fixdccode'),
					avc_COMMAND: 'DATAUPLOAD',
					masterkey: tabInfo[parentTabRef.current][activeKeyRef.current].masterkey,
					processtype: `MSRPTK_${tabInfo[parentTabRef.current][activeKeyRef.current].masterkey}`,
					saveList: checkedItems.filter((item: any) => item.rowStatus != 'D'),
					deleteList: checkedItems.filter((item: any) => item.rowStatus == 'D'),
				};

				const res = await apiPostSaveMasterList(params);
				const { data } = res;
				if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
					showAlert('', '저장되었습니다', onClickSearch);
				}
			});
		};

		//전월복사
		const onCopy = () => {
			const curYm = form.getFieldValue('yyyymm');
			const prevYm = curYm.subtract(1, 'month');
			showConfirm(
				null,
				`기존 자료가 있다면 삭제됩니다. \n${prevYm.format('YYYY-MM')} 데이터를 ${curYm.format(
					'YYYY-MM',
				)} 로 복사 하시겠습니까?`,
				async () => {
					const requestParams = form.getFieldsValue();
					requestParams.masterkey = tabInfo[parentTabRef.current][activeKeyRef.current].masterkey;
					requestParams.yyyymm = prevYm.format('YYYYMM');
					requestParams.toyyyymm = curYm.format('YYYYMM');

					const res = await apiPostCopyMasterList(requestParams);
					const { data } = res;
					if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
						showAlert('', t('msg.confirmSaved'), onClickSearch);
					}
				},
			);
		};

		//삭제
		const onDelete = () => {
			const checkedData = tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.getCheckedRowItems();
			if (checkedData.length == 0) {
				showAlert(null, '삭제할 행을 선택하세요.');
			}
			// const gridData = tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.getGridData();
			// const checkedUids = checkedData.map((item: any) => item._$uid);
			const checkRowIdxArr = checkedData.map((item: any) => item.rowIndex);
			tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.removeRow(checkRowIdxArr);
			// tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setGridData(
			// 	gridData.filter((item: any) => !checkedUids.includes(item._$uid)),
			// );
		};

		const titleFunc = {
			searchYn: onClickSearch,
			refresh: onClickRefreshButton,
		};

		//센터 타입
		const gridCol = [
			{
				dataField: 'dccode',
				headerText: t('공급센터'),
				required: true,
				dataType: 'code',
				editRenderer: {
					type: 'DropDownListRenderer',
					list: userDccodeList,
					keyField: 'dccode', // key 에 해당되는 필드명
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
				// required: true,
			},
			{
				dataField: 'dcname',
				headerText: t('공급센터명'),
				required: true,
				dataType: 'code',
				editable: false,
				filter: {
					showIcon: true,
				},
				// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// 	const dccode = item.dccode;
				// 	return userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
				// },
			},
			{
				dataField: 'filterkey',
				headerText: t('받는센터'),
				required: true,
				dataType: 'code',
				editRenderer: {
					type: 'DropDownListRenderer',
					list: userDccodeList,
					keyField: 'dccode', // key 에 해당되는 필드명
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
			},
			{
				dataField: 'todcname',
				headerText: t('받는센터명'),
				required: true,
				dataType: 'code',
				editable: false,
				filter: {
					showIcon: true,
				},
				// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// 	const dccode = item.filterkey;
				// 	return userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
				// },
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		//저장유무 타입
		const gridCol1 = [
			{
				dataField: 'dccode',
				headerText: t('물류센터'),
				required: true,
				dataType: 'code',
				editRenderer: {
					type: 'DropDownListRenderer',
					list: userDccodeList,
					keyField: 'dccode', // key 에 해당되는 필드명
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
				// required: true,
			},
			{
				dataField: 'dcname',
				headerText: t('물류센터명'),
				required: true,
				dataType: 'code',
				editable: false,
				filter: {
					showIcon: true,
				},
				// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// 	const dccode = item.dccode;
				// 	return userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
				// },
			},
			{
				dataField: 'filterkey',
				headerText: t('저장유무'),
				required: true,
				dataType: 'code',
				editable: true,
				commRenderer: {
					type: 'dropDown',
					list: channelOptions,
				},
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		//상품 타입
		const gridCol2 = [
			{
				dataField: 'yyyymm',
				headerText: t('년월'),
				required: true,
				dataType: 'code',
				editable: true,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					onlyMonthMode: true,
					defaultFormat: 'yyyymm',
				},
			},
			{
				dataField: 'dccode',
				headerText: t('물류센터'),
				required: true,
				dataType: 'code',
				editRenderer: {
					type: 'DropDownListRenderer',
					list: userDccodeList,
					keyField: 'dccode', // key 에 해당되는 필드명
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
				// required: true,
			},
			{
				dataField: 'dcname',
				headerText: t('물류센터명'),
				required: true,
				dataType: 'code',
				editable: false,
				filter: {
					showIcon: true,
				},
				// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// 	const dccode = item.dccode;
				// 	return userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
				// },
			},
			{
				dataField: 'filterkey',
				headerText: t('상품코드'),
				required: true,
				dataType: 'code',
				editable: true,
				commRenderer: {
					type: 'search',
					popupType: 'sku',
					searchDropdownProps: {
						dataFieldMap: {
							filterkey: 'code',
							skuname: 'name',
						},
					},
					onClick: function (e: any) {
						const rowIndex = e.rowIndex;

						// 예: custcd 컬럼에서 팝업 열기
						refModal.current.open({
							codeName: e.text,
							gridRef: tabInfo[parentTabRef.current][activeKeyRef.current].gridRef,
							rowIndex,
							dataFieldMap: {
								filterkey: 'code',
								skuname: 'name',
							},
							popupType: 'sku',
						});
					},
				},
			},
			{
				dataField: 'skuname',
				headerText: t('상품명'),
				required: true,
				dataType: 'code',
				editable: false,
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		//고객 타입
		const gridCol3 = [
			{
				dataField: 'yyyymm',
				headerText: t('년월'),
				required: true,
				dataType: 'code',
				editable: true,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					onlyMonthMode: true,
					defaultFormat: 'yyyymm',
				},
			},
			{
				dataField: 'filterkey',
				headerText: t('고객코드'), //거래처
				required: true,
				dataType: 'code',
				editable: true,
				commRenderer: {
					type: 'search',
					popupType: 'cust',
					searchDropdownProps: {
						dataFieldMap: {
							filterkey: 'code',
							custname: 'name',
						},
					},
					onClick: function (e: any) {
						const rowIndex = e.rowIndex;

						// 예: custcd 컬럼에서 팝업 열기
						refModal.current.open({
							codeName: e.text,
							gridRef: tabInfo[parentTabRef.current][activeKeyRef.current].gridRef,
							rowIndex,
							dataFieldMap: {
								filterkey: 'code',
								custname: 'name',
							},
							popupType: 'cust',
						});
					},
				},
			},
			{
				dataField: 'custname',
				headerText: t('고객명'),
				required: true,
				dataType: 'code',
				editable: false,
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		//협력사 타입
		const gridCol4 = [
			{
				dataField: 'yyyymm',
				headerText: t('년월'),
				required: true,
				dataType: 'code',
				editable: true,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					onlyMonthMode: true,
					defaultFormat: 'yyyymm',
				},
			},
			{
				dataField: 'filterkey',
				headerText: t('협력사코드'),
				required: true,
				dataType: 'code',
				editable: true,
				commRenderer: {
					type: 'search',
					popupType: 'partner',
					searchDropdownProps: {
						dataFieldMap: {
							filterkey: 'code',
							partnername: 'name',
						},
					},
					onClick: function (e: any) {
						const rowIndex = e.rowIndex;

						// 예: custcd 컬럼에서 팝업 열기
						refModal.current.open({
							codeName: e.text,
							gridRef: tabInfo[parentTabRef.current][activeKeyRef.current].gridRef,
							rowIndex,
							dataFieldMap: {
								filterkey: 'code',
								partnername: 'name',
							},
							popupType: 'partner',
						});
					},
				},
			},
			{
				dataField: 'partnername',
				headerText: t('협력사명'),
				required: true,
				dataType: 'code',
				editable: false,
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		//센터(출고) 타입
		const gridCol5 = [
			{
				dataField: 'yyyymm',
				headerText: t('년월'),
				required: true,
				dataType: 'code',
				editable: true,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					onlyMonthMode: true,
					defaultFormat: 'yyyymm',
				},
			},
			{
				dataField: 'dccode',
				headerText: t('공급센터'),
				required: true,
				dataType: 'code',
				editRenderer: {
					type: 'DropDownListRenderer',
					list: userDccodeList,
					keyField: 'dccode', // key 에 해당되는 필드명
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
				// required: true,
			},
			{
				dataField: 'dcname',
				headerText: t('공급센터명'),
				required: true,
				dataType: 'code',
				editable: false,
				filter: {
					showIcon: true,
				},
				// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// 	const dccode = item.dccode;
				// 	return userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
				// },
			},
			{
				dataField: 'filterkey',
				headerText: t('고객코드'),
				required: true,
				dataType: 'code',
				editable: true,
				commRenderer: {
					type: 'search',
					popupType: 'cust',
					searchDropdownProps: {
						dataFieldMap: {
							filterkey: 'code',
							custname: 'name',
						},
					},
					onClick: function (e: any) {
						const rowIndex = e.rowIndex;

						// 예: custcd 컬럼에서 팝업 열기
						refModal.current.open({
							codeName: e.text,
							gridRef: tabInfo[parentTabRef.current][activeKeyRef.current].gridRef,
							rowIndex,
							dataFieldMap: {
								filterkey: 'code',
								custname: 'name',
							},
							popupType: 'cust',
						});
					},
				},
			},
			{
				dataField: 'custname',
				headerText: t('고객명'),
				required: true,
				dataType: 'code',
				editable: false,
			},
			// {
			// 	dataField: 'processYn',
			// 	headerText: t('체크결과'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			// {
			// 	dataField: 'processMsg',
			// 	headerText: t('체크메세지'),
			// 	dataType: 'code',
			// 	editable: false,
			// },
			{
				dataField: 'addwho',
				headerText: t('등록자'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'adddate',
				headerText: t('등록일시'),
				dataType: 'code',
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
				dataType: 'code',
				editable: false,
			},
		];

		const gridProps = {
			editable: true,
			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			showRowCheckColumn: true, //체크박스
			showCustomRowCheckColumn: true,
			fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			isLegacyRemove: true, // 기존행 삭제 가능 옵션
			isGenNewRowsOnPaste: false,
		};

		const gridBtn1: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'excelForm', // 엑셀업로드
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						const params = {
							fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
						};
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.exportToXlsxGrid(params);
					},
				},
				{
					btnType: 'excelUpload', // 엑셀업로드
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						excelUploadFileRef.current.click();
					},
				},
				{
					btnType: 'plus', // 행추가
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						const yyyymm = form.getFieldValue('yyyymm').format('YYYYMM');
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current?.addRow({
							yyyymm,
							dcname: '',
							todcname: '',
							custname: '',
							skuname: '',
							partnername: '',
						});
					},
				},
				{
					btnType: 'delete', // 행삭제
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: onDelete,
				},
				{
					btnType: 'save', // 저장
					callBackFn: onSave,
				},
			],
		};

		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1',
					btnLabel: '전월복사',
					authType: 'new',
					callBackFn: onCopy,
				},
				{
					btnType: 'excelForm', // 엑셀업로드
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						const params = {
							fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
						};
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.exportToXlsxGrid(params);
					},
				},
				{
					btnType: 'excelUpload', // 엑셀업로드
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						excelUploadFileRef.current.click();
					},
				},
				{
					btnType: 'plus', // 행추가
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						const yyyymm = form.getFieldValue('yyyymm').format('YYYYMM');
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current?.addRow({
							yyyymm,
							dcname: '',
							todcname: '',
							custname: '',
							skuname: '',
							partnername: '',
						});
					},
				},
				{
					btnType: 'delete', // 행삭제
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: onDelete,
				},
				{
					btnType: 'save', // 저장
					callBackFn: onSave,
				},
			],
		};

		//총량
		const tabItemsSto = [
			{
				key: '1',
				label: '대상센터(이체)', //asis 대상센터 STO_DC
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn1} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '2',
				label: '센터 총량출고(CJL)', //new STO_DC_WD
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef1} columnLayout={gridCol5} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '3',
				label: '센터 총량출고(제주)', //new STO_DC_WD
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef20} columnLayout={gridCol5} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '4',
				label: '별도산정상품(김치)', //asis STO_ETC_SKU_ADD
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '5',
				label: '별도산정상품(미곡)', //asis 별도산정상품 STO_ETC_SKU
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef3} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '6',
				label: '제외고객', //asis STO_EX_CUST
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef4} columnLayout={gridCol3} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '7',
				label: '제외상품', //asis STO_EX_SKU
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef5} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
		];

		//분류
		const tabItemsSo = [
			{
				key: '1',
				label: '센터별저장유무', //asis 저장유무 SO_DC
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn1} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef6} columnLayout={gridCol1} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '2',
				label: '별도산정상품(김치)', //asis SO_EX_SKU_ADD
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef7} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '3',
				label: '별도산정상품(미곡)', //asis SO_EX_SKU
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef8} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '4',
				label: '별도산정상품(기타)', //new SO_ETC_SKU_ETC
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef9} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '5',
				label: '별도산정고객(군납)', //new SO_ETC_CUST_GUN
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef10} columnLayout={gridCol3} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '6',
				label: '별도산정고객(기타)', //new SO_ETC_CUST_ETC
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef11} columnLayout={gridCol3} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '7',
				label: '제외고객', //asis SO_EX_CUST
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef12} columnLayout={gridCol3} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '8',
				label: '별도산정상품(아이스크림)_수량', //new SO_ETC_SKU_ICE
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef13} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '9',
				label: '별도산정협력사', //new SO_ETC_PARTNER
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef14} columnLayout={gridCol4} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '10',
				label: '제외상품', //asis SO_EX_SKU
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef15} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
		];

		//입고
		const tabItemsDp = [
			{
				key: '1',
				label: '저장유무', //asis DP_DC
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn1} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef16} columnLayout={gridCol1} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '2',
				label: '제외상품', //asis DP_EX_SKU
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef17} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '3',
				label: '제외협력사', //asis DP_EX_VENDOR
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef18} columnLayout={gridCol4} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
			{
				key: '4',
				label: '별도산정상품(김치)', //asis DP_EX_SKU_ADD
				children: (
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef19} columnLayout={gridCol2} gridProps={{ ...gridProps }} />
					</AGrid>
				),
			},
		];

		/**
		 * =====================================================================
		 *	03. react hook event
		 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
		 * =====================================================================
		 */
		const initEvent = () => {
			setTimeout(() => {
				if (tabInfo[parentTabRef.current][activeKeyRef.current].isBind) {
					return;
				}
				tabInfo[parentTabRef.current][activeKeyRef.current].isBind = true;
				tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current?.bind('cellEditEnd', (e: any) => {
					console.log('에딧엔드')
					if (['dccode'].includes(e.dataField)) {
						const dccode = e.value;
						const dcname = userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(
							e.rowIndex,
							'dcname',
							dcname,
						);
					}
					if (['filterkey'].includes(e.dataField)) {
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(e.rowIndex, 'skuname', '');
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(
							e.rowIndex,
							'partnername',
							'',
						);
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(
							e.rowIndex,
							'custname',
							'',
						);
						const dccode = e.value;
						const dcname = userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '';
						tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(
							e.rowIndex,
							'todcname',
							dcname,
						);
					}
					if (['yyyymm'].includes(e.dataField)) {
						const v = String(e.value).trim();

						// 4자리만 입력한 경우 → 20 + 입력값
						if (/^\d{4}$/.test(v)) {
							const newVal = '20' + v;
							tabInfo[parentTabRef.current][activeKeyRef.current].gridRef.current.setCellValue(
								e.rowIndex,
								'yyyymm',
								newVal,
							);
						}
					}
				});
			}, 0);
		};

		// 그리드 다음 페이지 Data 조회되면 그리드에 추가
		useEffect(() => {
			tabInfo[parentTab][activeKey].gridRef.current?.setGridData(gridData);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = tabInfo[parentTab][activeKey].gridRef.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			tabInfo[parentTab][activeKey].gridRef.current?.setColumnSizeList(colSizeList);
		}, [gridData]);

		useEffect(() => {
			switch (parentTab) {
				case '1':
					setTabItems(tabItemsSto);
					setTitle('총량');
					break;
				case '2':
					setTabItems(tabItemsSo);
					setTitle('분류');
					break;
				case '3':
					setTabItems(tabItemsDp);
					setTitle('입고');
					break;
			}
		}, [parentTab]);

		useEffect(() => {
			gridRef.current?.resize('100%', '100%');
			gridRef1.current?.resize('100%', '100%');
			gridRef2.current?.resize('100%', '100%');
			gridRef3.current?.resize('100%', '100%');
			gridRef4.current?.resize('100%', '100%');
			gridRef5.current?.resize('100%', '100%');
			gridRef6.current?.resize('100%', '100%');
			gridRef7.current?.resize('100%', '100%');
			gridRef8.current?.resize('100%', '100%');
			gridRef9.current?.resize('100%', '100%');
			gridRef10.current?.resize('100%', '100%');
			gridRef11.current?.resize('100%', '100%');
			gridRef12.current?.resize('100%', '100%');
			gridRef13.current?.resize('100%', '100%');
			gridRef14.current?.resize('100%', '100%');
			gridRef15.current?.resize('100%', '100%');
			gridRef16.current?.resize('100%', '100%');
			gridRef17.current?.resize('100%', '100%');
			gridRef18.current?.resize('100%', '100%');
			gridRef19.current?.resize('100%', '100%');
			gridRef20.current?.resize('100%', '100%');
			activeKeyRef.current = activeKey;
			initEvent();
		}, [activeKey]);

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name={`${title} 마스터 설정`} func={titleFunc} />

				{/* 조회 컴포넌트 */}
				<SearchFormResponsive form={form} initialValues={{}} groupClass="grid-column-2" isAlwaysVisible>
					{/* <li>
					<CmStorerKeySelectBox nameKey="storerKey" label={'회사'} />
				</li> */}
					<li>
						<DatePicker
							label={t('lbl.WDMONTH')}
							name="yyyymm"
							picker={'month'}
							allowClear
							showNow={true}
							format="YYYY-MM"
							required={true}
						/>
					</li>
				</SearchFormResponsive>

				<TotalCount>
					<span>총 {commUtil.changeNumberFormatter(gridData?.length)}건</span>
				</TotalCount>

				{/* 그리드 영역 */}
				<Tabs
					activeKey={activeKey}
					onChange={key => setActiveKey(key)}
					items={tabItems}
					tabBarStyle={{ marginBottom: 0 }} // 공간 없애기
				/>

				<ButtonWrap data-props="single">
					<Button onClick={closeModal}>닫기</Button>
				</ButtonWrap>

				{/* 엑셀 파일 업로드 INPUT 영역 */}
				<input
					ref={excelUploadFileRef}
					id="excelUploadInput"
					type="file"
					onChange={onFileChange}
					onClick={(e: any) => {
						e.target.value = null;
					}}
					style={{ display: 'none' }}
				/>

				{/* 그리드 컬럼 팝업 영역 정의 */}
				<CmSearchWrapper ref={refModal} />
			</>
		);
	},
);

export default IbStoWeightMasterPopup;
