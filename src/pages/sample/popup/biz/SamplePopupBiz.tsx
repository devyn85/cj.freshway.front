/*
 ############################################################################
 # FiledataField	: SamplePopupBiz.tsx
 # Description		: 업무 팝업 예제
 # Author			: YeoSeungCheol
 # Since			: 25.08.04
 ############################################################################
*/
// lib
import { Divider, Form } from 'antd';
import { useRef } from 'react';

// component
import CmIssuePicturePopup from '@/components/cm/popup/CmIssuePicturePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpReceiptMstPop1 from '@/components/dp/receipt/DpReceiptMstPop1';
import MsCustDlvInfoHisPopup from '@/components/ms/popup/MsCustDlvInfoHisPopup';
import MsCustHistPopup from '@/components/ms/popup/MsCustHistPopup';
import MsPopUploadLocation from '@/components/ms/popup/MsPopUploadLocation';
import MsPurchaseCustPopup from '@/components/ms/popup/MsPurchaseCustPopup';
import MsTcCodeCfgPopup from '@/components/ms/popup/MsTcCodeCfgPopup';
import MsVehicleExitGroupCfgPopup from '@/components/ms/popup/MsVehicleExitGroupCfgPopup';
import Constants from '@/util/constants';

const SamplePopupBiz = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {};

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
	const custDlvInfoHisModal = useRef(null);
	const custHistModal = useRef(null);
	const purchaseCustModal = useRef(null);
	const tcCodeCfgModal = useRef(null);
	const vehicleExitGroupCfgModal = useRef(null);
	const uploadLocationModal = useRef(null);
	const dpReceiptMstPop1Modal = useRef(null);
	const cmIssuePictureModal = useRef(null);
	const customImageModal = useRef(null);
	// 테스트용 변수들
	const sku = '100021';
	// const storerKey = 'FW00';
	const serialKey = '2398430,2398433,2398446,2398447,2398795,2398808,2399165,2399166,2399179,2399181';
	const custKey = '527271030';
	// const custKey = '511231035';
	const dccode = '2600';

	const customImagesItems = useMemo(
		() => [
			{
				title: 'test01',
				src: 'https://test.com/sample-1.jpg',
				alt: 'sample-1',
			},
			{
				title: 'test02',
				src: 'https://test.com/sample-2.jpg',
				alt: 'sample-2',
			},
			{
				title: 'test03',
				src: 'https://test.com/sample-3.jpg',
				alt: 'sample-3',
			},
		],
		[],
	);

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

	// 출차그룹설정 팝업 열기
	const handleOpenVehicleExitGroupCfgPopup = () => {
		vehicleExitGroupCfgModal.current?.handlerOpen();
	};

	// 출차그룹설정 팝업 닫기
	const handleCloseVehicleExitGroupCfgPopup = () => {
		vehicleExitGroupCfgModal.current?.handlerClose();
	};

	// 출발지TC센터설정 팝업 열기
	const handleOpenTcCodeCfgPopup = () => {
		tcCodeCfgModal.current?.handlerOpen();
	};

	// 출발지TC센터설정 팝업 닫기
	const handleCloseTcCodeCfgPopup = () => {
		tcCodeCfgModal.current?.handlerClose();
	};

	// 로케이션일괄업로드 팝업 열기
	const handleOpenUploadLocationPopup = () => {
		uploadLocationModal.current?.handlerOpen();
	};

	// 로케이션일괄업로드 팝업 닫기
	const handleCloseUploadLocationPopup = () => {
		uploadLocationModal.current?.handlerClose();
	};

	// 저장품자동발주검수 팝업 열기 (window.open)
	const handleOpenPurchaseInspectPopup = () => {
		// 테스트 데이터
		const testOrders = [
			{
				PURCHASETYPE: '일반발주',
				DELIVERYTYPE: '직송',
				DCCODE: 'DC001',
				SKU: 'SKU001',
				SKUNAME: '테스트 상품 1',
				PURCHASEUOM: 'EA',
				ORDEREDQTY: 100,
				CUSTKEY: 'CUST001',
				CUSTNAME: '협력사A',
				CONFIRMQTY_STOCKDAY: 7,
				BOXPERPLT: 20,
				BLNO: 'BL20250930001',
				CONTRACTTYPE: '계약유형A',
			},
			{
				PURCHASETYPE: '긴급발주',
				DELIVERYTYPE: '일반',
				DCCODE: 'DC002',
				SKU: 'SKU002',
				SKUNAME: '테스트 상품 2',
				PURCHASEUOM: 'BOX',
				ORDEREDQTY: 50,
				CUSTKEY: 'CUST002',
				CUSTNAME: '협력사B',
				CONFIRMQTY_STOCKDAY: 5,
				BOXPERPLT: 15,
				BLNO: 'BL20250930002',
				CONTRACTTYPE: '계약유형B',
			},
			{
				PURCHASETYPE: '자동발주',
				DELIVERYTYPE: '직송',
				DCCODE: 'DC003',
				SKU: 'SKU003',
				SKUNAME: '테스트 상품 3',
				PURCHASEUOM: 'PALLET',
				ORDEREDQTY: 200,
				CUSTKEY: 'CUST003',
				CUSTNAME: '협력사C',
				CONFIRMQTY_STOCKDAY: 10,
				BOXPERPLT: 25,
				BLNO: 'BL20250930003',
				CONTRACTTYPE: '계약유형C',
			},
		];

		// 팝업 열기
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		const popupUrl = `/om/OmPurchaseInspectPop?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;
		const popup = window.open(popupUrl, 'OmPurchaseInspectPop', `width=${'1200px'},height=${'480px'},left=0,top=0`);

		// 팝업이 준비되면 데이터 전송
		const handleMessage = (event: MessageEvent) => {
			if (event.data === 'popup-ready' && popup) {
				popup.postMessage(testOrders, window.location.origin);
				window.removeEventListener('message', handleMessage);
			}
		};

		window.addEventListener('message', handleMessage);
	};

	// 출고결품현황_PDP용 팝업 열기 (window.open)
	const handleOpenInspectMntPopforDp = () => {
		// 팝업 열기
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		const popupUrl = `/wd/WDInspectMntPopforDp?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;
		const popup = window.open(
			popupUrl,
			'WDInspectMntPopforDpWd',
			`width=${width},height=${height},left=0,top=0,resizable=yes,scrollbars=yes`,
		);
	};

	// 출고결품현황_PDP 입고+출고용 팝업 열기 (window.open)
	const handleOpenInspectMntPopforDpWd = () => {
		// 팝업 열기
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		const popupUrl = `/wd/WDInspectMntPopforDpWd?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;
		const popup = window.open(
			popupUrl,
			'WDInspectMntPopforDpWd',
			`width=${width},height=${height},left=0,top=0,resizable=yes,scrollbars=yes`,
		);
	};

	// 배송 이슈 사진 팝업 열기
	const handleOpenCmIssuePictureModalPopup = () => {
		cmIssuePictureModal.current?.handlerOpen();
	};
	const handleCloseCmIssuePictureModalPopup = () => {
		cmIssuePictureModal.current?.handlerClose();
	};

	// CustomImageModal 팝업 열기
	const handleOpenCustomImageModal = () => {
		customImageModal.current?.handlerOpen();
	};
	const handleCloseCustomImageModal = () => {
		customImageModal.current?.handlerClose();
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
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange} isAlwaysVisible>
				<Divider orientation="left">
					수발주정보 수정(CUSTKEY: 2398430,2398433,2398446,2398447,2398795,2398808,2399165,2399166,2399179,2399181)
				</Divider>
				<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
					<button onClick={handleOpenPurchaseCustPopup}>수발주정보 수정</button>
				</div>
			</SearchForm>

			<Divider orientation="left">고객배송조건 수신이력 조회(CUSTKEY: {custKey})</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenCustDlvInfoHisPopup}>고객배송조건 수신이력 조회</button>
			</div>

			<Divider orientation="left">CBM 이력정보 상세정보 조회</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenCustHistPopup}>CBM 이력정보 상세정보 조회 (예제 SKU: {sku})</button>
			</div>

			<Divider orientation="left">출차그룹설정(props.customDccode: {dccode})</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenVehicleExitGroupCfgPopup}>출차그룹설정 팝업</button>
			</div>

			<Divider orientation="left">출발지TC센터설정</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenTcCodeCfgPopup}>출발지TC센터설정 팝업</button>
			</div>

			<Divider orientation="left">로케이션일괄업로드</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenUploadLocationPopup}>로케이션일괄업로드 팝업</button>
			</div>

			<Divider orientation="left">저장품자동발주검수 (새창 팝업)</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenPurchaseInspectPopup}>저장품자동발주검수 팝업 (새창으로 열기)</button>
			</div>

			<Divider orientation="left">출고결품현황_PDP용 (새창 팝업)</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenInspectMntPopforDp}>출고결품현황_PDP용 팝업 (새창으로 열기)</button>
			</div>

			<Divider orientation="left">출고결품현황_PDP 입고+출고용 (새창 팝업)</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenInspectMntPopforDpWd}>출고결품현황_PDP 입고+출고용 팝업 (새창으로 열기)</button>
			</div>

			<Divider orientation="left">센터 입고기준 팝업</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={() => dpReceiptMstPop1Modal.current?.handlerOpen()}>센터 입고기준 팝업</button>
			</div>

			<Divider orientation="left">배송 이슈 사진 팝업</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenCmIssuePictureModalPopup}>배송 이슈 사진 팝업</button>
			</div>

			{/* 고객배송조건 수신이력 조회 팝업 */}
			<CustomModal ref={custDlvInfoHisModal} width="1280px">
				<MsCustDlvInfoHisPopup
					custKey={custKey}
					callBack={handleCustDlvInfoHisCallback}
					close={handleCloseCustDlvInfoHisPopup}
				/>
			</CustomModal>

			{/* CBM 이력정보 상세정보 조회 팝업 */}
			<CustomModal ref={custHistModal} width="800px">
				<MsCustHistPopup sku={sku} callBack={handleCustHistCallback} close={handleCloseCustHistPopup} />
			</CustomModal>

			{/* 수발주정보 수정 팝업 */}
			<CustomModal ref={purchaseCustModal} width="1000px">
				<MsPurchaseCustPopup serialKey={serialKey} close={handleClosePurchaseCustPopup} />
			</CustomModal>

			{/* 출차그룹설정 팝업 */}
			<CustomModal ref={vehicleExitGroupCfgModal} width="1280px">
				<MsVehicleExitGroupCfgPopup close={handleCloseVehicleExitGroupCfgPopup} customDccode={dccode} />
			</CustomModal>

			{/* 출발지TC센터설정 팝업 */}
			<CustomModal ref={tcCodeCfgModal} width="1280px">
				<MsTcCodeCfgPopup close={handleCloseTcCodeCfgPopup} />
			</CustomModal>

			{/* 로케이션일괄업로드 팝업 */}
			<CustomModal ref={uploadLocationModal} width="1280px">
				<MsPopUploadLocation close={handleCloseUploadLocationPopup} />
			</CustomModal>

			{/* 센터 입고기준 팝업 */}
			<CustomModal ref={dpReceiptMstPop1Modal} width="800px">
				<DpReceiptMstPop1 codeType={'EXPIRATION_DATE_DP'} close={() => dpReceiptMstPop1Modal.current?.handlerClose()} />
			</CustomModal>

			{/* 배송 이슈 사진 팝업 */}
			<CustomModal ref={cmIssuePictureModal} width="800px">
				<CmIssuePicturePopup
					close={handleCloseCmIssuePictureModalPopup}
					open={true}
					param={{
						dccode: '2630',
						deliverydt: '20260303',
						truthcustkey: 'SB0618301',
						carno: '(수원2)경기90자5231',
						priority: '2',
					}}
				/>
			</CustomModal>
		</>
	);
};

export default SamplePopupBiz;
