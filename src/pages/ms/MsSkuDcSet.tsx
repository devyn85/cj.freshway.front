/*
 ############################################################################
 # FiledataField	: MsSkuDcSet.tsx
 # Description		: 센터상품속성
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsSkuDcSetDetail from '@/components/ms/skudcset/MsSkuDcSetDetail';
import MsSkuDcSetSearch from '@/components/ms/skudcset/MsSkuDcSetSearch';
import { useTranslation } from 'react-i18next';

// Util
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';
import { showConfirm, showMessage } from '@/util/MessageUtil';

// Store

// API
import { apiGetMasterList, apiGetSkuDcSetDtl, apiPostSaveMasterList } from '@/api/ms/apiMsSkuDcSet';

// Hooks
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
	const [detailForm] = Form.useForm();

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

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
		fixdccode: useSelector((state: any) => state.global.globalVariable.gDccode),
		sku: '',
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
	const reset = () => {
		setCurrentPage(0);
		setTotalPages(1);
		setTotalCount(0);
		searchForm.resetFields();
		refs.gridRef?.current.clearGridData();
		setDetailData([]);
	};

	/**
	 * 조회 버튼 클릭
	 */
	const onSearch = async () => {
		// 신규 데이터 확인
		if (detailForm.getFieldValue('rowStatus') === 'I') {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) {
				return;
			}
		}

		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		if (refs.gridRef.current.getCheckedRowItems().length > 0 && refs.gridRef.current.getChangedData().length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) {
				return;
			}

			setCurrentPage(1);
			setCurrentPageSrc(1);
			setCurrentPageAutoSrc(1);
			setTotalPages(1);
			refs.gridRef?.current.clearGridData();

			search();
		} else {
			setCurrentPage(1);
			setCurrentPageSrc(1);
			setCurrentPageAutoSrc(1);
			setTotalPages(1);
			refs.gridRef?.current.clearGridData();

			search();
		}
	};

	/**
	 * 센터상품속성 목록 조회
	 */
	const search = () => {
		//상세 영역 초기화
		setDetailData([]);
		// 조회 실행 중 (authScroll을 위한 변수임)
		setIsLoading(true);

		// 조회 조건 설정
		const tt = 0;
		const searchParams = searchForm.getFieldsValue();
		const params = {
			fixdccode: searchParams.fixdccode,
			sku: searchParams.sku,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
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
			fixdccode: searchParams.fixdccode,
			sku: searchParams.sku,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
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
		});
	}, 500);

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
				fixdccode: searchParams.fixdccode,
				sku: searchParams.sku,
				startRow: 0 + tt * pageSize,
				listCount: pageSize,
			};

			// API 호출
			try {
				const res = await apiGetMasterList(params);

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
			fixdccode: searchParams.fixdccode,
			sku: searchParams.sku,
			startRow: 0 + tt * pageSize,
			listCount: pageSize,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
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

					const gridData = refs.gridRef.current.getGridData();
					const currentItem = gridData.filter((v: any) => v.dccode === res.data.dccode && v.sku === res.data.sku);
					const selectedRowIndex = refs.gridRef.current.getRowIndexesByValue('sku', [res.data.sku]);

					if (commUtil.isEmpty(currentItem[0].rowStatus) || currentItem[0].rowStatus === 'R') {
						refs.gridRef.current.updateRow(res.data, selectedRowIndex);
					}
				}
			});
		}
	};

	/**
	 * 센터상품속성 그리드에서 변경한 정보를 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveMasterList = (rowItems: any) => {
		refs.gridRef.current.showConfirmSave(() => {
			const params = {
				saveList: rowItems.map((item: any) => item.item),
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.data.statusCode === 0) {
					refs.gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
						refs.gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					refs.gridRef.current.setAllCheckedRows(false);
					refs.gridRef.current.resetUpdatedItems();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 센터상품속성 단건 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveMaster = (rowItems: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				saveList: rowItems,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});

					setCurrentPage(1);
					setCurrentPageSrc(1);
					setCurrentPageAutoSrc(1);
					setTotalPages(1);
					refs.gridRef?.current.clearGridData();

					search();
					//searchDtl(rowItems[0]);
				}
			});
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		reset: reset, // 초기화
		searchYn: onSearch, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
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
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<MsSkuDcSetSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 - 스크롤 페이징*/}
			<MsSkuDcSetDetail
				ref={refs}
				searchForm={searchForm}
				form={detailForm}
				gridData={gridData}
				totalCount={totalCount}
				setCurrentPage={setCurrentPageSrc}
				searchDtl={searchDtl}
				detailData={detailData}
				saveMasterList={saveMasterList}
				saveMaster={saveMaster}
			/>

			{/* 상세 영역 정의 - 오토 페이징  
			{searchType === 2 && (
				<MsSkuDcSetDetailAutoPaging
					ref={refs}
					data={gridData}
					totalCount={totalCount}
					searchDtl={searchDtl}
					detailData={detailData}
					saveMasterList={saveMasterList}
					saveMaster={saveMaster}
					isLoading={isLoading}
				/>
			)}
			*/}

			{/* 상세 영역 정의 - 버튼 페이징 
			{searchType === 3 && (
				<MsSkuDcSetDetailButtonPaging
					ref={refs}
					data={gridData}
					totalCount={totalCount}
					currentPage={currentPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					search={searchButtonPage}
					searchDtl={searchDtl}
					detailData={detailData}
					saveMasterList={saveMasterList}
					saveMaster={saveMaster}
				/>
			)}
			*/}
		</>
	);
};

export default MsSkuDcSet;
