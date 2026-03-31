/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: StExDCStorage.tsx
 # Description		: 외부창고정산
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridLoading from '@/components/common/GridLoading';
import StExDCStorageDetail from '@/components/st/exDCStorage/StExDCStorageDetail';
import StExDCStorageSearch from '@/components/st/exDCStorage/StExDCStorageSearch';

// Util
import { validateForm } from '@/util/FormUtil';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/st/apiStExDCStorage';

// Hooks

const StExDCStorage = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 로딩 상태
	const [isLoadingGrid, setIsLoadingGrid] = useState(false);

	// 목록
	const [auth, setAuth] = useState([]);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		stockmonth: dayjs(),
		organizeName: '',
		organize: null,
		gubun: null,
		type: null,
		taxCls: null,
		skuName: '',
		sku: null,
		blno: null,
		docno: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 목록 조회
	 * @param {any} forcedLoding
	 */
	const searchMasterList = async (forcedLoding: any) => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		if (forcedLoding) {
			setIsLoadingGrid(true);
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());
		const params = {
			fixdccode: searchParams.fixdccode,
			stockmonth: dayjs(searchParams.stockmonth).format('YYYYMM'),
			organize: searchParams.organize,
			gubun: searchParams.gubun,
			type: searchParams.type,
			taxCls: searchParams.taxCls,
			sku: searchParams.sku,
			convserialno: searchParams.convserialno,
			docno: searchParams.docno,
			contracttype: searchParams.contracttype,
			qtyxzero: searchParams.qtyxzero,
		};

		if (searchParams.category && searchParams.searchVal) {
			(params as any)[searchParams.category] = searchParams.searchVal;
		}

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
			if (forcedLoding) {
				setIsLoadingGrid(false);
			}
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
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
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StExDCStorageSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<GridLoading isLoading={isLoadingGrid} />
			<StExDCStorageDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				dccode={searchForm.getFieldValue('fixdccode')}
				form={searchForm}
			/>
		</>
	);
};

export default StExDCStorage;
