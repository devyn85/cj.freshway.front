/*
 ############################################################################
 # FiledataField	: StStockChain.tsx
 # Description		: 재고 > 재고현황 > 상품별현재고(PLT)현황
 # Author			: jangjaehyun
 # Since			: 25.09.23
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StStockChainDetail from '@/components/st/stockChain/StStockChainDetail';
import StStockChainSearch from '@/components/st/stockChain/StStockChainSearch';

// API Call Function
import { apiPostMasterList } from '@/api/st/apiStStockChain';

// Hooks

// store
import { useAppSelector } from '@/store/core/coreHook';

const StStockChain = () => {
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

	// 그리드 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [globalVariable.gDccode],
		reference15: 'Y',
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

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			multiSku: searchParams.sku,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			if (res.data.length > -1) {
				setTotalCnt(res.data.length);
			}
		});
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
				<StStockChainSearch form={form} />
			</SearchFormResponsive>

			<StStockChainDetail ref={refs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default StStockChain;
