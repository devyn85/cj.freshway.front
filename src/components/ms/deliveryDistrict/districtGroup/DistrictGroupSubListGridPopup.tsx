/*
 ############################################################################
 # FiledataField	: DistrictGroupSubListGridPopup.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 대표POP 시간 설정 팝업
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Button } from 'antd';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util
import dateUtils from '@/util/dateUtil';

// Types
import { GridBtnPropsType } from '@/types/common';

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}

interface IDistrictGroupSubListGridPopupProps {
	gridData?: any[];
	updatePopupGridToCurrentGrid?: (popupGridData: any[]) => void;
	close?: () => void;
}

const DistrictGroupSubListGridPopup = ({
	gridData,
	updatePopupGridToCurrentGrid,
	close,
}: IDistrictGroupSubListGridPopupProps) => {
	// 다국어
	const { t } = useTranslation();

	// 그리드 처리 관련
	const gridRef = useRef<any>(null);
	const gridProps = useMemo(
		() => ({
			editable: true, // 데이터 수정 여부
			editBeginMode: 'click',
			showStateColumn: false, // row 편집 여부
			showRowCheckColumn: false, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	// 그리드 버튼 설정
	const gridBtn = useMemo((): GridBtnPropsType => {
		// 유효성 검사 함수 리스트
		// 1. (모든 데이터 기준) 필수값 유효성 검사
		// 2. (모든 데이터 기준) 모든 행들의 fromHour ~ toHour 의 값이 중복이 되는지 유효성 검사
		// 3. (모든 데이터 기준) 모든 행들의 fromHour ~ toHour 의 값이 00:00 ~ 23:59 사이의 값에 구멍이 존재하는지 유효성 검사

		// 자동 변경 리스트
		// 1. 같은 POP 번호, 명 의 시간이 연속으로 설정된 경우 1개로 합치고, fromHour, toHour 를 빈값으로 넣어 콜백함수로 전달
		//    (콜백 함수에서 빈값의 경우 삭제처리 후 그리드에 업데이트 처리)

		// 공통: "HH:mm" → 분 단위 숫자로 변환
		const timeToMinutes = (time?: string) => {
			if (!time) return null;
			const [h, m] = String(time).split(':');
			const hh = parseInt(h, 10);
			const mm = parseInt(m, 10);
			if (isNaN(hh) || isNaN(mm)) return null;
			return hh * 60 + mm;
		};
		const minutesToTime = (min: number | null | undefined) => {
			if (min == null) return '';
			const h = Math.floor(min / 60);
			const m = min % 60;
			return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
		};

		// 헬퍼: 빈값 체크
		const isEmptyValue = (value: any) =>
			value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

		// 헬퍼: required 컬럼 수집 (재귀)
		const collectRequiredColumns = (columns: any[]): any[] =>
			columns.flatMap(col => [
				...(col.required ? [col] : []),
				...(col.children?.length > 0 ? collectRequiredColumns(col.children) : []),
			]);

		// 1. (모든 데이터 기준) 필수값 유효성 검사
		const validateAllRequiredGridData = () => {
			const grid = gridRef.current;
			if (!grid) return true;

			const columnLayout: any[] = grid.getColumnLayout?.() || [];
			const requiredList = collectRequiredColumns(columnLayout);
			const allData: any[] = grid.getGridData?.() || [];

			// 모든 행에 대해 required 컬럼 값 검사
			for (let rowIndex = 0; rowIndex < allData.length; rowIndex++) {
				const row = allData[rowIndex];

				for (const col of requiredList) {
					if (isEmptyValue(row[col.dataField])) {
						showAlert(null, `${col.headerText}은(는) 필수값입니다.`);
						const colIndex = columnLayout.findIndex(c => c.dataField === col.dataField);
						grid.setSelectionByIndex?.(rowIndex, colIndex >= 0 ? colIndex : 0);
						return false;
					}
				}
			}

			return true;
		};
		// 2. (모든 데이터 기준) 모든 행들의 fromHour ~ toHour 의 값이 중복이 되는지 유효성 검사
		const validateNoTimeOverlap = () => {
			const grid = gridRef.current;
			if (!grid) return true;

			const columnLayout: any[] = grid.getColumnLayout?.() || [];
			const allData: any[] = grid.getGridData?.() || [];

			const intervals = allData
				.map((row, idx) => {
					const from = timeToMinutes(row.fromHour);
					const to = timeToMinutes(row.toHour);
					return { rowIndex: idx, row, from, to };
				})
				.filter(it => it.from != null && it.to != null);

			if (intervals.length === 0) return true;

			// 시작시간 < 종료시간 체크
			for (const it of intervals) {
				if (it.from! >= it.to!) {
					showAlert(null, '시작시간은 종료시간보다 이전이어야 합니다.');
					const colIndex = columnLayout.findIndex(c => c.dataField === 'fromHour');
					grid.setSelectionByIndex?.(it.rowIndex, colIndex >= 0 ? colIndex : 0);
					return false;
				}
			}

			// 시작시간 기준 정렬 후, 인접 구간이 겹치는지 체크
			intervals.sort((a, b) => a.from! - b.from!);

			for (let i = 0; i < intervals.length - 1; i++) {
				const cur = intervals[i];
				const next = intervals[i + 1];

				// cur.to > next.from 이면 구간이 겹침
				if (cur.to! >= next.from!) {
					showAlert(null, '시간 구간(fromHour ~ toHour)이 서로 겹치는 행이 있습니다.');
					const colIndex = columnLayout.findIndex(c => c.dataField === 'fromHour');
					grid.setSelectionByIndex?.(next.rowIndex, colIndex >= 0 ? colIndex : 0);
					return false;
				}
			}

			return true;
		};
		// 3. (모든 데이터 기준) 모든 행들의 fromHour ~ toHour 의 값이 00:00 ~ 23:59 사이의 값에 구멍이 존재하는지 유효성 검사
		const validateFullDayCovered = () => {
			const grid = gridRef.current;
			if (!grid) return true;

			const columnLayout: any[] = grid.getColumnLayout?.() || [];
			const allData: any[] = grid.getGridData?.() || [];

			const intervals = allData
				.map((row, idx) => {
					const from = timeToMinutes(row.fromHour);
					const to = timeToMinutes(row.toHour);
					return { rowIndex: idx, row, from, to };
				})
				.filter(it => it.from != null && it.to != null);

			if (intervals.length === 0) return true;

			intervals.sort((a, b) => a.from! - b.from!);

			const DAY_START = 0; // 00:00
			const DAY_END = 23 * 60 + 59; // 23:59

			const first = intervals[0];
			const last = intervals[intervals.length - 1];
			const fromColIndex = columnLayout.findIndex(c => c.dataField === 'fromHour');

			// 00:00부터 시작하는지 체크
			if (first.from !== DAY_START) {
				showAlert(null, '시간 구간은 00:00부터 시작해야 합니다.');
				grid.setSelectionByIndex?.(first.rowIndex, fromColIndex >= 0 ? fromColIndex : 0);
				return false;
			}

			// 중간에 구멍(틈)이 있는지 체크: cur.to === next.from + 1 이어야 함
			for (let i = 0; i < intervals.length - 1; i++) {
				const cur = intervals[i];
				const next = intervals[i + 1];

				if (cur.to + 1 !== next.from) {
					showAlert(null, '시간 구간 사이에 비어있는 시간대가 존재합니다.');
					grid.setSelectionByIndex?.(next.rowIndex, fromColIndex >= 0 ? fromColIndex : 0);
					return false;
				}
			}

			// 23:59 로 끝나는지 체크
			if (last.to !== DAY_END) {
				showAlert(null, '시간 구간은 23:59까지 이어져야 합니다.');
				grid.setSelectionByIndex?.(last.rowIndex, fromColIndex >= 0 ? fromColIndex : 0);
				return false;
			}

			return true;
		};

		// 자동 변경 리스트
		// 1. 같은 POP 번호, 명 의 시간이 연속으로 설정된 경우 1개로 합치고, fromHour, toHour 를 빈값으로 넣어 콜백함수로 전달
		//    (콜백 함수에서 빈값의 경우 삭제처리 후 그리드에 업데이트 처리)

		// 그룹 내 연속 시간 구간 병합 처리
		const mergeGroupRows = (groupRows: any[]) => {
			const merged: any[] = [];

			// from/to 없는 행은 그대로 넣고, 있는 행만 병합 대상
			const withTime = groupRows
				.map(r => ({
					...r,
					_from: timeToMinutes(r.fromHour),
					_to: timeToMinutes(r.toHour),
				}))
				.filter(r => r._from != null && r._to != null)
				.sort((a, b) => a._from! - b._from!);

			const noTime = groupRows.filter(r => timeToMinutes(r.fromHour) == null || timeToMinutes(r.toHour) == null);

			// 연속 구간 병합 (같은 POP 번호/명 그룹 내에서만)
			let i = 0;
			while (i < withTime.length) {
				const runStart = i;
				let runEnd = i;
				const curFrom = withTime[i]._from!;
				let curTo = withTime[i]._to!;

				// cur.to + 1 === next.from 인 동안 계속 이어붙임
				while (runEnd + 1 < withTime.length) {
					const next = withTime[runEnd + 1];
					if (curTo + 1 === next._from) {
						curTo = next._to!;
						runEnd++;
					} else {
						break;
					}
				}

				// 병합된 구간을 첫 행에 반영
				merged.push({
					...withTime[runStart],
					fromHour: minutesToTime(curFrom),
					toHour: minutesToTime(curTo),
					rowStatus: 'I',
				});

				i = runEnd + 1;
			}

			// 시간 없는 행은 그대로 유지
			noTime.forEach(r => merged.push(r));

			return merged;
		};

		const buildAutoChangedGridData = () => {
			const grid = gridRef.current;
			if (!grid) return [];

			const allData: any[] = grid.getGridData?.() || [];

			// key: dateRangeKey + popNo + popName 기준으로 그룹핑
			const groupMap = new Map<string, any[]>();

			allData.forEach((row, idx) => {
				const key = `${row.dateRangeKey || ''}|${row.popNo || ''}|${row.popName || ''}`;
				const list = groupMap.get(key) || [];
				list.push({ ...row, _rowIndex: idx });
				groupMap.set(key, list);
			});

			const result: any[] = [];

			groupMap.forEach(groupRows => {
				result.push(...mergeGroupRows(groupRows));
			});

			return result;
		};

		const onSaveFn = (updateGridDataList: any[]) => {
			updatePopupGridToCurrentGrid?.(updateGridDataList);
			showAlert(null, '시간 설정이 반영되었습니다.');
			close?.();
		};

		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'save',
					callBackFn: () => {
						// 1. 필수값 유효성 검사 (전체 행 기준)
						if (!validateAllRequiredGridData()) {
							return false;
						}
						// 2. 시간 구간 유효성 검사 (fromHour ~ toHour)
						if (!validateNoTimeOverlap()) {
							return false;
						}
						// 3. 시간 구간 유효성 검사 (fromHour ~ toHour)
						if (!validateFullDayCovered()) {
							return false;
						}
						// 4. 자동 변경 리스트 생성
						const autoChangedGridData = buildAutoChangedGridData();
						// 5. 저장 요청
						return onSaveFn(autoChangedGridData);
					},
				},
			],
		};
	}, [gridRef, t, updatePopupGridToCurrentGrid, close]);

	// 그리드 컬럼 정의 (최적화)
	const gridCol = useMemo(() => {
		const columns = [
			{
				dataField: 'popNo',
				headerText: '대표POP번호',
				required: false,
				editable: false,
			},
			{
				dataField: 'popName',
				headerText: '대표POP명',
				required: false,
				editable: false,
			},
			{
				dataField: 'fromHour',
				headerText: '시작시간',
				required: true,
				editable: true, // 계속 수정 가능
				commRenderer: {
					type: 'time',
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
							dataField: 'fromHour',
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
				dataField: 'toHour',
				headerText: '종료시간',
				required: true,
				editable: true, // 계속 수정 가능
				commRenderer: {
					type: 'time',
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
							dataField: 'toHour',
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
				required: false,
				editable: false,
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				cellMerge: true,
				mergeRef: 'dateRangeKey',
				mergePolicy: 'restrict',
			},
			{
				dataField: 'toDate',
				headerText: '적용종료일자',
				required: false,
				editable: false, // 계속 수정 가능
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				dateInputFormat: 'yyyymmdd',
				cellMerge: true,
				mergeRef: 'dateRangeKey',
				mergePolicy: 'restrict',
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
				required: false,
				editable: false, // 계속 수정 가능
				minWidth: 85,
				cellMerge: true,
				mergeRef: 'dateRangeKey',
				mergePolicy: 'restrict',
			},
		];
		return columns;
	}, []);

	const handleCellEditBegin = useCallback((event: GridEvent) => {
		const { dataField } = event;
		const grid = gridRef.current;
		if (!grid) return;
		if (dataField === 'fromHour' || dataField === 'toHour') {
			return true;
		}
		return false;
	}, []);

	const handleCellEditEnd = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, value } = event;
			// : 에 맞는 데이터가 들어가도록 입력 변경처리
			if (dataField === 'fromHour' || dataField === 'toHour') {
				gridRef.current.setCellValue(rowIndex, dataField, dateUtils.formatTimeInput(value));
			}
		},
		[dateUtils.formatTimeInput],
	);

	// 그리드 이벤트 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellEditBegin', handleCellEditBegin);
		grid.bind('cellEditEnd', handleCellEditEnd);

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellEditBegin');
				grid.unbind('cellEditEnd');
			}
		};
	}, [handleCellEditBegin]);

	// 데이터 처리
	useEffect(() => {
		const grid = gridRef.current;
		if (!gridData || !grid) return;
		grid.setGridData(gridData);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="권역그룹 대표 POP 시간 설정" />
			{/* 그리드 영역 */}
			<AGrid dataProps={''}>
				<GridTopBtn gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 버튼 영역 */}
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.CLOSE')}</Button>
			</ButtonWrap>
		</>
	);
};

export default DistrictGroupSubListGridPopup;
