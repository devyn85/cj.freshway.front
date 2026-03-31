/**
 * Swagger BackEnd API Document - Common API
 * http://api.canalframe.cj.net/swagger-ui/index.html#/Public
 */

// import axios from '@/api/Axios';
import axios from '../Axios';

/**
 * ***********************************************************
 * ********* 차량기준정보
 * ***********************************************************
 */

/**
 *	차량정보 조회 API
 *	Array params 적용
 * @param {object} params 공통그룹코드 리스트
 * @returns {object} 멀티 공통코드 리스트
 */
const apiGetCarDriverList = (params: any) => {
	return (
		axios
			// .get('/sample/carmaster/search', {
			.get('/sample/car/driver/search', {
				params,
			})
			.then(res => res.data)
	);
};

const apiPostInsertCarMaster = (params: any) => {
	return axios.post('/sample/car/driver/save', params).then(res => res.data);
};

export { apiGetCarDriverList, apiPostInsertCarMaster };
