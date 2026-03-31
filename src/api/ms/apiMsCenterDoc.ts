import axios from '@/api/Axios';

/**
 * 센터서류 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/centerDoc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 센터서류 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/centerDoc/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 센터서류 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostCenterDocSaveFile = async (params: any) => {
	return axios.post('/api/ms/centerDoc/v1.0/centerDocSaveFileUpload', params);
};

/**
 * 센터서류 파일 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterFileList = (params: any) => {
	return axios.post('/api/ms/centerDoc/v1.0/getMasterFileList', params).then(res => res.data);
};

export { apiGetMasterFileList, apiGetMasterList, apiPostCenterDocSaveFile, apiPostSaveMasterList };
