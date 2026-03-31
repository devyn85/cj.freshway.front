/*
 ############################################################################
 # FiledataField	: RtReceiptModifyReturnType.tsx
 # Description		: 반품 > 반품작업 > 반품회수/미회수변경
 # Author			: KimDongHyeon
 # Since			: 2025.09.10
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import dayjs from 'dayjs';
import { apiPostMasterList, apiPostSaveMasterList } from '@/api/rt/apiRtReceiptModifyReturnType';
import { validateForm } from '@/util/FormUtil';
import RtReceiptModifyReturnTypeSearch from '@/components/rt/receiptModifyReturnType/RtReceiptModifyReturnTypeSearch';
import RtReceiptModifyReturnTypeDetail from '@/components/rt/receiptModifyReturnType/RtReceiptModifyReturnTypeDetail';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Store

const RtReceiptModifyReturnType = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_RT');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			storagetype,
			start,
			end,
			rate,
		};
	});
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataExcel, setGridDataExcel] = useState([]);
	const [gridDataExcel2, setGridDataExcel2] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
			searchDate: 'req',
		}),
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		if (requestParams.searchDate == 'req') {
			requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		} else {
			requestParams.confirmdateFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.confirmdateTo = slipdtTo.format('YYYYMMDD');
		}
		delete requestParams.slipdt;

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
	};

	//저장
	const saveRtReceiptModifyReturnTypeMaster = async (gridNo: number) => {
		const checkedItems = gridRef.current.getChangedData({ validationYn: false, andCheckedYn: false });

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		gridRef.current.showConfirmSave(async () => {
			const params = {
				saveMasterList: checkedItems,
			};
			const res = await apiPostSaveMasterList(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				showAlert('', t('msg.confirmSaved'), searchMasterList);
			}
		});
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<RtReceiptModifyReturnTypeSearch {...formProps} />
			</SearchFormResponsive>

			<RtReceiptModifyReturnTypeDetail
				isShow={activeKey == '1'}
				gridRef={gridRef}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				saveRtReceiptModifyReturnTypeMaster={saveRtReceiptModifyReturnTypeMaster}
			/>

			{/*마스터저장*/}
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default RtReceiptModifyReturnType;
