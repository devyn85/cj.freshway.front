/*
 ############################################################################
 # FiledataField	: apiStKitPlan.ts
 # Description		: 재고 > 재고작업 > KIT상품 계획등록 API
 # Author			    : 고혜미
 # Since		    	: 2025.10.21
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stKitPlan';

/**
 * KIT상품 계획등록 목록 조회
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList01', params).then(res => res.data);
};

/**
 * KIT상품계획등록 > KIT구성조회
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList02', params).then(res => res.data);
};

/**
 * KIT상품계획등록 > KIT구성조회
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList03 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList03', params).then(res => res.data);
};

/**
 * KIT상품 계획저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostMasterList01, apiPostMasterList02, apiPostMasterList03, apiPostSaveMasterList };
