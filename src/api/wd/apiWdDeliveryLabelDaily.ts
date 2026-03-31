import axios from '@/api/Axios';

/**
 * 일배분류서출력-일배 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배분류서출력-일배 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelDaily/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 일배분류서출력-광역일배 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배분류서출력-광역일배 상세
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelDaily/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 일배분류서출력-일배 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배분류서출력-일배 출력
 */
const apiGetTab1PrintList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelDaily/v1.0/getTab1PrintList', params).then(res => res.data);
};

/**
 * 일배분류서출력-광역일배 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배분류서출력-광역일배 출력
 */
const apiGetTab2PrintList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelDaily/v1.0/getTab2PrintList', params).then(res => res.data);
};

export { apiGetTab1MasterList, apiGetTab1PrintList, apiGetTab2MasterList, apiGetTab2PrintList };
