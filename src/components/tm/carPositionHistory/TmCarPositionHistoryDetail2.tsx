/*
 ############################################################################
 # FiledataField	: TmCarPositionHistoryDetail2.tsx
 # Description		: 배송 > 차량관제 > 운행일지 (상세)
 # Author					: JiHoPark
 # Since					: 2025.11.14.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface TmCarPositionHistoryDetail2Props {
	data: any;
	totalCnt: any;
}

const TmCarPositionHistoryDetail2 = forwardRef((props: TmCarPositionHistoryDetail2Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DELIVERYPRIORITY') /*배송순위*/,
			children: [
				{
					headerText: t('lbl.PLAN'),
					/*계획*/ dataField: 'deliverypriority',
					dataType: 'code',
					editable: false,
				},
				{
					headerText: t('lbl.REAL_DELIVERY'),
					/*실배송*/ dataField: 'realDeliverypriority',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{ headerText: t('lbl.TRUTH_CUSTKEY'), /*실착지코드*/ dataField: 'truthcustkey', dataType: 'code', editable: false },
		{
			headerText: t('lbl.TRUTH_CUSTNAME'),
			/*실착지명*/ dataField: 'truthcustname',
			dataType: 'string',
			editable: false,
		},
		{ headerText: t('lbl.FROM_CUSTKEY_RT'), /*관리처코드*/ dataField: 'custkey', dataType: 'code', editable: false },
		{ headerText: t('lbl.FROM_CUSTNAME_RT'), /*관리처명*/ dataField: 'custname', dataType: 'string', editable: false },
		{ headerText: t('lbl.INCOMINGDATETIME'), /*도착시간*/ dataField: 'arrivedtime', dataType: 'code', editable: false },
		{ headerText: t('lbl.DEPART_TIME'), /*출발시간*/ dataField: 'departuretime', dataType: 'code', editable: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

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

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
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
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DETAIL')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</GridAutoHeight>
		</>
	);
});

export default TmCarPositionHistoryDetail2;
