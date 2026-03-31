/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupDetail4.tsx
 # Description		: 출고재고분배-차량별분배 Detail
 # Author			: 공두경
 # Since			: 25.08.19
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
import { getTab4DetailList } from '@/api/wd/apiWdAllocationBatchGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import styled from 'styled-components';

const WdAllocationBatchGroupDetail4 = forwardRef((props: any, ref: any) => {
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
			batchgroup: selectedRow[0].batchgroup,
			storagetype: selectedRow[0].storagetype,
			distancetype: selectedRow[0].distancetype,
			createkey: selectedRow[0].createkey,
			createtype: 'BATCHGROUP',
			slipdt: selectedRow[0].slipdt,
			serialyn: selectedRow[0].serialyn,
			toCusttype: selectedRow[0].toCusttype,
			toCustkey: selectedRow[0].toCustkey,
			carno: selectedRow[0].carno,
			sku: searchParams.sku,
			zone: searchParams.zone,
			fixdccode: searchParams.fixdccode,
		};

		getTab4DetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 행 선택
	 * @param gridRef
	 * @param selectedRow
	 */
	const selectRowData = (selectedRow: any) => {
		if (selectedRow[0].carno == null || selectedRow[0].carno === '') {
			// 차량번호가 없는 경우에는 지정분배할 수 없습니다.
			return;
		}

		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			toCustkey: selectedRow[0].toCustkey,
			ordertype: selectedRow[0].ordertype,
			plant: selectedRow[0].plant,
			batchgroup: selectedRow[0].batchgroup,
			storagetype: selectedRow[0].storagetype,
			distancetype: selectedRow[0].distancetype,
			slipdt: selectedRow[0].slipdt,
			serialyn: selectedRow[0].serialyn,
		};

		props.callBack(params);
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
	 * 배치별분배
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (ref.gridRef.current.getGridData()[0].serialyn == 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 식별번호가 있는 배치별분배는 선택할 수 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();

		showConfirm(null, '주문마감 반영 진행하셨나요?\n\n선택한 생성키 전체가 분배됩니다. 분배하시겠습니까?', () => {
			const params = {
				apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchCarno',
				avc_COMMAND: 'CONFIRM_BATCHGROUP_CARNO',
				allocfixtype: searchParams.allocfixtype,
				dataKey: 'saveDataCarnoList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * STO분배
	 */
	const onClickSTOBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (ref.gridRef.current.getGridData()[0].serialyn == 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 식별번호가 있는 배치별분배는 선택할 수 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();

		showConfirm(null, '주문마감 반영 진행하셨나요?\n\n선택한 생성키 중 STO대상이 분배됩니다. 분배하시겠습니까?', () => {
			const params = {
				apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveSTOBatch',
				avc_COMMAND: 'CONFIRM_BATCHGROUP_STO',
				searchtype: 'NORMAL',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 거래처분배
	 */
	const onClickBatchDetail = () => {
		const searchParams = props.form.getFieldsValue();

		const selectedRow = ref.gridRef.current.getSelectedRows();
		if (selectedRow[0].serialyn === 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 선택된 행이 없습니다.
			return;
		}

		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		showConfirm(null, t('msg.MSG_COM_CFM_020', ['거래처분배']), () => {
			const params = {
				apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchDetail1',
				avc_COMMAND: 'CONFIRM_BATCHGROUP_CUST',
				allocfixtype: searchParams.allocfixtype,
				dataKey: 'saveDetail1List',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
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
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code', cellMerge: true },
		{
			headerText: t('lbl.TASKDT_WD') /*작업지시일자*/,
			dataField: 'slipdt',
			dataType: 'date',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
			},
		},
		{
			headerText: t('lbl.BATCHINFO') /*배치정보*/,
			children: [
				{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plant', dataType: 'code' },
				{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetypedesc', dataType: 'code' },
				{ headerText: t('lbl.PICKING_DISTANCETYPE'), /*피킹(원거리)유형*/ dataField: 'distancetype', dataType: 'code' },
			],
		},
		{
			headerText: t('lbl.CREATEBASELINE') /*생성기준*/,
			children: [
				{ headerText: t('lbl.CREATEKEY'), /*생성키*/ dataField: 'createkey', dataType: 'code' },
				{ headerText: t('lbl.CREATEDESCR'), /*생성키명*/ dataField: 'createdescr' },
			],
		},
		{ headerText: t('lbl.SERIALYN'), /*식별번호유무*/ dataField: 'serialyn', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY_2'),
			/*주문량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.PROCESSQTY_WD'),
			/*분배량*/ dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.WD_STO_QTY'),
			/*STO할당량*/ dataField: 'stoqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.PROCESSOPENQTY'),
			/*미분배량*/ dataField: 'processopenqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableCellMerge: true,
		// 셀 병합 정책
		// "default"(기본값) : null 을 셀 병합에서 제외하여 병합을 실행하지 않습니다.
		// "withNull" : null 도 하나의 값으로 간주하여 다수의 null 을 병합된 하나의 공백으로 출력 시킵니다.
		// "valueWithNull" : null 이 상단의 값과 함께 병합되어 출력 시킵니다.
		cellMergePolicy: 'withNull',
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.carno == null || item.carno === '') {
				return false;
			}
			return true;
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'carno',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
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
		{
			dataField: 'stoqty',
			positionField: 'stoqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processopenqty',
			positionField: 'processopenqty',
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
				btnType: 'btn7',
				btnLabel: '차량별분배', // 차량별분배
				callBackFn: onClickBatch,
			},
			{
				btnType: 'btn9',
				btnLabel: 'STO분배', // STO분배
				callBackFn: onClickSTOBatch,
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.TO_CUSTNAME'), //배송인도처명
			dataField: 'toCustname',
			filter: { showIcon: true },
		},
		{ headerText: t('lbl.ORDERTYPE_WD'), /*주문유형*/ dataField: 'ordertypeDescr', dataType: 'code' },
		{
			headerText: t('lbl.CLOSEYN'), //마감여부
			dataField: 'omsFlag',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// omsFlag가 0이면 'Y', 0이 아니면 'N' 반환
				return value === 0 || value === '0' ? 'Y' : 'N';
			},
		},
		{ headerText: t('lbl.NONCLOSEQTY'), dataField: 'omsFlag', dataType: 'code' },
		{ headerText: t('lbl.SLIPCNT'), dataField: 'slipcnt', dataType: 'code' },
		{ headerText: t('lbl.SKUCNT'), dataField: 'skucnt', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO'), //수량정보
			children: [
				{
					headerText: t('lbl.ORDERQTY_2'),
					/*주문량*/ dataField: 'orderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.PROCESSQTY_WD'),
					/*분배량*/ dataField: 'processqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WORKQTY_WD'),
					/*피킹량*/ dataField: 'workqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.LOADSCANQTY'),
					/*상차스캔량*/ dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WDCONFIRMQTY_WD2'),
					/*출고확정량*/ dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{ headerText: t('lbl.WORKPROCESSCODE'), /*작업프로세스코드*/ dataField: 'workprocesscode', dataType: 'code' },
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.carno == null || item.carno === '') {
				return false;
			}
			return true;
		},
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'toCustkey',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
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
				btnType: 'btn2',
				btnLabel: '거래처별분배', // 거래처별분배
				callBackFn: onClickBatchDetail,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			ref.gridRef2.current.clearGridData();

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
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

		ref.gridRef2.current.bind('cellDoubleClick', function (event: any) {
			if (event.dataField === 'toCustkey') {
				return;
			}
			if (event.item.serialyn === 'Y' && event.item.workprocesscode === 'SO' && event.item.dccode !== '2170') {
				showAlert(null, '물류센터 식별번호유무 대상 고객출고는 PDA로 피킹작업을 하시기 바랍니다.');
				return;
			}
			selectRowData(ref.gridRef2.current.getSelectedRows());
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
			<CustomForm form={form}>
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ marginTop: '15px', marginBottom: '10px' }}>
								<GridTopBtn gridBtn={gridBtn} gridTitle="차량별분배목록" totalCnt={props.totalCnt} />
							</AGrid>
							<GridAutoHeight id="delivery-list-by-vehicle-grid">
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ marginTop: '15px', marginBottom: '10px' }}>
								<GridTopBtn gridBtn={gridBtn2} gridTitle="차량별분배상세" />
							</AGrid>
							<GridAutoHeight id="distribution-details-by-vehicle">
								<AUIGrid
									ref={ref.gridRef2}
									columnLayout={gridCol2}
									gridProps={gridProps2}
									footerLayout={footerLayout2}
								/>
							</GridAutoHeight>
						</>,
					]}
				/>
			</CustomForm>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

const CustomForm = styled(Form)`
	display: block;
	width: 100%;
	height: 100%;
`;

export default WdAllocationBatchGroupDetail4;
