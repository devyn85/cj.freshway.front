// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// component
import { Datepicker, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridLoading from '@/components/common/GridLoading';
import GridTopBtn from '@/components/common/GridTopBtn';
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
// api
import { apiGetDcOrdGrpListByPrDccode, apiSaveDcOrdGrpList } from '@/api/ms/apiMsCenterDistrict';
// types
import { GridBtnPropsType } from '@/types/common';
// util
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}
interface IMsCenterDistrictPlatformOrderTypeSetupPopupProps {
	platformOrderTypeCodeList?: any[];
	fwCenterList?: any[];
	foCenterList?: any[];
	setupPopupGridData?: any[];
	centerOptionList?: any[];
	close: () => void;
}

const DEFAULT_END_DATE = '29991231';
const gridDateFormat = 'yyyy-mm-dd';
const gridInputDateFormat = 'yyyymmdd';
const EDITABLE_NEW_ROW_FIELDS = ['fromDate', 'deliveryDccode', 'deliveryDccode2'];
const UNEDITABLE_NEW_ROW_FIELDS = ['toDate'];

// validateAllPeriod 헬퍼: 날짜 유효성 검사
const validateSegmentDates = (rawSegments: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }>) => {
	const invalid = rawSegments.find(s => !s.from.isValid() || !s.to.isValid());
	if (invalid) return 'INVALID_FORMAT';
	const reversed = rawSegments.find(s => s.to.isBefore(s.from, 'day'));
	if (reversed) return 'REVERSED';
	return null;
};

// validateAllPeriod 헬퍼: 세그먼트 범위 클리핑
const clipSegmentsToRange = (
	rawSegments: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }>,
	rangeStart: dayjs.Dayjs,
	rangeEnd: dayjs.Dayjs,
) => {
	return rawSegments
		.map(s => {
			let start = s.from;
			let end = s.to;
			if (end.isBefore(rangeStart, 'day')) return null;
			if (start.isAfter(rangeEnd, 'day')) return null;
			if (start.isBefore(rangeStart, 'day')) start = rangeStart.clone();
			if (end.isAfter(rangeEnd, 'day')) end = rangeEnd.clone();
			return { start, end };
		})
		.filter(Boolean)
		.sort((a: any, b: any) => a.start.diff(b.start, 'day')) as Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }>;
};

// validateAllPeriod 헬퍼: 겹침 구간 수집
const findOverlaps = (segments: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }>) => {
	const overlaps: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> = [];
	if (segments.length < 2) return overlaps;
	let prev = segments[0];
	for (let i = 1; i < segments.length; i++) {
		const cur = segments[i];
		if (cur.start.isSameOrBefore(prev.end, 'day')) {
			overlaps.push({
				start: cur.start.isSameOrAfter(prev.start, 'day') ? cur.start : prev.start,
				end: cur.end.isSameOrBefore(prev.end, 'day') ? cur.end : prev.end,
			});
			if (cur.end.isSameOrAfter(prev.end, 'day')) prev = { start: prev.start, end: cur.end };
			continue;
		}
		prev = cur;
	}
	return overlaps;
};

// validateAllPeriod 헬퍼: 빈 구간 수집
const findGaps = (
	segments: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }>,
	rangeStart: dayjs.Dayjs,
	rangeEnd: dayjs.Dayjs,
) => {
	const gaps: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> = [];
	let cursor = rangeStart.clone();
	for (const seg of segments) {
		if (seg.start.isAfter(cursor, 'day')) {
			gaps.push({ start: cursor.clone(), end: seg.start.clone().subtract(1, 'day') });
		}
		if (seg.end.isSameOrAfter(cursor, 'day')) {
			cursor = seg.end.clone().add(1, 'day');
		}
		if (cursor.isAfter(rangeEnd, 'day')) break;
	}
	if (cursor.isSameOrBefore(rangeEnd, 'day')) {
		gaps.push({ start: cursor.clone(), end: rangeEnd.clone() });
	}
	return gaps;
};

// 저장 헬퍼: 신규행 간 기간 겹침 검사
const hasNewItemsDateOverlap = (newItems: any[]): boolean => {
	for (let i = 0; i < newItems.length; i++) {
		for (let j = i + 1; j < newItems.length; j++) {
			const aStart = dayjs(newItems[i].fromDate, 'YYYYMMDD');
			const aEnd = dayjs(newItems[i].toDate, 'YYYYMMDD');
			const bStart = dayjs(newItems[j].fromDate, 'YYYYMMDD');
			const bEnd = dayjs(newItems[j].toDate, 'YYYYMMDD');
			if (!(aEnd.isBefore(bStart) || bEnd.isBefore(aStart))) return true;
		}
	}
	return false;
};

// 저장 헬퍼: 신규-기존 같은 우선순위 기간 겹침 검사
const hasNewExistingPriorityOverlap = (newItems: any[], existingItems: any[]): boolean => {
	for (const newItem of newItems) {
		const newStart = dayjs(newItem.fromDate, 'YYYYMMDD');
		const newEnd = dayjs(newItem.toDate, 'YYYYMMDD');
		const newPriorities = `${newItem.deliveryDccode}|${newItem.deliveryDccode2}`;
		for (const existingItem of existingItems) {
			const exStart = dayjs(existingItem.fromDate, 'YYYYMMDD');
			const exEnd = dayjs(existingItem.toDate, 'YYYYMMDD');
			const existingPriorities = `${existingItem.deliveryDccode}|${existingItem.deliveryDccode2}`;
			if (newPriorities !== existingPriorities) continue;
			const isOverlapping = !(newEnd.isBefore(exStart) || exEnd.isBefore(newStart));
			if (isOverlapping) return true;
		}
	}
	return false;
};

// 저장 헬퍼: 자동 기간 조정
const autoAdjustOverlappingPeriods = (
	grid: any,
	newItems: any[],
	existingItems: any[],
	todayPlus3: dayjs.Dayjs,
): boolean => {
	let hasAdjustment = false;

	// 2-1) 기존행 종료일 조정
	for (const newItem of newItems) {
		const newStart = dayjs(newItem.fromDate, 'YYYYMMDD');
		const newEnd = dayjs(newItem.toDate, 'YYYYMMDD');
		for (const existingItem of existingItems) {
			const exStart = dayjs(existingItem.fromDate, 'YYYYMMDD');
			const exEnd = dayjs(existingItem.toDate, 'YYYYMMDD');
			const isOverlapping = !(newEnd.isBefore(exStart) || exEnd.isBefore(newStart));
			if (!isOverlapping) continue;
			if (!exStart.isBefore(todayPlus3, 'day')) continue;
			const adjustedEndDate = newStart.subtract(1, 'day').format('YYYYMMDD');
			const currentToDate = String(existingItem.toDate).replace(/-/g, '');
			if (currentToDate !== adjustedEndDate) {
				grid.updateRowsById({
					_$uid: existingItem._$uid,
					toDate: adjustedEndDate,
					delYn: 'Y',
					rowStatus: 'U',
				});
				grid.addCheckedRowsByValue('_$uid', existingItem._$uid);
				hasAdjustment = true;
			}
		}
	}

	// 2-2) 마지막 행 toDate 조정
	if (newItems.length === 0 && existingItems.length > 0) {
		const sortedItems = [...existingItems].sort((a, b) => {
			return dayjs(a.fromDate, 'YYYYMMDD').diff(dayjs(b.fromDate, 'YYYYMMDD'), 'day');
		});
		const lastItem = sortedItems[sortedItems.length - 1];
		const currentToDate = String(lastItem.toDate).replace(/-/g, '');
		if (currentToDate !== DEFAULT_END_DATE) {
			grid.updateRowsById({
				_$uid: lastItem._$uid,
				toDate: DEFAULT_END_DATE,
				rowStatus: 'U',
				delYn: 'N',
			});
			grid.addCheckedRowsByValue('_$uid', lastItem._$uid);
			hasAdjustment = true;
		}
	}

	return hasAdjustment;
};

const MsCenterDistrictPlatformOrderTypeSetupPopup = forwardRef(
	(
		{
			platformOrderTypeCodeList,
			fwCenterList,
			foCenterList,
			setupPopupGridData,
			centerOptionList,
			close,
		}: IMsCenterDistrictPlatformOrderTypeSetupPopupProps,
		ref: any,
	) => {
		const { t } = useTranslation();
		const [form] = Form.useForm();
		const gridRef = useRef<any>(null);

		const [searchParams, setSearchParams] = useState<any>({
			ordGrp: form.getFieldValue('ordGrp'),
			effectiveDate: dayjs(form.getFieldValue('effectiveDate'))?.format('YYYYMMDD'),
			pr1Dccode: form.getFieldValue('pr1Dccode'), // fw
			pr2Dccode: form.getFieldValue('pr2Dccode'), // fo
		});
		const [gridData, setGridData] = useState<any[]>([]);
		const [isGridLoading, setIsGridLoading] = useState(false);

		// rowStatus 감지 함수
		const getAllGridDataWithStatus = (grid: any) => {
			const data: any[] = grid.getGridData?.() || [];
			return data.map((item, rowIndex) => ({
				...item,
				rowIndex,
				rowStatus: getRowStatusByIndex(grid, rowIndex), // 'I' | 'U' | 'D' | 'R'
			}));
		};

		// 삭제 될 행 조건
		const isDeleteRow = (r: any) => {
			const normYmd = (v: any) =>
				String(v ?? '')
					.replaceAll('-', '')
					.replaceAll('/', '');
			const ymd = (v: any) => dayjs(normYmd(v), 'YYYYMMDD', true);
			const todayPlus3 = dayjs().add(3, 'day');

			const f = ymd(r.fromDate);
			const t = ymd(r.toDate);
			return (
				r.rowStatus === 'U' &&
				f.isValid() &&
				t.isValid() &&
				f.isSameOrAfter(todayPlus3, 'day') &&
				normYmd(r.toDate) !== DEFAULT_END_DATE
			);
		};

		// 전체 기간 유효성 검사 (오늘+3일 ~ 2999-12-31 구간에 빈 기간이 있는지 체크 && 구간간 겹쳐진 기간이 있는지 체크)
		const validateAllPeriod = useCallback(
			({ isShowAlert }: { isShowAlert: boolean }) => {
				const grid = gridRef.current;
				if (!grid) return true;

				const tempRows = getAllGridDataWithStatus(grid);
				const rows = tempRows.filter((r: any) => !isDeleteRow(r));
				if (!rows.length) return true;

				const normYmd = (v: any) =>
					String(v ?? '')
						.replaceAll('-', '')
						.replaceAll('/', '');
				const ymd = (v: any) => dayjs(normYmd(v), 'YYYYMMDD', true).startOf('day');

				const rangeStart = dayjs().startOf('day'); // ✅ 오늘
				const rangeEnd = dayjs(DEFAULT_END_DATE, 'YYYYMMDD', true).startOf('day'); // ✅ 2999-12-31

				// 1) 세그먼트 수집 + 유효성(날짜/역전) 체크
				const rawSegments = rows.map((r: any) => ({ from: ymd(r.fromDate), to: ymd(r.toDate) }));

				const dateError = validateSegmentDates(rawSegments);
				if (dateError === 'INVALID_FORMAT') {
					if (isShowAlert) showAlert(null, '적용기간 날짜 형식이 올바르지 않은 행이 존재합니다.');
					return false;
				}
				if (dateError === 'REVERSED') {
					if (isShowAlert) showAlert(null, '적용종료일자가 적용시작일자보다 빠른 행이 존재합니다.');
					return false;
				}

				// 2) 범위(오늘~29991231)로 clip + 범위 밖 제거
				const segments = clipSegmentsToRange(rawSegments, rangeStart, rangeEnd);
				if (segments.length === 0) {
					if (isShowAlert) showAlert(null, '적용기간이 오늘부터 2999-12-31 범위를 커버하지 않습니다.');
					return false;
				}

				// 3) 겹침(Overlap) 검증
				const overlaps = findOverlaps(segments);
				if (overlaps.length > 0) {
					if (isShowAlert) {
						const msgLines = overlaps.map(o => `${o.start.format('YYYY-MM-DD')} ~ ${o.end.format('YYYY-MM-DD')}`);
						showAlert(null, `적용기간이 서로 겹치는 구간이 존재합니다.\n\n${msgLines.join('\n')}`);
					}
					return false;
				}

				// 4) 빈 구간(Gap) 검증 (연속성)
				const gaps = findGaps(segments, rangeStart, rangeEnd);
				if (gaps.length > 0) {
					if (isShowAlert) {
						const msgLines = gaps.map(g => `${g.start.format('YYYY-MM-DD')} ~ ${g.end.format('YYYY-MM-DD')}`);
						showAlert(null, `적용기간에 빈 구간이 존재합니다.\n\n${msgLines.join('\n')}`);
					}
					return false;
				}

				return true;
			},
			[gridRef, getAllGridDataWithStatus, isDeleteRow, showAlert],
		);

		// 그리드 기본 설정
		const gridProps = useMemo(
			() => ({
				editable: true, // 데이터 수정 여부
				editBeginMode: 'click',
				showStateColumn: false, // row 편집 여부
				showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
				enableColumnResize: true, // 열 사이즈 조정 여부
				fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
				// selectionMode: 'multipleRows', // (버전별) 다중행 선택 허용
			}),
			[],
		);

		// 삭제여부 옵션 리스트 (메모이제이션)
		const delYnOptions = useMemo(
			() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
			[],
		);

		const gridBtn = useMemo((): GridBtnPropsType => {
			const getInitialValues = () => ({
				rowStatus: 'I', // 신규행
				serialkey: '',
				fromDate: dayjs().add(3, 'day').format('YYYYMMDD'),
				toDate: DEFAULT_END_DATE,
				delYn: 'N',
				isDuplicate: false,
			});

			return {
				tGridRef: gridRef,
				btnArr: [
					{
						btnType: 'plus', // 행추가
						initValues: getInitialValues(),
						callBeforeFn: () => {
							// 조회일자가 오늘일 경우만 행추가 가능
							if (searchParams?.effectiveDate && dayjs(searchParams.effectiveDate).isSame(dayjs(), 'day')) {
								const grid = gridRef.current;
								const allData = getAllGridDataWithStatus(grid);

								// 추가 버튼 클릭 시 막는 처리
								// 1. 기존행의 시작일이 D+3 인 행이 (R) 로 1개 존재 시 추가 처리 막기
								//     (fromDate가 오늘+3일(포함) 이후 이면서 toDate 가 29991231 이면)
								//     (1개 삭제 후 등록하도록 얼럿메시지 처리)

								// fromDate가 오늘+3일(포함) 이후인 데이터가 하나라도 있으면 추가 금지 (임시 처리 - 추후 변경 가능)
								const hasBlockedRow = allData.some(
									(item: any) =>
										dayjs(item.fromDate, 'YYYYMMDD').isSameOrAfter(dayjs().add(3, 'day'), 'day') &&
										item.toDate === '29991231',
								);

								if (hasBlockedRow) {
									showAlert(
										null,
										`현재 적용시작일자가 오늘+3일 부터 등록된 데이터가 존재합니다.\n 해당 행 삭제 후 등록가능 합니다.`,
									);
									return true; // 행추가 막기
								}

								return false; // 행추가 허용
							}
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 입력/수정/삭제가 가능합니다.`);
							return true;
						},
					},
					{
						btnType: 'delete',
						// callBackFn: () => {
						// 	bumpGridTick();
						// },
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
						btnType: 'save', // 저장
						callBackFn: async () => {
							const grid = gridRef.current;
							const checkedItems = grid.getChangedData({ validationYn: false });
							const allItems = getAllGridDataWithStatus(grid);
							const fwCenterCodeList = fwCenterList.map((item: any) => item.comCd);
							const foCenterCodeList = foCenterList.map((item: any) => item.comCd);

							// 신규행(I) 리스트
							const newItems = checkedItems.filter((item: any) => item.rowStatus === 'I');
							// 기존행(R, U) 리스트 (삭제 될 행 제외)
							const existingItems = allItems
								.filter((item: any) => item.rowStatus !== 'I')
								.filter((item: any) => !isDeleteRow(item));

							if (!checkedItems || checkedItems.length < 1) {
								showAlert(null, t('msg.MSG_COM_VAL_020'));
								return;
							}

							// 1단계: 유효성 검사 (자동처리 전)
							// 1-1) 필수값 유효성 검사
							if (!grid.validateRequiredGridData()) {
								return false;
							}

							// 1-2) 신규행끼리 날짜 겹침 검사
							if (hasNewItemsDateOverlap(newItems)) {
								showAlert(null, '신규 행들끼리 적용기간이 서로 겹칠 수 없습니다.');
								return;
							}

							// 1-3) 신규-기존 같은 우선순위 기간 겹침 검사
							if (hasNewExistingPriorityOverlap(newItems, existingItems)) {
								showAlert(
									null,
									'신규 행과 기존 행이 같은 우선순위 설정으로 적용기간이 겹칩니다.\n우선순위 또는 적용기간을 변경해주세요.',
								);
								return;
							}

							// 2단계: 자동 변경 처리
							// 스킵 조건: 기존(R&U)+신규(I)가 겹치지 않고 연속성이면 스킵
							const isSkipAutoAdjustment = validateAllPeriod({ isShowAlert: false });
							let hasAdjustment = false;

							if (!isSkipAutoAdjustment) {
								const todayPlus3 = dayjs().add(3, 'day').startOf('day');
								hasAdjustment = autoAdjustOverlappingPeriods(grid, newItems, existingItems, todayPlus3);
							}

							if (hasAdjustment) {
								showAlert(
									'기간 조정 안내',
									'기존 행과 신규 행의 적용기간이 겹쳐 기존 행의 종료일을 자동으로 조정했습니다.\n변경 내용을 확인 후 다시 저장해주세요.',
								);
								return;
							}

							// 유효성 검사 (자동처리 후)
							const isValid = validateAllPeriod({ isShowAlert: true });
							if (!isValid) return;

							return processSaveWithAdjustments();

							// 실제 저장 처리 함수
							async function processSaveWithAdjustments() {
								const checkedItems = grid.getChangedData({ validationYn: false });

								const insertItemList = checkedItems.filter((item: any) => item.rowStatus === 'I');
								// 삭제 기준은 rowStatus === 'U' && fromDate >= today + 3 && toDate !== '29991231'
								// 수정 기준은 rowStatus === 'U' 이면서 삭제 기준이 아닌 것들
								const tempUpdateItemList = checkedItems.filter((item: any) => item.rowStatus === 'U');

								const updateItemList = tempUpdateItemList.filter((item: any) => !isDeleteRow(item));
								const deleteItemList = tempUpdateItemList.filter((item: any) => isDeleteRow(item));
								const mergedItemList = [
									...insertItemList.map((item: any) => ({
										...item,
										ordGrp: form.getFieldValue('ordGrp'),
										pr1Dccode: fwCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
										pr2Dccode: foCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
									})),
									...updateItemList.map((item: any) => ({
										...item,
										rowStatus: 'U',
										ordGrp: form.getFieldValue('ordGrp'),
										pr1Dccode: fwCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
										pr2Dccode: foCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
									})),
									...deleteItemList.map((item: any) => ({
										...item,
										rowStatus: 'D',
										delYn: 'Y', // 삭제처리 플레그그
										ordGrp: form.getFieldValue('ordGrp'),
										pr1Dccode: fwCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
										pr2Dccode: foCenterCodeList.includes(item.deliveryDccode)
											? item.deliveryDccode
											: item.deliveryDccode2,
									})),
								];

								// 삭제 얼럿 처리 분기 처리
								if (deleteItemList.length > 0) {
									// 삭제 기준 설명 확인/취소 컨펌 얼럿
									showConfirm(
										null,
										`미래일자(+3일)로 등록된 데이터입니다.\n 종료일자 수정 시 삭제처리됩니다.\n 진행하시겠습니까?`,
										() => {
											// 저장 갯수 컨펌 얼럿
											showConfirm(
												null,
												`${t('msg.MSG_COM_CFM_003')}\n ${t('lbl.NEW')}: ${insertItemList.length}\n ${t(
													'lbl.MODIFY',
												)}: ${updateItemList.length}\n ${t('lbl.DELETE')}: ${deleteItemList.length}`,
												async () => {
													const res = await apiSaveDcOrdGrpList(mergedItemList);
													if (res.statusCode === 0) {
														showAlert(null, '저장되었습니다.');
														handleSearch(searchParams);
													}
												},
											);
										},
									);
								} else {
									// 저장 갯수 컨펌 얼럿
									showConfirm(
										null,
										`${t('msg.MSG_COM_CFM_003')}\n ${t('lbl.NEW')}: ${insertItemList.length}\n ${t('lbl.MODIFY')}: ${
											updateItemList.length
										}\n ${t('lbl.DELETE')}: ${deleteItemList.length}`,
										async () => {
											const res = await apiSaveDcOrdGrpList(mergedItemList);
											if (res.statusCode === 0) {
												showAlert(null, '저장되었습니다.');
												handleSearch(searchParams);
											}
										},
									);
								}
							}
						},
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
				],
			};
		}, [searchParams, fwCenterList, foCenterList, validateAllPeriod]);

		/**
		 * 부모에서 호출할 수 있는 함수 노출
		 */
		useImperativeHandle(ref, () => ({
			setOrdGrp: (value: any) => {
				form.setFieldValue('ordGrp', value);
				setSearchParams((prev: any) => ({ ...prev, ordGrp: value }));
			},
			setPr1Dccode: (value: any) => {
				form.setFieldValue('pr1Dccode', value);
				setSearchParams((prev: any) => ({ ...prev, pr1Dccode: value }));
			},
			setPr2Dccode: (value: any) => {
				form.setFieldValue('pr2Dccode', value);
				setSearchParams((prev: any) => ({ ...prev, pr2Dccode: value }));
			},
			setEffectiveDate: (value: any) => {
				form.setFieldValue('effectiveDate', value);
				setSearchParams((prev: any) => ({ ...prev, effectiveDate: dayjs(value)?.format('YYYYMMDD') }));
			},
		}));

		const createDateValidator = useCallback(
			// isToDate: 적용종료일자 / 적용시작일자 구분 필드
			// isFromDateToday: 적용시작일자 오늘 날짜 체크 여부 (item 이 N 인경우 오늘날짜부터 체크 가능)
			(isToDate = false, isFromDateToday = false) => {
				const dateLabel = isToDate ? '적용종료일자' : '적용시작일자';
				const offsetDays = isToDate && !isFromDateToday ? 1 : 2;

				return function (oldValue: any, newValue: any, item: any) {
					// 1. 날짜 형식 유효성 검사
					if (!dayjs(newValue.split('-').join(''), 'YYYYMMDD', true).isValid()) {
						return { validate: false, message: t('lbl.INVALID_DATE_FORMAT') };
					}

					const inputDate = dayjs(newValue);
					const minDate = dayjs().add(offsetDays, 'day');
					const maxDate = dayjs(DEFAULT_END_DATE, 'YYYYMMDD');

					// 2. 최소 날짜 체크
					if (inputDate.isBefore(minDate)) {
						const message = isFromDateToday
							? `${dateLabel}는 오늘 이후 일자를 선택 할 수 있습니다.`
							: `${dateLabel}는 오늘 기준 +${offsetDays + 1}일 이후 일자를 선택 할 수 있습니다.`;
						return { validate: false, message };
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

		// 그리드 columnLayout
		const gridCol = useMemo(() => {
			return [
				// 1순위
				{
					dataField: 'deliveryDccode',
					headerText: '1순위', //
					required: true,
					filter: {
						showIcon: true,
					},
					editable: true,
					align: 'center',
					labelFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: string,
					) => {
						return item?.deliveryDcname ?? '';
					},
					commRenderer: {
						type: 'dropDown',
						listFunction: function (rowIndex: number, _val: any, rowObj: any, fieldName: string) {
							return centerOptionList ?? [];
						},
						editable: true,
						disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
							// 기존행의 경우만 선택 안되게 처리
							if (item?.rowStatus !== 'I') return true;
							return false;
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (
							handleCellEditBegin({
								dataField: 'deliveryDccode',
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
				// 2순위
				{
					dataField: 'deliveryDccode2',
					headerText: '2순위', //
					required: true,
					filter: {
						showIcon: true,
					},
					editable: true,
					align: 'center',
					labelFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: string,
					) => {
						// return item?.deliveryDccode === item?.pr1Dccode
						//   ? item?.pr2Dcname
						//   : item?.pr1Dcname;
						return item?.deliveryDcname2 ?? '';
					},
					commRenderer: {
						type: 'dropDown',
						listFunction: function (rowIndex: number, _val: any, rowObj: any, fieldName: string) {
							const filteredList = centerOptionList?.filter((item: any) => item.comCd !== rowObj?.deliveryDccode);
							return filteredList ?? [];
						},
						editable: true,
						disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
							// 기존행의 경우만 선택 안되게 처리
							if (item?.rowStatus !== 'I') return true;
							return false;
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (
							handleCellEditBegin({
								dataField: 'deliveryDccode2',
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
				// 적용종료일자
				{
					dataField: 'toDate',
					headerText: t('lbl.APL_END_DT'), // 적용종료일자
					required: true,
					editable: true,
					dataType: 'date',
					formatString: gridDateFormat, // 'yyyy-mm-dd'
					dateInputFormat: gridInputDateFormat, // 'yyyymmdd'
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
							handleCellEditBegin({
								dataField: 'toDate',
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
					dataField: 'delYn',
					headerText: t('lbl.DEL_YN'),
					required: true,
					editable: true, // 계속 수정 가능
					minWidth: 85,
					// cellMerge: true, // TODO: 추후 사용 가능
					// mergeRef: 'dateRangeKey', // TODO: 추후 사용 가능
					// mergePolicy: 'restrict', // TODO: 추후 사용 가능
					commRenderer: {
						type: 'dropDown',
						list: delYnOptions,
						editable: true,
						disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
							// 기존행 이면서 delYn 이 'Y' 인 경우 선택 불가 처리
							if (item?.rowStatus === 'R') return item?.initialDelYn === true;
							// 신규행인 경우 선택 불가 처리
							if (item?.rowStatus === 'I') return true;

							return false; // 위 조건에 해당하지 않으면 편집 가능
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

						return 'isEdit';
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
		}, [t]);

		// 편집 제어 함수
		const handleCellEditBegin = useCallback((event: GridEvent) => {
			const { dataField, rowIndex } = event;
			const grid = gridRef.current;
			if (!grid) return true;

			const rowStatus = getRowStatusByIndex(grid, rowIndex);

			if (UNEDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
				return rowStatus === 'I' ? false : true;
			}

			if (EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
				return rowStatus === 'I';
			}

			return true;
		}, []);

		// 편집 후 동기화 처리
		const handleCellEditEnd = useCallback(
			(event: GridEvent) => {
				const { dataField, rowIndex, value, item } = event;

				// 내부 헬퍼들
				const defer = (fn: (grid: any) => void, ms = 100) => {
					const grid = gridRef.current;
					if (!grid) return;
					setTimeout(() => {
						const g = gridRef.current;
						if (!g) return;
						try {
							fn(g);
						} catch (e) {}
					}, ms);
				};
				const setCellValueSafe = (grid: any, idx: number, field: string, val: any) => {
					try {
						setTimeout(() => {
							grid?.setCellValue?.(idx, field, val);
						}, 100);
					} catch (e) {}
				};
				const getCellValueSafe = (grid: any, idx: number, field: string) => {
					try {
						return grid?.getCellValue?.(idx, field);
					} catch {
						return undefined;
					}
				};
				const getRowSafe = (grid: any, idx: number) => {
					try {
						return grid?.getItemByRowIndex?.(idx) ?? event.item;
					} catch {
						return event.item;
					}
				};

				// 1순위 선택 시 2순위 자동 선택
				if (dataField === 'deliveryDccode') {
					setCellValueSafe(gridRef.current, rowIndex, 'deliveryDccode2', '');
				} else if (dataField === 'delYn') {
					// 기간처리
					defer(g => {
						const row = getRowSafe(g, rowIndex);
						const base = dayjs().add(2, 'day');
						const nextToDate =
							value === 'Y'
								? dayjs(row?.fromDate).isAfter(base)
									? dayjs(row?.fromDate).format('YYYYMMDD')
									: base.format('YYYYMMDD')
								: DEFAULT_END_DATE;
						setCellValueSafe(g, rowIndex, 'toDate', nextToDate);
					});
				} else if (dataField === 'toDate') {
					defer(g => {
						const nextDelYn = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD')) ? 'N' : 'Y';
						setCellValueSafe(g, rowIndex, 'delYn', nextDelYn);
					});
				}
			},
			[centerOptionList],
		);

		// 조회 함수
		const handleSearch = useCallback(
			async (searchParams?: any) => {
				if (!gridRef.current) return;
				const formValues = form.getFieldsValue();
				if (!formValues.effectiveDate) {
					showAlert(null, '적용일자를 선택해주세요.');
					return;
				}
				setIsGridLoading(true);

				const params = {
					ordGrp: form.getFieldValue('ordGrp'),
					effectiveDate: dayjs(form.getFieldValue('effectiveDate'))?.format('YYYYMMDD'),
					pr1Dccode: form.getFieldValue('pr1Dccode'),
					pr2Dccode: form.getFieldValue('pr2Dccode'),
				};
				setSearchParams(searchParams ?? params);

				try {
					const res = await apiGetDcOrdGrpListByPrDccode(searchParams ?? params);
					if (res.statusCode === 0) {
						const data = res.data;
						const tempData = data.map((item: any) => ({
							...item,
							rowStatus: 'R',
							deliveryDccode2: item.deliveryDccode === item.pr1Dccode ? item.pr2Dccode : item.pr1Dccode,
							deliveryDcname2: item.deliveryDccode === item.pr1Dccode ? item.pr2Dcname : item.pr1Dcname,
							initialDelYn: item.delYn === 'Y' ? true : false,
						}));
						gridRef.current?.setGridData(tempData);
						setGridData(tempData);
					}
				} finally {
					setIsGridLoading(false); // ← 조회 끝
				}
			},
			[form, searchParams],
		);

		const titleFunc = {
			searchYn: () => {
				handleSearch();
			},
			// refresh: handleRefresh,
		};

		// 이벤트 처리
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid) return;

			// grid.bind('cellClick', handleCellClick); // 셀 클릭
			grid.bind('cellEditBegin', handleCellEditBegin); // 편집 제어
			grid.bind('cellEditEnd', handleCellEditEnd); // 다른 컬럼 동기화 처리

			return () => {
				if (grid?.unbind) {
					// grid.unbind('cellClick');
					grid.unbind('cellEditBegin');
					grid.unbind('cellEditEnd');
				}
			};
		}, []);

		useEffect(() => {
			if (!setupPopupGridData?.length) return;
			if (gridRef.current) {
				// initialDelYn 키 추가 처리
				const tempData = setupPopupGridData.map((item: any) => ({
					...item,
					initialDelYn: item.delYn === 'Y' ? true : false,
				}));
				gridRef.current.setGridData(tempData);
				setGridData(tempData);
			}
			// 전체 기간 유효성 검사
			validateAllPeriod({ isShowAlert: true });
			setTimeout(() => {
				setSearchParams({
					ordGrp: form.getFieldValue('ordGrp'),
					effectiveDate: dayjs(form.getFieldValue('effectiveDate'))?.format('YYYYMMDD'),
					pr1Dccode: form.getFieldValue('pr1Dccode'),
					pr2Dccode: form.getFieldValue('pr2Dccode'),
				});
			}, 300);
		}, [setupPopupGridData]);

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name="플랫폼 주문유형 설정" func={titleFunc} />
				{/* 조회 컴포넌트 */}
				<SearchForm form={form} initialValues={{}} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-4">
							{/* 주문그룹 */}
							<li>
								<SelectBox
									label={'주문그룹'}
									name={'ordGrp'}
									options={platformOrderTypeCodeList}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									disabled={true}
								/>
							</li>
							{/* FW 센터 */}
							<li>
								<SelectBox
									label={'FW 센터'}
									name={'pr1Dccode'}
									options={fwCenterList}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									disabled={true}
								/>
							</li>
							{/* FO 센터 */}
							<li>
								<SelectBox
									label={'FO 센터'}
									name={'pr2Dccode'}
									options={foCenterList}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									disabled={true}
								/>
							</li>
							{/* 적용일자 */}
							<li>
								<Datepicker label={'적용일자'} name={'effectiveDate'} />
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				{/* 그리드 영역 */}
				<AGrid dataProps="">
					<div style={{ position: 'relative' }}>
						<GridTopBtn gridBtn={gridBtn} totalCnt={gridData?.length} />
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						<GridLoading isLoading={isGridLoading} />
					</div>
				</AGrid>
				{/* 버튼 영역 */}
				<ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
				</ButtonWrap>
			</>
		);
	},
);

export default MsCenterDistrictPlatformOrderTypeSetupPopup;
