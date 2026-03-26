/*
 ############################################################################
 # FiledataField	: WdKxDeliveryInvoiceDetail6.tsx
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인) (정렬기준정보 탭)
                    apiWdDeliveryLabelForce 공용사용
 # Author					: sss
 # Since					: 2025.12.22.
 ############################################################################
*/
import { apiPostSaveMasterList } from '@/api/wd/apiWdDeliveryLabelForce';

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
interface Props {
	form: any;
	search: any;
	data: Array<any>;
	totalCnt: number;
}

const WdKxDeliveryInvoiceDetail6 = forwardRef((props: Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const gDccode = Form.useWatch('fixdccode', props.form);
	const dccodeList = getUserDccodeList();

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// 행추가
				btnType: 'plus',
				isActionEvent: false,
				callBackFn: () => {
					ref.gridRef.current?.addRow({
						dccode: gDccode,
						dcname: dccodeList.find((item: any) => item.dccode === gDccode)?.dcnameOnlyNm,
						usePgm: storeUtil.getMenuInfo().progCd,
						rowStatus: 'I',
					});
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	// 그리드 초기화
	const gridCol1 = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			// 02. 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			// 03. 출력명칭
			dataField: 'prtNm',
			headerText: t('lbl.PRINT_NAME'),
			dataType: 'text',
			editable: true,
			required: true,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{
			// 04. 출력순서1
			dataField: 'prdOrd1',
			headerText: t('lbl.PRINTORDER1'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 05. 정렬1
			dataField: 'seq1',
			headerText: t('lbl.SORTKEY1'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 06. 출력순서2
			dataField: 'prdOrd2',
			headerText: t('lbl.PRINTORDER2'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 07. 정렬2
			dataField: 'seq2',
			headerText: t('lbl.SORTKEY2'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 08. 출력순서3
			dataField: 'prdOrd3',
			headerText: t('lbl.PRINTORDER5'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 09. 정렬3
			dataField: 'seq3',
			headerText: t('lbl.SORTKEY3'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 10. 출력순서4
			dataField: 'prdOrd4',
			headerText: t('lbl.PRINTORDER4'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 11. 정렬4
			dataField: 'seq4',
			headerText: t('lbl.SORTKEY4'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 13. 출력순서5
			dataField: 'prdOrd5',
			headerText: t('lbl.PRINTORDER5'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 14. 정렬5
			dataField: 'seq5',
			headerText: t('lbl.SORTKEY5'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 15. 출력순서6
			dataField: 'prdOrd6',
			headerText: t('lbl.PRINTORDER6'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 16. 정렬6
			dataField: 'seq6',
			headerText: t('lbl.SORTKEY6'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 17. 출력순서7
			dataField: 'prdOrd7',
			headerText: t('lbl.PRINTORDER7'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 18. 정렬7
			dataField: 'seq7',
			headerText: t('lbl.SORTKEY7'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 19. 출력순서8
			dataField: 'prdOrd8',
			headerText: t('lbl.PRINTORDER8'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTORDER5', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTORDER5', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},
		{
			// 20. 정렬8
			dataField: 'seq8',
			headerText: t('lbl.SORTKEY8'),
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PRINTSORT', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const name = getCommonCodebyCd('PRINTSORT', value)?.cdNm;
				// 값이 비어있거나 null/undefined 이면 기본 텍스트 표시
				return name && String(name).trim() !== '' ? name : t('lbl.SELECT');
			},
		},

		{
			// 21. 비고
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'text',
			editable: true,
		},
		{
			/* 22. 등록자 */
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'code',
			editable: false,
		},
		{
			/* 23. 등록일시 */
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
		},
		{
			/* 24. 수정자 */
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'code',
			editable: false,
		},
		{
			/* 25. 수정일시 */
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.rowStatus, 'U') == 'U') {
			return true;
		}
		return false;
	};

	// 저장 버튼
	const saveMasterList = async () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		const updatedItems = ref.gridRef.current.getChangedData(); // 수정된 것만(체크박스 제외)

		if (!updatedItems || updatedItems.length < 1) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// --- 검증 로직 시작 ---
		// 각 변경된 행에 대해 prdOrd1..prdOrd8 과 seq1..seq8 쌍이 일관성 있는지 검사
		for (const row of updatedItems) {
			// 삭제 행은 검증에서 제외 (삭제 행의 경우 rowStatus가 'D'로 오는 패턴을 가정)
			//if (String(row.rowStatus || '').toUpperCase() === 'D') continue;

			// --- 1) prdOrd / seq 쌍 검증 (기존) ---
			for (let i = 1; i <= 8; i++) {
				const prdKey = `prdOrd${i}`;
				const seqKey = `seq${i}`;

				const prdVal = row[prdKey] == null ? '' : String(row[prdKey]).trim();
				const seqVal = row[seqKey] == null ? '' : String(row[seqKey]).trim();

				// prd와 seq 중 하나만 채워져 있으면 에러
				const prdEmpty = prdVal === '';
				const seqEmpty = seqVal === '';

				if ((prdEmpty && !seqEmpty) || (!prdEmpty && seqEmpty)) {
					showAlert(
						null,
						// 출력명칭 {{0}} 항목의 출력순서{{1}} 과 정렬{{1}} 은(는) 함께 입력되어야 합니다. 둘 중 하나가 비어있습니다.
						t('msg.MSG_WD_DELIVERY_LABEL_FORCE_004', [row.prtNm, i]),
					);
					return;
				}
			}
			// --- 2) prdOrd1..prdOrd8 내 중복 검사 (신규) ---
			const prdVals: string[] = [];
			for (let i = 1; i <= 8; i++) {
				const prdKey = `prdOrd${i}`;
				const prdVal = row[prdKey] == null ? '' : String(row[prdKey]).trim();
				if (prdVal !== '') prdVals.push(prdVal);
			}

			if (prdVals.length > 0) {
				const seen = new Set<string>();
				let dupVal: string | null = null;
				for (const v of prdVals) {
					if (seen.has(v)) {
						dupVal = v;
						break;
					}
					seen.add(v);
				}
				if (dupVal) {
					const label = row.prtNm || row.dccode || `rowIndex:${row.rowIndex ?? '?'}`;
					showAlert(
						null,
						// 출력명칭 {{0}} 항목의 중복된 출력순서가 존재합니다.
						t('msg.MSG_WD_DELIVERY_LABEL_FORCE_005', [row.prtNm]),
					);
					return;
				}
			}
		}
		// --- 검증 로직 끝 ---

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				saveDataList: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						props.search();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};
	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */

	useEffect(() => {
		if (ref.gridRef.current) {
			// 그리드 초기화 - 각 행에 rowStatus 'U' 추가
			const dataWithRowStatus = props.data.map((row: any) => ({
				...row,
				rowStatus: 'U',
			}));
			ref.gridRef.current?.setGridData(dataWithRowStatus);
			ref.gridRef.current?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		// <AGrid className="contain-wrap" style={{ display: isShow ? 'flex' : 'none' }}>
		// 	<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
		// 	<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		// </AGrid>
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.data?.length} />
			<AUIGrid ref={ref.gridRef} columnLayout={gridCol1} gridProps={gridProps1} />
		</AGrid>
	);
});

export default WdKxDeliveryInvoiceDetail6;
