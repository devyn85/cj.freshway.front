/*
 ############################################################################
 # FiledataField	: SamplePopupCommon.tsx
 # Description		: 공통 팝업 예제
 # Author			: YeoSeungCheol
 # Since			: 25.08.04
 ############################################################################
*/
// lib
import { Divider, Form } from 'antd';

// component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmPopPopup from '@/components/cm/popup/CmPopPopup';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmPurchaseBuyerHstSearch from '@/components/cm/popup/CmPurchaseBuyerHstSearch';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

const SamplePopupCommon = () => {
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
		purchaseBuyerHsMultiName: '',
		purchaseBuyerHsMultiCode: '',
		custName: '',
		custCode: '',
		custNameExpanded: '',
		custCodeExpanded: '',
	};

	const selectedCode = '100000';
	const customDccode = '1000';

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
	const popRefModalDrag = useRef(null);

	const handleOpenPopup = (codeType: 'CARAGENTKEY' | 'PARTNERKEY' | 'DIRECTTYPE' | 'BUYERKEY' | 'IBCARRIERCUST') => {
		setSelectedCodeType(codeType);
		refModal.current?.handlerOpen();
	};
	const handleClosePopup = () => {
		refModal.current?.handlerClose();
	};

	// 사용자코드설정팝업 콜백 (저장 후 부모 화면 조회 시뮬레이션)
	const handleUserCodeCallback = () => {
		showAlert(null, '콜백함수 실행됨. 부모 화면 조회 완료 (테스트용)');
	};

	// POP 조회 팝업 열기
	const handleOpenPopPopup = () => {
		popRefModal.current?.handlerOpen();
	};

	// 드래그 가능한 POP 조회 팝열 열기
	const handleOpenPopPopupDrag = () => {
		popRefModalDrag.current?.handlerOpen();
	};

	// POP 조회 팝업 닫기
	const handleClosePopPopup = () => {
		popRefModal.current?.handlerClose();
	};

	// 드래그 가능한 POP 조회 팝업 닫기
	const handleClosePopPopupDrag = () => {
		popRefModalDrag.current?.handlerClose();
	};

	// POP 조회 팝업 콜백 예제
	const handlePopPopupCallback = (data: any) => {
		handleClosePopPopup();
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
				<Divider orientation="left">고객 조회 팝업 (props: expandedColumns='Y')</Divider>
				<CmCustSearch
					form={form}
					name="custNameExpanded"
					code="custCodeExpanded"
					selectionMode="multipleRows"
					expandedColumns="Y"
					selectedCode={selectedCode}
					customDccode={customDccode}
					// labelChange="dlv"
				/>

				{/* <Divider orientation="left">판매처 고객 조회 팝업 (props: expandedColumns='Y', labelChange='saleCust')</Divider>
				<CmCustSearch
					form={form}
					name="custNameExpanded"
					code="custCodeExpanded"
					selectionMode="multipleRows"
					expandedColumns="Y"
					labelChange="saleCust"
				/> */}

				{/* <Divider orientation="left">
					관리처 고객 조회 팝업 (props: expandedColumns='Y', labelChange='childCust')
				</Divider>
				<CmCustSearch
					form={form}
					name="custNameExpanded"
					code="custCodeExpanded"
					selectionMode="multipleRows"
					expandedColumns="Y"
					labelChange="childCust"
				/> */}

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
					selectionMode="singleRow" // [FWNEXTWMS-1687] 댓글 요청사항 반영
					name="purchaseBuyerHsMultiName"
					code="purchaseBuyerHsMultiCode"
					returnValueFormat="name"
					sku="108374"
				/>

				{/* POP 조회 팝업 */}
				<Divider orientation="left">POP 조회 팝업</Divider>
				<CmPopSearch form={form} name="popName" code="popCode" selectionMode="multipleRows" />
			</SearchForm>

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

			<Divider orientation="left">드래그 가능한 POP 조회 팝업</Divider>
			<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
				<button onClick={handleOpenPopPopupDrag}>드래그 가능한 POP 조회</button>
			</div>

			{/* 사용자코드설정팝업(테스트용) */}
			<CustomModal ref={refModal} width="800px">
				<CmUserCdCfgPopup codeType={selectedCodeType} callBack={handleUserCodeCallback} close={handleClosePopup} />
			</CustomModal>

			{/* POP 조회 팝업 */}
			<CustomModal ref={popRefModal} width="1280px">
				<CmPopPopup callBack={handlePopPopupCallback} close={handleClosePopPopup} selectionMode="multipleRows" />
			</CustomModal>

			{/* 드래그 가능한 POP 조회 팝업 */}
			<CustomModal ref={popRefModalDrag} width="1280px" draggable>
				<CmPopPopup close={handleClosePopPopupDrag} selectionMode="multipleRows" />
			</CustomModal>
		</>
	);
};

export default SamplePopupCommon;
