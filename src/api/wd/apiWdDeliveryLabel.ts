import axios from '@/api/Axios';

/**
 * 배송라벨출력-분류표출력 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송라벨출력-분류표출력 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 배송라벨출력-분류표출력 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송라벨출력-분류표출력 상세
 */
const apiGetTab1DetailList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/getTab1DetailList', params).then(res => res.data);
};

/**
 * 배송분류표회수리스트 일반 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송분류표회수리스트 일반
 */
const apiGetTab1ReportList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/getTab1ReportList', params).then(res => res.data);
};
/**
 * 배송분류표회수리스트 Cross 조회
 * @param {any} params 검색 조건
 * @returns {object} 배송분류표회수리스트 Cross
 */
const apiGetTab1ReportCrossList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/getTab1ReportCrossList', params).then(res => res.data);
};

/**
 * 배송라벨출력-인쇄 조회(목록)
 * @param {any} params 검색 조건
 * @returns {object} 배송라벨출력-인쇄 상세(목록)
 */
const apiSavePrintHeaderList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/savePrintHeaderList', params).then(res => res.data);
};

/**
 * 배송라벨출력-인쇄 조회(상세)
 * @param {any} params 검색 조건
 * @returns {object} 배송라벨출력-인쇄 상세(상세)
 */
const apiSavePrintDetailList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/savePrintDetailList', params).then(res => res.data);
};

/**
 * 센터별 피킹그룹 조회
 * @param {any} params 검색 조건
 * @returns {object} 센터별 피킹그룹
 */
const apiGetCenterPickGroupList = (params: any) => {
	return axios.post('/api/wd/deliveryLabel/v1.0/getCenterPickGroupList', params).then(res => res.data);
};

export {
	apiGetCenterPickGroupList,
	apiGetTab1DetailList,
	apiGetTab1MasterList,
	apiGetTab1ReportCrossList,
	apiGetTab1ReportList,
	apiSavePrintDetailList,
	apiSavePrintHeaderList,
};
