/*
 ############################################################################
 # FiledataField	: StStockForCJL.tsx
 # Description		: 재고 > 재고현황 > 저장품재고조회(CJ대한통운)
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StStockForCJLDetail from '@/components/st/stockForCJL/StStockForCJLDetail';
import StStockForCJLSearch from '@/components/st/stockForCJL/StStockForCJLSearch';
// import axios from 'axios';
import { apiGetMasterList } from '@/api/st/apiStStockForCJL';

// lib

const StStockForCJL = () => {
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
		const params = form.getFieldsValue();
		// 입력 값 검증
		if (params) {
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}
		}
		// sl 1000센터 뒷자리로만 검색
		const slValue = params.sl ? params.sl.split('-')[1] : '';

		const finalParams = {
			...params,
			sl: slValue,
		};

		apiGetMasterList(finalParams).then(res => {
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

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form}>
				<StStockForCJLSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockForCJLDetail ref={gridRef} form={form} gridData={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StStockForCJL;
