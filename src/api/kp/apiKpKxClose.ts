import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/kxClose';

/**
 * Admin > 모니터링 > KX마감진행 [마감현황] 목록 검색 조회
 * @param {any} params KX마감진행 [마감현황] 검색 조건
 * @returns {object} KX마감진행 [마감현황] 목록
 */
const apiGetKxCloseList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCloseList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [마감현황] (I/F) 목록 검색 조회
 * @param {any} params KX마감진행 [마감현황] (I/F) 검색 조건
 * @returns {object} KX마감진행 [마감현황] 목록
 */
const apiGetKxCloseListIF = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCloseListIF', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [마감현황] 상세 검색 조회
 * @param {any} params 상세 KX마감진행 [마감현황] 검색 조건
 * @returns {object} 상세 KX마감진행 [마감현황] 목록
 */
const apiGetKxCloseDetail = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCloseDetail', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [마감현황] (I/F) 상세 검색 조회
 * @param {any} params 상세 KX마감진행 [마감현황] 검색 조건
 * @returns {object} 상세 KX마감진행 [마감현황] 목록
 */
const apiGetKxCloseDetailIF = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCloseDetailIF', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [KX검증] 목록 검색 조회
 * @param {any} params [KX검증] 검색 조건
 * @returns {object} [KX검증] 목록
 */
const apiGetKxCheckList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCheckList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [KX검증] 저장
 * @param {any} params [KX검증] 저장 데이터
 * @returns {object}
 */
const apiSaveKxCheck = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxCheck', params).then(res => res);
};

/**
 * Admin > 모니터링 > 문서내역 조회
 * @param {any} params [문서내역] 검색 조건
 * @returns {object} [문서내역] 목록
 */
const apiGetKxDocList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxDocList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > 문서내역 조회
 * @param {any} params [문서내역] -IF 검색 조건
 * @returns {object} [문서내역] 목록
 */
const apiGetKxDocDetailList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxDocDetailList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > 문서내역 - 삭제오더초기화
 * @param {any} params [문서내역] -삭제오더초기화
 * @returns {object}
 */
const apiPostSaveDelOrderReset = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveDelOrderReset', params).then(res => res);
};

/**
 * Admin > 모니터링 > 문서내역 - STO예외처리
 * @param {any} params [문서내역] -STO예외처리
 * @returns {object}
 */
const apiPostSaveKxDoc = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxDoc', params).then(res => res);
};

/**
 * Admin > 모니터링 > KX마감진행 [인수거절확인] 목록 검색 조회
 * @param {any} params [인수거절확인] 검색 조건
 * @returns {object} [인수거절확인] 목록
 */
const apiGetKxCdiiList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxCdiiList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [수불확인] 목록 검색 조회
 * @param {any} params [수불확인] 검색 조건
 * @returns {object} [수불확인] 목록
 */
const apiGetKxInoutListForSku = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxInoutListForSku', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [수불비교] 목록 검색 조회
 * @param {any} params [수불비교](월) 검색 조건
 * @returns {object} [수불비교](월) 목록
 */
const apiGetKxSubulMonthList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxSubulMonthList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [수불비교] 현황 검색 조회
 * @param {any} params [수불비교](일) 검색 조건
 * @returns {object} [수불비교](일) 목록
 */
const apiGetKxSubulDayList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxSubulDayList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [수불비교] 현황 검색 조회
 * @param {any} params [수불비교](일) - 상세 검색 조건
 * @returns {object} [수불비교](일) - 상세 목록
 */
const apiGetKxSubulDayDtlList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxSubulDayDtlList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [재고비교] 목록 검색 조회
 * @param {any} params [재고비교] 검색 조건
 * @returns {object} [재고비교] 목록
 */
const apiGetKxStDiffList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxStDiffList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [조정요청내역] 목록 검색 조회
 * @param {any} params [조정요청내역] 검색 조건
 * @returns {object} [조정요청내역] 목록
 */
const apiGetKxAjRequestList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxAjRequestList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [조정요청내역] 저장
 * @param {any} params [조정요청내역] 저장 데이터
 * @returns {object}
 */
const apiSaveKxAj = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxAj', params).then(res => res);
};

/**
 * Admin > 모니터링 > KX마감진행 [협력사반출처리상태] 목록 검색 조회
 * @param {any} params [협력사반출처리상태] 검색 조건
 * @returns {object} [협력사반출처리상태] 목록
 */
const apiGetKxRPList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxRPList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [협력사반출확인] 저장
 * @param {any} params [협력사반출확인] 저장 데이터
 * @returns {object}
 */
const apiSaveKxRP = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxRP', params).then(res => res);
};

/**
 * Admin > 모니터링 > KX마감진행 [협력사반출확인] 예외처리
 * @param {any} params [협력사반출확인] 예외처리 데이터
 * @returns {object}
 */
const apiSaveKxRPEx = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxRPEx', params).then(res => res);
};

/**
 * Admin > 모니터링 > KX마감진행 [소유권확인] 저장
 * @param {any} params [소유권확인] 저장 데이터
 * @returns {object}
 */
const apiSaveKxTrOrderCheck = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveKxTrOrderCheck', params).then(res => res);
};

// Admin > 모니터링 > KX마감진행 [I/F관리] 목록 검색 조회
const apiDataIfStatusList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getDataIfStatusList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [실적미수신] 목록 검색 조회
 * @param {any} params [실적미수신] 검색 조건
 * @returns {object} [실적미수신] 목록
 */
const apiGetDataNotRcvList = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/getDataNotRcvList', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [실적미수신] 오더강제결품 저장
 * @param {any} params [실적미수신] 오더강제결품 저장 데이터
 * @returns {object}
 */
const apiSaveOrderClear = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveOrderClear', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [실적미수신] KX접수여부 조회
 * @param {any} params [실적미수신]
 * @returns {object}
 */
const apiGetKxAcceptYn = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getKxAcceptYn', params).then(res => res.data);
};

/**
 * @param {any} params [I/F관리] 상세 검색 조건
 * @returns {object} [I/F관리] 상세 목록
 */
const apiGetDataIfStatusDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDataIfStatusDetailList', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [I/F관리] 코스트센터 저장
 * @param {any} params [I/F관리] 코스트센터 저장 데이터
 * @returns {object}
 */
const apiPostSaveDuplicateCostCd = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveDuplicateCostCd', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [I/F관리] SRM1300 저장
 * @param {any} params [I/F관리] SRM1300 저장 데이터
 * @returns {object}
 */
const apiPostSaveDuplicateSRM1300 = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveDuplicateSRM1300', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [I/F관리] 재처리 저장
 * @param {any} params [I/F관리] 재처리 저장 데이터
 * @returns {object}
 */
const apiPostSaveIFTables = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveIFTables', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX실적미수신 이메일 전송
 * @param {any} params 이메일 전송 데이터 (title, sender, refsender, content, receivers, detailRows)
 * @returns {object}
 */
const apiSaveEmail = (params: any) => {
	return axios.post('/api/kp/kxClose/v1.0/saveEmail', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [재고조회] 목록 검색 조회
 * @param {any} params [재고조회] 검색 조건
 * @returns {object} [재고조회] 목록
 */
const apiGetKxStockList = (params: any) => {
	return axios.get('/api/kp/kxClose/v1.0/getKxStockList', { params }).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [재고조회] STOCKID(개체식별/유통이력) 초기화 처리
 * @param {any} params [재고조회] STOCKID(개체식별/유통이력) 초기화 저장 데이터
 * @returns {object}
 */
const apiSaveStockIdInit = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveStockIdInit', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > KX마감진행 [조정전표수정] 전표 수정 처리
 * @param {any} params [조정전표수정] 전표 수정 저장 데이터
 * @returns {object}
 */
const apiSaveInplanZero = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveInplanZero', params).then(res => res.data);
};

export {
	apiDataIfStatusList,
	apiGetDataIfStatusDetailList,
	apiGetDataNotRcvList,
	apiGetKxAjRequestList,
	apiGetKxCdiiList,
	apiGetKxCheckList,
	apiGetKxCloseDetail,
	apiGetKxCloseDetailIF,
	apiGetKxCloseList,
	apiGetKxCloseListIF,
	apiGetKxDocDetailList,
	apiGetKxDocList,
	apiGetKxInoutListForSku,
	apiGetKxRPList,
	apiGetKxStDiffList,
	apiGetKxStockList,
	apiGetKxSubulDayDtlList,
	apiGetKxSubulDayList,
	apiGetKxSubulMonthList,
	apiPostSaveDelOrderReset,
	apiPostSaveDuplicateCostCd,
	apiPostSaveDuplicateSRM1300,
	apiPostSaveIFTables,
	apiPostSaveKxDoc,
	apiSaveEmail,
	apiSaveInplanZero,
	apiSaveKxAj,
	apiSaveKxCheck,
	apiSaveKxRP,
	apiSaveKxRPEx,
	apiSaveKxTrOrderCheck,
	apiSaveOrderClear,
	apiSaveStockIdInit,
	apiGetKxAcceptYn,
};
