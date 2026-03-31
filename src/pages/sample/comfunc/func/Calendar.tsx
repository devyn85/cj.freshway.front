/*
 ############################################################################
 # FiledataField	: Calendar.tsx
 # Description		: 달력
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { TZDate } from '@toast-ui/calendar';
// component
import CustomCalendar from '@/components/common/custom/CustomCalendar';
import MenuTitle from '@/components/common/custom/MenuTitle';

const Calendar = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;

	const [calendarDate, setCalendarDate] = useState({
		year: '',
		month: '',
	});
	const [calendarEvent] = useState([
		// 1. 날짜 미지정 = 현재 날짜/시간
		{
			id: 1,
			calendarId: 'calendarExm',
			title: '테스트 일정 1',
			location: '테스트 위치',
			isAllday: false,
		},
		// 2. 날짜 미지정/Allday = 현재 날짜 00시
		{
			id: 2,
			calendarId: 'calendarExm',
			title: '테스트 일정 2',
			location: '테스트 위치2',
			isAllday: true,
		},
		// 3. 날짜 직접 지정 시
		{
			id: 3,
			calendarId: 'calendarExm',
			title: '테스트 일정 3',
			location: '테스트 위치',
			start: new TZDate(Date.now()).addDate(-5),
			end: new TZDate(Date.now()),
			backgroundColor: 'skyblue',
		},
		// 5. TZDate() 클래스로 날짜 생성 시
		{
			id: 4,
			calendarId: 'calendarExm',
			title: '테스트 장기 일정 4',
			start: new TZDate(Date.now()).addDate(3),
			end: new TZDate(Date.now()).addDate(7),
		},
	]);

	/**
	 * 캘린더 정보 (종류)
	 */
	const calendars = [
		{ id: 'cal1', name: 'Developer' },
		{ id: 'cal2', name: 'Operator' },
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 캘린더 추가 이벤트
	 * setCalendarEvent 추가 및 API 처리 필요
	 * @param {*} event 캘린더 추가 이벤트
	 * @returns {void}
	 */
	const addCalendar = (event: any) => {};

	/**
	 * 캘린더 업데이트 이벤트
	 * setCalendarEvent 추가 및 API 처리 필요
	 * @param {string} id calendar id
	 * @param {string} calendarId calendar id
	 * @param {*} changes 변경 값
	 * @param {*} event 변경 이벤트
	 * @returns {void}
	 */
	const modifyCalendar = (id: string, calendarId: string, changes: any, event: any) => {
		// API 호출하여 id, calendarId의 event 수정
	};

	/**
	 * 캘린더 삭제 이벤트
	 * setCalendarEvent 추가 및 API 처리 필요
	 * @param {string} id calendar id
	 * @param {string} calendarId calendar id
	 * @returns {void}
	 */
	const removeCalendar = (id: string, calendarId: string) => {
		// API 호출하여 id, calendarId event 삭제
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />
			{/* calendar */}
			<CustomCalendar
				calendars={calendars}
				calendarDate={calendarDate}
				setCalendarDate={setCalendarDate}
				calendarEvent={calendarEvent}
				addCallback={addCalendar}
				modifyCallback={modifyCalendar}
				removeCallback={removeCalendar}
			/>
		</>
	);
};

export default Calendar;
