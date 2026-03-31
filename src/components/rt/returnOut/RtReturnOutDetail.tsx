/*
 ############################################################################
 # FiledataField	: RtReturnOutDetail.tsx
 # Description		: 반품 > 반품작업 > 협력사반품지시 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.10.13
 ############################################################################
*/

import { apiPostClaimTypeList, apiPostClaimTypeList2 } from '@/api/rt/apiRtQCConfirmResult';
import AGrid from '@/assets/styled/AGrid/AGrid';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtReturnOutDetail = ({
	form1,
	isShow,
	gridRef,
	gridRef1,
	gridRef4,
	gridData,
	gridDataDetail,
	gridDataExcel,
	searchDetailList,
	openModal,
	applyReason,
	saveExcept,
	saveRtReturnOutMaster,
	saveRtReturnOutDetail,
	savePlt,
	applyQty,
	printDetailList,
	searchExcelList,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const EX_PARTNER_LIST = getCommonCodeList('EX_PARTNER');
	const excelParams = {
		fileName: '협력사반품지시',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();
	const [claimtypeOptions, setClaimtypeOptions] = useState([]);
	const [claimtypeOptions2, setClaimtypeOptions2] = useState([]);

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '예외협력업체마스터',
				authType: 'new',
				callBackFn: openModal,
			},
			// { //2025-11-25 요건삭제
			// 	btnType: 'btn2', // 사용자 정의버튼1
			// 	btnLabel: '반품 STO',
			// 	authType: 'new',
			// 	callBackFn: openModal,
			// },
			{
				btnType: 'save',
				callBackFn: () => {
					saveRtReturnOutMaster(0);
				},
			},
		],
	};

	// 그리드 초기화 (dataField 기준 한 줄 + 주석)
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', editable: false }, // 창고
		{
			dataField: 'custkey',
			headerText: t('lbl.VENDOR'),
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.custkey,
						custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					gridRef.current.openPopup(params, 'cust');
				},
			},
		}, // 협력사코드
		{
			dataField: 'custname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'name',
			editable: false,
			filter: { showIcon: true },
		}, // 협력사명
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					editable: false,
					filter: { showIcon: true },
					align: 'center',
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = { sku: e.item.sku, skuDescr: e.item.skuName };
							gridRef.current.openPopup(params, 'sku');
						},
					},
				}, // SKU
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					dataType: 'name',
					editable: false,
					filter: { showIcon: true },
				}, // 상품명
			],
		}, // 상품정보
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false }, // 재고등급
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), dataType: 'code', editable: false }, // 공장
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false }, // 보관유형
		{ dataField: 'serialynname', headerText: t('lbl.SERIALYN'), dataType: 'code', editable: false }, // 시리얼여부
		{
			dataField: 'qty',
			headerText: t('lbl.HOLDSTOCK'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		}, // 보유수량
		{
			dataField: 'wdQty',
			headerText: t('lbl.CONFIRMQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: false };
					}
					return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: false, allowNegative: false };
				},
			},
		}, // 확정수량
		{ dataField: 'uom', headerText: t('lbl.UOM_RT'), dataType: 'code', editable: false }, // 단위
		{
			dataField: 'etcqty1',
			headerText: t('lbl.BOXCNT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		}, // 박스수
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false }, // 로케이션
		{ dataField: 'stocktypename', headerText: t('lbl.STOCKTYPE'), dataType: 'code', editable: false }, // 재고유형
		{
			dataField: 'other03',
			headerText: t('lbl.CLAIMDTLIDS'),
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: claimtypeOptions },
		}, // 클레임상세대분류
		{
			dataField: 'other04',
			headerText: t('lbl.CLAIMDTLID'),
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: claimtypeOptions2 },
		}, // 클레임상세
		{
			dataField: 'other01',
			headerText: t('lbl.OTHER01_DMD_AJ'),
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: getCommonCodeList('OTHER01_DMD', t('lbl.ALL')) },
		}, // 조정사유
		{
			dataField: 'other05',
			headerText: t('lbl.OTHER01_DMD_RT'),
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: getCommonCodeList('YN', t('lbl.ALL')) },
		}, // 반품여부
		{
			dataField: 'blngdeptcd',
			headerText: t('lbl.BLNGDEPTCD'),
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: getCommonCodeList('BLNGDEPTCD', t('lbl.ALL')) },
		}, // 귀속부서
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: false,
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(제조)
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			align: 'center',
			dataType: 'code',
			editable: false,
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(소비)
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 경과기간
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false }, // 시리얼번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false }, // 바코드
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false }, // B/L번호
				{ dataField: 'butcherydt', headerText: t('도축일자'), dataType: 'code', editable: false }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), dataType: 'code', editable: false }, // 공장명
				{ dataField: 'contracttype', headerText: t('계약유형'), dataType: 'code', editable: false }, // 계약유형
				{ dataField: 'contractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code', editable: false }, // 계약업체코드
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				}, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROM'), dataType: 'code', editable: false }, // 유효시작일
				{ dataField: 'tovaliddt', headerText: t('lbl.TO'), dataType: 'code', editable: false }, // 유효종료일
			],
		}, // 시리얼정보
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
	// 그리드 속성
	const gridProps = {
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (commUtil.isEmpty(item.custkey)) {
				return false;
			}
			return true;
		},
	};

	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'dccode',
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'wdQty',
			positionField: 'wdQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];
	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = async () => {
		const { data } = await apiPostClaimTypeList({});
		setClaimtypeOptions2([
			{ cdNm: t('lbl.ALL'), comCd: null },
			...data.map((item: any) => ({
				comCd: item.VALUE,
				cdNm: item.LABEL,
			})),
		]);
		const { data: data2 } = await apiPostClaimTypeList2({});
		setClaimtypeOptions([
			{ cdNm: t('lbl.ALL'), comCd: null },
			...data2.map((item: any) => ({
				comCd: item.VALUE,
				cdNm: item.LABEL,
			})),
		]);

		const col1 = gridRef?.current?.getColumnItemByDataField('other03');
		const col2 = gridRef?.current?.getColumnItemByDataField('other04');
		col1.renderer.list = [
			...data2.map((item: any) => ({
				comCd: item.VALUE,
				cdNm: item.LABEL,
			})),
		];
		col2.renderer.list = [
			...data.map((item: any) => ({
				comCd: item.VALUE,
				cdNm: item.LABEL,
			})),
		];
		gridRef?.current?.setColumnPropByDataField('other03', col1);
		gridRef?.current?.setColumnPropByDataField('other04', col2);

		// wdQty 빈 값 입력 시 이전 값 유지
		gridRef?.current?.bind('cellEditEnd', (event: any) => {
			if (event?.dataField !== 'wdQty') return;
			if (event.value === '' || event.value === null || typeof event.value === 'undefined') {
				gridRef?.current?.setCellValue(event.rowIndex, 'wdQty', event.oldValue ?? null);
			}
		});
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
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length}>
				<Form form={form1} layout="inline" className="sect" initialValues={{ wdDate: dayjs() }}>
					<DatePicker //협력사반품일자
						name="wdDate"
						label={t('lbl.VENDORETURNDT')}
						showSearch
						allowClear
						showNow={false}
						required
						className="bg-white"
					/>
				</Form>
			</GridTopBtn>
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
		</AGrid>
	);
};
export default RtReturnOutDetail;
