/*
 ############################################################################
 # FiledataField	: WdBeforeOrderAdjustRequest.tsx
 # Description		: 출고 > 출고작업 > 사전주문 조정의뢰
 # Author			: jangjaehyun
 # Since			: 25.09.25
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import WdBeforeOrderAdjustRequestDetail from '@/components/wd/beforeOrderAdjustRequest/WdBeforeOrderAdjustRequestDetail';
import WdBeforeOrderAdjustRequestSearch from '@/components/wd/beforeOrderAdjustRequest/WdBeforeOrderAdjustRequestSearch';

// API
import { apiGetMasterList } from '@/api/wd/apiWdBeforeOrderAdjustRequest';

// Store

const WdBeforeOrderAdjustRequest = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const CenterDocUserPopupModal = useRef(null);
	const CenterDocUserPopupRef = useRef(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		rangeSlipDt: [dayjs(), dayjs()],
		// multiDcCode: [gDccode],
		beforeorderYn: '',
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData() !== null && gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = async () => {
		gridRef.current.clearGridData();
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const params = {
			...form.getFieldsValue(),
			fromSlipDt: form.getFieldValue('rangeSlipDt')[0].format('YYYYMMDD'),
			toSlipDt: form.getFieldValue('rangeSlipDt')[1].format('YYYYMMDD'),
			multiSku: form.getFieldValue('skuCd'),
			multiToCustkey: form.getFieldValue('custKey'),
			stockYn: form.getFieldValue('stockYn') ? '1' : '0',
		};

		// const openCenterList = getCommonCodeList('OPENCENTER');

		// const isExist = multiDcCode.some((code: string) => openCenterList.some((center: any) => center.comCd === code));
		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// }

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length); // 전체 데이터 개수 설정

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdBeforeOrderAdjustRequestSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<WdBeforeOrderAdjustRequestDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMasterList}
			/>
		</>
	);
};
export default WdBeforeOrderAdjustRequest;
