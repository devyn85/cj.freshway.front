/*
############################################################################
 # File         : apiOmOrderCreationSTO.ts
 # Description  : 주문 > 주문등록 > 물류센터간 이체 API
 # Author       : YeoSeungCheol
 # Since        : 25.09.26
############################################################################
*/

import axios from '@/api/Axios';

// 목록 조회 (헤더리스트)
const apiPostMasterList = (params: any) => {
	return axios.post('/api/om/ordercreationsto/v1.0/getMasterList', params).then(res => res.data);
};

// 처리결과 조회
const apiPostResultList = (params: any) => {
	return axios.post('/api/om/ordercreationsto/v1.0/getResultList', params).then(res => res.data);
};

// 저장
const apiPostSaveMasterList = (body: any) => {
	return axios.post('/ltx/om/ordercreationsto/v1.0/saveMasterList', body).then(res => res.data);
};

export { apiPostMasterList, apiPostResultList, apiPostSaveMasterList };
