import axios from '@/api/Axios';

/**
 * 하나로 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 하나로 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelForceHanaro/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 쿠팡 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 쿠팡 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelForceHanaro/v1.0/getTab2MasterList', params).then(res => res.data);
};

export { apiGetTab1MasterList, apiGetTab2MasterList };
