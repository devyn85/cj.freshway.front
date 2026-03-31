/*
 ############################################################################
 # FiledataField	: KpOrderQtyStoInfo.tsx
 # Description		: 지표 > 센터운영지표 > 이체 및 출고현황
 # Author			: JeongHyeongCheol
 # Since			: 25.11.20
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import { apiGetDetailList, apiGetMasterList } from '@/api/kp/apiKpOrderQtyStoInfo';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpOrderQtyStoInfoDetail from '@/components/kp/orderQtyStoInfo/KpOrderQtyStoInfoDetail';
import KpOrderQtyStoInfoSearch from '@/components/kp/orderQtyStoInfo/KpOrderQtyStoInfoSearch';

// API Call Function

// hooks

const KpOrderQtyStoInfo = () => {
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
	const [gridData2, setGridData2] = useState([]);
	// 기준월
	const [deliverydate, setDeliverydate] = useState('');

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridRef2 = useRef(null);

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
	const searchMasterListRun = async () => {
		const params = form.getFieldsValue();
		// 입력 값 검증
		if (params) {
			const isValid = await validateForm(form);
			if (!isValid) {
				return;
			}
		}
		params.deliverydate = params.deliverydate.format('YYYYMM');
		setDeliverydate(params.deliverydate);
		gridRef.current.clearGridData();
		gridRef2.current.clearGridData();
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
		});
		apiGetDetailList(params).then(res => {
			setGridData2(res.data);
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
				<KpOrderQtyStoInfoSearch />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<KpOrderQtyStoInfoDetail
				ref={gridRef}
				gridRef2={gridRef2}
				gridData={gridData}
				gridData2={gridData2}
				search={searchMasterListRun}
				deliverydate={deliverydate}
			/>
		</>
	);
};
export default KpOrderQtyStoInfo;
