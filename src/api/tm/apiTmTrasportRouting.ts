/*
 ############################################################################
 # FiledataField	: apiTmTrasportRouting.ts
 # Description		: 정산 > 운송비정산 >  수송경로관리 API
 # Author			: ParkYoSep
 # Since			: 2025.10.14
 ############################################################################
*/
import axios from '@/api/Axios';
/**
 * 도착 물류센터 조회
 * @param params
 */
const getToCenterList = () => {
	return axios.post('/api/tm/trasportRouting/v1.0/getToCenterList').then(res => res.data);
};
/**
 * 정산 > 운송비정산 > 수송경로관리 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apipostMasterList = (params: any) => {
	return axios.post('/api/tm/trasportRouting/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 정산 > 운송비정산 > 수송경로관리 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apipostDetailList = (params: any) => {
	return axios.post('/api/tm/trasportRouting/v1.0/getDetailList', params).then(res => res.data);
};
/**
 * 수송경로관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/trasportRouting/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 수송경로관리 운영단가 저장
 * @param params
 * @returns
 */
const apiSaveDetailList = (params: any) => {
	return axios.post('/api/tm/trasportRouting/v1.0/saveDetailList', params).then(res => res.data);
};

const apiPostExcelUploadTmTrasportRouting = (params: any) => {
	return axios.post('/api/tm/trasportRouting/v1.0/validateExcel', params).then(res => res.data);
};

export {
	apipostDetailList,
	apiPostExcelUploadTmTrasportRouting,
	apipostMasterList,
	apiSaveDetailList,
	apiSaveMasterList,
	getToCenterList,
};
