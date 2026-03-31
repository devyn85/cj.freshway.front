/*
 ############################################################################
 # FiledataField	: DevPilot01.tsx
 # Description		: 센터상품속성
 # Author			    : sss
 # Since			    : 25.05.23
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import axios from '@/api/Axios';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import { useTranslation } from 'react-i18next';

// Util
import { showAlert, showConfirm } from '@/util/MessageUtil';
import Constants from '@/util/constants';

// Store

// API
import { apiGetSkuDcSetDtl, apiPostSaveMasterList } from '@/api/ms/apiMsSkuDcSet';

// Hooks
import DevPilot01Detail from '@/components/dev/pilot01/DevPilot01Detail';
import DevPilot01Search from '@/components/dev/pilot01/DevPilot01Search';
import { useThrottle } from '@/hooks/useThrottle';

const MsSkuDcSet = () => {
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

	// 총 페이지 수
	const [totalPages, setTotalPages] = useState(0);

	// 현재 페이지 번호
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSrc, setCurrentPageSrc] = useState(1);
	const [currentPageAutoSrc, setCurrentPageAutoSrc] = useState(1);

	// 페이지당 행 수
	const [pageSize, setPageSize] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	// 조회 실행 중인지 여부 (autuScroll을 위한 변수임)
	const [isLoading, setIsLoading] = useState(false);
	const isLoadingRef = useRef(false);

	// searchForm data 초기화
	const searchBox = {
		storerkey: useSelector((state: any) => state.global.globalVariable.gStorerkey),
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode),
		skuCode: '',
		custCode: '',
	};

	const [searchType] = useState(1); // 임시용 1:스크롤페이지, 2:오토스크롤, 3:버튼페이지

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 초기화 버튼 클릭
	 * @returns {void}
	 */
	const resetFn = () => {
		setCurrentPage(0);
		setTotalPages(1);
		searchForm.resetFields();
		gridRef?.current.clearGridData();
	};

	/**
	 * 조회 버튼 클릭
	 */
	const handleSearch = () => {
		setCurrentPage(1);
		setCurrentPageSrc(1);
		setCurrentPageAutoSrc(1);
		setTotalPages(1);
		gridRef?.current.clearGridData();

		search();
		//searchScroll();
	};

	/**
	 * 센터상품속성 목록 조회
	 */
	const search = () => {
		//상세 영역 초기화
		setDetailData([]);
		// 조회 실행 중 (authScroll을 위한 변수임)
		setIsLoading(true);
		// 조회 실행 중
		//setIsDisabled(true);

		// 조회 조건 설정
		const tt = 0;
		const searchParams = searchForm.getFieldsValue();
		const params = {
			dccode: searchParams.dccode,
			multiSku: searchParams.skuCode,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetSkuDcSetList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data.list);
				if (res.data.totalCount > -1) {
					setTotalCount(res.data.totalCount);
				}
				if (res.data.totalPages > -1) {
					setTotalPages(res.data.totalPages);
				}
				if (res.data.pageNum > -1) {
					if (searchType === 1) {
						setCurrentPageSrc(res.data.pageNum);
					} else if (searchType === 2) {
						setCurrentPageAutoSrc((prev: any) => prev + 1);
					} else if (searchType === 3) {
						setCurrentPage(res.data.pageNum);
					}
				}
			}
		});
	};

	/**
	 * 센터상품속성 목록 조회 및 스크롤 페이징
	 */
	const searchScroll = throttle(() => {
		//상세 영역 초기화
		setDetailData([]);

		// 조회 조건 설정
		const tt = currentPageSrc - 1;
		const searchParams = searchForm.getFieldsValue();
		const params = {
			dccode: searchParams.dccode,
			multiSku: searchParams.skuCode,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetSkuDcSetList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data.list);
				if (res.data.totalCount > -1) {
					setTotalCount(res.data.totalCount);
				}
				if (res.data.totalPages > -1) {
					setTotalPages(res.data.totalPages);
				}
				if (res.data.pageNum > -1) {
					setCurrentPageSrc(res.data.pageNum);
				}
			}
		});
	}, 500);

	const apiGetSkuDcSetList = (params: any) => {
		//return axios.get('/api/ms/skudcset/v1.0/getSkuDcSetList', { params }).then(res => res.data);

		return axios
			.post('/api/ms/skudcset/v1.0/getSkuDcSetList', null, {
				headers: {
					'Content-Type': 'application/json',
				},
				//params: JSON.stringify(params),
				params: params,
			})
			.then(res => res.data);
	};

	/**
	 * 센터상품속성 목록 조회 및 스크롤 페이징
	 */
	const searchAutoScroll = async () => {
		if (isLoadingRef.current) {
			return;
		}
		isLoadingRef.current = true;

		if (currentPageAutoSrc <= totalPages) {
			// 조회 조건 설정
			const tt = currentPageAutoSrc - 1;
			const searchParams = searchForm.getFieldsValue();
			const params = {
				dccode: searchParams.dccode,
				multiSku: searchParams.skuCode,
				startRow: 0 + tt * pageSize,
				listCount: pageSize,
			};

			// API 호출
			try {
				const res = await apiGetSkuDcSetList(params);

				setGridData(res.data.list);
				if (res.data.totalCount > -1) {
					setTotalCount(res.data.totalCount);
				}
				if (res.data.totalPages > -1) {
					setTotalPages(res.data.totalPages);
				}
				if (res.data.pageNum > -1) {
					setCurrentPageAutoSrc((prev: any) => prev + 1);
				}
			} finally {
				isLoadingRef.current = false;
			}
		} else {
			setCurrentPageAutoSrc(0);
			isLoadingRef.current = false;
			setIsLoading(false);
		}
	};

	/**
	 * 센터상품속성 목록 조회 및 버튼 페이징
	 * @param page
	 * @deprecated
	 */
	const searchButtonPage = (page: any) => {
		if (currentPage <= 0) return;

		setDetailData([]);

		// 조회 조건 설정
		const tt = page - 1;
		const searchParams = searchForm.getFieldsValue();
		const params = {
			dccode: searchParams.dccode,
			multiSku: searchParams.skuCode,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetSkuDcSetList(params).then(res => {
			setGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
			if (res.data.totalPages > -1) {
				setTotalPages(res.data.totalPages);
			}
			if (res.data.pageNum > -1) {
				setCurrentPage(res.data.pageNum);
			}
		});
	};

	/**
	 * 센터상품속성 단건 조회 및 상세 영역 데이터 설정
	 * @param {any} row 행
	 */
	const searchDtl = (row: any) => {
		if (row) {
			const params = {
				storerkey: row.storerkey,
				dccode: row.dccode,
				sku: row.sku,
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
	 * @param {any} params 저장할 파라미터
	 */
	const saveGrid = (params: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMasterList(params).then(() => {
				// showAlert(null, t('msg.MSG_COM_SUC_003'), searchScroll);
				showAlert(null, t('msg.MSG_COM_SUC_003'));
				searchScroll();
			});
		});
	};

	/**
	 * 센터상품속성 단건 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} params 저장할 파라미터
	 */
	const saveDetailInfo = (params: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMasterList(params).then(() => {
				// showAlert(null, t('msg.MSG_COM_SUC_003'), searchDtl(params[0]));
				showAlert(null, t('msg.MSG_COM_SUC_003'));
				searchDtl(params[0]);
				//그리드 재 조회는?
			});
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		reset: resetFn, // 초기화
		searchYn: handleSearch, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, []);

	/**
	 * currentPageSrc 변경되면 조회 실행
	 */
	useEffect(() => {
		if (currentPageSrc > 1) {
			searchScroll();
		}
	}, [currentPageSrc]);

	/**
	 * currentPageAutoSrc 변경되면 조회 실행
	 */
	useEffect(() => {
		if (currentPageAutoSrc > 1) {
			searchAutoScroll();
		}
	}, [currentPageAutoSrc]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchForm form={searchForm} initialValues={searchBox}>
				<DevPilot01Search form={searchForm} />
			</SearchForm>

			<DevPilot01Detail
				ref={gridRef}
				data={gridData}
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

export default MsSkuDcSet;
