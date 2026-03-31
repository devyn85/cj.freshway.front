import axios from '@/api/Axios';

/**
 * 일배협력사별주문현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배협력사별주문현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/om/omCloseMonitoring/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 마감주문반영 저장
 * @param {any} params 검색 조건
 * @returns {object} 마감주문반영 저장
 */
const apiSaveConfirm = (params: any) => {
	return axios.post('/api/om/omCloseMonitoring/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 마감기준시간 콤보데이터 조회
 * @param {any} params 검색 조건
 * @returns {object} 마감기준시간 콤보데이터 조회
 */
const apiGetCloseTime = (params: any) => {
	return axios.post('/api/om/omCloseMonitoring/v1.0/getCloseTime', params).then(res => res.data);
};

export { apiGetCloseTime, apiGetMasterList, apiSaveConfirm };
