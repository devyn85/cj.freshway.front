/*
 ############################################################################
 # FiledataField	: RolesMappingMenu.tsx
 # Description		: 권한별 메뉴관리
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
 */

// Lib
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Form } from 'antd';

// Utils
// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import DetailRolesMappingMenu from '@/components/sysmgt/func/rolesMappingMenu/DetailRolesMappingMenu';
import SearchRolesMappingMenu from '@/components/sysmgt/func/rolesMappingMenu/SearchRolesMappingMenu';

// API Call Function
import { apiGetRoleList, apiPostSaveRolesMappingMenu } from '@/api/common/apiSysmgt';

const RolesMappingMenu = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	// grid data
	const [gridData, setGridData] = useState([]);
	const [searchBox] = useState({});
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회 ###
    */
	const search = () => {
		refs.gridRef.current.clearGridData();
		refs.gridRef2.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetRoleList(params).then(res => {
			setGridData(res.data);
		});
	};

	/*
    ### 저장 ###
    */
	const save = () => {
		// 변경 데이터 확인
		const roleMenus = refs.gridRef2.current.getChangedData();
		if (!roleMenus || roleMenus.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				roleMenus: roleMenus,
			};
			apiPostSaveRolesMappingMenu(params).then(() => {
				search();
			});
		});
	};

	const titleFunc = {
		searchYn: search,
		saveYn: save,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 검색상자 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	// HTML 랜더링이 완료되면
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchRolesMappingMenu search={search} />
			</SearchForm>
			<DetailRolesMappingMenu ref={refs} data={gridData} />
		</>
	);
};

export default RolesMappingMenu;
