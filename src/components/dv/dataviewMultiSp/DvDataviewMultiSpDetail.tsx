/*
 ############################################################################
 # FiledataField	: DvDataviewMultiSpDetail.tsx
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

const DvDataviewMultiSpDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCount, searchGrid1 } = props;

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
			{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code' }, //물류센터
			{ dataField: 'dccodeName', headerText: t('lbl.DCNAME'), dataType: 'code' }, //물류센터명
			{ dataField: 'plantDescr', headerText: t('lbl.PLANT') }, //플랜트
			{
				dataField: 'deliverydate',
				headerText: t('lbl.DELIVERYDATE'),
				dataType: 'date',
				labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
					return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
				},
			}, //배송일자
			{
				dataField: 'custkey',
				headerText: t('lbl.PARTNER_CD'),
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						gridRef.current.openPopup(
							{
								custkey: e.item.custkey,
								custtype: e.item.doctype === '입고문서' ? 'P' : 'C',
							},
							'cust',
						);
					},
				},
			}, //협력사코드
			{
				dataField: 'custname',
				headerText: t('lbl.PARTNER_NAME'),
				filter: {
					showIcon: true,
				},
			}, //협력사명
			{
				dataField: 'sku',
				headerText: t('lbl.SKU'),
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						gridRef.current.openPopup(
							{
								sku: e.item.sku,
							},
							'sku',
						);
					},
				},
			}, //상품코드
			{
				dataField: 'skuname',
				headerText: t('lbl.SKUNAME'),
				filter: {
					showIcon: true,
				},
			}, //상품명칭
			{
				dataField: 'orderqtyDaily',
				headerText: t('lbl.ORDERQTY_DAILY'),
				dataType: 'numeric',
				formatString: '#,##0.##',
			}, //주문(예정)수량
			{ dataField: 'qtyDp', headerText: t('lbl.QTY_DP'), dataType: 'numeric', formatString: '#,##0.##' }, //입고수량
			{ dataField: 'qtyWd', headerText: t('lbl.QTY_WD'), dataType: 'numeric', formatString: '#,##0.##' }, //출고수량
			{
				dataField: 'qtyDiff',
				headerText: t('lbl.QTY_DIFF'),
				dataType: 'numeric',
				formatString: '#,##0.##',
				styleFunction: function (
					rowIndex: any,
					columnIndex: any,
					value: any,
					headerText: any,
					item: any,
					dataField: any,
				) {
					return {
						color: item.qtyDiff < 0 ? 'red' : 'black',
					};
				},
			}, //차이수량
			{ dataField: 'putawaytype', headerText: t('lbl.PUTAWAYTYPE_WD'), dataType: 'code' }, //일베구분
			{ dataField: 'cdeliveryrouteName', headerText: t('lbl.CDELIVERYROUTE_NAME_WD'), dataType: 'code' }, //경유센터
			{
				dataField: 'routeinspectqty',
				headerText: t('lbl.ROUTEINSPECTQTY_WD'),
				dataType: 'numeric',
				formatString: '#,##0.##',
			}, //광역검수수량
		],
		[t],
	);

	const footerLayout = useMemo(
		() => [
			{
				labelText: '합계',
				positionField: 'dccode',
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
				dataField: 'qtyDiff',
				positionField: 'qtyDiff',
				formatString: '#,##0.##',
				postfix: '',
				style: 'right',
				dataType: 'numeric',
				expFunction: fnMathSum,
			},
			{
				dataField: 'routeinspectqty',
				positionField: 'routeinspectqty',
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
			// 셀 병합 실행
			enableCellMerge: true,
			// 병합된 셀을 사용자가 직접 수정할 때 병합된 셀 전체가 수정 적용될지 여부 (기본값: false)
			editableMergedCellsAll: true,

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
	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowItem: any = null;
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem) return;

			// 이전 행 인덱스 갱신
			prevRowItem = event.primeCell.item;

			const primeCell = event?.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			// props.searchDtl(primeCell.item);
			const { dccode, sku, deliverydate, plant } = primeCell.item || {};
			const filteredRarams = { dccode, sku, deliverydate, plant, slipdt: deliverydate };

			primeCell.item && searchGrid1(filteredRarams);
		});
	};

	useEffect(() => {
		// [중요] aui grid의 bind 함수는 updated hook 안에서 호출합니다.
		// aui grid의 bind함수는 상태 관리(ref, state) 객체/변수가 동기화되지 않으므로 update 될 때마다 bind 해줍니다.
		// 단, eventhandler 내부에 상태 관리 객체/변수가 없을 경우 mount 시에만 bind 해주어도 됩니다.
		initEvent();
	}, []);

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
				<GridTopBtn gridTitle="입출현황목록" gridBtn={gridBtn} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default DvDataviewMultiSpDetail;
