// CSS

// Lib
import { Form } from 'antd';

// Util
import dayjs from 'dayjs';

// Type

// Component
import { apiGetMasterList } from '@/api/kp/apiKpDpInspectMonitoring';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpDpInspectMonitoringDetail from '@/components/kp/dpInspectMonitoring/KpDpInspectMonitoringDetail';
import KpDpInspectMonitoringSearch from '@/components/kp/dpInspectMonitoring/KpDpInspectMonitoringSearch';

// Store

// API

const KpWdLoadMonitoring = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		basedtRange: [dayjs(), dayjs()],
		useYn: '',
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 조회
	const searchMasterList = () => {
		refs.gridRef1.current.clearGridData();
		refs.gridRef2.current.clearGridData();
		const params = form.getFieldsValue();

		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		// Test Data
		// params.fromSlipdt = '20240304';
		// params.toSlipdt = '20240304';

		// validation
		// 조회기간 30일 초과 체크
		const fromDate = dayjs(params.deliveryDateFrom, 'YYYYMMDD');
		const toDate = dayjs(params.deliveryDateTo, 'YYYYMMDD');

		const diffDays = toDate.diff(fromDate, 'day');
		if (diffDays > 30) {
			showAlert('', '조회기간은 최대 30일을 초과할 수 없습니다.');
			return;
		}

		// 조회생성
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
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

			{/* 검색영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<KpDpInspectMonitoringSearch ref={refs} form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<KpDpInspectMonitoringDetail
				ref={refs}
				callBackFn={searchMasterList}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
			/>
		</>
	);
};

export default KpWdLoadMonitoring;
