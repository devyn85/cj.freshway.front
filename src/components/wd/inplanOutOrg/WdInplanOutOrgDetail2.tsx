/*
 ############################################################################
 # FiledataField	: WdInplanOutOrgDetail2.tsx
 # Description		: 정산 > 외부창고정산 > 운송비 세부내역 조회(Detail)
 # Author			: ParkJinWoo
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function

const WdInplanOutOrgDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 스타일 함수
	 * @param rowIndex 행 인덱스
	 * @param columnIndex 열 인덱스
	 * @param value 셀 값
	 * @param headerText 헤더 텍스트
	 * @param item 데이터 항목
	 * @returns 스타일 객체
	 */
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		//return item.processflag === 'E' ? { backgroundColor: 'darkorange' } : '';
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		// ===== 기본 정보 =====
		{
			dataField: 'serialKeyGroup',
			headerText: 'serialKeyGroup',
			width: 140,
			cellMerge: true,
			dataType: 'code',
			visible: false,
		},
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
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
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
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
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
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
				},
				{
					dataField: 'warehouseZone',
					headerText: '권역',
					width: 100,
					dataType: 'code',
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
				},
				{
					dataField: 'warehouseArea',
					headerText: '지역',
					width: 100,
					dataType: 'code',
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
				},
				{
					dataField: 'warehouseAddress',
					headerText: '창고주소',
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
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
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
				},
				{
					dataField: 'manageCustName',
					headerText: '관리처명',
					cellMerge: true,

					mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
					mergePolicy: 'restrict',
					width: 160,
				},
			],
		},
		{
			dataField: 'tonCd',
			headerText: '톤급',
			width: 160,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'carCnt',
			headerText: '차량대수',
			width: 160,
			cellMerge: true,

			mergeRef: 'tonCd', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
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
		// {
		// 	dataField: 'manageCustAddress',
		// 	headerText: '주소',
		// 	width: 220,
		// },
		// {
		// 	dataField: 'courier',
		// 	headerText: '운송사',
		// 	width: 100,
		// },

		// ===== 운송비 정보 =====
		{
			dataField: 'reference10',
			headerText: '운송료',
			width: 120,
			dataType: 'numeric',
			formatString: '#,##0',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
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
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 120,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'skuName',
			headerText: '상품명',
			width: 180,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'qtyPerBox',
			headerText: '박스입수',
			width: 110,
			dataType: 'numeric',
			formatString: '#,##0.###',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'netWeight',
			headerText: '순중량',
			width: 120,
			dataType: 'numeric',
			formatString: '#,##0.###',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'baseUom',
			headerText: '단위',
			width: 80,
			dataType: 'code',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},

		{
			dataField: 'confirmQty',
			headerText: '출고수량',
			width: 110,
			dataType: 'numeric',
			formatString: '#,##0.###',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},

		{
			dataField: 'confirmNetWeight',
			headerText: '출고중량',
			width: 130,
			dataType: 'numeric',
			formatString: '#,##0.###',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},

		// ===== 이력 / 계약 정보 =====
		{
			dataField: 'serialNo',
			headerText: '이력번호',
			width: 140,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'barcode',
			headerText: '바코드',
			width: 140,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'convSerialNo',
			headerText: 'BL번호',
			width: 140,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'contractTypeCd',
			headerText: '계약유형',
			width: 100,
			dataType: 'code',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'contractCompany',
			headerText: '계약업체',
			width: 130,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'contractCompanyName',
			headerText: '계약업체명',
			width: 160,
			dataType: 'code',
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'poKey',
			headerText: 'PO번호',
			width: 120,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
		},
		{
			dataField: 'poLine',
			headerText: 'PO항번',
			width: 80,
			cellMerge: true,

			mergeRef: 'serialKeyGroup', // 대분류(gubun0 필드) 셀머지의 값을 비교해서 실행함. (mergePolicy : "restrict" 설정 필수)
			mergePolicy: 'restrict',
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
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		enableCellMerge: true,
		// showFooter: true,
	};
	// FooterLayout Props
	const footerLayout = [
		{},
		// {
		// 	labelText: t('lbl.TOTAL'), // 합계
		// 	positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		// },
		// { dataField: 'toOrderqty', positionField: 'toOrderqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 이동수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
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
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 상품LIST */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={`STO`} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default WdInplanOutOrgDetail2;
