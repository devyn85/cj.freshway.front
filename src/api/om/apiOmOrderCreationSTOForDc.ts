/*
 ############################################################################
 # FiledataField	: apiOmOrderCreationSTOForDc.tsx
 # Description		: 주문 > 주문등록 > 저장품센터간이체 API
 # Author			: YeoSeungCheol
 # Since			: 25.09.18
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 저장품센터간이체 목록 조회
 * @param {any} params 조회 params
 * @returns {object} 결과
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/api/om/ordercreationstofordc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 저장품센터간이체 처리결과 조회
 * @param {any} params 조회 params
 * @returns {object} 결과
 */
const apiPostResultList = (params: any) => {
	return axios.post('/api/om/ordercreationstofordc/v1.0/getResultList', params).then(res => res.data);
};

/**
 * 저장품센터간이체 저장
 * @param {any} body 저장 파라미터(JSON body)
 * @returns {object} 처리 결과
 */
const apiPostSaveMasterList = (body: any) => {
	return axios.post('/ltx/om/ordercreationstofordc/v1.0/saveMasterList', body).then(res => res.data);
};

/**
 * 저장품센터간이체 저장
 * @param {any} body 저장 파라미터(JSON body)
 * @returns {object} 처리 결과
 */
const apiGetValidateExcelList = (body: any) => {
	return axios.post('/api/om/ordercreationstofordc/v1.0/getValidateExcelList', body).then(res => res.data);
};

export { apiGetValidateExcelList, apiPostMasterList, apiPostResultList, apiPostSaveMasterList };
