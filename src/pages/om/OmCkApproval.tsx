/*
 ############################################################################
 # FiledataField	: OmCkApproval.tsx
 # Description		: 주문 > 주문요청 > CK주문결재내역
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmCkApprovalDetail from '@/components/om/ckApproval/OmCkApprovalDetail';
import OmCkApprovalSearch from '@/components/om/ckApproval/OmCkApprovalSearch';

// API Call Function
import { apiGetMasterList } from '@/api/om/apiOmCkApproval';

// hooks

const OmCkApproval = () => {
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
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterList = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		params.dateFrom = form.getFieldValue('deliverydate')[0].format('YYYYMMDD');
		params.dateTo = form.getFieldValue('deliverydate')[1].format('YYYYMMDD');
		delete params.deliverydate;
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
				<OmCkApprovalSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<OmCkApprovalDetail ref={gridRef} gridData={gridData} search={searchMasterList} />
		</>
	);
};
export default OmCkApproval;
