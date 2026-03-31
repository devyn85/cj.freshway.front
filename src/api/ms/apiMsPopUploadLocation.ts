import axios from '@/api/Axios';

/**
 * 로케이션 업로드 유효성검증
 * @param data
 */
const apiPostValidatePopUploadLocation = (data: any) => {
	return axios.post('/api/ms/popUploadLocation/v1.0/validate', data).then(res => res.data);
};

/**
 * 로케이션 업로드 실행
 * @param data
 */
const apiPostUploadPopUploadLocation = (data: any) => {
	return axios.post('/api/ms/popUploadLocation/v1.0/upload', data).then(res => res.data);
};

export { apiPostUploadPopUploadLocation, apiPostValidatePopUploadLocation };
