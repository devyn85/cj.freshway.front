/*
 ############################################################################
 # FiledataField	: WdDistributePlanSkuSumDetail.tsx
 # Description		: 출고 > 출고현황 > 미출예정확인(상품별합계) Grid 화면
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/

import { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// API

// Store

// Libs

// Utils

const WdDistributePlanSkuSumDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCount, refModal } = props;

	const { t } = useTranslation();

	const [apiParams, setApiParams] = useState({});

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			// { dataField: 'SEQ', headerText: t('lbl.SEQ') },	//순번
			{ dataField: 'slipdt', headerText: t('lbl.DOCDT_WD') }, // 출고일자
			{ dataField: 'sku', headerText: t('lbl.SKU') }, //상품코드
			{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), style: 'left', width: '500' }, //상품명
			{ dataField: 'channel', headerText: t('lbl.CHANNEL_DMD') }, //저장유무
			{ dataField: 'qty', headerText: t('lbl.QTY_ST'), style: 'right', dataType: 'numeric' }, //현재고수량
			{ dataField: 'stOpenqty', headerText: t('lbl.OPENQTY_ST'), style: 'right', dataType: 'numeric' }, //가용재고수량
			{ dataField: 'shortageqty', headerText: t('lbl.SHORTAGE_QTY'), style: 'right', dataType: 'numeric' }, //부족수량
			{ dataField: 'orderqty', headerText: t('lbl.OPENQTY_WD'), style: 'right', dataType: 'numeric' }, //주문량
			{ dataField: 'dpQty', headerText: t('lbl.INPLANQTY_DP'), style: 'right', dataType: 'numeric' }, //입고예정량
			{ dataField: 'qtyallocated', headerText: t('lbl.QTYALLOCATED_ST'), style: 'right', dataType: 'numeric' }, //재고할당수량
			{ dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), style: 'right', dataType: 'numeric' }, //피킹재고
			{ dataField: 'uom', headerText: t('lbl.UOM') }, //단위
			{ dataField: 'crossdocktype', headerText: t('lbl.CROSSDOCKTYPE') }, //C/D 타입
		],
		[t],
	);

	// 그리드 속성
	const gridProps = useMemo(
		() => ({
			editable: false,
			// enterKeyColumnBase: true,
			// useContextMenu: true,
			// enableFilter: true,
			// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
			// treeColumnIndex: 1,
			// 최초 보여질 때 모두 열린 상태로 출력 여부
			// displayTreeOpen: true,
			// flat2tree: true,
			// rowIdField: 'rowId',
			// treeIdField: 'progCd',
			// treeIdRefField: 'refUpperProgCd',

			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			// showRowCheckColumn: true,
			// fixedColumnCount: 2,
			fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			showFooter: true,
			// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
			// showDragKnobColumn: true,
			// 드래깅 행 이동 가능 여부 (기본값 : false)
			// enableDrag: true,
			// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
			// enableMultipleDrag: true,
			// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
			// enableDragByCellDrag: true,
			// 드랍 가능 여부 (기본값 : true)
			// enableDrop: true,
			// autoGridHeight: true, // 자동 높이 조절
		}),
		[],
	);

	// FooterLayout Props
	const footerLayout = useMemo(
		() => [
			{ labelText: '∑', positionField: '#base' },
			{
				dataField: 'qty',
				positionField: 'qty',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'stOpenqty',
				positionField: 'stOpenqty',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'shortageqty',
				positionField: 'shortageqty',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'orderqty',
				positionField: 'orderqty',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'dpQty',
				positionField: 'dpQty',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'qtyallocated',
				positionField: 'qtyallocated',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
			{
				dataField: 'qtypicked',
				positionField: 'qtypicked',
				operation: 'SUM',
				formatString: '#,##0',
				postfix: '',
				align: 'right',
			},
		],
		[],
	);

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	const handleCellDoubleClick = useCallback((event: any) => {
		/**
		 * 단일 셀 더블 클릭 시 발생하는 이벤트 바인딩
		 * @event cellDoubleClick
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- editable : 해당 셀의 수정 가능 여부
		 * 			- value : 셀에 출력되고 있는 값(value)
		 * 			- rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행(Row)의 고유값 (rowIdField 설정 선행 필수)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- treeIcon : 트리그리드인 경우 트리그리드의 열기/닫기 버턴 클릭 여부(Boolean)
		 * 			- orgEvent : 자바스크립트의 오리지널 이벤트 객체 (Object)
		 */
		if (event.dataField === 'sku') {
			const params = { sku: event.value };

			setApiParams(params);
			refModal.current.handlerOpen();
			return;
		}
	}, []);

	const initEvent = useCallback(() => {
		if (!gridRef) return;

		const grid = gridRef.current;
		grid.bind('cellDoubleClick', handleCellDoubleClick);

		return () => {
			grid.unbind('cellDoubleClick', handleCellDoubleClick);
		};
	}, [handleCellDoubleClick]);

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 팝업 닫기
	 */
	const closeEvent = useCallback((e: any) => {
		refModal.current.handlerClose();
	}, []);

	// 스크롤 이벤트
	useEffect(() => {
		// [중요] aui grid의 bind 함수는 updated hook 안에서 호출합니다.
		// aui grid의 bind함수는 상태 관리(ref, state) 객체/변수가 동기화되지 않으므로 update 될 때마다 bind 해줍니다.
		// 단, eventhandler 내부에 상태 관리 객체/변수가 없을 경우 mount 시에만 bind 해주어도 됩니다.
		const cleanup = initEvent();
		return () => cleanup?.();
	});

	useEffect(() => {
		// 그리드 초기화
		gridRef.current?.clearGridData();
		gridRef.current.addRow(data);
	}, [data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<PageGridBtn gridTitle="목록" /* gridBtn={gridBtn}  */ totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refModal} width="1000px">
				<CmSkuInfoPopup titieName="상품상세" refModal={refModal} apiParams={apiParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdDistributePlanSkuSumDetail;
