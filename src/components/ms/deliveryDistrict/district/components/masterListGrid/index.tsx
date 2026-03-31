// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';
// components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useTranslation } from 'react-i18next';
// utils
import { validateDistrictGroupPop } from '@/components/ms/deliveryDistrict/districtGroup/validations';
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
// APIS
import { apiPostsaveMasterList, apiPostSrmValidateDistrict } from '@/api/ms/apiMsDeliveryDistrict';
import CustomModal from '@/components/common/custom/CustomModal';
import MsDeliveryDistrictChangeHistoryPopup from '@/components/ms/deliveryDistrict/MsDeliveryDistrictChangeHistoryPopup';
// hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// 타입 정의
interface IMasterListGridProps {
	tabSearchConditions: any;
	gridData: any[];
	gridRef: React.RefObject<any>;
	districtGroupList: any[];
	onSelectMasterGridRow: (selectedGridRowObj: any) => void;
	onRequestDistrictList: () => Promise<void>; // 권역 리스트 재요청 함수
	setSelectMasterGridRow: Dispatch<any>;
	isSearched: boolean; // 추가/삭제/저장 버튼의 보이기 유무 조건
	pForm: any; // 검색 조건
	// 스크롤 페이징 관련
	districtPage: number;
	districtTotalCount: number;
	onLoadMore: () => void;
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
// 신규행에서만 편집이 되는 필드들
const EDITABLE_NEW_ROW_FIELDS = ['dlvdistrictNm', 'fromDate', 'dlvgroupId'] as const;
// 신규행에서는 편집 안되는 필드들
const NON_EDITABLE_NEW_ROW_FIELDS = ['toDate'] as const;
const DEFAULT_END_DATE = '29991231';

// 헬퍼 함수: 날짜 정규화 (Dayjs 객체 반환)
const normDate = (v: any) => {
	const s = String(v ?? '').replace(/-/g, '');
	return dayjs(s, 'YYYYMMDD', true);
};

// 헬퍼 함수: POP 리스트 동기화 로직 분리
const syncPopListByRange = (
	grid: any,
	rowIndex: number,
	row: any,
	rangeFromRaw: any,
	rangeToRaw: any,
	districtGroupList: any[],
) => {
	if (!row?.dlvgroupId) {
		grid.setCellValue(rowIndex, 'popList', '');
		return;
	}

	const checkedDistrictGroup = districtGroupList.find((g: any) => g.dlvgroupId === row.dlvgroupId);
	if (!checkedDistrictGroup) {
		grid.setCellValue(rowIndex, 'dlvgroupId', '');
		grid.setCellValue(rowIndex, 'popList', '');
		return;
	}

	const rangeFrom = normDate(rangeFromRaw);
	const rangeTo = normDate(rangeToRaw);

	if (!rangeFrom.isValid() || !rangeTo.isValid() || rangeFrom.isAfter(rangeTo, 'day')) {
		grid.setCellValue(rowIndex, 'popList', '');
		return;
	}

	// 권역그룹 기간 안에 들어오는지 체크
	const groupFrom = normDate(checkedDistrictGroup.fromDate);
	const groupTo = normDate(checkedDistrictGroup.toDate);

	const inRange =
		groupFrom.isValid() &&
		groupTo.isValid() &&
		groupFrom.isSameOrBefore(rangeFrom, 'day') &&
		rangeTo.isSameOrBefore(groupTo, 'day');

	if (!inRange) {
		grid.setCellValue(rowIndex, 'dlvgroupId', '');
		grid.setCellValue(rowIndex, 'popList', '');
		return;
	}

	// 겹치는 POP만 추출해서 join
	const overlapped = (checkedDistrictGroup.groupPopList ?? [])
		.map((p: any) => ({ ...p, _from: normDate(p?.fromDate), _to: normDate(p?.toDate) }))
		.filter((p: any) => p._from.isValid() && p._to.isValid())
		.filter((p: any) => !p._to.isBefore(rangeFrom, 'day') && !p._from.isAfter(rangeTo, 'day'))
		.sort((a: any, b: any) => a._from.diff(b._from, 'day'));

	const popListStr = Array.from(
		new Set<string>(overlapped.map((p: any) => String(p.popName ?? '')).filter(Boolean)),
	).join(',');
	grid.setCellValue(rowIndex, 'popList', popListStr);
};

// 헬퍼 함수: 권역그룹 변경 처리 로직 분리
const handleDlvGroupChange = (
	gridRef: React.RefObject<any>,
	rowIndex: number,
	item: any,
	value: any,
	districtGroupList: any[],
) => {
	// 현재 본문 로직 유지하되, setTimeout 내부에서 호출되도록 분리
	const grid = gridRef.current;
	if (!grid || districtGroupList.length === 0) return;

	setTimeout(() => {
		// 현재 행 안전하게 가져오기
		const row = grid.getItemByRowIndex?.(rowIndex) ?? item;
		if (!row) return;

		// rowIdField 추출
		const rowIdField = grid.getProp?.('rowIdField') || grid.props?.gridProps?.rowIdField || '_$uid';

		const id = row[rowIdField];
		if (id == null) return;

		const selectedDistrictGroupObj = districtGroupList.find((dg: any) => dg.dlvgroupId === value);
		if (!selectedDistrictGroupObj) return;

		// 대표 POP 명 콤마
		const popNames = selectedDistrictGroupObj?.groupPopList?.map((pop: any) => pop.popName).join(',') || '';

		// pop 없는 경우 → 경고 + 값 초기화
		if (!popNames) {
			showAlert(null, '대표POP가 설정되어야 합니다. \n 대표POP 설정 이후에 적용할 수 있습니다.');
			const clearedRow = {
				...row,
				dlvgroupId: '',
				popList: '',
				[rowIdField]: id,
			};
			grid.updateRowsById(clearedRow);
			return;
		}

		// 대표 POP 연속성 체크
		const isValid = validateDistrictGroupPop(
			selectedDistrictGroupObj.groupPopList,
			dayjs(row.fromDate, 'YYYYMMDD'),
			dayjs(row.toDate, 'YYYYMMDD'),
			false,
		);
		if (!isValid) {
			showAlert(null, '해당 권역그룹의 대표 POP에 빈 기간이 존재합니다. \n 해당 권역그룹에서 대표POP 를 설정해주세요.');
			const clearedRow = {
				...row,
				dlvgroupId: '',
				popList: '',
				[rowIdField]: id,
			};
			grid.updateRowsById(clearedRow);
			return;
		}

		// fromDate / toDate 보정
		let finalFrom = row.fromDate;
		if (selectedDistrictGroupObj.fromDate) {
			const after3Days = dayjs().add(3, 'day').startOf('day');
			const groupFrom = dayjs(String(selectedDistrictGroupObj.fromDate).replace(/-/g, ''), 'YYYYMMDD', true);
			const fixedFrom = !groupFrom.isValid() || groupFrom.isBefore(after3Days, 'day') ? after3Days : groupFrom;
			finalFrom = fixedFrom.format('YYYYMMDD');
		}

		let finalTo = row.toDate;
		if (selectedDistrictGroupObj.toDate) {
			const minTo = dayjs().add(2, 'day').startOf('day');
			const groupTo = dayjs(String(selectedDistrictGroupObj.toDate).replace(/-/g, ''), 'YYYYMMDD', true);
			const fixedTo = !groupTo.isValid() || groupTo.isBefore(minTo, 'day') ? minTo : groupTo;
			finalTo = fixedTo.format('YYYYMMDD');
		}

		// 최종 행 하나로 합쳐서 갱신
		const updatedRow = {
			...row,
			dlvgroupId: value,
			popList: popNames,
			fromDate: finalFrom,
			toDate: finalTo,
			[rowIdField]: id,
		};

		grid.updateRowsById(updatedRow);
	}, 100);
};

// 헬퍼 함수: delYn 편집 종료 시 toDate 동기화 + popList 동기화
const handleDelYnEditEnd = (grid: any, rowIndex: number, value: any, item: any, districtGroupList: any[]) => {
	let changedToDate;
	if (value === 'Y') {
		// item.fromDate 가 오늘 +2 보다 이후일 경우 적용종료일자를 오늘 +2 로 변경
		changedToDate = dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))
			? dayjs(item.fromDate).format('YYYYMMDD')
			: dayjs().add(2, 'day').format('YYYYMMDD');
	} else {
		changedToDate = DEFAULT_END_DATE;
	}
	grid.setCellValue(rowIndex, 'toDate', changedToDate);

	// 종료일자 변경에 따른 popList 동기화 처리
	const latestRow = grid.getItemByRowIndex?.(rowIndex) ?? item;
	syncPopListByRange(grid, rowIndex, latestRow, latestRow?.fromDate, changedToDate, districtGroupList);
};

// 헬퍼 함수: toDate 편집 종료 시 delYn 동기화 + popList 동기화
const handleToDateEditEnd = (grid: any, rowIndex: number, value: any, item: any, districtGroupList: any[]) => {
	// 적용일자가 29991231 일 경우 삭제여부를 'N' 으로 변경
	const isDefaultEndDate = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD'));
	grid.setCellValue(rowIndex, 'delYn', isDefaultEndDate ? 'N' : 'Y');
	// 종료일자 변경 시 POP 리스트 동기화
	syncPopListByRange(grid, rowIndex, item, item?.fromDate, value, districtGroupList);
};

// 헬퍼 함수: 기존행의 toDate, delYn이 원본과 동일하면 체크 해제
// setCellValue 직후 그리드 데이터가 즉시 반영되지 않을 수 있으므로, 최종 계산값을 직접 전달받음
// 날짜 포맷 차이(YYYYMMDD vs YYYY-MM-DD)를 고려하여 하이픈 제거 후 비교
const uncheckIfReverted = (grid: any, rowIndex: number, item: any, finalToDate: string, finalDelYn: string) => {
	if (!item || item.rowStatus === 'I') return;

	const normalizeDate = (v: any) => String(v ?? '').replace(/-/g, '');
	const originalToDate = normalizeDate(item.originalToDate);
	const originalDelYn = String(item.originalDelYn ?? '');

	if (normalizeDate(finalToDate) === originalToDate && finalDelYn === originalDelYn) {
		const rowIdField = (grid.getProp && grid.getProp('rowIdField')) || grid.props?.gridProps?.rowIdField || '_$uid';
		const rowId = grid.indexToRowId?.(rowIndex);
		if (rowId != null && grid.addUncheckedRowsByIdsBefore) {
			grid.addUncheckedRowsByIdsBefore([rowId], rowIdField);
		}
	}
};

// 헬퍼 함수: 권역명 편집 종료 시 체크박스 자동 선택 + 중복 검사
const handleDlvdistrictNmEditEnd = (grid: any, rowIndex: number, item: any) => {
	const rowIdField = (grid.getProp && grid.getProp('rowIdField')) || grid.props?.gridProps?.rowIdField || '_$uid';

	const row = grid.getItemByRowIndex?.(rowIndex) ?? item;
	if (!row) return;

	const id = row[rowIdField];
	if (id != null && grid.addCheckedRowsByValue) {
		grid.addCheckedRowsByValue(rowIdField, id);
	}
	// 기존 존재 시 얼럿 띄우기
	// 중복 권역명 존재 시 얼럿 띄우고 빈값 처리
	const allItems = grid.getGridData();
	const sameNameItems = allItems
		.filter((i: any) => i.dlvdistrictNm === item.dlvdistrictNm)
		.filter((i: any) => i.dlvdistrictNm.trim().length > 0);
	if (sameNameItems.length > 1) {
		showAlert(
			null,
			`${sameNameItems[0].dlvdistrictNm} 권역명은 이미 존재합니다. \n 기존 권역을 삭제 후 다시 등록해 주세요.`,
		);
		setTimeout(() => {
			grid.setCellValue(rowIndex, 'dlvdistrictNm', '');
		}, 200);
	}
};

const MasterListGrid = ({
	tabSearchConditions,
	gridData,
	gridRef,
	districtGroupList,
	onSelectMasterGridRow,
	onRequestDistrictList,
	setSelectMasterGridRow,
	isSearched,
	pForm,
	districtPage,
	districtTotalCount,
	onLoadMore,
}: IMasterListGridProps) => {
	// 다국어
	const { t } = useTranslation();
	// State 관리
	const [gridKey, setGridKey] = useState(0);
	const [backupGridData, setBackupGridData] = useState<any[]>([]);

	const changeHistoryPopupRef = useRef(null); // 변경이력팝업 ref

	// 그리드 기본 설정
	const gridProps = useMemo(
		() => ({
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			// selectionMode: 'multipleRows', // (버전별) 다중행 선택 허용
		}),
		[],
	);

	// 권역그룹 옵션 리스트 (메모이제이션)
	const groupOptionList = useMemo(() => {
		const defaultOption = { dlvgroupNm: '미지정그룹', dlvgroupId: '' };
		const mappedOptions = districtGroupList.map(item => ({
			dlvgroupNm: item.dlvgroupNm,
			dlvgroupId: item.dlvgroupId,
		}));

		return [defaultOption, ...mappedOptions];
	}, [districtGroupList]);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	// 그리드 버튼 설정
	const gridBtn = useMemo((): GridBtnPropsType => {
		// hjdongCount 가 1개 이상일 경우 추가 진행 여부 확인
		//
		const isHjdongCountValid = (data: any[]) => {
			const errors: string[] = [];

			// 현재 삭제로 처리할 데이터 필터 처리
			const delDataList = data.filter((item: any) => {
				return item.delYn === 'Y';
			});

			delDataList.forEach(item => {
				if (item.hjdongCount > 0) {
					errors.push(`"${item.dlvdistrictNm}" 권역에 포함된 ${item.hjdongCount}개의 행정동도 함께 삭제 됩니다.`);
				}
			});

			return errors;
		};

		const getInitialValues = () => ({
			rowStatus: 'I',
			serialkey: '',
			dccode: tabSearchConditions?.dccode || '',
			dlvgroupId: '',
			dlvdistrictNm: '',
			hjdongCount: '',
			fromDate: dayjs().add(3, 'day').format('YYYYMMDD'),
			toDate: DEFAULT_END_DATE,
			delYn: 'N',
			initialDelYn: false,
		});

		const onSaveFn = (checkedItems: any[]) => {
			// 함수로 만들기
			// 신규, 수정, 삭제 구분하여 처리

			// 백엔드 삭제조건 rowStatus === 'U' + fromDate >= today + 3 + delyn ==='Y'

			// 삭제 여부 판별 함수
			const isDeleteTarget = (item: any) => {
				if (item.rowStatus !== 'U') return false;

				const from = dayjs(String(item.fromDate).replaceAll('-', ''), 'YYYYMMDD', 'day');
				const today = dayjs().startOf('day');
				const threeDaysAfter = today.add(3, 'day');

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
					rowStatus: 'D',
					// toDate: dayjs().add(2, 'days').format('YYYYMMDD'), // 삭제시 오늘날짜 + 2일 처리
				})),
			];

			// srm 유효성 검사 처리 후 저장 로직
			// 저장 성공 후 처리 함수
			const handleSaveSuccess = (res: any) => {
				if (res?.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					// 메인 그리드 재요청 처리
					onRequestDistrictList();
				}
			};

			// 실제 저장 api 호출 함수
			const callSaveApi = () => {
				apiPostsaveMasterList(mergeMasterList)
					.then(handleSaveSuccess)
					.catch(() => {
						showAlert(null, '저장 중 오류가 발생했습니다.');
					});
			};

			const executeSave = () => {
				const confirmMessage = `${t('msg.MSG_COM_CFM_003')}\n 신규: ${insertItemList.length}개, \n수정: ${
					updateItemList.length
				}개, \n삭제: ${deleteItemList.length}개`;

				showConfirm(null, confirmMessage, callSaveApi);
			};

			// SRM 유효성 검사 결과 처리 함수
			const handleSrmValidationResult = (res: any) => {
				if (res?.statusCode !== 0) return;

				if (res?.data?.affectedYn === 'Y') {
					showAlert(
						null,
						`해당 권역의 하위에 등록된 행정동이 존재합니다. \n 해당 권역의 행정동을 삭제 후 진행해주세요.`,
					);
					return;
				}

				if (res?.data?.affectedYn === 'N') {
					executeSave();
				}
			};

			// 수정/삭제 항목 존재 시 SRM 유효성 검사
			const srmValidateList = [...updateItemList, ...deleteItemList];

			if (srmValidateList.length > 0) {
				apiPostSrmValidateDistrict(srmValidateList)
					.then(handleSrmValidationResult)
					.catch(() => {
						showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
					});
			} else {
				// SRM 유효성 검사 불필요 - 바로 저장
				executeSave();
			}
		};

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus',
					initValues: getInitialValues(),
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
						if (!gridRef.current) return;
						const rawChangedItems = gridRef.current.getChangedData({ validationYn: false });
						const allItems = gridRef.current.getGridData();

						// 기존행(U)에서 toDate, delYn이 원본과 동일하면 실제 변경이 없으므로 제외
						// 날짜 포맷 차이(YYYYMMDD vs YYYY-MM-DD)를 고려하여 하이픈 제거 후 비교
						const checkedItems = (rawChangedItems || []).filter((item: any) => {
							if (item.rowStatus !== 'U') return true;
							const toDateNorm = String(item.toDate ?? '').replace(/-/g, '');
							const origToDateNorm = String(item.originalToDate ?? '').replace(/-/g, '');
							return toDateNorm !== origToDateNorm || item.delYn !== item.originalDelYn;
						});

						if (!checkedItems || checkedItems.length < 1) {
							showAlert(null, t('msg.MSG_COM_VAL_020'));
							return;
						}

						// 1. 필수값 유효성 검사
						if (!gridRef.current.validateRequiredGridData()) {
							return false;
						}

						// 2. 권역명이 같은개 2개 이상일 때 (같은 권역 2개 이상 등록 금지! 얼럭 띄우기)
						for (const item of checkedItems) {
							const sameNameItems = allItems.filter((i: any) => i.dlvdistrictNm === item.dlvdistrictNm);
							if (sameNameItems.length > 1) {
								showAlert(null, '같은 권역명 2개상 등록이 안됩니다. \n 삭제 후 등록해 주세요.');
								return;
							}
						}

						// TODO: 아래의 얼럿 로직은 추후 사용 가능성 있음
						// // 3. 만약 데이터 삭제시!! 권역에 포함된 행정동이 1개 이상일 경우 확인 후 진행
						// const isDeleteHjdongList = isHjdongCountValid(checkedItems);
						// if (isDeleteHjdongList.length > 0) {
						// 	const deleteHjdongMessage = isDeleteHjdongList.join('\n');
						// 	return showConfirm(
						// 		'행정동 포함 삭제 확인',
						// 		`다음 권역은 행정동이 포함되어 있습니다:\n\n${deleteHjdongMessage}\n\n계속 진행하시겠습니까?`,
						// 		() => {
						// 			// 그냥 저장처리1
						// 			return onSaveFn(checkedItems);
						// 		},
						// 	);
						// } else {
						// 	// 그냥 저장처리 2
						// 	return onSaveFn(checkedItems);
						// }
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
				{
					btnLabel: '변경이력',
					btnType: 'userSetting',
					authType: 'new',
					isActionEvent: false,
					callBackFn: () => {
						if (changeHistoryPopupRef) {
							changeHistoryPopupRef?.current?.handlerOpen();
						}
					},
				},
			],
		};
	}, [tabSearchConditions, gridRef]);

	// LabelFunction들을 useCallback으로 최적화
	const createGroupLabelFunction = useCallback(
		() => (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
			// 빈값이거나 공백인 경우 미지정그룹
			if (!value || value === ' ' || value === '') {
				return groupOptionList[0]?.dlvgroupNm || '미지정그룹';
			}

			// 아이템에 dlvgroupNm이 있으면 사용
			if (item?.dlvgroupNm) {
				return item.dlvgroupNm;
			}

			// groupOptionList에서 찾기
			const group = groupOptionList.find(g => g.dlvgroupId === value);
			return group?.dlvgroupNm || groupOptionList[0]?.dlvgroupNm || '미지정그룹';
		},
		[groupOptionList],
	);

	const createReflectionLabelFunction = useCallback(
		() => (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
			const fromDate = item?.fromDate;
			if (!fromDate) return '';

			// yyyymmdd 또는 yyyy-mm-dd 형식 처리
			const ymd = String(fromDate).replace(/-/g, '');
			if (ymd.length !== 8) return '';

			const year = +ymd.slice(0, 4);
			const month = +ymd.slice(4, 6) - 1;
			const day = +ymd.slice(6, 8);

			const targetDate = new Date(year, month, day);
			const today = new Date();

			// 시간을 00:00:00으로 맞춤
			targetDate.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diffDays = Math.round((targetDate.getTime() - today.getTime()) / 86400000);

			// D-0, D-1, D-2, D-3만 표시
			return diffDays > 0 && diffDays <= REFLECTION_SCHEDULE_MAX_DAYS ? `D-${diffDays}` : '';
		},
		[],
	);

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

				const inputDate = dayjs(newValue).startOf('day');
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

				// 5. 권역그룹 선택 fromDate 보다 이전일 때, 이후일 때 나눠서 처리
				const districtGroup = districtGroupList.find((g: any) => g.dlvgroupId === item.dlvgroupId);
				if (districtGroup) {
					if (inputDate.isBefore(dayjs(districtGroup.fromDate, 'YYYYMMDD'))) {
						return { validate: false, message: '권역그룹 선택일자는 권역그룹 시작일 이후여야 합니다.' };
					}
					if (inputDate.isAfter(dayjs(districtGroup.toDate, 'YYYYMMDD'))) {
						return { validate: false, message: '권역그룹 선택일자는 권역그룹 종료일 이전여야 합니다.' };
					}
				}

				return { validate: true, message: '' };
			};
		},
		[t, districtGroupList],
	);

	// 그리드 컬럼 정의 (최적화)
	const gridCol = useMemo(() => {
		const columns = [
			{
				dataField: 'dlvgroupId',
				headerText: '권역그룹',
				required: false,
				editable: true,
				dataType: 'code',
				minWidth: 120,
				commRenderer: {
					type: 'dropDown',
					// list: groupOptionList,
					keyField: 'dlvgroupId',
					valueField: 'dlvgroupNm',
					listFunction: function (rowIndex: number, _val: any, rowObj: any, fieldName: string) {
						try {
							// DB에서 불러온 기존 값일 때는 좀 느슨하게 모든 리스트를 가져와서 처리
							// (리스트에 없으면 dlvgroupId 를 보여주기 때문에 모든 리스트를 가져와서 처리)
							if (rowObj?.rowStatus === 'R') {
								return districtGroupList;
							} else {
								const norm = (v: any) => {
									if (!v) return null;
									const s = String(v).replace(/-/g, '');
									const d = dayjs(s, 'YYYYMMDD', true);
									return d.isValid() ? d : null;
								};
								const rowFrom = norm(rowObj?.fromDate);
								const rowTo = norm(rowObj?.toDate);
								if (!rowFrom || !rowTo) return [];

								const filtered = (districtGroupList ?? []).filter((g: any) => {
									const gFrom = norm(g?.fromDate);
									const gTo = norm(g?.toDate);
									if (!gFrom || !gTo) return false;
									const fromOk = rowFrom.isSame(gFrom) || rowFrom.isAfter(gFrom);
									const toOk = rowTo.isSame(gTo) || rowTo.isBefore(gTo);
									return fromOk && toOk;
								});

								return filtered;
							}
						} catch (error) {
							return [] as any[];
						}
					},
					disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						return item?.rowStatus !== 'I'; // I 가 아니면 비활성화
					},
				},
				// labelFunction: createGroupLabelFunction,
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'dlvgroupId',
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
				dataField: 'popList',
				headerText: '대표POP',
				editable: false,
				minWidth: 80,
			},
			{
				dataField: 'dlvdistrictNm',
				headerText: '권역명',
				required: true,
				editable: true,
				minWidth: 80,
				styleFunction: function (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
				): string {
					if (
						handleCellEditBegin({
							dataField: 'dlvdistrictNm',
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
				dataField: 'hjdongCount',
				headerText: '행정동 (개)',
				required: false,
				editable: false,
				dataType: 'numeric',
				minWidth: 80,
			},
			{
				dataField: 'fromDate',
				headerText: '적용시작일자',
				dataType: 'date',
				editable: true,
				required: true,
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				minWidth: 120,
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
					// 기존행이면서 delYn 이 'Y' 인 경우 선택 불가 처리
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
				dataField: 'reflectSchedule',
				headerText: '반영 예정',
				required: false,
				editable: false,
				minWidth: 80,
				labelFunction: createReflectionLabelFunction(),
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
			{
				dataField: 'originalToDate',
				headerText: '원본 적용종료일자',
				visible: false,
				editable: false,
			},
			{
				dataField: 'originalDelYn',
				headerText: '원본 삭제여부',
				visible: false,
				editable: false,
			},
		];

		return columns;
	}, [groupOptionList, delYnOptions, createGroupLabelFunction, createReflectionLabelFunction, createDateValidator]);

	// 셀 클릭 이벤트
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
					clickedField: dataField,
					rowIndex,
					eventType: 'cellClick',
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

		// 신규행에서는 편집 불가능한 필드들
		if (NON_EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus !== 'I';
		}

		// 신규행에서만 편집이 되는 필드들
		if (EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I';
		}

		return true;
	}, []);

	// 데이터 동기화 처리 함수
	const handleCellEditEnd = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, value, item } = event;
			setTimeout(() => {
				const grid = gridRef.current;
				if (!grid) return;

				try {
					if (dataField === 'delYn') {
						handleDelYnEditEnd(grid, rowIndex, value, item, districtGroupList);
						// delYn 변경 후 최종 toDate 계산: Y→max(fromDate, today+2), N→29991231
						const finalToDate =
							value === 'Y'
								? dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))
									? dayjs(item.fromDate).format('YYYYMMDD')
									: dayjs().add(2, 'day').format('YYYYMMDD')
								: DEFAULT_END_DATE;
						uncheckIfReverted(grid, rowIndex, item, finalToDate, value);
					} else if (dataField === 'toDate') {
						handleToDateEditEnd(grid, rowIndex, value, item, districtGroupList);
						// toDate 변경 후 최종 delYn 계산: 29991231→'N', 그 외→'Y'
						const finalDelYn = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD')) ? 'N' : 'Y';
						uncheckIfReverted(grid, rowIndex, item, value, finalDelYn);
					} else if (dataField === 'fromDate') {
						// 시작일자 변경 시 POP 리스트 동기화
						syncPopListByRange(grid, rowIndex, item, value, item?.toDate, districtGroupList);
					} else if (dataField === 'dlvdistrictNm') {
						handleDlvdistrictNmEditEnd(grid, rowIndex, item);
					} else if (dataField === 'dlvgroupId') {
						// 권역그룹 셀
						handleDlvGroupChange(gridRef, rowIndex, item, value, districtGroupList);
					}
				} catch (error) {}
			}, 100);
		},
		[districtGroupList],
	);

	// 스크롤 페이징 훅 적용
	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			onLoadMore();
		},
		totalCount: districtTotalCount,
	});

	// 그리드 이벤트 바인딩 (gridKey 변경 시 재바인딩)
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellClick', handleCellClick); // 셀 클릭
		grid.bind('cellEditBegin', handleCellEditBegin); // 편집 제어
		grid.bind('cellEditEnd', handleCellEditEnd); // 동기화 처리

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
				initialDelYn: item?.delYn === 'Y',
				originalToDate: item?.toDate || '',
				originalDelYn: item?.delYn || 'N',
			};
		});

		setBackupGridData(customGridData);
		grid.setGridData(customGridData);
		// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
		grid.setColumnSizeList(grid.getFitColumnSizeList(true));
		// 데이터 최초 불러올때 행선택 처리
		if (customGridData.length > 0) {
			// 권역 그리드 선택만 하도록 처리
			setSelectMasterGridRow({
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
		} else if (customGridData.length === 0) {
			setSelectMasterGridRow(null);
		}
	}, [gridData]);

	// districtGroupList 변경 시 그리드 재생성
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) {
			// 아직 마운트 안 됐으면 그냥 key만 올려둡니다.
			setGridKey(prev => prev + 1);
			return;
		}

		// 이전 데이터 백업 (있을 때만)
		const currentData = grid.getGridData ? grid.getGridData() : [];
		if (Array.isArray(currentData) && currentData.length > 0) {
			setBackupGridData(currentData);
		} else {
			// 새 리스트가 비어 있으면 백업도 비워둡니다.
			setBackupGridData([]);
		}

		// districtGroupList 길이에 상관없이 항상 그리드 리마운트
		setGridKey(prev => prev + 1);
	}, [districtGroupList]);

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
		<>
			<AGrid dataProps={''}>
				<Form disabled={!isSearched}>
					<GridTopBtn gridTitle="권역" gridBtn={gridBtn} totalCnt={gridData?.length} />
				</Form>
				<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 변경이력 팝업 영역 */}
			<CustomModal ref={changeHistoryPopupRef} width="1280px">
				<MsDeliveryDistrictChangeHistoryPopup pForm={pForm} />
			</CustomModal>
		</>
	);
};

export default MasterListGrid;
