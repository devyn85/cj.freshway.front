import axios from '@/api/Axios';

// 요약 조회
const getMasterListTab1 = (params: any) => {
	return axios.post('/api/kp/locationCapaMonitoringNew/v1.0/getMasterListTab1', params).then(res => res.data);
};

// 로케이션 CAPA 현황 랙별 상세 조회
const getMasterListTab2 = (params: any) => {
	return axios.post('/api/kp/locationCapaMonitoringNew/v1.0/getMasterListTab2', params).then(res => res.data);
};

// 렉별 상세탭 - 렉별 상세 재고상태 조회 (유통기한임박, 빈로케이션, 보관로케이션)
const getDataStatusCount = (params: any) => {
	return axios.post('/api/kp/locationCapaMonitoringNew/v1.0/getDataStatusCount', params).then(res => res.data);
};

// 랙별 상세탭 - 렉별 잔여 Capa, 전체 Capa 조회
const getDataTotalCount = (params: any) => {
	return axios.post('/api/kp/locationCapaMonitoringNew/v1.0/getDataTotalCount', params).then(res => res.data);
};

// 랙별 상세탭 - 로케이션별 상세 정보 조회
const getDetailRead = (params: any) => {
	return axios.post('/api/kp/locationCapaMonitoringNew/v1.0/getDetailRead', params).then(res => res.data);
};
export { getDataStatusCount, getDataTotalCount, getDetailRead, getMasterListTab1, getMasterListTab2 };
