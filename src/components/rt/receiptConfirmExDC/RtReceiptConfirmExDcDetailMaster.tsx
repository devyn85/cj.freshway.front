/*
 ############################################################################
 # FiledataField	: RtReceiptConfirmExDcDetailMaster.tsx
 # Description		: 외부치축반품확정처리(입고내역)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.22
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils
import commUtil from '@/util/commUtil';
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import { apiGetStatus } from '@/api/cm/apiCmCheckSAPClose';
import { apisaveMasterList } from '@/api/rt/apiRtReceiptConfirmExDc';
//store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { showAlert } from '@/util/MessageUtil';
import { forwardRef, useEffect, useRef } from 'react';

const RtReceiptConfirmExDcDetailMaster = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
		/* ----------------------------------------- 1행(rowSpan=2) 단일 헤더 */
		{ dataField: 'serialYn', headerText: 'serialYn', editable: false, visible: false },
		{ dataField: 'line01', headerText: 'line01', editable: false, visible: false },
		{ dataField: 'storerkey', headerText: 'storerkey', editable: false, visible: false },
		{ dataField: 'dcCode', headerText: '물류센터', editable: false, visible: false },
		{ dataField: 'organize', headerText: '창고', editable: false, dataType: 'code' },
		{ dataField: 'organizeName', headerText: '창고명', editable: false, dataType: 'string' },
		{ dataField: 'docnoWd', headerText: '고객주문번호', editable: false, dataType: 'code' },
		{ dataField: 'docNo', headerText: '고객반품주문번호', editable: false, dataType: 'code' },
		{ dataField: 'slipDt', headerText: '주문요청일자', editable: false, dataType: 'date' },
		{ dataField: 'poTypeName', headerText: '주문사유', editable: false, dataType: 'code' },
		{ dataField: 'statusName', headerText: '진행상태', editable: false, dataType: 'code' },
		{ dataField: 'docLine', headerText: '품목번호', editable: false, dataType: 'code' },

		/* ----------------------------------------- SKU 머지 헤더 */
		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', editable: false, dataType: 'code' },
				{ dataField: 'skuName', headerText: '상품명칭', editable: false, dataType: 'string' },
			],
		},

		/* ----------------------------------------- 나머지 단일 헤더 */
		{ dataField: 'plantDescr', headerText: '플랜트', editable: false, dataType: 'code' },
		{ dataField: 'channel', headerText: '저장유무', editable: false, dataType: 'code' },
		{ dataField: 'storageType', headerText: '저장조건', editable: false, dataType: 'code' },
		{ dataField: 'qtyPerBox', headerText: '박스입수', editable: false, dataType: 'numeric' },
		{ dataField: 'uom', headerText: '구매단위', editable: false, dataType: 'code' },
		{
			dataField: 'orderQty',
			headerText: '고객반품주문수량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'inspectQty',
			headerText: '반품검수량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'confirmQty',
			headerText: '반품수량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortageQty',
			headerText: '미회수수량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'lotTable01',
			headerText: '소비기한(유통,제조)',
			editable: false,
			dataType: 'code',
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'durationTerm',
			headerText: '소비기한(잔여/전체)',
			editable: false,
			dataType: 'code',
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		},

		/* 편집 가능: tranQty */
		{
			dataField: 'tranQty',
			headerText: '반품작업량',
			formatString: '#,##0.###', // 표시 포맷
			dataType: 'numeric',
			editable: true, // ← 편집 가능
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// onlyNumeric: true, // 0~9만 입력가능
				onlyNumeric: false,
				allowPoint: true, // 소수점( . ) 도 허용할지 여부
				allowNegative: true, // 마이너스 부호(-) 허용 여부
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
				// decimalPrecision: 2, // 소숫점 2자리까지 허용
				// regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
			},
		},
		{
			dataField: 'returnType',
			headerText: '회수여부',
			dataType: 'code',
			editable: true,
			width: 100,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('RETURNTYPE_RT', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},

		/* ----------------------------------------- BOX 계산 머지 헤더 */
		{
			headerText: '박스환선장보',
			children: [
				{ dataField: 'avgWeight', headerText: '평균중량', editable: false, dataType: 'numeric' },
				{ dataField: 'calBox', headerText: '환산박스', editable: false, dataType: 'numeric' },
				{ dataField: 'realOrderBox', headerText: '실박스예정', editable: false, dataType: 'numeric' },
				{ dataField: 'realCfmBox', headerText: '실박스확정', editable: false, dataType: 'numeric' },
				{ dataField: 'tranBox', headerText: '작업박스수량', editable: false, visible: false, dataType: 'numeric' },
			],
		},
		// {
		// 	headerText: '상품이력정보',
		// 	children: [
		{ dataField: 'serialNo', headerText: '이력번호', editable: false, visible: false },
		{ dataField: 'barcode', headerText: '바코드', editable: false, visible: false },
		{ dataField: 'convSerialNo', headerText: 'B/L번호', editable: false, visible: true },
		// { dataField: 'butcheryDt', headerText: '도축일자', editable: false },
		// { dataField: 'factoryName', headerText: '도축장', editable: false },
		{ dataField: 'contractType', headerText: '계약유형', editable: false, visible: false },
		{ dataField: 'contractCompany', headerText: '계약업체', editable: false, visible: false },
		{ dataField: 'contractCompanyName', headerText: '계약업체명', editable: false, visible: false },
		// 	],
		// },
	];

	//그리드 Props
	const gridProps = {
		editable: true,
		//editBeginMode: 'doubleClick',
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
	};

	//그리드 footer
	const footerLayout = [
		{
			dataField: 'slipDt',
			positionField: 'slipDt',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 *
	 */

	/**
	 * 저장 로직
	 * @returns
	 */
	const saveGrid = async () => {
		const grid = ref.gridRef.current;
		const rows = grid.getCheckedRowItems?.();

		if (rows === null || rows.length === 0) {
			showAlert('', '변경된 데이터가 존재하지 않습니다.');
			return;
		}
		const sapChk = await getSapCloseStatus(rows);
		if (!sapChk) return;

		for (const row of rows) {
			// //console.log('row' + row.item.area);

			if (
				row.item.serialYn === 'Y' &&
				row.item.line01 === 'Y' &&
				Number(row.item.tranQty) !== Number(row.item.inspectQty) &&
				Number(row.item.tranQty) !== Number(row.item.inspectQty) * -1 &&
				row.item.tranQty !== '0'
			) {
				showAlert('', '비정량 이력상품의 경우 검수량과 동일한 수량을 입력하시기 바랍니다.');
				return;
			} else if (row.item.confirmQty === '0' && row.item.tranQty === '0' && row.item.tranBox !== '0') {
				showAlert('', '반품수량을 입력하시기 바랍니다.');
				return;
			}
		}
		const payload = rows // 최상위 배열
			.flat() // ▶ [ { rowIndex: 1, item: {...} } ]
			.map(({ item }: { item: any }) => item);
		// //console.log(payload);
		const params = {
			saveMasterList: payload,
		};

		apisaveMasterList(params).then(res => {
			if (res.statusCode === 0) {
				showAlert('', res.statusMessage, () => {
					props.callback();
				});
			}
		});
	};
	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveGrid,
			},
		],
	};

	/**
	 * SAP 마감여부 조회
	 * @param {any[]} checkedItems
	 * @returns
	 */
	const getSapCloseStatus = async (checkedItems: any[]) => {
		for (const item of checkedItems) {
			if (item.tranqty < 0) {
				const params = {
					docno: item.docno,
					docline: item.docline,
					deliverydate: item.slipdt,
				};
				const res = await apiGetStatus(params);
				if (res.data.result !== 'Y') {
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		if (ref.gridRef?.current && props.data) {
			ref.gridRef.current.setGridData(props.data);

			if (props.data.length > 0) {
				// //console.log(true);
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);

				ref.gridRef.current.setColumnPropByDataField('organize', { width: colSizeList[4] + 20 });
			}
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
			<AUIGrid
				ref={ref.gridRef}
				name={gridId}
				columnLayout={gridCol}
				gridProps={gridProps}
				footerLayout={footerLayout}
			/>
		</AGrid>
	);
});
export default RtReceiptConfirmExDcDetailMaster;
