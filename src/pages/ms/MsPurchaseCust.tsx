/*
 ############################################################################
 # FiledataField	: MsPurchaseCust.tsx
 # Description		: 수발주정보
 # Author			: jh.jang
 # Since			: 25.07.24
 ############################################################################
 */

// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsPurchaseCustDetail from '@/components/ms/purchaseCust/MsPurchaseCustDetail';
import MsPurchaseCustSearch from '@/components/ms/purchaseCust/MsPurchaseCustSearch';

// Store
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsPurchaseCust';
import CmPurchaseCustPopup from '@/components/cm/popup/CmPurchaseCustPopup';

const MsPurchaseCust = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 그리드 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	const refModal = useRef(null);

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		partnerName: null,
		partnerCode: null,
		skuName: null,
		skuCode: null,
		channel: '1',
		chkPurchasemst: null,
		coefficientSafety: null,
		deliveryType: null,
		leadTime: null,
		line01: null,
		purchaseType: null,
		purInterval: null,
		purchaseYn: null,
		storageType: null,
		serialYn: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		refs.gridRef.current.clearGridData();
		refs.gridRef2.current.clearGridData();

		const params = {
			...form.getFieldsValue(),
			purchaseYn: form.getFieldValue('purchaseYn') ? 'Y' : 'N',
			chkPurchasemst:
				!commUtil.isEmpty(form.getFieldValue('buyerKey')) ||
				!commUtil.isEmpty(form.getFieldValue('purchaseType')) ||
				!commUtil.isEmpty(form.getFieldValue('deliveryType')) ||
				!commUtil.isEmpty(form.getFieldValue('leadTime')) ||
				!commUtil.isEmpty(form.getFieldValue('coefficientSafety')) ||
				!commUtil.isEmpty(form.getFieldValue('purInterval'))
					? 'Y'
					: 'N',
		};

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 저장
	 */
	const saveInspectTotalList = () => {
		const checkedItems = refs.gridRef1.current.getChangedData();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('msg.confirmSave'), () => {
			if (refs.gridRef1.current.getChangedData().length > 0) {
				const saveParams = {
					apiUrl: '/api/dp/inspect/v1.0/saveMaster',
					avc_DCCODE: '2600',
					avc_COMMAND: 'CONFIRM',
					saveDataList: refs.gridRef1.current.getChangedData(),
				};
			}
		});
	};

	/**
	 * 상단 버튼 함수 정의
	 */
	const titleFunc = {
		searchYn: searchMasterList,
		setting: () => {
			handleOpenPopPopup();
		},
	};

	// 구매처 조회 팝업 열기
	const handleOpenPopPopup = () => {
		refModal.current?.handlerOpen();
	};

	// 구매처 조회 팝업 닫기
	const handleClosePopPopup = async () => {
		await fetchGrpCommCode();
		refs.gridRef.current.setColumnPropByDataField('buyerKeyNm', {
			headerText: t('lbl.POMDCODE'),
			dataType: 'user',
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true,
				autoEasyMode: true,
				showEditorBtnOver: true,
				list: getCommonCodeList('BUYERKEY', ''),
				keyField: 'cdNm',
				valueField: 'cdNm',
				doValidatorFromItemClick: true,
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const valueField = this.valueField;
					const isValid = getCommonCodeList('BUYERKEY', '').some(v => v[valueField] === newValue);
					if (isValid) {
						item['buyerKey'] = getCommonCodeList('BUYERKEY', '').find(v => v[valueField] === newValue).comCd;
					}
					return { validate: isValid };
				},
			},
		});
		refModal.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsPurchaseCustSearch form={form} />
			</SearchFormResponsive>
			<MsPurchaseCustDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} callBackFn={searchMasterList} />
			{/* 구매처 조회 팝업 */}
			<CustomModal ref={refModal} width="800px">
				<CmPurchaseCustPopup close={handleClosePopPopup} />
			</CustomModal>
		</>
	);
};

export default MsPurchaseCust;
