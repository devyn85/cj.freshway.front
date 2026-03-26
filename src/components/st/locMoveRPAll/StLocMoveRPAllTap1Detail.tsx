/*
 ############################################################################
 # FiledataField	: StLocMoveAsrsTap1Detail.tsx
 # Description		: 자동창고보충(이동대상)
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const StLocMoveAsrsTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 보충생성
	 */
	const onSaveCREATION = () => {
		props.save('CREATION');
	};
	/**
	 * 보충지시
	 */
	const onSaveSETTASK = () => {
		props.save('SETTASK');
	};
	/**
	 * 일반보충이동
	 */
	const onSaveCONFIRM = () => {
		props.save('CONFIRM');
	};
	/**
	 * 보충삭제
	 */
	const onSaveDELETE = () => {
		props.save('DELETE');
	};
	/**
	 * 리스트
	 */
	const onPrint = () => {
		props.save('PRINT');
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dcname',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									sku: e.item.sku,
								},
								'sku',
							);
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'mc',
					headerText: t('lbl.MC'),
					dataType: 'code',
				},
				{
					dataField: 'storagetypename',
					headerText: t('lbl.STORAGETYPE'),
					dataType: 'code',
				},
				{
					dataField: 'uom',
					headerText: t('lbl.UOM'),
					dataType: 'code',
				},
				{
					dataField: 'stockid',
					headerText: t('lbl.FROM_STOCKID'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.FROMLOC'),
			children: [
				{
					dataField: 'loccategory',
					headerText: t('lbl.LOCCATEGORY'),
					dataType: 'code',
				},
				{
					dataField: 'fromloc',
					headerText: t('lbl.FROMLOC'),
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.SUPPLINPLQTY'),
			children: [
				{
					dataField: 'qtyperbox',
					headerText: t('lbl.QTYPERBOX'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'openqtyBox',
					headerText: t('BOX'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'openqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'stockgradename',
					headerText: t('lbl.STOCKGRADE'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.SUPPLQTY'),
			children: [
				{
					dataField: 'confirmqtyBox',
					headerText: t('BOX'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'confirmqtyEa',
					headerText: t('EA'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			headerText: t('lbl.LOTTABLE01'),
			children: [
				{
					dataField: 'lottable01',
					headerText: t('lbl.LOTTABLE01'),
					dataType: 'code',
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM'),
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'printynname',
			headerText: t('lbl.PUBLISHYN'),
		},
		{
			dataField: 'ifflagynname',
			headerText: t('lbl.IFFLAG'),
			dataType: 'code',
		},
		{
			dataField: 'status',
			headerText: t('lbl.WORKSTATUS'),
			dataType: 'code',
		},
		{
			dataField: 'procname',
			headerText: t('lbl.PROCNAME'),
			dataType: 'code',
		},
		{
			dataField: 'supplno',
			headerText: t('lbl.SUPLIMENTNO'),
			dataType: 'code',
		},
		{
			dataField: 'supplline',
			headerText: t('lbl.SUPLIMENTLINE'),
			dataType: 'code',
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false, // 편집 가능 여부
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부

		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.openqtyBox === 0 && item.openqtyEa === 0) {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
		rowCheckDisabledFunction: function (rowIndex: any, isChecked: any, item: any) {
			if (item.openqtyBox === 0 && item.openqtyEa === 0) {
				return false; // CSS 클래스 이름 반환
			} else if (item.status === '90') {
				return false; // CSS 클래스 이름 반환
			}
			return true; // 조건을 만족하지 않으면 체크박스 활성화
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dcname',
		},
		{
			dataField: 'openqtyBox',
			positionField: 'openqtyBox',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqtyEa',
			positionField: 'openqtyEa',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqtyBox',
			positionField: 'confirmqtyBox',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqtyEa',
			positionField: 'confirmqtyEa',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '보충생성', // 보충생성
				callBackFn: onSaveCREATION,
			},
			{
				btnType: 'btn2',
				btnLabel: '보충지시', // 보충지시
				callBackFn: onSaveSETTASK,
			},
			{
				btnType: 'btn3',
				btnLabel: '일반보충이동', // 일반보충이동
				callBackFn: onSaveCONFIRM,
			},
			{
				btnType: 'btn4',
				btnLabel: '리스트', // 리스트
				callBackFn: onPrint,
			},
			{
				btnType: 'btn5',
				btnLabel: '보충삭제', // 보충삭제
				callBackFn: onSaveDELETE,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		gridRefCur1?.setGridData(props.data);
		gridRefCur1?.setSelectionByIndex(0, 0);

		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = gridRefCur1.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRefCur1.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			return ['toLoc', 'toOrderqtyBox', 'toOrderqtyEa'].includes(event.dataField);
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default StLocMoveAsrsTap1Detail;
