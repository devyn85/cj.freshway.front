/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: StConvertLotExDC.tsx
 # Description		: 외부비축소비기한변경
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import StConvertLotExDCDetail from '@/components/st/convertLotExDC/StConvertLotExDCDetail';
import StConvertLotExDCSearch from '@/components/st/convertLotExDC/StConvertLotExDCSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';

// Store

// API
import { apiGetDataHeaderList } from '@/api/st/apiStConvertLotExDC';

// Hooks
import commUtil from '@/util/commUtil';

const StConvertLotExDC = () => {
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
	// const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 상세 데이터
	// const [detailData, setDetailData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 총 페이지 수
	// const [totalPages, setTotalPages] = useState(0);

	// 현재 페이지 번호
	// const [currentPageSrc, setCurrentPageSrc] = useState(1);

	// 페이지당 행 수
	// const [pageSize] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		skuCode: null,
		skugroup: null,
		blno: null,
		serialno: null,
		contractcompanyName: '',
		contractcompany: null,
		organizeName: '',
		organize: null,
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

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const searchParams = searchForm.getFieldsValue();
		const params = {
			fixdccode: searchParams.fixdccode,
			organize: searchParams.organize,
			sku: searchParams.skuCode,
			skugroup: searchParams.skugroup,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			contractcompany: searchParams.contractcompany,
			lottable01: searchParams.lottable01,
			searchserial:
				!commUtil.isEmpty(searchParams.blno) ||
				!commUtil.isEmpty(searchParams.serialno) ||
				!commUtil.isEmpty(searchParams.contractcompany)
					? 'Y'
					: null,
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
				<StConvertLotExDCSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<StConvertLotExDCDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				search={search}
				dccode={searchForm.getFieldValue('fixdccode')}
			/>
		</>
	);
};

export default StConvertLotExDC;
