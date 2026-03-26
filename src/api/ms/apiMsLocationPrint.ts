/*
 ############################################################################
 # FiledataField	: apiMsLocationPrint.ts
 # Description		: 기준정보 > 물류센터 정보 > 로케이션 라벨 출력 API
 # Author			: KimDongHan
 # Since			: 2025.09.24
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ms/locationPrint';

/**
 * 기준정보 > 물류센터 정보 > 로케이션 라벨 출력 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
