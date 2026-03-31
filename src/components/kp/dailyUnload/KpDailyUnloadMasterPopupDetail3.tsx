/*
 ############################################################################
 # FiledataField	: KpDailyUnloadMasterPopupDetail3.tsx
 # Description		:  지표 > 생산성 > 데일리 생산성 하역 지표 관리(투입인원) 마스터관리 팝업 > 분류피킹 제외대상 고객
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

interface KpDailyUnloadMasterPopupDetail3Props {
	data: any;
	totalCnt: number;
	dsDccode: any;
	today: any;
	onSaveHandler: any;
}

const KpDailyUnloadMasterPopupDetail3 = forwardRef((props: KpDailyUnloadMasterPopupDetail3Props, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCnt, dsDccode, today } = props;

	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: dsDccode,
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ headerText: t('lbl.TO_CUSTKEY_WD'), /*관리처코드*/ dataField: 'custkey', dataType: 'code', required: true },
		{
			headerText: t('lbl.EXCPT_FROMDATE'),
			/*예외시작일자*/ dataField: 'excptFromdate',
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
			headerText: t('lbl.EXCPT_TODATE'),
			/*예외종료일자*/ dataField: 'excptTodate',
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
		{ headerText: t('lbl.REMARK'), /*비고*/ dataField: 'bigo', dataType: 'string' },
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
	 * 분류피킹 제외대상 고객 저장 callback
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
					chkData.custkey === allData.custkey &&
					((chkData.excptFromdate >= allData.excptFromdate && chkData.excptFromdate <= allData.excptTodate) ||
						(chkData.excptTodate >= allData.excptFromdate && chkData.excptTodate <= allData.excptTodate) ||
						(allData.excptFromdate >= chkData.excptFromdate && allData.excptFromdate <= chkData.excptTodate) ||
						(allData.excptTodate >= chkData.excptFromdate && allData.excptTodate <= chkData.excptTodate)),
			),
		);

		if (findedData) {
			showMessage({
				content: t('msg.MSG_COM_ERR_057', ['(물류센터, 관리처코드, 예외시작일자, 예외종료일자)']), // 중복된 (물류센터, 관리처코드, 예외시작일자, 예외종료일자)(이)가 존재합니다
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
					dccode: '', // 물류센터
					excptFromdate: today.format('YYYYMMDD'), // 예외시작일자
					excptTodate: today.format('YYYYMMDD'), // 예외종료일자
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
			gridRef?.setGridData(data);
			gridRef?.setSelectionByIndex(0, 0);

			if (data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<AGrid>
			<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.ASSORTPICKCUST_EXCPT')} totalCnt={totalCnt} />
			<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default KpDailyUnloadMasterPopupDetail3;
