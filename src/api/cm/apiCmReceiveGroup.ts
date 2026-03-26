import axios from '@/api/Axios';

/**
 * 기준정보 > 게시판관리 > 수신그룹 목록 검색 조회
 * @param {any} params 수신그룹 검색 조건
 * @returns {object} 수신그룹 목록
 */
const apiGetRcvGrpHeaderList = (params: any) => {
	return axios.get('/api/cm/receiveGroup/v1.0/getRcvGrpHeaderList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 게시판관리 > 상세 수신그룹-사용자 목록 검색 조회
 * @param {any} params 상세 수신그룹 검색 조건
 * @returns {object} 상세 수신그룹 목록
 */
const apiGetRcvGrpDetailList = (params: any) => {
	return axios.get('/api/cm/receiveGroup/v1.0/getRcvGrpDetailList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 게시판관리 > 수신그룹 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveRcvGrpHeader = (params: any) => {
	return axios.post('/api/cm/receiveGroup/v1.0/saveRcvGrpHeader', params).then(res => res);
};

/**
 * 기준정보 > 게시판관리 > 수신그룹-사용자 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveRcvGrpDetail = (params: any) => {
	return axios.post('/api/cm/receiveGroup/v1.0/saveRcvGrpDetail', params).then(res => res);
};

export { apiGetRcvGrpDetailList, apiGetRcvGrpHeaderList, apiPostSaveRcvGrpDetail, apiPostSaveRcvGrpHeader };
