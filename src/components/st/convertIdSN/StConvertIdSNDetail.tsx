/*
 ############################################################################
 # FiledataField	: StConvertIdSNDetail.tsx
 # Description		: 재고 > 재고조정 > 이력상품바코드변경 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.16
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StConvertIdSNDetail = ({ gridData, gridRef, saveMasterList, form1, form }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			// 02. 창고
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
			editable: false,
		},
		{
			// 03. 재고속성
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE'),
			dataType: 'code',
			editable: false,
		},
		{
			// 상품정보
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					// 04. 상품분류
					dataField: 'skugroup',
					headerText: t('lbl.SKUGROUP'),
					dataType: 'text',
					editable: false,
				},
				{
					// 05. 상품코드
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
							gridRef.current?.openPopup(e.item, 'sku');
						},
					},
				},
				{
					// 06. 상품명칭
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					dataType: 'text',
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			// 07. 로케이션
			dataField: 'fromLoc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			editable: false,
		},
		{
			// 08. 단위
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			editable: false,
		},
		{
			// 수량정보
			headerText: t('lbl.QTYINFO'),
			children: [
				{
					// 09. 현재고수량
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'),
					dataType: 'numeric',
					editable: false,
				},
				{
					// 10. 가용재고수량
					dataField: 'openqty',
					headerText: t('lbl.OPENQTY_ST'),
					dataType: 'numeric',
					editable: false,
				},
				{
					// 11. 재고할당수량
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					dataType: 'numeric',
					editable: false,
				},
				{
					// 12. 피킹재고
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'),
					dataType: 'numeric',
					editable: false,
				},
				{
					// 13. 작업수량
					dataField: 'tranqty',
					headerText: t('lbl.TRANQTY'),
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		// {
		// 	dataField: "lottable01",
		// 	headerText: t('lbl.LOTTABLE01'),
		// 	dataType: "code",
		// 	editable: false
		// },
		{
			// 14. 제조일자
			dataField: 'lotManufacture',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			// 14. 소비일자
			dataField: 'lotExpire',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			// 15. 소비기간(잔여/전체)
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
		},
		{
			// 상품이력정보
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 16. 이력번호
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
				},
				{
					// 17. B/L 번호
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
				},
				{
					// 18. PO번호
					dataField: 'dpDocno',
					headerText: t('lbl.PO_NO'),
					dataType: 'code',
					editable: false,
				},
				{
					// 19. 도축일자
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'code',
					editable: false,
				},
				{
					// 20. 도축장
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'text',
					editable: false,
				},
				{
					// 21. 계약유형
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
				},
				// {
				// 	// 22. 계약업체
				// 	dataField: 'contractcompany',
				// 	headerText: t('lbl.CONTRACTCOMPANY'),
				// 	dataType: 'code',
				// 	editable: false,
				// },

				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current?.openPopup(
								{
									custkey: e.item.contractcompany,
									custtype: 'C',
								},
								'cust',
							);
						},
					},
				},

				{
					// 23. 계약업체명
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'text',
					editable: false,
				},
				{
					// 24. 유효일자(FROM)
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					dataType: 'date',
					editable: false,
				},
				{
					// 25. 유효일자(TO)
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					dataType: 'date',
					editable: false,
				},
			],
		},
		{
			// 26. 재고ID
			dataField: 'fromStockid',
			headerText: t('lbl.FROM_STOCKID'),
			dataType: 'code',
			editable: false,
		},
	];

	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: 'uom',
		},
		// 현재고수량
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 가용재고수량
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 재고할당수량
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 피킹재고
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 작업수량
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
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
				const colSizeList = gridRef.current?.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={gridData?.length} gridBtn={gridBtn}>
					<Form form={form1} initialValues={{ reasoncode: '1' }} layout="inline">
						{/* 사유코드 */}
						<SelectBox
							name="reasoncode"
							label={t('lbl.REASONCODE')} /*사유코드*/
							options={getCommonCodeList('REASONCODE_CI')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
							className="bg-white"
							style={{ width: '200px' }}
						/>
						{/* 사유메세지 */}
						<InputText
							name="reasonmsg"
							className="bg-white"
							required
							style={{ width: '200px' }}
							placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
							rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]}
						/>
						{/* 재고ID */}
						<InputText
							//refs={lottable01Ref}
							label={t('lbl.FROM_STOCKID')}
							name="toStockid"
							className="bg-white"
							required
							rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.FROM_STOCKID')]) }]}
						/>
					</Form>
				</GridTopBtn>

				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
};

export default StConvertIdSNDetail;
