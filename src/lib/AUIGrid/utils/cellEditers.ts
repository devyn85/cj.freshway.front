import dayjs from 'dayjs';

const DEFAULT_END_DATE = '29991231';

/**
 * 삭제여부 변경 시 종료일 처리 공통 함수
 */
export const handleDelYnChange = (
	grid: any,
	rowIndex: number,
	value: string,
	item: any,
	endDateField: string = 'toDate',
) => {
	if (!grid) return;

	let changedToDate;
	if (value === 'Y') {
		// item.fromDate가 오늘 +2보다 이후일 경우 적용종료일자를 fromDate로, 아니면 오늘 +2로 변경
		if (dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))) {
			changedToDate = dayjs(item.fromDate).format('YYYYMMDD');
		} else {
			changedToDate = dayjs().add(2, 'day').format('YYYYMMDD');
		}
	} else {
		changedToDate = DEFAULT_END_DATE;
	}
	grid.setCellValue(rowIndex, endDateField, changedToDate);
};

/**
 * 종료일 변경 시 삭제여부 처리 공통 함수
 */
export const handleEndDateChange = (grid: any, rowIndex: number, value: string, delYnField: string = 'delYn') => {
	if (!grid) return;

	const nextDelYn = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD')) ? 'N' : 'Y';
	grid.setCellValue(rowIndex, delYnField, nextDelYn);
};

/**
 * 공통 셀 편집 종료 핸들러
 */
export const createCellEditEndHandler = (options: {
	gridRef: React.RefObject<any>;
	onDelYnChange?: (grid: any, rowIndex: number, value: string, item: any) => void;
	onEndDateChange?: (grid: any, rowIndex: number, value: string) => void;
	onCustomFieldChange?: Record<string, (grid: any, rowIndex: number, value: string, item: any) => void>;
}) => {
	const { gridRef, onDelYnChange, onEndDateChange, onCustomFieldChange = {} } = options;

	return (event: { dataField?: string; rowIndex?: number; value?: any; item?: any }) => {
		const { dataField, rowIndex, value, item } = event;

		setTimeout(() => {
			const grid = gridRef.current;
			if (!grid || typeof rowIndex !== 'number') return;

			try {
				if (dataField === 'delYn' && onDelYnChange) {
					onDelYnChange(grid, rowIndex, value, item);
				} else if (dataField === 'toDate' && onEndDateChange) {
					onEndDateChange(grid, rowIndex, value);
				} else if (dataField && onCustomFieldChange[dataField]) {
					onCustomFieldChange[dataField](grid, rowIndex, value, item);
				}
			} catch (error) {}
		}, 100);
	};
};
