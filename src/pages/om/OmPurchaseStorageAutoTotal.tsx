/*
 ############################################################################
 # FiledataField	: OmPurchaseStorageAutoTotal.tsx
 # Description		: 저장품자동발주
 # Author			: jh.jang
 # Since			: 25.10.13
 ############################################################################
 */

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import OmPurchaseStorageAutoTotalDetail from '@/components/om/purchaseStorageAutoTotal/OmPurchaseStorageAutoTotalDetail';
import OmPurchaseStorageAutoTotalOutDetail from '@/components/om/purchaseStorageAutoTotal/OmPurchaseStorageAutoTotalOutDetail';
import OmPurchaseStorageAutoTotalSearch from '@/components/om/purchaseStorageAutoTotal/OmPurchaseStorageAutoTotalSearch';

// API Call Function
import { apiGetMasterList } from '@/api/om/apiOmPurchaseStorageAutoTotal';

// Store

const OmPurchaseStorageAutoTotal = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [showTmpSaveButton, setShowTmpSaveButton] = useState(false);
	const [ckSTO, setCkSTO] = useState('N');
	//외부창고 발주 여부
	const [isOutOrder, setIsOutOrder] = useState(false);

	// 다국어
	const { t } = useTranslation();

	// 그리드 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: null,
		buyerKey: null,
		partnerName: null,
		multiFromCustKey: null,
		skuName: null,
		multiSku: null,
		purchaseType: null,
		deliveryTypeArr: ['STD'],
		dcCode: '',
		stdDt: dayjs().add(1, 'day'),
		execDay: 7,
		storageType: null,
		channel: '1',
		route: null,
		reference03: false,
		outOrder: false,
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

		let dcCodeVal = form.getFieldValue('multiDcCode') ? form.getFieldValue('multiDcCode') : [''];
		if (isOutOrder && dcCodeVal === '2170') {
			dcCodeVal = form.getFieldValue('organizeCode') ? [form.getFieldValue('organizeCode').split('-')[0]] : [''];
		}

		if (isOutOrder) {
			// dcCodeVal에 '1000'이 포함되어 있으면 form.getFieldValue('organizeCode')가 필수값이므로 체크
			if (dcCodeVal.includes('1000')) {
				const organizeCode = form.getFieldValue('organizeCode');
				if (!organizeCode) {
					showAlert(null, 'KX센터 조회 시 창고 선택은 필수입니다.');
					return;
				}
			}
		}

		const params = {
			...form.getFieldsValue(),
			stdDt: dayjs(form.getFieldValue('stdDt')).format('YYYYMMDD'),
			dcCode: dcCodeVal[0],
			multiDcCode: dcCodeVal,
			stoout: isOutOrder ? 'Y' : '',
		};

		//조달PO 선택조회시 조달임시저장 버튼 노출
		if (params.purchaseTypeArr.includes('PROC-PO')) {
			setShowTmpSaveButton(true);
		} else {
			setShowTmpSaveButton(false);
		}

		// const openCenterList = getCommonCodeList('OPENCENTER');

		if (
			params.purchaseTypeArr.includes('STO') ||
			params.purchaseTypeArr.includes('STO-ADD') ||
			params.purchaseTypeArr.includes('STO-AUTO')
		) {
			setCkSTO('Y');
			// 공급받는 센터가 오픈센터에 존재하는지 확인
			// const multiDcCode = form.getFieldValue('multiDcCode');

			// const isExist = multiDcCode.some((code: string) => openCenterList.some((center: any) => center.comCd === code));
			// if (isExist) {
			// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
			// 	return;
			// }
		} else {
			setCkSTO('N');
		}

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 상단 버튼 함수 정의
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		// 기존 그리드 초기화
		refs.gridRef.current.clearGridData();
	}, [isOutOrder]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmPurchaseStorageAutoTotalSearch form={form} isOutOrder={isOutOrder} setIsOutOrder={setIsOutOrder} />
			</SearchFormResponsive>
			{isOutOrder ? (
				<OmPurchaseStorageAutoTotalOutDetail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					showTmpSaveButton={showTmpSaveButton}
					ckSTO={ckSTO}
					isOutOrder={isOutOrder}
				/>
			) : (
				<OmPurchaseStorageAutoTotalDetail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					showTmpSaveButton={showTmpSaveButton}
					ckSTO={ckSTO}
					isOutOrder={isOutOrder}
				/>
			)}
		</>
	);
};

export default OmPurchaseStorageAutoTotal;
