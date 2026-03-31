import axios from '@/api/Axios';

/**
 * Email 전송
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveEmail = (params: any) => {
	return axios.post('/api/cm/send/v1.0/saveEmail', params).then(res => res);
};

/**
 * SMS 전송
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSms = (params: any) => {
	return axios.post('/api/cm/send/v1.0/saveSms', params).then(res => res);
};

/**
 * SMS 전송 (실시간)
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSmsRealTime = (params: any) => {
	return axios.post('/api/cm/send/v1.0/saveSmsRealTime', params).then(res => res);
};

export { apiPostSaveEmail, apiPostSaveSms, apiPostSaveSmsRealTime };
