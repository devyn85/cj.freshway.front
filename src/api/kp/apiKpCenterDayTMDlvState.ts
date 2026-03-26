/*
 ############################################################################
 # FiledataField	: apiKpCenterDayTMDlvState.ts
 # Description		: 지표 > 센터 운영 > 배송조별 출자 평균시간 현황 API
 # Author			: KimDongHan
 # Since			: 2025.09.01
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/centerDayTMDlvState';

/**
 * 지표 > 센터 운영 > 배송조별 출자 평균시간 현황 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
