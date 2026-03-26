/*
 ############################################################################
 # FiledataField	: TmMultiPopAllocation.tsx
 # Description		: 거래처별이중POP배차현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.23
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
import TmMultiPopAllocationDetail from '@/components/tm/multiPopAllocation/TmMultiPopAllocationDetail';
import TmMultiPopAllocationSearch from '@/components/tm/multiPopAllocation/TmMultiPopAllocationSearch';

// Util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

// Type

// Store

// API
import { apiPostMasterList } from '@/api/tm/apiTmMultiPopAllocation';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

const TmMultiPopAllocation = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 그리드 제목
	const [gridTitle] = useState<string>(t('lbl.CUSTPOPNONE_GRID_TITLE'));

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// searchForm data 초기화
	const [searchBox] = useState({
		deliverydate: dayjs(),
		custCode: '',
		custName: '',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 거래처별이중 POP 배차 목록 조회
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = searchForm.getFieldsValue();

		// validation
		if (commUtil.isEmpty(searchParams.deliverydate)) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DELIVERYDATE')]));
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		// const tt = 0;
		const params = {
			fixdccode: searchParams.fixdccode,
			deliverydate: searchParams.deliverydate.format('YYYYMMDD'),
			custkey: searchParams.custCode,
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
				<TmMultiPopAllocationSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<TmMultiPopAllocationDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				form={searchForm}
			/>
		</>
	);
};

export default TmMultiPopAllocation;
