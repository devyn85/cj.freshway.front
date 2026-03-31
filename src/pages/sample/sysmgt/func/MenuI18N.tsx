/*
 ############################################################################
 # FiledataField	: MenuI18N.tsx
 # Description		: 메뉴다국어관리
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
import DetailMenuI18N from '@/components/sysmgt/func/menuI18N/DetailMenuI18N';
import SearchMenuI18N from '@/components/sysmgt/func/menuI18N/SearchMenuI18N';

// API Call Function
import { apiGetmenuI18nList, apiPostmenuI18nSave } from '@/api/common/apiSysmgt';

const MenuI18N = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	//검색영역 초기 세팅
	const [searchBox] = useState({});

	// 다국어
	const { t } = useTranslation();
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
	### 조회버튼 ###
	*/
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetmenuI18nList(params).then(res => {
			setGridData(res.data);
		});
	};

	/*
	### 저장버튼 ###
	*/
	const save = () => {
		// 변경 데이터 확인
		const menuI18Ns = gridRef.current.getChangedData();
		if (!menuI18Ns || menuI18Ns.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				menuI18Ns: menuI18Ns,
			};
			apiPostmenuI18nSave(params).then(() => {
				search();
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, //조회
		saveYn: save, //저장
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	//화면 초기 세팅
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchMenuI18N search={search} />
			</SearchForm>
			{/* 화면 상세 영역 정의 */}
			<DetailMenuI18N ref={gridRef} data={gridData} />
		</>
	);
};
export default MenuI18N;
