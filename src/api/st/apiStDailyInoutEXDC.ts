/*
 ############################################################################
 # FiledataField	: apiStDailyInoutEXDC.tsx
 # Description		: 외부비축상품별수불현황 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
import axios from '@/api/Axios';

//헤더 목록 조회
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/dailyInoutExDc/v1.0/getStDailyInoutExDcMasterList', params).then(res => res.data);
};
//상세 목록 조회
const apiGetDetailList = (params: any) => {
	return axios.post('/api/st/dailyInoutExDc/v1.0/getStDailyInoutExDcDetailList', params).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList };
