/*
 ############################################################################
 # FiledataField	: WdPickingCancelDetail.tsx
 # Description		: 피킹취소처리(Detail)
 # Author			: 공두경
 # Since			: 25.06.10
 ############################################################################
*/

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
import { Tabs } from 'antd';
import dayjs from 'dayjs';
const { TabPane } = Tabs;
// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';
// API Call Function
import { apiGetDetailList, apiSaveBatch } from '@/api/wd/apiWdPickingCancel';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

const WdPickingCancelDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef();
	ref.gridRef4 = useRef(null);
	const { t } = useTranslation();
	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const prevRowItem1 = useRef<any>(null);
	const prevRowItem2 = useRef<any>(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = (key: any) => {
		let gridRefCur = ref.gridRef1.current;
		if (key === '2') {
			gridRefCur = ref.gridRef3.current;
		}
		const selectedRow = gridRefCur.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			organize: selectedRow[0].organize,
			slipdt: selectedRow[0].slipdt,
			slipno: selectedRow[0].slipno,
			sku: searchParams.sku,
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			let gridRefCur1 = ref.gridRef2.current;
			if (key === '2') {
				gridRefCur1 = ref.gridRef4.current;
			}
			gridRefCur1?.setGridData(gridData);
			//setTotalCnt(res.data.length);
			const colSizeList = gridRefCur1?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRefCur1?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @returns {void}
	 */
	const savePicking = () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['지정취소']), () => {
			const params = {
				apiUrl: '/api/wd/pickingCancel/v1.0/savePicking',
				avc_COMMAND: 'CANCEL_FIXPICK',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
			/* apiSavePicking(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
					return;
				}
			}); */
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @returns {void}
	 */
	const saveBatch = () => {
		const checkedRows = ref.gridRef3.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['일괄취소']), () => {
			const params = {
				avc_COMMAND: 'BATCHCANCEL',
				saveBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveBatch(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
				}
				props.search();
			});
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		props.setActiveKey(key);
		if (key === '1') {
			ref.gridRef1.current?.resize('100%', '100%');
			ref.gridRef2.current?.resize('100%', '100%');
		} else {
			ref.gridRef3.current?.resize('100%', '100%');
			ref.gridRef4.current?.resize('100%', '100%');
		}
		return;
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol1 = [
		{ headerText: '출고일자', dataField: 'slipdt', dataType: 'date' },
		{ headerText: 'POP번호', dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: '주문유형', dataField: 'ordertype', dataType: 'code' },
		{
			headerText: '고객',
			children: [
				{ headerText: '관리처코드', dataField: 'toCustkey', dataType: 'code' },
				{ headerText: '배송인도처명', dataField: 'toCustname' },
			],
		},
		{ headerText: '고객주소', dataField: 'toAddressDisp' },
		{ headerText: '주문번호', dataField: 'docno', dataType: 'code' },
		{ headerText: '영업경로', dataField: 'channel', dataType: 'code' },
		{ headerText: '진행상태', dataField: 'status', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps1 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout1 = [{}];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			editable: false,
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
			headerText: '상품명칭',
			dataField: 'skuname',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code', editable: false },
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.###', editable: false },
		{ headerText: '피킹량', dataField: 'workqty', dataType: 'numeric', formatString: '#,##0.###', editable: false },
		{
			headerText: '출고검수량',
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			headerText: '확정수량',
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			headerText: '피킹취소량',
			dataField: 'cancelqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true, // 기본적으로 소수점 비허용 (KG일 때만 동적으로 허용)
				validator: function (oldValue: any, newValue: any, item: any) {
					const isKg = item.uom?.toUpperCase() === 'KG';
					if (!isKg && String(newValue).includes('.')) {
						return { validate: false, message: 'KG 단위만 소수점 입력이 가능합니다.' };
					}
					return { validate: true };
				},
			},
			table: false,
		},
		{ headerText: '단위', dataField: 'uom', dataType: 'code', editable: false },
		{ headerText: '피킹LOC', dataField: 'loc', dataType: 'code', editable: false },
		{
			headerText: t('lbl.MANUFACTUREDT'),
			dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
			},
		}, //제조일자
		{
			headerText: t('lbl.EXPIREDT'),
			dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
			},
		}, //소비일자
		{ headerText: '소비기간', dataField: 'duration', dataType: 'code', editable: false },
		{ headerText: '취소적재LOC', dataField: 'cancelloc', dataType: 'code', editable: false },
		{ headerText: '피킹작업자', dataField: 'picker', dataType: 'code', editable: false },
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps2 = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout2 = [
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.###',
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
				btnType: 'save', // 저장
				callBackFn: savePicking,
			},
		],
	};

	//그리드 컬럼
	const gridCol3 = [
		{ headerText: '출고일자', dataField: 'slipdt', dataType: 'date' },
		{ headerText: 'POP번호', dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: '주문유형', dataField: 'ordertype', dataType: 'code' },
		{
			headerText: '고객',
			children: [
				{
					headerText: '관리처코드',
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
					headerText: '배송인도처명',
					dataField: 'toCustname',
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{ headerText: '고객주소', dataField: 'toAddressDisp' },
		{ headerText: '주문번호', dataField: 'docno', dataType: 'code' },
		{ headerText: '영업경로', dataField: 'channel', dataType: 'code' },
		{ headerText: '진행상태', dataField: 'status', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout3 = [{}];

	// 그리드 버튼
	const gridBtn3: GridBtnPropsType = {
		tGridRef: ref.gridRef3, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveBatch,
			},
		],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol4 = [
		{
			headerText: '상품코드',
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
			headerText: '상품명칭',
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '피킹량', dataField: 'workqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '출고검수량', dataField: 'inspectqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '확정수량', dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '피킹LOC', dataField: 'loc', dataType: 'code' },
		{
			headerText: '제조일자',
			dataField: 'manufacturedt',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
			},
		},
		{
			headerText: '소비일자',
			dataField: 'expiredt',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
			},
		},
		{ headerText: '소비기간', dataField: 'duration', dataType: 'code' },
		{ headerText: '취소적재LOC', dataField: 'cancelloc', dataType: 'code' },
		{ headerText: '피킹작업자', dataField: 'picker', dataType: 'code' },
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps4 = {
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

	// FooterLayout Props(상세목록 그리드)
	const footerLayout4 = [
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn4: GridBtnPropsType = {
		tGridRef: ref.gridRef4, // 타겟 그리드 Ref
		btnArr: [],
	};

	// grid data 변경 감지
	useEffect(() => {
		let gridRefCur1 = ref.gridRef1.current;
		if (props.activeKey === '2') {
			gridRefCur1 = ref.gridRef3.current;
		}
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);

				if (props.activeKey === '2') {
					searchDtl('2');
				} else {
					searchDtl('1');
				}
			} else {
				if (props.activeKey === '1') {
					ref.gridRef2.current.clearGridData();
				} else {
					ref.gridRef4.current.clearGridData();
				}
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef1.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem1.current || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem1.current = event.primeCell.item;

			// 상세코드 조회
			searchDtl('1');
		});

		ref.gridRef2.current.bind('selectionChange', function (event: any) {
			const primeCell = event.primeCell;
			if (primeCell && primeCell.dataField === 'cancelqty') {
				// uom이 KG인 경우에만 소수점 입력을 허용하도록 동적으로 변경합니다.
				const allowPoint = primeCell.item.uom?.toUpperCase() === 'KG';
				ref.gridRef2.current.setEditRendererProp(primeCell.dataField, { allowPoint });
			}
		});

		ref.gridRef2.current.bind('cellEditBegin', function (event: any) {
			if (event.dataField == 'cancelqty') {
				return true;
			} else {
				return false; // 다른 필드들은 편집 허용 안함
			}
		});
	}, []);

	useEffect(() => {
		if (props.activeKey === '2' && ref.gridRef3.current) {
			// 기존 이벤트 해제(중복 방지)
			ref.gridRef3.current.unbind && ref.gridRef3.current.unbind('selectionChange');
			// 이벤트 바인딩
			ref.gridRef3.current.bind('selectionChange', function (event: any) {
				// 선택된 Row의 item이 다를 경우에만 검색
				if (event.primeCell.item === prevRowItem2.current) return;

				// 이전 행 item 갱신
				prevRowItem2.current = event.primeCell.item;

				searchDtl('2');
			});
		}
	}, [props.activeKey, ref.gridRef3.current]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '지정취소',
			children: (
				<Splitter
					key="cancel-designation-splitter"
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn1} gridTitle="피킹취소처리목록" totalCnt={props.totalCnt} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef1}
									columnLayout={gridCol1}
									gridProps={gridProps1}
									footerLayout={footerLayout1}
								/>
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn2} gridTitle="피킹취소처리상세" />
							</AGrid>
							<GridAutoHeight>
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
			),
		},
		{
			key: '2',
			label: '일괄취소',
			children: (
				<Splitter
					key="bulk-cancellation-splitter"
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn3} gridTitle="피킹취소처리목록" totalCnt={props.totalCnt} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef3}
									columnLayout={gridCol3}
									gridProps={gridProps3}
									footerLayout={footerLayout3}
								/>
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn4} gridTitle="피킹취소처리상세" />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef4}
									columnLayout={gridCol4}
									gridProps={gridProps4}
									footerLayout={footerLayout4}
								/>
							</GridAutoHeight>
						</>,
					]}
				/>
			),
		},
	];
	return (
		<>
			{/* 그리드 영역 */}

			<TabsArray activeKey={props.activeKey} onChange={tabClick} items={tabItems} />

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdPickingCancelDetail;
