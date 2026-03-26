import axios from '@/api/Axios';

/**
 * 출고확정처리 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고확정처리 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/wd/shipment/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 출고대상 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고대상 목록
 */
const apiGetTab1DetailList = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/getTab1DetailList', params).then(res => res.data);
};

/**
 * 결품대상 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 결품대상 목록
 */
const apiGetTab2DetailList = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/getTab2DetailList', params).then(res => res.data);
};

/**
 * 상차검수취소 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 상차검수취소 목록
 */
const apiGetTab3DetailList = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/getTab3DetailList', params).then(res => res.data);
};

/**
 * 세금계산서 발행여부 조회
 * @param {any} params 검색 조건
 * @returns {object} 세금계산서 발행여부
 */
const apiGetBillYn = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/getBillYn', params).then(res => res.data);
};

/**
 * 출고확정 저장
 * @param {any} params 검색 조건
 * @returns {object} 출고확정 저장
 */
const apiSaveConfirm = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 출고대상확정
 * @param {any} params 검색 조건
 * @returns {object} 출고대상확정
 */
const apiSaveWD = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/saveWD', params).then(res => res.data);
};

/**
 * 결품대상확정
 * @param {any} params 검색 조건
 * @returns {object} 결품대상확정
 */
const apiSaveShortage = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/saveShortage', params).then(res => res.data);
};

/**
 * 상차검수취소 저장
 * @param {any} params 검색 조건
 * @returns {object} 상차검수취소 저장
 */
const apiSaveWdInspect = (params: any) => {
	return axios.post('/api/wd/shipment/v1.0/saveWdInspect', params).then(res => res.data);
};

export {
	apiGetBillYn,
	apiGetMasterList,
	apiGetTab1DetailList,
	apiGetTab2DetailList,
	apiGetTab3DetailList,
	apiSaveConfirm,
	apiSaveShortage,
	apiSaveWD,
	apiSaveWdInspect,
};
