/*
 ############################################################################
 # FiledataField	: apiStTplUser.ts
 # Description		: 화주 조회 API
 # Author			: 
 # Since			: 2025.11.06
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/tplUser';

/**
 * 창고 목록 조회
 * @param {any} params 창고 검색 조건
 * @returns {object} 창고 목록
 */
const apiGetTplUserPopupList = async (params: any) => {
	// START.검색요건
	const codeName = commUtil.nvl(params.name, '');
	//params.keywordEng = commUtil.convertEngToKor(codeName); //
	// params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	//params.keywordEngRegexp = params.keywordEng.replace(/([\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); //	영->한 정규식

	return axios
		.post('/api/st/search/v1.0/getTplUserPopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

const apipostTplUser = (params: any) => {
	return axios.post('/api/st/search/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetTplUserPopupList, apipostTplUser };
