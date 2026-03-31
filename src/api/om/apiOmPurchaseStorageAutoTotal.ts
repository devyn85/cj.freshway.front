import axios from '@/api/Axios';

/**
 * 저장품자동발주 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품자동발주 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/om/purchaseStorageAutoTotal/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 저장품자동발주 상세(왼쪽) 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품자동발주 목록
 */
const apiGetDetailLeftList = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/getDetailLeftInfo', params).then(res => res.data);
};

/**
 * 저장품자동발주 상세(주문) 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품자동발주 목록
 */
const apiGetDetailOrderList = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/getDetailOrderInfo', params).then(res => res.data);
};

/**
 * 저장품자동발주 상세(오른쪽) 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품자동발주 목록
 */
const apiGetDetailRightList = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/getDetailRightInfo', params).then(res => res.data);
};

/**
 * 입출고 당일이후 집계 최종 생성시간 조회
 * @param {any} params 검색 조건
 * @returns {object} 최종 생성시간
 */
const getLastCreation = (params: any) => {
	return axios.get('/api/om/purchaseStorageAutoTotal/v1.0/getLastCreation', { params }).then(res => res.data);
};

/**
 * 수발주 입출고 내역 갱신
 * @param {any} params 검색 조건
 * @returns {object} 실행 결과
 */
const recreationPurchaseTotal = (params: any) => {
	return axios.get('/api/om/purchaseStorageAutoTotal/v1.0/recreationPurchaseTotal', { params }).then(res => res.data);
};

/**
 *  저장품발주STO 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const savePurchaseSTO = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/savePurchaseSTO', params).then(res => res.data);
};

/**
 *  저장품발주 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const savePurchase = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/savePurchase', params).then(res => res.data);
};

/**
 *  외부창고 발주STO 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const savePurchaseOutSTO = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/savePurchaseOutSTO', params).then(res => res.data);
};

/**
 *  임시 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const tmpSave = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/tmpSave', params).then(res => res.data);
};

/**
 *  수급 이미지 호출 로그 생성
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const saveSuppImgLog = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/saveSuppImgLog', params).then(res => res.data);
};

/**
 *  발주보류 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const savePoHoldYn = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/savePoHoldYn', params).then(res => res.data);
};

/**
 *  이메일 전송
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiSaveEmail = (params: any) => {
	return axios.post('/api/om/purchaseStorageAutoTotal/v1.0/saveEmail', params).then(res => res.data);
};

export {
	apiGetDetailLeftList,
	apiGetDetailOrderList,
	apiGetDetailRightList,
	apiGetMasterList,
	apiSaveEmail,
	getLastCreation,
	recreationPurchaseTotal,
	savePoHoldYn,
	savePurchase,
	savePurchaseOutSTO,
	savePurchaseSTO,
	saveSuppImgLog,
	tmpSave,
};
