import axios from '@/api/Axios';
import { apiGetCmUser, apiGetCmUserAuthority } from '@/api/cm/apiCmMain';
import useGlobalRouter from '@/hooks/useGlobalRouter';
import * as i18n from '@/lang/i18n';
import { createSlice } from '@reduxjs/toolkit';

// Store
import store from '@/store/core/coreStore';
import * as GlobalStore from '@/store/core/globalStore';
import * as MenuStore from '@/store/core/menuStore';
// import * as TabStore from '@/store/core/tabStore';
import * as LoadingStore from './loadingStore';

// Utils
import commUtil from '@/util/commUtil';

export interface UserType {
	userId: string;
	userNm?: string;
	mailAddr?: string;
	comCd?: string; // 회사코드
	empNo?: string; // 사원번호
	locale?: string;
	defStorerkey?: string; // 기본고객코드
	defDccode?: string; // 기본센터코드
	defOrganize?: string; // 기본조직코드
	defArea?: string; // 기본창고코드
}

// 사용자 정보 초기 설정 값
const initUserInfo = {
	userId: '',
	userNm: '',
	mailAddr: '',
	comCd: '',
	emptype: '',
	empNo: '',
	defStorerkey: '',
	defDccode: '',
	defOrganize: '',
	defArea: '',
	masterYn: '',
	userNo: '',
	authority: '',
	telNo: '',
	repUserIdYn: '',
	custkey: '',
	custkeyNm: '',
	roles: '',
	department: '',
};

export const userStore = createSlice({
	name: 'user',
	initialState: {
		userInfo: initUserInfo,
		userAuthInfo: [],
		locale: '',
	},
	reducers: {
		setUser(state, action) {
			state.userInfo = { ...action.payload };
			// state.userInfo = { ...action.payload, ...{ masterYn: 'N', emptype: '01' } };
		},
		setUserAuth(state, action) {
			state.userAuthInfo = action.payload;
		},
		resetUserInfo(state) {
			state.userInfo = initUserInfo;
		},
		resetUserAuthInfo(state) {
			state.userAuthInfo = [];
		},
		setInitUserStore(state) {
			// 초기화
			state.userInfo = { ...userStore.getInitialState().userInfo };
			state.userAuthInfo = { ...userStore.getInitialState().userAuthInfo };
		},
		setLocale(state, action) {
			state.locale = action.payload;
			i18n.setLocale(action.payload);
		},
	},
});

export const { setUser, setUserAuth, resetUserInfo, resetUserAuthInfo, setInitUserStore, setLocale } =
	userStore.actions;
export default userStore.reducer;

export const userLogout = (): void => {
	// store?.getState()?.user?
	// store 초기화
	store.dispatch(setInitUserStore());
	store.dispatch(MenuStore.setInitMenuStore());
	// store.dispatch(TabStore.setInitTabStore());
	store.dispatch(GlobalStore.setInitGlobalStore());
	store.dispatch(LoadingStore.stopLoading());
	// cookie 초기화
	localStorage.setItem('accessToken', null);
	// localStorage.setItem('username', null);
	const savedLoginPage = localStorage.getItem('savedLoginPage') || '/custLogin';
	useGlobalRouter.navigate(savedLoginPage);
};

/**
 * 유저 정보 조회
 * @function fetchUserInfo 유저 정보 fetch
 * @returns {object} 유저정보
 */
export async function fetchUserInfo() {
	const response = await apiGetCmUser().then(res => res.data);
	store.dispatch(setUser(response));

	// 글로벌 변수 설정
	store.dispatch(
		GlobalStore.setGlobalVariable({
			gUserId: response.userId,
			// gUserNm: response.userNm,
			// gUseStsCd: response.userStsCd,
			gStartSysCl: response.startSysCl,

			gAuthority: response.authority,
			gStorerkey: response.defStorerkey,
			gDccode: response.defDccode,
			gOrganize: response.defOrganize,
			// gArea: response.defArea,
			gMultiStorerkey: response.defStorerkey,
			gMultiDccode: response.defDccode,
			gMultiOrganize: response.defOrganize,
			// gMultiArea: response.defArea,

			gEmpno: response.empNo,
			gComCd: response.comCd,
			gDeptCd: response.deptCd,
			gDeptNm: response.deptNm,
		}),
	);

	return response;
}

/**
 * 유저 권한 정보 조회
 * @function fetchUserAuthInfo 유저 권한 정보 fetch
 * @returns {object} 유저 권한 정보
 */
export async function fetchUserAuthInfo() {
	const response = await apiGetCmUserAuthority().then(res => res.data);
	store.dispatch(setUserAuth(response));
	return response;
}

/**
 * Access Token Refresh
 * @function fetchAccessTokenRefresh Access Token Refresh fetch
 * @returns {void}
 */
export async function fetchAccessTokenRefresh() {
	const params = {
		accessToken: localStorage.getItem('accessToken'),
	};
	const refreshRes = await axios.post('/api/cm/login/v1.0/refreshtoken', params);
	if (refreshRes && refreshRes.status === 200 && refreshRes.data.statusCode === 0) {
		const token = refreshRes.data.data;
		localStorage.setItem('accessToken', token.accessToken);
	}
}

/**
 * 센터 코드 아이템 타입
 * @description 센터 코드 아이템 타입
 */
type DccodeItemType = {
	dccode: string;
	dcname: string;
	dcnameOnlyNm?: string;
};

/**
 * 우선순위 센터 리스트
 * @description 우선순위 센터 리스트 ( FO, FW 에 속하지 않고 따로 관리하도록 함 )
 * @description MS Teams - 개발요청사항 - 1000, 2170 센터 코드 추가 건 확인
 */
export const dccodeIncludePriorityCenterList: string[] = []; //['1000', '2170'];

/**
 * 사용 가능한 센터 리스트 조회
 * @param {string} dataType DATA 타입
 * @returns {DccodeItemType[]} 사용 가능한 센터 리스트
 */
export const getUserDccodeList = (dataType?: string): DccodeItemType[] => {
	const childCenterList: DccodeItemType[] = [];
	const childPriorityCenterList: DccodeItemType[] = []; // 우선순위 센터 리스트 ( FO, FW 에 속하지 않음 )
	const parentCenterList: DccodeItemType[] = [];

	let dccode = '';
	const userAuthList = store?.getState()?.user?.userAuthInfo;

	userAuthList &&
		userAuthList.length > 0 &&
		userAuthList?.map((auth: any) => {
			if (dccode !== auth.dccode) {
				dccode = auth.dccode;

				if (dccode !== '' && (dccode !== '9999' || dataType?.includes('HQ'))) {
					const item: DccodeItemType = {
						dccode: auth.dccode,
						dcname: auth.dcname,
						dcnameOnlyNm: auth.dcname.replace(/^\[\d+\]/, ''),
					};

					// 우선순위 센터 추가
					if (dccodeIncludePriorityCenterList.includes(auth.dccode)) {
						childPriorityCenterList.push(item);
					} else {
						childCenterList.push(item);
					}
				}
			}
		});

	if (dataType === 'ALL') {
		parentCenterList.push(
			{
				dccode: '0000',
				dcname: '전체센터',
				dcnameOnlyNm: '전체센터',
			},

			{
				dccode: '0001',
				dcname: 'FW센터',
				dcnameOnlyNm: 'FW센터',
			},
			{
				dccode: '0002',
				dcname: 'FO센터',
				dcnameOnlyNm: 'FO센터',
			},
		);
	}

	if (dataType === 'CENTER_ALL') {
		parentCenterList.push(
			{
				dccode: '0001',
				dcname: 'FW센터',
				dcnameOnlyNm: 'FW센터',
			},
			{
				dccode: '0002',
				dcname: 'FO센터',
				dcnameOnlyNm: 'FO센터',
			},
		);
	}

	if (dataType === 'ONLYALL') {
		parentCenterList.push({
			dccode: '전체',
			dcname: '전체',
			dcnameOnlyNm: '전체',
		});
	}

	if (dataType?.includes('STD')) {
		parentCenterList.push({
			dccode: 'STD',
			dcname: 'STD',
			dcnameOnlyNm: 'STD',
		});
	}
	if (dataType === 'COMMON') {
		parentCenterList.push(
			{
				dccode: '0000',
				dcname: '전체센터',
				dcnameOnlyNm: '전체센터',
			},

			{
				dccode: '0001',
				dcname: 'FW센터',
				dcnameOnlyNm: 'FW센터',
			},
			{
				dccode: '0002',
				dcname: 'FO센터',
				dcnameOnlyNm: 'FO센터',
			},
			{
				dccode: '공통',
				dcname: '공통',
				dcnameOnlyNm: '공통',
			},
		);
	}
	/**
	 * 최종 센터 리스트 반환
	 * @description 전체센터, FW센터, FO센터, 우선순위 센터, 자식센터 순으로 반환 ( 우선순위 센터는 FW, FO 센터에 속하지 않음 )
	 */
	const finalResult = [...parentCenterList, ...childPriorityCenterList, ...childCenterList];

	return finalResult;
};

/**
 * 사용 가능한 고객 리스트 조회
 * @param {string} dataType DATA 타입
 * @param {string} dcCode 센터 코드
 * @returns {object} 사용 가능한 고객 리스트
 */
export const getUserStorerkeyList = (dataType: string, dcCode: string): any => {
	const result: any[] = [];
	let storerkey = '';
	let userAuthList = store?.getState()?.user?.userAuthInfo;

	if (commUtil.isNotEmpty(userAuthList)) {
		if (dcCode !== '') {
			userAuthList = userAuthList?.filter((auth: any) => {
				return auth.dccode == dcCode;
			});
		}

		userAuthList?.map((auth: any) => {
			if (storerkey !== auth.storerkey) {
				storerkey = auth.storerkey;

				if (storerkey !== '') {
					result.push({
						storerkey: auth.storerkey,
						storername: auth.storerName,
						storerName: auth.storerName,
					});
				}
			}
		});
	}

	return result;
};

/**
 * 사용 가능한 조직 리스트 조회
 * @param {string} dataType DATA 타입
 * @param {string} dccode 센터 코드
 * @param {string} storerkey 회사 코드
 * @returns {object} 사용 가능한 조직 리스트
 */
export const getUserOrganizeList = (dataType: string, dccode: string, storerkey: string): any => {
	const result: any[] = [];
	let organize = '';
	let userAuthList = store?.getState()?.user?.userAuthInfo;

	if (commUtil.isNotEmpty(userAuthList)) {
		if (dccode !== '') {
			userAuthList = userAuthList?.filter((auth: any) => {
				return auth.dccode == dccode;
			});
		}

		if (storerkey !== '') {
			userAuthList = userAuthList?.filter((auth: any) => {
				return auth.storerkey == storerkey;
			});
		}

		userAuthList?.map((auth: any) => {
			if (organize !== auth.organize) {
				organize = auth.organize;

				if (organize !== '') {
					result.push({
						organize: auth.organize,
						organizeName: auth.organizeName,
					});
				}
			}
		});

		if (dataType === 'STD') {
			result.unshift({
				organize: 'STD',
				organizeName: 'STD',
			});
		}
	}

	return result;
};

/**
 * 사용 가능한 구역 리스트 조회
 * @param {string} dataType DATA 타입
 * @param {string} dccode 센터 코드
 * @param {string} storerkey 회사 코드
 * @returns {object} 사용 가능한 구역 리스트
 */
export const getUserAreaList = (dataType: string, dccode: string, storerkey: string): any => {
	const result: any[] = [];
	let area = '';
	let userAuthList = store?.getState()?.user?.userAuthInfo;

	if (commUtil.isNotEmpty(userAuthList)) {
		if (dccode !== '') {
			userAuthList = userAuthList?.filter((auth: any) => {
				return auth.dccode == dccode;
			});
		}

		if (storerkey !== '') {
			userAuthList = userAuthList?.filter((auth: any) => {
				return auth.storerkey == storerkey;
			});
		}

		userAuthList?.map((auth: any) => {
			if (area !== auth.area) {
				area = auth.area;

				if (area !== '') {
					result.push({
						area: auth.area,
						areaname: auth.areaName,
						areaName: auth.areaName,
					});
				}
			}
		});

		if (dataType === 'STD') {
			result.unshift({
				area: 'STD',
				areaName: 'STD',
			});
		}
	}

	return result;
};
