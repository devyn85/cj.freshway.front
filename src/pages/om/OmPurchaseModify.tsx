/*
 ############################################################################
 # FiledataField	: OmPurchaseModify.tsx
 # Description		: 수발주정보
 # Author			: jh.jang
 # Since			: 25.07.24
 ############################################################################
 */

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import OmPurchaseModifyDetail from '@/components/om/purchaseModify/OmPurchaseModifyDetail';
import OmPurchaseModifySearch from '@/components/om/purchaseModify/OmPurchaseModifySearch';

// API Call Function
import { apiGetMasterListPO, apiGetMasterListSTO } from '@/api/om/apiOmPurchaseModify';

const OmPurchaseModify = () => {
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
	const [purchaseType, setPurchaseType] = useState<'PO' | 'STO'>('PO');

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		slipDt: [dayjs(), dayjs()],
		partnerName: null,
		partnerCode: null,
		skuName: null,
		skuCode: null,
		deliveryType: null,
		purchaseType: null,
		buyerKey: null,
		selectPoSto: 'PO',
		fromMultiDcCode: [],
		requestNo: null,
		docNo: null,
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

		const params = {
			...form.getFieldsValue(),
			purchaseYn: form.getFieldValue('purchaseYn') ? 'Y' : '',
			slipDtFrom: dayjs(form.getFieldValue('slipDt')[0]).format('YYYYMMDD'),
			slipDtTo: dayjs(form.getFieldValue('slipDt')[1]).format('YYYYMMDD'),
			chkPurchase: form.getFieldValue('purchaseType') !== null || form.getFieldValue('buyerKey') !== null ? 'Y' : '',
			slipDt: '',
		};

		if (purchaseType === 'PO') {
			apiGetMasterListPO(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (purchaseType === 'STO') {
			apiGetMasterListSTO(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		}
	};

	/**
	 * 상단 버튼 함수 정의
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	const onChangeSelectPoSto = (e: any) => {
		setPurchaseType(e);
		if (e === 'PO') {
			// cell merge 기준 변경
			refs.gridRef.current.setColumnProp(0, { mergeRef: 'requestNo' });
			refs.gridRef.current.setColumnProp(11, { mergeRef: 'requestNo' });
			refs.gridRef.current.setColumnProp(12, { mergeRef: 'requestNo' });

			// STO Master
			refs.gridRef.current.showColumnByDataField('requestNo');
			refs.gridRef.current.showColumnByDataField('custKey');
			refs.gridRef.current.showColumnByDataField('custName');
			// STO Detail
			refs.gridRef.current.showColumnByDataField('requestNo');
			refs.gridRef.current.showColumnByDataField('requestLine');
			refs.gridRef.current.showColumnByDataField('poKey');
			refs.gridRef.current.showColumnByDataField('poLine');
			refs.gridRef.current.showColumnByDataField('delYn');

			// PO Master
			refs.gridRef.current.hideColumnByDataField('docNo');
			refs.gridRef.current.hideColumnByDataField('fromDcCode');
			refs.gridRef.current.hideColumnByDataField('fromDcName');
			refs.gridRef.current.hideColumnByDataField('fromOrganize');
			refs.gridRef.current.hideColumnByDataField('fromOrganizeName');
			// PO Detail
			refs.gridRef.current.hideColumnByDataField('slipLine');
		} else {
			// cell merge 기준 변경
			refs.gridRef.current.setColumnProp(0, { mergeRef: 'docNo' });
			refs.gridRef.current.setColumnProp(11, { mergeRef: 'docNo' });
			refs.gridRef.current.setColumnProp(12, { mergeRef: 'docNo' });

			// PO Master
			refs.gridRef.current.hideColumnByDataField('requestNo');
			refs.gridRef.current.hideColumnByDataField('custKey');
			refs.gridRef.current.hideColumnByDataField('custName');
			// PO Detail
			refs.gridRef.current.hideColumnByDataField('requestNo');
			refs.gridRef.current.hideColumnByDataField('requestLine');
			refs.gridRef.current.hideColumnByDataField('poKey');
			refs.gridRef.current.hideColumnByDataField('poLine');
			refs.gridRef.current.hideColumnByDataField('delYn');

			// STO Master
			refs.gridRef.current.showColumnByDataField('docNo');
			refs.gridRef.current.showColumnByDataField('fromDcCode');
			refs.gridRef.current.showColumnByDataField('fromDcName');
			refs.gridRef.current.showColumnByDataField('fromOrganize');
			refs.gridRef.current.showColumnByDataField('fromOrganizeName');
			// STO Detail
			refs.gridRef.current.showColumnByDataField('slipLine');
		}

		refs.gridRef.current.setGridData([]);
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
				<OmPurchaseModifySearch form={form} onChangeSelectPoSto={onChangeSelectPoSto} purchaseType={purchaseType} />
			</SearchFormResponsive>
			<OmPurchaseModifyDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				purchaseType={purchaseType}
				callBackFn={searchMasterList}
			/>
		</>
	);
};

export default OmPurchaseModify;
