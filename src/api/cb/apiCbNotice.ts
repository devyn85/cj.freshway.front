import axios from '@/api/Axios';

/**
 * 기준정보 > 게시판관리 > 공지사항 목록 검색 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetNoticeList = (params: any) => {
	return axios.get('/api/cb/notice/v1.0/getNoticeList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 게시판관리 > 공지사항 상세 검색 조회
 * @param {any} params 상세 검색 조건
 * @returns {object} 상세 목록
 */
const apiGetNoticeDetail = (params: any) => {
	return axios.get('/api/cb/notice/v1.0/getNoticeDetail', { params }).then(res => res.data);
};

/**
 * 기준정보 > 게시판관리 > 수신처 조회
 * @param {any} params 상세 검색 조건
 * @returns {object} 상세 목록
 */
const apiGetNoticeRecvList = (params: any) => {
	return axios.get('/api/cb/notice/v1.0/getNoticeRecvList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 게시판관리 > 공지사항 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveNotice = (params: any) => {
	return axios.post('/api/cb/notice/v1.0/saveNotice', params).then(res => res);
};

export { apiGetNoticeDetail, apiGetNoticeList, apiGetNoticeRecvList, apiPostSaveNotice };
