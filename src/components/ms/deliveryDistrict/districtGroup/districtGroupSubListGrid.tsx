/*
 ############################################################################
 # FiledataField	: districtGroupSubListGrid.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 탭 대표POP 서브 그리드
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

// Util
import { validateDistrictGroupPop } from '@/components/ms/deliveryDistrict/districtGroup/validations';
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
import dateUtils from '@/util/dateUtil';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import DistrictGroupSubListGridPopup from './DistrictGroupSubListGridPopup';

// Types
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiPostSaveGroupXPopList, apiPostgetDeleteGroupXPopHjdongImpact } from '@/api/ms/apiMsDeliveryDistrict';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface IDistrictGroupSubListGridProps {
	gridData: any[];
	gridRef: React.RefObject<any>;
	selectablePopList: any[]; // 그리드에서 선택 가능한 POP 리스트
	selectMasterGridRow: any; // 선택된 메인 그리드 행 데이터
	onRequestSubGridList: () => Promise<void>; // 서브그리드 저장 후 재요청 함수
	tabSearchConditions: any; // 조회 조건 (대표 POP 추가/삭제/저장 오늘 날짜 아닌경우 막기위해 필요)
}

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
}

// 상수 정의
const GRID_UPDATE_DELAY = 100;
const REFLECTION_SCHEDULE_MAX_DAYS = 3;
const EDITABLE_NEW_ROW_FIELDS = [
	'popNo', // 대표POP번호
	'popName', // 대표POP명
	// 'fromHour', // 시작시간
	// 'toHour', // 종료시간
	'fromDate', // 적용시작일자
	// 'baseYn', // 기본 대표 POP
] as const;
const UNEDITABLE_NEW_ROW_FIELDS = ['toDate'] as const;
const DEFAULT_END_DATE = '29991231';

const DistrictGroupSubListGrid = ({
	gridData,
	gridRef,
	selectablePopList,
	selectMasterGridRow,
	onRequestSubGridList,
	tabSearchConditions,
}: IDistrictGroupSubListGridProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 시작시간 종료시간 설정 팝업
	const DistrictGroupSubListGridPopupRef = useRef<any>(null);

	// State 관리
	const [gridKey, setGridKey] = useState(0);
	const [backupGridData, setBackupGridData] = useState<any[]>([]);
	const [popupGridData, setPopupGridData] = useState<any[]>([]);

	// 그리드 기본 설정
	const gridProps = useMemo(() => {
		return {
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: true, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			// selectionMode: 'multipleRows', // (버전별) 다중행 선택 허용
			enableCellMerge: true, // 셀 병합 기능 활성화
		};
	}, []);

	// 삭제여부 옵션 리스트 (메모이제이션)
	const delYnOptions = useMemo(
		() => getCommonCodeList('DEL_YN')?.filter(code => !['R', 'H'].includes(code.comCd)) || [],
		[],
	);

	const isButtonDisabled = useMemo(() => {
		return (
			!selectMasterGridRow || // 상위 그리드 행 선택시 데이터가 없을때
			selectMasterGridRow.rowStatus === 'I' || // 상위 그리드 행 선택 시 I 일때
			!selectablePopList?.length || // 선택 해야할 pop 리스트가 없을 때
			selectMasterGridRow?.initialDelYn === true // 상위 그리드 행이 처음부터 중단 상태일 때
			// || selectMasterGridRow?.delYn === 'Y'  // 상위 그리드 행이 삭제 상태일 때
		);
	}, [selectMasterGridRow, selectablePopList]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 그리드 버튼 설정
	const gridBtn = useMemo((): GridBtnPropsType => {
		// // 저장 로직 (전제조건, 유효성검사, 자동변경 처리)

		// 전제조건 (이벤트 입력에서 자동처리 )
		// 1. 기존행이 0개 일 때 신규행의 시작일은 최소일자로 고정 처리 (마스터 fromDate 기준 or 오늘+3 부터)
		// 2. 다른 행끼리의 시작일자, 종료일자 기간은 겹치면 안되고,
		//    모든행의 연속기간은 오늘+3 ~ 29991231 사이에 빈 기간이 존재하면 안된다
		// 3. 기존행의 시작일(fromDate)이 D+3 부터인 행은 1개만 존재 가능하다
		//    (D+3 부터인 행이 (R) 상태일때 추가하려고 하면 삭제 후 진행하도록 처리)

		// 추가 버튼 클릭 시 막는 처리
		// 1. 기존행의 시작일이 D+3 인 행이 (R) 로 1개 존재 시 추가 처리 막기
		//     (fromDate가 오늘+3일(포함) 이후 이면서 toDate 가 29991231 이면)
		//     (1개 삭제 후 등록하도록 얼럿메시지 처리)

		// 유효성 검사 (자동처리 전)
		// 1. (체크리스트 데이터 기준)필수값 유효성 검사 함수
		// 2. 신규행 끼리 기간이 겹치면 얼럿 메시지 띄우기
		// 3. 신규행 추가 시 같은 pop 번호로 기간이 겹치면 얼럿 메시지 띄우기

		// 자동 변경 처리 리스트
		// (자동 처리 로직이 처리되었으면 얼럿메시지 띄우기, 없으면 다음 유효성 검사 처리)
		// (삭제 될 행 조건 : fromDate 가 오늘+3일(포함) 이후 이면서 toDate 가 29991231 이 아닌 경우는 삭제 행)
		// (삭제 될 행은 제외하고 기존행(R & U)과 신규행(I)이 겹치지 않고 연속성을 가지고,
		//  오늘+3 ~ 29991231 사이에 빈 기간이 존재하지 않으면 자동 변경 로직은 스킵 처리)
		// 1. 기존 데이터 리스트 와 신규 데이터 적용시작일자 - 적용종료일자가 겹칠 때
		//    1-1. 겹치는 기존 데이터가 rowStatus === 'R' && delYn === 'Y' && fromDate 가 오늘+3일 이전인 경우
		//          신규 데이터의 fromDate 를 겹치는 기존데이터의 toDate + 1 로 변경 처리
		//    1-2. 겹치는 기존 데이터가 rowStatus === 'R" && delYn === 'N' && fromDate 가 오늘+3일 이전인 경우
		//          기존 데이터 종료일자 = 신규데이터 적용시작일 - 1
		//          (다만! 오늘날짜 + 2 일 보다 이전일때는 오늘날짜 + 2 일로 변경)
		//          (기존 데이터 dateRangeKey 가 같은 행들 일괄 적용)
		// 2. 삭제될 행 (수정행의 fromDate 가 D+3 일 이후인 경우, toDate 가 29991231 인 경우) 제외하고
		//    기존행(R & U) 의 fromDate 를 정렬하고 맨 마지막 행의 toDate 가 29991231 이 아니라면
		//    그 행의 toDate -> 29991231 로 변경 처리

		// 유효성 검사 (자동처리 후)
		// 1. 삭제 조건 행 제거 후, 나머지 행들이 기간의 연속성을 가지는지 체크
		//    (오늘+3 ~ 29991231 사이에 빈 기간이 존재하면 안된다)

		const FORMAT = 'YYYYMMDD';
		const today = dayjs().startOf('day');
		const todayPlus2 = today.add(2, 'day');
		const todayPlus3 = today.add(3, 'day');
		const endOfTime = dayjs(DEFAULT_END_DATE, FORMAT);

		const normYmd = (v: any) =>
			String(v ?? '')
				.replaceAll('-', '')
				.replaceAll('/', '');
		const ymd = (v: any) => dayjs(normYmd(v), FORMAT, true);

		// rowStatus 감지 함수
		const getAllGridDataWithStatus = (grid: any) => {
			const data: any[] = grid.getGridData?.() || [];
			return data.map((item, rowIndex) => ({
				...item,
				rowIndex,
				rowStatus: getRowStatusByIndex(grid, rowIndex), // 'I' | 'U' | 'D' | 'R'
			}));
		};

		// (삭제 될 행 조건)
		// fromDate >= 오늘+3(포함) AND toDate != 29991231  => “삭제될 행”으로 보고 자동조정/연속성 체크에서 제외
		const isDeleteRow = (r: any) => {
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

		// 유효성 검사 (자동처리 전)
		// 1. (체크리스트 데이터 기준)필수값 유효성 검사 함수
		// 2. 신규행 끼리 기간이 겹치면 얼럿 메시지 띄우기
		// 3. 신규행 추가 시 같은 pop 번호로 기간이 겹치면 얼럿 메시지 띄우기
		const validateBeforeAutoDateAdjust = () => {
			const grid = gridRef.current;
			if (!grid) return;

			// 1-1) 변경 + 체크된 행 있는지 확인
			const checkedItems = grid.getChangedData({
				validationYn: false, // or true (유효성 검증 포함 여부)
				andCheckedYn: true, // 변경 + 체크된 행만
			});
			if (!checkedItems || checkedItems.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_020'));
				return;
			}

			// 1-2) 필수값 유효성 검사
			if (!grid.validateRequiredGridData()) {
				return false;
			}

			// 2) 신규행 끼리 기간이 겹치면 얼럿 메시지 띄우기
			const newRows = checkedItems.filter((r: any) => r.rowStatus === 'I');
			for (const newRow of newRows) {
				const nFrom = ymd(newRow.fromDate);
				const nTo = ymd(newRow.toDate);
				if (!nFrom.isValid() || !nTo.isValid()) continue;

				for (const newRow2 of newRows) {
					if (newRow2._$uid === newRow._$uid) continue;
					const nFrom2 = ymd(newRow2.fromDate);
					const nTo2 = ymd(newRow2.toDate);
					if (!nFrom2.isValid() || !nTo2.isValid()) continue;

					const noOverlap = nTo.isBefore(nFrom2, 'day') || nTo2.isBefore(nFrom, 'day');
					if (noOverlap) continue;

					showAlert(null, '신규행 끼리 기간이 겹칩니다.');
					return false;
				}
			}

			// 3) 신규행 추가 시 같은 pop 번호로 기간이 겹치면 얼럿 메시지 띄우기
			const allGridData = getAllGridDataWithStatus(grid);

			// 기존 데이터 (신규행 제외, 삭제될 행 제외)
			const existingRows = allGridData.filter((r: any) => r.rowStatus !== 'I' && !isDeleteRow(r));

			// 신규행 vs 기존행 비교
			for (const newRow of newRows) {
				const nFrom = ymd(newRow.fromDate);
				const nTo = ymd(newRow.toDate);
				if (!nFrom.isValid() || !nTo.isValid()) continue;

				// popNo가 없으면 스킵
				if (!newRow.popNo) continue;

				for (const existingRow of existingRows) {
					const eFrom = ymd(existingRow.fromDate);
					const eTo = ymd(existingRow.toDate);
					if (!eFrom.isValid() || !eTo.isValid()) continue;

					// 같은 popNo인 경우만 체크
					if (newRow.popNo !== existingRow.popNo) continue;

					// 기간 겹침 체크
					const noOverlap = nTo.isBefore(eFrom, 'day') || eTo.isBefore(nFrom, 'day');
					if (noOverlap) continue;

					showAlert(
						null,
						`대표 POP 번호 '${newRow.popNo}'의 기간이 기존 데이터와 겹칩니다.\n` +
							`신규: ${nFrom.format('YYYY-MM-DD')} ~ ${nTo.format('YYYY-MM-DD')}\n` +
							`기존: ${eFrom.format('YYYY-MM-DD')} ~ ${eTo.format('YYYY-MM-DD')}`,
					);
					return false;
				}
			}

			return true; // 모든 검증 통과
		};

		// 유효성 검사 (자동처리 후)
		// 1. 삭제 조건 행 제거 후, 나머지 행들이 기간의 연속성을 가지는지 체크
		//    (오늘+3 ~ 29991231 사이에 빈 기간이 존재하면 안된다)
		const validateAfterAutoDateAdjust = async () => {
			const grid = gridRef.current;
			if (!grid) return false;

			const allGridData = getAllGridDataWithStatus(grid);
			const filteredNotDeleteRows = allGridData.filter(r => !isDeleteRow(r));
			const filteredDeleteRows = allGridData.filter(r => isDeleteRow(r));

			// 삭제 가능 불가능 판별 api 호출
			if (filteredDeleteRows.length > 0) {
				try {
					const deleteGroupXPopHjdongImpactResponse = await apiPostgetDeleteGroupXPopHjdongImpact({
						dccode: selectMasterGridRow?.dccode,
						dlvgroupId: selectMasterGridRow?.dlvgroupId,
						popList: filteredDeleteRows,
					});
					if (deleteGroupXPopHjdongImpactResponse?.statusCode === 0) {
						if (deleteGroupXPopHjdongImpactResponse?.data?.nonDeletableSerialkeys.length > 0) {
							const filteredDeleteRowsForAlert = filteredDeleteRows.filter(r =>
								deleteGroupXPopHjdongImpactResponse?.data?.nonDeletableSerialkeys.includes(r.serialkey),
							);
							showAlert(
								null,
								`이미 권역에 등록된 대표 POP 가 \n 존재하여 삭제 불가능한 POP가 \n 존재합니다.\n${filteredDeleteRowsForAlert
									.map(r => `[${r.popNo}]${r.popName}`)
									.join('\n')}`,
							);
							return false;
						}
					} else {
						throw new Error('삭제 가능 불가능 판별 api 호출 중 오류가 발생했습니다.');
					}
				} catch (error) {
					//console.warn(error);
					return false;
				}
			}

			// 삭제 허용 로직
			if (filteredNotDeleteRows.length === 0) {
				return true;
			}

			// 메인 그리드 fromDate(오늘+3 보다 작을땐 오늘+3, 크면 그대로) 메인그리드 toDate 기간이 가득 차는지 체크
			const isValid = validateDistrictGroupPop(
				filteredNotDeleteRows,
				dayjs(selectMasterGridRow?.fromDate, 'YYYYMMDD'),
				dayjs(selectMasterGridRow?.toDate, 'YYYYMMDD'),
			);

			return isValid;
		};

		// 자동 변경 처리 리스트
		// (자동 처리 로직이 처리되었으면 얼럿메시지 띄우기, 없으면 다음 유효성 검사 처리)
		// (삭제 될 행 조건 : fromDate 가 오늘+3일(포함) 이후 이면서 toDate 가 29991231 이 아닌 경우는 삭제 행)
		// (삭제 될 행은 제외하고 기존행(R & U)과 신규행(I)이 겹치지 않고 연속성을 가지고,
		//  오늘+3 ~ 29991231 사이에 빈 기간이 존재하지 않으면 자동 변경 로직은 스킵 처리)
		// 1. 기존 데이터 리스트 와 신규 데이터 적용시작일자 - 적용종료일자가 겹칠 때
		//    1-1. 겹치는 기존 데이터가 rowStatus === 'R' && delYn === 'Y' && fromDate 가 오늘+3일 이전인 경우
		//          신규 데이터의 fromDate 를 겹치는 기존데이터의 toDate + 1 로 변경 처리
		//    1-2. 겹치는 기존 데이터가 rowStatus === 'R" && delYn === 'N' && fromDate 가 오늘+3일 이전인 경우
		//          기존 데이터 종료일자 = 신규데이터 적용시작일 - 1
		//          (다만! 오늘날짜 + 2 일 보다 이전일때는 오늘날짜 + 2 일로 변경)
		//          (기존 데이터 dateRangeKey 가 같은 행들 일괄 적용)
		// 2. 삭제될 행 (수정행의 fromDate 가 D+3 일 이후인 경우, toDate 가 29991231 인 경우) 제외하고
		//    기존행(R & U) 의 fromDate 를 정렬하고 맨 마지막 행의 toDate 가 29991231 이 아니라면
		//    그 행의 toDate -> 29991231 로 변경 처리
		const applyAutoDateAdjust = () => {
			const grid = gridRef.current;
			if (!grid) return false;

			const rowIdField = (grid.getProp && grid.getProp('rowIdField')) || grid.props?.gridProps?.rowIdField || '_$uid';

			const allData: any[] = getAllGridDataWithStatus(grid);
			let hasAdjustment = false; // 자동 조정 발생 여부

			// 신규행
			const newRows = allData.filter(r => r.rowStatus === 'I');
			// 기존행(R & U)- 삭제될 행 제외
			const tempExistingRows = allData.filter(r => r.rowStatus !== 'I');
			const existingRows = allData.filter(r => r.rowStatus !== 'I' && !isDeleteRow(r));

			// (스킵 조건)
			// 1. 삭제될 행 제외하고, 기존(R&U)+신규(I)가 겹치지 않고 “연속성”이면서
			// 2. 오늘+3 ~ 29991231 사이에 빈 기간이 존재하지 않으면 자동 변경 로직은 스킵 처리
			const active = [...existingRows, ...newRows]
				.map(r => ({ r, from: ymd(r.fromDate), to: ymd(r.toDate) }))
				.filter(x => x.from.isValid() && x.to.isValid())
				.sort((a, b) => a.from.diff(b.from));

			if (active.length > 0) {
				const coversFrom = active[0].from.isSameOrBefore(todayPlus3, 'day');
				const coversTo = active[active.length - 1].to.isSame(endOfTime, 'day');

				let ok = true;
				for (let i = 0; i < active.length - 1; i++) {
					const cur = active[i];
					const next = active[i + 1];

					// 겹치면 실패
					if (!cur.to.isBefore(next.from, 'day')) {
						ok = false;
						break;
					}
					// 연속 아니면(= 빈 기간) 실패
					if (!cur.to.add(1, 'day').isSame(next.from, 'day')) {
						ok = false;
						break;
					}
				}

				if (coversFrom && coversTo && ok) {
					return false; // 자동 변경 스킵
				}
			}

			// 1. 기존 데이터 리스트 와 신규 데이터 적용시작일자 - 적용종료일자가 겹칠 때
			const keyOf = (row: any) => row.dateRangeKey || `${normYmd(row.fromDate)}${normYmd(row.toDate)}`;
			// dateRangeKey 그룹 맵(기존행만)
			const existingByKey = new Map<string, any[]>();
			for (const row of existingRows) {
				const key = keyOf(row);
				if (!existingByKey.has(key)) existingByKey.set(key, []);
				existingByKey.get(key)!.push(row);
			}

			// 비교 대상 "기존 R행"만 별도 추출 (주석 조건이 rowStatus==='R'로 명시됨)
			const existingR = existingRows.filter(r => r.rowStatus === 'R');

			for (const newRow of newRows) {
				let nFrom = ymd(newRow.fromDate);
				const nTo = ymd(newRow.toDate);
				if (!nFrom.isValid() || !nTo.isValid()) continue;

				for (const ex of existingR) {
					const eFrom = ymd(ex.fromDate);
					const eTo = ymd(ex.toDate);
					if (!eFrom.isValid() || !eTo.isValid()) continue;

					// fromDate가 오늘+3 이전인 기존행만
					if (!eFrom.isBefore(todayPlus3, 'day')) continue;

					const noOverlap = eTo.isBefore(nFrom, 'day') || nTo.isBefore(eFrom, 'day');
					if (noOverlap) continue;

					//    1-1. 겹치는 기존 데이터가 rowStatus === 'R' && delYn === 'Y' && fromDate 가 오늘+3일 이전인 경우
					//          신규 데이터의 fromDate 를 겹치는 기존데이터의 toDate + 1 로 변경 처리
					// 기존 R + delYn=Y
					if (ex.delYn === 'Y') {
						let newStart = eTo.add(1, 'day');

						// 신규 start가 신규 to를 넘어가면(역전 방지) start=to로 보정
						if (newStart.isAfter(nTo, 'day')) newStart = nTo;

						const updatedNew = {
							...newRow,
							fromDate: newStart.format(FORMAT),
						};
						grid.updateRowsById(updatedNew);
						grid.addCheckedRowsByValue?.(rowIdField, updatedNew[rowIdField]);

						hasAdjustment = true;
						// 신규 start가 바뀌었으니 이후 비교는 갱신된 start 기준으로 계속
						nFrom = newStart;
						continue;
					}

					//    1-2. 겹치는 기존 데이터가 rowStatus === 'R" && delYn === 'N' && fromDate 가 오늘+3일 이전인 경우
					//          기존 데이터 종료일자 = 신규데이터 적용시작일 - 1
					//          (다만! 오늘날짜 + 2 일 보다 이전일때는 오늘날짜 + 2 일로 변경)
					//          (기존 데이터 dateRangeKey 가 같은 행들 일괄 적용)
					// 기존 R + delYn=N
					if (ex.delYn === 'N') {
						const groupKey = keyOf(ex);
						const group = existingByKey.get(groupKey) || [];

						let newOldTo = nFrom.subtract(1, 'day');
						if (newOldTo.isBefore(todayPlus2, 'day')) newOldTo = todayPlus2;

						const newToStr = newOldTo.format(FORMAT);

						for (const row of group) {
							const updated = {
								...row,
								toDate: newToStr,
								rowStatus: row.rowStatus === 'I' ? 'I' : 'U',
								// toDate가 MAX가 아니면 중단(Y)로 두는 게 일반적(저장 로직 delYn 기반)
								delYn: newToStr === DEFAULT_END_DATE ? 'N' : 'Y',
							};
							grid.updateRowsById(updated);
							grid.addCheckedRowsByValue?.(rowIdField, updated[rowIdField]);
						}

						hasAdjustment = true;
					}
				}
			}

			// 2. 삭제될 행 (수정행의 fromDate 가 D+3 일 이후인 경우, toDate 가 29991231 인 경우) 제외하고
			//    기존행(R & U) 의 fromDate 를 정렬하고 맨 마지막 행의 toDate 가 29991231 이 아니라면
			//    그 행의 toDate -> 29991231 로 변경 처리
			if (active.length > 0) {
				const lastRow = active[active.length - 1];
				if (!lastRow.to.isSame(endOfTime, 'day')) {
					const updated = {
						...lastRow.r,
						toDate: DEFAULT_END_DATE,
						delYn: 'N',
					};
					grid.updateRowsById(updated);
					grid.addCheckedRowsByValue?.(rowIdField, updated[rowIdField]);
					hasAdjustment = true;
				}
			}

			// // TODO:
			// // 기존 데이터는 dateRangeKey 기준 그룹핑
			// const existingByKey = new Map<string, any[]>();
			// existingRows.forEach(row => {
			// 	const key = row.dateRangeKey || `${row.fromDate}${row.toDate}`;
			// 	if (!existingByKey.has(key)) existingByKey.set(key, []);
			// 	existingByKey.get(key)!.push(row);
			// });

			// // 신규행마다 기존 그룹과의 관계 계산
			// newRows.forEach(newRow => {
			// 	const nFrom = dayjs(newRow.fromDate, FORMAT, true);
			// 	const nTo = dayjs(newRow.toDate, FORMAT, true);
			// 	if (!nFrom.isValid() || !nTo.isValid()) return;

			// 	existingByKey.forEach(group => {
			// 		if (!group.length) return;
			// 		const sample = group[0];
			// 		const eFrom = dayjs(sample.fromDate, FORMAT, true);
			// 		const eTo = dayjs(sample.toDate, FORMAT, true);
			// 		if (!eFrom.isValid() || !eTo.isValid()) return;

			// 		const noOverlap = eTo.isBefore(nFrom) || nTo.isBefore(eFrom);
			// 		if (noOverlap) return;

			// 		// 1-1. 기존 시작 < 신규 시작 → 기존 종료일 조정
			// 		if (eFrom.isBefore(nFrom)) {
			// 			let newOldTo = nFrom.subtract(1, 'day');

			// 			if (newOldTo.isBefore(todayPlus2)) {
			// 				newOldTo = todayPlus2;
			// 			}

			// 			if (newOldTo.isBefore(eFrom)) {
			// 				group.forEach(row => {
			// 					const updated = { ...row, delData: true };
			// 					grid.updateRowsById(updated);
			// 					grid.addCheckedRowsByValue?.(rowIdField, updated[rowIdField]);
			// 					hasAdjustment = true; //  조정 발생
			// 				});
			// 				return;
			// 			}

			// 			const newToStr = newOldTo.format(FORMAT);
			// 			group.forEach(row => {
			// 				const updated = {
			// 					...row,
			// 					toDate: newToStr,
			// 					rowStatus: row.rowStatus === 'I' ? 'I' : 'U',
			// 				};
			// 				grid.updateRowsById(updated);
			// 				grid.addCheckedRowsByValue?.(rowIdField, updated[rowIdField]);
			// 				hasAdjustment = true; //  조정 발생
			// 			});
			// 		}
			// 		// 1-2. 기존 시작일이 신규 시작일과 같거나 이후 → 기존 그룹 삭제(rowStatus = 'D')
			// 		else {
			// 			group.forEach(row => {
			// 				const updated = { ...row, delData: true };
			// 				grid.updateRowsById(updated);
			// 				grid.addCheckedRowsByValue?.(rowIdField, updated[rowIdField]);
			// 				hasAdjustment = true; //  조정 발생
			// 			});
			// 		}
			// 	});
			// });

			return hasAdjustment;
		};

		const getInitialValues = () => {
			const selectedDate = dayjs(selectMasterGridRow?.fromDate);
			// 기존 오늘+3일 -> 오늘 로 변경 처리
			const todayPlus3 = dayjs().add(3, 'day');
			const fromDate = selectedDate.isBefore(todayPlus3)
				? todayPlus3.format('YYYYMMDD')
				: selectedDate.format('YYYYMMDD');

			// 신규행은 신규행끼리 같은 날짜를 머지하도록 처리
			const newDateRangeKey = `NEW_${fromDate}${dayjs(selectMasterGridRow?.toDate).format('YYYYMMDD')}`;
			return {
				popNo: '',
				popName: '',
				// fromHour: '',
				// toHour: '',
				// // TODO: 아래는 임시처리 원래는 위와 같이 처리해야함
				fromHour: '00:00',
				toHour: '23:59',
				fromDate: fromDate,
				// toDate: dayjs(selectMasterGridRow?.toDate).format('YYYYMMDD'), // 기존 로직 (상위 그리드 범위안 동작)
				toDate: dayjs(DEFAULT_END_DATE).format('YYYYMMDD'), // TODO: 백엔드 미적용으로 인한 임시처리
				baseYn: 'N',
				delYn: 'N',
				rowStatus: 'I',
				// dateRangeKey: newDateRangeKey,
				popFromDate: '',
				popToDate: '',
			};
		};

		const onSaveFn = () => {
			const checkedItems = gridRef.current.getChangedData({ validationYn: false });

			// TODO: (임시) 삭제는 백엔드에서 처리
			// (임시)백엔드 삭제조건 rowStatus === 'U' + fromDate >= today + 3 + delyn ==='Y'

			// 함수로 만들기
			// 신규, 수정, 삭제 구분하여 처리
			const insertItemList = checkedItems.filter((item: any) => item.rowStatus === 'I');

			const deleteItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && isDeleteRow(item));
			const updateItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && !isDeleteRow(item));

			// 기존 로직..
			// const updateItemList = checkedItems.filter(
			// 	(item: any) => item.rowStatus === 'U' && item.delData !== true,
			// );
			// const deleteItemList = checkedItems.filter(
			// 	(item: any) => item.rowStatus === 'U' && item.delData === true,
			// );
			// const updateItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && item.delYn === 'N');
			// const deleteItemList = checkedItems.filter((item: any) => item.rowStatus === 'U' && item.delYn === 'Y');

			// 저장 요청을 위한 시간 포맷 변환
			const mergeMasterList = [
				...insertItemList.map((item: any) => ({
					...item,
					fromHour: dateUtils.formatTimeToResponse(item.fromHour),
					toHour: dateUtils.formatTimeToResponse(item.toHour),
				})),
				...updateItemList.map((item: any) => ({
					...item,
					rowStatus: 'U',
					fromHour: dateUtils.formatTimeToResponse(item.fromHour),
					toHour: dateUtils.formatTimeToResponse(item.toHour),
				})),
				...deleteItemList.map((item: any) => ({
					...item,
					rowStatus: 'D',
					delYn: 'Y',
					fromHour: dateUtils.formatTimeToResponse(item.fromHour),
					toHour: dateUtils.formatTimeToResponse(item.toHour),
				})),
			];

			showConfirm(
				null,
				`${t('msg.MSG_COM_CFM_003')}\n 신규: ${insertItemList.length}개, \n수정: ${updateItemList.length}개, \n삭제: ${
					deleteItemList.length
				}개`,
				() => {
					apiPostSaveGroupXPopList({
						dccode: selectMasterGridRow?.dccode,
						dlvgroupId: selectMasterGridRow?.dlvgroupId,
						popList: mergeMasterList,
					})
						.then(res => {
							if (res?.statusCode === 0) {
								showMessage({
									content: t('msg.MSG_COM_SUC_003'),
									modalType: 'info',
								});
								// 서브 그리드 재요청 처리
								onRequestSubGridList();
							}
						})
						.catch(error => {
							// showAlert(null, '저장 중 오류가 발생했습니다.');
						});
				},
			);
		};

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'plus',
					initValues: getInitialValues(), // 기본 신규행 값
					callBeforeFn: () => {
						// 조회일자가 오늘일 경우만 행추가 가능
						if (
							tabSearchConditions?.effectiveDate &&
							dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day')
						) {
							const grid = gridRef.current;
							const allData = getAllGridDataWithStatus(grid).filter((r: any) => r.rowStatus !== 'I');

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

							// TODO: 임시 처리 로직 (1개의 신규행이 존재시 추가로 신규행 추가못하게 막는 처리)
							// 신규행은 1개 만 존재 가능 (1개 등록 후 1개 등록 하도록 유도하기)
							const newRowCount = getAllGridDataWithStatus(grid).filter((a: any) => a.rowStatus === 'I').length;
							if (newRowCount && newRowCount >= 1) {
								showAlert(null, '현재 신규행 저장 이후 추가로 진행 해주세요.');
								return true;
							}

							return false;
						} else {
							// 아닐땐 얼럿 띄우기
							showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 \n 입력/수정/삭제가 가능합니다.`);
							return true;
						}

						// // TODO: 기존 시간 개념이 존재 시 사용했던 로직.. 추후 재사용 가능성 있음
						// const grid = gridRef.current;
						// if (!grid) return false;

						// const allData = grid.getGridData?.() || [];

						// // NEW_ 로 표시한 신규행 개수
						// const newRowCount = allData.filter((a: any) => a.dateRangeKey?.includes('NEW_')).length;

						// // 이미 3개 있으면 더 이상 추가하지 않음
						// if (newRowCount >= 3) {
						// 	showAlert(null, '신규행은 최대 3개까지만 설정할 수 있습니다.');
						// 	return true;   // true 리턴 → GridTopBtn 이 addRow 실행 안 함
						// }

						// return false;    // false 리턴 → 정상적으로 plus(addRow) 진행
					},
				},
				{
					btnType: 'delete',
					isActionEvent: false, // 기본 deleteRowItems 자동 실행 막기
					callBackFn: () => {
						const grid = gridRef.current;
						if (!grid) return;
						// 1) 체크된 행 가져오기
						const checkedRows = grid.getCheckedRowItems?.() || [];
						if (!checkedRows.length) {
							// 필요하면 안내만 하고 종료 (기본 삭제가 꺼져 있으니 아무 일도 안 일어남)
							// showAlert(null, '삭제할 행을 선택해 주세요.');
							return;
						}
						// 2) 체크된 행 중 신규행(rowStatus === 'I')인 rowIndex 수집
						const newRowIndexes = checkedRows
							.map((row: any) => {
								const rowIndex = row.rowIndex ?? row.item?.rowIndex;
								if (rowIndex == null) return null;
								const rowItem = grid.getItemByRowIndex?.(rowIndex);
								return rowItem?.rowStatus === 'I' ? rowIndex : null;
							})
							.filter((idx: number | null) => idx != null) as number[];
						// 3) 신규행이 없으면 아무것도 삭제하지 않고 종료
						if (!newRowIndexes.length) {
							showAlert(null, '신규행만 삭제할 수 있습니다.');
							return;
						}
						// 4) 신규행들만 삭제 (인덱스 꼬임 방지: 내림차순)
						newRowIndexes
							.sort((a, b) => b - a)
							.forEach(idx => {
								grid.removeRow?.(idx);
							});
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
					btnType: 'save',
					callBackFn: async () => {
						// 1) 유효성 검사 (자동처리 전)
						const isValidBeforeAuthDateAdjust = validateBeforeAutoDateAdjust();
						if (!isValidBeforeAuthDateAdjust) {
							return;
						}
						// 2 자동 변경 처리
						const hasAdjustment = applyAutoDateAdjust();
						if (hasAdjustment) {
							showAlert(
								'기간 조정 안내',
								'동일한 조건의 대표 POP가 있어 기간을 자동으로 조정했습니다.\n변경된 내용을 확인한 후 다시 저장 버튼을 눌러주세요.',
							);
							return;
						}
						// 3) 유효성 검사 (자동처리 후)
						const isValidAfterAuthDateAdjust = await validateAfterAutoDateAdjust();
						if (!isValidAfterAuthDateAdjust) {
							return;
						}
						// 4) 저장 처리리
						return onSaveFn();
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
	}, [
		selectablePopList,
		selectMasterGridRow,
		gridRef,
		onRequestSubGridList,
		backupGridData,
		popupGridData,
		tabSearchConditions,
	]);

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
				// 기준 fromDate (상위 그리드)
				const masterFrom = dayjs(selectMasterGridRow?.fromDate, 'YYYYMMDD', true);

				// 오늘 기준 최소 가능일
				const baseMinDate = dayjs().add(offsetDays, 'day');

				// minDate 계산: 상위 fromDate 와 오늘+offset 중 더 늦은 날짜
				let minDate = baseMinDate;
				let useMasterFromMessage = false; // masterFrom 기준으로 잡았는지 여부

				if (masterFrom.isValid() && masterFrom.isAfter(baseMinDate)) {
					minDate = masterFrom;
					useMasterFromMessage = true; // 이때만 다른 메시지 사용
				}
				const maxDate = dayjs(selectMasterGridRow?.toDate ?? DEFAULT_END_DATE, 'YYYYMMDD');

				// 2. 최소 날짜 체크
				if (inputDate.isBefore(minDate)) {
					let message: string;

					if (useMasterFromMessage) {
						// masterFrom 으로 minDate 결정된 경우
						message = `${isToDate ? '적용종료일자' : '적용시작일자'}는 ${minDate.format(
							'YYYY-MM-DD',
						)} 이후 일자를 선택 할 수 있습니다.`;
					} else {
						// 기존 로직 유지
						message = `${isToDate ? '적용종료일자' : '적용시작일자'}는 오늘 기준 +${
							offsetDays + 1
						}일 이후 일자를 선택 할 수 있습니다.`;
					}
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

				// // pop 리스트의 fromDate 보다 적으면 안된다.
				// if (item.popFromDate && inputDate.isBefore(dayjs(item.popFromDate, 'YYYYMMDD'))) {
				// 	return { validate: false, message: `적용시작일자는 ${item?.popName}(${item?.popNo})의 적용시작일자 이후여야 합니다.` };
				// }

				// // pop 리스트의 toDate 보다 크면 안된다.
				// if (item.popToDate && inputDate.isAfter(dayjs(item.popToDate, 'YYYYMMDD'))) {
				// 	return { validate: false, message: `적용종료일자는 ${item?.popName}(${item?.popNo})의 적용종료일자 이전여야 합니다.` };
				// }

				// 현재 pop 리스트 아이템 값 있을 때 아래 조건 처리
				if (item.popNo && item.popName) {
					const checkItem = selectablePopList.find(pop => pop.popNo === item.popNo && pop.popName === item.popName);

					// checkItem.fromDate <= 현재행 fromDate && 현재행 toDate <= checkItem.toDate
					const inRange =
						dayjs(checkItem?.fromDate, 'YYYYMMDD').isSameOrBefore(inputDate) &&
						inputDate.isSameOrBefore(dayjs(checkItem?.toDate, 'YYYYMMDD'));

					if (!checkItem || !inRange) {
						return {
							validate: false,
							message: `적용시작일자 또는 적용종료일자는 ${item?.popName}(${item?.popNo})의 적용시작일자 또는 적용종료일자 이후여야 합니다.`,
						};
					}
				}

				return { validate: true, message: '' };
			};
		},
		[t, selectMasterGridRow, selectablePopList],
	);

	// 그리드 컬럼 정의 (최적화)
	const gridCol = useMemo(() => {
		const columns = [
			{
				dataField: 'popNo',
				headerText: '대표POP번호',
				required: true,
				editable: true,
				dataType: 'code',
				minWidth: 100,
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					// list: selectablePopList,
					listFunction: function (rowIndex: number, _: any, rowObj: any, fieldName: string) {
						try {
							const toDayjs = (v: any) => {
								if (!v) return null;
								const s = String(v).replace(/-/g, '');
								const d = dayjs(s, 'YYYYMMDD', true);
								return d.isValid() ? d : null;
							};

							// 로직 변경되어 아래와 같이 처리리
							const rowObjFromDate = toDayjs(rowObj?.fromDate);
							const rowObjToDate = toDayjs(rowObj?.toDate);
							if (!rowObjFromDate || !rowObjToDate) return selectablePopList;

							// 날짜 범위: master.fromDate ≤ pop.fromDate AND pop.toDate ≤ master.toDate
							const filtered = selectablePopList.filter((pop: any) => {
								const popFrom = toDayjs(pop?.fromDate);
								const popTo = toDayjs(pop?.toDate);
								if (!popFrom || !popTo) return true;
								const fromOk = popFrom.isSame(rowObjFromDate) || popFrom.isBefore(rowObjFromDate);
								const toOk = popTo.isSame(rowObjToDate) || popTo.isAfter(rowObjToDate);
								return fromOk && toOk;
							});

							return filtered;
						} catch (e) {
							return selectablePopList;
						}
					},
					keyField: 'popNo',
					valueField: 'popNo',
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
			},
			{
				dataField: 'popName',
				headerText: '대표POP명',
				required: true,
				editable: true,
				dataType: 'code',
				minWidth: 100,
				editRenderer: {
					type: 'ComboBoxRenderer',
					autoCompleteMode: true,
					autoEasyMode: true,
					showEditorBtnOver: true,
					keyField: 'popName',
					valueField: 'popName',
					listFunction: function (rowIndex: number, _val: any, rowObj: any, fieldName: string) {
						try {
							const toDayjs = (v: any) => {
								if (!v) return null;
								const s = String(v).replace(/-/g, '');
								const d = dayjs(s, 'YYYYMMDD', true);
								return d.isValid() ? d : null;
							};

							// 로직 변경되어 아래와 같이 처리리
							const rowObjFromDate = toDayjs(rowObj?.fromDate);
							const rowObjToDate = toDayjs(rowObj?.toDate);
							if (!rowObjFromDate || !rowObjToDate) return selectablePopList;

							// 날짜 범위: master.fromDate ≤ pop.fromDate AND pop.toDate ≤ master.toDate
							const filtered = selectablePopList.filter((pop: any) => {
								const popFrom = toDayjs(pop?.fromDate);
								const popTo = toDayjs(pop?.toDate);
								if (!popFrom || !popTo) return true;
								const fromOk = popFrom.isSame(rowObjFromDate) || popFrom.isBefore(rowObjFromDate);
								const toOk = popTo.isSame(rowObjToDate) || popTo.isAfter(rowObjToDate);
								return fromOk && toOk;
							});

							return filtered;
						} catch (e) {
							return selectablePopList;
						}
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
			},
			{
				dataField: 'fromHour',
				headerText: '시작시간',
				required: true,
				editable: false, // 계속 수정 가능
				minWidth: 100,
				commRenderer: {
					type: 'time',
				},
				// styleFunction: function (
				// 	rowIndex: number,
				// 	columnIndex: number,
				// 	value: any,
				// 	headerText: string,
				// 	item: any,
				// ): string {
				// 	if (
				// 		handleCellEditBegin({
				// 			dataField: 'fromHour',
				// 			rowIndex: rowIndex,
				// 		})
				// 	) {
				// 		return 'isEdit';
				// 	} else {
				// 		gridRef.current.removeEditClass(columnIndex);
				// 		return '';
				// 	}
				// },
			},
			{
				dataField: 'toHour',
				headerText: '종료시간',
				required: true,
				editable: false, // 계속 수정 가능
				minWidth: 100,
				commRenderer: {
					type: 'time',
				},
				// styleFunction: function (
				// 	rowIndex: number,
				// 	columnIndex: number,
				// 	value: any,
				// 	headerText: string,
				// 	item: any,
				// ): string {
				// 	if (
				// 		handleCellEditBegin({
				// 			dataField: 'toHour',
				// 			rowIndex: rowIndex,
				// 		})
				// 	) {
				// 		return 'isEdit';
				// 	} else {
				// 		gridRef.current.removeEditClass(columnIndex);
				// 		return '';
				// 	}
				// },
			},
			{
				dataField: 'fromDate',
				headerText: '적용시작일자',
				required: true,
				editable: true,
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				// cellMerge: true, // TODO: 추후 사용 가능
				// mergeRef: 'dateRangeKey', // TODO: 추후 사용 가능
				// mergePolicy: 'restrict', // TODO: 추후 사용 가능
				minWidth: 100,
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
				required: true,
				editable: true, // 계속 수정 가능
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				// cellMerge: true, // TODO: 추후 사용 가능
				// mergeRef: 'dateRangeKey', // TODO: 추후 사용 가능
				// mergePolicy: 'restrict', // TODO: 추후 사용 가능
				minWidth: 100,
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
					if (item?.initialDelYn === true) {
						gridRef.current.removeEditClass(columnIndex);
						return '';
					} else if (
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
				dataField: 'baseYn',
				headerText: '기본 대표 POP',
				required: false,
				editable: false,
				minWidth: 85,
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
				dataField: 'delData',
				headerText: '삭제플래그',
				dataType: 'boolean',
				visible: false,
				editable: false,
			},
			{
				dataField: 'initialDelYn',
				headerText: 'db 데이터 delYn 의 경우 처리 플래그',
				dataType: 'boolean',
				visible: false,
				editable: false,
			},
			{
				dataField: 'popFromDate',
				headerText: 'pop 적용 시작일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'popToDate',
				headerText: 'pop 적용 종료일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'childrenFromDate',
				headerText: 'pop 자식 적용 시작일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'childrenToDate',
				headerText: 'pop 자식 적용 종료일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'parentFromDate',
				headerText: 'pop 부모 적용 시작일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'parentToDate',
				headerText: 'pop 부모 적용 종료일자',
				dataType: 'code',
				visible: false,
				editable: false,
			},
		];
		return columns;
	}, [selectablePopList, delYnOptions, createDateValidator, selectMasterGridRow]);

	// 시작시간, 종료시간 팝업에서 변경된 데이터 현재 그리드에 업데이트 처리하기
	// (dateRangeKey 가 같은건 삭제 후 기존 배열 뒤에 붙이고, 기존 그리드에 해당 데이터 적용)
	const updatePopupGridToCurrentGrid = useCallback((popupGridData: any[]) => {
		const grid = gridRef.current;
		if (!grid || !popupGridData?.length) return;

		const rowIdField = (grid.getProp && grid.getProp('rowIdField')) || grid.props?.gridProps?.rowIdField || '_$uid';

		// 현재 그리드 데이터 + rowIndex 부여
		const allData: any[] =
			grid.getGridData?.()?.map((item: any, index: number) => ({
				...item,
				rowIndex: index,
				rowStatus: getRowStatusByIndex(grid, index),
			})) || [];

		// 대상 그룹 키
		const dateRangeKey = popupGridData[0]?.dateRangeKey;

		// 메인 그리드에서 해당 dateRangeKey 그룹만 추출
		const targetRows = allData.filter(row => row.dateRangeKey === dateRangeKey);

		// popup 데이터: 기존행(rowIndex 있음) / 신규행(rowIndex 없음) 분리
		const popupByRowIndex = new Map<number, any>();
		const newPopupRows: any[] = [];
		popupGridData.forEach(r => {
			if (r.rowIndex != null) {
				popupByRowIndex.set(r.rowIndex, r);
			} else {
				newPopupRows.push(r);
			}
		});

		// 1) 기존 그룹 중 popup에 남아 있는 행은 updateRowsById + 체크
		targetRows.forEach(row => {
			const popupRow = popupByRowIndex.get(row.rowIndex);
			if (!popupRow) return; // 삭제 대상은 아래에서 처리

			const updated = {
				...row,
				fromHour: popupRow.fromHour,
				toHour: popupRow.toHour,
				// 필요 시 다른 필드 동기화
				rowStatus: row.rowStatus === 'I' ? 'I' : 'U',
			};

			grid.updateRowsById(updated);
			const id = updated[rowIdField];
			if (id != null && grid.addCheckedRowsByValue) {
				grid.addCheckedRowsByValue(rowIdField, id);
			}
		});

		// 2) popup에 없는 기존 행(rowIndex 기준)은 실제 삭제(removeRow) 처리
		const deleteIndexes = targetRows
			.filter(row => !popupByRowIndex.has(row.rowIndex))
			.map(row => row.rowIndex)
			.filter((idx: number | undefined) => idx != null);

		if (deleteIndexes.length > 0 && grid.removeRow) {
			grid.removeRow(deleteIndexes);
		}

		// 3) popup 에서 rowIndex 없는 신규행은 addRow + 체크
		newPopupRows.forEach(r => {
			const newItem = {
				...r,
				rowStatus: 'I',
			};

			const beforeCount = grid.getRowCount?.() ?? 0;
			grid.addRow?.(newItem);

			const newIndex = (grid.getRowCount?.() ?? beforeCount + 1) - 1;
			const newRow = grid.getItemByRowIndex?.(newIndex);
			const id = newRow?.[rowIdField];
			if (id != null && grid.addCheckedRowsByValue) {
				grid.addCheckedRowsByValue(rowIdField, id);
			}
		});
	}, []);

	// // TODO:  추후 사용 가능
	// // 상수 정의 아래 정도에 추가
	// const makeDateRangeKey = (fromDate?: string, toDate?: string, isNew: boolean = false) => {
	// 	if (!fromDate || !toDate) return null;
	// 	return `${isNew ? 'NEW_' : ''}${fromDate}${toDate}`; // fromDate, toDate 둘 다 같을 때만 동일 키
	// };

	// 셀 클릭 이벤트 핸들러
	const handleCellClick = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, item } = event;
		const grid = gridRef.current;

		const allData =
			gridRef.current?.getGridData?.()?.map((item: any, index: number) => ({ ...item, rowIndex: index })) || [];

		if (!grid) return;

		// // 기존행의 경우 시간설정 팝업 불가 처리
		// if (!item.dateRangeKey.includes('NEW_')) {
		// 	return;
		// }

		// 적용시작시간, 종료시간 클릭 시 팝업 띄우기
		const hourFieldList = ['fromHour', 'toHour'];
		if (hourFieldList.includes(dataField)) {
			// 대표POP 번호 설정 안했을때
			if (!item.popNo) {
				showAlert(null, '대표POP 번호를 설정해주세요.');
				return;
			}
			// 대표POP 명 설정 안했을때
			if (!item.popName) {
				showAlert(null, '대표POP 명을 설정해주세요.');
				return;
			}

			// 선택한 행의 dateRangeKey 값이 같은 행들 찾기
			const sameDateRangeKeyList = allData.filter((a: any) => a.dateRangeKey === item?.dateRangeKey);
			// 같은 dateRangeKey 값이 같은 행들의 popNo, popName 이 빈값일때 팝업 띄우기
			for (const a of sameDateRangeKeyList) {
				if (!a?.popNo || !a?.popName) {
					showAlert(null, '같은 날짜의 대표POP 번호 또는 대표POP 명을 모두 설정해주세요.');
					return;
				}
			}

			if (sameDateRangeKeyList.length > 0) {
				setPopupGridData(sameDateRangeKeyList);
			}
			setTimeout(() => {
				DistrictGroupSubListGridPopupRef.current?.handlerOpen?.();
			}, 200);
		}
	}, []);

	// 편집 제어 이벤트 핸들러
	const handleCellEditBegin = useCallback((event: GridEvent) => {
		const { dataField, rowIndex, item } = event;
		const grid = gridRef.current;
		if (!grid) return true;
		if (dataField === 'baseYn') return false; // 기본 대표 POP 필드는 편집 불가

		const rowStatus = getRowStatusByIndex(grid, rowIndex);

		// 기존행이면서 delYn 이 'Y' 인 경우 선택 불가 처리 (적용필드: toDate, delYn)
		if (['toDate', 'delYn'].includes(dataField as any) && rowStatus === 'R' && item?.initialDelYn === true) {
			return false;
		}

		if (UNEDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I' ? false : true;
		}

		// 신규행에서만 편집 가능한 필드 체크
		if (EDITABLE_NEW_ROW_FIELDS.includes(dataField as any)) {
			return rowStatus === 'I';
		}

		return true;
	}, []);

	// 편집 완료 후 동기화 처리
	const handleCellEditEnd = useCallback(
		(event: any) => {
			const { dataField, rowIndex, value, item } = event;

			const allData =
				gridRef.current?.getGridData?.()?.map((item: any, index: number) => ({ ...item, rowIndex: index })) || [];

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

			// POP 관련 필드 편집 시 동기화
			if (dataField === 'popNo' || dataField === 'popName') {
				const selectedPop = selectablePopList.find(pop =>
					dataField === 'popNo' ? pop.popNo === value : pop.popName === value,
				);

				const toDayjs = (v: any) => {
					if (!v) return null;
					const s = String(v).replace(/-/g, '');
					const d = dayjs(s, 'YYYYMMDD', true);
					return d.isValid() ? d : null;
				};
				const rowFrom = toDayjs(item?.fromDate);
				const rowTo = toDayjs(item?.toDate);
				const filteredSelectedPopList = selectablePopList.filter((pop: any) => {
					const popFrom = toDayjs(pop?.fromDate);
					const popTo = toDayjs(pop?.toDate);
					if (!rowFrom || !rowTo || !popFrom || !popTo) return true;
					const fromOk = popFrom.isSame(rowFrom) || popFrom.isBefore(rowFrom); // popFrom <= rowFrom
					const toOk = popTo.isSame(rowTo) || popTo.isAfter(rowTo); // popTo >= rowTo
					return fromOk && toOk;
				});

				if (filteredSelectedPopList?.length > 0) {
					defer(g => {
						const row = getRowSafe(g, rowIndex);
						if (!row) return;

						// 현재 값과 완전히 동일하면 굳이 갱신 안 함
						if (row.popNo === selectedPop.popNo && row.popName === selectedPop.popName) {
							return;
						}

						// 현재 행의 fromDate 기간이 parentFromDate, childrenFromDate 기간 이내인지 확인 후 baseYn 값 재설정 처리
						let baseYn = 'N';
						if (row?.parentFromDate && row?.parentToDate) {
							const isInParentRange =
								dayjs(row?.fromDate).startOf('day').isSameOrBefore(dayjs(row?.parentToDate, 'YYYYMMDD')) &&
								dayjs(row?.fromDate).startOf('day').isSameOrAfter(dayjs(row?.parentFromDate, 'YYYYMMDD'));
							if (isInParentRange) {
								baseYn = 'Y';
							}
						}

						// rowIdField 구하기
						const rowIdField = (g.getProp && g.getProp('rowIdField')) || g.props?.gridProps?.rowIdField || '_$uid';

						// 기존 행을 복사해서 POP 관련 필드만 덮어쓴 새 객체
						const updatedRow = {
							...row,
							popNo: selectedPop.popNo,
							popName: selectedPop.popName,
							baseYn,
							// rowStatus 등 다른 필드도 필요하면 여기에서 함께 지정
							popFromDate: selectedPop.fromDate,
							popToDate: selectedPop.toDate,
							childrenFromDate: selectedPop.childrenFromDate ?? '',
							childrenToDate: selectedPop.childrenToDate ?? '',
							parentFromDate: selectedPop.parentFromDate ?? '',
							parentToDate: selectedPop.parentToDate ?? '',
						};

						// rowIdField 키를 반드시 포함해야 updateRowsById 가 동작
						const id = row[rowIdField];
						if (id == null) {
							// rowIdField 가 없으면 fallback 으로 setCellValue를 써야 하지만,
							// 가능하면 rowIdField 를 쓰도록 설정하는 게 좋습니다.
							return;
						}
						updatedRow[rowIdField] = id;

						// updateRowsById 로 한 번에 갱신 → 체크 상태는 그대로 유지됨
						g.updateRowsById(updatedRow);
					});
				} else {
					// selectedPop 이 없으면 빈값으로 초기화하는 쪽도 같은 방식으로 updateRowsById 사용
					defer(g => {
						const row = getRowSafe(g, rowIndex);
						if (!row) return;

						const rowIdField = (g.getProp && g.getProp('rowIdField')) || g.props?.gridProps?.rowIdField || '_$uid';

						const id = row[rowIdField];
						if (id == null) return;

						const updatedRow = {
							...row,
							popNo: '',
							popName: '',
							baseYn: 'N',
							popFromDate: '',
							popToDate: '',
						};
						updatedRow[rowIdField] = id;

						g.updateRowsById(updatedRow);
					});
				}
			}

			// // TODO: 추후 사용 가능
			// // 시간 필드 재검증
			// if (dataField === 'fromHour' || dataField === 'toHour') {
			// 	defer(g => {
			// 		const row = getRowSafe(g, rowIndex);
			// 		if (!row) return;
			// 		const otherField = dataField === 'fromHour' ? 'toHour' : 'fromHour';
			// 		if (row[otherField] && typeof g.validateCell === 'function') {
			// 			try {
			// 				g.validateCell(rowIndex, otherField);
			// 			} catch (e) {
			// 			}
			// 		}
			// 	});
			// }

			// 삭제여부 변경 시 종료일 처리
			else if (dataField === 'delYn') {
				defer(g => {
					const row = getRowSafe(g, rowIndex);
					const base = dayjs().add(2, 'day');
					const nextToDate =
						value === 'Y'
							? dayjs(row?.fromDate).isAfter(base)
								? dayjs(row?.fromDate).format('YYYYMMDD')
								: base.format('YYYYMMDD')
							: selectMasterGridRow?.toDate ?? DEFAULT_END_DATE;
					setCellValueSafe(g, rowIndex, 'toDate', nextToDate);

					// // TODO: 아래 주석은 추후 사용 가능
					// // 가져온 데이터는 dateRangeKey 값이 존재, 해당 값이 같으면 전부 변경처리
					// const sameDateRangeKeyList = allData.filter((a: any) => a.dateRangeKey === item?.dateRangeKey);
					// if (sameDateRangeKeyList.length > 0) {
					// 	sameDateRangeKeyList.forEach((a: any) => {
					// 			setCellValueSafe(g, a.rowIndex, 'toDate', nextToDate);
					// 			setCellValueSafe(g, a.rowIndex, 'delYn', value);
					// 			// dateRangeKey 값 재설정
					// 			const newDateRangeKey = makeDateRangeKey(a.fromDate, a.toDate, a.dateRangeKey.includes('NEW_'));
					// 			setCellValueSafe(g, a.rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	});
					// } else {
					// 	if (getCellValueSafe(g, rowIndex, 'toDate') !== nextToDate) {
					// 		setCellValueSafe(g, rowIndex, 'toDate', nextToDate);
					// 		// dateRangeKey 값 재설정
					// 		const newDateRangeKey = makeDateRangeKey(item?.fromDate, item?.toDate, item?.dateRangeKey.includes('NEW_'));
					// 		setCellValueSafe(g, rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	}
					// }
				});
			}
			// 종료일 변경 시 삭제여부 동기화
			else if (dataField === 'toDate') {
				defer(g => {
					const row = getRowSafe(g, rowIndex);
					const nextDelYn = dayjs(value).isSame(dayjs(DEFAULT_END_DATE, 'YYYYMMDD')) ? 'N' : 'Y';
					setCellValueSafe(g, rowIndex, 'delYn', nextDelYn);

					// // TODO: 아래 주석은 추후 사용 가능
					// // 가져온 데이터는 dateRangeKey 값이 존재, 해당 값이 같으면 전부 변경처리
					// const sameDateRangeKeyList = allData.filter((a: any) => a.dateRangeKey === item?.dateRangeKey);
					// if (sameDateRangeKeyList.length > 0) {
					// 	sameDateRangeKeyList.forEach((a: any) => {
					// 		setCellValueSafe(g, a.rowIndex, 'delYn', nextDelYn);
					// 		setCellValueSafe(g, a.rowIndex, 'toDate', value);
					// 		// dateRangeKey 값 재설정
					// 		const newDateRangeKey = makeDateRangeKey(
					// 			a.fromDate,
					// 			value,
					// 			a.dateRangeKey.includes('NEW_'),
					// 		);
					// 		setCellValueSafe(g, a.rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	});
					// } else {
					// 	if (getCellValueSafe(g, rowIndex, 'delYn') !== nextDelYn) {
					// 		setCellValueSafe(g, rowIndex, 'delYn', nextDelYn);
					// 		// dateRangeKey 값 재설정
					// 		const newDateRangeKey = makeDateRangeKey(
					// 			item?.fromDate,
					// 			value,
					// 			item?.dateRangeKey.includes('NEW_'),
					// 		);
					// 		setCellValueSafe(g, rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	}
					// }
				});
			}
			// 시작일 변경 시 병합키 재설정 처리 (신규행만 fromDate 변경 됨)
			else if (dataField === 'fromDate') {
				defer(g => {
					const row = getRowSafe(g, rowIndex);
					if (!row) return;

					// 만약 baseYn Y 가 설정된 부분 선택 시 parentFromDate, childrenFromDate 값 존재 시 비교 후 baseYn 값 재설정 처리
					if (row?.parentFromDate && row?.parentToDate) {
						const isInParentRange =
							dayjs(value).startOf('day').isSameOrBefore(dayjs(row?.parentToDate, 'YYYYMMDD')) &&
							dayjs(value).startOf('day').isSameOrAfter(dayjs(row?.parentFromDate, 'YYYYMMDD'));
						if (isInParentRange) {
							setCellValueSafe(g, rowIndex, 'baseYn', 'Y');
						} else {
							setCellValueSafe(g, rowIndex, 'baseYn', 'N');
						}
					}

					// // TODO: 아래 주석은 추후 사용 가능
					// const sameDateRangeKeyList = allData.filter((a: any) => a.dateRangeKey === item?.dateRangeKey);
					// if (sameDateRangeKeyList.length > 0) {
					// 	sameDateRangeKeyList.forEach((a: any) => {
					// 		setCellValueSafe(g, a.rowIndex, 'fromDate', value);
					// 		// dateRangeKey 값 재설정
					// 		const newDateRangeKey = makeDateRangeKey(
					// 			value,
					// 			a.toDate,
					// 			a.dateRangeKey.includes('NEW_'),
					// 		);
					// 		setCellValueSafe(g, a.rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	});
					// } else {
					// 	if (getCellValueSafe(g, rowIndex, 'fromDate') !== value) {
					// 		setCellValueSafe(g, rowIndex, 'fromDate', value);
					// 		// dateRangeKey 값 재설정
					// 		const newDateRangeKey = makeDateRangeKey(
					// 			value,
					// 			item?.toDate,
					// 			item?.dateRangeKey.includes('NEW_'),
					// 		);
					// 		setCellValueSafe(g, rowIndex, 'dateRangeKey', newDateRangeKey);
					// 	}
					// }
				});
			}
		},
		[selectablePopList],
	);

	//   그리드 이벤트 바인딩 (gridKey 변경 시 재바인딩)
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellClick', handleCellClick);
		grid.bind('cellEditBegin', handleCellEditBegin);
		grid.bind('cellEditEnd', handleCellEditEnd);

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellClick');
				grid.unbind('cellEditBegin');
				grid.unbind('cellEditEnd');
			}
		};
	}, [gridKey, handleCellClick, handleCellEditBegin, handleCellEditEnd]);

	//   gridData 변경 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid || !gridData) return;

		// 그리드 데이터 빈배열 시 가끔 동기화 안되는 버그 처리로직
		setGridKey(prev => prev + 1);

		// fromDate, toDate 기준으로 인접하게 정렬
		const sorted = [...gridData].sort((a: any, b: any) => {
			const aKey = `${a.fromDate || ''}${a.toDate || ''}`;
			const bKey = `${b.fromDate || ''}${b.toDate || ''}`;
			if (aKey < bKey) return -1;
			if (aKey > bKey) return 1;
			return 0;
		});

		const withMergeKey = sorted.map((row: any) => ({
			...row,
			// // TODO: 추후 사용 가능
			// dateRangeKey: makeDateRangeKey(row.fromDate, row.toDate),
			initialDelYn: row?.delYn === 'Y' ? true : false,
		}));

		setBackupGridData(withMergeKey);
		grid.setGridData(withMergeKey);
		// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
		grid.setColumnSizeList(grid.getFitColumnSizeList(true));
		// 데이터 최초 불러올때 행선택 처리
		if (withMergeKey.length > 0) {
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

	// 상위 선택 행이 바뀔 때도 AUIGrid 리마운트
	useEffect(() => {
		if (!selectMasterGridRow) return;
		setGridKey(prev => prev + 1);
	}, [
		selectMasterGridRow?.dccode,
		selectMasterGridRow?.dlvgroupId,
		selectMasterGridRow?.fromDate,
		selectMasterGridRow?.toDate,
	]);

	// districtGroupList 변경 시 그리드 재생성
	useEffect(() => {
		if (!selectablePopList?.length) return;

		// 현재 편집 상태 백업
		const grid = gridRef.current;
		if (grid?.getGridData) {
			const currentData = grid.getGridData();
			if (currentData?.length > 0) {
				setBackupGridData(currentData);
			}
		}

		setGridKey(prev => prev + 1);
	}, [selectablePopList]);

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
		<>
			<AGrid dataProps={''}>
				<Form disabled={isButtonDisabled}>
					<GridTopBtn gridTitle="대표 POP" gridBtn={gridBtn} totalCnt={gridData?.length} />
				</Form>

				<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={DistrictGroupSubListGridPopupRef} width="1280px">
				<DistrictGroupSubListGridPopup
					gridData={popupGridData}
					updatePopupGridToCurrentGrid={updatePopupGridToCurrentGrid}
					close={() => DistrictGroupSubListGridPopupRef.current?.handlerClose?.()}
				/>
			</CustomModal>
		</>
	);
};

export default DistrictGroupSubListGrid;
