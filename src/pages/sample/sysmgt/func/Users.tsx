/*
 ############################################################################
 # FiledataField	: Users.tsx
 # Description		: 사용자관리
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
import SearchForm from '@/components/common/custom/form/SearchForm';
// SearchBox 영역
import SearchUsers from '@/components/sysmgt/func/users/SearchUsers';
// Grid 영역
import DetailUsers from '@/components/sysmgt/func/users/DetailUsers';

// API Call Function
import { apiGetUserList, apiPostSaveUser } from '@/api/common/apiSysmgt';

const Users = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	// grid data
	const [gridData, setGridData] = useState([]);
	// 다국어
	const { t } = useTranslation();
	// 검색상자 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const [searchBox] = useState({ userId: '', userNm: '' });

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회 ###
    */
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetUserList(params).then(res => {
			const gridData = res.data;
			setGridData(gridData);
		});
	};

	/*
			### 저장 ###
			*/
	const save = () => {
		// 변경 데이터 확인
		const gridItem = gridRef.current.getChangedData(gridRef, {});

		// validation 실패 등
		if (!gridItem) {
			return;
		}
		if (gridItem.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				users: gridItem,
			};
			// 사용자 등록이 있는 경우에 임시 비밀번호 alert 발생
			apiPostSaveUser(params).then(res => {
				showAlert('', t('com.msg.confirmSaved'), () => {
					if (isCreateUser(gridItem)) {
						showAlert(null, t('sysmgt.users.message.initPassword', [res.data.initPwd]));
					}
				});
				search();
			});
		});
	};

	/**
	 * 그리드에 신규 데이터가 있는 경우 true 반환
	 * @param {Array} gridItem 그리드 데이터
	 * @returns {boolean} 신규 데이터 존재여부
	 */
	const isCreateUser = (gridItem: any[]) => {
		for (const item of gridItem) {
			if (item.rowStatus === 'I') {
				return true;
			}
			if (item.userStatus == '03') {
				return true;
			}
		}
		return false;
	};

	/**
	 * 메뉴 타이틀 함수
	 */
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
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 조회 조건 영역 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchUsers search={search} />
			</SearchForm>
			{/* 그리드 영역 */}
			<DetailUsers ref={gridRef} data={gridData} />
		</>
	);
};

export default Users;
