/*
 ############################################################################
 # FiledataField	: StDisuseRequestExDCDetail4.tsx
 # Description		: 재고 > 재고조정 > 외부비축재고폐기처리 (폐기 처리)
 # Author					: JiHoPark
 # Since					: 2025.08.25.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface StDisuseRequestExDCDetail4Props {
	data: any;
	totalCnt: any;
	form: any;
	fixdccode: string;
	searchHandler: any;
	globalVariable: any;
}

const StDisuseRequestExDCDetail4 = forwardRef((props: StDisuseRequestExDCDetail4Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState<{ success: number; fail: number; total: number }>({
		success: 0,
		fail: 0,
		total: 0,
	});

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
		{ headerText: t('lbl.DECREASETYPE'), /*감모유형*/ dataField: 'disusetypename', dataType: 'code', width: 100 },
		{ headerText: t('lbl.INQUIRYREASONCODE'), /*발생사유*/ dataField: 'reasoncodename', dataType: 'code', width: 160 },
		{ headerText: t('lbl.PROCESSREASON_ETC'), /*처리사유*/ dataField: 'reasonmsg', dataType: 'string', width: 160 },
		{
			headerText: t('lbl.BOXCALINFO') /*박스환산정보*/,
			children: [
				{
					headerText: t('lbl.AVGWEIGHT'),
					/*평균중량*/ dataField: 'avgweight',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CALBOX'),
					/*환산박스*/ dataField: 'calbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.REALOPENBOX'),
					/*실박스예정*/ dataField: 'realorderbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.REALCFMBOX'),
					/*실박스확정*/ dataField: 'realcfmbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TRANBOXQTY'),
					/*작업박스수량*/ dataField: 'tranbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: t('lbl.COSTCENTER') /*귀속부서*/,
			children: [
				{
					headerText: t('lbl.COSTCENTER'),
					/*귀속부서*/ dataField: 'costcd',
					dataType: 'code',
					editable: false,
					width: 100,
				},
				{
					headerText: t('lbl.COSTCENTERNAME'),
					/*귀속부서명*/ dataField: 'costcdname',
					dataType: 'string',
					editable: false,
					width: 220,
				},
			],
		},
		{
			headerText: t('lbl.CUST') /*거래처*/,
			children: [
				{ headerText: t('lbl.CUST'), /*거래처*/ dataField: 'custkey', dataType: 'code', editable: false, width: 100 },
				{
					headerText: t('lbl.CUST_NAME'),
					/*거래처명*/ dataField: 'custname',
					dataType: 'string',
					editable: false,
					width: 220,
				},
			],
		},
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
			dataType: 'code',
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
					dataType: 'code',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'date',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'code',
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
			headerText: t('lbl.ADDWHO'),
			/*등록자*/ dataField: 'addwho',
			dataType: 'manager',
			DataField: 'addwho',
			editable: false,
			width: 200,
		},
		{ headerText: t('lbl.REGDATTM'), /*등록일시*/ dataField: 'adddate', dataType: 'date', editable: false, width: 170 },
		{ headerText: t('lbl.REMARK'), /*비고*/ dataField: 'reference01', dataType: 'string', visible: false },
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
			headerText: t('lbl.APPROVALSTATUS'),
			/*결재진행상태*/ dataField: 'approvalstatus',
			dataType: 'code',
			visible: false,
		},
		{
			headerText: 'chkflag',
			dataField: 'chkflag',
			dataType: 'code',
			editable: false,
			width: 170,
			visible: false,
		},

		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
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
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		isLegacyRemove: false,
		showFooter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		rowCheckDisabledFunction: function (rowIndex: any, isChecked: any, item: { chkflag: string }) {
			if (item.chkflag !== 'S') {
				return false;
			}
			return true;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 위치이동 item
	 * @param {any} item
	 */
	const positionChangeHandler = (item: any) => {
		const approvalno = item.approvalno;
		const approvalreqno = item.approvalreqno;
		const docno = item.docno;
		const chkAllList = ref.current?.getCheckedRowItems();

		const findedData = chkAllList.find((data: any) => {
			const findItem = data.item;
			return approvalno === findItem.approvalno && approvalreqno === findItem.approvalreqno && docno === findItem.docno;
		});

		if (findedData['rowIndex'] > -1) {
			ref.current?.setSelectionByIndex(findedData.rowIndex, 0);
		}
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

		/**
		 * 그리드 전체 체크
		 * @param {boolean} chkFlag chkFlag
		 */
		ref?.current.bind('rowAllCheckClick', function (chkFlag: boolean) {
			const gridAllData = ref?.current.getGridData();

			gridAllData.forEach((item: any, rowIndex: number) => {
				if (chkFlag) {
					const boolChk = item.approvalstatus === '3' && (item.statusAj === '조정예정' || item.statusAj === '부분조정');
					const updateItem = {
						...item,
						chk: boolChk ? '1' : '0',
					};

					ref.current.updateRow(updateItem, rowIndex);
				}
			});
		});
	};

	/**
	 * 폐기 처리 확정 callback
	 * @returns {void}
	 */
	const confirmCallback = () => {
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// approvalstatus가 '0' 또는 '3'인 경우만 유효
		const result = chkDataList.find(
			({ approvalstatus }: { approvalstatus: string }) => approvalstatus !== '0' && approvalstatus !== '3',
		);
		if (result) {
			showMessage({
				content: t('msg.MSG_COM_VAL_209'), // 최종결재완료건만 처리 가능합니다.
				modalType: 'info',
			});
			// 해당 위치로 이동
			positionChangeHandler(result);
			return;
		}

		// 확정하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_022'), () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/st/disuserequestexdc/v1.0/saveMasterList4',
				avc_DCCODE: props.fixdccode,
				saveDataList: chkDataList,
				dataKey: 'saveMasterList4',
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.success > 0) {
				props.searchHandler?.();
			}
		}
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 확정
				callBackFn: confirmCallback,
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
			<AGrid style={{ marginTop: '15px' }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight id="disposal-grid">
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</GridAutoHeight>

			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>
		</>
	);
});

export default StDisuseRequestExDCDetail4;
