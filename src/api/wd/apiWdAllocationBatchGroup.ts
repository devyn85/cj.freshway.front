import axios from '@/api/Axios';

/**
 * 출고재고분배-자동분배 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-자동분배 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 자동분배-거래처별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동분배-거래처별 상세
 */
const apiGetTab1CustList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1CustList', params).then(res => res.data);
};

/**
 * 자동분배-전표별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동분배-전표별 상세
 */
const apiGetTab1SlipList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1SlipList', params).then(res => res.data);
};

/**
 * 자동분배-상품별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동분배-상품별 상세
 */
const apiGetTab1SkuList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1SkuList', params).then(res => res.data);
};

/**
 * 자동분배-차량별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동분배-차량별 상세
 */
const apiGetTab1CarnoList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1CarnoList', params).then(res => res.data);
};

/**
 * 자동분배-피킹존별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동분배-피킹존별 상세
 */
const apiGetTab1ZoneList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab1ZoneList', params).then(res => res.data);
};

/**
 * 출고재고분배-지정분배 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-지정분배 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 출고재고분배-지정분배 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-지정분배 상세
 */
const getTab2DetailList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab2DetailList', params).then(res => res.data);
};

/**
 * 출고재고분배-피킹유형 미정의 관리처 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-피킹유형 미정의 관리처 목록
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab3MasterList', params).then(res => res.data);
};

/**
 * 피킹유형 미정의 관리처 원거리유형 저장
 * @param {any} params 검색 조건
 * @returns {object} 피킹유형 미정의 관리처 원거리유형 저장
 */
const apiSaveTab3MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/saveTab3MasterList', params).then(res => res.data);
};

/**
 * 출고재고분배-자량별분배 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-자량별분배 목록
 */
const apiGetTab4MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab4MasterList', params).then(res => res.data);
};

/**
 * 지정분배-차량별 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 지정분배-차량별 상세
 */
const getTab4DetailList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab4DetailList', params).then(res => res.data);
};

/**
 * 출고재고분배-거래처상품별 상미율 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-거래처상품별 상미율 목록
 */
const apiGetTab5MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab5MasterList', params).then(res => res.data);
};

/**
 * 출고재고분배-분배예외처리거래처 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-분배예외처리거래처 목록
 */
const apiGetTab6MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab6MasterList', params).then(res => res.data);
};

/**
 * 출고재고분배-분배예외처리상품 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-분배예외처리상품 목록
 */
const apiGetTab7MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab7MasterList', params).then(res => res.data);
};

/**
 * 거래처상품별 상미율 저장
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-거래처상품별 상미율 목록
 */
const apiSaveTab5MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/saveTab5MasterList', params).then(res => res.data);
};

/**
 * 분배예외처리거래처 저장
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-분배예외처리거래처 목록
 */
const apiSaveTab6MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/saveTab6MasterList', params).then(res => res.data);
};

/**
 * APPLY_FROM_DATE 저장
 * @param {any} params 검색 조건
 * @returns {object} 출고재고분배-APPLY_FROM_DATE 목록
 */
const apiSaveTab7MasterList = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/saveTab7MasterList', params).then(res => res.data);
};

/**
 * 해당센터의 피킹그룹내 원거리유형이 CAR가 있는지 조회
 * @param {any} params 검색 조건
 * @returns {object} 차량별-CAR원거리유형 존재여부 확인
 */
const apiGetTab4CarInfo = (params: any) => {
	return axios.post('/api/wd/allocationBatchGroup/v1.0/getTab4CarInfo', params).then(res => res.data);
};

export {
	apiGetTab1CarnoList,
	apiGetTab1CustList,
	apiGetTab1MasterList,
	apiGetTab1SkuList,
	apiGetTab1SlipList,
	apiGetTab1ZoneList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiGetTab4CarInfo,
	apiGetTab4MasterList,
	apiGetTab5MasterList,
	apiGetTab6MasterList,
	apiGetTab7MasterList,
	apiSaveTab3MasterList,
	apiSaveTab5MasterList,
	apiSaveTab6MasterList,
	apiSaveTab7MasterList,
	getTab2DetailList,
	getTab4DetailList,
};
