/*
 ############################################################################
 # FiledataField	: RtQCConfirmDetail.tsx
 # Description		: 반품 > 반품작업 > 반품판정처리 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.09.23
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtQCConfirmDetail = ({
	form1,
	isShow,
	gridRef,
	gridData,
	searchDetailList,
	openModal,
	openModal1,
	applyReason,
	saveExcept,
	saveRtQCConfirmMaster,
	saveRtQCConfirmDetail,
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
	const CENTER_RESP_CODELIST = getCommonCodeList('CENTER_RESP');
	const excelParams = {
		fileName: '반품판정처리',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: () => {
					saveRtQCConfirmMaster(0);
				},
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{ dataField: 'docnoWd', headerText: t('lbl.DOCNO_RT'), dataType: 'code', editable: false }, // 고객주문번호
		{ dataField: 'docno', headerText: t('lbl.SOURCEKEY_RT'), dataType: 'code', editable: false }, // 고객반품주문번호
		{ dataField: 'slipdt', headerText: t('lbl.DOCDT_RT'), dataType: 'date', editable: false }, // 반품요청일자
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 관리처코드
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 관리처명
		{
			dataField: 'billtocustkey',
			headerText: t('lbl.TO_VATNO'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.billtocustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 판매처코드
		{
			dataField: 'billtocustname',
			headerText: t('lbl.TO_VATOWNER'),
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 판매처명
		{ dataField: 'saleorganize', headerText: t('lbl.SALEGROUP'), dataType: 'code', editable: false }, // 영업조직
		{ dataField: 'saledepartment', headerText: t('lbl.SALEDEPARTMENT'), dataType: 'code', editable: false }, // 사업장
		{ dataField: 'salegroup', headerText: t('lbl.SALEGROUP'), dataType: 'code', editable: false }, // 영업조직
		{ dataField: 'other03', headerText: t('lbl.CLAIMDTLIDS'), dataType: 'code', editable: false }, // VoC(소)
		{ dataField: 'other04', headerText: t('lbl.CLAIMDTLID'), dataType: 'code', editable: false }, // VoC(세)
		{ dataField: 'reasoncode', headerText: t('lbl.NOTRECALLREASON_RT'), dataType: 'code', editable: false }, // 미회수사유
		{ dataField: 'other01', headerText: t('lbl.REASONTYPE'), dataType: 'code', editable: false }, // 귀책구분
		{ dataField: 'blngdeptname', headerText: t('lbl.BLNGDEPTCD'), editable: false }, // 귀속구분
		{
			dataField: 'logiRespYn',
			headerText: t('lbl.LOGI_RESP_YN'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: [
					{ cdNm: t('lbl.SELECT'), comCd: '' },
					{ cdNm: t('Y'), comCd: 'Y' },
					{ cdNm: t('N'), comCd: 'N' },
				],
				descendants: ['respType'],
				descendantDefaultValues: [''],
			},
			editable: true,
		}, // 물류귀책여부
		{
			dataField: 'respType',
			headerText: t('lbl.RESP_TYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				keyField: 'comCd',
				valueField: 'cdNm',
				listFunction: (rowIndex: number, columnIndex: number, item: any) => {
					return CENTER_RESP_CODELIST.filter((code: any) => code.data1 == item?.logiRespYn);
				},
			},
			editable: true,
		}, // 귀책배부
		{ dataField: 'toLoc', headerText: t('lbl.MOVE_LOC'), dataType: 'code', editable: false }, // 이동로케이션
		{
			dataField: 'vendor',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.vendor,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		}, // 협력사코드
		{
			dataField: 'vendorname',
			headerText: t('lbl.VENDORNAME'),
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 협력사명
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
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
								skuDescr: e.item.skuName,
							};
							gridRef.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: '상품명칭',
					editable: false,
					filter: {
						showIcon: true,
					},
				}, // 상품명칭
			],
		},
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), dataType: 'code', editable: false }, // 플랜트
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false }, // 저장조건
		{ dataField: 'channel', headerText: t('lbl.CHANNEL_DMD'), dataType: 'code', editable: false }, // 저장유무
		{ dataField: 'rotype', headerText: t('lbl.VENDORETURNYN'), dataType: 'code', editable: false }, // 협력사반품
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false }, // 단위
		{
			dataField: 'custorderqty',
			headerText: t('lbl.CUSTORDERQTY_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 고객반품주문수량
		{
			dataField: 'unreturnqty',
			headerText: t('lbl.UNRETURNQTY_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 미회수수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 반품수량
		{
			dataField: 'orgReturnoutqty',
			headerText: t('lbl.RETURNQTY_RO'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === null || value === undefined || value === '' ? '' : value;
			},
		}, // 협력사반품수량
		{
			dataField: 'orgDisuseqty',
			headerText: t('lbl.DISUSEQTY'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 폐기수량
		{
			dataField: 'orgGoodqty',
			headerText: t('lbl.GOODCONFIRMQTY_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 정상품전환수량
		{
			dataField: 'returnoutqty',
			headerText: t('lbl.RETURNORDERQTY_RT'),
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return item?.status == '판정중' && item?.orgReturnoutqty > item?.returnoutcfmqty ? 'gc-user54' : 'gc-user32';
			},
		}, // 협력사반품예정수량
		{
			dataField: 'disuseqty',
			headerText: t('lbl.DISUSEQTYORDERQTY'),
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return item?.status == '판정중' && item?.orgDisuseqty > item?.disusecfmqty ? 'gc-user54' : 'gc-user32';
			},
		}, // 폐기예정수량
		{
			dataField: 'goodqty',
			headerText: t('lbl.GOODORDERQTY'),
			dataType: 'numeric',
			editable: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							allowPoint: true,
							allowNegative: true,
						};
					}
					return {
						type: 'InputEditRenderer',
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
					};
				},
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return item?.status == '판정중' && item?.orgGoodqty > item?.goodcfmqty ? 'gc-user54' : 'gc-user32';
			},
		}, // 정상품전환예정수량
		{ dataField: 'reasonmsg', headerText: t('lbl.REASONMSG_RTQC'), dataType: 'code', editable: true }, // 처리변경사유
		{ dataField: '', headerText: t('lbl.DCCODE_RT_STO'), dataType: 'code', editable: false }, // 광역이체센터
		{ dataField: '', headerText: t('lbl.INPLANQTY_RT_STO'), dataType: 'code', editable: false }, // 광역이체예정수량
		{
			dataField: 'unconfirmqty',
			headerText: t('lbl.UNCONFIRMQTY_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 미처리수량
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user0');
			},
		}, // 기준일(제조)
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user0');
			},
		}, // 기준일(소비)
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user0');
			},
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false }, // 이력번호
				{ dataField: 'barcodeSn', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false }, // 바코드
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false }, // B/L 번호
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'date', editable: false }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), editable: false }, // 도축장
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code', editable: false }, // 계약유형
				{ dataField: 'wdCustkey', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code', editable: false }, // 계약업체
				{ dataField: 'wdCustname', headerText: t('lbl.CONTRACTCOMPANYNAME'), editable: false }, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROM'), dataType: 'date', editable: false }, // 보내는곳
				{ dataField: 'tovaliddt', headerText: t('lbl.TO'), dataType: 'date', editable: false }, // 받는곳
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔예정량
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔량
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔중량
			],
		},
		{ dataField: 'status', headerText: t('lbl.QCSTATUS_RT'), dataType: 'code', editable: false }, // 처리상태
	];

	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: 'docnoWd' }, // 합계
		{
			dataField: 'custorderqty',
			positionField: 'custorderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 고객반품주문수량
		{
			dataField: 'unreturnqty',
			positionField: 'unreturnqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 미회수수량
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 반품수량
		{
			dataField: 'orgReturnoutqty',
			positionField: 'orgReturnoutqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 협력사반품수량
		{
			dataField: 'orgDisuseqty',
			positionField: 'orgDisuseqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 폐기수량
		{
			dataField: 'orgGoodqty',
			positionField: 'orgGoodqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 정상품전환수량
		{
			dataField: 'returnoutqty',
			positionField: 'returnoutqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 협력사반품예정수량
		{
			dataField: 'disuseqty',
			positionField: 'disuseqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 폐기예정수량
		{
			dataField: 'goodqty',
			positionField: 'goodqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 정상품전환예정수량
		{
			dataField: 'unconfirmqty',
			positionField: 'unconfirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 미처리수량
		{
			dataField: 'serialorderqty',
			positionField: 'serialorderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 스캔예정량
		{
			dataField: 'serialinspectqty',
			positionField: 'serialinspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 스캔량
		{
			dataField: 'serialscanweight',
			positionField: 'serialscanweight',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 스캔중량
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
			if (item.status == '90') {
				return false;
			}
			return true;
		},
	};

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
		gridRef.current.bind('cellEditEnd', (e: any) => {
			if (['logiRespYn', 'respType'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { dccode, logiRespYn, respType, slipdt } = gridRef.current.getGridData()[rowIndex];

				if (!logiRespYn || !respType) {
					gridRef.current.setCellValue(rowIndex, 'toLoc', '');
					return;
				}

				const day = dayjs(slipdt);
				const month = day.month() + 1;
				const toLoc = CENTER_RESP_CODELIST.find((code: any) => code.comCd == respType)?.data2;
				const toLocReplace = toLoc.replaceAll('#{dccode}', dccode).replaceAll('#{prevMonth}', month);
				gridRef.current.setCellValue(rowIndex, 'toLoc', toLocReplace);
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(
				gridData.map((item: any) => ({
					...item,
					other03: item.other03 == 'UNKNOWN' ? '' : item.other03,
					other04: item.other04 == 'UNKNOWN' ? '' : item.other04,
				})),
			);
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
		<>
			<AGrid dataProps={'row-single'} style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
};
export default RtQCConfirmDetail;
