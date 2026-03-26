// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API
import {
	apiPostDeleteMasterSTO,
	apiPostReorderMasterOutSTO,
	apiPostReorderMasterPO,
	apiPostReorderMasterSTO,
} from '@/api/om/apiOmPurchaseModify';

const OmPurchaseModifyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const modalRef = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	const userDccodeList = getUserDccodeList('') ?? [];
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'slipDt',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
			cellMerge: true,
			mergeRef: 'requestNo',
			mergePolicy: 'restrict',
			editable: false,
		},
		{
			dataField: 'requestNo',
			headerText: t('lbl.REQUESTNO'),
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'requestNo',
			mergePolicy: 'restrict',
			editable: false,
		},
		{
			dataField: 'requestLine',
			headerText: '요청번호라인',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poKey',
			headerText: t('lbl.POKEY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poLine',
			headerText: t('lbl.POLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docNo',
			headerText: t('lbl.SLIPNO_DP'),
			dataType: 'code',
			visible: false,
			cellMerge: true,
			mergeRef: 'docNo',
			mergePolicy: 'restrict',
			editable: false,
		},
		{
			dataField: 'slipLine',
			headerText: t('lbl.SLIPLINE_DP'),
			dataType: 'code',
			visible: false,
			editable: false,
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DP_CENTER'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcName',
			headerText: '입고센터명',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '공급업체',
			children: [
				{
					dataField: 'custKey',
					headerText: t('lbl.PARTNER_CD'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'custName',
					headerText: t('lbl.PARTNER_NAME'),
					dataType: 'string',
					editable: false,
				},
				{
					dataField: 'fromDcCode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
					visible: false,
					editable: false,
				},
				{
					dataField: 'fromDcName',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
					visible: false,
					editable: false,
				},
				{
					dataField: 'fromOrganize',
					headerText: t('lbl.ORGANIZE'),
					dataType: 'code',
					visible: false,
					editable: false,
				},
				{
					dataField: 'fromOrganizeName',
					headerText: t('lbl.ORGANIZENAME'),
					dataType: 'code',
					visible: false,
					editable: false,
				},
			],
		},
		{
			dataField: 'purchaseType',
			headerText: t('lbl.PURCHASETYPE_PO'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PURCHASETYPE_PO', value)?.cdNm;
			},
		},
		{
			dataField: 'deliveryType',
			headerText: t('lbl.DELIVERYTYPE_PO'),
			dataType: 'code',
			editable: false,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('DIRECTTYPE', value)?.cdNm;
			// },
		},
		{
			dataField: 'slipNo',
			headerText: '입고전표',
			dataType: 'code',
			visible: false,
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.gridRef.current.openPopup(params, 'sku');
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
			dataField: 'purchaseUom',
			headerText: '발주단위',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('UOM', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: false,
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'purchaseQty',
			headerText: '재발주수량(BOX)',
			dataType: 'numeric',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isEmpty(item)) {
					return 'default';
				}
				if (item.delProcYn === 'N' || item.delYn === 'Y') {
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
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('UOM', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: false,
		},
		{
			dataField: 'modSlipDt',
			headerText: '변경입고일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isEmpty(item)) {
					return 'default';
				}
				if (item.delProcYn === 'N' || item.delYn === 'Y') {
					return 'disabled';
				} else {
					return 'default';
				}
			},
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'Y') {
					return '삭제';
				} else {
					return '생성';
				}
			},
		},
		{
			dataField: 'delProcYn',
			headerText: '삭제가능여부',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '상품이력정보',
			children: [
				{
					dataField: 'serialNo',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcodeSn',
					headerText: '바코드',
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convSerialNo',
					headerText: t('lbl.CONVSERIALNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'butcheryDt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'factoryName',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'string',
					editable: false,
				},
				{
					dataField: 'contractType',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractCompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractCompanyName',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromValidDt',
					headerText: 'FROM',
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'toValidDt',
					headerText: 'TO',
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'serialOrderQty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'serialInspectQty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'serialScanWeight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		enableCellMerge: true,
		// rowCheckMergeField: 'docNo',
		rowStyleFunction: (rowIndex: any, item: any) => {
			if (item.delYn === 'Y') {
				return 'color-danger';
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.delYn === 'Y' || item.delProcYn === 'N') {
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
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		// 그리드 셀 편집 시작
		ref.gridRef?.current.bind('cellEditBegin', (event: any) => {
			if (event.item.delProcYn === 'N' || event.item.delYn === 'Y') {
				return false;
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'purchaseQty') {
				ref.gridRef.current.setCellValue(
					event.rowIndex,
					'purchaseCalQty',
					event.value * event.item.bunja * event.item.bunmo,
				);
			}

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (ref.gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				ref.gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		/**
		 * 그리드 셀 클릭 이벤트 조회 팝업 호출
		 * "등록(신규)" 행에서만 SKU 팝업 오픈 조건 추가
		 * (조회/수정/기존행)에는 실행하지 않음
		 * @param {any} event 이벤트
		 */

		ref.gridRef?.current.bind('cellClick', (event: any) => {
			if (event.dataField !== 'sku') return;
			const rowStatus = event.item?.rowStatus;
			if (rowStatus !== 'I') return;
			modalRef.current.handlerOpen();
		});
	};

	// 삭제 실행
	const deletePurchaseModifyList = () => {
		const delList = ref.gridRef.current.getCheckedRowItemsAll();
		if (delList.length < 1) {
			return;
		}

		// loopTransaction(delList, 0, delList.length);

		if (props.purchaseType === 'PO') {
			loopTransaction(delList, 0, delList.length);
		} else if (props.purchaseType === 'STO') {
			const saveParams = {
				saveList: delList,
			};
			showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
				apiPostDeleteMasterSTO(saveParams).then(res => {
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_006'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn();
							},
						});
					}
				});
			});
		}
	};

	//재발주 실행
	const reorderPurchaseModifyList = () => {
		const reorderList = ref.gridRef.current.getCheckedRowItemsAll();
		if (reorderList.length < 1) {
			return;
		}

		let validateOrderQty = true;

		for (const item of reorderList) {
			item.orderQty = item.purchaseQty;
		}

		//reorderList 에서 fromDcCode가 2170(외부창고)와 다른 fromDcCode가 섞여 있으면 안됨
		let has2170 = false;
		let hasOther = false;

		for (const item of reorderList) {
			if (item.fromDcCode === '2170') {
				has2170 = true;
			} else {
				hasOther = true;
			}

			if (item.orderQty === undefined || item.orderQty <= 0) {
				showMessage({
					content: '재발주 수량은 0보다 커야됩니다.',
					modalType: 'warning',
				});

				validateOrderQty = false;
				break;
			}

			if (commUtil.isEmpty(item.modSlipDt)) {
				showMessage({
					content: '변경입고일자는 필수 값 입니다.',
					modalType: 'warning',
				});

				validateOrderQty = false;
				break;
			}

			if (commUtil.isEmpty(item.modSlipDt)) {
				item.modSlipDt = dayjs().format('YYYYMMDD');
			}

			if (item.purchaseUom === 'EA' && item.bunja * item.bunmo > 1) {
				item.purchaseUom = 'BOX';
			}
		}

		if (has2170 && hasOther) {
			showMessage({
				content: '외부창고 발주와 일반STO 발주는 함께 재발주할 수 없습니다.',
				modalType: 'warning',
			});
		}

		if (!validateOrderQty) {
			return;
		}

		const params = {
			...reorderList,
			saveList: reorderList,
		};

		if (props.purchaseType === 'PO' && validateOrderQty) {
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				apiPostReorderMasterPO(params).then(res => {
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn();
							},
						});
					}
				});
			});
		} else if (props.purchaseType === 'STO') {
			if (reorderList[0].fromDcCode === '2170') {
				reorderList.forEach((item: any) => {
					item.receiveDt = item.modSlipDt;
					item.orderQty = item.purchaseQty;
					item.outOrganize = item.fromOrganize;
					item.stockid = item.barcodeSn;
				});

				const params = {
					...reorderList,
					saveList: reorderList,
				};

				//외부창고인경우
				showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
					apiPostReorderMasterOutSTO(params).then(res => {
						if (res.statusCode > -1) {
							showMessage({
								content: t('msg.MSG_COM_SUC_003'),
								modalType: 'info',
								onOk: () => {
									props.callBackFn();
								},
							});
						}
					});
				});
			} else {
				showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
					apiPostReorderMasterSTO(params).then(res => {
						if (res.statusCode > -1) {
							showMessage({
								content: t('msg.MSG_COM_SUC_003'),
								modalType: 'info',
								onOk: () => {
									props.callBackFn();
								},
							});
						}
					});
				});
			}
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// 	callBackFn: deletePurchaseModifyList,
			// },
			{
				btnType: 'btn2', // 사용자 정의버튼1
				btnLabel: '삭제',
				authType: 'btn2',
				callBackFn: () => {
					deletePurchaseModifyList();
				},
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '재발주',
				authType: 'btn1',
				callBackFn: () => {
					reorderPurchaseModifyList();
				},
			},
		],
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		props.callBackFn();
		refTranModal.current.handlerClose();
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 */
	const loopTransaction = (rowItems: any, index: number, total: number) => {
		let apiUrl = '/api/om/purchaseModify/v1.0/deleteMasterPO';
		if (props.purchaseType === 'STO') {
			apiUrl = '/api/om/purchaseModify/v1.0/deleteMasterSTO';
		}

		// loop transaction
		const saveParams = {
			apiUrl: apiUrl,
			saveDataList: rowItems,
		};

		setLoopTrParams(saveParams);
		refTranModal.current.handlerOpen();
	};

	const confirmPopup = (selectedRow: any) => {
		ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
		ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'skuName', selectedRow[0].name);

		modalRef.current.handlerClose();
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
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
	});

	// grid data 변경 감지
	useEffect(() => {
		if (props.data.length < 1) {
			return;
		}

		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRefCur.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRefCur.setColumnSizeList(colSizeList);
	}, [props.data]);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (!gridRefCur) {
			return;
		}

		setTimeout(() => {
			gridRefCur?.resize?.('100%', '100%');
		}, 0);
	}, [props.purchaseType]);

	const aGridStyle = props.purchaseType === 'STO' ? { height: 'calc(100% - 30px)' } : { height: '100%' };

	return (
		<>
			<AGrid className="contain-wrap" style={aGridStyle}>
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
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
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={'sku'} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default OmPurchaseModifyDetail;
