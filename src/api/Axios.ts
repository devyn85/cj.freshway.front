// Lib
import axios, { AxiosRequestConfig } from 'axios';
import { t } from 'i18next';
import qs from 'qs';

// Util
import useGlobalRouter from '@/hooks/useGlobalRouter';
import * as messageUtil from '@/util/MessageUtil';

// Store
import store from '@/store/core/coreStore';
import { dispatchSetLoading } from '@/store/core/loadingStore';
import { userLogout } from '@/store/core/userStore';

// Axios 기본 타입 확장
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	showLoading?: boolean; // 로딩바 노출 여부
}

/* 
 # FiledataField	: Axios.ts
 # Description	: Axios 설정파일
 # Author	: GEB
 # Since		: 22.09.23
 */
const { VITE_APP_AXIOS_BASE_URL } = import.meta.env; // Axios 기본 URL
// Axios Config
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_APP_AXIOS_BASE_URL, //"http://api.ictdev.cj.net"//process.env.REACT_APP_AXIOS_BASE_URL
	timeout: 600000 * 10,
};
axios.defaults.withCredentials = true;
axios.defaults.paramsSerializer = params => {
	return qs.stringify(params, { arrayFormat: 'repeat' });
};

const instance = axios.create(axiosConfig);
let isTokenRefreshing = false;
let refreshSubscribers: any[] = [];

/**
 * 토큰 재발행 기능의 callback 함수
 * @param {string} accessToken accessToken
 * @returns {void}
 */
async function onTokenRefreshed(accessToken: string) {
	return refreshSubscribers.map(callback => callback(accessToken));
}

/**
 * Refresh 하는 동안 요청 온 API 저장
 * @param {Function} callback 콜백함수
 * @returns {void}
 */
function addRefreshSubscriber(callback: any) {
	refreshSubscribers.push(callback);
}
// 토큰 설정
instance.interceptors.request.use(
	(config: CustomAxiosRequestConfig) => {
		if (config?.showLoading !== false) dispatchSetLoading(true); // loading on
		const language = localStorage.getItem('language') || 'ko-KR';
		// header 설정
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
			config.headers['Accept-Language'] = language;
		}
		return config;
	},
	error => {
		dispatchSetLoading(false); // loading off
		console.warn('fail req', error);
		return Promise.reject(error);
	},
);

// 글로벌 변수 설정
instance.interceptors.request.use(
	(config: CustomAxiosRequestConfig) => {
		// if (config?.showLoading !== false) dispatchSetLoading(true); // loading on
		if (config.method === 'post' && config.data) {
			if (typeof config.data === 'string') {
				config.data = JSON.parse(config.data);
			}
			const global: any = store.getState().global.globalVariable;
			Object.keys(global).forEach((key: any) => {
				if (key === 'gUserId') {
					// 같은 브라우저 다른 사용자ID 요청 체크하기 위해 추가
					config.headers['X-USER-ID'] ??= global[key];
				} else {
					// 'gUserId' 제외
					config.data[key] ??= global[key];
				}
			});
		} else {
			config.params = { ...store.getState().global.globalVariable, ...config.params };

			// 같은 브라우저 다른 사용자ID 요청 체크하기 위해 추가
			config.headers['X-USER-ID'] = config.params?.gUserId;
			// 'gUserId' 제외
			delete config.params?.gUserId;
		}
		return config;
	},
	error => {
		dispatchSetLoading(false); // loading off
		console.warn('fail req', error);
		return Promise.reject(error);
	},
);

let controller: AbortController | null = null;
let configTmp: CustomAxiosRequestConfig = null;
const escBlockWhitelist: any = new Set([
	'/api/cm/login/v1.0/login',
	'/api/cm/main/v1.0/getMenuRoleList',
	'/api/cm/main/v1.0/getCmUser',
	'/api/cm/main/v1.0/getCmUserAuthority',
	'/api/cm/main/v1.0/getUserCodeList',
]); // API ESC 차단 방지 목록
const escBlockHrefWhitelist: any = new Set(['/wd/wdTask']); // 화면 ESC 차단 방지 목록

// 키보드 입력 차단 핸들러
const blockKeyboard = (e: KeyboardEvent) => {
	// ESC 키는 허용
	if (
		e.key === 'Escape' &&
		!escBlockWhitelist.has(configTmp?.url) &&
		!escBlockHrefWhitelist.has(window.location.href.replaceAll(window.location.origin, ''))
	) {
		if (controller) {
			controller.abort(); // 요청 취소
			controller = null;
		}
		dispatchSetLoading(false); // 로딩 해제
		return;
	}

	// 그 외 키는 차단
	e.preventDefault();
	e.stopPropagation();
};

// 마우스 동작 차단 핸들러
const blockScroll = (e: any) => {
	e.preventDefault();
	e.stopPropagation();
};

// 로딩바 노출시 키보드 입력 방지
instance.interceptors.request.use(
	(config: CustomAxiosRequestConfig) => {
		// 로딩 시작
		// if (config?.showLoading !== false) dispatchSetLoading(true);

		// 새 AbortController 연결
		controller = new AbortController();
		config.signal = controller.signal;
		configTmp = config;

		// 키보드 입력 차단 이벤트 추가
		window.addEventListener('keydown', blockKeyboard, true);

		// 마우스 동작 차단 이벤트 추가
		window.addEventListener('mousemove', blockScroll, true);

		return config;
	},
	error => {
		return Promise.reject(error);
	},
);

/**
 * 	Axios 응답 인터셉터 설정
 * 	- error 응답 성공시 : 200
 * 	        응답 실패시 : !200
 *
 *  - status
 * 	  ->  -1 : 사용자 정의 오류
 */
instance.interceptors.response.use(
	// 응답 200번대
	(res: any) => {
		if (res?.config?.showLoading !== false) dispatchSetLoading(false); // loading off

		// MSG 코드 문구로 변환
		const statusMessage = res?.data?.statusMessage;
		if (statusMessage && statusMessage.includes('MSG_')) {
			res.data.statusMessage = t(`msg.${statusMessage}`);
		}

		// 키보드 입력 방지 이벤트 삭제
		// stopLoading 하기 전에 setTimeout 500이 걸려 있기 때문에 그 시간동안 키보드 입력 방지 이벤트 유지
		setTimeout(() => {
			window.removeEventListener('keydown', blockKeyboard, true);
			window.removeEventListener('mousemove', blockScroll, true);
		}, 500);
		controller = null;

		return res;
	},
	// 응답 200번대가 아닌 status일 때 응답 에러 직전 호출
	async error => {
		if (error?.config?.showLoading !== false) dispatchSetLoading(false); // loading off

		// 키보드 입력 방지 이벤트 삭제
		// stopLoading 하기 전에 setTimeout 500이 걸려 있기 때문에 그 시간동안 키보드 입력 방지 이벤트 유지
		setTimeout(() => {
			window.removeEventListener('keydown', blockKeyboard, true);
			window.removeEventListener('mousemove', blockScroll, true);
		}, 500);
		controller = null;

		if (axios.isCancel(error) || error.name === 'CanceledError') {
			return;
		}

		const { config } = error;
		const errorRes = error?.response;
		const statusCode = errorRes?.data?.statusCode;
		const statusMessage = errorRes?.data?.statusMessage;

		if (error.code == 'ECONNABORTED') {
			showErrorMessage(t('msg.systemError'));
			return errorRes;
		}
		// 사용자 지정 에러 (CmLoopTranPopup,TMAP 제외)
		if (config.method === 'post' && config.data) {
			let obj = config.data;
			if (typeof config.data === 'string') {
				obj = JSON.parse(config.data);
			}
			if (obj && obj['noErrorMsg']) return errorRes;
		} else if (config.method === 'get' && config.params) {
			if (config.params['noErrorMsg']) return errorRes;
		}

		if (statusCode === -1) {
			showErrorMessage(statusMessage);
			return errorRes;
		}

		switch (errorRes.status) {
			case 401:
				// access token 만료 (재발급)
				// responseType: 'blob' 에 대한 보완
				if (errorRes.data?.statusCode === -1001 || errorRes.data instanceof Blob) {
					return accessTokenRefresh(config, error);
				} else if (errorRes.data?.statusCode === -1003) {
					showErrorMessage(statusMessage);
				} else if (errorRes.data?.statusCode === -1004) {
					// 동일한 브라우저에서 다른 사용자ID 로그인시
					showErrorMessage(statusMessage);
					break;
				}
				isTokenRefreshing = false;
				refreshSubscribers = [];

				// 팝업 강제로 닫기
				document.querySelectorAll('.ant-modal-close')?.forEach((btn: any) => {
					btn?.click();
				});

				userLogout(); // access token 유효성 실패 및 토큰 만료(-1002)
				break;
			case 403:
			case 404:
				goErrorPage();
				break;
			case 400:
				showErrorMessage(errorRes.data.statusMessage ? errorRes.data.statusMessage : errorRes.data.error.message);
				return errorRes;
			case 500:
				showErrorMessage(t('msg.systemError'));
				return errorRes;
			default:
				goErrorPage();
				break;
		}
	},
);
/**
 * 에러페이지로 이동 처리
 */
const goErrorPage = () => {
	useGlobalRouter.navigate('/error');
};

/**
 * 에러 메시지 표시
 * @param message
 * @param errorRes
 */
const showErrorMessage = (message: string) => {
	messageUtil.showMessage({
		content: message,
		modalType: 'error',
	});
};

/**
 * accessToken 재발행 처리
 * @param config
 * @param error
 * @returns {Promise}
 */
const accessTokenRefresh = async (config: any, error: any) => {
	const originalRequest = config;
	const params = {
		accessToken: localStorage.getItem('accessToken'), //useUserStore().accessToken,
	};
	if (!isTokenRefreshing) {
		isTokenRefreshing = true;

		const refreshRes = await instance.post('/api/cm/login/v1.0/refreshtoken', params);
		if (refreshRes && refreshRes.status === 200 && refreshRes.data.statusCode === 0) {
			const token = refreshRes.data.data;
			localStorage.setItem('accessToken', token.accessToken);
			originalRequest.headers.Authorization = `Bearer ${token.accessToken}`;
			onTokenRefreshed(token.accessToken).then(() => {
				isTokenRefreshing = false;
				refreshSubscribers = [];
			});
			return instance.request(error.config);
		}
	}
	const retryOriginalRequest = new Promise(resolve => {
		addRefreshSubscriber((accessToken: string) => {
			originalRequest.headers.Authorization = 'Bearer ' + accessToken;
			resolve(axios(originalRequest));
		});
	});
	return retryOriginalRequest;
};

export default instance;
