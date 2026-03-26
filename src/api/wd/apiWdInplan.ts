import axios from '@/api/Axios';

/**
 * 출고진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고진행현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/wd/inplan/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 메인 물동량 및 라벨건수
 * @param {any} params
 * @returns {object}
 */
const apiPostMainMasterList = (params: any) => {
	return axios.post('/ltx/wd/inplan/v1.0/getMainMasterList', params).then(res => res.data);
};

/**
 * 엑셀 다운로드
 * @param params
 */
const apiPostLargeDataExcel = (params: any) => {
	return axios.post('/ltx/wd/inplan/v1.0/saveLargeDataExcel', params, { responseType: 'blob' }).then(res => res);
};

export { apiGetMasterList, apiPostLargeDataExcel, apiPostMainMasterList };
