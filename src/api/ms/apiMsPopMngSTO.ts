import axios from '@/api/Axios';

/**
 * 거래처별POP관리(광역일배) 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 거래처별POP관리 정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/popMngSTO/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 거래처별POP관리(광역일배) 정보 MERGE
 * @param {any} params 거래처별POP관리 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/popMngSTO/v1.0/saveMasterList', params).then(res => res);
};

export { apiGetMasterList, apiPostSaveMasterList };
