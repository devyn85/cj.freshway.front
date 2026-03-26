/*
 ############################################################################
 # FiledataField	: IbExpenseStatus.tsx
 # Description		: 원가관리리포트
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.02
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import IbExpenseStatusDetail from '@/components/ib/expenseStatus/IbExpenseStatusDetail';
import IbExpenseStatusSearch from '@/components/ib/expenseStatus/IbExpenseStatusSearch';
import { useTranslation } from 'react-i18next';

// Util

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/ib/apiIbExpenseStatus';

// Hooks

const IbExpenseStatus = () => {
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
	//const [gridData, setGridData] = useState<any>(undefined);
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);

	// searchForm data 초기화
	const [searchBox] = useState({
		postingdate: dayjs(),
		houseblno: null,
		polineno: null,
		erppono: null,
		customercode: null,
		itemcode: null,
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
		refs.gridRef2?.current.clearGridData();

		// 조회 조건 설정
		const params = {
			postingdate: dayjs(searchParams.postingdate).format('YYYYMMDD'),
			houseblno: searchParams.houseblno,
			polineno: searchParams.polineno,
			erppono: searchParams.erppono,
			customercode: searchParams.customercode,
			itemcode: searchParams.itemcode,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			if (res.data.headerList) {
				setGridData(res.data.headerList);
				setTotalCount(res.data.headerList.length);
			}
			if (res.data.detailList) {
				setGridData2(res.data.detailList);
				setTotalCount2(res.data.detailList.length);
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
				<IbExpenseStatusSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<IbExpenseStatusDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				gridData2={gridData2}
				totalCount2={totalCount2}
				callBackFn={searchMasterList}
				searchForm={searchForm}
			/>
		</>
	);
};

export default IbExpenseStatus;
