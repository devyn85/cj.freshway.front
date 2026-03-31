import axios from '@/api/Axios';

/**
 * 기준정보 > 기타기준정보 > 상세 코드 목록 검색 조회
 * @param {any} params 상세 코드 검색 조건
 * @returns {object} 상세 코드 목록
 */
const apiGetPopList = async (params: any) => {
	// START.검색요건
	const codeName = commUtil.nvl(params.name, ''); // 상품 코드

	// const arrCodeName = codeName.split(' ');
	// if (arrCodeName.length >= 4) {
	// 	showAlert('', '스페이스가 포함된 검색어 3개 이상 조회할 수 없습니다.');
	// 	return false;
	// }

	params.keywordEng = commUtil.convertEngToKor(codeName); //
	params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordEngRegexp = params.keywordEng.replace(/([\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); //	영->한 정규식
	// END.검색요건
	return axios
		.post('/api/cm/search/v1.0/getPopList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};

export { apiGetPopList };
