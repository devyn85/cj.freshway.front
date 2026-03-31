/*
  ############################################################################
 # FiledataField	: MsTplUserDetail.tsx
 # Description		: 정산 > 위탁물류 >  화주정보관리
 # Author			: ParkYoSep
 # Since			: 2025.10.27
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
// Utils
// Redux
// API Call Function
import { apiSaveMasterList, getUserList } from '@/api/ms/apiMsTplUser';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { getUserDccodeList } from '@/store/core/userStore';

const MsTplUserDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const refModal = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const refModalPop = useRef(null);
	const [popupType, setPopupType] = useState('');
	const refUserList = useRef([]);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param s1
	 * @param e1
	 * @param s2
	 * @param e2
	 */
	const getUserListCall = () => {
		getUserList().then(res => {
			if (res.data.length > 0) {
				refUserList.current = res.data;
			} else {
				refUserList.current = null;
			}
		});
	};
	const closeEvent = () => {
		// modalRef1.current.handlerClose();
		setIsModalOpen(false);
	};

	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const changedData = ref.gridRef.current.getChangedData({ validationYn: false });
		if (!changedData || changedData.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
			return;
		}
		// // 필수 입력 필드 유효성 검사
		if (!ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 1. 날짜 유효성 검사
		for (const currentRow of changedData) {
			if (currentRow.fromDate && currentRow.toDate && dayjs(currentRow.fromDate).isAfter(dayjs(currentRow.toDate))) {
				showAlert('날짜 오류', '시작일자는 종료일자보다 늦을 수 없습니다. 데이터를 확인해주세요.');
				return;
			}
		}
		executeSave(changedData);
	};

	/**
	 * 그리드 데이터를 API를 통해 저장하는 함수
	 * @param dataToSave - 저장할 데이터 배열
	 */
	const executeSave = (dataToSave: any[]) => {
		ref.gridRef.current.showConfirmSave(() => {
			const saveList = { saveList: dataToSave };
			apiSaveMasterList(saveList)
				.then(res => {
					if (res.statusCode === 0) {
						ref.gridRef.current.clearGridData();
						props.search(); // 부모 컴포넌트 재조회
						showAlert('저장', '저장되었습니다.');
					}
				})
				.catch(() => false);
		});
	};

	/**
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};
	/**
	 * 거래처 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'cust') {
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'custKey', selectedRow[0].code);
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'custNm', selectedRow[0].name);
		} else if (popupType === 'partner') {
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'partnerCd', selectedRow[0].code);
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'partnerNm', selectedRow[0].name);
		}
		refModalPop.current.handlerClose();
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'frameOneUserId',
			headerText: '아이디',
			required: true,
			width: 140,
			editable: false,
		},
		{
			dataField: 'userId',
			headerText: t('lbl.USER'),
			required: true,
			width: 140,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							listFunction: function (rowIndex, columnIndex, item, dataField) {
								return refUserList.current;
							},
							keyField: 'userId',
							valueField: 'userNmList',
						};
					}
				},
			},
			labelFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				const user = refUserList.current.find(user => user.userId === value);
				return user ? user.userNm : value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				return item.rowStatus === 'I' ? 'isEdit' : ref.gridRef.current?.removeEditClass(columnIndex);
			},
		},
		{
			dataField: 'custKey',
			headerText: t('lbl.CUSTKEY_WD'),
			editable: false,
			// commRenderer: {
			// 	type: 'search',
			// 	iconPosition: 'right',
			// 	align: 'center',
			// 	popupType: 'cust',
			// 	searchDropdownProps: {
			// 		dataFieldMap: {
			// 			custKey: 'code',
			// 			custNm: 'name',
			// 		},
			// 	},
			// 	onClick: function (event: any) {
			// 		if (event.item?.rowStatus === 'I') {
			// 			setPopupType('cust');
			// 			refModalPop.current.handlerOpen();
			// 		}
			// 	},
			// },
			// labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return item.custKey ?? value;
			// },
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		ref.gridRef.current?.removeEditClass(columnIndex);
			// 	} else {
			// 		return 'isEdit';
			// 	}
			// },

			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'custNm',
			headerText: t('lbl.CUSTNAME_WD'),
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.PARTNER_CD'),
			dataField: 'partnerCd',
			dataType: 'text',
			required: true,
			editable: true,
			commRenderer: {
				type: 'search',
				popupType: 'partner',
				searchDropdownProps: {
					dataFieldMap: {
						partnerCd: 'code',
						partnerNm: 'name',
					},
				},
				onClick: function (e: any) {
					if (e.item?.rowStatus === 'I') {
						setPopupType('partner');
						refModalPop.current.handlerOpen({
							gridRef: ref,
							rowIndex: e.rowIndex,
							dataFieldMap: { custkey: 'code', custname: 'name' },
							popupType: 'partner',
						});
					}
				},
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return item.partnerCd ?? value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					ref.gridRef.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			width: 100,
		},
		{
			headerText: t('lbl.PARTNER_NAME'),
			dataField: 'partnerNm',
			dataType: 'string',
			editable: false,
			width: 220,
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			width: 150,
			required: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getUserDccodeList(),
							keyField: 'dccode', // key 에 해당되는 필드명
							valueField: 'dcname',
						};
					}
				},
			},
			labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
				return getUserDccodeList().find(item => item.dccode === value)?.dcname ?? value;
			},
			// labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
			// 	const list = getUserDccodeList().map((item: any) => ({
			// 		...item,
			// 		dcname: item.dccode ? `[${item.dccode}] ${item.dcname}` : item.dcname,
			// 	}));
			// 	const match = list.find(i => i.dccode == value);
			// 	return match ? match.dcname : value;
			// },
			filter: {
				showIcon: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		},
		// {
		// 	dataField: 'organize',
		// 	headerText: t('lbl.ORGANIZE'),
		// 	width: 110,
		// 	dataType: 'code',
		// 	editable: false,
		// 	commRenderer: {
		// 		type: 'search',
		// 		popupType: 'organize',
		// 		searchDropdownProps: {
		// 			dataFieldMap: {
		// 				toOrganize: 'code',
		// 				toOrganizeName: 'name',
		// 			},
		// 		},
		// 		onClick: function (e: any) {
		// 			if (e.item.rowStatus !== 'I' || !e.item.dcCode) return;
		// 			const rowIndex = e.rowIndex;
		// 			refModal.current.open({
		// 				gridRef: ref.gridRef,
		// 				rowIndex,
		// 				codeName: e.value,
		// 				customDccode: e.item.dcCode,
		// 				dataFieldMap: {
		// 					organize: 'code',
		// 					organizeNm: 'name',
		// 				},
		// 				popupType: 'organize',
		// 			});
		// 		},
		// 	},
		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		if (item.rowStatus !== 'I') {
		// 			ref.gridRef.current.removeEditClass(columnIndex);
		// 		} else {
		// 			return 'isEdit';
		// 		}
		// 	},
		// },

		// {
		// 	dataField: 'organizeNm',
		// 	headerText: t('lbl.ORGANIZENAME'),
		// 	dataType: 'text',
		// 	editable: false,
		// 	width: 140,
		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		ref.gridRef.current.removeEditClass(columnIndex);
		// 	},
		// },
		{
			dataField: 'fromDate',
			headerText: t('lbl.FROMDATE'),
			required: true,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd',
			width: 115,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false,
				showExtraDays: false,
				showTodayBtn: true,
				todayText: t('msg.todayText'),
			},
		},
		{
			dataField: 'toDate',
			headerText: t('lbl.TODATE'),
			required: true,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd',
			width: 115,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false,
				showExtraDays: false,
				showTodayBtn: true,
				todayText: t('msg.todayText'),
			},
		},
		{
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'code',
			editable: true,
			width: 150,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		ref.gridRef.current?.removeEditClass(columnIndex);
			// 	} else {
			// 		return 'isEdit';
			// 	}
			// },
		}, // 비고
		{
			dataField: 'addWhoName',
			headerText: t('lbl.ADDWHO'),
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{ dataField: 'addDate', headerText: t('lbl.REGDATTM'), dataType: 'code', width: 160, editable: false }, // 등록일자
		{
			dataField: 'editWhoName',
			headerText: t('lbl.EDITWHO'),
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{ dataField: 'editDate', headerText: t('lbl.EDITDATE'), dataType: 'code', width: 160, editable: false }, // 수정일시
	];

	// 그리드 Props
	const gridProps = {
		editable: true,

		showCustomRowCheckColumn: true,

		fillColumnSizeMode: false,
		enableCellMerge: true,
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{ btnType: 'copy', initValues: { rowStatus: 'I' } }, // 행복사, 개발할때 업데이트 편하라고 넣음 나중에 빼자
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',
					fromDate: dayjs().format('YYYYMMDD'), // 오늘 날짜 기본값 설정
					toDate: '29991231', // 종료일 기본값 설정
					dcCode: form.getFieldValue('dcCode'), // 검색 영역의 dcCode 값을 기본값으로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	/*** =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		getUserListCall();
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
		if (props.data.length > 0) {
			const colSizeList = gridRef.getFitColumnSizeList(true);
			gridRef.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	useEffect(() => {
		const grid = ref.gridRef.current;
		if (!grid) return;
		grid.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'fromDate' || event.dataField === 'toDate' || event.dataField === 'rmk') {
				return true;
			}
			return event.item.rowStatus === 'I';
		});
		grid.bind('cellEditEnd', (event: any) => {
			const userData = refUserList.current.find(user => user.userId === event.value);
			grid.setCellValue(event.rowIndex, 'custKey', userData.custKey);
			grid.setCellValue(event.rowIndex, 'dcCode', userData.dcCode);
			grid.setCellValue(event.rowIndex, 'custNm', userData.custNm);
			grid.setCellValue(event.rowIndex, 'frameOneUserId', userData.userId);
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
		</>
	);
});
export default MsTplUserDetail;
