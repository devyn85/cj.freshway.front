import axios from '@/api/Axios';

/**
 * 발주용휴일관리 목록 조회
 * @param params 조회 param
 * @returns 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/cm/dcCalendarManager/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 발주용휴일관리 목록 저장
 * @param params 저장 param
 * @returns 목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/cm/dcCalendarManager/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveMasterList };
