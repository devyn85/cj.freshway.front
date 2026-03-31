/*
 ############################################################################
 # FiledataField	: StConvertIdSN.tsx
 # Description		: 재고 > 재고조정 > 이력상품바코드변경
 # Author			: KimDongHan
 # Since			: 2025.09.16
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList } from '@/api/st/apiStConvertIdSN';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import StConvertIdSNDetail from '@/components/st/convertIdSN/StConvertIdSNDetail';
import StConvertIdSNSearch from '@/components/st/convertIdSN/StConvertIdSNSearch';
import { validateForm } from '@/util/FormUtil';
import styled from 'styled-components';

// Store

const StConvertIdSN = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = {
		fixdccode: '',
		reasoncode: '1',
		fromzone: '',
		tozone: '',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 저장
	const saveMasterList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length < 1) {
			//체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		const isValid = await validateForm(form1);

		if (!isValid) {
			return;
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				apiUrl: '/api/st/convertIdSN/v1.0/saveMasterList',
				avc_COMMAND: 'CONFIRM',
				converttype: 'CI',
				reasoncode: form1.getFieldValue('reasoncode'),
				reasonmsg: form1.getFieldValue('reasonmsg'),
				toStockid: form1.getFieldValue('toStockid'),
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen();
		});
	};

	const closeEvent = () => {
		modalRef.current?.handlerClose();
		searchMasterList();
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current?.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
	});

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsiveWrap>
				<SearchFormResponsive {...formProps}>
					<StConvertIdSNSearch {...formProps} />
				</SearchFormResponsive>
			</SearchFormResponsiveWrap>
			<StConvertIdSNDetail
				gridRef={gridRef}
				gridData={gridData}
				form={form}
				form1={form1}
				saveMasterList={saveMasterList}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default StConvertIdSN;

const SearchFormResponsiveWrap = styled.div`
	li {
		.ant-row.ant-form-item-row {
			.ant-form-item-label {
				padding-left: 4px;
			}
		}
	}
`;
