/*
 ############################################################################
 # FiledataField	: RtReceiptConfirmExDcDetailMasterSub.tsx
 # Description		: 외부치축반품확정처리(출고내역)
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
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import { apiGetStatus } from '@/api/cm/apiCmCheckSAPClose';
import { apisaveMasterList1 } from '@/api/rt/apiRtReceiptConfirmExDc';
//store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const RtReceiptConfirmExDcDetailMasterSub = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
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
		// ------------- SKUINFO 병합 ---------------------------------
		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', editable: false },
				{ dataField: 'skuName', headerText: '상품명칭', editable: false, dataType: 'string' },
			],
		},
		// ------------- 계속 단일 헤더 --------------------------------
		{ dataField: 'plantDescr', headerText: '플랜트', editable: false, visible: false },
		{ dataField: 'channel', headerText: '저장유무', editable: false, dataType: 'code' },
		{ dataField: 'storageType', headerText: '저장조건', editable: false, dataType: 'code' },
		{ dataField: 'qtyPerBox', headerText: '박스입수', editable: false, dataType: 'code' },
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
		{ dataField: 'confirmQty', headerText: '반품수량', editable: false, dataType: 'numeric', formatString: '#,##0.##' },
		{
			dataField: 'shortageQty',
			headerText: '미회수수량',
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		// { dataField: 'lotTable01', headerText: '소비기한(유통,제조)', editable: false },
		// { dataField: 'durationTerm', headerText: '소비기한(잔여/전체)', editable: false },
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

		{ headerText: '반품로케이션', dataField: 'toLoc', editable: false, visible: false },
		{
			headerText: '미회수작업량',
			dataField: 'shortageTranQty',
			editable: true,
			dataType: 'numeric',
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
		// ------------- UNRETURNINFO 병합 -----------------------------
		{
			headerText: '미회수정보',
			children: [
				{
					headerText: '미회수사유',
					dataField: 'reasonCode',
					editable: true,
					renderer: {
						type: 'DropDownListRenderer',
						list: getCommonCodeList('REASONCODE_RT', ''),
						keyField: 'comCd',
						valueField: 'cdNm',
					},
				},
				{ headerText: '비고', dataField: 'reasonMsg', editable: true },
			],
		},
		// ------------------------------------------------------------
		{
			dataField: 'returnType',
			headerText: '회수여부',
			editable: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('RETURNTYPE_RT', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ dataField: 'confirmDate', headerText: '반품확정여부', width: 90, editable: false, dataType: 'code' },
		{ dataField: 'packingMethod', headerText: '실물여부', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'reasonMsg', headerText: '세부내역', width: 80, editable: false },

		{ dataField: 'other01', headerText: '귀책구분', width: 90, editable: false, visible: false },
		{ dataField: 'blngDeptName', headerText: '귀속구분', width: 90, editable: false, visible: false },
		{ dataField: 'orderTypeName', headerText: '반품유형', width: 90, editable: false, dataType: 'code' },

		{ dataField: 'saleOrganize', headerText: '영업조직', width: 80, editable: false },
		{ dataField: 'saleDepartment', headerText: '사업장', width: 80, editable: false },
		{ dataField: 'saleGroup', headerText: '영업그룹', width: 80, editable: false },

		{ dataField: 'fromCustkey', headerText: '관리처코드', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'fromCustname', headerText: '관리처명', width: 320, editable: false, dataType: 'string' },
		{ dataField: 'billToCustkey', headerText: '판매처코드', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'billToCustname', headerText: '판매처명', width: 80, editable: false, dataType: 'string' },

		{ dataField: 'other03', headerText: 'VoC(소)', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'other04', headerText: 'VoC(세)', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'vendoReturn', headerText: '협력사반품', width: 80, editable: false, dataType: 'code' },
		{ dataField: 'custName', headerText: '협력사명', width: 320, editable: false, dataType: 'string' },
		{ dataField: 'directionRt', headerText: '처리지시', width: 80, editable: false, dataType: 'code' },
		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialNo', headerText: '이력번호', editable: false },
				{ dataField: 'barcode', headerText: '바코드', editable: false },
				{ dataField: 'convSerialNo', headerText: 'B/L번호', editable: false },
				// { dataField: 'butcheryDt', headerText: '도축일자', editable: false },
				// { dataField: 'factoryName', headerText: '도축장', editable: false },
				{ dataField: 'contractType', headerText: '계약유형', editable: false, dataType: 'code' },
				{ dataField: 'contractCompany', headerText: '계약업체', editable: false, dataType: 'code' },
				{ dataField: 'contractCompanyName', headerText: '계약업체명', editable: false },
			],
		},
	];

	//그리드 Props
	const gridProps = {
		// editable: false,
		// showFooter: true,
		editable: true, // ★ 그리드 전역 편집 허용
		showRowCheckColumn: true,
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

		const gridDataWithState = grid.getGridDataWithState?.('state');
		if (rows === null || rows.length === 0) {
			showAlert('', '변경된 데이터가 존재하지 않습니다.');
		}
		//SAP체크(출고내역은 SAP체크만)
		const sapChk = await getSapCloseStatus(rows);
		if (!sapChk) return;

		const payload = rows // 최상위 배열
			.flat() // ▶ [ { rowIndex: 1, item: {...} } ]
			.map(({ item }: { item: any }) => item);
		// //console.log(payload);
		const params = {
			saveMasterSubList: payload,
		};

		apisaveMasterList1(params).then(res => {
			if (res.statusCode === 0) {
				showAlert('', res.statusMessage, () => {
					props.callback();
				});
			}
		});
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
					// showMessage({
					// 	content: res.data.errorMsg,
					// 	modalType: 'error',
					// });
					return false;
				}
			}
		}
		return true;
	};
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
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
				ref.gridRef.current.setColumnPropByDataField('serialNo', { width: 215 });
				ref.gridRef.current.setColumnPropByDataField('barcode', { width: 205 });
				ref.gridRef.current.setColumnPropByDataField('contractCompany', { width: 119 });
				ref.gridRef.current.setColumnPropByDataField('fromCustkey', { width: 106 });
			}
		}
	}, [props.data]);

	return (
		<AGrid className="h100">
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
export default RtReceiptConfirmExDcDetailMasterSub;
