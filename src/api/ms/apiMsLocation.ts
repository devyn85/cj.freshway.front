import axios from '@/api/Axios';

/**
 * 로케이션정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.get('api/ms/location/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 로케이션정보 상세 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMaster = (params: any) => {
	return axios.get('api/ms/location/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * 로케이션정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('api/ms/location/v1.0/saveMasterList', [params]).then(res => res.data);
};

/**
 * 로케이션정보 상세 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMaster = (params: any) => {
	// 백엔드 컨트롤러는 List<Dto>를 받으므로 배열 전송으로 통일
	return axios.post('api/ms/location/v1.0/saveMaster', [params]).then(res => res.data);
};

/**
 * 로케이션 일괄업로드 검증/저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveExcel = (params: any) => {
	return axios.post('api/ms/popuploadlocation/v1.0/saveExcel', params).then(res => res.data);
};

export { apiGetMaster, apiGetMasterList, apiPostSaveExcel, apiPostSaveMaster, apiPostSaveMasterList };

/**
 * 로케이션 업서트(신규/수정 단일)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostUpsertMaster = (params: any) => {
	return axios.post('api/ms/location/v1.0/upsertMaster', [params]).then(res => res.data);
};

export { apiPostUpsertMaster };
