/*
 ############################################################################
 # FiledataField	: MsWdApp.tsx
 # Description		: 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리
 # Author			: KimDongHan
 # Since			: 2025.10.24
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
import {
	apiPostDetailList,
	apiPostMasterList,
	apiPostSaveDetailList,
	apiPostSaveMasterList,
} from '@/api/ms/apiMsWdApp';
import CmPopPopup from '@/components/cm/popup/CmPopPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import MsWdAppDetail from '@/components/ms/wdApp/MsWdAppDetail';
import MsWdAppSearch from '@/components/ms/wdApp/MsWdAppSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

// Store

const MsWdApp = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);

	const refModalPop = useRef(null);
	const [customDccode, setCustomDccode] = useState('');

	// 다국어
	const { t } = useTranslation();

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
		gridRef1.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 조회(상세)
	const searchDetailList = async (rowData: any) => {
		const requestParams = {
			dccode: rowData.dccode,
			popGroup: rowData.popGroup,
		};

		// 그리드 초기화
		gridRef1.current?.clearGridData();
		const { data } = await apiPostDetailList(requestParams);

		setGridData1(data || []);
	};

	// 저장
	const saveMasterList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

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

		// 중복컬럼 체크
		if (!gridRef.current?.validatePKGridData(['popGroup'])) {
			return;
		}
		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef.current?.showConfirmSave(() => {
			const params = {
				saveMasterList: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 저장(상세)
	const saveDetailList = async () => {
		const checkedItems = gridRef1.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef1.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef1.current?.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!gridRef1.current?.validateRequiredGridData()) {
			return;
		}

		// 중복컬럼 체크
		if (!gridRef1.current?.validatePKGridData(['popno'])) {
			return;
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef1.current?.showConfirmSave(() => {
			const params = {
				saveDetailList: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveDetailList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						const selectedRow = gridRef.current?.getSelectedRows()[0];
						searchDetailList(selectedRow);
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	const addDetail = () => {
		const selectedMasterRow = gridRef.current?.getSelectedItems();

		if (selectedMasterRow.length === 0) {
			// 상단 행 선택 후 추가 가능합니다.
			showAlert(null, t('msg.MSG_WD_APP_001'));
			return;
		}

		const rowStatus = selectedMasterRow[0].item.rowStatus;

		if (rowStatus === 'I') {
			// 신규 행인 경우 추가가 불가능합니다.
			showAlert(null, t('msg.MSG_WD_APP_002'));
			return;
		}

		const dccode = selectedMasterRow[0].item.dccode;

		setCustomDccode(dccode);
		refModalPop.current?.handlerOpen();
	};

	// POP 조회 팝업 닫기
	const handleClosePopPopup = () => {
		refModalPop.current?.handlerClose();
	};

	// POP 조회 팝업 콜백 예제
	const handlePopPopupCallback = (data: any) => {
		if (!Array.isArray(data) || data.length === 0) {
			return;
		}

		// 선택된 마스터 행에서 참조할 값
		const selectedMasterRow = gridRef.current?.getSelectedItems();
		const masterPopGroup = selectedMasterRow[0].item.popGroup;
		const masterUseYn = selectedMasterRow[0].item.useYn;
		const masterDcname = selectedMasterRow[0].item.dcname;

		// addRow로 추가
		for (const row of data) {
			const newItem: any = {
				dccode: row.dcCode,
				popGroup: masterPopGroup,
				useYn: masterUseYn,
				popno: row.popCode,
				rowStatus: 'I',
				dcname: masterDcname,
			};

			gridRef1.current?.addRow(newItem);
		}

		handleClosePopPopup();
	};

	// 검색영역 초기 세팅
	const searchBox = {
		storagetype: '',
		useYn: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearSortingAll();
		// 	gridRef1.current?.clearSortingAll();
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
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
	});

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<MsWdAppSearch {...formProps} />
			</SearchFormResponsive>

			<MsWdAppDetail
				form={form}
				addDetail={addDetail}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridData1={gridData1}
				searchMasterList={searchMasterList}
				searchDetailList={searchDetailList}
				saveMasterList={saveMasterList}
				saveDetailList={saveDetailList}
			/>
			{/* POP 조회 팝업 */}
			<CustomModal ref={refModalPop} width="1280px">
				<CmPopPopup
					callBack={handlePopPopupCallback}
					close={handleClosePopPopup}
					customDccode={customDccode}
					selectionMode="multipleRows"
				/>
			</CustomModal>
		</>
	);
};

export default MsWdApp;
