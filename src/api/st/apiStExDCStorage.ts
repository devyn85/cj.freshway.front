/*
 ############################################################################
 # FiledataField	: apiStExDCStorage.tsx
 # Description		: 외부창고정산 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부창고정산 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고정산 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/ltx/st/exdcstorage/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고정산 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 외부창고정산 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 외부창고정산 기타비용등록
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveEtcFee = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/saveEtcFee', params).then(res => res.data);
};

/**
 * 외부창고정산 보관료 비용 마감
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveExdcStorage = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/saveExdcStorage', params).then(res => res.data);
};

/**
 * 외부창고정산 수량 강제 조정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveQtyEdit = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/saveQtyEdit', params).then(res => res.data);
};

/**
 * 기타비용등록 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 기타비용등록 목록
 */
const apiPosJournalcodeList = (params: any) => {
	return axios
		.post('/api/st/exdcstorage/v1.0/getJournalcodeList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 엑셀 검증
 * @param {any} params 외부센터 보충발주 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostValidateExcel = (params: any) => {
	return axios.post('/api/st/exdcstorage/v1.0/validateExcel', params).then(res => res);
};

/**
 * 권한 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 권한 목록
 */
const apiPostAuthority = (params: any) => {
	return axios
		.post('/api/st/exdcstorage/v1.0/getAuthority', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export {
	apiPosJournalcodeList,
	apiPostAuthority,
	apiPostMasterList,
	apiPostSaveEtcFee,
	apiPostSaveExcelList,
	apiPostSaveExdcStorage,
	apiPostSaveMasterList,
	apiPostSaveQtyEdit,
	apiPostValidateExcel,
};
