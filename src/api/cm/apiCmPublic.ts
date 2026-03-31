import axios from '@/api/Axios';

/**
 * 다국어 목록 조회
 * @param {object} params 조회 조건
 * @returns {object} 다국어 리스트
 */
const apiGetTranslationList = (params: any) => {
	return axios.get('/api/cm/public/v1.0/getTranslationList', { params }).then(res => res?.data);
};

/**
 * 알림 목록 조회
 * @param {object} params 조회 조건
 * @returns {object} 알림 리스트
 */
const apiGetNoticeList = (params: any) => {
	return axios.get('/api/cm/public/v1.0/getNoticeList', { params, showLoading: false } as any).then(res => res.data);
};

/**
 * 공지사항 팝업 목록 조회
 * @param {object} params 조회 조건
 * @returns {object} 알림 리스트
 */
const apiGetNoticePopList = (params: any) => {
	return axios.get('/api/cm/public/v1.0/getNoticePopList', { params, showLoading: false } as any).then(res => res.data);
};

export { apiGetNoticeList, apiGetNoticePopList, apiGetTranslationList };
