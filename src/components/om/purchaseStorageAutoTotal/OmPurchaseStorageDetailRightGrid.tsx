import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button } from 'antd/lib';

// API Call Function
import { apiGetDetailRightList } from '@/api/om/apiOmPurchaseStorageAutoTotal';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Utils

interface OmPurchaseStorageDetailRightGridProps {
	selectedRow?: any;
	masterItem?: any;
	gridRefMaster?: any;
	poType?: string;
	isOutOrder?: boolean;
	onDataChange?: (data: any[]) => void;
	onDeleteList?: (items: any[]) => void;
	onReorderList?: (items: any[]) => void;
}

const OmPurchaseStorageDetailRightGrid = forwardRef((props: OmPurchaseStorageDetailRightGridProps, ref: any) => {
	// 다국어
	const { t } = useTranslation();

	const [gridData, setGridData] = useState<any[]>([]);

	/**
	 * 그리드 컬럼 설정
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'dcCode',
				headerText: t('lbl.PODCCODE'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'organize',
				headerText: t('lbl.ORGANIZE'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'organizeName',
				headerText: t('lbl.ORGANIZENAME'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'sku',
				headerText: t('lbl.SKU'),
				dataType: 'code',
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						e.item.skuDescr = e.item.skuName;
						if (props.gridRefMaster) {
							props.gridRefMaster.openPopup(e.item, 'sku');
						}
					},
				},
				editable: false,
			},
			{
				dataField: 'skuName',
				headerText: t('lbl.SKUNAME'),
				dataType: 'string',
				editable: false,
			},
			{
				dataField: 'uom',
				headerText: t('lbl.UOM'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'workProcessCode',
				headerText: '주문유형',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'openQty',
				headerText: '수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'purchaseQty',
				headerText: '재발주수량(BOX)',
				dataType: 'numeric',
				editable: true,
				styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
					if (!item) {
						return 'default';
					}
					if (item.statusYn === 'N') {
						return 'disabled';
					} else {
						return 'default';
					}
				},
			},
			{
				dataField: 'purchaseCalQty',
				headerText: '재발주수량 환산수량(EA)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'preQty',
				headerText: '공급확정수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty',
				headerText: '입고확정수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'slipDt',
				headerText: '입고예정일',
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				commRenderer: {
					type: 'calender',
					showExtraDays: true,
				},
				editable: true,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (!item) {
						return 'default';
					}
					if (item.statusYn === 'N') {
						return 'disabled';
					} else {
						return 'default';
					}
				},
			},

			{
				dataField: 'fromCustKey',
				headerText: t('lbl.CUSTKEY_PO'),
				dataType: 'code',
				editable: false,
			},

			{
				dataField: 'fromCustName',
				headerText: t('lbl.CUSTNAME_PO'),
				editable: false,
			},
			{
				dataField: 'statusYn',
				headerText: '삭제가능여부',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'addDate',
				headerText: t('lbl.ADDDATE'),
				dataType: 'date',
				editable: false,
			},
		];
	};

	/**
	 * 그리드 속성 설정
	 */
	const getGridProps = () => {
		return {
			editable: true,
			enableFilter: true,
			showRowCheckColumn: true,
			showRowNumColumn: false,
			showFooter: true,
			rowStyleFunction: (rowIndex: any, item: any) => {
				if (item.delYn === 'Y') {
					return 'color-danger';
				}
				return '';
			},
			rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
				if (item.statusYn === 'N') {
					return false;
				} else {
					return true;
				}
			},
		};
	};

	/**
	 * 그리드 푸터 레이아웃 설정
	 */
	const getFooterLayout = () => {
		return [
			{
				dataField: 'openQty',
				positionField: 'openQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'purchaseQty',
				positionField: 'purchaseQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'purchaseCalQty',
				positionField: 'purchaseCalQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'preQty',
				positionField: 'preQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'confirmQty',
				positionField: 'confirmQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
		];
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		if (!ref.current) return;

		// 삭제가능여부가 'N'이면 수정 불가
		ref.current.bind('cellEditBegin', (event: any) => {
			if (event.item.statusYn === 'N') {
				return false;
			}
		});

		// 재발주수량 변경 시 환산수량 자동 계산
		ref.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'purchaseQty') {
				let calQty = 1;
				if (event.item.uom === 'EA' && props.masterItem) {
					calQty = props.masterItem.eaCal || 1;
				} else if (event.item.uom === 'BOX' && props.masterItem) {
					calQty = props.masterItem.boxCal || 1;
				} else if (event.item.uom === 'KG' && props.masterItem) {
					calQty = props.masterItem.kgCal || 1;
				}
				ref.current.setCellValue(event.rowIndex, 'purchaseCalQty', event.value * calQty);
			}
		});
	};

	/**
	 * 그리드 데이터 조회 및 로드
	 * @param params
	 */
	const loadGridData = (params: any) => {
		if (!ref.current) return;

		ref.current.setGridData([]);
		apiGetDetailRightList(params).then(res => {
			if (res.data && res.data.length > 0) {
				setGridData(res.data);
				ref.current.setGridData(res.data);
				const colSizeList = ref.current.getFitColumnSizeList(true);
				ref.current.setColumnSizeList(colSizeList);
				props.onDataChange?.(res.data);
			}
		});
	};

	/**
	 * 발주 삭제
	 */
	const handleDeletePurchase = () => {
		const delList = ref.current?.getCheckedRowItemsAll();
		if (!delList || delList.length < 1) {
			showMessage?.({
				content: '삭제할 항목을 선택해주세요.',
				modalType: 'warning',
			});
			return;
		}

		props.onDeleteList?.(delList);
	};

	/**
	 * 재발주 실행
	 */
	const handleReorderPurchase = () => {
		const reorderList = ref.current?.getCheckedRowItemsAll();
		if (!reorderList || reorderList.length < 1) {
			showMessage?.({
				content: '재발주할 항목을 선택해주세요.',
				modalType: 'warning',
			});
			return;
		}

		// 필수 필드 확인
		for (const item of reorderList) {
			if (!item.purchaseQty || item.purchaseQty === 0) {
				showMessage?.({
					content: '재발주수량이 0인 건은 재발주할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			}

			if (!item.slipDt) {
				showMessage?.({
					content: '변경입고일자는 필수 값 입니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		props.onReorderList?.(reorderList);
	};

	/**
	 * 선택된 행 변경 감지하여 데이터 로드
	 */
	useEffect(() => {
		if (props.selectedRow) {
			loadGridData(props.selectedRow);
		}
	}, [props.selectedRow]);

	/**
	 * 그리드 초기화 및 이벤트 설정
	 */
	useEffect(() => {
		initEvent();
	}, [props.masterItem]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle="저장품 발주 현황 및 변경">
					<Button onClick={handleDeletePurchase}>{'발주삭제'}</Button>
					<Button onClick={handleReorderPurchase}>{'재발주'}</Button>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={getGridCol()} gridProps={getGridProps()} footerLayout={getFooterLayout()} />
			</GridAutoHeight>
		</>
	);
});

export default OmPurchaseStorageDetailRightGrid;
