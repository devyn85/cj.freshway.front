import {
	getManualSplitMasterList,
	ManualSplitMasterItem,
	TmUnassignedOrderDto,
	TmVehiclesDto,
} from '@/api/tm/apiTmDispatch';
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import TmBulkDispatchCarPopup from '@/components/tm/TmPlan/TmBulkDispatchCarPopup';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { showAlert } from '@/util/MessageUtil';
import { Button, Select, Space } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- Types ---

interface TmOrderSplitModalProps {
	close?: () => void; // CustomModal X 버튼 연동용
	onClose?: () => void;
	onOk: (
		original: TmUnassignedOrderDto,
		splitGroups: { items: ManualSplitMasterItem[]; driverId: string; vehicleUniqueId?: string }[],
	) => void;
	order: TmUnassignedOrderDto;
	vehicles: TmVehiclesDto[];
	planCarList: any[];
	dccode: string;
	deliveryDate: string;
}

interface SplitItemRow {
	id: string;
	originalItem: ManualSplitMasterItem;
	sku: string;
	skuDescr: string;
	custname: string;
	custkey: string;
	storageType: string;
	orderQty: number;
	allocatedQty: number;
	carNo: string; // "차량번호 (N회)" or ""
	isOriginal: boolean;
}

// --- Utility ---

const roundRegex = /\s*\((\d+)회\)\s*$/;

const parseCarNo = (carNoText: string) => {
	const match = carNoText.match(roundRegex);
	return {
		carno: match ? carNoText.replace(roundRegex, '') : carNoText,
		roundSeq: match ? Number(match[1]) : 1,
	};
};

const formatCarNo = (carno: string, roundSeq: number) => `${carno} (${roundSeq}회)`;

// 차량번호 검색 유틸리티 (UnassignedOrdersList 동일 패턴)
const getFilteredVehicles = (vehicles: TmVehiclesDto[], searchTerm: string) => {
	if (!searchTerm) return [];

	const vehicleList = vehicles
		.filter(v => v.carno && !v.carno.includes('unassigned'))
		.map(v => ({
			code: formatCarNo(v.carno!, v.roundSeq ?? 1),
			name: v.drivername || '',
			uniqueId: v.uniqueId,
		}));

	const searchTermLower = searchTerm.toLowerCase();
	return vehicleList.filter(
		v => v.code.toLowerCase().includes(searchTermLower) || v.name.toLowerCase().includes(searchTermLower),
	);
};

// eslint-disable-next-line jsdoc/require-jsdoc
const TmOrderSplitModal = ({
	onClose,
	onOk,
	order,
	vehicles,
	planCarList,
	dccode,
	deliveryDate,
}: TmOrderSplitModalProps) => {
	const [loading, setLoading] = useState(false);
	const [masterItems, setMasterItems] = useState<ManualSplitMasterItem[]>([]);
	const [splitRows, setSplitRows] = useState<SplitItemRow[]>([]);

	// 일괄 할당 UI
	const [showBulkAssign, setShowBulkAssign] = useState(false);
	const [bulkAssignCarNo, setBulkAssignCarNo] = useState<string>();

	// 차량 팝업
	const [isPopupVisible, setIsPopupVisible] = useState(false);

	// 그리드 마운트 완료 트리거
	const [gridsReady, setGridsReady] = useState(0);

	// Grid refs
	const splitGridRef = useRef<any>(null);
	const vehicleGridRef = useRef<any>(null);

	// Other refs
	const editingRowIndexRef = useRef<number>(-1);
	const bulkCarModalRef = useRef<any>(null);
	const vehiclesRef = useRef(vehicles);
	vehiclesRef.current = vehicles;
	const splitRowsRef = useRef(splitRows);
	splitRowsRef.current = splitRows;

	// --- 차량 목록 (현재 할당된 차량만 사용) ---

	const vehicleOptions = useMemo(
		() =>
			vehicles
				.filter(v => v.carno && !v.carno.includes('unassigned'))
				.map(v => ({
					label: formatCarNo(v.carno!, v.roundSeq ?? 1),
					value: formatCarNo(v.carno!, v.roundSeq ?? 1),
				})),
		[vehicles],
	);

	// --- 통계 계산 ---

	const calculateStats = useCallback((row: SplitItemRow) => {
		const totalQty = row.orderQty;
		if (totalQty === 0) return { weight: 0, cube: 0 };
		const ratio = row.allocatedQty / totalQty;
		return {
			weight: Number(row.originalItem.weight || 0) * ratio,
			cube: Number(row.originalItem.cube || 0) * ratio,
		};
	}, []);

	// 선택된 차량 (상품에 할당된 차량)
	const selectedVehicles = useMemo(() => {
		const selectedCarNos = new Set(splitRows.map(r => r.carNo).filter(Boolean));
		return vehicles.filter(
			v => v.carno && !v.carno.includes('unassigned') && selectedCarNos.has(formatCarNo(v.carno!, v.roundSeq ?? 1)),
		);
	}, [splitRows, vehicles]);

	// 차량별 통계
	const vehicleStats = useMemo(() => {
		const stats: Record<string, { qty: number; weight: number; cube: number }> = {};

		selectedVehicles.forEach(v => {
			const key = formatCarNo(v.carno!, v.roundSeq ?? 1);
			stats[key] = { qty: 0, weight: 0, cube: 0 };
		});

		splitRows.forEach(row => {
			if (row.carNo && stats[row.carNo]) {
				const { weight, cube } = calculateStats(row);
				stats[row.carNo].qty += row.allocatedQty;
				stats[row.carNo].weight += weight;
				stats[row.carNo].cube += cube;
			}
		});

		return stats;
	}, [selectedVehicles, splitRows, calculateStats]);

	// 전체 요약
	const totalStats = useMemo(
		() =>
			masterItems.reduce(
				(acc, item) => ({
					qty: acc.qty + Number(item.orderQty || 0),
					weight: acc.weight + Number(item.weight || 0),
					cube: acc.cube + Number(item.cube || 0),
				}),
				{ qty: 0, weight: 0, cube: 0 },
			),
		[masterItems],
	);

	// SKU별 마스터 주문수량
	const masterOrderQtyBySku = useMemo(() => {
		const map: Record<string, number> = {};
		masterItems.forEach(item => {
			map[item.sku] = (map[item.sku] || 0) + Number(item.orderQty || 0);
		});
		return map;
	}, [masterItems]);

	// SKU별 할당수량 합계
	const getSkuAllocatedQtySum = useCallback(() => {
		const sum: Record<string, number> = {};
		splitRows.forEach(row => {
			sum[row.sku] = (sum[row.sku] || 0) + (row.allocatedQty || 0);
		});
		return sum;
	}, [splitRows]);

	// --- 데이터 로드 (마운트 시 실행 - CustomModal isView=true일 때만 마운트됨) ---

	useEffect(() => {
		if (!order) return;

		const fetchMasterList = async () => {
			setLoading(true);
			try {
				const res = await getManualSplitMasterList({
					custCode: order.storerkey || '',
					dccode,
					deliveryDate,
					dispatchStatus: '00,50,90',
					tmDeliveryType: order.tmDeliveryType || 'WD',
					truthCustkey: order.id || '',
				});

				const items = res || [];
				setMasterItems(items);

				const sortedItems = [...items].sort((a, b) => a.sku.localeCompare(b.sku));

				const initialRows: SplitItemRow[] = sortedItems.map(item => ({
					id: uuidv4(),
					originalItem: item,
					sku: item.sku,
					skuDescr: item.skuDescr,
					custname: item.custname,
					custkey: item.custkey,
					storageType: item.storagetypedesc,
					orderQty: Number(item.orderQty || 0),
					allocatedQty: Number(item.orderQty || 0),
					carNo: '',
					isOriginal: true,
				}));
				setSplitRows(initialRows);
			} catch (error) {
				showAlert('오류', '상세 목록을 불러오는데 실패했습니다.');
			} finally {
				setLoading(false);
			}
		};

		fetchMasterList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// --- 마운트 후 그리드 준비 대기 ---

	useEffect(() => {
		const interv = setInterval(() => {
			if (splitGridRef.current) {
				setGridsReady(prev => prev + 1);
				clearInterval(interv);
			}
		}, 100);
		return () => clearInterval(interv);
	}, []);

	// --- Row 조작 ---

	const handleAddRow = useCallback((sourceRow: SplitItemRow) => {
		const newRow: SplitItemRow = {
			...sourceRow,
			id: uuidv4(),
			allocatedQty: 0,
			carNo: '',
			isOriginal: false,
		};
		setSplitRows(prev => {
			const lastIndex = prev.reduce((lastIdx, row, idx) => (row.sku === sourceRow.sku ? idx : lastIdx), -1);
			const newRows = [...prev];
			newRows.splice(lastIndex + 1, 0, newRow);
			return newRows;
		});
	}, []);

	const handleRemoveRow = useCallback((rowId: string) => {
		setSplitRows(prev => prev.filter(r => r.id !== rowId));
	}, []);

	// --- 그리드 데이터 ---

	const splitGridData = useMemo(() => {
		const skuAllocSum = getSkuAllocatedQtySum();
		return splitRows.map(row => {
			const { weight, cube } = calculateStats(row);
			const allocatedQtySum = skuAllocSum[row.sku] || 0;
			const orderQtyTotal = masterOrderQtyBySku[row.sku] || 0;

			return {
				...row,
				_weight: weight.toFixed(3),
				_cube: cube.toFixed(3),
				_orderQtyMergeKey: row.sku,
				_allocatedQtySum: allocatedQtySum,
				_diff: orderQtyTotal - allocatedQtySum,
			};
		});
	}, [splitRows, calculateStats, getSkuAllocatedQtySum, masterOrderQtyBySku]);

	const vehicleGridData = useMemo(
		() =>
			selectedVehicles.map(v => {
				const key = formatCarNo(v.carno!, v.roundSeq ?? 1);
				const stats = vehicleStats[key] || { qty: 0, weight: 0, cube: 0 };
				return {
					id: v.uniqueId || key,
					carno: v.carno,
					roundSeq: v.roundSeq ?? 1,
					qty: stats.qty,
					weight: stats.weight.toFixed(3),
					cube: stats.cube.toFixed(3),
				};
			}),
		[selectedVehicles, vehicleStats],
	);

	// gridsReady 후 그리드 데이터 세팅
	useEffect(() => {
		if (!splitGridRef.current) return;
		splitGridRef.current.setGridData(splitGridData);
	}, [splitGridData, gridsReady]);

	useEffect(() => {
		if (!vehicleGridRef.current) return;
		vehicleGridRef.current.setGridData(vehicleGridData);
	}, [vehicleGridData, gridsReady]);

	// --- 그리드 컬럼 정의 ---

	const splitGridCol = useMemo(
		() => [
			{
				dataField: 'carNo',
				headerText: '차량번호',
				width: 160,
				dataType: 'code',
				commRenderer: {
					type: 'search',
					onClick: function () {
						editingRowIndexRef.current = splitGridRef.current?.getSelectedIndex()?.[0] ?? -1;
						bulkCarModalRef.current?.handlerOpen();
						setIsPopupVisible(true);
					},
				},
			},
			{
				dataField: 'custkey',
				headerText: '관리처코드',
				width: 200,
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				style: 'renderer-ta-c',
				editable: false,
			},
			{
				dataField: 'custname',
				headerText: '관리처명',
				width: 200,
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				style: 'renderer-ta-l',
				editable: false,
			},
			{
				dataField: 'sku',
				headerText: '상품코드',
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				width: 80,
				editable: false,
			},
			{
				dataField: 'skuDescr',
				headerText: '상품',
				width: 200,
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				style: 'renderer-ta-l',
				editable: false,
			},
			{
				dataField: 'storageType',
				headerText: '저장조건',
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				width: 60,
				style: 'renderer-ta-c',
				editable: false,
			},
			{
				dataField: '_orderQtyMergeKey',
				headerText: '필요수량',
				width: 80,
				style: 'renderer-ta-r',
				editable: false,
				cellMerge: true,
				mergeRef: 'sku',
				mergePolicy: 'restrict',
				renderer: { type: 'TemplateRenderer' },
				labelFunction: (_rowIndex: any, _columnIndex: any, _value: any, _headerText: any, item: any) => {
					const diff = item._diff;
					const allocatedQtySum = item._allocatedQtySum;
					const fmt = (v: number) => v.toFixed(2);

					if (diff > 0) {
						return `<span style="color:#e53935;font-weight:500">${fmt(allocatedQtySum)}<span style="font-size:10px;margin-left:2px">(-${fmt(diff)})</span></span>`;
					} else if (diff < 0) {
						return `<span style="color:#f57c00;font-weight:500">${fmt(allocatedQtySum)}<span style="font-size:10px;margin-left:2px">(+${fmt(Math.abs(diff))})</span></span>`;
					}
					return `<span>${fmt(allocatedQtySum)}</span>`;
				},
			},
			{
				dataField: 'allocatedQty',
				headerText: '할당수량',
				width: 70,
				style: 'renderer-ta-r',
				editable: true,
				dataType: 'numeric',
				formatString: '#,##0.00',
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: true,
					allowNegative: false,
					allowPoint: true,
				},
			},
			{
				dataField: '_weight',
				headerText: '중량(kg)',
				width: 80,
				style: 'renderer-ta-r',
				editable: false,
			},
			{
				dataField: '_cube',
				headerText: '체적(m³)',
				width: 80,
				style: 'renderer-ta-r',
				editable: false,
			},
			{
				dataField: '_action',
				headerText: '',
				width: 60,
				editable: false,
				sortable: false,
				filter: { showIcon: false, disableFilter: true },
				renderer: { type: 'TemplateRenderer' },
				labelFunction: (_rowIndex: any, _columnIndex: any, _value: any, _headerText: any, item: any) => {
					if (item.isOriginal) {
						return '<button style="font-size:11px;width:100%;height:100%;border:1px solid #d9d9d9;background:#fff;border-radius:2px;cursor:pointer;">분할</button>';
					}
					return '<button style="font-size:11px;width:100%;height:100%;border:1px solid #ff4d4f;background:#fff;color:#ff4d4f;border-radius:2px;cursor:pointer;">삭제</button>';
				},
			},
		],
		[],
	);

	const vehicleGridCol = useMemo(
		() => [
			{ dataField: 'carno', headerText: '차량번호', width: 200, editable: false },
			{
				dataField: 'roundSeq',
				headerText: '회차',
				width: 60,
				style: 'renderer-ta-c',
				editable: false,
				labelFunction: (_r: any, _c: any, value: any) => `${value}회`,
			},
			{ dataField: 'qty', headerText: '수량', style: 'renderer-ta-r', editable: false },
			{ dataField: 'weight', headerText: '중량(kg)', style: 'renderer-ta-r', editable: false },
			{ dataField: 'cube', headerText: '체적(m³)', style: 'renderer-ta-r', editable: false },
		],
		[],
	);

	const splitGridProps = useMemo(
		() => ({
			showRowCheckColumn: false,
			showRowNumColumn: false,
			editable: true,
			rowHeight: 26,
			headerHeight: 26,
			selectionMode: 'multipleCells',
			wordWrap: false,
			enableSorting: true,
			enableMovingColumn: false,
			rowIdField: 'id',
			noDataMessage: '데이터가 없습니다',
			autoResize: false,
			enableCellMerge: true,
			fillColumnSizeMode: true,
		}),
		[],
	);

	const vehicleGridProps = useMemo(
		() => ({
			showRowCheckColumn: false,
			showRowNumColumn: false,
			editable: false,
			rowHeight: 26,
			headerHeight: 26,
			selectionMode: 'none',
			wordWrap: false,
			rowIdField: 'id',
			noDataMessage: '상품에서 차량을 선택하면 여기에 표시됩니다',
			autoResize: false,
			fillColumnSizeMode: true,
		}),
		[],
	);

	// --- 그리드 이벤트 바인딩 ---

	// cellEditEnd: 할당수량/차량번호 편집 완료
	useEffect(() => {
		const grid = splitGridRef.current;
		if (!grid) return;

		const handleCellEditEnd = (e: any) => {
			if (e.dataField === 'allocatedQty') {
				const newValue = Math.round((Number(e.value) || 0) * 100) / 100;
				setSplitRows(prev => prev.map(row => (row.id === e.item.id ? { ...row, allocatedQty: newValue } : row)));
			}
			if (e.dataField === 'carNo') {
				const newCarNo = (e.value || '').trim();
				setSplitRows(prev => prev.map(row => (row.id === e.item.id ? { ...row, carNo: newCarNo } : row)));
			}
		};

		const handleCellClick = (e: any) => {
			if (e.dataField === '_action') {
				const item = e.item;
				if (item.isOriginal) {
					const sourceRow = splitRowsRef.current.find((r: SplitItemRow) => r.id === item.id);
					if (sourceRow) handleAddRow(sourceRow);
				} else {
					handleRemoveRow(item.id);
				}
			}
		};

		grid.bind('cellEditEnd', handleCellEditEnd);
		grid.bind('cellClick', handleCellClick);

		return () => {
			grid.unbind('cellEditEnd', handleCellEditEnd);
			grid.unbind('cellClick', handleCellClick);
		};
	}, [gridsReady, handleAddRow, handleRemoveRow]);

	// cellEditEndBefore: 차량번호 자동완성 (Enter)
	useEffect(() => {
		const grid = splitGridRef.current;
		if (!grid) return;

		const handleCarNoSearch = (e: any) => {
			if (e.dataField !== 'carNo' || e.which !== 13) return e.value;
			if (e.value === e.oldValue) return e.value;

			const searchTerm = (e.value || '').trim();
			if (!searchTerm) return '';

			const filtered = getFilteredVehicles(vehiclesRef.current, searchTerm);

			if (filtered.length === 1) {
				return filtered[0].code;
			} else if (filtered.length > 1) {
				return e.value;
			} else {
				// 검색 결과 없으면 상세 검색 팝업
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
	}, [gridsReady]);

	// --- 차량 팝업 선택 ---

	const handleCarSelect = useCallback(
		(vehicleUniqueId: string) => {
			const rowIndex = editingRowIndexRef.current;
			if (rowIndex >= 0 && splitGridRef.current) {
				const vehicle = vehicles.find(v => v.uniqueId === vehicleUniqueId);
				if (vehicle) {
					const carNoText = formatCarNo(vehicle.carno!, vehicle.roundSeq ?? 1);
					splitGridRef.current.setCellValue(rowIndex, 'carNo', carNoText);

					const item = splitGridRef.current.getItemByRowIndex(rowIndex);
					if (item) {
						setSplitRows(prev => prev.map(row => (row.id === item.id ? { ...row, carNo: carNoText } : row)));
					}
				}
			}
			bulkCarModalRef.current?.handlerClose();
			setIsPopupVisible(false);
		},
		[vehicles],
	);

	// --- Enter 키 핸들러 (차량번호 드롭다운) ---

	const handleKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
		if (e.key !== 'Enter') return;

		const grid = splitGridRef.current;
		if (!grid) return;

		const activeElement = document.activeElement as HTMLInputElement;
		if (!activeElement || activeElement.tagName !== 'INPUT' || !activeElement.closest('.aui-grid-wrap')) return;

		const selection = grid.getSelectedIndex();
		if (!selection || selection.length < 2) return;

		const [rowIndex, columnIndex] = selection;
		const cols = grid.getColumnLayout();
		const dataField = cols[columnIndex]?.dataField;

		if (dataField !== 'carNo') return;

		const searchTerm = (activeElement.value || '').trim();
		if (!searchTerm) return;

		const filtered = getFilteredVehicles(vehiclesRef.current, searchTerm);

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
		};

		if (filtered.length === 1) {
			// 1건: 자동완성
			activeElement.value = filtered[0].code;
			grid.setCellValue(rowIndex, 'carNo', filtered[0].code);

			const item = grid.getItemByRowIndex(rowIndex);
			if (item) {
				setSplitRows(prev => prev.map(row => (row.id === item.id ? { ...row, carNo: filtered[0].code } : row)));
			}
			finishEditing();
		} else if (filtered.length > 1) {
			// 여러 건: 드롭다운
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

				const item = grid.getItemByRowIndex(rowIndex);
				if (item) {
					setSplitRows(prev => prev.map(row => (row.id === item.id ? { ...row, carNo: selected.code } : row)));
				}
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
	}, []);

	// --- 검증 & 저장 ---

	const handleOk = useCallback(() => {
		// 0. 할당수량 0 체크
		const zeroQtyRows = splitRows.filter(r => r.allocatedQty === 0 && r.orderQty !== 0);
		if (zeroQtyRows.length > 0) {
			showAlert('알림', '할당수량이 0인 품목이 있습니다. 할당수량을 입력하거나 해당 행을 삭제해주세요.');
			return;
		}

		// 1. 미할당 차량 체크
		const unassignedRows = splitRows.filter(r => !r.carNo && r.allocatedQty > 0);
		if (unassignedRows.length > 0) {
			showAlert('알림', '차량이 할당되지 않은 품목이 있습니다. 모든 품목에 차량을 지정해주세요.');
			return;
		}

		// 2. 2대 이상 차량 체크
		const uniqueCarNos = new Set(splitRows.map(r => r.carNo).filter(Boolean));
		if (uniqueCarNos.size < 2) {
			showAlert('알림', '분할 배차는 2대 이상의 차량에 할당해야 합니다.');
			return;
		}

		// 3. SKU별 수량 일치 체크
		const skuGroups: Record<string, number> = {};
		splitRows.forEach(r => {
			skuGroups[r.sku] = (skuGroups[r.sku] || 0) + r.allocatedQty;
		});

		for (const sku of Object.keys(masterOrderQtyBySku)) {
			const totalAllocated = skuGroups[sku] || 0;
			const totalOrderQty = masterOrderQtyBySku[sku];
			if (totalAllocated !== totalOrderQty) {
				showAlert('알림', `[${sku}]의 할당 수량(${totalAllocated})이 주문 수량(${totalOrderQty})과 일치하지 않습니다.`);
				return;
			}
		}

		// 4. 유효하지 않은 차량번호 체크
		const validCarNos = new Set(vehicleOptions.map(o => o.value));
		for (const row of splitRows) {
			if (row.carNo && !validCarNos.has(row.carNo)) {
				showAlert('알림', `"${row.carNo}"는 유효하지 않은 차량번호입니다.`);
				return;
			}
		}

		// 5. 결과 그룹 생성
		const groupMap = new Map<string, { items: ManualSplitMasterItem[]; driverId: string; vehicleUniqueId?: string }>();

		splitRows.forEach(row => {
			if (!row.carNo) return;

			if (!groupMap.has(row.carNo)) {
				const { carno } = parseCarNo(row.carNo);
				const vehicle = vehicles.find(v => v.carno === carno && formatCarNo(v.carno!, v.roundSeq ?? 1) === row.carNo);
				groupMap.set(row.carNo, {
					items: [],
					driverId: carno,
					vehicleUniqueId: vehicle?.uniqueId,
				});
			}

			const group = groupMap.get(row.carNo)!;
			const { weight, cube } = calculateStats(row);
			group.items.push({
				...row.originalItem,
				orderQty: String(row.allocatedQty),
				weight: String(weight),
				cube: String(cube),
			});
		});

		const nonEmptyGroups = Array.from(groupMap.values()).filter(g => g.items.length > 0);

		if (nonEmptyGroups.length === 0) {
			showAlert('알림', '할당된 배차 내역이 없습니다.');
			return;
		}

		onOk(order, nonEmptyGroups);
	}, [splitRows, masterOrderQtyBySku, vehicleOptions, vehicles, calculateStats, order, onOk]);

	// --- Render ---

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', gap: 12 }}>
			<PopupMenuTitle name="수동 분할 배차" showButtons={false} />

			{/* 1. 헤더 정보 (실착지) - 고정 */}
			<div
				style={{
					flexShrink: 0,
					display: 'flex',
					gap: '1px',
					background: '#e8e8e8',
					borderRadius: 4,
					border: '1px solid #e8e8e8',
					overflowX: 'auto',
					overflowY: 'hidden',
				}}
			>
				{[
					{ label: '거래처코드', value: order.id, minWidth: 130 },
					{ label: '거래처명', value: order.custName, minWidth: 180 },
					{ label: '주소', value: order.custAddress, minWidth: 240, flex: 2 },
					{ label: '수량', value: totalStats.qty.toLocaleString(), minWidth: 80 },
					{ label: '중량(kg)', value: totalStats.weight.toFixed(3), minWidth: 100 },
					{ label: '체적(m³)', value: totalStats.cube.toFixed(3), minWidth: 100 },
				].map(item => (
					<div
						key={item.label}
						style={{
							flex: `${item.flex ?? 1} 0 ${item.minWidth}px`,
							padding: '8px 14px',
							background: '#fff',
						}}
					>
						<div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: '16px' }}>{item.label}</div>
						<div
							style={{
								fontSize: 13,
								fontWeight: 600,
								color: '#262626',
								marginTop: 2,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
							title={String(item.value ?? '')}
						>
							{item.value || '-'}
						</div>
					</div>
				))}
			</div>

			{/* 2. 그리드 영역 - 남은 공간 1:1 분할 */}
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0 }}>
				{/* 배차 차량 목록 */}
				<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
						<span className="ant-modal-title">배차 차량 목록</span>
					</div>
					<AGrid style={{ flex: 1, minHeight: 0 }}>
						<AUIGrid
							ref={vehicleGridRef}
							name={'vehicleGridModal'}
							columnLayout={vehicleGridCol}
							gridProps={vehicleGridProps}
						/>
					</AGrid>
				</div>

				{/* 상품 분할 및 할당 */}
				<div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
						<span className="ant-modal-title">상품 분할 및 할당</span>
						{showBulkAssign ? (
							<Space size="small">
								<Select
									style={{ width: 160 }}
									size="small"
									placeholder="차량 선택"
									value={bulkAssignCarNo}
									onChange={setBulkAssignCarNo}
									showSearch
									filterOption={(input, option) =>
										(option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
									}
									options={vehicleOptions}
								/>
								<Button
									size="small"
									type="primary"
									disabled={!bulkAssignCarNo}
									onClick={() => {
										if (bulkAssignCarNo) {
											setSplitRows(prev => prev.map(row => ({ ...row, carNo: bulkAssignCarNo })));
										}
										setShowBulkAssign(false);
										setBulkAssignCarNo(undefined);
									}}
								>
									확인
								</Button>
								<Button
									size="small"
									onClick={() => {
										setShowBulkAssign(false);
										setBulkAssignCarNo(undefined);
									}}
								>
									취소
								</Button>
							</Space>
						) : (
							<Button size="small" onClick={() => setShowBulkAssign(true)}>
								일괄 할당
							</Button>
						)}
					</div>
					<AGrid style={{ flex: 1, minHeight: 0 }} onKeyDownCapture={handleKeyDownCapture}>
						<AUIGrid
							ref={splitGridRef}
							name={'splitGridModal'}
							columnLayout={splitGridCol}
							gridProps={splitGridProps}
						/>
					</AGrid>
				</div>
			</div>

			{/* 차량 상세 검색 팝업 */}
			<CustomModal ref={bulkCarModalRef} width="900px">
				{isPopupVisible && (
					<TmBulkDispatchCarPopup
						vehicles={vehicles}
						onSelect={handleCarSelect}
						onClose={() => {
							bulkCarModalRef.current?.handlerClose();
							setIsPopupVisible(false);
						}}
					/>
				)}
			</CustomModal>

			{/* 하단 버튼 - 고정 */}
			<ButtonWrap data-props="single" style={{ flexShrink: 0 }}>
				<Button size="middle" onClick={onClose}>
					취소
				</Button>
				<Button size="middle" type="primary" onClick={handleOk} loading={loading}>
					저장
				</Button>
			</ButtonWrap>
		</div>
	);
};

export default TmOrderSplitModal;
