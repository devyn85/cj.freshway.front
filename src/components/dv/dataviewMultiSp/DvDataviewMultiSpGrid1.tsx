/*
 ############################################################################
 # FiledataField	: DvDataviewMultiSpGrid1.tsx
 # Description		: 출고 > 출고현황 > 일배입출차이현황 조회 Grid Header
 # Author			: YangChangHwan
 # Since			: 25.06.13
 ############################################################################
*/

import { forwardRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Type
import { GridBtnPropsType } from '@/types/common';

// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// API

// Store

// Libs

// Utils

const DvDataviewMultiSpGrid1 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCount, refModal } = props;

	const { t } = useTranslation();

	const fnMathSum = (columnValues: any) => {
		const sum = (columnValues && columnValues.reduce((acc: number, currVal: number) => acc + currVal, 0)) || 0; // p1203(6월) 최대값 - 최소값
		return sum % 1 === 0 ? sum : sum.toFixed(1);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			{ dataField: 'doctype', headerText: t('lbl.DOCTYPE'), dataType: 'code' }, //문서유형
			{ dataField: 'docno', headerText: t('lbl.DOCNO'), dataType: 'code' }, //문서번호
			{ dataField: 'ordertype', headerText: t('lbl.ORDERTYPE'), dataType: 'code' }, //주문유형
			{
				dataField: 'toCustkey',
				headerText: t('lbl.TO_CUSTKEY'),
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						gridRef.current.openPopup(
							{
								custkey: e.item.toCustkey,
								custtype: e.item.doctype === '입고문서' ? 'P' : 'C',
							},
							'cust',
						);
					},
				},
			}, //배송인도처코드
			{
				dataField: 'toCustname',
				headerText: t('lbl.TO_CUSTNAME'),
				filter: {
					showIcon: true,
				},
			}, //배송인도처명
			{ dataField: 'plantDescr', headerText: t('lbl.PLANT') }, //플랜트
			{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code' }, //단위
			{
				dataField: 'orderqtyDaily',
				headerText: t('lbl.ORDERQTY_DAILY'),
				dataType: 'numeric',
				formatString: '#,##0.##',
			}, //주문(예정)수량
			{ dataField: 'qtyDp', headerText: t('lbl.QTY_DP'), dataType: 'numeric', formatString: '#,##0.##' }, //입고수량
			{ dataField: 'qtyWd', headerText: t('lbl.QTY_WD'), dataType: 'numeric', formatString: '#,##0.##' }, //출고수량
			{ dataField: 'shortageqty', headerText: t('lbl.SHORTAGEQTY'), dataType: 'numeric', formatString: '#,##0.##' }, //결품수량
			{ dataField: 'reasoncodeRt', headerText: t('lbl.REASONCODE_RT') }, //결품사유
		],
		[t],
	);

	const footerLayout = useMemo(
		() => [
			{ labelText: '', positionField: '#base' },
			{
				labelText: '합계',
				positionField: 'doctype',
			},
			{
				dataField: 'orderqty',
				positionField: 'orderqty',
				formatString: '#,##0.##',
				postfix: '',
				style: 'right',
				dataType: 'numeric',
				expFunction: fnMathSum,
			},
			{
				dataField: 'qtyDp',
				positionField: 'qtyDp',
				formatString: '#,##0.##',
				postfix: '',
				style: 'right',
				dataType: 'numeric',
				expFunction: fnMathSum,
			},
			{
				dataField: 'qtyWd',
				positionField: 'qtyWd',
				formatString: '#,##0.##',
				postfix: '',
				style: 'right',
				dataType: 'numeric',
				expFunction: fnMathSum,
			},
			{
				dataField: 'shortageqty',
				positionField: 'shortageqty',
				formatString: '#,##0.##',
				postfix: '',
				style: 'right',
				dataType: 'numeric',
				expFunction: fnMathSum,
			},
		],
		[],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 속성
	const gridProps = useMemo(
		() => ({
			editable: false,

			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			showFooter: true,

			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */

	useEffect(() => {
		// [중요] aui grid의 bind 함수는 updated hook 안에서 호출합니다.
		// aui grid의 bind함수는 상태 관리(ref, state) 객체/변수가 동기화되지 않으므로 update 될 때마다 bind 해줍니다.
		// 단, eventhandler 내부에 상태 관리 객체/변수가 없을 경우 mount 시에만 bind 해주어도 됩니다.
	});

	useEffect(() => {
		const gRef = gridRef.current;
		if (gRef) {
			// 그리드 초기화
			gRef?.setGridData(data);
			gRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gRef.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<>
			<AGrid dataProps={''}>
				<GridTopBtn gridTitle="입출현황상세" gridBtn={gridBtn} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default DvDataviewMultiSpGrid1;
