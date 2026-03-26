/*
 ############################################################################
 # FiledataField	: IbExpense.tsx
 # Description		: 비용기표
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import IbExpenseDetail from '@/components/ib/expense/IbExpenseDetail';
import IbExpenseSearch from '@/components/ib/expense/IbExpenseSearch';
import { useTranslation } from 'react-i18next';

// Util

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/ib/apiIbExpense';

// Hooks

const IbExpense = () => {
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
		dateType: 'ADDDATE',
		stockmonth: dayjs(),
		dtRange: [dayjs().subtract(8, 'day'), dayjs()],
		expensegubun: null,
		status: null,
		ifStatus: null,
		searchType: 'KEY_NO',
		searchVal: null,
		organizeName: '',
		organize: null,
		supplierName: '',
		supplierCode: null,
		searchDateCategory: 'adddate',
		searchTypeCategory: 'keyno',
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

		// 조회 조건 설정
		const searchParams = searchForm.getFieldsValue();

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const params = {
			fixdccode: searchParams.fixdccode,
			status: searchParams.status,
			ifStatus: searchParams.ifStatus,
			attributes2: searchParams.expensegubun,
			searchVal: searchParams.searchVal,
			organize: searchParams.organize,
			supplierCode: searchParams.supplierCode,
		};

		if (searchParams.searchDateCategory) {
			if (searchParams.searchDateCategory === 'yyyymm' && searchParams.stockmonth) {
				params[searchParams.searchDateCategory] = dayjs(searchParams.stockmonth).format('YYYYMM');
			} else {
				if (searchParams.dtRange && searchParams.dtRange.length === 2) {
					params[searchParams.searchDateCategory + 'From'] = dayjs(searchParams.dtRange[0]).format('YYYYMMDD');
					params[searchParams.searchDateCategory + 'To'] = dayjs(searchParams.dtRange[1]).format('YYYYMMDD');
				}
			}
		}

		if (searchParams.searchTypeCategory && searchParams.searchVal) {
			params[searchParams.searchTypeCategory] = searchParams.searchVal;
		}

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
				<IbExpenseSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<IbExpenseDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				searchForm={searchForm}
				dccode={searchForm.getFieldValue('fixdccode')}
			/>
		</>
	);
};

export default IbExpense;
