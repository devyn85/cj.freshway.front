// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd/lib';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Component
import { apiGetMasterList as apiGetMasterMngList } from '@/api/tm/apiTmManageEntity';
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import TmAmountDailyExcelPopup from '@/components/tm/amountdaily/TmAmountDailyExcelPopup';
import TmAmountDailyFileUploadPopup from '@/components/tm/amountdaily/TmAmountDailyFileUploadPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetCarInfo, apiGetTrspCloseChk, apiSaveMasterList } from '@/api/tm/apiTmAmountDaily';

// Store
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';

const TmAmountDailyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	// 다국어
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', props.form);
	const [applyForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(props.totalCnt);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const gridId = uuidv4() + '_gridWrap';
	const refModal = useRef(null);
	const refModal1 = useRef(null);
	const refAttchFileModal = useRef(null);
	const excelInputRef = useRef(null);
	const today = dayjs().format('YYYYMMDD');
	const courier = Form.useWatch('courier', props.form);
	const courierNm = Form.useWatch('courierName', props.form);
	const refSttlItemList = useRef([]);
	const [popupRef, setPopupRef] = useState(ref);
	const [serialkeyH, setSerialkeyH] = useState();

	// 톤수 코드
	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	// 계약유형 코드
	const contracttypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	// 정산항목 코드
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;
	};
	// 정산항목 코드 필터
	const sttlItemCdFunc = () => {
		// data1이 'D' 또는 'P'인 항목만 필터링
		const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
		const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
		return [...D, ...P];
	};

	//물류센터 공통코드 호출
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

	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			editable: false,
			visible: true,
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courier',
			headerText: '운송사',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			// required: true,
			// commRenderer: {
			// 	type: 'search',
			// 	popupType: 'carrierDrop',
			// 	searchDropdownProps: {
			// 		dataFieldMap: {
			// 			courier: 'code',
			// 			couriername: 'name',
			// 		},
			// 	},
			// 	params: {
			// 		carrierType: 'LOCAL',
			// 	},
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						couriername: 'name',
					},
				},
				params: {
					carrierType: 'LOCAL',
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							couriername: 'name',
						},
						carrierType: 'LOCAL',
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return ref.gridRef.current.getCellValue(rowIndex, 'courier')
					? ref.gridRef.current.getCellValue(rowIndex, 'couriername')
					: '';
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'allowanceDate',
			headerText: '일자',
			dataType: 'date',
			editable: true,
			required: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: function (oldValue, newValue, item, dataField, fromClipboard, which) {
					// YYYYMMDD 숫자 8자리 체크
					const isValid = /^\d{8}$/.test(newValue);

					if (!isValid) {
						return {
							validate: false,
							message: '날짜는 YYYYMMDD 형식으로 입력하세요.',
						};
					}
					return { validate: true };
				},
			},
		},
		{
			dataField: 'carno',
			headerText: '차량번호',
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'car',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
						const selectedRows = ref.gridRef?.current?.getGridData()[selectedIndex[0]];

						if (!e || e.length === 0) return;

						// 차량 상세
						apiGetCarInfo({ carno: e.code })
							.then((res: any) => {
								// 수정할 값 구성

								// if (res.data[0].contracttype === 'TEMPORARY') {
								// 	showAlert('', '해당 차량은 실비차 입니다.');
								// 	return;
								// }
								const updatedRow = {
									...selectedRows,
									// courier: !commUtil.isEmpty(rowItem.courier) ? rowItem.courier : res.data.caragentcd,
									carcapacity: res.data[0].carcapacity,
									carno: res.data[0].carno,
									courier: selectedRows.courier ? selectedRows.courier : res.data[0].courier,
									couriername: selectedRows.couriername ? selectedRows.couriername : res.data[0].couriername,
									caragentcd: res.data[0].caragentcd,
									caragentname: res.data[0].caragentname,
									contracttype: res.data[0].contracttype,
								};

								// 해당 행에 값 업데이트
								ref.gridRef.current.updateRow(updatedRow, selectedIndex[0]);

								// 팝업 닫기
								refModal.current?.handlerClose();
							})
							.catch(error => {
								// 에러가 발생해도 팝업은 닫기
								refModal.current?.handlerClose();
							});
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const rowItem = e.item;
					if (e.item.rowStatus !== 'I') return;
					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							carno: 'code',
							carname: 'name',
						},
						customDccode: e.item.dccode,
						popupType: 'car',
						onConfirm: (selectedRows: any[]) => {
							if (!selectedRows || selectedRows.length === 0) return;

							const selectedData = selectedRows[0];
							// 차량 상세
							apiGetCarInfo({ carno: selectedData.code })
								.then((res: any) => {
									// 수정할 값 구성

									// if (res.data[0].contracttype === 'TEMPORARY') {
									// 	showAlert('', '해당 차량은 실비차 입니다.');
									// 	return;
									// }
									const updatedRow = {
										...rowItem,
										// courier: !commUtil.isEmpty(rowItem.courier) ? rowItem.courier : res.data.caragentcd,
										carcapacity: res.data[0].carcapacity,
										carno: res.data[0].carno,
										courier: e.item.courier ? e.item.courier : res.data[0].courier,
										couriername: e.item.couriername ? e.item.couriername : res.data[0].couriername,
										caragentcd: res.data[0].caragentcd,
										caragentname: res.data[0].caragentname,
										contracttype: res.data[0].contracttype,
									};

									// 해당 행에 값 업데이트
									ref.gridRef.current.updateRow(updatedRow, rowIndex);

									// 팝업 닫기
									refModal.current?.handlerClose();
								})
								.catch(error => {
									// 에러가 발생해도 팝업은 닫기
									refModal.current?.handlerClose();
								});
						},
					});
				},
			},
		},
		{
			dataField: 'caragentname',
			headerText: '2차운송사명',
			dataType: 'text',
			editable: true,
			required: true,
			width: 100,
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						caragentcd: 'code',
						caragentname: 'name',
					},
				},
				params: {
					carrierType: 'SUBC',
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							caragentcd: 'code',
							caragentname: 'name',
						},
						carrierType: 'SUBC',
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return ref.gridRef.current.getCellValue(rowIndex, 'caragentcd')
					? ref.gridRef.current.getCellValue(rowIndex, 'caragentname')
					: '';
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'contracttype',
			headerText: '계약유형',
			dataType: 'code',
			editable: false,
			width: 100,
			labelFunction: contracttypeLabelFunc,
		},
		{
			dataField: 'carcapacity',
			headerText: '톤급',
			dataType: 'code',
			editable: false,
			labelFunction: carcapacityLabelFunc,
		},
		{
			dataField: 'sttlItemCd',
			headerText: '정산항목',
			editable: true,
			dataType: 'code',
			required: true,
			labelFunction: getTmcaclItmeCommonCode,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',

							listFunction: function (rowIndex, columnIndex, item, dataField) {
								if (!item.courier || !item.contracttype) return [];
								const comCdToYnFieldMap = {
									DELIVERY: 'entrustedCarYn',
									MONTHLY: 'mmContractYn',
									FIX: 'fixCarYn',
									FIXTEMPORARY: 'tmpCarYn',
									TEMPORARY: 'actualCostCarYn',
								};

								const ynField = comCdToYnFieldMap[item.contracttype];
								if (!ynField) return [];
								const isY = v =>
									String(v ?? '')
										.trim()
										.toUpperCase() === 'Y';
								// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
								const allowedSttlItemCds = (refSttlItemList.current || [])
									.filter(val => val.courier === item.courier && isY(val[ynField]))
									.map(val => val.sttlItemCd);
								// 2️⃣ 공통코드에서 필터
								return getCommonCodeList('TM_CALC_ITEM', '').filter(
									cc =>
										cc.data1 !== 'M' && // 🔥 추가 조건
										allowedSttlItemCds.includes(cc.comCd), // 🔥 허용된 코드만
								);
							},

							keyField: 'comCd',
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'amount',
			headerText: '금액',
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'caclTypeData',
			headerText: '적용주기',
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { sttlItemCd?: string },
			) => {
				const sttlItemCd = item?.sttlItemCd;

				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'attachment',
			headerText: '증빙첨부',
			width: 100,
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				onClick: (event: any) => {
					onClickFileUploader(event);
				},
			},
			disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
				// 행이 저장된 상태라면 버튼 활성화 처리
				return !commUtil.isEmpty(item.serialkey);
			},
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'addwhoName',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: '등록일자',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editwhoName',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: '수정일자',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'serialkey',
			headerText: '시리얼키',
			editable: false,
			visible: false,
		},
		{
			dataField: 'couriername',
			headerText: '운송사',
			visible: false,
		},
		{
			dataField: 'caragentcd',
			headerText: '2차운송사',
			dataType: 'text',
			editable: false,
			width: 100,
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,
		// showRowNumColumn: true,
		enableFilter: true,
		// isLegacyRemove: true,
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
			if (props.data && props.data.length > 0) {
				ref.gridRef?.current.setSelectionByIndex(0);
			}
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditBegin', (e: any) => {
			const data = e.item;
			const name = e.dataField;

			if (name === 'allowanceDate') {
				return true;
			}

			if (data.rowStatus !== 'I') {
				return false;
			}
		});

		// ref.gridRef?.current.bind('cellEditBegin', (evt: any) => {
		// 	// 클릭된 컬럼의 dataField (colid) 확인
		// 	const col = evt.dataField;
		// 	const rowData = evt.item;

		// 	if (col === 'sttlItemCd' || col === 'applyType') {
		// 		if (rowData.rowStatus !== 'I') return false;
		// 	}

		// 	return true;
		// });

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (e: any) => {
			const data = e.item;
			const name = e.dataField;

			if (name === 'courier' || name === 'carno') {
				ref.gridRef?.current.setCellValue(e.rowIndex, 'sttlItemCd', '');
			}

			if (name === 'sttlItemCd') {
				if (isEmpty(e.value)) return;
				const comCdToYnFieldMap = {
					DELIVERY: 'entrustedCarYn',
					MONTHLY: 'mmContractYn',
					FIX: 'fixCarYn',
					FIXTEMPORARY: 'tmpCarYn',
					TEMPORARY: 'actualCostCarYn',
				};

				const ynField = comCdToYnFieldMap[data.contracttype];
				if (!ynField) return [];
				const isY = v =>
					String(v ?? '')
						.trim()
						.toUpperCase() === 'Y';
				// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
				const allowedSttlItemCds = (refSttlItemList.current || [])
					.filter(val => val.courier === data.courier && isY(val[ynField]))
					.map(val => val.sttlItemCd);
				if (allowedSttlItemCds.includes(e.value)) {
					return true;
				} else {
					ref.gridRef?.current.setCellValue(e.rowIndex, 'sttlItemCd', e.oldValue);
					showAlert('', '해당 운송사에 등록되지 않은 정산 항목입니다.');
				}
			}
		});
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });
		const allRows = ref.gridRef.current.getGridData();

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (updatedItems.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		apiGetTrspCloseChk({ saveList: updatedItems }).then(res => {
			const list = res.data ?? [];

			// "2025-11-05" -> "2025-11"
			const toMonth = (d?: string | null) => {
				if (!d) return null;
				// 혹시 "2025-11-05 12:34:56" 같은 경우도 대비
				const s = String(d).trim();
				if (s.length >= 7) return s.slice(0, 7);
				return null;
			};

			const map = new Map<string, { courier: string; couriername: string | null; months: Set<string> }>();

			list
				.filter((item: any) => item?.valChk === 'Y' && item?.courier)
				.forEach((item: any) => {
					const key = String(item.courier);
					const month = toMonth(item.allowanceDate);

					if (!map.has(key)) {
						map.set(key, {
							courier: key,
							couriername: item.couriername ?? null,
							months: new Set<string>(),
						});
					}

					if (month) map.get(key)!.months.add(month);
				});

			const courierInfos = Array.from(map.values()).map(x => ({
				...x,
				months: Array.from(x.months).sort((a, b) => String(a).localeCompare(String(b))),
			}));

			if (courierInfos.length > 0) {
				const msg = courierInfos
					.map(x => {
						const name = `${x.courier}${x.couriername ? `(${x.couriername})` : ''}`;
						const months = x.months.length ? ` - ${x.months.join(', ')}` : '';
						return `${name}${months}`;
					})
					.join('\n');

				showAlert('', `해당 월의 마감이 완료된 운송사입니다.\n${msg}`);
				return;
			}

			// groupby를 해서 행들을 묶는다. 그래서 기간이 중복된 행들은 alter 띄워준다.
			//if (!validateGroupedDateRanges(ref.gridRef.current.getGridData())) return;
			// 같은 행 판별용 UID 생성기 (우선순위: _$uid > uid > PK > 합성키)
			const getUid = (r: any) =>
				r._$uid ?? r.uid ?? r.serialKey ?? `${r.sttlItemCd}|${r.dcCode}|${r.allowanceDate}|${r.carno}|`;

			for (const a of updatedItems) {
				const aUid = getUid(a);

				for (const b of allRows) {
					// 자기 자신은 건너뜀
					if (aUid === getUid(b)) continue;
					if (
						a.sttlItemCd === b.sttlItemCd &&
						a.dcCode === b.dcCode &&
						// a.areaNm === b.area &&
						a.allowanceDate === b.allowanceDate &&
						// a.courierNm === b.courierNm &&
						a.carno === b.carno
						// a.closeType === b.closeType &&
						// a.areaNm === b.areaNm &&
						// !isDisjoint(a.fromDate, a.toDate, b.fromDate, b.toDate)
					) {
						showAlert('중복 오류', '관리항목이 날짜 구간 내에서 중복됩니다.');
						return;
					}
				}
			}
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				apiSaveMasterList({ saveList: updatedItems }).then(res => {
					if (res.statusCode == 0) {
						showAlert('', t('msg.MSG_COM_SUC_003'), () => {
							ref.gridRef.current.clearGridData();
							props.callBackFn();
						});
					}
				});
			});
		});
	};

	/**
	 * 증빙파일 업로드 팝업 열기
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		if (commUtil.isNotEmpty(item.item.serialkey)) {
			setSerialkeyH(item.item.serialkey);
			refAttchFileModal.current.handlerOpen();
		} else {
			showAlert(null, t('msg.MSG_COM_CFM_027'));
		}
	};

	/**
	 * 증빙파일 업로드 팝업 닫기
	 */
	const closeFileUploader = () => {
		refAttchFileModal.current.handlerClose();
	};

	/**
	 * 파일 업로드 팝업 처리 후 콜백
	 * @param {any} param 파일 첨부 결과
	 * @param {number} fileCnt 첨부파일 갯수
	 */
	const callBackFileUploadPopup = (param: any, fileCnt: number) => {
		// 파일 컬럼에 첨부파일 갯수 업데이트
		const rowIndex = ref.gridRef.current.getSelectedIndex()[0];
		// ref.gridRef.current?.setCellValue(rowIndex, 'attachment', fileCnt);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					serialkey: '',
					adddate: '',
					addwho: '',
					editdate: '',
					editwho: '',
					rowStatus: 'I',
				},
			},
			{
				btnType: 'curPlus', // 행삽입
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					// applyType: 'AD',
					allowanceDate: today,
					// sttlItemCd: 'M08',
					courier: courier,
					courierNm: courierNm?.replace(/\[\d+\]/g, ''),
					rowStatus: 'I',
				}),
				// callBackFn: () => {
				// 	if (isEmpty(courier) || isEmpty(courierNm)) {
				// 		const rowindex = ref.gridRef.current.getSelectedIndex()[0];
				// 		ref.gridRef.current.removeRow(rowindex);
				// 		showAlert('', '검색 조건의 운송사 코드/명을 입력해주세요');
				// 	}
				// },
			},
			{
				btnType: 'plus', // 행추가
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					applyType: 'AD',
					allowanceDate: today,
					// sttlItemCd: 'M08',
					courier: courier,
					courierNm: courierNm?.replace(/\[\d+\]/g, ''),
					rowStatus: 'I',
				}),
				// callBackFn: () => {
				// 	if (isEmpty(courier) || isEmpty(courierNm)) {
				// 		const rowindex = ref.gridRef.current.getSelectedIndex()[0];
				// 		ref.gridRef.current.removeRow(rowindex);
				// 		showAlert('', '검색 조건의 운송사 코드/명을 입력해주세요');
				// 	}
				// },
			},
			{
				btnType: 'delete', // 행삭제
			},
			// {
			// 	btnType: 'btn1', // 신규행삭제
			// },
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
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
					excelInputRef.current.handlerOpen();
					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			excelInputRef.current.handlerOpen();
			setIsModalOpen(true);
		}
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeEvent = () => {
		excelInputRef.current.handlerClose();
		setIsModalOpen(false);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (ref.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
			showConfirmAsync(null, t('msg.MSG_COM_CFM_009'), () => {
				ref.gridRef.current.clearGridData();
				setTotalCnt(0);
			});
		}
	}, [dccode]);

	useEffect(() => {
		apiGetMasterMngList({ dcCode: dccode }).then(res => {
			const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
			const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
			const list = getCommonCodeList('TM_CALC_ITEM');
			const matched = res.data.filter(item2 => sttlItemCdFunc().some(item1 => item1.sttlItemCd === item2.comCd));
			const result = [];
			for (const a of matched) {
				if (a.sttlItemCd !== 'P09' && a.sttlItemCd !== 'P15') {
					result.push(a);
				} else if (a.sttlItemCd === 'P09') {
					// P09 삭제하고, P10/P11로 교체(복사 기반)
					result.push(
						{
							...a,
							sttlItemCd: 'P10',
							oldSttlItemCd: 'P10',
							sttlItemName: list.filter(item => item.comCd === 'P10')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P11',
							oldSttlItemCd: 'P11',
							sttlItemName: list.filter(item => item.comCd === 'P11')[0].cdNm,
						},
					);
				} else if (a.sttlItemCd === 'P15') {
					result.push(
						{
							...a,
							sttlItemCd: 'P16',
							oldSttlItemCd: 'P16',
							sttlItemName: list.filter(item => item.comCd === 'P16')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P17',
							oldSttlItemCd: 'P17',
							sttlItemName: list.filter(item => item.comCd === 'P17')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P18',
							oldSttlItemCd: 'P18',
							sttlItemName: list.filter(item => item.comCd === 'P18')[0].cdNm,
						},
					);
				}
			}

			refSttlItemList.current = result;
		});
	}, [dccode]);

	/**
	 * 그리드 데이터 초기화
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef.current.setColumnSizeList(colSizeList);
			gridRefCur.setColumnPropByDataField('courier', { width: 185 });
			gridRefCur.setColumnPropByDataField('carno', { width: 160 });
			gridRefCur.setColumnPropByDataField('sttlItemCd', { width: 180 });
			gridRefCur.setColumnPropByDataField('caragentname', { width: 165 });
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'일자별 수당관리 목록'} gridBtn={gridBtn} totalCnt={totalCnt}>
					<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>
			{/* 공통 검색 팝업 래퍼 */}
			<CmSearchWrapper ref={refModal} />
			<CmSearchCarrierWrapper ref={refModal1} />
			{/* 엑셀 업로드 영역 정의 */}
			{/* <ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} /> */}
			<CustomModal ref={excelInputRef} width="1000px">
				<TmAmountDailyExcelPopup
					// gridCol={gridCol}
					close={closeEvent}
					save={saveMasterList}
					dcCode={dccode}
					fnCallBack={props.fnCallBack}
				/>
			</CustomModal>
			{/* 파일 팝업 영역 정의 */}
			<CustomModal ref={refAttchFileModal} width="1000px">
				<TmAmountDailyFileUploadPopup
					callBack={callBackFileUploadPopup}
					close={closeFileUploader}
					serialkey={serialkeyH} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>
		</>
	);
});

export default TmAmountDailyDetail;
