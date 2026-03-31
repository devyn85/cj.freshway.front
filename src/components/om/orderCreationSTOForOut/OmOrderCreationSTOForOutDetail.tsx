/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForOutDetail.tsx
 # Description		: 외부센터 보충발주
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.08
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import OmOrderCreationSTOForOutExcelPopup from '@/components/om/orderCreationSTOForOut/OmOrderCreationSTOForOutExcelPopup';

// API
import { apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTOForOut';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

interface OmOrderCreationSTOForOutDetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	searchForm: any;
}

const OmOrderCreationSTOForOutDetail = forwardRef((props: OmOrderCreationSTOForOutDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	const deliverydate = Form.useWatch('deliverydate', props.searchForm);
	const fromDccode = Form.useWatch('fromDccode', props.searchForm);
	const toDccode = Form.useWatch('toDccode', props.searchForm);

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef2 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizeName',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TO_STOCKTYPE'), //재고위치
			children: [
				{
					dataField: 'fromStocktype',
					headerText: t('lbl.CODE'), //코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stocktypename',
					headerText: t('lbl.DESCR'), //명칭
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), //재고속성
			children: [
				{
					dataField: 'fromStockgrade',
					headerText: t('lbl.CODE'), //코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stockgradename',
					headerText: t('lbl.DESCR'), //명칭
					editable: false,
				},
			],
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'), //로케이션
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STOCKINFO_WD'), //재고정보
			children: [
				{
					dataField: 'uom',
					headerText: t('lbl.UOM'), //단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'), //현재고수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'boxqty',
					headerText: t('lbl.BOXQTY'), //박스수량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'), //재고할당수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'), //피킹재고
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.POSBQTY'), //이동가능수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPEROUTBOX'), //박스입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stbox',
			headerText: t('lbl.STBOX'), //현재고박스환산
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'line02',
			headerText: t('lbl.STDWEIGHT'), //표준중량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.MOVEINFO'), //이동정보
			children: [
				{
					dataField: 'toOrderqty',
					headerText: t('lbl.TOORDERQTY'), //이동수량
					dataType: 'numeric',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: false,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
					formatString: '#,##0.###',
				},
				{
					dataField: 'purchaseuom',
					headerText: t('lbl.PURCHASEUOM_WD'), //발주단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'etcqty2',
					headerText: t('lbl.BOXQTY'), //박스수량
					dataType: 'numeric',
					editable: true,
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: any,
					) => {
						if (item.boxflag === 'Y') {
							return 'isEdit';
						}
						ref.gridRef.current.removeEditClass(columnIndex);
					},
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: false,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.MOVEBOXINFO'), //이동수량박스환산정보
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'calbox',
					headerText: t('lbl.CALBOX'), //환산박스
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'realorderbox',
					headerText: t('lbl.REALOPENBOX'), //실박스예정
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			dataField: 'usebydateFreeRt',
			headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여율
			dataType: 'numeric',
			formatString: '#,##0',
			editable: false,
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), //계약유형
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), //계약업체명
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			dataField: 'fromLot',
			headerText: t('lbl.LOT'), //로트
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromStockid',
			headerText: t('lbl.STOCKID'), //개체식별/유통이력
			editable: false,
		},
		{
			dataField: 'fromArea',
			headerText: t('lbl.AREA'), //작업구역
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'memo1',
			headerText: t('lbl.MEMO1'), //비고
			width: 200,
			editable: true,
		},
		{
			dataField: 'storerkey', //고객사코드
			visible: false,
		},
		{
			dataField: 'boxCal', //박스단위환산
			visible: false,
		},
		{
			dataField: 'boxflag', //박스처리유무
			visible: false,
		},
		{
			dataField: 'stockgrade', //재고속성
			visible: false,
		},
		{
			dataField: 'stockid', //개체식별/유통이력
			visible: false,
		},

		{
			dataField: 'area',
			visible: false,
		},
		{
			dataField: 'lot',
			visible: false,
		},
		{
			dataField: 'stocktype',
			visible: false,
		},
		{
			dataField: 'fromDccode',
			visible: false,
		},
		{
			dataField: 'fromStorerkey',
			visible: false,
		},
		{
			dataField: 'fromOrganize',
			visible: false,
		},
		{
			dataField: 'fromSku',
			visible: false,
		},
		{
			dataField: 'fromLoc',
			visible: false,
		},
		{
			dataField: 'fromOrderqty',
			visible: false,
		},
		{
			dataField: 'fromUom',
			visible: false,
		},
		{
			dataField: 'toCccode',
			visible: false,
		},
		{
			dataField: 'toStorerkey',
			visible: false,
		},
		{
			dataField: 'toArea',
			visible: false,
		},
		{
			dataField: 'toSku',
			visible: false,
		},
		{
			dataField: 'toLoc',
			visible: false,
		},
		{
			dataField: 'toLot',
			visible: false,
		},
		{
			dataField: 'toStockid',
			visible: false,
		},
		{
			dataField: 'toStocktype',
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'ectqty1',
			visible: false,
		},
	];

	// 그리드 컬럼 설정
	const gridCol2 = [
		{
			headerText: t('lbl.FROM_DCCODE'), //공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), //공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			dataField: 'toSku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'description',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			dataField: 'toUom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toStockgrade',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			editable: false,
		},
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'), //작업수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'processflag',
			headerText: 'PROCESSFLAG',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processmsg',
			headerText: 'PROCESSMSG',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
	};

	// 그리드 속성을 설정
	const gridProps2 = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		//showRowCheckColumn: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'toOrderqty') {
			const line01 = event.item.line01;
			const line02 = event.item.line02;
			const toOrderqty = event.item.toOrderqty;
			const boxCal = event.item.boxCal;

			if (line01 === 'Y') {
				if (toOrderqty > 0) {
					if (toOrderqty < line02) {
						const calbox = (toOrderqty / line02).toFixed(2);
						ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', 1);
						ref.gridRef.current.setCellValue(rowIndex, 'calbox', calbox);
					} else {
						const tmpQty = Math.round(toOrderqty / line02);
						const calbox = (toOrderqty / line02).toFixed(2);
						ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', tmpQty);
						ref.gridRef.current.setCellValue(rowIndex, 'calbox', calbox);
					}
				} else {
					ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', 0);
					ref.gridRef.current.setCellValue(rowIndex, 'realorderbox', 0);
					ref.gridRef.current.setCellValue(rowIndex, 'calbox', 0);
				}
			} else {
				if (toOrderqty > 0) {
					const tmpQty = Math.round(toOrderqty * boxCal);
					const calbox = (toOrderqty * boxCal).toFixed(2);
					if (tmpQty < 1) {
						ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', 1);
						ref.gridRef.current.setCellValue(rowIndex, 'calbox', calbox);
					} else {
						ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', Math.round(tmpQty));
						ref.gridRef.current.setCellValue(rowIndex, 'calbox', calbox);
					}
				} else {
					ref.gridRef.current.setCellValue(rowIndex, 'etcqty2', 0);
					ref.gridRef.current.setCellValue(rowIndex, 'realorderbox', 0);
					ref.gridRef.current.setCellValue(rowIndex, 'calbox', 0);
				}
			}
		}

		if (event.dataField === 'etcqty2') {
			ref.gridRef.current.setCellValue(rowIndex, 'realorderbox', event.value);
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(props.searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = props.searchForm.getFieldsValue();

		if (searchParams.fromDccode === searchParams.toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		const targetList: Record<string, any>[] = [];

		// 그리드 입력 값 검증
		for (const item of updatedItems) {
			const req = item.toOrderqty;
			const box = item.etcqty2;
			const boxflag = item.boxflag;

			if (commUtil.isEmpty(item.serialno)) {
				const msg = '이력정보가 존재하지 않는 재고에 대해 이체오더를 생성할 수 없습니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			} else if (req <= 0) {
				const msg = '이동수량을 입력하세요.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			} else if (req > item.posbqty) {
				const msg = '이동가능수량 까지만 이체요청을 할 수 있습니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			} else if (box <= 0 && item.boxflag === 'Y') {
				const msg = '박스수량을 입력하세요.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (req > 0) {
				const dsTarget = {
					fromStorerkey: item.storerkey,
					fromDccode: searchParams.fromDccode,
					fromOrganize: item.fromOrganize,
					fromArea: '1000',
					fromSku: item.sku,
					fromUom: item.uom,
					fromStockgrade: item.fromStockgrade,
					fromStocktype: item.fromStocktype,
					fromStockid: item.stockid,
					fromLoc: item.loc,
					fromLot: item.fromLot,
					serialno: item.serialno,
					toStorerkey: item.storerkey,
					toDccode: searchParams.toDccode,
					toOrganize: searchParams.toDccode,
					toArea: '1000',
					toSku: item.sku,
					toUom: item.uom,
					toStockgrade: item.stockgrade,
					toStockid: item.stockid,
					toStocktype: item.fromStocktype,
					toOrderqty: req,
					memo1: item.memo1,
					etcqty2: boxflag === 'Y' ? item.etcqty2 : 0,
				};

				targetList.push(dsTarget);
			} else if (req < 0) {
				const msg = '음수값은 지정할 수 없습니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				avc_DCCODE: searchParams.fromDccode,
				avc_COMMAND: 'CONFIRM',
				fromDccode: searchParams.fromDccode,
				toDccode: searchParams.toDccode,
				deliverydate: searchParams.deliverydate.format('YYYYMMDD'),
				saveList: targetList,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					setTimeout(() => {
						ref.gridRef2.current?.setGridData(res.data);
					}, 0);
					props.callBackFn?.();
				}
			});
		});
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const uploadExcel = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(props.searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = props.searchForm.getFieldsValue();

		if (searchParams.fromDccode === searchParams.toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		// const updatedItems = ref.gridRef.current.getGridData();

		// if (!updatedItems || updatedItems.length < 1) {
		// 	showAlert(null, '조회 후 엑셀업로드를 실행하세요.');
		// 	return;
		// }

		modalExcelRef.current.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeEventExcel = () => {
		modalExcelRef.current.handlerClose();
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'excelUpload',
					isActionEvent: false,
					callBackFn: () => {
						uploadExcel();
					},
				},
				{
					btnType: 'excelDownload', // 엑셀다운로드
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn2 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef2, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'etcqty2') {
				//박스수량 컬럼 편집 가능 여부
				if (event.item.boxflag === 'Y') {
					return true;
				} else {
					return false;
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			calculateColumnValue(event);

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// ref.gridRef.current.addCheckedRowsByValue('serialkey', event.item.serialkey);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}></GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.RESULT_TAB')} gridBtn={getGridBtn2()}></GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />

			{/* 엑셀 업로드 팝업 영역 정의 */}
			<CustomModal ref={modalExcelRef} width="1000px">
				<OmOrderCreationSTOForOutExcelPopup
					close={closeEventExcel}
					fromDccode={fromDccode}
					toDccode={toDccode}
					deliverydate={deliverydate}
					searchForm={props.searchForm}
				/>
			</CustomModal>
		</>
	);
});

export default OmOrderCreationSTOForOutDetail;
