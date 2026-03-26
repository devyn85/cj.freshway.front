/*
 ############################################################################
 # FiledataField	: StInoutResultDetail.tsx
 # Description		: 재고 > 재고현황 > 수불현황(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import axios from '@/api/Axios';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Redux
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import reportUtil from '@/util/reportUtil';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// API Call Function

const StInoutResultDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const refModal = useRef(null);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세 조회
	 */
	const searchDetailList = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();

		const params = {
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
			storerkey: selectedRow[0].storerkey,
			dccode: selectedRow[0].dccode,
			area: selectedRow[0].area,
			sku: selectedRow[0].sku,
			organize: selectedRow[0].organize,
			stocktype: form.getFieldValue('stocktype'),
			storagetype: form.getFieldValue('storagetype'),
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef1.current?.setGridData(gridData);
			setDetailTotalCnt(gridData.length);

			if (gridData.length > 0) {
				const colSizeList = ref.gridRef1.current.getFitColumnSizeList(true);
				ref.gridRef1.current.setColumnSizeList(colSizeList);
			}
		});
	};

	const apiGetDetailList = (params: any) => {
		return axios.get('/api/st/inoutResult/v1.0/getDetailList', { params }).then(res => res.data);
	};

	/**
	 * 출력
	 */
	const printMasterList = () => {
		const gridRef = ref.gridRef.current; // 상품별 그리드

		if (gridRef.getGridData().length < 1) {
			showAlert(null, t('msg.emptySearch')); // 검색된 결과가 없습니다.
			return;
		}

		const commonParams = form.getFieldsValue();
		const docdt = form.getFieldValue('docdt');
		const params = {
			...commonParams,
			dt1: docdt?.[0]?.format('YYYYMMDD') ?? '',
			dt2: docdt?.[1]?.format('YYYYMMDD') ?? '',
		};

		//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			apiPostPrintMasterList(params).then(res => {
				if (res.statusCode > -1) {
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 출력데이터 조회 - 마스터 API
	 * @param params
	 */
	const apiPostPrintMasterList = (params: any) => {
		return axios.post('/api/st/inoutResult/v1.0/printMasterList', params).then(res => res.data);
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		if (!res.data.reportList || res.data.reportList.length < 1) {
			showAlert(null, t('msg.noData')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'ST_InoutResult.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: res.data.reportList, // 수불현황 데이터
		};

		// 3. 리포트에 전송할 파라미터
		const params = {
			TITLE: '수불현황',
			FROMDT: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			TODT: form.getFieldValue('docdt')[1].format('YYYYMMDD'),
		};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code' }, // 물류센터코드
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code' }, // 창고코드
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{ dataField: 'mc', headerText: t('lbl.MC'), dataType: 'code' }, // 상품분류
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code' }, // 단위
		{ dataField: 'baseqty', headerText: t('lbl.BASEQTY'), dataType: 'numeric' }, // 기준수량

		{
			headerText: t('lbl.RECEIPT') /*입고*/,
			children: [
				{ dataField: 'receiptqty', headerText: t('lbl.RECEIPTQTY_ST'), dataType: 'numeric' }, // 입고수량
				{ dataField: 'returnqty', headerText: t('lbl.RETURNQTY_ST'), dataType: 'numeric' }, // 반품수량
				{ dataField: 'transferqtyDp', headerText: t('lbl.TRANSFERQTY_DP'), dataType: 'numeric' }, // 입고이체수량
				{ dataField: 'surplusqty', headerText: t('lbl.SURPLUSQTY'), dataType: 'numeric' }, // 잉여수량
				{ dataField: 'totalDp', headerText: t('lbl.TOTAL_DP'), dataType: 'numeric' }, // 입고합계
			],
		},
		{
			headerText: t('lbl.ORDER') /*출고*/,
			children: [
				{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY_ST'), dataType: 'numeric' }, // 출고수량
				{ dataField: 'vendorreturnqty', headerText: t('lbl.VENDORRETURNQTY_ST'), dataType: 'numeric' }, // 거래처반품수량
				{ dataField: 'transferqtyWd', headerText: t('lbl.TRANSFERQTY_WD'), dataType: 'numeric' }, // 출고이체수량
				{ dataField: 'decreaseqty', headerText: t('lbl.DECREASEQTY'), dataType: 'numeric' }, // 감소수량
				{ dataField: 'disuseqty', headerText: t('lbl.DISUSEQTY'), dataType: 'numeric' }, // 폐기수량
				{ dataField: 'totalWd', headerText: t('lbl.TOTAL_WD'), dataType: 'numeric' }, // 출고합계
			],
		},
		{ dataField: 'stockqty', headerText: t('lbl.QTY_ST'), dataType: 'numeric' }, // 재고수량
		{
			headerText: t('lbl.QTY_DP'), // 입고수량
			children: [
				{ dataField: 'receiptqtyChannel1', headerText: t('lbl.SAVE'), dataType: 'numeric' }, // 저장수량
				{ dataField: 'receiptqtyChannel2', headerText: t('lbl.DAILY_TAB'), dataType: 'numeric' }, // 일일수량
				{ dataField: 'receiptqtyChannel3', headerText: t('lbl.DCSTODAILY'), dataType: 'numeric' }, // DC→일일
			],
		},
		{
			headerText: t('lbl.QTY_WD'), // 출고수량
			children: [
				{ dataField: 'orderqtyChannel1', headerText: t('lbl.SAVE'), dataType: 'numeric' }, // 저장수량
				{ dataField: 'orderqtyChannel2', headerText: t('lbl.DAILY_TAB'), dataType: 'numeric' }, // 일일수량
				{ dataField: 'orderqtyChannel3', headerText: t('lbl.DCSTODAILY'), dataType: 'numeric' }, // DC→일일
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY_RT'), // 반품수량
			children: [
				{ dataField: 'returnqtyChannel1', headerText: t('lbl.SAVE'), dataType: 'numeric' }, // 저장수량
				{ dataField: 'returnqtyChannel2', headerText: t('lbl.DAILY_TAB'), dataType: 'numeric' }, // 일일수량
				{ dataField: 'returnqtyChannel3', headerText: t('lbl.DCSTODAILY'), dataType: 'numeric' }, // DC→일일
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false, // 자동 컬럼 크기 조정 비활성화
		enableFilter: true,
		showFooter: true,
		groupingFields: [] as string[], // 로케이션/상품별 합계 표시 여부
		// 합계(소계) 설정
		// groupingSummary: {
		// 	dataFields: ['qty', 'openqty', 'qtyallocated', 'qtypicked'],
		// },
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: false,
		// 그룹핑 후 셀 병합 실행
		enableCellMerge: false,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고(rowspan 적용 시키지 않고) 최상단에 값만 출력 시킵니다.
		cellMergeRowSpan: false,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'aui-grid-row-depth1-style';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
						return 'aui-grid-row-depth3-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'baseqty', positionField: 'baseqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{ dataField: 'stockqty', positionField: 'stockqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{
			dataField: 'receiptqty',
			positionField: 'receiptqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{ dataField: 'returnqty', positionField: 'returnqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{
			dataField: 'transferqtyDp',
			positionField: 'transferqtyDp',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'surplusqty',
			positionField: 'surplusqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{ dataField: 'totalDp', positionField: 'totalDp', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{ dataField: 'orderqty', positionField: 'orderqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{
			dataField: 'vendorreturnqty',
			positionField: 'vendorreturnqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'transferqtyWd',
			positionField: 'transferqtyWd',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'decreaseqty',
			positionField: 'decreaseqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{ dataField: 'disuseqty', positionField: 'disuseqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{ dataField: 'totalWd', positionField: 'totalWd', operation: 'SUM', formatString: '#,##0.##', style: 'right' },
		{
			dataField: 'receiptqtyChannel1',
			positionField: 'receiptqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'receiptqtyChannel2',
			positionField: 'receiptqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'receiptqtyChannel3',
			positionField: 'receiptqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'orderqtyChannel1',
			positionField: 'orderqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'orderqtyChannel2',
			positionField: 'orderqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'orderqtyChannel3',
			positionField: 'orderqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'returnqtyChannel1',
			positionField: 'returnqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'returnqtyChannel2',
			positionField: 'returnqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'returnqtyChannel3',
			positionField: 'returnqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];
	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 프린트
				callBackFn: printMasterList,
			},
		],
	};

	// 그리드 컬럼(상세목록 그리드)
	const gridCol1 = [
		{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), dataType: 'code' }, // 테이블시리얼번호
		{ dataField: 'trandate', headerText: t('lbl.TRANDATE'), dataType: 'date' }, // 발생일자
		{ dataField: 'trantypename', headerText: t('lbl.TRANTYPE'), dataType: 'code' }, // 트랜잭션유형
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code' }, // 창고
		{ dataField: 'serialynname', headerText: t('lbl.SERIALYN_ST'), dataType: 'code' }, // 이력유무
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code' }, // 단위
		{ dataField: 'qty', headerText: t('lbl.QTY'), dataType: 'numeric' }, // 수량
		{
			headerText: t('lbl.FROMLOCLABEL'), // FROM 로케이션
			children: [
				{ dataField: 'fromLoc', headerText: t('lbl.FROM_LOC') }, // LOC
				{ dataField: 'fromLot', headerText: t('lbl.FROM_LOT'), dataType: 'code' }, // LOT
				{ dataField: 'fromLottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', width: 100 }, // 기준일(소비,제조)
				{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), dataType: 'code' }, // 재고ID
				{ dataField: 'fromStocktype', headerText: t('lbl.FROM_STOCKTYPE'), dataType: 'code' }, // 재고위치
				{ dataField: 'fromStockgrade', headerText: t('lbl.FROM_STOCKGRADE'), dataType: 'code', width: 100 }, // FROM 재고 속성
				{ dataField: 'fromStockqty', headerText: t('lbl.FROM_STOCKQTY'), dataType: 'numeric', style: 'right' }, // FROM재고량
			],
		},
		{
			headerText: t('lbl.TOLOCLABEL'), // TO 로케이션
			children: [
				{ dataField: 'toLoc', headerText: t('lbl.TO_LOC') }, // LOC
				{ dataField: 'toLot', headerText: t('lbl.TO_LOT'), dataType: 'code' }, // LOT
				{ dataField: 'toLottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', width: 100 }, // 기준일(소비,제조)
				{ dataField: 'toStockid', headerText: t('lbl.TO_STOCKID'), dataType: 'code' }, // 재고ID
				{ dataField: 'toStocktype', headerText: t('lbl.TO_STOCKTYPE'), dataType: 'code' }, // 재고위치
				{ dataField: 'toStockgrade', headerText: t('lbl.TO_STOCKGRADE'), dataType: 'code', width: 100 }, // TO 재고 속성
				{ dataField: 'toStockqty', headerText: t('lbl.TO_STOCKQTY'), dataType: 'numeric' }, // TO재고량
			],
		},
		{
			headerText: t('lbl.REGINFO'), // 등록정보
			children: [
				{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), width: 130 }, // 등록일시
				{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), dataType: 'manager', managerDataField: 'addwho' }, // 등록자
				{ dataField: 'username', headerText: t('lbl.USERNAME'), dataType: 'code' }, // 사용자이름
			],
		},
		{
			headerText: t('lbl.FROM_SERIALINFO'), // FROM 상품이력정보
			children: [
				{ dataField: 'fromSerialno', headerText: t('lbl.SERIALNO') }, // 이력번호
				{ dataField: 'fromBarcode', headerText: t('lbl.BARCODE'), dataType: 'code' }, // 바코드
				{ dataField: 'fromConvserialno', headerText: t('lbl.BLNO'), dataType: 'code' }, // B/L 번호
				{ dataField: 'fromButcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'code' }, // 도축일자
				{ dataField: 'fromFactoryname', headerText: t('lbl.FACTORYNAME'), dataType: 'code' }, // 도축장
				{ dataField: 'fromContracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code' }, // 계약유형
				{ dataField: 'fromContractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code' }, // 계약업체
				{ dataField: 'fromContractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME'), dataType: 'code' }, // 계약업체명
				{ dataField: 'fromFromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'code' }, // 유효일자(FROM)
				{ dataField: 'fromTovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'code' }, // 유효일자(TO)
			],
		},
		{
			headerText: t('lbl.TO_SERIALINFO'), // TO 상품이력정보
			children: [
				{ dataField: 'toSerialno', headerText: t('lbl.SERIALNO'), dataType: 'code' }, // 이력번호
				{ dataField: 'toBarcode', headerText: t('lbl.BARCODE'), dataType: 'code' }, // 바코드
				{ dataField: 'toConvserialno', headerText: t('lbl.BLNO'), dataType: 'code' }, // B/L 번호
				{ dataField: 'toButcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'code' }, // 도축일자
				{ dataField: 'toFactoryname', headerText: t('lbl.FACTORYNAME') }, // 도축장
				{ dataField: 'toContracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code' }, // 계약유형
				{ dataField: 'toContractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code' }, // 계약업체
				{ dataField: 'toContractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME') }, // 계약업체명
				{ dataField: 'toFromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'code', width: 100 }, // 유효일자(FROM)
				{ dataField: 'toTovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'code', width: 100 }, // 유효일자(TO)
			],
		},
	];

	// FooterLayout Props
	const footerLayout1 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'baseqty', positionField: 'baseqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 기준수량 합계
		{ dataField: 'stockqty', positionField: 'stockqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 재고수량 합계
		{
			dataField: 'receiptqty',
			positionField: 'receiptqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 입고수량 합계
		{ dataField: 'returnqty', positionField: 'returnqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 반품수량 합계
		{
			dataField: 'transferqtyDp',
			positionField: 'transferqtyDp',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 입고이체수량 합계
		{
			dataField: 'surplusqty',
			positionField: 'surplusqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 잉여수량 합계
		{ dataField: 'totalDp', positionField: 'totalDp', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 입고합계
		{ dataField: 'orderqty', positionField: 'orderqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 출고수량 합계
		{
			dataField: 'vendorreturnqty',
			positionField: 'vendorreturnqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 거래처반품수량 합계
		{
			dataField: 'transferqtyWd',
			positionField: 'transferqtyWd',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 출고이체수량 합계
		{
			dataField: 'decreaseqty',
			positionField: 'decreaseqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 감소수량 합계
		{ dataField: 'disuseqty', positionField: 'disuseqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 폐기수량 합계
		{ dataField: 'totalWd', positionField: 'totalWd', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 출고합계
		{
			dataField: 'receiptqtyChannel1',
			positionField: 'receiptqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 저장수량(입고) 합계
		{
			dataField: 'receiptqtyChannel2',
			positionField: 'receiptqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 일일수량(입고) 합계
		{
			dataField: 'receiptqtyChannel3',
			positionField: 'receiptqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // DC→일일(입고) 합계
		{
			dataField: 'orderqtyChannel1',
			positionField: 'orderqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 저장수량(출고) 합계
		{
			dataField: 'orderqtyChannel2',
			positionField: 'orderqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 일일수량(출고) 합계
		{
			dataField: 'orderqtyChannel3',
			positionField: 'orderqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // DC→일일(출고) 합계
		{
			dataField: 'returnqtyChannel1',
			positionField: 'returnqtyChannel1',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 저장수량(반품) 합계
		{
			dataField: 'returnqtyChannel2',
			positionField: 'returnqtyChannel2',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 일일수량(반품) 합계
		{
			dataField: 'returnqtyChannel3',
			positionField: 'returnqtyChannel3',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // DC→일일(반품) 합계
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps1 = {
		editable: false,
		fillColumnSizeMode: false, // 자동 컬럼 크기 조정 비활성화
		enableFilter: true,
		showFooter: true,
		groupingFields: [] as string[], // 로케이션/상품별 합계 표시 여부
		// 합계(소계) 설정
		// groupingSummary: {
		// 	dataFields: ['qty', 'openqty', 'qtyallocated', 'qtypicked'],
		// },
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: false,
		// 그룹핑 후 셀 병합 실행
		enableCellMerge: true,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고(rowspan 적용 시키지 않고) 최상단에 값만 출력 시킵니다.
		cellMergeRowSpan: false,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'aui-grid-row-depth1-style';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
						return 'aui-grid-row-depth3-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		const prevRowItem: any = null;
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			if (event.primeCell.item === prevRowItem) return; // 동일 행 선택 시 무시

			// 상세정보 조회
			searchDetailList();
		});
	}, []);

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
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn1} gridTitle={t('lbl.DETAIL_VIEW')} totalCnt={detailTotalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});
export default StInoutResultDetail;
