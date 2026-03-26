/*
 ############################################################################
 # FiledataField	: apiStExdcManualIndicator.tsx
 # Description		: 외부비축재고속성변경 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 26.02.03
 ############################################################################
*/
import axios from '@/api/Axios';

const apiGetDataHeaderList = (params: any) => {
	return axios.post('/api/st/stExdcManualIndicator/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetDataHeaderList };
