// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// Type

// apiPostSaveMasterList

const OmOrderCreationSTOTab1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const initialDataRef = useRef<any[]>([]); // 초기 데이터 저장

	/**
	 * durationStatus에 따른 배경색 스타일 함수
	 * @param {number} rowIndex - 행 인덱스
	 * @param {number} columnIndex - 열 인덱스
	 * @param {any} value - 셀 값
	 * @param {any} headerText - 헤더 텍스트
	 * @param {any} item - 행 데이터
	 * @param {any} dataField - 데이터 필드
	 * @returns {object} 스타일 객체
	 */
	const getDurationStatusStyle = (
		rowIndex: number,
		columnIndex: number,
		value: any,
		headerText: any,
		item: any,
		dataField: any,
	) => {
		const durationStatus = item?.durationStatus?.toString();
		const lottable01 = item?.lottable01?.toString();
		const neardurationyn = item?.neardurationyn;

		// neardurationyn이 null이면 가장 먼저 체크하여 스타일 미적용 (다른 로직 타지 않음)
		if (neardurationyn === null || neardurationyn === undefined || neardurationyn === '') {
			return '';
		}
		// durationSatatus가 STD거나 null이면 스타일 미적용
		if (!lottable01 || lottable01 === 'STD') {
			return '';
		}

		switch (durationStatus) {
			case '1':
				return '';
			case '2':
				return 'gc-user42'; // 연한 초록색
			case '3':
				return 'gc-user27'; // 연한 파랑색
			case '4':
				return 'gc-user57'; // 연한 빨강색
			case 'E':
				return 'gc-user58'; // 연한 회색
			default:
				return '';
		}
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			headerText: t('lbl.DCCODE'),
			dataField: 'dccode',
			dataType: 'code',
			editable: false,
		},
		{
			// 창고
			headerText: t('lbl.ORGANIZE'),
			dataField: 'organize',
			dataType: 'code',
			editable: false,
		},
		{
			// 재고위치
			headerText: t('lbl.STOCKTYPE'),
			children: [
				{
					// 코드
					headerText: t('lbl.CODE'),
					dataField: 'stocktype',
					dataType: 'code',
					editable: false,
				},
				{
					// 명칭
					headerText: t('lbl.DESCR'),
					dataField: 'stocktype',
					dataType: 'code',
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return getCommonCodebyCd('STOCKTYPE', value)?.cdNm;
					},
					editable: false,
				},
			],
		},
		{
			// 재고속성
			headerText: t('lbl.STOCKGRADE'),
			children: [
				{
					// 코드
					headerText: t('lbl.CODE'),
					dataField: 'stockgrade',
					dataType: 'code',
					editable: false,
				},
				{
					// 명칭
					headerText: t('lbl.DESCR'),
					dataField: 'stockgrade',
					dataType: 'code',
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return getCommonCodebyCd('STOCKGRADE', value)?.cdNm;
					},
					editable: false,
				},
			],
		},
		{
			// 로케이션
			headerText: t('lbl.LOC'),
			dataField: 'loc',
			dataType: 'default',
			editable: false,
		},
		{
			// 상품코드
			headerText: t('lbl.SKUCD'),
			dataField: 'sku',
			dataType: 'code',
			editable: false,
		},
		{
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuName',
			dataType: 'default',
			editable: false,
		},
		{
			// 저장조건
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			dataType: 'code',
			editable: false,
		},
		{
			// 재고정보
			headerText: t('lbl.STOCK_INFO'),
			children: [
				{
					// 단위
					headerText: t('lbl.UOM'),
					dataField: 'uom',
					dataType: 'code',
					editable: false,
				},
				{
					// 현재고수량
					headerText: t('lbl.QTY_ST'),
					dataField: 'qty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					// 재고할당수량
					headerText: t('lbl.QTYALLOCATED_ST'),
					dataField: 'qtyallocated',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					// 피킹재고
					headerText: t('lbl.QTYPICKED_ST'),
					dataField: 'qtypicked',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					// 이동가능수량
					headerText: t('lbl.MOVE_POSSIBLE_QTY'),
					dataField: 'posbqty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			// 이동정보
			headerText: t('lbl.MOVE_INFO'),
			children: [
				// {
				// 	// 이동수량
				// 	// 해당 row의 serialyn이 Y면 disabled 처리(수량 입력 불가)
				// 	headerText: t('lbl.MOVE_QTY'),
				// 	dataField: 'toOrderqty',
				// 	dataType: 'numeric',
				// 	formatString: '#,##0.###',
				// 	editRenderer: {
				// 		type: 'InputEditRenderer',
				// 		showEditorBtnOver: false,
				// 		onlyNumeric: false,
				// 		allowPoint: true,
				// 		allowNegative: false,
				// 	},
				// 	editable: true,
				// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// 		// 비정량 상품일경우 수정 불가 (serialyn=y, line01이 Y면서, line02가 있어야 함)
				// 		if (item?.serialyn === 'Y' && item?.line01 === 'Y' && item?.line02 !== '') {
				// 			// 편집 가능 class 삭제
				// 			props.gridRef.current.removeEditClass(columnIndex);
				// 		} else {
				// 			// 편집 가능 class 추가
				// 			return 'isEdit';
				// 		}
				// 	},
				// },

				{
					dataField: 'toOrderqty',
					headerText: t('lbl.MOVE_QTY'), // 이동수량
					dataType: 'numeric',
					formatString: '#,###.###',
					editable: true,
					editRenderer: {
						type: 'ConditionRenderer',
						conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
							if (item.uom === 'KG') {
								return {
									type: 'InputEditRenderer',
									onlyNumeric: true,
									allowPoint: true,
									allowNegative: true,
								};
							}
							return {
								type: 'InputEditRenderer',
								onlyNumeric: true,
								allowPoint: false,
								allowNegative: true,
							};
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						// 비정량 상품일경우 수정 불가 (serialyn=y, line01이 Y면서, line02가 있어야 함)
						if (item?.serialyn === 'Y' && item?.line01 === 'Y' && item?.line02 !== '') {
							// 편집 가능 class 삭제
							props.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},

				{
					/**
					 * 이동BOX수량
					 */
					headerText: '이동BOX수량',
					dataField: 'qtyperbox',
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
						// MS_SKU.QTYPERBOX의 값이 0일경우엔 그리드 컬럼에 1로 표기
						if (value === 0) {
							return 1;
						}

						// 이동수량(toOrderqty)을 입력 시 이동수량/qtyperbox 값으로 자동 변환
						const toOrderqty = Number(item?.toOrderqty) || 0;
						if (toOrderqty > 0 && value > 0) {
							return Math.floor(toOrderqty / Number(value));
						}

						// 이동수량이 0이거나 없으면 원래 qtyperbox 값 반환
						return value;
					},
				},
			],
		},
		{
			// 소비기한임박여부
			headerText: t('lbl.WONEARDURATIONYN'),
			dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			styleFunction: getDurationStatusStyle,
		},
		{
			// 기준일(유통,제조)
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			dataField: 'lottable01',
			dataType: 'code',
			editable: false,
			styleFunction: getDurationStatusStyle,
		},
		{
			// 유통기간(잔여/전체)
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			styleFunction: getDurationStatusStyle,
		},

		{
			// 상품이력정보
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 이력번호
					headerText: t('lbl.SERIALNO_SKU'),
					dataField: 'serialno',
					editable: false,
				},
				{
					// 바코드
					headerText: t('lbl.BARCODE'),
					dataField: 'barcode',
					editable: false,
				},
				{
					// B/L 번호
					headerText: t('lbl.BLNO'),
					dataField: 'convserialno',
					editable: false,
				},
				{
					// 도축일자
					headerText: t('lbl.CONVDT'),
					dataField: 'butcherydt',
					editable: false,
				},
				{
					// 도축장
					headerText: t('lbl.FACTORYNAME'),
					dataField: 'factoryname',
					editable: false,
				},
				{
					// 계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataField: 'contracttype',
					editable: false,
				},
				{
					// 계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataField: 'contractcompany',
					editable: false,
				},
				{
					// 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataField: 'contractcompanyname',
					editable: false,
				},
				{
					// 유효일자(FROM)
					headerText: t('lbl.FROMVALIDDT'),
					dataField: 'fromvaliddt',
					editable: false,
				},
				{
					// 유효일자(TO)
					headerText: t('lbl.TOVALIDDT'),
					dataField: 'tovaliddt',
					editable: false,
				},

				{
					// 라인 01
					dataField: 'line01',
					editable: false,
					visible: false,
				},
				{
					// 라인 02
					dataField: 'line02',
					editable: false,
					visible: false,
				},
			],
		},
		{
			// 로트
			headerText: t('lbl.LOT'),
			dataField: 'lot',
			dataType: 'code',
			editable: false,
		},
		{
			// 개체식별/유통이력
			headerText: t('lbl.STOCKID'),
			dataField: 'stockid',
			dataType: 'code',
			editable: false,
		},
		{
			// 작업구역
			headerText: t('lbl.AREA'),
			dataField: 'area',
			dataType: 'code',
			editable: false,
		},
	];

	const footerLayout1 = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'dccode',
		},
		{
			dataField: 'qty', // 현재고수량
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'qtyallocated', // 재고할당수량
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},
		{
			dataField: 'qtypicked', // 피킹재고
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},
		{
			dataField: 'posbqty', // 이동가능수량
			positionField: 'posbqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'serialyn',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,

		showFooter: true,
		footerLayout: footerLayout1,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		independentAllCheckBox: false,
		// customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.posbqty <= 0) {
				return false;
			}
			return true;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장 함수
	 */
	const saveMasterList = () => {
		if (props.onSave) {
			props.onSave();
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 */
		const gridRef = props.gridRef;

		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 체크박스 변경 이벤트
		 * 체크하면 이동가능수량(posbqty)을 이동수량(toOrderqty)에 자동 설정
		 */
		gridRef?.current.bind('rowCheckClick', (event: any) => {
			const rowIndex = event.rowIndex;
			const checked = event.checked;
			const item = gridRef?.current.getItemByRowIndex(rowIndex);

			if (checked && item) {
				if (item.posbqty > 0) {
					// 체크 시: 이동가능수량을 이동수량에 설정
					const posbqty = item.posbqty || 0;
					gridRef?.current.setCellValue(rowIndex, 'toOrderqty', posbqty);
				}
			}
			// else if (!checked && item) {
			// 	// 체크 해제 시: 이동수량을 0으로 설정
			// 	gridRef?.current.setCellValue(rowIndex, 'toOrderqty', 0);
			// }
		});

		gridRef?.current.bind('rowAllCheckClick', (event: any) => {
			if (event) {
				const checkedItems = gridRef.current.getCheckedRowItems();
				const items = [];
				const rowIndexes = [];
				for (const item of checkedItems) {
					rowIndexes.push(item.rowIndex);
					items.push({ toOrderqty: item.item.posbqty || 0 });
				}
				gridRef.current.updateRows(items, rowIndexes);
			} else {
				// 전체 언체크 시 초기 데이터 다시 로드
				const initialData = initialDataRef.current;
				gridRef?.current.setGridData(initialData);
				gridRef?.current.setSelectionByIndex(0, 0);

				if (initialData.length > 0) {
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
			}
		});

		/**
		 * 셀 편집 시작 이벤트
		 * serialyn이 Y인 행은 이동수량 편집 불가
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// toOrderqty 컬럼에서 serialyn이 Y면 편집 불가
			if (
				event.dataField === 'toOrderqty' &&
				event.item.serialyn === 'Y' &&
				event.item.line01 === 'Y' &&
				event.item.line02 !== ''
			) {
				showMessage({
					content: '관리대상[비정량] 상품은 일부출고 불가. 해당 라인 전체 출고만 가능합니다.',
					modalType: 'info',
				});
				return false;
			}
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
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
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();

		props.gridRef.current?.resize('100%', '100%');
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefToUse = ref || props.gridRef;
		const gridRefCur = gridRefToUse.current;
		if (gridRefCur) {
			// 초기 데이터 저장
			initialDataRef.current = props.data;

			props.data.forEach((dataItem: any, index: number) => {
				// 이동가능수량 음수이면 0으로 설정
				if (dataItem.posbqty < 0) {
					dataItem.posbqty = 0;
				}
			});
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data, ref, props.gridRef]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout1} />
			</GridAutoHeight>
		</>
	);
});

export default OmOrderCreationSTOTab1;
