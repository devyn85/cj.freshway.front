/*
 ############################################################################
 # FiledataField	: districtGroupMasterListGrid.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 탭 메인 그리드
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';

// Types
import { TTabKeyUnion } from '@/pages/ms/MsDeliveryDistrict';
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import {
	apiPostGetDistrictGroupList,
	apiPostSaveDistrictGroup,
	apiPostSrmValidateDeleteGroupPop,
	apiPostSrmValidateGroup,
} from '@/api/ms/apiMsDeliveryDistrict';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface DistrictGroupMasterListGridProps {
	gridData: any[];
	gridRef: React.RefObject<any>;
	tabSearchConditions: any;
	onSelectMasterGridRow: (selectedGridRowObj: any) => void;
	onSearch: (forceRequest?: TTabKeyUnion, isSearch?: boolean) => Promise<void>; // 서브데이터 및 pop 리스트 요청은 상위컴포넌트에서 처리
	// 권역그룹 탭의 검색 조건 (권역그룹 저장 시 권역탭 조회가 되었다면 권역그룹 리스트 갱신을 위해 재요청분기 조건 처리용)
	districtTabSearchConditions: any;
	// 권역 탭의 메인그리드 권역그룹 옵션 리스트 업데이트
	setDistrictTabDataState: (districtGroupList: any) => void;
	isSearched: boolean; // 추가/삭제/저장 버튼의 보이기 유무 조건
	selectMasterGridRow: any; // 선택된 메인 그리드 행 데이터 (탭 변경 시 선택된 행 데이터 유지 처리)
}
interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}
// 상수 정의
const GRID_UPDATE_DELAY = 100;
const REFLECTION_SCHEDULE_MAX_DAYS = 3;
const EDITABLE_NEW_ROW_FIELDS = ['dlvgroupNm', 'fromDate'] as const;
const UNEDITABLE_NEW_ROW_FIELDS = ['toDate'] as const;
const DEFAULT_END_DATE = '29991231';

const DistrictGroupMasterListGrid = ({
	gridData,
	gridRef,
	tabSearchConditions,
	onSelectMasterGridRow,
	onSearch,
	districtTabSearchConditions,
	setDistrictTabDataState,
	isSearched,
	selectMasterGridRow,
}: DistrictGroupMasterListGridProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	// State 관리
	const [gridKey, setGridKey] = useState(0);
	const [backupGridData, setBackupGridData] = useState<any[]>([]);

	// 그리드 기본 설정
	const gridProps = useMemo(
		() => ({
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 그리드 버튼 설정 (개선된 버전)
	const gridBtn = useMemo((): GridBtnPropsType => {
		// 필수값 유효성 검사 함수
		const validateRequiredFields = (data: any[]) => {
			const validateDataField = ['dlvgroupNm', 'fromDate', 'toDate', 'delYn'];
			const fieldNameMap: { [key: string]: string } = {
				dlvgroupNm: '권역그룹명',
				fromDate: '적용시작일자',
				toDate: '적용종료일자',
				delYn: '삭제여부',
			};
			const errors: string[] = [];

			data.forEach((item, index) => {
				const rowNumber = index + 1;

				validateDataField.forEach(fieldName => {
					const fieldValue = item[fieldName];

					// null, undefined, 빈 문자열, 공백만 있는 문자열 체크
					if (
						fieldValue === null ||
						fieldValue === undefined ||
						fieldValue === '' ||
						(typeof fieldValue === 'string' && fieldValue.trim() === '')
					) {
						const fieldDisplayName = fieldNameMap[fieldName] || fieldName;
						errors.push(`${fieldDisplayName}을(를) 입력해주세요.`);
					}
				});
			});

			return errors;
		};

		const getInitialValues = () => ({
			rowStatus: 'I',
			serialkey: '',
			dccode: tabSearchConditions?.dccode || '',
			dlvgroupId: '',
			dlvgroupNm: '',
			fromDate: dayjs().add(REFLECTION_SCHEDULE_MAX_DAYS, 'day').format('YYYYMMDD'),
			toDate: DEFAULT_END_DATE,
			delYn: 'N',
			initialDelYn: false,
		});

		const onSaveFn = (checkedItems: any[]) => {
			// 함수로 만들기
			// 신규, 수정, 삭제 구분하여 처리

			// TODO: (임시) 삭제는 백엔드에서 처리
			// (임시)백엔드 삭제조건 rowStatus === 'U' + fromDate >= today + 3 + delyn ==='Y'

			// 삭제 여부 판별 함수
			const isDeleteTarget = (item: any) => {
				if (item.rowStatus !== 'U') return false;

				const from = dayjs(String(item.fromDate).replaceAll('-', ''), 'YYYYMMDD');
				const today = dayjs().startOf('day');
				const threeDaysAfter = today.add(3, 'day').startOf('day');
				// fromDate 가 오늘+3 이후이고(from > today + 3), delYn === 'Y' 인 경우만 삭제
				return from.isSameOrAfter(threeDaysAfter) && item?.delYn === 'Y';
			};

			const insertItemList = checkedItems.filter((item: any) => item.rowStatus === 'I');
			const deleteItemList = checkedItems.filter(isDeleteTarget);
			const updateItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && !isDeleteTarget(item));

			const mergeMasterList = [
				...insertItemList,
				...updateItemList.map((item: any) => ({ ...item, rowStatus: 'U' })),
				...deleteItemList.map((item: any) => ({
					...item,
					rowStatus: 'U',
				})),
			];

			// 저장 성공 후 처리 함수
			const handleSaveSuccess = async (res: any) => {
				if (res?.statusCode !== 0) return;

				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
				// 메인 그리드 재요청 처리
				onSearch('districtGroup', false);
				// 권역 탭에서 이미 조회가 된 상태라면 권역그룹 리스트 갱신을 위한재요청 처리
				if (
					districtTabSearchConditions &&
					districtTabSearchConditions?.dccode &&
					districtTabSearchConditions?.effectiveDate
				) {
					const groupRes = await apiPostGetDistrictGroupList({
						dccode: districtTabSearchConditions?.dccode,
						effectiveDate: dayjs(districtTabSearchConditions?.effectiveDate).format('YYYYMMDD'),
						dlvgroupId: '',
						dlvgroupNm: '',
					});
					if (groupRes?.statusCode === 0) {
						// 권역탭 그리드 권역그룹리스트 업데이트
						setDistrictTabDataState({
							districtGroupList: groupRes.data || [],
						});
					}
				}
			};

			// 실제 저장 api 호출 함수
			const executeSave = () => {
				const confirmMessage = `${t('msg.MSG_COM_CFM_003')}\n 신규: ${insertItemList.length}개, \n수정: ${
					updateItemList.length
				}개, \n삭제: ${deleteItemList.length}개`;

				showConfirm(null, confirmMessage, () => {
					apiPostSaveDistrictGroup(mergeMasterList)
						.then(handleSaveSuccess)
						.catch(() => {
							showAlert(null, '저장 중 오류가 발생했습니다.');
						});
				});
			};

			// 삭제검증 → SRM검증 → 저장을 "한 흐름"으로 묶기
			const runValidationsAndMaybeSave = async () => {
				// 1) 권역 그룹 삭제 검증 (대표 POP 존재 시 차단)
				if (deleteItemList.length > 0) {
					try {
						const res = await apiPostSrmValidateDeleteGroupPop(deleteItemList);

						if (res?.statusCode !== 0) {
							showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
							return;
						}

						if (res?.data?.hasPopYn === 'Y') {
							showAlert(null, '현재 삭제하려는 권역그룹에 대표 POP가 등록되어 있습니다. \n 삭제 후 진행해주세요.');
							return;
						}
					} catch {
						showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
						return;
					}
				}

				// 2) 수정/삭제 항목 존재 시 SRM 유효성 검사
				const srmValidateList = [...updateItemList, ...deleteItemList].map((item: any) => ({
					dccode: item.dccode,
					dlvgroupId: item.dlvgroupId,
					toDate: dayjs(String(item.toDate).replaceAll('-', ''), 'YYYYMMDD').format('YYYYMMDD'),
				}));

				if (srmValidateList.length > 0) {
					try {
						const res = await apiPostSrmValidateGroup(srmValidateList);

						if (res?.statusCode !== 0) {
							showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
							return;
						}

						if (res?.data?.affectedYn === 'Y') {
							showAlert(null, res?.data?.message);
							return;
						}

						// affectedYn === 'N' → 저장
						executeSave();
						return;
					} catch {
						showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
						return;
					}
				}

				// 3) SRM 유효성 검사 불필요 - 바로 저장 (insert만 있는 케이스 포함)
				executeSave();
			};

			// 기존 .then 체인 대신, 여기서 한 번만 호출
			void runValidationsAndMaybeSave();
		};

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus',
					initValues: getInitialValues(),
					callBeforeFn: () => {
						// TODO: 임시 처리 로직 (1개의 신규행이 존재시 추가로 신규행 추가못하게 막는 처리)
						const newRowCount = gridRef.current?.getGridData?.()?.filter((a: any) => a.rowStatus === 'I').length;
						if (newRowCount && newRowCount >= 1) {
							showAlert(null, '현재 신규행 저장 이후 추가로 진행 해주세요.');
							return true;
						}

						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions?.effectiveDate &&
							dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day')
						) {
							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 \n 입력/수정/삭제가 가능합니다.`);
							return true;
						}
					},
				},
				{
					btnType: 'delete',
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions?.effectiveDate &&
							dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day')
						) {
							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 \n 입력/수정/삭제가 가능합니다.`);
							return true;
						}
					},
				},
				{
					btnType: 'save',
					callBackFn: () => {
						const checkedItems = gridRef.current.getChangedData({ validationYn: false });
						if (!checkedItems || checkedItems.length < 1) {
							showAlert(null, t('msg.MSG_COM_VAL_020'));
							return;
						}

						// 유효성 검사 조건
						// 1. 필수값 유효성 검사
						const requiredFieldErrors = validateRequiredFields(checkedItems);

						if (requiredFieldErrors.length > 0) {
							const requiredFieldErrorsMessage = requiredFieldErrors.join('\n');
							showAlert('필수값 미입력', `다음 필수값을 입력해 주세요:\n\n${requiredFieldErrorsMessage}`);
							return;
						}

						// 저장 요청 처리
						return onSaveFn(checkedItems);
					},
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions?.effectiveDate &&
							dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day')
						) {
							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 \n 입력/수정/삭제가 가능합니다.`);
							return true;
						}
					},
				},
			],
		};
	}, [tabSearchConditions, gridRef, onSearch, districtTabSearchConditions, t]);

	// 날짜 유효성 검사 함수
	const createDateValidator = useCallback(
		// isToDate: 적용종료일자 / 적용시작일자 구분 필드
		// isFromDateToday: 적용시작일자 오늘 날짜 체크 여부 (item 이 N 인경우 오늘날짜부터 체크 가능)
		(isToDate = false) => {
			return function (oldValue: any, newValue: any, item: any) {
				// 1. 날짜 형식 유효성 검사
				if (!dayjs(newValue.split('-').join(''), 'YYYYMMDD', true).isValid()) {
					return { validate: false, message: t('lbl.INVALID_DATE_FORMAT') };
				}

				const inputDate = dayjs(newValue);
				const offsetDays = isToDate ? 1 : 2;
				const minDate = dayjs().add(offsetDays, 'day');
				const maxDate = dayjs(DEFAULT_END_DATE, 'YYYYMMDD');

				// 2. 최소 날짜 체크
				if (inputDate.isBefore(minDate)) {
					const message = `${isToDate ? '적용종료일자' : '적용시작일자'}는 오늘 기준 +${
						offsetDays + 1
					}일 이후 일자를 선택 할 수 있습니다.`;
					return { validate: false, message: message };
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
		[t],
	);

	// 그리드 컬럼 정의 (최적화)
	const gridCol = useMemo(() => {
		const columns = [
			{
				headerText: '권역그룹ID',
				dataField: 'dlvgroupId',
				required: false,
				editable: false,
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					if (item?.rowStatus === 'I') {
						return '자동발급';
					}
					return value;
				},
			},
			{
				headerText: '권역그룹명',
				dataField: 'dlvgroupNm',
				required: true,
				editable: true,
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'dlvgroupNm',
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
				dataType: 'date',
				editable: true,
				required: true,
				// width: 200,
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					showExtraDays: false,
					showEditBtn: true,
					showEditorBtnOver: true,
					validator: createDateValidator(false),
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
				dataType: 'date',
				editable: true,
				required: true,
				// width: 200,
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
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
					if (
						item?.initialDelYn !== true &&
						handleCellEditBegin({
							dataField: 'toDate',
							rowIndex: rowIndex,
						})
					) {
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
				minWidth: 85,
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
					if (item?.rowStatus === 'R') {
						// 기존행 이면서 delYn 이 'Y' 인 경우 선택 불가 처리
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
	}, [delYnOptions]);

	// 셀 클릭 이벤트 함수
	const handleCellClick = useCallback(
		(event: any) => {
			const { dataField, item: rowObj, rowIndex } = event;
			const grid = gridRef.current;
			if (!grid) return;

			const rowStatus = getRowStatusByIndex(grid, rowIndex);
			if (dataField && rowObj && rowStatus) {
				onSelectMasterGridRow({
					...rowObj,
					rowStatus,
				});
			}
		},
		[onSelectMasterGridRow],
	);

	// 편집 제어 이벤트
	const handleCellEditBegin = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, item } = event;
		const grid = gridRef.current;
		if (!grid) return true;

		const rowStatus = getRowStatusByIndex(grid, rowIndex);

		// 기존행이면서 delYn 이 'Y' 인 경우 선택 불가 처리 (적용필드: toDate, delYn)
		if (['toDate', 'delYn'].includes(dataField as any) && rowStatus === 'R' && item?.initialDelYn === true) {
			return false;
		}

		if (UNEDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I' ? false : true;
		}

		if (EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I';
		}

		return true;
	}, []);

	// delYn 편집 시 toDate 동기화
	const handleDelYnEdit = (grid: any, rowIndex: number, value: any, item: any) => {
		let changedToDate;
		if (value === 'Y') {
			// item.fromDate 가 오늘 +2 보다 이후일 경우 적용종료일자를 item.fromDate 로 변경
			changedToDate = dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))
				? dayjs(item.fromDate).format('YYYYMMDD')
				: dayjs().add(2, 'day').format('YYYYMMDD');
		} else {
			changedToDate = DEFAULT_END_DATE;
		}
		grid.setCellValue(rowIndex, 'toDate', changedToDate);
	};

	// toDate 편집 시 delYn 동기화
	const handleToDateEdit = (grid: any, rowIndex: number, value: any) => {
		// 적용일자가 29991231 일 경우 삭제여부를 'N' 으로 변경
		const isDefaultEnd = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD'));
		grid.setCellValue(rowIndex, 'delYn', isDefaultEnd ? 'N' : 'Y');
	};

	// dlvgroupNm 편집 시 길이 제한
	const handleDlvgroupNmEdit = (grid: any, rowIndex: number, value: any) => {
		const text = value == null ? '' : String(value);
		if (text.length > 20) {
			grid.setCellValue(rowIndex, 'dlvgroupNm', text.slice(0, 20));
			showAlert(null, '최대 20자까지 입력할 수 있습니다.');
		}
	};

	// 데이터 동기화 처리 함수
	const handleCellEditEnd = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, value, item } = event;
		setTimeout(() => {
			const grid = gridRef.current;
			if (!grid) return;

			try {
				if (dataField === 'delYn') handleDelYnEdit(grid, rowIndex, value, item);
				else if (dataField === 'toDate') handleToDateEdit(grid, rowIndex, value);
				else if (dataField === 'dlvgroupNm') handleDlvgroupNmEdit(grid, rowIndex, value);
			} catch (error) {}
		}, 100);
	}, []);

	// 그리드 이벤트 바인딩 (gridKey 변경 시 재바인딩)
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellClick', handleCellClick); // 셀 클릭
		grid.bind('cellEditBegin', handleCellEditBegin); // 편집 제어
		grid.bind('cellEditEnd', handleCellEditEnd); // 다른 컬럼 동기화 처리

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellClick');
				grid.unbind('cellEditBegin');
				grid.unbind('cellEditEnd');
			}
		};
	}, [gridKey, handleCellClick, handleCellEditBegin]);

	// gridData 변경 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid || !gridData) return;

		// 데이터 주입
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
			// 권역 그리드 선택만 하도록 처리
			// setSelectMasterGridRow({
			// 	...gridData[0],
			// });
			// 그리드 완전 렌더링 후 선택 처리
			const selectFirstRow = () => {
				const currentGrid = gridRef.current;
				if (!currentGrid) return;

				try {
					// 1) 선택할 rowIndex 결정
					let targetRowIndex = 0;

					if (selectMasterGridRow && Object.keys(selectMasterGridRow).length > 0) {
						// 추천: dlvgroupId 우선, 없으면 serialkey로
						const target = customGridData.findIndex(
							r =>
								(selectMasterGridRow.dlvgroupId && r.dlvgroupId === selectMasterGridRow.dlvgroupId) ||
								(selectMasterGridRow.serialkey && r.serialkey === selectMasterGridRow.serialkey),
						);

						if (target >= 0) targetRowIndex = target;
					}

					// 2) 해당 rowIndex 선택
					if (currentGrid.selectRow) currentGrid.selectRow(targetRowIndex);
					if (currentGrid.setSelectionByIndex) currentGrid.setSelectionByIndex(targetRowIndex, 0);
					if (currentGrid.focus) currentGrid.focus();
				} catch (error) {}
			};

			// 충분한 지연 시간으로 실행
			setTimeout(selectFirstRow, 250);
		}
	}, [gridData]);

	// selectMasterGridRow 변경 시: 데이터 재주입 없이 "선택만" 변경
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		// 선택 정보가 없거나, 아직 그리드에 데이터가 없으면 스킵
		if (!selectMasterGridRow || Object.keys(selectMasterGridRow).length === 0) return;
		if (!backupGridData || backupGridData.length === 0) return;

		// backupGridData 기준으로 선택할 rowIndex 찾기 (dlvgroupId 우선, 없으면 serialkey)
		const targetRowIndex = backupGridData.findIndex(
			(r: any) =>
				(selectMasterGridRow.dlvgroupId && r.dlvgroupId === selectMasterGridRow.dlvgroupId) ||
				(selectMasterGridRow.serialkey && r.serialkey === selectMasterGridRow.serialkey),
		);

		if (targetRowIndex < 0) return;

		try {
			if (grid.selectRow) grid.selectRow(targetRowIndex);
			if (grid.focus) grid.focus();
		} catch (e) {}
	}, [selectMasterGridRow, backupGridData]);

	// 그리드 재생성 후 데이터 복원
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
			<Form disabled={!isSearched}>
				<GridTopBtn gridTitle="권역그룹" gridBtn={gridBtn} totalCnt={gridData?.length ?? 0} />
			</Form>
			<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default DistrictGroupMasterListGrid;
