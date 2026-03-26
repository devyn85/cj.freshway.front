/*
############################################################################
# FiledataField : OmPurchaseInspectPop.tsx
# Description   : 저장품자동발주검수 점검 팝업
# Author        : YeoSeungCheol
# Since         : 25.09.30
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

interface PropsType {
	orders?: any[];
	callBack?: any;
	close?: any;
}

const OmPurchaseInspectPop = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { orders: propsOrders, callBack, close: propsClose } = props;

	const { t } = useTranslation();
	const gridRef = useRef(null);
	const [totalCount, setTotalCount] = useState(0);
	const [orders, setOrders] = useState<any[]>(propsOrders || []);
	const gridId = uuidv4() + '_gridWrap';

	// window.open으로 열렸는지 확인
	const isWindowPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;

	const gridCol = [
		{
			// 협력사코드
			headerText: t('lbl.CUSTKEY_KP'),
			dataField: 'custKey',
			dataType: 'code',
		},
		{
			// 협력사명
			headerText: t('lbl.CUSTNAME_KP'),
			dataField: 'custName',
			dataType: 'string',
		},
		{
			// 발주구분
			headerText: t('lbl.PURCHASETYPE_PO'),
			dataField: 'purchaseType',
			dataType: 'code',
		},
		{
			// 직송그룹
			headerText: t('lbl.DELIVERYTYPE_PO'),
			dataField: 'deliveryType',
			dataType: 'code',
		},
		{
			// 입고센터
			headerText: t('lbl.PODCCODE'),
			dataField: 'dcName',
			dataType: 'code',
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			// 상품명
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuName',
			dataType: 'string',
		},
		{
			// 구매단위
			headerText: t('lbl.UOM_DP'),
			dataField: 'purchaseUom',
			dataType: 'code',
		},
		{
			// 발주수량
			headerText: t('lbl.PURCHASEQTY_DP'),
			dataField: 'confirmQty',
			dataType: 'numeric',
		},
		{
			// 확정오더량보유일
			headerText: t('lbl.CONFIRMQTY_STOCKDAY'),
			dataField: 'stockQtyDispStockDay',
			dataType: 'numeric',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (!item.stockAvgDay || item.stockAvgDay === 0) {
					return 0;
				}

				if (item.confirmQty * item.eaCal > 0) {
					return Math.trunc((item.confirmQty * item.eaCal) / item.stockAvgDay);
				} else {
					return Math.trunc(item.confirmQty / item.stockAvgDay);
				}
			},
		},
		{
			// PLT수량
			headerText: '환산수량(PLT)',
			dataField: 'pltTransCal',
			dataType: 'numeric',
		},
		{
			// 중량
			headerText: '중량(KG)',
			dataField: 'kgCalQty',
			dataType: 'numeric',
		},
	];

	const gridProps = {
		editable: false,
		extraColumnOrders: 'showRowNumColumn',
		showRowCheckColumn: false,
		groupingFields: ['custKey'],
		// 합계(소계) 설정
		groupingSummary: {
			dataFields: ['confirmQty', 'pltTransCal', 'kgCalQty'],
			excepts: ['stockQtyDispStockDay'],
		},
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: (rowIndex: any, item: any) => {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'aui-grid-row-depth1-style';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		},
		showFooter: true,
	};

	/**
	 * 그리드 푸터 레이아웃 설정
	 */
	const getFooterLayout = () => {
		return [
			{
				dataField: 'confirmQty',
				positionField: 'confirmQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'pltTransCal',
				positionField: 'pltTransCal',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'kgCalQty',
				positionField: 'kgCalQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
		];
	};

	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: null as any,
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터 설정
	 * @param {OrderData[]} data 주문 데이터 배열
	 */
	const setData = (data: any[]) => {
		if (data && data.length > 0) {
			setTotalCount(data.length);
			gridRef.current?.setGridData(data);

			// 데이터 설정 후 컬럼 크기 자동 조정
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			gridRef.current.setColumnSizeList(colSizeList);
		}
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows();
		if (selectedRow && selectedRow.length > 0) {
			callBack?.(selectedRow[0]);
			close?.();
		}
	};

	/**
	 * 팝업 닫기
	 */
	const handleClose = () => {
		if (isWindowPopup) {
			window.close();
		} else {
			propsClose?.();
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	// props로 받은 orders 데이터 설정
	useEffect(() => {
		if (propsOrders && propsOrders.length > 0) {
			setOrders(propsOrders);
			setData(propsOrders);
		}
	}, [propsOrders]);

	// window.open으로 열린 경우 postMessage로 데이터 받기
	useEffect(() => {
		if (!isWindowPopup) return;

		const handleMessage = (event: MessageEvent) => {
			// 보안: origin 체크 (개발 환경에서는 같은 origin)
			if (event.origin !== window.location.origin) return;

			if (event.data && Array.isArray(event.data)) {
				setOrders(event.data);
				setData(event.data);
			}
		};

		window.addEventListener('message', handleMessage);

		// 부모 창에 준비 완료 신호 전송
		if (window.opener) {
			window.opener.postMessage('popup-ready', window.location.origin);
		}

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [isWindowPopup]);

	// 데이터가 변경되면 그리드에 표시
	useEffect(() => {
		if (orders && orders.length > 0) {
			setData(orders);
		}
	}, [orders]);

	return (
		<div className="pop-title">
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`저장품 자동발주검수 점검`} />

			{/* 그리드 영역 */}
			<AGrid className="h100">
				<GridTopBtn gridBtn={gridBtn} gridTitle={`목록`} totalCnt={totalCount} />
				<AUIGrid
					ref={gridRef}
					columnLayout={gridCol}
					gridProps={gridProps}
					name={gridId}
					footerLayout={getFooterLayout()}
				/>
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={handleClose}>{t('lbl.CLOSE')}</Button>
			</ButtonWrap>
		</div>
	);
};

export default OmPurchaseInspectPop;
