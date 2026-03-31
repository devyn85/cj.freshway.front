import axios from '@/api/Axios';
/**
 * 다중 필드 검색 요건 처리 공통 유틸
 * - 4개의 검색 필드(name, dlvSearchVal, saleCustSearchVal, childCustSearchVal) 각각에 대해
 *   스페이스 분리 개수 검사, 정규식 이스케이프 처리, 고정 검색 여부 판단
 * @param {any} params API params 객체
 * @param {number} [maxSpaceCount] 허용되는 최대 스페이스 개수(기본 5개 이상 불가)
 * @param {string} [alertMsg] 스페이스 초과 시 경고 메시지
 * @returns {boolean} 검사 통과 시 true, 실패 시 false (후속 처리 중단)
 */
const processMultiSearchCondition = (
	params: any,
	maxSpaceCount = 6,
	alertMsg = '스페이스가 포함된 검색어 5개 이상 조회할 수 없습니다.',
) => {
	const codeName = commUtil.nvl(params.name, ''); // 기본 코드/명
	const codeNameChild = commUtil.nvl(params.childCustSearchVal, ''); // 관리처 고객코드/명

	params.keywordRegexp = codeName.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리
	params.keywordRegexpChild = codeNameChild.replace(/([\\(\'\"\)\[\]\+\*\^\|])/g, '\\$1'); // NOSONAR -> 특수문자 이스케이프 처리

	params.isEnter = params.isEnter ?? 'N'; // NOSONAR -> Enter키로 검색 여부

	params.fixedSearchYn =
		(codeName.startsWith('%') && !codeName.substring(1).includes('%')) ||
		(codeName.endsWith('%') && !codeName.substring(0, codeName.length - 1).includes('%'))
			? 'Y'
			: '';
	params.fixedSearchYnChild =
		(codeNameChild.startsWith('%') && !codeNameChild.substring(1).includes('%')) ||
		(codeNameChild.endsWith('%') && !codeNameChild.substring(0, codeNameChild.length - 1).includes('%'))
			? 'Y'
			: '';

	return true;
};
/**
 * 특별관리고객현황 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/custredzone/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 거래처 팝업 목록 조회 API
 * @param {object} params 조회 param
 * @returns {object} 거래처 목록
 */
const apiGetCustPopupList = async (params: any) => {
	// LIKE 검색 적용 대상: search, 본점고객코드/명, 판매처코드/명, 관리처코드/명
	if (!processMultiSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/ms/custredzone/v1.0/getCustPopupList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};
export { apiGetCustPopupList, apiGetMasterList };
