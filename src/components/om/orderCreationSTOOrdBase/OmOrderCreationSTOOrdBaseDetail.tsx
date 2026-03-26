/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseDetail.tsx
 # Description		: 주문 > 주문등록 > 당일광역보충발주
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// store

// API Call Function
import { apiGetBatchResultDetailList, apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTOOrdBase';

// util

// types
import { SelectBox } from '@/components/common/custom/form';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import TabsArray from '@/components/common/TabsArray';
import { GridBtnPropsType } from '@/types/common';
interface OmOrderCreationSTOOrdBaseDetailProps {
	activeTabKey: string;
	setActiveTabKey: React.Dispatch<React.SetStateAction<string>>;
	gridRef?: any;
	gridRef2?: any;
	gridRef3?: any;
	form?: any;
	gridData?: Array<object>;
	gridData2?: Array<object>;
	gridData3?: Array<object>;
	gridData4?: Array<object>;
	search?: any;
	dccode?: string;
	searchVal?: any;
	searchParams?: any;
	totalCnt: number;
	setTotalCnt: any;
}

const OmOrderCreationSTOOrdBaseDetail = forwardRef((props: OmOrderCreationSTOOrdBaseDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const {
		activeTabKey,
		setActiveTabKey,
		gridRef2,
		gridRef3,
		form,
		gridData,
		gridData2,
		gridData3,
		search,
		dccode,
		searchVal,
		searchParams,
		totalCnt,
		setTotalCnt,
	} = props;
	// const gridRef2 = useRef(null);
	// const [totalCnt, setTotalCnt] = useState(0);
	const [gridData4, setGridData4] = useState<any[]>([]);
	const gridRef4 = useRef<any>(null);

	const { t } = useTranslation();
	//Antd Form 사용

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 자동발주내역 그리드 초기화
	const gridCol = [
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					commRenderer: {
						type: 'search',
						onClick: function (e: any) {
							// 기존 행
							gridRef.current.openPopup(e.item, 'sku');
						},
					},
					editable: false,
					minWidth: 90,
				},
				{
					dataField: 'description',
					headerText: t('lbl.SKUNAME'), // 상품명칭
					editable: false,
				},
			],
		},
		{
			dataField: 'stockgrade',
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ORDER'), // 주문단위
			editable: false,
		},
		{
			headerText: '재고량',
			children: [
				{
					dataField: 'openqty1',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty2',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty3',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty4',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty5',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty6',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'openqty9',
					headerText: t('lbl.SUPDCCODE'), // 발주센터
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			dataField: 'dpQty',
			headerText: t('lbl.DPINPLAN'), // 입고예정
			filter: {
				showIcon: true,
			},
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'stoOrderqty',
			headerText: t('lbl.SO_STO_ORDERQTY'), // SO-STO 통합피킹 이체량
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_2'), // 주문량
			filter: {
				showIcon: true,
			},
			formatString: '#,##0.###',
			dataType: 'numeric',
			editable: false,
		},

		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY_WD'), // 분배량
			filter: {
				showIcon: true,
			},
			formatString: '#,##0.###',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'reqOrderqty',
			headerText: '발주예정',
			formatString: '#,##0.###',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'calQty',
			headerText: '미발주량',
			expFunction: function (rowIndex: any, columnIndex: any, item: any, dataField: any) {
				// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
				// 1~2 분기 합을 계산하여 반환
				// expFunction 의 리턴형은 항상 Number 여야 합니다.(즉, 수식만 가능)
				return item.reqOrderqty - (item.req1 + item.req2 + item.req3 + item.req4 + item.req5 + item.req6);
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				const cal = item.reqOrderqty - (item.req1 + item.req2 + item.req3 + item.req4 + item.req5 + item.req6);
				if (cal > 0) {
					return 'dec-plus';
				} else if (cal < 0) {
					return 'dec-minus';
				}
			},
			formatString: '#,##0.###',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: '발주량(STO)',
			children: [
				{
					dataField: 'sum',
					headerText: t('lbl.TOTAL'), // 합계
					expFunction: function (rowIndex: any, columnIndex: any, item: any, dataField: any) {
						// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
						// 1~2 분기 합을 계산하여 반환
						// expFunction 의 리턴형은 항상 Number 여야 합니다.(즉, 수식만 가능)
						return item.req1 + item.req2 + item.req3 + item.req4 + item.req5 + item.req6;
					},
					formatString: '#,##0.###',
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'req1',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
				{
					dataField: 'req2',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
				{
					dataField: 'req3',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
				{
					dataField: 'req4',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
				{
					dataField: 'req5',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
				{
					dataField: 'req6',
					headerText: '미선택',
					formatString: '#,##0.###',
					dataType: 'numeric',
				},
			],
		},
	];

	const gridCol2 = [
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					headerText: t('lbl.DCCODE'), // 물류센터
					dataField: 'fromDccode',
				},
				{
					headerText: t('lbl.DCNAME'), // 물류센터명
					dataField: 'fromDcname',
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					headerText: t('lbl.DCCODE'), // 물류센터
					dataField: 'toDccode',
				},
				{
					headerText: t('lbl.DCNAME'), // 물류센터명
					dataField: 'toDcname',
				},
			],
		},
		{
			headerText: t('lbl.SKU'), // 상품코드
			dataField: 'toSku',
		},
		{
			headerText: t('lbl.SKUNAME'), // 상품명칭
			dataField: 'description',
		},
		{
			headerText: t('lbl.UOM'), // 단위
			dataField: 'toUom',
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataField: 'toStocgrade',
		},
		{
			headerText: t('lbl.TRANQTY'), // 작업수량
			dataField: 'toOrderqty',
		},
		{
			headerText: '',
			children: [
				{
					headerText: 'PROCESSFLAG',
					dataField: 'processflag',
				},
				{
					headerText: 'PROCESSMSG',
					dataField: 'processmsg',
				},
			],
		},
	];

	const gridCol3 = [
		{
			headerText: t('lbl.DOCDT'), // 문서일자
			dataField: 'docdt',
		},
		{
			headerText: t('lbl.DOCNO'), // 문서번호
			dataField: 'docno',
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급받는센터
			dataField: 'dccode',
		},
		{
			headerText: t('lbl.DCNAME'), // 센터명
			dataField: 'dcname',
		},
		{
			headerText: t('lbl.DOCDT_STO'), // 이체일자
			dataField: 'deliverydate',
		},
		{
			headerText: t('lbl.STATUS'), // 상태
			dataField: 'status',
		},
		{
			headerText: t('lbl.IF_DATE'), // 전송시간
			dataField: 'ifDate',
		},
	];

	const gridCol4 = [
		{
			headerText: t('lbl.DOCDT'), // 문서일자
			dataField: 'docdt',
		},
		{
			headerText: t('lbl.DOCNO'), // 문서번호
			dataField: 'docno',
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 센터코드
			dataField: 'dccode',
		},
		{
			headerText: t('lbl.DCNAME'), // 센터명
			dataField: 'dcname',
		},
		{
			headerText: t('lbl.PLT_INOUT_TYPE'), // 입출고구분
			dataField: 'doctype',
			labelFunction: function (rowIndex: number, columnIndex: number, value: string) {
				if (value === 'WD') return '출고';
				if (value === 'DP') return '입고';
				return value;
			},
		},
		{
			headerText: t('lbl.SKUCD'), // 상품코드
			dataField: 'sku',
		},
		{
			headerText: t('lbl.SKU'), // 상품코드
			dataField: 'sku',
		},
		{
			headerText: t('lbl.ORDERUNIT'), // 오더단위
			dataField: 'UOM',
		},
		{
			headerText: t('lbl.ORIORDERQTY2'), // 고객최초주문수량
			dataField: 'orderqty',
		},
		{
			headerText: t('lbl.ROUTEINSPECTQTY'), // 검수수량
			dataField: 'inspectqty',
		},
		{
			headerText: t('lbl.CONFIRMQTY'), // 작업수량
			dataField: 'confirmqty',
		},
	];

	// 자동발주내역 그리드 속성
	const gridProps = {
		editable: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		showFooter: true,
	};

	// 처리결과
	const gridProps2 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	// 처리결과
	const gridProps3 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	// 처리결과
	const gridProps4 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	const searchDetail = async (row: any) => {
		const res = await apiGetBatchResultDetailList({
			docno: row.docno,
			dccode: row.dccode,
			deliverydate: row.deliverydate,
		});

		const data = res.data || [];
		setGridData4(data);

		if (gridRef4?.current) {
			gridRef4.current.setGridData(data);
		} else {
			//console.log('grid4 아직 생성 안됨');
		}
	};

	// FooterLayout Props
	// 상세목록 그리드 footerLayout1 (summary row, XML 기준, 한글 주석)
	const footerLayout = [
		{
			dataField: 'req1',
			positionField: 'req1',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
		{
			dataField: 'req2',
			positionField: 'req2',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
		{
			dataField: 'req3',
			positionField: 'req3',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
		{
			dataField: 'req4',
			positionField: 'req4',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
		{
			dataField: 'req5',
			positionField: 'req5',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
		{
			dataField: 'req6',
			positionField: 'req6',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
	];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const setSaveParams = () => {
		const params = gridRef.current.getCheckedRowItemsAll();
		const dccodes = ['dcA', 'dcB', 'dcC', 'dcD', 'dcE', 'dcF'];
		const reqDatas = ['req1', 'req2', 'req3', 'req4', 'req5', 'req6'];
		const saveData: any = [];
		const supplyCenterValues = dccodes.map(key => searchParams[key]);
		params.forEach((rowItem: any, rowIndex: any) => {
			// 1. 체크 여부 확인 (AUIGrid에서는 이미 getCheckedRowItemsAll()로 필터링됨)
			// AS-IS: if ( ds_header.GetColumn(i, "CHECKYN") == "1" ) { ... } 에 해당

			// 2. 변환 로직
			const formattedDocnoList = rowItem.docnoList
				.split(',') // 콤마를 기준으로 잘라서 배열 생성 -> ["4218251980", "4218258130"]
				.map((item: any) => `'${item}'`) // 각 항목 앞뒤에 홀따옴표 추가 -> ["'4218251980'", "'4218258130'"]
				.join(','); // 다시 콤마로 연결 -> "'4218251980','4218258130'"
			// 2. 공급 센터 1순위부터 6순위까지 반복 처리
			for (let i = 0; i < dccodes.length; i++) {
				const fromDccode = supplyCenterValues[i]; // nDcA, nDcB, ... 값
				const reqQty = rowItem[reqDatas[i]]; // REQ1, REQ2, ... 값

				// 조건 확인: 요청 수량이 0보다 크고 (reqX > 0) && 공급센터 값이 비어있지 않은 경우 (!gfn_isEmpty(nDcX))
				if (reqQty > 0 && fromDccode) {
					// 새로운 행(데이터 객체) 생성
					const newTargetRow = {
						// 저장 행 정보
						calQty: rowItem.calQty,
						// FROM (공급 센터) 정보
						fromStorerkey: rowItem.storerkey,
						fromDccode: fromDccode,
						fromOrganize: fromDccode,
						fromArea: '1000',
						fromSku: rowItem.sku,
						fromUom: rowItem.uom,
						fromStockgrade: rowItem.stockgrade,

						// TO (수요 센터) 정보
						toStorerkey: rowItem.storerkey,
						toDccode: rowItem.dccode,
						toOrganize: rowItem.dccode,
						toArea: '1000',
						toSku: rowItem.sku,
						toUom: rowItem.uom,
						toStockgrade: rowItem.stockgrade,
						toOrderqty: reqQty, // req1, req2, ... 값

						// docnoList 주문받은 내역만 수정
						docnoList: formattedDocnoList,
						// 우선순위
						workNo: i + 1,
					};

					saveData.push(newTargetRow);
				}
			}
		});

		return saveData;
	};

	/**
	 * 상세정보 수정사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		if (!searchParams?.deliverydate) {
			showMessage({
				content: '이체일자를 입력하십시요.',
				modalType: 'info',
			});
			return;
		}
		// 변경 데이터 확인
		const params = gridRef.current.getCheckedRowItemsAll();
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}
		const saveList = setSaveParams().map((items: any) => {
			return {
				...items,
				dailyDeadlineSto: searchParams.custorderclosetype,
			};
		});
		const saveParams = {
			processtype: 'SPOM_ORDERCREATIONSTO_OB',
			avc_COMMAND: 'CONFIRM',
			stotype: 'STO',
			stoStoragetype: form.getFieldValue('stoStoragetype'),
			deliverydate: searchParams.deliverydate,
			dccode: searchParams.dccode,
			saveList: saveList,
		};

		// const insertData = saveList.filter((item: any) => {
		// 	return item.calQty == 0;
		// });
		// const updateData = saveList.filter((item: any) => {
		// 	return item.calQty != 0;
		// });
		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${saveList.length}건
				수정 : 0건
				삭제 : 0건`;

		if (saveList.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}
		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(saveParams).then((res: any) => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							// search();
						},
					});
					tabClick('2');
					if (res.data.length > 0) {
						gridRef2.current.setGridData(res.data);
						const colSizeList1 = gridRef2?.current.getFitColumnSizeList(true);
						gridRef2?.current.setColumnSizeList(colSizeList1);
					}
				}
			});
		});
	};
	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save',
					callBackFn: saveMasterList,
				},
			],
		};
		return gridBtn;
	};

	/**
	 * 처리결과 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 처리결과 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 처리결과 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '이체대상',
			children: (
				<>
					<AGrid style={{ marginTop: '15px' }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={setGridBtn()} totalCnt={totalCnt}>
							<li>
								<Form form={form}>
									<SelectBox
										label="STO유형"
										name="stoStoragetype"
										options={[
											{ comCd: 'STO', cdNm: '일반STO' },
											{ comCd: 'OSTO', cdNm: '주문STO' },
										]}
										defaultValue="STO"
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										className="bg-white"
										style={{ width: '100px' }}
									/>
								</Form>
							</li>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: t('lbl.RESULTMSG'), // 처리결과
			children: (
				<>
					<AGrid className="h100" style={{ marginTop: '15px' }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} />
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</AGrid>
				</>
			),
		},
		{
			key: '3',
			// label: t('lbl.BATCHRESULT'), // 배치처리결과
			label: '배치처리결과',
			children: (
				<>
					<AGrid className="h50">
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn3} />
						<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
					</AGrid>
					<AGrid className="h100">
						<GridTopBtn gridTitle={t('lbl.LIST')} />
						<AUIGrid ref={gridRef4} columnLayout={gridCol4} gridProps={gridProps4} />
					</AGrid>
				</>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveTabKey('1');

			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef2.current) {
				gridRef2.current?.resize('100%', '100%');
			}
			if (gridRef3?.current || gridRef4?.current) {
				gridRef3.current?.resize('100%', '30%');
				gridRef4.current?.resize('100%', '70%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (gridRef2.current) {
				gridRef2.current?.resize('100%', '100%');
			}
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef3?.current || gridRef4?.current) {
				gridRef3.current?.resize('100%', '30%');
				gridRef4.current?.resize('100%', '70%');
			}
		} else {
			setActiveTabKey('3');
			if (gridRef3?.current || gridRef4?.current) {
				gridRef3.current?.resize('100%', '30%');
				gridRef4.current?.resize('100%', '70%');
			}
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef2.current) {
				gridRef2.current?.resize('100%', '100%');
			}
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	const initEvent3 = () => {
		let prevRowIndex: number | null = null;

		gridRef3?.current.bind('selectionChange', (event: any) => {
			const rowIndex = event.primeCell.rowIndex;

			if (rowIndex === prevRowIndex) return;

			prevRowIndex = rowIndex;

			const item = gridRef3.current.getItemByRowIndex(rowIndex);

			searchDetail(item);
		});
	};

	const applyStoHeaders = () => {
		if (!gridRef?.current) return false;

		const columnMap = {
			dcA: { openQty: 'openqty1', req: 'req1' },
			dcB: { openQty: 'openqty2', req: 'req2' },
			dcC: { openQty: 'openqty3', req: 'req3' },
			dcD: { openQty: 'openqty4', req: 'req4' },
			dcE: { openQty: 'openqty5', req: 'req5' },
			dcF: { openQty: 'openqty6', req: 'req6' },
		};

		(Object.keys(columnMap) as Array<keyof typeof columnMap>).forEach(key => {
			const columnsToUpdate = columnMap[key];
			const nameKey = `${key}Name`;
			const headerText = searchVal?.[nameKey] || '미선택';
			gridRef.current.setColumnPropByDataField(columnsToUpdate.openQty, { headerText });
			gridRef.current.setColumnPropByDataField(columnsToUpdate.req, { headerText });
		});

		return true;
	};

	useEffect(() => {
		setTotalCnt(gridData.length);
		if (gridData.length > 0) {
			gridRef?.current.setGridData(gridData);
			applyStoHeaders();
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			// const colSizeList1 = gridRef?.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			// gridRef?.current.setColumnSizeList(colSizeList1);
			gridRef?.current.setSelectionByIndex(0);
		}
	}, [gridData]);

	useEffect(() => {
		if (gridData2?.length) {
			gridRef2?.current.setGridData(gridData2);
		}
	}, [gridData2]);

	useEffect(() => {
		if (gridData3?.length) {
			gridRef3?.current.setGridData(gridData3);
		}
	}, [gridData3]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (gridRef3.current) {
				gridRef3.current.bind('cellClick', (event: any) => {
					searchDetail(event.item);
				});

				clearInterval(timer);
			}
		}, 100);
	}, []);

	useEffect(() => {
		gridRef4?.current?.bind('ready', () => {
			if (gridData4?.length) {
				gridRef4.current.setGridData(gridData4);
			}
		});
	}, []);

	useEffect(() => {
		if (activeTabKey !== '1') return;

		if (applyStoHeaders()) return;

		const timer = setInterval(() => {
			if (applyStoHeaders()) {
				clearInterval(timer);
			}
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, [searchVal, activeTabKey]);

	useEffect(() => {
		const columnMap = {
			dcA: { openQty: 'openqty1', req: 'req1' },
			dcB: { openQty: 'openqty2', req: 'req2' },
			dcC: { openQty: 'openqty3', req: 'req3' },
			dcD: { openQty: 'openqty4', req: 'req4' },
			dcE: { openQty: 'openqty5', req: 'req5' },
			dcF: { openQty: 'openqty6', req: 'req6' },
		};
		Object.values(columnMap).forEach(columnsToUpdate => {
			gridRef.current.setColumnPropByDataField(columnsToUpdate.openQty, { headerText: '미선택' });
			gridRef.current.setColumnPropByDataField(columnsToUpdate.req, { headerText: '미선택' });
		});

		// const colSizeList1 = gridRef?.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		// gridRef?.current.setColumnSizeList(colSizeList1);
		// gridRef?.current.setSelectionByIndex(0);
	}, [dccode]);

	return <TabsArray items={tabs} activeKey={activeTabKey} onChange={tabClick} destroyInactiveTabPane={false} />;
});

export default OmOrderCreationSTOOrdBaseDetail;
