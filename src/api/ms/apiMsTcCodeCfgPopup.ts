import axios from '@/api/Axios';

/**
 * 출발지TC센터설정 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMsTcCodeCfgPopup = (params: any) => {
	return axios.get('api/ms/tcCodeCfg/v1.0/getTcCodeCfgList', { params }).then(res => res.data);
};

/**
 * 출발지TC센터설정 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMsTcCodeCfgPopup = (params: any) => {
	return axios.post('api/ms/tcCodeCfg/v1.0/saveTcCodeCfgList', params).then(res => res.data);
};

export { apiGetMsTcCodeCfgPopup, apiPostSaveMsTcCodeCfgPopup };
