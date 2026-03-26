/*
 ############################################################################
 # FiledataField	: IbExpenseDocumentInfoPopup.tsx
 # Description		: 비용기표 - 문서정보 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.06
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Input, Tabs } from 'antd';
import dayjs from 'dayjs';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmPaymentTermSearch from '@/components/cm/popup/CmPaymentTermSearch';
import CmSupplierSearch from '@/components/cm/popup/CmSupplierSearch';
import CmTaxTypeSearch from '@/components/cm/popup/CmTaxTypeSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputNumber, InputSearch, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import IbExpeneFileUploadPopup from '@/components/ib/expense/IbExpeneFileUploadPopup';
import IbExpenseCostCodePopup from '@/components/ib/expense/IbExpenseCostCodePopup';
import IbExpenseElecTaxPopup from '@/components/ib/expense/IbExpenseElecTaxPopup';

// Utils

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function
import {
	apiPostPopupDocumentInfoDetail,
	apiPostPopupDocumentInfoHeader,
	apiPostSaveKGPopupDocumentInfoDetail,
	apiPostSavePopupDocumentInfoDetail,
	apiPostSavePopupDocumentInfoHeader,
} from '@/api/ib/apiIbExpense';

interface PropsType {
	callBack?: any;
	close?: any;
	popupType: string;
	serialkey: any;
}

const IbExpenseDocumentInfoPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, close, popupType, serialkey } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 헤더 데이터 타입 정의
	interface HeaderDataType {
		issueDate?: any;
		postingDate?: any;
		taxYmd?: any;
		invSign?: string | boolean;
		adjustmentSupplierCode?: string;
		adjustmentSupplierName?: string;
		adjustmentSupplierCdName?: string;
		actualSupplierCode?: string;
		actualSupplierName?: string;
		paymentTerm?: string;
		paymentTermName?: string;
		paymentTermCdName?: string;
		taxTypeCode?: string;
		taxTypeName?: string;
		status?: string;
		cbRegisno?: string;
		[key: string]: any; // 기타 동적 속성 허용
	}

	// 헤더 데이터
	const [headerData, setHeaderData] = useState<HeaderDataType>({});

	// 상세 데이터
	const [gridData, setGridData] = useState([]);

	// 상세 데이터의 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 그리드 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// 세금계산서 팝업용 Ref
	const refElecTaxModal = useRef(null);

	// 코스트코드 팝업용 Ref
	const refGridModal = useRef(null);

	// 파일 팝업용 Ref
	const refUploadfileModal = useRef(null);

	// 탭 변경
	const [currentKey, setCurrentKey] = useState('1');

	// 탭
	const { TabPane } = Tabs;

	// 입력 활성화 여부
	const [isDisable, setIsDisable] = useState(true);

	// 그리드 데이터 바인딩 여부
	const [isDataBinding, setIsDataBinding] = useState(false);

	// 버튼 및 컴포넌트 활성화 여부
	const [isTaxRateReadOnly, setIsTaxRateReadOnly] = useState(false);
	const [isTaxTypeCodeReadOnly, setIsTaxTypeCodeReadOnly] = useState(false);
	const [isTaxTypeCodeEnabled, setIsTaxTypeCodeEnabled] = useState(true);
	const [isTaxNoReadOnly, setIsTaxNoReadOnly] = useState(false);
	const [isTaxNoEnabled, setIsTaxNoEnabled] = useState(true);
	const [isInvSignEnabled, setIsInvSignEnabled] = useState(false);
	const [isTaxYmdEnabled, setIsTaxYmdEnabled] = useState(true);
	// KG 비용저장 버튼 활성화 여부
	const [isKGVisible, setIsKGVisible] = useState(true);

	// 헤더  General Information 영역
	const gridBtnHeader: GridBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 헤더 나머지 영역 제목
	const tableBtnHeader: TableBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 디테일 그리드 버튼 영역
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 문서유형 코드
	const docTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DOCUMENT_TYPE_CODE', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'expenseSn',
			visible: false,
		},
		{
			dataField: 'taxRate',
			dataType: 'numeric',
			visible: false,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			editable: false,
		},
		{
			dataField: 'itemCode',
			headerText: t('lbl.SKU'), //상품코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
		},

		{
			dataField: 'convserialno',
			headerText: t('lbl.CONVSERIALNO'), //B/L번호
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처
			editable: false,
		},

		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'ordertypename',
			headerText: t('lbl.ORDERTYPE'), //주문유형
			editable: false,
			dataType: 'code',
		},

		{
			dataField: 'documentTypeCode',
			headerText: t('lbl.DOC_TYPE'), //Doc Type
			editable: false,
			dataType: 'code',
			required: true,
			labelFunction: docTypeLabelFunc,
		},
		{
			dataField: 'documentNumber',
			headerText: t('lbl.DOCUMENT_NO'), //Document No
			editable: false,
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'poNo',
			headerText: t('lbl.PONO'), //P/O No
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'attribute1',
			headerText: t('lbl.POLINE'), //P/O Line
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDetailCode',
			headerText: t('lbl.COST_CODE'), //Cost Code
			editable: false,
			dataType: 'code',
			required: true,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const rowItem = e.item;
					!isDisable &&
						refGridModal.current.open({
							srcGridRef: gridRef,
							rowIndex,
							onConfirm: (selectedRows: any[]) => {
								if (!selectedRows || selectedRows.length === 0) return;
								const selectedData = selectedRows[0];
								const updatedRow = {
									...rowItem,
									accountDetailCode: selectedData.code,
									accountDetailName: selectedData.name,
									accountDrCode: selectedData.data1,
									accountDrName: selectedData.data2,
									summary: selectedData.name,
								};
								// 해당 행에 값 업데이트
								gridRef.current.updateRow(updatedRow, rowIndex);
								// Tax Type 설정
								if (selectedData.code === 'W04') {
									setTaxTypecodeNameByCode('U0');
								}
								// 팝업 닫기
								refGridModal.current?.handlerClose();
							},
						});
				},
			},
		},
		{
			dataField: 'accountDetailName',
			headerText: t('lbl.COSTNAME'), //CostName
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDrCode',
			headerText: t('lbl.GL_ACCOUNT'), //G/L Account
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDrName',
			headerText: t('lbl.GL_ACCOUNT_NAME'), //G/L Acc name
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'supplyPrice',
			headerText: t('lbl.SUPPLY_PRICE'), //Supply Price
			editable: true,
			dataType: 'numeric',
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (props.popupType === 'DOCUMENTINFO' && !isDisable) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'taxFlag',
			headerText: t('lbl.VAT_AUTO_CALC'), //부가세자동계산
			editable: true,
			dataType: 'code',
			required: true,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TAX_FLAG', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return isDisable;
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (props.popupType === 'DOCUMENTINFO' && !isDisable) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'taxAmount',
			headerText: t('lbl.TAX'), //Tax
			editable: true,
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
			widtdh: 150,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (props.popupType === 'DOCUMENTINFO' && !isDisable) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'amount',
			headerText: t('lbl.AMOUNT'), //Amount
			editable: false,
			dataType: 'numeric',
		},
		{
			dataField: 'summary',
			headerText: t('lbl.SUMMARY'), //Summary
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'creditKind',
			headerText: t('lbl.CREDIT_KIND'), //Credit Kind
			editable: true,
			dataType: 'code',
			required: true,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CREDIT_KIND', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return isDisable;
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (props.popupType === 'DOCUMENTINFO' && !isDisable) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'costcd',
			headerText: t('lbl.FI_COSTCENTER'), //FI코스트센터
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.FI_PLANTCODE'), //FI플랜트코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'itemCode',
			headerText: t('lbl.FI_SKUCD'), //FI상품코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'saleCustomerCode',
			headerText: t('lbl.FI_CUSTKEY'), //FI고객코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'baseuom',
			headerText: t('lbl.BASE_UOM'), //기본 단위
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'quantity',
			headerText: t('lbl.QTY'), //수량
			editable: false,
			dataType: 'numeric',
		},
		{
			dataField: 'kgCal',
			headerText: t('lbl.WEIGHT_KG_UOM'), //중량
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'rateQty',
			headerText: t('lbl.KG_RATE'), //KG비중
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.##',
			postfix: '%',
		},
		{
			dataField: 'disCost',
			headerText: t('lbl.KG_COSTALLOCATED'), //KG 비용분배
			editable: false,
			dataType: 'numeric',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		//editable: props.popupType === 'DOCUMENTINFO',
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
			return !isDisable;
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'supplyPrice',
			positionField: 'supplyPrice',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'taxAmount',
			positionField: 'taxAmount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'amount',
			positionField: 'amount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'kgCal',
			positionField: 'kgCal',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			labelText: '100%',
			positionField: 'rateQty',
		},
		{
			dataField: 'disCost',
			positionField: 'disCost',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 *  Tab 설정
	 * @param param
	 */
	// const getTabItems = () => {
	// 	const items = [
	// 		{
	// 			label: t('Header'),
	// 			key: '1',
	// 			children: (
	// 				<>
	// 					<IbExpenseDocumentInfoHeaderPopup
	// 						ref={refs}
	// 						headerData={headerData}
	// 						popupType={props.popupType}
	// 						serialkey={props.serialkey}
	// 						save={saveMaster}
	// 					/>
	// 				</>
	// 			),
	// 		},
	// 		{
	// 			label: t('Detail'),
	// 			key: '2',
	// 			children: (
	// 				<>
	// 					<IbExpenseDocumentInfoDetailPopup
	// 						ref={refs}
	// 						gridData={gridData}
	// 						headerData={headerData}
	// 						popupType={props.popupType}
	// 						serialkey={props.serialkey}
	// 						save={saveMasterList}
	// 					/>
	// 				</>
	// 			),
	// 		},
	// 	];

	// 	return items;
	// };

	// Tax Type 코드 조회
	const setTaxTypecodeNameByCode = (param: any) => {
		const code = getCommonCodeList('TAX_CLASS').filter((v: any) => v.comCd === param);
		let taxTypeCdName = '';
		if (code && code.length > 0) {
			taxTypeCdName = '[' + (code[0].comCd || '') + ']' + (code[0].cdNm || '');
		} else {
			taxTypeCdName = code[0].comCd;
		}

		form.setFieldValue('taxTypeCode', param);
		form.setFieldValue('taxTypeCdName', taxTypeCdName);
		form.setFieldValue('taxRate', code[0].data1);

		onValuesChange({ taxRate: code[0].data1 }, null);
	};

	/**
	 * 부가세율 변경 시 후 처리
	 * @param taxRate
	 */
	const setTaxRate = (taxRate: any) => {
		onValuesChange({ taxRate: taxRate }, null);
	};

	/**
	 * 상세 정보 바인딩
	 */
	const setMasterInfo = () => {
		if (headerData && commUtil.isNotEmpty(headerData)) {
			//Document Date 설정
			const issueDate = dayjs(headerData.issueDate, 'YYYYMMDD');
			headerData.issueDate = issueDate;

			//Postin Date 설정
			const postingDate = dayjs(headerData.postingDate, 'YYYYMMDD');
			headerData.postingDate = postingDate;

			//Tax Ymd 설정
			const taxYmd = dayjs(headerData.taxYmd, 'YYYYMMDD');
			headerData.taxYmd = taxYmd;

			//역발행여부 (체크박스) 설정
			headerData.invSign = headerData.invSign === 'Y';

			//Supplier 코드+명칭 설정
			let adjustmentSupplierCdName = '';
			if (headerData.adjustmentSupplierCode) {
				adjustmentSupplierCdName =
					'[' + (headerData.adjustmentSupplierCode || '') + ']' + (headerData.adjustmentSupplierName || '');
			}
			headerData.adjustmentSupplierCdName = adjustmentSupplierCdName;

			//Supplier (Acutal) 코드+명칭 설정
			let actualSupplierName = '';
			if (headerData.actualSupplierCode) {
				actualSupplierName = '[' + (headerData.actualSupplierCode || '') + ']' + (headerData.actualSupplierName || '');
			}
			headerData.actualSupplierName = actualSupplierName;

			//Payment Term 코드+명칭 설정
			let paymentTermCdName = '';
			if (headerData.paymentTerm) {
				paymentTermCdName = '[' + (headerData.paymentTerm || '') + ']' + (headerData.paymentTermName || '');
			}
			headerData.paymentTermCdName = paymentTermCdName;

			//Tax Type 코드+명칭 설정
			let taxTypeCdName = '';
			if (headerData.taxTypeCode) {
				taxTypeCdName = '[' + (headerData.taxTypeCode || '') + ']' + (headerData.taxTypeName || '');
			}
			headerData.taxTypeCdName = taxTypeCdName;

			form.setFieldsValue(headerData);

			// 입력 활성화 여부 설정
			if (headerData.status !== 'ENT' && headerData.status !== 'R' && props.popupType === 'DOCUMENTINFO') {
				setEnabled(false);
			} else {
				setEnabled(true);
			}
		}
	};

	/**
	 * 입력 항목들의 활성화 여부를 설정한다.
	 * @param {boolean} enabled - 활성화 여부를 지정합니다.
	 */
	const setEnabled = (enabled: boolean) => {
		if (props.popupType === 'DOCUMENTINFO') {
			setIsDisable(!enabled);

			// if (enabled && headerData.taxAutoFlag !== 'Y') {
			// 	setTaxFlagEnabled(true);
			// } else {
			// 	setTaxFlagEnabled(false);
			// }

			if (enabled) {
				setTaxFlagEnabled(true);
			} else {
				setTaxFlagEnabled(false);
			}

			if (enabled) {
				if (headerData.taxTag === 'A01') {
					setTaxTagEnabled(true);
				} else {
					setTaxTagEnabled(false);
				}
			}

			if (gridRef.current) {
				const gridData = gridRef.current.getGridData();

				//KG 비용저장 버튼은 ACCOUNT_DETAIL이 기타일때만 노출
				if (gridData.length > 0 && gridData[0].accountDetailCode === 'K08') {
					setIsKGVisible(enabled);
				} else {
					setIsKGVisible(false);
				}
			}
		} else {
			setIsDisable(true);
			setIsKGVisible(false);
		}
	};

	/**
	 * TaxType  활성화 여부를 설정한다.
	 * @param enabled
	 */
	const setTaxFlagEnabled = (enabled: boolean) => {
		setIsTaxRateReadOnly(!enabled);
		setIsTaxTypeCodeReadOnly(!enabled);
		setIsTaxTypeCodeEnabled(enabled);
	};

	/**
	 * TaxNo  활성화 여부를 설정한다.
	 * @param enabled
	 */
	const setTaxTagEnabled = (enabled: boolean) => {
		setIsTaxNoReadOnly(enabled);
		setIsTaxNoEnabled(enabled);
		setIsInvSignEnabled(!enabled);
		setIsTaxYmdEnabled(!enabled);
	};

	/**
	 * 비용기표 DocumentInfo Header 정보 조회
	 */
	const searchMaster = async () => {
		const params = {
			serialkey: props.serialkey,
		};

		// API 호출
		apiPostPopupDocumentInfoHeader(params).then(res => {
			if (res.data) {
				setHeaderData(res.data);

				searchMasterList();
			}
		});
	};

	/**
	 * 비용기표 DocumentInfo Detail 목록 조회
	 */
	const searchMasterList = async () => {
		const params = {
			serialkey: props.serialkey,
		};

		// API 호출
		apiPostPopupDocumentInfoDetail(params).then(res => {
			// const gridRefCur = gridRef.current;
			// if (gridRefCur) {
			// 	setGridData(res.data);
			// }
			setGridData(res.data);
		});
	};

	/**
	 * DocumentInfo Header 저장
	 */
	const saveMasterInfo = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		let checkedItems: any[] = [];
		if (gridRef.current) {
			checkedItems = gridRef.current.getCheckedRowItemsAll();
		}

		const searchParams = form.getFieldsValue();

		const params = {
			avc_COMMAND: 'IMPORT_EXPENSE_SAVE',
			serialkey: searchParams.serialkey,
			saveDocumentHeaderInfo: {
				...searchParams,
				//invSign: searchParams.invSign ? 'Y' : 'N',
				invSign: 'N',
				issueDate: dayjs(searchParams.issueDate).format('YYYYMMDD'),
				postingDate: dayjs(searchParams.postingDate).format('YYYYMMDD'),
				taxYmd: dayjs(searchParams.taxYmd).format('YYYYMMDD'),
			},
			saveList: checkedItems,
		};

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSavePopupDocumentInfoHeader(params).then(res => {
				if (res.statusCode === 0) {
					//props.callBackFn?.();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * DocumentInfo Detail 저장
	 */
	const saveMasterList = () => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			if (
				commUtil.isEmpty(item.documentTypeCode) ||
				commUtil.isEmpty(item.documentNumber) ||
				commUtil.isEmpty(item.accountDetailCode) ||
				commUtil.isEmpty(item.taxFlag) ||
				commUtil.isEmpty(item.creditKind)
			) {
				showMessage({
					content: t('msg.MSG_COM_VAL_057'),
					modalType: 'warning',
				});
				return;
			}

			if (item.supplyPrice <= 0) {
				showMessage({
					content: t('Supply Price값은 0보다 커야 합니다.'),
					modalType: 'warning',
				});
				return;
			}

			if (item.taxRate > 0 && item.taxAmount <= 0) {
				showMessage({
					content: t('Tax Rate 값이 0보다 큰 경우 Tax값은 0보다 커야 합니다.'),
					modalType: 'warning',
				});
				return;
			}
		}

		const params = {
			avc_COMMAND: 'IMPORT_EXPENSE_ITEM_SAVE',
			saveList: checkedItems,
		};

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSavePopupDocumentInfoDetail(params).then(res => {
				if (res.statusCode === 0) {
					//props.callBackFn?.();
					searchMaster();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 파일을 저장한다. (헤더)
	 */
	const attachFile = () => {
		refUploadfileModal.current?.handlerOpen();
	};

	/**
	 * KG 비용배분을 저장한다. (그리드)
	 */
	const saveKG = () => {
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			if (
				commUtil.isEmpty(item.documentTypeCode) ||
				commUtil.isEmpty(item.documentNumber) ||
				commUtil.isEmpty(item.accountDetailCode) ||
				commUtil.isEmpty(item.taxFlag) ||
				commUtil.isEmpty(item.creditKind)
			) {
				showMessage({
					content: t('msg.MSG_COM_VAL_057'),
					modalType: 'warning',
				});
				return;
			}

			if (item.supplyPrice <= 0) {
				showMessage({
					content: t('Supply Price값은 0보다 커야 합니다.'),
					modalType: 'warning',
				});
				return;
			}

			if (item.taxRate > 0 && item.taxAmount <= 0) {
				showMessage({
					content: t('Tax Rate 값이 0보다 큰 경우 Tax값은 0보다 커야 합니다.'),
					modalType: 'warning',
				});
				return;
			}
		}

		const params = {
			avc_COMMAND: 'IMPORT_EXPENSE_ITEM_SAVE',
			expenseSn: checkedItems[0].expenseSn,
			saveList: checkedItems,
		};

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveKGPopupDocumentInfoDetail(params).then(res => {
				if (res.statusCode === 0) {
					//props.callBackFn?.();
					searchMaster();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * Payment Term을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getTaxAutoFlag = () => {
		const types = [
			{ comCd: 'Y', cdNm: 'Automatically' },
			{ comCd: 'N', cdNm: 'Manually' },
		];

		return types;
	};

	/**
	 * Tax Type 변경 이벤트
	 * @param {any} value
	 */
	const onChangeSelectTaxType = (value: any) => {
		if (value === 'Y') {
			setTaxFlagEnabled(false);
		} else {
			setTaxFlagEnabled(true);
		}
	};

	/**
	 *Tax Invoice 변경 이벤트
	 * @param value
	 */
	const onChangeSelectTaxInvoice = (value: any) => {
		form.setFieldValue('taxNo', '');
		if (value === 'A01') {
			setTaxTagEnabled(true);
		} else {
			setTaxTagEnabled(false);
		}
	};

	/**
	 * 전자세금계산서 팝업 오픈
	 */
	const openElecTaxPopup = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('adjustmentSupplierCode')) ||
			commUtil.isEmpty(form.getFieldValue('adjustmentSupplierName')) ||
			commUtil.isEmpty(form.getFieldValue('cbRegisno'))
		) {
			showMessage({
				content: 'Supplier를 입력하세요.',
				modalType: 'warning',
			});
			return;
		}

		refElecTaxModal.current.handlerOpen();
	};

	/**
	 * 세금계산서 팝업 처리 후 콜백
	 * @param param
	 */
	const callBackElecTaxPopup = (param: any) => {
		if (param) {
			form.setFieldValue('taxNo', param.issueId ?? '');

			const taxYmd = dayjs(param.issueDate ?? '', 'YYYYMMDD');
			form.setFieldValue('taxYmd', taxYmd);

			// if (param.invSign && param.invSign === 'Y') {
			// 	form.setFieldValue('invSign', true);
			// } else {
			// 	form.setFieldValue('invSign', false);
			// }
		}
	};

	/**
	 * 세금계산서 팝업 닫기
	 */
	const closeEventElecTaxPopup = () => {
		refElecTaxModal.current.handlerClose();
	};

	/**
	 * 파일 업로드 팝업 처리 후 콜백
	 * @param {any} param 파일 첨부 결과
	 * @param {number} fileCnt 첨부파일 갯수
	 */
	const callBackFileUploadPopup = (param: any, fileCnt: number) => {
		// 파일 컬럼에 첨부파일 갯수 업데이트
		//const rowIndex = ref.gridRef.current.getSelectedIndex()[0];
		//ref.gridRef.current.setCellValue(rowIndex, 'fileCnt', fileCnt);
	};

	/**
	 * 파일 업로드 팝업 닫기
	 */
	const closeEventFileUploadPopup = () => {
		refUploadfileModal.current.handlerClose();
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			form.setFieldValue('rowStatus', 'U');

			// 헤더 정보에서 부가세율을 변경
			if (Object.keys(changedValues)[0] === 'taxRate') {
				const gridCur = gridRef.current;

				if (gridCur) {
					const taxRate = changedValues['taxRate'];
					const gridData = gridRef.current?.getGridData();
					for (let idx = 0; idx < gridData.length; idx++) {
						gridRef.current.setCellValue(idx, 'taxRate', taxRate);
						calculateColumnValue({
							rowIndex: idx,
							dataField: 'supplyPrice',
							item: gridRef.current.getGridData()[idx],
						});
					}
				} else {
					calculateColumnValueData(allValues !== null);
				}
			}
		}
	};

	/**
	 * gridData 변경 처리
	 * @param index
	 * @param newValues
	 */
	const updateGridDataAt = (index: number, newValues: object) => {
		setGridData(prev => prev.map((item, i) => (i === index ? { ...item, ...newValues } : item)));
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'supplyPrice') {
			const totalSupplyPrice = form.getFieldValue('supplyPrice') ? form.getFieldValue('supplyPrice') : 0;

			if (!totalSupplyPrice || totalSupplyPrice === 0) {
				gridRef.current.setCellValue(rowIndex, 'supplyPrice', 0);
			}

			if (event.item.taxFlag === 'Y') {
				const taxRate = form.getFieldValue('taxRate') ? form.getFieldValue('taxRate') : 0;
				const supplyPrice = event.item.supplyPrice;
				const taxAmount = Number(Math.trunc((Number(supplyPrice) * Number(taxRate)) / 100));
				gridRef.current.setCellValue(rowIndex, 'taxAmount', taxAmount);

				calculateColumnValue({
					rowIndex: rowIndex,
					dataField: 'taxAmount',
					item: gridRef.current.getGridData()[rowIndex],
				});
			}

			let newSupplyPrice = 0;
			const gridData = gridRef.current?.getGridData();
			for (let idx = 0; idx < gridData.length; idx++) {
				newSupplyPrice += gridRef.current.getCellValue(idx, 'supplyPrice');
			}
			form.setFieldValue('supplyPrice', newSupplyPrice);

			let newTaxAmount = 0;
			const gridData2 = gridRef.current?.getGridData();
			for (let idx = 0; idx < gridData2.length; idx++) {
				newTaxAmount += gridRef.current.getCellValue(idx, 'taxAmount');
			}
			form.setFieldValue('taxAmount', newTaxAmount);

			gridRef.current.update();
		}

		if (event.dataField === 'taxAmount') {
			const taxAmount = event.item.taxAmount;
			if (!taxAmount) {
				gridRef.current.setCellValue(rowIndex, 'taxAmount', 0);
			}

			const taxTypeCode = form.getFieldValue('taxTypeCode') ? form.getFieldValue('taxTypeCode') : '';
			const taxRate = form.getFieldValue('taxRate') ? form.getFieldValue('taxRate') : 0;

			if (taxTypeCode === 'U0') {
				if (taxRate !== 0) {
					// showMessage({
					// 	content: '0원 이상 입력할 수 없습니다.',
					// 	modalType: 'warning',
					// });
					form.setFieldValue('taxRate', 0);
					gridRef.current.setCellValue(rowIndex, 'taxAmount', 0);
					gridRef.current.setCellValue(rowIndex, 'amount', gridRef.current.getCellValue(rowIndex, 'supplyPrice'));

					calculateColumnValue({
						rowIndex: rowIndex,
						dataField: 'amount',
						item: gridRef.current.getGridData()[rowIndex],
					});
				} else if (taxAmount !== 0) {
					showMessage({
						content: '0원 이상 입력할 수 없습니다.',
						modalType: 'warning',
					});
					form.setFieldValue('taxRate', 0);
					gridRef.current.setCellValue(rowIndex, 'taxAmount', 0);
					gridRef.current.setCellValue(rowIndex, 'amount', gridRef.current.getCellValue(rowIndex, 'supplyPrice'));

					calculateColumnValue({
						rowIndex: rowIndex,
						dataField: 'amount',
						item: gridRef.current.getGridData()[rowIndex],
					});
				} else {
					gridRef.current.setCellValue(rowIndex, 'amount', event.item.supplyPrice + event.item.taxAmount);

					let newTaxAmount = 0;
					const gridData = gridRef.current?.getGridData();
					for (let idx = 0; idx < gridData.length; idx++) {
						newTaxAmount += gridRef.current.getCellValue(idx, 'taxAmount');
					}
					form.setFieldValue('taxAmount', newTaxAmount);
				}
			} else {
				gridRef.current.setCellValue(rowIndex, 'amount', Number(event.item.supplyPrice) + Number(event.item.taxAmount));

				calculateColumnValue({
					rowIndex: rowIndex,
					dataField: 'amount',
					item: gridRef.current.getGridData()[rowIndex],
				});

				let newTaxAmount = 0;
				const gridData = gridRef.current?.getGridData();
				for (let idx = 0; idx < gridData.length; idx++) {
					newTaxAmount += gridRef.current.getCellValue(idx, 'taxAmount');
				}
				form.setFieldValue('taxAmount', newTaxAmount);
			}

			gridRef.current.update();
		}

		if (event.dataField === 'amount') {
			const amount = event.item.amount;
			if (!amount) {
				gridRef.current.setCellValue(rowIndex, 'amount', 0);
			}

			let newAmount = 0;
			const gridData = gridRef.current?.getGridData();
			for (let idx = 0; idx < gridData.length; idx++) {
				newAmount += gridRef.current.getCellValue(idx, 'amount');
			}
			form.setFieldValue('amount', Number(newAmount));

			gridRef.current.update();
		}

		if (event.dataField === 'accountDetailCode') {
			if (event.item.accountDetailCode === 'W04') {
				//  노조비 적용시 TAX는 'U0'으로 적용
				setTaxTypecodeNameByCode('W04');
			}
		}
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} isAlert 알럿 여부
	 */
	const calculateColumnValueData = (isAlert: any) => {
		const totalSupplyPrice = form.getFieldValue('supplyPrice') ? form.getFieldValue('supplyPrice') : 0;
		const taxRate = form.getFieldValue('taxRate') ? form.getFieldValue('taxRate') : 0;
		const taxTypeCode = form.getFieldValue('taxTypeCode') ? form.getFieldValue('taxTypeCode') : '';
		let newSupplyPrice = 0;
		let newAmount = 0;
		let newTaxAmount = 0;

		for (let idx = 0; idx < gridData.length; idx++) {
			const supplyPrice = !totalSupplyPrice || totalSupplyPrice === 0 ? 0 : gridData[idx].supplyPrice;
			let taxAmount = gridData[idx].taxAmount;
			let amount = gridData[idx].amount;

			if (gridData[idx].taxFlag === 'Y') {
				taxAmount = Math.trunc((supplyPrice * taxRate) / 100);
			}

			if (taxTypeCode === 'U0') {
				if (taxRate !== 0) {
					if (isAlert) {
						showMessage({
							content: '0원 이상 입력할 수 없습니다.',
							modalType: 'warning',
						});
					}
					form.setFieldValue('taxRate', 0);
					taxAmount = 0;
					amount = Number(supplyPrice);
				} else if (taxAmount !== 0) {
					if (isAlert) {
						showMessage({
							content: '0원 이상 입력할 수 없습니다.',
							modalType: 'warning',
						});
					}
					form.setFieldValue('taxRate', 0);
					taxAmount = 0;
					amount = Number(supplyPrice);
				} else {
					amount = Number(supplyPrice) + Number(taxAmount);
				}
			} else {
				amount = Number(supplyPrice) + Number(taxAmount);
			}

			newSupplyPrice += Number(supplyPrice);
			newAmount += Number(amount);
			newTaxAmount += Number(taxAmount);

			updateGridDataAt(idx, { supplyPrice: supplyPrice, taxAmount: taxAmount, amount: amount });
		}

		form.setFieldValue('supplyPrice', newSupplyPrice);
		form.setFieldValue('amount', newAmount);
		form.setFieldValue('taxAmount', newTaxAmount);
	};

	/**
	 * 탭 변경 이벤트
	 * @param key
	 */
	const onChangeTab = (key: string) => {
		setCurrentKey(key);

		if (key === '2') {
			setTimeout(() => {
				if (props.popupType === 'DOCUMENTINFO') {
					const gridRefCur = gridRef.current;
					if (gridRefCur && !isDataBinding) {
						gridRefCur?.setGridData(gridData);

						if (gridData.length > 0) {
							const colSizeList = gridRef.current.getFitColumnSizeList(true);
							gridRef.current.setColumnSizeList(colSizeList);
						}

						setIsDataBinding(true);
					}
				}
			}, 100);
		}

		//window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		gridRef.current?.bind('cellEditBegin', (event: any) => {
			if (props.popupType === 'DOCUMENTINFO' && !isDisable) {
				return true;
			} else {
				return false;
			}
		});
		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef.current?.bind('cellEditEnd', (event: any) => {
			if (props.popupType === 'DOCUMENTINFO') {
				calculateColumnValue(event);
			}
		});
	};

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
		initEvent();
	});

	useEffect(() => {
		// 화면 로딩 시 헤더 정보 조회
		searchMaster();
	}, []);

	useEffect(() => {
		// 헤더 정보가 있으면 폼 데이터 바인딩
		if (headerData && commUtil.isNotEmpty(headerData)) {
			setMasterInfo();
		}
	}, [headerData]);
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRef.current.setGridData(gridData);
		}
	}, [gridData]);
	useEffect(() => {
		// 디테일 정보 조회하면 그리드에 바인딩
		if (props.popupType === 'ITEMINFO') {
			const gridRefCur = gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(gridData);
				if (gridData.length > 0) {
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
				//  입력 활성화 여부 설정
				if (headerData.status !== 'ENT' && headerData.status !== 'R' && props.popupType === 'DOCUMENTINFO') {
					setEnabled(false);
				} else {
					setEnabled(true);
				}
			}
		} else {
			//  입력 활성화 여부 설정
			if (headerData.status !== 'ENT' && headerData.status !== 'R' && props.popupType === 'DOCUMENTINFO') {
				setEnabled(false);
			} else {
				setEnabled(true);
			}
		}
	}, [gridData]);

	return (
		<>
			<Tabs defaultActiveKey="1" onChange={onChangeTab}>
				{props.popupType === 'DOCUMENTINFO' && (
					<TabPane tab={t('Header')} key="1">
						{/* 헤더 영역 */}
						<Form form={form} onValuesChange={onValuesChange}>
							<AGrid>
								<GridTopBtn gridTitle={t('lbl.GENERAL_INFORMATION')} gridBtn={gridBtnHeader}>
									{!isDisable && <Button onClick={attachFile}>{t('Attach File')}</Button>}
									{!isDisable && <Button onClick={saveMasterInfo}>{t('lbl.SAVE')}</Button>}
								</GridTopBtn>
								<UiDetailViewArea>
									<UiDetailViewGroup>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText //Document No
												name="keyNo"
												label={t('lbl.DOCUMENT_NO')}
												disabled={isDisable}
												readOnly
											/>
										</li>
										<li style={{ gridColumn: '3 / span 2' }}>
											<CmSupplierSearch //Supplier
												form={form}
												name="adjustmentSupplierCdName"
												code="adjustmentSupplierCode"
												paymentTerm="paymentTerm"
												paymentTermName="paymentTermName"
												paymentTermCdName="paymentTermCdName"
												vatno="cbRegisno"
												selectionMode="singleRow"
												returnValueFormat="name"
												label={t('lbl.SUPPLIER')}
												isResetForm={false}
												required
												disabled={isDisable}
												draggable={true}
											/>
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<DatePicker //Document Date
												name="issueDate"
												label={t('lbl.ISSUEDATE')}
												disabled={isDisable}
												required
											/>
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>

								<TableTopBtn tableTitle={t('lbl.SLIP_INFORMATION')} tableBtn={tableBtnHeader} />
								<UiDetailViewArea>
									<UiDetailViewGroup>
										<li style={{ gridColumn: '1 / span 1' }}>
											<InputText name="journalTypeCode" label={t('lbl.JOURNAL_TYPE')} disabled={isDisable} readOnly />
										</li>
										<li style={{ gridColumn: '2 / span 1' }}>
											<InputText name="journalTypeName" disabled={isDisable} readOnly />
										</li>
										<li style={{ gridColumn: '3 / span 1' }}>
											<InputText name="accountCrCode" label={t('lbl.CREDIT_ACCOUNT')} disabled={isDisable} readOnly />
										</li>
										<li style={{ gridColumn: '4 / span 1' }}>
											<InputText name="accountCrName" disabled={isDisable} readOnly />
										</li>
										<li style={{ gridColumn: '1 / span 2' }}>
											<InputText name="slipNo" label={t('lbl.SLIPNO')} disabled={isDisable} />
										</li>
										<li style={{ gridColumn: '3 / span 1' }}>
											<InputText name="fiscalYear" label={t('lbl.FISCAL_POSTING_DATE')} disabled={isDisable} readOnly />
										</li>
										<li style={{ gridColumn: '4 / span 1' }}>
											<DatePicker name="postingDate" disabled={isDisable} readOnly />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>

								<TableTopBtn tableTitle={t('lbl.PAYMENT_INFORMATION')} tableBtn={tableBtnHeader} />
								<UiDetailViewArea>
									<UiDetailViewGroup>
										{/*
							<li style={{ gridColumn: '1 / span 1' }}>
								<InputText name="paymentTerm" label={t('Payment Terms')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '2 / span 1' }}>
								<InputText name="paymentTermName" disabled={isDisable} />
							</li>
						  */}
										<li style={{ gridColumn: '1 / span 2' }}>
											<CmPaymentTermSearch //PaymentTerm
												form={form}
												name="paymentTermCdName"
												code="paymentTerm"
												selectionMode="singleRow"
												returnValueFormat="name"
												label={t('lbl.PAYMENT_TERMS')}
												isResetForm={false}
												disabled={isDisable}
												required
												draggable={true}
											/>
										</li>
										<li style={{ gridColumn: '3 / span 2' }}>
											<span>
												<InputNumber
													name="supplyPrice"
													min={1}
													formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
													//formatter={(value: string | number) =>
													//	value != null && !isNaN(Number(value)) ? Number(value).toLocaleString() : ''
													//}
													parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
													label={t('lbl.SUPPLY_PRICE_TAX')}
													disabled={isDisable}
													readOnly
												/>
												<InputNumber
													name="taxAmount"
													min={0}
													formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
													parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
													disabled={isDisable}
													readOnly
												/>
											</span>
										</li>
										<li style={{ gridColumn: '1 / span 1' }}>
											<SelectBox
												name="taxAutoFlag"
												options={getTaxAutoFlag()}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												placeholder="선택해주세요"
												onChange={onChangeSelectTaxType}
												label={t('lbl.TAX_TYPE')}
												disabled={isDisable}
											/>
										</li>
										<li style={{ gridColumn: '2 / span 2' }}>
											<CmTaxTypeSearch
												form={form}
												name="taxTypeCdName"
												code="taxTypeCode"
												data1="taxRate"
												selectionMode="singleRow"
												returnValueFormat="name"
												label={t('')}
												isResetForm={false}
												disabled={isDisable || !isTaxTypeCodeEnabled}
												readOnly={isTaxTypeCodeReadOnly}
												required
												draggable={true}
												onConfirm={setTaxRate}
											/>
										</li>
										<li style={{ gridColumn: '4 / span 1' }}>
											<InputNumber
												name="taxRate"
												min={0}
												formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
												parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
												disabled
											/>
										</li>

										<li style={{ gridColumn: '1 / span 2' }}>
											<DatePicker
												name="taxYmd"
												label={t('lbl.TAX_DATE')}
												disabled={isDisable || !isTaxYmdEnabled}
												required
											/>
										</li>
										<li style={{ gridColumn: '3 / span 2' }}>
											<InputNumber
												name="amount"
												min={0}
												label={t('lbl.AMOUNT')}
												formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
												parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
												disabled={isDisable}
												readOnly
											/>
										</li>
										<li style={{ gridColumn: '1 / span 4' }}>
											<InputText name="summary" label={t('lbl.SUMMARY')} disabled={isDisable} />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>

								<TableTopBtn tableTitle={t('lbl.TAX_INVOICE_INFORMATION')} tableBtn={tableBtnHeader} />
								<UiDetailViewArea>
									<UiDetailViewGroup>
										<li style={{ gridColumn: '1 / span 2' }}>
											<SelectBox
												name="taxTag"
												options={getCommonCodeList('TAX_TAG', t('lbl.ALL'), null)}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												placeholder="선택해주세요"
												onChange={onChangeSelectTaxInvoice}
												label={t('lbl.TAX_INVOICE')}
												disabled={isDisable}
												required
											/>
										</li>
										<li style={{ gridColumn: '3 / span 2' }}>
											<span>
												<InputSearch
													label={t('lbl.TAX_NO')}
													name="taxNo"
													onSearch={openElecTaxPopup}
													disabled={isDisable}
													readOnly={isTaxNoReadOnly}
													hidden
												/>
												{/*
												<CheckBox name="invSign" disabled={isDisable && !isInvSignEnabled}>
													{t('역발행여부')}
												</CheckBox>
												*/}
											</span>
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
					</TabPane>
				)}
				<TabPane tab={t('Detail')} key="2">
					{/* 그리드 영역 */}
					<AGrid>
						<GridTopBtn gridTitle={''} gridBtn={gridBtnDetail}>
							{!isDisable && isKGVisible && <Button onClick={saveKG}>{t('lbl.SAVE_KG_COST')}</Button>}
							{!isDisable && <Button onClick={saveMasterList}>{t('lbl.SAVE')}</Button>}
						</GridTopBtn>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</AGrid>
				</TabPane>
			</Tabs>

			<ButtonWrap data-props="single">
				<Button onClick={close}> {t('lbl.CLOSE')} </Button>
			</ButtonWrap>

			{/* 세금계산서 팝업 영역 정의 */}
			<CustomModal ref={refElecTaxModal} width="1000px" draggable>
				<IbExpenseElecTaxPopup
					callBack={callBackElecTaxPopup}
					close={closeEventElecTaxPopup}
					serialkey={form.getFieldValue('serialkey')}
					adjustmentSupplierCode={form.getFieldValue('adjustmentSupplierCode')}
					adjustmentSupplierName={form.getFieldValue('adjustmentSupplierName')}
					cbRegisno={form.getFieldValue('cbRegisno')}
				/>
			</CustomModal>

			{/* 코스트코드 팝업 영역 정의 */}
			<IbExpenseCostCodePopup ref={refGridModal} />

			{/* 파일 팝업 영역 정의 */}
			<CustomModal ref={refUploadfileModal} width="1000px" draggable>
				<IbExpeneFileUploadPopup
					callBack={callBackFileUploadPopup}
					close={closeEventFileUploadPopup}
					serialkey={props.serialkey} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>
		</>
	);
});

export default IbExpenseDocumentInfoPopup;
