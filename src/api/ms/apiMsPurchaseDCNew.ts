import axios from '@/api/Axios';

/**
 * 수급마스터관리 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 수급마스터관리 정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/ms/purchaseDCNew/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 수급마스터관리 월평균 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 수급마스터관리 정보 조회(목록)
 */
const apiGetMasterAvgList = (params: any) => {
	return axios.post('/api/ms/purchaseDCNew/v1.0/getMasterAvgList', params).then(res => res.data);
};

export { apiGetMasterAvgList, apiGetMasterList };
