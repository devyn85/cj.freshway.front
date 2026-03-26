/*
 ############################################################################
 # FiledataField	: PopGrid.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 대표POP 탭 그리드
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Util
import { RedefinePopList } from '@/components/ms/deliveryDistrict/common/deliveryDistrictUtils';
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Types
import { TTabKeyUnion } from '@/pages/ms/MsDeliveryDistrict';
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiPostGetPopList, apiPostSavePopList, apiPostSrmValidatePop } from '@/api/ms/apiMsDeliveryDistrict';

// Hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Save Helpers
import {
	applyAutoDateAdjust,
	SaveContext,
	validateAfterAutoAdjust,
	validateBeforeAutoAdjust,
} from './popGridSaveHelpers';

interface IPopGridProps {
	gridData: any[];
	gridRef: React.RefObject<any>;
	onSearch: (forceRequest?: TTabKeyUnion) => void;
	tabSearchConditions: Record<TTabKeyUnion, any>; // 조회조건 가져오기
	setDistrictGroupTabDataState: (popListUpdate: any) => void;
	isSearched: boolean;
	popPage: number;
	popTotalCount: number; // TODO: 그리드 상단 총 갯수에 해당 숫자로 추후 변경처리하기
	onLoadMore: () => void;
}

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}

const DEFAULT_END_DATE = '29991231';

const PopGrid = ({
	gridData,
	gridRef,
	onSearch,
	tabSearchConditions,
	setDistrictGroupTabDataState,
	isSearched,
	popPage,
	popTotalCount,
	onLoadMore,
}: IPopGridProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const EDITABLE_NEW_ROW_FIELDS = ['dccode', 'fromDate', 'popName', 'popNo'];
	const UNEDITABLE_NEW_ROW_FIELDS = ['toDate'];

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	const commonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	const baseYnList = getCommonCodeList('YN2') ?? [];

	const centerOptions = useMemo(() => {
		if (commonCodeList.length > 0) {
			return commonCodeList.map(item => ({
				dccode: item.comCd,
				dcname: item.cdNm,
			}));
		} else {
			return [];
		}
	}, [commonCodeList]);

	const centerMap: Record<string, string> = useMemo(() => {
		return Object.fromEntries(centerOptions.map(o => [o.dccode, o.dcname]));
	}, [centerOptions]);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	// 삭제 여부 판별 함수 (fromDate 가 오늘+3 일 부터 이고(from >= today+3), delYn === 'Y' 인 경우만 삭제)
	const isDeleteTarget = (item: any) => {
		if (item.rowStatus !== 'U') return false;

		const today = dayjs().startOf('day');

		const from = dayjs(String(item.fromDate).replaceAll('-', ''), 'YYYYMMDD');
		const to = dayjs(String(item.toDate).replaceAll('-', ''), 'YYYYMMDD');

		const threeDaysAfter = today.add(3, 'day');

		// fromDate 가 오늘+3 일 부터 이고(from >= today+3), delYn === 'Y' 인 경우만 삭제
		return from.isSameOrAfter(threeDaysAfter) && item?.delYn === 'Y' && to.format('YYYYMMDD') !== DEFAULT_END_DATE;
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 저장 함수
	const saveMngList = useCallback((): void => {
		// rowStatus 감지 함수
		const getAllGridDataWithStatus = (grid: any) => {
			const data: any[] = grid.getGridData?.() || [];
			return data.map((item, rowIndex) => ({
				...item,
				rowIndex,
				rowStatus: getRowStatusByIndex(grid, rowIndex),
			}));
		};

		const grid = gridRef.current;
		const checkedItems = grid.getChangedData({ validationYn: false });
		const allItems = getAllGridDataWithStatus(grid);
		const today = dayjs();
		const iuItems = checkedItems?.filter((item: any) => item.rowStatus === 'I' || item.rowStatus === 'U') || [];

		// 저장 컨텍스트 생성
		const ctx: SaveContext = {
			grid,
			gridRef,
			checkedItems,
			allItems,
			today,
			todayPlus2: today.add(2, 'day'),
			todayPlus3: today.add(3, 'day'),
			endOfTime: dayjs(DEFAULT_END_DATE, 'YYYYMMDD'),
			existingItems: allItems.filter((item: any) => item.rowStatus === 'R'),
			iuItems,
			newUpdatedNotDeleteTargetItems: iuItems.filter((item: any) => !isDeleteTarget(item)),
			isDeleteTarget,
			t,
		};

		// 1. 유효성 검사 (자동조정 처리 전)
		if (!validateBeforeAutoAdjust(ctx)) return;

		// 2. 자동 조정 처리
		if (applyAutoDateAdjust(ctx)) {
			showAlert(
				'기간 조정 안내',
				'동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.',
			);
			return;
		}

		// 3. 유효성 검사 (자동처리 후)
		if (!validateAfterAutoAdjust(ctx)) return;

		// 4. 최종 저장 처리
		executeSaveWithSrmCheck();

		/**
		 *
		 */
		function executeSaveWithSrmCheck() {
			const finalCheckedItems = grid.getChangedData({ validationYn: false });

			if (!finalCheckedItems || finalCheckedItems.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_020'));
				return;
			}

			const insertItemList = finalCheckedItems.filter((item: any) => item.rowStatus === 'I');
			const deleteItemList = finalCheckedItems.filter(isDeleteTarget);
			const updateItemList = finalCheckedItems.filter((item: any) => item.rowStatus === 'U' && !isDeleteTarget(item));

			const mergeMasterList = [
				...insertItemList,
				...updateItemList.map((item: any) => ({ ...item, rowStatus: 'U' })),
				...deleteItemList.map((item: any) => ({ ...item, rowStatus: 'D' })),
			];

			const refreshDistrictGroupPopList = () => {
				if (!tabSearchConditions['districtGroup']) return;
				apiPostGetPopList({
					dccode: tabSearchConditions['districtGroup']?.dccode,
					effectiveDate: dayjs(tabSearchConditions['districtGroup']?.effectiveDate).format('YYYYMMDD'),
					searchKeyword: '',
				}).then(res => {
					if (res?.statusCode === 0) {
						setDistrictGroupTabDataState({
							popList: RedefinePopList(res.data || []),
						});
					}
				});
			};

			const handleSaveSuccess = (res: any) => {
				if (res && res.statusCode === 0) {
					showMessage({ content: t('msg.MSG_COM_SUC_003'), modalType: 'info' });
					onSearch('pop');
					refreshDistrictGroupPopList();
				}
			};

			const performSaveApi = () => {
				apiPostSavePopList(mergeMasterList)
					.then(handleSaveSuccess)
					.catch(err => {
						//console.warn('executeSave error:::', err);
					});
			};

			const executeSave = () => {
				const confirmMessage = `${t('msg.MSG_COM_CFM_003')}\n 신규: ${insertItemList.length ?? 0}개, \n수정: ${
					updateItemList.length ?? 0
				}개, \n삭제: ${deleteItemList.length ?? 0}개`;
				showConfirm(null, confirmMessage, performSaveApi);
			};

			const handleSrmValidationResult = (res: any) => {
				if (res?.statusCode !== 0) return;
				if (res?.data?.affectedYn === 'Y') {
					showAlert(null, `현재 권역그룹 하위에 해당 대표POP가 등록이 되어 있습니다. \n 삭제 후 진행해주세요.`);
					return;
				}
				if (res?.data?.affectedYn === 'N') {
					executeSave();
				}
			};

			const srmValidateList = [...updateItemList, ...deleteItemList];

			if (srmValidateList.length > 0) {
				apiPostSrmValidatePop(srmValidateList)
					.then(handleSrmValidationResult)
					.catch(err => {
						//console.warn('handleSrmValidationResult error:::', err);
					});
			} else {
				executeSave();
			}
		}
	}, [gridRef, tabSearchConditions]);

	// 그리드 차트 버튼
	const gridBtn = useMemo((): GridBtnPropsType => {
		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus', // 행추가
					initValues: {
						serialkey: '',
						dccode: tabSearchConditions['pop']?.dccode ?? '', //물류센터 코드
						popNo: '', // 대표 POP 번호
						popName: '', // 대표 POP 명
						fromDate: dayjs().add(3, 'day').format('YYYYMMDD'), // 적용시작일자
						toDate: DEFAULT_END_DATE, // 적용종료일자
						description: '', // 비고
						baseYn: 'N', // 기본 대표 POP 여부
						delYn: 'N', // 삭제 여부
						rowStatus: 'I', // 행 상태
					},
					callBeforeFn: () => {
						// 대표 POP 권역 필터 조건에 값이 존재할 때 필터 조건 삭제 및 조회 후 진행해 주세요 얼럿 띄우기
						if (
							tabSearchConditions['pop']?.searchKeyword ||
							tabSearchConditions['pop']?.searchKeyword?.trim()?.length > 0
						) {
							showAlert(
								null,
								'대표 POP 권역 필터 조건 존재 시 추가/수정/삭제가 제한됩니다.\n 필터 조건을 삭제 맟 조회 후 진행해주세요.',
							);
							return true;
						}
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions['districtGroup']?.effectiveDate &&
							dayjs(tabSearchConditions['pop']?.effectiveDate).isSame(dayjs(), 'day')
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
					btnType: 'delete', // 행삭제
					callBeforeFn: () => {
						// 대표 POP 권역 필터 조건에 값이 존재할 때 필터 조건 삭제 및 조회 후 진행해 주세요 얼럿 띄우기
						if (
							tabSearchConditions['pop']?.searchKeyword ||
							tabSearchConditions['pop']?.searchKeyword?.trim()?.length > 0
						) {
							showAlert(
								null,
								'대표 POP 권역 필터 조건 존재 시 추가/수정/삭제가 제한됩니다.\n 필터 조건을 삭제 맟 조회 후 진행해주세요.',
							);
							return true;
						}
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions['districtGroup']?.effectiveDate &&
							dayjs(tabSearchConditions['pop']?.effectiveDate).isSame(dayjs(), 'day')
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
					btnType: 'save', // 저장
					callBackFn: saveMngList,
					callBeforeFn: () => {
						// 대표 POP 권역 필터 조건에 값이 존재할 때 필터 조건 삭제 및 조회 후 진행해 주세요 얼럿 띄우기
						if (
							tabSearchConditions['pop']?.searchKeyword ||
							tabSearchConditions['pop']?.searchKeyword?.trim()?.length > 0
						) {
							showAlert(
								null,
								'대표 POP 권역 필터 조건 존재 시 추가/수정/삭제가 제한됩니다.\n 필터 조건을 삭제 맟 조회 후 진행해주세요.',
							);
							return true;
						}
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions['districtGroup']?.effectiveDate &&
							dayjs(tabSearchConditions['pop']?.effectiveDate).isSame(dayjs(), 'day')
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
	}, [globalVariable, saveMngList, tabSearchConditions]);

	const gridProps = useMemo(() => {
		return {
			editable: true, // 데이터 수정 여부
			// editBeginMode: 'click', // 추가 TODO: grid selectsearch 로 임시 추가 처리
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		};
	}, [gridData]);

	// 날짜 유효성 검사 함수
	const createDateValidator = useCallback(
		// isToDate: 적용종료일자 / 적용시작일자 구분 필드
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

				// 5. fromDate의 경우 toDate 보다 이전여야 함
				if (!isToDate && item.toDate) {
					const toDate = dayjs(item.toDate, 'YYYYMMDD');
					if (inputDate.isAfter(toDate)) {
						return { validate: false, message: '시작일은 종료일 이전여야 합니다.' };
					}
				}

				return { validate: true, message: '' };
			};
		},
		[t],
	);

	const gridCol = useMemo(() => {
		return [
			{
				dataField: 'dccode', //centerlocCd
				headerText: '물류센터',
				dataType: 'code',
				minWidth: 100,
				editable: false,
				required: false,
				// //@ts-ignore
				// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// 	if (item.rowStatus !== 'I') {
				// 		gridRef.current.removeEditClass(columnIndex);
				// 	} else {
				// 		// 편집 가능 class 추가
				// 		return 'isEdit';
				// 	}
				// },
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					// 맵핑 처리는 전역 변수로 처리
					return centerMap[value] ? `[${item?.dccode}]${centerMap[value]}` : '';
				},
			}, // 물류센터
			{
				dataField: 'popNo',
				headerText: '대표 POP 번호',
				minWidth: 100,
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
							dataField: 'popNo',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			}, // 대표 POP 번호
			{
				dataField: 'popName',
				headerText: '대표 POP 명',
				minWidth: 100,
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
							dataField: 'popName',
							rowIndex: rowIndex,
						})
					) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			}, // 대표 POP 명
			{
				dataField: 'fromDate',
				headerText: '적용시작일자', // 적용시작일자
				minWidth: 100,
				dataType: 'date',
				editable: true,
				required: true,
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
				minWidth: 100,
				dataType: 'date',
				editable: true,
				required: true,
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
					// 기존행이면서 delYn 이 'Y' 인 경우 또는 편집 불가 시 선택 불가 처리
					if (item?.initialDelYn !== true && handleCellEditBegin({ dataField: 'toDate', rowIndex: rowIndex })) {
						return 'isEdit';
					}
					gridRef.current.removeEditClass(columnIndex);
					return '';
				},
			},
			{
				dataField: 'baseYn',
				headerText: '기본 대표 POP',
				minWidth: 100,
				required: true,
				editable: true,
				commRenderer: {
					type: 'dropDown',
					list: baseYnList,
					editable: false,
					disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
						// 신규행인 경우 선택 가능 처리
						if (item?.rowStatus === 'I') return false;
						return true;
					},
				},
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					// 신규행인 경우 선택 가능 처리
					if (item?.rowStatus === 'I') {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			{
				dataField: 'description',
				headerText: '비고',
				minWidth: 80,
				required: false,
				editable: true,
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
			{
				dataField: 'refSerialkey',
				headerText: 'baseYn 이 기존 Y 를 끊을 때 기존행의 serialkey (복제행 임)',
				dataType: 'code',
				visible: false,
				editable: false,
			},
		];
	}, [centerMap, baseYnList]);

	// 편집 제어 함수
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

	// 데이터 동기화 - delYn 변경 시 toDate 자동 설정
	const syncDelYnChange = (grid: any, rowIndex: number, item: any, value: any) => {
		let changedToDate;
		if (value === 'Y') {
			// item.fromDate 가 오늘 +2 보다 이후일 경우 적용종료일자를 오늘 +2 로 변경
			if (dayjs(item.fromDate).isAfter(dayjs().add(2, 'day')) === true) {
				changedToDate = dayjs(item.fromDate).format('YYYYMMDD');
			} else {
				changedToDate = dayjs().add(2, 'day').format('YYYYMMDD');
			}
		} else {
			changedToDate = DEFAULT_END_DATE;
		}
		grid.setCellValue(rowIndex, 'toDate', changedToDate);
	};

	// 데이터 동기화 - toDate 변경 시 delYn 자동 설정
	const syncToDateChange = (grid: any, rowIndex: number, value: any) => {
		// 적용일자가 29991231 일 경우 삭제여부를 'N' 으로 변경
		if (dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD')) === true) {
			grid.setCellValue(rowIndex, 'delYn', 'N');
		} else {
			grid.setCellValue(rowIndex, 'delYn', 'Y');
		}
	};

	// 데이터 동기화 - popName 20자 초과 시 잘라내기
	const syncPopNameChange = (grid: any, rowIndex: number, value: any) => {
		const text = value == null ? '' : String(value);
		if (text.length > 20) {
			const sliced = text.slice(0, 20);
			grid.setCellValue(rowIndex, 'popName', sliced);
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
				if (dataField === 'delYn') syncDelYnChange(grid, rowIndex, item, value);
				else if (dataField === 'toDate') syncToDateChange(grid, rowIndex, value);
				else if (dataField === 'popName') syncPopNameChange(grid, rowIndex, value);
			} catch (error) {}
		}, 100);
	}, []);

	// 이벤트 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellEditBegin', handleCellEditBegin); // 편집 제어
		grid.bind('cellEditEnd', handleCellEditEnd); // 다른 컬럼 동기화 처리

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellEditBegin');
				grid.unbind('cellEditEnd');
			}
		};
	}, []);

	// grid Data 변경 감지 + 편집 제어 이벤트 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		// 데이터 주입
		const customGridData = gridData.map((item: any) => {
			return {
				...item,
				initialDelYn: item?.delYn === 'Y' ? true : false,
			};
		});
		grid?.setGridData(customGridData);
		// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
		grid.setColumnSizeList(grid.getFitColumnSizeList(true));
	}, [gridData]);

	// 탭 변경 시 그리드 축소 버그 처리 코드
	useEffect(() => {
		// 컴포넌트가 다시 렌더링될 때마다 그리드 크기 재조정
		const timer = setTimeout(() => {
			if (gridRef?.current) {
				gridRef.current.resize();
			}
		}, 150);

		return () => clearTimeout(timer);
	}, [gridData]); // gridData 변경 시에도 실행

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			// 마지막 페이지면 훅 내부에서 totalCount로 막아줌
			onLoadMore();
		},
		totalCount: popTotalCount,
	});

	return (
		<AGrid dataProps={'row-single'} className="h100">
			<Form disabled={!isSearched}>
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={gridData?.length ?? 0} />
			</Form>
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default PopGrid;
