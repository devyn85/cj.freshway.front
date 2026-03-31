import axios from '@/api/Axios';

/**
 * 출차그룹 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetVehicleExitGroupCfg = (params: any) => {
	return axios.get('api/ms/vehicleExitGroupCfg/v1.0/getVehicleExitGroupCfgList', { params }).then(res => res.data);
};

/**
 * 출차그룹 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveVehicleExitGroupCfg = (params: any) => {
	return axios.post('api/ms/vehicleExitGroupCfg/v1.0/saveVehicleExitGroupCfgList', params).then(res => res.data);
};

export { apiGetVehicleExitGroupCfg, apiPostSaveVehicleExitGroupCfg };
