/*
 ############################################################################
 # FiledataField	: apiMsSkuDcSet.tsx
 # Description		: 센터상품속성 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.01
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 센터상품속성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 센터상품속성 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/skudcset/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 센터상품속성 단건 조회
 * @param {any} params 검색 조건
 * @returns {object} 센터상품속성 단건
 */
const apiGetSkuDcSetDtl = (params: any) => {
	return axios.get('/api/ms/skudcset/v1.0/getSkuDcSetDtl', { params }).then(res => res.data);
};

/**
 * 센터상품속성 저장
 * @param {any} params 센터상품속성 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/skudcset/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 센터상품속성 엑셀 저장
 * @param {any} params 센터상품속성 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterExcelList = (params: any) => {
	return axios.post('/api/ms/skudcset/v1.0/saveMasterExcelList', params).then(res => res);
};

/**
 * 엑셀 업로드 API
 * @param {object} params 엑셀 파일
 * @returns {object} 업로드 성공 여부
 */
const apiPostExcelUpload = async (params: any) => {
	return axios
		.post('api/ms/skudcset/v1.0/excelUpload', params, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res.data);
};

/**
 * 엑셀 검증
 * @param {any} params 센터상품속성 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostValidateExcel = (params: any) => {
	return axios.post('/api/ms/skudcset/v1.0/validateExcel', params).then(res => res);
};

export {
	apiGetMasterList,
	apiGetSkuDcSetDtl,
	apiPostExcelUpload,
	apiPostSaveMasterExcelList,
	apiPostSaveMasterList,
	apiPostValidateExcel,
};
