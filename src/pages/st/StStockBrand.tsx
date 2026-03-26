/*
 ############################################################################
 # FiledataField	: StStockBrand.tsx
 # Description		: 재고 > 재고현황 > 재고조회
 # Author			: JeongHyeongCheol
 # Since			: 25.09.12
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiGetMasterList } from '@/api/st/apiStStockBrand';
import StStockBrandDetail from '@/components/st/stockBrand/StStockBrandDetail';
import StStockBrandSearch from '@/components/st/stockBrand/StStockBrandSearch';

// lib

const StStockBrand = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const gridRef = useRef(null);

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = async () => {
		gridRef.current.clearGridData();
		setTotalCnt(0);
		const params = form.getFieldsValue();
		// 입력 값 검증
		if (params) {
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}
		}
		const selectMonth = form.getFieldValue('yyyyMm');
		if (selectMonth) {
			params.fromdt = selectMonth[0].format('YYYYMM');
			params.todt = selectMonth[1].format('YYYYMM');
		}
		delete params.yyyyMm;
		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
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

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form}>
				<StStockBrandSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockBrandDetail ref={gridRef} form={form} gridData={gridData} totalCnt={totalCnt} setTotalCnt={setTotalCnt} />
		</>
	);
};

export default StStockBrand;
