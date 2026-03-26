/*
 ############################################################################
 # FiledataField	: StInquiryDetail2.tsx
 # Description		: 재고 > 재고작업 > 재고조사등록 - 일괄등록 탭
 # Author			: KimDongHan
 # Since			: 2025.11.02
 ############################################################################
*/

import { apiPostExcelUpList } from '@/api/st/apiStInquiry';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import { checkVaild } from '@/components/st/inquiry/stInquiry';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StInquiryDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form, earch } = props;

	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const [gridData, setGridData] = useState([]);
	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// 저장 버튼
	const saveDetailList = async () => {
		// 체크된 항목만 가져오기
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			//체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		if (!checkVaild(checkedItems, t)) {
			// 검사 실패 시 중단
			return;
		}
		let tempParam = {};
		// 엑셀 업로드인 경우
		if (Array.isArray(checkedItems) && checkedItems.length > 0) {
			const first = checkedItems[0];
			const firstInquiryno = String((first?.item || first)?.inquiryno ?? '').trim();
			const inquiryType = firstInquiryno.length >= 4 ? firstInquiryno.charAt(firstInquiryno.length - 4) : '';
			// 재고실시인 경우 변경 소비기한 제외
			if (inquiryType === '1') {
				checkedItems.forEach((row: any) => {
					delete row.toLot;
				});
			}
		}

		//console.log('저장할 xxxxxxxxxxx:', checkedItems[0]);

		tempParam = {
			apiUrl: '/api/st/inquiry/v1.0/saveDetailList1',
			avc_COMMAND: 'BATCHPROCESSCONFIRM',
		};

		showConfirm(null, t('msg.confirmSave'), async () => {
			const param = {
				inquirydt: checkedItems[0]?.inquirydt,
				inquiryno: checkedItems[0]?.inquiryno,
				dccode: checkedItems[0]?.dccode,
				priority: checkedItems[0]?.priority,
				organize: checkedItems[0]?.organize,
			};
			const { data } = await apiPostExcelUpList({ saveDetailList: checkedItems, ...param });
			const resultItems = data || [];

			const params = {
				...tempParam,
				saveDataList: resultItems,
				dataKey: 'saveDetailList',
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen();
		});
	};

	const gridCol = [
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
					ref.gridRef.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', editable: false, width: 250 }, // 상품명칭
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false, width: 80 }, // 단위
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 100,
		}, // 입수
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
		{ dataField: 'mobileAddYn', visible: false }, // 모바일등록여부
	];

	const gridProps = {
		editable: true,
		showStateColumn: false,
		enableColumnResize: true,
		fillColumnSizeMode: false,
		showFooter: true,
		showRowCheckColumn: true,
		isLegacyRemove: true, // 화면에서 직접 행삭제 방식 사용
	};
	/**
	 * 행삭제 버튼 클릭
	 * 체크된 행을 그리드에서 완전 삭제
	 */
	const deleteRows = () => {
		const checkedData = ref.gridRef.current?.getCheckedRowItems();

		if (!checkedData || checkedData.length === 0) {
			showAlert(null, t('msg.MSG_COM_VAL_072')); // 삭제할 행을 선택하세요
			return;
		}

		// 그리드 rowIndex 기반으로 필터링
		const allData = ref.gridRef.current?.getGridData() || [];
		const checkedRowIndices = new Set(checkedData.map((item: any) => item.rowIndex));
		const filteredData = allData.filter((item: any, index: number) => !checkedRowIndices.has(index));
		ref.gridRef.current?.setGridData(filteredData);
		setGridData(filteredData);
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'excelUpload',
				isActionEvent: false,
				callBackFn: () => {
					uploadExcel();
				},
			},
			{
				btnType: 'delete',
				callBackFn: () => {
					deleteRows();
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

	const footerLayout = [
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
		{
			dataField: 'taskbox',
			positionField: 'taskbox',
			operation: 'SUM',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 지시 BOX
		{ dataField: 'taskea', positionField: 'taskea', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 지시 EA
		{
			dataField: 'taskSum',
			positionField: 'taskSum',
			operation: 'SUM',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 지시수량 합계
		{ dataField: 'box', positionField: 'box', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 실사 BOX
		{ dataField: 'ea', positionField: 'ea', operation: 'SUM', dataType: 'numeric', formatString: '#,##0.###' }, // 실사 EA
		{
			dataField: 'scanqtyA',
			positionField: 'scanqtyA',
			operation: 'SUM',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 실사수량 합계
	];

	const onDataExcel = (data: any) => {
		if (data === undefined || data.length < 1) {
			showAlert(null, t('msg.NO_INFO_UPLOAD_FILE'));
			return;
		}

		const inquiryno = data?.[0]?.[8] ?? '';
		const lottype = inquiryno.length >= 4 ? inquiryno.charAt(inquiryno.length - 4) : '';

		if (lottype !== '0' && lottype !== '1') {
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_018'));
			return;
		}

		/**
		 * 엑셀 컬럼 매핑 정의 (newData 기준)
		 * @returns {object} 엑셀 컬럼 매핑 객체
		 */
		const getExcelColumnMapping = () => {
			return {
				no: 'A', // 0. 번호
				priority: 'B', // 1. 회차
				dccode: 'C', // 2. 물류센터
				dcname: 'D', // 3. 물류센터명
				organize: 'E', // 4. 창고
				organizename: 'F', // 5. 창고명
				area: 'G', // 6. 구역
				inquirydt: 'H', // 7. 조사일자
				inquiryno: 'I', // 8. 조사번호
				inquiryName: 'J', // 9. 재고조사 별칭
				storagetype: 'K', // 10. 저장조건
				zone: 'L', // 11. 피킹존
				loc: 'M', // 12. 로케이션
				sku: 'N', // 13. 상품코드
				skuname: 'O', // 14. 상품명
				uom: 'P', // 15. 단위
				qtyperbox: 'Q', // 16. 입수
				stdqty: 'R', // 17. 가용
				s1qty: 'S', // 18. 보류
				s3qty: 'T', // 19. 폐기
				storagetypeSum: 'U', // 20. 재고속성 합계
				taskbox: 'V', // 21. 지시 BOX
				taskea: 'W', // 22. 지시 EA
				taskSum: 'X', // 23. 지시수량 합계
				box: 'Y', // 24. 실사 BOX
				ea: 'Z', // 25. 실사 EA
				scanqtyA: 'AA', // 26. 실사수량 합계
				expiredt: 'AB', // 27. 소비일자(시스템)
				toLot: 'AC', // 28. 소비일자(실사)
				lot: 'AD', // 29. 소비일자
				rowStatus: 'AE', // 30. 행상태
			};
		};

		/**
		 * 엑셀 컬럼명을 인덱스로 변환
		 * @param {string} columnName - 엑셀 컬럼명 (A, B, C, AA, AB 등)
		 * @returns {number} 0-based 인덱스
		 */
		const getColumnIndex = (columnName: string): number => {
			let result = 0;
			for (let i = 0; i < columnName.length; i++) {
				result = result * 26 + (columnName.charCodeAt(i) - 64);
			}
			return result - 1; // 0-based index
		};

		const newData: any[] = [];
		const columnMapping = getExcelColumnMapping();

		data.slice(0, -1).forEach((row: any, rowIndex: number) => {
			const newGridData: any = {};

			// no 추가 (1부터 시작)
			newGridData.no = rowIndex + 1;

			// 각 필드를 columnMapping 기준으로 가져오기
			newGridData.priority = row[getColumnIndex(columnMapping.priority)];
			newGridData.dccode = row[getColumnIndex(columnMapping.dccode)];
			newGridData.dcname = row[getColumnIndex(columnMapping.dcname)];
			newGridData.organize = row[getColumnIndex(columnMapping.organize)];
			newGridData.organizename = row[getColumnIndex(columnMapping.organizename)];
			newGridData.area = row[getColumnIndex(columnMapping.area)];
			newGridData.inquirydt = row[getColumnIndex(columnMapping.inquirydt)];
			newGridData.inquiryno = row[getColumnIndex(columnMapping.inquiryno)];
			newGridData.inquiryName = row[getColumnIndex(columnMapping.inquiryName)];
			newGridData.storagetype = row[getColumnIndex(columnMapping.storagetype)];
			newGridData.zone = row[getColumnIndex(columnMapping.zone)];
			newGridData.loc = row[getColumnIndex(columnMapping.loc)];
			newGridData.sku = row[getColumnIndex(columnMapping.sku)];
			newGridData.skuname = row[getColumnIndex(columnMapping.skuname)];
			newGridData.uom = row[getColumnIndex(columnMapping.uom)];
			newGridData.qtyperbox = Number(row[getColumnIndex(columnMapping.qtyperbox)]) || 0;
			newGridData.stdqty = Number(row[getColumnIndex(columnMapping.stdqty)]) || 0;
			newGridData.s1qty = Number(row[getColumnIndex(columnMapping.s1qty)]) || 0;
			newGridData.s3qty = Number(row[getColumnIndex(columnMapping.s3qty)]) || 0;
			newGridData.storagetypeSum = Number(row[getColumnIndex(columnMapping.storagetypeSum)]) || 0;
			newGridData.taskbox = Number(row[getColumnIndex(columnMapping.taskbox)]) || 0;
			newGridData.taskea = Number(row[getColumnIndex(columnMapping.taskea)]) || 0;
			newGridData.taskSum =
				(Number(row[getColumnIndex(columnMapping.qtyperbox)]) || 0) *
					(Number(row[getColumnIndex(columnMapping.taskbox)]) || 0) +
				(Number(row[getColumnIndex(columnMapping.taskea)]) || 0);
			newGridData.box = Number(row[getColumnIndex(columnMapping.box)]) || 0;
			newGridData.ea = Number(row[getColumnIndex(columnMapping.ea)]) || 0;
			newGridData.scanqtyA =
				(Number(row[getColumnIndex(columnMapping.qtyperbox)]) || 0) *
					(Number(row[getColumnIndex(columnMapping.box)]) || 0) +
				(Number(row[getColumnIndex(columnMapping.ea)]) || 0);

			// lottype이 0인 경우에만 유효일자 관련 필드 추가 - 실사구분(0:소비기한, 1:재고실사)
			if (lottype === '0') {
				newGridData.expiredt = row[getColumnIndex(columnMapping.expiredt)];
				newGridData.toLot = row[getColumnIndex(columnMapping.toLot)];
				newGridData.lot = row[getColumnIndex(columnMapping.lot)];
			}

			newGridData.rowStatus = 'I';
			newData.push(newGridData);
		});

		setGridData(newData);

		// 실사구분(0:소비기한, 1:재고실사)
		if (lottype === '1') {
			ref.gridRef.current?.hideColumnByDataField(['expiredt', 'toLot']);
		} else if (lottype === '0') {
			ref.gridRef.current?.showColumnByDataField(['expiredt', 'toLot']);
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const uploadExcel = () => {
		modalExcelRef.current?.click();
	};

	const closeEvent = () => {
		modalRef.current?.handlerClose();
		props.search();
	};

	useEffect(() => {
		if (ref.gridRef.current) {
			ref.gridRef.current?.setGridData(gridData);
			ref.gridRef.current?.setSelectionByIndex(0, 0);
		}
	}, [gridData]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			{/* 엑셀 업로드 영역 정의 - 현재미사용(실사tab에서 다운로드 해서 사용) */}
			<ExcelFileInput ref={modalExcelRef} onData={onDataExcel} startRow={2} />
		</>
	);
});
export default StInquiryDetail2;
