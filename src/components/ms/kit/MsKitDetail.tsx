// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';

// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MsKitUploadExcelPopup from '@/components/ms/kit/MsKitUploadExcelPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveMasterList } from '@/api/ms/apiMsKit';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

const MsKitDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//조회 팝업
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);
	const modalRef2 = useRef(null);

	// popup 속성
	const [gridForm] = Form.useForm();

	const datePicker1Value = Form.useWatch('datePicker1', gridForm);

	useEffect(() => {
		if (datePicker1Value && datePicker1Value.isBefore(dayjs(), 'day')) {
			showAlert(null, '현재일 이전 날짜는 입력할 수 없습니다.');
			gridForm.setFieldValue('datePicker1', null);
		}
	}, [datePicker1Value]);

	// 글로벌 센터코드
	// const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 사용자 정보
	// const user = useAppSelector(state => state.user.userInfo);

	const userDccodeList = getUserDccodeList('') ?? [];

	/**
	 * column 의  isEdit css 적용 유무 판단
	 * @param {number}  rowIndex row index
	 * @param {number}  columnIndex  column index
	 * @param {any}  value column value
	 * @param {string} headerText column header text
	 * @param {any}  item row value
	 * @returns string css value
	 */
	const checkEditClass = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		if (commUtil.isNotEmpty(item.serialKey)) {
			gridRef.current.removeEditClass(columnIndex);
			if (headerText === 'KIT상품코드' || headerText === 'KIT상품명') {
				return 'color-black';
			}
		} else {
			return 'isEdit';
		}
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'seq',
			headerText: t('lbl.SEQ'),
			dataType: 'code',
			cellMerge: true,
			editable: false,
			visible: false,
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'), // 물류센터
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'dropDown',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (commUtil.isNotEmpty(item.serialKey)) {
						return true;
					}
					return false;
				},
			},
			styleFunction: checkEditClass,
			editable: false,
		},
		{
			dataField: 'kitSku',
			headerText: 'KIT상품코드',
			dataType: 'code',
			cellMerge: true,
			required: true,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			style: '.gc-user15',
			commRenderer: {
				type: 'search',
				popupType: 'kitSku',
				searchDropdownProps: {
					dataFieldMap: {
						kitSku: 'code',
						kitNm: 'name',
						disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
							if (commUtil.isNotEmpty(item.serialKey)) {
								return true;
							}
							return false;
						},
					},
				},
				onClick: (e: any) => {
					if (e.item.rowStatus === 'R' || e.item.rowStatus === 'U') {
						const params = {
							sku: e.item.kitSku,
							skuDescr: e.item.kitNm,
						};
						gridRef.current.openPopup(params, 'sku'); // 상세 팝업
					} else {
						modalRef.current.handlerOpen(); // 신규 팝업
					}
				},
			},
			styleFunction: checkEditClass,
		},
		{
			dataField: 'kitNm',
			headerText: 'KIT상품명',
			dataType: 'string',
			cellMerge: true,
			editable: false,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			styleFunction: () => 'color-black',
		},
		{
			dataField: 'fromDate',
			headerText: t('lbl.FROMDATE'), // 시작일자
			notBeginEventNewRowsOnPaste: true,
			dataType: 'date',
			width: 100,
			required: true,
			formatString: 'yyyy-mm-dd', // 실제 데이터는 yyyymmdd
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// cellMerge: true,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				const selectedDate = dayjs(item.toDate);
				const today = dayjs().startOf('day');
				const isValid = selectedDate.isBefore(today);
				// //console.log(` 오늘 지남? ${isValid}`);
				if (commUtil.isNotEmpty(item.serialKey) && (item.delYn === 'Y' || isValid)) {
					// 사용여부가 중단이면 수정 불가 표시
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editable: true,
		},
		{
			dataField: 'toDate',
			headerText: '중단일자',
			notBeginEventNewRowsOnPaste: true,
			dataType: 'date',
			required: true,
			formatString: 'yyyy-mm-dd', // 실제 데이터는 yyyymmdd
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// cellMerge: true,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				const selectedDate = dayjs(value);
				const today = dayjs().startOf('day');
				const isValid = selectedDate.isBefore(today);
				// //console.log(` 오늘 지남? ${isValid}`);
				if (commUtil.isNotEmpty(item.serialKey) && (item.delYn == 'Y' || isValid)) {
					// 사용여부가 중단이면 수정 불가 표시
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editable: true,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.CONTROLTYPE'), // 사용유무
			dataType: 'code',
			// cellMerge: true,
			mergeRef: 'seq',
			mergePolicy: 'restrict',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN', ''),
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (commUtil.isNotEmpty(value) && value === 'Y' && item.rowStatus !== 'U') {
						const today = dayjs().startOf('day');
						// true일 경우 복사 제외 || 사용유무가 삭제이면서 오늘 날짜가 종료일보다 크면 copy 가능.
						//console.log((` 신규인가? ${item.rowStatus !== 'I'} `);
						//console.log((` 사용정지 유무 : ${item.delYn === 'Y'}`);
						//console.log((` 오늘보다 작은가? ${dayjs(item.toDate).isBefore(today)} `);

						return true && dayjs(item.toDate).isBefore(today);
					}
					return false;
				},
			},
			styleFunction: checkEditClass,
		},
		{
			dataField: 'sku',
			headerText: '구성상품코드',
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
			dataField: 'description',
			headerText: '구성상품명',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: '입수단위',
			dataType: 'code',
			// commRenderer: {
			// 	type: 'dropDown',
			// 	list: getCommonCodeList('UOM', ''),
			// 	disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
			// 		// if (commUtil.isNotEmpty(item.serialKey)) {
			// 		return true;
			// 		// }
			// 		// return false;
			// 	},
			// },
			// styleFunction: checkEditClass,
			editable: false,
		},
		{
			dataField: 'uomQty',
			headerText: '입수량',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			// styleFunction: checkEditClass,
			editable: false,
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY'), // 수량
			dataType: 'numeric',
			formatString: '#,##0.###', // 표시 포맷
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (item.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: false,
							allowPoint: true,
							autoThousandSeparator: true,
							regExp: /^\d{0,9}(\.\d{0,3})?$/,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						autoThousandSeparator: true,
					};
				},
			},
			styleFunction: checkEditClass,
			editable: true,
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
		showRowNumColumn: true,
		enableFilter: true,
		enableCellMerge: true,
		// cellMergeRowSpan: false,
		// 병합된 셀을 사용자가 직접 수정할 때 병합된 셀 전체가 수정 적용될지 여부 (기본값: false)
		editableMergedCellsAll: true,
		rowStyleFunction: (rowIndex: any, item: any) => {
			// grid 의 사용 여부 값이 중단이면 모든 row 의 글자의 font 를 빨간색으로 변경 해 준다.
			if (item.delYn === 'Y') {
				return 'color-danger';
			}
			return '';
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
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작 편집 허용
		 * @param {any} event 이벤트
		 * @returns {boolean} true : 편집 가능 , false : 편집 불가
		 */
		gridRef?.current.bind('cellEditBegin', (event: any) => {
			const data = event.item;
			const name = event.dataField;
			// false :편집모드 안됨. true : 편집모드 가능.
			if ((name === 'fromDate' || name === 'toDate') && data.rowStatus !== 'I') {
				const today = dayjs().startOf('day');
				const endDate = dayjs(data.toDate); // 종료일
				const isValid = endDate.isBefore(today); // 종료일이 오늘보다 작은가? ( 즉 종료일이 과거인가? )
				if (data.delYn == 'Y' || isValid) {
					// //console.log('과거임.', isValid);
					return false;
				}
			}
			if (data.rowStatus !== 'I' && name !== 'toDate' && name !== 'fromDate') return false;
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// FromDate가 ToDate보다 크면 경고
			const fromDate = gridRef.current.getCellValue(event.rowIndex, 'fromDate');
			const toDate = gridRef.current.getCellValue(event.rowIndex, 'toDate');
			const today = dayjs().format('YYYYMMDD');
			if (fromDate && toDate && fromDate > toDate) {
				showMessage({
					content: t('msg.MSG_COM_VAL_016'),
					onOk: () => {
						if (event.dataField === 'fromDate') {
							gridRef.current.setCellValue(event.rowIndex, 'fromDate', null);
						} else if (event.dataField === 'toDate') {
							gridRef.current.setCellValue(event.rowIndex, 'toDate', null);
						}
					},
				});
			}

			if (event.dataField === 'fromDate' && event.value) {
				if (event.value < today) {
					showMessage({
						content: t('시작일자는 현재일자보다 작을 수 없습니다.'),
						onOk: () => {
							gridRef.current.setCellValue(event.rowIndex, 'fromDate', null);
						},
					});
				}
			}

			if (event.dataField === 'toDate' && event.value) {
				if (event.value < today) {
					showMessage({
						content: t('중단일자는 현재일자보다 작을 수 없습니다.'),
						onOk: () => {
							gridRef.current.setCellValue(event.rowIndex, 'toDate', null);
						},
					});
				}
			}

			if (event.dataField === 'sku') {
				if (event.value !== event.oldValue) {
					gridRef.current.setCellValue(event.rowIndex, 'description', '');
				}
			}

			if (event.dataField === 'kitSku') {
				if (event.value !== event.oldValue) {
					gridRef.current.setCellValue(event.rowIndex, 'kitNm', '');
				}
			}

			if (event.dataField === 'delYn' && event.value !== event.oldValue) {
				if (event.value === 'N') {
					gridRef.current.setCellValue(event.rowIndex, 'toDate', '99991231');
				} else if (event.value === 'Y') {
					gridRef.current.setCellValue(event.rowIndex, 'toDate', today);
				}
			}

			if (gridRef.current.getCellValue(event.rowIndex, 'rowStatus') === 'R') {
				gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });
		// 컬럼 required 여부 체크
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		const isDuplicate = checkDuplicateByGroup(updatedItems, ['dcCode', 'delYn', 'kitSku', 'sku']);

		if (!isDuplicate) {
			// 실패면 정지.
			// showMessage({
			// 	content: t('msg.duplication2', [' [구성상품코드]']), // 중복된 {{0}}(이)가 존재합니다
			// 	modalType: 'info',
			// });
			return false;
		}

		// 저장 실행
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					gridRef.current.getCustomCheckedRowItems().map((item: any, index: any) => {
						gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
						});
						props.callBackFn();
					}
				}
			});
		});
	};

	/**
	 * 저장할 목록을 가지고 같은 그룹의 데이터와 중복 체크를 한다.
	 * @param {any} checkList 저장할 목록
	 * @param {string[]} columns 중복 체크할 컬럼 목록
	 * @returns {boolean} true : 검증성공, false: 검증실패
	 */
	const checkDuplicateByGroup = (checkList: any, columns: string[]) => {
		// 중복 검사( 물류센터, 사용여부, kit상품코드, 구성상품코드 )
		// const groupData = gridRef.current.getOrgGridData()?.filter((item: any) => item.delYn === 'N' && currentRow.kitSku === item.kitSku); // delYn === 'N' 이면 사용여부 정상
		const groupData = gridRef.current.getOrgGridData()?.reduce((acc: any, item: any) => {
			const groupKey = item.kitSku;
			if (!acc[groupKey]) acc[groupKey] = [];
			acc[groupKey].push(item);
			return acc;
		}, {});

		// 저장할 목록 정보 checkList
		for (const currentRow of checkList) {
			// 같은 그룹 정보만 조회

			// 신규 kitSku인 경우 groupData에 키가 없을 수 있으므로 체크
			if (!groupData[currentRow.kitSku]) continue;

			// 현재 행(currentRow)을 제외한 "나머지 전체 행" 중에서 중복이 있는지 검사.
			const isDuplicate = groupData[currentRow.kitSku].some((otherRow: any) => {
				// 자기 자신은 비교 대상에서 제외
				if (currentRow._$uid === otherRow._$uid) return false;

				const isMatch = columns.every(col => {
					return currentRow[col] === otherRow[col];
				});

				if (!isMatch) return false;

				if (currentRow.fromDate && currentRow.toDate && otherRow.fromDate && otherRow.toDate) {
					return currentRow.fromDate <= otherRow.toDate && currentRow.toDate >= otherRow.fromDate;
				}
				return true;
			});

			if (isDuplicate) {
				showMessage({
					content: t('msg.duplication2', [`${currentRow.kitSku}] 그룹에 [${currentRow.sku}] 코드`]), // 중복된 {{0}}(이)가 존재합니다
					modalType: 'info',
				});
				return false; // 중복이 있으면 여기서 검증실패.
			}
		}
		return true;
	};

	/**
	 * 데이터에서 중복 데이터 체크 할 컬럼들을 조합하여 중복 여부를 판단한다.
	 * @param {any} checkList 체크 할 목록을 가진 list
	 * @param {any} dataList 그리드 데이터 목록
	 * @param {string[]} columns 중복 체크 컬럼 목록
	 * @returns {boolean} 중복값 존재시 true 아니면 false
	 */
	const checkDuplicateRows = (checkList: any, dataList: any, columns: string[]) => {
		const set = new Set();

		// some 메서드는 조건이 true가 되는 순간 반복을 멈춥니다.
		return dataList.some((item: any) => {
			// 기준 컬럼들의 값을 연결하여 고유 키 생성 (예: "값A_값B")
			const key = columns.map(col => item[col]).join('_');
			// //console.log('keys : ', key);
			if (set.has(key)) return true;
			set.add(key);
			// //console.log('set info : ', [...set]);
			return false;
		});
	};

	const getSelectDccodeList = () => {
		if (commUtil.isNotEmpty(props.selectDcCode)) {
			if (props.selectDcCode.split(',').length > 1) {
				return '';
			} else {
				return props.selectDcCode.split(',')[0];
			}
		}
	};

	/**
	 * 행복사 버튼 클릭시 validation 체크
	 * @returns {boolean} valid 체크 후 정상이면 false , 아니면 alert 메세지 후 true;
	 */
	const validByCopyOnclick = () => {
		const rows = gridRef.current?.getCheckedRowItems();
		const booleanItems = rows?.length > 1 ? true : false;
		// //console.log(`checked count boolean : ${booleanItems}`);

		// 체크 박스 1개만 복사 가능 여부 체크.
		if (booleanItems) {
			showMessage({
				content: t('msg.MSG_COM_VAL_011'), // 2건 이상 체크되었습니다. 1건만 선택되어야 합니다.
				modalType: 'info',
			});

			return true;
		}

		// Y(삭제) 이 하나라도 있으면 true 에서 false 로 변경
		const booleanDelYn = !rows.some((row: any) => {
			return row.item.delYn === 'Y'; // Y 이면 삭제 상태값 임 (true)
		});

		if (booleanDelYn) {
			showMessage({
				content: '사용여부를 중단으로 변경 후 복사 해 주세요.',
				modalType: 'info',
			});
			return true;
		}

		const booleanDate = rows.some((row: any) => {
			const today = dayjs().startOf('day');
			// true일 경우 복사 제외 || 사용유무가 삭제이면서 오늘 날짜가 종료일보다 크면 copy 가능.
			//console.log((` 신규인가? ${row.item.rowStatus !== 'I'} `);
			//console.log((` 사용정지 유무 : ${row.item.delYn === 'Y'}`);
			//console.log((` 오늘보다 작은가? ${dayjs(row.item.toDate).isBefore(today)} `);
			return !dayjs(row.item.toDate).isBefore(today);
		});

		if (booleanDate) {
			showMessage({
				content: '중단일자를 확인 해 주세요.',
				modalType: 'info',
			});
			return true;
		}

		return false;
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'copy', // 행복사
				btnLabel: '행 복사',
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
					seq: '',
					dcCode: getSelectDccodeList(),
					delYn: 'N',
					sku: '',
					description: '',
					uom: '',
					qty: null, // 수량 기본값 설정
					uomQty: null, // 입수량 기본값 설정
					fromDate: dayjs().format('YYYYMMDD'), // 시작일자 기본값 오늘 날짜로 설정
					toDate: '99991231', // 종료일자 기본값 설정
					addWho: '',
					addDate: '',
					editWho: '',
					editDate: '',
					addWhoNm: '',
					editWhoNm: '',
				},
				// 콜백 Function 호출 전 처리 (1번만 호출됨)
				callBeforeFn: () => {
					return validByCopyOnclick(); // true 면 정지
				},
				// 새로 생성된 row 가 온다.
				// excludeFn: (item: any) => {
				// 	//console.log('1111111111111111111111');
				// if (item.rowStatus !== 'I') {
				// 수정 전 버젼 임.
				// return item['rowStatus'] !== 'I';
				// 수정 후 버전이나 체크 로직 확인 필요.
				// const today = dayjs().startOf('day');
				// true일 경우 복사 제외 || 사용유무가 삭제이면서 오늘 날짜가 종료일보다 크면 copy 가능.
				// //console.log(` 신규인가? ${item.rowStatus !== 'I'} `);
				// //console.log(` 사용정지 유무 : ${item.delYn === 'Y'}`);
				// //console.log(` 오늘보다 작은가? ${dayjs(item.toDate).isBefore(today)} `);
				// 	const booleanDate = !dayjs(item.toDate).isBefore(today);
				// 	if (booleanDate) {
				// 		showMessage({
				// 			content: '중단일자를 확인 해 주세요.',
				// 			modalType: 'info',
				// 		});
				// 	}
				// 	return item.delYn === 'N' || booleanDate; // true 이면 copy 작동 안함.
				// }
				// 	return item.rowStatus !== 'I';
				// },
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					addCount: 1,
					// storerkey: user.defStorerkey,
					dcCode: getSelectDccodeList(),
					kitSku: '',
					rowStatus: 'I', // 신규 행 상태로 설정
					prtnYn: 'N', // 소분여부 기본값 설정
					delYn: 'N', // 삭제여부 기본값 설정
					qty: null, // 수량 기본값 설정
					uomQty: null, // 입수량 기본값 설정
					uom: '', // 입수단위 기본값 설정
					fromDate: dayjs().format('YYYYMMDD'), // 시작일자 기본값 오늘 날짜로 설정
					toDate: '99991231', // 종료일자 기본값 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	const confirmPopupKit = (selectedRow: any) => {
		//gridRef.current.getData() 배열 의 kitSku 와 selectedRow[0].code 값이 중복되었다면 경고
		const gridData = gridRef.current.getGridData();
		let skuCnt = 0;
		gridData.forEach((item: any, index: number) => {
			if (item.kitSku === selectedRow[0].code) {
				skuCnt++;
			}
		});
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'kitSku', selectedRow[0].code);
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0] + skuCnt, 'kitNm', selectedRow[0].name);

		modalRef.current.handlerClose();
	};

	/**
	 * 구성상품코드 팝업 callback
	 * @param {any} selectedRows 선택 정보들
	 */
	const confirmPopupSku = (selectedRows: any) => {
		const rowData = selectedRows?.[0]; // 구조분해로 첫번째 요소 뽑기.
		const selectedIdx = gridRef.current?.getSelectedIndex()[0];

		gridRef.current.setCellValue(selectedIdx, 'sku', rowData.code);
		gridRef.current.setCellValue(selectedIdx, 'description', rowData.name);
		gridRef.current.setCellValue(selectedIdx, 'uom', rowData.baseuom);
		gridRef.current.setCellValue(selectedIdx, 'uomQty', rowData.qtyPerBox);

		modalRef2.current.handlerClose();
	};

	const closeEventKit = () => {
		modalRef.current.handlerClose();
	};

	const closeEventSku = () => {
		modalRef2.current.handlerClose();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		modalRef1.current.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeEventExcel = () => {
		modalRef1.current.handlerClose();
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
			for (const item of props.data) {
				item.rowStatus = 'R';
			}
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Form
						form={gridForm}
						initialValues={{ selectBox1: 'a', datePicker1: dayjs() }}
						layout="inline"
						className="flex-wrap sect"
					>
						<li>
							<SelectBox
								name="selectBox1"
								options={[
									{ label: '시작일자', value: 'a' },
									{ label: '종료일자', value: 'b' },
								]}
								className="bg-white"
								style={{ width: 150 }}
							/>
						</li>
						<li className="range-align">
							<DatePicker
								name="datePicker1"
								allowClear
								showNow={true}
								disabledDate={(current: any) => current && current < dayjs().startOf('day')}
							/>
							<span className="ml5">
								<Button
									type="default"
									onClick={() => {
										const checkedItems = gridRef.current.getCheckedRowItems();

										if (checkedItems.length < 1) {
											showAlert(null, t('msg.MSG_COM_VAL_010'));
											return;
										}

										const datePicker1 = gridForm.getFieldValue('datePicker1');
										const selectBox1 = gridForm.getFieldValue('selectBox1');

										for (const item of checkedItems) {
											if (selectBox1 === 'a') {
												gridRef.current.setCellValue(item.rowIndex, 'fromDate', datePicker1.format('YYYY-MM-DD'));
											} else if (selectBox1 === 'b') {
												gridRef.current.setCellValue(item.rowIndex, 'toDate', datePicker1.format('YYYY-MM-DD'));
											}
										}
									}}
								>
									선택적용
								</Button>
							</span>
						</li>
					</Form>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={'kitSku'} callBack={confirmPopupKit} close={closeEventKit}></CmSearchPopup>
			</CustomModal>
			<CustomModal ref={modalRef2} width="1000px">
				<CmSearchPopup type={'sku_2'} callBack={confirmPopupSku} close={closeEventSku}></CmSearchPopup>
			</CustomModal>
			<CustomModal ref={modalRef1} width="1000px">
				<MsKitUploadExcelPopup close={closeEventExcel} />
			</CustomModal>
		</>
	);
});

export default MsKitDetail;
