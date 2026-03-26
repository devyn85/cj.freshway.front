import axios from '@/api/Axios';

/**
 * 파일 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 파일 목록
 */
const apiGetCmFileUploadList = (params: any) => {
	return axios.get('/api/cm/fileUpload/v1.0/getFileInfoList', { params }).then(res => res.data);
};

export { apiGetCmFileUploadList };
