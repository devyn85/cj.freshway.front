/*
 ############################################################################
 # FiledataField	: MsCenterDistrictNewHjdongWithoutPolygonListGrid.tsx
 # Description		: 센터권역 관리 신설 행정동 그리드
 # Author			: insung son
 # Since			: 26.03.20
 ############################################################################
 */

// libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// components
import GridTopBtn from '@/components/common/GridTopBtn';
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
// hooks
// types
import { GridBtnPropsType } from '@/types/common';
// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// Util
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
// apis
import { apiSaveMasterList } from '@/api/ms/apiMsCenterDistrict';

interface IMsCenterDistrictNewHjdongWithoutPolygonListGridProps {
	gridData: any[]; // 그리드 데이터
	searchParams: any; // 조회 검색 조건
	isOpen: boolean; // 그리드 열림 여부
	refetchList: (requestType: 'ALL' | 'MAIN', searchParams: any) => void; // 저장 후 재조회 처리
}

interface GridEvent {
	dataField?: string;
	item?: any;
	rowIndex?: number;
	value?: any;
}

// Const
const gridDateFormat = 'yyyy-mm-dd'; // 그리드 표시 포맷
const gridInputDateFormat = 'yyyymmdd'; // 그리드 입력 포멧

const MsCenterDistrictNewHjdongWithoutPolygonListGrid = ({
	gridData,
	searchParams,
	isOpen,
	refetchList,
}: IMsCenterDistrictNewHjdongWithoutPolygonListGridProps) => {
	const { t } = useTranslation(); // 다국어 처리
	const DEFAULT_END_DATE = '29991231';
	// rowStatus 가 R/U인경우 수정 가능한 필드들 (적용종료일자)
	const R_U_EDITABLE_ROW_FIELDS = ['fromDate', 'rmk'];

	const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	const newCreatedHjdongWithoutPolygonGridRef = useRef(null); // 신설 행정동 그리드 ref

	const dccodeKey = useMemo(() => {
		const v = searchParams?.dccode;
		if (typeof v === 'string') return v; // "2170,2180" 또는 "2170"
		if (Array.isArray(v)) return v.join(','); // ["2170","2180"]
		return '';
	}, [searchParams?.dccode]);
	const isSingleCenterSelected = useMemo(() => {
		const raw =
			typeof searchParams?.dccode === 'string'
				? searchParams.dccode
						.split(',')
						.map((s: string) => s.trim())
						.filter(Boolean)
				: Array.isArray(searchParams?.dccode)
				? searchParams.dccode
						.map(String)
						.map((s: string) => s.trim())
						.filter(Boolean)
				: [];
		// 공통코드에 존재하는 것만 “유효 선택”으로 간주
		const valid = allCommonCodeList.filter((c: any) => raw.includes(c.comCd));
		return valid.length === 1;
	}, [dccodeKey, allCommonCodeList]);

	const isDisabledSaveButton = useMemo(() => {
		if (isSingleCenterSelected) {
			return false;
		} else {
			return true;
		}
	}, [isSingleCenterSelected, dccodeKey]);

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
		(insertItemList: any[]) => {
			showConfirm(null, `${t('msg.MSG_COM_CFM_003')}\n ${t('lbl.NEW')}: ${insertItemList.length}`, () => {
				apiSaveMasterList(insertItemList)
					.then(handleSaveSuccess)
					.catch(() => {
						showAlert(null, '저장 중 오류가 발생했습니다.');
					});
			});
		},
		[t, handleSaveSuccess],
	);

	// 저장 버튼 처리 로직
	const handleSaveButtonClick = useCallback(async () => {
		const grid = newCreatedHjdongWithoutPolygonGridRef.current;
		if (!grid) return true;

		const checkedItems = grid.getChangedData({ validationYn: false });
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 필수값 유효성 검사
		if (!grid.validateRequiredGridData()) {
			return false;
		}

		// 센터에 신규행 추가이므로 무조건 'I' 처리
		const newItems = checkedItems.map((item: any, rowIndex: number) => ({
			...item,
			rowIndex,
			rowStatus: 'I', // 센터에 신규행 추가이므로 무조건 'I' 처리
		}));

		executeSave(newItems);
	}, [executeSave]);

	// 센터 행정동 그리드 버튼
	const gridBtn = useMemo((): GridBtnPropsType => {
		let searchDccode = '';
		if (typeof searchParams?.dccode === 'string') {
			searchDccode = searchParams.dccode;
		} else if (_.isArray(searchParams?.dccode) && searchParams.dccode.length > 0) {
			searchDccode = searchParams.dccode[0];
		}

		return {
			tGridRef: newCreatedHjdongWithoutPolygonGridRef,
			btnArr: [
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
			],
		};
	}, [searchParams, allCommonCodeList, t, handleSaveButtonClick]);

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
				editable: false,
				dataType: 'code',
			},
			{
				dataField: 'sigKorNm',
				headerText: '시/구/군',
				filter: {
					showIcon: true,
				},
				editable: false,
				dataType: 'code',
			},
			// 행정동
			{
				dataField: 'hjdongNm',
				headerText: t('lbl.PUBLIC_ADMINISTRATION_DONG'),
				editable: false,
				dataType: 'code',
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
						const isFromDateToday = true;
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
					if (isSingleCenterSelected) return 'isEdit';
					newCreatedHjdongWithoutPolygonGridRef.current?.removeEditClass?.(columnIndex);
					return '';
				},
			},
			// 적용종료일자
			{
				dataField: 'toDate',
				headerText: t('lbl.APL_END_DT'), // 적용종료일자
				editable: false,
				dataType: 'date',
				formatString: gridDateFormat, // 'yyyy-mm-dd'
				dateInputFormat: gridInputDateFormat, // 'yyyymmdd'
				minWidth: 120,
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
			// 비고
			{
				dataField: 'rmk',
				headerText: '비고',
				editable: true,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					return 'isEdit';
				},
			},
			{
				dataField: 'dccode',
				headerText: '센터 코드',
				dataType: 'code',
				visible: false,
				editable: false,
			},
			{
				dataField: 'initialData',
				headerText: 'db에서 처음 가져올때의 플래그 처리',
				dataType: 'boolean',
				visible: false,
				editable: false,
			},
		];
	}, [t, isSingleCenterSelected]);

	// 행정동
	const handleCellEditBegin = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, item } = event;
			const grid = newCreatedHjdongWithoutPolygonGridRef.current;
			if (!grid) return true;

			const rowStatus = getRowStatusByIndex(grid, rowIndex);

			// R/U 인경우
			if (rowStatus === 'R' || rowStatus === 'U') {
				if (R_U_EDITABLE_ROW_FIELDS.includes(dataField as any)) {
					if (isSingleCenterSelected) return true;
					else return false;
				}
			}

			return false;
		},
		[isSingleCenterSelected],
	);
	const handleCellEditEnd = useCallback(
		(event: GridEvent) => {
			const { dataField, rowIndex, value, item } = event;

			const searchDccodeList = searchParams?.dccode.split(',');
			const searchDccodeListObj = allCommonCodeList.filter((item: any) => searchDccodeList.includes(item.comCd));
			setTimeout(() => {
				const grid = newCreatedHjdongWithoutPolygonGridRef.current;
				if (!grid) return;

				try {
					if (dataField === 'fromDate') {
						const fromDate = dayjs(value, 'YYYYMMDD').format('YYYYMMDD');
						grid.setCellValue(rowIndex, 'fromDate', fromDate);
						if (searchDccodeListObj.length === 1) {
							grid.setCellValue(rowIndex, 'dccode', searchDccodeListObj[0].comCd);
							grid.setCellValue(rowIndex, 'dcname', searchDccodeListObj[0].cdNm);
						}
					}
				} catch (error) {
					//console.warn(error);
				}
			}, 100);
		},
		[allCommonCodeList, searchParams],
	);

	// 이벤트 처리 useEffect
	useEffect(() => {
		const grid = newCreatedHjdongWithoutPolygonGridRef.current;
		if (!grid || typeof grid.bind !== 'function') return;

		try {
			grid.bind('cellEditBegin', handleCellEditBegin);
			grid.bind('cellEditEnd', handleCellEditEnd);
		} catch (e) {
			//console.warn(e);
		}

		return () => {
			try {
				if (typeof grid.unbind === 'function') {
					grid.unbind('cellEditBegin');
					grid.unbind('cellEditEnd');
				}
			} catch (e) {
				//console.warn(e);
			}
		};
	}, [handleCellEditBegin, handleCellEditEnd]);

	const [gridKey, setGridKey] = useState(0);

	useEffect(() => {
		if (!isOpen) return;
		const t = window.setTimeout(() => {
			setGridKey(prev => prev + 1);
		}, 250);
		return () => window.clearTimeout(t);
	}, [isOpen, dccodeKey]);

	// 재마운트 후 데이터 재적용
	useEffect(() => {
		const grid = newCreatedHjdongWithoutPolygonGridRef.current;
		if (!grid || !gridData) return;
		try {
			const customGridData = gridData.map((item: any) => {
				return {
					...item,
					toDate: DEFAULT_END_DATE,
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
				<Form disabled={isDisabledSaveButton}>
					<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={gridData?.length} />
				</Form>

				<AUIGrid
					key={gridKey}
					ref={newCreatedHjdongWithoutPolygonGridRef}
					columnLayout={gridCol}
					gridProps={gridProps}
				/>
			</AGrid>
		</>
	);
};

export default MsCenterDistrictNewHjdongWithoutPolygonListGrid;
