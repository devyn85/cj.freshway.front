/*
 ############################################################################
 # FiledataField	: IbExpenseDocumentInfoDetailPopup .tsx
 # Description		: 비용기표 - 문서정보 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.06
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// component
import GridTopBtn from '@/components/common/GridTopBtn';
import IbExpenseCostCodePopup from '@/components/ib/expense/IbExpenseCostCodePopup';

// Utils

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function

interface PropsType {
	gridData?: any;
	headerData?: any;
	popupType: string;
	serialkey: any;
	save?: any;
	saveKG?: any;
}

const IbExpenseDocumentInfoDetailPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { gridData, headerData, popupType, serialkey } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 그리드 접근을 위한 Ref
	ref.gridRef = useRef();

	const refGridModal = useRef(null);

	// 입력 활성화 여부
	const [isDisable, setIsDisable] = useState(true);
	// 저장 버튼 활성화 여부
	const [isVisibleSave, setIsVisibleSave] = useState(false);
	// KG 비용저장 버튼 활성화 여부
	const [isKGVisible, setIsKGVisible] = useState(true);

	// 그리드 버튼 영역
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 그리드 Ref
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
			headerText: t('Doc Type'), //Doc Type
			editable: false,
			dataType: 'code',
			labelFunction: docTypeLabelFunc,
		},
		{
			dataField: 'documentNumber',
			headerText: t('Document No'), //Document No
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'poNo',
			headerText: t('P/O No'), //P/O No
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'attribute1',
			headerText: t('P/O Line'), //P/O Line
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDetailCode',
			headerText: t('Cost Code'), //Cost Code
			editable: false,
			dataType: 'code',
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					refGridModal.current.open({
						srcGridRef: ref.gridRef,
						rowIndex: e.rowIndex,
						dataFieldMap: {
							accountDetailCode: 'code',
							accountDetailName: 'name',
							accountDrCode: 'data1',
							accountDrName: 'data2',
							summary: 'name',
						},
					});
				},
			},
		},
		{
			dataField: 'accountDetailName',
			headerText: t('CostName'), //CostName
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDrCode',
			headerText: t('G/L Account'), //G/L Account
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'accountDrName',
			headerText: t('G/L Acc name'), //G/L Acc name
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'supplyPrice',
			headerText: t('Supply Price'), //Supply Price
			editable: true,
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'taxFlag',
			headerText: t('부가세자동계산'), //부가세자동계산
			editable: true,
			dataType: 'code',
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TAX_FLAG', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'taxAmount',
			headerText: t('Tax'), //Tax
			editable: true,
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
		},
		{
			dataField: 'amount',
			headerText: t('Amount'), //Amount
			editable: false,
			dataType: 'numeric',
		},
		{
			dataField: 'summary',
			headerText: t('Summary'), //Summary
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'creditKind',
			headerText: t('Credit Kind'), //Credit Kind
			editable: true,
			dataType: 'code',
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CREDIT_KIND', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'costcd',
			headerText: t('FI코스트센터'), //FI코스트센터
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'dccode',
			headerText: t('FI플랜트코드'), //FI플랜트코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'itemCode',
			headerText: t('FI상품코드'), //FI상품코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'saleCustomerCode',
			headerText: t('FI고객코드'), //FI고객코드
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'baseuom',
			headerText: t('기본 단위'), //기본 단위
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'quantity',
			headerText: t('수량'), //수량
			editable: false,
			dataType: 'numeric',
		},
		{
			dataField: 'kgCal',
			headerText: t('중량(KG)'), //중량(KG)
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'rateQty',
			headerText: t('KG비중(%)'), //KG비중
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.##',
			postfix: '%',
		},
		{
			dataField: 'disCost',
			headerText: t('KG& 비용분배'), //KG 비용분배
			editable: false,
			dataType: 'numeric',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
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
			formatString: '#,##0.###',
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
	 * 입력 항목들의 활성화 여부를 설정한다.
	 * @param enabled
	 */
	const setEnabled = (enabled: boolean) => {
		//기본 입력 활성화 여부
		//setIsDisable(!enabled);
		setIsDisable(false); //임시

		const gridData = ref.gridRef.current.getGridData();

		//KG 비용저장 버튼은 ACCOUNT_DETAIL이 기타일때만 노출
		if (gridData && gridData[0].accountDetailCode === 'K08') {
			setIsKGVisible(enabled);
		} else {
			setIsKGVisible(false);
		}
	};

	/**
	 * 그리드 정보를 저장한다.
	 */
	const saveMasterList = () => {
		props.save();
	};

	/**
	 * KG 비용을 저장한다.
	 */
	const saveKG = () => {
		props.saveKG();
	};

	/**
	 * 세금계산서 팝업 닫기
	 */
	const closeEventCoseCodePopup = () => {
		refGridModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			// 입력 활성화 여부 설정
			if (props.headerData.status !== 'ENT' && props.headerData.status !== 'R' && props.popupType === 'DOCUMENTINFO') {
				setEnabled(false);
			} else {
				setEnabled(true);
			}
		}
	}, [props.gridData]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridTitle={''} gridBtn={gridBtnDetail}>
					{isKGVisible && (
						<Button onClick={saveKG} disabled={isDisable}>
							{t('KG 비용저장')}
						</Button>
					)}
					{!isDisable && (
						<Button onClick={saveMasterList} disabled={isDisable}>
							{t('lbl.SAVE')}
						</Button>
					)}
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			<IbExpenseCostCodePopup ref={refGridModal} />
		</>
	);
});

export default IbExpenseDocumentInfoDetailPopup;
