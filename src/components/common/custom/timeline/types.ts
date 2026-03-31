import { TmEngineStepDto } from '@/api/tm/apiTmDispatch';
import dayjs from 'dayjs';

export interface TimeRange {
	startAt: dayjs.Dayjs; // "09:00"
	endAt: dayjs.Dayjs; // "24:00" or "48:00"
}

export interface TimelineEvent extends TmEngineStepDto {
	id: string;
	title: string;
	startAt: dayjs.Dayjs;
	spentTime: number;
	color?: string;
	opacity?: number;
	rowId: string;
	type?: string;
}

export interface TimelineRow {
	id: string;
	label: string;
	startWorkAt: dayjs.Dayjs;
	endWorkAt: dayjs.Dayjs;
	additionalInfo?: any;
}

export type TimeUnit = '30M' | '15M' | '5M';

export interface TimelineConfig {
	timeRange: TimeRange;
	rows: TimelineRow[];
	timeUnit: TimeUnit;
	/** 최소로 보여야 하는 시간 셀 개수 (기본값: 시간 범위에 따른 자연 개수) */
	minVisibleCells?: number;
	/** 선택된 task ID (파란색 border 강조) */
	selectedTaskId?: string;
	infoPanelRenderer?: (row: TimelineRow) => React.ReactNode;
	onTasksChange?: (tasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => void;
	onContextMenu?: (e: any, task: TimelineEvent) => void;
	onTaskClick?: (task: TimelineEvent) => void;
	onExternalDrop?: (
		taskIds: string[],
		rowId: string,
		time?: dayjs.Dayjs,
		scrollTo?: (time: dayjs.Dayjs) => void,
		isReturnOrder?: boolean,
	) => void;
	onMoveToList?: (task: TimelineEvent, id: string) => void;
	shouldForceSequential?: boolean;
}

/**
 * Timeline 컴포넌트의 외부에서 호출 가능한 메서드들
 * forwardRef를 통해 노출됨
 */
export interface TimelineHandle {
	/** 새 태스크를 특정 row에 삽입 */
	insertTask: (task: Omit<TimelineEvent, 'rowId'>, rowId: string, time?: dayjs.Dayjs) => void;

	/** 태스크를 다른 row로 이동 */
	moveTask: (taskId: string, targetRowId: string, time?: dayjs.Dayjs) => void;

	/** 태스크 삭제 */
	removeTask: (taskId: string) => TimelineEvent | undefined;

	/** 특정 시간으로 스크롤 */
	scrollToTime: (time: dayjs.Dayjs) => void;

	/** 특정 row로 스크롤 */
	scrollToRow: (rowId: string) => void;

	/** 특정 task로 스크롤 (row + 시간 동시 이동) */
	scrollToTask: (taskId: string) => void;

	/** 현재 tasks 상태 반환 */
	getTasks: () => TimelineEvent[];

	/** 특정 row의 태스크들을 순차 재배치 */
	reorderRow: (rowId: string) => void;
}
