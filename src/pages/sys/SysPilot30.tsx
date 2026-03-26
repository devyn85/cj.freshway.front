/*
 ############################################################################
 # FiledataField	: SysPilot30.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램
 # Author			: YeoSeungCheol
 # Since			: 25.05.09
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
import SysPilot30Detail from '@/components/sys/pilot30/SysPilot30Detail';
import SysPilot30Search from '@/components/sys/pilot30/SysPilot30Search';

// API Call Function
import { apiPostSaveSysPilot30, apiSearchSysPilot30List } from '@/api/sys/apiSysPilot30';

const Pliot30 = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	//검색영역 초기 세팅
	const [searchBox] = useState({});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiSearchSysPilot30List(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 저장
	const save = (): void => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('com.msg.confirmSave'), () => {
			apiPostSaveSysPilot30(menus).then(() => {
				search();
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, // 조회
		saveYn: save, // 저장
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	// 화면 초기 세팅
	useEffect(() => {
		//search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />

			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SysPilot30Search search={search} />
			</SearchForm>

			{/* 화면 상세 영역 정의 */}
			<SysPilot30Detail ref={gridRef} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default Pliot30;
