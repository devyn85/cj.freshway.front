/*
 ############################################################################
 # FiledataField	: KpDailyUnloadMasterPopupDetail2.tsx
 # Description		:  지표 > 생산성 > 데일리 생산성 하역 지표 관리(투입인원) 마스터관리 팝업 > 센터업무관리(예외)
 # Author			: JiHoPark
 # Since			: 2026.01.22.
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// component
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API

interface KpDailyUnloadMasterPopupDetail2Props {
	data: any;
	totalCnt: number;
	dsDccode: any;
	dsDailyU1: any;
	today: any;
	onSaveHandler: any;
}

const KpDailyUnloadMasterPopupDetail2 = forwardRef((props: KpDailyUnloadMasterPopupDetail2Props, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCnt, dsDccode, dsDailyU1, today } = props;

	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			renderer: {
				type: 'DropDownListRenderer',
				list: dsDccode,
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.BOG_DV'),
			/*대구분*/ dataField: 'gubun1',
			dataType: 'code',
			renderer: {
				type: 'DropDownListRenderer',
				list: dsDailyU1,
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ headerText: t('lbl.SMALL_DV'), /*소구분*/ dataField: 'gubun2', dataType: 'code' },
		{
			headerText: t('lbl.CONTRACT_FROMDATE'),
			/*계약시작일*/ dataField: 'contractFromdate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			headerText: t('lbl.CONTRACT_TODATE'),
			/*계약종료일*/ dataField: 'contractTodate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			headerText: t('lbl.FROM_ENG'),
			/*FROM*/ dataField: 'fromHour',
			dataType: 'code',
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
				validator: function (oldValue: any, newValue: any, item: any) {
					// 에디팅 유효성 검사
					let isValid = true;
					const timeArr = newValue.split(':');

					// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
					if (parseInt(timeArr[0]) > 23 || parseInt(timeArr[1]) > 59) {
						isValid = false;
					}

					return { validate: isValid, message: t('msg.MSG_COM_VAL_221') };
				},
			},
		},
		{
			headerText: t('lbl.TO_ENG'),
			/*TO*/ dataField: 'toHour',
			dataType: 'code',
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
				validator: function (oldValue: any, newValue: any, item: any) {
					// 에디팅 유효성 검사
					let isValid = true;
					const timeArr = newValue.split(':');

					// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
					if (parseInt(timeArr[0]) > 23 || parseInt(timeArr[1]) > 59) {
						isValid = false;
					}

					return { validate: isValid, message: t('msg.MSG_COM_VAL_221') };
				},
			},
		},
		{ headerText: t('lbl.PERSON_TO'), /*인원(T/O)*/ dataField: 'gubun3', dataType: 'numeric' },
		{ headerText: t('lbl.EXCPTYN'), /*예외여부*/ dataField: 'excptYn', dataType: 'code' },
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		isLegacyRemove: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 센터업무관리(예외) 저장 callback
	 * @returns {void}
	 */
	/**
	 * 센터업무관리 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const chkDataList = ref.current.getChangedData();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const allDataList = ref.current.getGridData();
		const findedData = chkDataList.find((chkData: any) =>
			allDataList.some(
				(allData: any) =>
					chkData._$uid !== allData._$uid &&
					chkData.dccode === allData.dccode &&
					chkData.gubun1 === allData.gubun1 &&
					chkData.gubun2 === allData.gubun2 &&
					chkData.fromHour === allData.fromHour &&
					chkData.toHour === allData.toHour &&
					chkData.contractFromdate === allData.contractFromdate,
			),
		);

		if (findedData) {
			showMessage({
				content: t('msg.MSG_COM_VAL_029', ['저장 데이터']), // 동일한 저장 데이터이(가) 존재합니다.
				modalType: 'info',
			});
			return;
		}

		props.onSaveHandler(chkDataList);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
					excptYn: 'Y', // 예외여부
					dccode: '', // 물류센터
					gubun1: '', // 대구분
					contractFromdate: today.format('YYYYMMDD'), // 계약시작일
					contractTodate: today.format('YYYYMMDD'), // 계약종료일
					gubun3: 0, // 인원(T/O)
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DCCODE_TASK_MNGEXCPT')} totalCnt={props.totalCnt} />
			<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default KpDailyUnloadMasterPopupDetail2;
