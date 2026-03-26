// Lib
import { Form } from 'antd';

// Util

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmAutoOrderSetupDetail from '@/components/om/autoOrderSetup/OmAutoOrderSetupDetail';
import OmAutoOrderSetupSearch from '@/components/om/autoOrderSetup/OmAutoOrderSetupSearch';

// API Call Function
import { apiGetMasterList } from '@/api/om/apiOmAutoOrderSetup';

// hooks

const OmAutoOrderSetup = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

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
	 
	/**
	 * 조회버튼 이벤트
	 * @returns {void}
	 */
	const searchMasterList = useCallback(() => {
		if (detailForm.getFieldValue('rowStatus') === 'U') {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	}, []);

	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		detailForm.resetFields();
		gridRef.current.clearGridData();
		const { skuName, ...params } = form.getFieldsValue();
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
			<SearchFormResponsive form={form}>
				<OmAutoOrderSetupSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<OmAutoOrderSetupDetail form={detailForm} ref={gridRef} gridData={gridData} />
		</>
	);
};
export default OmAutoOrderSetup;
