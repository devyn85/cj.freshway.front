import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { TimelineConfig, TimelineEvent, TimelineRow, TimeRange } from '../types';
import {
	arrangeTasksSequentially,
	insertTaskToRow,
	moveTaskToRow,
	removeTaskFromRow,
	reorderTaskInRow,
	TaskOperationOptions,
} from '../utils/taskOperations';

export interface UseTimelineActionsProps {
	tasks: TimelineEvent[];
	rows: TimelineRow[];
	timeRange: TimeRange;
	onTasksChange?: (tasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => void;
	shouldForceSequential?: boolean;
}

export interface TimelineActions {
	/**
	 * 새 태스크를 특정 row에 삽입
	 * @param task - 삽입할 태스크 (id 제외 가능)
	 * @param rowId - 대상 row ID
	 * @param time - 삽입 시간 (optional, shouldForceSequential이면 무시됨)
	 */
	insertTask: (task: Omit<TimelineEvent, 'rowId'> & { rowId?: string }, rowId: string, time?: dayjs.Dayjs) => void;

	/**
	 * 태스크를 다른 row로 이동
	 * @param taskId - 이동할 태스크 ID
	 * @param targetRowId - 대상 row ID
	 * @param time - 이동 시간 (optional)
	 */
	moveTask: (taskId: string, targetRowId: string, time?: dayjs.Dayjs) => void;

	/**
	 * 태스크 삭제
	 * @param taskId - 삭제할 태스크 ID
	 * @returns 삭제된 태스크 정보
	 */
	removeTask: (taskId: string) => TimelineEvent | undefined;

	/**
	 * 특정 row의 태스크들을 순차 재배치
	 * @param rowId - 대상 row ID
	 */
	reorderRow: (rowId: string) => void;

	/**
	 * 같은 row 내에서 태스크 순서 변경
	 * @param taskId - 이동할 태스크 ID
	 * @param newIndex - 새 인덱스
	 */
	reorderTaskByIndex: (taskId: string, newIndex: number) => void;

	/**
	 * 태스크 시간 업데이트
	 * @param taskId - 업데이트할 태스크 ID
	 * @param newTime - 새 시작 시간
	 */
	updateTaskTime: (taskId: string, newTime: dayjs.Dayjs) => void;
}

export const useTimelineActions = ({
	tasks,
	rows,
	timeRange,
	onTasksChange,
	shouldForceSequential = false,
}: UseTimelineActionsProps): TimelineActions => {
	const options = useMemo<TaskOperationOptions>(
		() => ({
			shouldForceSequential,
			rows,
			startWorkAt: timeRange.startAt,
		}),
		[shouldForceSequential, rows, timeRange.startAt],
	);

	const insertTask = useCallback(
		(task: Omit<TimelineEvent, 'rowId'> & { rowId?: string }, rowId: string, time?: dayjs.Dayjs) => {
			const row = rows.find(r => r.id === rowId);
			const startWorkAt = row?.startWorkAt || timeRange.startAt;

			const newTask: TimelineEvent = {
				...task,
				rowId,
				startAt: time || startWorkAt,
			} as TimelineEvent;

			const updatedTasks = insertTaskToRow(tasks, newTask, options);
			onTasksChange?.(updatedTasks, rowId, newTask.id);
		},
		[tasks, rows, timeRange.startAt, options, onTasksChange],
	);

	const moveTask = useCallback(
		(taskId: string, targetRowId: string, time?: dayjs.Dayjs) => {
			const task = tasks.find(t => t.id === taskId);
			if (!task) return;

			const row = rows.find(r => r.id === targetRowId);
			const startWorkAt = row?.startWorkAt || timeRange.startAt;
			const targetTime = time || startWorkAt;

			const updatedTasks = moveTaskToRow(tasks, taskId, targetRowId, targetTime, options);
			onTasksChange?.(updatedTasks, targetRowId, taskId);
		},
		[tasks, rows, timeRange.startAt, options, onTasksChange],
	);

	const removeTask = useCallback(
		(taskId: string): TimelineEvent | undefined => {
			const { tasks: updatedTasks, removedTask } = removeTaskFromRow(tasks, taskId, options);

			if (removedTask) {
				onTasksChange?.(updatedTasks, removedTask.rowId, taskId);
			}

			return removedTask;
		},
		[tasks, options, onTasksChange],
	);

	const reorderRow = useCallback(
		(rowId: string) => {
			const row = rows.find(r => r.id === rowId);
			const startWorkAt = row?.startWorkAt || timeRange.startAt;

			const updatedTasks = arrangeTasksSequentially(tasks, rowId, startWorkAt);
			onTasksChange?.(updatedTasks, rowId);
		},
		[tasks, rows, timeRange.startAt, onTasksChange],
	);

	const reorderTaskByIndex = useCallback(
		(taskId: string, newIndex: number) => {
			const task = tasks.find(t => t.id === taskId);
			if (!task) return;

			const updatedTasks = reorderTaskInRow(tasks, taskId, newIndex, options);
			onTasksChange?.(updatedTasks, task.rowId, taskId);
		},
		[tasks, options, onTasksChange],
	);

	const updateTaskTime = useCallback(
		(taskId: string, newTime: dayjs.Dayjs) => {
			const task = tasks.find(t => t.id === taskId);
			if (!task) return;

			// 시간만 업데이트하고 같은 row 내에서 재배치
			const updatedTasks = moveTaskToRow(tasks, taskId, task.rowId, newTime, {
				...options,
				shouldForceSequential: false, // 시간 업데이트는 강제 순차 배치 안함
			});
			onTasksChange?.(updatedTasks, task.rowId, taskId);
		},
		[tasks, options, onTasksChange],
	);

	return {
		insertTask,
		moveTask,
		removeTask,
		reorderRow,
		reorderTaskByIndex,
		updateTaskTime,
	};
};
