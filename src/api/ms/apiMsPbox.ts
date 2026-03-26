/*
 ############################################################################
 # FiledataField	: apiMsPbox.ts
 # Description		: 재고 > 공용기 관리 > P-BOX 관리/사용 현황 API
 # Author			: KimDongHan
 # Since			: 2025.09.18
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ms/pbox';
//const REQUEST_API = '/api/ib/close';

/**
 * 재고 > 공용기 관리 > P-BOX 관리/사용 현황 PBOX등록_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 재고 > 공용기 관리 > P-BOX 관리/사용 현황 PBOX등록_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostGetCheckCarNo = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getCheckCarNo', params).then(res => res.data);
};

/**
 * 재고 > 공용기 관리 > P-BOX 관리/사용 현황 사용현황_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 재고 > 공용기 관리 > P-BOX 관리/사용 현황 PBOX등록_탭 저장
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 재고 > 공용기 관리 > P-BOX 관리/사용 현황 PBOX등록_탭 인쇄
 * @param {any} params
 * @returns {object}
 */
const apiPostsavePrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePrintList', params).then(res => res.data);
};

export { apiPostGetCheckCarNo, apiPostMasterT1List, apiPostMasterT2List, apiPostSaveMasterList, apiPostsavePrintList };
