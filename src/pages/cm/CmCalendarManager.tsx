/*
 ############################################################################
 # FiledataField	: CmCalendarManager.tsx
 # Description		: 주문 > 주문목록 > 발주용휴일관리
 # Author			: YeoSeungCheol
 # Since			: 25.09.12
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Util

// Type

// Component
import CmCalendarManagerDetail from '@/components/cm/calendarManager/CmCalendarManagerDetail';
import CmCalendarManagerSearch from '@/components/cm/calendarManager/CmCalendarManagerSearch';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
import { apiGetMasterList } from '@/api/cm/apiCmCalendarManager';
import { useSelector } from 'react-redux';

// Store

const CmCalendarManager = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 물류센터 코드 상태
	const [dccode, setDccode] = useState([useSelector((state: any) => state.global.globalVariable.gDccode)]);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
		dateRange: null, // 일자 범위
		restYn: '', // 휴일유무
		restDesc: '', // 휴일내용
		dccode: dccode, // 물류센터
		calendarId: 'STD', // 구분 ('1000센터'(1000) 또는 공통('STD' | 'FW00'))
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
		if (gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 */
	const searchMasterListRun = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		gridRef.current.clearGridData();
		const formValues = form.getFieldsValue();

		// 날짜 범위 처리 (YYYY-MM-DD → YYYYMMDD)
		const params = { ...formValues };
		if (formValues.dateRange && formValues.dateRange.length === 2) {
			params.dateFrom = formValues.dateRange[0].format('YYYYMMDD');
			params.dateTo = formValues.dateRange[1].format('YYYYMMDD');
		}
		// dateRange는 API 호출에서 제외
		delete params.dateRange;

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);

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
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CmCalendarManagerSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<CmCalendarManagerDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchMasterList} />
		</>
	);
};

export default CmCalendarManager;
