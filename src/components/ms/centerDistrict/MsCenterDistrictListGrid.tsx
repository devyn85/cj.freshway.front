/*
 ############################################################################
 # FiledataField	: MsCenterDistrictListGrid.tsx
 # Description		: 센터권역 관리 메인 그리드
 # Author			: son insung
 # Since			: 26.03.20
 ############################################################################
 */

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
// hooks
// Util
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
// Const
const gridDateFormat = 'yyyy-mm-dd'; // 그리드 표시 포맷
const gridInputDateFormat = 'yyyymmdd'; // 그리드 입력 포멧
// Api
import { apiPostSrmValidateCenterHjdong, apiSaveMasterList } from '@/api/ms/apiMsCenterDistrict';

// Types
import MsCenterDistrictChangeHistoryPopup from '@/components/ms/centerDistrict/MsCenterDistrictChangeHistoryPopup';
import { NewHjdongListType } from '@/components/ms/centerDistrict/types';
import { GridBtnPropsType } from '@/types/common';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}

interface IMsCenterDistrictListGridProps {
	gridData: any[]; // 그리드 데이터
	gridRef: React.RefObject<any>; // 그리드 Ref
	setSelectedRowInCenterGrid: (selectedRow: any) => void; // 센터 권역 그리드 선택 row state
	refetchList: (requestType: 'ALL' | 'MAIN', searchParams: any) => void; // 저장 후 재조회 처리
	form: any; // 조회 조건
	searchParams: any; // 조회 검색 조건
	bumpGridTick: () => void; // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	newHjdongList: NewHjdongListType[]; // 미사용 행정동 리스트
	hasSearched: boolean; // 조회 여부
	isNewCreatedHjdongWithoutPolygonGridOpen: boolean; // 신규 행정동 그리드 열림 여부
}

// 파일 정의
const MsCenterDistrictListGrid = ({
	gridData,
	gridRef,
	setSelectedRowInCenterGrid,
	refetchList,
	form,
	searchParams,
	bumpGridTick,
	newHjdongList,
	hasSearched,
	isNewCreatedHjdongWithoutPolygonGridOpen,
}: IMsCenterDistrictListGridProps) => {
	const { t } = useTranslation(); // 다국어 처리
	// 물류센터 코드 리스트
	const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	const changeHistoryPopupRef = useRef(null); // 변경이력팝업 ref

	// 편집 가능한 컬럼
	// rowStatus 가 R/U인경우 수정 가능한 필드들 (적용종료일자, 삭제여부)
	const R_U_EDITABLE_ROW_FIELDS = ['toDate', 'delYn', 'rmk'];
	// rowStatus 가 I 인경우 수정 가능한 필드들 (시도, 시구군, 행정동, 적용시작일자)
	const I_EDITABLE_ROW_FIELDS = ['ctpKorNm', 'sigKorNm', 'hjdongCd', 'fromDate', 'rmk'];
	const DEFAULT_END_DATE = '29991231';

	// 컬럼 데이터 주입을 위한 그리드 키
	const [gridKey, setGridKey] = useState(0);

	// 시,구,동 데이터
	const { listenerSource } = useDistrictBoundaryStore(s => s);

	// 시 리스트 추출 함수
	const extractSidoList = useCallback((features: any[]) => {
		return (features ?? []).map((f: any) => f?.properties).filter(Boolean);
	}, []);

	// 시 → 구 매핑 생성 함수 분리
	const buildSidoToSggMapping = useCallback((sidoList: any[], sggFeatures: any[]) => {
		const sidoMapsggList: Record<string, any[]> = {};

		// 시 리스트로 초기화
		for (const p of sidoList) {
			const si = p?.ctpKorNm;
			if (si && !sidoMapsggList[si]) {
				sidoMapsggList[si] = [];
			}
		}

		// 구 데이터 추가
		for (const f of sggFeatures ?? []) {
			const si = f?.properties?.ctpKorNm;
			if (!si) continue;
			if (!sidoMapsggList[si]) sidoMapsggList[si] = [];
			sidoMapsggList[si].push(f.properties);
		}

		return sidoMapsggList;
	}, []);

	// (시,구) → 동 매핑 생성 함수 분리
	const buildSggToHjdongMapping = useCallback((sggFeatures: any[], demFeatures: any[]) => {
		const sggMaphjdongList: Record<string, any[]> = {};

		// 구 리스트로 초기화
		for (const f of sggFeatures ?? []) {
			const si = f?.properties?.ctpKorNm;
			const gu = f?.properties?.sigKorNm;
			if (!si || !gu) continue;
			const key = `${si}__${gu}`;
			if (!sggMaphjdongList[key]) {
				sggMaphjdongList[key] = [];
			}
		}

		// 동 데이터 추가
		for (const f of demFeatures ?? []) {
			const si = f?.properties?.ctpKorNm;
			const gu = f?.properties?.sigKorNm;
			if (!si || !gu) continue;
			const key = `${si}__${gu}`;
			if (!sggMaphjdongList[key]) sggMaphjdongList[key] = [];
			sggMaphjdongList[key].push(f.properties);
		}

		return sggMaphjdongList;
	}, []);

	// 버튼 비활성화 여부
	const isButtonDisabled = useMemo(() => {
		// 센터 메인그리드 조회 후 실패 시 버튼 비활성화 처리리
		if (!hasSearched) {
			return true;
		}
		if (searchParams?.dccode) {
			const dccodeList = searchParams?.dccode?.split(',');
			if (dccodeList?.length > 1) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}, [searchParams, hasSearched]);

	// mapDistrictList 함수 단순화
	const mapDistrictList = useMemo(() => {
		const sidoList = extractSidoList(listenerSource?.sido?.features);
		const sidoMapsggList = buildSidoToSggMapping(sidoList, listenerSource?.sgg?.features);
		const sggMaphjdongList = buildSggToHjdongMapping(listenerSource?.sgg?.features, listenerSource?.dem?.features);

		return {
			sido: sidoList,
			sgg: sidoMapsggList,
			hjdong: sggMaphjdongList,
		};
	}, [listenerSource, extractSidoList, buildSidoToSggMapping, buildSggToHjdongMapping]);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	// 신규 행정동끼리 날짜 겹침 검증
	const validateNewItemsDateOverlap = useCallback((newItems: any[]): boolean => {
		const getKey = (item: any) => `${item.dccode ?? ''}__${item.hjdongCd ?? ''}`;
		const groupsNew = new Map<string, any[]>();

		newItems.forEach((item: any) => {
			const key = getKey(item);
			if (!item.hjdongCd) return;
			if (!groupsNew.has(key)) {
				groupsNew.set(key, []);
			}
			const group = groupsNew.get(key);
			if (group) {
				group.push(item);
			}
		});

		for (const [_, items] of groupsNew) {
			if (items.length <= 1) continue;

			for (let i = 0; i < items.length; i++) {
				for (let j = i + 1; j < items.length; j++) {
					const a = items[i];
					const b = items[j];
					const aStart = dayjs(a.fromDate, 'YYYYMMDD');
					const aEnd = dayjs(a.toDate, 'YYYYMMDD');
					const bStart = dayjs(b.fromDate, 'YYYYMMDD');
					const bEnd = dayjs(b.toDate, 'YYYYMMDD');

					if (!(aEnd.isBefore(bStart) || bEnd.isBefore(aStart))) {
						const msgHjdong = a.hjdongNm || b.hjdongNm || a.hjdongCd || b.hjdongCd || '';
						showAlert(null, `[${msgHjdong}] 행정동의 적용일자가 신규 행들끼리 서로 겹칠 수 없습니다.`);
						return false;
					}
				}
			}
		}
		return true;
	}, []);

	// 신규/기존 행정동 날짜 겹침 자동 조정
	const adjustDateOverlap = useCallback((newItems: any[], existingItems: any[]): boolean => {
		const getKey = (item: any) => `${item.dccode ?? ''}__${item.hjdongCd ?? ''}`;
		let hasAdjustment = false;

		newItems.forEach((newItem: any) => {
			if (!newItem.hjdongCd) return;
			const key = getKey(newItem);

			existingItems.forEach((existingItem: any) => {
				if (getKey(existingItem) !== key) return;

				const newStart = dayjs(newItem.fromDate, 'YYYYMMDD');
				const newEnd = dayjs(newItem.toDate, 'YYYYMMDD');
				const exStart = dayjs(existingItem.fromDate, 'YYYYMMDD');
				const exEnd = dayjs(existingItem.toDate, 'YYYYMMDD');

				const today = dayjs().startOf('day');
				const todayPlus3 = today.add(3, 'day');

				// 기간이 겹치는 경우에만 처리
				if (exEnd.isBefore(newStart) || newEnd.isBefore(exStart)) {
					return;
				}

				// 1) 기존행 종료일 잘라주기 (기존 로직 유지)
				let adjustedEnd = newStart.subtract(1, 'day');
				if (adjustedEnd.isBefore(exStart)) {
					adjustedEnd = exStart;
				}
				const adjustedEndDate = adjustedEnd.format('YYYYMMDD');

				gridRef.current.updateRowsById({
					_$uid: existingItem._$uid,
					toDate: adjustedEndDate,
					rowStatus: 'U',
					delYn: 'Y',
				});
				gridRef.current.addCheckedRowsByValue('_$uid', existingItem._$uid);

				// 신규행이 기존행 전체 구간을 덮는지 여부
				const coversExisting = newStart.isSameOrBefore(exStart) && exEnd.isSameOrBefore(newEnd);

				// 기존행 시작이 "오늘+3일 이상" 이고, 신규행이 전체를 덮는 경우에만
				//    -> 신규행 쪼개기 스킵 (D+1, D+2 는 여기 안 들어옴)
				const existingIsFutureAndWillBeDeleted = exStart.isSameOrAfter(todayPlus3, 'day') && coversExisting;

				if (existingIsFutureAndWillBeDeleted) {
					hasAdjustment = true;
					return;
				}

				// 아래의 조건은 (신규행 시작 <= 기존행 시작 && 기존행 종료 <= 신규행 종료) 일 때만 진행 처리
				if (coversExisting) {
					// 2) 신규행 쪼개기
					const hasLeftPart = newStart.isBefore(exStart);
					const hasRightPart = newEnd.isAfter(exStart);

					if (hasLeftPart) {
						const leftEnd = exStart.subtract(1, 'day');
						gridRef.current.updateRowsById({
							_$uid: newItem._$uid,
							fromDate: newStart.format('YYYYMMDD'),
							toDate: leftEnd.format('YYYYMMDD'),
							rowStatus: 'I',
							delYn: 'N',
						});
						gridRef.current.addCheckedRowsByValue('_$uid', newItem._$uid);
					}

					if (hasRightPart) {
						const rightStart = exStart.add(1, 'day');
						const base = { ...newItem };
						delete base._$uid;

						const rightRow = {
							...base,
							fromDate: rightStart.format('YYYYMMDD'),
							toDate: newEnd.format('YYYYMMDD'),
							rowStatus: 'I',
							delYn: 'N',
						};

						gridRef.current.addRow(rightRow);
					}
				}

				hasAdjustment = true;
			});
		});

		return hasAdjustment;
	}, []);

	// 저장 성공 후 처리 함수
	const handleSaveSuccess = useCallback(
		(res: any) => {
			if (res?.statusCode === 0) {
				refetchList('MAIN', searchParams);
			}
		},
		[refetchList, searchParams],
	);

	// 실제 저장 API 호출 함수
	const executeSave = useCallback(
		(insertItemList: any[], updateItemList: any[], deleteItemList: any[], mergedItemList: any[]) => {
			showConfirm(
				null,
				`${t('msg.MSG_COM_CFM_003')}\n ${t('lbl.NEW')}: ${insertItemList.length}\n ${t('lbl.MODIFY')}: ${
					updateItemList.length
				}\n ${t('lbl.DELETE')}: ${deleteItemList.length}`,
				() => {
					apiSaveMasterList(mergedItemList)
						.then(handleSaveSuccess)
						.catch(() => {
							showAlert(null, '저장 중 오류가 발생했습니다.');
						});
				},
			);
		},
		[t, handleSaveSuccess],
	);

	// 삭제 여부 판별 함수
	const isDeleteTarget = useCallback(
		(item: any) => {
			const today = dayjs();
			if (item.rowStatus !== 'U') return false;

			const from = dayjs(String(item.fromDate).replaceAll('-', ''), 'YYYYMMDD');
			const to = dayjs(String(item.toDate).replaceAll('-', ''), 'YYYYMMDD');

			const threeDaysAfter = today.add(3, 'day').startOf('day');
			// fromDate 가 오늘+3일 이후이고(from > today + 3), toDate <= '29991231'(delYn === 'Y' 인 경우만) 삭제
			return from.isSameOrAfter(threeDaysAfter) && to.isSameOrBefore(dayjs(DEFAULT_END_DATE, 'YYYYMMDD'));
		},
		[DEFAULT_END_DATE],
	);

	// 실제 저장 처리
	const processSaveWithAdjustments = useCallback(() => {
		const finalCheckedItems = gridRef.current.getChangedData({ validationYn: false });
		const insertItemList = finalCheckedItems.filter((item: any) => item.rowStatus === 'I');
		// (임시)백엔드 삭제조건 rowStatus === 'U' + fromDate >= today + 3 + delyn ==='Y'

		// 백엔드 삭제조건 rowStatus === 'U' + fromDate >= today + 3 + delyn ==='Y'
		const deleteItemList = finalCheckedItems.filter(isDeleteTarget);
		// 수정조건 (rowStatus === 'U' + 삭제조건을 제외한 나머지)
		const updateItemList = finalCheckedItems.filter((item: any) => item.rowStatus === 'U' && !isDeleteTarget(item));

		const mergedItemList = [
			...insertItemList,
			...updateItemList.map((item: any) => ({ ...item, rowStatus: 'U' })),
			...deleteItemList.map((item: any) => ({ ...item, rowStatus: 'U' })),
		];

		// srm 유효성 검사 처리 후 저장 로직

		// SRM 유효성 검사 결과 처리 함수
		const handleSrmValidationResult = (res: any) => {
			if (res?.statusCode !== 0) return;

			if (res?.data?.affectedYn === 'Y') {
				showAlert(null, `배송권역 관리> 권역에 해당 행정동이 존재합니다. \n 수정/삭제가 불가능합니다.`);
				return;
			}

			if (res?.data?.affectedYn === 'N') {
				executeSave(insertItemList, updateItemList, deleteItemList, mergedItemList);
			}
		};

		// 수정/삭제 항목 존재 시 SRM 유효성 검사
		const srmValidateList = [...updateItemList, ...deleteItemList].map((item: any) => ({
			dccode: item.dccode,
			hjdongCd: item.hjdongCd,
			toDate: dayjs(String(item.toDate).replaceAll('-', ''), 'YYYYMMDD').format('YYYYMMDD'),
		}));

		if (srmValidateList.length > 0) {
			apiPostSrmValidateCenterHjdong(srmValidateList)
				.then(handleSrmValidationResult)
				.catch(() => {
					showAlert(null, '유효성 검사 중 오류가 발생했습니다.');
				});
		} else {
			// SRM 유효성 검사 불필요 - 바로 저장
			executeSave(insertItemList, updateItemList, deleteItemList, mergedItemList);
		}
	}, [t, refetchList, searchParams, executeSave, isDeleteTarget]);

	// 그리드 기본 설정
	const gridProps = useMemo(
		() => ({
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			// selectionMode: 'singleRow', // singleRow, multipleRows
		}),
		[],
	);

	// 저장 버튼 처리 로직
	const handleSaveButtonClick = useCallback(async () => {
		const getAllGridDataWithStatus = (grid: any) => {
			const data: any[] = grid.getGridData?.() || [];
			return data.map((item, rowIndex) => ({
				...item,
				rowIndex,
				rowStatus: getRowStatusByIndex(grid, rowIndex), // 'I' | 'U' | 'D' | 'R'
			}));
		};

		const checkedItems = gridRef.current.getChangedData({ validationYn: false });
		const allItems = getAllGridDataWithStatus(gridRef.current);

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 필수값 유효성 검사
		if (!gridRef.current.validateRequiredGridData()) {
			return false;
		}

		// 1단계:: 신규/기존 행정동 분리
		const newItems = checkedItems.filter((item: any) => item.rowStatus === 'I');
		const existingItems = allItems.filter(
			(item: any) => item.rowStatus !== 'I' && !newItems.some((n: any) => n._$uid === item._$uid),
		);

		// 2단계:: 신규행정동끼리 날짜 겹침 검사
		if (!validateNewItemsDateOverlap(newItems)) {
			return;
		}

		// 신규(I) + 기존(R/U) 날짜 겹침 자동 조정
		const hasAdjustment = adjustDateOverlap(newItems, existingItems);

		// 4단계:: 자동 조정 안내 후 실제 저장 처리
		if (hasAdjustment) {
			showAlert(
				'기간 조정 안내',
				'동일 행정동의 기존 데이터가 있어 기간을 자동으로 조정했습니다.\n변경된 내용을 확인 후 다시 저장해주세요.',
				() => {
					processSaveWithAdjustments();
				},
			);
			return;
		}

		processSaveWithAdjustments();
	}, [t, searchParams, validateNewItemsDateOverlap, adjustDateOverlap, processSaveWithAdjustments]);

	// 센터 행정동 그리드 버튼
	const gridBtn = useMemo((): GridBtnPropsType => {
		let searchDccode = '';
		if (typeof searchParams?.dccode === 'string') {
			searchDccode = searchParams.dccode;
		} else if (_.isArray(searchParams?.dccode) && searchParams.dccode.length > 0) {
			searchDccode = searchParams.dccode[0];
		}
		const dccodeObj = allCommonCodeList?.find(code => code.comCd === searchDccode);

		const getInitialValues = () => ({
			rowStatus: 'I', // 신규행
			serialkey: '',
			dccode: dccodeObj?.comCd ?? '',
			dcname: dccodeObj?.cdNm ?? '',
			ctpKorNm: '',
			sigKorNm: '',
			hjdongNm: '',
			fromDate: dayjs().add(3, 'day').format('YYYYMMDD'),
			toDate: DEFAULT_END_DATE,
			delYn: 'N',
			isDuplicate: false,
			initialDelYn: false,
		});

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus', // 행추가
					initValues: getInitialValues(),
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (searchParams?.effectiveDate && dayjs(searchParams?.effectiveDate).isSame(dayjs(), 'day')) {
							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 입력/수정/삭제가 가능합니다.`);
							return true;
						}
					},
				},
				{
					btnType: 'delete',
					callBackFn: () => {
						bumpGridTick();
					},
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (searchParams?.effectiveDate && dayjs(searchParams?.effectiveDate).isSame(dayjs(), 'day')) {
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
					callBackFn: handleSaveButtonClick,
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (searchParams?.effectiveDate && dayjs(searchParams?.effectiveDate).isSame(dayjs(), 'day')) {
							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 입력/수정/삭제가 가능합니다.`);
							return true;
						}
					},
				},
				{
					btnType: 'new',
					btnLabel: t('lbl.CHANGE_HISTORY'), // 변경이력
					callBackFn: () => {
						if (changeHistoryPopupRef) {
							changeHistoryPopupRef?.current?.handlerOpen();
						}
					},
				},
			],
		};
	}, [searchParams, allCommonCodeList, t, bumpGridTick, handleSaveButtonClick]);

	// 날짜 유효성 검사 함수
	const createDateValidator = useCallback(
		// isToDate: 적용종료일자 / 적용시작일자 구분 필드
		// isFromDateToday: 적용시작일자 오늘 날짜 체크 여부 (item 이 N 인경우 오늘날짜부터 체크 가능)
		(isToDate = false, isFromDateToday = false) => {
			// 1. 복잡한 설정 로직(Offset 및 메시지)을 클로저 외부로 분리하여 미리 계산
			let offsetDays = 2;
			if (isFromDateToday) {
				offsetDays = -1;
			} else if (isToDate) {
				offsetDays = 1;
			}

			// 에러 메시지 미리 생성
			const getMinDateMessage = () => {
				const label = isToDate ? '적용종료일자' : '적용시작일자';
				if (isFromDateToday || offsetDays === -1) {
					return `${label}는 오늘 이후 일자를 선택 할 수 있습니다.`;
				}
				return `${label}는 오늘 기준 +${offsetDays + 1}일 이후 일자를 선택 할 수 있습니다.`;
			};
			const minDateMsg = getMinDateMessage();

			// 2. 실제 검증 로직은 단순 순차 비교만 수행
			return function (oldValue: any, newValue: any, item: any) {
				// 날짜 형식 유효성 검사
				if (!dayjs(newValue.split('-').join(''), 'YYYYMMDD', true).isValid()) {
					return { validate: false, message: t('lbl.INVALID_DATE_FORMAT') };
				}

				const inputDate = dayjs(newValue);
				const minDate = dayjs().add(offsetDays, 'day');
				const maxDate = dayjs(DEFAULT_END_DATE, 'YYYYMMDD');

				// 최소 날짜 체크
				if (inputDate.isBefore(minDate)) {
					return { validate: false, message: minDateMsg };
				}

				// 최대 날짜 체크
				if (inputDate.isAfter(maxDate)) {
					return { validate: false, message: '종료일을 넘어서 설정할 수 없습니다.' };
				}

				// toDate의 경우 fromDate보다 이후여야 함
				if (isToDate && item.fromDate) {
					const fromDate = dayjs(item.fromDate, 'YYYYMMDD');
					if (inputDate.isBefore(fromDate)) {
						return { validate: false, message: '종료일은 시작일 이후여야 합니다.' };
					}
				}

				return { validate: true, message: '' };
			};
		},
		[t, DEFAULT_END_DATE], // DEFAULT_END_DATE, t 의존성 확인
	);

	// 그리드 columnLayout
	const gridCol = useMemo(() => {
		return [
			// 물류센터
			{
				dataField: 'dcname',
				headerText: t('lbl.DCCODE'), // 물류센터
				required: true,
				filter: {
					showIcon: true,
				},
				editable: false,
			},
			{
				dataField: 'ctpKorNm',
				headerText: '시/도',
				filter: {
					showIcon: true,
				},
				required: true,
				editable: true,
				dataType: 'code',
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					listFunction: function () {
						return Array.isArray(mapDistrictList?.sido) ? mapDistrictList.sido : [];
					},
					keyField: 'ctpKorNm',
					valueField: 'ctpKorNm',
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
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
				required: true,
				editable: true,
				dataType: 'code',
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					listFunction: function (
						rowIndex: number, //: 행 인덱스
						columnIndex: number, // 칼럼 인덱스
						item: any, // 해당 행에 출력되고 있는 행 아이템 객체 (Object)
						dataField: string, // 해당 셀에 출력되고 있는 데이터필드명
					) {
						return mapDistrictList?.sgg[item?.ctpKorNm] || [];
					},
					keyField: 'sigKorNm',
					valueField: 'sigKorNm',
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
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
			// 행정동
			{
				dataField: 'hjdongCd',
				headerText: t('lbl.PUBLIC_ADMINISTRATION_DONG'),
				required: true,
				editable: true,
				dataType: 'code',
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					listFunction: (rowIndex: number, columnIndex: number, item: any) => {
						return mapDistrictList?.hjdong[`${item?.ctpKorNm}__${item?.sigKorNm}`] || [];
					},
					keyField: 'hjdongCd', // 저장값: 코드
					valueField: 'hjdongNm', // 표시값: 이름
				},
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					const list = mapDistrictList?.hjdong[`${item?.ctpKorNm}__${item?.sigKorNm}`] || [];
					return list.find((d: any) => d.hjdongCd === value)?.hjdongNm ?? item?.hjdongNm ?? '';
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
			// 적용시작일자
			{
				dataField: 'fromDate',
				headerText: t('lbl.APL_STR_DT'), // 적용시작일자
				required: true,
				editable: true,
				dataType: 'date',
				formatString: gridDateFormat, // 'yyyy-mm-dd'
				dateInputFormat: gridInputDateFormat, // 'yyyymmdd'
				minWidth: 120,
				editRenderer: {
					type: 'CalendarRenderer',
					onlyCalendar: false,
					showExtraDays: false,
					showEditBtn: true,
					showEditorBtnOver: true,
					// validator: createDateValidator(false),
					validator: (oldValue: any, newValue: any, item: any) => {
						// 신규행(I)이면 isFromDateToday = true, 그 외 false 등 비즈니스 규칙에 맞게 분기
						const isToDate = false;
						// item?.hjdongCd 가 없을 때 false,  newHjdongList 가 없어도 false,
						// newHjdongList 에 item?.hjdongCd 가 있을 때만 true 처리
						let isFromDateToday = false;
						if (
							item?.hjdongCd &&
							newHjdongList.some((hjdongItem: NewHjdongListType) => hjdongItem?.hjdongCd === item?.hjdongCd)
						) {
							isFromDateToday = true;
						}
						// 팩토리로 실제 검증 함수 생성 후 호출
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
			// 적용종료일자
			{
				dataField: 'toDate',
				headerText: t('lbl.APL_END_DT'), // 적용종료일자
				required: true,
				editable: true,
				dataType: 'date',
				formatString: gridDateFormat, // 'yyyy-mm-dd'
				dateInputFormat: gridInputDateFormat, // 'yyyymmdd'
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
					// 편집 가능한 조건: initialDelYn이 false(또는 undefined)이면서 handleCellEditBegin 반환값이 true인 경우
					const isEditable =
						item?.initialDelYn !== true &&
						handleCellEditBegin({
							dataField: 'toDate',
							rowIndex: rowIndex,
						});

					if (isEditable) {
						return 'isEdit';
					} else {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					}
				},
			},
			// 반영 예정
			{
				dataField: 'reflectSchedule',
				headerText: t('lbl.SCHEDULED_REFLECTION'), // 반영 예정
				required: false,
				editable: false,
				renderer: {
					type: 'TemplateRenderer',
				},
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					// 기준: 적용시작일자 (변경하려면 item.toDate 사용)
					const src = item?.fromDate || null;
					if (!src) return '';
					const diffDays = dayjs(item.fromDate).diff(dayjs(), 'd');

					// 오늘 날짜 기준으로 0일부터 3일까지만 표시, 나머지는 공백 처리
					if (diffDays >= 0 && diffDays <= 3) {
						return `<div style="width:100%;text-align:center">${
							dayjs().isSame(dayjs(item.fromDate), 'day') ? '' : `D-${diffDays + 1}`
						}</div>`;
					}

					// 명시적으로 빈 문자열 반환 (공백 처리)
					return '';
				},
			},
			// 행정동 중복
			{
				dataField: 'isDuplicate', //isAdmDup
				headerText: t('lbl.DUPLICATE_PAD'), // 행정동 중복
				editable: false,
				renderer: {
					type: 'TemplateRenderer',
				},
				filter: {
					showIcon: true,
				},
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					const src = item?.isDuplicate || null;
					if (!src) return '';
					// 'Y' 일때만 보여주기
					if (src) {
						return `<div style="width:100%;text-align:center">Y</div>`;
					}
					return '';
				},
			},
			// 폐지 행정동
			{
				dataField: 'abolishedYn', //isAdmDup
				headerText: '폐지 행정동', // 폐지 행정동
				editable: false,
				renderer: {
					type: 'TemplateRenderer',
				},
				filter: {
					showIcon: true,
				},
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => {
					if (value === 'Y') {
						return `<div style="width:100%;text-align:center">Y</div>`;
					}
					return '';
				},
			},
			// 비고
			{
				dataField: 'rmk',
				headerText: '비고',
				editable: true,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					return 'isEdit';
				},
			},
			// 삭제여부
			{
				dataField: 'delYn', //isAdmDup
				headerText: t('lbl.DEL_YN'), // 삭제여부
				required: true,
				editable: true, // 계속 수정 가능
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
					if (item?.rowStatus === 'I') {
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
	}, [mapDistrictList, delYnOptions, newHjdongList, t]);

	// 셀 클릭 이벤트 핸들러
	const handleCellClick = useCallback(
		(event: any) => {
			const { dataField, item: rowObj, rowIndex } = event;
			const grid = gridRef.current;
			if (!grid) return;

			const rowStatus = getRowStatusByIndex(grid, rowIndex);

			if (rowStatus && rowObj && rowStatus) {
				setSelectedRowInCenterGrid({
					...rowObj,
					clickedField: dataField,
					rowStatus: rowStatus,
					rowIndex: rowIndex,
				});
			}
		},
		[setSelectedRowInCenterGrid],
	);
	// 편집 제어 이벤트 핸들러
	const handleCellEditBegin = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, item } = event;
		const grid = gridRef.current;
		if (!grid) return true;

		const rowStatus = getRowStatusByIndex(grid, rowIndex);

		// 기존행이면서 delYn 이 'Y' 인 경우 선택 불가 처리 (적용필드: toDate, delYn)
		if (['toDate', 'delYn'].includes(dataField as any) && rowStatus === 'R' && item?.initialDelYn === true) {
			return false;
		}

		// R/U 인경우
		if (rowStatus === 'R' || rowStatus === 'U') {
			if (R_U_EDITABLE_ROW_FIELDS.includes(dataField as any)) {
				return true;
			}
		}
		// I 인경우
		if (rowStatus === 'I') {
			if (I_EDITABLE_ROW_FIELDS.includes(dataField as any)) {
				return true;
			}
		}

		return false;
	}, []);

	// delYn 필드 변경 처리
	const handleDelYnChange = useCallback(
		(grid: any, rowIndex: number, value: string, item: any) => {
			let changedToDate;
			if (value === 'Y') {
				if (dayjs(item.fromDate).isAfter(dayjs().add(2, 'day'))) {
					changedToDate = dayjs(item.fromDate).format('YYYYMMDD');
				} else {
					changedToDate = dayjs().add(2, 'day').format('YYYYMMDD');
				}
			} else {
				changedToDate = DEFAULT_END_DATE;
			}
			grid.setCellValue(rowIndex, 'toDate', changedToDate);
			bumpGridTick();
		},
		[bumpGridTick],
	);

	// ctpKorNm(시/도) 필드 변경 처리
	const handleCtpKorNmChange = useCallback(
		(grid: any, rowIndex: number, value: string) => {
			let ctpKorNm = '';
			const ctpKorNmObject = mapDistrictList.sido.find((item: any) => item.ctpKorNm === value);
			if (ctpKorNmObject) {
				ctpKorNm = ctpKorNmObject?.ctpKorNm ?? '';
			}
			grid.setCellValue(rowIndex, 'ctpKorNm', ctpKorNm);
			grid.setCellValue(rowIndex, 'sigKorNm', '');
			grid.setCellValue(rowIndex, 'hjdongNm', '');
			grid.setCellValue(rowIndex, 'hjdongCd', '');
			grid.setCellValue(rowIndex, 'fromDate', dayjs().add(3, 'day').format('YYYYMMDD'));
			bumpGridTick();
		},
		[mapDistrictList, bumpGridTick],
	);

	// sigKorNm(시/구/군) 필드 변경 처리
	const handleSigKorNmChange = useCallback(
		(grid: any, rowIndex: number, value: string, item: any) => {
			let sigKorNm = '';
			const sigKorNmObject = mapDistrictList?.sgg[item?.ctpKorNm]?.find((item: any) => item.sigKorNm === value);
			if (sigKorNmObject) {
				sigKorNm = sigKorNmObject?.sigKorNm ?? '';
			}
			grid.setCellValue(rowIndex, 'sigKorNm', sigKorNm);
			grid.setCellValue(rowIndex, 'hjdongNm', '');
			grid.setCellValue(rowIndex, 'hjdongCd', '');
			grid.setCellValue(rowIndex, 'fromDate', dayjs().add(3, 'day').format('YYYYMMDD'));
			bumpGridTick();
		},
		[mapDistrictList, bumpGridTick],
	);

	// hjdongCd(행정동) 필드 변경 처리
	const handleHjdongCdChange = useCallback(
		(grid: any, rowIndex: number, value: string, item: any) => {
			// 행정동 코드 -> 행정동 이름으로 변환 처리
			const hjdongNm =
				mapDistrictList?.hjdong[`${item?.ctpKorNm}__${item?.sigKorNm}`]?.find(code => code.hjdongCd === value)
					?.hjdongNm || '';
			grid.setCellValue(rowIndex, 'hjdongNm', hjdongNm);

			// 미등록 행정동 선택 시 적용시작일자 오늘 날짜 로 변경 처리
			const isFromDateToday = newHjdongList.some((hjdongItem: NewHjdongListType) => hjdongItem.hjdongCd === value);
			if (isFromDateToday) {
				grid.setCellValue(rowIndex, 'fromDate', dayjs().format('YYYYMMDD'));
			}

			// 현재 센터 그리드 데이터에서 같은 행정동 코드가 존재하고 fromDate 가 오늘+3 일 이상인 경우
			// 얼럿 띄우고 빈값 처리
			// fromDate 가 오늘+3 일 이전인 경우 fromDate 값을 오늘+3 일로 변경처리
			const allGridData = gridRef.current.getGridData();
			const sameHjdongData = allGridData.filter((item: any) => item.hjdongCd === value);
			if (sameHjdongData.length > 0) {
				// 중복 행정동 코드에서 fromDate 가 오늘+3 일 이상인 행정동 포함시 변경 금지 처리 + 얼럿 띄우기 (임시 - 추후 변경 가능)
				const sameHjdongDataWithToDate = sameHjdongData
					.filter((item: any) => item.rowStatus !== 'I')
					.filter((item: any) =>
						dayjs(item.fromDate, 'YYYYMMDD').startOf('day').isSameOrAfter(dayjs().add(3, 'day').startOf('day'), 'day'),
					);
				// .filter((item: any) => item.toDate !== DEFAULT_END_DATE);
				if (sameHjdongDataWithToDate.length > 0) {
					const list = mapDistrictList?.hjdong[`${item?.ctpKorNm}__${item?.sigKorNm}`] || [];
					const hjdongName = list.find((d: any) => d.hjdongCd === value)?.hjdongNm ?? '';
					showAlert(
						null,
						`현재 ${hjdongName} 행정동의 적용시작일자가 오늘+3일 부터 등록된 데이터가 존재합니다.\n 해당 행정동 삭제 후 등록가능 합니다.`,
					);
					// 해당 경우 빈값으로 처리
					grid.setCellValue(rowIndex, 'hjdongCd', '');

					return;
				} else {
					// fromDate 를 오늘+3 일로 변경처리
					grid.setCellValue(rowIndex, 'fromDate', dayjs().add(3, 'day').format('YYYYMMDD'));
				}
			}

			bumpGridTick();
		},
		[mapDistrictList, newHjdongList, bumpGridTick],
	);

	// toDate(적용종료일자) 필드 변경 처리
	const handleToDateChange = useCallback(
		(grid: any, rowIndex: number, value: string) => {
			if (dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD'))) {
				grid.setCellValue(rowIndex, 'delYn', 'N');
			} else {
				grid.setCellValue(rowIndex, 'delYn', 'Y');
			}
			bumpGridTick();
		},
		[bumpGridTick],
	);

	const handleCellEditEnd = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, value, item } = event;

			setTimeout(() => {
				const grid = gridRef.current;
				if (!grid) return;

				try {
					if (dataField === 'delYn') {
						handleDelYnChange(grid, rowIndex, value, item);
					} else if (dataField === 'ctpKorNm') {
						handleCtpKorNmChange(grid, rowIndex, value);
					} else if (dataField === 'sigKorNm') {
						handleSigKorNmChange(grid, rowIndex, value, item);
					} else if (dataField === 'hjdongCd') {
						handleHjdongCdChange(grid, rowIndex, value, item);
					} else if (dataField === 'toDate') {
						handleToDateChange(grid, rowIndex, value);
					}
				} catch (error) {
					//console.warn(error);
				}
			}, 100);
		},
		[handleDelYnChange, handleCtpKorNmChange, handleSigKorNmChange, handleHjdongCdChange, handleToDateChange],
	);

	// 체크박스 체크 이벤트 핸들러
	const handleRowCheckClick = useCallback(
		(event: any) => {
			return bumpGridTick();
		},
		[bumpGridTick],
	);

	// 이벤트 처리 useEffect
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid || typeof grid.bind !== 'function') return;

		try {
			grid.bind('cellClick', handleCellClick);
			grid.bind('cellEditBegin', handleCellEditBegin);
			grid.bind('cellEditEnd', handleCellEditEnd);
			grid.bind('rowCheckClick', handleRowCheckClick);
			grid.bind('rowAllChkClick', handleRowCheckClick);
		} catch (e) {
			//console.warn(e);
		}

		return () => {
			try {
				if (typeof grid.unbind === 'function') {
					grid.unbind('cellClick');
					grid.unbind('cellEditBegin');
					grid.unbind('cellEditEnd');
					grid.unbind('rowCheckClick');
					grid.unbind('rowAllChkClick');
				}
			} catch (e) {
				//console.warn(e);
			}
		};
	}, [gridKey, handleCellClick, handleCellEditBegin, handleCellEditEnd]);

	// mapDistrictList 바뀔 때 그리드 재마운트 (시,구,동 그리드 combobox 리스트 데이터 변경 시 그리드 재마운트)
	const listsSig = useMemo(() => {
		const sidoLen = listenerSource?.sido?.features?.length ?? 0;
		const sggLen = listenerSource?.sgg?.features?.length ?? 0;
		const demLen = listenerSource?.dem?.features?.length ?? 0;
		return `${sidoLen}-${sggLen}-${demLen}`;
	}, [
		listenerSource?.sido?.features?.length,
		listenerSource?.sgg?.features?.length,
		listenerSource?.dem?.features?.length,
	]);

	// mapDistrictList 바뀔 때 아닌, "실제 데이터 길이", "미사용 행정동 리스트" 바뀔 때만 재마운트
	useEffect(() => {
		if (!listsSig) return;
		setGridKey(k => k + 1);
	}, [listsSig, newHjdongList]);

	// 신규 행정동 그리드 열림/닫힘 시 그리드 재마운트
	useEffect(() => {
		const t = window.setTimeout(() => {
			setGridKey(prev => prev + 1);
		}, 200);
		return () => window.clearTimeout(t);
	}, [isNewCreatedHjdongWithoutPolygonGridOpen]);

	// 재마운트 후 데이터 재적용
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid || !gridData) return;
		try {
			const customGridData = gridData.map((item: any) => {
				return {
					...item,
					initialDelYn: item?.delYn === 'Y',
				};
			});
			grid.setGridData(customGridData);
			// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
			grid.setColumnSizeList(grid.getFitColumnSizeList(true));
		} catch (e) {
			//console.warn(e);
		}
	}, [gridKey, gridData]);

	return (
		<>
			<AGrid dataProps={''}>
				{/* 센터 권역 */}
				<Form disabled={isButtonDisabled}>
					<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={gridData?.length} />
				</Form>

				<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 여기서 변경이력의 팝업창을 띄워야 한다 */}
			{/* 변경이력 팝업 영역 */}
			<CustomModal ref={changeHistoryPopupRef} width="1280px">
				<MsCenterDistrictChangeHistoryPopup pForm={form} />
			</CustomModal>
		</>
	);
};

export default MsCenterDistrictListGrid;
