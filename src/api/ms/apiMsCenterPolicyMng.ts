import axios from '@/api/Axios';

/**
 * 센터정책관리 조회
 * @param params
 * @returns {object} 센터정책관리 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/centerPolicyMng/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 센터정책관리 상세조회
 * @param params
 * @returns {object} 센터정책관리 상세조회(목록)
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/ms/centerPolicyMng/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 센터정책관리 로케이션 조회
 * @param params
 * @returns {object} 센터정책관리 상세조회(목록)
 */
const apiGetLocationList = (params: any) => {
	return axios.get('/api/ms/centerPolicyMng/v1.0/getLocationList', { params }).then(res => res.data);
};

/**
 * 센터정책관리 코드 유효성 체크
 * @param params
 * @returns {object} 센터정책관리 코드 유효성 체크
 */
const apiGetValidateCodeList = (params: any) => {
	return axios.post('/api/ms/centerPolicyMng/v1.0/getValidateCodeList', params).then(res => res);
};

/**
 * 센터정책 저장
 * @param {any} params 센터정책관리 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/centerPolicyMng/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 센터정책관리 기타설정 저장
 * @param {any} params 센터정책관리 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList2 = (params: any) => {
	return axios.post('/api/ms/centerPolicyMng/v1.0/saveMasterList2', params).then(res => res);
};

/**
 * 센터정책 세부관리 목록 MERGE
 * @param {any} params 센터정책관리 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList3 = (params: any) => {
	return axios.post('/api/ms/centerPolicyMng/v1.0/saveMasterList3', params).then(res => res);
};
/**
 * 센터정책관리 상세 MERGE
 * @param {any} params 센터정책관리 상세 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveDetailList = (params: any) => {
	return axios.post('/api/ms/centerPolicyMng/v1.0/saveDetailList', params).then(res => res);
};

export {
	apiGetDetailList,
	apiGetLocationList,
	apiGetMasterList,
	apiGetValidateCodeList,
	apiPostSaveDetailList,
	apiPostSaveMasterList,
	apiPostSaveMasterList2,
	apiPostSaveMasterList3,
};
