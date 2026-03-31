/*
 ############################################################################
 # FiledataField	: DvPackingScarceStockDetail.tsx
 # Description		: 출고 > 출고현황 > 부족분리스트(RDC검증) 조회 Grid
 # Author			: YangChangHwan
 # Since			: 25.06.10
 ############################################################################
*/

import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Type
import { GridBtnPropsType } from '@/types/common';

// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import reportUtil from '@/util/reportUtil';

// API

// Store

// Libs

// Utils

const DvPackingScarceStockDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCount, refModal, form } = props;

	const { t } = useTranslation();

	const fnPrint = () => {
		const gRef = gridRef.current;
		if (gRef) {
			const sortingInfo = [];
			// 차례로 각 컬럼에 대하여 각각 오름차순, 내림차순 지정.
			sortingInfo[0] = { dataField: 'storagetype', sortType: 1 }; // 오름차순 1
			sortingInfo[1] = { dataField: 'sku', sortType: 1 }; // 내림 차순 -1
			sortingInfo[2] = { dataField: 'hdType', sortType: 1 };
			sortingInfo[3] = { dataField: 'mngplc', sortType: 1 };
			sortingInfo[4] = { dataField: 'deliverygroup', sortType: 1 };
			gRef?.setSorting(sortingInfo);

			const dataSet = {
				ds_report: gRef.getGridData().map((item: any) => ({ ...item, description: item.skuname })), // 헤더 정보
			};

			// 3. 리포트에 전송할 파라미터
			const requestParams = form.getFieldsValue();
			const params: any = {};
			params.INVOICE_TITLE = '재고부족분 정보';
			params.DELIVERYDT = requestParams.slipdt.format('YYYYMMDD');

			reportUtil.openAgentReportViewer('DV_Picking_Scarce_Stock.mrd', dataSet, params);
		}
	};

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

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
		},
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
			headerText: t('lbl.SKUNM'),
			filter: {
				showIcon: true,
			},
		}, //상품명
		{
			headerText: t('lbl.STOCK_INFO'), //재고정보
			children: [
				{ dataField: 'shortQty', headerText: t('lbl.SHORTAGE_QTY'), dataType: 'numeric' }, //부족수량
				{ dataField: 'stockUom', headerText: t('lbl.UOM'), dataType: 'code' }, //재고단위
			],
		},
		{ dataField: 'deliverygroup', headerText: t('lbl.DELIVERYGROUP'), dataType: 'code' }, //배송그룹
		{
			dataField: 'mngplc',
			headerText: t('lbl.MNGPLC'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.mngplc,
						},
						'cust',
					);
				},
			},
		}, //분할거래처코드
		{
			dataField: 'mngplcnm',
			headerText: t('lbl.MNGPLCNM'),
			filter: {
				showIcon: true,
			},
		}, //분할거래처명
		{ dataField: 'uom', headerText: t('lbl.UOM_SO'), dataType: 'code' }, //판매단위
		{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY'), dataType: 'numeric' }, //주문수량
	];

	// 그리드 속성
	const gridProps = {
		editable: false,

		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부

		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				callBackFn: fnPrint,
			},
		],
	};
	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	useEffect(() => {
		const gRef = gridRef.current;
		if (gRef) {
			// 그리드 초기화
			gRef?.appendData(data);
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
			<AGrid className="contain-wrap">
				<GridTopBtn
					gridTitle="부족분 LIST"
					gridBtn={gridBtn}
					totalCnt={totalCount}
					extraContentLeft={<span className="msg">전상품 조회시 속도가 느려지며 서버에 많은 부담을 주게 됩니다.</span>}
				/>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DvPackingScarceStockDetail;
