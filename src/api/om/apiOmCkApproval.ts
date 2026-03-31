import axios from '@/api/Axios';

/**
 * CK주문결재내역 조회
 * @param {any} params 검색 조건
 * @returns {object} CK주문결재내역 조회
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/ckApproval/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * CK주문결재내역 저장
 * @param {any} params CK주문결재내역 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/om/ckApproval/v1.0/saveMasterList', params).then(res => res);
};
export { apiGetMasterList, apiPostSaveMasterList };
