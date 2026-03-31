/*
 ############################################################################
 # FiledataField	: StAdjustmentTRBLExDCDetail.tsx
 # Description		: 외부비축BL내재고이관
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmElecApprovalPopup from '@/components/cm/popup/CmElecApprovalPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

// API
import { apiPostSaveMasterList } from '@/api/st/apiStAdjustmentTRBLExDC';

interface StAdjustmentTRBLExDCDetailProps {
	dccode: any;
	gridData: any;
	totalCount: any;
	callBackFn: any;
}

const StAdjustmentTRBLExDCDetail = forwardRef((props: StAdjustmentTRBLExDCDetailProps, ref: any) => {
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

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 전자결재 팝업용 Ref
	const refElecApprovalModal = useRef(null);

	const [approvaltype, setApprovaltype] = useState();
	const [approvalReqDt, setApprovalReqDt] = useState();
	const [approvalReqNo, setApprovalReqNo] = useState();
	const [ssoId, setSsoId] = useState();
	const [COM_DEV_APPROVAL_URL] = useState('https://ep2.ifresh.co.kr/Approval/Service');
	const [COM_STG_APPROVAL_URL] = useState('https://epqa2.ifresh.co.kr/Approval/Service');
	const [COM_PRD_APPROVAL_URL] = useState('https://www.ifresh.co.kr/Approval/Service');

	const getREASONCODEAJList = () => {
		return getCommonCodeList('REASONCODE_AJ').filter((v: any) => v.comCd === 'TRBL-EXDC');
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stocktypenm',
			headerText: t('lbl.TO_STOCKTYPE'), //재고위치
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'), //로케이션
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
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
			],
		},
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
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY_ST'), //가용재고수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
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
			dataField: 'tranqty',
			headerText: t('lbl.ADJUSTQTY'), //조정수량
			dataType: 'numeric',
			editable: true,
			required: true,
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE_AJ'), //발생사유
			dataType: 'numeric',
			editable: true,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getREASONCODEAJList(),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.BOXCALINFO'), //박스환산정보
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
					headerText: t('lbl.REALORDERBOX'), //실박스예정
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'realcfmbox',
					headerText: t('lbl.REALCFMBOX'), //실박스확정
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'tranbox',
					headerText: t('lbl.TRANBOXQTY'), //작업박스수량
					dataType: 'numeric',
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: true,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.COSTCENTER'), //귀속부서
			children: [
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'), //귀속부서
					dataType: 'code',
					editable: true,
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								costcd: 'code',
								costcdname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: costcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									costcd: 'code',
									costcdname: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), //귀속부서명
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CUST'), //거래처
			children: [
				{
					dataField: 'custkey',
					headerText: t('lbl.CUST_CODE'), //거래처
					dataType: 'code',
					editable: true,
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								custkey: 'code',
								custname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									custkey: 'code',
									custname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
				},
				{
					dataField: 'custname',
					headerText: t('lbl.CUST_NAME'), //거래처명
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			dataField: 'usebydateFreeRt',
			headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여(%)
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
			dataType: 'code',
			editable: false,
			abelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
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
			headerText: t('lbl.CUST'), //상품이력정보
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
					formatString: 'YYYY-MM-DD',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
					dataType: 'code',
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
					dataType: 'string',
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'YYYY-MM-DD',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'YYYY-MM-DD',
					editable: false,
				},
			],
		},
		{
			dataField: 'pokey',
			headerText: t('lbl.PONO'), //PO번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poline',
			headerText: t('lbl.POLINE'), //PO라인
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'realYnNm',
			headerText: t('lbl.REAL_YN'), //가/진오더여부
			dataType: 'code',
			editable: false,
		},
		//
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'realYn',
			visible: false,
		},
		{
			dataField: 'boxflag',
			visible: false,
		},
		{
			dataField: 'seriallevel',
			headerText: t('lbl.	"SERIALLEVEL'), //등급
			visible: false,
		},
		{
			dataField: 'serialtype',
			headerText: t('lbl.	"SERIALTYPE'), //규격
			visible: false,
		},
		{
			dataField: 'colordescr',
			visible: false,
		},
		{
			dataField: 'placeoforigin',
			headerText: t('lbl.	"ORDEPLACEOFORIGINRTYPE'), //원산지
			visible: false,
		},
		{
			dataField: 'ordertype',
			headerText: t('lbl.	"ORDERTYPE'), //주문유형
			visible: false,
		},
		{
			dataField: 'duration',
			headerText: t('lbl.DURATION'), //유통기간
			visible: false,
		},
		{
			dataField: 'durationtype',
			headerText: t('lbl.DURATIONTYPE'), //유통기한관리방법
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
			dataField: 'stockid',
			visible: false,
		},
		{
			dataField: 'stockgrade',
			visible: false,
		},
		{
			dataField: 'stocktype',
			visible: false,
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), //유통기한임박여부
			dataType: 'code',
			visible: false,
		},
		{
			dataField: 'imputetype',
			headerText: t('lbl.OTHER01_DMD_AJ'), //귀책
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('OTHER01_DMD', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			visible: false,
		},
		{
			dataField: 'processmain',
			headerText: t('lbl.OTHER05_DMD_AJ'), //물류귀책배부
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			visible: false,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'), //피킹존
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
		bodyHeight: 'fitToParent',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택한 행에 귀속부서와 거래처를 일괄 적용한다
	 */
	const onClickApplySelect = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const costcd = form.getFieldValue('costcd') ? form.getFieldValue('costcd') : '';
		const costName = form.getFieldValue('costName') ? form.getFieldValue('costName') : '';
		const custkey = form.getFieldValue('custkey') ? form.getFieldValue('custkey') : '';
		const custName = form.getFieldValue('custName') ? form.getFieldValue('custName') : '';

		for (const item of checkedItems) {
			ref.gridRef.current.setCellValue(item.rowIndex, 'costcd', costcd);
			ref.gridRef.current.setCellValue(item.rowIndex, 'costcdname', costName);
			ref.gridRef.current.setCellValue(item.rowIndex, 'custkey', custkey);
			ref.gridRef.current.setCellValue(item.rowIndex, 'custname', custName);
		}
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'tranqty') {
			if (commUtil.isEmpty(event.value) || event.value === 0) {
				ref.gridRef.current.setCellValue(rowIndex, 'tranqty', 0);
				ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
			}
		}

		if (event.dataField === 'tranbox') {
			if (commUtil.isEmpty(event.value)) {
				ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
			}
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 그리드 행
	 * @param {any} info 저장할 사유 정보
	 */
	const saveMasterList = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 그리드 validation 체크
		if (!ref.gridRef?.current.validateRequiredGridData()) {
			return;
		}

		let sumQty = 0;

		// 그리드 입력 값 검증
		for (const item of updatedItems) {
			const realYn = item.realYn;
			const openqty = item.openqty;
			const tranqty = item.tranqty;
			const uom = item.uom;
			const realorderbox = item.realorderbox;
			const realcfmbox = item.realcfmbox;
			const tranbox = item.tranbox;
			const costcd = item.costcd;
			const custkey = item.custkey;

			if (realYn === 'T') {
				showMessage({
					content: '가오더 건은 저장이 불가합니다.',
					modalType: 'warning',
				});
				return;
			}

			if (commUtil.isEmpty(costcd)) {
				showMessage({
					content: '귀속부서 항목은 필수 입력입니다.',
					modalType: 'warning',
				});
				return;
			}

			if (commUtil.isEmpty(custkey)) {
				showMessage({
					content: '거래처 항목은 필수 입력입니다.',
					modalType: 'warning',
				});
				return;
			}

			// 감모는 가용재고 보다 많아야지만 처리가 가능하기 때문 미리 체크한다.
			if (openqty + tranqty < 0) {
				const msg = '처리해야 하는 수량보다 가용재고가 ' + String(Math.abs(openqty + tranqty)) + uom + ' 모자랍니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (realorderbox + tranbox < 0) {
				const msg =
					'처리해야 하는 박스수량보다 재고박스 수량이 ' + String(Math.abs(realorderbox + tranbox)) + 'BOX 모자랍니다..';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (realcfmbox + tranbox < 0) {
				const msg = '현재고량을 초과하는 박스 수량을 입력하였습니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (tranqty * tranbox < 0) {
				const msg = '조정수량과 작업박스 수량의 부호가 다릅니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			sumQty += tranqty;
		}

		if (sumQty !== 0) {
			showMessage({
				content: '처리수량의 합이 0 이어야 합니다.',
				modalType: 'warning',
			});
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			const params = {
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'CONFIRM_EXDCTRBL',
				fixdccode: props.dccode,
				docdt: form.getFieldValue('taskdtAj').format('YYYYMMDD'),
				saveList: updatedItems,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					props.callBackFn?.();
				}
			});
		});
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
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const getTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1', // 사용자 정의버튼1
				},
			],
		};

		return tableBtn;
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
			//ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			calculateColumnValue(event);
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

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('selectionChange', (event: any) => {});

		/**
		 * 그리드 스크롤
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('vScrollChange', (event: any) => {});
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
	 * 화면 초기화
	 */
	useEffect(() => {
		form.setFieldsValue({
			taskdtAj: dayjs(),
		});
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

			//setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 입력 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Form form={form} layout="inline" className="sect">
						<DatePicker
							name="taskdtAj"
							span={6}
							label={t('lbl.TASKDT_AJ')}
							allowClear
							showNow={false}
							required
							className="bg-white"
						/>
						<CmCostCenterSearch
							form={form}
							name="costName"
							code="costcd"
							selectionMode="singleRow"
							returnValueFormat="name"
							className="bg-white"
						/>
						<CmCustSearch
							form={form}
							name="custName"
							code="custkey"
							selectionMode="singleRow"
							returnValueFormat="name"
							label={t('lbl.CUST')}
							className="bg-white"
						/>
						<Button size={'small'} onClick={onClickApplySelect}>
							{t('lbl.APPLY_SELECT')}
						</Button>
					</Form>
				</GridTopBtn>

				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />

			{/* 전자결재 팝업 영역 정의 */}
			<CmElecApprovalPopup ref={refElecApprovalModal} />
		</>
	);
});

export default StAdjustmentTRBLExDCDetail;
