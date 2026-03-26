import axios from '@/api/Axios';

/**
 * 운송사정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.get('api/ms/carrier/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 운송사정보 단건 조회
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiGetMaster = (params: any) => {
	return axios.get('api/ms/carrier/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * 운송사정보 목록 저장
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('api/ms/carrier/v1.0/saveMasterList', [params]).then(res => res.data);
};

/**
 * 운송사정보 단건 수정
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('api/ms/carrier/v1.0/saveMaster', [params]).then(res => res.data);
};

export { apiGetMaster, apiGetMasterList, apiPostSaveMaster, apiPostSaveMasterList };
