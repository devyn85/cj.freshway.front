/*
 ############################################################################
 # File name    : KpSyncOrdDtlMonitoringDetail.tsx
 # Description  : 주문동기화 상세 모니터링 그리드 (DP/RT/WD/AJ/ST 탭별 단일 그리드)
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

export type KpSyncOrdDtlTabType = 'DP' | 'RT' | 'WD' | 'AJ' | 'ST';

interface KpSyncOrdDtlMonitoringDetailProps {
	tabType: KpSyncOrdDtlTabType;
	data: any[];
	totalCnt: number;
}

const getGridCol = (tabType: KpSyncOrdDtlTabType, t: (key: string) => string): any[] => {
	const num = () => ({ dataType: 'numeric' as const });
	const base = (h: string, f: string, w?: number) => ({ headerText: h, dataField: f, width: w ?? 100 });

	switch (tabType) {
		case 'DP':
			return [
				base(t('lbl.DCCODE'), 'dccode', 80),
				base(t('lbl.SLIPDT'), 'slipdt', 100),
				base(t('lbl.SLIPNO'), 'slipno', 120),
				base(t('lbl.SLIPLINE'), 'slipline', 80),
				base(t('lbl.CUSTKEY'), 'custkey', 100),
				base(t('lbl.IF_SEND_TYPE'), 'ifSendType', 100),
				base(t('lbl.SKU'), 'sku', 120),
				base(t('lbl.STATUS'), 'status', 80),
				base(t('lbl.CHK_STATUS'), 'chkStatus', 90),
				base(t('lbl.DOCTYPE'), 'doctype', 90),
				base(t('lbl.CHK_DOCTYPE'), 'chkDoctype', 100),
				base(t('lbl.IOTYPE'), 'iotype', 80),
				base(t('lbl.CHK_IOTYPE'), 'chkIotype', 100),
				base(t('lbl.ORDERTYPE'), 'ordertype', 90),
				base(t('lbl.CHK_ORDERTYPE'), 'chkOrdertype', 110),
				{ ...base(t('lbl.ORDERQTY'), 'orderqty', 90), ...num() },
				{ ...base(t('lbl.CHK_ORDERQTY'), 'chkOrderqty', 110), ...num() },
				{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
				{ ...base(t('lbl.CHK_OPENQTY'), 'chkOpenqty', 110), ...num() },
				{ ...base(t('lbl.TASKQTY'), 'taskqty', 90), ...num() },
				{ ...base(t('lbl.CHK_TASKQTY'), 'chkTaskqty', 110), ...num() },
				{ ...base(t('lbl.CONFIRMQTY'), 'confirmqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMQTY'), 'chkConfirmqty', 120), ...num() },
				{ ...base(t('lbl.CANCELQTY'), 'cancelqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CANCELQTY'), 'chkCancelqty', 120), ...num() },
				{ ...base(t('lbl.CONFIRMWEIGHT'), 'confirmweight', 110), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMWEIGHT'), 'chkConfirmweight', 130), ...num() },
				base(t('lbl.TOLOC'), 'toloc', 80),
				base(t('lbl.CHK_TOLOC'), 'chkToloc', 90),
				base(t('lbl.LOT'), 'lot', 120),
				base(t('lbl.CHK_LOT'), 'chkLot', 120),
				base(t('lbl.LOTTABLE01'), 'lottable01', 100),
				base(t('lbl.CHK_LOTTABLE01'), 'chkLottable01', 120),
				base(t('lbl.LOTTABLE02'), 'lottable02', 100),
				base(t('lbl.CHK_LOTTABLE02'), 'chkLottable02', 120),
				base(t('lbl.LOTTABLE03'), 'lottable03', 100),
				base(t('lbl.CHK_LOTTABLE03'), 'chkLottable03', 120),
				base(t('lbl.LOTTABLE04'), 'lottable04', 100),
				base(t('lbl.CHK_LOTTABLE04'), 'chkLottable04', 120),
				base(t('lbl.LOTTABLE05'), 'lottable05', 100),
				base(t('lbl.CHK_LOTTABLE05'), 'chkLottable05', 120),
				base(t('lbl.STOCKID'), 'stockid', 100),
				base(t('lbl.CHK_STOCKID'), 'chkStockid', 120),
				base(t('lbl.STOCKGRADE'), 'stockgrade', 100),
				base(t('lbl.CHK_STOCKGRADE'), 'chkStockgrade', 120),
				{ ...base(t('lbl.CHK_SUM'), 'chkSum', 90), ...num() },
			];
		case 'RT':
			return [
				base(t('lbl.DCCODE'), 'dccode', 80),
				base(t('lbl.SLIPDT'), 'slipdt', 100),
				base(t('lbl.SLIPNO'), 'slipno', 120),
				base(t('lbl.SLIPLINE'), 'slipline', 80),
				base(t('lbl.SLIPTYPE'), 'sliptype', 90),
				base(t('lbl.IF_SEND_TYPE'), 'ifSendType', 100),
				base(t('lbl.SKU'), 'sku', 120),
				base(t('lbl.STATUS'), 'status', 80),
				base(t('lbl.CHK_STATUS'), 'chkStatus', 90),
				base(t('lbl.DOCTYPE'), 'doctype', 90),
				base(t('lbl.CHK_DOCTYPE'), 'chkDoctype', 100),
				base(t('lbl.IOTYPE'), 'iotype', 80),
				base(t('lbl.CHK_IOTYPE'), 'chkIotype', 100),
				base(t('lbl.ORDERTYPE'), 'ordertype', 90),
				base(t('lbl.CHK_ORDERTYPE'), 'chkOrdertype', 110),
				{ ...base(t('lbl.ORDERQTY'), 'orderqty', 90), ...num() },
				{ ...base(t('lbl.CHK_ORDERQTY'), 'chkOrderqty', 110), ...num() },
				{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
				{ ...base(t('lbl.CHK_OPENQTY'), 'chkOpenqty', 110), ...num() },
				{ ...base(t('lbl.TASKQTY'), 'taskqty', 90), ...num() },
				{ ...base(t('lbl.CHK_TASKQTY'), 'chkTaskqty', 110), ...num() },
				{ ...base(t('lbl.CONFIRMQTY'), 'confirmqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMQTY'), 'chkConfirmqty', 120), ...num() },
				{ ...base(t('lbl.CANCELQTY'), 'cancelqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CANCELQTY'), 'chkCancelqty', 120), ...num() },
				{ ...base(t('lbl.CONFIRMWEIGHT'), 'confirmweight', 110), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMWEIGHT'), 'chkConfirmweight', 130), ...num() },
				base(t('lbl.TOLOC'), 'toloc', 80),
				base(t('lbl.CHK_TOLOC'), 'chkToloc', 90),
				base(t('lbl.LOT'), 'lot', 120),
				base(t('lbl.CHK_LOT'), 'chkLot', 120),
				base(t('lbl.LOTTABLE01'), 'lottable01', 100),
				base(t('lbl.CHK_LOTTABLE01'), 'chkLottable01', 120),
				base(t('lbl.LOTTABLE02'), 'lottable02', 100),
				base(t('lbl.CHK_LOTTABLE02'), 'chkLottable02', 120),
				base(t('lbl.LOTTABLE03'), 'lottable03', 100),
				base(t('lbl.CHK_LOTTABLE03'), 'chkLottable03', 120),
				base(t('lbl.LOTTABLE04'), 'lottable04', 100),
				base(t('lbl.CHK_LOTTABLE04'), 'chkLottable04', 120),
				base(t('lbl.LOTTABLE05'), 'lottable05', 100),
				base(t('lbl.CHK_LOTTABLE05'), 'chkLottable05', 120),
				base(t('lbl.STOCKID'), 'stockid', 100),
				base(t('lbl.CHK_STOCKID'), 'chkStockid', 120),
				base(t('lbl.STOCKGRADE'), 'stockgrade', 100),
				base(t('lbl.CHK_STOCKGRADE'), 'chkStockgrade', 120),
				{ ...base(t('lbl.CHK_SUM'), 'chkSum', 90), ...num() },
			];
		case 'WD':
			return [
				base(t('lbl.DCCODE'), 'dccode', 80),
				base(t('lbl.SLIPDT'), 'slipdt', 100),
				base(t('lbl.SLIPNO'), 'slipno', 120),
				base(t('lbl.SLIPLINE'), 'slipline', 80),
				base(t('lbl.CUSTKEY'), 'custkey', 100),
				base(t('lbl.IF_SEND_TYPE'), 'ifSendType', 100),
				base(t('lbl.SKU'), 'sku', 120),
				base(t('lbl.STATUS'), 'status', 80),
				base(t('lbl.CHK_STATUS'), 'chkStatus', 90),
				base(t('lbl.DOCTYPE'), 'doctype', 90),
				base(t('lbl.CHK_DOCTYPE'), 'chkDoctype', 100),
				base(t('lbl.IOTYPE'), 'iotype', 80),
				base(t('lbl.CHK_IOTYPE'), 'chkIotype', 100),
				base(t('lbl.ORDERTYPE'), 'ordertype', 90),
				base(t('lbl.CHK_ORDERTYPE'), 'chkOrdertype', 110),
				{ ...base(t('lbl.ORDERQTY'), 'orderqty', 90), ...num() },
				{ ...base(t('lbl.CHK_ORDERQTY'), 'chkOrderqty', 110), ...num() },
				{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
				{ ...base(t('lbl.CHK_OPENQTY'), 'chkOpenqty', 110), ...num() },
				{ ...base(t('lbl.TASKQTY'), 'taskqty', 90), ...num() },
				{ ...base(t('lbl.CHK_TASKQTY'), 'chkTaskqty', 110), ...num() },
				{ ...base(t('lbl.CONFIRMQTY'), 'confirmqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMQTY'), 'chkConfirmqty', 120), ...num() },
				{ ...base(t('lbl.CANCELQTY'), 'cancelqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CANCELQTY'), 'chkCancelqty', 120), ...num() },
				{ ...base(t('lbl.CONFIRMWEIGHT'), 'confirmweight', 110), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMWEIGHT'), 'chkConfirmweight', 130), ...num() },
				base(t('lbl.LOC'), 'loc', 80),
				base(t('lbl.CHK_LOC'), 'chkLoc', 90),
				base(t('lbl.LOT'), 'lot', 120),
				base(t('lbl.CHK_LOT'), 'chkLot', 120),
				base(t('lbl.STOCKID'), 'stockid', 100),
				base(t('lbl.CHK_STOCKID'), 'chkStockid', 120),
				base(t('lbl.STOCKGRADE'), 'stockgrade', 100),
				base(t('lbl.CHK_STOCKGRADE'), 'chkStockgrade', 120),
				{ ...base(t('lbl.CHK_SUM'), 'chkSum', 90), ...num() },
			];
		case 'AJ':
			return [
				base(t('lbl.DCCODE'), 'dccode', 80),
				base(t('lbl.SLIPDT'), 'slipdt', 100),
				base(t('lbl.SLIPNO'), 'slipno', 120),
				base(t('lbl.SLIPLINE'), 'slipline', 80),
				base(t('lbl.SKU'), 'sku', 120),
				base(t('lbl.STATUS'), 'status', 80),
				base(t('lbl.CHK_STATUS'), 'chkStatus', 90),
				base(t('lbl.DOCTYPE'), 'doctype', 90),
				base(t('lbl.CHK_DOCTYPE'), 'chkDoctype', 100),
				base(t('lbl.IOTYPE'), 'iotype', 80),
				base(t('lbl.CHK_IOTYPE'), 'chkIotype', 100),
				base(t('lbl.ORDERTYPE'), 'ordertype', 90),
				base(t('lbl.CHK_ORDERTYPE'), 'chkOrdertype', 110),
				{ ...base(t('lbl.ORDERQTY'), 'orderqty', 90), ...num() },
				{ ...base(t('lbl.CHK_ORDERQTY'), 'chkOrderqty', 110), ...num() },
				{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
				{ ...base(t('lbl.CHK_OPENQTY'), 'chkOpenqty', 110), ...num() },
				{ ...base(t('lbl.CONFIRMQTY'), 'confirmqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMQTY'), 'chkConfirmqty', 120), ...num() },
				{ ...base(t('lbl.CANCELQTY'), 'cancelqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CANCELQTY'), 'chkCancelqty', 120), ...num() },
				base(t('lbl.LOC'), 'loc', 80),
				base(t('lbl.CHK_LOC'), 'chkLoc', 90),
				base(t('lbl.LOT'), 'lot', 120),
				base(t('lbl.CHK_LOT'), 'chkLot', 120),
				base(t('lbl.STOCKID'), 'stockid', 100),
				base(t('lbl.CHK_STOCKID'), 'chkStockid', 120),
				base(t('lbl.STOCKGRADE'), 'stockgrade', 100),
				base(t('lbl.CHK_STOCKGRADE'), 'chkStockgrade', 120),
				{ ...base(t('lbl.CHK_SUM'), 'chkSum', 90), ...num() },
			];
		case 'ST':
			return [
				base(t('lbl.DCCODE'), 'dccode', 80),
				base(t('lbl.SLIPDT'), 'slipdt', 100),
				base(t('lbl.SLIPNO'), 'slipno', 120),
				base(t('lbl.SLIPLINE'), 'slipline', 80),
				base(t('lbl.SKU'), 'sku', 120),
				base(t('lbl.TASKTYPE'), 'tasktype', 90),
				base(t('lbl.ORDERTYPE'), 'ordertype', 90),
				base(t('lbl.CHK_ORDERTYPE'), 'chkOrdertype', 110),
				base(t('lbl.FROM_LOT'), 'fromLot', 120),
				base(t('lbl.CHK_FROM_LOT'), 'chkFromLot', 120),
				base(t('lbl.FROM_STOCKID'), 'fromStockid', 120),
				base(t('lbl.CHK_FROM_STOCKID'), 'chkFromStockid', 140),
				base(t('lbl.FROM_STOCKGRADE'), 'fromStockgrade', 120),
				base(t('lbl.CHK_FROM_STOCKGRADE'), 'chkFromStockgrade', 140),
				base(t('lbl.FROM_STOCKTYPE'), 'fromStocktype', 120),
				base(t('lbl.CHK_FROM_STOCKTYPE'), 'chkFromStocktype', 140),
				base(t('lbl.FROM_LOC'), 'fromLoc', 90),
				base(t('lbl.CHK_FROM_LOC'), 'chkFromLoc', 110),
				base(t('lbl.TO_LOT'), 'toLot', 120),
				base(t('lbl.CHK_TO_LOT'), 'chkToLot', 120),
				base(t('lbl.TO_STOCKID'), 'toStockid', 120),
				base(t('lbl.CHK_TO_STOCKID'), 'chkToStockid', 140),
				base(t('lbl.TO_STOCKGRADE'), 'toStockgrade', 120),
				base(t('lbl.CHK_TO_STOCKGRADE'), 'chkToStockgrade', 140),
				base(t('lbl.TO_STOCKTYPE'), 'toStocktype', 120),
				base(t('lbl.CHK_TO_STOCKTYPE'), 'chkToStocktype', 140),
				base(t('lbl.TO_LOC'), 'toLoc', 90),
				base(t('lbl.CHK_TO_LOC'), 'chkToLoc', 110),
				{ ...base(t('lbl.ORDERQTY'), 'orderqty', 90), ...num() },
				{ ...base(t('lbl.CHK_ORDERQTY'), 'chkOrderqty', 110), ...num() },
				{ ...base(t('lbl.OPENQTY'), 'openqty', 90), ...num() },
				{ ...base(t('lbl.CHK_OPENQTY'), 'chkOpenqty', 110), ...num() },
				{ ...base(t('lbl.CONFIRMQTY'), 'confirmqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CONFIRMQTY'), 'chkConfirmqty', 120), ...num() },
				{ ...base(t('lbl.CANCELQTY'), 'cancelqty', 100), ...num() },
				{ ...base(t('lbl.CHK_CANCELQTY'), 'chkCancelqty', 120), ...num() },
				{ ...base(t('lbl.CHK_SUM'), 'chkSum', 90), ...num() },
			];
		default:
			return [];
	}
};

const KpSyncOrdDtlMonitoringDetail = forwardRef((props: KpSyncOrdDtlMonitoringDetailProps, ref: any) => {
	const { t } = useTranslation();
	ref.gridRef = useRef(null);
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = getGridCol(props.tabType, t);

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [],
	};

	const gridProps = {
		editable: false,
	};

	useEffect(() => {
		const gridRefCur = ref.gridRef?.current;
		if (gridRefCur) {
			gridRefCur.setGridData(props.data ?? []);
			if (props.data?.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data, props.tabType]);

	return (
		<AGrid>
			<GridTopBtn gridTitle={t(`lbl.${props.tabType}`)} totalCnt={props.totalCnt} gridBtn={gridBtn} />
			<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

KpSyncOrdDtlMonitoringDetail.displayName = 'KpSyncOrdDtlMonitoringDetail';

export default KpSyncOrdDtlMonitoringDetail;
