/*
 ############################################################################
 # FiledataField	: DpReceiptExDCDetail.tsx
 # Description		: 외부비축입고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';
import extUtil from '@/util/extUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import KpKxCloseDocPopup from '@/components/kp/kxClose/KpKxCloseDocPopup';

// API
import { apiGetStatus } from '@/api/cm/apiCmCheckSAPClose';
import { apiPostConfirmMasterList, apiPostDetailList, apiPostRejectMasterList } from '@/api/dp/apiDpReceiptExDC';
//import { apiPostConfirmMasterList, apiPostRejectMasterList } from '@/api/st/apiStConvertCFM';
import { apiPostAuthority } from '@/api/st/apiStExDCStorage';

//import DpReceiptExDCDetailConfirm from '@/components/dp/receiptExDC/DpReceiptExDCDetailConfirm';
//import DpReceiptExDcDetailShortage from '@/components/dp/receiptExDC/DpReceiptExDcDetailShortage';

interface DpReceiptExDCDetailProps {
	gridData: any;
	totalCount: any;
	searchForm: any;
	callBackFn: any;
	dccode: any;
}

const DpReceiptExDCDetail = forwardRef((props: DpReceiptExDCDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const refDocumentModal = useRef(null);

	const user = useAppSelector(state => state.user.userInfo);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	// 그리드 데이터
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// 탭 번호
	const [currentTabItem, setCurrentTabItem] = useState('1');

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// 권한 정보
	const authorityRef = useRef<any>(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 진행상태 컬럼 표시
	const exdcAutoStatusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_AUTO_STATUS', value)?.cdNm;
	};

	// 구매유형 컬럼 표시
	const exdcOrderTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_ORDERTYPE', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'mapkeyNo',
			headerText: t('lbl.POREQNO'), //구매요청번호
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'sokeyYn',
			headerText: '진오더생성여부', //진오더생성여부
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.SLIPINFO'), //전표정보
			children: [
				{
					dataField: 'slipno',
					headerText: t('lbl.SLIPNO_DP'), //입고전표번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'slipdt',
					headerText: t('lbl.SLIPDT_DP'), //입고전표일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.DOCINFO'), //문서정보
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.PONO'), //구매번호
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							setSelectedRow(e.item); // 선택한 row를 state로 저장
							refDocumentModal.current?.handlerOpen();
						},
					},
				},
				{
					dataField: 'ordertypename',
					headerText: t('lbl.POTYPE'), //구매유형
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TODCINFO'), //공급센터정보
			children: [
				{
					dataField: 'organize',
					headerText: t('lbl.ORGANIZE'), //창고
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'organizename',
					headerText: t('lbl.ORGANIZENAME'), //창고명
					editable: false,
				},
			],
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'), //협력사코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'), //협력사명
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_DP'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.CONFIRMWHO'), //확정자
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'lastwhoNm',
			headerText: t('lbl.SERIALCONFIRMWHO'), //이력정보확정자
			dataType: 'manager',
			managerDataField: 'lastwho',
			editable: false,
		},
		{
			dataField: 'realYnNm',
			headerText: t('lbl.REAL_YN'), //가진오더여부
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'exdcrateYn',
			headerText: t('lbl.EXDCRATE_YN'), //요율등록여부
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'), //저장유무
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPEROUTBOX'), //박스입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //구매단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.POQTY'), //구매수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_DP'), //입고수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'), //결품수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.QCCONFIRMQTY_DP'), //입고처리량
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
		{
			dataField: 'shortagetranqty',
			headerText: t('lbl.SHORTAGETRANQTY_DP'), //결품처리량
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
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE_DP'), //결품사유
			editable: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REASONCODE_DP', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.RESULT_TAB'), //처리결과
			editable: true,
			width: 250,
		},
		{
			dataField: 'reasoncodeReject',
			headerText: '반려사유',
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REJECT_REASON_WD', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: true,
		},

		{
			headerText: t('lbl.CALSTOCK'), //박스환산정보
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.00',
				},
				{
					dataField: 'realorderbox',
					headerText: t('lbl.REALOPENBOX'), //실박스예정
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
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: any,
					) => {
						if (item?.boxflag === 'Y') {
							return 'isEdit';
						}
						ref.gridRef.current.removeEditClass(columnIndex);
					},
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), //기준일(소비,제조)
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
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
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN2'), //소비기한임박여부
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
					dataField: 'contracttypename',
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
			],
		},
		{
			headerText: t('lbl.PO_TAB'), //구매현황
			children: [
				{
					dataField: 'exdcOrdertype',
					headerText: t('lbl.POTYPE'), //구매유형
					labelFunction: exdcOrderTypeLabelFunc,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'moveYn',
					headerText: t('lbl.MOVEYN'), //이체여부
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'tempYn',
					headerText: t('lbl.TEMPWEIGHTSTATUS'), //가중량여부
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.ATTACHFILE'), //첨부파일
			children: [
				{
					dataField: 'refDocid',
					headerText: t('lbl.INTERNAL_USE'), //내부용
					dataType: 'code',
					editable: false,
					renderer: {
						type: 'LinkRenderer',
						labelText: t('lbl.ATCHFILE'),
						baseUrl: 'javascript',
						jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: item.refDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
				{
					dataField: 'refCustDocid',
					headerText: t('lbl.EXERNAL_USE'), //외부용
					dataType: 'code',
					editable: false,
					width: 100,
					renderer: {
						type: 'LinkRenderer',
						labelText: t('lbl.ATCHFILE'),
						baseUrl: 'javascript',
						jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: item.refCustDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
				{
					dataField: 'addDocid',
					headerText: t('lbl.ADDDOC_OTHER'), //추가서류 외
					dataType: 'code',
					editable: false,
					renderer: {
						type: 'LinkRenderer',
						labelText: t('lbl.ATCHFILE'),
						baseUrl: 'javascript',
						jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: item.addDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
			],
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'storerkey',
			visible: false,
		},
		{
			dataField: 'doctype',
			visible: false,
		},
		{
			dataField: 'potype',
			visible: false,
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			dataField: 'docdt',
			dataType: 'date',
			visible: false,
		},
		{
			dataField: 'serialorderqty',
			visible: false,
		},
		{
			dataField: 'serialinspectqty',
			visible: false,
		},
		{
			dataField: 'channel',
			visible: false,
		},
		{
			dataField: 'reference02',
			visible: false,
		},
		{
			dataField: 'stockid',
			visible: false,
		},
		{
			dataField: 'realYn',
			visible: false,
		},
		{
			dataField: 'dptype',
			visible: false,
		},
		{
			dataField: 'durationtype',
			visible: false,
		},
		{
			dataField: 'duration',
			visible: false,
		},
		{
			dataField: 'boxflag',
			visible: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'lastwho',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		// selectionMode: 'singleCell',
		showFooter: true,
		rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
			if (item.status === 'BB' || item.status === 'CC') {
				//로컬구매이력의 확정이나 반려 건은 체크할 수 없음
				return false;
			} else {
				if (!authorityRef.current) {
					searchAuthority();
				}
				if (authorityRef.current) {
					const res = authorityRef.current.filter((v: any) => v.authCd === 'WAYLO_000');
					if (res && res.length > 0) {
						return true;
					}
				}

				const checked = item.realYn !== 'T';
				return checked;
			}
		},
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.shortageqty > 0 && item.orderqty === item.shortageqty) {
				// 전체 결품처리가 있으면 색상 표시함
				return 'color-danger';
			}
			return '';
		},
	};

	// 그리드 푸터 레이아웃
	const footerLayout = [
		{
			//실박스예정
			dataField: 'realorderbox',
			positionField: 'realorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			//실박스확정
			dataField: 'realcfmbox',
			positionField: 'realcfmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			//작업박스수량
			dataField: 'tranbox',
			positionField: 'tranbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 수량적용 - 선택한 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} evnt 이벤트
	 * @param event
	 */
	const onClickApplyCalculate = (event: any) => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		for (const item of checkedItems) {
			if (item.item.dccode == '2800' || item.item.dccode === '1000') {
				ref.gridRef.current?.setCellValue(item.rowIndex, 'tranqty', item.item.orderqty - item.item.confirmqty);
			} else if (item.item.channel === '1' || item.item.storerkey === 'FW00') {
				ref.gridRef.current?.setCellValue(
					item.rowIndex,
					'tranqty',
					item.item.serialorderqty - item.item.serialinspectqty,
				);
			} else {
				ref.gridRef.current?.setCellValue(item.rowIndex, 'tranqty', item.item.orderqty - item.item.confirmqty);
			}
		}
	};

	/**
	 * 선택한 행에 입력사항을 일괄 적용한다
	 */
	const onClickApplySelect = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const reasoncode = form.getFieldValue('reasoncode') ? form.getFieldValue('reasoncode') : '';
		const reasonmsg = form.getFieldValue('reasonmsg') ? form.getFieldValue('reasonmsg') : '';
		// const shortagetranqty = form.getFieldValue('shortagetranqty') ? form.getFieldValue('shortagetranqty') : '';
		const reasoncodeReject = form.getFieldValue('reasoncodeReject') ? form.getFieldValue('reasoncodeReject') : '';

		for (const item of checkedItems) {
			ref.gridRef.current?.setCellValue(item.rowIndex, 'reasonmsg', reasonmsg);
			//ref.gridRef.current?.setCellValue(item.rowIndex, 'shortagetranqty', shortagetranqty);
			// ref.gridRef.current?.setCellValue(item.rowIndex, 'tranqty', shortagetranqty);
			ref.gridRef.current?.setCellValue(item.rowIndex, 'reasoncode', reasoncode);
			ref.gridRef.current?.setCellValue(item.rowIndex, 'reasoncodeReject', reasoncodeReject);
		}
	};

	/**
	 * 그리드 전체 체크 해제한다
	 */
	const onClickApplyUncheck = () => {
		ref.gridRef.current.setAllCheckedRows(false);
	};

	/**
	 * 상세 목록을 조회한다.
	 * @param {any} tabItem 확정/반려 탭 순번
	 */
	const searchDetailList = async (tabItem: any) => {
		const rows = ref.gridRef.current?.getSelectedItems(true);
		const item = rows[0]?.item;

		if (item) {
			// 조회 조건 설정
			const params = {
				mapDiv: props.searchForm.getFieldValue('mapDiv'),
				mapkeyNo: item.mapkeyNo,
				pokey: item.pokey,
				cfmType: currentTabItem === '1' ? 'C' : 'R',
			};

			if (tabItem === '1') {
				const res = await apiPostDetailList(params);
				setGridData2(res.data);
			} else {
				const res = await apiPostDetailList(params);
				setGridData3(res.data);
			}
		}
	};

	/**
	 * SAP 마감여부 조회
	 * @param {any[]} checkedItems
	 * @returns
	 */
	const getSapCloseStatus = async (checkedItems: any[]) => {
		for (const item of checkedItems) {
			if (item.tranqty < 0 || item.shortagetranqty < 0) {
				const params = {
					docno: item.docno,
					docline: item.docline,
					deliverydate: item.slipdt,
				};
				const res = await apiGetStatus(params);
				if (res.data.result !== 'Y') {
					// showMessage({
					// 	content: res.data.errorMsg,
					// 	modalType: 'error',
					// });
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * 저장을 진행합니다.
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		let isVaidate = true;

		//입고처리와 결품처리를 모두 입력했는지 체크
		for (const item of checkedItems) {
			if (item.tranqty === 0 && item.shortagetranqty === 0) {
				isVaidate = false;
				showMessage({
					content: '입고처리량이나 결품처리량을 입력하세요.',
					modalType: 'warning',
				});

				return;
			}
		}

		if (!isVaidate) {
			return;
		}

		//로컬구매 이력정보는 확정 대상 제외 체크
		for (const item of checkedItems) {
			if (item.dptype === 'LOCAL') {
				isVaidate = false;
				showMessage({
					content: '로컬구매 이력정보는 확정대상이 아닙니다.',
					modalType: 'warning',
				});

				return;
			}
		}

		if (!isVaidate) {
			return;
		}

		//결품처리량이 0이 아니면 사유코드 입력 체크
		for (const item of checkedItems) {
			if (item.shortagetranqty !== 0 && commUtil.isEmpty(item.reasoncode)) {
				isVaidate = false;
				showMessage({
					content: '결품사유코드를 입력하시기 바랍니다.',
					modalType: 'warning',
				});

				return;
			}
		}

		if (!isVaidate) {
			return;
		}

		// SAP 마감여부 체크
		const sapCheck = await getSapCloseStatus(checkedItems);
		if (!sapCheck) return;

		showConfirm(null, '확정처리하시겠습니까?', async () => {
			// 입고,결품처리 실행
			saveExecute('D', 'C');
		});
	};

	/**
	 * 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 * @param {any} divType 'H' 헤더그리드 저장, 'D' 상세그리드 저장
	 * @param {any} cfmType 'C' 확정, 'S' 결품
	 */
	const saveExecute = (divType: any, cfmType: any) => {
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		// if (!ref.gridRef.current.validateRequiredGridData()) return;

		// for (const item of checkedItems) {
		// 	if (item.tranqty === 0) {
		// 		showMessage({
		// 			content: '처리수량은(는) 필수값입니다.',
		// 			modalType: 'warning',
		// 		});
		// 		return;
		// 	}
		// }

		loopTransaction(checkedItems, 0, checkedItems.length, divType, cfmType);
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 확정을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const confirmMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		let isVaidate = true;

		//이력상품 수량 체크 - 부산물류센터는 이력상품이 아니므로 패스한다.
		for (const item of checkedItems) {
			if (item.dccode == '2800') {
				isVaidate = false;
				showMessage({
					content: '부산물류센터는 이력상품이 아니므로 확정대상이 아닙니다.',
					modalType: 'warning',
				});

				break;
			}

			if (item.dptype === 'LOCAL') {
				isVaidate = false;
				showMessage({
					content: '로컬구매 이력정보는 확정대상이 아닙니다.',
					modalType: 'warning',
				});

				break;
			}
		}

		if (!isVaidate) {
			return;
		}

		// SAP 마감여부 체크
		const sapCheck = await getSapCloseStatus(checkedItems);
		if (!sapCheck) return;

		showConfirm(null, '입고처리하시겠습니까?', async () => {
			// 입고처리 실행
			saveMasterList('D', 'C');
		});
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 결품을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const shortageMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		let isVaidate = true;

		//사유코드 입력 체크
		for (const item of checkedItems) {
			if (commUtil.isEmpty(item.reasoncode)) {
				isVaidate = false;
				showMessage({
					content: '사유코드를 입력하시기 바랍니다.',
					modalType: 'warning',
				});

				break;
			}

			if (item.dptype === 'LOCAL') {
				isVaidate = false;
				showMessage({
					content: '로컬구매 이력정보는 확정대상이 아닙니다.',
					modalType: 'warning',
				});

				break;
			}
		}

		if (!isVaidate) {
			return;
		}

		// SAP 마감여부 체크
		const sapCheck = await getSapCloseStatus(checkedItems);
		if (!sapCheck) return;

		showConfirm(null, '결품처리하시겠습니까?', async () => {
			// 결품 실행
			saveMasterList('D', 'S');
		});
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 * @param {any} divType 'H' 헤더그리드 저장, 'D' 상세그리드 저장
	 * @param {any} cfmType 'C' 확정, 'S' 결품
	 */
	const loopTransaction = (rowItems: any, index: number, total: number, divType: any, cfmType: any) => {
		// loop transaction
		const saveParams = {
			apiUrl: '/api/dp/receiptexdc/v1.0/saveMasterList',
			//avc_DCCODE: props.dccode,
			avc_DCCODE: rowItems[0].dccode,
			avc_COMMAND: 'CONFIRM',
			//fixdccode: props.dccode,
			fixdccode: rowItems[0].dccode,
			divType: divType,
			cfmType: cfmType,
			saveDataList: rowItems,
		};

		setLoopTrParams(saveParams);
		refTranModal.current.handlerOpen();
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.total === trProcessCnt.success) {
				props.callBackFn?.();
			}
		}
	};

	/**
	 * 문서정보 팝업 닫기
	 */
	const closeDocPopup = () => {
		refDocumentModal.current.handlerClose();
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 확정(로컬이력)을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const confirmMasterLocalList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const gridItems = ref.gridRef.current?.getGridData();
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();
		const uncheckedItems = gridItems.filter(
			(item: any) => !checkedItems.some((chk: any) => chk.slipno === item.slipno && chk.slipline === item.slipline),
		);

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 로컬구매 정보만 이력정보 확정하도록
		for (const item of checkedItems) {
			if (item.dptype === 'LOCAL') {
				if (item.exdcrateYn !== 'Y') {
					const msg = '요율등록이 필요합니다.';
					showAlert(null, msg);
					return;
				} else if (item.status === 'BB') {
					const msg = '확정한 로컬구매 이력정보를 중복해서 확정할 수 없습니다.';
					showAlert(null, msg);
					return;
				}
			} else {
				showAlert(null, '로컬구매 이력정보만 확정할 수 있습니다.');
				return;
			}
		}

		// 같은 PO정보끼리는 같이 확정하도록
		for (const item of uncheckedItems) {
			if (item.dptype === 'LOCAL') {
				const duplePO = checkedItems.filter((v: any) => v.slipno === item.slipno && v.slipline === item.slipline);
				if (duplePO && duplePO.length > 0) {
					//const msg = '이력정보 확정은 PO/PO항번 단위로 가능합니다.';
					const msg = '동일한 PO는 함께 확정해야 합니다.';
					showAlert(null, msg);
					return;
				}
			}
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				mapDiv: '10',
				cfmType: 'C',
				saveList: checkedItems,
			};

			apiPostConfirmMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
				}
			});
		});
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 반려(로컬이력)를 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const rejectMasterLocalList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const gridItems = ref.gridRef.current?.getGridData();
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();
		const uncheckedItems = gridItems.filter(
			(item: any) => !checkedItems.some((chk: any) => chk.slipno === item.slipno && chk.slipline === item.slipline),
		);

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 로컬구매 정보만 이력정보 반려하도록
		for (const item of checkedItems) {
			if (item.dptype === 'LOCAL') {
				if (item.exdcrateYn !== 'Y') {
					const msg = '요율등록이 필요합니다.';
					showAlert(null, msg);
					return;
				}
			} else {
				showAlert(null, '로컬구매 이력정보만 반려할 수 있습니다.');
				return;
			}

			if (commUtil.isEmpty(item.reasoncodeReject)) {
				showAlert(null, '반려사유를 입력하시기 바랍니다.');
				return;
			}
		}

		// 같은 PO정보끼리는 같이 반려하도록
		for (const item of uncheckedItems) {
			if (item.dptype === 'LOCAL') {
				const duplePO = checkedItems.filter((v: any) => v.slipno === item.slipno && v.slipline === item.slipline);
				if (duplePO && duplePO.length > 0) {
					//const msg = '이력정보 확정은 PO/PO항번 단위로 가능합니다.';
					const msg = '동일한 PO는 함께 반려해야 합니다.';
					showAlert(null, msg);
					return;
				}
			}
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				mapDiv: '10',
				cfmType: 'R',
				saveList: checkedItems,
			};

			apiPostRejectMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
				}
			});
		});
	};

	/**
	 * 탭 변경 이벤트
	 * @param {string} key
	 */
	const onChangeTab = (key: string) => {
		setCurrentTabItem(key);

		// if (key === '1') {
		// 	ref.gridRef2?.current?.resize();
		// } else if (key === '2') {
		// 	ref.gridRef3?.current?.resize();
		// }

		// searchDetailList(key);
	};

	/**
	 * 권한 조회
	 */
	const searchAuthority = async () => {
		// API 호출
		const params = {};
		const res = await apiPostAuthority(params);
		authorityRef.current = res.data;
		return res.data;
	};

	/**
	 * 그리드 버튼 함수 설정. 마스터 그리드.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1', // 저장
					callBackFn: saveMasterList,
				},
				// {
				// 	btnType: 'btn1', // 입고처리
				// 	callBackFn: confirmMasterList,
				// },
				// {
				// 	btnType: 'btn2', // 결품처리
				// 	callBackFn: shortageMasterList,
				// },
				{
					btnType: 'btn3', // 확정
					callBackFn: confirmMasterLocalList,
				},
				{
					btnType: 'btn4', // 반려
					callBackFn: rejectMasterLocalList,
				},
			],
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
		ref.gridRef.current.bind('selectionChange', (event: any) => {
			// const primeCell = event.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			// searchDetailList(currentTabItem);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'tranqty' || event.dataField === 'shortagetranqty' || event.dataField === 'reasonmsg') {
				// 처리작업량  (입고/결품), 처리결과 컬럼 편집 가능 여부
				if (event.item.realYn === 'T') {
					return false;
				}
			} else if (event.dataField === 'tranbox') {
				// 작업박스수량 컬럼 편집 가능 여부
				if (event.item.boxflag !== 'Y') {
					return false;
				}
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
		//initEvent();
	});

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		// 그리드 이벤트 바인딩
		initEvent();
		// 기본값 설정
		form.setFieldsValue({
			taskdtAj: dayjs(),
		});
		// 권한 조회
		searchAuthority();
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

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Form layout="inline" form={form}>
						<SelectBox //결품사유
							name="reasoncode"
							label={t('lbl.REASONCODE_DP')}
							placeholder={t('msg.selectBox')}
							options={getCommonCodeList('REASONCODE_DP', t('lbl.SELECT'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							showSearch
							allowClear
							style={{ width: '200px' }}
							className="bg-white"
						/>
						{/*
						<InputNumber //결품수량
							name="shortagetranqty"
							label={t('lbl.SHORTAGEQTY')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SHORTAGEQTY')])}
							showSearch
							allowClear
							className="bg-white"
						/>
						*/}
						<InputText //처리결과
							name="reasonmsg"
							label={t('lbl.RESULTMSG')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.RESULTMSG')])}
							maxLength={100}
							showSearch
							allowClear
							className="bg-white"
						/>
						<li>
							<SelectBox
								name="reasoncodeReject"
								label="반려사유"
								placeholder={t('msg.selectBox')}
								options={getCommonCodeList('REJECT_REASON_WD', '')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								showSearch
								allowClear
								className="bg-white"
							/>
						</li>
					</Form>

					<Button size={'small'} onClick={onClickApplySelect}>
						{t('lbl.APPLY_SELECT')}
					</Button>
					<Button size={'small'} onClick={onClickApplyCalculate}>
						{'입고수량적용'}
					</Button>
					<Button size={'small'} onClick={onClickApplyUncheck}>
						{'체크해제'}
					</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/*
				<Tabs defaultActiveKey="1" onChange={onChangeTab} items={getTabItems()}></Tabs>
				*/}

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />

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

			{/* 문서정보 팝업 영역 정의 */}
			<CustomModal ref={refDocumentModal} width="1200px">
				<KpKxCloseDocPopup
					ref={ref.gridRef1}
					rowData={selectedRow} // rowData로 전달
					serialkey={'1'} // 선택한 행의 serialkey를 전달
					close={closeDocPopup}
				/>
			</CustomModal>
		</>
	);
});

export default DpReceiptExDCDetail;
