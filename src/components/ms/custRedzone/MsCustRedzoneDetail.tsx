/*
 ############################################################################
 # FiledataField	: MsCustRedzoneDetail.tsx
 # Description		: 기준정보 > 거래처기준정보 > 특별관리고객현황 1단 Grid 영역
 # Author			: YeoSeungCheol
 # Since			: 25.05.28
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

// Util

// Type

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

// API

const MsCustRedzoneDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'custKey',
			headerText: t('lbl.CUST_CODE'), // 고객코드=>거래처코드 변경
			dataType: 'code',
		},
		{
			dataField: 'custNm',
			headerText: t('lbl.CUST_NAME'), // 고객명=>거래처명 변경
			dataType: 'string',
		},
		{
			dataField: 'custOrderCloseType',
			headerText: t('lbl.CUSTORDERCLOSETYPE'), // 고객마감유형
			dataType: 'code',
		},
		{
			dataField: 'markWordNm',
			headerText: t('lbl.VLT_INFO'), // 표시사항
			dataType: 'code',
		},
		{
			dataField: 'regId',
			headerText: t('lbl.REGISTER'), // 등록자
			dataType: 'manager',
			managerDataField: 'regId',
		},
		{
			dataField: 'regDate',
			headerText: t('lbl.ADDDATE'), // 등록일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자정보 => 수정자 변경
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일자 => 수정일시 변경
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		// showStateColumn: false,
		// fillColumnSizeMode: true,
		showRowNumColumn: true, // 순번 컬럼 자동 추가
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
		gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [],
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
		// const gridRefCur = gridRef.current;
		// if (gridRefCur) {
		// 	gridRefCur?.setGridData(props.data);
		// 	gridRefCur?.setSelectionByIndex(0, 0);

		// 	if (props.data.length > 0) {
		// 		// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
		// 		// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
		// 		const colSizeList = gridRefCur.getFitColumnSizeList(true);

		// 		// 구해진 칼럼 사이즈를 적용 시킴.
		// 		gridRefCur.setColumnSizeList(colSizeList);
		// 	}
		// }
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default MsCustRedzoneDetail;
