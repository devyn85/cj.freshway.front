/*
 ############################################################################
 # FiledataField	: StLocMoveAsrsTap1Detail.tsx
 # Description		: 자동창고보충(이동대상)
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import { InputText } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { Button, Form, Tabs } from 'antd';
const { TabPane } = Tabs;
//Lib
import { apiSaveBatch } from '@/api/st/apiStLocMoveAsrs';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const StLocMoveAsrsTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 자동취소
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('com.msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM_BOX',
				saveBatchList: checkedRows, // 선택된 행의 데이터
			};
			apiSaveBatch(params).then(res => {
				showAlert('', '저장되었습니다');
				props.callBack(res);
			});
		});
	};

	/**
	 * 일괄 이동 버튼 클릭 시
	 * @param flag
	 */
	const handleSelectApply = (flag: string) => {
		const grid = ref.gridRef.current;
		if (!grid) return;

		const checkedItems = grid.getCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const locValue = props.form.getFieldValue('movelocation') ?? '';
		if (locValue.trim().length < 1 && flag == '1') {
			showAlert(null, '로케이션을 입력하시기 바랍니다.');
			const input = document.querySelector('input[name="movelocation"]') as HTMLInputElement;
			input?.focus();
			return;
		}

		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(1/2)
		const allData = grid.getGridData();
		// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
		const rowIdField = grid.getProp('rowIdField') || '_$uid';

		const checkedRowIds = checkedItems.map((item: any) => item.item[rowIdField]);
		const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

		const newData = allData.map((row: any, index: number) => {
			if (checkedRowIndexes.has(index)) {
				return { ...row, toLoc: flag === '1' ? locValue : String(row.fixloc ?? '') };
			}
			return row;
		});

		if (newData.length > 0) {
			grid.updateRowsById(newData, true); // isMarkEdited: true
		}

		//grid.setGridData(newData);
		// 이전에 체크된 행들을 다시 체크합니다.
		grid.setCheckedRowsByIds(checkedRowIds);
	};

	// 대문자 변환
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const upperValue = e.target.value.toUpperCase();
		props.form.setFieldsValue({ movelocation: upperValue });
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE') /*물류센터*/,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE') /*창고*/,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{
					dataField: 'fromStocktype',
					headerText: t('lbl.CODE') /*재고위치코드*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stocktype',
					headerText: t('lbl.DESCR') /*재고위치명칭*/,
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{
					dataField: 'fromStockgrade',
					headerText: t('lbl.CODE') /*재고속성코드*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stockgrade',
					headerText: t('lbl.DESCR') /*재고속성명칭*/,
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC') /*로케이션*/,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), // 상품명
			dataType: 'name',
			editable: false,
			filter: { showIcon: true },
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE') /*저장조건*/,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fixloc',
			headerText: t('lbl.FIXLOC') /*고정로케이션*/,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.POSBQTY') /*이동가능수량*/,
			children: [
				{
					dataField: 'qtyperbox',
					headerText: t('lbl.QTYPERBOX') /*박스입수*/,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'posbqtyBox',
					headerText: t('lbl.BOX_ENG') /*BOX*/,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'posbqtyEa',
					headerText: t('lbl.EA_ENG') /*EA*/,
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.MOVEINFO') /*이동정보*/,
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.TOLOC_MV') /*이동로케이션*/,
					dataType: 'code',
				},
				{
					dataField: 'toOrderqtyBox',
					headerText: t('lbl.BOX_ENG') /*BOX*/,
					dataType: 'numeric',
				},
				{
					dataField: 'toOrderqtyEa',
					headerText: t('lbl.EA_ENG') /*EA*/,
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN') /*소비기한임박여부*/,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01') /*기준일(소비,제조)*/,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM') /*소비기간(잔여/전체)*/,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STOCK_INFO') /*재고정보*/,
			children: [
				{
					dataField: 'uom',
					headerText: t('lbl.UOM_ST') /*단위*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST') /*현재고수량*/,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST') /*재고할당수량*/,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST') /*피킹재고*/,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.이동가능수량') /*이동가능수량*/,
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO') /*이력번호*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE') /*바코드*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO') /*B/L번호*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.BUTCHERYDT') /*도축일자*/,
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME') /*도축장*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE') /*계약유형*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY') /*계약업체*/,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME') /*계약업체명*/,
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT') /*유효일자(FROM)*/,
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT') /*유효일자(TO)*/,
					dataType: 'date',
					editable: false,
				},
			],
		},
		{ headerText: t('lbl.LOT'), /*로트*/ dataField: 'fromLot', dataType: 'code', editable: false },
		{ headerText: t('lbl.STOCKID'), /*개체식별/소비이력*/ dataField: 'fromStockid', dataType: 'code', editable: false },
		{ headerText: t('lbl.AREA'), /*작업구역*/ dataField: 'fromArea', dataType: 'code', editable: false },
	];

	// 그리드 Props
	const gridProps = {
		editable: true, // 편집 가능 여부
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		rowIdField: 'uid',
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'posbqtyBox',
			positionField: 'posbqtyBox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'posbqtyEa',
			positionField: 'posbqtyEa',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'toOrderqtyBox',
			positionField: 'toOrderqtyBox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'toOrderqtyEa',
			positionField: 'toOrderqtyEa',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: onClickBatch,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;

		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(2/2)
		const newRows = props.data.map((row: any, idx: any) => ({
			...row,
			uid: `ua-${idx + 1}`,
		}));

		gridRefCur1?.setGridData(newRows);
		gridRefCur1?.setSelectionByIndex(0, 0);

		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = gridRefCur1.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRefCur1.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField != 'toLoc' && event.dataField != 'toOrderqtyBox' && event.dataField != 'toOrderqtyEa') {
				return false;
			}
		});

		// 이벤트. 체크박스 클릭 시만 발생
		ref.gridRef.current?.bind('rowCheckClick', function (event: any) {
			const { rowIndex, dataField, oldValue, newValue, item } = event;

			const gridRef = ref.gridRef.current;
			if (event.checked) {
				gridRef.setCellValue(rowIndex, 'toOrderqtyBox', String(item.posbqtyBox ?? ''));
				gridRef.setCellValue(rowIndex, 'toOrderqtyEa', String(item.posbqtyEa ?? ''));
			}
		});

		// 이벤트.전체 체크박스 클릭 이벤트 바인딩
		ref.gridRef.current?.bind('rowAllCheckClick', function (checked: any) {
			const gridRef = ref.gridRef.current;
			const rows = gridRef.getGridData();

			if (checked) {
				// 전체 체크 + 값 세팅
				const newRows = rows.map((row: any) => ({
					...row,
					toOrderqtyBox: row.posbqtyBox ?? 0,
					toOrderqtyEa: row.posbqtyEa ?? 0,
				}));
				gridRef.setGridData(newRows);
				gridRef.setAllCheckedRows(true);
			} else {
				// 전체 해제 + 값 초기화
				const newRows = rows.map((row: any) => ({
					...row,
					toLoc: '',
					toOrderqtyBox: 0,
					toOrderqtyEa: 0,
				}));
				gridRef.setGridData(newRows);
				gridRef.setAllCheckedRows(false);
			}
		});

		// 이벤트.에디팅 종료 이벤트
		ref.gridRef.current?.bind('cellEditEnd', function (event: any) {
			const { item, rowIndex } = event;
			const nBox = Number(item.toOrderqtyBox ?? 0);
			const nEa = Number(item.toOrderqtyEa ?? 0);
			const strLoc = item.toLoc ?? '';

			if (nBox > 0 || nEa > 0 || strLoc.trim() !== '') {
				// nothing
			} else {
				// 셀 클릭으로 row의 checkbox (un)check
				const isChecked = ref.gridRef.current.isCheckedRowById(event.rowIdValue);
				if (isChecked) {
					ref.gridRef.current.addUncheckedRowsByIds(event.rowIdValue);
				} else {
					ref.gridRef.current.addCheckedRowsByIds(event.rowIdValue);
				}
			}
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Form form={props.form} className="h100">
				<AGrid>
					<GridTopBtn gridBtn={gridBtn} gridTitle="자동창고보충목록" totalCnt={props.totalCnt}>
						<Form layout="inline" className="h100">
							<InputText
								name="movelocation"
								onChange={handleChange}
								label={t('lbl.TOLOC_MV')} //이동로케이션
								placeholder={t('msg.placeholder1', [t('lbl.TOLOC_MV')])}
								className="bg-white"
							/>
							<Button style={{ marginRight: 8 }} onClick={() => handleSelectApply('1')}>
								선택적용
							</Button>
							<Button onClick={() => handleSelectApply('2')}>고정로케이션적용</Button>
						</Form>
					</GridTopBtn>
					<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</AGrid>
			</Form>
		</>
	);
});

export default StLocMoveAsrsTap1Detail;
