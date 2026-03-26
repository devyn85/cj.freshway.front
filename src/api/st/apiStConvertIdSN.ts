/*
 ############################################################################
 # FiledataField	: apiStConvertIdSN.ts
 # Description		: 재고 > 재고조정 > 이력상품바코드변경 API
 # Author			: KimDongHan
 # Since			: 2025.09.16
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/convertIdSN';

/**
 * 재고 > 재고조정 > 이력상품바코드변경 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
