import axios from '@/api/Axios';
import commUtil from '@/util/commUtil';

/**
 * 거래처 목록 조회
 * @param {any} params 거래처 검색 조건
 * @returns {object} 거래처 목록
 */
const apiGetCmCustList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCustList', { params }).then(res => res.data);
};

/**
 * 거래처 팝업 목록 조회 API
 * @param {object} params 조회 param
 * @returns {object} 거래처 목록
 */
const apiGetCustPopupList = async (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCustPopupList', { params }).then(res => res.data);
};

const apiGetCmDriverList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getDriverList', { params }).then(res => res.data);
};

const apiGetCarPopList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCarPopList', { params }).then(res => res.data);
};

const apiGetCmCarList = (params: any) => {
	return axios.get('/api/cm/search60/v1.0/getCarList', { params }).then(res => res.data);
};

/**
 * 차량+권역 조회
 * @param params 조회 param
 * @returns {object} 차량+권역 목록
 */
const apiGetCarAreaList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCarAreaList', { params }).then(res => res.data);
};

/**
 * 센터 조회
 * @param params 조회 param
 * @returns {object} 센터 목록
 */
const apiGetDcList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getDcList', { params }).then(res => res.data);
};

const apiGetCmCostCenterList = (params: any) => {
	return axios.get('/api/cm/search60/v1.0/getCostCenterList', { params }).then(res => res.data);
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
	// START.검색요건
	const codeName = commUtil.nvl(params.name, ''); // 상품 코드

	// const arrCodeName = codeName.split(' ');
	// if (arrCodeName.length >= 4) {
	// 	showAlert('', '스페이스가 포함된 검색어 3개 이상 조회할 수 없습니다.');
	// 	return false;
	// }

	params.keywordEng = commUtil.convertEngToKor(codeName); //
	params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordEngRegexp = params.keywordEng.replace(/([\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); //	영->한 정규식
	// END.검색요건

	return axios.get('/api/cm/search/v1.0/getSkuList', { params }).then(res => res.data);
};

/**
 * 귀속 부서 목록 조회
 * @param {any} params 귀속 부서 검색 조건
 * @returns {object} 귀속 부서 목록
 */
const apiGetCostCenterList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCostCenterList', { params }).then(res => res.data);
};

/**
 * 본점 목록 조회
 * @param {any} params 본점 검색 조건
 * @returns {object} 본점 목록
 */
const apiGetCmCustBrandList = (params: any) => {
	return axios.get('/api/cm/search60/v1.0/getCustBrandList', { params }).then(res => res.data);
};

/**
 * Location 목록 조회
 * @param {any} params Location 검색 조건
 * @returns {object} Location 목록
 */
const apiGetCmLocationList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getLocationPopupList', { params }).then(res => res.data);
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
const apiGetSkuGroup1List = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getSkuGroup1PopupList', { params }).then(res => res.data);
};

const apiGetCmSkuGroup2List = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getNewSkuGroup2List', { params }).then(res => res.data);
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
const apiGetOrganizePopupList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getOrganizePopupList', { params }).then(res => res.data);
};

/**
 * @param {any} params 협력사 검색 조건
 * @returns {object} 협력사 목록
 */
const apiGetPartnerList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPartnerList', { params }).then(res => res.data);
};

/**
 * @param {any} params 협력사 검색 조건
 * @returns {object} 협력사 단건
 */
const apiGetPartner = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPartner', { params }).then(res => res.data);
};

/**
 * 공통 > 팝업 > 운송사 목록 조회
 * @param {any} params 운송사 검색 조건
 * @returns {object} 운송사 목록
 */
const apiGetCarrierList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getCarrierList', { params }).then(res => res.data);
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

export {
	apiGetCarAreaList,
	apiGetCarInfoPopup,
	apiGetCarPopList,
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
	apiGetCustInfoPopup,
	apiGetCustPopupList,
	apiGetDcList,
	apiGetKitSkuList,
	apiGetOrganizePopupList,
	apiGetPartner,
	apiGetPartnerList,
	apiGetPaymentTermList,
	apiGetSkuGroup1List,
	apiGetSkuInfoPopup,
	apiGetSkuList,
	apiGetSkuPopup,
	apiGetSupplierList,
};
