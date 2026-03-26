import {
	addNewOrders,
	getAdjustPlan,
	getManualSplitMasterList,
	getNewOrderCount,
	ManualSplitMasterItem,
	optimizeAuto,
	OptimizeAutoReq,
	saveDispatch,
	SaveDispatchReq,
	setDispatch,
	TmEngineStepDto,
	TmReturnOrderDto,
	TmSetDispatchReqDto,
	TmUnassignedOrderDto,
	TmVehiclesDto,
} from '@/api/tm/apiTmDispatch';
import { apiGetPlanCarGridList } from '@/api/wm/apiWmDocument';
import { ResizableContainer, ResizeHandle } from '@/assets/styled/components/ResizableContainer';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { RooutyMapProvider } from '@/components/common/custom/mapgl/mapbox';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { arrangeTasksSequentially } from '@/components/common/custom/timeline/utils/taskOperations';
import TmOutGroupSettingModal, { TemporaryCarDispatchResult } from '@/components/tm/outGroup/TmOutGroupSettingModal';
import TmPlanCustomerDispatchHistoryPopup from '@/components/tm/popup/TmPlanCustomerDispatchHistoryPopup';
import TmDispatchOptionsModal from '@/components/tm/TmDispatchOptionsModal';
import TmDispatchVehicleModal from '@/components/tm/TmDispatchVehicleModal';
import { OrderSelectionProvider } from '@/components/tm/TmPlan/contexts/OrderSelectionContext';
import { CustomDragLayer } from '@/components/tm/TmPlan/CustomDragLayer';
import { TmPlanMap } from '@/components/tm/TmPlan/Map';
import { ExpandableContainer, MapContainer, MapExpandButton, PanelContainer } from '@/components/tm/TmPlan/styles';
import Summary from '@/components/tm/TmPlan/Summary';
import { getVehicleAlias, resetVehicleAlias } from '@/components/tm/TmPlan/Timeline/getVehicleAlias';
import {
	recalculateRoundSeq,
	TmPlanTimeline,
	TmPlanTimelineHandle,
} from '@/components/tm/TmPlan/Timeline/TmPlanTimeline';
import { VehicleTypeMap } from '@/components/tm/TmPlan/Timeline/VehicleSummary';
import TmOrderSplitModal from '@/components/tm/TmPlan/TmOrderSplitModal';
import UnassignedOrdersList, {
	OrderDispatchInfo,
	OrdersListHandle,
	ReturnOrdersList,
} from '@/components/tm/TmPlan/UnassignedOrdersList';
import { TmStyledTab } from '@/components/tm/TmStyledTab';
import { useCloseTab } from '@/hooks/useCloseTab';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useResizable } from '@/hooks/useResizable';
import { useResultTabs } from '@/hooks/useResultTabs';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';
import {
	clearPendingAdjustParams,
	clearPendingDispatchCriteria,
	clearTmDispatchResult,
	setTmDispatchResult,
} from '@/store/tm/tmDispatchStore';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { ArrowsAltOutlined, BellOutlined, LeftOutlined, RightOutlined, ShrinkOutlined } from '@ant-design/icons';
import { Badge, Button, Checkbox, Collapse, Divider, Form, Modal, Select, Space, Tag, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib';
import dayjs from 'dayjs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation } from 'react-router-dom';
import '../../components/tm/TmPlan/style.css';

export default () => {
	// internal states
	const [isManualMode, setIsManualMode] = useState(true); // 엔진 재계산 여부 true: 엔진 재계산, false: 수동 재계산
	const [isExpanded, setIsExpanded] = useState(false); // 좌측 패널 확장 여부
	const [isMapExpanded, setIsMapExpanded] = useState(false); // 지도 확장 여부
	const [isTempCarModalVisible, setIsTempCarModalVisible] = useState(false); // 실비차 조건 설정 모달 열림 상태
	const unassignedListRef = useRef<OrdersListHandle>(null);
	const returnListRef = useRef<OrdersListHandle>(null);
	const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string[]>([]); // 계약유형 필터
	const [vehicleCarnoFilter, setVehicleCarnoFilter] = useState<string[]>([]); // 차량 필터 (CmCarSearch 선택 결과)
	const [filterForm] = Form.useForm(); // 차량/거래처 검색 폼
	const custFilterCode = Form.useWatch('custFilterCode', filterForm); // 거래처 코드
	const custFilterName = Form.useWatch('custFilterName', filterForm); // 거래처 표시명
	const [selfSplitOrder, setSelfSplitOrder] = useState<TmUnassignedOrderDto | null>(null); // 수동 분할 모달 열림 상태
	const [isDataChanged, setIsDataChanged] = useState(false); // 주문 변경점 여부
	const [changedRows, setChangedRows] = useState<string[]>([]); // 변경된 row(vehicle) ID 추적
	const [newOrderCount, setNewOrderCount] = useState<number>(0); // 신규 주문 갯수
	const refCarModal: any = (useRef as any)(null);
	const refBaeModal: any = (useRef as any)(null);
	const splitModalRef = useRef<any>(null); // 수동 분할 모달 ref
	const historyPopupRef = useRef<any>(null); // 배차이력 팝업 열림 상태
	const timelineRef = useRef<TmPlanTimelineHandle>(null);
	const isMapClickRef = useRef(false); // 지도에서 클릭했는지 추적
	const newOrdersRef = useRef<TmUnassignedOrderDto[]>([]); // 신규 주문 추가분 (재계산 전까지 보관)

	// Redux States
	const storedDeliveryDate = useAppSelector(state => state.tmDispatch.deliveryDate); // 저장된 배송일자
	const pendingCriteria = useAppSelector(state => state.tmDispatch.pendingCriteria); // 자동배차 조건
	const pendingAdjustParams = useAppSelector(state => state.tmDispatch.pendingAdjustParams); // 배차조정 조건
	const tmDispatchResult = useAppSelector(state => state.tmDispatch.lastResponse); // 배차 결과
	const currentDccode = useAppSelector(state => state.tmDispatch.dccode);
	const isSaveDisabled = tmDispatchResult?.data?.tmDeliveryType === '5'; // tmDeliveryType 5: 저장/확정 비활성화

	// 주문 States
	const [unassignedOrders, setUnassignedOrders] = useState<TmUnassignedOrderDto[]>([]);
	const [returnOrders, setReturnOrders] = useState<TmReturnOrderDto[]>([]);
	const [vehicles, setVehicles] = useState<TmVehiclesDto[]>([]);
	const [unassignedCheckedIds, setUnassignedCheckedIds] = useState<Set<string>>(new Set());
	const [returnCheckedIds, setReturnCheckedIds] = useState<Set<string>>(new Set());

	const concurrencyDispatchInfoRef = useRef<{
		isPartialSave: boolean;
		partialSaveVehicles: string[];
		partialSaveUnassignedOrdersOrigin: string[];
		partialSaveDeletedVehicles: Pick<TmVehiclesDto, 'uniqueId' | 'carno'>[];
	}>({
		isPartialSave: false,
		partialSaveVehicles: [],
		partialSaveUnassignedOrdersOrigin: [],
		partialSaveDeletedVehicles: [],
	});

	const [vehiclesFrozen, setVehiclesFrozen] = useState<TmVehiclesDto[]>([]);
	const [pForm] = Form.useForm();

	// 신규 주문 재주입: uniqueId 기준으로 중복 체크 후 추가
	const applyNewOrders = (
		targetVehicles: TmVehiclesDto[],
		targetUnassigned: TmUnassignedOrderDto[],
		ordersToProcess?: TmUnassignedOrderDto[],
	) => {
		const sourceOrders = ordersToProcess || newOrdersRef.current;
		if (sourceOrders.length === 0) return { vehicles: targetVehicles, unassignedOrders: targetUnassigned };

		// 현재 존재하는 모든 uniqueId 수집
		const existingIds = new Set<string>();
		targetUnassigned.forEach(o => o.uniqueId && existingIds.add(o.uniqueId));
		targetVehicles.forEach(v => v.steps.forEach(s => s.uniqueId && existingIds.add(s.uniqueId)));

		// 이미 존재하지 않는 주문만 필터
		const ordersToAdd = sourceOrders.filter(o => o.uniqueId && !existingIds.has(o.uniqueId));
		if (ordersToAdd.length === 0) return { vehicles: targetVehicles, unassignedOrders: targetUnassigned };

		// 현재 존재하는 모든 실착지(id=truthcustkey) 수집
		const existingTruthCustKeys = new Set<string>();
		targetUnassigned.forEach(o => o.id && existingTruthCustKeys.add(o.id));
		targetVehicles.forEach(v => v.steps.forEach(s => s.type === 'job' && s.id && existingTruthCustKeys.add(s.id)));

		// 동일 실착지(truthcustkey)가 있는 주문은 무게 병합, 없는 주문은 신규 추가
		const ordersToMerge = ordersToAdd.filter(o => o.id && existingTruthCustKeys.has(o.id));
		const ordersToAddNew = ordersToAdd.filter(o => !o.id || !existingTruthCustKeys.has(o.id));

		// 병합할 무게/수량 계산 (truthcustkey별로 합산)
		const mergeMap = new Map<string, { weight: number; cube: number; orderQty: number }>();
		ordersToMerge.forEach(order => {
			const key = order.id!;
			const prev = mergeMap.get(key) || { weight: 0, cube: 0, orderQty: 0 };
			prev.weight += Number(order.weight || 0);
			prev.cube += Number(order.cube || 0);
			prev.orderQty += Number(order.orderQty || 0);
			mergeMap.set(key, prev);
		});

		// 기존 차량 스텝에 무게 병합 적용
		let mergedVehicles = targetVehicles.map(v => ({
			...v,
			steps: v.steps.map(s => {
				if (s.type !== 'job' || !s.id || !mergeMap.has(s.id)) return s;
				const add = mergeMap.get(s.id)!;
				return {
					...s,
					weight: String(Number(s.weight || 0) + add.weight),
					cube: String(Number(s.cube || 0) + add.cube),
					orderQty: String(Number(s.orderQty || 0) + add.orderQty),
				};
			}),
		}));

		// 기존 미배차 주문에 무게 병합 적용
		const mergedUnassigned = targetUnassigned.map(o => {
			if (!o.id || !mergeMap.has(o.id)) return o;
			const add = mergeMap.get(o.id)!;
			return {
				...o,
				weight: String(Number(o.weight || 0) + add.weight),
				cube: String(Number(o.cube || 0) + add.cube),
				orderQty: String(Number(o.orderQty || 0) + add.orderQty),
			};
		});

		// 신규 실착지 주문만 추가 (기존 로직)
		if (ordersToAddNew.length === 0) return { vehicles: mergedVehicles, unassignedOrders: mergedUnassigned };

		// defCarno 기준으로 합배차/미배차 분류
		const carnoMap = new Map(mergedVehicles.map(v => [v.carno, v]));
		const toAssign: { order: TmUnassignedOrderDto; vehicle: TmVehiclesDto }[] = [];
		const toUnassigned: TmUnassignedOrderDto[] = [];

		ordersToAddNew.forEach(order => {
			const matched = order.defCarno ? carnoMap.get(order.defCarno) : null;
			if (matched) {
				toAssign.push({ order, vehicle: matched });
			} else {
				toUnassigned.push(order);
			}
		});

		mergedVehicles = mergedVehicles.map(v => {
			const assigned = toAssign.filter(a => a.vehicle.uniqueId === v.uniqueId);
			if (assigned.length === 0) return v;

			const startStep = v.steps.find(s => s.type === 'start');
			const startWorkAt =
				startStep?.arrival && startStep.arrival !== '0'
					? dayjs(Number(startStep.arrival) * 1000)
					: dayjs().startOf('day').hour(9);

			const newSteps: TmEngineStepDto[] = assigned.map(({ order }) => ({
				...order,
				type: 'job',
				_stepIndex: -1,
				arrival: startWorkAt.subtract(1, 'second').unix().toString(),
				location: order.location || [0, 0],
			}));

			const allTasks = [...v.steps.filter(s => s.type === 'job'), ...newSteps].map(s => ({
				id: s.uniqueId,
				title: '',
				startAt: dayjs(Number(s.arrival) * 1000),
				spentTime: Math.ceil(Number(s.service || 60) / 60),
				rowId: v.uniqueId,
			}));
			const arranged = arrangeTasksSequentially(allTasks, v.uniqueId, startWorkAt);

			const updatedExisting = v.steps.map(s => {
				if (s.type !== 'job') return s;
				const found = arranged.find(t => t.id === s.uniqueId);
				return found ? { ...s, arrival: found.startAt.unix().toString() } : s;
			});
			const updatedNew = newSteps.map(s => {
				const found = arranged.find(t => t.id === s.uniqueId);
				return found ? { ...s, arrival: found.startAt.unix().toString() } : s;
			});

			return { ...v, steps: [...updatedExisting, ...updatedNew] };
		});

		return {
			vehicles: mergedVehicles,
			unassignedOrders: [...mergedUnassigned, ...toUnassigned],
		};
	};

	// 결과 탭 훅
	const {
		tabs,
		activeTabKey,
		createTab,
		handleTabChange,
		handleTabEdit,
		initializeTabs,
		clearTabs,
		getCurrentTabSnapshot,
		updateCurrentTabSnapshot,
		tabItems,
	} = useResultTabs({
		maxTabs: 5,
		shouldConfirm: () => isDataChanged,
		onTabChange: snapshot => {
			const { vehicles: restoredVehicles, unassignedOrders: restoredUnassigned } = applyNewOrders(
				snapshot.vehicles,
				snapshot.unassignedOrders,
			);
			setUnassignedOrders(restoredUnassigned);
			setReturnOrders(snapshot.returnOrders);
			setVehicles(restoredVehicles);
			setVehiclesFrozen(snapshot.vehicles);
			setIsDataChanged(newOrdersRef.current.length > 0);
			// 신규주문이 병합/추가된 차량을 changedRows에 반영
			const origMap = new Map(snapshot.vehicles.map(v => [v.uniqueId, v]));
			setChangedRows(
				restoredVehicles
					.filter(v => {
						const orig = origMap.get(v.uniqueId);
						return (
							orig && (orig.steps.length !== v.steps.length || JSON.stringify(orig.steps) !== JSON.stringify(v.steps))
						);
					})
					.map(v => v.uniqueId!)
					.filter(Boolean),
			);
			timelineRef.current?.clearEditedTasks();
		},
	});

	const [planCarList, setPlanCarList] = useState<any[]>([]); // 전체 차량 리스트(차량설정)

	const [selectedVehicleId, setSelectedVehicleId] = useState<string>(); // 선택된 차량 ID
	const [selectedOrderId, setSelectedOrderId] = useState<string>(); // 선택된 주문 ID
	const [historyParams, setHistoryParams] = useState<any>(undefined); // 배차이력 팝업 파라미터
	const [planCarTrigger, setPlanCarTrigger] = useState(0);

	/** CmCarSearch 선택 콜백 */
	const handleCarFilterCallback = useCallback((selected: any[]) => {
		if (!selected || selected.length === 0 || !selected[0]?.code) {
			setVehicleCarnoFilter([]);
			return;
		}
		const names = selected.map((s: any) => s.code).filter(Boolean);
		setVehicleCarnoFilter(names);
	}, []);

	const filteredVehicles = useMemo(() => {
		return vehicles.filter(v => {
			let result = true;

			const vehicleTypeMapped = VehicleTypeMap?.[v.vehicleType as keyof typeof VehicleTypeMap] || '';
			if (vehicleTypeFilter.length > 0 && !vehicleTypeFilter.includes(vehicleTypeMapped)) result = false;
			// 차량 필터 (CmCarSearch 선택 결과)
			if (vehicleCarnoFilter.length > 0) {
				const matchAny = vehicleCarnoFilter.some(f => v.carno?.includes(f));
				if (!matchAny) result = false;
			}
			// 거래처 필터 (CmCustSearch 선택 결과 - custFilterCode를 step.id와 비교)
			if (custFilterCode) {
				const codes = custFilterCode
					.split(',')
					.map((c: string) => c.trim())
					.filter(Boolean);
				const steps = v.steps || [];
				const hasCust = steps.some(s => codes.includes(s.id));
				if (!hasCust) result = false;
			}
			return result;
		});
	}, [vehicles, vehicleTypeFilter, vehicleCarnoFilter, custFilterCode, custFilterName]);

	// 거래처 필터 - 미배차/반품 주문에도 적용 (custFilterCode를 storerkey와 비교)
	const filteredUnassignedOrders = useMemo(() => {
		if (!custFilterCode) return unassignedOrders;
		const codes = custFilterCode
			.split(',')
			.map((c: string) => c.trim())
			.filter(Boolean);
		return unassignedOrders.filter(o => codes.includes(o.id));
	}, [unassignedOrders, custFilterCode]);

	const filteredReturnOrders = useMemo(() => {
		if (!custFilterCode) return returnOrders;
		const codes = custFilterCode
			.split(',')
			.map((c: string) => c.trim())
			.filter(Boolean);
		return returnOrders.filter(o => codes.includes(o.id));
	}, [returnOrders, custFilterCode]);

	// 배차된 차량 carno 목록 (차량 설정 시 운행 변경 제한용)
	const assignedVehicles = useMemo(() => {
		return vehicles.filter(v => !v.carno?.includes('unassigned')).map(v => v.carno);
	}, [vehicles]);

	// 다회차(2회차 이상) 차량 carno 목록 (차량 설정 시 2회전 옵션 변경 제한용)
	const multiRoundVehicles = useMemo(() => {
		return vehicles.filter(v => (v.roundSeq ?? 1) >= 2).map(v => v.carno);
	}, [vehicles]);

	const runningDate = useMemo(() => {
		const ymd = storedDeliveryDate || pendingCriteria?.deliveryDate || pendingAdjustParams?.deliveryDate;
		return ymd && /^\d{8}$/.test(ymd) ? dayjs(ymd, 'YYYYMMDD') : dayjs().add(1, 'day');
	}, [storedDeliveryDate, pendingCriteria?.deliveryDate, pendingAdjustParams?.deliveryDate]); // 주행일자

	const currentDccodeName = useMemo(() => {
		const dccodeList = getUserDccodeList();
		const found = dccodeList.find(item => item.dccode === currentDccode);
		return found?.dcname || currentDccode;
	}, [currentDccode]); // 센터명

	const { containerRef, handleResizeStart } = useResizable({ initialHeight: 300, minHeight: 150 });

	const { moveMenu } = useMoveMenu();
	const { closeCurrentTab } = useCloseTab();
	const location = useLocation();
	const returnSearch = (location.state as any)?.state?.search;

	const dispatchRedux = useAppDispatch();

	// 수동 분할 모달 상태 동기화
	useEffect(() => {
		if (selfSplitOrder) {
			splitModalRef.current?.handlerOpen();
		} else {
			splitModalRef.current?.handlerClose();
		}
	}, [selfSplitOrder]);

	useEffect(() => {
		if (!currentDccode || !runningDate) return;
		const fetchCars = async () => {
			const res = await apiGetPlanCarGridList({
				dccode: currentDccode,
				tmDeliveryType: '1',
				deliveryDate: runningDate.format('YYYYMMDD'),
			});
			if (res?.statusCode === 0 && Array.isArray(res.data))
				setPlanCarList(res.data.filter((v: any) => v.deliveryYn === 'Y'));
		};
		fetchCars();
	}, [currentDccode, runningDate, planCarTrigger]);

	// 신규 주문 갯수 3분마다 폴링
	useEffect(() => {
		if (!currentDccode || !runningDate) return;

		const fetchNewOrderCount = async () => {
			try {
				setNewOrderCount(0);
				const res = await getNewOrderCount({
					dccode: currentDccode,
					deliveryDate: runningDate.format('YYYYMMDD'),
					tmDeliveryType: '1',
				});
				if (res?.statusCode === 0) {
					setNewOrderCount(res.data || 0);
				}
			} catch (error) {}
		};
		fetchNewOrderCount();
		const intervalId = setInterval(fetchNewOrderCount, 1000 * 3 * 60);

		return () => clearInterval(intervalId);
	}, [currentDccode, runningDate]);

	useEffect(() => {
		if (tmDispatchResult) handleReset(true);
	}, [tmDispatchResult]);

	// 미배차 목록에 분할 주문(splitDeliveryYn === 'Y')이 감지되면 일괄 병합 처리
	// 드래그/우클릭 외에 차량 삭제 등 모든 경로에서 동작하도록 unassignedOrders를 감시
	const mergingSplitOrdersRef = useRef(false);
	useEffect(() => {
		if (mergingSplitOrdersRef.current) return;
		const splitOrders = unassignedOrders.filter(o => o.splitDeliveryYn === 'Y');
		if (splitOrders.length === 0) return;

		const originalIds = [...new Set(splitOrders.map(o => o.id).filter(Boolean))] as string[];
		if (originalIds.length === 0) return;

		mergingSplitOrdersRef.current = true;

		const processSplitOrders = async () => {
			try {
				for (const originalId of originalIds) {
					const refOrder = splitOrders.find(o => o.id === originalId);
					if (!refOrder) continue;

					// 다른 차량에 남아있는 같은 원본 ID의 분할 주문 찾기
					const affectedVehicleIds = vehicles
						.filter(v => v.steps.some(s => s.id === originalId && s.splitDeliveryYn === 'Y'))
						.map(v => v.uniqueId);

					try {
						// API 호출해서 원래 중량/체적 값 가져오기
						const masterList = await getManualSplitMasterList({
							custCode: refOrder.storerkey || '',
							dccode: currentDccode,
							deliveryDate: runningDate.format('YYYYMMDD'),
							dispatchStatus: '00,50,90',
							tmDeliveryType: refOrder.tmDeliveryType || 'WD',
							truthCustkey: originalId,
						});

						const totalWeight = masterList.reduce(
							(sum: number, item: ManualSplitMasterItem) => sum + Number(item.weight || 0),
							0,
						);
						const totalCube = masterList.reduce(
							(sum: number, item: ManualSplitMasterItem) => sum + Number(item.cube || 0),
							0,
						);
						const totalQty = masterList.reduce(
							(sum: number, item: ManualSplitMasterItem) => sum + Number(item.orderQty || 0),
							0,
						);

						// 다른 차량에서 해당 분할 주문들 제거 및 시간 재배치
						if (affectedVehicleIds.length > 0) {
							setVehicles(prev =>
								prev.map(v => {
									if (!affectedVehicleIds.includes(v.uniqueId)) return v;

									const remainingSteps = v.steps.filter(s => !(s.id === originalId && s.splitDeliveryYn === 'Y'));
									const taskSteps = remainingSteps.filter(s => s.type === 'job');

									const startStep = v.steps.find(s => s.type === 'start');
									const startWorkAt =
										startStep?.arrival && startStep.arrival !== '0'
											? dayjs(Number(startStep.arrival) * 1000)
											: dayjs().startOf('day').hour(9);

									const taskEvents = taskSteps.map(s => ({
										id: s.uniqueId,
										title: '',
										startAt: dayjs(Number(s.arrival) * 1000),
										spentTime: Math.ceil(Number(s.service || 60) / 60),
										rowId: v.uniqueId,
									}));

									const arrangedTasks = arrangeTasksSequentially(taskEvents, v.uniqueId, startWorkAt);

									const updatedSteps = remainingSteps.map(step => {
										if (step.type !== 'job') return step;
										const arranged = arrangedTasks.find(t => t.id === step.uniqueId);
										return arranged ? { ...step, arrival: arranged.startAt.unix().toString() } : step;
									});

									return { ...v, steps: updatedSteps };
								}),
							);

							setChangedRows(prev => [...new Set([...prev, ...affectedVehicleIds])]);
						}

						// 합쳐진 주문으로 교체
						const mergedOrder: TmUnassignedOrderDto = {
							...refOrder,
							uniqueId: originalId || refOrder.uniqueId,
							splitDeliveryYn: undefined,
							splitDeliverySeq: undefined,
							splitItems: [],
							weight: String(totalWeight),
							cube: String(totalCube),
							orderQty: String(totalQty),
							_stepIndex: undefined,
							_originVid: undefined,
						};

						setUnassignedOrders(prev => [
							...prev.filter(o => !(o.id === originalId && o.splitDeliveryYn === 'Y')),
							mergedOrder,
						]);

						setIsDataChanged(true);
					} catch (error) {
						showAlert('오류', '분할 주문 정보를 불러오는데 실패했습니다.');
					}
				}
			} finally {
				mergingSplitOrdersRef.current = false;
			}
		};

		processSplitOrders();
	}, [unassignedOrders]);

	// 지도에서 마커 선택 시 타임라인에서 해당 주문으로 스크롤
	useEffect(() => {
		if (selectedOrderId && timelineRef.current && isMapClickRef.current) {
			timelineRef.current.scrollToOrder(selectedOrderId);
		}
		isMapClickRef.current = false;
	}, [selectedOrderId]);

	useEffect(() => {
		return () => {
			// 컴포넌트 언마운트 시 store 정리
			dispatchRedux(clearPendingDispatchCriteria());
			dispatchRedux(clearPendingAdjustParams());
		};
	}, [dispatchRedux]);

	// 배차 실행 함수 (Redux 값 사용)
	const executeDispatch = useCallback(
		async (options?: { isRerun?: boolean }) => {
			dispatchRedux(clearTmDispatchResult());

			if (pendingCriteria) {
				dispatchRedux(
					setTmDispatchResult({
						response: null,
						deliveryDate: (pendingCriteria as TmSetDispatchReqDto).deliveryDate,
						dccode: (pendingCriteria as TmSetDispatchReqDto).dccode,
						tmDeliveryType: (pendingCriteria as TmSetDispatchReqDto).deliveryType,
					}),
				);
				// 자동배차
				const res = await setDispatch({
					...(pendingCriteria as TmSetDispatchReqDto),
					tmDeliveryType: returnSearch?.deliveryType,
				} as TmSetDispatchReqDto);
				if (res?.statusCode === 0) {
					dispatchRedux(
						setTmDispatchResult({
							response: res,
							deliveryDate: (pendingCriteria as TmSetDispatchReqDto).deliveryDate,
							dccode: (pendingCriteria as TmSetDispatchReqDto).dccode,
							tmDeliveryType: (pendingCriteria as TmSetDispatchReqDto).deliveryType,
						}),
					);
					showAlert('알림', `${options?.isRerun ? '재' : ''}배차가 완료되었습니다.`);
					concurrencyDispatchInfoRef.current = {
						...concurrencyDispatchInfoRef.current,
						isPartialSave: false,
					};
					return true;
				}
			} else if (pendingAdjustParams) {
				dispatchRedux(
					setTmDispatchResult({
						response: null,
						deliveryDate: pendingAdjustParams.deliveryDate || storedDeliveryDate || '',
						dccode: pendingAdjustParams.dccode,
					}),
				);

				// 배차조정
				const res = await getAdjustPlan({
					deliveryDate: pendingAdjustParams.deliveryDate || storedDeliveryDate || '',
					dccode: pendingAdjustParams.dccode,
					deliveryType: pendingAdjustParams.deliveryType || 'WD',
					regionCode: pendingAdjustParams.regionCode,
					carnoSearch: pendingAdjustParams.carnoSearch,
				});
				if (res?.statusCode === 0) {
					dispatchRedux(
						setTmDispatchResult({
							response: res,
							deliveryDate: res?.data?.deliveryDate,
							dccode: pendingAdjustParams.dccode,
						}),
					);
					concurrencyDispatchInfoRef.current = {
						isPartialSave: true,
						partialSaveVehicles: [],
						partialSaveUnassignedOrdersOrigin: [],
						partialSaveDeletedVehicles: [],
					};
					// needRecalculation 차량이 있으면 handleReset에서 모달을 띄우므로 여기선 스킵
					const hasNeedRecalculation = res?.data?.vehicles?.some(v => v.needRecalculation);
					if (!hasNeedRecalculation) {
						const msg = options?.isRerun ? '배차조정 결과를 다시 불러왔습니다.' : '배차조정 결과를 불러왔습니다.';
						showAlert('알림', msg);
					}
					return true;
				}
			}
			return false;
		},
		[dispatchRedux, pendingCriteria, pendingAdjustParams, storedDeliveryDate],
	);

	// 배차옵션 변경 시 완전 초기 상태로 재계산
	const handleDispatchOptionsSave = useCallback(async () => {
		if (!pendingCriteria && !pendingAdjustParams) {
			showAlert('알림', '재계산에 필요한 정보가 없습니다.');
			return;
		}

		dispatchRedux(clearTmDispatchResult());
		resetVehicleAlias();
		clearTabs();
		const success = await executeDispatch({ isRerun: true });
		if (!success) {
			moveMenu('/tm/TmOrderList', { state: { key: Date.now(), search: returnSearch, requery: true } });
			closeCurrentTab();
		}
	}, [pendingCriteria, pendingAdjustParams, clearTabs, executeDispatch, dispatchRedux, moveMenu, closeCurrentTab]);

	// 초기 진입 시 배차 실행
	useEffect(() => {
		const initDispatch = async () => {
			if (tmDispatchResult) {
				// 이미 배차된 경우 스킵
			} else if (pendingCriteria || pendingAdjustParams) {
				const success = await executeDispatch();
				if (!success) {
					moveMenu('/tm/TmOrderList', { state: { key: Date.now(), search: returnSearch, requery: true } });
					closeCurrentTab();
				}
			} else if (!tmDispatchResult) {
				showAlert('알림', '실행 조건이 없어 배차화면에 진입할 수 없습니다. 주문목록으로 이동합니다.');
				moveMenu('/tm/TmOrderList', { state: { key: Date.now(), search: returnSearch, requery: true } });
				closeCurrentTab();
			}
		};
		initDispatch();
	}, []);

	const handleReset = (createInitialTab = false) => {
		if (tmDispatchResult.data) {
			const newUnassignedOrders = tmDispatchResult?.data?.unassignedOrders || [];
			const newReturnOrders = tmDispatchResult?.data?.returnOrders || [];
			const newVehicles =
				tmDispatchResult?.data?.vehicles?.map(x => ({
					...x,
					steps: x.steps.map((step, stepIndex) => ({ ...step, _stepIndex: stepIndex, _originVid: x.uniqueId })),
				})) || [];

			// 초기 탭 생성 (최초 로드 시)
			if (createInitialTab && tabs.length === 0) {
				if (concurrencyDispatchInfoRef.current.isPartialSave) {
					concurrencyDispatchInfoRef.current = {
						...concurrencyDispatchInfoRef.current,
						partialSaveUnassignedOrdersOrigin: newUnassignedOrders.map(o => o.id),
					};
				}
				// 배차계획 새로 시작 시 실비차 카운터 초기화
				resetVehicleAlias();
				newOrdersRef.current = [];
				initializeTabs({ unassignedOrders: newUnassignedOrders, returnOrders: newReturnOrders, vehicles: newVehicles });
				setUnassignedOrders(newUnassignedOrders);
				setReturnOrders(newReturnOrders);
				setVehicles(newVehicles);
				setVehiclesFrozen(newVehicles);
				setIsDataChanged(false);
				setChangedRows([]);
				timelineRef.current?.clearEditedTasks();

				// geometry "??" 차량 체크 - 수동 재계산 필요 상태 설정
				const vehiclesWithInvalidGeometry = newVehicles
					.filter(v => v.steps.some(s => s.geometry === '??'))
					.map(v => v.uniqueId!)
					.filter(Boolean);
				if (vehiclesWithInvalidGeometry.length > 0) {
					setIsDataChanged(true);
					setChangedRows(vehiclesWithInvalidGeometry);
				}

				// 배차 조정 진입 시 needRecalculate 차량 체크
				if (pendingAdjustParams) {
					recalculateNeedRecalculateVehicles(newVehicles, newUnassignedOrders, newReturnOrders);
				}
			} else if (!createInitialTab && activeTabKey) {
				// 초기화 버튼 클릭 시 현재 탭의 스냅샷으로 상태 복원
				const currentSnapshot = getCurrentTabSnapshot();
				if (currentSnapshot) {
					const { vehicles: restoredVehicles, unassignedOrders: restoredUnassigned } = applyNewOrders(
						currentSnapshot.vehicles,
						currentSnapshot.unassignedOrders,
					);
					setUnassignedOrders(restoredUnassigned);
					setReturnOrders(currentSnapshot.returnOrders);
					setVehicles(restoredVehicles);
					setVehiclesFrozen(currentSnapshot.vehicles);
					setIsDataChanged(newOrdersRef.current.length > 0);
					// 신규주문이 병합/추가된 차량을 changedRows에 반영
					const origMap = new Map(currentSnapshot.vehicles.map(v => [v.uniqueId, v]));
					setChangedRows(
						restoredVehicles
							.filter(v => {
								const orig = origMap.get(v.uniqueId);
								return (
									orig &&
									(orig.steps.length !== v.steps.length || JSON.stringify(orig.steps) !== JSON.stringify(v.steps))
								);
							})
							.map(v => v.uniqueId!)
							.filter(Boolean),
					);
					timelineRef.current?.clearEditedTasks();
				}
			}
		} else {
			moveMenu('/tm/TmOrderList', { state: { key: Date.now(), search: returnSearch, requery: true } });
			closeCurrentTab();
		}
	};
	const handleCarSetting = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		refCarModal?.current?.handlerOpen?.();
	};
	const handleCarAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		// 이미 차량이 지정되지 않은 빈 차량이 있는지 확인
		const hasUnassignedVehicle = vehicles.some(v => v.carno === 'unassigned' || v.carno.startsWith('unassigned'));
		if (hasUnassignedVehicle) {
			showAlert('알림', '차량이 지정되지 않은 빈 차량이 있습니다. 먼저 차량을 지정해주세요.');
			return;
		}

		resetFilter();
		const newVehicleId = `unassigned-${Date.now()}`;
		setVehicles((prev: TmVehiclesDto[]) => [
			{
				uniqueId: newVehicleId,
				carno: `unassigned`,
				steps: [],
			} as TmVehiclesDto,
			...prev,
		]);
		setIsDataChanged(true);
		setChangedRows(prev => [...new Set([...prev, newVehicleId])]);
	};
	const handleBatchOptionOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		refBaeModal?.current?.handlerOpen?.();
	};
	const handleDispatch = async (isPreDispatch: boolean) => {
		const deliveryDate = runningDate.format('YYYYMMDD');
		const payload: SaveDispatchReq = {
			dccode: currentDccode,
			deliveryDate,
			deliveryType: 'WD',
			isPreDispatch,
			isPartialSave: concurrencyDispatchInfoRef.current.isPartialSave,
			vehicles: vehicles.filter(v => !v.carno.includes('unassigned')),
		};

		if (concurrencyDispatchInfoRef.current.isPartialSave) {
			const concurrencyPayload: SaveDispatchReq = {
				...payload,
			};

			// vehicles: partialSaveVehicles에 포함된 차량만 필터
			const partialSaveVehicleIds = new Set(concurrencyDispatchInfoRef.current.partialSaveVehicles);
			concurrencyPayload.vehicles = vehicles.filter(
				v => !v.carno.includes('unassigned') && partialSaveVehicleIds.has(v.uniqueId),
			);

			// 삭제된 차량: 빈 steps 배열로 포함 (서버에 삭제 알림)
			const deletedVehicles = concurrencyDispatchInfoRef.current.partialSaveDeletedVehicles;
			if (deletedVehicles.length > 0) {
				concurrencyPayload.vehicles = [
					...concurrencyPayload.vehicles,
					...deletedVehicles.map(dv => ({ ...dv, steps: [] as TmEngineStepDto[] })),
				];
			}

			// unassignedOrders: 원본에 없는 미배차 주문 (직접 미배차로 내린 항목)
			const originUnassignedIds = new Set(concurrencyDispatchInfoRef.current.partialSaveUnassignedOrdersOrigin);
			const newlyUnassignedOrderIds = unassignedOrders.filter(o => !originUnassignedIds.has(o.id)).map(o => o.id);
			if (newlyUnassignedOrderIds.length > 0) {
				concurrencyPayload.unassignedOrders = newlyUnassignedOrderIds;
			}

			const res = await saveDispatch(concurrencyPayload);
			if (res?.statusCode === 0) {
				showAlert('알림', res?.message || '배차가 저장되었습니다.');
				closeCurrentTab();
				moveMenu('/tm/TmPlanList', { dccode: currentDccode, deliveryDate });
			}

			return;
		}

		const res = await saveDispatch(payload);
		if (res?.statusCode === 0) {
			const message = isPreDispatch ? '배차가 저장되었습니다.' : '배차가 확정되었습니다.';
			showAlert('알림', res?.message || message);

			// 현재 배차계획 탭 닫기
			closeCurrentTab();

			moveMenu('/tm/TmPlanList', { dccode: currentDccode, deliveryDate });
		}
	}; // 배차 저장/확정 공통 함수
	const handleSaveDispatch = () => handleDispatch(true);
	const handleConfirmDispatch = () => handleDispatch(false);

	const handleAutoModeChange = (e: CheckboxChangeEvent) => {
		if (isDataChanged) {
			Modal.confirm({
				title: '주문 순서, 차량 변경을 취소하시겠습니까?',
				onOk: () => {
					setIsManualMode(e.target.checked);
					handleReset();
				},
				okText: '확인',
				cancelText: '취소',
			});
		} else {
			setIsManualMode(e.target.checked);
		}
	};
	// 배차 조정 진입 시 needRecalculate 차량 수동재계산
	const recalculateNeedRecalculateVehicles = (
		allVehicles: TmVehiclesDto[],
		allUnassigned: TmUnassignedOrderDto[],
		allReturn: TmReturnOrderDto[],
	) => {
		const vehiclesToRecalculate = allVehicles.filter(v => v.needRecalculation);
		if (vehiclesToRecalculate.length === 0) return;

		const vehicleNames = vehiclesToRecalculate.map(v => v.vehicleName || v.carno).join(', ');

		showAlert('알림', `수동 재계산이 필요합니다. 차량: ${vehicleNames}`, async () => {
			const deliveryDate = runningDate.format('YYYYMMDD');

			const carnoCountMap = allVehicles.reduce((acc, v) => {
				acc[v.carno] = (acc[v.carno] || 0) + 1;
				return acc;
			}, {} as Record<string, number>);

			// needRecalculate 차량의 carno 추출
			const recalcCarnos = new Set(vehiclesToRecalculate.map(v => v.carno));

			// 해당 carno를 가진 모든 차량 포함 (다회전 차량 지원)
			const changedVehicles = allVehicles
				.filter(v => recalcCarnos.has(v.carno))
				.map(v => ({
					...v,
					geometry: null as string | null,
					steps: v.steps
						.filter(x => x.type === 'job')
						.sort((a, b) => Number(a.arrival) - Number(b.arrival))
						.map(s => ({ ...s, geometry: null as string | null })),
					roundCount: carnoCountMap[v.carno] || 1,
				}));

			const payload: OptimizeAutoReq = {
				dccode: currentDccode,
				deliveryDate,
				tmDeliveryType: '1',
				vehicles: changedVehicles,
			};

			const res = await optimizeAuto(true, payload); // 수동 재계산
			if (res?.statusCode === 0) {
				if (concurrencyDispatchInfoRef.current.isPartialSave) {
					const newPartialSaveVehiclesUniqueId = new Set([
						...concurrencyDispatchInfoRef.current.partialSaveVehicles,
						...res?.data?.vehicles.map(v => v.uniqueId),
					]);
					concurrencyDispatchInfoRef.current = {
						...concurrencyDispatchInfoRef.current,
						partialSaveVehicles: Array.from(newPartialSaveVehiclesUniqueId),
					};
				}

				const updatedVehicles: TmVehiclesDto[] = res?.data?.vehicles || [];
				const addedUnassignedOrders: TmUnassignedOrderDto[] =
					res?.data?.unassignedOrders?.filter(o => o.tmDeliveryType !== '2') || [];
				const addedReturnOrders: TmReturnOrderDto[] = res?.data?.returnOrders || [];
				const additionalReturnOrders: TmReturnOrderDto[] =
					res?.data?.unassignedOrders?.filter(o => o.tmDeliveryType === '2') || [];

				const nextUnassignedOrders = [...allUnassigned, ...addedUnassignedOrders];
				const nextReturnOrders = [...allReturn, ...addedReturnOrders, ...additionalReturnOrders];

				setUnassignedOrders(nextUnassignedOrders);
				setReturnOrders(nextReturnOrders);

				const sentUniqueIds = new Set(changedVehicles.map(v => v.uniqueId));
				const addedVehicles = updatedVehicles.map(v => ({
					...v,
					steps: v.steps.map((s, idx) => ({
						...s,
						_stepIndex: idx,
						_originVid: v.uniqueId,
					})),
				}));
				const nextVehicles = allVehicles.filter(v => !sentUniqueIds.has(v.uniqueId)).concat(addedVehicles);

				setVehicles(nextVehicles);
				setVehiclesFrozen(nextVehicles);

				// 탭 스냅샷 업데이트 (탭 생성 없이)
				updateCurrentTabSnapshot({
					unassignedOrders: nextUnassignedOrders,
					returnOrders: nextReturnOrders,
					vehicles: nextVehicles,
				});

				setIsDataChanged(false);
				setChangedRows([]);
				timelineRef.current?.clearEditedTasks();

				showAlert('알림', '수동재계산이 완료되었습니다.');
			}
		});
	};

	const handleRecalculate = async () => {
		// 차량이 하나도 없는지 확인
		if (vehicles.length === 0) {
			showAlert('알림', '차량이 없습니다. 차량을 추가해주세요.');
			return;
		}

		// 차량이 지정되지 않은 빈 차량이 있는지 확인
		const hasUnassignedVehicle = vehicles.some(v => v.carno === 'unassigned' || v.carno.startsWith('unassigned'));
		if (hasUnassignedVehicle) {
			showAlert('알림', '차량이 지정되지 않은 빈 차량이 있습니다. 먼저 차량을 지정해주세요.');
			return;
		}

		// 엔진 재계산 시 roundSeq가 3 이상인 차량이 있는지 확인
		if (!isManualMode) {
			const hasThreeOrMoreRounds = vehicles.some(v => (v.roundSeq ?? 1) >= 3);
			if (hasThreeOrMoreRounds) {
				showAlert('알림', '최대 2회전 배차까지 가능합니다.');
				return;
			}
		}

		const deliveryDate = runningDate.format('YYYYMMDD');

		// carno별 차량 수 카운트
		const carnoCountMap = vehicles.reduce((acc, v) => {
			acc[v.carno] = (acc[v.carno] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// changedRows를 기반으로 변경된 차량의 carno 추출
		const changedCarnos = new Set(vehicles.filter(v => changedRows.includes(v.uniqueId)).map(v => v.carno));

		// 변경된 carno를 가진 모든 차량 포함 (다회전 차량 지원)
		const changedVehicles = vehicles
			.filter(v => changedCarnos.has(v.carno))
			.map(v => ({
				...v,
				geometry: null as string | null,
				steps: v.steps
					.filter(x => x.type === 'job')
					.sort((a, b) => Number(a.arrival) - Number(b.arrival))
					.map(s => ({ ...s, geometry: null as string | null })),
				roundCount: carnoCountMap[v.carno] || 1, // carno가 같은 차량이 몇대인지 카운트
			}));

		const payload: OptimizeAutoReq = {
			dccode: currentDccode,
			deliveryDate,
			tmDeliveryType: '1',
			vehicles: changedVehicles,
		};
		const res = await optimizeAuto(isManualMode, payload);
		if (res?.statusCode === 0) {
			if (concurrencyDispatchInfoRef.current.isPartialSave) {
				const partialSaveVehiclesUniqueId = concurrencyDispatchInfoRef.current.partialSaveVehicles;

				const newPartialSaveVehiclesUniqueId = new Set([
					...partialSaveVehiclesUniqueId,
					...res?.data?.vehicles.map(v => v.uniqueId),
				]);
				concurrencyDispatchInfoRef.current = {
					...concurrencyDispatchInfoRef.current,
					partialSaveVehicles: Array.from(newPartialSaveVehiclesUniqueId),
				};
			}

			const updatedVehicles: TmVehiclesDto[] = res?.data?.vehicles || [];

			// 엔진 단에서 반품으로 처리하지 않은 미배차 주문건에 대한 처리
			const addedUnassignedOrders: TmUnassignedOrderDto[] =
				res?.data?.unassignedOrders?.filter(o => o.tmDeliveryType !== '2') || [];

			// 서버 단에서 반품으로 처리한건에 대한 처리
			const addedReturnOrders: TmReturnOrderDto[] = res?.data?.returnOrders || [];

			// 엔진 단에서 반품으로 처리한건에대한 처리
			const additionalReturnOrders: TmReturnOrderDto[] =
				res?.data?.unassignedOrders?.filter(o => o.tmDeliveryType === '2') || [];

			const nextUnassignedOrders = [...unassignedOrders, ...addedUnassignedOrders];

			// 기존 반품건 + 엔진 단에서 반품으로 처리하지 않은 미배차 주문건 + 서버 단에서 반품으로 처리한건에 대한 처리
			const nextReturnOrders = [...returnOrders, ...addedReturnOrders, ...additionalReturnOrders];

			setUnassignedOrders(nextUnassignedOrders);
			setReturnOrders(nextReturnOrders);

			// 요청에 보낸 uniqueId 목록
			const sentUniqueIds = new Set(changedVehicles.map(v => v.uniqueId));

			const addedVehicles = updatedVehicles.map(v => ({
				...v,
				steps: v.steps.map((s, idx) => ({
					...s,
					_stepIndex: idx,
					_originVid: v.uniqueId,
				})),
			}));
			const nextVehicles = vehicles.filter(v => !sentUniqueIds.has(v.uniqueId)).concat(addedVehicles);
			setVehicles(nextVehicles);
			createTab(isManualMode ? '수동' : '엔진', {
				unassignedOrders: nextUnassignedOrders,
				returnOrders: nextReturnOrders,
				vehicles: nextVehicles,
			});
			setVehiclesFrozen(nextVehicles);

			// 미배차 주문이 있는 경우 배차 결과 알림 표시
			if (nextUnassignedOrders.length > 0) {
				// 배차 성공 건수: vehicles의 steps 중 type이 'job'인 것들의 개수
				const successCount = nextVehicles.reduce((count, vehicle) => {
					return count + vehicle.steps.filter(step => step.type === 'job').length;
				}, 0);

				// 대상 건수: 배차 성공 건수 + 미배차 주문 건수
				const totalCount = successCount + nextUnassignedOrders.length;

				showAlert('알림', `총 ${totalCount}건 중 ${successCount}건 배차되었습니다.`);
			} else {
				showAlert('알림', res?.data?.message || `${isManualMode ? '수동' : '엔진'} 재계산이 완료되었습니다.`);
			}
			newOrdersRef.current = [];
			setIsDataChanged(false);
			setChangedRows([]);
			timelineRef.current?.clearEditedTasks();
		}
	};
	const handleManualSplit = (order: TmUnassignedOrderDto) => {
		setSelfSplitOrder(order);
	};

	// 수동 분할 완료 핸들러
	const handleManualSplitComplete = useCallback(
		(
			original: TmUnassignedOrderDto,
			splitGroups: { items: ManualSplitMasterItem[]; driverId: string; vehicleUniqueId?: string }[],
		) => {
			// 1. 미배차 목록에서 원본 주문 제거
			setUnassignedOrders(prev => prev.filter(o => o.uniqueId !== original.uniqueId));

			// [화랑님 기준] 아이템(SLIPLINE)마다 SEQ 증가 - 같은 SLIPNO여도 아이템별로 다른 SEQ
			const slipnoSeqMap = new Map<string, number>();
			const groupsWithSeq = splitGroups.map((group, idx) => {
				const itemsWithSeq = group.items.map(item => {
					const currentSeq = (slipnoSeqMap.get(item.slipno) || 0) + 1;
					slipnoSeqMap.set(item.slipno, currentSeq);
					return {
						...item,
						splitDeliverySeq: String(currentSeq),
					};
				});
				return {
					...group,
					items: itemsWithSeq,
					seq: idx,
				};
			});
			// 2. 차량 상태 업데이트 - splitGroups 기준으로 map 돌리기
			let splitSeq = 1;
			setVehicles(prevVehicles => {
				// 처리된 차량 uniqueId Set (나중에 남은 차량 필터링용 - carno 대신 uniqueId 사용하여 같은 차번의 다른 회전 보존)
				const processedUniqueIds = new Set<string>();
				const updatedVehicles: TmVehiclesDto[] = [];

				// splitGroups 기준으로 map 돌리기
				groupsWithSeq.forEach((group, idx) => {
					// prevVehicles에서 해당 차량 찾기 (vehicleUniqueId가 있으면 정확한 회차 매칭, 없으면 carno로 매칭)
					const existingVehicle = group.vehicleUniqueId
						? prevVehicles.find(v => v.uniqueId === group.vehicleUniqueId)
						: prevVehicles.find(v => v.carno === group.driverId);

					if (existingVehicle) {
						// 기존 차량: steps에 추가
						processedUniqueIds.add(existingVehicle.uniqueId);

						// 그룹 총계 계산
						const totalWeight = group.items.reduce((sum, item) => sum + Number(item.weight || 0), 0);
						const totalCube = group.items.reduce((sum, item) => sum + Number(item.cube || 0), 0);
						const totalQty = group.items.reduce((sum, item) => sum + Number(item.orderQty || 0), 0);

						// 차량의 작업 시작 시간 계산
						const startStep = existingVehicle.steps.find(s => s.type === 'start');
						const startWorkAt =
							startStep?.arrival && startStep.arrival !== '0'
								? dayjs(Number(startStep.arrival) * 1000)
								: dayjs().startOf('day').hour(9);

						// 새 step 생성
						const currentSeq = splitSeq++;
						const newStep: TmEngineStepDto = {
							...original,
							uniqueId: `${original.uniqueId}-split-${currentSeq}`,
							type: 'job',
							splitDeliveryYn: 'Y',
							splitDeliverySeq: String(group.seq + 1),
							splitItems: group.items,
							orderQty: String(totalQty),
							cube: String(totalCube),
							weight: String(totalWeight),
							arrival: startWorkAt.subtract(1, 'second').unix().toString(),
							_stepIndex: -1,
						};

						// 기존 + 새 step을 TimelineEvent로 변환 후 순차 재배치
						const allTasks = [...existingVehicle.steps.filter(s => s.type === 'job'), newStep].map(s => ({
							id: s.uniqueId,
							title: '',
							startAt: dayjs(Number(s.arrival) * 1000),
							spentTime: Math.ceil(Number(s.service || 60) / 60),
							rowId: existingVehicle.uniqueId,
						}));
						const arranged = arrangeTasksSequentially(allTasks, existingVehicle.uniqueId, startWorkAt);

						// 재배치된 시간 반영
						const updatedSteps = existingVehicle.steps.map(s => {
							if (s.type !== 'job') return s;
							const found = arranged.find(t => t.id === s.uniqueId);
							return found ? { ...s, arrival: found.startAt.unix().toString() } : s;
						});
						const arrangedNew = arranged.find(t => t.id === newStep.uniqueId);
						if (arrangedNew) newStep.arrival = arrangedNew.startAt.unix().toString();

						updatedVehicles.push({ ...existingVehicle, steps: [...updatedSteps, newStep] });
					} else {
						// 새 차량: planCarList에서 정보 가져와서 생성
						const carInfo = planCarList.find(car => car.carno === group.driverId);

						// 그룹 총계 계산
						const totalWeight = group.items.reduce((sum, item) => sum + Number(item.weight || 0), 0);
						const totalCube = group.items.reduce((sum, item) => sum + Number(item.cube || 0), 0);
						const totalQty = group.items.reduce((sum, item) => sum + Number(item.orderQty || 0), 0);

						// 기본 작업 시작 시간
						const startWorkAt = dayjs().startOf('day').hour(9);

						// 새 step 생성
						const currentSeq = splitSeq++;
						const newStep: TmEngineStepDto = {
							...original,
							uniqueId: `${original.uniqueId}-split-${currentSeq}`,
							type: 'job',
							splitDeliveryYn: 'Y',
							splitDeliverySeq: String(group.seq + 1),
							splitItems: group.items,
							orderQty: String(totalQty),
							cube: String(totalCube),
							weight: String(totalWeight),
							arrival: startWorkAt.unix().toString(),
							_stepIndex: -1,
						};

						if (!carInfo) {
							// planCarList에 없으면 기본 정보로 생성
							updatedVehicles.push({
								uniqueId: `${group.driverId}-${Date.now()}-${idx}`,
								carno: group.driverId,
								steps: [newStep],
							} as TmVehiclesDto);
							return;
						}

						// planCarList 정보를 사용하여 새 차량 생성
						updatedVehicles.push({
							uniqueId: `${group.driverId}-${Date.now()}-${idx}`,
							carno: group.driverId,
							vehicleType: carInfo.contractTypeData1,
							vehicleName: carInfo.vehicleName,
							drivername: carInfo.drivername,
							phone1: carInfo.phone1,
							maxWeight: carInfo.maxweight ? Number(carInfo.maxweight) : undefined,
							maxCbm: carInfo.maxcube ? Number(carInfo.maxcube) : undefined,
							carCapacity: carInfo.carcapacity,
							outGroupCd: carInfo.outgroupcd,
							vehicleGroup: carInfo.cargroup,
							steps: [newStep],
							roundSeq: 1,
						} as TmVehiclesDto);
					}
				});

				// 처리되지 않은 기존 차량들도 포함
				const remainingVehicles = prevVehicles.filter(v => !processedUniqueIds.has(v.uniqueId));

				const finalVehicles = [...remainingVehicles, ...updatedVehicles];

				// 변경된 차량 ID 추적 (새 차량도 포함)
				const affectedVehicleIds = updatedVehicles.map(v => v.uniqueId).filter((id): id is string => !!id);
				setChangedRows(prevRows => [...new Set([...prevRows, ...affectedVehicleIds])]);

				return finalVehicles;
			});

			// 3. 데이터 변경 플래그 설정
			setIsDataChanged(true);

			// 5. 모달 닫기
			setSelfSplitOrder(null);

			// 6. 완료 메시지
			showAlert('알림', `${splitGroups.length}개 차량으로 분할 배차되었습니다.`);
		},
		[vehicles, planCarList],
	);

	const handleOnUnassignedOrderRowClick = useCallback(
		(order: TmUnassignedOrderDto) => {
			if (order.uniqueId) {
				setSelectedOrderId(selectedOrderId === order.uniqueId ? undefined : order.uniqueId);
				setSelectedVehicleId(undefined);
			}
		},
		[selectedOrderId],
	);

	// 차량 변경 시 이전 carno 추적 (부분저장: 서버에 빈 배열로 전달)
	const handleVehicleCarnoChange = useCallback((oldUniqueId: string, oldCarno: string) => {
		if (!concurrencyDispatchInfoRef.current.isPartialSave) return;
		concurrencyDispatchInfoRef.current = {
			...concurrencyDispatchInfoRef.current,
			partialSaveDeletedVehicles: [
				...concurrencyDispatchInfoRef.current.partialSaveDeletedVehicles,
				{ uniqueId: oldUniqueId, carno: oldCarno },
			],
		};
	}, []);

	// 차량 삭제 핸들러
	const handleDeleteVehicle = useCallback(
		(vehicleId: string) => {
			const targetVehicle = vehicles.find(v => v.uniqueId === vehicleId);
			if (!targetVehicle) return;

			showConfirm(
				'알림',
				targetVehicle.carno.includes('unassigned')
					? '삭제하시겠습니까?'
					: `'${getVehicleAlias(targetVehicle)} (${targetVehicle.roundSeq || 1}회)' 을(를)\n삭제하시겠습니까?`,
				() => {
					// 부분저장 모드: 삭제된 차량을 추적 (서버에 빈 배열로 전달)
					if (concurrencyDispatchInfoRef.current.isPartialSave && !targetVehicle.carno.includes('unassigned')) {
						concurrencyDispatchInfoRef.current = {
							...concurrencyDispatchInfoRef.current,
							partialSaveDeletedVehicles: [
								...concurrencyDispatchInfoRef.current.partialSaveDeletedVehicles,
								{ uniqueId: targetVehicle.uniqueId, carno: targetVehicle.carno },
							],
							partialSaveVehicles: [
								...new Set([...concurrencyDispatchInfoRef.current.partialSaveVehicles, targetVehicle.uniqueId!]),
							],
						};
					}


					// 차량에 배정된 주문(delivery 타입)들을 분류
					const deliverySteps = targetVehicle.steps.filter(s => s.type === 'job');

					// 반품 주문 (tmDeliveryType === '2')은 반품 목록으로 이동
					const returnOrdersToMove = deliverySteps
						.filter(s => s.tmDeliveryType === '2')
						.map(s => ({ ...s, _stepIndex: -1 }));

					// 일반 주문은 미배차 목록으로 이동
					const unassignedOrdersToMove = deliverySteps
						.filter(s => s.tmDeliveryType !== '2')
						.map(s => ({ ...s, _stepIndex: -1 }));

					if (unassignedOrdersToMove.length > 0) {
						setUnassignedOrders(prev => [...prev, ...unassignedOrdersToMove]);
					}

					if (returnOrdersToMove.length > 0) {
						setReturnOrders(prev => [...prev, ...returnOrdersToMove]);
					}

					// 차량 목록에서 해당 차량 제거 후 roundSeq 재계산
					setVehicles(prev => {
						const remainingVehicles = prev.filter(v => v.uniqueId !== vehicleId);
						// 삭제 후 남은 차량들의 roundSeq 재계산 (modifiedVehicleId 없이 호출하여 기존 lastModifiedAt 유지)
						const { vehicles: recalculatedVehicles, changedVehicleIds } = recalculateRoundSeq(remainingVehicles);
						// roundSeq가 변경된 차량들을 changedRows에 추가
						if (changedVehicleIds.length > 0) {
							setChangedRows(prevRows => [...new Set([...prevRows, ...changedVehicleIds])]);
							// 부분저장 모드: 삭제로 인한 roundSeq 변경 차량도 partialSaveVehicles에 직접 추가 (재계산 불필요)
							if (concurrencyDispatchInfoRef.current.isPartialSave) {
								concurrencyDispatchInfoRef.current = {
									...concurrencyDispatchInfoRef.current,
									partialSaveVehicles: [
										...new Set([...concurrencyDispatchInfoRef.current.partialSaveVehicles, ...changedVehicleIds]),
									],
								};
							}
						}
						return recalculatedVehicles;
					});
					setVehiclesFrozen(prev => prev.filter(v => v.uniqueId !== vehicleId));

					if (changedRows.includes(vehicleId) && changedRows.length === 1) {
						setIsDataChanged(false);
					}

					setChangedRows(prev => prev.filter(id => id !== vehicleId));

					// 선택된 차량이 삭제된 차량이면 선택 해제
					if (selectedVehicleId === vehicleId) {
						setSelectedVehicleId(undefined);
					}

					showAlert('알림', '삭제가 완료 되었습니다.');
				},
				undefined,
				{ okText: '확인', cancelText: '취소' },
			);
		},
		[vehicles, selectedVehicleId, changedRows],
	);

	// 실비차 배차 성공 핸들러
	const handleTemporaryCarDispatchSuccess = useCallback(
		(result: TemporaryCarDispatchResult) => {
			const newUnassignedOrders = result.unassignedOrders || [];
			const newReturnOrders = [...returnOrders, ...(result.returnOrders || [])];
			setUnassignedOrders(newUnassignedOrders);
			setReturnOrders(newReturnOrders);
			const vehiclesToAdd = result.vehicles.map(v => ({
				...v,
				steps: v.steps.map((s, stepIndex) => ({
					...s,
					_originVid: v.uniqueId,
					_stepIndex: stepIndex,
				})),
			}));
			if (concurrencyDispatchInfoRef.current.isPartialSave) {
				const newPartialSaveVehiclesUniqueId = new Set([
					...concurrencyDispatchInfoRef.current.partialSaveVehicles,
					...vehiclesToAdd.map(v => v.uniqueId),
				]);
				concurrencyDispatchInfoRef.current = {
					...concurrencyDispatchInfoRef.current,
					partialSaveVehicles: Array.from(newPartialSaveVehiclesUniqueId),
				};
			}

			const newVehicles = [...vehiclesToAdd, ...vehicles];
			setVehicles(newVehicles);
			setVehiclesFrozen(newVehicles);

			createTab('실비차 배차', {
				unassignedOrders: newUnassignedOrders,
				returnOrders: newReturnOrders,
				vehicles: newVehicles,
			});
			timelineRef.current?.clearEditedTasks();
		},
		[vehicles, returnOrders],
	);

	const carNumberList = useMemo(() => {
		return vehicles.filter(v => !v.carno?.includes('unassigned')).map(v => v.carno);
	}, [vehicles]);

	// 차량 목록 변경 시 필터 초기화
	const prevCarListKeyRef = useRef('');

	useEffect(() => {
		const carListKey = [...carNumberList].sort((a, b) => a.localeCompare(b)).join(',');
		if (prevCarListKeyRef.current !== carListKey) {
			resetFilter();
			prevCarListKeyRef.current = carListKey;
		}
	}, [carNumberList, filterForm]);

	const resetFilter = useCallback(() => {
		setVehicleCarnoFilter([]);
		setVehicleTypeFilter([]);
		filterForm.resetFields();
	}, [filterForm]);

	// 다수건 배차 핸들러 - 체크된 주문의 carNo를 검증하여 유효한 주문만 배차
	const handleBulkDispatch = useCallback(
		(isReturn: boolean) => {
			const checkedIds = isReturn ? returnCheckedIds : unassignedCheckedIds;
			if (checkedIds.size === 0) {
				showAlert('알림', '선택된 주문이 없습니다.');
				return;
			}

			const listRef = isReturn ? returnListRef : unassignedListRef;
			const infoMap = listRef.current?.getDispatchInfoMap() || new Map<string, OrderDispatchInfo>();

			// 차량번호+회차별로 주문 그룹핑
			const vehicleOrderMap = new Map<string, string[]>();
			for (const orderId of checkedIds) {
				const info = infoMap.get(orderId);
				if (!info?.carNo) continue;
				const vehicle = vehicles.find(
					v => v.carno === info.carNo && (info.roundSeq == null || v.roundSeq === info.roundSeq),
				);
				if (!vehicle) continue;
				const existing = vehicleOrderMap.get(vehicle.uniqueId) || [];
				existing.push(orderId);
				vehicleOrderMap.set(vehicle.uniqueId, existing);
			}

			if (vehicleOrderMap.size === 0) {
				showAlert('알림', '유효한 차량번호가 지정된 주문이 없습니다.');
				return;
			}

			for (const [vehicleUniqueId, orderIds] of vehicleOrderMap) {
				timelineRef.current?.dispatchOrders(orderIds, vehicleUniqueId, isReturn);
			}
		},
		[unassignedCheckedIds, returnCheckedIds, vehicles],
	);

	// 신규 주문 알림 클릭 핸들러
	const handleNewOrderClick = useCallback(async () => {
		if (newOrderCount === 0) {
			showAlert('알림', '신규 주문이 없습니다.');
			return;
		}

		if (isDataChanged) {
			showAlert('알림', '수정사항이 있습니다. 재계산을 먼저 완료한 후 신규 주문을 추가해주세요.');
			return;
		}

		showConfirm(
			'알림',
			`신규 주문이 ${newOrderCount}건 접수되었습니다.\n배차 계획에 추가하시겠습니까?`,
			async () => {
				try {
					const res = await addNewOrders({
						dccode: currentDccode,
						deliveryDate: runningDate.format('YYYYMMDD'),
						tmDeliveryType: '1',
					});
					if (res?.statusCode !== 0 || !res.data) {
						showAlert('알림', res?.statusMessage || '신규 주문 추가에 실패했습니다.');
						return;
					}

					const newOrders = res.data;

					// ref에 저장 (탭전환/초기화 시 재주입용)
					newOrdersRef.current = [...newOrdersRef.current, ...newOrders];

					// applyNewOrders로 현재 상태에 반영 (새로 받은 주문만 처리하여 이중 병합 방지)
					const { vehicles: nextVehicles, unassignedOrders: nextUnassigned } = applyNewOrders(
						vehicles,
						unassignedOrders,
						newOrders,
					);

					// 신규주문이 병합/추가된 차량을 changedRows에 반영
					const origMap = new Map(vehicles.map(v => [v.uniqueId, v]));
					const newChangedIds = nextVehicles
						.filter(v => {
							const orig = origMap.get(v.uniqueId);
							return (
								orig && (orig.steps.length !== v.steps.length || JSON.stringify(orig.steps) !== JSON.stringify(v.steps))
							);
						})
						.map(v => v.uniqueId!)
						.filter(Boolean);

					setVehicles(nextVehicles);
					setUnassignedOrders(nextUnassigned);
					setIsDataChanged(true);
					if (newChangedIds.length > 0) {
						setChangedRows(prev => [...new Set([...prev, ...newChangedIds])]);
					}
					setNewOrderCount(0);

					showAlert('알림', `신규 주문 ${newOrders.length}건이 추가되었습니다.`);
				} catch (error) {
					showAlert('오류', '신규 주문 추가 중 오류가 발생했습니다.');
				}
			},
			undefined,
			{ okText: '주문 추가', cancelText: '취소' },
		);
	}, [newOrderCount, isDataChanged, currentDccode, runningDate, vehicles, unassignedOrders]);

	const handleOpenHistoryPopup = useCallback(
		(orderId: string) => {
			// vehicles 또는 unassignedOrders에서 주문 정보 찾기
			let targetOrder: any = null;
			vehicles.forEach(v => {
				const step = v.steps.find(s => s.id === orderId);
				if (step) targetOrder = step;
			});
			if (!targetOrder) {
				targetOrder = unassignedOrders.find(o => o.id === orderId);
			}
			if (!targetOrder) {
				targetOrder = returnOrders.find(o => o.id === orderId);
			}

			if (targetOrder) {
				setHistoryParams({
					custkey: targetOrder.id, // 또는 적절한 고객키 필드 (storerkey 등)
					custname: targetOrder.custName,
					dccode: currentDccode,
					deliverydt: runningDate,
				});
				pForm.setFieldValue('deliverydtFrom', dayjs(runningDate));
				pForm.setFieldValue('deliverydtTo', dayjs(runningDate));

				historyPopupRef?.current?.handlerOpen?.();
			} else {
				showAlert('오류', '주문 정보를 찾을 수 없습니다.');
			}
		},
		[vehicles, unassignedOrders, currentDccode, runningDate],
	);

	return (
		<DndProvider backend={HTML5Backend}>
			<OrderSelectionProvider>
				<CustomDragLayer />
				<Form key={1} form={pForm}>
					<Form.Item name="deliverydtFrom" hidden></Form.Item>
					<Form.Item name="deliverydtTo" hidden></Form.Item>
				</Form>
				<div style={{ height: '100%' }}>
					<MenuTitle>배차조정</MenuTitle>
					<UiFilterArea>
						<Space
							style={{
								justifyContent: 'space-between',
								maxWidth: isExpanded || isMapExpanded ? '100%' : 'calc(50% - 8px)',
								width: '100%',
							}}
						>
							<Button onClick={() => moveMenu('/tm/TmOrderList', { state: { key: Date.now() } })}>설정 다시하기</Button>
							<Space>
								<Badge count={newOrderCount} size="small" offset={[-3, 2]}>
									<Button type="text" shape="circle" icon={<BellOutlined />} onClick={handleNewOrderClick} />
								</Badge>
								<Button disabled={!isDataChanged} onClick={handleRecalculate}>
									{isManualMode ? '수동 재계산' : '엔진 재계산'}
								</Button>
								<Button onClick={handleSaveDispatch} disabled={isDataChanged || isSaveDisabled}>
									배차저장
								</Button>
								<Tooltip title=" 클릭 시 당일 배차 현황 화면으로 이동합니다.">
									<Button type="primary" onClick={handleConfirmDispatch} disabled={isDataChanged || isSaveDisabled}>
										배차확정
									</Button>
								</Tooltip>
							</Space>
						</Space>
					</UiFilterArea>

					<PanelContainer>
						<ExpandableContainer $isExpanded={isExpanded} $isMapExpanded={isMapExpanded}>
							<Collapse defaultActiveKey={['summary', 'order', 'unassigned', 'return']}>
								<Collapse.Panel
									header="배송"
									key="summary"
									extra={
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<Tag style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', border: 'none' }}>{currentDccodeName}</Tag>
											<Tag style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', border: 'none' }}>
												배송일 {runningDate.format('YYYY-MM-DD')}
											</Tag>
											<Button
												style={{ marginRight: '4px' }}
												onClick={e => {
													e.stopPropagation();
													moveMenu('/tm/TmPlanDiff', {
														dccode: currentDccode,
														deliveryDate: runningDate.format('YYYYMMDD'),
													});
												}}
											>
												배차결과 비교
											</Button>
											<Button onClick={handleBatchOptionOpen}>배차옵션 설정</Button>
										</div>
									}
								>
									<TmStyledTab
										type="editable-card"
										activeKey={activeTabKey}
										onChange={handleTabChange}
										onEdit={handleTabEdit}
										hideAdd
										items={tabItems}
									/>
									<Summary vehicles={vehiclesFrozen} />
								</Collapse.Panel>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										justifyContent: 'space-between',
										alignItems: 'center',
										gap: '6px',
										margin: '6px 0',
									}}
								>
									<Form form={filterForm} className="tm-plan-filter-bar">
										<CmCarSearch
											form={filterForm}
											name="carFilterName"
											code="carFilterCode"
											label="차량번호/기사명"
											placeholder="차량번호/기사명"
											selectionMode="multipleRows"
											callBack={handleCarFilterCallback}
											carnoList={carNumberList}
										/>
										<Select
											size="middle"
											mode="multiple"
											allowClear
											style={{ width: 110 }}
											placeholder="계약유형"
											value={vehicleTypeFilter}
											onChange={setVehicleTypeFilter}
											maxTagCount={vehicleTypeFilter.length === 5 ? 0 : 'responsive'}
											maxTagPlaceholder={omittedValues =>
												vehicleTypeFilter.length === 5 ? '전체' : `+${omittedValues.length}`
											}
											options={[
												{ label: '지입', value: '지입' },
												{ label: '월대', value: '월대' },
												{ label: '고정', value: '고정' },
												{ label: '임시', value: '임시' },
												{ label: '실비', value: '실비' },
											]}
										/>
										<CmCustSearch
											form={filterForm}
											name="custFilterName"
											code="custFilterCode"
											label="거래처코드/거래처명"
											placeholder="거래처코드/거래처명"
										/>
									</Form>
									<Space style={{ marginLeft: 'auto' }}>
										<Checkbox checked={isManualMode} onChange={handleAutoModeChange}>
											임의 순서 변경
										</Checkbox>
										<Button onClick={handleCarSetting}>차량 설정</Button>
										<Button
											type="text"
											icon={isExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
											onClick={() => setIsExpanded(prev => !prev)}
											style={{ marginRight: 8 }}
										/>
									</Space>
								</div>
								<Divider style={{ marginBottom: 0, marginTop: 0, border: 'none', borderBottom: '1px solid #f0f0f0' }} />
								<Collapse.Panel
									header={`정상 배차 ${vehicles.length}대`}
									key="order"
									extra={
										<Space>
											<Button onClick={handleCarAdd}>차량추가</Button>
										</Space>
									}
								>
									<ResizableContainer ref={containerRef}>
										<TmPlanTimeline
											ref={timelineRef}
											vehicles={vehicles}
											filteredVehicles={filteredVehicles}
											setVehicles={setVehicles}
											selectedVehicleId={selectedVehicleId}
											setSelectedVehicleId={setSelectedVehicleId}
											selectedOrderId={selectedOrderId}
											setSelectedOrderId={setSelectedOrderId}
											planCarList={planCarList}
											isManualMode={isManualMode}
											setIsDataChanged={setIsDataChanged}
											setChangedRows={setChangedRows}
											unassignedOrders={unassignedOrders}
											setUnassignedOrders={setUnassignedOrders}
											returnOrders={returnOrders}
											setReturnOrders={setReturnOrders}
											changedRows={changedRows}
											onDeleteVehicle={handleDeleteVehicle}
											onVehicleCarnoChange={handleVehicleCarnoChange}
											custFilterCode={custFilterCode}
										/>
										<ResizeHandle onMouseDown={handleResizeStart} />
									</ResizableContainer>
								</Collapse.Panel>
								<Collapse.Panel
									header={`미배차 주문 ${filteredUnassignedOrders.length}건`}
									key="unassigned"
									extra={
										<Space>
											<Button
												onClick={e => {
													e.stopPropagation();
													handleBulkDispatch(false);
												}}
												disabled={unassignedCheckedIds.size === 0}
											>
												다수건 배차
											</Button>
											<Button
												onClick={e => {
													e.stopPropagation();
													setIsTempCarModalVisible(true);
												}}
												disabled={unassignedOrders.length === 0}
											>
												실비차 배차
											</Button>
										</Space>
									}
								>
									<UnassignedOrdersList
										ref={unassignedListRef}
										key={`unassigned-${isManualMode}`}
										id="unassigned"
										data={filteredUnassignedOrders}
										selectedOrderId={selectedOrderId}
										isManualMode={isManualMode}
										onManualSplit={handleManualSplit}
										onRowClick={handleOnUnassignedOrderRowClick}
										onCheckedIdsChange={setUnassignedCheckedIds}
										vehicles={vehicles}
									/>
								</Collapse.Panel>

								<Collapse.Panel
									header={`반품 ${filteredReturnOrders.length}건`}
									key="return"
									extra={
										<Button
											onClick={e => {
												e.stopPropagation();
												handleBulkDispatch(true);
											}}
											disabled={returnCheckedIds.size === 0}
										>
											다수건 배차
										</Button>
									}
								>
									<ReturnOrdersList
										ref={returnListRef}
										id="return"
										data={filteredReturnOrders}
										selectedOrderId={selectedOrderId}
										onRowClick={handleOnUnassignedOrderRowClick}
										onCheckedIdsChange={setReturnCheckedIds}
										vehicles={vehicles}
									/>
								</Collapse.Panel>
							</Collapse>
						</ExpandableContainer>

						<MapContainer $isExpanded={isExpanded} $isMapExpanded={isMapExpanded}>
							<MapExpandButton
								onClick={() => setIsMapExpanded(prev => !prev)}
								title={isMapExpanded ? '지도 축소' : '지도 확장'}
							>
								{isMapExpanded ? <RightOutlined /> : <LeftOutlined />}
							</MapExpandButton>
							<RooutyMapProvider>
								<TmPlanMap
									dccode={currentDccode}
									vehicles={vehicles}
									vehiclesFrozen={vehiclesFrozen}
									selectedVehicleId={selectedVehicleId}
									setSelectedVehicleId={setSelectedVehicleId}
									selectedOrderId={selectedOrderId}
									setSelectedOrderId={setSelectedOrderId}
									unassignedOrders={unassignedOrders}
									returnOrders={returnOrders}
									onClickHistory={handleOpenHistoryPopup}
									onMapMarkerClick={() => {
										isMapClickRef.current = true;
									}}
								/>
							</RooutyMapProvider>
						</MapContainer>
					</PanelContainer>

					{/* 배차옵션 설정 모달 */}
					<CustomModal ref={refBaeModal} width="480px">
						<TmDispatchOptionsModal
							open={true}
							onClose={() => {
								refBaeModal.current?.handlerClose();
							}}
							onSave={handleDispatchOptionsSave}
							dccode={currentDccode}
						/>
					</CustomModal>

					{/* 배차이력 팝업 */}
					<CustomModal ref={historyPopupRef} width="1280px">
						<TmPlanCustomerDispatchHistoryPopup
							params={historyParams}
							pForm={pForm}
							close={() => historyPopupRef?.current?.handlerClose?.()}
						/>
					</CustomModal>

					{/* 실비차 조건 설정 모달 */}
					{isTempCarModalVisible && (
						<TmOutGroupSettingModal
							open={true}
							dccode={currentDccode}
							deliveryDate={runningDate.format('YYYYMMDD')}
							onClose={() => setIsTempCarModalVisible(false)}
							unassignedOrders={unassignedOrders}
							onDispatchSuccess={handleTemporaryCarDispatchSuccess}
						/>
					)}

					<CustomModal ref={refCarModal} width="1280px">
						<TmDispatchVehicleModal
							onClose={() => {
								refCarModal.current?.handlerClose();
								setPlanCarTrigger(prev => prev + 1);
							}}
							open={true}
							title="차량 설정"
							dccode={currentDccode}
							deliveryDate={runningDate}
							tmDeliveryType="1"
							assignedVehicles={assignedVehicles}
							multiRoundVehicles={multiRoundVehicles}
						/>
					</CustomModal>

					{/* 수동 분할 모달 */}
					<CustomModal ref={splitModalRef} width="1400px">
						{selfSplitOrder && (
							<TmOrderSplitModal
								close={() => setSelfSplitOrder(null)}
								onClose={() => setSelfSplitOrder(null)}
								onOk={handleManualSplitComplete}
								order={selfSplitOrder}
								vehicles={vehicles}
								planCarList={planCarList}
								dccode={currentDccode}
								deliveryDate={runningDate.format('YYYYMMDD')}
							/>
						)}
					</CustomModal>
				</div>
			</OrderSelectionProvider>
		</DndProvider>
	);
};
