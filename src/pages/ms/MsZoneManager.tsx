/*
 ############################################################################
 # FiledataField	: MsZoneManager.tsx
 # Description		: 기준정보 > 센터기준정보 > 존정보
 # Author			: JeongHyeongCheol
 # Since			: 25.05.27
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils
import { showConfirm } from '@/util/MessageUtil';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsZoneManagerDetail from '@/components/ms/zone/MsZoneManagerDetail';
import MsZoneManagerSearch from '@/components/ms/zone/MsZoneManagerSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsZoneManager';
import { useAppSelector } from '@/store/core/coreHook';

// hooks

const MsZoneManager = () => {
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
	// 물류센터 코드
	const [dccode, setDccode] = useState([globalVariable.gDccode]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridChange, setGridChange] = useState(true);

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
			setGridData(res.data);
			setGridChange(true);
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.dccode) {
			setDccode(changedValues.dccode);
		}

		// if (changedValues.zone && allValues.zone.includes('')) {
		// 	form.setFieldValue('zone', '');
		// }
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
			<SearchFormResponsive form={form} onValuesChange={onValuesChange}>
				<MsZoneManagerSearch form={form} dccode={dccode} gridChange={gridChange} setGridChange={setGridChange} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsZoneManagerDetail ref={gridRef} gridData={gridData} dccode={dccode} search={searchMasterListRun} />
		</>
	);
};
export default MsZoneManager;
