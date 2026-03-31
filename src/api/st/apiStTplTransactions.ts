/*
 ############################################################################
 # FiledataField	: apiStTplTransactions.ts
 # Description		: 정산 > 위탁물류 >  위탁입출고현황 API
 # Author			: ParkYoSep
 # Since			: 2025.10.30
 ############################################################################
*/
import axios from '@/api/Axios';
/**
 * 정산 > 위탁물류 >  위탁입출고현황 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apipostDetailList = (params: any) => {
	return axios.post('/api/st/tplTransactions/v1.0/getMasterList', params).then(res => res.data);
};
export { apipostDetailList };
