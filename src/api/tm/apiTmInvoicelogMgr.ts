/*
 ############################################################################
 # FiledataField	: apiTmInvoicelogMgr.tsx
 # Description		: 납품서출력로그(관리자)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/

import axios from '@/api/Axios';

const apiGetInvoiceLogList = (params: any) => {
	return axios.post('/api/tm/invoicelogMgr/v1.0/getInvoiceLogList', params).then(res => res.data);
};
export { apiGetInvoiceLogList };
