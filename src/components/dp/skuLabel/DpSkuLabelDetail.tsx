/*
 ############################################################################
 # FiledataField	: DpSkuLabelDetail.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.08.07
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpSkuLabelDetail = ({
	gridData,
	gridDataDetail,
	gridRef,
	gridRef1,
	saveDpSkuLabel,
	searchDetailList,
	openModal,
	printDetailList,
	copyDetailList,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_DP');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			cdNm: item.cdNm,
			storagetype,
			start,
			end,
			rate,
		};
	});
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '기준마스터',
				authType: 'new',
				callBackFn: openModal,
			},
			{
				btnType: 'copy', // 행복사
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					copyDetailList(1);
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'btn2', // 사용자 정의버튼1
				btnLabel: 'A4인쇄',
				authType: 'new',
				callBackFn: () => {
					printDetailList(1, true);
				},
			},
			{
				btnType: 'print', // 인쇄
				btnLabel: '인쇄',
				callBackFn: () => {
					printDetailList(1, false);
				},
			},
			{
				btnType: 'btn3', // 사용자 정의버튼1
				btnLabel: '예외저장',
				authType: 'new',
				callBackFn: () => {
					saveDpSkuLabel(1);
				},
			},
		],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'slipno',
			headerText: t('lbl.SLIPNO_DP'),
			dataType: 'code',
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
		},
		{
			dataField: 'ordertypename',
			headerText: t('lbl.ORDERTYPE_DP'),
			dataType: 'code',
		},
		{
			headerText: t('lbl.VENDORINFO'),
			children: [
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.FROM_CUSTKEY_DP'),
					filter: {
						showIcon: true,
					},
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current.openPopup(
								{
									custkey: e.item.fromCustkey,
									custtype:
										e.item.ordertypename == '표준센터이동'
											? 'C'
											: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'fromCustname',
					headerText: t('lbl.FROM_CUSTNAME_DP'),
					filter: {
						showIcon: true,
					},
					dataType: 'string',
				},
			],
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
		},
	];

	const gridCol1 = [
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					filter: {
						showIcon: true,
					},
					dataType: 'code',
					editable: false,
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
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					filter: {
						showIcon: true,
					},
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			dataField: 'storagetypedescr',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toloc',
			headerText: t('lbl.TOLOC_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lastlottable01',
			headerText: t('lbl.LASTDURATION'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'printyn',
			headerText: t('lbl.ORDERQTY_PRINTYN'),
			dataType: 'code',
			// renderer: {
			// 	type: 'CheckBoxEditRenderer',
			// 	checkValue: '1',
			// 	unCheckValue: '0',
			// 	editable: true,
			// },
			commRenderer: {
				type: 'checkBox',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'printedqty',
			headerText: t('lbl.LABELPRINTEDQTY'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
		},
		{
			dataField: 'excptYn',
			headerText: t('lbl.EXCPT_YN'),
			dataType: 'code',
			editable: true,
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: true,
			},
		},
		{
			dataField: 'editwhoName',
			headerText: t('lbl.EXCPT_WHO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			headerText: t('lbl.STOCKINFO'),
			children: [
				{
					dataField: 'lot',
					headerText: t('lbl.LOT'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'lotManufacture',
					headerText: '기준일(제조)',
					align: 'center',
					dataType: 'code',
					editable: true,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'lotExpire',
					headerText: '기준일(소비)',
					align: 'center',
					dataType: 'code',
					editable: true,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM'),
					dataType: 'code',
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					dataField: 'durationRate',
					headerText: t('lbl.DURATION_RATE'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'isPossible',
			headerText: t('입고가능여부'),
			dataType: 'code',
			editable: false,
			labelFunction: (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
				cItem: any,
			) => {
				return commUtil.isDpPossible(item, expCodeListMap) ? '입고가능' : '입고불가';
			},
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: commUtil.isDpPossible(item, expCodeListMap) ? 'blue' : 'red',
				};
			},
		},
		{
			dataField: 'draftNo',
			headerText: t('lbl.DRAFT_NO'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				onClick: async (e: any) => {
					const width = 1200;
					const height = 900;
					const left = window.screenX + (window.outerWidth - width) / 2;
					const top = window.screenY + (window.outerHeight - height) / 2;
					const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;
					const newWindow = window.open(
						`https://www.ifresh.co.kr/Approval/Document/DocFrame?DocFolderType=doc&DocID=${e.item.draftNo}&refDocID=`,
						'EDMS',
						windowFeatures,
					);
					/*post 요청X 단순조회로 변경*/
					// const params = {
					// 	formSerial: 'SCM03',
					// 	systemID: 'SCM',
					// 	DATA_KEY1: dayjs().format('YYYYMMDD'),
					// 	DATA_KEY2: e.item.draftNo,
					// 	// OTU_ID: data, //유틸에서 sso티켓 호출
					// };
					//
					// extUtil.openApproval(params);
				},
			},
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

	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps1 = {
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		isLegacyRemove: true, // 기존행 삭제 가능 옵션
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
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
	let prevRowIndex: any = null;
	const initEvent = () => {
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		});

		gridRef1.current.bind('cellEditEnd', (e: any) => {
			//주문수량출력여부 체크시
			if (['printyn'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { printyn, convBoxqty } = gridRef1.current.getGridData()[rowIndex];

				if (printyn === '1') {
					gridRef1.current.setCellValue(rowIndex, 'printedqty', convBoxqty);
				} else {
					setTimeout(() => {
						gridRef1.current.setCellValue(rowIndex, 'printedqty', '4');
					}, 0);
				}
			}

			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationtype, lastlottable01, stockLottable01 } =
					gridRef1.current.getGridData()[rowIndex];

				const lotExpire =
					lotManufacture == 'STD'
						? 'STD'
						: dayjs(lotManufacture, 'YYYYMMDD')
								.add(duration - 1, 'day')
								.format('YYYYMMDD');
				const today = dayjs();
				const manufactureDay = dayjs(lotManufacture, 'YYYYMMDD');
				const expireDay = dayjs(lotExpire, 'YYYYMMDD');
				const lastLotDay = dayjs(lastlottable01, 'YYYYMMDD');
				const stockLotDay = dayjs(stockLottable01, 'YYYYMMDD');

				if (expireDay.isBefore(today, 'day')) {
					showAlert('', '법적소비기한이 지난 소비기한으로 입력할 수 없습니다.');
				} else if (manufactureDay.isAfter(today, 'day')) {
					showAlert('', '법적소비기한이 초과된 소비기한으로 입력할 수 없습니다.');
				} else if (commUtil.isNotEmpty(lastlottable01) && expireDay.isAfter(lastLotDay, 'day')) {
					showAlert('', '기존소비기한 보다 늦은 소비기한으로 입력할 수 없습니다.');
				} else if (commUtil.isNotEmpty(stockLottable01) && expireDay.isAfter(stockLotDay, 'day')) {
					showAlert('', '현재고상품 소비기한 보다 늦은 소비기한으로 입력되었습니다.');
				}

				gridRef1.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				gridRef1.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationtype, lastlottable01, stockLottable01 } =
					gridRef1.current.getGridData()[rowIndex];

				const lotManufacture =
					lotExpire == 'STD'
						? 'STD'
						: dayjs(lotExpire, 'YYYYMMDD')
								.add(-(duration - 1), 'day')
								.format('YYYYMMDD');
				const today = dayjs();
				const manufactureDay = dayjs(lotManufacture, 'YYYYMMDD');
				const expireDay = dayjs(lotExpire, 'YYYYMMDD');
				const lastLotDay = dayjs(lastlottable01, 'YYYYMMDD');
				const stockLotDay = dayjs(stockLottable01, 'YYYYMMDD');

				if (expireDay.isBefore(today, 'day')) {
					showAlert('', '법적소비기한이 지난 소비기한으로 입력할 수 없습니다.');
				} else if (manufactureDay.isAfter(today, 'day')) {
					showAlert('', '법적소비기한이 초과된 소비기한으로 입력할 수 없습니다.');
				} else if (commUtil.isNotEmpty(lastlottable01) && expireDay.isBefore(lastLotDay, 'day')) {
					showAlert('', '기존소비기한 보다 짧은 소비기한으로 입력할 수 없습니다.');
				} else if (commUtil.isNotEmpty(stockLottable01) && expireDay.isBefore(stockLotDay, 'day')) {
					showAlert('', '현재고상품 소비기한 보다 짧은 소비기한으로 입력되었습니다.');
				}

				gridRef1.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				gridRef1.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef1.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef1.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
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

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(
				gridDataDetail.map((item: any) => ({
					...item,
					durationRate: commUtil.calcDurationRate(item.lotExpire, item.duration),
					durationTerm: commUtil.calcDurationTerm(item.lotExpire, item.duration),
				})),
			);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
			gridRef.current.setFocus();
		}
	}, [gridDataDetail]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ paddingTop: 10 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn1} totalCnt={gridDataDetail?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};
export default DpSkuLabelDetail;
