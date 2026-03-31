/*
 ############################################################################
 # FiledataField	: StConvertSNDetail.tsx
 # Description		: 재고 > 재고조정 > 상품이력번호변경 조회 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.11
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import { Button, InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StConvertSNDetail = ({
	gridData,
	gridData1,
	gridData2,
	gridRef,
	gridRef1,
	gridRef2,
	activeKey,
	//activeKeyRef,
	setActiveKey,
	applyReason,
	form1,
	searchDetailT1List,
	searchDetailT2List,
	dates,
	saveMasterList,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

	/////////////////////////////////////////// 1. 상단 그리드 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1', // 사용자 정의버튼1
			// 	btnLabel: t('lbl.APPLY_SELECT'), // 선택적용
			// 	authType: 'new',
			// 	callBackFn: () => {
			// 		applyReason();
			// 	},
			// },
			{
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},

			// APPLY_SELECT 선택적용
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 상품정보
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					// 상품분류
					dataField: 'skugroup',
					headerText: t('lbl.SKUGROUP'),
					dataType: 'code',
					editable: false,
					width: 150,
				},
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
							gridRef2.current?.openPopup(e.item, 'sku');
						},
					},
					width: 80,
				},
				{
					// 상품명칭
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					dataType: 'text',
					editable: false,
					filter: {
						showIcon: true,
					},
					width: 200,
				},
			],
		},
		// {
		// 	// 기준일(소비/제조)
		// 	dataField: "lottable01",
		// 	headerText: t('lbl.LOTTABLE01'),
		// 	dataType: "code",
		// 	editable: false,
		// 	styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
		// 		return {
		// 			backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
		// 		};
		// 	},

		// },
		{
			// 제조일자
			dataField: 'lotManufacture',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			// 소비일자
			dataField: 'lotExpire',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			// 소비기간(잔여/전체)
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			// 사유
			headerText: t('lbl.REASON'),
			children: [
				{
					// 이력변경사유
					dataField: 'reasoncode',
					headerText: t('lbl.REASONCODE_SN'),
					dataType: 'code',
					editable: true,
					required: true,
					editRenderer: {
						type: 'DropDownListRenderer',
						list: getCommonCodeList('REASONCODE_SN'),
						keyField: 'comCd',
						valueField: 'cdNm',
					},
					labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						// getCommonCodeList('DIRECTTYPE')에서 해당 comCd에 맞는 cdNm을 찾아 반환
						const foundItem = getCommonCodeList('REASONCODE_SN').find(code => code.comCd === value);
						return foundItem ? foundItem.cdNm : value; // 찾지 못하면 기존 값 반환
					},
					width: 100,
				},

				{
					// 이력변경사유명
					dataField: 'reasonmsg',
					headerText: t('lbl.REASONMSG_SN'),
					dataType: 'text',
					required: true,
					editable: true,
					width: 100,
				},
			],
		},
		{
			// 상품이력정보
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 이력번호
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: true,
					width: 150,
				},
				{
					// B/L 번호
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: true,
					width: 150,
				},
				{
					// 도축일자
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 도축장
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'text',
					editable: true,
					width: 100,
				},
			],
		},
	];
	/////////////////////////////////////////// 2. 재고현황_탭 그리드 ///////////////////////////////////////////
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	// 그리드 초기화
	const gridCol1 = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 02. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 창고
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
			editable: false,
			colSpan: 2,
			width: 80,
		},
		{
			// 창고
			dataField: 'organizeNm',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 재고위치
			dataField: 'stocktype',
			headerText: t('lbl.STOCKTYPE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 재고속성
			dataField: 'stockgrade',
			headerText: t('lbl.STOCKGRADE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 피킹존
			dataField: 'zone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 로케이션
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
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
					gridRef2.current?.openPopup(e.item, 'sku');
				},
			},
			width: 80,
		},
		{
			// 상품명칭
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'text',
			editable: false,
			filter: {
				showIcon: true,
			},
			width: 200,
		},
		{
			// 저장조건
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 단위
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 현재고수량
			dataField: 'qty',
			headerText: t('lbl.QTY_ST'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 가용재고수량
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY_ST'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 재고할당수량
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 피킹재고
			dataField: 'qtypicked',
			headerText: t('lbl.QTYPICKED_ST'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 유통기한임박여부
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		// {
		// 	// 기준일(유통,제조)
		// 	dataField: "lottable01",
		// 	headerText: t('lbl.LOTTABLE01'),
		// 	dataType: "code",
		// 	editable: false
		// },
		{
			// 제조일자
			dataField: 'lotManufacture',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			// 소비일자
			dataField: 'lotExpire',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			// 유통기간(잔여/전체)
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 120,
		},
		{
			// 상품이력정보
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 이력번호
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 바코드
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// B/L 번호
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 도축일자
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 도축장
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 계약유형
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 계약업체
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'text',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef1.current?.openPopup(
								{
									custkey: e.item.contractcompany,
									custtype: 'C',
								},
								'cust',
							);
						},
					},
					width: 80,
				},
				{
					// 계약업체명
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'text',
					editable: false,
					width: 150,
				},
				{
					// 유효일자(FROM)
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 유효일자(TO)
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
			],
		},
	];

	/////////////////////////////////////////// 3. 입출이력_탭 그리드 ///////////////////////////////////////////
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 사용자 정의버튼1
				btnLabel: t('lbl.SEARCH'), // 선택적용
				authType: 'new',
				callBackFn: () => {
					const selectedRow = gridRef.current?.getSelectedRows()[0];
					//상세 조회
					searchDetailT2List(selectedRow);
				},
			},
		],
	};

	const gridProps2 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};
	// 그리드 초기화
	const gridCol2 = [
		{
			// 문서유형
			dataField: 'doctype',
			headerText: t('lbl.DOCTYPE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 문서번호
			dataField: 'docno',
			headerText: t('lbl.DOCNO'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 품목번호
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
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
					gridRef2.current?.openPopup(e.item, 'sku');
				},
			},
			width: 80,
		},
		{
			// 상품명칭
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'text',
			editable: false,
			filter: {
				showIcon: true,
			},
			width: 150,
		},
		{
			// 단위
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 주문수량
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 검수량
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY_TASK'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 확정수량
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_TASK'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 중량
			dataField: 'weight',
			headerText: t('lbl.WEIGHT_KG'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		// {
		// 	// 기준일(유통,제조)
		// 	dataField: "lottable01",
		// 	headerText: t('lbl.LOTTABLE01'),
		// 	dataType: "code",
		// 	editable: false
		// },
		{
			// 제조일자
			dataField: 'lotManufacture',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
		},
		{
			// 소비일자
			dataField: 'lotExpire',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
		},
		{
			// 유통기간(잔여/전체)
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 100,
		},
		{
			// 상품이력정보
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 이력번호
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 바코드
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// B/L 번호
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 도축일자
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 도축장
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'text',
					editable: false,
					width: 100,
				},
				{
					// 계약유형
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					// 계약업체
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef2.current?.openPopup(
								{
									custkey: e.item.contractcompany,
									custtype: 'C',
								},
								'cust',
							);
						},
					},
					width: 100,
				},
				{
					// 계약업체명
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'text',
					editable: false,
					width: 150,
				},
				{
					// 유효일자(FROM)
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
				{
					// 유효일자(TO)
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					dataType: 'date',
					editable: false,
					width: 100,
				},
			],
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
	let prevRowIndex: any = null;

	// activeKey 또는 Row 변경 시 상세조회
	const searchDetail = useCallback(
		(gridRef: any) => {
			const selectedRow = gridRef.current?.getSelectedRows()[0];

			if (activeKey === '1') {
				searchDetailT1List(selectedRow);
			} else if (activeKey === '2') {
				searchDetailT2List(selectedRow);
			}
		},
		[activeKey],
	);

	const initEvent = () => {
		gridRef.current?.bind('selectionChange', (e: any) => {
			if (e.primeCell.rowIndex === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = e.primeCell.rowIndex;
			searchDetail(gridRef);
		});
	};

	useEffect(() => {
		if (gridData.length > 0) {
			searchDetail(gridRef);
		}
	}, [activeKey]);

	useEffect(() => {
		initEvent();
		// 클린업함수 없으면 이벤트가 중복 바인딩됨.
		return () => {
			gridRef.current?.unbind('selectionChange');
		};
	}, [activeKey]);

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

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef.current?.setFocus();
	}, [gridData1]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef2.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef2.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef.current?.setFocus();
	}, [gridData2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		// 재고현황_탭
		{
			key: '1',
			label: t('lbl.ST_CONVERT_SN_TAB_1'),
			children: (
				<>
					<AGrid style={{ marginTop: '15px' }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
					</AGrid>
					<GridAutoHeight id="inventory-status-grid">
						<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
					</GridAutoHeight>
				</>
			),
		},
		// 입출이력_탭
		{
			key: '2',
			label: t('lbl.ST_CONVERT_SN_TAB_2'),
			children: (
				<>
					<AGrid style={{ marginTop: '15px' }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length}>
							{/* 전표일자 */}
							<Form layout="inline" form={form1} initialValues={{ slipdt: [dayjs(), dayjs()] }}>
								<Rangepicker
									label={t('lbl.SLIPDT')}
									name="slipdt"
									defaultValue={dates} // 초기값 설정
									format={dateFormat} // 화면에 표시될 형식
									allowClear
									showNow={false}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									className="bg-white"
								/>
							</Form>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight id="entry-and-exit-history-grid">
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
					</GridAutoHeight>
				</>
			),
		},
	];

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid>
						{/* 상품이력번호변경 LIST */}
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length}>
							<Form form={form1} layout="inline" initialValues={{ reasoncode: '' }}>
								<SelectBox
									name="reasoncode"
									placeholder={t('msg.selectPlease1', [t('lbl.REASONCODE_SN')])}
									options={[{ comCd: '', cdNm: t('lbl.SELECT') }, ...getCommonCodeList('REASONCODE_SN')]}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.REASONCODE_SN')}
									className="bg-white"
									style={{ width: 180 }}
								/>
								<InputText
									name="reasonmsg"
									placeholder={t('msg.placeholder1', [t('lbl.REASONMSG_SN')])}
									label={t('lbl.REASONMSG_SN')}
									className="bg-white"
								/>
								<div>
									<Button style={{ marginRight: 8 }} onClick={() => applyReason()}>
										{/* 선택적용 */}
										{t('lbl.SELECT_APPLY')}
									</Button>
								</div>
							</Form>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight id="stConvertSN-grid">
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
				<TabsArray key="stConvertSN-tabs" activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />,
			]}
		/>
	);
};

export default StConvertSNDetail;
