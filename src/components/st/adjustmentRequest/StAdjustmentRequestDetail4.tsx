/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestDetail4.tsx
 # Description		: 재고 > 재고조정 > 재고조정처리 (재고조정 처리)
 # Author					: JiHoPark
 # Since					: 2025.10.14.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util
// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiSaveMasterList4 } from '@/api/st/apiStAdjustmentRequest';

// Hooks
// lib
// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface StAdjustmentRequestDetail4Props {
	data: any;
	totalCnt: any;
	searchHandler: any;
}

const StAdjustmentRequestDetail4 = forwardRef((props: StAdjustmentRequestDetail4Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.APPROVALREQNO'), /*품의요청번호*/ dataField: 'approvalreqno', dataType: 'code', width: 150 },
		{ headerText: t('lbl.APPROVALNO'), /*전자문서번호*/ dataField: 'approvalno', dataType: 'code', width: 100 },
		{ headerText: t('lbl.APPROVALDATE'), /*전자문서시간*/ dataField: 'approvaldate', dataType: 'date', width: 200 },
		{
			headerText: t('lbl.APPROVALSTATUS'),
			/*결재진행상태*/ dataField: 'approvalstatusname',
			dataType: 'code',
			width: 100,
		},
		{ headerText: t('lbl.QCSTATUS_RT'), /*처리상태*/ dataField: 'statusAj', dataType: 'code', width: 100 },
		{ headerText: t('lbl.TRANDATE_AJ'), /*조정일자*/ dataField: 'slipdt', dataType: 'date', width: 130 },
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', width: 100 },
		{ headerText: t('lbl.STOCKTYPE'), /*재고위치*/ dataField: 'stocktypenm', dataType: 'code', width: 100 },
		{ headerText: t('lbl.STOCKGRADE'), /*재고속성*/ dataField: 'stockgradename', dataType: 'code', width: 100 },
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', width: 80 },
		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{
					headerText: t('lbl.SKU'),
					/*상품코드*/ dataField: 'sku',
					dataType: 'code',
					editable: false,
					width: 80,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					headerText: t('lbl.SKUNM'),
					/*상품명칭*/ dataField: 'skuname',
					dataType: 'string',
					editable: false,
					width: 350,
				},
			],
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', width: 80 },
		{
			headerText: t('lbl.ADJUSTQTY_AJ'),
			/*조정수량*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 80,
		},
		{
			headerText: t('lbl.AMT'),
			dataField: 'purchaseprice' /*금액*/,
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 140,
		},
		{ headerText: t('lbl.DECREASETYPE'), /*감모유형*/ dataField: 'decreasetypename', dataType: 'code', width: 100 },
		{ headerText: t('lbl.INQUIRYREASONCODE'), /*발생사유*/ dataField: 'reasoncodename', dataType: 'code', width: 160 },
		{ headerText: t('lbl.OTHER05_DMD_AJ'), /*물류귀책배부*/ dataField: 'processmain', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'),
			/*소비일자*/ dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.MANUFACTUREDT'),
			/*제조일자*/ dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATIONTERM'),
			/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
			dataType: 'string',
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					headerText: t('lbl.SERIALNO_SKU'),
					/*이력번호*/ dataField: 'serialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BARCODE'),
					/*바코드*/ dataField: 'barcode',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BLNO'),
					/*B/L 번호*/ dataField: 'convserialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONVERTLOT'),
					/*도축일자*/ dataField: 'butcherydt',
					dataType: 'date',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'string',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'string',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANY'),
					/*계약업체*/ dataField: 'contractcompany',
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					/*계약업체명*/ dataField: 'contractcompanyname',
					dataType: 'string',
					editable: false,
					width: 180,
				},
				{
					headerText: t('lbl.FROMVALIDDT'),
					/*유효일자(FROM)*/ dataField: 'fromvaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TOVALIDDT'),
					/*유효일자(TO)*/ dataField: 'tovaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: t('lbl.STORERKEY'),
			/*회사*/ dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.AREA'),
			/*작업구역*/ dataField: 'area',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.DOCDT'),
			/*문서일자*/ dataField: 'docdt',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.DOCNO'),
			/*문서번호*/ dataField: 'docno',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.DOCLINE_AJ'),
			/*재고조정문서라인*/ dataField: 'docline',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.R_DOCNO'),
			/*전표번호*/ dataField: 'slipno',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.SLIPLINE'),
			/*전표라인번호*/ dataField: 'slipline',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.ORDERTYPE'),
			/*주문유형*/ dataField: 'ordertype',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.SLIPTYPE'),
			/*전표유형*/ dataField: 'sliptype',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.TO_STOCKID'),
			/*재고ID*/ dataField: 'stockid',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.STOCKGRADE'),
			/*재고속성*/ dataField: 'stockgrade',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.FROM_LOT'),
			/*LOT*/ dataField: 'lot',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.IOTYPE'),
			/*입출고타입*/ dataField: 'iotype',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			editable: false,
			visible: false,
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'calbox',
			positionField: 'calbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realorderbox',
			positionField: 'realorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realcfmbox',
			positionField: 'realcfmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'tranbox',
			positionField: 'tranbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		isLegacyRemove: true,
		showFooter: true,
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			if (commUtil.nvl(item?.statusAj, 'EMPTY') == '조정확정') {
				return false;
			}
			return true;
		},
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn === 'Y' || Number(item.tranqty) === 0) {
				return 'color-danger';
			}
		},
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	/**
	 * 재고조정 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const delGridData = ref.current.getChangedData();
		const chkDataList = ref.current.getCheckedRowItemsAll();

		if (delGridData.length < 1 && chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const compDelData = delGridData.map((val: any) => {
			delete val.rowStatus;
			return val;
		});

		const jsonCompDelData = JSON.stringify(compDelData);
		const diffChkData = chkDataList
			.filter((data: any) => {
				return !jsonCompDelData.includes(JSON.stringify(data));
			})
			.map((filterVal: any) => {
				const returnData = {
					...filterVal,
					rowStatus: 'U',
				};
				return returnData;
			});

		// 시스템관리자, 운영관리자가 아닌 경우 approvalstatus가 0(반려)인 경우만 삭제 가능
		// if (delGridData.length > 0 && globalVariable.gAuthority !== '00' && globalVariable.gAuthority !== '05') {
		if (delGridData.length > 0 && !user.roles?.includes('000') && !user.roles?.includes('010')) {
			const result = delGridData.find(({ approvalstatus }: { approvalstatus: string }) => approvalstatus !== '0');
			if (result) {
				showMessage({
					content: t('msg.MSG_COM_VAL_208'), // 반려건만 삭제 가능합니다.
					modalType: 'info',
				});
				return;
			}
		}

		// 최종결재완료건만 처리 가능
		if (diffChkData.length > 0) {
			const result = diffChkData.find(({ approvalstatus }: { approvalstatus: string }) => approvalstatus !== '3');
			if (result) {
				showMessage({
					content: t('msg.MSG_COM_VAL_209'), // 최종결재완료건만 처리 가능합니다.
					modalType: 'info',
				});
				return;
			}
		}

		// 저장하시겠습니까?\n(신규 : {{0}}건, 수정 : {{1}}건, 삭제 : {{2}}건)
		showConfirm(null, t('msg.MSG_COM_VAL_207', [0, diffChkData.length, delGridData.length]), () => {
			const params = {
				saveMasterList4: diffChkData,
				deleteMasterList4: delGridData,
			};
			apiSaveMasterList4(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});
					// 재조회
					props.searchHandler();
				}
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
		</>
	);
});

export default StAdjustmentRequestDetail4;
