import axios from '@/api/Axios';

/**
 * 엑셀 업로드 API
 * @param {object} params 엑셀 파일
 * @returns {object} 업로드 성공 여부
 */
const apiPostExcelUpload = async (params: any) => {
	return axios
		.post('api/cm/excel/v1.0/excelUpload', params, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res.data);
};

/**
 * 엑셀 다운로드 API
 * @param {object} params 다운로드할 엑셀 id
 * @returns {object} 엑셀 파일 다운로드
 */
const apiPostExcelDownload = async (params: any) => {
	return axios.post('api/cm/excel/v1.0/download/xlsx', params, { responseType: 'blob' }).then(res => res);
};

export { apiPostExcelDownload, apiPostExcelUpload };
