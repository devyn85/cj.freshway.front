/*
 ############################################################################
 # FiledataField	: TmFuelEfficiencyDetail.tsx
 # Description		: 연비관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.10
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiSaveMasterList } from '@/api/tm/apiTmFuelEfficiency';

//types
import { GridBtnPropsType } from '@/types/common';

//store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { showAlert } from '@/util/MessageUtil';

const TmFuelEfficiencyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const dcCode = Form.useWatch('dcCode', props.form);
	const refModal = useRef(null);

	const UK_FIELDS = ['dcCode', 'yearFrom', 'yearTo', 'ton', 'fuelType', 'fromDate', 'toDate']; // UK 조합 필드 정의
	//공통 코드 호출
	const getFuelTypeCommonCodeList = () => {
		return getCommonCodeList('FUELTYPE');
	};

	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY');
	};

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

	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			required: true,
			editable: false,
			dataType: 'code',
			labelFunction: getCustomCommonCodeList,
		},
		{
			headerText: t('연식구간'),
			children: [
				{
					dataField: 'yearFrom',
					headerText: '시작연식',
					width: 100,
					required: true,
					dataType: 'numeric',
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
					dataField: 'yearTo',
					headerText: '종료연식',
					width: 100,
					required: true,
					dataType: 'numeric',
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
			],
		},
		{
			dataField: 'ton',
			headerText: '톤수',
			dataType: 'code',
			editable: true,
			required: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCarCapCityTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
				const list = getCarCapCityTypeCommonCodeList();
				const match = list.find(i => i.comCd == value);
				return match ? match.cdNm : value;
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
			dataField: 'fuelType',
			headerText: '연료유형',
			dataType: 'code',
			required: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getFuelTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
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
			labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
				const list = getFuelTypeCommonCodeList();
				const match = list.find(i => i.comCd == value);
				return match ? match.cdNm : value;
			},
		},
		{
			dataField: 'fuelEfficiency',
			headerText: '연비',
			dataType: 'numeric',
			required: true,
			formatString: '#,##0.##', // 표시 포맷
			editable: true, // ← 편집 가능
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
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			// width: 120,
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
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
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
			dataField: 'toDate',
			// required: true,
			headerText: '종료일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			// width: 200,
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
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'addWhoName',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'code', editable: false },
		{
			dataField: 'editWhoName',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{ dataField: 'editDate', headerText: '수정일시', dataType: 'code', editable: false },
	];

	const gridProps = {
		editable: true,

		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부

		// isLegacyRemove: true,
	};
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
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
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const changedData = ref.gridRef.current.getChangedData({ validationYn: false });
		const allRows = ref.gridRef.current.getGridData();

		if (!changedData || changedData.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
			return;
		}

		if (!ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 헬퍼 함수 정의
		const getUid = (r: any) =>
			r._$uid ??
			r.uid ??
			r.serialKey ??
			`${r.dcCode}|${r.yearFrom}|${r.yearTo}|${r.ton}|${r.fuelType}|${r.fromDate}|${r.toDate}`;

		const isYearOverlap = (a: any, b: any) =>
			!(Number(a.yearTo) < Number(b.yearFrom) || Number(b.yearTo) < Number(a.yearFrom));

		const keyOf = (r: any) => `${r.dcCode}|${r.ton}|${r.fuelType}`;

		// 1. 기본 유효성 검사 (날짜, 연식)
		for (const row of changedData) {
			if (Number(row.yearFrom) > Number(row.yearTo)) {
				showAlert('연식 오류', '시작연식이 종료연식보다 클 수 없습니다.');
				return;
			}
			if (dayjs(row.fromDate).isAfter(dayjs(row.toDate))) {
				showAlert('날짜 오류', '시작일자가 종료일자보다 늦을 수 없습니다.');
				return;
			}
		}

		// 2. 신규행끼리 중복 검사
		const newRows = changedData.filter(r => r.rowStatus === 'I');
		if (newRows.length > 1) {
			const seen = new Map<string, any[]>();
			for (const n of newRows) {
				const k = keyOf(n);
				if (!seen.has(k)) seen.set(k, []);
				const arr = seen.get(k)!;
				// 동일 키를 가진 행들 중에서 연식과 기간이 모두 겹치는지 확인
				if (arr.some(x => isYearOverlap(x, n) && !isDisjoint(x.fromDate, x.toDate, n.fromDate, n.toDate))) {
					showAlert('중복 오류', '새로 추가한 행들 사이에 동일한 조건과 겹치는 기간/연식의 데이터가 있습니다.');
					return;
				}
				arr.push(n);
			}
		}

		// 3. 신규/수정 행과 기존 행의 중복 검사 및 기간 자동 조정
		let wasAdjusted = false;
		for (const currentRow of changedData) {
			for (const otherRow of allRows) {
				if (getUid(currentRow) === getUid(otherRow)) continue; // 자기 자신 제외
				if (keyOf(currentRow) !== keyOf(otherRow)) continue; // 키가 다르면 제외
				if (!isYearOverlap(currentRow, otherRow)) continue; // 연식이 겹치지 않으면 제외
				if (isDisjoint(currentRow.fromDate, currentRow.toDate, otherRow.fromDate, otherRow.toDate)) continue; // 기간이 겹치지 않으면 제외

				// 중복 발견: 기존 데이터(otherRow)의 종료일을 조정
				const newToDateForOtherRow = dayjs(currentRow.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');

				// if (dayjs(newToDateForOtherRow).isBefore(dayjs(otherRow.fromDate))) {
				// 	showAlert('기간 조정 오류', '기간 자동 조정 중 유효하지 않은 날짜가 생성됩니다. 데이터를 확인해주세요.');
				// 	return;
				// }

				// ref.gridRef.current.updateRowsById(
				// 	{ ...otherRow, toDate: newToDateForOtherRow, rowStatus: 'U' },
				// 	otherRow._$uid,
				// );
				// ref.gridRef.current.addCheckedRowsByIds(otherRow._$uid);
				wasAdjusted = true;
			}
		}

		// 4. 저장 로직 실행
		const executeSave = (dataToSave: any[]) => {
			ref.gridRef.current.showConfirmSave(() => {
				const saveList = { saveList: dataToSave };
				apiSaveMasterList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							ref.gridRef.current.clearGridData();
							props.fnCallBack();
							showAlert('저장', '저장되었습니다.');
						}
					})
					.catch(() => false);
			});
		};

		if (wasAdjusted) {
			showAlert(
				'기간 조정 안내',
				'동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.',
				() => {
					const allChangedData = ref.gridRef.current.getChangedData({ validationYn: false });
					executeSave(allChangedData);
				},
			);
		} else {
			executeSave(changedData);
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{ btnType: 'copy', initValues: { rowStatus: 'I' } }, // 행복사
			{
				btnType: 'plus', // 행추가
				initValues: {
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					toDate: '29991231',
					dcCode: dcCode,
					rowStatus: 'I',
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
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		gridRefCur.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'fromDate' || event.dataField === 'toDate') {
				// 해당 행 전체 데이터
				const row = event.item; // 또는 event.row depending on your grid version
				let fromDt = row.fromDate;
				let toDt = row.toDate;

				// 현재 셀 편집 중 변경된 값 반영
				if (event.dataField === 'fromDate') {
					fromDt = event.value; // 새로 입력된 from값
				} else if (event.dataField === 'toDate') {
					toDt = event.value; // 새로 입력된 to값
				}

				// dayjs 등 날짜 객체로 변환하여 비교
				if (fromDt && toDt) {
					const fromDay = dayjs(fromDt);
					const toDay = dayjs(toDt);

					if (fromDay.isAfter(toDay)) {
						showAlert('날짜 오류', '시작일(from)이 종료일(to)보다 늦을 수 없습니다.');
						const dataField = event.dataField;
						gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
		});
		gridRefCur.bind('cellEditBegin', (event: any) => {
			const data = event.item;
			const name = event.dataField;
			// if (event.item.rowStatus == 'I') {
			// 	return true;
			// } else {
			// 	if (event.dataField == 'fromDate' || event.dataField == 'toDate') {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// }
			if (name === 'fromDate' && data.rowStatus === 'I') {
				return true;
			}
			if (name === 'toDate') {
				return true;
			}
			if (data.rowStatus !== 'I') {
				// if (e && typeof e.preventDefault === 'function') e.preventDefault();
				// //console.log(e);
				// //console.log('편집 불가');
				return false;
			}
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (!gridRefCur) {
			return;
		}

		gridRefCur?.setSelectionByIndex(0, 0);
		if (props.data.length > 0) {
			const colSizeList = gridRefCur.getFitColumnSizeList(true);
			gridRefCur.setColumnSizeList(colSizeList);
			// gridRefCur.setColumnPropByDataField('sttlItemCd', { width: 150 });
		}
		const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
			...item,
			customRowCheckYn: 'N',
		}));
		// gridRefCur?.setGridData(props.data);
		gridRefCur?.setGridData(newData);
		// gridRefCur.setGridData(props.data);

		if (props.data && props.data.length > 0) {
			gridRefCur.setSelectionByIndex(0, 0);
			const colSizeList = gridRefCur.getFitColumnSizeList(true);
			gridRefCur.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmFuelEfficiencyDetail;
