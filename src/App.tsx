/*
 ############################################################################
 # FiledataField	: App.tsx
 # Description		: App
 # Author			: CJ Dev
 # Since			: 22.08.29
 ############################################################################
*/

//scss
import '@/assets/styles/styles.scss';
// import '@/lib/AUIGrid/AUIGrid_style.scss';

import { ConfigProvider } from 'antd';

import Loading from '@/components/common/Loading';
import LoadingText from '@/components/common/LoadingText';
import RouteIndex from '@/routes';

import Constants from '@/util/constants';

import en from 'antd/es/locale/en_US';
import ko from 'antd/es/locale/ko_KR';

import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import commUtil from './util/commUtil';

import useGlobalRouter from '@/hooks/useGlobalRouter';
import banner from '@/lib/banner';
import { setLocale } from '@/store/core/userStore';

const App = () => {
	const { VITE_APP_TITLE } = import.meta.env;
	const [uselocale, setUseLocale] = useState(ko);

	const lang = useAppSelector(state => state.user.locale);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	useGlobalRouter.navigate = navigate;

	// 기본렌더링 완료 시 title 변경
	useEffect(() => {
		document.title = VITE_APP_TITLE;
		banner.banner();
	}, []);

	useEffect(() => {
		// antd locale 설정
		// 초기 locale 미 설정시
		if (commUtil.isEmpty(lang)) {
			dispatch(setLocale(Constants.LOCALE.DEFAULT));
		}
		setUseLocale(uselocale => {
			uselocale = lang === Constants.LOCALE.DEFAULT ? ko : en;
			return uselocale;
		});
	}, [lang]);

	return (
		<ConfigProvider
			theme={{
				hashed: false,
				token: {
					colorPrimary: '#007651',
					colorPrimaryBg: '#007651',
					fontFamily: 'Pretendard',
				},
				components: {
					Button: {
						controlHeightSM: 24,
						controlHeight: 30, // middle 버튼 높이 (기본)
						controlHeightLG: 40, // large 버튼 높이 (default 40)
						paddingSM: 8,
						padding: 16,
						paddingLG: 32,
						paddingXL: 36,
						borderRadius: 4,
						fontSizeSM: 14,
						fontSize: 12,
						fontSizeLG: 16,
						fontSizeXL: 18,
					},
					Form: {
						borderRadius: 0,
						labelColor: '#333', // 라벨 텍스트 색상
						labelFontSize: 12, // 라벨 폰트 크기
						itemMarginBottom: 16, // 각 form item 간 간격
						verticalLabelPadding: 4, // 수직 폼에서 라벨과 필드 간 padding
						colorTextPlaceholder: '#C6C6C6',
					},
					Input: {
						controlHeight: 24, // middle
						controlHeightSM: 24, // small
						controlHeightLG: 24, // large
						fontSize: 12, // middle size 폰트 크기
						fontSizeSM: 12, // small size 폰트 크기
						fontSizeLG: 16, // large size 폰트 크기
						colorText: '#333', // 텍스트 색상
						colorTextDisabled: '#B3B3B3',
						colorTextPlaceholder: '#C6C6C6',
						colorBorder: '#c6c6c6', // 기본 border 색상
						colorBgContainer: '#fff', // 배경색
						colorPrimary: '#007651', // primary 색상
						activeBg: '#fff',
						activeBorderColor: '#007651',
						padding: 8, // padding
					},
					Select: {
						controlHeight: 30,
						controlHeightSM: 24,
						controlHeightLG: 40,
						borderRadius: 0, // 모서리 둥글기
						fontSize: 12, // middle size 폰트 크기
						fontSizeSM: 14, // small size 폰트 크기
						fontSizeLG: 16, // large size 폰트 크기
						colorBorder: '#c6c6c6', // 기본 border 색상
						colorBgContainer: '#fff', // 배경색
						colorText: '#333', // 텍스트 색상
						colorTextDisabled: '#B3B3B3',
						colorPrimary: '#007651', // primary 색상
						optionSelectedColor: '#fff', // 선택된 옵션 텍스트 색상
						optionSelectedBg: '#007651', // 선택된 옵션 배경색
						optionActiveBg: '#f2f2f2', //hover
						optionFontSize: 12,
						optionPadding: 8,
						optionHeight: 24, // 옵션 높이
					},
					DatePicker: {
						controlHeight: 24,
						fontSize: 12,
						colorPrimary: '#007651',
						colorBgContainer: '#fff',
						borderRadius: 0,
						activeBg: '#fff',
						colorBgContainerDisabled: '#F2F2F2',
						colorTextDisabled: '#B3B3B3',
						colorText: '#333', // 텍스트 색상
						colorBorder: '#c6c6c6',
					},
					Modal: {
						// modal 기본 스타일
						borderRadius: 0,
						fontSize: 12,
						colorText: '#333', // 텍스트 색상
						colorTextPlaceholder: '#C6C6C6',
						colorBgContainer: '#fff', // 배경색
						colorBorder: '#c6c6c6', // 기본 border 색상
						colorPrimary: '#007651', // primary 색상
					},
					Radio: {
						fontSize: 12,
					},
					Checkbox: {
						fontSize: 12,
					},
					Tabs: {
						itemColor: '#333',
						itemSelectedColor: '#007651',
						itemHoverColor: '#007651',
						inkBarColor: '#007651',
						cardBg: '#fff',
						horizontalItemGutter: 0, //수평 탭 간 간격
						titleFontSize: 12,
						cardHeight: 32,
					},
					Pagination: {
						borderRadius: 0,
						fontSize: 14,
						itemSize: 36,
						itemActiveBg: '#fff',
						itemLinkBg: '#333',
						itemBg: '#f5f5f5',
						colorText: '#333', // 텍스트 색상
						itemInputBg: '#fff',
					},
				},
			}}
			locale={uselocale}
			componentSize="small"
		>
			<div className="App">
				<RouteIndex />
				<Loading />
				<LoadingText />	
			</div>
		</ConfigProvider>
	);
};

export default App;
