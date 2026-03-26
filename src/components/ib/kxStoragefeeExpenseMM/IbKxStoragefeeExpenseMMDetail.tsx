// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import IbExpenseElecTaxPopup from '@/components/ib/expense/IbExpenseElecTaxPopup';
import { GridBtnPropsType } from '@/types/common';

// Store

// API Call Function

const IbKxStoragefeeExpenseMMDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});
	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);
	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});
	// 선택한 row state
	const [selectedRow, setSelectedRow] = useState<any>(null);
	// 세금계산서 팝업용 Ref
	const refElecTaxModal = useRef(null);

	const colorFunc = (_rowIndex: number, _columnIndex: number, _value: any, _headerText: string, item: any) => {
		const status = (item?.status ?? '').toString();
		if (_columnIndex === 9) {
			return {
				backgroundColor: status === 'POE' ? '#ffc107' : null, // bg-warning 색상 (#ffc107)
				color: '#0dcaf0', // color-info 색상 (#0dcaf0)
			};
		}
		return {
			backgroundColor: status === 'POE' ? '#ffc107' : null, // bg-warning 색상 (#ffc107)
			color: item.customRowCheckYn === 'Y' ? '#0dcaf0' : null, // color-info 색상 (#0dcaf0)
		};
	};
	// 그리드 초기화
	const gridCol = [
		{
			headerText: 'status',
			dataField: 'status',
			visible: false,
		},
		{
			dataField: 'zmonth',
			headerText: t('lbl.CLOSEMONTH'),
			dataType: 'code',
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			headerText: 'MM전송번호',
			dataField: 'zinvoice',
			dataType: 'string',
		},
		{
			headerText: '세금계산서번호',
			dataField: 'issueId',
			dataType: 'string',
			commRenderer: {
				// type: 'popup',
				type: 'search',
				onClick: function (e: any) {
					openPopup(e);
				},
			},
		},
		{
			headerText: 'MM송장번호',
			dataField: 'invNo',
			dataType: 'string',
			styleFunction: colorFunc,
		},
		{
			headerText: 'Slip No',
			dataField: 'slipNo',
			dataType: 'string',
			styleFunction: colorFunc,
		},
		{
			headerText: '상태',
			dataField: 'status2',
			dataType: 'code',
		},
		{
			headerText: 'IF Status',
			dataField: 'ifStatus',
			dataType: 'code',
			styleFunction: colorFunc,
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'zwrBtrIn',
			headerText: '송장금액',
			dataType: 'numeric',
		},
		{
			headerText: '부가세',
			dataField: 'wmwst1',
			dataType: 'numeric',
		},
		{
			headerText: 'Supplier Code',
			dataField: 'adjustmentSupplierCode',
			dataType: 'code',
		},
		{
			headerText: 'Supplier Name',
			dataField: 'adjustmentSupplierName',
			dataType: 'code',
		},
		{
			headerText: 'Summary',
			dataField: 'btext',
			dataType: 'code',
		},
		{
			headerText: '최종변경자',
			dataField: 'editWhoNm',
			managerDataField: 'editWho',
			dataType: 'manager',
		},
		{
			dataField: 'editWho',
			visible: false,
		},
	];

	// 그리드 속성 showCustomRowCheckColumn: true,
	const gridProps = {
		editable: false,
		showCustomRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: false,
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
		// gridRef?.current.bind('ready', (event: any) => {
		// 	// 그리드가 준비되면 첫 번째 행을 선택한다.
		// 	gridRef?.current.setSelectionByIndex(0);
		// });
		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		// gridRef?.current.bind('cellEditEnd', (event: any) => {
		// 	// 편집이 완료된 후, 해당 행을 수정 상태로 변경한다.
		// 	if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
		// 		gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		// 	}
		// });
		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		// gridRef?.current.bind('cellEditBegin', (event: any) => {
		// 	// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
		// 	if (event.dataField === 'dcCode' || event.dataField === 'inoutDt') {
		// 		// 신규 행이 아니라면
		// 		if (event.item.rowStatus !== 'I') {
		// 			// false를 반환하여 편집 모드 진입을 막는다.
		// 			return false;
		// 		}
		// 	}
		// 	return true;
		// });
	};
	/**
	 * 팝업을 열어 문서 정보를 표시한다.
	 * @param {any} item 그리드 행
	 * @param {string} type 팝업 타입
	 */
	const openPopup = (item: any) => {
		setSelectedRow(item); // 선택한 row를 state로 저장
		refElecTaxModal.current?.handlerOpen();
	};
	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.success > 0) {
				props.callBackFn?.();
			}
		}
	};

	/**
	 * 확정
	 */
	const confirmMasterList = () => {
		// 전체 체크 항목
		const checkedItems = gridRef.current.getCheckedRowItemsAll();
		if (checkedItems && checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		//로컬구매 이력정보는 확정 대상 제외 체크
		for (const item of checkedItems) {
			if (item.status != 'WAT' && item.status != 'ENT') {
				showMessage({
					content: '대기 또는 Entered 상태인 항목만 보관료 확정 처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
			if (item.issueId === '' || item.issueId == null) {
				showMessage({
					content: '세금계산서 매핑 후 보관료 확정 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
		}
		// API 실행
		showConfirm(null, '보관료 확정 처리 하시겠습니까? 확정 후 송장금액 변경은 불가합니다.', () => {
			// 	// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/kxStoragefeeExpenseMM/v1.0/saveConfirm',
				avc_DCCODE: '1000',
				avc_COMMAND: 'EXPENSE_CONFIRM',
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 확정취소
	 */
	const cancelConfirmMasterList = () => {
		// 전체 체크 항목
		const checkedItems = gridRef.current.getCheckedRowItemsAll();
		if (checkedItems && checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		//로컬구매 이력정보는 확정 대상 제외 체크
		for (const item of checkedItems) {
			if (item.status != 'CFM') {
				showMessage({
					content: 'Confirm 상태인 항목만 보관료 확정 취소 처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
			if (item.issueId === '' || item.issueId == null) {
				showMessage({
					content: '세금계산서 매핑 후 보관료 확정 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
		}
		// API 실행
		showConfirm(null, '보관료 확정 처리 하시겠습니까? 확정 후 송장금액 변경은 불가합니다.', () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/kxStoragefeeExpenseMM/v1.0/saveConfirmCancel',
				avc_DCCODE: '1000',
				avc_COMMAND: 'EXPENSE_CONFIRM_CANCEL',
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};
	/**
	 * 보관료마감
	 */
	const postingMasterList = () => {
		// 전체 체크 항목
		const checkedItems = gridRef.current.getCheckedRowItemsAll();
		if (checkedItems && checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}
		// 확정 상태만 가능
		for (const item of checkedItems) {
			if (item.status != 'CFM') {
				showMessage({
					content: '확정 상태인(Confirm) 항목만 Posting 처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
		}
		// API 실행
		showConfirm(null, '보관료 마감 처리 하시겠습니까? 마감 후 송장 변경은 불가합니다.', () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/kxStoragefeeExpenseMM/v1.0/savePosting',
				saveDataList: checkedItems,
			};
			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};
	/**
	 * 보관료마감취소
	 */
	const cancelPostingMasterList = () => {
		// 전체 체크 항목
		const checkedItems = gridRef.current.getCheckedRowItemsAll();
		if (checkedItems && checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}
		// API 실행
		showConfirm(null, '보관료 마감 취소 처리 하시겠습니까?', () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/kxStoragefeeExpenseMM/v1.0/savePostingCancel',
				saveDataList: checkedItems,
			};
			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				callBackFn: confirmMasterList,
			},
			{
				btnType: 'btn2', // 사용자 정의버튼1
				callBackFn: cancelConfirmMasterList,
			},
			{
				btnType: 'btn3', // 사용자 정의버튼1
				callBackFn: postingMasterList,
			},
			{
				btnType: 'btn4', // 사용자 정의버튼1
				callBackFn: cancelPostingMasterList,
			},
		],
	};
	/**
	 * 세금계산서 팝업 처리 후 콜백
	 * @param param
	 */
	const callBackElecTaxPopup = (param: any) => {
		if (param) {
			gridRef.current.setCellValue(selectedRow?.rowIndex, 'issueId', param.issueId ?? '');
		}
	};
	/**
	 * 세금계산서 팝업 닫기
	 */
	const closeEventElecTaxPopup = () => {
		refElecTaxModal.current.handlerClose();
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
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 세금계산서 팝업 영역 정의 */}
			<CustomModal ref={refElecTaxModal} width="1000px">
				<IbExpenseElecTaxPopup
					callBack={callBackElecTaxPopup}
					close={closeEventElecTaxPopup}
					serialkey={selectedRow?.item.serialKey}
					adjustmentSupplierCode={selectedRow?.item.adjustmentSupplierCode}
					adjustmentSupplierName={selectedRow?.item.adjustmentSupplierName}
					// cbRegisno={selectedRow?.item.issueId}
					cbRegisno=""
				/>
			</CustomModal>
			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>
		</>
	);
});

export default IbKxStoragefeeExpenseMMDetail;
