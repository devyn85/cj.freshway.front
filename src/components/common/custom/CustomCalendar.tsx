/*
 ############################################################################
 # FiledataField	: CustomCalendar.tsx
 # Description		: 커스텀 달력
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// css
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
// lib
import React, { useEffect, useRef } from 'react';
import Calendar from '@toast-ui/react-calendar';
import { Button } from 'antd';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import Icon from '@/components/common/Icon';

interface Props {
	calendarDate: any;
	setCalendarDate: any;
	calendarEvent: any;
	calendars?: any;
	addCallback?: any;
	modifyCallback?: any;
	removeCallback?: any;
}

const CustomCalendar = (props: Props) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { calendarDate, setCalendarDate, calendarEvent, calendars, addCallback, modifyCallback, removeCallback } =
		props;

	const calendarRef = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const initEvent = () => {
		const instance = calendarRef.current?.getInstance?.();
		/**
		 * 신규 생성 이벤트
		 */
		instance?.on?.('beforeCreateEvent', (event: any) => {
			instance?.createEvents?.([event]);
			addCallback(event);
		});
		/**
		 * 업데이트 이벤트
		 */
		instance?.on?.('beforeUpdateEvent', ({ event, changes }: any) => {
			const { id, calendarId } = event;
			instance?.updateEvent?.(id, calendarId, changes);
			modifyCallback(id, calendarId, changes, event);
		});
		/**
		 * 삭제 이벤트
		 */
		instance?.on?.('beforeDeleteEvent', (event: any) => {
			instance?.deleteEvent?.(event.id, event.calendarId);
			removeCallback(event.id, event.calendarId);
		});
	};

	/**
	 * 월 변경
	 * @param {string} target 이동할 위치
	 */
	const moveCalendar = (target: string) => {
		const instance = calendarRef.current?.getInstance?.();
		switch (target) {
			case 'prev':
				instance?.prev?.();
				break;
			case 'next':
				instance?.next?.();
				break;
			case 'today':
				instance?.today?.();
				break;
		}
		setYearAndMonth();
	};

	/**
	 * 월 설정
	 */
	const setYearAndMonth = () => {
		const instance = calendarRef.current?.getInstance?.();
		setCalendarDate((date: any) => {
			date.year = (instance?.getDate?.() || new Date()).getFullYear();
			date.month = ((instance?.getDate?.() || new Date()).getMonth() + 1);
			return { ...date };
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		// 이벤트 설정
		initEvent();
		// 초기 날짜 설정
		setYearAndMonth();
	}, []);

	return (
		<>
			<div>
				<div className="calendar-header">
					{(calendarDate?.year ?? new Date().getFullYear())}.{(calendarDate?.month ?? (new Date().getMonth()+1))}
					<ButtonWrap data-props="calendar-btn">
						<Button
							onClick={() => {
								moveCalendar('prev');
							}}
						>
							<Icon icon="icon-tab-chevron-left-24-px" />
						</Button>
						<Button
							onClick={() => {
								moveCalendar('today');
							}}
						>
							Today
						</Button>
						<Button
							onClick={() => {
								moveCalendar('next');
							}}
						>
							<Icon icon="icon-tab-chevron-right-24-px" />
						</Button>
					</ButtonWrap>
				</div>
			</div>
			<Calendar
				ref={calendarRef}
				view="month"
				month={{
					// dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
					isAlways6Weeks: false,
				}}
				calendars={calendars}
				events={calendarEvent}
				usageStatistics={false}
				useFormPopup={true}
				useDetailPopup={true}
				timezone={{ zones: [{ timezoneName: 'Asia/Seoul' }] }}
			/>
		</>
	);
};

export default CustomCalendar;
