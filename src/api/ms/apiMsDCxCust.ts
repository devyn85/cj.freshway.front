import axios from '@/api/Axios';

/**
 * 센터별거래처관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/dCxCust/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 센터별거래처관리 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/dCxCust/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveMasterList };
