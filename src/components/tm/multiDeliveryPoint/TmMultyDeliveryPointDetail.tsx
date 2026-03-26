// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function

import { apiSaveMasterList } from '@/api/tm/apiTmMultyDeliveryPoint';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { Button, Form } from 'antd/lib';
import dayjs from 'dayjs';

const TmMultiDeliveryPointDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	// 다국어
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', props.form);
	const [applyForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(props.totalCnt);

	const refModal = useRef(null);
	const excelInputRef = useRef(null);
	const today = dayjs().format('YYYYMMDD');
	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	const sttlItemCdLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;
	};
	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'serialkey',
			headerText: '시리얼키',
			editable: false,
			visible: false,
		},
		{
			dataField: 'dccode',
			headerText: '물류센터',
			editable: false,
			visible: false,
		},
		{
			dataField: 'stdCustKey',
			headerText: '기준 관리처',
			editable: true,
			required: true,
		},
		{
			dataField: 'stdCustKeyNm',
			headerText: '기준 분할 관리처명',
			editable: false,
		},
		{
			dataField: 'partCustKey',
			headerText: '합산 분할 관리처',
			editable: true,
		},
		{
			dataField: 'partCustKeyNm',
			headerText: '합산 분할 관리처명',
			editable: false,
			required: true,
		},
		{
			dataField: 'fromdate',
			headerText: '시작일',
			dataType: 'date',
			editable: true,
			required: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			dataField: 'todate',
			headerText: '종료일',
			dataType: 'date',
			editable: true,
			required: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			dataField: 'adddate',
			headerText: '등록일자',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: '수정일자',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'addwho',
			headerText: '등록자',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: '수정자',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showRowNumColumn: true,
		enableFilter: true,
		isLegacyRemove: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (props.data && props.data.length > 0) {
				ref.gridRef?.current.setSelectionByIndex(0);
			}
		});
		// ref.gridRef?.current.bind('cellEditBegin', (evt: any) => {
		// 	// 클릭된 컬럼의 dataField (colid) 확인
		// 	const col = evt.dataField;
		// 	const rowData = evt.item;

		// 	if (col === 'sttlItemCd' || col === 'applyType') {
		// 		if (rowData.rowStatus !== 'I') return false;
		// 	}

		// 	return true;
		// });
	};
	/**
	 * 시작일 종료일 유효성 검증
	 * @param fromDate1
	 * @param toDate1
	 * @param fromDate2
	 * @param toDate2
	 */
	function isDateRangeOverlap(fromDate1: string, toDate1: string, fromDate2: string, toDate2: string): boolean {
		const start1 = Number(fromDate1);
		const end1 = Number(toDate1 || fromDate1); // 종료일 없으면 시작일로 간주
		const start2 = Number(fromDate2);
		const end2 = Number(toDate2 || fromDate2);

		// 두 날짜 범위가 겹치는지 여부 반환
		return start1 <= end2 && start2 <= end1;
	}

	/**
	 * 물류센터 + 차량번호 + 운송사 + 정산항목 그룹별로 묶기
	 * @param rows
	 */
	function groupRowsByKey(
		rows: any[],
	): { result: true; grouped: Record<string, any[]> } | { result: false; message: string } {
		const format = 'YYYYMMDD'; // 날짜 형식

		// 그룹핑
		const tempGroups: Record<string, any[]> = {};
		for (const row of rows) {
			if (!dateUtil.isValid(row.fromdate, format)) {
				return { result: false, message: `시작일자(${row.fromdate})의 날짜 형식이 잘못되었습니다.` };
			}
			if (!dateUtil.isValid(row.todate, format)) {
				return { result: false, message: `종료일자(${row.todate})의 날짜 형식이 잘못되었습니다.` };
			}
			const key = `${row.stdCustKey}__${row.partCustKey}`;
			if (!tempGroups[key]) tempGroups[key] = [];
			tempGroups[key].push(row);
		}

		// 2개이상인 그룹만 필터링
		const result: Record<string, any[]> = {};
		for (const key in tempGroups) {
			const group = tempGroups[key];
			if (group.length > 1) {
				// 배열 초기화 후 push
				if (!result[key]) {
					result[key] = [];
				}
				result[key].push(...group);
			}
		}

		return { result: true, grouped: result };
	}

	/**
	 * 그룹 내 날짜 중복 검증 함수 (입력값 기준)
	 * @param groupData 그룹 기간 데이터
	 * @param allData 전체 데이터셋
	 */
	function validateGroupedDateRanges(allData: any[]): { result: boolean; message: string } {
		const temp = groupRowsByKey(allData);
		if (!temp.result && 'message' in temp) {
			return { result: false, message: temp.message };
		}
		const grouped = temp.grouped;
		const format = 'YYYYMMDD'; // 날짜 형식
		for (const [key, groupRows] of Object.entries(grouped)) {
			// 2개 이상인 그룹만 검사
			if (groupRows.length < 2) continue;

			for (let i = 0; i < groupRows.length; i++) {
				const row1 = groupRows[i];
				if (!dateUtil.isValid(row1.fromdate, format)) {
					return { result: false, message: `시작일자(${row1.fromdate})의 날짜 형식이 잘못되었습니다.` };
				}
				if (!dateUtil.isValid(row1.todate, format)) {
					return { result: false, message: `종료일자(${row1.todate})의 날짜 형식이 잘못되었습니다.` };
				}
				for (let j = i + 1; j < groupRows.length; j++) {
					const row2 = groupRows[j];

					// 날짜 형식 검증
					if (!dateUtil.isValid(row2.fromdate, format) || !dateUtil.isValid(row2.todate, format)) continue;

					// 자기 자신 비교 방지 (객체 참조 또는 serialkey가 있을 경우 구분)
					if (row1 === row2) continue;

					if (isDateRangeOverlap(row1.fromdate, row1.todate, row2.fromdate, row2.todate)) {
						return {
							result: false,
							message:
								`기준관리처(${row1.stdCustKey}), 차량기준 분할 관리처(${row1.partCustKey})의 날짜 범위가 ` +
								`중복됩니다.`,
						};
					}
				}
			}
		}

		return { result: true, message: 'success' };
	}
	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!ref.gridRef.current.validateRequiredGridData()) return;
		// 삭제된 행만 추출
		const deletedSerialKeys = updatedItems.filter((row: any) => row.rowStatus === 'D').map((row: any) => row.serialkey);
		// 전체 행 (삭제된 행 제외됨) - 기간 중복 검증을 위해 전체 데이터 필터
		const gridData = ref.gridRef.current.getGridData();
		const allData =
			deletedSerialKeys?.length > 0
				? gridData.filter((row: any) => !deletedSerialKeys.includes(row.serialkey))
				: gridData;

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 기간 중복 검증
		const isChecked = validateGroupedDateRanges(allData);
		if (!isChecked.result) {
			showAlert(null, isChecked.message, () => {
				// alert 닫힌 후 실행할 로직이 있으면 여기에 작성
			});
			return; // 중단
		}
		// 복사한 행의 시리얼키 제거
		const saveList = updatedItems.map((row: any) => {
			if (row.rowStatus === 'I') {
				return {
					...row,
					serialkey: '', // 신규건은 시리얼키 제거
				};
			}
			return row;
		});

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiSaveMasterList({ saveList: updatedItems }).then(res => {
				if (res.statusCode == 0) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.callBackFn();
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					serialkey: '',
					adddate: '',
					addwho: '',
					editdate: '',
					editwho: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					fromdate: today,
					todate: today,
					rowStatus: 'I',
					serialkey: '',
				}),
			},
			{
				btnType: 'plus', // 행추가
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					fromdate: today,
					todate: today,
					rowStatus: 'I',
					serialkey: '',
				}),
			},
			{
				btnType: 'delete', // 신규행삭제
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};
	/**
	 * 엑셀 업로드 버튼 클릭 이벤트
	 */
	const excelUpload = () => {
		excelInputRef.current?.click();
	};

	/**
	 * 엑셀 데이터 업로드 이벤트
	 * @param data
	 */
	const onDataExcel = (data: any) => {
		// 현재 그리드 데이터
		ref.gridRef.current.clearGridData();

		if (data === undefined || data.length < 1) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}
		// 그리드 컬럼 헤더 정보 가져옴.
		const dataFieldsWithMeta = ref.gridRef.current
			.getColumnInfoList()
			.map((col: any, index: number) => ({
				index,
				dataField: col.dataField,
				visible: col.visible !== false,
			}))
			.filter((col: { dataField: any }) => !!col.dataField);

		// 그리드 데이터 생성
		const excelGridData = data.map((row: any) => {
			const newRow: any = {};
			let excelIndex = 0;

			// 엑셀 데이터와 그리드 컬럼 매칭
			dataFieldsWithMeta.forEach(({ dataField, visible }: { dataField: string; visible: boolean }) => {
				if (visible) {
					// visible한 컬럼은 엑셀의 실제 순서와 매칭
					newRow[dataField] = row[excelIndex];
					excelIndex++;
				} else {
					// visible == false인 컬럼 초기값 세팅
					if (dataField === 'dccode') {
						newRow[dataField] = dccode;
					}
				}
			});
		});

		ref.gridRef.current.setGridData(excelGridData);
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);
	useEffect(() => {
		if (ref.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
			showConfirmAsync(null, t('msg.MSG_COM_CFM_009'), () => {
				ref.gridRef.current.clearGridData();
				setTotalCnt(0);
			});
		}
	}, [dccode]);
	/**
	 * 그리드 데이터 초기화
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef.current.setColumnSizeList(colSizeList);
		}
	}, [props.data]);
	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'다중납품처관리 목록'} gridBtn={gridBtn} totalCnt={totalCnt}>
					<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 공통 검색 팝업 래퍼 */}
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} />
		</>
	);
});

export default TmMultiDeliveryPointDetail;
