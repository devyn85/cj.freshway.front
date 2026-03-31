/*
 ############################################################################
 # FiledataField	: PagingDetailSample.tsx
 # Description		: 페이징 및 상세영역
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import PagingDetailSampleDetail from '@/components/comfunc/sample/pagingDetail/PagingDetailSampleDetail';
import PagingDetailSampleSearch from '@/components/comfunc/sample/pagingDetail/PagingDetailSampleSearch';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { useTranslation } from 'react-i18next';

// Util
import Constants from '@/util/constants';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Store

// API
import { apiGetMasterList, apiGetSkuDcSetDtl, apiPostSaveMasterList } from '@/api/ms/apiMsSkuDcSet';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

const PagingDetailSample = () => {
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
	const gridRef = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 상세 데이터
	const [detailData, setDetailData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 현재 페이지 번호
	const [currentPageSrc, setCurrentPageSrc] = useState(1);

	// 페이지당 행 수
	const [pageSize] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	// searchForm data 초기화
	const [searchBox] = useState({
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode),
		skuCode: '',
		custCode: '',
	});

	// 조회조건 저장
	const searchParamsRef = useRef();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 초기화 버튼 클릭
	 * @returns {void}
	 */
	const reset = () => {
		setTotalCount(0);
		searchForm.resetFields();
		gridRef?.current.clearGridData();
		setDetailData([]);
	};

	/**
	 * 조회 버튼 클릭
	 */
	const handleSearch = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 초기화
		setCurrentPageSrc(1);
		gridRef?.current.clearGridData();

		// 조회 조건 저장
		searchParamsRef.current = searchForm.getFieldsValue();
		if (searchParamsRef.current) {
			searchParamsRef.current.sku = searchParamsRef.current.skuCode ?? '';
		}

		// 조회
		searchScroll(1);
	};

	/**
	 * 목록 조회 ( 페이징 )
	 * @param {number} pageNo 페이지번호
	 */
	const searchScroll = throttle((pageNo: number) => {
		// 조회 조건 설정
		const tt = pageNo || currentPageSrc;
		const params = {
			...(searchParamsRef.current ?? {}),
			startRow: 0 + (tt - 1) * pageSize,
			listCount: pageSize,
		};

		//상세 영역 초기화
		setDetailData([]);

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
			if (res.data.pageNum > -1) {
				setCurrentPageSrc(res.data.pageNum);
			}
		});
	}, 500);

	/**
	 * 센터상품속성 단건 조회 및 상세 영역 데이터 설정
	 * @param {any} rowItem 행
	 */
	const searchDtl = (rowItem: any) => {
		if (rowItem) {
			const params = {
				storerkey: rowItem.storerkey,
				dccode: rowItem.dccode,
				sku: rowItem.sku,
			};

			apiGetSkuDcSetDtl(params).then((res: any) => {
				if (res?.data) {
					// 상세 조회시 rowStatus를 'R'로 설정
					res.data.rowStatus = 'R';
					res.data.skuName = '[' + res.data.sku + ']' + res.data.skuDescr;
					setDetailData(res.data);
				}
			});
		}
	};

	/**
	 * 센터상품속성 그리드에서 변경한 정보를 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveGrid = (rowItems: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				saveList: rowItems,
			};

			apiPostSaveMasterList(params).then(() => {
				showAlert(null, t('msg.MSG_COM_SUC_003'));
				searchScroll();
			});
		});
	};

	/**
	 * 센터상품속성 단건 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveDetailInfo = (rowItems: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				saveList: rowItems,
			};

			apiPostSaveMasterList(params).then(() => {
				showAlert(null, t('msg.MSG_COM_SUC_003'));
				searchDtl(rowItems[0]);
				//그리드 재 조회는?
			});
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		reset: reset, // 초기화
		searchYn: handleSearch, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * currentPageSrc 변경되면 조회 실행 -> 페이지 번호의 변경(스크롤)으로 인한 조회
	 */
	useEffect(() => {
		if (currentPageSrc > 1) {
			searchScroll();
		}
	}, [currentPageSrc]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<PagingDetailSampleSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 - 스크롤 페이징*/}
			<PagingDetailSampleDetail
				ref={gridRef}
				gridData={gridData}
				totalCount={totalCount}
				setCurrentPage={setCurrentPageSrc}
				searchDtl={searchDtl}
				detailData={detailData}
				saveGrid={saveGrid}
				saveDetailInfo={saveDetailInfo}
			/>
		</>
	);
};

export default PagingDetailSample;
