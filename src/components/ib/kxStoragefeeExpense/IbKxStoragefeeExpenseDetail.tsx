// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useSelector } from 'react-redux';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostCancelKxStorageExpense, apiPostSaveKxStorageExpense } from '@/api/ib/apiIbKxStoragefeeExpense';

const IbKxStoragefeeExpenseDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'zmonth',
			headerText: '마감월',
			dataType: 'code',
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.description; // skuDescr 필드에 description 값을 설정
					gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
		},
		{
			dataField: 'zcat',
			headerText: t('lbl.ZCAT'),
			visible: false,
		},
		// {
		// 	dataField: 'zcat2',
		// 	headerText: '구분',
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'zinvoice',
			headerText: '참조번호',
			dataType: 'code',
		},
		{
			dataField: 'status2',
			headerText: '상태',
			dataType: 'code',
		},
		{
			dataField: 'ifStatus',
			headerText: '비용기표상태',
			dataType: 'code',
		},
		{
			dataField: 'qty',
			headerText: '수량',
			dataType: 'numeric',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'zwrBtrOut',
			headerText: '기정산금액',
			dataType: 'numeric',
		},
		{
			dataField: 'zwrBtrIn',
			headerText: '보관료금액',
			dataType: 'numeric',
		},
		// {
		// 	dataField: 'qty',
		// 	headerText: t('lbl.QTY'),
		// 	dataType: 'numeric',
		// },
		// {
		// 	dataField: 'qtyPerBox',
		// 	headerText: t('lbl.QTYPERBOX'),
		// 	dataType: 'numeric',
		// },
		// {
		// 	dataField: 'boxPerPlt',
		// 	headerText: t('lbl.BOXPERPLT'),
		// 	dataType: 'numeric',
		// },
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			dataField: 'expenseStatus',
			visible: false,
		},
		{
			dataField: 'serialKey',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 수정 상태로 변경한다.
			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'dcCode' || event.dataField === 'inoutDt') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});
	};

	/**
	 * 계산 취소 저장
	 * @returns {void}
	 */
	const cancelKxStorageExpense = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_010'),
				modalType: 'info',
			});
			return;
		}

		for (const item of checkedItems) {
			if (item.expenseStatus !== 'ENT' && item.status === 'CAL') {
				showMessage({
					content: '비용기표가 등록 상태인 항목만 보관료 계산취소처리 가능합니다.',
					modalType: 'info',
				});
				return;
			}
		}

		const params = {
			saveList: checkedItems,
		};

		showConfirm(null, '보관료 계산 취소 처리 하시겠습니까?', () => {
			apiPostCancelKxStorageExpense(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: props.callBackFn,
					});
				}
			});
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveKxStorageExpense = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_010'),
				modalType: 'info',
			});
			return;
		}

		for (const item of checkedItems) {
			if (item.expenseStatus !== 'ENT' && item.status !== 'ENT') {
				showMessage({
					content: '등록 상태인 항목만 보관료 계산처리 가능합니다.',
					modalType: 'info',
				});
				return;
			}
		}

		const params = {
			saveList: checkedItems,
		};

		// 저장 실행
		showConfirm(null, '보관료 계산(송장발번) 처리 하시겠습니까?', () => {
			apiPostSaveKxStorageExpense(params).then(res => {
				gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: props.callBackFn,
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '보관료계산(송장발번)',
				callBackFn: saveKxStorageExpense,
			},
			{
				btnType: 'btn2', // 사용자 정의버튼1
				btnLabel: '계산취소',
				callBackFn: cancelKxStorageExpense,
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
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default IbKxStoragefeeExpenseDetail;
