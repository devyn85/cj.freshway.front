/*
 ############################################################################
 # FiledataField	: MsSku.tsx
 # Description		: 기준정보 > 상품기준정보 > 상품정보
 # Author			: jangjaehyun
 # Since			: 25.06.11
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsSkuDetail from '@/components/ms/sku/MsSkuDetail';
import MsSkuSearch from '@/components/ms/sku/MsSkuSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsSku';

// Hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { useThrottle } from '@/hooks/useThrottle';

const MsSku = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		partnerName: null,
		partnerCode: null,
		skuName: null,
		skuCode: null,
		storageType: null,
		skuType: null,
		somdCode: null,
		statusSku: null,
		serialYn: null,
		delYn: 'N',
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

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
		if (detailForm.getFieldValue('rowStatus') === 'U' || gridRef.current.getChangedData().length > 0) {
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

		//상세 영역 초기화
		setGridData([]);
		detailForm.resetFields();
		setCurrentPageSrc(1);

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
			startRow: 0,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCnt(res.data.totalCount);
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
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			gridRef.current.setColumnSizeList(colSizeList);
			// if (res.data.pageNum > -1) {
			// 	setCurrentPageSrc(res.data.pageNum);
			// }
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
		if (location.state.sku !== undefined && location.state.sku !== '') {
			form.setFieldsValue({
				skuCode: location.state.sku,
				skuName: `[${location.state.sku}]${location.state.skuDescr}`,
			});
			searchMasterList();
		}
	}, [location]);

	useScrollPagingAUIGrid({
		gridRef: gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPageSrc((currentPageSrc: any) => currentPageSrc + 1);
		},
		totalCount: totalCnt,
	});

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
				<MsSkuSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsSkuDetail
				ref={gridRef}
				detailForm={detailForm}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMasterList}
			/>
		</>
	);
};
export default MsSku;
