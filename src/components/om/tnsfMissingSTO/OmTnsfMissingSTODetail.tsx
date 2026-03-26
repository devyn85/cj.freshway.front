/*
 ############################################################################
 # FiledataField	: OmTnsfMissingSTODetail.tsx
 # Description		: 주문 > 주문등록 > 누락분STO이체
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiGetMasterPrintList, apiPostConfirmMasterList, apiPostSaveMasterList } from '@/api/om/apiOmTnsfMissingSTO';

// util

// types
import OmUserSelectPopup from '@/components/om/tnsfMissingSTO/OmUserSelectPopup';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
interface OmTnsfMissingSTODetailProps {
	gridData?: any;
	search?: any;
	searchVal?: any;
	searchParams?: any;
	savePrintList?: any;
}

const OmTnsfMissingSTODetail = forwardRef((props: OmTnsfMissingSTODetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { gridData, search, searchVal, searchParams, savePrintList } = props;
	const [totalCnt, setTotalCnt] = useState(0);
	const { t } = useTranslation();
	gridRef.gridRef1 = useRef(null);
	const modalRef2 = useRef(null);
	const modalUserRef = useRef(null);
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	/**
	 * 사용자 권한에 따른 물류센터 코드 리스트
	 */
	const userDccodeList = getUserDccodeList();
	//Antd Form 사용

	const dcMap = useMemo(() => {
		// dccodeList lookup
		const map: any = {};
		userDccodeList.forEach(v => {
			map[v.dcname] = v;
		});
		return map;
	}, [userDccodeList]);
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	const checkEditClass = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		if (commUtil.isNotEmpty(item.serialKey)) {
			gridRef.current.removeEditClass(columnIndex);
			if (headerText === '상품코드' || headerText === '상품명') {
				return 'color-black';
			}
		} else {
			return 'isEdit';
		}
	};

	// 자동발주내역 그리드 초기화
	const gridCol = [
		{
			dataField: 'toDccode',
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			editable: false,
		},
		{
			dataField: 'toDcname',
			headerText: t('lbl.FROM_DCCODE') + '명', // 공급센터명
			editable: false,
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			editable: false,
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.TO_DCCODE') + '명', // 공급받는센터명
			commRenderer: {
				type: 'dropDown',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					const grid = gridRef?.current?.getAUIGrid?.() || gridRef?.current;

					if (item.dcname) {
						const found = userDccodeList.find(v => v.dccode === item.dcname);

						if (found) {
							setTimeout(() => {
								grid.setCellValue(rowIndex, 'dccode', found.dccode);
								grid.setCellValue(rowIndex, 'dcname', found.dcnameOnlyNm);
							}, 0);
						}
					}

					return !!item.serialKey;
				},
			},
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'), // 회차
			dataType: 'numeric',
			cellMerge: true,
			mergeRef: 'sku',
			mergePolicy: 'restrict',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item) return;
				if (item.missMoveRespYn === 'Y') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else if (item.openqty3 === '합계') {
					return 'gc-user40';
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editable: true,
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'sku_2',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						description: 'name',
						uom: 'baseuom',
						uomQty: 'qtyPerBox',
					},
				},
				onClick: (e: any) => {
					if (e.item.rowStatus === 'R' || e.item.rowStatus === 'U') {
						const params = {
							sku: e.item.sku,
							skuDescr: e.item.description,
						};
						gridRef.current.openPopup(params, 'sku'); // 상세 팝업.
					} else {
						modalRef2.current.handlerOpen(); // 신규 팝업
					}
				},
				openDirectly: true,
			},
			required: true,
			styleFunction: checkEditClass,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.SAVE_TYPE'), // 상품명
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'loc',
			headerText: t('공급센터로케이션'), // 공급센터로케이션
			editable: true,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_STO'), // 이체단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.REQUEST_QTY'), // 요청수량
			dataType: 'numeric',
			editable: true,
		},
		{
			dataField: 'missOrderqty',
			headerText: '누락분요청량',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'openqty',
			headerText: t('lbl.TO_STOCQTY'), // 수급센터현재고
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: '재고량',
			children: [
				{
					dataField: 'openqty1',
					headerText: '이천',
					editable: false,
					dataType: 'numeric',
				},
				{
					dataField: 'openqty2',
					headerText: '수원',
					editable: false,
					dataType: 'numeric',
				},
				{
					dataField: 'openqty3',
					headerText: '수원2',
					editable: false,
					dataType: 'numeric',
				},
				{
					dataField: 'openqty4',
					headerText: '동탄',
					editable: false,
					dataType: 'numeric',
				},
				{
					dataField: 'openqty5',
					headerText: '동탄2',
					editable: false,
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '발주량',
			children: [
				{
					dataField: 'orderDccode',
					headerText: t('lbl.DCCODE'), // 센터
					editRenderer: {
						type: 'ComboBoxRenderer',
						list: userDccodeList,
						keyField: 'dccode',
						valueField: 'dcname',
						autoCompleteMode: true,
						autoEasyMode: true,
						matchFromFirst: false,
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item) return;
						if (item.missMoveRespYn === 'Y') {
							// 편집 가능 class 삭제
							gridRef.current.removeEditClass(columnIndex);
						} else if (item.openqty3 === '합계') {
							return 'gc-user40';
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'supplyqty',
					headerText: '발주량',
					dataType: 'numeric',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item) return;
						if (item.missMoveRespYn === 'Y') {
							// 편집 가능 class 삭제
							gridRef.current.removeEditClass(columnIndex);
						} else if (item.openqty3 === '합계') {
							return 'gc-user40';
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
			],
		},
		{
			dataField: 'stoStatus',
			headerText: t('진행상태'), // 대응여부
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STO_STATUS', value)?.cdNm;
			},
		},
		{
			dataField: 'reqReasoncode',
			headerText: t('lbl.RSNNM'), // 사유명
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_SHORTAGE', '선택', ''),
			},
		},
		{
			dataField: 'respYn',
			headerText: t('lbl.RESPONSE_YN'), // 누락분이체대응여부
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN', ''),
			},
		},
		{
			dataField: 'missMoveRespYn',
			headerText: '공급센터 대응여부', // 공급센터 대응여부
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'Y') return 'Yes';
				if (value === 'N') return 'No';
				return value;
			},
		},
		{
			dataField: 'respId',
			headerText: '대응담당자ID(받는센터)',
			visible: false,
		},
		{
			dataField: 'respNm',
			headerText: '대응담당자(받는센터)',
			dataType: 'user',
			commRenderer: {
				type: 'search',
				popupType: 'user',
				searchDropdownProps: {
					dataFieldMap: {
						userId: 'respId',
						userNm: 'respNm',
					},
				},
				iconPosition: 'right',
				align: 'center',
				onClick: function (event: any) {
					setSelectedRowIndex(event.rowIndex);
					modalUserRef.current.handlerOpen();
				},
			},
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'), // 등록자
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), //등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'), // 수정자
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];
	// 자동발주내역 그리드 초기화
	const gridCol1 = [
		// {
		// 	dataField: 'toDccode',
		// 	headerText: t('lbl.FROM_DCCODE'), // 공급센터
		// 	editable: false,
		// },
		{
			dataField: 'dcname',
			headerText: t('lbl.FROM_DCCODE') + '명', // 공급센터명
			editable: false,
		},
		// {
		// 	dataField: 'dccode',
		// 	headerText: t('lbl.TO_DCCODE'), // 공급받는센터
		// 	editable: false,
		// },
		{
			dataField: 'toDcname',
			headerText: t('lbl.TO_DCCODE') + '명', // 공급받는센터명
			editable: false,
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'), // 회차
			cellMerge: true,
			mergeRef: 'sku',
			mergePolicy: 'restrict',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			// commRenderer: {
			// 	type: 'search',
			// 	onClick: function (e: any) {
			// 		if (e.text) {
			// 			// 기존 행
			// 			gridRef.current.openPopup(e.item, 'sku');
			// 		}
			// 	},
			// },
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.SAVE_TYPE'), // 상품명
			editable: false,
		},

		{
			dataField: 'uom',
			headerText: t('lbl.UOM_STO'), // 이체단위
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.REQUEST_QTY'), // 요청수량
			editable: false,
		},
		{
			dataField: 'missOrderqty',
			headerText: '누락분요청량',
			editable: false,
		},
	];
	// 자동발주내역 그리드 속성
	const gridProps = {
		editable: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,

		showStateColumn: false, // row 편집 여부
		// enableCellMerge: true, // 그리드 머지에 필요한 속성

		//showFooter: true,           // 불필요한 경우 삭제 해도 됨
		displayTreeOpen: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false, // 여백 윗줄 지우기.
		// 그룹핑 시 그룹핑 필드들이 첫 열로 옮겨지는 것을 막고
		// 원래 칼럼 레이아웃 순서를 유지할지 여부를 지정합니다.(기본값 : false);
		keepColumnOrderOnGrouping: true,
		enableMovingColumn: true,
		editableMergedCellsAll: true,
		// 그리드 ROW 스타일 함수 정의

		editableOnGroupFields: true,
	};
	// 자동발주내역 그리드 속성
	const gridProps1 = {
		editable: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인
		const params = gridRef.current.getChangedData({ validationYn: false });
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}
		const finalParams = params.map((row: any) => ({
			// search컴포넌트의 deliverydate
			...row,
			deliverydate: props.searchParams?.deliverydate,
		}));
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(finalParams).then((res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							search();
						},
					});
				}
			});
		});
	};

	/**
	 * 확정
	 * @returns {void}
	 */
	const confirmMasterList = () => {
		// 변경 데이터 확인
		const params = gridRef.current.getCustomCheckedRowItems();

		const isConfirm = params.some((item: any) => item.missMoveRespYn === 'Y');
		if (isConfirm || params.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}

		const updateLength = params.filter((item: any) => item.missMoveRespYn === 'N').length;
		const newLength = params.length - updateLength;
		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newLength}건
				수정 : ${updateLength}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostConfirmMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							search();
						},
					});
				}
			});
		});
	};
	// 그리드 엑셀 다운로드
	const downloadExcel = (colSizeList: any) => {
		// const result: any = {};
		// gridCol 배열을 순회하면서 dataField와 colsize를 매칭
		/*
		for (let i = 0; i < gridCol.length; i++) {
			const dataField = gridCol[i].dataField;
			const size = colSizeList[i];
			if (dataField) {
				result[dataField] = size;
			}
		}*/
		// collectColumnSizes(gridCol3, colSizeList, result);

		// //console.log('result', result);
		apiGetMasterPrintList(searchParams).then(res => {
			if (res.data) {
				// setGridData1(res.data);
				// setSearchParams(params);
				gridRef.gridRef1.current?.setGridData(res.data);
				const colSizeList = gridRef.gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.gridRef1.current.setColumnSizeList(colSizeList);
				const params = {
					fileName: '물류센터간 C/D 누락분 요청(공급받는센터)',
					//columnSizeOfDataField: result,
					exportWithStyle: true, // 스타일 적용 여부
					progressBar: true,
					// exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
				};

				gridRef.gridRef1.current?.exportToXlsxGrid(params);
			}
		});
		// 구해진 칼럼 사이즈를 적용 시킴.
		// gridRef.gridRef1.current.setColumnSizeList(colSizeList);
		// const params = {
		// 	fileName: '이력상품입고현황',
		// 	//columnSizeOfDataField: result,
		// 	exportWithStyle: true, // 스타일 적용 여부
		// 	progressBar: true,
		// 	exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
		// };

		// gridRef.gridRef1.current?.exportToXlsxGrid(params);
	};

	/**
	 * 구성상품코드 팝업 callback
	 * @param {any} selectedRows 선택 정보들
	 * @param rowIndex
	 */
	const confirmPopupSku = (selectedRows: any, rowIndex: number) => {
		const rowData = selectedRows?.[0]; // 구조분해로 첫번째 요소 뽑기.
		const selectedIdx = gridRef.current?.getSelectedIndex()[0];

		gridRef.current.setCellValue(selectedIdx, 'sku', rowData.code);
		gridRef.current.setCellValue(selectedIdx, 'skuname', rowData.name);
		gridRef.current.setCellValue(selectedIdx, 'uom', rowData.baseuom);
		gridRef.current.setCellValue(selectedIdx, 'orderqty', rowData.qtyPerBox);
		gridRef.current.setCellValue(selectedIdx, 'storagetype', rowData.storagetype);

		modalRef2.current.handlerClose();
	};

	const closeEventSku = () => {
		modalRef2.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 행삽입
	 * @returns {void}
	 */
	const insertRow = () => {
		const selectedRowCurTmp = gridRef.current.getCheckedRowItems()[0];
		if (!selectedRowCurTmp || selectedRowCurTmp?.item?.missMoveRespYn === 'Y') return; // 선택된 행이 없거나 이미 확정처리인경우 return 처리
		const initValue = {
			...selectedRowCurTmp?.item,
			orderDccode: null,
			supplyqty: null,
			status: 'I',
		};
		const addedRowIndex = selectedRowCurTmp['rowIndex'] + 1;

		// 신규행 추가
		gridRef.current.addRow(initValue, addedRowIndex);
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// 출력
				btnType: 'print',
				callBackFn: () => {
					savePrintList();
				},
			},
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: downloadExcel,
			},
			{
				btnType: 'curPlus',
				isActionEvent: false,
				callBackFn: insertRow,
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',
					priority: '1',
				},
			},
			{
				btnType: 'delete',
			},
			{
				btnType: 'btn1',
				callBackFn: confirmMasterList,
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	const initEvent = () => {
		/**
		 * 에디팅 시작 이벤트 바인딩
		 * @param {any} event 이벤트
		 */

		gridRef.current.bind('cellEditBegin', function (event: any) {
			// 대응여부 Y 아닐때만 수정 가능
			if (event.item.missMoveRespYn === 'Y') {
				return false;
			} else {
				return true;
			}
		});
	};

	// OmUserSelectPopup callBack
	const confirmUser = (selectedRows: any[]) => {
		const rowUserData = selectedRows?.[0];

		if (selectedRowIndex === null) return;

		gridRef.current.setCellValue(selectedRowIndex, 'respId', rowUserData.userId);
		gridRef.current.setCellValue(selectedRowIndex, 'respNm', rowUserData.userNm);
	};

	const closeUserPopup = () => {
		modalUserRef.current.handlerClose();
	};

	const mappedData = useMemo(() => {
		return (gridData || []).map((v: any) => ({
			...v,
			rmk: v.reqReasoncode,
		}));
	}, [gridData]);
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridData.length > 0) {
			const mappedData = gridData.map((v: any) => ({
				...v,
				rmk: v.reqReasoncode,
			}));
			gridRef?.current.setColumnPropByDataField('openqty1', { headerText: (gridData[0]?.dcname1 || '') + '(1순위)' });
			gridRef?.current.setColumnPropByDataField('openqty2', { headerText: (gridData[0]?.dcname2 || '') + '(2순위)' });
			gridRef?.current.setColumnPropByDataField('openqty3', { headerText: (gridData[0]?.dcname3 || '') + '(3순위)' });
			gridRef?.current.setColumnPropByDataField('openqty4', { headerText: (gridData[0]?.dcname3 || '') + '(4순위)' });
			gridRef?.current.setColumnPropByDataField('openqty5', { headerText: (gridData[0]?.dcname3 || '') + '(5순위)' });
			gridRef?.current.setGridData(gridData);
			setTotalCnt(gridData.length);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList1 = gridRef?.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef?.current.setColumnSizeList(colSizeList1);
			gridRef?.current.setSelectionByIndex(0);
		}
	}, [gridData]);

	useEffect(() => {
		if (mappedData.length > 0) {
			gridRef?.current.setGridData(mappedData);

			setTotalCnt(mappedData.length);

			const colSizeList1 = gridRef?.current.getFitColumnSizeList(true);
			gridRef?.current.setColumnSizeList(colSizeList1);
			gridRef?.current.setSelectionByIndex(0);
		}
	}, [mappedData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				<CustomModal ref={modalRef2} width="1000px">
					<CmSearchPopup type={'sku_2'} callBack={confirmPopupSku} close={closeEventSku}></CmSearchPopup>
				</CustomModal>
				<CustomModal ref={modalUserRef} width="1000px">
					<OmUserSelectPopup callBack={confirmUser} close={closeUserPopup} />
				</CustomModal>
			</AGrid>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
			</AGrid>
		</>
	);
});

export default OmTnsfMissingSTODetail;
