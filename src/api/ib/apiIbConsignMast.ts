/*
 ############################################################################
 # FiledataField	: IbConsignMast.tsx
 # Description		: 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 조회 API
 # Author		    	: 고혜미
 # Since			    : 25.09.23
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/consignMast';

/**
 * 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 조회 [품목별정산료TAB]
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 조회 [품목별정산료TAB_자료생성]
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab1CreatDataList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab1CreatDataList', params).then(res => res.data);
};

/**
 * 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 저장[품목별정산료TAB]
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveTab1MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveTab1MasterList', params).then(res => res.data);
};

/**
 * 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 조회 [기준정보TAB]
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산 저장[기준정보TAB]
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveTab2MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveTab2MasterList', params).then(res => res.data);
};

export {
	apiPostSaveTab1MasterList,
	apiPostSaveTab2MasterList,
	apiPostTab1CreatDataList,
	apiPostTab1MasterList,
	apiPostTab2MasterList,
};
