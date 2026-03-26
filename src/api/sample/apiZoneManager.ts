/**
 * Swagger BackEnd API Document - Common API
 * http://api.canalframe.cj.net/swagger-ui/index.html#/Public
 */

import axios from '../Axios';

/**
 * ***********************************************************
 * 존 정보
 * ***********************************************************
 */

/**
 *	존 정보 조회 API
 * @param {object} params 조회 조건
 * @returns {object} 응답 결과
 */
const apiGetZoneManagerList = (params: any) => {
	return axios
		.get('/sample/center/zone/list', {
			params,
		})
		.then(res => res.data);
};

/**
 *	존 정보 저장 API
 * @param {object} params 저장할 데이터
 * @returns {object} 응답 결과
 */
const apiPostSaveZone = (params: any) => {
	return axios.post('/sample/center/zone/save', params).then(res => res);
};

export { apiGetZoneManagerList, apiPostSaveZone };
