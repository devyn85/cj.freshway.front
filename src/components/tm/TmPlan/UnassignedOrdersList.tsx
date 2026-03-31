import { TmReturnOrderDto, TmUnassignedOrderDto, TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import CustomModal from '@/components/common/custom/CustomModal';
import { ItemTypes } from '@/components/tm/planTimeline/types';
import TmBulkDispatchCarPopup from '@/components/tm/TmPlan/TmBulkDispatchCarPopup';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { parseKeyType } from '@/util/keyType';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useDrag, useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useOrderSelectionOptional } from './contexts/OrderSelectionContext';

// 공통 주문 타입 (미배차/반품 공통 필드)
type OrderItem = TmUnassignedOrderDto | TmReturnOrderDto;
type ListType = 'unassigned' | 'return';

// --- Styled Components ---

const Container = styled.div<{ $isDragOver?: boolean; $height?: number }>`
	border: 1px solid #e0e0e0;
	border-radius: 0;
	background-color: ${props => (props.$isDragOver ? '#e6f7ff' : '#fff')};
	position: relative;
	font-family: Pretendard, 'Malgun Gothic', 'Dotum', 'Arial', sans-serif;
	font-size: 12px;
	color: #333;
	transition: background-color 0.2s;
	outline: none;
	${props => props.$height && `height: ${props.$height}px;`}
`;

// --- Drag Preview Layer ---

const OrderDragLayer: React.FC = () => {
	const { isDragging, item, itemType, offset } = useDragLayer(monitor => ({
		isDragging: monitor.isDragging(),
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		offset: monitor.getClientOffset(),
	}));

	if (
		!isDragging ||
		!offset ||
		!item?.taskIds ||
		(itemType !== ItemTypes.UNASSIGNED_ORDER && itemType !== ItemTypes.RETURN_ORDER)
	) {
		return null;
	}

	return (
		<div
			style={{
				position: 'fixed',
				pointerEvents: 'none',
				left: 0,
				top: 0,
				transform: `translate(${offset.x - 16}px, ${offset.y - 16}px)`,
				willChange: 'transform',
				zIndex: 9999,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 18,
					height: 26,
					background: '#fff',
					border: '1px solid #d9d9d9',
					borderRadius: 3,
					boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
					color: '#555',
					fontSize: 12,
				}}
			>
				<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
					<path d="M300 276.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zM612 276.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0z" />
				</svg>
			</div>
		</div>
	);
};

// --- Main Component ---

interface Props {
	data: OrderItem[];
	selectedOrderId?: string;
	listType?: ListType;
	height?: number;
	emptyText?: string;
	isManualMode?: boolean;
	onManualSplit?: (item: OrderItem) => void;
	onRowClick?: (item: OrderItem) => void;
	id: string;
	onCheckedIdsChange?: (ids: Set<string>) => void;
	vehicles?: TmVehiclesDto[];
}

export interface OrderDispatchInfo {
	carNo: string;
	roundSeq?: number;
}

export interface OrdersListHandle {
	getDispatchInfoMap: () => Map<string, OrderDispatchInfo>;
}

// 차량번호 검색 유틸리티 함수
const getFilteredVehicles = (vehicles: any[], searchTerm: string) => {
	if (!searchTerm) return [];

	const vehicleList = vehicles
		.filter((v: any) => !v.carno?.includes('unassigned'))
		.map((v: any) => ({
			code: `${v.carno} (${v.roundSeq ?? 1}회)`,
			name: v.drivername || v.vehicleName,
		}));

	const searchTermLower = searchTerm.toLowerCase();
	return vehicleList.filter(
		(v: any) => v.code?.toLowerCase().includes(searchTermLower) || v.name?.toLowerCase().includes(searchTermLower),
	);
};

const OrdersList = forwardRef<OrdersListHandle, Props>(
	(
		{
			data,
			selectedOrderId,
			listType = 'unassigned',
			height,
			emptyText,
			isManualMode = true,
			onManualSplit,
			onRowClick,
			id,
			onCheckedIdsChange,
			vehicles: timelineVehicles = [],
		},
		ref,
	) => {
		const gridRef = useRef<any>(null);
		const parentRef = useRef<HTMLDivElement>(null);
		const editingRowIndexRef = useRef<number>(-1);
		const [isPopupVisible, setIsPopupVisible] = useState(false);
		const bulkCarModalRef = useRef<any>(null);
		const gridId = useMemo(() => `${id}_${uuidv4()}`, [id]);
		const onManualSplitRef = useRef(onManualSplit);
		onManualSplitRef.current = onManualSplit;

		useImperativeHandle(ref, () => ({
			getDispatchInfoMap: () => {
				const allData = gridRef.current?.getGridData() || [];
				const map = new Map<string, OrderDispatchInfo>();
				const roundRegex = /\s*\((\d+)회\)\s*$/;
				for (const row of allData) {
					if (row.carNo) {
						const raw = String(row.carNo);
						const match = raw.match(roundRegex);
						map.set(row.uniqueId, {
							carNo: match ? raw.replace(roundRegex, '') : raw,
							roundSeq: match ? Number(match[1]) : undefined,
						});
					}
				}
				return map;
			},
		}));

		// Checkbox state management
		const checkedIdsRef = useRef<Set<string>>(new Set());
		const onCheckedIdsChangeRef = useRef(onCheckedIdsChange);
		onCheckedIdsChangeRef.current = onCheckedIdsChange;

		// Context에서 선택 상태 가져오기 (Provider 없으면 로컬 상태 사용)
		const selectionContext = useOrderSelectionOptional();

		// 로컬 fallback 상태
		const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set());
		const [localLastClickedIndex, setLocalLastClickedIndex] = useState<number | null>(null);

		// listType에 따라 적절한 상태 선택
		const selectedIds = selectionContext
			? listType === 'return'
				? selectionContext.returnSelectedIds
				: selectionContext.unassignedSelectedIds
			: localSelectedIds;

		const setSelectedIds = selectionContext
			? listType === 'return'
				? selectionContext.setReturnSelectedIds
				: selectionContext.setUnassignedSelectedIds
			: setLocalSelectedIds;

		const setLastClickedIndex = selectionContext
			? listType === 'return'
				? selectionContext.setReturnLastClickedIndex
				: selectionContext.setUnassignedLastClickedIndex
			: setLocalLastClickedIndex;

		const dragType = listType === 'return' ? ItemTypes.RETURN_ORDER : ItemTypes.UNASSIGNED_ORDER;
		const draggedRowIdRef = useRef<string | null>(null);

		const [{ isDragging }, drag, dragPreview] = useDrag(
			() => ({
				type: dragType,
				canDrag: () => !!draggedRowIdRef.current,
				item: () => {
					const currentSelectedIds = new Set(selectedIds);
					const draggedId = draggedRowIdRef.current;

					// 드래그하는 항목을 항상 선택에 포함 (3개 선택 + 다른 행 드래그 = 4개 이동)
					if (draggedId) {
						currentSelectedIds.add(draggedId);
					}

					if (currentSelectedIds.size > 1) {
						// 원본 목록 순서 유지하여 taskIds 생성
						const orderedTaskIds = data.filter(o => currentSelectedIds.has(o.uniqueId)).map(o => o.uniqueId);
						return {
							taskIds: orderedTaskIds,
							isReturnOrder: listType === 'return',
							isMultiple: true,
						};
					}

					const singleId = draggedId || Array.from(currentSelectedIds)[0];
					if (!singleId) return null;

					return {
						taskIds: [singleId],
						isReturnOrder: listType === 'return',
						isMultiple: false,
					};
				},
				collect: monitor => ({
					isDragging: !!monitor.isDragging(),
				}),
			}),
			[dragType, listType, selectedIds, data],
		);

		// 기본 드래그 고스트 숨기기 (커스텀 OrderDragLayer 사용)
		useEffect(() => {
			const img = new Image();
			img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			dragPreview(img, { captureDraggingState: true });
		}, [dragPreview]);

		const handleMouseDown = (e: React.MouseEvent) => {
			if (!gridRef.current) return;

			// overlay를 잠시 숨겨서 아래 grid 셀 찾기
			const overlayEl = e.currentTarget as HTMLElement;
			overlayEl.style.pointerEvents = 'none';
			const elementBelow = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
			overlayEl.style.pointerEvents = '';

			if (!elementBelow) {
				draggedRowIdRef.current = null;
				return;
			}

			const allowedClassList = [
				'aui-grid-template-renderer-wrapper',
				'aui-grid-default-column',
				'aui-grid-renderer-base',
			];

			if (!allowedClassList.some(className => elementBelow.classList.contains(className))) {
				draggedRowIdRef.current = null;
				return;
			}
			// 가장 가까운 grid cell(td) 찾기
			const cell = elementBelow.closest('td') || elementBelow;

			const syntheticEvent = new MouseEvent('mousedown', {
				clientX: e.clientX,
				clientY: e.clientY,
			});
			Object.defineProperty(syntheticEvent, 'target', { value: cell });

			const indexes = gridRef.current.getIndexesByEvent(syntheticEvent);
			if (indexes) {
				const item = gridRef.current.getItemByRowIndex(indexes.startRowIndex);
				if (item) {
					draggedRowIdRef.current = item.uniqueId;
					return;
				}
			}
			draggedRowIdRef.current = null;
		};

		const gridCol = useMemo(() => {
			const columns: any[] = [];

			columns.push({
				dataField: '_dragHandle',
				headerText: '',
				width: 30,
				renderer: { type: 'TemplateRenderer' },
				labelFunction: () => {
					return '<div class="drag-handle-cell" data-drag-handle="true" style="cursor: move; display: flex; align-items: center; justify-content: center; height: 100%; color: #888; pointer-events: none;"><svg viewBox="64 64 896 896" focusable="false" data-icon="holder" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M300 276.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zM612 276.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0zm0 235.5a56 56 0 10112 0 56 56 0 10-112 0z"></path></svg></div>';
				},
				editable: false,
				sortable: false,
				filter: { showIcon: false, disableFilter: true },
			});

			columns.push({
				dataField: '_checked',
				headerText: '',
				width: 30,
				renderer: { type: 'TemplateRenderer' },
				labelFunction: (_rowIndex: any, _columnIndex: any, value: any) => {
					if (value) {
						return '<div style="display:flex;align-items:center;justify-content:center;height:100%"><div style="width:14px;height:14px;border:1px solid #1890ff;border-radius:2px;background:#1890ff;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg viewBox="64 64 896 896" width="10" height="10" fill="#fff"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.4 37.5 16.4 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"/></svg></div></div>';
					}
					return '<div style="display:flex;align-items:center;justify-content:center;height:100%"><div style="width:14px;height:14px;border:1px solid #d9d9d9;border-radius:2px;background:#fff;cursor:pointer;"></div></div>';
				},
				editable: false,
				sortable: false,
				filter: { showIcon: false, disableFilter: true },
			});

			columns.push({
				dataField: 'carNo',
				headerText: '차량번호',
				width: 130,
				dataType: 'code',
				commRenderer: {
					type: 'search',
					onClick: function () {
						editingRowIndexRef.current = gridRef.current?.getSelectedIndex()?.[0] ?? -1;
						bulkCarModalRef.current?.handlerOpen();
						setIsPopupVisible(true);
					},
				},
			});

			if (listType === 'return') {
				columns.push({ dataField: 'slipdt', headerText: '주문 접수일', width: 100, editable: false });
			}

			columns.push(
				{ dataField: 'custName', headerText: '거래처명', width: 150, style: 'renderer-ta-l', editable: false },
				{ dataField: 'custAddress', headerText: '주소', width: 250, style: 'renderer-ta-l', editable: false },
				{
					dataField: 'weight',
					headerText: '중량(kg)',
					width: 80,
					style: 'renderer-ta-r',
					editable: false,
					dataType: 'numeric',
					labelFunction: (_rowIndex: any, _columnIndex: any, value: any) =>
						value != null ? Number(value).toFixed(3) : '',
				},
				{
					dataField: 'cube',
					headerText: '체적(m³)',
					width: 80,
					style: 'renderer-ta-r',
					editable: false,
					dataType: 'numeric',
					labelFunction: (_rowIndex: any, _columnIndex: any, value: any) =>
						value != null ? Number(value).toFixed(2) : '',
				},
				{ dataField: 'reqdlvtime1From', headerText: 'OTD(from)', width: 120, style: 'renderer-ta-c', editable: false },
				{ dataField: 'reqdlvtime1To', headerText: 'OTD(to)', width: 120, style: 'renderer-ta-c', editable: false },
				{
					dataField: 'keyCustType',
					headerText: '키 종류',
					width: 80,
					editable: false,
					labelFunction: (_rowIndex: any, _columnIndex: any, _value: any, _headerText: any, item: any) =>
						item.passwordTypeCd ? parseKeyType(item.passwordType, item.passwordTypeCd).keyType : '',
				},
				{ dataField: 'defCarno', headerText: '고정 차량', width: 150, editable: false },
			);

			if (listType !== 'return' && isManualMode) {
				columns.push({
					dataField: 'action',
					headerText: '수동 분할',
					editable: false,
					width: 80,
					sortable: false,
					filter: { showIcon: false, disableFilter: true },
					renderer: {
						type: 'ButtonRenderer',
						labelText: '분할',
						onClick: (event: any) => {
							onManualSplitRef.current?.(event.item);
						},
					},
				});
			}

			return columns;
		}, [listType, isManualMode]);

		const gridProps = useMemo(
			() => ({
				showRowCheckColumn: false,
				showRowNumColumn: false,
				editable: true,
				rowHeight: 22,
				headerHeight: 22,
				fixedColumnCount: 2,
				selectionMode: 'multipleCells',
				wordWrap: false,
				enableSorting: true,
				enableMovingColumn: false,
				enableClipboard: true,
				rowIdField: 'uniqueId',
				noDataMessage: emptyText || (listType === 'return' ? '반품 데이터가 없습니다' : '데이터가 없습니다'),
				autoResize: false,
			}),
			[emptyText, listType],
		);

		const lastWidthRef = useRef<number>(0);

		const refreshGridSizeCore = (force?: boolean) => {
			const grid = gridRef.current;
			if (!grid) return;
			const container = parentRef.current;
			if (!container || !container.isConnected) return;
			const currentWidth = container?.clientWidth ?? 0;
			// 너비가 변하지 않았으면 리사이즈 스킵 (높이만 줄어드는 피드백 루프 방지)
			if (!force && currentWidth === lastWidthRef.current) return;
			lastWidthRef.current = currentWidth;
			grid.resize();
			const sizeList = grid.getFitColumnSizeList(true);
			let totalDiff = [30, 30].reduce((sum, target, i) => {
				const diff = Math.max(sizeList[i] - target, 0);
				sizeList[i] = target;
				return sum + diff;
			}, 0);

			if (sizeList[2] > 60) {
				sizeList[2] = sizeList[2] + 25;
				totalDiff = totalDiff + 25;
			}
			if (totalDiff > 0) {
				const otherTotal = sizeList.slice(2).reduce((sum: number, s: number) => sum + s, 0);
				for (let i = 2; i < sizeList.length; i++) {
					sizeList[i] += totalDiff * (sizeList[i] / otherTotal);
				}
			}
			grid.setColumnSizeList(sizeList);
		};

		const refreshGridSizeTimer = useRef<ReturnType<typeof setTimeout>>();
		const refreshGridSize = (force?: boolean) => {
			clearTimeout(refreshGridSizeTimer.current);
			refreshGridSizeTimer.current = setTimeout(() => refreshGridSizeCore(force), 100);
		};

		// isManualMode 변경 시 컬럼 레이아웃 갱신
		useEffect(() => {
			if (!gridRef.current) return;
			gridRef.current.changeColumnLayout(gridCol);
			setTimeout(() => refreshGridSize(true), 100);
		}, [gridCol]);

		useEffect(() => {
			if (!gridRef.current) return;

			// Clean up stale checked IDs
			const validIds = new Set(data.map(d => d.uniqueId));
			let changed = false;
			for (const id of [...checkedIdsRef.current]) {
				if (!validIds.has(id)) {
					checkedIdsRef.current.delete(id);
					changed = true;
				}
			}
			if (changed) {
				onCheckedIdsChangeRef.current?.(new Set(checkedIdsRef.current));
			}

			const dataWithChecked = data.map(item => ({
				...item,
				_checked: checkedIdsRef.current.has(item.uniqueId),
			}));
			gridRef.current.setGridData(dataWithChecked);

			if (data.length > 0) {
				setTimeout(() => refreshGridSize(true), 100);
			}
		}, [data]);

		// 브라우저 리사이즈 + Collapse 접기/펼치기 대응
		useEffect(() => {
			let timer: ReturnType<typeof setTimeout>;
			const onResize = () => {
				clearTimeout(timer);
				timer = setTimeout(refreshGridSize, 150);
			};
			window.addEventListener('resize', onResize);

			// ResizeObserver로 상위 컨테이너 크기 변화 감지 (Collapse 토글 등)
			// 주의: Container 자체를 감시하면 grid.resize() → Container 크기 변경 → ResizeObserver 재발동 순환 루프 발생
			// 따라서 Container의 부모(parentElement)를 감시하여 외부 레이아웃 변화만 감지
			const container = parentRef.current;
			const observeTarget = container?.parentElement;
			let observer: ResizeObserver | null = null;
			if (observeTarget) {
				observer = new ResizeObserver(() => {
					clearTimeout(timer);
					timer = setTimeout(refreshGridSize, 150);
				});
				observer.observe(observeTarget);
			}

			return () => {
				window.removeEventListener('resize', onResize);
				observer?.disconnect();
				clearTimeout(timer);
			};
		}, []);

		// AUIGrid 이벤트 바인딩
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid) return;

			const handleSelectionChange = (_e: any) => {
				const selectedItems = grid.getSelectedItems();
				const newSelectedIds = new Set<string>();

				selectedItems.forEach((s: any) => {
					if (s.item) newSelectedIds.add(s.item.uniqueId);
				});

				// context나 local 상태에 저장된 선택 상태와 다를 때만 업데이트
				const currentSelectedArray = Array.from(selectedIds);
				const newSelectedArray = Array.from(newSelectedIds);

				if (
					currentSelectedArray.length !== newSelectedArray.length ||
					!currentSelectedArray.every(id => newSelectedIds.has(id))
				) {
					setSelectedIds(newSelectedIds);

					if (selectedItems.length > 0) {
						// 클릭 시 마지막으로 클릭한 인덱스 업데이트
						const clickedIndex = selectedItems[selectedItems.length - 1].rowIndex;
						setLastClickedIndex(clickedIndex);

						const firstItem = selectedItems[0].item;
						onRowClick?.(firstItem);
					}
				}
			};

			grid.bind('selectionChange', handleSelectionChange);

			return () => {
				grid.unbind('selectionChange', handleSelectionChange);
			};
		}, [onRowClick, setSelectedIds, selectedIds, setLastClickedIndex]);

		// Checkbox click handling
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid) return;

			const handleCellClick = (e: any) => {
				if (e.dataField === '_checked') {
					const newValue = !e.item._checked;
					grid.setCellValue(e.rowIndex, '_checked', newValue);

					if (newValue) {
						checkedIdsRef.current.add(e.item.uniqueId);
					} else {
						checkedIdsRef.current.delete(e.item.uniqueId);
					}

					onCheckedIdsChangeRef.current?.(new Set(checkedIdsRef.current));
				}
			};

			const handleCellEditEnd = (e: any) => {
				if (e.dataField === 'carNo' && e.value) {
					checkRow(e.rowIndex);
					refreshGridSize(true);
				}
			};

			grid.bind('cellClick', handleCellClick);
			grid.bind('cellEditEnd', handleCellEditEnd);

			return () => {
				grid.unbind('cellClick', handleCellClick);
				grid.unbind('cellEditEnd', handleCellEditEnd);
			};
		}, []);

		const checkRow = (rowIndex: number) => {
			const grid = gridRef.current;
			if (!grid) return;
			const item = grid.getItemByRowIndex(rowIndex);
			if (item && !item._checked) {
				grid.setCellValue(rowIndex, '_checked', true);
				checkedIdsRef.current.add(item.uniqueId);
				onCheckedIdsChangeRef.current?.(new Set(checkedIdsRef.current));
			}
		};

		const handleCarSelect = (vehicleUniqueId: string) => {
			const rowIndex = editingRowIndexRef.current;
			if (rowIndex >= 0 && gridRef.current) {
				const vehicle = timelineVehicles.find(v => v.uniqueId === vehicleUniqueId);
				if (vehicle) {
					const roundSeq = vehicle.roundSeq ?? 1;
					gridRef.current.setCellValue(rowIndex, 'carNo', `${vehicle.carno} (${roundSeq}회)`);
					refreshGridSize(true);
					checkRow(rowIndex);
				}
			}
			bulkCarModalRef.current?.handlerClose();
			setIsPopupVisible(false);
		};

		// 차량번호 자동완성 드롭다운: cellEditEndBefore에서 직접 처리
		const timelineVehiclesRef = useRef(timelineVehicles);
		timelineVehiclesRef.current = timelineVehicles;

		useEffect(() => {
			const grid = gridRef.current;
			if (!grid) return;

			const handleCarNoSearch = (e: any) => {
				// 차량번호 열이 아니거나, 엔터키(13)가 아니면 변경 사항 없이 그대로 반환 (블러 등)
				if (e.dataField !== 'carNo' || e.which !== 13) return e.value;

				if (e.value === e.oldValue) return e.value;

				const searchTerm = (e.value || '').trim();

				if (!searchTerm) {
					return '';
				}

				const filtered = getFilteredVehicles(timelineVehiclesRef.current, searchTerm);

				if (filtered.length === 1) {
					// 1건일 경우 선택된 코드로 반환하여 자동 완성 (onKeyDownCapture에서도 처리되지만, 마우스 포커스 아웃 등으로 편집이 종료될 때를 대비함)
					return filtered[0].code;
				} else if (filtered.length > 1) {
					// 여러 건일 경우 onKeyDownCapture에서 처리하므로 기본값 반환
					return e.value;
				} else {
					// 검색 결과가 없으면 상세 검색 팝업 오픈
					setTimeout(() => {
						editingRowIndexRef.current = e.rowIndex;
						bulkCarModalRef.current?.handlerOpen();
						setIsPopupVisible(true);
					}, 50);
					return '';
				}
			};

			grid.bind('cellEditEndBefore', handleCarNoSearch);
			return () => grid.unbind('cellEditEndBefore', handleCarNoSearch);
		}, []);

		// timelineVehicles 변경(차량 추가/수정/삭제 등) 시 그리드 내 입력된 존재하지 않는 차량번호 초기화
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid || !timelineVehicles) return;

			const allData = grid.getGridData() || [];
			if (allData.length === 0) return;

			let hasChanges = false;
			const roundRegex = /\s*\((\d+)회\)\s*$/;

			allData.forEach((row: any, index: number) => {
				if (row.carNo) {
					const raw = String(row.carNo);
					const match = raw.match(roundRegex);
					const carNoValue = match ? raw.replace(roundRegex, '') : raw;
					const roundSeqValue = match ? Number(match[1]) : 1;

					// carNoValue가 'unassigned'를 포함하면 스킵
					if (carNoValue.includes('unassigned')) return;

					// 타임라인 데이터(timelineVehicles)에 존재하는 차량인지 확인
					const isExist = timelineVehicles.some(v => v.carno === carNoValue && (v.roundSeq ?? 1) === roundSeqValue);

					if (!isExist) {
						grid.setCellValue(index, 'carNo', '');
						grid.setCellValue(index, '_checked', false); // 무조건 체크 해제 반영
						checkedIdsRef.current.delete(row.uniqueId);
						hasChanges = true;
					}
				}
			});

			if (hasChanges) {
				grid.clearSelection?.(); // 전체 선택 해제 (row selection 제거)
				setSelectedIds(new Set()); // 선택 상태 초기화
				refreshGridSize(true);
				onCheckedIdsChangeRef.current?.(new Set(checkedIdsRef.current));
			}
		}, [timelineVehicles]);

		const handleKeyDownCapture = (e: React.KeyboardEvent) => {
			if (e.key === ' ') {
				const grid = gridRef.current;
				if (!grid) return;
				const selection = grid.getSelectedIndex();
				if (selection && selection.length >= 2) {
					const [rowIndex, columnIndex] = selection;
					const cols = grid.getColumnLayout();
					const dataField = cols[columnIndex]?.dataField;
					if (dataField === '_checked') {
						e.preventDefault(); // 스페이스바 스크롤 방지
						e.stopPropagation();
						const item = grid.getItemByRowIndex(rowIndex);
						if (item) {
							const newValue = !item._checked;
							grid.setCellValue(rowIndex, '_checked', newValue);

							if (newValue) {
								checkedIdsRef.current.add(item.uniqueId);
							} else {
								checkedIdsRef.current.delete(item.uniqueId);
							}

							onCheckedIdsChangeRef.current?.(new Set(checkedIdsRef.current));
						}
					}
				}
			}

			if (e.key === 'Enter') {
				const grid = gridRef.current;
				if (!grid) return;

				const activeElement = document.activeElement as HTMLInputElement;
				// AUIGrid 인풋인지 확인
				if (activeElement && activeElement.tagName === 'INPUT' && activeElement.closest('.aui-grid-wrap')) {
					const selection = grid.getSelectedIndex();
					if (selection && selection.length >= 2) {
						const [rowIndex, columnIndex] = selection;
						// columnLayout 기준으로 dataField 가져오기
						const cols = grid.getColumnLayout();
						const dataField = cols[columnIndex]?.dataField;

						if (dataField === 'carNo') {
							const searchTerm = (activeElement.value || '').trim();
							if (!searchTerm) return;

							const filtered = getFilteredVehicles(timelineVehiclesRef.current, searchTerm);

							// 1개 또는 여러 개인 경우 이벤트 전파 중단
							if (filtered.length >= 1) {
								e.preventDefault();
								e.stopPropagation();
								if (e.nativeEvent) {
									e.nativeEvent.stopImmediatePropagation();
								}
							}

							const finishEditing = () => {
								if (grid.forceEditingComplete) {
									grid.forceEditingComplete();
								} else {
									activeElement.blur();
								}
								checkRow(rowIndex);
								refreshGridSize(true);
							};

							// 결과가 1개인 경우 자동완성 처리
							if (filtered.length === 1) {
								activeElement.value = filtered[0].code;
								grid.setCellValue(rowIndex, 'carNo', filtered[0].code);
								finishEditing();
							}
							// 결과가 여러 개인 경우에만 편집 종료를 막고 바로 드롭다운 오픈
							else if (filtered.length > 1) {
								const cellElement = grid.getCellElementByIndex(rowIndex, columnIndex);
								const cellElementRect = cellElement?.getBoundingClientRect();

								const dropdownConfig = {
									columns: [
										{ key: 'code', title: '차량번호' },
										{ key: 'name', title: '기사명' },
									],
								};

								const handleDropdownClick = (selected: any) => {
									activeElement.value = selected.code;
									grid.setCellValue(rowIndex, 'carNo', selected.code);
									grid.closeSearchDropdownPopup();
									finishEditing();
								};

								if (cellElementRect) {
									grid.openSearchDropdownPopup({
										dropdownConfig,
										dropdownData: filtered,
										handleDropdownClick,
										cellElementRect,
									});
								}
							}
							// 0개이면 기존 cellEditEndBefore 로직을 그대로 타게 둠
						}
					}
				}
			}
		};

		return (
			<Container
				id={`${id}-drop-zone`}
				ref={parentRef}
				$height={height}
				tabIndex={0}
				$isDragOver={isDragging}
				onKeyDownCapture={handleKeyDownCapture}
			>
				<OrderDragLayer />
				<div style={{ position: 'relative', height: '100%', width: '100%' }}>
					<AUIGrid ref={gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
					<div
						ref={drag}
						onMouseDown={handleMouseDown}
						style={{
							position: 'absolute',
							top: 22,
							left: 0,
							width: 30,
							bottom: 0,
							zIndex: 10,
							cursor: 'move',
							opacity: 0,
						}}
					/>
				</div>
				<CustomModal ref={bulkCarModalRef} width="900px">
					{isPopupVisible && (
						<TmBulkDispatchCarPopup
							vehicles={timelineVehicles}
							onSelect={handleCarSelect}
							onClose={() => {
								bulkCarModalRef.current?.handlerClose();
								setIsPopupVisible(false);
							}}
						/>
					)}
				</CustomModal>
			</Container>
		);
	},
);

// 하위 호환성을 위한 alias export
export const UnassignedOrdersList = OrdersList;
export const ReturnOrdersList = forwardRef<OrdersListHandle, Omit<Props, 'listType'>>((props, ref) => (
	<OrdersList ref={ref} {...props} listType="return" />
));

export default React.memo(OrdersList, (prev, next) => {
	return (
		prev.data === next.data &&
		prev.selectedOrderId === next.selectedOrderId &&
		prev.listType === next.listType &&
		prev.id === next.id &&
		prev.isManualMode === next.isManualMode &&
		prev.vehicles === next.vehicles
	);
});
