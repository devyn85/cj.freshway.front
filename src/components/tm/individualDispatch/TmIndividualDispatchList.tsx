/*
############################################################################
# FiledataField		: TmIndividualDispatchList.tsx
# Description		: 개별 배차 (Individual Dispatch) - 그리드 목록 컴포넌트
# Since			: 2026.03.04
############################################################################
*/

// assets
import AGrid from '@/assets/styled/AGrid/AGrid';

// components
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// types
import { GridBtnPropsType } from '@/types/common';

// util
import { showAlert, showConfirmAsync } from '@/util/MessageUtil';
import { Button, Select } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// api
import { apiConfirmIndividualDispatch, apiGetIndividualDispatchPopList } from '@/api/tm/apiTmIndividualDispatch';

interface TmIndividualDispatchListProps {
	form: any;
	data: any[];
	totalCnt: number;
	onSearch: () => void;
	vehicleFetchTrigger: number;
}

const TmIndividualDispatchList = ({ form, data, totalCnt, onSearch, vehicleFetchTrigger }: TmIndividualDispatchListProps) => {
	const gridRef: any = useRef(null);
	const { t } = useTranslation();

	// POP 팝업
	const refPopModal: any = useRef(null);

	// 차량번호 팝업
	const refCarModal: any = useRef(null);

	// 차량일괄적용 관련
	const [vehicleOptions, setVehicleOptions] = useState<any[]>([]);
	const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);

	// 팝업 열었던 행 인덱스 + 이전 값 (원복용)
	const editingPopRowRef = useRef<{ rowIndex: number; originalValue: string } | null>(null);
	const editingCarRowRef = useRef<{ rowIndex: number; originalValue: string } | null>(null);

	// 배차확정 처리
	const handleConfirmDispatch = async () => {
		const grid = gridRef.current;
		if (!grid) return;

		const checkedItems = grid.getCheckedRowItemsAll?.() || grid.getCheckedRowItems?.()?.map((r: any) => r.item) || [];
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, '확정할 행을 선택하세요.');
			return;
		}

		// 배차완료 상태인 행이 포함되어 있는지 체크
		const hasConfirmed = checkedItems.some((item: any) => item.dispatchStatus !== '00');
		if (hasConfirmed) {
			showAlert(null, "'배차예정' 상태인 건만 배차확정할 수 있습니다.");
			return;
		}

		// 필수값 검증
		const validation = grid.validateRequiredGridData?.();
		if (!validation) return;

		const isOk = await showConfirmAsync(null, `${checkedItems.length}건을 배차확정 하시겠습니까?`);
		if (!isOk) return;

		const values = form.getFieldsValue();

		try {
			const dccode = Array.isArray(values.gDccode) ? values.gDccode[0] : values.gDccode;
			const confirmedItems = checkedItems.map((item: any) => ({
				dccode: dccode,
				slipDt: item.deliverydate,
				carno: item.carno,
				docno: item.docno,
				storerkey: item.storerkey,
				truthcustkey: item.truthcustkey,
				priority: '1', // 1회차만 존재함.
				pop: item.pop,
				tmDeliveryType: item.tmDeliverytype,
			}));

			const res = await apiConfirmIndividualDispatch(confirmedItems);

			if (res?.statusCode !== -1) {
				showAlert(null, '배차확정이 완료되었습니다.');
				onSearch();
			}
		} catch (error) {
			//console.warn('[TmIndividualDispatch] confirmDispatch error:', error);
		}
	};

	// 차량일괄적용 처리
	const handleBulkApplyVehicle = () => {
		if (!selectedVehicle) {
			showAlert(null, '차량을 선택해주세요.');
			return;
		}
		const grid = gridRef.current;
		if (!grid) return;

		const checkedItems = grid.getCheckedRowItems?.() || [];
		if (checkedItems.length < 1) {
			showAlert(null, '적용할 행을 선택하세요.');
			return;
		}

		const updateItems: any[] = [];
		const updateIndexes: number[] = [];
		checkedItems.forEach((checkItem: any) => {
			if (checkItem.item.dispatchStatus === '00') {
				updateItems.push({ carno: selectedVehicle });
				updateIndexes.push(checkItem.rowIndex);
			}
		});
		if (updateItems.length > 0) {
			grid.updateRows(updateItems, updateIndexes);
		}
	};

	// POP 팝업 선택 콜백
	const confirmPopPopup = (selectedRows: any[]) => {
		const editingInfo = editingPopRowRef.current;
		editingPopRowRef.current = null;
		if (!selectedRows || selectedRows.length === 0) return;
		const grid = gridRef.current;
		if (!grid) return;

		const popValue = selectedRows[0].name || selectedRows[0].popno;
		const targetRowIndex = editingInfo?.rowIndex ?? selectedRows[0].rowIndex;
		if (targetRowIndex === undefined || targetRowIndex < 0) return;

		setTimeout(() => {
			const item = grid.getItemByRowIndex(targetRowIndex);
			if (item?.dispatchStatus === '00') {
				grid.setCellValue(targetRowIndex, 'pop', popValue);
			}
			refPopModal.current?.handlerClose?.();
		}, 0);
	};

	// 차량번호 팝업 선택 콜백
	const confirmCarPopup = (selectedRows: any[]) => {
		const editingInfo = editingCarRowRef.current;
		editingCarRowRef.current = null;
		if (!selectedRows || selectedRows.length === 0) return;
		const grid = gridRef.current;
		if (!grid) return;

		const carValue = selectedRows[0].code || selectedRows[0].carno;
		const targetRowIndex = editingInfo?.rowIndex ?? selectedRows[0].rowIndex;
		if (targetRowIndex === undefined || targetRowIndex < 0) return;

		setTimeout(() => {
			const item = grid.getItemByRowIndex(targetRowIndex);
			if (item?.dispatchStatus === '00') {
				grid.setCellValue(targetRowIndex, 'carno', carValue);
			}
			refCarModal.current?.handlerClose?.();
		}, 0);
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
	};

	// 푸터 설정
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'dccode',
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'cube',
			positionField: 'cube',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	// 그리드 컬럼 정의
	const gridCol: any[] = [
		{
			headerText: t('lbl.DCCODE') || '물류센터코드',
			dataField: 'dccode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DCNAME') || '물류센터',
			dataField: 'dcname',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: t('lbl.DELIVERYDATE') || '배송일자',
			dataField: 'deliverydate',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.DELIVERYTYPE_WD') || '배송유형',
			dataField: 'tmDeliverytype',
			dataType: 'code',
			editable: false,
			labelFunction: (_rowIndex: number, _columnIndex: number, value: any) => {
				return getCommonCodebyCd('TM_DELIVERYTYPE', value)?.cdNm ?? value ?? '';
			},
		},
		{
			headerText: '주문유형',
			dataField: 'ordertypeNm',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DISTRICTGROUP_NM') || '권역그룹',
			dataField: 'districtgroupNm',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: t('lbl.DISTRICTNAME') || '권역',
			dataField: 'districtcodeNm',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: '전표번호',
			dataField: 'docno',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.LBL_DELIVERYGROUP') || 'POP',
			dataField: 'pop',
			dataType: 'code',
			minWidth: 120,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'individualDispatchPOP',
				params: { dccode: (() => { const v = form.getFieldsValue(); return Array.isArray(v.gDccode) ? v.gDccode[0] : v.gDccode; })() },
				searchDropdownProps: {
					dataFieldMap: {
						pop: 'name',
					},
					callbackBeforeUpdateRow: async (e: any) => {
						const item = gridRef.current?.getItemByRowIndex(e.rowIndex);
						if (item?.dispatchStatus !== '00') return;
						const selectRow = [e];
						if (e.which === 'clipboard') {
							if (!selectRow[0].name) {
								gridRef.current.restoreEditedCells([e.rowIndex]);
								return;
							}
							const updateObj = { pop: selectRow[0].name };
							gridRef.current.restoreEditedCells([e.rowIndex]);
							gridRef.current.updateRow(updateObj, e.rowIndex);
						} else {
							if (!selectRow[0].name) {
								gridRef.current.restoreEditedCells([e.rowIndex]);
								return;
							}
							confirmPopPopup(selectRow);
						}
					},
				},
				onClick: () => {
					const selectedRows = gridRef.current?.getSelectedRows?.();
					if (selectedRows?.[0]?.dispatchStatus !== '00') return;
					const selectedIndex = gridRef.current?.getSelectedIndex?.()?.[0];
					if (selectedIndex !== undefined) {
						// cellEditBegin에서 이미 원본값이 저장된 경우 덮어쓰지 않음 (아이콘 직접 클릭 시에만 설정)
						if (!editingPopRowRef.current || editingPopRowRef.current.rowIndex !== selectedIndex) {
							const originalValue = gridRef.current?.getCellValue(selectedIndex, 'pop') || '';
							editingPopRowRef.current = { rowIndex: selectedIndex, originalValue };
						}
					}
					refPopModal.current?.handlerOpen?.();
				},
			},
			styleFunction: (_rowIndex: number, columnIndex: number, _value: any, _headerText: string, item: any) => {
				if (item?.dispatchStatus !== '00') {
					gridRef.current.removeEditClass(columnIndex);
					return;
				}
				return 'isEdit';
			},
		},
		{
			headerText: t('lbl.CARNO') || '차량번호',
			dataField: 'carno',
			dataType: 'code',
			minWidth: 160,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'individualDispatchPOP',
				params: { dccode: (() => { const v = form.getFieldsValue(); return Array.isArray(v.gDccode) ? v.gDccode[0] : v.gDccode; })() },
				searchDropdownProps: {
					dataFieldMap: {
						carno: 'code',
					},
					callbackBeforeUpdateRow: async (e: any) => {
						const item = gridRef.current?.getItemByRowIndex(e.rowIndex);
						if (item?.dispatchStatus !== '00') return;
						const selectRow = [e];
						if (e.which === 'clipboard') {
							if (!selectRow[0].code) {
								gridRef.current.restoreEditedCells([e.rowIndex]);
								return;
							}
							const updateObj = { carno: selectRow[0].code };
							gridRef.current.restoreEditedCells([e.rowIndex]);
							gridRef.current.updateRow(updateObj, e.rowIndex);
						} else {
							if (!selectRow[0].code) {
								gridRef.current.restoreEditedCells([e.rowIndex]);
								return;
							}
							confirmCarPopup(selectRow);
						}
					},
				},
				onClick: () => {
					const selectedRows = gridRef.current?.getSelectedRows?.();
					if (selectedRows?.[0]?.dispatchStatus !== '00') return;
					const selectedIndex = gridRef.current?.getSelectedIndex?.()?.[0];
					if (selectedIndex !== undefined) {
						// cellEditBegin에서 이미 원본값이 저장된 경우 덮어쓰지 않음 (아이콘 직접 클릭 시에만 설정)
						if (!editingCarRowRef.current || editingCarRowRef.current.rowIndex !== selectedIndex) {
							const originalValue = gridRef.current?.getCellValue(selectedIndex, 'carno') || '';
							editingCarRowRef.current = { rowIndex: selectedIndex, originalValue };
						}
					}
					refCarModal.current?.handlerOpen?.();
				},
			},
			styleFunction: (_rowIndex: number, columnIndex: number, _value: any, _headerText: string, item: any) => {
				if (item?.dispatchStatus !== '00') {
					gridRef.current.removeEditClass(columnIndex);
					return;
				}
				return 'isEdit';
			},
			required: true,
		},
		{
			headerText: t('lbl.DISPATCH_STATUS') || '배차상태',
			dataField: 'dispatchStatusNm',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '행정동코드',
			dataField: 'hjdongCd',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.FROM_CUSTKEY_RT') || '관리처코드',
			dataField: 'custkey',
			dataType: 'code',
			minWidth: 110,
			editable: false,
		},
		{
			headerText: t('lbl.FROM_CUSTNAME_RT') || '관리처명',
			dataField: 'custname',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: '관리처주소',
			dataField: 'custaddress',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: '실착지코드',
			dataField: 'truthcustkey',
			dataType: 'code',
			minWidth: 110,
			editable: false,
		},
		{
			headerText: '실착지명',
			dataField: 'truthcustname',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: '실착지주소',
			dataField: 'truthcustaddress',
			dataType: 'text',
			editable: false,
		},
		{
			headerText: t('lbl.ORDERQTY') || '주문수량',
			dataField: 'orderQty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.00',
		},
		{
			headerText: t('lbl.WEIGHT_KG') + "(kg)" || '중량(kg)',
			dataField: 'weight',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.00',
		},
		{
			headerText: t('lbl.CUBE_UOM') || '체적(m³)',
			dataField: 'cube',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.00',
		},
	];

	// 그리드 속성
	const gridProps: any = {
		editable: true,
		fillColumnSizeMode: false,
		showFooter: true,
		height: 620,
		showRowAllCheckBox: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		showRowNumColumn: true,
		rowNumHeaderText: 'No.',
		enableFilter: true,
		copyDisplayValue: true,
		// 배차완료 상태일 경우 체크 불가
		rowCheckDisabledFunction: (_rowIndex: number, _isChecked: boolean, item: any) => {
			if (item?.dispatchStatus !== '00') return false;
			return true;
		},
	};

	// 셀 클릭 이벤트 바인딩
	useEffect(() => {
		if (!gridRef.current) return;

		const handleCellClick = (event: any) => {
			const item = event?.item;
			if (!item) return;

			// 배차완료 상태면 POP, 차량번호 편집 차단
			if (item.dispatchStatus !== '00') {
				if (event.dataField === 'pop' || event.dataField === 'carno') {
					return;
				}
			}
		};

		try {
			gridRef.current.bind('cellClick', handleCellClick);
			gridRef.current.bind('cellEditBegin', (event: any) => {
				if ((event.dataField === 'pop' || event.dataField === 'carno') && event.item?.dispatchStatus !== '00') {
					return false;
				}
				// 셀 편집 시작 전 원본값 저장 (타이핑 전 값)
				if (event.dataField === 'pop') {
					editingPopRowRef.current = { rowIndex: event.rowIndex, originalValue: event.value ?? '' };
				} else if (event.dataField === 'carno') {
					editingCarRowRef.current = { rowIndex: event.rowIndex, originalValue: event.value ?? '' };
				}
				return true;
			});
		} catch (error) {
			//console.warn('[TmIndividualDispatchList] grid bind error:', error);
		}
	}, []);

	// 차량 목록 조회
	const fetchVehicleOptions = useCallback(() => {
		const values = form.getFieldsValue();
		const dccode = Array.isArray(values.gDccode) ? values.gDccode[0] : values.gDccode;
		if (!dccode) return;

		apiGetIndividualDispatchPopList({ dccode, startRow: 0, listCount: 9999 })
			.then((res: any) => {
				const list = res?.data?.list ?? [];
				const options = list
					.filter((item: any) => item.code)
					.map((item: any) => ({
						label: item.code,
						value: item.code,
					}));
				setVehicleOptions(options);
			})
			.catch(() => {});
		setSelectedVehicle(undefined);
	}, [form]);

	// 조회, 초기화 시 차량 목록 조회
	useEffect(() => {
		if (vehicleFetchTrigger > 0) {
			fetchVehicleOptions();
		}
	}, [vehicleFetchTrigger]);

	// 그리드 데이터 세팅
	useEffect(() => {
		if (gridRef.current && data) {
			gridRef.current.setGridData(data);

			setTimeout(() => {
				if (data.length > 0) {
					gridRef.current.setFooter(footerLayout);
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
			}, 10);
		}
	}, [data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt} position="postfix">
					<span style={{ fontWeight: 'bold' }}>차량일괄적용</span>
					<Select
						style={{ width: 200, marginLeft: 8 }}
						placeholder="차량을 선택해주세요"
						options={vehicleOptions}
						value={selectedVehicle}
						onChange={setSelectedVehicle}
						allowClear
					/>
					<Button style={{ marginLeft: 8 }} onClick={handleBulkApplyVehicle}>
						일괄적용
					</Button>
					<Button type="primary" style={{ marginLeft: 8 }} onClick={handleConfirmDispatch}>
						{t('lbl.DISPATCH_CONFIRM') || '배차확정'}
					</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* POP 검색 팝업 */}
			<CustomModal ref={refPopModal} width="1280px">
				<CmSearchPopup
					type="individualDispatchPOP"
					close={() => {
						const editingInfo = editingPopRowRef.current;
						editingPopRowRef.current = null;
						refPopModal.current?.handlerClose?.();
						if (editingInfo !== null) {
							setTimeout(() => {
								gridRef.current?.setCellValue(editingInfo.rowIndex, 'pop', editingInfo.originalValue);
							}, 0);
						}
					}}
					callBack={confirmPopPopup}
				/>
			</CustomModal>

			{/* 차량번호 검색 팝업 */}
			<CustomModal ref={refCarModal} width="1280px">
				<CmSearchPopup
					type="individualDispatchPOP"
					close={() => {
						const editingInfo = editingCarRowRef.current;
						editingCarRowRef.current = null;
						refCarModal.current?.handlerClose?.();
						if (editingInfo !== null) {
							setTimeout(() => {
								gridRef.current?.setCellValue(editingInfo.rowIndex, 'carno', editingInfo.originalValue);
							}, 0);
						}
					}}
					callBack={confirmCarPopup}
				/>
			</CustomModal>
		</>
	);
};

export default TmIndividualDispatchList;
