/*
 ############################################################################
 # FiledataField	: apiStConvertCFM.tsx
 # Description		: 중계영업확정처리 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 중계영업확정처리 헤더 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축BL내재고이관 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/st/convertcfm/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 중계영업확정처리 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축BL내재고이관 목록
 */
const apiPostDetailList = (params: any) => {
	return axios
		.post('/api/st/convertcfm/v1.0/getDetailList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 중계영업확정처리 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/convertcfm/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 중계영업확정처리 확정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostConfirmMasterList = (params: any) => {
	return axios.post('/api/st/convertcfm/v1.0/confirmMasterList', params).then(res => res.data);
};

/**
 * 중계영업확정처리 반려
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostRejectMasterList = (params: any) => {
	return axios.post('/api/st/convertcfm/v1.0/rejectMasterList', params).then(res => res.data);
};

export {
	apiPostConfirmMasterList,
	apiPostDetailList,
	apiPostMasterList,
	apiPostRejectMasterList,
	apiPostSaveMasterList,
};
