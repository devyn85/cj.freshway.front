/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupDetail2.tsx
 # Description		: 출고재고분배-지정분배 Detail
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/
import { Form } from 'antd';
//CSS

//API

//Component
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { InputNumber, InputText } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { getTab2DetailList } from '@/api/wd/apiWdAllocationBatchGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import styled from 'styled-components';

const WdAllocationBatchGroupDetail2 = forwardRef((props: any, ref: any) => {
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
			organize: selectedRow[0].organize,
			sku: selectedRow[0].sku,
			serialyn: selectedRow[0].serialyn,
			toStockid: selectedRow[0].toStockid,
			toLoc: selectedRow[0].toLoc,
			zone: searchParams.zone,
		};

		getTab2DetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
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
	 * 지정분배
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();
		const selectedRow = ref.gridRef.current.getSelectedRows();

		const gridData = ref.gridRef2.current?.getGridData?.() || [];
		const sumQty = getGridColSum(gridData, 'allocateqty');
		const unprocessQty = form.getFieldValue('unprocessqty');

		if (sumQty <= 0) {
			showAlert(null, '할당할 수량이 없습니다.'); // 할당할 수량이 없습니다.
			return;
		}
		if (sumQty > unprocessQty) {
			showAlert(null, '주문량보다 많은량을 할당할수 없습니다.'); // 분배량이 미처리수량을 초과하였습니다.
			return;
		}

		if (selectedRow[0].dccode)
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['지정분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchTab2',
					avc_COMMAND: 'CONFIRM',
					dccode: selectedRow[0].dccode, // 물류센터
					storerkey: selectedRow[0].storerkey, // 거래처
					organize: selectedRow[0].organize, // 창고
					custkey: selectedRow[0].custkey, // 거래처키
					slipdt: selectedRow[0].slipdt, // 출고일자
					slipno: selectedRow[0].slipno, // 출고번호
					slipline: selectedRow[0].slipline, // 출고라인
					serialyn: selectedRow[0].serialyn, // 식별번호유무
					sku: selectedRow[0].sku, // 상품코드
					allocfixtype: searchParams.allocfixtype, // 선피킹조건
					dataKey: 'saveTab2List',
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
		{ headerText: t('lbl.SLIPNO'), /*전표번호*/ dataField: 'docno', dataType: 'code' },
		{ headerText: t('lbl.DOCLINE'), /*품목번호*/ dataField: 'docline', dataType: 'code' },
		{ headerText: t('lbl.STATUS_WD'), /*진행상태*/ dataField: 'status', dataType: 'code' },
		{ headerText: t('lbl.SKUGROUP'), /*상품분류*/ dataField: 'skugroup', dataType: 'code' },
		{
			headerText: t('lbl.SKU') /*상품코드*/,
			dataField: 'sku',
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
			headerText: t('lbl.SKUNAME') /*상품명칭*/,
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{ headerText: t('lbl.SERIALYN'), /*식별번호유무*/ dataField: 'serialyn', dataType: 'code' },
		{
			headerText: t('lbl.ORIORDERQTY2'),
			/*원주문수량*/ dataField: 'orderqtySt',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.ORDERQTY_WD'),
			/*주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.PROCESSQTY_WD'),
			/*분배량*/ dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.STOCKID'), /*개체식별/소비이력*/ dataField: 'toStockid', dataType: 'code' },
		{ headerText: t('lbl.LOC'), /*LOC*/ dataField: 'toLoc', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'docno',
		},
		{
			dataField: 'orderqtySt',
			positionField: 'orderqtySt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
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
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.ORGANIZE'),
			/*창고*/ dataField: 'organize',
			dataType: 'code',
			editable: false,
		},
		{ headerText: t('lbl.LOC'), /*로케이션*/ dataField: 'loc', dataType: 'code', editable: false },
		{
			headerText: t('lbl.SKU') /*상품코드*/,
			dataField: 'sku',
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
			editable: false,
		},
		{
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{ headerText: t('lbl.MC'), /*상품분류*/ dataField: 'mc', dataType: 'code', editable: false },
		{
			headerText: t('lbl.QTY_ST'),
			/*현재고수량*/ dataField: 'qty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.OPENQTY_ST'),
			/*가용재고수량*/ dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.DECIDEQTY'),
			/*지정량*/ dataField: 'allocateqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code', editable: false },
		{
			headerText: t('lbl.STOCKTYPE'),
			/*재고위치*/ dataField: 'stocktypename',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.LOTTABLE01'),
			/*기준일(소비,제조)*/ dataField: 'lottable01',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALNO'),
			/*이력번호*/ dataField: 'serialno',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.BOXBARCODE'),
			/*박스바코드*/ dataField: 'boxbarcode',
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: true,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'allocateqty',
			positionField: 'allocateqty',
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
				btnType: 'btn6',
				btnLabel: '지정분배', // 지정분배
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

			const setParam = {
				sku: ref.gridRef.current.getSelectedRows()[0].sku,
				skuname: ref.gridRef.current.getSelectedRows()[0].skuname,
				unprocessqty:
					ref.gridRef.current.getSelectedRows()[0].orderqty - ref.gridRef.current.getSelectedRows()[0].processqty,
			};
			form.setFieldsValue(setParam); // 미할당량

			searchDtl();
		});

		ref.gridRef2.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = ref.gridRef2.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'allocateqty') {
				return true;
			} else {
				return false; // 다른 필드들은 편집 허용 안함
			}
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
			<Form form={form} className="h100">
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<GridTopBtn
								gridBtn={gridBtn}
								gridTitle="지정분배목록"
								totalCnt={props.totalCnt}
								style={{ margin: '15px 0px 10px' }}
							/>
							<GridAutoHeight id="designated-distribution-list">
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
							</GridAutoHeight>
						</>,
						<>
							<CustomUiDetailViewArea>
								<UiDetailViewGroup className="grid-column-4">
									<li>
										<InputText name="sku" label={t('lbl.SKU')} disabled={true} /> {/* 상품코드 */}
									</li>
									<li>
										<InputText name="skuname" label={t('lbl.SKUNAME')} disabled={true} /> {/* 상품명 */}
									</li>
									<li>
										<InputNumber name="unprocessqty" label={t('lbl.UNPROCESSQTY_WD')} min={0} disabled={true} />{' '}
										{/* 미할당량 */}
									</li>
								</UiDetailViewGroup>
							</CustomUiDetailViewArea>
							<GridTopBtn
								gridBtn={gridBtn2}
								gridTitle="지정분배상세"
								style={{
									margin: '15px 0px 10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							/>
							<GridAutoHeight id="designated-distribution-details">
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
			</Form>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

const CustomUiDetailViewArea = styled(UiDetailViewArea)`
	margin-bottom: 0px !important;
	margin-top: 15px;
`;

export default WdAllocationBatchGroupDetail2;
