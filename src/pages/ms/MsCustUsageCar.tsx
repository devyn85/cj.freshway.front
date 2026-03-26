/*
 ############################################################################
 # FiledataField	: MsCustUsageCar.tsx
 # Description		: 기준정보 > 거래처기준정보 > 거래처별전용차량정보
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils
import { showConfirm } from '@/util/MessageUtil';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCustUsageCarDetail from '@/components/ms/custUsageCar/MsCustUsageCarDetail';
import MsCustUsageCarSearch from '@/components/ms/custUsageCar/MsCustUsageCarSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsCustUsageCar';
import { useAppSelector } from '@/store/core/coreHook';

// hooks

const MsCustUsageCar = () => {
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

	const onValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.dccode) {
			const selectedCode = changedValues.dccode[0];
			const excludedCodes = ['0000', '0001', '0002'];

			if (changedValues.dccode.length === 1 && !excludedCodes.includes(selectedCode)) {
				setDccode(changedValues.dccode[0]);
			} else {
				setDccode(globalVariable.gDccode);
			}
		}
	};
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
		const searchDccode = form.getFieldValue('dccode');
		const params = form.getFieldsValue();
		params.dccode = searchDccode ? String(searchDccode) : null;

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
			<SearchFormResponsive form={form} onValuesChange={onValuesChange}>
				<MsCustUsageCarSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsCustUsageCarDetail ref={gridRef} gridData={gridData} search={searchMasterListRun} dccode={dccode} />
		</>
	);
};
export default MsCustUsageCar;
