/*
 ############################################################################
 # FiledataField	: RtQCConfirmDetail.tsx
 # Description		: 반품 > 반품작업 > 반품판정처리 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.09.23
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtQCConfirmDetail2 = ({
	form2,
	isShow,
	gridRef1,
	gridData2,
	searchDetailList,
	openModal,
	openModal1,
	applyReason,
	saveExcept,
	saveRtQCConfirmMaster2,
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
	const excelParams = {
		fileName: '반품판정처리',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '판정삭제',
				authType: 'new',
				callBackFn: openModal1,
			},
			{
				btnType: 'save',
				callBackFn: () => {
					saveRtQCConfirmMaster2(1);
				},
			},
		],
	};

	// 그리드 초기화
	const gridCol1 = [
		{ headerText: t('lbl.QCTYPE_RT'), dataField: 'processtypename', dataType: 'code', editable: false }, // 처리구분
		{ headerText: t('lbl.SOURCEKEY_RT'), dataField: 'docno', dataType: 'code', editable: false }, // 고객주문번호
		{ headerText: t('lbl.DOCDT_RT'), dataField: 'slipdt', dataType: 'date', editable: false }, // 반품요청일자
		{ headerText: t('lbl.RETURNDELAYYN_RT'), dataField: 'vendoreturnyn', dataType: 'code', editable: false }, // 반품지연여부
		{
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataField: 'custkey',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef1.current.openPopup(
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
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataField: 'fromCustname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 관리처명
		{
			headerText: t('lbl.TO_VATNO'),
			dataField: 'billtocustkey',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef1.current.openPopup(
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
			headerText: t('lbl.TO_VATOWNER'),
			dataField: 'billtocustname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 판매처명
		{ headerText: t('lbl.SALEGROUP'), dataField: 'saleorganize', dataType: 'code', editable: false }, // 영업조직
		{ headerText: t('lbl.SALEDEPARTMENT'), dataField: 'saledepartment', dataType: 'code', editable: false }, // 사업장
		{ headerText: t('lbl.CUSTGROUP'), dataField: 'salegroup', dataType: 'code', editable: false }, // 영업그룹
		{ headerText: t('lbl.CLAIMDTLIDS'), dataField: 'other03', dataType: 'code', editable: false }, // VoC(소)
		{ headerText: t('lbl.CLAIMDTLID'), dataField: 'other04', dataType: 'code', editable: false }, // VoC(세)
		{ headerText: t('lbl.NOTRECALLREASON_RT'), dataField: 'reasoncode', dataType: 'code', editable: false }, // 미회수사유
		{ headerText: t('lbl.REASONTYPE'), dataField: 'other01', dataType: 'code', editable: false }, // 귀책구분
		{ headerText: t('lbl.BLNGDEPTCD'), dataField: 'blngdeptname', editable: false }, // 귀속구분
		{ headerText: t('lbl.LOGI_RESP_YN'), dataField: 'logiRespYn', dataType: 'code', editable: false }, // 물류귀책여부
		{ headerText: t('lbl.RESP_TYPE'), dataField: 'respTypeNm', dataType: 'code', editable: false }, // 귀책배부
		{ headerText: t('lbl.MOVE_LOC'), dataField: 'toLoc', dataType: 'code', editable: false }, // 이동로케이션
		{
			headerText: t('lbl.VENDOR'),
			dataField: 'vendor',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef1.current.openPopup(
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
			headerText: t('lbl.VENDORNAME'),
			dataField: 'vendorname',
			editable: false,
			filter: {
				showIcon: true,
			},
		}, // 협력사명
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					headerText: t('lbl.SKU'),
					dataField: 'sku',
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
							gridRef1.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: '상품명칭',
					dataField: 'skuname',
					editable: false,
					filter: {
						showIcon: true,
					},
				}, // 상품명칭
			],
		},
		{ headerText: t('lbl.PLANT'), dataField: 'plantDescr', dataType: 'code', editable: false }, // 플랜트
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', dataType: 'code', editable: false }, // 저장조건
		{ headerText: t('lbl.CHANNEL_DMD'), dataField: 'channelName', dataType: 'code', editable: false }, // 저장유무
		{ headerText: t('lbl.UOM'), dataField: 'storeruom', dataType: 'code', editable: false }, // 단위
		{
			headerText: t('lbl.CONFIRMQTY_RT'),
			dataField: 'confirmqty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 반품수량
		{
			headerText: t('lbl.QCQTY'),
			dataField: 'orderqty',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 판정수량
		{ headerText: t('lbl.REASONMSG_RTQC'), dataField: 'reasonmsg', dataType: 'code', editable: false }, // 처리변경사유
		{
			headerText: '기준일(제조)',
			dataField: 'lotManufacture',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef1?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(제조)
		{
			headerText: '기준일(소비)',
			dataField: 'lotExpire',
			dataType: 'code',
			align: 'center',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef1?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 기준일(소비)
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef1?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ headerText: t('lbl.SERIALNO'), dataField: 'serialno', dataType: 'code', editable: false }, // 이력번호
				{ headerText: t('lbl.BARCODE'), dataField: 'barcodeSn', dataType: 'code', editable: false }, // 바코드
				{ headerText: t('lbl.BLNO'), dataField: 'convserialno', dataType: 'code', editable: false }, // B/L 번호
				{ headerText: t('lbl.BUTCHERYDT'), dataField: 'butcherydt', dataType: 'date', editable: false }, // 도축일자
				{ headerText: t('lbl.FACTORYNAME'), dataField: 'factoryname', editable: false }, // 도축장
				{ headerText: t('lbl.CONTRACTTYPE'), dataField: 'contracttype', dataType: 'code', editable: false }, // 계약유형
				{ headerText: t('lbl.CONTRACTCOMPANY'), dataField: 'wdCustkey', dataType: 'code', editable: false }, // 계약업체
				{ headerText: t('lbl.CONTRACTCOMPANYNAME'), dataField: 'wdCustname', editable: false }, // 계약업체명
				{ headerText: t('lbl.FROM'), dataField: 'fromvaliddt', dataType: 'date', editable: false }, // 보내는곳
				{ headerText: t('lbl.TO'), dataField: 'tovaliddt', dataType: 'date', editable: false }, // 받는곳
				{
					headerText: t('lbl.SERIALORDERQTY'),
					dataField: 'serialorderqty',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔예정량
				{
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataField: 'serialinspectqty',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔량
				{
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataField: 'serialscanweight',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 스캔중량
			],
		},
		{ headerText: t('매입센터'), dataField: 'stoDcname', dataType: 'code', editable: false }, // 매입센터
		{ headerText: t('lbl.QCSTATUS_RT'), dataField: 'status', dataType: 'code', editable: false }, // 처리상태
	];

	const gridProps1: any = {
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

	const footerLayout1 = [
		{ labelText: t('lbl.TOTAL'), positionField: 'processtypename' }, // 합계
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 반품수량
		{ dataField: 'orderqty', positionField: 'orderqty', operation: 'SUM', formatString: '#,##0.###', style: 'right' }, // 판정수량
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
		form2.setFieldValue('qcdt', dayjs());
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(
				gridData2.map((item: any) => ({
					...item,
					other03: item.other03 == 'UNKNOWN' ? '' : item.other03,
					other04: item.other04 == 'UNKNOWN' ? '' : item.other04,
				})),
			);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	return (
		<>
			<AGrid dataProps={'row-single'} style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData2?.length}>
					<Form form={form2} layout="inline" className="sect" initialValues={{ wdDate: dayjs() }}>
						<DatePicker //협력사반품일자
							name="qcdt"
							label={t('lbl.TASKDT_RT')}
							showSearch
							allowClear
							showNow={false}
							required
							className="bg-white"
						/>
					</Form>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
			</GridAutoHeight>
		</>
	);
};

export default RtQCConfirmDetail2;
