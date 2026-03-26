/*
 ############################################################################
 # FiledataField	: apiKpCenterDayState.ts
 # Description		: 지표 > 센터 운영 > 출고 유형별 물동 현황 API
 # Author			: KimDongHan
 # Since			: 2025.09.03
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/centerDayState';

/**
 * 지표 > 센터 운영 > 출고 유형별 물동 현황 배송물동 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 지표 > 센터 운영 > 출고 유형별 물동 현황 수송물동 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 지표 > 센터 운영 > 출고 유형별 물동 현황 배송차량 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT3List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT3List', params).then(res => res.data);
};
export { apiPostMasterT1List, apiPostMasterT2List, apiPostMasterT3List };
