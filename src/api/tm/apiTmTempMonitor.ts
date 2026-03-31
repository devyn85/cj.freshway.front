import axios from '@/api/Axios';

/**
 * 온도기록모니터링 차량별 데이터 조회
 * @param {object} params 검색 파라미터
 * @returns {Promise<object>} 온도기록모니터링 차량별 데이터
 */
export const apiGetTemperatureMonitoring = (params: any) => {
  return axios.post('/api/tm/tmLocationMonitorSummary/v1.0/getTempMonitorByCar', params).then(res => res.data);
};

/**
 * 차량 온도 그래프 데이터 조회
 * @param {object} params 검색 파라미터
 * @returns {Promise<{data: VehicleTemperatureData[]}>} 차량 온도 데이터
 */
export const apiGetVehicleTemperatureData = (params: any) => {
  return axios.post('/api/tm/tmLocationMonitorSummary/v1.0/getTempGraph', params).then(res => res.data);
};

/**
 * 온도기록 상세 조회
 * @param {object} params 검색 파라미터
 * @returns {Promise<{data: TemperatureRecord[]}>} 온도기록 데이터
 */
export const apiGetTemperatureRecords = (params: any) => {
  return axios.post('/api/tm/tmLocationMonitorSummary/v1.0/getTempMonitorDesc', params ).then(res => res.data);
};

/******************************************************************/

/**
 * 지표/모니터링 > 차량관제 > 온도기록모니터링 > 팝업 - 온도기록지[목록]
 * @param {any} params  검색 조건
 * @returns {object}  목록
*/
export const apiTmTempMonitorPopupPostGetTempPreviewPopup = (params: any) => {
	return axios.post('/api/tm/tmLocationMonitorPreviewPopup/v1.0/getTempPreviewPopup', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 차량관제 > 온도기록모니터링 > 팝업 - 온도기록지[EDMS 업로드]
 * @param {any} params  검색 조건
 * @returns 
*/
export const apiTmTempMonitorPopupPostupload = (params: any) => {
	return axios.post('/api/tm/tmLocationMonitorPreviewPopup/v1.0/upload', params).then(res => res.data);
};