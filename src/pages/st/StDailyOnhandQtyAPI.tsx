/*
 ############################################################################
 # FiledataField	: StDailyOnhandQtyAPI.tsx
 # Description		: 외부창고 API 재고현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.04
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import StDailyOnhandQtyAPIDetail from '@/components/st/dailyOnhandQtyAPI/StDailyOnhandQtyAPIDetail';
import StDailyOnhandQtyAPISearch from '@/components/st/dailyOnhandQtyAPI/StDailyOnhandQtyAPISearch';
import { useTranslation } from 'react-i18next';

// Util

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/st/apiStDailyOnhandQtyAPI';

// Hooks

const StDailyOnhandQtyAPI = () => {
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

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		searchdate: dayjs(),
		organizeName: '',
		organize: null,
		skuName: '',
		sku: null,
		convserialno: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 목록 조회
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());

		const params = {
			fixdccode: searchParams.fixdccode,
			searchdate: dayjs(searchParams.searchdate).format('YYYYMMDD'),
			sku: searchParams.sku,
			organize: searchParams.organize,
			convserialno: searchParams.convserialno,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
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
				<StDailyOnhandQtyAPISearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<StDailyOnhandQtyAPIDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				searchForm={searchForm}
			/>
		</>
	);
};

export default StDailyOnhandQtyAPI;
