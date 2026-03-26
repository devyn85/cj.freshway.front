import axios from '@/api/Axios';

/**
 * 반품진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 반품진행현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/rt/rtInplanTotal/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 반품진행현황 클레임내역 조회
 * @param {any} params 검색 조건
 * @returns {object} 반품진행현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/rt/rtInplanTotal/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 반품진행현황 이력정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 반품진행현황 상세
 */
const apiGetSerialInfoList = (params: any) => {
	return axios.post('/api/rt/rtInplanTotal/v1.0/getSerialInfoList', params).then(res => res.data);
};

/**
 * 반품진행현황 엑셀다운로드자료 조회
 * @param {any} params 검색 조건
 * @returns {object} 반품진행현황 엑셀다운로드자료
 */
const apiGetDataExcelList = (params: any) => {
	return axios.post('/api/rt/rtInplanTotal/v1.0/getDataExcelList', params).then(res => res.data);
};

export { apiGetDataExcelList, apiGetDetailList, apiGetMasterList, apiGetSerialInfoList };
