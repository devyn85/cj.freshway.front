/*
 ############################################################################
 # FiledataField	: OmInplan.tsx
 # Description		: 주문 > 주문현황 > 주문이력현황
 # Author			: jangjaehyun
 # Since			: 25.07.09
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmInplanDetail from '@/components/om/inplan/OmInplanDetail';
import OmInplanSearch from '@/components/om/inplan/OmInplanSearch';

// API Call Function
import { apiGetMasterList } from '@/api/om/apiOmInplan';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

// store
import { useAppSelector } from '@/store/core/coreHook';

const OmInplan = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	// 그리드 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: globalVariable.gDccode,
		rangeDocDt: [dayjs(), dayjs()],
		custNm: '',
		custKey: '',
		channelH: null,
		delYn: null,
		status: '',
		saleGroup: null,
		skuNm: '',
		skuCd: '',
		venderNm: '',
		venderCd: '',
		modifyDt: ['', ''],
		docNo: '',
	});

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	// 총 페이지 수
	const [totalPages, setTotalPages] = useState(0);

	// 현재 페이지 번호
	const [currentPageSrc, setCurrentPageSrc] = useState(1);

	// 페이지당 행 수
	const [pageSize] = useState(constants.PAGE_INFO.PAGE_SIZE);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = () => {
		//상세 영역 초기화
		setGridData([]);
		refs.detailGridRef.current?.clearGridData();

		// 조회 조건 설정
		const tt = currentPageSrc - 1;
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			fromDocdt: form.getFieldValue('rangeDocDt')[0] ? form.getFieldValue('rangeDocDt')[0].format('YYYYMMDD') : '',
			toDocdt: form.getFieldValue('rangeDocDt')[1] ? form.getFieldValue('rangeDocDt')[1].format('YYYYMMDD') : '',
			fromModifyDate: form.getFieldValue('modifyDt')[0] ? form.getFieldValue('modifyDt')[0].format('YYYYMMDDHHmm') : '',
			toModifyDate: form.getFieldValue('modifyDt')[1] ? form.getFieldValue('modifyDt')[1].format('YYYYMMDDHHmm') : '',
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCnt(res.data.totalCount);
			}
			if (res.data.totalPages > -1) {
				setTotalPages(res.data.totalPages);
			}
			if (res.data.pageNum > -1) {
				setCurrentPageSrc(res.data.pageNum);
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * 목록 조회 및 스크롤 페이징
	 */
	const searchScroll = throttle(() => {
		// 조회 조건 설정
		const tt = currentPageSrc - 1;
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			fromDocdt: form.getFieldValue('rangeDocDt')[0] ? form.getFieldValue('rangeDocDt')[0].format('YYYYMMDD') : '',
			toDocdt: form.getFieldValue('rangeDocDt')[1] ? form.getFieldValue('rangeDocDt')[1].format('YYYYMMDD') : '',
			fromModifyDate: form.getFieldValue('modifyDt')[0] ? form.getFieldValue('modifyDt')[0].format('YYYYMMDDHHmm') : '',
			toModifyDate: form.getFieldValue('modifyDt')[1] ? form.getFieldValue('modifyDt')[1].format('YYYYMMDDHHmm') : '',
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			refs.gridRef.current.appendData(res.data.list);
			if (res.data.pageNum > -1) {
				setCurrentPageSrc(res.data.pageNum);
			}
		});
	}, 500);

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * currentPageSrc 변경되면 조회 실행
	 */
	useEffect(() => {
		if (currentPageSrc > 1) {
			searchScroll();
		}
	}, [currentPageSrc]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<OmInplanSearch form={form} />
			</SearchFormResponsive>

			<OmInplanDetail
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				currentPage={currentPageSrc}
				setCurrentPage={setCurrentPageSrc}
			/>
		</>
	);
};
export default OmInplan;
