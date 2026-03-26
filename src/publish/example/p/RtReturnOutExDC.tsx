/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: RtReturnOutExDC.tsx
 # Description		: 외부비축협력사반품지시
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.06.27
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import RtReturnOutExDCDetail from '@/components/rt/returnOutExDC/RtReturnOutExDCDetail';
import RtReturnOutExDCSearch from '@/components/rt/returnOutExDC/RtReturnOutExDCSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetDataHeaderList } from '@/api/rt/apiRtReturnOutExDC';

// Hooks

const RtReturnOutExDC = () => {
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
		sku: null,
		fromCustkeyName: '',
		fromCustkey: null,
		blno: null,
		serialno: null,
		wdCustkeyName: '',
		wdCustkey: null,
		docdt: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 목록 조회
	 */
	const search = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 2170 물류센터만 조회 가능
		if (globalVariable.gDccode !== '2170') {
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const searchParams = searchForm.getFieldsValue();

		const params = {
			...searchParams,
		};

		// API 호출
		apiGetDataHeaderList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: search, // 조회
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
				<RtReturnOutExDCSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<RtReturnOutExDCDetail ref={refs} gridData={gridData} totalCount={totalCount} search={search} />
		</>
	);
};

export default RtReturnOutExDC;
