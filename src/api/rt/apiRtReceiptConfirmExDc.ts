/*
 ############################################################################
 # FiledataField	: apiRtReturnOutExDC.tsx
 # Description		: 외부비축협력사반품지시 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.22
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축협력사반품지시 입고내역조회
 * @param params
 * @returns
 */
const apiGetDataHeaderList = (params: any) => {
	return axios.post('/api/rt/receiptConfirmExdc/v1.0/getDataHeaderList', params).then(res => res.data);
};

/**
 * 외부비축협력사반품지시 출고내역조회
 * @param params
 * @returns
 */
const apiGetDataHeaderList1 = (params: any) => {
	return axios.post('/api/rt/receiptConfirmExdc/v1.0/getDataHeaderSubList', params).then(res => res.data);
};

/**
 * 외부비축협력사반품지시 입고내역 저장
 * @param params
 * @returns
 */
const apisaveMasterList = (params: any) => {
	return axios.post('/api/rt/receiptConfirmExdc/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 외부비축협력사반품지시 출고내역 저장
 * @param params
 * @returns
 */
const apisaveMasterList1 = (params: any) => {
	return axios.post('/api/rt/receiptConfirmExdc/v1.0/saveMasterList1', params).then(res => res.data);
};
export { apiGetDataHeaderList, apiGetDataHeaderList1, apisaveMasterList, apisaveMasterList1 };
