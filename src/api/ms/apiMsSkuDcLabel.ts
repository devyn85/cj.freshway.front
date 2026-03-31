import axios from '@/api/Axios';

/**
 * 센터라벨상품 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.get('api/ms/skuDcLabel/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 센터라벨상품 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('api/ms/skuDcLabel/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveMasterList };
