// Lib
import { Form } from 'antd';

// Util

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsDirectDlvGroupDetail from '@/components/ms/directDlvGroup/MsDirectDlvGroupDetail';
import MsDirectDlvGroupSearch from '@/components/ms/directDlvGroup/MsDirectDlvGroupSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsDirectDlvGroup';

// hooks

const MsDirectDlvGroup = () => {
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
		const params = form.getFieldsValue();
		gridRef.current.clearGridData();
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
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
				<MsDirectDlvGroupSearch />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsDirectDlvGroupDetail
				// form={detailForm}
				ref={gridRef}
				gridData={gridData}
			/>
		</>
	);
};
export default MsDirectDlvGroup;
