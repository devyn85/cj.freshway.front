import axios from '@/api/Axios';

/**
 * 주출고센터리스트 조회
 * @returns {object} 주출고센터리스트
 */
const apiGetSelectDccodeList = () => {
	return axios.get('/api/ms/cust/v1.0/getSelectDccodeList').then(res => res.data);
};

/**
 * 거래처 기준정보 조회(목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 기준정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/cust/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 거래처 정보 조회 (단건)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 정보 조회 (단건)
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/ms/cust/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * 거래처 정보 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/ms/cust/v1.0/saveMaster', params).then(res => res);
};

export { apiGetMaster, apiGetMasterList, apiGetSelectDccodeList, apiPostSaveMaster };
