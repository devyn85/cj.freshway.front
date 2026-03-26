/*
 ############################################################################
 # FiledataField	: apiKpWdRequestCancelqty.tsx
 # Description		: 결품대응현황 API
 # Author			    : 공두경 (medstorm@cj.net)
 # Since			    : 25.08.07
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 결품대응현황 헤더 List
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/getTab1MasterList', params).then(res => res.data);
};
/**
 * 분류피킹(출고센터) 헤더 List
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/getTab2MasterList', params).then(res => res.data);
};
/**
 * 분류피킹(공급센터) 헤더 List
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/getTab3MasterList', params).then(res => res.data);
};
/**
 * 삭제
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiDelete = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/delete', params).then(res => res.data);
};
/**
 * 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiSave = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/save', params).then(res => res.data);
};
/**
 * Tab2 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiSaveTab2 = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/saveTab2', params).then(res => res.data);
};
/**
 * 대응불가
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiStatusCancel = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/statusCancel', params).then(res => res.data);
};
/**
 * STO 요청
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiStoRequest = (params: any) => {
	return axios.post('/api/kp/wdRequestCancelqty/v1.0/stoRequest', params).then(res => res.data);
};

export {
	apiDelete,
	apiGetTab1MasterList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiSave,
	apiSaveTab2,
	apiStatusCancel,
	apiStoRequest,
};
