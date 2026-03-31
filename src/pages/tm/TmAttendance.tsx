/*
 ############################################################################
 # FiledataField	: TmAttendance.tsx
 # Description		: 근태관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.16
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmAttendanceDetail from '@/components/tm/attendance/TmAttendanceDetail';
import TmAttendanceSearch from '@/components/tm/attendance/TmAttendanceSearch';

// store

// API Call Function

// util
import { apiGetMasterList } from '@/api/tm/apiTmAttendance';
import { apiGetMasterList as searchCalendar } from '@/api/tm/apiTmCalendar';

// hook

// type

// asset
const TmAttendance = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [calendarData, setCalendarData] = useState([]);
	const [date, setDate] = useState('');
	const [dcCode, setDcCode] = useState('');
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		date: dayjs(),
		dcCode: gDccode,
		contractType: null, // 계약유형 초기값 설정
		carType: null, // 톤수 초기값 설정
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = () => {
		if (refs.gridRef.current.getChangedData().length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					searchApi();
				},
				() => {
					return false;
				},
			);
		} else {
			searchApi();
		}
	};
	const searchApi = () => {
		const params = form.getFieldsValue();
		const searchParam = {
			...params,
			yy: params.date.format('YYYY'),
			mm: params.date.format('MM'),
			date: params.date.format('YYYYMM'),
			dateTo: params.date.format('YYYYMM'),
		};

		apiGetMasterList(searchParam).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
		// 기존 : 달력이나 물류센터가 변경되어야 Calendar를 다시 조회 -> 변경 : 조회 시 무조건 Calendar 조회
		// if (date !== searchParam.date || dcCode !== searchParam.dcCode) {
		setDate(searchParam.date);
		setDcCode(searchParam.dcCode);
		searchCalendar(searchParam).then(res => {
			setCalendarData(res.data);
		});
		// }
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<TmAttendanceSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmAttendanceDetail
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				fnCallBack={searchMaterList}
				form={form}
				calendarData={calendarData}
			/>
		</>
	);
};

export default TmAttendance;
