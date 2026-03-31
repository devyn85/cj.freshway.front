/**
 * ============================================================================
 * File: stInquiryValidation.ts
 * Description: 재고조사 검증 함수 모음
 * Author: KimDongHan
 * Since: 2026.02.05
 * ============================================================================
 */

/**
 * 재고조사 저장 데이터 검증
 * @param checkedItems - 검증할 아이템 배열
 * @param t - 다국어 함수
 * @returns 검증 결과
 */
export const checkVaild = (checkedItems: any, t: any): boolean => {
	if (!Array.isArray(checkedItems) || checkedItems.length === 0) return true;

	// 첫번째 항목의 inquiryno 및 inquiryName 기준으로 모두 동일한지 검사
	const first = checkedItems[0];
	// 전부 동일해야 하는 컬럼 목록
	const firstPriority = Number(String((first?.item || first)?.priority ?? '0').trim());
	const firstDccode = String((first?.item || first)?.dccode ?? '').trim();
	const firstDcname = String((first?.item || first)?.dcname ?? '').trim();
	const firstOrganize = String((first?.item || first)?.organize ?? '').trim();
	const firstOrganizename = String((first?.item || first)?.organizename ?? '').trim();
	const firstArea = String((first?.item || first)?.area ?? '').trim();
	const firstInquirydt = String((first?.item || first)?.inquirydt ?? '').trim();
	const firstInquiryno = String((first?.item || first)?.inquiryno ?? '').trim();
	const firstInquiryName = String((first?.item || first)?.inquiryName ?? '').trim();

	const inquiryType = firstInquiryno.length >= 4 ? firstInquiryno.at(firstInquiryno.length - 4) : '';
	for (let i = 1; i < checkedItems.length; i++) {
		const row = checkedItems[i];

		const dccode = String((row?.item || row)?.dccode ?? '').trim();
		const dcname = String((row?.item || row)?.dcname ?? '').trim();
		const organize = String((row?.item || row)?.organize ?? '').trim();
		const organizename = String((row?.item || row)?.organizename ?? '').trim();
		const area = String((row?.item || row)?.area ?? '').trim();
		const inquirydt = String((row?.item || row)?.inquirydt ?? '').trim();
		const inquiryno = String((row?.item || row)?.inquiryno ?? '').trim();
		const inquiryName = String((row?.item || row)?.inquiryName ?? '').trim();
		const priority = Number(String((row?.item || row)?.priority ?? '0').trim());

		if (inquiryType === '0') {
			if (commUtil.isNull(String((row?.item || row)?.lot ?? '').trim())) {
				// 실사구분이 소비기한인 경우\r\n소비기한은 필수 입니다.
				showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_017'));
				return false;
			}
		}

		if (firstPriority !== priority || priority === 0) {
			// 서로 다른 회차가 존재하거나\r\n회차가 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_007'));
			return false;
		}

		if (firstDccode !== dccode || commUtil.isNull(firstDccode)) {
			// 서로 다른 물류센터가 존재하거나\r\n물류센터가 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_011'));
			return false;
		}

		if (firstDcname !== dcname || commUtil.isNull(firstDcname)) {
			// 서로 다른 물류센터명이 존재하거나\r\n물류센명이 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_012'));
			return false;
		}

		if (firstOrganize !== organize || commUtil.isNull(firstOrganize)) {
			// 서로 다른 창고가 존재하거나\r\n창고가 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_013'));
			return false;
		}

		if (firstOrganizename !== organizename || commUtil.isNull(firstOrganizename)) {
			// 서로 다른 창고명이 존재하거나\r\n창고명이 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_014'));
			return false;
		}

		if (firstArea !== area || commUtil.isNull(firstArea)) {
			// 서로 다른 창고명이 존재하거나\r\n창고명이 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_015'));
			return false;
		}

		if (firstInquirydt !== inquirydt || commUtil.isNull(firstInquirydt)) {
			// 서로 다른 조사일자가 존재하거나\r\n조사일자가 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_016'));
			return false;
		}

		// 0: 소비기한, 1: 재고실사
		if (firstInquiryno !== inquiryno || commUtil.isNull(firstInquiryno)) {
			// 서로 다른 조사번호가 존재하거나\r\n조사번호가 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_005 '));
			return false;
		}
		if (firstInquiryName !== inquiryName || commUtil.isNull(firstInquiryName)) {
			// 서로 다른 별칭이 존재하거나\r\n별칭 없는 경우 저장 할 수 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_006'));
			return false;
		}
	}

	for (let i = 0; i < checkedItems.length; i++) {
		const row = checkedItems[i];
		const scanqtyA = Number((row?.item || row)?.scanqtyA);
		const toLot = String((row?.item || row)?.toLot ?? '').trim();
		// 0: 소비기한, 1: 재고실사
		if (inquiryType === '0') {
			if (!commUtil.isNull(toLot)) {
				if (scanqtyA === 0) {
					// 실사구분이 소비기한인 경우\r\n변경 소비일자를 입력했을때\r\n총실사수량은 0이 될 수 없습니다.
					showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_008'));
					return false;
				}
			}
		}
		return true;
	}
};

/**
 * 그리드 컬럼(엑셀다운용)
 * @param t
 * @param gridRef2
 */
export const getGridCol2 = (t: any, gridRef2?: any) => [
	{ dataField: 'priority', headerText: t('lbl.RETURNDRIVECNT'), dataType: 'numeric', editable: false, width: 60 }, // 회차
	{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 80 }, // 물류센터
	{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
	{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'code', editable: false, width: 80 }, // 창고
	{ dataField: 'organizename', headerText: t('lbl.TO_CUSTNAME_DP'), dataType: 'code', editable: false, width: 100 }, // 창고명
	{ dataField: 'area', headerText: t('lbl.AREA'), dataType: 'code', editable: false, width: 100 }, // 구역
	{
		dataField: 'inquirydt',
		headerText: t('lbl.INQUIRYDT'),
		dataType: 'date',
		dateInputFormat: 'yyyymmdd',
		editable: false,
		width: 100,
	}, // 조사일자
	{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), dataType: 'code', editable: false, width: 120 }, // 조사번호
	{ dataField: 'inquiryName', headerText: t('lbl.INQUIRY_ALIAS'), dataType: 'code', editable: false, width: 150 }, // 재고조사 별칭
	{ dataField: 'storagetype', headerText: t('lbl.LBL_STORAGETYPE'), dataType: 'code', editable: false, width: 100 }, // 로케이션타입
	{ dataField: 'zone', headerText: t('lbl.ZONE'), dataType: 'code', editable: false, width: 120 }, // 피킹존
	{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false, width: 80 }, // 로케이션
	{
		dataField: 'sku',
		headerText: t('lbl.SKU'),
		dataType: 'code',
		editable: false,
		filter: { showIcon: true },
		commRenderer: {
			type: 'popup',
			onClick: function (e: any) {
				const params = { sku: e.item.sku, skuDescr: e.item.skuname };
				gridRef2?.current?.openPopup(params, 'sku');
			},
		},
		width: 80,
	}, // 상품코드
	{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', editable: false, width: 250 }, // 상품명칭
	{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false, width: 80 }, // 단위
	{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false, width: 100 }, // 입수
	{
		headerText: t('lbl.STOCK_ATTRIBUTE'),
		children: [
			{
				dataField: 'stdqty',
				headerText: t('lbl.AVAILABLE'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 가용
			{
				dataField: 's1qty',
				headerText: t('lbl.ON_HOLD'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 보류
			{
				dataField: 's3qty',
				headerText: t('lbl.DISPOSE'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 폐기
			{
				dataField: 'storagetypeSum',
				headerText: t('lbl.TOTAL'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 합계
		],
	}, // 재고속성
	{
		headerText: t('lbl.ORDERQTY_INQUIRY'),
		children: [
			{
				dataField: 'taskbox',
				headerText: t('lbl.BOX_ENG'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // BOX
			{
				dataField: 'taskea',
				headerText: t('lbl.EA_ENG'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // EA
			{
				dataField: 'taskSum',
				headerText: t('lbl.TOTAL'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 합계
		],
	}, // 지시수량
	{
		headerText: t('lbl.PHYSICAL_QTY'),
		children: [
			{
				dataField: 'box',
				headerText: t('lbl.BOX_ENG'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // BOX
			{
				dataField: 'ea',
				headerText: t('lbl.EA_ENG'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // EA
			{
				dataField: 'scanqtyA',
				headerText: t('lbl.TOTAL'),
				dataType: 'numeric',
				formatString: '#,##0.###',
				editable: false,
				width: 100,
			}, // 합계
		],
	}, // 실사수량
	{
		dataField: 'expiredt',
		headerText: t('lbl.EXPIRY_SYSTEM'),
		dataType: 'code',
		commRenderer: { type: 'calender' },
		styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
		},
		editable: false,
		width: 100,
	}, // 소비일자(시스템)
	{
		dataField: 'toLot',
		headerText: t('lbl.EXPIRY_PHYSICAL'),
		dataType: 'code',
		dateInputFormat: 'yyyymmdd',
		commRenderer: { type: 'calender' },
		editable: false,
		width: 100,
	}, // 소비일자(실사)
	{ dataField: 'lot', headerText: t('lbl.USEBYDATE'), dataType: 'code', editable: false, visible: false }, // 소비일자
];

/**
 * 푸터 레이아웃 (엑셀다운용)
 * @param t
 */
export const getFooterLayout2 = (t: any) => [
	{ labelText: t('lbl.TOTAL'), positionField: 'dcname' }, // 합계
	{ dataField: 'stdqty', positionField: 'stdqty', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 가용
	{ dataField: 's1qty', positionField: 's1qty', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 보류
	{ dataField: 's3qty', positionField: 's3qty', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 폐기
	{
		dataField: 'storagetypeSum',
		positionField: 'storagetypeSum',
		operation: 'SUM',
		dataType: 'numeric',
		formatString: '#,##0.###',
	}, // 재고속성 합계
	{ dataField: 'taskbox', positionField: 'taskbox', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 지시 BOX
	{ dataField: 'taskea', positionField: 'taskea', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 지시 EA
	{
		dataField: 'scanqtyA',
		positionField: 'scanqtyA',
		operation: 'SUM',
		dataType: 'numeric',
		formatString: '#,##0.###',
	}, // 실사수량 합계
	{ dataField: 'box', positionField: 'box', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 실사 BOX
	{ dataField: 'ea', positionField: 'ea', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 실사 EA
	{ dataField: 'taskSum', positionField: 'taskSum', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 지시수량 합계
];
