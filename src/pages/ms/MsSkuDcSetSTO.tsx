/*
 ############################################################################
 # FiledataField	: MsSkuDcSetSTO.tsx
 # Description		: 기준정보 > 상품기준정보 > 센터상품속성(광역일배)
 # Author			: jangjaehyun
 # Since			: 25.07.04
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsSkuDcSetSTODetail from '@/components/ms/skuDcSetSTO/MsSkuDcSetSTODetail';
import MsSkuDcSetSTOSearch from '@/components/ms/skuDcSetSTO/MsSkuDcSetSTOSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsSkuDcSetSTO';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

const MsSkuDcSetSTO = () => {
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

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		multiToDcCode: null,
		skuName: '',
		skuCode: '',
		delYn: 'N',
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

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

	const location = useLocation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		setCurrentPageSrc(1);
		setTotalPages(1);

		//상세 영역 초기화
		setGridData([]);

		// 조회 조건 설정
		const tt = currentPageSrc - 1;
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCnt(res.data.totalCount);
			} else {
				setTotalCnt(0);
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
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			gridRef.current.appendData(res.data.list);
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
	 * 팝업에서 바로가기 했을때 실행
	 */
	useEffect(() => {
		if (location.state.Master !== undefined && location.state.Master !== '') {
			// Master 파라미터가 있을 경우 해당 값으로 검색
			form.setFieldsValue({ MasterCode: location.state.Master });
			searchMasterList();
		}
	}, [location]);

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
				<MsSkuDcSetSTOSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsSkuDcSetSTODetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				currentPage={currentPageSrc}
				setCurrentPage={setCurrentPageSrc}
				callBackFn={searchMasterListRun}
				form={form}
			/>
		</>
	);
};
export default MsSkuDcSetSTO;
