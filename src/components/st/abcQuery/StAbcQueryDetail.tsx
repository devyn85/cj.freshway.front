/*
 ############################################################################
 # FiledataField	: StAbcQueryDetail.tsx
 # Description		: 재고 > 재고운영 > ABC 분석 Grid
 # Author			: KimDongHan
 # Since			: 2025.11.12
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StAbcQueryDetail = ({
	form,
	gridData,
	gridData1,
	gridRef,
	gridRef1,
	activeKey,
	setActiveKey,
	saveMasterT2List,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const gDccode = Form.useWatch('fixdccode', form);

	const [bindYn, setBindYn] = useState(true);

	const gDcname = useMemo(
		() => getUserDccodeList().find((o: any) => o.dccode == gDccode)?.dcnameOnlyNm || '',
		[gDccode],
	);

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, // 체크박스
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
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
			width: 400,
		},
		{
			// 저장조건
			dataField: 'storagetypeNm',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 박스입수
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			editable: false,
			width: 70,
		},
		{
			// 현재고
			headerText: t('lbl.CURRENT_STOCK'),
			children: [
				{
					// 수량
					dataField: 'qty',
					headerText: t('lbl.QTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 단위
					dataField: 'uom',
					headerText: t('lbl.UOM'),
					dataType: 'code',
					editable: false,
					width: 70,
				},
				{
					// 박스수량
					dataField: 'boxQty',
					headerText: t('lbl.BOXQTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// EA수량
					dataField: 'eaQty',
					headerText: t('lbl.EA_QTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
			],
		},

		{
			// 입고
			headerText: t('lbl.DP'),
			children: [
				{
					// 총수량
					dataField: 'dpQty',
					headerText: t('lbl.TOTQTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 횟수
					dataField: 'dpCnt',
					headerText: t('lbl.COUNT'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 평균
					dataField: 'dpAvg',
					headerText: t('lbl.AVERAGE'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
			],
		},
		{
			// 출고
			headerText: t('lbl.WD'),
			children: [
				{
					// 총수량
					dataField: 'wdQty',
					headerText: t('lbl.TOTQTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 횟수
					dataField: 'wdCnt',
					headerText: t('lbl.COUNT'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 평균
					dataField: 'wdAvg',
					headerText: t('lbl.AVERAGE'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
			],
		},
		{
			// 재고
			headerText: t('lbl.STOCK'),
			children: [
				{
					// 총수량
					dataField: 'stQty',
					headerText: t('lbl.TOTQTY'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 횟수
					dataField: 'stCnt',
					headerText: t('lbl.COUNT'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
				{
					// 평균
					dataField: 'stAvg',
					headerText: t('lbl.AVERAGE'),
					dataType: 'numeric',
					editable: false,
					width: 70,
				},
			],
		},

		{
			// ABC
			dataField: 'abcQuery',
			headerText: t('lbl.ABC'),
			dataType: 'code',
			editable: false,
			width: 70,
		},
		{
			// 선반
			dataField: 'shelfRackBox',
			headerText: t('lbl.SHELF'),
			dataType: 'numeric',
			editable: false,
			width: 70,
		},
		{
			// 1단랙
			dataField: 'f1RackBox',
			headerText: t('lbl.RACK_DAN_1'),
			dataType: 'numeric',
			editable: false,
			width: 70,
		},

		{
			// 2단랙
			dataField: 'f2RackBox',
			headerText: t('lbl.RACK_DAN_2'),
			dataType: 'numeric',
			editable: false,
			width: 70,
		},
	];

	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				// 행추가
				btnType: 'plus' as const,
				initValues: {
					rowStatus: 'I',
					dccode: gDccode,
					dcname: gDcname,
					dpRatio: 0,
					wdRatio: 0,
					trunRatio: 0,
					useYn: 'Y',
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterT2List();
				},
			},
		],
	};

	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol1 = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 100,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 150,
		},
		{
			// 분석명칭
			dataField: 'abcName',
			headerText: t('lbl.ANALYSIS_NAME'),
			dataType: 'text',
			editable: true,
			required: true,
			width: 200,
		},
		{
			// 입고 가중치
			dataField: 'dpRatio',
			headerText: t('lbl.INBOUND_WEIGHT'),
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				allowNegative: false,
			},
			width: 100,
		},
		{
			// 출고 가중치
			dataField: 'wdRatio',
			headerText: t('lbl.OUTBOUND_WEIGHT'),
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				allowNegative: false,
			},
			width: 100,
		},
		{
			// 회전율 가중치
			dataField: 'trunRatio',
			headerText: t('lbl.TURNOVER_WEIGHT'),
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				allowNegative: false,
			},
			width: 100,
		},
		{
			// 선반랙(BOX)
			dataField: 'shelfRackBox',
			headerText: t('lbl.SHELF_RACK_BOX'),
			dataType: 'numeric',
			editable: true,
			width: 100,
		},
		{
			// 1단랙(BOX)
			dataField: 'f1RackBox',
			headerText: t('lbl.RACK_DAN_1_BOX'),
			dataType: 'numeric',
			editable: true,
			width: 100,
		},
		{
			// 2단랙(BOX)
			dataField: 'f2RackBox',
			headerText: t('lbl.RACK_DAN_2_BOX'),
			dataType: 'numeric',
			editable: true,
			width: 100,
		},
		{
			// 비고
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'text',
			editable: true,
			width: 300,
		},
		{
			// 사용유무
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: [
					{ cdNm: t('Y'), comCd: 'Y' },
					{ cdNm: t('N'), comCd: 'N' },
				],
			},
			required: true,
			width: 60,
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
		gridRef1.current?.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'abcName') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}
			return true;
		});

		gridRef1.current?.bind('cellEditEnd', (e: any) => {
			const abcNm = e.item.abcName;
			const { rowIndex } = e;
			//검수시간
			if (['dpRatio', 'wdRatio', 'trunRatio'].includes(e.dataField)) {
				const { dpRatio, wdRatio, trunRatio } = gridRef1.current?.getGridData()[rowIndex];

				if (!dpRatio || !wdRatio || !trunRatio) {
					return;
				}

				const total = Number(dpRatio) + Number(wdRatio) + Number(trunRatio);

				if (total !== 100) {
					//편집 취소
					//gridRef1.current?.setCellValue(rowIndex, e.dataField, oldValue);
					showAlert(
						null,
						// 분석명칭 : [{{0}}]\r\n입고,출고,회전율 가중치의\r\n합은 100 이어야 합니다.\r\n(현재 합 : [{{1}}])
						t('msg.MSG_ST_ABC_QUERY_001', [abcNm, total]),
					);
					return;
				}
			}
		});

		// cellEditEnd 바이트 검증 추가 (initEvent 내부)
		gridRef1.current?.bind('cellEditEnd', (event: any) => {
			const field = event.dataField;

			// popGroup 필드만 검사
			if (field === 'abcName') {
				const label = t('lbl.ANALYSIS_NAME');
				const ok = commUtil.validateAndAlertByteLimit(event.value, 20, label);
				if (!ok) {
					// 검증 실패하면 이전값으로 되돌림
					gridRef1.current?.setCellValue(event.rowIndex, field, '');
					// 포커스 유지(선택적)
					gridRef1.current?.setFocus();
				}
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
	}, [gridData1]);

	return (
		<>
			<AGridWrap className="contain-wrap">
				{/* 2025.11.25 그리드 바인드 문제로 TabPane 을 사용하지 않음. */}
				{/* 분석 */}
				<AGrid style={{ display: activeKey === '1' ? 'flex' : 'none' }}>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				{/* 기준 */}
				<AGrid style={{ display: activeKey === '2' ? 'flex' : 'none' }}>
					<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData1?.length} />
					<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
				</AGrid>
			</AGridWrap>
		</>
	);
};

export default StAbcQueryDetail;
