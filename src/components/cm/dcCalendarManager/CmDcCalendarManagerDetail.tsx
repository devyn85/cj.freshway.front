/*
 ############################################################################
 # FiledataField	: CmDcCalendarManagerDetail.tsx
 # Description		: 주문 > 주문목록 > 발주용휴일관리 상세 영역
 # Author			: LeeJeongCheol
 # Since			: 26.03.05
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveMasterList } from '@/api/cm/apiCmDcCalendarManager';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const CmCalendarManagerDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * 공통코드 'YN'으로 변환하는 라벨 함수
	 * @param {number} rowIndex 행 인덱스
	 * @param {number} columnIndex 컬럼 인덱스
	 * @param {any} value YN 값
	 * @returns {string} 변환된 YN명
	 */
	const restYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		const ynOptions = getCommonCodeList('YN');
		const option = ynOptions.find((item: any) => item.comCd === value);
		return option?.cdNm || value;
	};

	/**
	 * calendarId 값을 구분명으로 변환하는 라벨 함수
	 * @param {number} rowIndex 행 인덱스
	 * @param {number} columnIndex 컬럼 인덱스
	 * @param {any} value calendarId 값
	 * @returns {string} 변환된 구분명
	 */
	const calendarIdLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		if (value === 'STD') {
			return 'FW';
		} else if (value === '1000') {
			return '1000센터';
		}
		return value || '';
	};

	/**
	 * 요일에 따른 색상 적용 함수
	 * @param {number} _rowIndex 행 인덱스
	 * @param {number} _columnIndex 컬럼 인덱스
	 * @param {any} _value 값
	 * @param {string} _headerText 헤더 텍스트
	 * @param {any} item 행 데이터
	 * @returns {object} 스타일 객체
	 */
	const dayGbColorFunc = (_rowIndex: number, _columnIndex: number, _value: any, _headerText: string, item: any) => {
		const day = (item?.dayGbNm ?? '').toString();
		const restYn = (item?.restYn ?? '').toString();

		// 휴일 우선 빨강 처리
		if (restYn === 'Y') return { color: 'red' };

		if (day === '일요일') return { color: 'red' }; // 빨강
		if (day === '토요일') return { color: 'blue' }; // 파랑
		return { color: '' }; // 기본색
	};

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'dccode',
		// 	headerText: t('lbl.DCCODE1'), // 물류센터코드
		// 	dataType: 'code',
		// 	editable: false,
		// 	styleFunction: dayGbColorFunc,
		// },
		{
			/**
			 * dayGb가 아니라, 1000센터(CJ 계열사) 또는 공통(나머지 센터)
			 * - STD | FW00 => 공통
			 * - 1000 => 1000센터
			 */
			dataField: 'calendarId',
			headerText: t('lbl.GUBUN_2'),
			dataType: 'code',
			editable: false,
			labelFunction: calendarIdLabelFunc,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'dcnm',
			headerText: t('lbl.DCNAME'), // 물류센터명
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'yy',
			headerText: t('lbl.YY'), // 연
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'mm',
			headerText: t('lbl.MM'), // 월
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'dd',
			headerText: t('lbl.DD'), // 일
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'dayGbNm',
			headerText: t('lbl.DAY_GB'), // 요일
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'dayGb',
			visible: false,
		},
		{
			dataField: 'restYn',
			headerText: t('lbl.REST_YN'), // 휴일유무(공통코드 'YN')
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: getCommonCodeList('YN'),
				textField: 'cdNm',
			},
			labelFunction: restYnLabelFunc,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'restDesc',
			headerText: t('lbl.REST_DESC'), // 휴일내용
			dataType: 'text',
			editable: true,
			// editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'addWho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'addWhoId',
			visible: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'editWhoId',
			visible: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
		showRowNumColumn: true,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
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
		if (!gridRef?.current) return;

		/**
		 * 그리드 바인딩 완료
		 */
		gridRef.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 */
		gridRef.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
	};

	/**
	 * 발주용휴일관리 목록 저장
	 */
	const saveMasterList = () => {
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		/**
		 * 저장 실행
		 */
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(() => {
				gridRef.current.getCheckedRowItems().map((item: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();

				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						props.callBackFn?.();
					},
				});
			});
		});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			// {
			// 	btnType: 'excelDownload',
			// },
			// {
			// 	btnType: 'excelUpload',
			// },
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []); // 의존성 배열 추가

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur && props.data) {
			gridRefCur.setGridData(props.data);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);

				// 첫 번째 행 자동 선택 (selectionChange에서 상세조회 처리)
				gridRefCur.setSelectionByIndex(0);
			}
		}
	}, [props.data]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={'발주용휴일관리 목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default CmCalendarManagerDetail;
