/*
 ############################################################################
 # FiledataField	: WdTaskTap3Detail.tsx
 # Description		: 피킹작업지시-피킹작업자현황 Detail
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function

const WdTaskTap3Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 피킹작업자삭제
	 */
	const onDeletePicker = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.tasktype !== 'AL')) {
			showAlert(null, '부분피킹인 건만 작업자 삭제가 가능합니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
			const params = {
				apiUrl: '/api/wd/task/v1.0/deletePicker',
				avc_COMMAND: 'DELETEPICKINGWORK',
				dataKey: 'deletePickerList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 특정 그리드 데이터에서 지정된 컬럼의 합계를 구하는 공통 함수
	 * @param gridData - 합계를 구할 데이터 배열
	 * @param colName - 합계를 구할 컬럼명(문자열)
	 * @returns 합계(Number)
	 */
	const getGridColSum = (gridData: any[], colName: string): number => {
		return gridData.reduce((acc: number, row: any) => acc + (Number(row[colName]) || 0), 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search(); // 검색 함수 호출
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'taskdt',
			headerText: t('lbl.TASKDT_WD'),
			dataType: 'date',
		},
		{
			dataField: 'tasktypenm',
			headerText: t('lbl.TASKTYPE_WD'),
			dataType: 'code',
		},
		{
			dataField: 'loc',
			headerText: t('lbl.PICKINGLOC'),
			dataType: 'code',
		},
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
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'lot',
			headerText: t('lbl.LOT'),
			dataType: 'code',
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID'),
			dataType: 'code',
		},
		{
			dataField: 'picker',
			headerText: t('lbl.PICKER'),
			dataType: 'code',
		},
		{
			dataField: 'username',
			headerText: t('lbl.USERNAME'),
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn4',
				btnLabel: '작업자삭제', // 삭제
				callBackFn: onDeletePicker,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdTaskTap3Detail;
