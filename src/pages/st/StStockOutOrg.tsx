/*
 ############################################################################
 # FiledataField	: StStockOutOrgSearch.tsx
 # Description		: 외부비축재고조회
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StStockOutOrgDetail from '@/components/st/stockOutOrg/StStockOutOrgDetail';
import StStockOutOrgSearch from '@/components/st/stockOutOrg/StStockOutOrgSearch';

// store

// API Call Function
import { apiGetDataHeaderList } from '@/api/st/apiStStockOutOrg';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// util

// hook

// type

// asset
const StStockOutOrg = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		SKU_L: '',
		SKU_M: '',
		SKU_D: '',
		SKU_S: '',
		stockStatus20: '1',
		stockStatus30: '0',
		stockStatus40: '0',
		storageType: null,
		stockType: null,
		stockGrade: null,
		chkQty: '0',
		chkQty1: '0',
		stockAmount: '0',
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	// 값이 "있는지" 판단
	const hasValue = (v: any) => {
		if (v === null || v === undefined) return false;
		if (typeof v === 'string') return v.trim() !== '';
		if (Array.isArray(v)) return v.length > 0;
		return true; // 0, false 같은 값은 "값 있음"으로 취급
	};

	// row 값 꺼내기(키 매핑 필요하면 여기서 처리)
	const getRowValue = (row: any, key: string) => row?.[key];

	// 필터 로직
	const filterBySearchParams = (data: any[], searchParams: Record<string, any>) => {
		// not null인 조건만 추출
		const conditions = Object.entries(searchParams).filter(([, v]) => hasValue(v));
		return data.filter(row => {
			return conditions.every(([key, condVal]) => {
				const rowVal = getRowValue(row, key);

				// row에 값이 없으면 불일치
				if (rowVal === null || rowVal === undefined) return false;

				// 배열 조건: 포함 여부
				if (Array.isArray(condVal)) {
					return condVal.includes(rowVal);
				}

				// 문자열 조건: 공백 제거 후 같으면 통과
				if (typeof condVal === 'string') {
					return String(rowVal).trim() === condVal.trim();
				}

				// 그 외: strict 비교
				return rowVal === condVal;
			});
		});
	};

	// 조회
	const searchMaterList = async () => {
		const params = form.getFieldsValue();

		if (params.stockStatus20 !== '1' && params.stockStatus30 !== '1' && params.stockStatus40 !== '1') {
			showAlert(null, '상품, 위탁, 미착 중 선택해 주세요.');
			return;
		}

		const searchParms = {
			...params,
			skuL: params.SKU_L,
			skuM: params.SKU_M,
			skuS: params.SKU_S,
			skuD: params.SKU_D,
			...(params.blNo || params.serialNo || params.contractcompany ? { searchSerial: 'Y' } : {}),
		};

		apiGetDataHeaderList(searchParms).then(res => {
			if (params.stockStatus === 30 || params.stockStatus === 10) {
				const val = {
					skuL: params.SKU_L,
					skuM: params.SKU_M,
					skuS: params.SKU_S,
					skuD: params.SKU_D,
					convSerialNo: params.blNo,
					serialNo: params.serialNo,
					storageType: getCommonCodebyCd('STORAGETYPE', params.storageType)?.cdNm,
					contractCompany: params.contractCompany,
				};
				setGridData(filterBySearchParams(res.data ?? [], val));
				setTotalCnt(filterBySearchParams(res.data ?? [], val).length);
			} else {
				setGridData(res.data);
				setTotalCnt(res.data?.length);
			}

			// 검색 후 단가/금액표시 체크박스 초기화
			form.setFieldsValue({ stockAmount: '0' });
			form.setFieldsValue({ stockAmount_checkbox: false });
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StStockOutOrgSearch form={form} searchMaterList={searchMaterList} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<StStockOutOrgDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={searchMaterList} form={form} />
		</>
	);
};

export default StStockOutOrg;
