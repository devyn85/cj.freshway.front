import axios from '@/api/Axios';

/**
 * 이력STO출고처리-STO생성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-STO생성 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-STO출고확정 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-STO출고확정 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-출고대상 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-출고대상 상세
 */
const apiGetTab2DetailWDList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/getTab2DetailWDList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-결품대상 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-결품대상 상세 조회
 */
const apiGetTab2DetailShortageList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/getTab2DetailShortageList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-피킹 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-피킹 조회
 */
const apiGetPickingList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/getPickingList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-STO생성 저장
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-STO생성 저장
 */
const apiSaveCreationSTOList = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/saveCreationSTOList', params).then(res => res.data);
};

/**
 * 이력STO출고처리-출고대상확정 저장
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-출고대상확정 저장
 */
const apiSaveBatchConfirmLine = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/saveBatchConfirmLine', params).then(res => res.data);
};

/**
 * 이력STO출고처리-결품대상확정 저장
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-결품대상확정 저장
 */
const apiSaveBatchCancelLine = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/saveBatchCancelLine', params).then(res => res.data);
};

/**
 * 이력STO출고처리-SO&STO분리
 * @param {any} params 검색 조건
 * @returns {object} 이력STO출고처리-SO&STO분리
 */
const apiSaveDistribute = (params: any) => {
	return axios.post('/api/wd/serialOrderSTO/v1.0/saveDistribute', params).then(res => res.data);
};

export {
	apiGetPickingList,
	apiGetTab1MasterList,
	apiGetTab2DetailShortageList,
	apiGetTab2DetailWDList,
	apiGetTab2MasterList,
	apiSaveBatchCancelLine,
	apiSaveBatchConfirmLine,
	apiSaveCreationSTOList,
	apiSaveDistribute,
};
