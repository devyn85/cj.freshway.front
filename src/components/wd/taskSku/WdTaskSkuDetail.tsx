/*
 ############################################################################
 # FiledataField	: WdTaskSkuDetail.tsx
 # Description		: 피킹작업지시(상품별)-조회생성 Detail
 # Author			: 공두경
 # Since			: 25.09.29
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
import { apiGetDetailList, apiSavePickingBatch } from '@/api/wd/apiWdTaskSku';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const WdTaskSkuDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
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

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();

		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			plant: selectedRow[0].plant,
			storagetype: selectedRow[0].storagetype,
			distancetype: selectedRow[0].distancetype,
			createkey: selectedRow[0].createkey,
			createtype: selectedRow[0].createtype,
			wavekey: selectedRow[0].wavekey,
			taskdt: selectedRow[0].taskdt,
			sku: searchParams.sku,
			skugroup: searchParams.skugroup,
			chkYn: searchParams.chkYn,
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 대상확정
	 */
	const onClickBatch = async () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHCREATIONSKU',
				savePickingBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSavePickingBatch(params).then(res => {
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
			dataField: 'taskdt',
			headerText: t('lbl.TASKDT_WD'),
			dataType: 'date',
		},
		{
			headerText: t('lbl.BATCHINFO'),
			children: [
				{
					dataField: 'plantdesc',
					headerText: t('lbl.PLANT'),
				},
				{
					dataField: 'storagetypedesc',
					headerText: t('lbl.STORAGETYPE'),
					dataType: 'code',
				},
				{
					dataField: 'distancetype',
					headerText: t('lbl.DISTANCETYPE'),
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.CREATEBASELINE'),
			children: [
				{
					dataField: 'createkey',
					headerText: t('lbl.CREATEKEY'),
					dataType: 'code',
				},
				{
					dataField: 'createdescr',
					headerText: t('lbl.CREATEDESCR'),
				},
			],
		},
		{
			dataField: 'taskcount',
			headerText: t('lbl.TASKCOUNT'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY_TASK'),
			dataType: 'numeric',
			formatString: '#,##0.##',
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
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
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
		btnArr: [],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
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
			],
		},
		{
			headerText: t('lbl.QTYINFO'),
			children: [
				{
					dataField: 'processqty',
					headerText: t('lbl.PROCESSQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'workqty',
					headerText: t('lbl.WORKQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'inspectqty',
					headerText: t('lbl.INSPECTQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'confirmqty',
					headerText: t('lbl.CONFIRMQTY_TASK'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'sku',
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
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '대상확정', // 대상확정
				callBackFn: onClickBatch,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdTaskSkuDetail;
