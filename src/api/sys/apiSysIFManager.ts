import axios from '@/api/Axios';

/**
 * 출고진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고진행현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/sys/ifManager/v1.0/getIFManagerHeaderList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 프로그램 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveIFManager = (params: any) => {
	return axios.post('/api/sys/ifManager/v1.0/saveIFManager', params).then(res => res);
};

export { apiGetMasterList, apiPostSaveIFManager };
