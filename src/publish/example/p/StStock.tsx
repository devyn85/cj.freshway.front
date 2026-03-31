import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StStockDetail from '@/components/st/stock/StStockDetail';
import StStockSearch from '@/components/st/stock/StStockSearch';

// lib
import axios from '@/api/Axios';

const StStock = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: null,
		organize: null,
		sortKey: null,
		sobiRate: null,
		sku: null,
		storageType: null,
		lottable01yn: null,
		stocktype: null,
		stockgrade: null,
		serialno: null,
		zone: null,
		loccategory: null,
		lottable01: null,
		fromloc: null,
		toloc: null,
		zeroQtyYn: null,
	}); // 검색영역 초기값

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		//refs.current.setHandlerSearch();

		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				const zeroQtyYn = form.getFieldValue('zeroQtyYn'); // '1'이면 0인 상품 제외, '0'이면 포함
				let result = res.data; // 전체 재고 데이터

				if (zeroQtyYn === '1') {
					// 현재고(qty)가 0인 상품 제외
					result = result.filter((item: any) => item.qty !== 0);
				}

				setGridData(result);
				setTotalCnt(result.length);
			}
		});
	};

	/**
	 * 조회 api 함수
	 * @param {object} params - 파라미터
	 * @returns {Promise<any>} Axios response data
	 */
	const apiGetMasterList = (params: any) => {
		return axios.post('/api/st/stock/v1.0/getMasterList', params).then(res => res.data);
	};

	/**
	 * 공통버튼 클릭
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// START.로케이션/상품별 합계표시 여부
	const locSkuSumYn = Form.useWatch('locSkuSumYn', form);
	useEffect(() => {
		if (locSkuSumYn === '1') {
			refs.gridRef.current.setGroupBy(['loc', 'sku'], ['loc', 'sku']);
		} else {
			refs.gridRef.current.setGroupBy([], []);
		}
	}, [locSkuSumYn]);
	// END.로케이션/상품별 합계표시 여부

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" name="재고조회" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StStockSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StStock;
