import axios from '@/api/Axios';

/**
 * 보충생성 관리처 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 보충생성 관리처 목록
 */
const apiGetTab1CustkeyList = (params: any) => {
	return axios.get('/api/st/locMoveRPCust/v1.0/getTab1CustkeyList', { params }).then(res => res.data);
};

/**
 * 보충생성 상품 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 보충생성 상품 목록
 */
const apiGetTab1SkuList = (params: any) => {
	return axios.get('/api/st/locMoveRPCust/v1.0/getTab1SkuList', { params }).then(res => res.data);
};

/**
 * ASRS결과 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} ASRS결과 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.get('/api/st/locMoveRPCust/v1.0/getTab2MasterList', { params }).then(res => res.data);
};

export { apiGetTab1CustkeyList, apiGetTab1SkuList, apiGetTab2MasterList };
