/*
 ############################################################################
 # FiledataField	: apiKpLocationCapaScan.ts
 # Description		: 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 API
 # Author			: KimDongHan
 # Since			: 2025.09.09
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/locationCapaScan';

/**
 * 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 요약_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 센터별 상세_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 센터별 상세_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPickingZoneList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPickingZoneList', params).then(res => res.data);
};

export { apiPostMasterT1List, apiPostMasterT2List, apiPostPickingZoneList };
