/*
 ############################################################################
 # FiledataField	: TmTrxCalculationResult.tsx
 # Description		: 운송비정산현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.10
 ############################################################################
*/
// CSS

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmTrxCalculationResultDetail from '@/components/tm/trxCalculationResult/TmTrxCalculationResultDetail';
import TmTrxCalculationResultSearch from '@/components/tm/trxCalculationResult/TmTrxCalculationResultSearch';

// Util

// Type

// Store

// API
import { apiPostMasterList, apiPostWorkDay } from '@/api/tm/apiTmTrxCalculationResult';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

const TmTrxCalculationResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 근무일수
	const [workDay, setWorkDay] = useState('');

	// searchForm data 초기화
	const [searchBox] = useState({
		slipdtRange: [dayjs(), dayjs()],
		deliveryType: null,
		closeType: null,
		contractType: null,
		courier: null,
		carno: null,
		carcapacity: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 운송비정산서 조회
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		// const tt = 0;
		const params = {
			fixdccode: searchParams.fixdccode,
			fromdate: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			todate: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
			deliveryType: searchParams.deliveryType,
			closeType: searchParams.closeType,
			contractType: searchParams.contractType,
			courier: searchParams.courier,
			carno: searchParams.carno,
			carcapacity: searchParams.carcapacity,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});

		searchWorkDay();
	};

	/**
	 * 월 기준 근무일수 조회
	 */
	const searchWorkDay = async () => {
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());

		// 조회 조건 설정
		const params = {
			fixdccode: searchParams.fixdccode,
			fromdate: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			todate: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
		};

		// API 호출
		apiPostWorkDay(params).then(res => {
			if (res.data.length > 0) {
				const workDay = '근무일수 ' + String(res.data[0].workDay) + '일 ';
				setWorkDay(workDay);
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
				<TmTrxCalculationResultSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<TmTrxCalculationResultDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				workDay={workDay}
				callBackFn={searchMasterList}
				form={searchForm}
			/>
		</>
	);
};

export default TmTrxCalculationResult;
