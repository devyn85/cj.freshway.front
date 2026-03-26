import axios from '@/api/Axios';

/**
 * 월간주간발주량체크PO 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 월간주간발주량체크PO 목록
 */
const apiGetMasterListPO = (params: any) => {
	return axios.get('/api/om/purchaseCheck/v1.0/getMasterListPO', { params }).then(res => res.data);
};

/**
 * 월간주간발주량체크STO 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 월간주간발주량체크STO 목록
 */
const apiGetMasterListSTO = (params: any) => {
	return axios.get('/api/om/purchaseCheck/v1.0/getMasterListSTO', { params }).then(res => res.data);
};

export { apiGetMasterListPO, apiGetMasterListSTO };
