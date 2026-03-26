import axios from '@/api/Axios';

/**
 * 다중납품처관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 다중납품처관리 목록 저장
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMasterList, apiSaveMasterList };
