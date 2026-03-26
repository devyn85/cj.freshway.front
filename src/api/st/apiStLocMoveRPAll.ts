import axios from '@/api/Axios';

/**
 * 출고재고보충(전센터) 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고보충(전센터) 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/locMoveRPAll/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 출고재고보충(전센터) 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고보충(전센터) 출력 목록
 */
const apiGetPrintList = (params: any) => {
	return axios.post('/api/st/locMoveRPAll/v1.0/getPrintList', params).then(res => res.data);
};

/**
 * 출고재고보충(전센터) 보충생성
 * @param {any} params 검색 조건
 * @returns {object} 출고재고보충(전센터)  * 출고재고보충(전센터) 보충생성
 */
const apiSave = (params: any) => {
	return axios.post('/api/st/locMoveRPAll/v1.0/save', params).then(res => res.data);
};

/**
 * 출고재고보충(전센터) 출력 저장
 * @param {any} params 검색 조건
 * @returns {object} 출고재고보충(전센터) 출력 저장
 */
const apiSavePrint = (params: any) => {
	return axios.post('/api/st/locMoveRPAll/v1.0/savePrint', params).then(res => res.data);
};

export { apiGetMasterList, apiGetPrintList, apiSave, apiSavePrint };
