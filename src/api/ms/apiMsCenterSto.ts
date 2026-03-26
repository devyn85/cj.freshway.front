import axios from '@/api/Axios';

/**
 * 센터이체마스터 조회
 * @returns {object} 센터이체마스터 조회(목록)
 */
const apiGetMasterList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getMasterList').then(res => res.data);
};

/**
 * 센터이체마스터 MERGE
 * @param {any} params 상품 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 피킹유형 자동 설정 조회
 * @returns {object} PLT 변환값 마스터 정보 조회(목록)
 */
const apiGetPickList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getPickList').then(res => res.data);
};

/**
 * 피킹유형 조회
 *  @param {any} params 피킹유형 조회 파라미터
 * @returns {object} PLT 변환값 마스터 정보 조회(목록)
 */
const apiGetPickTypeList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getPickTypeList').then(res => res.data);
};

/**
 * 피킹유형 자동 설정 MERGE
 * @param {any} params 피킹유형 자동 설정 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePickList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/savePickList', params).then(res => res);
};

/**
 * 센터 제외 조회
 * @returns {object} 센터 제외 조회(목록)
 */
const apiGetClosetypeDcList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getClosetypeDcList').then(res => res.data);
};

/**
 * 센터 제외 MERGE
 * @param {any} params 센터 제외 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveClosetypeDcList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/saveClosetypeDcList', params).then(res => res);
};

/**
 * 상품 제외 조회
 * @returns {object} 상품 제외 조회(목록)
 */
const apiGetClosetypeSkuList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getClosetypeSkuList').then(res => res.data);
};

/**
 * 상품 제외 유효성검사
 * @param {any} params 상품 제외 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiGetClosetypeSkuListCheck = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/getClosetypeSkuListCheck', params).then(res => res);
};

/**
 * 상품 제외 MERGE
 * @param {any} params 상품 제외 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveClosetypeSkuList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/saveClosetypeSkuList', params).then(res => res);
};

/**
 * 상품 제외 excel 유효성검사
 * @param {any} params 상품 제외 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiValidateClosetypeSkuExcelList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/validateClosetypeSkuExcelList', params).then(res => res);
};

/**
 * 상품 제외 excel MERGE
 * @param {any} params 상품 제외 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveClosetypeSkuExcelList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/saveClosetypeSkuExcelList', params).then(res => res);
};

/**
 * 우선 순위 설정 조회
 * @returns {object} 우선 순위 설정 조회(목록)
 */
const apiGetPriorityList = () => {
	return axios.get('/api/ms/centerSto/v1.0/getPriorityList').then(res => res.data);
};

/**
 * 우선 순위 설정 MERGE
 * @param {any} params 우선 순위 설정 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePriorityList = (params: any) => {
	return axios.post('/api/ms/centerSto/v1.0/savePriorityList', params).then(res => res);
};

export {
	apiGetClosetypeDcList,
	apiGetClosetypeSkuList,
	apiGetClosetypeSkuListCheck,
	apiGetMasterList,
	apiGetPickList,
	apiGetPickTypeList,
	apiGetPriorityList,
	apiPostSaveClosetypeDcList,
	apiPostSaveClosetypeSkuExcelList,
	apiPostSaveClosetypeSkuList,
	apiPostSaveMasterList,
	apiPostSavePickList,
	apiPostSavePriorityList,
	apiValidateClosetypeSkuExcelList,
};
