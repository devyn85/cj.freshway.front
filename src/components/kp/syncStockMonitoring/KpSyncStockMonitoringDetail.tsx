/*
 ############################################################################
 # File name    : KpSyncStockMonitoringDetail.tsx
 # Description  : 재고동기화 모니터링 단일 그리드
 # Author       :
 # Since        :
 ############################################################################
*/
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';

// type
import { GridBtnPropsType } from '@/types/common';

interface KpSyncStockMonitoringDetailProps {
	data: any[];
	totalCnt: number;
}

const KpSyncStockMonitoringDetail = forwardRef((props: KpSyncStockMonitoringDetailProps, ref: any) => {
	const { t } = useTranslation();
	const gridRef = useRef(null);
	if (ref) ref.gridRef = gridRef;
	const gridId = uuidv4() + '_gridWrap';

	const num = () => ({ dataType: 'numeric' as const });
	const base = (h: string, f: string, w?: number) => ({ headerText: h, dataField: f, width: w ?? 100 });

	const gridCol = [
		base(t('lbl.EXISTS_YN') ?? '존재여부', 'existsYn', 80),
		base(t('lbl.DCCODE'), 'dccode', 80),
		base(t('lbl.SKU'), 'sku', 120),
		base(t('lbl.LOC'), 'loc', 80),
		base(t('lbl.LOT'), 'lot', 120),
		base(t('lbl.STOCKID'), 'stockid', 100),
		base(t('lbl.STOCKGRADE'), 'stockgrade', 100),
		base(t('lbl.STOCKTYPE'), 'stocktype', 90),
		{ ...base(t('lbl.QTY'), 'qty', 90), ...num() },
		base(t('lbl.CHK_QTY') ?? 'CHK수량', 'chkQty', 100),
		{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
		base(t('lbl.CHK_OPENQTY') ?? 'CHK가용', 'chkOpenqty', 100),
		{ ...base(t('lbl.QTYEXPECTED') ?? '예정수량', 'qtyexpected', 100), ...num() },
		base(t('lbl.CHK_QTYEXPECTED') ?? 'CHK예정', 'chkQtyexpected', 110),
		{ ...base(t('lbl.QTYRESERVE') ?? '예약수량', 'qtyreserve', 100), ...num() },
		base(t('lbl.CHK_QTYRESERVE') ?? 'CHK예약', 'chkQtyreserve', 110),
		{ ...base(t('lbl.QTYALLOCATED') ?? '할당수량', 'qtyallocated', 100), ...num() },
		base(t('lbl.CHK_QTYALLOCATED') ?? 'CHK할당', 'chkQtyallocated', 120),
		{ ...base(t('lbl.QTYPICKED') ?? '피킹수량', 'qtypicked', 100), ...num() },
		base(t('lbl.CHK_QTYPICKED') ?? 'CHK피킹', 'chkQtypicked', 110),
		{ ...base(t('lbl.QTYHOLD') ?? '보류수량', 'qtyhold', 90), ...num() },
		base(t('lbl.CHK_QTYHOLD') ?? 'CHK보류', 'chkQtyhold', 100),
		{ ...base(t('lbl.CHK_SUM'), 'chkSum', 80), ...num() },
	];

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [],
	};

	const gridProps = {
		editable: false,
	};

	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur.setGridData(props.data ?? []);
			if (props.data?.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn} />
			<AUIGrid ref={gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

KpSyncStockMonitoringDetail.displayName = 'KpSyncStockMonitoringDetail';

export default KpSyncStockMonitoringDetail;
