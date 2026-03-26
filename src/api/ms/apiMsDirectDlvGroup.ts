import axios from '@/api/Axios';

/**
 * 직송그룹지정 정보 조회(목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 기준정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/directDlvGroup/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 직송그룹지정 정보 MERGE
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/directDlvGroup/v1.0/saveMasterList', params).then(res => res);
};

export { apiGetMasterList, apiPostSaveMasterList };
