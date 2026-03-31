import { useNavigate } from 'react-router-dom';

const Index = () => {
	const navigate = useNavigate();

	const movePage = (path: string) => {
		navigate(path);
	};

	useEffect(() => {
		// 다국어 기본 셋팅
		const getAccessToken = localStorage.getItem('accessToken');
		// 토큰 확인 후 redirect
		if (commUtil.isEmpty(getAccessToken)) {
			// 로그인 화면 이동
			const savedLoginPage = localStorage.getItem('savedLoginPage') || '/custLogin';
			movePage(savedLoginPage);
		} else {
			// home 화면 이동
			movePage('/home');
		}
	}, []);

	return <></>;
};

export default Index;
