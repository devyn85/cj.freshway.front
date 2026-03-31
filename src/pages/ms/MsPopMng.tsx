/*
 ############################################################################
 # FiledataField	: MsPopMng.tsx
 # Description		: 기준정보 > 권역기준정보 > 거래처별POP관리
 # Author			: JeongHyeongCheol
 # Since			: 25.07.18
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsPopMngDetail from '@/components/ms/popMng/MsPopMngDetail';
import MsPopMngSearch from '@/components/ms/popMng/MsPopMngSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsPopMng';

// store
import { useAppSelector } from '@/store/core/coreHook';

// hooks

const MsPopMng = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 물류센터코드
	const [dccode, setDccode] = useState(globalVariable.gDccode);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회버튼
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		gridRef.current.clearGridData();

		const params = form.getFieldsValue();
		apiGetMasterList(params).then(res => {
			if (res.data) {
				setGridData(res.data);
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	const onValuesChange = () => {
		setDccode(form.getFieldValue('dccode'));
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive
				form={form}
				initialValues={{
					custName: '',
					carName: '',
				}}
				onValuesChange={onValuesChange}
			>
				<MsPopMngSearch form={form} dccode={dccode} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsPopMngDetail ref={gridRef} gridData={gridData} dccode={dccode} search={searchMasterListRun} />
		</>
	);
};
export default MsPopMng;
