/*
 ############################################################################
 # FiledataField	: apiTmMngplcIDUndone.ts
 # Description		: 배송 > 배차작업 > 분할 미적용 관리처
 # Author			: JiHoPark
 # Since			: 2025.10.21
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 분할 미적용 관리처 - 분할 미적용 관리처 목록 조회
 * @param {any} params 분할 미적용 관리처 목록 검색 조건
 * @returns {object} 분할 미적용 관리처 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/mngplcidundone/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
