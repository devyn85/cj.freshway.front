import axios from '@/api/Axios';

/**
 * 문서정보 팝업 조회
 * @param params
 * @returns {object} 문서정보 리스트
 */
const apiGetDocinfo = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getDocinfo', { params }).then(res => res.data);
};

/**
 * 재고처리현황 조회
 * @param params
 * @returns {object} 재고처리현황 리스트
 */
const apiGetTransactionList = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getTransactionList', { params }).then(res => res.data);
};

const apiGetDocumentDetailForDocno = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getDocumentDetailForDocno', { params }).then(res => res.data);
};

const apiGetDocumentModifyDetailForDocno = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getDocumentModifyDetailForDocno', { params }).then(res => res.data);
};

/**
 * KX실적현황 조회
 * @param params
 * @returns {object} KX실적현황 리스트
 */
const apiGetDocumentKx = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getDocumentKx', { params }).then(res => res.data);
};

/**
 * KX실적현황 조회
 * @param params
 * @returns {object} TCS 소유권처리상태
 */
const apiGetKxCloseDocPopupTCS = (params: any) => {
	return axios.get('/api/kp/kxCloseDocPopup/v1.0/getKxCloseDocPopupTCS', { params }).then(res => res.data);
};

export {
	apiGetDocinfo,
	apiGetDocumentDetailForDocno,
	apiGetDocumentKx,
	apiGetDocumentModifyDetailForDocno,
	apiGetKxCloseDocPopupTCS,
	apiGetTransactionList,
};
