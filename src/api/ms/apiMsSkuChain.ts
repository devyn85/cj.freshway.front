import axios from '@/api/Axios';

/**
 * PLT 변환값 마스터 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} PLT 변환값 마스터 정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/skuChain/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 상품코드 유효성 체크
 * @param {any} params 검색 조건
 * @returns {object} 상품코드 유효성 체크
 */
const apiGetValidateSaveList = (params: any) => {
	return axios.post('/api/ms/skuChain/v1.0/getValidateSaveList', params).then(res => res.data);
};

/**
 * 상품 정보 MERGE
 * @param {any} params 상품 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/skuChain/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 상품 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} PLT 변환값 마스터 정보 조회(목록)
 */
const apiGetSkuInfo = (params: any) => {
	return axios.post('/api/ms/skuChain/v1.0/getSkuInfo', params).then(res => res.data);
};
export { apiGetMasterList, apiGetSkuInfo, apiGetValidateSaveList, apiPostSaveMasterList };
