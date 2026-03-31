import axios from '@/api/Axios';

/**
 * 저장품발주삭제PO 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품발주삭제PO 목록
 */
const apiGetMasterListPO = (params: any) => {
	return axios.get('/api/om/purchaseModify/v1.0/getMasterListPO', { params }).then(res => res.data);
};

/**
 * 저장품발주삭제PO 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품발주삭제PO 목록
 */
const apiGetDetailListPO = (params: any) => {
	return axios.get('/api/om/purchaseModify/v1.0/getDetailListPO', { params }).then(res => res.data);
};

/**
 * 저장품발주삭제STO 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품발주삭제STO 목록
 */
const apiGetMasterListSTO = (params: any) => {
	return axios.get('/api/om/purchaseModify/v1.0/getMasterListSTO', { params }).then(res => res.data);
};

/**
 * 저장품발주삭제STO 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장품발주삭제STO 목록
 */
const apiGetDetailListSTO = (params: any) => {
	return axios.get('/api/om/purchaseModify/v1.0/getDetailListSTO', { params }).then(res => res.data);
};

/**
 *  저장품발주삭제PO 재발주
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostReorderMasterPO = (params: any) => {
	return axios.post('/ltx/om/purchaseModify/v1.0/reorderMasterPO', params).then(res => res.data);
};

/**
 *  저장품발주삭제STO 재발주
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostReorderMasterSTO = (params: any) => {
	return axios.post('/api/om/purchaseModify/v1.0/reorderMasterSTO', params).then(res => res.data);
};

/**
 *  저장품발주삭제STO 외부창고 재발주
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostReorderMasterOutSTO = (params: any) => {
	return axios.post('/api/om/purchaseModify/v1.0/reorderMasterOutSTO', params).then(res => res.data);
};

/**
 *  저장품발주삭제STO 삭제
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostDeleteMasterSTO = (params: any) => {
	return axios.post('/api/om/purchaseModify/v1.0/deleteMasterSTO', params).then(res => res.data);
};

export {
	apiGetDetailListPO,
	apiGetDetailListSTO,
	apiGetMasterListPO,
	apiGetMasterListSTO,
	apiPostDeleteMasterSTO,
	apiPostReorderMasterOutSTO,
	apiPostReorderMasterPO,
	apiPostReorderMasterSTO,
};
