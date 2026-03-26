/*
 ############################################################################
 # FiledataField	: WdItemTraceDetail.tsx
 # Description		: 모니터링 > 검수 > 검수 공정별 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.11.17
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import { Button, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WdItemTraceDetail = ({ gridData, gridRef, openPop, form1 }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const comboList = [
		{ cdNm: t('lbl.INSPECT_INBOUND'), comCd: '1' },
		{ cdNm: t('lbl.INSPECT_OUTBOUND'), comCd: '2' },
		{ cdNm: t('lbl.NSPECT_INOUT'), comCd: '3' },
	];

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1',
			// 	btnLabel: t('lbl.PDP_FOR_POPUP'),
			// 	authType: 'new',
			// 	callBackFn: openPdpPop,
			// },
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 출고일자
			dataField: 'deliverydate',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 전표번호
			dataField: 'docno',
			headerText: t('lbl.SLIPNO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 전표순번
			dataField: 'docline',
			headerText: t('lbl.SLIPNO_SEQ'),
			dataType: 'code',
			editable: false,
			width: 60,
		},
		{
			// 저장유무
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
			width: 60,
		},
		{
			// 저장조건
			dataField: 'storagetypeName',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 공급업체
			headerText: t('lbl.VENDORINFO'),
			children: [
				{
					// 협력사코드
					dataField: 'fromCustkey',
					headerText: t('lbl.VENDOR'),
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current?.openPopup(
								{
									custkey: e.item.fromCustkey,
									//custtype: e.item.fromCusttype,
									custtype: 'P',
								},
								'cust',
							);
						},
					},
					width: 100,
				},
				{
					// 협력사명
					dataField: 'fromCustname',
					headerText: t('lbl.VENDORNAME'),
					dataType: 'text',
					editable: false,
					width: 350,
				},
			],
		},
		{
			// 고객
			headerText: t('lbl.CUST'),
			children: [
				{
					// 관리처코드
					dataField: 'toCustkey',
					headerText: t('lbl.FROM_CUSTKEY_RT'),
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current?.openPopup(
								{
									custkey: e.item.toCustkey,
									//custtype: e.item.toCusttype,
									custtype: 'C',
								},
								'cust',
							);
						},
					},
					width: 100,
				},
				{
					// 관리처명
					dataField: 'toCustname',
					headerText: t('lbl.TO_CUSTNAME_WD'),
					dataType: 'text',
					editable: false,
					width: 350,
				},
			],
		},
		{
			// 상품
			headerText: t('lbl.SKU2'),
			children: [
				{
					// 상품코드
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.sku,
								skuDescr: e.item.skuname,
							};
							gridRef.current?.openPopup(params, 'sku');
						},
					},
					width: 70,
				},
				{
					// 상품명칭
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					dataType: 'text',
					editable: false,
					width: 350,
				},
				{
					// 단위
					dataField: 'uom',
					headerText: t('lbl.UOM'),
					dataType: 'code',
					editable: false,
					width: 60,
				},
			],
		},
		{
			// 원주문수량
			dataField: 'orderqty',
			headerText: t('lbl.ORIORDERQTY2'),
			dataType: 'numeric',
			editable: false,
			width: 90,
		},
		{
			// 마감주문수량
			dataField: 'openqty',
			headerText: t('lbl.CLOSE_ORDER_QTY'),
			dataType: 'numeric',
			editable: false,
			width: 90,
		},
		{
			// 입고
			headerText: t('lbl.DP'),
			children: [
				{
					// 검수수량
					dataField: 'ilbaeInspectQty',
					headerText: t('lbl.ROUTEINSPECTQTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 입고확정수량
					dataField: 'ilbaeConfirmQty',
					headerText: t('lbl.DPCONFIRMQTY2'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
			],
		},
		{
			// 광역
			headerText: t('lbl.WIDE_AREA'),
			children: [
				{
					// 요청수량
					dataField: 'stoRequetQty',
					headerText: t('lbl.REQUEST_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 검수입고수량
					dataField: 'stoDpinspectQty',
					headerText: t('lbl.DP_INSPECT_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 미지정
					dataField: 'stoDpQty',
					//headerText: t('lbl.DPCONFIRMQTY2'),
					headerText: '미지정',
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
			],
		},
		{
			// 출고
			headerText: t('lbl.WD'),
			children: [
				{
					// 분배수량
					dataField: 'qtyallocatedQty',
					headerText: t('lbl.DISTRIBUTE_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 피킹수량
					dataField: 'qtypickedQty',
					headerText: t('lbl.PICKING_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 출고확정수량
					dataField: 'confirmqty',
					headerText: t('lbl.WDCONFIRMQTY_WD'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 결품수량
					dataField: 'cancelqty',
					headerText: t('lbl.SHORTAGEQTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 상차수량
					dataField: 'upQty',
					headerText: t('lbl.LOAD_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
				{
					// 하차수량
					dataField: 'downQty',
					headerText: t('lbl.UNLOADQTY_RT'),
					dataType: 'numeric',
					editable: false,
					width: 90,
				},
			],
		},
		{
			// 결품처리자
			dataField: 'cancelwhoName',
			headerText: t('lbl.CANCELWHO'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		// 그리드 이벤트 설정
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length}>
					<Form form={form1} layout="inline" initialValues={{ popType: '1' }}>
						<SelectBox
							name="popType"
							options={comboList}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							className="bg-white w-full"
						/>
						<div>
							<Button style={{ marginRight: 8 }} onClick={() => openPop()}>
								{/* PDP용 팝업 */}
								{t('lbl.PDP_FOR_POPUP')}
							</Button>
						</div>
					</Form>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default WdItemTraceDetail;
