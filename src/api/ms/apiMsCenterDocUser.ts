import axios from '@/api/Axios';

/**
 * 센터서류 담당자관리목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/centerDocUser/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 센터서류 담당자관리 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/centerDocUser/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveMasterList };
