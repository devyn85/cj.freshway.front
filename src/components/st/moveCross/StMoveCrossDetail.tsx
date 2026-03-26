/*
 ############################################################################
 # FiledataField	: StMoveCrossDetail.tsx
 # Description		: 재고 > 재고현황 > CROSS자동보충(Detail)
 # Author			: Canal Frame
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import { apiGetDetailList, apiPostSaveMasterList } from '@/api/st/apiStMoveCross';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
// Redux
// API Call Function

const StMoveCrossDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const refModal = useRef(null);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
	const { form, formRef } = props; // Antd Form

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세 조회
	 */
	const searchDetailList = () => {
		const gridRef = ref.gridRef1;
		const selectedRow = ref.gridRef.current.getSelectedRows()[0];

		const params = {
			dccode: selectedRow.dccode,
			storerkey: selectedRow.storerkey,
			organize: selectedRow.organize,
			area: selectedRow.area,
			sku: selectedRow.sku,
			stockgrade: selectedRow.stockgrade,
			stockid: selectedRow.stockid,
			uom: selectedRow.uom,
			loc: selectedRow.loc,
			lot: selectedRow.lot,
		};
		//alert(JSON.stringify(selectedRow));

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			gridRef.current?.setGridData(gridData);
			setDetailTotalCnt(gridData.length);

			if (gridData.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		});
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef1.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		if (!isChanged || isChanged.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// 입력 값 검증
		const isValid = await validateForm(formRef);
		if (!isValid) {
			return;
		}

		// validation
		//if (!gridRef.validateRequiredGridData()) return;
		const gridData = gridRef.getGridData();

		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const loc = (row.toLoc || '').toUpperCase();
			const openqty = Number(row.openqty) || 0;
			const toOrderqty = Number(row.toOrderqty) || 0;

			// 로케이션 대문자 처리
			row.toLoc = loc;

			if (!moveQtyCheck(row, rowIndex, gridRef)) return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				avc_COMMAND: 'SUPPLYMENTCROSS',
				saveList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	/**
	 *
	 * @param rowData
	 * @param rowIndex
	 * @param gridRef
	 */
	function moveQtyCheck(rowData: any, rowIndex: number, gridRef: any) {
		const openQty = Number(rowData.openqty);
		const toOrderQty = Number(rowData.toOrderqty);

		if (openQty < toOrderQty) {
			showAlert(null, '이동가능 수량을 초과합니다.');

			// 값 초기화
			gridRef.current.setCellValue(rowIndex, 'toOrderqty', 0);

			// 해당 셀로 포커스 이동 및 에디터 활성화
			showAlert(null, `${rowIndex + 1}번째 행의 이동수량이 이동가능 수량을 초과합니다.`);
			gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('openqty'));

			return false;
		}
		return true;
	}
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, dataType: 'code', editable: false }, // 조직
		{ dataField: 'loc', headerText: t('lbl.LOC'), width: 80, dataType: 'code', editable: false }, // 로케이션
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{ dataField: 'stockgrade', headerText: t('lbl.CODE'), width: 55, dataType: 'code', editable: false }, // 코드
				{ dataField: 'stockgradenm', headerText: t('lbl.NAME'), width: 100, dataType: 'code', editable: false }, // 명칭
			],
		},
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			width: 80,
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		}, // 창고유형
		{
			headerText: t('lbl.STOCK_INFO'), // 수량정보
			children: [
				{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 80, dataType: 'code', editable: false }, // 단위
				{ dataField: 'qty', headerText: t('lbl.QTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 수량
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					width: 80,
					dataType: 'numeric',
					editable: false,
				}, // 분배량
				{ dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), width: 80, dataType: 'numeric', editable: false }, // 피킹수량
				{ dataField: 'nqty', headerText: '부족수량', width: 80, dataType: 'numeric', editable: false }, // 부족수량
			],
		},
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), width: 100, dataType: 'code', editable: false }, // 기준일(소비,제조)
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), width: 150, dataType: 'code', editable: false }, // 소비기간(잔여/전체)
		//
		// hidden 필드
		{ dataField: 'storagetypenm', headerText: t('lbl.STORAGETYPENM'), width: 100, visible: false, dataType: 'code' }, // 보관유형명
		{ dataField: 'stockid', headerText: t('lbl.STOCKID'), width: 100, visible: false, dataType: 'code' }, // 재고ID
		{ dataField: 'lot', headerText: t('lbl.LOT'), width: 100, visible: false, dataType: 'code' }, // 로트
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			return '';
		},
	};

	// FooterLayout (summary row)
	const footerLayout = [
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 분배량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 피킹수량 합계
		{ dataField: 'nqty', positionField: 'nqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 부족수량 합계
		// 나머지 컬럼은 합계 미표시
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 컬럼(상세목록 그리드)
	const gridCol1 = [
		{
			headerText: t('lbl.STOCKTYPE'), // 재고속성
			children: [
				{ dataField: 'fromStocktype', headerText: t('lbl.CODE'), width: 80, dataType: 'code', editable: false }, // 코드
				{ dataField: 'stocktypenm', headerText: t('lbl.DESCR'), width: 80, dataType: 'code', editable: false }, // 명칭
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{ dataField: 'fromStockgrade', headerText: t('lbl.CODE'), width: 80, dataType: 'code', editable: false }, // 코드
				{ dataField: 'stockgradenm', headerText: t('lbl.DESCR'), width: 80, dataType: 'code', editable: false }, // 명칭
			],
		},
		{ dataField: 'fromLoc', headerText: t('lbl.LOC'), width: 80, dataType: 'code', editable: false }, // 로케이션
		{ dataField: 'fromSku', headerText: t('lbl.SKU'), width: 80, dataType: 'code', editable: false }, // 상품코드

		{
			dataField: 'fromSku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'fromSku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명

		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			width: 80,
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		}, // 창고유형
		{
			headerText: t('lbl.STOCK_INFO'), // 수량정보
			children: [
				{ dataField: 'fromUom', headerText: t('lbl.UOM_ST'), width: 80, dataType: 'code', editable: false }, // 단위
				{ dataField: 'fromOrderqty', headerText: t('lbl.QTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 가용재고수량
				{ dataField: 'etcqty1', headerText: t('lbl.QTYALLOCATED_ST'), width: 80, dataType: 'numeric', editable: false }, // 재고할당수량
				{ dataField: 'etcqty2', headerText: t('lbl.QTYPICKED_ST'), width: 80, dataType: 'numeric', editable: false }, // 피킹재고
				{ dataField: 'openqty', headerText: t('lbl.POSBQTY'), width: 80, dataType: 'numeric', editable: false }, // 이동가능수량
				{ dataField: 'toOrderqty', headerText: t('lbl.TOORDERQTY'), width: 80, dataType: 'numeric', editable: true }, // 이동수량
			],
		},
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), width: 100, dataType: 'code', editable: false }, // 기준일(소비,제조)
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), width: 100, dataType: 'code', editable: false }, // 소비기간(잔여/전체)

		//
		// hidden 필드
		{ dataField: 'checkyn', headerText: t('lbl.CHECKYN'), width: 100, visible: false }, // 체크여부
		{ dataField: 'fromDccode', headerText: t('lbl.FROM_DCCODE'), width: 100, visible: false }, // 출고센터코드
		{ dataField: 'fromStorerkey', headerText: t('lbl.FROM_STORERKEY'), width: 100, visible: false }, // 출고화주코드
		{ dataField: 'fromOrganize', headerText: t('lbl.FROM_ORGANIZE'), width: 100, visible: false }, // 출고조직
		{ dataField: 'fromArea', headerText: t('lbl.FROM_AREA'), width: 100, visible: false }, // 출고구역
		{ dataField: 'fromLot', headerText: t('lbl.FROM_LOT'), width: 100, visible: false }, // 출고로트
		{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), width: 100, visible: false }, // 출고재고ID
		{ dataField: 'toDccode', headerText: t('lbl.TO_DCCODE'), width: 100, visible: false }, // 입고센터코드
		{ dataField: 'toStorerkey', headerText: t('lbl.TO_STORERKEY'), width: 100, visible: false }, // 입고화주코드
		{ dataField: 'toOrganize', headerText: t('lbl.TO_ORGANIZE'), width: 100, visible: false }, // 입고조직
		{ dataField: 'toArea', headerText: t('lbl.TO_AREA'), width: 100, visible: false }, // 입고구역
		{ dataField: 'toSku', headerText: t('lbl.TO_SKU'), width: 100, visible: false }, // 입고SKU
		{ dataField: 'toLoc', headerText: t('lbl.TO_LOC'), width: 100, visible: false }, // 입고로케이션
		{ dataField: 'toLot', headerText: t('lbl.TO_LOT'), width: 100, visible: false }, // 입고로트
		{ dataField: 'toStockid', headerText: t('lbl.TO_STOCKID'), width: 100, visible: false }, // 입고재고ID
		{ dataField: 'toStockgrade', headerText: t('lbl.TO_STOCKGRADE'), width: 100, visible: false }, // 입고재고등급
		{ dataField: 'toUom', headerText: t('lbl.TO_UOM'), width: 100, visible: false }, // 입고단위
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps1 = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};
	// FooterLayout Props
	// 상세목록 그리드 footerLayout1 (summary row, XML 기준, 한글 주석)
	const footerLayout1 = [
		{
			dataField: 'fromOrderqty',
			positionField: 'fromOrderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 주문수량 합계
		{ dataField: 'etcqty1', positionField: 'etcqty1', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 기타수량1 합계
		{ dataField: 'etcqty2', positionField: 'etcqty2', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 기타수량2 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 이동가능수량 합계
		{
			dataField: 'toOrderqty',
			positionField: 'toOrderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 이동수량 합계
		// 나머지 컬럼은 합계 미표시
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function () {
			// 상세코드 조회
			searchDetailList();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="CROSS LOCATION 품목 목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn1} gridTitle="CROSS 외 LOCATION 품목 목록" totalCnt={detailTotalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});
export default StMoveCrossDetail;
