/*
 ############################################################################
 # FiledataField	: DpSkuLabelInspectGrid1.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(검수) 조회 Grid1
 # Author			: YangChangHwan
 # Since			: 25.06.24
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
import commUtil from '@/util/commUtil';

// API

// Store

// Libs

// Utils

const DpSkuLabelInspectGrid1 = forwardRef((props: any, gridRef: any) => {
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
		btnArr: [
			/* 
			{
				btnType: 'down', // 아래로
			},
			{
				btnType: 'up', // 위로
			},
			{
				btnType: 'excelForm', // 엑셀양식
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
			},
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					menuYn: 0,
					useYn: 0,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'detailView', // 상세보기
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'print', // 인쇄
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
			{
				btnType: 'elecApproval', // 전자결재
			}, 
			*/
		],
	};

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			{ dataField: 'docline', headerText: t('lbl.DOCLINE'), dataType: 'code' },
			{ dataField: 'statusDp', headerText: t('lbl.STATUS_DP'), dataType: 'code', visible: false },
			{ dataField: 'statusname', headerText: t('lbl.STATUS_DP'), dataType: 'code' },
			{
				headerText: t('lbl.SKUINFO'),
				children: [
					{
						dataField: 'sku',
						headerText: t('lbl.SKU'),
						dataType: 'code',
						filter: {
							showIcon: true,
						},
					},
					{
						dataField: 'skuname',
						headerText: t('lbl.SKUNAME'),
						filter: {
							showIcon: true,
						},
					},
				],
			},
			{
				dataField: 'orderqtyPrintyn',
				headerText: t('lbl.ORDERQTY_PRINTYN'),
				dataType: 'code',
				renderer: {
					type: 'CheckBoxEditRenderer',
					editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
					checkValue: 'Y', // true, false 인 경우가 기본
					unCheckValue: 'N',
					//사용자가 체크 상태를 변경하고자 할 때 변경을 허락할지 여부를 지정할 수 있는 함수 입니다.
					checkableFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						isChecked: any,
						item: any,
						dataField: any,
					) => {
						// 행 아이템의 charge 가 Anna 라면 수정 불가로 지정. (기존 값 유지)
						if (!isChecked) {
							gridRef.current.setCellValue(rowIndex, 'printedqty', item.convBoxqty);
						} else {
							gridRef.current.setCellValue(rowIndex, 'printedqty', '1');
						}

						return true;
					},
				},
			},
			{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric' },
			{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric' },
			{ dataField: 'uom', headerText: t('lbl.UOM_DP'), dataType: 'code' },
			{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY_DP'), dataType: 'numeric' },
			{ dataField: 'inspectqty', headerText: t('lbl.INSPECTQTY_DP'), dataType: 'numeric' },
			{ dataField: 'convBoxqty', headerText: t('lbl.CONV_BOXQTY'), dataType: 'numeric', visible: false },

			{
				headerText: t('lbl.STOCKINFO'),
				children: [
					{ dataField: 'lot', headerText: t('lbl.LOT'), dataType: 'numeric' },
					{
						dataField: 'durationBegin',
						headerText: '기준일(제조)',
						dataType: 'code',
						styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
							gridRef?.current?.removeEditClass(columnIndex);
							return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
						},
					},
					{
						dataField: 'durationEnd',
						headerText: '기준일(소비)',
						dataType: 'code',
						styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
							gridRef?.current?.removeEditClass(columnIndex);
							return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
						},
					},
					{
						dataField: 'durationTerm',
						headerText: t('lbl.DURATION_TERM'),
						dataType: 'code',
						styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
							gridRef?.current?.removeEditClass(columnIndex);
							return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
						},
					},
				],
			},
		],
		[t],
	);

	const footerLayout = useMemo(
		() => [
			{ labelText: '', positionField: '#base' },
			{
				dataField: 'printedqty',
				positionField: 'printedqty',
				operation: 'SUM',
				formatString: '#,##0.###',
			},
			{ labelText: '', positionField: '#base' },
			{
				dataField: 'orderqty',
				positionField: 'orderqty',
				expFunction: fnMathSum,
			},
			{
				dataField: 'inspectqty',
				positionField: 'inspectqty',
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
			selectionMode: 'singleCell',

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
				<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default DpSkuLabelInspectGrid1;
