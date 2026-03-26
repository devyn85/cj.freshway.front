/*
 ############################################################################
 # FiledataField	: StStockSD.tsx
 # Description		: 재고 > 재고현황 > 이력재고조회
 # Author			: 성상수
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

// lib
import axios from '@/api/Axios';
import { SearchForm } from '@/components/common/custom/form';
import StTransactionDetail from '@/components/st/transaction/StTransactionDetail';
import StTransactionSearch from '@/components/st/transaction/StTransactionSearch';

const StTransaction = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
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
		docno: null,
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
	const searchMasterList = async () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		if (params.fromloc || params.docno || params.contractcompany) {
			params.searchserial = 'Y';
		}

		// 1개월 체크
		const docdt = form.getFieldValue('dt');
		const dt1 = docdt?.[0]?.format('YYYYMMDD') ?? '';
		const dt2 = docdt?.[1]?.format('YYYYMMDD') ?? '';
		/*
			const diffMonths = end.diff(start, 'month', true);

			if (diffMonths >= 1) {
				showAlert(null, t('msg.MSG_COM_ERR_060', [1])); // 조회 기간은 최대 {{0}}개월까지 가능합니다.
				return;
			}
		*/

		if (dt1 !== dt2) {
			if (commUtil.isEmpty(params.sku) && commUtil.isEmpty(params.docno) && commUtil.isEmpty(params.loc)) {
				showAlert(
					null,
					'조회기간이 하루이상인 경우\n상품코드나 로케이션, 문서번호 \n셋 중 하나는 필수 입력 하셔야 합니다 ',
				);
				return;
			}
		}

		params.dt1 = dt1;
		params.dt2 = dt2;

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
		return axios.post('/api/st/transaction/v1.0/getMasterList', params).then(res => res.data);
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
			<SearchForm form={form} initialValues={searchBox}>
				<StTransactionSearch search={searchMasterList} form={form} />
			</SearchForm>
			<StTransactionDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StTransaction;
