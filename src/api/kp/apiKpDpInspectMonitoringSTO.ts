import axios from '@/api/Axios';

/**
 * 광역출고검수현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역출고검수현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoringSTO/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 광역출고검수현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역출고검수현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoringSTO/v1.0/getDetailList', params).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList };
