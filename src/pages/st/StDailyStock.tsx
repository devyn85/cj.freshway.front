/*
 ############################################################################
 # FiledataField	: StDailyStock.tsx
 # Description		: 재고 > 재고현황 > 시점별재고조회
 # Author			: KimDongHyeon
 # Since			: 2025.11.05
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostMasterList } from '@/api/st/apiStDailyStock';
import StDailyStockDetail from '@/components/st/dailyStock/StDailyStockDetail';
import StDailyStockSearch from '@/components/st/dailyStock/StDailyStockSearch';
import dayjs from 'dayjs';

// lib

const StDailyStock = () => {
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
		stockdate: dayjs().subtract(1, 'day'),
	});

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
		params.stockdate = params.stockdate.format('YYYYMMDD');

		apiPostMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
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
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StDailyStockSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StDailyStockDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StDailyStock;
