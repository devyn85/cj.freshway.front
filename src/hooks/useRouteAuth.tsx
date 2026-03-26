import auth from '@/routes/auth';
import commUtil from '@/util/commUtil';

interface routeProps {
	url?: string;
	authority: boolean;
	layout: boolean;
}

/**
 * 라우터 권한 Hook
 * @param pathname url 주소
 * @returns 권한 및 레이아웃 오브젝트
 */
const useRouteAuth = (pathname: string): any => {
	if (!pathname.startsWith('/publish')) {
		return checkAuthUrl(pathname, auth.DEFAULT_PAGE, auth.PAGE_ROUTER);
	} else {
		return checkAuthUrl(pathname, auth.DEFAULT_PUBLISH, auth.PUBLISH_ROUTER);
	}
};

export default useRouteAuth;

/**
 * URL 권한 체크
 * @param pathname 현재 URL 주소
 * @param defaultAuth 기본 권한
 * @param authArr 권한 배열
 * @returns
 */
const checkAuthUrl = (pathname: string, defaultAuth: object, authArr: any) => {
	let resultData = defaultAuth;
	// 권한 조회
	const findData = authArr.find((el: routeProps) => {
		return el.url.toLowerCase() === pathname.toLowerCase();
	});
	// 데이터 없는 경우 default 설정
	if (!commUtil.isNull(findData)) {
		resultData = {
			authority: findData.authority,
			layout: findData.layout,
		};
	}
	return resultData;
};
