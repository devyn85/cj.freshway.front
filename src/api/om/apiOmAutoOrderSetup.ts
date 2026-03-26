import axios from '@/api/Axios';

/**
 * 자동발주관리 마스터 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동발주관리 마스터 조회
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 자동발주관리 상품내역 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동발주관리 상품내역 조회
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/om/autoOrderSetup/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 자동발주관리 이력내역 조회
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 이력내역 조회
 */
const apiGetHistoryList = (params: any) => {
	return axios.get('/api/om/autoOrderSetup/v1.0/getHistoryList', { params }).then(res => res);
};

/**
 * 자동발주관리 상세내역 조회
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상세내역 조회
 */
const apiGetMasterInfo = (params: any) => {
	return axios.get('/api/om/autoOrderSetup/v1.0/getMasterInfo', { params }).then(res => res);
};

/**
 * 자동발주관리 상품 유효성검사
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상품 유효성검사
 */
const apiGetDetailListCheck = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/getDetailListCheck', params).then(res => res);
};

/**
 * 자동발주관리 상품 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상품 저장
 */
const apiSaveDetailList = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/saveDetailList', params).then(res => res);
};

/**
 * 자동발주관리 상세 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상세 저장
 */
const apiSaveMasterInfo = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/saveMasterInfo', params).then(res => res);
};

/**
 * 자동발주관리 예정량확인 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 예정량확인 저장
 */
const apiSaveAutoOrderList = (params: any) => {
	return axios
		.post('/api/om/autoOrderSetup/v1.0/saveAutoOrderList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params,
		})
		.then(res => res);
};

/**
 * 자동발주관리 상세내역 조회
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상세내역 조회
 */
const apiGetMasterInfoSetupList = (params: any) => {
	return axios.get('/api/om/autoOrderSetup/v1.0/getMasterInfoSetupList', { params }).then(res => res);
};

/**
 * 발주 상세설정내역 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 상세내역 조회
 */
const apiSaveMasterInfoSetupList = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/saveMasterInfoSetupList', params).then(res => res);
};

/**
 * 자동발주관리 변경이력 조회
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 자동발주관리 변경이력 조회
 */
const apiGetEditHistoryList = (params: any) => {
	return axios.get('/api/om/autoOrderSetup/v1.0/getEditHistoryList', { params }).then(res => res);
};

/**
 * 발주 상세설정내역(마감유형) 삭제
 * @param {any} params 자동발주관리 상세내역 파라미터
 * @returns {object} 자동발주관리 상세내역 조회
 */
const apiDeleteCloseType = (params: any) => {
	return axios.post('/api/om/autoOrderSetup/v1.0/saveDeleteCloseType', params).then(res => res);
};

export {
	apiDeleteCloseType,
	apiGetDetailList,
	apiGetDetailListCheck,
	apiGetEditHistoryList,
	apiGetHistoryList,
	apiGetMasterInfo,
	apiGetMasterInfoSetupList,
	apiGetMasterList,
	apiSaveAutoOrderList,
	apiSaveDetailList,
	apiSaveMasterInfo,
	apiSaveMasterInfoSetupList,
};
