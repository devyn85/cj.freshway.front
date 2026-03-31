/*
 ############################################################################
 # FiledataField	: TmCrmWmsMemoTab2.tsx
 # Description		: CRM요청관리 - 배송이슈 탭
 # Author			: YeoSeungCheol
 # Since			: 25.10.28
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import TmIssueFileUploadPopup from '@/components/tm/issue/TmIssueFileUploadPopup';
import TmIssueUploadExcelPopup from '@/components/tm/issue/TmIssueUploadExcelPopup';
import { Button } from 'antd';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import commUtil from '@/util/commUtil';
import { getSearchPopupApiFunction } from '@/util/searchPopupConfigUtil';
import dayjs from 'dayjs';

// Store
import { apiConfirmMasterList, apiDeleteMasterList, apiSaveMasterList } from '@/api/tm/apiTmIssue';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
// import { getUserDccodeList } from '@/store/core/userStore';

// Type

// apiPostSaveMasterList

const TmCrmWmsMemoTab2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// props에서 전달받은 searchForm과 나머지 데이터들을 꺼냄.
	const { gridRef, data, searchForm } = props;

	// 검색 조건의 배송 일자가 변경 될때 마다 실시간 감시 처리.
	// const searchDeliveryDt = Form.useWatch('schDeliveryDt', searchForm);
	// const searchDcCode = Form.useWatch('schDcCode', searchForm);
	// const searchCustKey = Form.useWatch('schCustKey', searchForm); // 관리처코드
	// const searchStatus = Form.useWatch('schStatus', searchForm); // 진행 상태

	// 검색 컴퍼넌트에서 설정한 값을 가져옴.
	const { schDeliveryDt, schStorerKey, schDcCode } = searchForm.getFieldsValue();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	// 엑셀 업로드 모달 ref
	const refModalExcel = useRef(null);

	const apiCustPopup = getSearchPopupApiFunction('cust');

	// 파일 업로드 팝업 관련 상태
	const [fileUploadParams, setFileUploadParams] = useState<any>(null);
	const [fileBtn, setFileBtn] = useState<any>(null);

	// 개인정보 팝업
	const refModalIndividualPop = useRef(null);
	const [popUpParams, setPopUpParams] = useState({});

	// const userDccodeList = getUserDccodeList('') ?? [];
	// const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode); // 사용자 dcCode
	// const storerKey = useAppSelector(state => {
	// 	return state.global.globalVariable.gStorerkey;
	// }); // 사용자 정보
	// const searchDcCode = useAppSelector(state => {
	// 	return state.global.globalVariable.gDccode;
	// }); // 사용자 정보

	// //console.log(`tab2 storerKey : ${schStorerKey}`);
	// //console.log(`tab2 searchDcCode : ${schDcCode}`);
	// //console.log(`tab2 schDeliveryDt : ${schDeliveryDt}`);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 *
	 */

	/**
	 * 입력 받은 날이 오늘보다 작은지 여부를 확인한다.
	 * @param {any} oldValue 예전 date
	 * @param {any} newValue 신규 선택 date
	 * @returns
	 */
	const validateToDateByToDay = (oldValue: any, newValue: any) => {
		// 오늘 이전 날짜 선택 불가
		const selectedDate = dayjs(newValue);
		const today = dayjs().startOf('day');
		const isValid = !selectedDate.isBefore(today);
		if (!isValid) {
			return {
				validate: false,
				message: '오늘 이후의 날짜를 입력해주세요.',
			};
		}
		return { validate: true };
	};

	/**
	 * 파일 업로드 팝업 열기
	 * @param {any} rowData 그리드 행 데이터
	 */
	const openFileUploadPopup = (rowData: any) => {
		setFileUploadParams({
			issueNo: rowData.issueNo,
			dcCode: rowData.dcCode,
			rowIndex: rowData.rowIndex,
			status: rowData.status,
			onSave: (fileCount: number) => {
				// 파일 저장 후 그리드 업데이트
				gridRef.current.setCellValue(rowData.rowIndex, 'fileCnt', fileCount);
				refModal2.current.handlerClose();
			},
		});
		setTimeout(() => refModal2.current?.handlerOpen(), 0);
	};

	/**
	 * 파일 업로드 팝업 닫기
	 */
	const closeFileUploadPopup = () => {
		refModal2.current?.handlerClose();
		setFileUploadParams(null);
	};

	/**
	 * 엑셀 업로드 팝업 열기
	 */
	const openExcelUploadPopup = () => {
		refModalExcel.current?.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeExcelUploadPopup = () => {
		refModalExcel.current?.handlerClose();
	};

	/**
	 * row 이동 할때마다 호출됨.
	 * @param {any} event 이동한 row 정보
	 */
	// const selectionChangeRow = (event: any) => {
	// 	const { rowIndex, dataField, item } = event;
	// };

	/**
	 * 상태값이 90 미만인 경우에만 edit 가능 하게 처리.
	 * @param {number} rowIndex row 의 index
	 * @param {number} columnIndex 컬럼의 index
	 * @param {any} value cell 의 value
	 * @param {string} headerText cell의 헤더 value
	 * @param {any} item row 의 모든 정보
	 * @returns
	 */
	const disablCellStyle = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		////console.log(((item.rowStatus);
		if (item?.rowStatus !== 'I' && Number(item?.status || 0) >= 90) {
			// 편집 가능 class 삭제
			gridRef.current.removeEditClass(columnIndex);
		} else {
			// 편집 가능 class 추가
			return 'isEdit';
		}
	};

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Tab2 배송이슈 삭제
	 */
	const saveIssueDelete = () => {
		const checkedItems = gridRef.current.getCheckedRowItems();
		// const checkedItemsNewItem = gridRef.current.getCheckedRowItems().every((item: any) => {
		// 	return item.item.rowStatus === 'I';
		// });

		// 체크된 행 없음
		if (commUtil.isEmpty(checkedItems)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 이미 확정된 건(status=90)은 삭제 불가
		if (checkedItems.some((checkedItem: any) => checkedItem.item.status === '90')) {
			showMessage({
				content: `확정처리된 내역은 삭제 할 수 없습니다. [이슈번호: ${
					checkedItems.find((checkedItem: any) => checkedItem.item.status === '90')?.item.issueNo
				}]`,
				modalType: 'info',
			});
			return;
		}

		const itemList = checkedItems.map((obj: any) => obj.item);
		const newRowBoolean = itemList.some((row: any) => row.rowStatus === 'I'); // 신규row 있어?
		const rowBoolean = itemList.some((row: any) => row.rowStatus !== 'I'); // 기존 row 있어?
		if (newRowBoolean) {
			gridRef?.current?.deleteRowItems();
		}

		if (!rowBoolean) return false; // 기존 row 삭제가 없으면 정지.

		const saveRow = itemList.filter((item: any) => item.rowStatus !== 'I');

		// 삭제하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_001'), async () => {
			apiDeleteMasterList(saveRow).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_CFM_001'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Tab2 배송이슈 저장(신규/수정)
	 */
	const saveIssueList = () => {
		// { allRowYn: false, // 모든 행 반환 여부
		// validationYn: true, //  required 검증여부
		// andCheckedYn: true,} // 체크박스 AND 조건여부(default : true)
		const updatedItems = gridRef.current.getChangedData();

		// 필수값 검증(deliverydt, custkey, issuecode, workqty, uom, drivername, phone)
		// if (!gridRef.current.validateRequiredGridData()) return;

		if (commUtil.isEmpty(updatedItems)) return false;

		// 서버 전송 전 전화번호에서 숫자와 별표(*)만 남기도록 정제
		updatedItems.forEach((item: any) => {
			if (item.phone) {
				item.phone = item.phone.replace(/[^0-9*]/g, '');
			}
		});

		/**
		 * 배송이슈코드기반 조건부 필수값
		 */
		// 배송이슈코드 06(일부결품), 07(추가결품), 10(후속지연(일부상품)) => sku( 상품 코드 ) 체크
		if (updatedItems.some((item: any) => ['06', '07', '10'].includes(item.issueCode))) {
			if (!gridRef.current.validateRequiredGridData(['sku'])) return;
		}
		// 배송이슈코드 02(비대면납품) => storagetype ( 상태 )
		if (updatedItems.some((item: any) => ['02'].includes(item.issueCode))) {
			if (!gridRef.current.validateRequiredGridData(['storageType'])) return;
		}
		// 배송이슈코드 01(배송지연), 02(비대면납품), 03(결품등재후 정상), 04(파손상태), 09(냉장고문열림(잠금완료)), 10(후속지연(일부상품))=> deliverytime(출고일자)
		if (updatedItems.some((item: any) => ['01', '02', '03', '04', '09', '10'].includes(item.issueCode))) {
			if (!gridRef.current.validateRequiredGridData(['deliveryTime'])) return;
		}
		// 배송이슈코드 02, 03, 04 => deliveryplace
		if (updatedItems.some((item: any) => ['02', '03', '04'].includes(item.issueCode))) {
			if (!gridRef.current.validateRequiredGridData(['deliveryPlace'])) return;
		}
		// 배송이슈코드 06, 07 => reasoncode
		if (updatedItems.some((item: any) => ['06', '07'].includes(item.issueCode))) {
			if (!gridRef.current.validateRequiredGridData(['reasonCode'])) return;
		}

		gridRef.current.showConfirmSave(() => {
			apiSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	/**
	 * Tab2 배송이슈 확정 저장
	 */
	const saveIssueConfirm = async () => {
		const checkedItems = gridRef.current.getCheckedRowItems();

		// 아직 저장되지 않은(이슈번호가 비어있는)건을 확정하려고 하면
		if (checkedItems.some((checkedItem: any) => !checkedItem.item.issueNo)) {
			showMessage({
				content: `신규등록건은 저장하신 후에 확정처리 해주세요 [행번: ${
					checkedItems.find((checkedItem: any) => !checkedItem.item.issueNo)?.rowIndex + 1
				}]`,
				modalType: 'info',
			});
			return;
		}

		// 이미 확정된(status = 90) 건은 재처리 불가
		if (checkedItems.some((checkedItem: any) => checkedItem.item.status === '90')) {
			showMessage({
				content: `확정처리된 내역은 재처리 할 수 없습니다. [번호: ${
					checkedItems.find((checkedItem: any) => checkedItem.item.status === '90')?.item.issueNo
				}]`,
				modalType: 'info',
			});
			return;
		}

		// 필수값 검증(deliverydt, custkey, issuecode, workqty, uom, drivername, phone)
		if (!gridRef.current.validateRequiredGridData()) return;

		if (!checkedItems || checkedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		const rows = checkedItems.map((item: any) => item.item);

		showConfirm(null, t('msg.MSG_COM_CFM_022'), () => {
			apiConfirmMasterList(rows).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 */
		// const gridRef = props.gridRef;

		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (commUtil.isNotEmpty(data)) {
				gridRef?.current.setSelectionByIndex(0);
			}
		});

		// grid 의 edit 될지 안될지를 최우선으로 판단.
		gridRef?.current.bind('cellEditBegin', (e: any) => {
			const itemRow = e.item;
			const colId = e.dataField;
			if (colId === 'deliveryDt' && itemRow.rowStatus === 'I') {
				return true;
			}

			if (colId !== 'fileCnt' && Number(itemRow.status) >= 90) {
				// edit 활성화 가능 한지 판단.
				// //console.log('파일 갯수 빼고 모두 체크편집 불가');
				return false;
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.

			gridRef.current.addCheckedRowsByValue('issueNo', event.item.issueNo);

			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', event.item.rowStatus === 'I' ? 'I' : 'U');
		});

		gridRef.current?.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = {
				url: 'api/tm/issue/v1.0/getDetailList', // 팝업 URL 설정
				individualKey: '',
				individualColId: event.dataField, // 개인정보 복호화 컬럼값
				issueNo: gridRef.current?.getCellValue(event.rowIndex, 'issueNo'), // 1건 조회하는 key 설정
				method: 'post',
			}; // 팝업 파라미터 초기화

			// 수신자
			if (event.dataField === 'driverName') {
				params.individualColId = 'userNm';
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 수령자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'phone') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(userNm: 주문자명)
				fnCmIndividualPopup(params);
			}
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 신규
				initValues: {
					rowStatus: 'I',
					dcCode: schDcCode,
					storerKey: schStorerKey,
					deliveryDt: schDeliveryDt ? dayjs(schDeliveryDt).format('YYYYMMDD') : '',
					status: '00',
				},
			},
			{
				btnType: 'delete', // 삭제
				callBackFn: saveIssueDelete,
				isActionEvent: false, // callback 전처리 사용 유무 사용 안함 설정 하고 callBackFn 에서 신규 row 및 기존 row 삭제 로직 처리 함.
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveIssueList,
			},
			{
				btnType: 'btn1', // 확정
				callBackFn: saveIssueConfirm,
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 배송이슈번호
			headerText: t('lbl.TMISSUENO'),
			dataField: 'issueNo',
			dataType: 'code',
			editable: false,
		},
		{
			// 출고일자
			headerText: t('lbl.DOCDT_WD'),
			dataField: 'deliveryDt',
			required: true,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				defaultFormat: 'yyyymmdd', // 달력 선택 시 데이터에 적용되는 날짜 형식
				// validator: validateToDateByToDay,
			},
			styleFunction: disablCellStyle,
		},
		{
			// 관리처코드
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataField: 'custKey',
			required: true,
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'cust',
				searchDropdownProps: {
					dataFieldMap: {
						custKey: 'code',
						custName: 'name',
					},
				},
				onClick: function (e: any) {
					const { dataField, columnIndex, item, rowIndex } = e;
					if (Number(item?.status || 0) < 90) {
						refModal.current.open({
							gridRef: gridRef, // 배송 이슈 목록 grid
							rowIndex: e.rowIndex,
							dataFieldMap: { custKey: 'code', custName: 'name' },
							popupType: 'cust',
						});
					}
				},
			},
			styleFunction: disablCellStyle,
		},
		{
			// 관리처명
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataField: 'custName',
			dataType: 'string',
			editable: false,
		},
		{
			// 배송이슈코드
			headerText: t('lbl.TMISSUECODE'),
			dataField: 'issueCode',
			required: true,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TMISSUE_CODE', value)?.cdNm;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TMISSUE_CODE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) {
					// return true 이면 드랍다운리스트 비활성화(disabled) 처리
					if (Number(item.status) < 90) {
						return false; // 활성화.
					}
					return true; // 비활성화 처리
				},
			},
			styleFunction: disablCellStyle,
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
				},
				onClick: function (e: any) {
					const { dataField, columnIndex, item, rowIndex } = e;
					if (Number(item?.status || 0) < 90) {
						refModal.current.open({
							gridRef: gridRef,
							rowIndex: e.rowIndex,
							dataFieldMap: { sku: 'code', skuName: 'name' },
							popupType: 'sku',
						});
					}
				},
			},
			styleFunction: disablCellStyle,
		},
		{
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuName',
			dataType: 'default',
			editable: false,
		},
		{
			// 상태
			headerText: t('lbl.STATUS_1'),
			dataField: 'storageType',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STORAGETYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				// renderer 일 경우에만 작동함.
				// disabledFunction: function (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) {
				// 	// 행 아이템의 name 이 Anna 라면 드랍다운리스트 비활성화(disabled) 처리
				// 	if (Number(item.status || 0) < 90) {
				// 		return false;
				// 	}
				// 	return true;
				// },
			},
			styleFunction: disablCellStyle,
		},
		{
			// 주문수량
			headerText: t('lbl.ORDERQTY'),
			dataField: 'orderQty',
			dataType: 'numeric',
			styleFunction: disablCellStyle,
		},
		{
			// 출고수량
			headerText: t('lbl.QTY_WD'),
			dataField: 'workQty',
			required: true,
			dataType: 'numeric',
			styleFunction: disablCellStyle,
		},
		{
			// 확인수량
			headerText: t('lbl.CHK_QTY'),
			dataField: 'confirmQty',
			dataType: 'numeric',
			styleFunction: disablCellStyle,
		},
		{
			// 단위
			headerText: t('lbl.UOM'),
			dataField: 'uom',
			required: true,
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TMISSUE_UOM', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TMISSUE_UOM', value)?.cdNm;
			},
			styleFunction: disablCellStyle,
		},
		{
			// 기사명
			headerText: t('lbl.DRIVERNAME'),
			dataField: 'driverName',
			required: true,
			dataType: 'default',
			styleFunction: disablCellStyle,
		},
		{
			// 전화번호
			headerText: t('lbl.PHONE'),
			dataField: 'phone',
			required: true,
			dataType: 'code',
			editRenderer: {
				type: 'InputEditRenderer',
				maxlength: 13, // 휴대폰 번호 최대 길이 (하이픈 포함 13자)
				// validator: (oldValue: any, newValue: any, item: any) => {
				// 	// 유효성 검사 (옵션)
				// 	const isValid = /^\d{9,11}$/.test(newValue);
				// 	return { validate: isValid, message: '올바른 전화번호 형식이 아닙니다.' };
				// },
			},
			styleFunction: disablCellStyle,
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (!value) return '';
				// 숫자와 별표(*)만 남긴 후, 전화번호 형식에 맞게 하이픈 추가
				return value.replace(/[^0-9*]/g, '').replace(/^([0-9*]{2,3})([0-9*]{3,4})([0-9*]{4})$/, `$1-$2-$3`);
			},
		},
		{
			// 도착시간
			headerText: t('lbl.INCOMINGDATETIME'),
			dataField: 'deliveryTime',
			dataType: 'code',
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				placeholder: 'HH:MM',
			},
			editable: true,
			// styleFunction: disablCellStyle,
		},
		{
			// 배송장소
			headerText: t('lbl.DELIVERYPLACE'),
			dataField: 'deliveryPlace',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TMISSUE_PLACE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TMISSUE_PLACE', value)?.cdNm;
			},
			editable: true,
			// styleFunction: disablCellStyle,
		},
		{
			// 사유코드
			headerText: t('lbl.REASONCODE'),
			dataField: 'reasonCode',
			dataType: 'code',
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TMISSUE_REASON_CODE', ''), // 결품 사유 코드
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) {
					// return true 이면 비활성화(disabled) 처리
					if (Number(item.status) < 90) {
						if (item.issueCode === '06' || item.issueCode === '07') {
							return false;
						}
						return true;
					}
					return true;
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TMISSUE_STATUS', value)?.cdNm;
			},
			editable: true,
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: string,
			) => {
				if (Number(item.status || 0) < 90) {
					if (item.issueCode === '06' || item.issueCode === '07') {
						return 'isEdit';
					}
				}
				return gridRef.current.removeEditClass(columnIndex);
			},
		},
		{
			// 기타
			headerText: t('lbl.ETC'),
			dataField: 'reasonMsg',
			styleFunction: disablCellStyle,
		},
		{
			// 첨부파일
			headerText: t('lbl.ATTACHFILE'),
			dataField: 'fileCnt',
			dataType: 'numeric',
			editable: false,
			width: 120,
			commRenderer: {
				type: 'search',
				align: 'center',
				iconPosition: 'right',
				onClick: function (e: any) {
					if (e.item?.rowStatus === 'I') {
						showMessage({
							content: '저장 후 첨부 파일 등록 해주세요.',
							modalType: 'info',
						});
						return false;
					}
					openFileUploadPopup({
						issueNo: e.item.issueNo,
						rowIndex: e.rowIndex,
						status: e.item.status,
					});
				},
			},
			styleFunction: disablCellStyle,
		},
		{
			// 진행상태
			headerText: t('lbl.STATUS'),
			dataField: 'status',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TMISSUE_STATUS', value)?.cdNm;
			},
			editable: false,
		},
		{
			// 등록자
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			// 등록일시
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			// 수정자
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			// 수정일시
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			// 물류센터
			headerText: t('lbl.DCCODE'),
			dataField: 'dcCode',
			visible: false,
		},
		{
			// 고객회사코드
			headerText: t('lbl.STOREKEY'),
			dataField: 'storerKey',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,
		isLegacyRemove: true, // 신규행이 아닌 그리드도 삭제 가능한 옵션(auIGridUtil.ts 참고)

		// selectionChange: selectionChangeRow,

		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModalIndividualPop.current.handlerOpen();
	};
	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent01 = () => {
		refModalIndividualPop.current.handlerClose();
	};

	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		// if (gridRef.current) {
		gridRef.current?.setGridData(data);
		gridRef.current?.setSelectionByIndex(0, 0);

		if (data && data.length > 0) {
			// 데이터 설정 후 컬럼 크기 자동 조정
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			gridRef.current.setColumnSizeList(colSizeList);
		}
		// }
	}, [data, ref, gridRef]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Button onClick={openExcelUploadPopup}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal2} width="1000px">
				{fileUploadParams && (
					<TmIssueFileUploadPopup
						issueNo={fileUploadParams.issueNo}
						dcCode={fileUploadParams.dcCode}
						status={fileUploadParams.status}
						close={closeFileUploadPopup}
						onSave={fileUploadParams.onSave}
					/>
				)}
			</CustomModal>
			<CustomModal ref={refModalExcel} width="1000px">
				<TmIssueUploadExcelPopup dcCode={schDcCode} storerKey={schStorerKey} close={closeExcelUploadPopup} />
			</CustomModal>
			{/* 개인정보 팝업 */}
			<CustomModal ref={refModalIndividualPop} width="700px" draggable={true}>
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent01} />
			</CustomModal>
		</>
	);
});

export default TmCrmWmsMemoTab2;
