/*
 ############################################################################
 # FiledataField	: RolesMappingUser.tsx
 # Description		: 권한별 사용자 관리
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';

// Utils

// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import AuthUserGrid from '@/components/sysmgt/func/rolesMappingUsers/AuthUserGrid';
import SearchRolesMappingUsers from '@/components/sysmgt/func/rolesMappingUsers/SearchRolesMappingUsers';
import UserAuthGrid from '@/components/sysmgt/func/rolesMappingUsers/UserAuthGrid';

// API Call Function

const RolesMappingUser = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	// 다국어
	const { t } = useTranslation();
	// location 정보
	const location = useLocation();

	const userIdParam = location.state.userId ?? '';

	//검색영역 초기화
	const [searchBox] = useState({
		include: '',
		userNm: userIdParam,
	});

	// 컴포넌트 접근을 위한 Ref
	const [currentKey, setCurrentKey] = useState('1');

	const authUserRef: any = useRef();
	const userAuthRef: any = useRef();

	/*
	 권한별 사용자 / 사용자별 권한 Tab 
	*/
	const items = [
		{
			label: t('sysmgt.rolesmappingusers.tap.authByUser'), //권한별 사용자
			key: '1',
			children: (
				<>
					<AuthUserGrid ref={authUserRef} form={form} />
				</>
			),
		},
		{
			label: t('sysmgt.rolesmappingusers.tap.userByAuth'), //사용자별 권한
			key: '2',
			children: (
				<>
					<UserAuthGrid ref={userAuthRef} form={form} />
				</>
			),
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회버튼 ###
    */
	const onClickSearchButton = () => {
		if (currentKey == '1') {
			authUserRef.current.searchAuthUser();
		} else {
			userAuthRef.current.searchUserAuth();
		}
	};
	/*
			### 저장버튼 ###
			*/
	const onClickeSaveButton = () => {
		if (currentKey == '1') {
			authUserRef.current.saveAuthUser();
		} else {
			userAuthRef.current.saveUserAuth();
		}
	};

	const onChangeTab = (key: string) => {
		setCurrentKey(key);
		window.dispatchEvent(new Event('resize'));
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: onClickSearchButton,
		saveYn: onClickeSaveButton,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchRolesMappingUsers search={onClickSearchButton} />
			</SearchForm>
			<Tabs defaultActiveKey="1" onChange={onChangeTab} items={items}></Tabs>
		</>
	);
};

export default RolesMappingUser;
