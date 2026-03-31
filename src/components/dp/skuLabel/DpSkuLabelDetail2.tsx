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
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpSkuLabelDetail2 = ({
	gridData,
	gridDataDetail,
	gridRef2,
	gridRef3,
	saveDpSkuLabel,
	isShow,
	searchDetailList,
	openModal,
	printDetailList,
	copyDetailList,
	printDetailList2,
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
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
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
					copyDetailList(3);
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
					printDetailList(3, true);
				},
			},
			{
				btnType: 'print', // 인쇄
				btnLabel: '인쇄',
				callBackFn: () => {
					printDetailList2(3, false);
				},
			},
			{
				btnType: 'btn3', // 사용자 정의버튼1
				btnLabel: '예외저장',
				authType: 'new',
				callBackFn: () => {
					saveDpSkuLabel(3);
				},
			},
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'copy', // 행복사
			// 	initValues: {
			// 		barcode: '',
			// 		rowStatus: 'I',
			// 	},
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
		],
	};

	// 그리드 초기화
	const gridCol2 = [
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
							gridRef2.current.openPopup(
								{
									custkey: e.item.fromCustkey,
									custtype:
										e.item.ordertypeName == '표준센터이동'
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

	const gridCol3 = [
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
							gridRef3.current.openPopup(params, 'sku');
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					filter: {
						showIcon: true,
					},
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'printedqty',
			headerText: t('lbl.LABELPRINTEDQTY'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
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
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
				skipValidation: true,
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
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
				// skipValidation: true,
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
			dataField: 'lastlottable01',
			headerText: t('lbl.LASTDURATION'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.CONVERTLOT'),
					dataType: 'date',
					editable: true,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'contracttype',
					headerText: t('계약유형'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'contractcustkey',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: true,
				},
				{
					dataField: 'wdCustname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'string',
					editable: true,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROM'),
					dataType: 'date',
					editable: true,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TO'),
					dataType: 'date',
					editable: true,
				},
				{
					dataField: 'grossweight',
					headerText: t('lbl.SKU_WEIGHT'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
				},
				{
					dataField: 'openqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
				},
			],
		},
		{
			dataField: 'dpSlipdt',
			headerText: t('lbl.SLIPDT_DP'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'dpSlipno',
			headerText: t('lbl.SLIPNO_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dpSlipline',
			headerText: t('lbl.SLIPLINE_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'vendor',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			dataType: 'code',
			editable: false,
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
	const gridProps2: any = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps3: any = {
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		// rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
		// 	//console.log(item);
		// 	if (item.rowStatus === 'I') {
		// 		return true;
		// 	}
		// 	return false;
		// },
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
		gridRef2.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef2.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef2.current.getSelectedRows()[0]);
		});

		gridRef3.current.bind('cellEditBegin', (e: any) => {
			if (
				[
					'printedqty',
					'serialno',
					'barcode',
					'convserialno',
					'butcherydt',
					'factoryname',
					'contracttype',
					'contractcustkey',
					'wdCustname',
					'fromvaliddt',
					'tovaliddt',
					'grossweight',
				].includes(e.dataField)
			) {
				const { rowIndex } = e;
				const gridDataWithState = gridRef3.current?.getGridDataWithState('state');
				const rowData = gridDataWithState[rowIndex];
				// //console.log((rowData.state);
				if (rowData.state == 'added') {
					return true;
				} else {
					return false;
				}
			}
		});

		gridRef3.current.bind('cellEditEnd', (e: any) => {
			//제조변경
			if (['lotManufacture'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotManufacture, duration, durationtype, lastlottable01, stockLottable01 } =
					gridRef3.current.getGridData()[rowIndex];

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

				gridRef3.current.setCellValue(rowIndex, 'lotExpire', lotExpire);
				gridRef3.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef3.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef3.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}

			//유통변경
			if (['lotExpire'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { lotExpire, duration, durationtype, lastlottable01, stockLottable01 } =
					gridRef3.current.getGridData()[rowIndex];

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
				} else if (commUtil.isNotEmpty(lastlottable01) && expireDay.isAfter(lastLotDay, 'day')) {
					showAlert('', '기존소비기한 보다 늦은 소비기한으로 입력할 수 없습니다.');
				} else if (commUtil.isNotEmpty(stockLottable01) && expireDay.isAfter(stockLotDay, 'day')) {
					showAlert('', '현재고상품 소비기한 보다 늦은 소비기한으로 입력되었습니다.');
				}

				gridRef3.current.setCellValue(rowIndex, 'lotManufacture', lotManufacture);
				gridRef3.current.setCellValue(rowIndex, 'lottable01', durationtype == '1' ? lotExpire : lotManufacture); //소비기한 단위가 1일 경우 제조일, 그외는 소비일
				gridRef3.current.setCellValue(rowIndex, 'durationRate', commUtil.calcDurationRate(lotExpire, duration));
				gridRef3.current.setCellValue(rowIndex, 'durationTerm', commUtil.calcDurationTerm(lotExpire, duration));
			}
		});

		//기존행 수정막기
		// gridRef3.current.bind('cellEditBegin', (e: any) => {
		// 	//console.log(e);
		// 	// 행이 추가된 경우에만 실행
		// 	if (e.item.rowStatus === 'I') {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// });
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef3.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(
				gridDataDetail.map((item: any) => ({
					...item,
					durationRate: commUtil.calcDurationRate(item.lotExpire, item.duration),
					durationTerm: commUtil.calcDurationTerm(item.lotExpire, item.duration),
				})),
			);
			gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef3.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef3.current.setColumnSizeList(colSizeList);
			}
			gridRef2.current.setFocus();
		}
	}, [gridDataDetail]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn3} totalCnt={gridDataDetail?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default DpSkuLabelDetail2;
