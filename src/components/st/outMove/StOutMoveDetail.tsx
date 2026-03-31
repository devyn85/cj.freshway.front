/*
 ############################################################################
 # FiledataField	: StStockOutOrgDetail.tsx
 # Description		: 외부비축센터간이동
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.25
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { Datepicker, InputText, SelectBox } from '@/components/common/custom/form';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { round, toNumber } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Utils

import commUtil from '@/util/commUtil';
//types
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetStockPrice, apiSaveData } from '@/api/st/apiStOutMove';

//store
import CustomModal from '@/components/common/custom/CustomModal';
import StOutMoveExcelUpload from '@/components/st/outMove/StOutMoveExcelUpload';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

const StOutMoveDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';
	const { t } = useTranslation();
	const [formVal] = Form.useForm();

	const [reasonCode, setReasonCode] = useState('');
	const [reasonMsg, setReasonMsg] = useState('');

	const excelInputRef = useRef(null);
	const refModal = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalRef1 = useRef(null);
	const dcCode = Form.useWatch('fixDcCode', props.form);
	const organizeCd = Form.useWatch('organizeCd', formVal);
	const organizeNm = Form.useWatch('organizeNm', formVal);
	const slipDt = Form.useWatch('slipDt', props.form);
	const closeEvent = () => {
		modalRef1.current.handlerClose();
		setIsModalOpen(false);
	};
	//그리드 컬럼 세팅
	const gridCol = [
		{ dataField: 'organize', headerText: '창고', editable: false },

		{ dataField: 'organizeName', headerText: '창고명', editable: false },
		{
			headerText: '재고위치',
			children: [
				{ dataField: 'stockType', headerText: '코드', editable: false, dataType: 'code' }, // FROM_STOCKTYPE
				{ dataField: 'stockTypeName', headerText: '명칭', editable: false, dataType: 'code' }, // STOCKTYPENAME
			],
		},

		{
			headerText: '재고속성',
			children: [
				{ dataField: 'stockGrade', headerText: '코드', editable: false, dataType: 'code' }, // FROM_STOCKGRADE
				{ dataField: 'stockGradeName', headerText: '명칭', editable: false, dataType: 'code' }, // STOCKGRADENAME
			],
		},

		{ dataField: 'loc', headerText: '로케이션', editable: false, dataType: 'code' },
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
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{ dataField: 'storageType', headerText: '저장조건', editable: false, dataType: 'code' },

		{
			headerText: '재고정보',
			children: [
				{ dataField: 'uom', headerText: '단위', editable: false, dataType: 'code' },
				{ dataField: 'qty', headerText: '현재고수량', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
				{
					dataField: 'qtyAllocated',
					headerText: '재고할당수량',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtyPicked',
					headerText: '피킹재고',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'posbQty',
					headerText: '이동가능수량',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},

		{
			headerText: '환산재고',
			children: [
				{
					dataField: 'avgweight',
					headerText: '평균중량',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{ dataField: 'calbox', headerText: '환산박스', dataType: 'numeric', editable: false },
				{ dataField: 'qtyperbox', headerText: '박스입수', dataType: 'numeric', editable: false },
				{ dataField: 'realBox', headerText: '실박스', dataType: 'numeric', editable: false },
			],
		},

		{
			headerText: '이동정보',
			children: [
				{
					dataField: 'toOrderqty',
					headerText: '이동수량',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
				}, // TO_ORDERQTY
				{ dataField: 'uom', headerText: '단위', editable: false }, // UOM
				{
					dataField: 'etcqty2',
					headerText: '작업박스수량',
					dataType: 'numeric',
					editable: true,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						// //console.log(item.rowStatus);
						if (item?.boxflag === 'Y') {
							// 편집 가능 class 삭제
							return 'isEdit';
						} else {
							// 편집 가능 class 추가
							// //console.log(item);
							ref.gridRef.current.removeEditClass(columnIndex);
						}
					},
				}, // etcqty2 → 작업 BOX 수량
			],
		},
		{ dataField: 'stockPrice', headerText: 'stockPrice', dataType: 'numeric', editable: false, visible: false },
		{
			dataField: 'storageFee',
			headerText: '보관료',
			dataType: 'numeric',
			editable: false,
			// labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
			// 	/**
			// 	 * FN_EXDCSTOCKPRICE DB함수 사용해서 뽑아옴...
			// 	 * 아마?
			// 	 */

			// 	const qty = toNumber(item?.toOrderqty);
			// 	const price = toNumber(item?.stockPrice);
			// 	//console.log((qty, price);
			// 	// NaN 방지: 둘 중 하나라도 NaN이면 0으로 처리
			// 	const safeQty = isNaN(qty) ? 0 : qty;
			// 	const safePrice = isNaN(price) ? 0 : price;
			// 	return round(safeQty * safePrice, 2);
			// },
		},

		{
			dataField: 'tranDeliveryPrice',
			headerText: '운송료(공급가)',
			dataType: 'numeric',
			// required: true,
			editable: true,
			editRenderer: { type: 'number' },
		},
		{
			dataField: 'deliveryFeeTaxExdc',
			headerText: '운송료(세액)',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
				return round(item?.tranDeliveryPrice * 0.1);
			},
		},
		{ dataField: 'taxCls', headerText: '세금코드', editable: false, dataType: 'code' },

		{
			dataField: 'nearDurationYn',
			headerText: '소비기한임박여부',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationType, '');
			},
		},
		{
			dataField: 'lotTable01',
			headerText: '소비기준일(유통,제조)',
			editable: false,
			dataType: 'date',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationType, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: '소비기한(잔여/전체)',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationType, '');
			},
		},

		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialNo', headerText: '이력번호', editable: false },
				{ dataField: 'barcode', headerText: '바코드', editable: false },
				{ dataField: 'convSerialNo', headerText: 'B/L번호', editable: false },
				// { dataField: 'butcheryDt', headerText: 'BUTCHERYDT' },
				// { dataField: 'factoryName', headerText: 'FACTORYNAME' },
				{ dataField: 'contractType', headerText: '계약유형', editable: false, dataType: 'code' },
				{ dataField: 'contractCompany', headerText: '계약업체', editable: false, dataType: 'code' },
				{ dataField: 'contractCompanyName', headerText: '계약업체명', editable: false },
				{ dataField: 'fromValidDt', headerText: '유효일자(FROM)', editable: false, dataType: 'date' },
				{ dataField: 'toValidDt', headerText: '유효일자(TO)', editable: false, dataType: 'date' },
			],
		},
		{ dataField: 'fromLot', headerText: '로트', editable: false, editRenderer: { type: 'text' } },
		{ dataField: 'fromStockid', headerText: '개체식별/유통이력', editable: false },
		{ dataField: 'fromArea', headerText: '작업구역', editable: false, dataType: 'code' },
		{
			headerText: '이동사유',
			children: [
				{
					dataField: 'processmsg',
					headerText: '사유코드',
					editable: true,
					required: true,
					renderer: {
						// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
						type: 'DropDownListRenderer',
						list: getCommonCodeList('REASONCODE_OUTMV', ''),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
				},
				{ dataField: 'memo1', headerText: '사유내용', editable: true, required: true },
			],
		},

		{
			dataField: 'toOrganize',
			headerText: '창고',
			width: 109,
			dataType: 'text',
			required: true,
			editable: false,
			// commRenderer: {
			// 	type: 'search',
			// 	onClick: function (e: any) {
			// 		const rowIndex = e.rowIndex;

			// 		refModal.current.open({
			// 			gridRef: ref.gridRef,
			// 			rowIndex,
			// 			dataFieldMap: {
			// 				toOrganize: 'code',
			// 				toOrganizeName: 'name',
			// 			},
			// 			popupType: 'organize',
			// 		});
			// 	},
			// },
			commRenderer: {
				type: 'search',
				popupType: 'organize',
				searchDropdownProps: {
					dataFieldMap: {
						organize: 'code',
						organizeNm: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;

					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
						customDccode: e.item?.dcCode,
						dataFieldMap: {
							toOrganize: 'code',
							toOrganizeName: 'name',
						},
						popupType: 'organize',
					});
				},
			},
		},
		{ visible: true, dataField: 'toOrganizeName', headerText: '창고명', editable: false },
		{ dataField: 'dcCode', headerText: 'DCCODE', visible: false },
		// { dataField: 'fromStorerkey', headerText: 'fromStorerkey', visible: false },

		{ dataField: 'other05', headerText: 'other05', editable: false, visible: false },
		{ dataField: 'workNo', headerText: 'workNo', editable: false, visible: false },
		{ dataField: 'boxflag', headerText: 'boxflag', editable: false, visible: false },
		{ dataField: 'duration', headerText: 'duration', editable: false, visible: false },
		{ dataField: 'durationType', headerText: 'durationType', editable: false, visible: false },
	];

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 *
	 */

	/**
	 * 그리드 이벤트 바인딩
	 */
	const gridInit = () => {
		const gridRef = ref.gridRef.current;
		gridRef?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef?.bind('cellEditBegin', function (event: any) {
			if (event.dataField === 'etcqty2' && event.item.boxflag !== 'Y') {
				return false;
			}
		});
		gridRef?.bind('cellEditEnd', function (event: any) {
			const gridDataWithState = gridRef.getGridData();
			const selectRow = gridRef.getSelectedIndex()[0];
			const rowData = gridDataWithState[selectRow];
			////console.log((rowData);
			const field = event.dataField;
			//이동수량
			if (field === 'toOrderqty') {
				const val = event.value;
				if (val === 0 || val === '') {
					gridRef.setCellValue(selectRow, 'toOrderqty', 0);
					gridRef.setCellValue(selectRow, 'etcqty2', 0);
				} else {
					if (rowData.boxflag === 'Y' && toNumber(rowData.avgweight) > 0) {
						gridRef.setCellValue(selectRow, 'etcqty2', round(toNumber(val) / toNumber(rowData.avgweight)));
					}
					if (toNumber(val) > 0 && toNumber(val) / toNumber(rowData.avgweight) < 1) {
						gridRef.setCellValue(selectRow, 'etcqty2', 1);
					}
					if (toNumber(val) < 0 && toNumber(val) / toNumber(rowData.avgweight) > -1) {
						gridRef.setCellValue(selectRow, 'etcqty2', -1);
					}
				}
				//console.log((props.form.getFieldsValue());
				//console.log((dcCode, slipDt);

				const param = {
					fixDcCode: props.form.getFieldsValue()?.fixDcCode,
					slipDt: formVal.getFieldsValue().slipDt?.format('YYYYMMDD'),
					sku: gridDataWithState[event.rowIndex].sku,
					organize: gridDataWithState[event.rowIndex].organize,
					serialNo: gridDataWithState[event.rowIndex].barcode,
					uid: gridDataWithState[event.rowIndex]._$uid,
				};
				apiGetStockPrice(param).then(res => {
					const price = res.data.stockPrice;
					const row = gridRef.getRowIndexesByValue('_$uid', res.data.uid1);

					const qty = toNumber(gridDataWithState[row].toOrderqty);
					// const price = toNumber(item?.stockPrice);
					//console.log((qty, price);
					// NaN 방지: 둘 중 하나라도 NaN이면 0으로 처리
					const safeQty = isNaN(qty) ? 0 : qty;
					const safePrice = isNaN(price) ? 0 : price;

					const item = {
						_$uid: res.data.uid1,
						storageFee: round(safeQty * safePrice, 2),
					};
					gridRef.updateRowsById(item);
					// gridRef.setCellValue(selectRow, 'storageFee', round(safeQty * safePrice, 2));
					// return round(safeQty * safePrice, 2);
				});
				//작업박스수량
			} else if (field === 'etcqty2') {
				const val = event.value;
				if (val === '' || val === null) {
					gridRef.setCellValue(selectRow, 'etcqty2', 0);
				}
				//'운송료(공급가)',
			} else if (field === 'tranDeliveryPrice') {
				let trandeliveryprice = 0;
				if (rowData.tranDeliveryPrice === null || rowData.tranDeliveryPrice === '') {
					trandeliveryprice = 0;
				} else {
					trandeliveryprice = toNumber(rowData.trandeliveryprice);
				}
				const deliveryfee = round(trandeliveryprice * toNumber(rowData.other05));
				gridRef.setCellValue(selectRow, 'deliveryFeeTaxExdc', deliveryfee);

				gridRef.setCellValue(selectRow, 'workNo', rowData.tranDeliveryPrice * rowData.other05);
			}
		});
	};

	/**
	 * 엑셀 데이터 업로드
	 * @param data
	 * @returns
	 */
	const onDataExcel = (data: any[][]) => {
		////console.log(('excel');
		if (!Array.isArray(data) || data.length === 0) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}

		const grid = ref.gridRef.current;
		grid.clearGridData();

		// 그리드 컬럼 메타
		const columns = grid
			.getColumnInfoList()
			.filter((c: any) => !!c.dataField)
			.map((c: any) => ({
				dataField: c.dataField,
				visible: c.visible !== false,
			}));

		// 엑셀 → 그리드 데이터 변환
		const gridData = data.map((row: any[]) => {
			const newRow: Record<string, any> = {};
			let excelIdx = 0;

			columns.forEach(({ dataField, visible }: { dataField: string; visible: boolean }) => {
				if (visible) {
					// 보여지는 컬럼만 엑셀 순서대로 매핑
					newRow[dataField] = row[excelIdx++];
				} else {
					// 숨김 컬럼 초기값
					if (dataField === 'boxflag') newRow[dataField] = 'Y'; // 또는 ''
				}
			});

			return newRow;
		});

		grid.setGridData(gridData);
	};

	/**
	 * 선택 적용(창고,사유코드,사유내용)
	 * @returns
	 */

	const optApl = () => {
		const gridRefDtl = ref.gridRef.current;
		// const val = formVal.getFieldsValue();
		const val = formVal.getFieldsValue();

		const checkedRows = gridRefDtl.getCheckedRowItems?.();
		if (checkedRows < 0) {
			showAlert('', '선택된 행이 없습니다.');
			return;
		}
		if (reasonCode === null || reasonCode === '') {
			showAlert('', '사유코드를 입력해주세요');
			return;
		}
		if (reasonMsg === null || reasonMsg === '') {
			showAlert('', '사유내용를 입력해주세요');
			return;
		}
		if (
			(val.organizeNm === null && val.organizeCd === null) ||
			(val.organizeNm === '' && val.organizeCd === '') ||
			(val.organizeNm === undefined && val.organizeCd === undefined)
		) {
			showAlert('', '이동창고를 입력해주세요');
			return;
		}
		////console.log((organizeCd);
		////console.log((organizeNm);
		// const param = {
		// 	name :
		// };
		checkedRows.forEach((row: any) => {
			const rowIndex = row.rowIndex;
			if (reasonCode) gridRefDtl.setCellValue(rowIndex, 'processmsg', reasonCode);
			if (reasonMsg) gridRefDtl.setCellValue(rowIndex, 'memo1', reasonMsg);
			// if (val.organizeNm && val.organizeCd) {
			gridRefDtl.setCellValue(rowIndex, 'toOrganize', organizeCd);
			gridRefDtl.setCellValue(rowIndex, 'toOrganizeName', organizeNm);
			// }
			// if()
		});
	};
	/**
	 * 엑셀 업로드 버튼 클릭 이벤트
	 */
	const excelUpload = () => {
		// if (props.user !== '2170') return;
		if (ref.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					modalRef1.current.handlerOpen();
					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			modalRef1.current.handlerOpen();
			setIsModalOpen(true);
		}
	};

	/**
	 * 데이터 저장
	 * @param saveList
	 */
	const saveData = async (saveList: any) => {
		const param = {
			deliveryDate: formVal.getFieldsValue().slipDt?.format('YYYYMMDD'),
			saveList: saveList,
		};
		apiSaveData(param).then(res => {
			////console.log((res.data);
			////console.log((res);
			if (isModalOpen) {
				modalRef1.current.handlerClose();
				setIsModalOpen(false);
			}
			if (res.statusCode === 0) {
				showAlert('저장', '저장되었습니다.');
				ref.gridRef.current.clearGridData();
				props.callBackFn();
			}
			// ref.gridRef.current.setGridData(res.data);
		});
	};

	/**
	 * val 체크
	 * @returns
	 */
	const save = () => {
		const grid = ref.gridRef.current;
		const rows = grid.getCheckedRowItemsAll();
		if (!rows || rows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		for (const [idx, row] of rows.entries()) {
			////console.log((row);
			if (row.toOrganize === null || row.toOrganize === '') {
				showAlert('', '이동창고를 입력하십시요.');
				return;
			}
			if (row.processmsg === null || row.processmsg === '') {
				showAlert('', '이동사유를 선택하십시요.');
				return;
			}
			if (row.toOrganize === row.organize) {
				showAlert('', `(${idx + 1}번째 행) From창고와 TO 창고가 동일합니다. 동일창고로 이동할 수 없습니다.`);
				return;
			}
			const qty = row.toOrderqty;
			const posbQty = row.posbQty;
			const boxQty = row.etcqty2;
			const boxflag = row.boxflag;

			if (posbQty < qty) {
				showAlert('', `(${idx + 1}번째 행) 이동수량이 이동 가능 수량을 초과합니다`);
				return;
			}
			////console.log((toNumber(qty));
			////console.log((toNumber(boxQty));
			////console.log((boxflag);
			if (toNumber(qty) > 0 && toNumber(boxQty) === 0 && boxflag === 'Y') {
				showAlert('', `(${idx + 1}번째 행) 작업박스수량이 0보다 커야합니다.`);
				return;
			}
		}
		const idx = rows.findIndex((row: any) => row.storageFee === 0);

		if (idx > -1) {
			// 조건에 맞는 행이 있음
			showConfirm(
				'',
				'요율정보가 없이 보관료가 0인 건이 있습니다. 이대로 저장하시겠습니까?',
				() => {
					saveData(rows);
				},
				() => {
					return;
				},
			);
			// rows[idx]로 해당 행 데이터 사용 가능
		} else {
			// 조건에 맞는 행이 없음
			saveData(rows);
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{ btnType: 'save', callBackFn: save },
			// {
			// 	btnType: 'excelUpload',
			// },
		],
	};

	//그리드 Props
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
		// showFooter: true,
	};

	//그리드 footer
	const footerLayout = [{}];
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('toOrganize', { width: 92 });
				gridRefCur.setColumnPropByDataField('toOrganizeName', { width: 180 });
				gridRefCur.setColumnPropByDataField('storageFee', { width: 94 });
			}
		}
	}, [props.data]);
	useEffect(() => {
		gridInit();
		formVal.setFieldValue('slipDt', dayjs());
	}, []);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
					{/* <Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button> */}
					<Form form={formVal} layout="inline" className="sect">
						<Form.Item name="slipDt" label="작업일자">
							<Datepicker
								name="slipDt"
								allowClear
								showNow={true}
								format="YYYY-MM-DD"
								required={true}
								// defaultValue={dayjs()}
								className="bg-white"
								//rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Form.Item>
						<Form.Item name="reasonCode" label="사유코드">
							<SelectBox
								options={getCommonCodeList('REASONCODE_OUTMV', '')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								name="reasonCode"
								value={reasonCode}
								onChange={setReasonCode}
								className="bg-white"
								style={{ width: 100 }}
							/>
						</Form.Item>

						<Form.Item name="reasonMsg" label="사유내용">
							<InputText
								name="reasonMsg"
								value={reasonMsg}
								onChange={(e: any) => setReasonMsg(e.target.value)}
								className="bg-white"
							/>
						</Form.Item>

						<Form.Item name="organizeCode" label="">
							{/* 선택 시 form.setFieldsValue({organizeCode, organizeName}) 하도록 구현 */}
							<CmOrganizeSearch
								form={formVal}
								selectionMode="singleRow"
								returnValueFormat="name"
								name="organizeNm"
								code="organizeCd"
								className="bg-white"
								dccode={dcCode}
							/>
						</Form.Item>
					</Form>
					<Button type={'default'} onClick={optApl}>
						선택적용
					</Button>
					<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 업로드 영역 정의 */}
			<CustomModal ref={modalRef1} width="1000px">
				<StOutMoveExcelUpload
					gridCol={gridCol}
					close={closeEvent}
					save={saveData}
					gridProps={gridProps}
					dcCode={dcCode}
					// callBack={props.fnCallBack?.()}
					// setSepecCodeDetail={setSepecCodeDetail}
				/>
			</CustomModal>
		</>
	);
});
export default StOutMoveDetail;
