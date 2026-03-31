import { apiGetUserCmCodeList } from '@/api/cm/apiCmMain';
import store from '@/store/core/coreStore';
import commUtil from '@/util/commUtil';
import { createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';

const SEARCH_CODE_TYPE = ['BBS_TP', 'USER_STATUS', 'TPL_TIMEZONE', 'LANG_CD', 'USE_YN'];

export const comCodeStore = createSlice({
	name: 'comCode',
	initialState: {
		codeList: [],
	},
	reducers: {
		setGrpCommCodeList(state, action: any) {
			state.codeList = action.payload;
		},
	},
});

export const { setGrpCommCodeList } = comCodeStore.actions;
export default comCodeStore.reducer;

/**
 * 그룹 공통 코드 리스트
 * @returns {Array} 공통코드 리스트
 */
export async function fetchGrpCommCode() {
	const params = {
		grpCds: SEARCH_CODE_TYPE,
	};
	const response = await apiGetUserCmCodeList(params).then(res => res.data);
	store.dispatch(setGrpCommCodeList(response));
	return response;
}

/**
 * 공통 코드 리스트
 * @param {string} grp 공통코드 그룹
 * @param {string} firstName 공통코드 초기값 노출명
 * @param {string} firstValue 공통코드 초기값
 * @param {any} opt 옵션
 * @returns {any[]} 공통코드 목록
 */
export const getCommonCodeList = (grp: string, firstName?: string, firstValue?: string, opt?: any): any[] => {
	const comCodeList = store.getState().comCode.codeList;
	const find = comCodeList.find(el => {
		if (el.comGrpCd === grp) {
			return el.commCodes;
		}
	});
	const fValue = firstValue === undefined ? null : firstValue;

	// 깊은 복사
	const result = _.cloneDeep(find);

	// 초기값 설정
	if (result && firstName) {
		const findIndex = result?.commCodes.findIndex((el: any) => el.comCd === fValue);
		if (findIndex < 0) {
			result?.commCodes.unshift({
				comGrpCd: grp,
				comCd: fValue,
				cdNm: firstName,
			});
		}
	}

	// 회사 filter 적용
	if (commUtil.isNotEmpty(opt?.storerkey)) {
		result.commCodes = result?.commCodes?.filter((code: any) => {
			return code.storerkey === opt.storerkey;
		});
	}

	// 중복 제거 후 return
	return _.uniqBy(result?.commCodes, 'comCd');
};

/**
 * 공통 코드 리스트를 공통코드 그룹과 data1 ~ data4 조건으로 반환한다
 * @param {string} grp 공통코드 그룹
 * @param {any} data1 데이터값 1
 * @param {any} data2 데이터값 2
 * @param {any} data3 데이터값 3
 * @param {any} data4 데이터값 4
 * @param {string} firstName 공통코드 초기값 노출명
 * @param {string} firstValue 공통코드 초기값
 * @returns {Array} 공통코드 목록
 */
export const getCommonCodeListByData = (
	grp: string,
	data1: any,
	data2: any,
	data3: any,
	data4: any,
	firstName?: string,
	firstValue?: string,
): any[] => {
	const comCodeList = store.getState().comCode.codeList;
	const find = comCodeList.filter(el => {
		if (el.comGrpCd === grp) {
			return el.commCodes;
		}
	});
	const commCodes: any[] = [];
	find.forEach(grpItem => {
		const codes = grpItem.commCodes.filter((el: any) => {
			if (
				(commUtil.isEmpty(data1) || el.data1 === data1) &&
				(commUtil.isEmpty(data2) || el.data2 === data2) &&
				(commUtil.isEmpty(data3) || el.data3 === data3) &&
				(commUtil.isEmpty(data4) || el.data4 === data4)
			) {
				return el;
			}
		});
		codes?.forEach((el: any) => {
			commCodes.push(el);
		});
	});

	const fValue = firstValue === undefined ? null : firstValue;

	// 깊은 복사
	const result = _.cloneDeep(commCodes);
	// 초기값 설정
	// //if (result && firstValue) {
	// if (result && firstName) {
	// 	const findIndex = result?.findIndex((el: any) => el.comCd === '');
	// 	if (findIndex < 0) {
	// 		result.unshift({
	// 			comGrpCd: grp,
	// 			comCd: '',
	// 			cdNm: firstValue,
	// 		});
	// 	}
	// }

	// 초기값 설정
	if (result && firstName) {
		const findIndex = result?.findIndex((el: any) => el.comCd === fValue);
		if (findIndex < 0) {
			result?.unshift({
				comGrpCd: grp,
				comCd: fValue,
				cdNm: firstName,
			});
		}
	}

	return result;
};

/**
 * 공통 코드 조회
 * @param {string} grp 공통 코드 그룹
 * @param {string | number} cd 공통 코드 코드값
 * @returns {object} 검색된 공통코드
 */
export const getCommonCodebyCd = (grp: string, cd: string | number): any => {
	let result = null;
	const codeList = getCommonCodeList(grp);
	if (!commUtil.isEmpty(codeList)) {
		result = codeList.find((el: any) => {
			if (el.comCd === cd) {
				return el;
			}
		});
	}
	if (result === undefined) {
		result = null;
	}
	return result;
};
