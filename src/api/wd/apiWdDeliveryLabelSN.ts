import axios from '@/api/Axios';

/**
 * 이력배송라벨출력-분류표생성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력배송라벨출력-분류표생성 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 이력배송라벨출력-분류표생성 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력배송라벨출력-분류표생성 상세
 */
const apiGetTab1DetailList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getTab1DetailList', params).then(res => res.data);
};

/**
 * 이력배송라벨출력-분류표출력 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력배송라벨출력-분류표출력 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 이력배송라벨출력-회수리스트 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력배송라벨출력-회수리스트 목록 조회
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getTab3MasterList', params).then(res => res.data);
};

/**
 * 피킹지출력 조회
 * @param {any} params 검색 조건
 * @returns {object}  * 피킹지출력 조회
 */
const apiGetPrintPickingList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getPrintPickingList', params).then(res => res.data);
};

/**
 * 회수리스트 조회
 * @param {any} params 검색 조건
 * @returns {object}  * 회수리스트 조회
 */
const apiGetPrintReturnList = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/getPrintReturnList', params).then(res => res.data);
};

/**
 * 이력배송라벨출력 분류표 생성
 * @param {any} params 검색 조건
 * @returns {object} 이력배송라벨출력 분류표 생성
 */
const apiSaveCreationSN = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/saveCreationSN', params).then(res => res.data);
};

/**
 * 마감주문반영
 * @param {any} params 검색 조건
 * @returns {object} 마감주문반영
 */
const apiSaveOrderclose = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/saveOrderclose', params).then(res => res.data);
};

/**
 * INVOICE번호 출력여부 저장
 * @param {any} params 검색 조건
 * @returns {object} INVOICE번호 출력여부 저장
 */
const apiSaveInvoiceNoPrtYn = (params: any) => {
	return axios.post('/api/wd/deliveryLabelSN/v1.0/saveInvoiceNoPrtYn', params).then(res => res.data);
};

export {
	apiGetPrintPickingList,
	apiGetPrintReturnList,
	apiGetTab1DetailList,
	apiGetTab1MasterList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiSaveCreationSN,
	apiSaveInvoiceNoPrtYn,
	apiSaveOrderclose,
};
