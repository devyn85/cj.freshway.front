import axios from '@/api/Axios';

/**
 * Fax 파일 다운로드
 * @param {any} params 다운로드 파일 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostDownloadFile = async (params: any) => {
	return axios.post(
		'api/cm/file/v1.0/fileDownload',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

export { apiPostDownloadFile };
