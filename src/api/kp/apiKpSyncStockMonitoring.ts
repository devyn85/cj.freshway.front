/*
 ############################################################################
 # File name    : apiKpSyncStockMonitoring.ts
 # Description  : 재고동기화 모니터링
 # Author       :
 # Since        :
 ############################################################################
*/

import axios from '@/api/Axios';

const BASE = '/api/kp/syncStockMonitoring/v1.0';

/**
 * 재고동기화 모니터링 목록 조회
 * @param params { dccode: string, sku?: string | skuList?: string[] }
 * @returns
 */
const apiGetStockMonitoringList = (params: any) => {
	return axios.post(`${BASE}/getStockMonitoringList`, params).then(res => res.data);
};

export { apiGetStockMonitoringList };
