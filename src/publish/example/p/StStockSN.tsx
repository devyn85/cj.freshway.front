import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

// lib
import axios from '@/api/Axios';
import StStockSNDetail from '@/components/st/stockSN/StStockSNDetail';
import StStockSNSearch from '@/components/st/stockSN/StStockSNSearch';

const StStockSD = () => {
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
		fixdccode: null,
		organizenm: null,
		sortKey: null,
		skuName: null,
		storagetype: null,
		lottable01yn: null,
		stocktype: null,
		stockgrade: null,
		zone: null,
		fromloc: null,
		toloc: null,
		blno: null,
		serialno: null,
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

		if (params.fromloc || params.blno || params.contractcompany) {
			params.searchserial = 'Y';
		}

		//refs.current.setHandlerSearch();

		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/**
	 * 조회 api 함수
	 * @param {object} params - 파라미터
	 * @returns {Promise<any>} Axios response data
	 */
	const apiGetMasterList = (params: any) => {
		return axios.post('/api/st/stStockSN/v1.0/getMasterList', params).then(res => res.data);
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

	useEffect(() => {
		//
	}, []);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StStockSNSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockSNDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StStockSD;
