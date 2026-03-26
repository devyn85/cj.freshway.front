/*
 ############################################################################
 # FiledataField	: apiMsSkuDcSet.tsx
 # Description		: 외부비축재고속성변경 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.25
 ############################################################################
*/
import axios from '@/api/Axios';

const apiGetDataHeaderList = (params: any) => {
	return axios.post('/api/st/convertCgExDc/v1.0/getStConvertCgExDcHeaderSubList', params).then(res => res.data);
};
const getStConvertCgExDcDetailList = (params: any) => {
	return axios.get('/api/st/convertCgExDc/v1.0/getStConvertCgExDcDetailList', { params }).then(res => res.data);
};
const saveStConvertCgExDc = (params: any) => {
	return axios.post('/api/st/convertCgExDc/v1.0/saveStConvertCgExDc', params).then(res => res.data);
};
export { apiGetDataHeaderList, getStConvertCgExDcDetailList, saveStConvertCgExDc };
