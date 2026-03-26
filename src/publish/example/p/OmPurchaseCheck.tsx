// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmPurchaseCheckDetail from '@/components/om/purchaseCheck/OmPurchaseCheckDetail';
import OmPurchaseCheckSearch from '@/components/om/purchaseCheck/OmPurchaseCheckSearch';

// API Call Function
import { apiGetMasterListPO, apiGetMasterListSTO } from '@/api/om/apiOmPurchaseCheck';

// Hooks

// store
import { useAppSelector } from '@/store/core/coreHook';

const OmPurchaseCheck = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef = useRef(null);

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: [globalVariable.gDccode],
		slipDt: dayjs(),
		sku: '',
		gubun: 'PO',
	});

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = () => {
		//상세 영역 초기화
		setGridData([]);
		setTotalCnt(0);

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			slipDt: form.getFieldValue('slipDt') ? form.getFieldValue('slipDt').format('YYYYMMDD') : '',
		};

		if (form.getFieldValue('gubun') === 'PO') {
			// PO 조회
			apiGetMasterListPO(params).then(res => {
				setGridData(res.data);
				if (res.data.length > -1) {
					setTotalCnt(res.data.length);
				}
			});
		} else if (form.getFieldValue('gubun') === 'STO') {
			// STO 조회
			apiGetMasterListSTO(params).then(res => {
				setGridData(res.data);
				if (res.data.length > -1) {
					setTotalCnt(res.data.length);
				}
			});
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmPurchaseCheckSearch form={form} />
			</SearchFormResponsive>

			<OmPurchaseCheckDetail gridRef={gridRef} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default OmPurchaseCheck;
