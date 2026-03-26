/*
 ############################################################################
 # FiledataField	: MsCenterPolicyMng.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터정책관리
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCenterPolicyMngDetail from '@/components/ms/centerPolicyMng/MsCenterPolicyMngDetail';
import MsCenterPolicyMngSearch from '@/components/ms/centerPolicyMng/MsCenterPolicyMngSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsCenterPolicyMng';
// hooks

const MsCenterPolicyMng = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [masterData, setMasterData] = useState(null);
	const gridRef = useRef(null);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [dccode, setDccode] = useState('');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param data
	 */

	const searchList = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setDccode(params.dccode);
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	const initEvent = () => {
		// gridRef.current.clearGridData();
		searchList();
	};

	const onValuesChange = (changedValues: any, allValues: any) => {
		searchList();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 첫진입시 체크박스 체크
	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle name={'센터정책관리'} />

			{/* 화면 상세 영역 정의 */}
			<SearchFormResponsive form={form} onValuesChange={onValuesChange}>
				<MsCenterPolicyMngSearch form={form} />
			</SearchFormResponsive>
			<MsCenterPolicyMngDetail
				ref={gridRef}
				gridData={gridData}
				totalCnt={totalCnt}
				search={searchList}
				dccode={dccode}
			/>
		</>
	);
};
export default MsCenterPolicyMng;
