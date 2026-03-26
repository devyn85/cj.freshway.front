import axios from '@/api/Axios';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

/**
 * 거래처 목록 조회
 * @param {any} params 거래처 검색 조건
 * @returns {object} 거래처 목록
 */
const apiGetCmCustList = (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getCustList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, expandedColumns, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect, expandedColumns를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};
/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 거래처(협력사) info(단건) 정보
 */
const apiGetPartnerInfoPopup = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPartnerInfoPopup', { params }).then(res => res.data);
};
/**
 * 검색어를 폼에 적용하는 공통 유틸
 * - searchName이 비어있으면 name/multiSelect를 초기화
 * - searchName에 쉼표가 포함되고 multipleRows 모드이면 multiSelect에 전체값을 넣고
 * onChangeMultiSelect를 호출하여 내부 카운팅 로직을 트리거
 * - 일반 케이스는 name 필드에 검색어를 넣고 multiSelect에는 괄호 표기치환을 적용
 * - setTimeout으로 multiSelect를 초기화하는 기존 동작을 유지
 * @param {object} form Antd form 인스턴스
 * @param {string} name 폼에서 검색어를 담는 필드명
 * @param {string} searchName 부모로부터 전달된 검색어
 * @param {string} selectionMode 선택 모드
 * @param {Function} onChangeMultiSelect multiSelect 변경 핸들러 (컴포넌트 내부 함수)
 */
const applySearchNameToFormImp = (
	form: any,
	name: string,
	searchName: string,
	selectionMode: string,
	onChangeMultiSelect?: (e: any) => void,
) => {
	try {
		if (!searchName) {
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', '');
			return false;
		} else if (searchName.includes(',') && selectionMode === 'multipleRows') {
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', searchName);
			if (typeof onChangeMultiSelect === 'function') {
				onChangeMultiSelect({ target: { value: searchName } });
			}
			return true;
		} else {
			form.setFieldValue(name, searchName);
			form.setFieldValue('multiSelect', searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
			setTimeout(() => {
				form.setFieldValue('multiSelect', '');
			});
			return true;
		}
	} catch (err) {
		return false;
	}
};

/**
 * 선택 행을 부모로 전달하고 폼 초기화하는 공통 유틸
 * - 그리드에서 선택된 행을 가져와 callBack에 전달
 * - 처리 후 form.resetFields() 호출
 * @param {object} gridRef AUIGrid ref
 * @param {Function} callBack 선택된 행을 받을 콜백
 * @param {object} [form] Antd form 인스턴스
 * @returns {{ok:boolean, rows?: any[]}}
 */
const selectRowDataImp = (gridRef: any, callBack?: (rows: any[]) => void, form?: any) => {
	try {
		const selectedRow = gridRef?.current?.getSelectedRows?.() ?? [];
		if (typeof callBack === 'function') callBack(selectedRow);
		if (form && typeof form.resetFields === 'function') form.resetFields();
		return { ok: true, rows: selectedRow };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * AUIGrid 셀 더블클릭 이벤트 바인딩 공통 유틸
 * - gridRef.current.bind('cellDoubleClick', ...)를 호출하여 더블클릭 시 콜백 실행
 * @param {object} gridRef AUIGrid ref
 * @param {Function} callback 더블클릭 시 실행할 함수
 * @returns {{ok:boolean}}
 */
const bindInitImp = (gridRef: any, callback?: () => void) => {
	try {
		if (gridRef?.current?.bind && typeof callback === 'function') {
			gridRef.current.bind('cellDoubleClick', () => {
				callback();
			});
		}
		return { ok: true };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 검색 버튼 클릭 처리 공통 유틸
 * - currentPage를 1로 초기화
 * - 그리드 데이터 클리어
 * - 검색 함수 호출 (name/multiSelect 폼 값 전달)
 * @param {Function} setCurrentPage 페이지 설정 함수
 * @param {object} gridRef AUIGrid ref
 * @param {object} form Antd form 인스턴스
 * @param {string} name 폼 필드명
 * @param {Function} search 검색 함수 (isInit, name, multiSelect)
 * @param allFormValues
 * @returns {{ok:boolean}}
 */
const onClickSearchButtonImp = (
	setCurrentPage: (page: number) => void,
	gridRef: any,
	form: any,
	name: string,
	search?: (isInit: boolean, nameVal: string, multiVal: string, allFormValues?: any) => void,
	allFormValues?: any,
) => {
	try {
		if (typeof setCurrentPage === 'function') setCurrentPage(1);
		if (gridRef?.current?.clearGridData) gridRef.current.clearGridData();
		if (typeof search === 'function') {
			const nameVal = form?.getFieldValue?.(name) ?? '';
			const multiVal = form?.getFieldValue?.('multiSelect') ?? '';
			// If allFormValues is provided, pass it as an additional argument
			if (allFormValues !== undefined) {
				search(true, nameVal, multiVal, allFormValues);
			} else {
				search(true, nameVal, multiVal);
			}
		}
		return { ok: true };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 그리드 데이터 추가 및 칼럼 사이징 공통 유틸
 * - gridData가 있으면 그리드에 데이터 추가
 * - 자동 칼럼 넓이 계산 후 적용
 * - gridData가 없으면 그리드 데이터 초기화
 * @param {object} gridRef AUIGrid ref
 * @param {Array} gridData 추가할 데이터 배열
 * @returns {{ok:boolean}}
 */
const appendGridDataImp = (gridRef: any, gridData?: any[]) => {
	try {
		if (gridData && gridData.length > 0) {
			if (gridRef?.current?.appendData) {
				gridRef.current.appendData(gridData);
			}
			const colSizeList = gridRef?.current?.getFitColumnSizeList?.(true);
			if (colSizeList && gridRef?.current?.setColumnSizeList) {
				gridRef.current.setColumnSizeList(colSizeList);
			}
		} else {
			if (gridRef?.current?.setGridData) {
				gridRef.current.setGridData([]);
			}
		}
		return { ok: true };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 거래처 팝업 목록 조회 API
 * @param {object} params 조회 param
 * @returns {object} 거래처 목록
 */
const apiGetCustPopupList = async (params: any) => {
	// LIKE 검색 적용 대상: search, 본점고객코드/명, 판매처코드/명, 관리처코드/명
	if (!processMultiSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getCustPopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

const apiGetCmDriverList = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getDriverList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

const apiGetCarPopList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCarPopList', { params }).then(res => res.data);
};

const apiGetCmCarList = (params: any) => {
	return axios
		.post('/api/cm/search60/v1.0/getCarList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 차량+권역 조회
 * @param params 조회 param
 * @returns {object} 차량+권역 목록
 */
const apiGetCarAreaList = (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getCarAreaList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 센터 조회
 * @param params 조회 param
 * @returns {object} 센터 목록
 */
const apiGetDcList = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getDcList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

const apiGetCmCostCenterList = (params: any) => {
	return axios.get('/api/cm/search60/v1.0/getCostCenterList', { params }).then(res => res.data);
};
/**
 * box 목록 조회
 * @param {any} params box 검색 조건
 * @returns {object} box 목록
 */
const apiGetBoxList = (params: any) => {
	if (!processMultiSearchCondition(params)) {
		return false;
	}

	return axios.get('/api/cm/search/v1.0/getBoxList', { params }).then(res => res.data);
};

/**
 * SKU 정보 조회 API
 * @param {object} params 조회 param
 * @returns {object} 거래처 목록
 */
const apiGetSkuInfoPopup = async (params: any) => {
	return axios.get('/api/cm/search/v1.0/getSkuInfoPopup', { params }).then(res => res.data);
};

/**
 * 상품 코드 조회
 * @param {any} params 상품 코드 검색 조건
 * @returns {object} 상품 목록
 */
const apiGetSkuList = (params: any): any => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getSkuList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 귀속 부서 목록 조회
 * @param {any} params 귀속 부서 검색 조건
 * @returns {object} 귀속 부서 목록
 */
const apiGetCostCenterList = (params: any) => {
	if (!processMultiSearchCondition(params)) {
		return false;
	}

	return axios.get('/api/cm/search/v1.0/getCostCenterList', { params }).then(res => res.data);
};

/**
 * 본점 목록 조회
 * @param {any} params 본점 검색 조건
 * @returns {object} 본점 목록
 */
const apiGetCmCustBrandList = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search60/v1.0/getCustBrandList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * Location 목록 조회
 * @param {any} params Location 검색 조건
 * @returns {object} Location 목록
 */
const apiGetCmLocationList = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getLocationPopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 배송권역 목록 조회
 * @param {any} params 배송권역 검색 조건
 * @returns {object} 배송권역 목록
 */
const apiGetCmDistrictList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getDistrictPopupList', { params }).then(res => res.data);
};
/**
 * 소분류 목록 조회
 * @param {any} params 소분류 검색 조건
 * @returns {object} 소분류 목록
 */
const apiGetSkuGroup1List = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getSkuGroup1PopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 상품그룹2 목록 조회
 * @param {any} params 상품그룹2 검색 조건
 * @returns {object} 상품그룹2 목록
 */
const apiGetCmSkuGroup2List = (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getNewSkuGroup2List', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 상품상세 정보
 */
const apiGetSkuPopup = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getSkuPopup', { params }).then(res => res.data);
};
/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 거래처 info(단건) 정보
 */
const apiGetCustInfoPopup = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCustInfoPopup', { params }).then(res => res.data);
};
/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 차량 info(단건) 정보
 */
const apiGetCarInfoPopup = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCarInfoPopup', { params }).then(res => res.data);
};
/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 차량번호로 기사전화 (단건) 정보 조회.
 */
const apiGetDriverPhoneByCarNo = (params: any) => {
	return axios
		.post('/api/cm/search60/v1.0/getCarDriverPhoneInfo', params, {
			params,
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(res => res.data);
};
/**
 *
 * @param {any} params 검색 조건
 * @returns {object} KIT상품상세 정보
 */
const apiGetKitSkuList = (params: any) => {
	return axios.get('/api/ms/kit/v1.0/getKitSkuList', { params }).then(res => res.data);
};

/**
 * 창고 목록 조회
 * @param {any} params 창고 검색 조건
 * @returns {object} 창고 목록
 */
const apiGetOrganizePopupList = async (params: any) => {
	if (!processSearchCondition(params, 4, '스페이스가 포함된 검색어 3개 이상 조회할 수 없습니다.')) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getOrganizePopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * @param {any} params 협력사 검색 조건 (다중선택o)
 * @returns {object} 협력사 목록
 */
const apiGetPartnerList = async (params: any) => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getPartnerList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * @param {any} params 협력사 검색 조건 (다중선택x)
 * @returns {object} 협력사 단건
 */
const apiGetPartner = async (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPartner', { params }).then(res => res.data);
};

/**
 * 단일 필드 검색 요건 처리 공통 유틸
 * - 기본 코드/명 기준으로 스페이스 분리 개수 검사
 * - 정규식 이스케이프 처리
 * - Enter 키 검색 여부 설정
 * - %로 시작/끝나는 고정 검색 여부 판단
 * @param {any} params API params 객체
 * @param {number} [maxSpaceCount] 허용되는 최대 스페이스 개수(기본 5개 이상 불가)
 * @param {string} [alertMsg] 스페이스 초과 시 경고 메시지
 * @returns {boolean} 검사 통과 시 true, 실패 시 false (후속 처리 중단)
 */
const processSearchCondition = (
	params: any,
	maxSpaceCount = 6,
	alertMsg = '스페이스가 포함된 검색어 5개 이상 조회할 수 없습니다.',
): boolean => {
	const codeName = commUtil.nvl(params.name, '');
	// const arrCodeName = codeName.split(' ');

	// if (arrCodeName.length >= maxSpaceCount && params?.isEnter !== 'Y') {
	// 	showAlert('', alertMsg);
	// 	return false;
	// }

	params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.isEnter = params.isEnter ?? 'N'; // NOSONAR -> Enter키로 검색 여부
	params.fixedSearchYn =
		(codeName.startsWith('%') && !codeName.substring(1).includes('%')) ||
		(codeName.endsWith('%') && !codeName.substring(0, codeName.length - 1).includes('%'))
			? 'Y'
			: '';

	return true;
};

/**
 * 다중 필드 검색 요건 처리 공통 유틸
 * - 4개의 검색 필드(name, dlvSearchVal, saleCustSearchVal, childCustSearchVal) 각각에 대해
 *   스페이스 분리 개수 검사, 정규식 이스케이프 처리, 고정 검색 여부 판단
 * @param {any} params API params 객체
 * @param {number} [maxSpaceCount] 허용되는 최대 스페이스 개수(기본 5개 이상 불가)
 * @param {string} [alertMsg] 스페이스 초과 시 경고 메시지
 * @returns {boolean} 검사 통과 시 true, 실패 시 false (후속 처리 중단)
 */
const processMultiSearchCondition = (
	params: any,
	maxSpaceCount = 6,
	alertMsg = '스페이스가 포함된 검색어 5개 이상 조회할 수 없습니다.',
) => {
	const codeName = commUtil.nvl(params.name, ''); // 기본 코드/명
	const codeNameDlv = commUtil.nvl(params.dlvSearchVal, ''); // 본점 고객코드/명
	const codeNameSale = commUtil.nvl(params.saleCustSearchVal, ''); // 판매처 고객코드/명
	const codeNameChild = commUtil.nvl(params.childCustSearchVal, ''); // 관리처 고객코드/명

	// const arrCodeName = codeName.split(' '); // 기본 코드/명
	// const arrCodeNameDlv = codeNameDlv.split(' '); // 본점 고객코드/명
	// const arrCodeNameSale = codeNameSale.split(' '); // 판매처 고객코드/명
	// const arrCodeNameChild = codeNameChild.split(' '); // 관리처 고객코드/명

	// if (
	// 	arrCodeName.length >= maxSpaceCount ||
	// 	arrCodeNameDlv.length >= maxSpaceCount ||
	// 	arrCodeNameSale.length >= maxSpaceCount ||
	// 	arrCodeNameChild.length >= maxSpaceCount
	// ) {
	// 	showAlert('', alertMsg);
	// 	return false;
	// }

	params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordRegexpDlv = codeNameDlv.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordRegexpSale = codeNameSale.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordRegexpChild = codeNameChild.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리

	params.isEnter = params.isEnter ?? 'N'; // NOSONAR -> Enter키로 검색 여부

	params.fixedSearchYn =
		(codeName.startsWith('%') && !codeName.substring(1).includes('%')) ||
		(codeName.endsWith('%') && !codeName.substring(0, codeName.length - 1).includes('%'))
			? 'Y'
			: '';
	params.fixedSearchYnDlv =
		(codeNameDlv.startsWith('%') && !codeNameDlv.substring(1).includes('%')) ||
		(codeNameDlv.endsWith('%') && !codeNameDlv.substring(0, codeNameDlv.length - 1).includes('%'))
			? 'Y'
			: '';
	params.fixedSearchYnSale =
		(codeNameSale.startsWith('%') && !codeNameSale.substring(1).includes('%')) ||
		(codeNameSale.endsWith('%') && !codeNameSale.substring(0, codeNameSale.length - 1).includes('%'))
			? 'Y'
			: '';
	params.fixedSearchYnChild =
		(codeNameChild.startsWith('%') && !codeNameChild.substring(1).includes('%')) ||
		(codeNameChild.endsWith('%') && !codeNameChild.substring(0, codeNameChild.length - 1).includes('%'))
			? 'Y'
			: '';

	return true;
};

/**
 * 공통 > 팝업 > 운송사 목록 조회
 * @param {any} params 운송사 검색 조건
 * @returns {object} 운송사 목록
 */
const apiGetCarrierList = async (params: any) => {
	if (!processSearchCondition(params, 4, '스페이스가 포함된 검색어 3개 이상 조회할 수 없습니다.')) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getCarrierList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 공통 > 그리드 > 운송사 목록 조회
 * @param {any} params 운송사 검색 조건
 * @returns {object} 운송사 목록
 */
const apiGetCarrierDropList = async (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getCarrierDropList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 공통 > 팝업 > Supplier 목록 조회
 * @param {any} params Supplier 검색 조건
 * @returns {object} Supplier 목록
 */
const apiGetSupplierList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getSupplierList', { params }).then(res => res.data);
};

/**
 * 공통 > 팝업 > PAYMENT TERM  목록 조회
 * @param {any} params PAYMENT TERM  검색 조건
 * @returns {object} PAYMENT TERM  목록
 */
const apiGetPaymentTermList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPaymentTermList', { params }).then(res => res.data);
};

/**
 * 공통 > 팝업 > Tax Type  목록 조회
 * @param {any} params Tax Type  검색 조건
 * @returns {object} Tax Type  목록
 */
const apiGetTaxTypeList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getTaxTypeList', { params }).then(res => res.data);
};

/**
 * 공통 > 팝업 > 코스트코드  목록 조회
 * @param {any} params 코스트코드  검색 조건
 * @returns {object} 코스트코드  목록
 */
const apiGetCostCodeList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCostCodeList', { params }).then(res => res.data);
};

/**
 * 관리처 팝업 목록 조회 API
 * @param {object} params 조회 param
 * @returns {object} 거래처 목록
 */
const apiGetMngPlcPopupList = async (params: any) => {
	return axios.get('/api/cm/search/v1.0/getMngPlcPopupList', { params }).then(res => res.data);
};

/**
 * 팝업 > 유저 목록 검색 조회
 * @param {any} params 검색 조건
 * @returns {object} 유저 목록
 */
const apiGetUserPopupList = (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getUserList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params, // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 팝업 > 유저 목록 검색 조회
 * @param {any} params 검색 조건
 * @returns {object} 유저 목록
 */
const apiGetAllUserPopupList = (params: any) => {
	return axios
		.post('/api/cm/search/v1.0/getAllUserList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params, // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * 팝업 > TC센터 목록 검색 조회
 * @param {any} params 검색 조건
 * @returns {object} 유저 목록
 */
const apiGetTcCodeCfgList = (params: any) => {
	return axios.get('/api/ms/tcCodeCfg/v1.0/getTcCodeCfgList', { params }).then(res => res.data);
};

/**
 *
 * @param {any} params 검색 조건
 * @returns {object} 추천실착지 정보
 */
const apiGetTruthcustkeyList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/getTruthcustkeyList', params).then(res => res.data);
};

/**
 * 팝업 > 배송이슈 사진 파일 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송이슈 사진 파일 목록
 */
const apiPostIssuePictureList = (params: any) => {
	return axios
		.post('/api/cm/issuepicturepopup/v1.0/getMasterList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 공통 > 팝업 > 원거리유형 목록 조회
 * @param {any} params 원거리유형 검색 조건
 * @returns {object} 원거리유형 목록
 */
const apiPostDistanceTypeList = async (params: any) => {
	if (!processSearchCondition(params, 4, '스페이스가 포함된 검색어 3개 이상 조회할 수 없습니다.')) {
		return false;
	}

	return axios
		.post('/api/cm/search/v1.0/getDistanceTypeList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

/**
 * =====================================================================
 *	공통 검색 유틸리티 함수들
 * =====================================================================
 */

/**
 * 드롭다운 설정 생성
 * @param form
 * @param name
 * @param code
 * @param returnValueFormat
 * @param callBack
 */
const createDropdownConfig = (form: any, name: string, code: string, returnValueFormat?: string, callBack?: any) => {
	return {
		form,
		name,
		code,
		returnValueFormat,
		columns: [
			{ key: code, title: '코드', className: 'text-center' },
			{ key: name.replace('Name', ''), title: '명', className: 'text-left' },
		],
		callBack: callBack,
	};
};

/**
 * 검색 버튼 클릭 처리
 * @param param
 * @param event
 * @param source
 * @param setPopupList
 * @param getSearchApi
 * @param handleOpenPopup
 * @param form
 * @param code
 * @param setDropdownOpen
 * @param setDropdownData
 * @param confirmEvent
 * @param refModal
 * @param popupForm
 * @param dccode
 * @param apiFunction
 * @param extraParams
 */
const onClickSearchButton = (
	param: string,
	event: any,
	source: any,
	setPopupList: any,
	getSearchApi: any,
	handleOpenPopup: any,
	form: any,
	code: string,
	setDropdownOpen: any,
	setDropdownData: any,
	confirmEvent: any,
	refModal: any,
	popupForm: any,
	apiFunction: any,
	extraParams: any = {},
) => {
	// commUtil.isNotEmpty(form.getFieldValue(code)) 조건 추가 => 이미 선택된 code 값 있을 경우 팝업에 해당 목록 노출
	if (commUtil.isEmpty(param) || commUtil.isNotEmpty(form?.getFieldValue(code))) {
		handleOpenPopup();
		return;
	}

	// 엔터키 검색 처리
	searchEnter(
		param,
		false,
		form,
		code,
		setDropdownOpen,
		setDropdownData,
		confirmEvent,
		apiFunction,
		refModal,
		param,
		true,
		handleOpenPopup,
		extraParams,
	);
};

/**
 * 엔터키 검색 처리
 * @param param
 * @param isMultiSelect
 * @param form
 * @param code
 * @param setDropdownOpen
 * @param setDropdownData
 * @param confirmEvent
 * @param apiFunction
 * @param refModal
 * @param popupForm
 * @param dccode
 * @param value
 * @param isForceSearch
 * @param handleOpenPopup
 * @param extraParams
 */
const searchEnter = (
	param: string,
	isMultiSelect: boolean,
	form: any,
	code: string,
	setDropdownOpen: any,
	setDropdownData: any,
	confirmEvent: any,
	apiFunction: any,
	refModal: any,
	value: string,
	isForceSearch?: boolean,
	handleOpenPopup?: any,
	extraParams: any = {},
) => {
	if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) {
		return;
	}
	setDropdownOpen(false);

	const usingCarnoFilter = extraParams?.carnoList && extraParams.carnoList.length > 0;
	const nameValue = usingCarnoFilter ? value.replace(/\s*\(\d+회\)\s*/g, '') : value;
	const multiSelectValue = usingCarnoFilter ? extraParams.carnoList.join(',') : '';
	const params = {
		name: nameValue,
		multiSelect: multiSelectValue,
		startRow: 0,
		listCount: 5000,
		skipCount: true,
		// isEnter: 'Y',
		...extraParams,
	};
	if (usingCarnoFilter) delete params.carnoList; // carnoList는 클라이언트 필터링용이므로 API 요청에서 제외

	apiFunction(params).then((res: any) => {
		let resultList = res.data.list || [];
		if (usingCarnoFilter) resultList = resultList.filter((item: any) => item.code.includes(nameValue));

		if (resultList.length === 1) {
			confirmEvent(resultList);
		} else if (resultList.length > 0) {
			setDropdownData(resultList);
			setDropdownOpen(true);
		} else {
			// clear이벤트를 하지 않는 옵션이면 바로 return
			const disableOnBlurClear = extraParams?.disableOnBlurClear;
			if (disableOnBlurClear) {
				return;
			}

			handleOpenPopup();
		}
	});
};

/**
 * 선택된 데이터 설정
 * @param list
 * @param form
 * @param name
 * @param code
 * @param val
 * @param returnValueFormat
 * @param setIsDisabled
 */
// settingSelectData(params, form, name, code, params, returnValueFormat, setIsDisabled);
const settingSelectData = (
	val: any,
	//
	form: any,
	name: string,
	code: string,
	returnValueFormat?: any,
	setIsDisabled?: any,
) => {
	let searchName = commUtil.convertCodeWithName(val[0].code, val[0].name);
	let searchCode = val[0].code;

	for (let i = 1; i < val.length; i++) {
		searchName += `,${commUtil.convertCodeWithName(val[i].code, val[i].name)}`;
		searchCode += ',' + val[i].code;
	}

	if (returnValueFormat === 'code') {
		form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
	} else if (val.length > 1) {
		form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
	} else {
		form.setFieldsValue({ [name]: searchName, [code]: searchCode });
	}
	setIsDisabled(true);
};

/**
 * 붙여넣기(Paste) 이벤트 처리 공통 유틸
 *
 * 설명:
 * - 클립보드에 있는 텍스트를 읽어 줄바꿈을 쉼표(,)로 변환한 뒤
 *   토큰 단위로 분리합니다. 토큰은 trim 처리하고 빈 문자열은 제거합니다.
 * - 중복 토큰은 제거하며, 최대 허용 개수(`maxCount`)를 초과하면
 *   경고 메시지를 띄우고 처리를 중단합니다.
 * - 정상 처리 시 폼의 `multiSelect` 필드에 콤마로 연결된 값을 설정하고,
 *   `setMultiSelectCount`가 제공되면 카운트를 업데이트합니다.
 *
 * 파라미터:
 * @param {Event} event 붙여넣기 이벤트 (ClipboardEvent)
 * @param {object} [form] Antd `form` 인스턴스 (있으면 `form.setFieldsValue` 호출)
 * @param {Function} [setMultiSelectCount] multi-select 항목 개수를 업데이트하는 함수
 * @param {number} [maxCount] 허용되는 최대 항목 수
 * @param {Function} [t] i18n 번역 함수 (있으면 에러 메시지 번역에 사용)
 *
 * 반환값:
 * - 성공: `{ ok: true, value: string, count: number }`
 * - 실패: `{ ok: false }` (최대개수 초과 또는 예외 발생 시)
 *
 * 부작용:
 * - `event.preventDefault()`로 기본 붙여넣기 동작을 막습니다.
 * - `form`과 `setMultiSelectCount`를 통해 호출자 상태를 즉시 갱신합니다.
 *
 * 사용 예시:
 * ```js
 * // 컴포넌트 내
 * <input onPaste={(e) => handlePasteImp(e, form, setMultiSelectCount, 5000, t)} />
 * ```
 */
const handlePasteImp = (
	event: any,
	form?: any,
	setMultiSelectCount?: (n: number) => void,
	maxCount = 5000,
	t?: any,
) => {
	try {
		// 기본 붙여넣기 동작 방지
		event.preventDefault();

		const pastedText = event.clipboardData?.getData('text/plain') ?? '';
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		// 끝의 쉼표 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// "다중선택" 기존값 유지
		if (commUtil.isNotEmpty(form?.getFieldValue('multiSelect'))) {
			transformedText = `${form?.getFieldValue('multiSelect')},${transformedText}`;
		}

		// 중복 제거
		const unique = [
			...new Set(
				transformedText
					.split(',')
					.map((s: string) => s.trim())
					.filter((s: string) => s !== ''),
			),
		];

		const multiCnt = unique.length;

		if (multiCnt > maxCount) {
			showAlert(null, t ? t('msg.MSG_COM_ERR_056') : 'Too many entries');
			return { ok: false };
		}

		const value = unique.join(',');

		if (typeof setMultiSelectCount === 'function') setMultiSelectCount(multiCnt);
		if (form && typeof form.setFieldsValue === 'function') form.setFieldsValue({ multiSelect: value });

		return { ok: true, value, count: multiCnt };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 다중선택 입력 변경 처리 공통 유틸
 * - 입력값의 끝 쉼표 제거
 * - 빈값이면 카운트 0으로 설정
 * - 쉼표로 분리하여 항목 수 계산, 최대 개수 초과 시 alert
 * - 정상 처리 시 setMultiSelectCount 호출
 * @param {Event|string} e 이벤트 또는 문자열 값
 * @param {Function} setMultiSelectCount 카운트 업데이트 함수
 * @param {number} maxCount 최대 허용 건수
 * @param {Function} t i18n 번역 함수(선택)
 * @returns {{ok:boolean, count?:number}} 처리 결과
 */
const handleMultiSelectChangeImp = (e: any, setMultiSelectCount?: (n: number) => void, maxCount = 5000, t?: any) => {
	try {
		const value = typeof e === 'string' ? e : e?.target?.value ?? '';

		if (value === '') {
			if (typeof setMultiSelectCount === 'function') setMultiSelectCount(0);
			return { ok: true, count: 0 };
		}

		let v = value;
		if (v.endsWith(',')) v = v.slice(0, -1);

		const multiCnt = v.split(',').filter((s: string) => s.trim() !== '').length;

		if (multiCnt > maxCount) {
			showAlert(null, t ? t('msg.MSG_COM_ERR_056') : 'Too many entries');
			return { ok: false };
		}

		if (typeof setMultiSelectCount === 'function') setMultiSelectCount(multiCnt);
		return { ok: true, count: multiCnt };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 선택된 행 확인 처리 공통 유틸
 * - 그리드에서 체크된 행(또는 선택행)을 가져와 콜백에 전달
 * - 선택된 항목이 없으면 `close()`를 호출하고 `{ok:false}` 반환
 * - 처리 후 `form.resetFields()`를 호출하여 폼을 초기화
 * @param {object} gridRef AUIGrid 참조 객체 (ref)
 * @param {string} selectionMode 선택 모드 ('singleRow' 등)
 * @param {Function} callBack 선택된 행을 받을 콜백
 * @param {Function} close 팝업 닫기 함수 (선택 항목 없을 때 호출)
 * @param {object} [form] Antd form 인스턴스 (선택 시 resetFields 호출)
 * @returns {{ok:boolean, rows?: any[]}} 처리 결과
 */
const checkRowDataImp = (
	gridRef: any,
	selectionMode: string,
	callBack: (rows: any[]) => void,
	close: () => void,
	form?: any,
) => {
	try {
		let checkedRow = gridRef?.current?.getCheckedRowItemsAll?.() ?? [];
		if (selectionMode === 'singleRow') {
			checkedRow = gridRef?.current?.getSelectedRows?.() ?? [];
		}

		if (!checkedRow || checkedRow.length === 0) {
			if (typeof close === 'function') close();
			return { ok: false };
		}

		if (typeof callBack === 'function') callBack(checkedRow);
		if (form && typeof form.resetFields === 'function') form.resetFields();

		return { ok: true, rows: checkedRow };
	} catch (err) {
		return { ok: false };
	}
};

/**
 * 입력 시 공백 제거
 * @param e
 * @param form
 */
const handleInputChange = (e: any, form?: any) => {
	const trimmedValue = e.target.value.trim();
	form.setFieldValue('name', trimmedValue);
};

/**
 * 차붙여넣기 시 공백 제거
 * @param e
 * @param form
 */
const handlePaste = (e: any, form?: any) => {
	e.preventDefault();
	const pastedText = e.clipboardData.getData('text/plain').trim();
	form.setFieldValue('name', pastedText);
};

export {
	apiGetAllUserPopupList,
	apiGetBoxList,
	apiGetCarAreaList,
	apiGetCarInfoPopup,
	apiGetCarPopList,
	apiGetCarrierDropList,
	apiGetCarrierList,
	apiGetCmCarList,
	apiGetCmCostCenterList,
	apiGetCmCustBrandList,
	apiGetCmCustList,
	apiGetCmDistrictList,
	apiGetCmDriverList,
	apiGetCmLocationList,
	apiGetCmSkuGroup2List,
	apiGetCostCenterList,
	apiGetCostCodeList,
	apiGetCustInfoPopup,
	apiGetCustPopupList,
	apiGetDcList,
	apiGetDriverPhoneByCarNo,
	apiGetKitSkuList,
	apiGetMngPlcPopupList,
	apiGetOrganizePopupList,
	apiGetPartner,
	apiGetPartnerInfoPopup,
	apiGetPartnerList,
	apiGetPaymentTermList,
	apiGetSkuGroup1List,
	apiGetSkuInfoPopup,
	apiGetSkuList,
	apiGetSkuPopup,
	apiGetSupplierList,
	apiGetTaxTypeList,
	apiGetTcCodeCfgList,
	apiGetTruthcustkeyList,
	apiGetUserPopupList,
	apiPostDistanceTypeList,
	apiPostIssuePictureList,
	// 공통 유틸리티 함수들
	appendGridDataImp,
	applySearchNameToFormImp,
	bindInitImp,
	checkRowDataImp,
	createDropdownConfig,
	handleMultiSelectChangeImp,
	handlePasteImp,
	onClickSearchButton,
	onClickSearchButtonImp,
	processMultiSearchCondition,
	processSearchCondition,
	searchEnter,
	selectRowDataImp,
	settingSelectData,
};
