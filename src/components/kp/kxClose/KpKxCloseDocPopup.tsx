/*
 ############################################################################
 # FiledataField	: KpKxCloseDocPopup.tsx
 # Description		: 문서정보 팝업 
 # Author			    : 
 # Since			    : 
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Input, Tabs } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';

// Utils

// Store

// API Call Function
import {
	apiGetDocinfo,
	apiGetDocumentDetailForDocno,
	apiGetDocumentKx,
	apiGetDocumentModifyDetailForDocno,
	apiGetTransactionList,
} from '@/api/kp/apiKpKxCloseDocPopup';
import KpKxClosePopupChangeInfo from '@/components/kp/kxClose/KpKxClosePopupChangeInfo';
import KpKxClosePopupKxInfo from '@/components/kp/kxClose/KpKxClosePopupKxInfo';
import KpKxClosePopupSkuInfo from '@/components/kp/kxClose/KpKxClosePopupSkuInfo';

// API Call Function

const KpKxCloseDocPopup = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, close, serialkey, rowData } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const tableRef = useRef(null);
	// 상세 데이터
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [docno, setDocno] = useState('');

	// 그리드 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const refsSkuInfo: any = useRef(null);
	const refsDocModInfo: any = useRef(null);
	const refsKxInfo: any = useRef(null);

	// 탭 변경
	const [currentKey, setCurrentKey] = useState('1');

	// 그리드 데이터 바인딩 여부
	const [isDataBinding, setIsDataBinding] = useState(false);

	// 디테일 그리드 버튼 영역
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			headerText: t('lbl.SERIALKEY'), //테이블시리얼번호
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'trandate',
			headerText: t('lbl.TRANDATE'), //발생일자
			editable: false,
			dataType: 'date',
			format: 'yyyy-MM-dd',
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), //물류센터
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'trantypename',
			headerText: t('lbl.TRANTYPE'), //트랜잭션유형
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'serialynname',
			headerText: t('lbl.SERIALYN_ST'), //이력유무
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), //상품코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNM'), //상품명
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY'), //수량
			editable: false,
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.FROMLOCLABEL'), // FROM 로케이션
			children: [
				{
					dataField: 'fromLoc',
					headerText: t('lbl.FROM_LOC'), // LOC
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'fromLot',
					headerText: t('lbl.FROM_LOT'), // LOT
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'fromLottable01',
					headerText: t('lbl.LOTTABLE01'), // 기준일(소비,제조)
					editable: false,
					dataType: 'code',
					labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.nvl(value, '').length == 8
							? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) // 날짜 형식으로 변환
							: value;
					},
				},
				{
					dataField: 'fromStockid',
					headerText: t('lbl.FROM_STOCKID'), // 재고ID
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'fromStocktype',
					headerText: t('lbl.FROM_STOCKTYPE'), // 재고위치
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'fromStockgrade',
					headerText: t('lbl.FROM_STOCKGRADE'), // FROM 재고 속성
					editable: false,
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.TOLOCLABEL'), // TO 로케이션
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.TO_LOC'), // LOC
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'toLot',
					headerText: t('lbl.TO_LOT'), // LOT
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'toLottable01',
					headerText: t('lbl.LOTTABLE01'), // 기준일(소비,제조)
					editable: false,
					dataType: 'code',
					labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.nvl(value, '').length == 8
							? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) // 날짜 형식으로 변환
							: value;
					},
				},
				{
					dataField: 'toStockid',
					headerText: t('lbl.TO_STOCKID'), // 재고ID
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'toStocktype',
					headerText: t('lbl.TO_STOCKTYPE'), // 재고위치
					editable: false,
					dataType: 'code',
				},
				{
					dataField: 'toStockgrade',
					headerText: t('lbl.TO_STOCKGRADE'), // TO 재고 속성
					editable: false,
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.ADDINFO'), //추가정보
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO'), //문서번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'docline',
					headerText: t('lbl.DOCLINE'), //품목번호
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.REGINFO'), //등록정보
			children: [
				{
					dataField: 'adddate',
					headerText: t('lbl.ADDDATE'), //등록일시
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'username',
					headerText: t('lbl.ADDWHO'), //등록자
					dataType: 'manager',
					managerDataField: 'regwho',
					editable: false,
				},
			],
		},
		{
			dataField: 'addwho',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		//editable: props.popupType === 'DOCUMENTINFO',
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		//showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0',
		},
		// {
		// 	dataField: 'supplyPrice',
		// 	positionField: 'supplyPrice',
		// 	operation: 'SUM',
		// 	formatString: '#,##0',
		// },
		// {
		// 	dataField: 'taxAmount',
		// 	positionField: 'taxAmount',
		// 	operation: 'SUM',
		// 	formatString: '#,##0',
		// },
		// {
		// 	dataField: 'amount',
		// 	positionField: 'amount',
		// 	operation: 'SUM',
		// 	formatString: '#,##0',
		// },
		// {
		// 	dataField: 'kgCal',
		// 	positionField: 'kgCal',
		// 	operation: 'SUM',
		// 	formatString: '#,##0.##',
		// },
		// {
		// 	labelText: '100%',
		// 	positionField: 'rateQty',
		// },
		// {
		// 	dataField: 'disCost',
		// 	positionField: 'disCost',
		// 	operation: 'SUM',
		// 	formatString: '#,##0',
		// },
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * DocumentInfo Header 정보 조회
	 */
	const searchMaster = async () => {
		const params = {
			...rowData,
			deliverydate: rowData.deliverydate ? rowData.deliverydate : rowData.slipdt,
		};

		// API 호출
		apiGetDocinfo(params).then(res => {
			if (res.data) {
				form.resetFields();
				form.setFieldsValue(res.data);
			}
		});
	};

	/**
	 * 재고처리현황 목록 조회
	 */
	const searchStTransactionList = async () => {
		const params = {
			...rowData,
			deliverydate: rowData.deliverydate ? rowData.deliverydate : rowData.slipdt,
		};

		// API 호출
		apiGetTransactionList(params).then(res => {
			// const gridRefCur = gridRef.current;
			// if (gridRefCur) {
			// 	setGridData(res.data);
			// }
			setGridData(res.data);
		});
	};

	// 탭3 - KX실적현황 조회
	const searchMasterList1 = async () => {
		setDocno(rowData.docno);
		const params = {
			docno: rowData.docno,
		};

		apiGetDocumentKx(params).then(res => {
			if (res.data.length > 0) {
				setGridData1(res.data);
			}
		});
	};

	const searchMasterList2 = async () => {
		setDocno(rowData.docno);
		const params = {
			docno: rowData.docno,
			docdt: rowData.docdt,
		};

		apiGetDocumentDetailForDocno(params).then(res => {
			if (res.data.length > 0) {
				setGridData2(res.data);
			}
		});
	};
	const searchMasterList3 = async () => {
		setDocno(rowData.docno);
		const params = {
			docno: rowData.docno,
			docdt: rowData.docdt,
		};

		apiGetDocumentModifyDetailForDocno(params).then(res => {
			if (res.data.length > 0) {
				setGridData3(res.data);
			}
		});
	};
	/**
	 * 탭 변경 이벤트
	 * @param key
	 */
	const onChangeTab = (key: string) => {
		setCurrentKey(key);

		switch (key) {
			case '5':
				setTimeout(() => {
					const gridRefCur = gridRef.current;
					gridRefCur?.resize();
					if (gridRefCur && !isDataBinding) {
						gridRefCur?.setGridData(gridData);

						if (gridData.length > 0) {
							const colSizeList = gridRef.current.getFitColumnSizeList(true);
							gridRef.current.setColumnSizeList(colSizeList);
						}

						setIsDataBinding(true);
					}
				}, 100);
				break;
			case '6':
				// KX실적현황 그리드 정보 조회
				setTimeout(() => {
					const gridRefCur = refsKxInfo.current;
					setCurrentKey('6');
					gridRefCur?.resize();
					if (gridRefCur && !isDataBinding) {
						gridRefCur?.setGridData1(gridData1);

						if (gridData1.length > 0) {
							const colSizeList = gridRef.current.getFitColumnSizeList(true);
							gridRef.current.setColumnSizeList(colSizeList);
						}

						setIsDataBinding(true);
					}
				}, 100);
				break;
			default:
				break;
		}
	};

	// 페이지 버튼 함수 바인딩
	// const titleFunc = {
	// 	searchYn: searchMasterList,
	// };

	const tabs = [
		{
			key: '1',
			label: t('문서정보'),
			children: (
				// 헤더 영역
				<Form form={form} disabled={true}>
					<AGrid>
						{/* <GridTopBtn></GridTopBtn> */}
						<UiDetailViewArea>
							<UiDetailViewGroup>
								<li>
									<InputText name="storerkey" label={t('lbl.STORERKEY')} /> {/* 회사 */}
								</li>
								<li>
									<InputText name="dccode" label={t('lbl.DCCODE')} /> {/* 물류센터 */}
								</li>
								<li>
									<InputText name="docdt" label={t('lbl.DOCDT')} /> {/* 문서일자*/}
								</li>
								<li>
									<InputText name="doctype" label={t('lbl.DOCTYPE')} /> {/* 문서유형*/}
								</li>
								<li>
									<InputText name="docno" label={t('lbl.DOCNO')} /> {/* 문서번호*/}
								</li>
								<li>
									<InputText name="mallinvoice" label={t('lbl.MALLINVOICE')} /> {/* 쇼핑몰주문번호*/}
								</li>
								<li>
									<InputText name="invoiceno" label={t('lbl.INVOICENO')} /> {/* 인보이스번호*/}
								</li>
								<li>
									<InputText name="pokey" label={t('lbl.POKEY')} /> {/* 구매전표 */}
								</li>
								<li>
									<InputText name="organize" label={t('lbl.ORGANIZE')} /> {/* 창고*/}
								</li>
								<li>
									<InputText name="courier" label={t('lbl.COURIER')} /> {/* 배송그룹*/}
								</li>
								<li>
									<InputText name="invoicetype" label={t('lbl.INVOICETYPE')} /> {/* 납품서유형*/}
								</li>
								<li>
									<InputText name="shoppingmall" label={t('lbl.SHOPPINGMALL')} /> {/* 쇼핑몰 */}
								</li>
								<li>
									<InputText name="sourcekey" label={t('lbl.SOURCEKEY')} /> {/* 원주문번호*/}
								</li>
								<li>
									<InputText name="ordertype" label={t('lbl.ORDERTYPE')} /> {/* 주문유형*/}
								</li>
								<li>
									<InputText name="sliptype" label={t('lbl.SLIPTYPE')} /> {/* 전표유형*/}
								</li>
								<li></li>
								<li>
									<InputText name="dcrate" label={t('lbl.DCRATE')} /> {/* 할인율*/}
								</li>
								<li>
									<InputText name="marginrate" label={t('lbl.MARGINRATE')} /> {/* 마진율*/}
								</li>
								<li>
									<InputText name="purchasedate" label={t('lbl.PURCHASEDATE')} /> {/* 구매주문일*/}
								</li>
								<li></li>
								<li>
									<InputText name="confirmdate" label={t('lbl.CONFIRMDATE')} /> {/* 확정일시*/}
								</li>
								<li>
									<InputText name="postingdate" label={t('lbl.POSTINGDATE')} /> {/* 전기일시 */}
								</li>
								<li>
									<InputText name="deliverydate" label={t('lbl.DELIVERYDATE')} /> {/* 배송일자 */}
								</li>
								<li>
									<InputText name="effectivedate" label={t('lbl.EFFECTIVEDATE')} /> {/* 적용일자 */}
								</li>

								<li>
									<InputText name="deliveryroute" label={t('lbl.DELIVERYROUTE')} /> {/* 경유지 */}
								</li>
								<li>
									<InputText name="deliverytype" label={t('lbl.DELIVERYTYPE')} /> {/* 배송수단 */}
								</li>
								<li>
									<InputText name="deliveryfeetype" label={t('lbl.DELIVERYFEETYPE')} /> {/* 운임구분*/}
								</li>
								<li></li>
								<li>
									<InputText name="deliverymemo" label={t('lbl.DELIVERYMEMO')} /> {/* 배송메시지 */}
								</li>
								<li>
									<InputText name="deliveryfee" label={t('lbl.DELIVERYFEE')} /> {/* 배송운임 */}
								</li>
								<li></li>
								<li></li>
								<li className="col-1">
									<InputText name="requestmemo" label={t('lbl.REQUESTMEMO')} /> {/* 고객 요청 메세지*/}
								</li>
								<li className="col-1">
									<InputText name="deliverygroup" label={t('lbl.DELIVERYGROUP')} /> {/* POP번호 */}
								</li>
								<li className="col-1">
									<InputText name="memo1" label={t('lbl.MEMO1')} /> {/* 비고 */}
								</li>
								<li className="col-1">
									<InputText name="memo2" label={t('lbl.MEMO2')} /> {/* 메모2 */}
								</li>
								<li>
									<InputText name="status" label={t('lbl.STATUS')} /> {/* 진행상태 */}
								</li>
								<li>
									<InputText name="delYn" label={t('lbl.DEL_YN')} /> {/* 삭제여부 */}
								</li>
								<li>
									<InputText name="omsFlag" label={t('lbl.OMS_FLAG')} /> {/* OMS처리여부*/}
								</li>
								<li></li>
								<li>
									<InputText name="adddate" label={t('lbl.ADDDATE')} /> {/* 등록일자 */}
								</li>
								<li>
									<InputText name="editdate" label={t('lbl.EDITDATE')} /> {/* 수정일자 */}
								</li>
								<li>
									<InputText name="addwho" label={t('lbl.ADDWHO')} /> {/* 등록자 */}
								</li>
								<li>
									<InputText name="editwho" label={t('lbl.EDITWHO')} /> {/* 수정자 */}
								</li>
							</UiDetailViewGroup>
						</UiDetailViewArea>

						<Form.Item name="serialkey" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="accountDetailCode" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="cbRegisno" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="adjustmentSupplierName" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="paymentTermName" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="taxTypeName" hidden>
							<Input />
						</Form.Item>
					</AGrid>
				</Form>
			),
		},
		{
			key: '2',
			label: '문서상세정보',
			children: (
				<Form form={form} disabled={true}>
					<AGrid>
						<UiDetailViewGroup className="addressDetailGroup" ref={tableRef}>
							<li>
								<InputText name="fromCustkey" label="FROM 거래처코드" />
							</li>
							<li>
								<InputText name="fromCustname" label="FROM 거래처명" />
							</li>
							<li>
								<InputText name="fromCusttype" label="FROM 거래처 유형" />
							</li>
							<li>
								<InputText name="fromOrganize" label="FROM조직" />
							</li>

							<li>
								<InputText name="fromBilltokey" label="FROM_정산처코드" />
							</li>
							<li>
								<InputText name="fromCountry" label="FROM 국가코드" />
							</li>
							<li>
								<InputText name="fromState" label="FROM 주,도" />
							</li>
							<li>
								<InputText name="fromCity" label="FROM 시,읍,면" />
							</li>

							<li>
								<InputText name="fromZipcode" label="FROM 우편번호" />
							</li>
							<li>
								<InputText name="fromPhone1Disp" label="화면표시용전화번" />
							</li>
							<li>
								<InputText name="fromPhone2Disp" label="화면표시용전화번" />
							</li>
							<li></li>

							<li className="col-1">
								<InputText name="fromAddressDisp" label="화면표시용주소" />
							</li>

							<li>
								<InputText name="fromPhone1" label="FROM 전화번호1" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="fromAddress1" label="FROM 기본주소" />
							</li>

							<li>
								<InputText name="fromPhone2" label="FROM 전화번호2" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="fromAddress2" label="FROM 상세주소" />
							</li>

							<li>
								<InputText name="fromVatno" label="고객코드" />
							</li>
							<li>
								<InputText name="fromVatowner" label="고객명" />
							</li>
							<li>
								<InputText name="fromVattype" label="FROM 사업자 등록 유형" />
							</li>
							<li>
								<InputText name="fromVatcategory" label="FROM 사업자 등록 구분" />
							</li>

							<li>
								<InputText name="fromVatfax" label="FROM 사업자 등록 번호" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="fromVataddress1" label="FROM 사업자 등록 주소1" />
							</li>

							<li>
								<InputText name="fromVatphone" label="FROM 사업자 등록 전화" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="fromVataddress2" label="FROM 사업자 등록 주소2" />
							</li>

							<li>
								<InputText name="fromEmpname1" label="영업사원" />
							</li>
							<li>
								<InputText name="fromEmpphone1" label="FROM 관리 사원명1" />
							</li>
							<li>
								<InputText name="fromEmpname2" label="FROM 관리 사원명2" />
							</li>
							<li>
								<InputText name="fromEmpphone2" label="FROM 관리 사원 전화" />
							</li>

							<li>
								<InputText name="toCustkey" label="배송인도처코드" />
							</li>
							<li>
								<InputText name="toCustname" label="배송인도처명" />
							</li>
							<li>
								<InputText name="toCusttype" label="TO 거래처 유형" />
							</li>
							<li>
								<InputText name="toOrganize" label="TO조직" />
							</li>

							<li>
								<InputText name="toBilltokey" label="TO_정산처코드" />
							</li>
							<li>
								<InputText name="toCountry" label="TO 국가코드" />
							</li>
							<li>
								<InputText name="toState" label="TO 주,도" />
							</li>
							<li>
								<InputText name="toCity" label="TO 시,읍,면" />
							</li>

							<li>
								<InputText name="toZipcode" label="TO 우편번호" />
							</li>
							<li>
								<InputText name="toPhone1Disp" label="화면표시용전화번" />
							</li>
							<li>
								<InputText name="toPhone2Disp" label="화면표시용전화번" />
							</li>
							<li></li>

							<li style={{ gridColumn: 'span 4' }}>
								<InputText name="toAddressDisp" label="화면표시용주소" />
							</li>

							<li>
								<InputText name="toPhone1" label="TO 전화번호1" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="toAddress1" label="인도처주소" />
							</li>

							<li>
								<InputText name="toPhone2" label="TO 전화번호2" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="toAddress2" label="TO 상세주소" />
							</li>

							<li>
								<InputText name="toVatno" label="판매처코드" />
							</li>
							<li>
								<InputText name="toVatowner" label="판매처명" />
							</li>
							<li>
								<InputText name="toVattype" label="TO 사업자 등록 유형" />
							</li>
							<li>
								<InputText name="toVatcategory" label="TO 사업자 등록 구분" />
							</li>

							<li>
								<InputText name="toVatfax" label="TO 사업자 등록 번호" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="toVataddress1" label="TO 사업자 등록 주소1" />
							</li>

							<li>
								<InputText name="toVatphone" label="TO 사업자 등록 전화" />
							</li>
							<li style={{ gridColumn: 'span 3' }}>
								<InputText name="toVataddress2" label="TO 사업자 등록 주소2" />
							</li>

							<li>
								<InputText name="toEmpname1" label="영업사원" />
							</li>
							<li>
								<InputText name="toEmpphone1" label="TO 관리 사원명1" />
							</li>
							<li>
								<InputText name="toEmpname2" label="TO 관리 사원명2" />
							</li>
							<li>
								<InputText name="toEmpphone2" label="TO 관리 사원 전화" />
							</li>
						</UiDetailViewGroup>
					</AGrid>
				</Form>
			),
		},
		{
			key: '3',
			label: '품목정보',
			children: (
				<KpKxClosePopupSkuInfo
					ref={refsSkuInfo}
					data={gridData2}
					// totalCnt={totalCnt1}
					form={form1}
					docno={docno}
					// callBackFn={searchMasterList2}
					// setActiveTabKey={setActiveTabKey}
					// setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '4',
			label: '변경이력',
			children: (
				<KpKxClosePopupChangeInfo
					ref={refsDocModInfo}
					data={gridData3}
					// totalCnt={totalCnt1}
					form={form1}
					docno={docno}
					// callBackFn={searchMasterList1}
					// setActiveTabKey={setActiveTabKey}
					// setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '5',
			label: '재고처리현황',
			children: (
				<AGrid style={{ minHeight: '710px' }}>
					<GridTopBtn gridTitle={''} gridBtn={gridBtnDetail}></GridTopBtn>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</AGrid>
			),
		},
		{
			key: '6',
			label: 'KX 실적현황',
			children: (
				<KpKxClosePopupKxInfo
					ref={refsKxInfo}
					data={gridData1}
					totalCnt={totalCnt1}
					form={form1}
					docno={docno}
					callBackFn={searchMasterList1}
					// setActiveTabKey={setActiveTabKey}
					// setSelectedEvent={setSelectedEvent}
				/>
			),
		},
	];

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		// initEvent();
	});
	useEffect(() => {
		refsKxInfo.gridRef1?.current.resize(); // 그리드 크기 조정
		refsKxInfo.gridRef2?.current.resize(); // 그리드 크기 조정

		refsSkuInfo.gridRef1?.current.resize(); // 그리드 크기 조정

		refsDocModInfo.gridRef1?.current.resize();
	}, [currentKey]);

	useEffect(() => {
		// 화면 로딩 시 헤더 정보 조회
		searchMaster();
		// 재고처리현황 그리드 정보 조회
		searchStTransactionList();

		if (currentKey === '3') {
			searchMasterList2();
		}
		if (currentKey === '4') {
			searchMasterList3();
		}
		if (currentKey === '6') {
			searchMasterList1();
		}
	}, [rowData, currentKey]);

	// useEffect(() => {
	// 	// 헤더 정보가 있으면 폼 데이터 바인딩
	// 	if (headerData && commUtil.isNotEmpty(headerData)) {
	// 		//console.log('headerData', headerData);
	// 		form.setFieldsValue(headerData[0]);
	// 	}
	// }, [headerData]);

	return (
		<>
			<Tabs items={tabs} style={{ minHeight: '710px' }} defaultActiveKey="1" onChange={onChangeTab}></Tabs>

			<ButtonWrap data-props="single">
				<Button onClick={close}>닫기</Button>
			</ButtonWrap>
		</>
	);
});

export default KpKxCloseDocPopup;
