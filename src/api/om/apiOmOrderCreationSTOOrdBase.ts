import axios from '@/api/Axios';

/**
 * 당일광역보충발주 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주 조회
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/orderCreationSTOOrdBase/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 당일광역보충발주 배치결과 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주 배치결과 조회
 */
const apiGetBatchResultList = (params: any) => {
	return axios.post('/api/om/orderCreationSTOOrdBase/v1.0/getBatchResultList', params).then(res => res.data);
};

/**
 * 당일광역보충발주 배치결과 헤더 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주 배치결과 헤더 조회
 */
const apiGetBatchResultHeadList = (params: any) => {
	return axios.post('/api/om/orderCreationSTOOrdBase/v1.0/getBatchResultHeadList', params).then(res => res.data);
};

/**
 * 당일광역보충발주 배치결과 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주 배치결과 상세 조회
 */
const apiGetBatchResultDetailList = (params: any) => {
	return axios.post('/api/om/orderCreationSTOOrdBase/v1.0/getBatchResultDetailList', params).then(res => res.data);
};

/**
 * 당일광역보충발주 마감유형 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주 마감유형 조회
 */
const apiGetDailyDeadlineSto = (params: any) => {
	return axios.get('/api/om/orderCreationSTOOrdBase/v1.0/getDailyDeadlineSto', { params }).then(res => res.data);
};

/**
 * 당일광역보충발주 저장
 * @param {any} params 당일광역보충발주 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/ltx/om/orderCreationSTOOrdBase/v1.0/saveMasterList', params).then(res => res.data);
};
export {
	apiGetBatchResultDetailList,
	apiGetBatchResultHeadList,
	apiGetBatchResultList,
	apiGetDailyDeadlineSto,
	apiGetMasterList,
	apiPostSaveMasterList,
};
