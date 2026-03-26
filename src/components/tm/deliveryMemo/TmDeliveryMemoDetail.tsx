/*
 ############################################################################
 # FiledataField	: TmDeliveryMemoDetail.tsx
 # Description		: 배송 > 배차현황 > 거래처별 메모사항 조회 (목록)
 # Author					: JiHoPark
 # Since					: 2025.10.27.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util
import reportUtil from '@/util/reportUtil';

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface TmDeliveryMemoDetailProps {
	data: any;
	totalCnt: any;
}

const TmDeliveryMemoDetail = forwardRef((props: TmDeliveryMemoDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DELIVERYDATE'), /*배송일자*/ dataField: 'deliverydt', dataType: 'date' },
		{ headerText: t('lbl.CENTER_CODE'), /*센터코드*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccodenm', dataType: 'string' },
		{ headerText: t('lbl.DISTRICTGROUP'), /*권역그룹*/ dataField: 'districtcode', dataType: 'code' },
		{
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			/*POP*/ dataField: 'deliverygroup',
			dataType: 'string',
		},
		{ headerText: t('lbl.FROM_CUSTKEY_RT'), /*관리처코드*/ dataField: 'toCustkey', dataType: 'code' },
		{ headerText: t('lbl.TO_CUSTNAME_WD'), /*관리처명*/ dataField: 'toCustname', dataType: 'string' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'string' },
		{
			headerText: t('lbl.TMMEMO'),
			/*일별메모*/ dataField: 'tmmemo',
			style: 'pre-wrap',
			dataType: 'string',
		},
		{
			headerText: t('lbl.FIX_MEMO'),
			/*고정메모*/ dataField: 'memo',
			style: 'pre-wrap',
			dataType: 'string',
		},
		{
			headerText: t('lbl.ADDWHO'),
			/*등록자*/ dataField: 'editwho',
			dataType: 'manager',
			DataField: 'addwho',
		},
		{
			headerText: t('lbl.REGDATTM'),
			/*등록일자*/ dataField: 'editdate',
			dataType: 'date',
		},
		{
			headerText: t('lbl.STORERKEY'),
			dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccodename', dataType: 'string', visible: false },
		{ headerText: t('lbl.DELIVERYNO'), /*배송번호*/ dataField: 'deliveryno', dataType: 'string', visible: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		// 워드랩 개행 처리
		wordWrap: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 인쇄버튼 callback function
	 */
	const onPrinkClickCallback = () => {
		// 저장할 데이터 선택여부 확인
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_007', ['출력 항목']), // {{0}}을(를) 선택해 주십시오.
				modalType: 'info',
			});
			return;
		}
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
			// RD 레포트 xml
			// 1. 리포트 파일명
			const fileName = 'MS_DeliveryMemoList.mrd';

			// // 2. 리포트에 XML 생성을 위한 DataSet 생성
			const dataSet = {
				ds_report: chkDataList,
			};

			// // 3. 리포트에 전송할 파라미터
			const params: any = {
				TITLE: '배차메모정보',
			};

			reportUtil.openAgentReportViewer(fileName, dataSet, params);
		});
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

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				callBackFn: onPrinkClickCallback,
			},
		],
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
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</AGrid>
		</>
	);
});

export default TmDeliveryMemoDetail;
