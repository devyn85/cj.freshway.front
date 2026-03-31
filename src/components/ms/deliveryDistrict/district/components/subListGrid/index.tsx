// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useTranslation } from 'react-i18next';
// types

//utils
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';

// APIS
import { apiPostsaveHjdongList } from '@/api/ms/apiMsDeliveryDistrict';

interface IMasterListGridProps {
	gridData: any[];
	gridRef: React.RefObject<any>;
	// unUsageHjdongList: any[]; // 미사용중인 행정동 리스트 (미사용중인 행정동 리스트 노랑색 색상을 표시 && 서브그리드 에서도 사용)
	hjdongPeriodList: any[]; // 해당 권역에서 등록 가능한 + 제한된 날짜 행정동 리스트
	onRequestHjdongList: () => Promise<void>;
	selectMasterGridRow: any;
	onSelectSubGridRow?: (selectedGridRowObj: any) => void; //   서브 그리드 행 선택 이벤트 추가
	bumpGridTick: () => void; // 배송권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	tabSearchConditions: any; // 조회 조건 (행정동 추가/삭제/저장 오늘 날짜 아닌경우 막기위해 필요)
}
// 아래는 그리드 버튼이 안보일때의 조건 ??
// 1. 행정동리스트 데이터가 없을 때
// 2. 선택한 메인그리드 데이터의 rowStatus 가 I 일때 (메인 그리드 원본 데이터가 없을 때)

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}

// 리스트에서 특정 필드 기준 중복 제거
const getUniqueByField = (list: any[], field: string) =>
	list.filter((item, index, self) => self.findIndex(x => x?.[field] === item?.[field]) === index);

// 상수 정의
const GRID_UPDATE_DELAY = 100;
const EDITABLE_NEW_ROW_FIELDS = ['ctpKorNm', 'sigKorNm', 'hjdongCd', 'fromDate'] as const;
const UNEDITABLE_NEW_ROW_FIELDS = ['toDate'] as const;
const DEFAULT_END_DATE = '29991231';
const AFTER3DAYS_DATE = dayjs().add(3, 'days').format('YYYYMMDD');

const SubListGrid = ({
	gridData,
	gridRef,
	// unUsageHjdongList,
	hjdongPeriodList,
	onRequestHjdongList,
	selectMasterGridRow,
	onSelectSubGridRow,
	bumpGridTick,
	tabSearchConditions,
}: IMasterListGridProps) => {
	// 다국어
	const { t } = useTranslation();
	const commonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	// selectMasterGridRow를 ref로 관리 — 이벤트 핸들러에서 항상 최신값 참조
	// (deps에서 제거하여 불필요한 이벤트 unbind/rebind 방지)
	const selectMasterGridRowRef = useRef(selectMasterGridRow);
	selectMasterGridRowRef.current = selectMasterGridRow;

	// State 관리
	const [gridKey, setGridKey] = useState(0);
	const [backupGridData, setBackupGridData] = useState<any[]>([]);

	// 그리드 기본 설정
	const gridProps = useMemo(() => {
		return {
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			// selectionMode: 'multipleRows', // (버전별) 다중행 선택 허용
		};
	}, []);

	// 행정동 옵션 리스트 (메모이제이션)
	const hjdongOptionList = useMemo(() => {
		const src = Array.isArray(hjdongPeriodList) ? hjdongPeriodList : [];
		return src
			.map(item => ({
				hjdongCd: String(item?.hjdongCd ?? ''),
				hjdongNm: String(item?.hjdongNm ?? ''),
			}))
			.filter(opt => opt.hjdongCd !== '' && opt.hjdongNm !== '');
	}, [hjdongPeriodList]);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	// 그리드 버튼 설정

	// 필수값 유효성 검사 함수
	const validateRequiredFields = useCallback((data: any[]) => {
		const validateDataField = ['hjdongCd', 'fromDate', 'toDate', 'delYn'];
		const fieldNameMap: { [key: string]: string } = {
			hjdongCd: '행정동',
			fromDate: '적용시작일자',
			toDate: '적용종료일자',
			delYn: '삭제여부',
		};
		const errors: string[] = [];

		data.forEach(item => {
			validateDataField.forEach(fieldName => {
				const fieldValue = item[fieldName];
				if (
					fieldValue === null ||
					fieldValue === undefined ||
					fieldValue === '' ||
					(typeof fieldValue === 'string' && fieldValue.trim() === '')
				) {
					errors.push(`${fieldNameMap[fieldName] || fieldName}을(를) 입력해주세요.`);
				}
			});
		});

		return errors;
	}, []);

	// 중복 행정동 검사 (3일 부터 중복된 행정동 존재 시 중복 행정동 얼럿 띄우기)
	const validateDuplicateHjdong = useCallback(
		(data: any[]) => {
			const errors: string[] = [];
			const hjdongMap = new Map<string, number[]>();

			data.forEach((item, index) => {
				if (dayjs(item.fromDate).isSameOrAfter(dayjs().add(3, 'day'))) {
					const hjdongCd = item.hjdongCd;
					if (hjdongCd && hjdongCd.trim() !== '') {
						const code = hjdongCd.trim();
						if (!hjdongMap.has(code)) {
							hjdongMap.set(code, []);
						}
						hjdongMap.get(code)!.push(index + 1);
					}
				}
			});

			hjdongMap.forEach((rowNumbers, hjdongCd) => {
				if (rowNumbers.length > 1) {
					const hjdongName = hjdongOptionList.find(h => h.hjdongCd === hjdongCd)?.hjdongNm || hjdongCd;
					errors.push(`중복된 행정동: ${hjdongName}`);
				}
			});

			return errors;
		},
		[hjdongOptionList],
	);

	// 삭제 여부 판별 함수
	const isDeleteTarget = useCallback((item: any) => {
		if (item.rowStatus !== 'U') return false;
		const from = dayjs(String(item.fromDate).replaceAll('-', ''), 'YYYYMMDD');
		const threeDaysAfter = dayjs().add(2, 'day');
		return from.isSameOrAfter(threeDaysAfter) && item?.delYn === 'Y';
	}, []);

	// 기간 겹침 자동 조정 처리
	const adjustOverlappingPeriods = useCallback((checkedItems: any[], allGridData: any[], grid: any) => {
		const rowIdField = grid?.getProp?.('rowIdField') || grid?.props?.gridProps?.rowIdField || '_$uid';

		let hasAdjustment = false;
		const toYmd = (v: any) => dayjs(String(v ?? '').replaceAll('-', ''), 'YYYYMMDD');

		const existingRows = allGridData.filter((r: any) => r.rowStatus !== 'I');
		const newUpdateRows = checkedItems.filter((item: any) => item.rowStatus === 'I' || item.rowStatus === 'U');

		for (const newUpdateRow of newUpdateRows) {
			const newFrom = toYmd(newUpdateRow.fromDate);

			for (const existingRow of existingRows) {
				if (newUpdateRow._$uid && existingRow._$uid && newUpdateRow._$uid === existingRow._$uid) continue;
				if (newUpdateRow.hjdongCd !== existingRow.hjdongCd) continue;

				const exFrom = toYmd(existingRow.fromDate);
				const exTo = toYmd(existingRow.toDate);
				if (!exFrom.isSameOrBefore(newFrom, 'day') || !exTo.isSameOrAfter(toYmd(newUpdateRow.toDate), 'day')) continue;

				const rowFrom = toYmd(existingRow.fromDate);
				let adjustedTo = newFrom.subtract(1, 'day');
				if (adjustedTo.isBefore(rowFrom, 'day')) {
					adjustedTo = rowFrom;
				}

				const adjustedToStr = adjustedTo.format('YYYYMMDD');
				const updatedRow = {
					...existingRow,
					[rowIdField]: existingRow[rowIdField],
					toDate: adjustedToStr,
					delYn: adjustedTo.isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD'), 'day') ? 'N' : 'Y',
				};

				grid.updateRowsById(updatedRow);
				if (grid.addCheckedRowsByValue) {
					grid.addCheckedRowsByValue(rowIdField, updatedRow[rowIdField]);
				}
				hasAdjustment = true;
			}
		}

		return hasAdjustment;
	}, []);

	// 저장 실행 (데이터 분류 + confirm + API 호출)
	const executeSave = useCallback(
		(checkedItems: any[]) => {
			const insertItemList = checkedItems.filter((item: any) => item.rowStatus === 'I');
			const deleteItemList = checkedItems.filter(isDeleteTarget);
			const updateItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && !isDeleteTarget(item));

			const mergeHjdongList = [
				...insertItemList,
				...updateItemList.map((item: any) => ({ ...item, rowStatus: 'U' })),
				...deleteItemList.map((item: any) => ({
					...item,
					rowStatus: 'D',
				})),
			];

			const masterRow = selectMasterGridRowRef.current;
			showConfirm(
				null,
				`${t('msg.MSG_COM_CFM_003')}\n 신규: ${insertItemList.length}개, \n수정: ${updateItemList.length}개, \n삭제: ${
					deleteItemList.length
				}개`,
				() => {
					apiPostsaveHjdongList({
						dccode: masterRow?.dccode,
						dlvdistrictId: masterRow?.dlvdistrictId,
						serialkey: masterRow?.serialkey,
						dlvgroupId: masterRow?.dlvgroupId ?? '',
						hjdongList: mergeHjdongList,
					})
						.then(res => {
							if (res?.statusCode === 0) {
								showMessage({
									content: t('msg.MSG_COM_SUC_003'),
									modalType: 'info',
								});
								onRequestHjdongList();
							}
						})
						.catch(() => {
							showAlert(null, '저장 중 오류가 발생했습니다.');
						});
				},
			);
		},
		[isDeleteTarget, t, onRequestHjdongList],
	);

	const gridBtn = useMemo((): GridBtnPropsType => {
		const getInitialValues = () => {
			const selectedDate = dayjs(selectMasterGridRow?.fromDate);
			const todayPlus3 = dayjs().add(3, 'day');
			const fromDate = selectedDate.isBefore(todayPlus3)
				? todayPlus3.format('YYYYMMDD')
				: selectedDate.format('YYYYMMDD');
			return {
				rowStatus: 'I',
				serialkey: '',
				ctpKorNm: '',
				sigKorNm: '',
				hjdongCd: '',
				hjdongNm: '',
				fromDate: fromDate,
				toDate: DEFAULT_END_DATE,
				delYn: 'N',
			};
		};

		const checkTodayCondition = () => {
			if (tabSearchConditions?.effectiveDate && dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day')) {
				return false;
			}
			showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 \n 입력/수정/삭제가 가능합니다.`);
			return true;
		};

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus',
					initValues: getInitialValues(),
					callBackFn: () => {
						setTimeout(() => {
							bumpGridTick();
						}, 100);
					},
					callBeforeFn: checkTodayCondition,
				},
				{
					btnType: 'delete',
					callBackFn: () => {
						setTimeout(() => {
							bumpGridTick();
						}, 100);
					},
					callBeforeFn: checkTodayCondition,
				},
				{
					btnType: 'save',
					callBackFn: () => {
						const checkedItems = gridRef.current.getChangedData({ validationYn: false });
						if (!checkedItems || checkedItems.length < 1) {
							showAlert(null, t('msg.MSG_COM_VAL_020'));
							return;
						}

						// 1. 필수값 유효성 검사
						const requiredFieldErrors = validateRequiredFields(checkedItems);
						if (requiredFieldErrors.length > 0) {
							showAlert('필수값 미입력', `다음 필수값을 입력해 주세요:\n\n${requiredFieldErrors.join('\n')}`);
							return;
						}

						const allGridData = gridRef.current.getGridData() || [];

						// 2. 중복 행정동 검사
						const duplicateErrors = validateDuplicateHjdong(allGridData);
						if (duplicateErrors.length > 0) {
							showAlert(
								null,
								`행정동의 적용시작일자가 오늘+3일 부터 등록된 데이터가 존재합니다.\n 해당 행정동 삭제 후 등록가능 합니다.:\n\n${duplicateErrors.join(
									'\n',
								)}`,
							);
							return;
						}

						// 3. 기간 겹침 자동 조정
						const hasAdjustment = adjustOverlappingPeriods(checkedItems, allGridData, gridRef.current);
						if (hasAdjustment) {
							showAlert(
								'기간 조정 안내',
								'동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.',
								() => {
									return;
								},
							);
							return;
						}

						// 4. 저장 실행
						executeSave(checkedItems);
					},
					callBeforeFn: checkTodayCondition,
				},
			],
		};
	}, [
		hjdongOptionList,
		selectMasterGridRow,
		gridRef,
		tabSearchConditions,
		validateRequiredFields,
		validateDuplicateHjdong,
		adjustOverlappingPeriods,
		executeSave,
		t,
		bumpGridTick,
	]);

	// LabelFunction들을 useCallback으로 최적화
	const createHjdongLabelFunction = useCallback(
		() => (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
			if (!value) return '';

			// 아이템에 hjdongNm이 있으면 사용
			if (item?.hjdongNm) {
				return item.hjdongNm;
			}

			// hjdongOptionList에서 찾기
			const hjdong = hjdongOptionList.find(h => h.hjdongCd === value);
			return hjdong?.hjdongNm || value;
		},
		[hjdongOptionList],
	);

	// 날짜 유효성 검사 함수 (재사용 가능)
	const createDateValidator = useCallback(
		// isToDate: 적용종료일자 / 적용시작일자 구분 필드
		// isFromDateToday: 적용시작일자 오늘 날짜 체크 여부 (item 이 N 인경우 오늘날짜부터 체크 가능)
		(isToDate = false, isFromDateToday = false) => {
			return function (oldValue: any, newValue: any, item: any) {
				// 1. 날짜 형식 유효성 검사
				if (!dayjs(newValue.split('-').join(''), 'YYYYMMDD', true).isValid()) {
					return { validate: false, message: t('lbl.INVALID_DATE_FORMAT') };
				}

				const inputDate = dayjs(newValue);
				let offsetDays = 0;
				if (!isFromDateToday && isToDate) {
					offsetDays = -1;
				}
				const after3Days = dayjs().add(3, 'day').startOf('day');
				const selectedHjdongPeriodObj = hjdongPeriodList.find(
					(hjdongObj: any) =>
						hjdongObj?.hjdongCd === item?.hjdongCd &&
						dayjs(hjdongObj?.fromDate).isSameOrBefore(dayjs(item?.fromDate), 'day') &&
						dayjs(hjdongObj?.toDate).isSameOrAfter(dayjs(item?.toDate), 'day'),
				);

				const masterRow = selectMasterGridRowRef.current;
				const fromDateStr = selectedHjdongPeriodObj?.fromDate ?? masterRow?.fromDate;
				const fromDate = fromDateStr ? dayjs(fromDateStr, 'YYYYMMDD').startOf('day') : null;

				// - fromDate < today  => minDate = today
				// - fromDate >= today => minDate = fromDate
				const minDateRule = fromDate && fromDate.isSameOrAfter(after3Days, 'day') ? fromDate : after3Days;

				const minDate = minDateRule.add(offsetDays, 'day');
				const maxDate = dayjs(selectedHjdongPeriodObj?.toDate ?? masterRow?.toDate, 'YYYYMMDD');

				// 2. 최소 날짜 체크
				if (inputDate.isBefore(minDate)) {
					return { validate: false, message: `${minDate.format('YYYY-MM-DD')} 이전의 날짜는 선택할 수 없습니다.` };
				}

				// 3. 최대 날짜 체크
				if (inputDate.isAfter(maxDate)) {
					return { validate: false, message: '종료일을 넘어서 설정할 수 없습니다.' };
				}

				// 4. toDate의 경우 fromDate보다 이후여야 함
				if (isToDate && item.fromDate) {
					const fromDate = dayjs(item.fromDate, 'YYYYMMDD');
					if (inputDate.isBefore(fromDate)) {
						return { validate: false, message: '종료일은 시작일 이후여야 합니다.' };
					}
				}

				return { validate: true, message: '' };
			};
		},
		[t, hjdongPeriodList],
	);

	// 그리드 컬럼 정의 (최적화)
	const gridCol = useMemo(() => {
		const columns = [
			{
				dataField: 'ctpKorNm',
				headerText: '시/도',
				filter: {
					showIcon: true,
				},
				minWidth: 130,
				required: true,
				editable: true,
				dataType: 'code',
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					listFunction: function () {
						return getUniqueByField(hjdongPeriodList, 'ctpKorNm');
					},
					keyField: 'ctpKorNm',
					valueField: 'ctpKorNm',
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'ctpKorNm',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			{
				dataField: 'sigKorNm',
				headerText: '시/구/군',
				filter: {
					showIcon: true,
				},
				minWidth: 130,
				required: true,
				editable: true,
				dataType: 'code',
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					listFunction: function (rowIndex: number, columnIndex: number, item: any, dataField: string) {
						const filteredCtpKorNm = hjdongPeriodList.filter((obj: any) => obj?.ctpKorNm === item?.ctpKorNm);
						return getUniqueByField(filteredCtpKorNm, 'sigKorNm');
					},
					keyField: 'sigKorNm',
					valueField: 'sigKorNm',
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'sigKorNm',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			{
				dataField: 'hjdongCd',
				headerText: '행정동',
				required: true,
				editable: true,
				dataType: 'code',
				minWidth: 130,
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					// list: hjdongOptionList,
					listFunction: function (rowIndex: number, columnIndex: number, item: any, dataField: string) {
						const filteredCtpKorNm = hjdongPeriodList.filter((obj: any) => obj.ctpKorNm === item.ctpKorNm);
						const filteredSigKorNm = filteredCtpKorNm.filter((obj: any) => obj?.sigKorNm === item?.sigKorNm);
						// 다른 권역에서 등록된 행정동 존재 가능! 그래서 중복 제거 처리
						return getUniqueByField(filteredSigKorNm, 'hjdongCd');
					},
					keyField: 'hjdongCd',
					valueField: 'hjdongNm',
				},
				labelFunction: createHjdongLabelFunction(),
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'hjdongCd',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			{
				dataField: 'fromDate',
				headerText: '적용시작일자',
				required: true,
				editable: true,
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				minWidth: 120,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					showExtraDays: false,
					showEditBtn: true,
					showEditorBtnOver: true,
					// validator: createDateValidator(false),
					validator: (oldValue: any, newValue: any, item: any) => {
						const isToDate = false;
						let isFromDateToday = false;
						// 현재 행에서 hjdongCd 가 없을 때 false,
						// 존재 시 newHjdongList 에서 hjdongCd 가 있을 때만 true 처리
						if (
							item?.hjdongCd &&
							hjdongPeriodList.length > 0 &&
							hjdongPeriodList.findIndex((hjdongItem: any) => hjdongItem?.hjdongCd === item?.hjdongCd) > -1
						) {
							isFromDateToday = true;
						}
						return createDateValidator(isToDate, isFromDateToday)(oldValue, newValue, item);
					},
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'fromDate',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			{
				dataField: 'toDate',
				headerText: '적용종료일자',
				required: true,
				editable: true,
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				minWidth: 120,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					showExtraDays: false,
					showEditBtn: true,
					showEditorBtnOver: true,
					validator: createDateValidator(true),
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					// 기존행이면서 delYn 이 'Y' 인 경우 또는 편집 불가 시 선택 불가 처리
					if (item?.initialDelYn !== true && handleCellEditBegin({ dataField: 'toDate', rowIndex })) {
						return 'isEdit';
					}
					gridRef.current.removeEditClass(columnIndex);
					return '';
				},
			},
			{
				dataField: 'delYn',
				headerText: t('lbl.DEL_YN'),
				editable: true,
				required: true,
				minWidth: 'auto',
				commRenderer: {
					type: 'dropDown',
					list: delYnOptions,
					editable: true,
					disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
						// 기존행 이면서 delYn 이 'Y' 인 경우 선택 불가 처리
						if (item?.rowStatus === 'R') return item?.initialDelYn === true;
						// 신규행인 경우 선택 불가 처리
						if (item?.rowStatus === 'I') return true;
						// delYn 이 'Y' 인 경우 선택 불가 처리
						return item?.delYn === 'Y';
					},
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					// 기존행 이면서 delYn 이 'Y' 인 경우 선택 불가 처리
					if (item?.rowStatus === 'R') {
						if (item?.initialDelYn === true) {
							gridRef.current.removeEditClass(columnIndex);
							return '';
						} else {
							return 'isEdit';
						}
					}
					// 신규행인 경우 선택 불가 처리
					else if (item?.rowStatus === 'I') {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
					// delYn 이 'Y' 인 경우 선택 불가 처리
					if (item?.delYn === 'Y') {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					} else {
						return 'isEdit';
					}
				},
			},
			{
				dataField: 'initialDelYn',
				headerText: 'db 데이터 delYn 의 경우 처리 플래그',
				dataType: 'boolean',
				visible: false,
				editable: false,
			},
		];

		return columns;
	}, [delYnOptions, createHjdongLabelFunction, createDateValidator, hjdongPeriodList]);

	//   편집 제어 이벤트 핸들러
	const handleCellEditBegin = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, item } = event;
		const grid = gridRef.current;
		if (!grid) return true;

		const rowStatus = getRowStatusByIndex(grid, rowIndex);

		// 기존행이면서 delYn 이 'Y' 인 경우 선택 불가 처리 (적용필드: toDate, delYn)
		if (['toDate', 'delYn'].includes(dataField as any) && rowStatus === 'R' && item?.initialDelYn === true) {
			return false;
		}

		// 신규행에서 편집 불가능한 필드 체크
		if (UNEDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I' ? false : true;
		}

		// 신규행에서만 편집 가능한 필드 체크
		if (EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I';
		}

		return true;
	}, []);

	// 셀 클릭 이벤트 핸들러
	const handleCellClick = useCallback(
		(event: any) => {
			const { dataField, item: rowObj, rowIndex } = event;
			const grid = gridRef.current;
			if (!grid) return;

			const rowStatus = getRowStatusByIndex(grid, rowIndex);

			if (dataField && rowObj && rowStatus && onSelectSubGridRow) {
				// editRenderer 컬럼(ComboBox/Calendar)이 편집 가능 상태이면
				// onSelectSubGridRow 호출 생략 (map fitBounds 포커스 유실 방지)
				const editRendererFields = ['ctpKorNm', 'sigKorNm', 'hjdongCd', 'fromDate', 'toDate'];
				if (editRendererFields.includes(dataField)) {
					if (handleCellEditBegin({ dataField, rowIndex, item: rowObj })) {
						return;
					}
				}

				onSelectSubGridRow({
					...rowObj,
					rowStatus,
					clickedField: dataField,
					rowIndex,
					eventType: 'cellClick',
				});
			}
		},
		[onSelectSubGridRow, handleCellEditBegin],
	);

	// ── 셀 편집 종료: rowIdField 취득 헬퍼 ──
	const getGridRowIdField = useCallback((grid: any) => {
		return grid?.getProp?.('rowIdField') || grid?.props?.gridProps?.rowIdField || '_$uid';
	}, []);

	// ── 셀 편집 종료: delYn 변경 처리 ──
	const handleDelYnEdit = useCallback((grid: any, rowIndex: number, value: any, item: any) => {
		let changedToDate;
		if (value === 'Y') {
			changedToDate = dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))
				? dayjs(item.fromDate).format('YYYYMMDD')
				: dayjs().add(2, 'day').format('YYYYMMDD');
		} else {
			changedToDate = selectMasterGridRowRef.current?.toDate ?? DEFAULT_END_DATE;
		}
		grid.setCellValue(rowIndex, 'toDate', changedToDate);
	}, []);

	// ── 셀 편집 종료: toDate 변경 처리 ──
	const handleToDateEdit = useCallback((grid: any, rowIndex: number, value: any) => {
		const masterRow = selectMasterGridRowRef.current;
		const isSameAsEnd = dayjs(value).isSame(dayjs(masterRow?.toDate ?? DEFAULT_END_DATE, 'YYYYMMDD'));
		grid.setCellValue(rowIndex, 'delYn', isSameAsEnd ? 'N' : 'Y');
	}, []);

	// ── 셀 편집 종료: ctpKorNm/sigKorNm 계단식 초기화 ──
	const handleCascadeReset = useCallback(
		(grid: any, rowIndex: number, getRowSafe: (g: any, i: number) => any, resetFields: Record<string, string>) => {
			const row = getRowSafe(grid, rowIndex);
			if (!row) return;

			const rowIdField = getGridRowIdField(grid);
			const id = row[rowIdField];
			if (id == null) return;

			const masterRow = selectMasterGridRowRef.current;
			const after3Days = dayjs().add(3, 'day').startOf('day');
			const fromDateStr = masterRow?.fromDate;
			const fromDate = fromDateStr ? dayjs(fromDateStr, 'YYYYMMDD').startOf('day') : null;
			const minDateRule = fromDate?.isSameOrAfter(after3Days, 'day') ? fromDate : after3Days;
			const minDateStr = dayjs(minDateRule).format('YYYYMMDD');
			const maxDateRule = dayjs(masterRow?.toDate ?? DEFAULT_END_DATE, 'YYYYMMDD');
			const maxDateStr = maxDateRule.format('YYYYMMDD');
			const initDelYn = maxDateRule.isBefore(dayjs(DEFAULT_END_DATE)) ? 'Y' : 'N';

			const updatedRow = {
				...row,
				...resetFields,
				[rowIdField]: id,
				fromDate: minDateStr,
				toDate: maxDateStr,
				delYn: initDelYn,
			};

			grid.updateRowsById(updatedRow);
			if (grid.addCheckedRowsByValue) {
				grid.addCheckedRowsByValue(rowIdField, id);
			}
			bumpGridTick();
		},
		[getGridRowIdField, bumpGridTick],
	);

	// ── 셀 편집 종료: hjdongCd 변경 처리 ──
	const handleHjdongCdEdit = useCallback(
		(grid: any, rowIndex: number, value: any, getRowSafe: (g: any, i: number) => any) => {
			const row = getRowSafe(grid, rowIndex);
			if (!row) return;

			const rowIdField = getGridRowIdField(grid);
			const id = row[rowIdField];
			if (id == null) return;

			const after3Days = dayjs().add(3, 'day').startOf('day');

			// 기존 그리드 행에서 같은 행정동 코드가 존재하는지 확인
			const allGridData = grid.getGridData();
			const tempMatches = hjdongPeriodList.filter((obj: any) => obj.hjdongCd === value);
			const sameHjdongData = allGridData.filter((item: any) =>
				tempMatches.some(
					(obj: any) =>
						item.hjdongCd === obj.hjdongCd &&
						dayjs(item.fromDate).isSame(dayjs(obj.fromDate), 'day') &&
						dayjs(item.toDate).isSame(dayjs(obj.toDate), 'day'),
				),
			);

			if (sameHjdongData.length >= 2) {
				showAlert(
					null,
					`${sameHjdongData[0].hjdongNm} 행정동의 등록된 데이터가 모두 존재합니다.\n 해당 행정동 삭제 후 등록가능 합니다.`,
				);
				setTimeout(() => {
					grid.setCellValue(rowIndex, 'hjdongCd', '');
				}, 200);
				return;
			}

			const matches = hjdongPeriodList.filter((obj: any) => obj.hjdongCd === value);
			if (matches.length === 0) return;

			if (matches.some((obj: any) => dayjs(obj?.toDate).isBefore(after3Days))) {
				grid.setCellValue(rowIndex, 'hjdongCd', '');

				const centerObj = commonCodeList.find(c => c.comCd === tabSearchConditions?.dccode);
				const centerName = centerObj ? `[${centerObj?.comCd}]${centerObj?.cdNm}\n` : '';
				const firstDongName = matches[0]?.hjdongNm ?? '';

				showAlert(
					null,
					`일부 행정동의 적용기간이 설정 가능한 범위를 벗어났습니다.\n` +
						`센터 관할권역 행정동 기간 및 권역 기간을 확인 후 다시 설정해 주세요.\n\n` +
						`센터 : ${centerName}\n` +
						`대상 행정동 : ${firstDongName}`,
				);
				return;
			}

			const filteredMatches = matches.filter((obj: any) => !dayjs(obj?.toDate).isBefore(after3Days));

			const makeRowPatch = (baseRow: any, hj: any) => {
				const delYn = hj?.toDate ? (dayjs(hj.toDate).isBefore(dayjs(DEFAULT_END_DATE)) ? 'Y' : 'N') : 'N';
				const fromDate = dayjs(hj.fromDate).isBefore(after3Days) ? after3Days.format('YYYYMMDD') : hj?.fromDate;
				return {
					...baseRow,
					hjdongNm: hj?.hjdongNm || '',
					fromDate: fromDate,
					toDate: hj?.toDate || DEFAULT_END_DATE,
					delYn,
				};
			};

			// 1) 첫 번째는 현재 행 update
			const first = filteredMatches[0];
			const updatedRow = {
				...makeRowPatch(row, first),
				[rowIdField]: id,
			};
			grid.updateRowsById(updatedRow);
			grid.addCheclue?.(rowIdField, id);

			// 2) 두 번째부터는 행 추가
			for (let i = 1; i < filteredMatches.length; i++) {
				const hj = filteredMatches[i];
				const newRow = {
					...makeRowPatch(row, hj),
					rowStatus: 'I',
				};
				grid.addRow?.(newRow, rowIndex + i);
			}

			bumpGridTick();
		},
		[hjdongPeriodList, commonCodeList, tabSearchConditions, getGridRowIdField, bumpGridTick],
	);

	// 데이터 동기화 이벤트 핸들러
	const handleCellEditEnd = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, value, item } = event;

			const getRowSafe = (grid: any, idx: number) => {
				try {
					return grid?.getItemByRowIndex?.(idx) ?? event.item;
				} catch {
					return event.item;
				}
			};

			setTimeout(() => {
				const grid = gridRef.current;
				if (!grid) return;

				try {
					if (dataField === 'delYn') {
						handleDelYnEdit(grid, rowIndex, value, item);
					} else if (dataField === 'toDate') {
						handleToDateEdit(grid, rowIndex, value);
					} else if (dataField === 'ctpKorNm') {
						handleCascadeReset(grid, rowIndex, getRowSafe, { sigKorNm: '', hjdongNm: '', hjdongCd: '' });
					} else if (dataField === 'sigKorNm') {
						handleCascadeReset(grid, rowIndex, getRowSafe, { hjdongNm: '', hjdongCd: '' });
					} else if (dataField === 'hjdongCd') {
						handleHjdongCdEdit(grid, rowIndex, value, getRowSafe);
					}
				} catch (error) {
					//console.warn('handleCellEditEnd failed:', error);
				}
			}, 100);
		},
		[handleDelYnEdit, handleToDateEdit, handleCascadeReset, handleHjdongCdEdit],
	);

	// 체크박스 체크 이벤트 핸들러
	const handleRowCheckClick = useCallback(
		(event: any) => {
			return bumpGridTick();
		},
		[bumpGridTick],
	);

	//   그리드 이벤트 바인딩 (gridKey 변경 시 재바인딩)
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellClick', handleCellClick);
		grid.bind('cellEditBegin', handleCellEditBegin);
		grid.bind('cellEditEnd', handleCellEditEnd);
		grid.bind('rowCheckClick', handleRowCheckClick);
		grid.bind('rowAllChkClick', handleRowCheckClick);

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellClick');
				grid.unbind('cellEditBegin');
				grid.unbind('cellEditEnd');
				grid.unbind('rowCheckClick');
				grid.unbind('rowAllChkClick');
			}
		};
	}, [gridKey, handleCellClick, handleCellEditBegin]);

	//   gridData 변경 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid || !gridData) return;

		const customGridData = gridData.map((item: any) => {
			return {
				...item,
				initialDelYn: item?.delYn === 'Y' ? true : false,
			};
		});

		setBackupGridData(customGridData);
		grid.setGridData(customGridData);
		// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
		grid.setColumnSizeList(grid.getFitColumnSizeList(true));
		// 데이터 최초 불러올때 행선택 처리
		if (customGridData.length > 0) {
			onSelectSubGridRow({
				...customGridData[0],
			});
			// 그리드 완전 렌더링 후 선택 처리
			const selectFirstRow = () => {
				const currentGrid = gridRef.current;
				if (!currentGrid) return;

				try {
					// 다양한 선택 방법 조합
					if (currentGrid.selectRow) {
						currentGrid.selectRow(0);
					}
					if (currentGrid.setSelectionByIndex) {
						currentGrid.setSelectionByIndex(0, 0);
					}
					if (currentGrid.focus) {
						currentGrid.focus();
					}
				} catch (error) {}
			};

			// 충분한 지연 시간으로 실행
			setTimeout(selectFirstRow, 250);
		}
	}, [gridData]);

	//   hjdongPeriodList 변경 시 그리드 재생성 (MasterListGrid와 동일한 패턴)
	useEffect(() => {
		if (!hjdongPeriodList?.length) return;

		// 현재 편집 상태 백업
		const grid = gridRef.current;
		if (grid?.getGridData) {
			const currentData = grid.getGridData();
			if (currentData?.length > 0) {
				setBackupGridData(currentData);
			}
		}

		setGridKey(prev => prev + 1);
	}, [hjdongPeriodList]);

	//   그리드 재생성 후 데이터 복원
	useEffect(() => {
		if (gridKey === 0 || !backupGridData.length) return;

		const timer = setTimeout(() => {
			const grid = gridRef.current;
			if (grid?.setGridData) {
				grid.setGridData(backupGridData);
				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				grid.setColumnSizeList(grid.getFitColumnSizeList(true));
			}
		}, GRID_UPDATE_DELAY);

		return () => clearTimeout(timer);
	}, [gridKey, backupGridData]);

	return (
		<AGrid dataProps={''}>
			<Form
				disabled={
					!selectMasterGridRow || // 상위 그리드 행 선택시 데이터가 없을 때
					selectMasterGridRow.rowStatus === 'I' || // 상위 그리드 행 선택시 I 일때 버튼 안보이게 처리
					selectMasterGridRow?.initialDelYn === true // 상위 그리드 행이 처음부터 중단 상태일 때
					// || !hjdongPeriodList?.length // 사용 가능한 행정동 옵션 리스트가 없을 때
					// || selectMasterGridRow.delYn === 'Y' // 상위 그리드 행 선택시 Y 일때 버튼 안보이게 처리}
				}
			>
				<GridTopBtn gridTitle={'행정동'} gridBtn={gridBtn} totalCnt={gridData?.length} />
			</Form>

			<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default SubListGrid;
