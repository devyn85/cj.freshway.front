/*
 ############################################################################
 # FiledataField	: CustomTimePicker.tsx
 # Description		: 커스텀 TimePicker
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import TuiTimePicker from 'tui-time-picker'; /* ES6 */
import 'tui-time-picker/dist/tui-time-picker.css';

interface TimeDataProps {
	hour?: number;
	minute?: number;
}

interface TimePickerProps {
	data: TimeDataProps;
	meridiem?: boolean;
	input?: string;
	onSelect?: any;
}

const CustomTimePicker = (props: TimePickerProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		data = {
			hour: 0,
			minute: 0,
		},
		meridiem = false,
		input = 'selectbox',
		onSelect,
	} = props;

	const refTimePicker = useRef(null);
	const [timePicker, setTimePicker] = useState(null);

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTimePicker(
			new TuiTimePicker(refTimePicker.current, {
				showMeridiem: meridiem,
				inputType: input,
			}),
		);
	}, []);

	useEffect(() => {
		if (timePicker !== null) {
			// 변경 이벤트
			timePicker.on('change', () => {
				onSelect(timePicker);
			});
			// 데이터 설정
			timePicker.setTime(data.hour, data.minute, true);
		}
	}, [data, timePicker]);

	return <div id="timepicker-selectbox" ref={refTimePicker} className="timepicker-wrap" />;
};

export default CustomTimePicker;
