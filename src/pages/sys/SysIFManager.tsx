/*
 ############################################################################
 # FiledataField	: SysIFManager.tsx
 # Description		: 시스템운영 > 인터페이스모니터링 > 인터페이스 상태관리
 # Author			: KimJiSoo
 # Since			: 25.08.01
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/sys/apiSysIFManager';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
// import { CheckBox, InputText, InputTextArea, SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import SysIFManagerDetail from '@/components/sys/ifManager/SysIFManagerDetail';
import SysIFManagerSearch from '@/components/sys/ifManager/SysIFManagerSearch';

const SysIFManager = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	//검색영역 초기 세팅
	const [searchBox] = useState({
		eaiMngChYn: '1', // 초기값 설정_EAI 송신대상자만 조회
	});
	const onChange = (value: string) => {};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);

		const formData = form.getFieldsValue();
		const params = {
			...formData,
		};

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" name={t('lbl.IF_MANAGER')} func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<SysIFManagerSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			{/* 그리드 영역 정의 */}
			<SysIFManagerDetail ref={refs} form={detailForm} data={gridData} callBackFn={searchMasterList} />
		</>
	);
};

export default SysIFManager;
