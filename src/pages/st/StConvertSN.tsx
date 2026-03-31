/*
 ############################################################################
 # FiledataField	: StConvertSN.tsx
 # Description		: 재고 > 재고조정 > 상품이력번호변경
 # Author			: KimDongHan
 # Since			: 2025.09.11
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostDetailT1List, apiPostDetailT2List, apiPostMasterList } from '@/api/st/apiStConvertSN';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import StConvertSNDetail from '@/components/st/convertSN/StConvertSNDetail';
import StConvertSNSearch from '@/components/st/convertSN/StConvertSNSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const StConvertSN = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	//선택적용
	const applyReason = () => {
		const checkedItems = gridRef.current?.getCheckedRowItems();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		const reasonCode = form1.getFieldValue('reasoncode') || '';
		const reasonMsg = form1.getFieldValue('reasonmsg') || '';

		for (const item of checkedItems) {
			gridRef.current?.setCellValue(item.rowIndex, 'reasoncode', reasonCode);
			gridRef.current?.setCellValue(item.rowIndex, 'reasonmsg', reasonMsg);
		}
	};

	// 상단 그리드 조회
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		// 그리드 초기화
		gridRef.current?.clearGridData();
		gridRef1.current?.clearGridData();
		gridRef2.current?.clearGridData();

		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 재고현황 조회
	const searchDetailT1List = async (rowData: any) => {
		gridRef1.current?.clearGridData();
		const requestParams = form.getFieldsValue();
		const requestParams1 = form1.getFieldsValue();

		requestParams.sku = rowData.sku;
		requestParams.serialno = rowData.preSerialno;
		requestParams.blno = rowData.convserialno;
		requestParams.contractcompany = rowData.contractcompany;

		const { data } = await apiPostDetailT1List({ ...requestParams, ...requestParams1 });
		//const { data } = await apiPostDetailT1List(requestParams);
		setGridData1(data || []);
	};

	// 입출이력 조회
	const searchDetailT2List = async (rowData: any) => {
		gridRef2.current?.clearGridData();
		const requestParams = form.getFieldsValue();
		const requestParams1 = form1.getFieldsValue();

		const [slipdtFrom, slipdtTo] = requestParams1.slipdt;
		requestParams1.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams1.slipdtTo = slipdtTo.format('YYYYMMDD');

		requestParams.sku = rowData.sku;
		requestParams.serialno = rowData.preSerialno;
		requestParams.blno = rowData.convserialno;
		requestParams.contractcompany = rowData.contractcompany;

		const { data } = await apiPostDetailT2List({ ...requestParams, ...requestParams1 });
		setGridData2(data || []);
	};

	// 저장
	const saveMasterList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef.current?.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!gridRef.current?.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef.current?.showConfirmSave(() => {
			const params = {
				apiUrl: '/api/st/convertSN/v1.0/saveMasterList',
				avc_COMMAND: 'CONVERTSN',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen();
		});
	};

	// 검색영역 초기 세팅
	const searchBox = {
		stockyn: 'Y', // 재고유무
		sku: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
		// 	gridRef2.current?.clearGridData();
		// },
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearSortingAll();
		gridRef1.current?.clearSortingAll();
		gridRef2.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	// const openModal = () => {
	// 	modalRef.current?.handlerOpen();
	// };

	const closeEvent = () => {
		modalRef.current?.handlerClose();
		searchMasterList();
	};

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<StConvertSNSearch {...formProps} />
			</SearchFormResponsive>

			<StConvertSNDetail
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridData={gridData}
				gridData1={gridData1}
				gridData2={gridData2}
				activeKey={activeKey}
				activeKeyRef={activeKeyRef}
				setActiveKey={setActiveKey}
				applyReason={applyReason}
				form1={form1}
				saveMasterList={saveMasterList}
				searchDetailT1List={searchDetailT1List}
				searchDetailT2List={searchDetailT2List}
				dates={dates}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default StConvertSN;
