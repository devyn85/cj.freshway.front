/*
 ############################################################################
 # FiledataField	: StInquiryDetail1.tsx
 # Description		: 재고 > 재고작업 > 재고조사등록 - 조사등록 탭
 # Author			: KimDongHan
 # Since			: 2025.11.02

	// 소비기한 리스트
	const gridCol = [

	
 	// 실사처리 그리드 - 상세
	const gridCol1 = [
 ############################################################################
*/

import { apiPostExcelList } from '@/api/st/apiStInquiry';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import { checkVaild, getFooterLayout2, getGridCol2 } from '@/components/st/inquiry/stInquiry';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import dateUtils from '@/util/dateUtil';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StInquiryDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// Declare variable(1/4)
	const { t } = useTranslation();
	const { gridData, gridData1, gridRef, gridRef1, searchTypeList, search } = props;
	const [isTab1, setIsTab1] = useState(false);
	const [loopTrParams, setLoopTrParams] = useState({});

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	const modalRef = useRef(null);
	const masterKey = useRef<string | null>(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 완료면 수정불가
		if (commUtil.nvl(item?.commitYn, 'N') == 'Y') {
			return true;
		}

		if (item?.priority < item?.lastpriority) {
			// 재지시가 있고 이전 차수는 수정불가
			return true;
		}
		return false;
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [],
	};

	const gridProps = {
		editable: true,
		showStateColumn: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		fillColumnSizeMode: true,
	};

	// 소비기한 리스트
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 80 }, // 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
		{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'code', colSpan: 2, editable: false, width: 80 }, // 창고
		{ dataField: 'organizename', dataType: 'code', editable: false, width: 100 }, // 창고명
		{ dataField: 'inquirydt', headerText: t('lbl.INQUIRYDT'), dataType: 'date', editable: false, width: 100 }, // 조사일자
		{
			dataField: 'lottype',
			headerText: t('lbl.INV_CHECK_TYPE'),
			dataType: 'code',
			editable: false,
			width: 80,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (!Array.isArray(searchTypeList)) return value;
				const found = searchTypeList.find((s: any) => String(s.comCd) === String(value));
				return found?.cdNm ?? value;
			},
		}, // 실사구분
		{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), dataType: 'code', editable: false, width: 120 }, // 조사번호
		{ dataField: 'inquiryName', headerText: t('lbl.INQUIRY_ALIAS'), dataType: 'code', editable: false, width: 150 }, // 재고조사 별칭
		{ dataField: 'priority', headerText: t('lbl.RETURNDRIVECNT'), dataType: 'numeric', editable: false, width: 50 }, // 회차
		{
			headerText: t('lbl.INQUIRYINFO'),
			children: [
				{ dataField: 'loccnt', headerText: t('lbl.LOCCNT'), dataType: 'numeric', editable: false, width: 80 }, // 로케이션수
				{ dataField: 'skucnt', headerText: t('lbl.SKUCNT'), dataType: 'numeric', editable: false, width: 80 }, // 상품수
				{
					dataField: 'sourcekey',
					headerText: t('원지시회차'), // 원지시회차
					dataType: 'code',
					editable: false,
					width: 110,
				},
				{ dataField: 'memo', headerText: t('lbl.MEMO'), dataType: 'text', editable: false, width: 150 }, // 메모
			],
		}, // 지시정보
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		}, // 등록자
		{ dataField: 'updId', visible: false }, // 업데이트ID
		{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), dataType: 'code', editable: false, width: 150 }, // 등록일시
	];

	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1,
		btnArr: [
			{
				btnType: 'excelDownload',
				isActionEvent: false,
				callBackFn: () => {
					excelDown();
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					saveDetailList();
				},
			},
		],
	};

	const gridProps1 = {
		editable: true,
		showStateColumn: false,
		enableColumnResize: true,
		fillColumnSizeMode: false,
		showFooter: true,
		showCustomRowCheckColumn: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled';
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item);
		},
	};

	// 실사처리 그리드 - 상세
	const gridCol1 = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 50 }, // 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
		{ dataField: 'organize', headerText: t('lbl.STORE'), dataType: 'code', colSpan: 2, editable: false, width: 80 }, // 창고
		{ dataField: 'organizename', dataType: 'code', editable: false, width: 100 }, // 창고명
		{ dataField: 'status', headerText: t('lbl.INQUIRYSTATUS'), dataType: 'code', editable: false, width: 50 }, // 진행상태
		{ dataField: 'commitYn', headerText: t('lbl.COMPLETE_YN'), dataType: 'code', editable: false, width: 50 }, // 완료여부
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
					ref.gridRef.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', editable: false, width: 250 }, // 상품명칭
		{ dataField: 'wharea', headerText: t('lbl.WHAREA'), dataType: 'code', editable: false, width: 100 }, // 창고구분
		{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), dataType: 'code', editable: false, width: 80 }, // 창고층
		{ dataField: 'zone', headerText: t('lbl.ZONE'), dataType: 'code', editable: false, width: 50 }, // 피킹존
		{ dataField: 'zonename', headerText: t('lbl.ZONENAME'), dataType: 'code', editable: false, width: 100 }, // ZONE명
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false, width: 100 }, // 로케이션
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_INQUIRY'), // 지시수량
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 80,
		},
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false, width: 80 }, // 단위
		/*
				############################################################################
				# scanqtyA -> 총실사수량 을 입력
				############################################################################
		*/
		{
			dataField: 'scanqtyA',
			headerText: t('lbl.TOTAL_PHYSICAL_QTY'), // 총실사수량
			dataType: 'numeric',
			formatString: '#,###.###',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item.uom === 'KG') {
						return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: true };
					}
					return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: false, allowNegative: true };
				},
			},
			width: 80,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'box',
			headerText: t('lbl.PHYSICAL_BOX'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 80,
		}, // 실사BOX
		{
			dataField: 'ea',
			headerText: t('lbl.PHYSICAL_EA'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 80,
		}, // 실사EA
		{ dataField: 'stockgradeNm', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false, width: 100 }, // 재고속성
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
			width: 100,
		}, // 제조일자
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: { type: 'calender' },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
			width: 100,
		}, // 소비일자
		/*
				############################################################################
				# toLot -> 변경 소비일자 을 입력
				############################################################################
		*/
		{
			dataField: 'toLot',
			headerText: t('lbl.CHG_USEBYDATE'),
			dataType: 'code',
			commRenderer: { type: 'calender', onlyCalendar: false },
			editable: true,
			width: 100,
		}, // 변경 소비일자
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 150,
		}, // 소비기간(잔여/전체)
		{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false, width: 100 }, // 이력번호
		{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false, width: 100 }, // BL번호
		{ dataField: 'stockid', headerText: t('lbl.TO_STOCKID'), dataType: 'code', editable: false, width: 100 }, // 재고ID
		{ dataField: 'instructionYn', headerText: t('lbl.IFFLAG'), dataType: 'code', editable: false, width: 80 }, // 지시여부
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		}, // 수정자
		{ dataField: 'updId', visible: false }, // 업데이트ID
		{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'code', editable: false, width: 150 }, // 수정일시
		{ dataField: 'lottable01', headerText: 'lottable01', dataType: 'code', visible: false },
		{ dataField: 'duration', headerText: 'duration', dataType: 'code', visible: false },
		{ dataField: 'durationtype', headerText: 'durationtype', dataType: 'code', visible: false },
		{ dataField: 'lastpriority', visible: false }, // 최종차수
	];

	const footerLayout1 = [
		{ labelText: t('lbl.TOTAL'), positionField: 'dcname' }, // 합계
		{ dataField: 'orderqty', positionField: 'orderqty', operation: 'SUM', formatString: '#,##0.###' }, // 지시수량
		{ dataField: 'scanqtyA', positionField: 'scanqtyA', operation: 'SUM', formatString: '#,##0.###' }, // 총조사수량
		{ dataField: 'box', positionField: 'box', operation: 'SUM', formatString: '#,##0.###' }, // 조사BOX
		{ dataField: 'ea', positionField: 'ea', operation: 'SUM', formatString: '#,##0.###' }, // 조사EA
	];

	const gridCol2 = getGridCol2(t, ref.gridRef2);

	const footerLayout2 = getFooterLayout2(t);

	const gridProps2 = {
		editable: true,
		showStateColumn: false,
		enableColumnResize: true,
		fillColumnSizeMode: false,
		showFooter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * 선택된 마스터 키 저장
	 */
	const captureMaskterKey = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (selectedRow && selectedRow[0]?.inquiryName) {
			masterKey.current = selectedRow[0].inquiryName + selectedRow[0].inquiryno;
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		let prevSelectedRowJson: string | null = null;
		ref.gridRef.current?.unbind('selectionChange'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		ref.gridRef.current?.bind('selectionChange', (e: any) => {
			const selectedRow = ref.gridRef.current?.getSelectedRows()[0];
			const selectedRowJson = selectedRow ? JSON.stringify(selectedRow) : null;
			if (prevSelectedRowJson !== null && selectedRowJson === prevSelectedRowJson) {
				return;
			}
			prevSelectedRowJson = selectedRowJson;

			// 상세 조회
			if (props.searchDetailList) {
				props.searchDetailList(selectedRow);
			}
		});

		ref.gridRef1.current?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		ref.gridRef1.current?.bind('cellEditBegin', (e: any) => {
			if (['scanqtyA'].includes(e.dataField)) {
				const { rowIndex } = e;
				const item = ref.gridRef1.current.getGridData()[rowIndex];
				// 완료면 수정불가
				if (commUtil.nvl(item?.commitYn, 'N') == 'Y') {
					return false;
				}

				if (item?.priority < item?.lastpriority) {
					// 재지시가 있고 이전 차수는 수정불가
					return false;
				}
				return true;
			}
		});
	};

	const excelDown = async () => {
		ref.gridRef2.current?.setGridData([]);

		// 1. 상단의 선택한 row
		const selectHeadRow = ref.gridRef.current?.getSelectedRows()[0];

		const requestParams = {
			inquirydt: selectHeadRow.inquirydt,
			inquiryno: selectHeadRow.inquiryno,
			dccode: selectHeadRow.dccode,
			storerkey: selectHeadRow.storerkey,
			priority: selectHeadRow.priority,
			organize: selectHeadRow.organize,
			lottype: selectHeadRow.lottype,
		};

		const { data } = await apiPostExcelList(requestParams);

		//console.log('data:', data);

		if (!data || data.length === 0) {
			// 데이터가 없습니다.
			showAlert(null, t('msg.msg.noData'));
			return;
		} else {
			data.forEach((item: any) => {
				item.qtyperbox = Number(item.qtyperbox) || 0; // 입수
				item.stdqty = Number(item.stdqty) || 0; // 재고속성(가용)
				item.s1qty = Number(item.s1qty) || 0; // 재고속성(보류)
				item.s3qty = Number(item.s3qty) || 0; // 재고속성(폐기)
				item.storagetypeSum = Number(item.storagetypeSum) || 0; // 재고속성(합계)
				item.taskSum = (Number(item.taskbox) || 0) * (Number(item.qtyperbox) || 0) + (Number(item.taskea) || 0); // 지시수량(합계). 조회 했지만 다시 계산
				item.box = Number(item.box) || 0; // 실사수량(BOX)
				item.ea = Number(item.ea) || 0; // 실사수량(EA)
				item.scanqtyA = Number(item.scanqtyA) || 0; // 실사수량(합계)
			});
			ref.gridRef2.current?.setGridData(data || []);
		}

		// 재고실사인 경우 소비기한 컬럼 제외
		const dcname = selectHeadRow.dcname;
		const inquiryName = selectHeadRow.inquiryName;

		const params: any = {
			fileName: `${storeUtil.getMenuInfo().progNm}_${dcname}_${inquiryName}_${dateUtils.getToDay('YYYYMMDDHHMMss')}`,
			...(selectHeadRow.lottype === '1' ? { exceptColumnFields: ['expiredt', 'toLot', 'lot'] } : {}),
		};

		ref.gridRef2.current?.exportToXlsxGrid(params);
		ref.gridRef2.current?.setGridData([]);
	};

	// 저장 버튼
	const saveDetailList = async () => {
		let checkedItems: any = '';
		checkedItems = ref.gridRef1.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			//체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		if (!checkVaild(checkedItems, t)) {
			// 검사 실패 시 중단
			return;
		}

		const tmpDccode = checkedItems[0]?.dccode;
		const tmpOrganize = checkedItems[0]?.organize;

		let tempParam = {};
		tempParam = {
			dccode: tmpDccode,
			organize: tmpOrganize,
			apiUrl: '/api/st/inquiry/v1.0/saveDetailList1',
			avc_COMMAND: 'BATCHPROCESSCONFIRM',
		};

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				...tempParam,
				saveDataList: checkedItems,
				dataKey: 'saveDetailList',
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen();
		});
	};

	const closeEvent = () => {
		modalRef.current?.handlerClose();
		props.search;
	};
	useEffect(() => {
		setIsTab1(true);
	}, []);

	useEffect(() => {
		if (isTab1) {
			initEvent();
		}
	}, [isTab1]);

	useEffect(() => {
		if (ref.gridRef.current) {
			ref.gridRef.current?.setGridData(gridData);
			ref.gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				let row = 0;
				if (masterKey.current) {
					const foundRow = gridData.findIndex((item: any) => item.inquiryName + item.inquiryno === masterKey.current);
					if (foundRow >= 0) row = foundRow;
				}
				ref.gridRef.current?.setSelectionByIndex(row, 0);
				captureMaskterKey();
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (ref.gridRef1.current) {
			ref.gridRef1.current?.setGridData(gridData1);
			ref.gridRef1.current?.setSelectionByIndex(0, 0);

			// lottype에 따라 toLot 컬럼 표시/숨김
			const selectedRow = ref.gridRef.current?.getSelectedRows()?.[0];
			if (selectedRow) {
				const isLottype0 = selectedRow?.lottype === '0';
				if (isLottype0) {
					ref.gridRef1.current?.showColumnByDataField('toLot');
				} else {
					ref.gridRef1.current?.hideColumnByDataField('toLot');
				}
			}
		}
		ref.gridRef1.current?.setFocus();
	}, [gridData1]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn
								gridTitle={t('lbl.DETAIL')}
								gridBtn={gridBtn1}
								totalCnt={gridData1?.length}
								extraContentLeft={<span className="msg">{t('msg.MSG_ST_INQUIRY_INPLAN_010')}</span>}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default StInquiryDetail1;
