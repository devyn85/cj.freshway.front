/*
 ############################################################################
 # FiledataField	: Popup.tsx
 # Description		: 팝업
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Divider, Form } from 'antd';
// utils

// component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmPopPopup from '@/components/cm/popup/CmPopPopup';
import CmPurchaseBuyerHstSearch from '@/components/cm/popup/CmPurchaseBuyerHstSearch';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
// 임시
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import MsCustDlvInfoHisPopup from '@/components/ms/popup/MsCustDlvInfoHisPopup';
import MsCustHistPopup from '@/components/ms/popup/MsCustHistPopup';
import MsPurchaseCustPopup from '@/components/ms/popup/MsPurchaseCustPopup';

// API Call Function

const Popup = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [selectedCodeType, setSelectedCodeType] = useState<
		'CARAGENTKEY' | 'PARTNERKEY' | 'DIRECTTYPE' | 'BUYERKEY' | 'IBCARRIERCUST'
	>('CARAGENTKEY');

	// form data 초기화
	const initFormData = {
		partnerName: '',
		partnerCode: '',
		purchaseBuyerHsName: '',
		purchaseBuyerHsCode: '',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	//Form 수정된값 출력
	const onValuesChange = (changedValues: any, allValues: any) => {};

	// 임시
	const titleFunc = {
		searchYn: '',
		saveYn: '',
	};

	// 임시
	const refModal = useRef(null);
	const popRefModal = useRef(null);
	const custDlvInfoHisModal = useRef(null);
	const custHistModal = useRef(null);
	const purchaseCustModal = useRef(null);

	// 테스트용 변수들
	const sku = '100021';
	const storerKey = 'FW00';
	const serialKey = '2391403';

	const handleOpenPopup = (codeType: 'CARAGENTKEY' | 'PARTNERKEY' | 'DIRECTTYPE' | 'BUYERKEY' | 'IBCARRIERCUST') => {
		setSelectedCodeType(codeType);
		refModal.current?.handlerOpen();
	};
	const handleClosePopup = () => {
		refModal.current?.handlerClose();
	};

	// POP 조회 팝업 열기
	const handleOpenPopPopup = () => {
		popRefModal.current?.handlerOpen();
	};

	// POP 조회 팝업 닫기
	const handleClosePopPopup = () => {
		popRefModal.current?.handlerClose();
	};

	// POP 조회 팝업 콜백 예제
	const handlePopPopupCallback = (data: any) => {
		handleClosePopPopup();
	};

	// 고객배송조건 수신이력 팝업 열기
	const handleOpenCustDlvInfoHisPopup = () => {
		custDlvInfoHisModal.current?.handlerOpen();
	};

	// 고객배송조건 수신이력 팝업 닫기
	const handleCloseCustDlvInfoHisPopup = () => {
		custDlvInfoHisModal.current?.handlerClose();
	};

	// 고객배송조건 수신이력 팝업 콜백
	const handleCustDlvInfoHisCallback = (data: any) => {
		handleCloseCustDlvInfoHisPopup();
	};

	// CBM이력정보 상세정보 팝업 열기
	const handleOpenCustHistPopup = () => {
		custHistModal.current?.handlerOpen();
	};

	// CBM이력정보 상세정보 팝업 닫기
	const handleCloseCustHistPopup = () => {
		custHistModal.current?.handlerClose();
	};

	// CBM이력정보 상세정보 팝업 콜백
	const handleCustHistCallback = (data: any) => {
		handleCloseCustHistPopup();
	};

	// 수발주정보 팝업 열기
	const handleOpenPurchaseCustPopup = () => {
		purchaseCustModal.current?.handlerOpen();
	};
	const handleClosePurchaseCustPopup = () => {
		purchaseCustModal.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<Divider orientation="left">협력사 조회 팝업</Divider>
				<CmPartnerSearch
					form={form}
					selectionMode="multipleRows"
					name="partnerName"
					code="partnerCode"
					returnValueFormat="name"
				/>

				<Divider orientation="left">수급담당 변경이력 조회</Divider>
				<CmPurchaseBuyerHstSearch
					form={form}
					selectionMode="multipleRows"
					name="purchaseBuyerHsName"
					code="purchaseBuyerHsCode"
					returnValueFormat="code"
				/>

				<Divider orientation="left">수발주정보 수정</Divider>
				<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
					<button onClick={handleOpenPurchaseCustPopup}>
						수발주정보 수정(예제 storerKey: FW00, 예제 serialKey: 2391403)
					</button>
				</div>
			</SearchForm>

			<Divider orientation="left">고객배송조건 수신이력 조회</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenCustDlvInfoHisPopup}>고객배송조건 수신이력 조회</button>
			</div>

			<Divider orientation="left">CBM 이력정보 상세정보 조회</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenCustHistPopup}>CBM 이력정보 상세정보 조회 (예제 SKU: {sku})</button>
			</div>

			<Divider orientation="left">사용자코드설정팝업(테스트용)</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={() => handleOpenPopup('CARAGENTKEY')}>배송코드</button>
				<button onClick={() => handleOpenPopup('PARTNERKEY')}>협력사코드</button>
				<button onClick={() => handleOpenPopup('DIRECTTYPE')}>직배송유형</button>
				<button onClick={() => handleOpenPopup('BUYERKEY')}>구매처코드</button>
				<button onClick={() => handleOpenPopup('IBCARRIERCUST')}>입고운송사코드</button>
			</div>

			<Divider orientation="left">POP 조회 팝업</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenPopPopup}>POP 조회</button>
			</div>

			{/* 고객배송조건 수신이력 조회 팝업 */}
			<CustomModal ref={custDlvInfoHisModal} width="1280px">
				<MsCustDlvInfoHisPopup callBack={handleCustDlvInfoHisCallback} close={handleCloseCustDlvInfoHisPopup} />
			</CustomModal>

			{/* 사용자코드설정팝업(테스트용) */}
			<CustomModal ref={refModal} width="800px">
				<CmUserCdCfgPopup codeType={selectedCodeType} close={handleClosePopup} />
			</CustomModal>

			{/* POP 조회 팝업 */}
			<CustomModal ref={popRefModal} width="1280px">
				<CmPopPopup callBack={handlePopPopupCallback} close={handleClosePopPopup} selectionMode="multipleRows" />
			</CustomModal>

			{/* CBM 이력정보 상세정보 조회 팝업 */}
			<CustomModal ref={custHistModal} width="800px">
				<MsCustHistPopup sku={sku} callBack={handleCustHistCallback} close={handleCloseCustHistPopup} />
			</CustomModal>

			{/* 수발주정보 수정 팝업 */}
			<CustomModal ref={purchaseCustModal} width="1000px">
				<MsPurchaseCustPopup storerKey={storerKey} serialKey={serialKey} close={handleClosePurchaseCustPopup} />
			</CustomModal>
		</>
	);
};

export default Popup;
