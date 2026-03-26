/*
 ############################################################################
 # FiledataField	: apiStTplOnhandQty.ts
 # Description		: 정산 > 위탁물류 >  위탁재고확인 API
 # Author			: ParkYoSep
 # Since			: 2025.11.17
 ############################################################################
*/
import axios from '@/api/Axios';
/**
 * 정산 > 위탁물류 >  위탁재고 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apipostDetailList = (params: any) => {
	return axios.post('/api/st/tplOnhandQty/v1.0/getMasterList', params).then(res => res.data);
};
export { apipostDetailList };
