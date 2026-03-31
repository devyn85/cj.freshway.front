/*
 ############################################################################
 # FiledataField	: apiMgModifyLogExDC.tsx
 # Description		: 외부비축재고변경사유현황 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축재고변경사유현황(변경이력)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	// return axios.post('/api/mg/modifyLogExDc/v1.0/getMasterList', params).then(res => res.data);
	return axios.post('/api/mg/modifyLogExDc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 외부비축재고변경사유현황(상품이력번호)
 * @param params
 * @returns
 */
const apiGetMaster1List = (params: any) => {
	return axios.post('/api/mg/modifyLogExDc/v1.0/getDetailList', params).then(res => res.data);
};

export { apiGetMaster1List, apiGetMasterList };
