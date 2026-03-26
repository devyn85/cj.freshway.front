import dayjs from 'dayjs';
import { TimelineEvent, TimelineRow } from '../types';

export interface TaskOperationOptions {
	/** 순차 배치 강제 여부 */
	shouldForceSequential?: boolean;
	/** row의 작업 시작 시간 */
	startWorkAt?: dayjs.Dayjs;
	/** 전체 rows 정보 (startWorkAt 조회용) */
	rows?: TimelineRow[];
}

/**
 * 특정 row의 태스크들을 시간순으로 정렬하고 겹치지 않게 순차 배치
 */
export const arrangeTasksSequentially = (
	tasks: TimelineEvent[],
	rowId: string,
	startWorkAt: dayjs.Dayjs,
): TimelineEvent[] => {
	const rowTasks = tasks.filter(t => t.rowId === rowId);
	const otherTasks = tasks.filter(t => t.rowId !== rowId);

	// 시간순 정렬
	rowTasks.sort((a, b) => a.startAt.diff(b.startAt));

	// 순차 배치
	let lastEndTime = startWorkAt;
	const arrangedTasks = rowTasks.map(task => {
		let adjustedStartAt = task.startAt;

		// 이전 태스크와 겹치면 뒤로 밀기
		if (adjustedStartAt.isBefore(lastEndTime)) {
			adjustedStartAt = lastEndTime;
		}

		const newTask = { ...task, startAt: adjustedStartAt };
		lastEndTime = adjustedStartAt.add(task.spentTime, 'minute');
		return newTask;
	});

	return [...otherTasks, ...arrangedTasks];
};

/**
 * row의 startWorkAt 시간을 가져오는 헬퍼
 */
const getRowStartWorkAt = (rowId: string, rows?: TimelineRow[], fallback?: dayjs.Dayjs): dayjs.Dayjs => {
	const row = rows?.find(r => r.id === rowId);
	return row?.startWorkAt || fallback || dayjs().startOf('day').hour(9);
};

/**
 * 태스크를 특정 row에 삽입
 * - shouldForceSequential이 true면 맨 앞에 삽입 후 순차 재배치
 * - false면 지정된 시간에 삽입
 */
export const insertTaskToRow = (
	tasks: TimelineEvent[],
	newTask: TimelineEvent,
	options?: TaskOperationOptions,
): TimelineEvent[] => {
	const { shouldForceSequential, rows } = options || {};
	const rowId = newTask.rowId;
	const startWorkAt = getRowStartWorkAt(rowId, rows, options?.startWorkAt);

	let taskToInsert = { ...newTask };

	if (shouldForceSequential) {
		// 맨 앞에 삽입하기 위해 1초 전 시간으로 설정
		taskToInsert.startAt = startWorkAt.subtract(1, 'second');
	}

	const updatedTasks = [...tasks, taskToInsert];

	// 순차 배치 적용
	return arrangeTasksSequentially(updatedTasks, rowId, startWorkAt);
};

/**
 * 태스크를 다른 row로 이동
 * - 같은 row 내 이동: 시간만 변경 후 순차 재배치
 * - 다른 row로 이동: rowId 변경 후 순차 재배치
 */
export const moveTaskToRow = (
	tasks: TimelineEvent[],
	taskId: string,
	targetRowId: string,
	targetTime: dayjs.Dayjs,
	options?: TaskOperationOptions,
): TimelineEvent[] => {
	const { shouldForceSequential, rows } = options || {};
	const startWorkAt = getRowStartWorkAt(targetRowId, rows, options?.startWorkAt);

	const originalTask = tasks.find(t => t.id === taskId);
	if (!originalTask) return tasks;

	const isMovingToAnotherRow = originalTask.rowId !== targetRowId;

	let newStartTime = targetTime;

	// 다른 row로 이동하면서 순차 배치 강제인 경우, 맨 앞으로
	if (shouldForceSequential && isMovingToAnotherRow) {
		newStartTime = startWorkAt.subtract(1, 'second');
	}

	// 태스크 업데이트
	const updatedTasks = tasks.map(t =>
		t.id === taskId ? { ...t, startAt: newStartTime, rowId: targetRowId } : t,
	);

	// 대상 row 순차 재배치
	let result = arrangeTasksSequentially(updatedTasks, targetRowId, startWorkAt);

	// 다른 row로 이동한 경우, 원래 row도 재배치
	if (isMovingToAnotherRow) {
		const originalRowStartWorkAt = getRowStartWorkAt(originalTask.rowId, rows, options?.startWorkAt);
		result = arrangeTasksSequentially(result, originalTask.rowId, originalRowStartWorkAt);
	}

	return result;
};

/**
 * 태스크 삭제 후 해당 row 재배치
 * - 삭제된 태스크 뒤의 태스크들을 앞으로 당김
 */
export const removeTaskFromRow = (
	tasks: TimelineEvent[],
	taskId: string,
	options?: TaskOperationOptions,
): { tasks: TimelineEvent[]; removedTask: TimelineEvent | undefined } => {
	const { rows } = options || {};
	const removedTask = tasks.find(t => t.id === taskId);

	if (!removedTask) {
		return { tasks, removedTask: undefined };
	}

	const rowId = removedTask.rowId;
	const startWorkAt = getRowStartWorkAt(rowId, rows, options?.startWorkAt);

	// 태스크 제거
	const filteredTasks = tasks.filter(t => t.id !== taskId);

	// 해당 row 순차 재배치
	const result = arrangeTasksSequentially(filteredTasks, rowId, startWorkAt);

	return { tasks: result, removedTask };
};

/**
 * 태스크 순서 변경 (같은 row 내에서 드래그로 순서 변경)
 */
export const reorderTaskInRow = (
	tasks: TimelineEvent[],
	taskId: string,
	newIndex: number,
	options?: TaskOperationOptions,
): TimelineEvent[] => {
	const { rows } = options || {};
	const task = tasks.find(t => t.id === taskId);
	if (!task) return tasks;

	const rowId = task.rowId;
	const startWorkAt = getRowStartWorkAt(rowId, rows, options?.startWorkAt);

	// 해당 row의 태스크들만 추출 후 정렬
	const rowTasks = tasks.filter(t => t.rowId === rowId).sort((a, b) => a.startAt.diff(b.startAt));
	const otherTasks = tasks.filter(t => t.rowId !== rowId);

	// 현재 인덱스 찾기
	const currentIndex = rowTasks.findIndex(t => t.id === taskId);
	if (currentIndex === -1 || currentIndex === newIndex) return tasks;

	// 순서 변경
	const [movedTask] = rowTasks.splice(currentIndex, 1);
	rowTasks.splice(newIndex, 0, movedTask);

	// 시간 재할당
	let lastEndTime = startWorkAt;
	const reorderedTasks = rowTasks.map(t => {
		const newTask = { ...t, startAt: lastEndTime };
		lastEndTime = lastEndTime.add(t.spentTime, 'minute');
		return newTask;
	});

	return [...otherTasks, ...reorderedTasks];
};

/**
 * 겹치는 태스크들 찾기
 */
export const findOverlappingTasks = (
	tasks: TimelineEvent[],
	rowId: string,
	startTime: dayjs.Dayjs,
	duration: number,
): TimelineEvent[] => {
	const endTime = startTime.add(duration, 'minute');

	return tasks.filter(t => {
		if (t.rowId !== rowId) return false;

		const taskEnd = t.startAt.add(t.spentTime, 'minute');

		// 겹침 조건: 시작이 다른 태스크 끝 전이고, 끝이 다른 태스크 시작 후
		return startTime.isBefore(taskEnd) && endTime.isAfter(t.startAt);
	});
};

/**
 * 여러 row의 태스크들을 한번에 순차 재배치
 */
export const arrangeMultipleRowsSequentially = (
	tasks: TimelineEvent[],
	rowIds: string[],
	rows: TimelineRow[],
): TimelineEvent[] => {
	let result = [...tasks];

	for (const rowId of rowIds) {
		const startWorkAt = getRowStartWorkAt(rowId, rows);
		result = arrangeTasksSequentially(result, rowId, startWorkAt);
	}

	return result;
};
