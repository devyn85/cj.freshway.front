import axios from '@/api/Axios';

/**
 * 라벨 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/sys/label/v1.0/getLabelList', params).then(res => res.data);
};

/**
 * 라벨 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/sys/label/v1.0/saveLabelList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveMasterList };
