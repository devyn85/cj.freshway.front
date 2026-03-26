/*
 ############################################################################
 # FiledataField	: MsPopMngDetail.tsx
 # Description		: 기준정보 > 권역기준정보 > 거래처별POP관리
 # Author			: JeongHyeongCheol
 # Since			: 25.07.18
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import CmCustInfoPopup from '@/components/cm/popup/CmCustInfoPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import MsPopMngMainPopup from '@/components/ms/popMng/MsPopMngMainPopup';
import MsPopMngUploadExcelPopup from '@/components/ms/popMng/MsPopMngUploadExcelPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import dayjs from 'dayjs';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// util
import { showConfirm } from '@/util/MessageUtil';

// API Call Function
import {
	apiGetMasterList,
	apiGetRolltainerList,
	apiPostSaveMasterList,
	apiPostSaveMasterResend,
} from '@/api/ms/apiMsPopMng';

// types
import { GridBtnPropsType } from '@/types/common';
interface MsPopMngDetailProps {
	gridData?: Array<object>;
	dccode?: string;
	search?: any;
}
const MsPopMngDetail = forwardRef((props: MsPopMngDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search } = props;
	const { t } = useTranslation();
	const refModalPop = useRef(null);
	const refModalPop2 = useRef(null);
	const refModalExcel = useRef(null);
	const refModalMain = useRef(null);
	const refRolltainerList = useRef([]);
	// const refPopnoList = useRef([]);
	const refCarnoList = useRef([]);
	const [popupType, setPopupType] = useState('');
	const [totalCnt, setTotalCnt] = useState(0);
	const [custModalParam, setCustModalParam] = useState<any>({});
	const [dccode, setDccode] = useState('');

	const dates = dayjs();
	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 저장조건
	const custtypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	// 롤테이너 // 20260323 -> 0 도 사용하기 때문에 0이 미지정으로 보이지 않도록 수정되어야 함
	const rolltainerLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return value === '-1' ? '미지정' : value;
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'popno',
			headerText: t('lbl.POPNO'), // POP번호
			minWidth: 90,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'carPOP2',
				searchDropdownProps: {
					dataFieldMap: {
						popno: 'name',
						carno: 'code',
					},
					// callbackBeforeUpdateRow: (e: any) => {
					// 	setPopupType('carPOP');
					// 	const selectRow = [e];
					// 	confirmPopup(selectRow);
					// },
				},
				onClick: (e: any) => {
					// if (e.item.rowStatus === 'I') {
					setPopupType('carPOP2');
					refModalPop.current.handlerOpen();
					// } else {
					// onOpenCustModal(e.item);
					// }
				},
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'custtype',
			headerText: t('lbl.STORERTYPE'),
			labelFunction: custtypeLabelFunc,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUST_CODE'),
			minWidth: 110,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'cust',
				searchDropdownProps: {
					dataFieldMap: {
						custkey: 'code',
						custname: 'name',
						custtype: 'custType',
					},
				},
				onClick: (e: any) => {
					if (e.item.rowStatus === 'I') {
						setPopupType('cust');
						refModalPop.current.handlerOpen();
					} else {
						onOpenCustModal(e.item);
					}
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'),
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'), // 차량번호
			editRenderer: {
				type: 'DropDownListRenderer',
				listFunction: (rowIndex: number, colIndex: number, rowItem: any) => {
					dataListSet();
					refCarnoList.current = [];
					refRolltainerList.current.forEach((item: any) => {
						if (item.popno === rowItem.popno && item.dccode === rowItem.dccode) {
							const combo = {
								comGrpCd: 'carno',
								cdNm: item.carno,
								comCd: item.carno,
							};
							refCarnoList.current.push(combo);
						}
					});
					refCarnoList.current.unshift({
						comGrpCd: 'carno',
						cdNm: '선택',
						comCd: '',
					});
					return refCarnoList.current;
				},
				keyField: 'comCd',
				valueField: 'cdNm',
			},

			required: true,
		},
		{
			dataField: 'rolltainerNo',
			headerText: '롤테이너',
			editRenderer: {
				type: 'DropDownListRenderer',
				listFunction: (rowIndex: number, colIndex: number, rowItem: any) => {
					// list 필터링
					const rolltainerList = [];
					const filteredList = refRolltainerList.current.filter((listItem: any) => {
						return rowItem.carno === listItem.carno && rowItem.popno === listItem.popno;
					});
					if (filteredList?.length === 0) {
						return [{ comGrpCd: 'rolltainerNo', cdNm: '미지정', comCd: '-1' }];
					}
					// 필터링된 아이템을 기준으로 범위 생성
					const targetItem = filteredList[0];
					const startNo = Number(targetItem.rolltainerStartNo);
					const endNo = Number(targetItem.rolltainerEndNo);
					// rolltainerNo 범위에 해당하는 목록 생성
					// 0도 유효한 번호로 인식되도록, 원본 데이터가 비어있지 않은지 명시적으로 체크
					if (
						String(targetItem.rolltainerStartNo || '').trim() !== '' &&
						String(targetItem.rolltainerEndNo || '').trim() !== ''
					) {
						for (let i = startNo; i <= endNo; i++) {
							rolltainerList.push({
								comGrpCd: 'rolltainerNo',
								cdNm: String(i),
								comCd: String(i),
							});
						}
					}

					// 유효한 시작/종료 번호가 없어서 리스트가 생성되지 않은 경우 예외 처리
					// if (rolltainerList.length === 0) {
					// 	return [{ comGrpCd: 'rolltainerNo', cdNm: '미지정', comCd: '0' }];
					// }
					return rolltainerList;
				},
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			dataType: 'code',
			labelFunction: rolltainerLabelFunc,
		},

		{
			dataField: 'custgroup',
			headerText: '고객분류',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromdate',
			headerText: '변경시작일자',
			dataType: 'date',
			commRenderer: {
				type: 'calender',
				// showExtraDays: true,
				onlyCalendar: false,
			},
			required: true,
		},
		// {
		// 	dataField: 'todate',
		// 	headerText: t('lbl.APL_END_DT'), // 적용종료일자
		// 	dataType: 'date',
		// 	editable: false,
		// },
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
			headerText: t('lbl.ADDDATE'), // 등록일시
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
	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * pop 차량번호 롤테이너 list set
	 */
	const dataListSet = () => {
		apiGetRolltainerList().then(res => {
			if (res.data) {
				refRolltainerList.current = res.data;
				// refPopnoList.current = _.uniqBy(res.data, 'popno');
			}
		});
	};

	/**
	 * 거래처별POP관리 정보 변경사항 저장
	 * @param data
	 * @returns {boolean}
	 */
	const checkDuplicateCarno = (data: any) => {
		const carnoCheck = new Map();

		for (const row of data) {
			const { dccode, popno, custkey, carno } = row;

			const key = `${dccode}-${popno}-${custkey}`;

			// Map에 해당 key가 이미 있는지 확인
			if (carnoCheck.has(key)) {
				// key가 이미 존재하면, 이전에 저장된 carno와 현재 carno 비교
				const existingCarno = carnoCheck.get(key);
				if (existingCarno !== carno) {
					return true;
				}
			} else {
				// key가 없으면 현재 carno를 Map에 저장
				carnoCheck.set(key, carno);
			}
		}
		return false;
	};

	/**
	 * 거래처별POP관리 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		const params = gridRef.current.getChangedData({ validationYn: false });
		// 변경 데이터 확인
		if (!params || params?.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 동일 pop 거래처에서 차량번호가 다를경우
		const carnoDuplicate = checkDuplicateCarno(params);
		if (carnoDuplicate) {
			showMessage({
				content: '거래처별 차량번호는 하나만 가능합니다.',
				modalType: 'info',
			});
			return;
		}
		// 변경시작일자 체크
		const dateCheck = params.some((item: any) => item.fromdate < dates.add(3, 'day').format('YYYYMMDD'));
		if (dateCheck) {
			showMessage({
				content: '변경시작일은 등록일기준(오늘) 3일 이후부터 등록가능합니다.',
				modalType: 'info',
			});
			return;
		}
		// 롤테이너 확인
		const rolltainerCheck = params.some((item: any) => item.rolltainerNo === '-1' || item.rolltainerNo === '');
		if (rolltainerCheck) {
			showMessage({
				content:
					'롤테이너 번호는 필수 입력 항목입니다. 롤테이너 선택 리스트에 선택할 정보가 없는 경우 배송권역별차량관리 화면에서 POP번호와 차량번호에 해당하는 롵테이너 정보 등록 후 진행하여 주시기 바랍니다.',
				modalType: 'info',
			});
			return;
		}
		// 고객코드확인
		const custname = params.some((item: any) => item.custname);
		if (!custname) {
			showMessage({
				content: '고객코드를 확인해주세요',
				modalType: 'info',
			});
			return;
		}
		// PK validation
		if (!gridRef.current.validatePKGridData(['dccode', 'custkey', 'fromdate'])) {
			return;
		}
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(params).then(res => {
				if (res.data.statusCode > -1) {
					// gridRef.current.setSelectedRowValue({ ...params, rowStatus: 'R' });
					// gridRef.current.setAllCheckedRows(false);
					// gridRef.current.resetUpdatedItems();
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

	const bcrYn = () => {
		if (globalVariable.gDccode === '2620' || globalVariable.gDccode === '2630') {
			return '1';
		} else {
			return 'N';
		}
	};
	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',
					dccode: props.dccode,
					storerkey: globalVariable.gStorerkey,
					rolltainerNo: '0',
					bcrYn: bcrYn(),
					fromdate: dates.add(3, 'day').format('YYYYMMDD'),
				},
				callBackFn: () => {
					dataListSet();
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '일괄재전송(구매)',
				authType: 'new',
				callBackFn: async () => {
					const param = {
						dccode: props.dccode,
					};

					// 일괄 재전송 데이터 체크 해당 물류센터 코드에 필수값이 없으면 중단
					const dccodeData = await apiGetMasterList(param);

					const isResend = dccodeData.data.some(
						(item: any) => !item.carno || !item.popno || !item.custkey || !item.fromdate,
					);

					if (isResend) {
						showMessage({
							content: '물류센터 기준의 필수값 확인 후, 진행하시기 바랍니다.',
							modalType: 'info',
						});
						return;
					}

					showConfirm(
						null,
						props.dccode +
							'센터의 POP내역 일괄재전송을 진행 하시겠습니까?\n(당일 및 당일 이후에 적용되는건 전체가 구매시스템으로 재전송됩니다.)',
						() => {
							apiPostSaveMasterResend(param).then(() => {
								// showMessage({
								// 	content: t('msg.MSG_COM_SUC_003'),
								// 	modalType: 'info',
								// });
							});
						},
					);
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 대표POP변경 btn
	 */
	const changePOPPop = () => {
		setDccode(props.dccode);
		refModalMain.current.handlerOpen();
	};

	/**
	 * 엑셀업로드 btn
	 */
	const uploadExcelPop = () => {
		refModalExcel.current.handlerOpen();
	};

	/**
	 * 창고팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		if (selectedRow && gridRef.current) {
			setTimeout(() => {
				const index = gridRef.current.getSelectedIndex()[0];
				if (popupType === 'carPOP2') {
					gridRef.current?.setCellValue(index, 'popno', selectedRow[0].name);
					gridRef.current?.setCellValue(index, 'carno', selectedRow[0].code);
					// gridRef.current?.setCellValue(index, 'custtype', selectedRow[0].custType);
				} else if (popupType === 'cust') {
					gridRef.current?.setCellValue(index, 'custkey', selectedRow[0].code);
					gridRef.current?.setCellValue(index, 'custname', selectedRow[0].name);
					gridRef.current?.setCellValue(index, 'custtype', 'C');
				}
				refModalPop.current?.handlerClose();
			}, 0);
		}
	};

	// 상품정보상세 팝업 열기
	const onOpenCustModal = (row: any) => {
		const params = row;
		setCustModalParam(params);
		refModalPop2.current.handlerOpen();
	};
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current?.handlerClose();
		refModalPop2.current?.handlerClose();
		refModalExcel.current?.handlerClose();
		refModalMain.current?.handlerClose();
		setCustModalParam({});
	};

	const initEvent = () => {
		// gridCell 편집 시작 event
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행 -> 거래처조회popup 기존행 -> 거래처상세
			if (event.dataField === 'custkey' && event.item.rowStatus !== 'I') {
				onOpenCustModal(event.item);
				return false;
			} else if (event.dataField === 'carno' && commUtil.isNotEmpty(event.item.carno)) {
				apiGetRolltainerList().then(res => {
					if (res.data) {
						refRolltainerList.current = res.data;
					}
				});
				return true;
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		// gridCell 편집 종료 event
		gridRef.current?.bind('cellEditEnd', function (event: any) {
			// 변경시작일자
			if (event.dataField === 'fromdate' && event.item.fromdate < dates.add(3, 'day').format('YYYYMMDD')) {
				showMessage({
					content: '변경시작일은 등록일기준(오늘) 3일 이후부터 등록가능합니다.',
					modalType: 'info',
				});
				const beforeSet = {
					fromdate: event.oldValue,
				};
				gridRef.current.updateRow(beforeSet, event.rowIndex);
			}
			// // POP번호
			// if (event.dataField === 'popno') {
			// 	// 직접 입력시 존재하는 POP번호인지 확인
			// 	const match = refRolltainerList.current.filter((item: any) => {
			// 		return event.value === item.popno;
			// 	});

			// 	if (match?.length === 0) {
			// 		showMessage({
			// 			content: '존재하지 않는 POP번호입니다. 다시 확인하고 입력해주세요.',
			// 			modalType: 'info',
			// 		});
			// 		const beforeSet = {
			// 			popno: event.oldValue,
			// 		};
			// 		gridRef.current.updateRow(beforeSet, event.rowIndex);
			// 	} else {
			// 		// 차량번호와 POP번호 매칭여부 확인
			// 		const isCarnoMatched = match.some(item => {
			// 			return event.item.carno === item.carno;
			// 		});

			// 		// 일치하는 carno가 없을 경우에만 carno를 공백으로 변경
			// 		if (!isCarnoMatched) {
			// 			const updateSet = {
			// 				carno: '',
			// 				rolltainerNo: '',
			// 			};
			// 			gridRef.current.updateRow(updateSet, event.rowIndex);
			// 		}
			// 	}
			// }

			// 차량번호 수정시
			if (event.dataField === 'carno' && event.oldValue !== event.value) {
				const updateSet = {
					rolltainerNo: '',
				};
				gridRef.current.updateRow(updateSet, event.rowIndex);
			}
		});
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);
			setTotalCnt(props.gridData?.length);
			dataListSet();
			if (props.gridData?.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={totalCnt}>
					<Button onClick={changePOPPop}>미주문 고객 POP해제</Button>
					<Button onClick={uploadExcelPop}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsPopMngUploadExcelPopup close={closeEvent} />
			</CustomModal>
			<CustomModal ref={refModalMain} width="1000px">
				<MsPopMngMainPopup close={closeEvent} dccode={dccode} />
			</CustomModal>
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={refModalPop2} width="1000px">
				<CmCustInfoPopup titleName={'거래처상세'} apiParams={custModalParam} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsPopMngDetail;
