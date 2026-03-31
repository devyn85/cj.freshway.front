/*
  ############################################################################
 # FiledataField	: TmTrasportRoutingDetail.tsx
 # Description		: 정산 > 운송비정산 >  수송경로관리 API
 # Author			: ParkYoSep
 # Since			: 2025.10.14
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
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import dayjs from 'dayjs';
// Utils
// Redux
// API Call Function

import { apipostDetailList, apiSaveDetailList, apiSaveMasterList } from '@/api/tm/apiTmTrasportRouting';
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TmtrasportRoutingExcelUpload from '@/components/tm/trasportRouting/TmTrasportRoutingExcelUpload';
import { Button, Form } from 'antd';
const TmTrasportRoutingDetail = forwardRef(
	(
		props: { form: any; data: any[]; totalCnt: number; search: () => void; dcCodeOptionsRef: React.RefObject<any[]> },
		ref: any,
	) => {
		/**
		 * =====================================================================
		 *  01. 변수 선언부
		 * =====================================================================
		 */
		// Declare variable(1/4)
		const { t } = useTranslation();
		const { form, dcCodeOptionsRef } = props; // Antd Form
		const refModal = useRef(null);
		const refModal1 = useRef(null);
		const dccodeList = getUserDccodeList();
		const modalRef1 = useRef(null);
		const fromDcCode = Form.useWatch('fromDcCode', form);
		const [currentMasterRow, setCurrentMasterRow] = useState<any>(null); // 선택된 마스터 행 전체 데이터를 저장할 state
		// Declare react Ref(2/4)
		ref.gridRef = useRef();
		ref.gridRef2 = useRef();

		// Declare init value(3/4)

		// 기타(4/4)
		/**
		 * 공통 코드 호출([comCd]cdNm)
		 * @param owIndex
		 * @param columnIndex
		 * @param value
		 * @returns
		 */
		const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
			const list = getCommonCodeList('WMS_MNG_DC', '공통', 'STD');
			const convert = list.map(item => ({
				...item,
				display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
			}));
			let result = null;
			if (!commUtil.isEmpty(convert)) {
				result = convert.find((el: any) => {
					if (el.comCd === value) {
						return el;
					}
				});
			}
			return result ? result.display : null;
		};

		/**
		 * =====================================================================
		 *  02. 함수
		 * =====================================================================
		 *
		 */
		/**
		 * @param s1
		 * @param e1
		 * @param s2
		 * @param e2
		 */
		const isDisjoint = (s1: string, e1: string, s2: string, e2: string) => {
			const start1 = dayjs(s1),
				end1 = dayjs(e1);
			const start2 = dayjs(s2),
				end2 = dayjs(e2);

			return end1.isBefore(start2) || end2.isBefore(start1);
		};

		// 운임단가 조회
		const searchDetailList = async (param: number) => {
			ref.gridRef2.current.clearGridData();

			const searchFormParams = props.form.getFieldsValue();

			// 조회 조건 설정
			const params = {
				routeSerialKey: param,
				fromDate: searchFormParams.date[0].format('YYYYMMDD'),
				toDate: searchFormParams.date[1].format('YYYYMMDD'),
			};

			// API 호출
			apipostDetailList(params).then(res => {
				if (res.data != null && res.data.length > 0) {
					ref.gridRef2.current.setGridData(res.data);
				}
			});
		};

		/**
		 * 모달 닫기
		 */
		const closeEvent = () => {
			modalRef1.current.handlerClose();
		};

		/**
		 * 엑셀 업로드 팝업
		 */
		const onExcelUploadPopupClick = () => {
			// currentMasterRow state를 사용하여 현재 선택된 행을 확인합니다.
			if (!currentMasterRow || !currentMasterRow.routeSerialKey) {
				showAlert(null, '운임단가를 엑셀 업로드하려면 먼저 저장된 노선을 선택해야 합니다.');
				return false;
			}

			// 모달을 열기 전에 선택된 행의 routeSerialKey를 state에 저장
			// setrouteSerialKey(currentMasterRow.routeSerialKey); // TmtrasportRoutingExcelUpload 컴포넌트에서 직접 currentMasterRow를 받도록 수정하여 이 state는 불필요해졌습니다.

			if (ref.gridRef2.current.getChangedData({ validationYn: false }).length > 0) {
				return showConfirm(
					null,
					t('msg.MSG_COM_CFM_009'),
					() => {
						modalRef1.current.handlerOpen();
					},
					() => {
						return false;
					},
				);
			} else {
				modalRef1.current.handlerOpen();
			}
		};

		/**
		 * 저장로직 - 노선
		 */
		const saveMaster = () => {
			const changedData = ref.gridRef.current.getChangedData({ validationYn: false });

			if (!changedData || changedData.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
					return;
				});
				return;
			}

			// 필수 입력 필드 유효성 검사
			if (!ref.gridRef.current.validateRequiredGridData()) {
				return;
			}

			// 1. 날짜, 창고 유효성 검사
			for (const currentRow of changedData) {
				if (currentRow.fromDate && currentRow.toDate && dayjs(currentRow.fromDate).isAfter(dayjs(currentRow.toDate))) {
					showAlert('날짜 오류', '시작일자는 종료일자보다 늦을 수 없습니다. 데이터를 확인해주세요.');
					return;
				}
				if (currentRow.fromDcCode === '2170' && !currentRow.fromOrganize) {
					showAlert('유효성 오류', '출발물류센터가 외부비축센터(2170)인 경우 출발창고는 필수값입니다.');
					return;
				}
				if (currentRow.toDcCode === '2170' && !currentRow.toOrganize) {
					showAlert('유효성 오류', '도착물류센터가 외부비축센터(2170)인 경우 도착창고는 필수값입니다.');
					return;
				}
			}

			executeSave(changedData);
		};

		/**
		 * 저장로직 - 운임단가
		 */
		const saveDetail = () => {
			const changedData = ref.gridRef2.current.getChangedData({ validationYn: false });

			if (!changedData || changedData.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
					return;
				});
				return;
			}

			// 필수 입력 필드 유효성 검사
			if (!ref.gridRef2.current.validateRequiredGridData()) {
				return;
			}

			const allRows = ref.gridRef2.current.getGridData();

			// 같은 행 판별용 UID 생성기
			const getUid = (r: any) => r._$uid ?? r.uid ?? r.serialKey;

			// 중복 검사를 위한 키 생성 함수
			const getKey = (r: any) => [r.courier, r.routeYn, r.contractType, r.storageType, r.ton].join('|');

			// 1. 날짜 유효성 검사
			for (const currentRow of changedData) {
				if (currentRow.fromDate && currentRow.toDate && dayjs(currentRow.fromDate).isAfter(dayjs(currentRow.toDate))) {
					showAlert('날짜 오류', '시작일자는 종료일자보다 늦을 수 없습니다. 데이터를 확인해주세요.');
					return;
				}
			}

			// 1-1. 신규행끼리 동일 항목 & 기간 겹침 → 저장 중단
			const newRows = changedData.filter((r: any) => r.rowStatus === 'I');
			if (newRows.length > 1) {
				const seen = new Map<string, any[]>();
				for (const n of newRows) {
					const k = getKey(n);
					if (!seen.has(k)) seen.set(k, []);
					const arr = seen.get(k)!;
					if (arr.some(x => !isDisjoint(x.fromDate, x.toDate, n.fromDate, n.toDate))) {
						showAlert('중복 오류', '새로 추가한 행들 사이에 동일한 조건과 겹치는 기간의 데이터가 있습니다.');
						return;
					}
					arr.push(n);
				}
			}

			// 2. 중복 검사 및 기간 자동 조정
			let wasAdjusted = false; // 기간 조정이 한 번이라도 발생했는지 추적
			for (const currentRow of changedData) {
				// 신규/수정된 행(currentRow)과 전체 행(allRows)을 비교
				for (const otherRow of allRows) {
					// 자기 자신과의 비교는 건너뜀
					if (getUid(currentRow) && getUid(currentRow) === getUid(otherRow)) continue;
					// 관리키가 다르면 건너뜀
					if (getKey(currentRow) !== getKey(otherRow)) continue;
					// 기간이 겹치지 않으면 건너뜀
					if (isDisjoint(currentRow.fromDate, currentRow.toDate, otherRow.fromDate, otherRow.toDate)) continue;

					wasAdjusted = true;
					const newToDateForOtherRow = dayjs(currentRow.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');

					// 기존 데이터(b)의 종료일자를 신규 데이터 시작일의 하루 전으로 수정
					ref.gridRef2.current.updateRowsById(
						{ ...otherRow, toDate: newToDateForOtherRow, rowStatus: 'U' },
						otherRow._$uid,
					);
					// 변경된 행을 체크 상태로 설정
					ref.gridRef2.current.addCheckedRowsByIds(otherRow._$uid);

					if (dayjs(newToDateForOtherRow).isBefore(dayjs(otherRow.fromDate))) {
						showAlert('기간 조정 오류', '기간 자동 조정 중 유효하지 않은 날짜가 생성됩니다. 데이터를 확인해주세요.');
						return;
					}
				}
			}

			// 3. 상위의 노선 기간을 벗어하는 행이 있는지 검사
			const masterRow = ref.gridRef.current.getSelectedRows()[0];
			if (masterRow && masterRow.fromDate && masterRow.toDate) {
				for (const currentRow of changedData) {
					if (currentRow.fromDate && currentRow.toDate) {
						if (
							dayjs(currentRow.fromDate).isBefore(dayjs(masterRow.fromDate)) ||
							dayjs(currentRow.toDate).isAfter(dayjs(masterRow.toDate))
						) {
							showAlert('기간 오류', '노선 기간을 벗어나는 운임단가 데이터가 있습니다. 데이터를 확인해주세요.');
							return;
						}
					}
				}
			}

			// 4. 저장 실행
			if (wasAdjusted) {
				// 기간 조정이 발생한 경우, 사용자에게 알림 후 저장
				showAlert(
					'기간 조정 안내',
					'동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.',
					() => {
						const allChangedData = ref.gridRef2.current.getChangedData({ validationYn: false });
						executeSaveDetail(allChangedData);
					},
				);
			} else {
				// 기간 조정이 없으면 바로 저장
				executeSaveDetail(changedData);
			}
		};

		/**
		 * 노선 저장하는 함수
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
		 * 운영단가 저장하는 함수 - 운영단가
		 * @param dataToSave - 저장할 데이터 배열
		 */
		const executeSaveDetail = (dataToSave: any[]) => {
			ref.gridRef2.current.showConfirmSave(() => {
				const saveList = { saveList: dataToSave };
				apiSaveDetailList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							ref.gridRef2.current.clearGridData();
							searchDetailList(ref.gridRef.current.getSelectedRows()[0].routeSerialKey); // 재조회
							showAlert('저장', '저장되었습니다.');
						}
					})
					.catch(() => false);
			});
		};

		/**
		 * 엑셀 업로드 팝업에서 호출되는 저장 함수
		 * @param dataToSave - 저장할 데이터 배열
		 * @returns Promise<boolean> - 저장 성공 여부
		 */
		const saveFromExcel = (dataToSave: any[]): Promise<boolean> => {
			return new Promise((resolve, reject) => {
				const saveList = { saveList: dataToSave };
				apiSaveDetailList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							showAlert('저장', '저장되었습니다.');
							ref.gridRef2.current.clearGridData();
							searchDetailList(ref.gridRef.current.getSelectedRows()[0].routeSerialKey); // 재조회
							resolve(true); // 성공 시 true 반환
						}
					})
					.catch(() => reject(false)); // 실패 시 false 반환
			});
		};

		/**
		 * 운임단가 그리드 행추가 시 노선 선택 및 저장여부 체크 함수
		 * @returns {boolean} - 노선 선택 및 저장여부가 유효하면 true, 아니면 false
		 */
		const routeSerialKeyCheck = () => {
			const detailGrid = ref.gridRef2.current;
			const newRowIndex = detailGrid.getRowCount() - 1;

			// 1. 상위 '노선' 그리드에서 행이 선택되었는지 확인
			if (!currentMasterRow) {
				showAlert(null, '노선 목록에서 항목을 선택해주세요.');
				detailGrid.removeRow(newRowIndex);
				return false;
			}
			// 2. 선택된 행이 저장된 행인지 확인 (신규 행이 아닌지)
			if (!currentMasterRow.routeSerialKey) {
				showAlert(null, '저장되지 않은 노선에는 운임단가를 추가할 수 없습니다. 먼저 노선을 저장해주세요.');
				detailGrid.removeRow(newRowIndex);
				return false;
			}
			return true;
		};

		// ==========================================================================
		// gridCustomBtn 함수
		// ==========================================================================

		// 그리드 컬럼
		const gridCol = [
			{
				dataField: 'routeNm',
				headerText: t('lbl.LNAME'),
				width: 160,
				required: true,
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: false,
					allowSpecialChar: '^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\\- ]*$', // 영문, 숫자, 한글, 하이픈, 언더스코어, 공백만 허용
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			}, // 노선명
			{
				dataField: 'fromDcCode',
				headerText: t('lbl.FROMDCCODE'),
				width: 140,
				editable: false,
				dataType: 'code',
				required: true,
				labelFunction: getCustomCommonCodeList,
			},
			{
				dataField: 'fromOrganize',
				headerText: '출발창고',
				width: 110,
				dataType: 'code',
				editable: true,
				requiredFunction: (rowIndex: number, columnIndex: number, value: any, item: any) => {
					return item.fromDcCode === '2170';
				},
				commRenderer: {
					type: 'search',
					popupType: 'organize',
					searchDropdownProps: {
						dataFieldMap: {
							fromOrganize: 'code',
							fromOrganizeName: 'name',
						},
					},
					onClick: function (e: any) {
						if (e.item.rowStatus !== 'I' || e.item.fromDcCode !== '2170') return;
						const rowIndex = e.rowIndex;
						refModal.current.open({
							gridRef: ref.gridRef,
							rowIndex,
							codeName: e.value,
							customDccode: e.item.fromDcCode,
							dataFieldMap: {
								fromOrganize: 'code',
								fromOrganizeName: 'name',
							},
							popupType: 'organize',
						});
					},
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.fromDcCode !== '2170' || item.rowStatus !== 'I') {
						ref.gridRef.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},
			{
				dataField: 'fromOrganizeName',
				headerText: '출발창고명',
				width: 140,
				dataType: 'text',
				editable: false,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					ref.gridRef.current.removeEditClass(columnIndex);
				},
			},
			{
				dataField: 'toDcCode',
				headerText: t('lbl.TODCCODE'),
				dataType: 'code',
				required: true,
				width: 150,
				editRenderer: {
					type: 'ConditionRenderer',
					conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
						if (item.rowStatus === 'I') {
							return {
								type: 'DropDownListRenderer',
								list: dcCodeOptionsRef.current, // 부모로부터 받은 목록 사용
								keyField: 'comCd', // key 에 해당되는 필드명
								valueField: 'cdNm',
							};
						}
						return { type: 'InputEditRenderer' };
					},
				},
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const list = dcCodeOptionsRef.current || []; // 부모로부터 받은 목록 사용
					const match = list.find(i => i.comCd == value);
					return match ? match.cdNm : value;
				},
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
			{
				dataField: 'toOrganize',
				headerText: t('lbl.TOORGANIZE'),
				width: 110,
				editable: true,
				dataType: 'code',
				requiredFunction: (rowIndex: any, field: any, value: any, item: any) => {
					return item.toDcCode === '2170';
				},
				commRenderer: {
					type: 'search',
					popupType: 'organize',
					searchDropdownProps: {
						dataFieldMap: {
							toOrganize: 'code',
							toOrganizeName: 'name',
						},
					},
					onClick: function (e: any) {
						if (e.item.rowStatus !== 'I' || e.item.toDcCode !== '2170') return;
						const rowIndex = e.rowIndex;
						refModal.current.open({
							gridRef: ref.gridRef,
							rowIndex,
							codeName: e.value,
							customDccode: e.item.toDcCode,
							dataFieldMap: {
								toOrganize: 'code',
								toOrganizeName: 'name',
							},
							popupType: 'organize',
						});
					},
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.toDcCode !== '2170' || item.rowStatus !== 'I') {
						ref.gridRef.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},

			{
				dataField: 'toOrganizeName',
				headerText: '도착창고명',
				dataType: 'text',
				editable: false,
				width: 140,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					ref.gridRef.current.removeEditClass(columnIndex);
				},
			},
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
				},
			},
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
			{ dataField: 'routeSerialKey', visible: false, headerText: 'routeSerialKey' },
		];
		const gridCol2 = [
			{
				dataField: 'courier',
				headerText: '운송사',
				width: 160,
				// editable: false,
				required: true,
				dataType: 'code',
				commRenderer: {
					type: 'search',
					popupType: 'carrierDrop',
					searchDropdownProps: {
						dataFieldMap: {
							courier: 'code',
							courierNm: 'name',
						},
					},
					params: {
						carrierType: 'LOCAL',
					},
					onClick: function (e: any) {
						const rowIndex = e.rowIndex;
						if (e.item.rowStatus !== 'I') return;
						refModal1.current.open({
							gridRef: ref.gridRef2,
							rowIndex,
							dataFieldMap: {
								courier: 'code',
								courierNm: 'name',
							},
							carrierType: 'LOCAL',
							popupType: 'carrier',
						});
					},
				},
				labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
					return item.courierNm ?? value;
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},
			{
				dataField: 'routeYn',
				headerText: '경유여부',
				dataType: 'code',
				width: 70,
				renderer: {
					type: 'CheckBoxEditRenderer',
					editable: true,
					checkValue: 'Y',
					unCheckValue: 'N',
					checkableFunction: (rowIndex: number, columnIndex: number, value: any, isChecked: boolean, item: any) => {
						return item.rowStatus === 'I';
					},
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},
			{
				// 계약유형
				dataField: 'contractType',
				width: 80,
				required: true,
				headerText: t('lbl.CONTRACTTYPE'),
				editRenderer: {
					type: 'ConditionRenderer',
					conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
						if (item.rowStatus === 'I') {
							return {
								type: 'DropDownListRenderer',
								list: getCommonCodeList('CONTRACTTYPE'),
								keyField: 'comCd', // key 에 해당되는 필드명
								valueField: 'cdNm',
							};
						}
						return { type: 'InputEditRenderer' };
					},
				},
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const list = getCommonCodeList('CONTRACTTYPE');
					// value가 null, undefined, '' 인 경우 모두 빈 문자열('')로 취급하여 비교
					const targetValue = value ?? '';
					const match = list.find(i => i.comCd == targetValue);
					return match ? match.cdNm : value;
				},
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},
			{
				// 저장조건
				dataField: 'storageType',
				headerText: t('lbl.STORAGETYPE'),
				required: true,
				width: 120,
				editRenderer: {
					type: 'ConditionRenderer',
					conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
						if (item.rowStatus === 'I') {
							return {
								type: 'DropDownListRenderer',
								list: getCommonCodeList('TM_CARRIER_STORAGE'),
								keyField: 'comCd', // key 에 해당되는 필드명
								valueField: 'cdNm',
							};
						}
						return { type: 'InputEditRenderer' };
					},
				},
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const list = getCommonCodeList('TM_CARRIER_STORAGE');
					// value가 null, undefined, '' 인 경우 모두 빈 문자열('')로 취급하여 비교
					const targetValue = value ?? '';
					const match = list.find(i => i.comCd == targetValue);
					return match ? match.cdNm : value;
				},
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			},
			{
				dataField: 'ton',
				width: 80,
				headerText: t('lbl.QTY_TON'),
				required: true,
				editRenderer: {
					type: 'ConditionRenderer',
					conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
						if (item.rowStatus === 'I') {
							return {
								type: 'DropDownListRenderer',
								list: getCommonCodeList('CARCAPACITY'),
								keyField: 'comCd', // key 에 해당되는 필드명
								valueField: 'cdNm',
							};
						}
						return { type: 'InputEditRenderer' };
					},
				},
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const list = getCommonCodeList('CARCAPACITY');
					// value가 null, undefined, '' 인 경우 모두 빈 문자열('')로 취급하여 비교
					const targetValue = value ?? '';
					const match = list.find(i => i.comCd == targetValue);
					return match ? match.cdNm : value;
				},
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			}, // 톤수
			{
				dataField: 'price',
				headerText: t('lbl.FACTORYPRICE'),
				dataType: 'numeric',
				editable: true,
				required: true,
				width: 90,
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: true, // 숫자만 입력
					allowPoint: false, // 소수점 금지
					allowNegative: false, // 음수 금지
					autoThousandSeparator: true, // 천단위 콤마
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (item.rowStatus !== 'I') {
						ref.gridRef2.current.removeEditClass(columnIndex);
					} else {
						return 'isEdit';
					}
				},
			}, // 단가
			{
				dataField: 'rmk',
				headerText: t('lbl.REMARK'),
				dataType: 'code',
				width: 150,
				editable: true,
			}, // 비고

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
				},
			},
			{
				dataField: 'addWhoName',
				headerText: t('lbl.ADDWHO'),
				width: 90,
				dataType: 'manager',
				managerDataField: 'addWho',
				editable: false,
			},
			{
				dataField: 'addDate',
				headerText: t('lbl.REGDATTM'),
				dataType: 'code',
				width: 160,
				editable: false,
			}, // 등록일자
			{
				dataField: 'editWhoName',
				headerText: t('lbl.EDITWHO'),
				width: 90,
				dataType: 'manager',
				managerDataField: 'editWho',
				editable: false,
			},
			{
				dataField: 'editDate',
				headerText: t('lbl.EDITDATE'),
				dataType: 'code',
				width: 160,
				editable: false,
			}, // 수정일시
		];

		// 그리드 Props
		const gridProps = {
			editable: true,
			// showStateColumn: true,
			showRowCheckColumn: true,
			fillColumnSizeMode: false,
			// selectionMode: 'singleRow',
			// copySingleCellOnRowMode: true, // 행 선택 모드에서 단일 셀 복사 허용
			showCustomRowCheckColumn: true,
		};

		// 그리드 버튼
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{ btnType: 'copy', initValues: { rowStatus: 'I', routeSerialKey: '' } }, // 행복사
				{
					btnType: 'plus', // 행추가
					callBackFn: () => {
						ref.gridRef2.current.clearGridData();
						if (fromDcCode === '') {
							showAlert(null, '출발물류센터를 먼저 선택해주세요.');
							ref.gridRef.current.removeRow(ref.gridRef.current.getRowCount() - 1);
							return false;
						}
						return true;
					},
					initValues: {
						rowStatus: 'I',
						fromDcCode: fromDcCode, // 검색 영역의 '출발물류센터' 값을 기본값으로 설정
						fromDate: dayjs().format('YYYYMMDD'), // 오늘 날짜 기본값 설정
						toDate: '29991231', // 종료일 기본값 설정
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
		// 그리드 버튼
		const gridBtn2: GridBtnPropsType = {
			tGridRef: ref.gridRef2, // 타겟 그리드 Ref
			btnArr: [
				{ btnType: 'copy', initValues: { rowStatus: 'I' } }, // 행복사, 개발할때 업데이트 편하라고 넣음 나중에 빼자
				{
					btnType: 'plus', // 행추가
					callBackFn: routeSerialKeyCheck,
					initValues: {
						rowStatus: 'I',
						routeYn: 'N',
						fromDate: dayjs().format('YYYYMMDD'), // 오늘 날짜 기본값 설정
						toDate: '29991231', // 종료일 기본값 설정
						routeSerialKey: currentMasterRow?.routeSerialKey,
						storageType: '20',
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveDetail,
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
			const gridRef = ref.gridRef.current;
			if (gridRef) {
				gridRef?.setGridData(props.data);
				gridRef?.setSelectionByIndex(0, 0);
			}
		}, [props.data]);

		useEffect(() => {
			const grid = ref.gridRef.current;
			if (!grid) return;
			const eventId = grid.bind('cellEditEnd', (event: any) => {
				// 'fromDcCode' (출발물류센터) 컬럼이 변경되었을 때 (출발창고) 필드를 초기화
				if (event.dataField === 'fromDcCode') {
					grid.updateRow({ fromOrganize: null, fromOrganizeName: null }, event.rowIndex);
				}
				// 'toDcCode' (도착물류센터) 컬럼이 변경되었을 때 (도착창고) 필드를 초기화
				if (event.dataField === 'toDcCode') {
					grid.updateRow({ toOrganize: null, toOrganizeName: null }, event.rowIndex);
				}
			});
			grid.bind('cellEditBegin', (event: any) => {
				if (event.item.rowStatus == 'I') {
					if (event.columnIndex == '4' && event.item.fromDcCode !== '2170') {
						return false;
					} else if (event.columnIndex == '7' && event.item.toDcCode !== '2170') {
						return false;
					}
					return true;
				} else {
					if (event.dataField == 'fromDate' || event.dataField == 'toDate') {
						return true;
					} else {
						return false;
					}
				}
			});
			grid?.bind('cellEditEnd', (event: any) => {
				// routeNm 컬럼 유효성 검사 - 하이픈만 허용
				if (event.dataField === 'routeNm') {
					const value = event.value;
					const regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\- ]*$/; // 영문, 숫자, 한글, 하이픈, 공백만 허용
					if (value && !regex.test(value)) {
						showAlert(null, "'-' 만 특수문자로 허용됩니다.");
						grid.setCellValue(event.rowIndex, 'routeNm', '');
						return false;
					}
				}

				if (
					event.columnIndex == '6' &&
					event.item.toDcCode == event.item.fromDcCode &&
					event.item.toDcCode !== '2170'
				) {
					showConfirm(null, '출발센터와 도착센터가 같을 수 없습니다.', () => {
						grid.setCellValue(event.rowIndex, 'toDcCode', '');
					});
				}
			});

			grid.bind('selectionChange', (event: any) => {
				const selectedItem = grid.getItemByRowIndex(event.primeCell.rowIndex);
				setCurrentMasterRow(selectedItem); // 선택된 행 정보 전체를 state에 저장

				// 신규 행(I)을 선택한 경우, 하위 '운임단가' 그리드를 초기화하고 상세 조회를 중단합니다.
				if (selectedItem?.rowStatus === 'I') {
					ref.gridRef2.current.clearGridData();
					return;
				}

				// 저장된 행을 선택한 경우, 운임단가 목록을 조회합니다.
				if (selectedItem?.routeSerialKey) {
					searchDetailList(selectedItem.routeSerialKey);
				} else ref.gridRef2.current.clearGridData(); // routeSerialKey가 없는 경우(오류 등) 하위 그리드 초기화
			});

			const grid2 = ref.gridRef2.current;
			if (!grid2) return;
			grid2.bind('cellEditBegin', (event: any) => {
				if (event.item.rowStatus == 'I') {
					return true;
				} else {
					if (event.dataField == 'fromDate' || event.dataField == 'toDate' || event.dataField == 'rmk') {
						return true;
					} else {
						return false;
					}
				}
			});

			if (!grid) return;
		}, []);

		// * 그리드 공통 리사이즈 처리
		const resizeAllGrids = useCallback(() => {
			ref.gridRef?.current?.resize?.('100%', '100%');
			ref.gridRef2?.current?.resize?.('100%', '100%');
		}, []);

		return (
			<>
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid>
								<GridTopBtn gridBtn={gridBtn} gridTitle="노선" totalCnt={props.totalCnt} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid>
								<GridTopBtn gridBtn={gridBtn2} gridTitle="운임단가">
									<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps} />
							</GridAutoHeight>
						</>,
					]}
				/>
				<CustomModal ref={modalRef1} width="1000px">
					<TmtrasportRoutingExcelUpload
						gridCol={gridCol}
						close={closeEvent}
						save={saveFromExcel}
						gridProps={gridProps}
						currentMasterRow={currentMasterRow}
					/>
				</CustomModal>
				<CmSearchWrapper ref={refModal} />
				<CmSearchCarrierWrapper ref={refModal1} />
			</>
		);
	},
);
export default TmTrasportRoutingDetail;
