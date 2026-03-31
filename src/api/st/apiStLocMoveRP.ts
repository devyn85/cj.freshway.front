import axios from '@/api/Axios';

/**
 * 보충생성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 보충생성 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.get('/api/st/locMoveRP/v1.0/getTab1MasterList', { params }).then(res => res.data);
};

/**
 * ASRS결과 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} ASRS결과 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.get('/api/st/locMoveRP/v1.0/getTab2MasterList', { params }).then(res => res.data);
};

export { apiGetTab1MasterList, apiGetTab2MasterList };
