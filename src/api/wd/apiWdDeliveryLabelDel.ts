import axios from '@/api/Axios';

/**
 * 배송라벨삭제현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송라벨삭제현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelDel/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
