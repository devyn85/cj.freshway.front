import {
	TmEngineStepDto,
	TmReturnOrderDto,
	TmUnassignedOrderDto,
	TmVehiclesDto,
} from '@/api/tm/apiTmDispatch';
import { Timeline } from '@/components/common/custom/timeline';
import { TimelineEvent, TimelineHandle, TimelineRow } from '@/components/common/custom/timeline/types';
import { arrangeTasksSequentially } from '@/components/common/custom/timeline/utils/taskOperations';
import { useOrderSelectionOptional } from '@/components/tm/TmPlan/contexts/OrderSelectionContext';
import VehicleSummary from '@/components/tm/TmPlan/Timeline/VehicleSummary';
import TmVehicleSelectModal from '@/components/tm/TmVehicleSelectModal';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import Konva from 'konva';
import {
	Dispatch,
	forwardRef,
	SetStateAction,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';

const colorMap = new Map<string, string>();
export const colorPalette = ['#6c5ce7', '#fd79a8', '#00b894', '#e17055', '#a29bfe', '#fab1a0', '#ff7675', '#74b9ff'];
export const colorById = (id: string) => {
	if (id === 'unassigned' || id === 'manual-split') return '#BDC2CE';
	if (colorMap.has(id)) return colorMap.get(id);
	const color = colorPalette[colorMap.size % colorPalette.length];
	colorMap.set(id, color);
	return color;
};

// 고정 거래처 색상: defCarno === carno (고정차량 연결정보 존재)
export const FIXED_TASK_COLOR = '#27AE60';
// 신규 거래처 색상: 고정차량 연결정보 없으며, defPop === basePop (대표POP 연결정보 존재)
export const NEW_TASK_COLOR = '#E67E22';
// 조정 거래처 색상: defCarno !== carno 또는 사용자 수동 조정
export const ADJUSTED_TASK_COLOR = '#9B59B6';

interface TmPlanTimelineProps {
	vehicles: TmVehiclesDto[];
	setVehicles: Dispatch<SetStateAction<TmVehiclesDto[]>>;
	filteredVehicles: TmVehiclesDto[];
	selectedVehicleId?: string;
	setSelectedVehicleId: Dispatch<SetStateAction<string>>;
	selectedOrderId?: string;
	setSelectedOrderId: Dispatch<SetStateAction<string>>;
	planCarList: any[];
	isManualMode: boolean;
	setIsDataChanged: Dispatch<SetStateAction<boolean>>;
	setChangedRows: Dispatch<SetStateAction<string[]>>;
	unassignedOrders: TmUnassignedOrderDto[];
	setUnassignedOrders: Dispatch<SetStateAction<TmUnassignedOrderDto[]>>;
	returnOrders: TmReturnOrderDto[];
	setReturnOrders: Dispatch<SetStateAction<TmReturnOrderDto[]>>;
	changedRows: string[];
	onDeleteVehicle?: (vehicleId: string) => void;
	onVehicleCarnoChange?: (oldUniqueId: string, oldCarno: string) => void;
	custFilterCode?: string;
}

export interface TmPlanTimelineHandle {
	scrollToOrder: (orderId: string) => void;
	clearEditedTasks: () => void;
	dispatchOrders: (taskIds: string[], vehicleId: string, isReturnOrder?: boolean) => void;
}

// TmVehiclesDto를 확장하여 lastModifiedAt 필드 추가 (프론트엔드 전용)
type TmVehicleWithModified = TmVehiclesDto & { lastModifiedAt?: number };

/**
 * 모든 차량의 회차번호(roundSeq)를 재계산하는 함수
 * 동일한 차량번호(carno)를 가진 차량들에 대해 lastModifiedAt 기준으로 정렬 후 순서대로 1, 2, 3... 를 부여
 * - lastModifiedAt이 없거나 가장 오래된 차량이 1회차
 * - 최근에 변경/추가된 차량이 더 높은 회차 번호를 받음
 * @param vehicles 차량 목록
 * @param modifiedVehicleId 이번에 변경된 차량 ID (해당 차량의 lastModifiedAt을 현재 시간으로 업데이트)
 * @returns { vehicles: 업데이트된 차량 목록, changedVehicleIds: roundSeq가 변경된 차량 ID 목록 }
 */
export const recalculateRoundSeq = (
	vehicles: TmVehicleWithModified[],
	modifiedVehicleId?: string,
): { vehicles: TmVehicleWithModified[]; changedVehicleIds: string[] } => {
	const changedVehicleIds: string[] = [];
	const now = Date.now();

	// 1. 변경된 차량의 lastModifiedAt 업데이트
	const vehiclesWithTimestamp = vehicles.map(vehicle => {
		if (modifiedVehicleId && vehicle.uniqueId === modifiedVehicleId) {
			return { ...vehicle, lastModifiedAt: now };
		}
		return vehicle;
	});

	// 2. 차량번호(carno)별로 그룹화
	const carnoGroupMap = new Map<string, TmVehicleWithModified[]>();
	vehiclesWithTimestamp.forEach(vehicle => {
		// unassigned 차량은 회차번호 계산하지 않음
		if (vehicle.carno === 'unassigned' || vehicle.carno.startsWith('unassigned')) {
			return;
		}
		const carno = vehicle.carno;
		if (!carnoGroupMap.has(carno)) {
			carnoGroupMap.set(carno, []);
		}
		carnoGroupMap.get(carno)!.push(vehicle);
	});

	// 3. 각 그룹 내에서 lastModifiedAt 기준으로 정렬하여 roundSeq 할당
	const roundSeqMap = new Map<string, number>(); // uniqueId -> roundSeq
	carnoGroupMap.forEach(group => {
		// lastModifiedAt 오름차순 정렬 (없으면 0으로 취급 = 가장 먼저)
		const sorted = [...group].sort((a, b) => (a.lastModifiedAt || 0) - (b.lastModifiedAt || 0));
		sorted.forEach((vehicle, index) => {
			if (vehicle.uniqueId) {
				roundSeqMap.set(vehicle.uniqueId, index + 1);
			}
		});
	});

	// 4. 최종 vehicles 배열 생성 (원래 순서 유지, roundSeq만 업데이트)
	const updatedVehicles = vehiclesWithTimestamp.map(vehicle => {
		// unassigned 차량은 그대로 반환
		if (vehicle.carno === 'unassigned' || vehicle.carno.startsWith('unassigned')) {
			return vehicle;
		}

		const newRoundSeq = roundSeqMap.get(vehicle.uniqueId!) || 1;

		// 기존 roundSeq와 비교하여 변경되었으면 changedVehicleIds에 추가
		if (vehicle.roundSeq !== newRoundSeq && vehicle.uniqueId) {
			changedVehicleIds.push(vehicle.uniqueId);
		}

		// steps 내 모든 항목의 roundSeq를 업데이트
		const updatedSteps = vehicle.steps.map(step => ({
			...step,
			roundSeq: newRoundSeq,
		}));

		return { ...vehicle, roundSeq: newRoundSeq, steps: updatedSteps };
	});

	return { vehicles: updatedVehicles, changedVehicleIds };
};

export const TmPlanTimeline = forwardRef<TmPlanTimelineHandle, TmPlanTimelineProps>(
	(
		{
			vehicles,
			filteredVehicles,
			setVehicles,
			setSelectedVehicleId,
			selectedOrderId,
			setSelectedOrderId,
			planCarList,
			selectedVehicleId,
			isManualMode,
			setIsDataChanged,
			setChangedRows,
			unassignedOrders,
			setUnassignedOrders,
			returnOrders,
			setReturnOrders,
			changedRows,
			onDeleteVehicle,
			onVehicleCarnoChange,
			custFilterCode,
		},
		ref,
	) => {
		Konva.pixelRatio = 2;
		// 다중 선택 Context (선택 초기화용)
		const selectionContext = useOrderSelectionOptional();

		const [changeTarget, setChangeTarget] = useState<{ carno: string; vehicleType: string; id: string } | null>(null);
		const editedTaskIdsRef = useRef<Set<string>>(new Set());
		const [renderKey, setRenderKey] = useState(0);
		const timelineRef = useRef<TimelineHandle>(null);

		// 외부에서 호출 가능한 메서드 노출
		useImperativeHandle(ref, () => ({
			scrollToOrder: (orderId: string) => {
				timelineRef.current?.scrollToTask(orderId);
			},
			clearEditedTasks: () => {
				editedTaskIdsRef.current = new Set();
				setRenderKey(prev => prev + 1);
			},
			dispatchOrders: (taskIds: string[], vehicleId: string, isReturnOrder?: boolean) => {
				const isFromBulkDispatch = true;
				handleExternalDrop(taskIds, vehicleId, undefined, undefined, isReturnOrder, isFromBulkDispatch);
			},
		}));

		// === 차량 관련 로직 ===
		const availableCarNumbers = useMemo(() => {
			return planCarList.filter((car: any) => {
				const isPriorityOn = car.priorityYn === 'Y';
				const isAlreadyAssigned = vehicles.some(v => v.carno === car.carno);
				if (isPriorityOn) return true;
				return !isAlreadyAssigned;
			});
		}, [planCarList, vehicles]);

		const onDirectVehicleSelect = useCallback(
			(vehicleId: string, index: number) => {
				const carInfo = availableCarNumbers[index];
				// 부분저장: 변경 전 차량 carno 추적 (서버에 빈 배열로 전달)
				const oldVehicle = vehicles.find(v => v.uniqueId === vehicleId);
				if (oldVehicle && !oldVehicle.carno.includes('unassigned')) {
					onVehicleCarnoChange?.(vehicleId, oldVehicle.carno);
				}
				setIsDataChanged(true);
				setVehicles(prevVehicles => {
					const capa = carInfo.carCapacity.replace('톤', '') + '톤';
					const updatedVehicles = prevVehicles.map(vehicle =>
						vehicle.uniqueId === vehicleId
							? {
									...vehicle,
									carno: carInfo.carno,
									carCapacity: capa,
									vehicleType: carInfo.contractTypeData1,
									contractType: carInfo.contractType,
									drivername: carInfo.driverName,
							  }
							: vehicle,
					);
					// 전체 회차번호 재계산 (변경된 차량 ID 전달하여 lastModifiedAt 업데이트)
					const { vehicles: recalculatedVehicles, changedVehicleIds } = recalculateRoundSeq(updatedVehicles, vehicleId);
					// 변경된 차량 + roundSeq가 변경된 차량들을 changedRows에 추가
					setChangedRows(prev => [...new Set([...prev, vehicleId, ...changedVehicleIds])]);
					return recalculatedVehicles;
				});
			},
			[availableCarNumbers, vehicles, onVehicleCarnoChange, setIsDataChanged, setChangedRows, setVehicles],
		);

		const onChangeVehicle = useCallback(
			(carno: string, vehicleType: string, id: string) => setChangeTarget({ carno, vehicleType, id }),
			[],
		);

		const handleCarNumberChange = (v: any, id: string) => {
			// 부분저장: 변경 전 차량 carno 추적 (서버에 빈 배열로 전달)
			const oldVehicle = vehicles.find(vehicle => vehicle.uniqueId === id);
			if (oldVehicle && !oldVehicle.carno.includes('unassigned')) {
				onVehicleCarnoChange?.(id, oldVehicle.carno);
			}
			setIsDataChanged(true);
			setVehicles(prevVehicles => {
				const capa = v.carCapacity.replace('톤', '') + '톤';
				const updatedVehicles = prevVehicles.map(vehicle =>
					vehicle.uniqueId === id
						? {
								...vehicle,
								carno: v.carno,
								carCapacity: capa,
								vehicleType: v.contractTypeData1,
								contractType: v.contractType,
								drivername: v.driverName,
						  }
						: vehicle,
				);
				// 전체 회차번호 재계산 (변경된 차량 ID 전달하여 lastModifiedAt 업데이트)
				const { vehicles: recalculatedVehicles, changedVehicleIds } = recalculateRoundSeq(updatedVehicles, id);
				// 변경된 차량 + roundSeq가 변경된 차량들을 changedRows에 추가
				setChangedRows(prev => [...new Set([...prev, id, ...changedVehicleIds])]);
				return recalculatedVehicles;
			});
		};

		// === 시간 범위 계산 ===
		const timeRange = useMemo(() => {
			let startAt: dayjs.Dayjs | undefined = undefined;
			let endAt: dayjs.Dayjs | undefined = undefined;

			vehicles.forEach(v =>
				v.steps.forEach(s => {
					if (s.arrival && s.arrival !== '0') {
						const date = dayjs(Number(s.arrival || 0) * 1000);
						if (!startAt || date.isBefore(startAt)) startAt = date;

						const endDate = date.clone().add(Math.ceil(Number(s.service || 0) / 60), 'minute');
						if (!endAt || endDate.isAfter(endAt)) endAt = endDate;
					}
				}),
			);

			if (startAt) {
				const minute = startAt.minute();
				startAt = minute < 30 ? startAt.minute(0).second(0) : startAt.minute(30).second(0);
			}

			if (endAt) {
				const minute = endAt.minute();
				if (minute === 0) endAt = endAt.second(0);
				else if (minute <= 30) endAt = endAt.minute(30).second(0);
				else endAt = endAt.add(1, 'hour').minute(0).second(0);
			}

			if (!startAt || !endAt) {
				startAt = dayjs().startOf('day').hour(9);
				endAt = dayjs().endOf('day').hour(23);
			}

			return { startAt, endAt };
		}, [vehicles]);

		// === Row/Task 데이터 변환 ===
		const getWorkAt = useCallback(
			(steps: TmEngineStepDto[]) => {
				const startAtUnix = steps.find(x => x.type === 'start')?.arrival;
				const startAt = startAtUnix && startAtUnix !== '0' ? dayjs(Number(startAtUnix) * 1000) : timeRange.startAt;

				const endAtUnix = steps.find(x => x.type === 'end')?.arrival;
				const endAt =
					endAtUnix && endAtUnix !== '0' ? dayjs(Number(endAtUnix) * 1000) : timeRange.endAt.subtract(30, 'minutes');

				return { startAt, endAt };
			},
			[timeRange],
		);

		const rows = useMemo(() => {
			if (!timeRange.endAt || !timeRange.startAt) return [];
			return filteredVehicles.map(vehicle => ({
				id: vehicle.uniqueId,
				label: vehicle.vehicleName,
				startWorkAt: getWorkAt(vehicle.steps).startAt,
				endWorkAt: getWorkAt(vehicle.steps).endAt,
				additionalInfo: {
					vehicle,
					isSelected: selectedVehicleId === vehicle.uniqueId,
					isChanged: changedRows.includes(vehicle.uniqueId),
				},
			}));
		}, [filteredVehicles, getWorkAt, timeRange, selectedVehicleId, changedRows]);

		// 거래처 필터 코드 파싱 (opacity 계산용)
		const custFilterCodes = useMemo(() => {
			if (!custFilterCode) return [];
			return custFilterCode
				.split(',')
				.map((c: string) => c.trim())
				.filter(Boolean);
		}, [custFilterCode]);

		const tasks = useMemo(() => {
			if (!timeRange.endAt || !timeRange.startAt) return [];
			return vehicles.flatMap(v =>
				v.steps
					.filter(s => s.type === 'job')
					.map(s => {
						const isEdited = editedTaskIdsRef.current.has(s.uniqueId);
						const getTaskColor = () => {
							// 조정 거래처: 사용자가 직접 이동/추가한 경우
							if (s._stepIndex === -1 || isEdited) return ADJUSTED_TASK_COLOR;
							// 고정 거래처: defCarno가 존재하고 현재 차량번호와 동일
							if (s.defCarno && s.defCarno === v.carno) return FIXED_TASK_COLOR;
							// 조정 거래처: defCarno가 존재하지만 현재 차량번호와 다름
							if (s.defCarno && s.defCarno !== v.carno) return ADJUSTED_TASK_COLOR;
							// 신규 거래처: 고정차량 연결정보 없으며, 대표POP 연결정보 존재 (defPop === basePop)
							if (!s.defCarno && s.defPop && s.defPop === s.basePop) return NEW_TASK_COLOR;
							// 그 외 기본 신규 거래처 처리
							return NEW_TASK_COLOR;
						};
						// 거래처 필터 활성 시 타겟 거래처가 아니면 투명도 낮춤
						const getTaskOpacity = () => {
							if (custFilterCodes.length === 0) return 1;
							return custFilterCodes.includes(s.id) ? 1 : 0.25;
						};
						return {
							...s,
							id: `${s.uniqueId}`,
							title: `${s._stepIndex === -1 ? '' : s._stepIndex}`,
							startAt: dayjs(Number(s.arrival || 0) * 1000),
							spentTime: Math.ceil(Number(s.service || 60) / 60),
							rowId: v.uniqueId,
							color: getTaskColor(),
							opacity: getTaskOpacity(),
							type: s.type,
						};
					}),
			);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [vehicles, timeRange, renderKey, custFilterCodes]);

		// === 렌더러 ===
		const infoPanelRenderer = useCallback(
			(row: TimelineRow) => {
				const { vehicle, isSelected } = row.additionalInfo as { vehicle: TmVehiclesDto; isSelected: boolean };
				const handleDriverClick = () => {
					setSelectedOrderId(undefined);
					if (vehicle.carno === 'unassigned') return;
					const newSelected = isSelected ? undefined : vehicle.uniqueId;
					setSelectedVehicleId(newSelected);

					// 차량 선택 시 첫 번째 주문 시작점으로 스크롤
					if (newSelected) {
						const firstJobStep = vehicle.steps
							.filter(s => s.type === 'job' && s.arrival && s.arrival !== '0')
							.sort((a, b) => Number(a.arrival) - Number(b.arrival))[0];
						if (firstJobStep) {
							timelineRef.current?.scrollToTime(dayjs(Number(firstJobStep.arrival) * 1000));
						}
					}
				};
				return (
					<VehicleSummary
						vehicle={vehicle}
						isSelected={isSelected}
						onDriverClick={handleDriverClick}
						availableCarNumbers={availableCarNumbers}
						onDirectVehicleSelect={onDirectVehicleSelect}
						onChangeVehicle={onChangeVehicle}
						onDeleteVehicle={onDeleteVehicle}
						changedRows={changedRows}
					/>
				);
			},
			[
				availableCarNumbers,
				onDirectVehicleSelect,
				onChangeVehicle,
				onDeleteVehicle,
				setSelectedOrderId,
				setSelectedVehicleId,
				changedRows,
			],
		);

		// === 이벤트 핸들러 ===
		const handleTaskClick = useCallback(
			(task: TimelineEvent) => {
				setSelectedOrderId(selectedOrderId === task.id ? undefined : task.id);
				setSelectedVehicleId(undefined);
			},
			[setSelectedOrderId, setSelectedVehicleId, selectedOrderId],
		);

		/**
		 * Timeline에서 태스크 변경 시 vehicles 상태에 반영
		 * - Timeline 컴포넌트가 순차 배치 로직을 처리하므로 여기서는 데이터 동기화만 수행
		 */
		const handleTasksChange = useCallback(
			(updatedTasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => {
				const originVehicle = vehicles.find(v => v.steps.some(s => s.uniqueId === effectedTaskId));
				const isMovedBetweenVehicles = originVehicle && originVehicle.uniqueId !== effectedRowId;

				// 분할 주문은 차량 간 이동 불가
				if (isMovedBetweenVehicles) {
					const step = originVehicle.steps.find(s => s.uniqueId === effectedTaskId);
					if (step?.splitDeliveryYn === 'Y') {
						showAlert('오류', '분할 주문은 다른 차량으로 이동할 수 없습니다.');
						setVehicles([...vehicles]); // 리렌더링으로 원상복구
						return;
					}
				}

				// AI 모드에서 같은 차량 내 순서 변경 차단
				if (!isManualMode && !isMovedBetweenVehicles) {
					const step = vehicles.find(v => v.uniqueId === effectedRowId)?.steps.find(s => s.uniqueId === effectedTaskId);
					if (step) {
						showAlert('오류', 'AI 최적화 모드에서는 주문 순서를 변경 할 수 없습니다.');
						setVehicles([...vehicles]); // 리렌더링으로 원상복구
						return;
					}
				}

				setIsDataChanged(true);

				// 수정된 태스크 ID 기록
				if (effectedTaskId) {
					editedTaskIdsRef.current.add(effectedTaskId);
				}

				// 영향 받은 row 추적: 이동된 경우 출발지, 목적지 모두 추적
				const affectedRowIds: string[] = [];
				if (effectedRowId) affectedRowIds.push(effectedRowId);
				if (isMovedBetweenVehicles && originVehicle) affectedRowIds.push(originVehicle.uniqueId);
				if (affectedRowIds.length > 0) {
					setChangedRows(prev => [...new Set([...prev, ...affectedRowIds])]);
				}

				// Timeline의 태스크 상태를 vehicles에 동기화
				setVehicles(prevVehicles => {
					const allStepsMap = new Map<string, TmEngineStepDto>();
					prevVehicles.forEach(v => {
						v.steps.forEach(s => {
							if (s.type === 'job') {
								allStepsMap.set(s.uniqueId, s);
							}
						});
					});

					const stepsByVehicle = new Map<string, TmEngineStepDto[]>();
					updatedTasks.forEach(task => {
						const step = allStepsMap.get(task.id);
						if (!step) return;

						step.arrival = task.startAt.unix().toString();

						if (!stepsByVehicle.has(task.rowId)) stepsByVehicle.set(task.rowId, []);
						stepsByVehicle.get(task.rowId)!.push(step);
					});

					return prevVehicles.map(v => ({
						...v,
						steps: [
							...v.steps.filter(s => s.type === 'start'),
							...(stepsByVehicle.get(v.uniqueId) || []),
							...v.steps.filter(s => s.type === 'end'),
						],
					}));
				});
			},
			[isManualMode, vehicles, setIsDataChanged, setChangedRows, setVehicles],
		);

		/**
		 * 외부(미할당 목록/반품 목록)에서 Timeline으로 드롭
		 * 다중 선택 드롭 지원 - 원본 목록 순서 유지
		 */
		const handleExternalDrop = useCallback(
			(
				taskIds: string[],
				rowId: string,
				time?: dayjs.Dayjs,
				scrollTo?: (time: dayjs.Dayjs) => void,
				isReturnOrder?: boolean,
				isFromBulkDispatch?: boolean,
			) => {
				if (taskIds.length === 0) return;

				const targetVehicle = vehicles.find(v => v.uniqueId === rowId);
				if (!targetVehicle) return;

				// 드롭할 주문들 찾기 (taskIds 순서 = 원본 목록 순서)
				const sourceList = isReturnOrder ? returnOrders : unassignedOrders;
				const tasksToMove = taskIds
					.map(id => sourceList.find(o => o.uniqueId === id))
					.filter((task): task is TmUnassignedOrderDto | TmReturnOrderDto => !!task);

				if (tasksToMove.length === 0) return;

				setIsDataChanged(true);
				setChangedRows(prev => [...new Set([...prev, rowId])]);

				// 원본 목록에서 제거
				const taskIdSet = new Set(taskIds);
				if (isReturnOrder) {
					setReturnOrders(prev => prev.filter(o => !taskIdSet.has(o.uniqueId)));
				} else {
					setUnassignedOrders(prev => prev.filter(o => !taskIdSet.has(o.uniqueId)));
				}

				setVehicles(prev =>
					prev.map(v => {
						if (v.uniqueId !== rowId) return v;

						// 차량의 작업 시작 시간
						const vehicleRow = rows.find(r => r.id === rowId);
						const startWorkAt = vehicleRow?.startWorkAt || timeRange.startAt;

						// 해당 차량의 마지막 주문 끝나는 시간 찾기 (일괄 배차용)
						let lastTaskEndTime = startWorkAt;
						const existingJobSteps = v.steps.filter(s => s.type === 'job');
						if (existingJobSteps.length > 0) {
							const lastStep = existingJobSteps.reduce((latest, current) => {
								return Number(current.arrival || 0) > Number(latest.arrival || 0) ? current : latest;
							});
							const lastArrival = dayjs(Number(lastStep.arrival || 0) * 1000);
							const lastSpentTime = Math.ceil(Number(lastStep.service || 60) / 60);
							lastTaskEndTime = lastArrival.add(lastSpentTime, 'minute');
						}

						// 새 스텝들 생성 (순서대로)
						const newSteps: TmEngineStepDto[] = tasksToMove.map((task, idx) => {
							let newStepArrival: dayjs.Dayjs;
							if (isFromBulkDispatch) {
								// 일괄 배차: 마지막 주문 바로 뒤에 이어서 삽입
								newStepArrival = lastTaskEndTime.add(idx, 'minute');
							} else if (isManualMode && time) {
								// 수동 모드: 드롭 위치 기준으로 순차 배치
								const baseTime = time.isBefore(startWorkAt) ? startWorkAt : time;
								newStepArrival = baseTime.add(idx, 'minute');
							} else {
								// AI 모드: 맨 앞에 순서대로 삽입
								newStepArrival = startWorkAt.subtract(tasksToMove.length - idx, 'second');
							}

							return {
								...task,
								type: 'job',
								_stepIndex: -1,
								arrival: newStepArrival.unix().toString(),
								location: task.location || [0, 0],
							} as TmEngineStepDto;
						});

						// 첫 번째 태스크로 스크롤
						if (scrollTo && tasksToMove.length > 0) {
							const firstTaskTime = time || startWorkAt;
							scrollTo(firstTaskTime);
						}

						// 기존 태스크 + 새 태스크들을 TimelineEvent 형태로 변환
						const existingTasks = v.steps
							.filter(s => s.type === 'job')
							.map(s => ({
								id: s.uniqueId,
								title: '',
								startAt: dayjs(Number(s.arrival) * 1000),
								spentTime: Math.ceil(Number(s.service || 60) / 60),
								rowId: v.uniqueId,
							}));

						const newTaskEvents = newSteps.map(step => ({
							id: step.uniqueId,
							title: '',
							startAt: dayjs(Number(step.arrival) * 1000),
							spentTime: Math.ceil(Number(step.service || 60) / 60),
							rowId: v.uniqueId,
						}));

						// 유틸 함수로 순차 배치
						const arrangedTasks = arrangeTasksSequentially([...existingTasks, ...newTaskEvents], rowId, startWorkAt);

						// 기존 pickup/delivery 스텝들 + 새 스텝들
						const existingPickupDeliverySteps = v.steps.filter(s => s.type === 'job');
						const startSteps = v.steps.filter(s => s.type === 'start');
						const endSteps = v.steps.filter(s => s.type === 'end');

						// 정렬된 시간을 기존 스텝들에 반영
						const updatedExistingSteps = existingPickupDeliverySteps.map(step => {
							const arranged = arrangedTasks.find(t => t.id === step.uniqueId);
							if (arranged) {
								return { ...step, arrival: arranged.startAt.unix().toString() };
							}
							return step;
						});

						// 새 스텝들의 시간도 반영
						const updatedNewSteps = newSteps.map(step => {
							const arranged = arrangedTasks.find(t => t.id === step.uniqueId);
							if (arranged) {
								return { ...step, arrival: arranged.startAt.unix().toString() };
							}
							return step;
						});

						return { ...v, steps: [...startSteps, ...updatedExistingSteps, ...updatedNewSteps, ...endSteps] };
					}),
				);

				// 드롭 완료 후 선택 초기화
				selectionContext?.clearAllSelections();
			},
			[
				unassignedOrders,
				returnOrders,
				vehicles,
				setIsDataChanged,
				setChangedRows,
				setUnassignedOrders,
				setReturnOrders,
				setVehicles,
				timeRange,
				rows,
				isManualMode,
				selectionContext,
			],
		);

		/**
		 * Timeline에서 미할당 영역으로 드롭
		 * splitDeliveryYn === 'Y'인 경우 같은 id를 가진 모든 step들을 합쳐서 이동
		 */
		const handleMoveToList = useCallback(
			async (task?: TimelineEvent, dropZoneId?: string) => {
				if (!task) return;
				const { id, rowId } = task;

				const targetVehicle = vehicles.find(v => v.uniqueId === rowId);
				if (!targetVehicle) return;

				const targetStep = targetVehicle.steps.find(s => s.uniqueId === id);
				if (!targetStep) return;

				// 일반 주문 처리 (분할 주문은 TmPlan에서 unassignedOrders 감지하여 일괄 병합 처리)
				setIsDataChanged(true);
				setChangedRows(prev => [...new Set([...prev, rowId])]);

				// Timeline의 removeTask 사용 가능
				setVehicles(prev =>
					prev.map(v => {
						if (v.uniqueId !== rowId) return v;

						const vehicleRow = rows.find(r => r.id === rowId);
						const startWorkAt = vehicleRow?.startWorkAt || timeRange.startAt;

						// 제거 후 남은 태스크들
						const remainingSteps = v.steps.filter(s => s.uniqueId !== id);
						const taskSteps = remainingSteps.filter(s => s.type === 'job');

						// TimelineEvent 형태로 변환
						const taskEvents = taskSteps.map(s => ({
							id: s.uniqueId,
							title: '',
							startAt: dayjs(Number(s.arrival) * 1000),
							spentTime: Math.ceil(Number(s.service || 60) / 60),
							rowId: v.uniqueId,
						}));

						// 순차 재배치
						const arrangedTasks = arrangeTasksSequentially(taskEvents, rowId, startWorkAt);

						// 정렬된 시간 반영
						const updatedSteps = remainingSteps.map(step => {
							if (step.type !== 'job') return step;
							const arranged = arrangedTasks.find(t => t.id === step.uniqueId);
							return arranged ? { ...step, arrival: arranged.startAt.unix().toString() } : step;
						});

						return { ...v, steps: updatedSteps };
					}),
				);

				if (dropZoneId === 'unassigned') setUnassignedOrders(prev => [...prev, { ...targetStep, _stepIndex: -1 }]);
				if (dropZoneId === 'return') setReturnOrders(prev => [...prev, { ...targetStep, _stepIndex: -1 }]);
			},
			[
				vehicles,
				setIsDataChanged,
				setChangedRows,
				setUnassignedOrders,
				setReturnOrders,
				setVehicles,
				rows,
				timeRange,
				selectionContext,
			],
		);

		/**
		 * 우클릭 시 미배차/반품 영역으로 이동
		 * - tmDeliveryType === '2' 인 경우 반품 영역으로
		 * - 그 외의 경우 미배차 영역으로
		 */
		const handleContextMenu = useCallback(
			(_e: any, task: TimelineEvent) => {
				const dropZoneId = task.tmDeliveryType === '2' ? 'return' : 'unassigned';
				handleMoveToList(task, dropZoneId);
			},
			[handleMoveToList],
		);

		// === Config 구성 ===
		const config = useMemo(
			() => ({
				timeRange,
				infoPanelRenderer,
				rows,
				timeUnit: '30M' as const,
				selectedTaskId: selectedOrderId,
				onTasksChange: handleTasksChange,
				onContextMenu: handleContextMenu,
				onTaskClick: handleTaskClick,
				onExternalDrop: handleExternalDrop,
				onMoveToList: handleMoveToList,
				shouldForceSequential: !isManualMode,
				minVisibleCells: 12,
			}),
			[
				timeRange,
				infoPanelRenderer,
				rows,
				selectedOrderId,
				handleTasksChange,
				handleContextMenu,
				handleTaskClick,
				handleExternalDrop,
				handleMoveToList,
				isManualMode,
			],
		);

		return (
			<>
				<TmVehicleSelectModal
					open={changeTarget !== null}
					onClose={() => setChangeTarget(null)}
					onSelect={handleCarNumberChange}
					vehicleList={availableCarNumbers}
					currentVehicle={changeTarget}
				/>
				<Timeline ref={timelineRef} tasks={tasks} config={config} />
			</>
		);
	},
);

TmPlanTimeline.displayName = 'TmPlanTimeline';
