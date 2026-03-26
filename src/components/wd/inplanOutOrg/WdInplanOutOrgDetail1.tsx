/*
 ############################################################################
 # FiledataField	: WdInplanOutOrgDetail1.tsx
 # Description		: 정산 > 외부창고정산 > 운송비 세부내역 조회(Detail)
 # Author			: ParkJinWoo
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useSelector } from 'react-redux/es/hooks/useSelector';
// Utils

// Redux

// API Call Function

const WdInplanOutOrgDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { form, formRef } = props; // Antd Form
	const { t } = useTranslation();
	const { setTotalCnt, setGridData2 } = props; // Antd Form
	const gStorerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const excelInputRef = useRef(null); // 업로드 파일 Ref

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		// ===== 기본 정보 =====
		{
			dataField: 'slipNo',
			headerText: '오더번호',
			width: 140,
			dataType: 'code',
		},
		{
			dataField: 'deliveryDate',
			headerText: '출고일자',
			dataType: 'date',
			width: 110,
		},
		{
			headerText: '창고 정보',
			children: [
				{
					dataField: 'organize',
					headerText: '창고코드',
					width: 110,
					dataType: 'code',
				},
				// {
				// 	dataField: 'plant',
				// 	headerText: '플랜트',
				// 	width: 90,
				// },
				// {
				// 	dataField: 'storageLoc',
				// 	headerText: '창고코드',
				// 	width: 100,
				// },
				{
					dataField: 'warehouseName',
					headerText: '창고명',
					width: 160,
				},
				{
					dataField: 'warehouseZone',
					headerText: '권역',
					width: 100,
					dataType: 'code',
				},
				{
					dataField: 'warehouseArea',
					headerText: '지역',
					width: 100,
					dataType: 'code',
				},
				{
					dataField: 'warehouseAddress',
					headerText: '창고주소',
					width: 220,
				},
			],
		},
		// ===== 관리처 정보 =====
		{
			headerText: '관리처 정보',
			children: [
				{
					dataField: 'manageCustKey',
					headerText: '관리처코드',
					width: 120,
					dataType: 'code',
				},
				{
					dataField: 'manageCustName',
					headerText: '관리처명',
					width: 160,
				},
				// {
				// 	dataField: 'manageCustZipcode',
				// 	headerText: '관리처우편번호',
				// 	width: 110,
				// },
				// {
				// 	dataField: 'manageCustZone',
				// 	headerText: '권역',
				// 	width: 100,
				// 	dataType: 'code',
				// },
				// {
				// 	dataField: 'manageCustArea',
				// 	headerText: '지역',
				// 	width: 100,
				// 	dataType: 'code',
				// },
				{
					dataField: 'manageCustAddress',
					headerText: '주소',
					width: 220,
				},
				{
					dataField: 'courier',
					headerText: '운송사',
					width: 100,
				},
			],
		},
		// ===== 운송비 정보 =====
		{
			dataField: 'reference10',
			headerText: '운송료',
			width: 120,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		// {
		// 	dataField: 'tranDeliveryPrice',
		// 	headerText: '운송비',
		// 	width: 120,
		// 	dataType: 'numeric',
		// 	formatString: '#,##0',
		// },

		// ===== 상품 / 수량 / 중량 =====
		{
			dataField: 'storageTypeCd',
			headerText: '저장조건',
			width: 100,
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 120,
		},
		{
			dataField: 'skuName',
			headerText: '상품명',
			width: 180,
		},
		{
			dataField: 'qtyPerBox',
			headerText: '박스입수',
			width: 110,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'netWeight',
			headerText: '순중량',
			width: 120,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'baseUom',
			headerText: '단위',
			width: 80,
			dataType: 'code',
		},

		{
			dataField: 'confirmQty',
			headerText: '출고수량',
			width: 110,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},

		{
			dataField: 'confirmNetWeight',
			headerText: '출고중량',
			width: 130,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},

		// ===== 이력 / 계약 정보 =====
		{
			dataField: 'serialNo',
			headerText: '이력번호',
			width: 140,
		},
		{
			dataField: 'barcode',
			headerText: '바코드',
			width: 140,
		},
		{
			dataField: 'convSerialNo',
			headerText: 'BL',
			width: 140,
		},
		{
			dataField: 'contractTypeCd',
			headerText: '계약유형',
			width: 100,
			dataType: 'code',
		},
		{
			dataField: 'contractCompany',
			headerText: '계약업체',
			width: 130,
		},
		{
			dataField: 'contractCompanyName',
			headerText: '계약업체명',
			width: 160,
			dataType: 'code',
		},
		{
			dataField: 'poKey',
			headerText: 'PO번호',
			width: 120,
		},
		{
			dataField: 'poLine',
			headerText: 'PO항번',
			width: 80,
		},

		// // ===== 주문 정보 =====
		// {
		// 	dataField: 'orderType',
		// 	headerText: '주문유형',
		// 	width: 100,
		// },
		// {
		// 	dataField: 'poType',
		// 	headerText: '주문사유',
		// 	width: 100,
		// },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: true,
		//		independentAllCheckBox: true,
		fillColumnSizeMode: false,
		// showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'toOrderqty',
			positionField: 'toOrderqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 이동수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1', // 엑셀업로드
			// 	callBackFn: excelUpload,
			// },
			// // {
			// // 	btnType: 'excelUpload', // 엑셀업로드 - 사용자버튼용
			// // },
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: saveMasterList,
			// },
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={`SO`} totalCnt={props.totalCnt} />
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 엑셀 업로드 영역 정의 */}
		</>
	);
});
export default WdInplanOutOrgDetail1;
