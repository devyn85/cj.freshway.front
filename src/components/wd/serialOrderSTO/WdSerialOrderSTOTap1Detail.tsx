/*
 ############################################################################
 # FiledataField	: WdSerialOrderSTOTap1Detail.tsx
 # Description		: 피킹작업지시-조회생성 Detail
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
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { apiSaveCreationSTOList } from '@/api/wd/apiWdSerialOrderSTO';
import GridAutoHeight from '@/components/common/GridAutoHeight';

const WdSerialOrderSTOTap1Detail = forwardRef((props: any, ref: any) => {
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
	 * 저장
	 */
	const onSave = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'CREATION_BATCHSTO_SN',
				saveCreationSTOList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveCreationSTOList(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
		},
		{
			headerText: t('lbl.FROM_DCCODE'),
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'),
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.CUSTINFO'),
			children: [
				{
					dataField: 'toCustkey',
					headerText: t('lbl.TO_CUSTKEY_WD'),
					dataType: 'code',
				},
				{
					dataField: 'toCustname',
					headerText: t('lbl.TO_CUSTNAME_WD'),
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD'),
			dataType: 'code',
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
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
			dataField: 'serialno',
			headerText: t('lbl.SERIALNO'),
			dataType: 'code',
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID'),
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.QTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'taskdt',
		},
		{
			dataField: 'taskcount',
			positionField: 'taskcount',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
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
				btnType: 'save',
				callBackFn: onSave,
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

export default WdSerialOrderSTOTap1Detail;
