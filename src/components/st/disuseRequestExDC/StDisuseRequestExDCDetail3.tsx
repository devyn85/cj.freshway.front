/*
 ############################################################################
 # FiledataField	: StDisuseRequestExDCDetail3.tsx
 # Description		: 재고 > 재고조정 > 외부비축재고폐기처리 (폐기 결재)
 # Author					: JiHoPark
 # Since					: 2025.08.25.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API
import { apiSaveElectApproval, apiSaveMasterList3 } from '@/api/st/apiStAdjustmentRequeStExDC';

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface StDisuseRequestExDCDetail3Props {
	data: any;
	totalCnt: any;
	form: any;
	searchHandler: any;
	setNoElectApprovalList: any;
	fixdccode: string;
}

const StDisuseRequestExDCDetail3 = forwardRef((props: StDisuseRequestExDCDetail3Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{ headerText: t('lbl.SKU'), /*상품코드*/ dataField: 'sku', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.SKUNM'),
					/*상품명칭*/ dataField: 'skuname',
					dataType: 'string',
					editable: false,
					width: 350,
				},
			],
		},
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code', width: 130 },
		{ headerText: t('lbl.TYPE'), /*유형*/ dataField: 'inquirytypename', dataType: 'code', width: 110 },
		{ headerText: t('lbl.COSTCENTERNAME'), /*귀속부서명*/ dataField: 'costcentername', dataType: 'string', width: 220 },
		{
			headerText: t('lbl.APPROVALREASONNAME'),
			/*전자결재유형*/ dataField: 'approvalreasonname',
			dataType: 'code',
			width: 120,
		},
		{
			headerText: t('lbl.REASONMSG_AJ'),
			/*조정사유*/ dataField: 'reasoncodename',
			dataType: 'code',
			width: 160,
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', width: 80 },
		{
			headerText: t('lbl.QTY'),
			/*수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 80,
		},
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
			],
		},
		{
			headerText: t('lbl.AMT'),
			/*금액*/ dataField: 'stockamt',
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 140,
		},
		{
			headerText: '처리사유',
			/*사유*/ dataField: 'reasonmsg',
			dataType: 'string',
			width: 170,
			formatString: '#,##0.###',
		},
		// {
		// 	headerText: '발생사유',
		// 	/*사유코드*/ dataField: 'reasoncodename',
		// 	dataType: 'string',
		// 	visible: true,
		// },
		{
			headerText: t('lbl.REASON'),
			/*사유*/ dataField: 'stockamtmsg',
			dataType: 'string',
			width: 170,
			formatString: '#,##0.###',
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
					/*이력번호*/ dataField: 'serialnoOrg',
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
					width: 170,
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
					width: 180,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					/*계약업체명*/ dataField: 'contractcompanyname',
					dataType: 'string',
					editable: false,
					width: 220,
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
				{
					headerText: t('lbl.ADDWHO'),
					/*등록자*/ dataField: 'addwho',
					dataType: 'manager',
					DataField: 'addwho',
					editable: false,
					width: 100,
				},
				{
					headerText: t('lbl.REGDATTM'),
					/*등록일자*/ dataField: 'adddate',
					dataType: 'date',
					editable: false,
					width: 170,
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
			headerText: 'AREA',
			/*AREA*/ dataField: 'area',
			dataType: 'code',
			editable: false,
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
		{ headerText: t('lbl.TRANDATE_AJ'), /*조정일자*/ dataField: 'slipdt', dataType: 'date', visible: false },
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
			headerText: t('lbl.SLIPTYPE'),
			/*전표유형*/ dataField: 'sliptype',
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
			headerText: t('lbl.FACTORYPRICE'),
			/*단가*/ dataField: 'price',
			dataType: 'numeric',
			formatString: '#,##0.###',
			visible: false,
		},
		{
			headerText: t('lbl.OTHER04'),
			/*기타정보4*/ dataField: 'other04',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.OTHER02'),
			/*기타정보2*/ dataField: 'other02',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.OTHER03'),
			/*기타정보3*/ dataField: 'other03',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.ADJUSTWEIGHT_WD'),
			/*출고조정중량*/ dataField: 'weight',
			dataType: 'numeric',
			formatString: '#,##0.###',
			visible: false,
		},

		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', visible: false },
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'code',
			visible: false,
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
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
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		isLegacyRemove: true,
		showFooter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
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
		const dccode = item.dccode;
		const slipno = item.slipno;
		const slipline = item.slipline;
		const chkAllList = ref.current?.getCheckedRowItems();

		const findedData = chkAllList.find((data: any) => {
			const findItem = data.item;
			return dccode === findItem.dccode && slipno === findItem.slipno && slipline === findItem.slipline;
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
	};

	/**
	 * 폐기 결재 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const delGridData = ref.current.getChangedData();

		if (delGridData.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				avc_DCCODE: props.fixdccode,
				deleteMasterList3: delGridData,
			};
			apiSaveMasterList3(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_006'), // 삭제되었습니다.
						modalType: 'info',
					});

					// 재조회
					props.searchHandler();
				}
			});
		});
	};

	/**
	 * 전자결재 open
	 * @param xmlVal
	 */
	const openElectApproval = (xmlVal: string) => {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlVal, 'text/html'); // String -> xml 만들어주는 과정

		const params = {
			formSerial: 'SCM07', // SCM02 -> SCM07
			systemID: 'SCM',
			DATA_KEY1: xmlDoc.getElementsByTagName('approvalreqdt')[0].childNodes[0].nodeValue,
			DATA_KEY2: xmlDoc.getElementsByTagName('approvalreqno')[0].childNodes[0].nodeValue,
			OTU_ID: xmlDoc.getElementsByTagName('ssoid')[0].childNodes[0].nodeValue,
		};

		extUtil.openApproval(params);
	};

	/**
	 * 전자결재
	 */
	const saveElectApprovalCallback = () => {
		let errReason = '';
		const delGridData = ref.current.getChangedData();
		if (delGridData.length > 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_214'), // 삭제 진행중인 데이터가 존재합니다.
				modalType: 'info',
			});
			return;
		}

		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const findData = chkDataList.find((item: any) => {
			if (commUtil.isNotEmpty(item.stockamtmsg)) {
				errReason = item.stockamtmsg;
				return true;
			}

			if (commUtil.isEmpty(item.serialnoOrg)) {
				errReason = t('msg.MSG_COM_VAL_001', [t('lbl.SERIALNO_SKU')]);
				return true;
			}

			if (commUtil.isEmpty(item.convserialno)) {
				errReason = t('msg.MSG_COM_VAL_001', [t('lbl.BLNO')]);
				return true;
			}
		});

		if (findData) {
			showMessage({
				content: t('msg.MSG_COM_VAL_235', [errReason]), // 전자결재 진행이 불가능합니다. ({{0}})
				modalType: 'info',
			});

			positionChangeHandler(findData);
			return;
		}

		// 결재하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_216'), () => {
			const params = {
				avc_DCCODE: props.fixdccode,
				procedure: 'SPAJ_REQUEST',
				avc_COMMAND: 'APPROVAL_DU',
				processtype: 'AJ_APPROVAL_DU',
				temptabletype: 'AJ',
				saveElectApproval: chkDataList,
			};

			apiSaveElectApproval(params).then(res => {
				if (res.statusCode === 0) {
					// 전자결재 요청된 건을 filtering 해서 보여지지 않도록 변경
					props.setNoElectApprovalList();

					// 전자결재 호출
					openElectApproval(res.statusMessage);
				}
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'elecApproval', // 전자결재
				callBackFn: saveElectApprovalCallback,
			},
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
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
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
			<GridAutoHeight id="disposal-approval-grid">
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</GridAutoHeight>
		</>
	);
});

export default StDisuseRequestExDCDetail3;
