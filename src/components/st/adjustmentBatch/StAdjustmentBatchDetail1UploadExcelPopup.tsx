/*
 ############################################################################
 # FiledataField	: StAdjustmentBatchDetail1UploadExcelPopup.tsx
 # Description		:  재고 > 재고조정 > 일괄재고조정 (엑셀업로드)
 # Author			: JiHoPark
 # Since			: 2025.10.01
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API

interface StAdjustmentBatchDetail1UploadExcelPopupProps {
	close?: any;
}

const StAdjustmentBatchDetail1UploadExcelPopup = forwardRef(
	(props: StAdjustmentBatchDetail1UploadExcelPopupProps, ref: any) => {
		/**
		 * =====================================================================
		 *	01. 변수 선언부
		 * =====================================================================
		 */
		const { close } = props;

		// 다국어
		const { t } = useTranslation();

		// 유효성검증 버튼 여부
		const [verificationBtnYn, setVerificationBtnYn] = useState(false);

		//그리드 컬럼
		const gridCol = [
			{
				headerText: t('lbl.DCCODE'),
				/*물류센터*/ dataField: 'dccode',
				dataType: 'code',
				editable: false,
				width: 80,
			},
			{
				headerText: t('lbl.STORE'),
				/*창고*/ dataField: 'organize',
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				headerText: t('lbl.STOCKTYPE') /*재고위치*/,
				children: [
					{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
					{
						headerText: t('lbl.DESCR'),
						/*명칭*/ dataField: 'stocktypedesc',
						dataType: 'string',
						editable: false,
						width: 100,
					},
				],
			},
			{
				headerText: t('lbl.STOCKGRADE') /*재고속성*/,
				children: [
					{
						headerText: t('lbl.CODE'),
						/*코드*/ dataField: 'stockgrade',
						dataType: 'code',
						editable: false,
						width: 80,
					},
					{
						headerText: t('lbl.DESCR'),
						/*명칭*/ dataField: 'stockgradedesc',
						dataType: 'string',
						editable: false,
						width: 100,
					},
				],
			},
			{
				headerText: t('lbl.LOC_ST'),
				/*로케이션*/ dataField: 'loc',
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				headerText: t('lbl.SKU'),
				/*상품코드*/ dataField: 'sku',
				dataType: 'code',
				editable: false,
				width: 80,
			},
			{
				headerText: t('lbl.SKUNAME'),
				/*상품명칭*/ dataField: 'skuname',
				dataType: 'string',
				editable: false,
				width: 380,
			},
			{
				headerText: t('lbl.STORAGETYPE'),
				/*저장조건*/ dataField: 'storagetype',
				dataType: 'code',
				editable: false,
				width: 100,
			},
			{
				headerText: t('lbl.STOCK_INFO') /*재고정보*/,
				children: [
					{
						headerText: t('lbl.UOM_RT'),
						/*단위*/ dataField: 'uom',
						dataType: 'code',
						editable: false,
						width: 80,
					},
					{
						headerText: t('lbl.QTY_ST'),
						/*현재고수량*/ dataField: 'qty',
						dataType: 'numeric',
						formatString: '#,##0.##',
						editable: false,
						width: 120,
					},
					{
						headerText: t('lbl.QTYALLOCATED_ST'),
						/*재고할당수량*/ dataField: 'qtyallocated',
						dataType: 'numeric',
						formatString: '#,##0.##',
						editable: false,
						width: 120,
					},
					{
						headerText: t('lbl.QTYPICKED_ST'),
						/*피킹재고*/ dataField: 'qtypicked',
						dataType: 'numeric',
						formatString: '#,##0.##',
						editable: false,
						width: 120,
					},
					{
						headerText: t('lbl.SHOTAGE_QTY'),
						/*가용수량*/ dataField: 'shotageQty',
						dataType: 'numeric',
						formatString: '#,##0.##',
						editable: false,
						width: 120,
					},
				],
			},
			{
				headerText: t('lbl.ETCQTY_WD'),
				/*처리수량*/ dataField: 'tranqty',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editable: false,
				width: 120,
			},
			{
				headerText: t('lbl.WONEARDURATIONYN'),
				/*유통기한임박여부*/ dataField: 'neardurationyn',
				dataType: 'code',
				editable: false,
				width: 120,
			},
			{
				headerText: t('lbl.LOTTABLE01_MFG_WO'),
				/*기준일(유통,제조)*/ dataField: 'lottable01',
				dataType: 'string',
				editable: false,
				width: 150,
			},
			{
				headerText: t('lbl.DURATIONTERM'),
				/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
				dataType: 'string',
				editable: false,
				width: 150,
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
			{
				headerText: t('lbl.LOT'),
				/*로트*/ dataField: 'lot',
				dataType: 'string',
				editable: false,
				width: 200,
			},
			{
				headerText: t('lbl.TO_STOCKID'),
				/*재고ID*/ dataField: 'stockid',
				dataType: 'string',
				editable: false,
				width: 250,
			},
			{
				headerText: t('lbl.AREA'),
				/*작업구역*/ dataField: 'area',
				dataType: 'code',
				editable: false,
				width: 80,
			},
		];

		// 그리드 속성
		const gridProps = {
			editable: false,
			showRowCheckColumn: true,
			showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
			enableFilter: true,
		};

		/**
		 * =====================================================================
		 *	02. 함수
		 * =====================================================================
		 */

		// 유효성 검증
		const verificationCallback = () => {
			const curGridDataList = ref.current.getAddedRowItems();
			if (curGridDataList.length < 1) {
				return;
			}

			const columnObj = {
				headerText: t('lbl.VERIFICATION') /*검증*/,
				dataField: 'verification', // dataField 는 중복되지 않게 설정
				width: 150,
				defaultValue: '',
			};

			ref.current.addColumn(columnObj, 'first');

			const newData: any = [];
			curGridDataList.forEach((item: any) => {
				let verMsg = '';
				if (commUtil.isEmpty(item.dccode)) {
					// 물류센터
					verMsg += t('msg.placeholder1', [t('lbl.DCCODE')]);
				}

				if (commUtil.isEmpty(item.organize)) {
					// 창고
					verMsg += t('msg.placeholder1', [t('lbl.STORE')]);
				}

				if (commUtil.isEmpty(item.stockgrade)) {
					// 재고속성
					verMsg += t('msg.placeholder1', [t('lbl.STOCKGRADE')]);
				}

				if (commUtil.isEmpty(item.loc)) {
					// 로케이션
					verMsg += t('msg.placeholder1', [t('lbl.LOC_ST')]);
				}

				if (commUtil.isEmpty(item.sku)) {
					// 상품코드
					verMsg += t('msg.placeholder1', [t('lbl.SKU')]);
				}

				if (commUtil.isEmpty(item.uom)) {
					// 단위
					verMsg += t('msg.placeholder1', [t('lbl.UOM_RT')]);
				}

				if (commUtil.isEmpty(item.tranqty) || Number(item.tranqty) < 0.1) {
					// 처리수량
					verMsg += t('msg.placeholder1', [t('lbl.ETCQTY_WD')]);
				}

				if (commUtil.isEmpty(item.lot)) {
					// 로트
					verMsg += t('msg.placeholder1', [t('lbl.LOT')]);
				}

				if (commUtil.isEmpty(item.stockid)) {
					// 재고ID
					verMsg += t('msg.placeholder1', [t('lbl.TO_STOCKID')]);
				}

				if (commUtil.isEmpty(item.area)) {
					// 작업구역
					verMsg += t('msg.placeholder1', [t('lbl.AREA')]);
				}

				if (commUtil.isEmpty(verMsg)) {
					verMsg = '정상';
				}

				const updateItem = {
					verification: verMsg,
					...item,
				};

				newData.push(updateItem);
			});

			ref.current.setGridData(newData);
			ref.current.setCheckedRowsByValue('verification', '정상');

			setVerificationBtnYn(true);
		};

		const getGridBtn2 = () => {
			const gridBtn: GridBtnPropsType = {
				tGridRef: ref, // 타겟 그리드 Ref
				btnArr: [
					{
						btnType: 'btn3', // 사용자 정의버튼2
						btnLabel: '유효성검증',
						authType: 'new',
						callBackFn: verificationCallback,
					},
					{
						btnType: 'excelSelect',
						callBeforeFn: () => {
							const btnYn = ref.current.getColumnIndexByDataField('verification');
							if (btnYn > -1) {
								ref.current.removeColumn(btnYn);
								setVerificationBtnYn(false);
							}
						},
					},
					{
						btnType: 'save',
						btnLabel: '확인',
						callBackFn: close,
					},
				],
			};

			if (verificationBtnYn) {
				gridBtn.btnArr.shift();
			}

			return gridBtn;
		};

		/**
		 * =====================================================================
		 *	03. react hook event
		 * =====================================================================
		 */

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name={t('lbl.EXCEL_UPLOAD_ALL_AJ')} showButtons={false} />

				<AGrid>
					<GridTopBtn gridBtn={getGridBtn2()} gridTitle={''} />
					<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</>
		);
	},
);

export default StAdjustmentBatchDetail1UploadExcelPopup;
