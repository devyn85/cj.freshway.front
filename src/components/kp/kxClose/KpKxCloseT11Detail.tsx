// lib
import { Form } from 'antd';

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// store

// API Call Function
import { apiGetKxSubulDayDtlList, apiGetKxSubulDayList } from '@/api/kp/apiKpKxClose';

// util

// hook

// type

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import { CheckBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import styled from 'styled-components';

const KpKxCloseT11Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// grid Ref
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	ref.gridRef3 = useRef();
	const [totalCntGrid2, setTotalCntGrid2] = useState(0);
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [originData, setOriginData] = useState([]); // 필터 사용 전 원본 데이터

	const qtyColorFunc = (_rowIndex: number, _columnIndex: number, _value: any, _headerText: string, item: any) => {
		// 상태에 따른 스타일 적용 - CLASS명 반환
		if (item.kxQty !== item.fwQty) {
			return 'bg-warning';
		}
	};

	//마스터 그리드 생성시 필요한 변수들
	const gridCol = [
		{
			headerText: t('lbl.ORGANIZE'),
			dataField: 'organize',
			dataType: 'text',
		},
		{
			headerText: t('lbl.SKU2'),
			dataField: 'sku',
			dataType: 'text',
		},
		{
			headerText: 'KX' + t('lbl.CONFIRMQTY'),
			dataField: 'kxQty',
			dataType: 'numeric',
			styleFunction: qtyColorFunc,
		},
		{
			headerText: 'FW' + t('lbl.CONFIRMQTY'),
			dataField: 'fwQty',
			dataType: 'numeric',
			styleFunction: qtyColorFunc,
		},
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// AUIGrid 옵션
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		// width: '10%',
	};

	const gridCol2 = [
		{
			headerText: t('lbl.ORGANIZE'),
			dataField: 'organize',
			dataType: 'text',
		},
		{
			headerText: t('lbl.SKU2'),
			dataField: 'sku',
			dataType: 'text',
		},
		{
			headerText: t('lbl.DATE'),
			dataField: 'deliveryDate',
		},
		{
			headerText: 'KX' + t('lbl.CONFIRMQTY'),
			dataField: 'kxQty',
			dataType: 'numeric',
			styleFunction: qtyColorFunc,
		},
		{
			headerText: 'FW' + t('lbl.CONFIRMQTY'),
			dataField: 'fwQty',
			dataType: 'numeric',
			styleFunction: qtyColorFunc,
		},
	];

	const gridColDtl = [
		{
			headerText: t('lbl.GUBUN_2'), // '구분'
			dataField: 'dataDiv',
			dataType: 'text',
		},
		{
			headerText: t('lbl.PLANT'), // '플랜트'
			dataField: 'plant',
			dataType: 'text',
		},
		{
			headerText: t('lbl.ORGANIZE'), // '창고'
			dataField: 'storageLoc',
			dataType: 'text',
		},
		{
			headerText: 'KX' + t('lbl.CENTER_CODE'), // 'KX 센터코드'
			dataField: 'kxDcCode',
			dataType: 'text',
		},
		{
			headerText: 'KX' + t('lbl.CENTER_NAME'), // 'KX 센터명'
			dataField: 'kxDcName',
			dataType: 'text',
		},
		{
			headerText: t('lbl.DELIVERYDATE'), // '배송일자'
			dataField: 'deliveryDate',
			dataType: 'text',
		},
		{
			headerText: t('lbl.SKUCD'), // '상품코드'
			dataField: 'sku',
			dataType: 'text',
		},
		{
			headerText: t('lbl.STORAGELOC'), // '저장위치'
			dataField: 'stockType',
			dataType: 'text',
		},
		{
			headerText: t('lbl.BASE_STOCK'), // '기초재고'
			dataField: 'passQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.RECEIPTQTY'), // '입고량'
			dataField: 'receiptQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.WDQTY'), // '출고량'
			dataField: 'orderQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.END_STOCK'), // '기말재고'
			dataField: 'stockQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.AJQTY') + '(' + t('lbl.SURPLUSQTY') + '-' + t('lbl.DECREASEQTY') + ')', // '조정량(역감모-감모)'
			dataField: 'adjustQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.OWNERSHIP_TRANSFER') + '(toFW-toKX)', // '소유권이전(toFW-toKX)'
			dataField: 'transferQty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.DEFECTIVE_CONVERSION'), // '불량전환'
			dataField: 'damageQty',
			align: 'right',
			dataType: 'numeric',
		},
	];

	// AUIGrid 옵션
	const gridRefDocDtlProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		enableCellMerge: true, // 셀 병합 기능 활성화
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	// const initEvent = () => {};

	/**
	 * 일별 수불비교 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDay = () => {
		ref.gridRef2.current.clearGridData();
		ref.gridRef3.current.clearGridData();

		const selectedRow = ref.gridRef1.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
			// setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				deliveryDate: selectedRow[0].deliveryDate,
				organize: selectedRow[0].organize,
				sku: selectedRow[0].sku,
			};

			apiGetKxSubulDayList(params).then(res => {
				const gridData = res.data;
				ref.gridRef2.current.setGridData(gridData);
				setTotalCntGrid2(gridData.length);

				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRef2.current.setColumnSizeList(ref.gridRef2.current.getFitColumnSizeList(true));

				// 첫 행 선택 및 상세조회
				if (gridData.length > 0) {
					ref.gridRef2.current.setSelectionByIndex(0, 0);
					searchDtl();
				}
			});
		} else {
			return;
		}
	};

	/**
	 * 일별 수불비교 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = () => {
		ref.gridRef3.current.clearGridData();

		const selectedRow = ref.gridRef2.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef2.current.isAddedById(selectedRow[0]._$uid)) {
			// setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				deliveryDate: selectedRow[0].deliveryDate,
				organize: selectedRow[0].organize,
				sku: selectedRow[0].sku,
			};

			apiGetKxSubulDayDtlList(params).then(res => {
				const gridData = res.data;
				ref.gridRef3.current.setGridData(gridData);
				setTotalCntDtl(gridData.length);

				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRef3.current.setColumnSizeList(ref.gridRef3.current.getFitColumnSizeList(true));
			});
		} else {
			return;
		}
	};

	const onValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.minusSubulYn) {
			// 체크했을 때
			const filtered = originData.filter(item => item.kxQty !== item.fwQty);
			ref.gridRef1.current.setGridData(filtered);
		} else {
			ref.gridRef1.current.setGridData(originData);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	let prevRowIndex: any = null;
	useEffect(() => {
		// initEvent();
		ref.gridRef1?.current.resize(); // 그리드 크기 조정
		ref.gridRef2?.current.resize(); // 그리드 크기 조정
		ref.gridRef3?.current.resize(); // 그리드 크기 조정

		// 행 변경 시
		ref.gridRef1?.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDay();
		});

		let prevRowIndex2: any = null;
		// 그룹 코드 그리드 행 변경 시
		ref.gridRef2?.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex2) return;

			// 이전 행 인덱스 갱신
			prevRowIndex2 = event.primeCell.rowIndex;

			searchDtl();
		});
	}, []);

	useEffect(() => {
		// 상세 초기화
		const gridRefCur1 = ref.gridRef1.current;

		if (gridRefCur1) {
			setOriginData(props.data);
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			searchDay();

			if (props.data?.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<CustomAGrid>
							<GridTopBtn
								gridBtn={gridBtn1}
								gridTitle={'월간 수불비교 '}
								totalCnt={props.totalCnt}
								extraContentLeft={
									<span className="msg">
										kx의 수불에 내역이 반영되는데 1일 소요됨, (-)수불건 모니터링에는 월간수불비교에선 수량이 무조건
										0으로 표시됨
									</span>
								}
							>
								<Form layout="inline" form={form} onValuesChange={onValuesChange}>
									{/* <CheckBox label={'테스트'} name="minusSubulYn" /> */}
									<span style={{ marginRight: 1 }}>
										<CheckBox name="minusSubulYn" className="bg-white">
											{' '}
											{'오류건 필터'}{' '}
										</CheckBox>
									</span>
								</Form>
							</GridTopBtn>
						</CustomAGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<Splitter
						key="KpKxClose-right-splitter"
						direction="vertical"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid style={{ padding: '10px 0' }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'일별 수불비교'} totalCnt={totalCntGrid2} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid style={{ padding: '10px 0' }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'KX일별 수불 상세내역'} totalCnt={totalCntDtl} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRef3} columnLayout={gridColDtl} gridProps={gridRefDocDtlProps} />
								</GridAutoHeight>
							</>,
						]}
					/>,
				]}
			/>
		</>
	);
});

export default KpKxCloseT11Detail;

const CustomAGrid = styled(AGrid)`
	margin-bottom: 0 !important;
	.title-area {
		height: auto !important;
		padding: 10px 0;
		margin-bottom: 0;
	}
`;
