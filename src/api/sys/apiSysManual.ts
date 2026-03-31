import axios from '@/api/Axios';

/**
 * ADMIN > 시스템운영 > 매뉴얼 목록 검색 조회
 * @param {any} params 매뉴얼 검색 조건
 * @returns {object} 매뉴얼 목록
 */
const apiGetSysManualList = (params: any) => {
	return axios.get('/api/sys/manual/v1.0/getManualList', { params }).then(res => res.data);
};

/**
 * 매뉴얼 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostManualSaveFile = async (params: any) => {
	return axios.post('/api/sys/manual/v1.0/saveManualFileUpload', params);
};

export { apiGetSysManualList, apiPostManualSaveFile };
