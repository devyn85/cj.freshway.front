/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestExDCDetail1UploadExcelPopup.tsx
 # Description		:  재고 > 재고조정 > 외부비축재고조정처리 (재고 조정 요청 목록) 엑셀 팝업
 # Author			: JiHoPark
 # Since			: 25.09.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API

interface PropsType {
	close?: any;
}

const StAdjustmentRequestExDCDetail1UploadExcelPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const excelUploadFileRef = useRef(null);

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', editable: false, width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', editable: false, width: 100 },
		{
			headerText: t('lbl.ORGANIZENAME'),
			/*창고명*/ dataField: 'organizename',
			dataType: 'string',
			editable: false,
			width: 180,
		},
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stocktypenm',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stockgrade', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stockgradename',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', editable: false, width: 80 },
		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', editable: false, width: 100 },
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{ headerText: t('lbl.SKU'), /*상품코드*/ dataField: 'sku', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.SKUNM'),
					/*상품명*/ dataField: 'skuname',
					dataType: 'string',
					editable: false,
					width: 380,
				},
			],
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', editable: false, width: 80 },
		{
			headerText: t('lbl.QTYPERBOX2'),
			/*입수량*/ dataField: 'qtyperbox',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTY_ST'),
			/*현재고수량*/ dataField: 'qty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 80,
		},
		{
			headerText: t('lbl.OPENQTY_ST'),
			/*가용재고수량*/ dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTYALLOCATED_ST'),
			/*재고할당수량*/ dataField: 'qtyallocated',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTYPICKED_ST'),
			/*피킹재고*/ dataField: 'qtypicked',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.ADJUSTQTY_PLU_MINU'),
			/*조정수량 (+,-)*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			required: true,
			width: 120,
		},
		{
			headerText: t('lbl.INQUIRYREASONCODE'),
			/*발생사유*/ dataField: 'reasoncode',
			dataType: 'string',
			width: 160,
			editable: false,
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
				{
					headerText: t('lbl.TRANBOXQTY'),
					/*작업박스수량*/ dataField: 'tranbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					width: 120,
					editable: false,
					required: false,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyInteger: true, // 정수만 입력
						allowNegative: true, // 음수 입력 허용
					},
				},
			],
		},
		{
			headerText: t('lbl.COSTCENTER') /*귀속부서*/,
			children: [
				{
					headerText: t('lbl.COSTCENTER'),
					/*귀속부서*/ dataField: 'costcd',
					dataType: 'text',
					required: true,
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
				{
					headerText: t('lbl.CUST'),
					/*거래처*/ dataField: 'custkey',
					dataType: 'text',
					required: true,
					editable: false,
					width: 100,
				},
				{
					headerText: t('lbl.CUST_NAME'),
					/*거래처명*/ dataField: 'custname',
					dataType: 'string',
					editable: false,
					width: 240,
				},
			],
		},
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			width: 150,
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
			editable: false,
			width: 150,
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
					width: 120,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'string',
					editable: false,
					width: 200,
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
			],
		},
		{ headerText: t('lbl.TO_LOT'), /*LOT*/ dataField: 'lot', dataType: 'string', editable: false, width: 200 },
		{ headerText: 'STOCKID', /*STOCKID*/ dataField: 'stockid', dataType: 'string', editable: false, width: 200 },
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		// { headerText: t('lbl.OTHER01_DMD_AJ'), /*귀책*/ dataField: 'imputetype', dataType: 'code', editable: false },
		// {
		// 	headerText: t('lbl.OTHER05_DMD_AJ'),
		// 	/*물류귀책배부*/ dataField: 'processmain',
		// 	dataType: 'code',
		// 	editable: false,
		// },
		// { headerText: 'AREA', /*AREA*/ dataField: 'area', dataType: 'code', editable: false },
		// { headerText: 'OTHER03', /*AREA*/ dataField: 'other03', dataType: 'code', editable: false },
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 확인 버튼 callback
	 * @param popupData
	 */
	const conformExcelCallback = () => {
		close();
	};

	/**
	 * filechange evnet
	 * @param event
	 */
	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		ref.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(event, 0, ref, 1, verificationCallback);
	};

	/**
	 * 엑셀 업로드 유효성검증 callback
	 * @param popupData
	 */
	const verificationCallback = async () => {
		const columnObj = [
			{
				headerText: t('lbl.CHECKRESULT') /*체크결과*/,
				dataField: 'verificationYn',
				dataType: 'code',
				style: 'ta-c',
				width: 70,
			},
			{
				headerText: t('lbl.CHKMSG') /*체크메시지*/,
				dataField: 'verification',
				width: 150,
				dataType: 'string',
			},
		];

		ref.current.addColumn(columnObj, '1');

		const excelData = ref.current.getGridData();
		ref.current.clearGridData();
		if (excelData.length < 1) {
			return;
		}

		const newData: any = [];
		excelData.forEach((item: any) => {
			const arrVerMsg: any = [];
			if (commUtil.isEmpty(item.dccode)) {
				// 물류센터
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.DCCODE')]));
			} else if (item.dccode !== '2170') {
				arrVerMsg.push(t('msg.MSG_COM_VAL_058')); // 외부비축센터('2170')를 선택해주세요.
			}

			if (commUtil.isEmpty(item.organize)) {
				// 창고
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.STORE')]));
			}

			if (commUtil.isEmpty(item.tranqty) || Number(item.tranqty) === 0) {
				// 조정수량
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.ADJUSTQTY_AJ')]));
			}

			if (commUtil.isEmpty(item.reasoncode)) {
				// 발생사유
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.INQUIRYREASONCODE')]));
			}

			if (commUtil.isEmpty(item.costcd)) {
				// 귀속부서
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.COSTCENTER')]));
			}

			if (commUtil.isEmpty(item.custkey)) {
				// 거래처
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.CUST')]));
			}

			if (commUtil.isEmpty(item.loc)) {
				// 로케이션
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.LOC_ST')]));
			}

			if (commUtil.isEmpty(item.sku)) {
				// 상품코드
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.SKU')]));
			}

			if (commUtil.isEmpty(item.uom)) {
				// 단위
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.UOM_RT')]));
			}

			if (commUtil.isEmpty(item.lot)) {
				// LOT
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.TO_LOT')]));
			}

			if (commUtil.isEmpty(item.stockid)) {
				// STOCKID
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.STOCKID')]));
			}

			if (commUtil.isEmpty(item.stockgrade)) {
				// 재고속성
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.STOCKGRADE')]));
			}

			if (commUtil.isEmpty(item.stocktype)) {
				// 재고위치
				arrVerMsg.push(t('msg.placeholder1', [t('lbl.STOCKTYPE')]));
			}

			const updateItem = {
				verificationYn: arrVerMsg.length === 0 ? 'Y' : 'N',
				verification: arrVerMsg.join(', '),
				chk: arrVerMsg.length === 0 ? '1' : '0',
				...item,
			};

			newData.push(updateItem);
		});

		ref.current.setGridData(newData);
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelForm', // 엑셀다운로드
			},
			{
				btnType: 'excelSelect',
				isActionEvent: false,
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				btnLabel: t('lbl.BTN_CONFIRM'),
				callBackFn: conformExcelCallback,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.EXCEL_UPLOAD_AJ')} showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={''} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
});

export default StAdjustmentRequestExDCDetail1UploadExcelPopup;
