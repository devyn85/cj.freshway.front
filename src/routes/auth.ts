// pages 업무 디렉토리 기본 설정 값
const DEFAULT_PAGE = {
	authority: true,
	layout: true,
};

// pages 기준 예외 권한 설정 (DEFAULT_PAGE 아닌 권한)
const PAGE_ROUTER = Object.freeze([
	{
		url: '/',
		authority: false,
		layout: false,
	},
	{
		url: '/login',
		authority: false,
		layout: false,
	},
	{
		url: '/custLogin',
		authority: false,
		layout: false,
	},
	{
		url: '/custUserSmsSec',
		authority: false,
		layout: false,
	},
	{
		url: '/pwdChange',
		authority: false,
		layout: false,
	},
	{
		url: '/ssoLogin',
		authority: false,
		layout: false,
	},
	{
		url: '/error',
		authority: false,
		layout: false,
	},
	{
		url: '/home',
		authority: true,
		layout: true,
	},
	{
		url: '/cm/CmReportViewer', // RD 뷰어
		authority: false,
		layout: false,
	},
	{
		url: '/om/OmPurchaseInspectPop', // 저장품자동발주검수 점검 팝업
		authority: false,
		layout: false,
	},
	{
		url: '/om/OmPurchaseInspectOutPop', // 저장품자동발주검수(외부창고) 점검 팝업
		authority: false,
		layout: false,
	},
	{
		url: '/om/OmPurchaseStorageAutoTotalPopup', // 출고추이 팝업
		authority: false,
		layout: false,
	},
	{
		url: '/wd/WDInspectMntPop', // PDP 팝업
		authority: true,
		layout: false,
	},
	{
		url: '/wd/WDInspectMntPopforDp', // PDP 팝업
		authority: true,
		layout: false,
	},
	{
		url: '/wd/WDInspectMntPopforDpWd', // PDP 팝업
		authority: true,
		layout: false,
	},
]);

// 퍼블리싱 기본 설정값
const DEFAULT_PUBLISH = {
	authority: false,
	layout: true,
};

// 퍼블리싱 기준 예외 권한 설정 (DEFAULT_PUBLISH 아닌 권한)
const PUBLISH_ROUTER = Object.freeze([
	{
		url: '/publish/pubfullpage',
		authority: false,
		layout: true,
	},
	{
		url: '/publish/PubTemplate',
		authority: false,
		layout: false,
	},
	{
		url: '/publish/guide',
		authority: false,
		layout: false,
	},
]);

export default {
	DEFAULT_PAGE,
	DEFAULT_PUBLISH,
	PAGE_ROUTER,
	PUBLISH_ROUTER,
};
