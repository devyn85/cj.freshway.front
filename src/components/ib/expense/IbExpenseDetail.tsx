/*
 ############################################################################
 # FiledataField	: IbExpenseDetail.tsx
 # Description		: 비용기표
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import IbExpeneFileUploadMultiPopup from '@/components/ib/expense/IbExpeneFileUploadMultiPopup';
import IbExpeneFileUploadPopup from '@/components/ib/expense/IbExpeneFileUploadPopup';
import IbExpenseApprovalRequestPopup from '@/components/ib/expense/IbExpenseApprovalRequestPopup';
import IbExpenseDocumentInfoPopup from '@/components/ib/expense/IbExpenseDocumentInfoPopup';
import IbExpenseIfStatusPopup from '@/components/ib/expense/IbExpenseIfStatusPopup';

// API
import { apiPostSaveApprovalRequest } from '@/api/ib/apiIbExpense';

interface IbExpenseDetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	searchForm: any;
	dccode: any;
}

const IbExpenseDetail = forwardRef((props: IbExpenseDetailProps, ref: any) => {
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

	// 문서정보 팝업용 Ref
	const refDocumentModal = useRef(null);

	// ITEM 팝업용 Ref
	const refItemModal = useRef(null);

	// 파일 팝업용 Ref
	const refUploadfileModal = useRef(null);

	// 일괄 파일 팝업용 Ref
	const refUploadfileMultiModal = useRef(null);

	// IF Status 팝업용 Ref
	const refIfstatusModal = useRef(null);

	// 결재 팝업용 Ref
	const refApprovalModal = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// 선택한 행의 데이터 번호
	const [selectedSerialKey, setSelectedSerialKey] = useState<string | null>(null);

	// 선택한 행들의 데이터 번호
	const [selectedItems, setSelectedItems] = useState<[] | null>(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 내부결재 코드
	// const statusApprLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
	// 	return getCommonCodebyCd('STATUS_APPR', value)?.cdNm;
	// };

	// 내부결재 코드
	const statusApprLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('APPROVALSTATUS', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		// {
		// 	dataField: 'none',
		// 	headerText: t('lbl.DELETE'), //삭제
		// 	dataType: 'code',
		// 	editable: false,
		// 	renderer: {
		// 		type: 'ButtonRenderer',
		// 		labelText: t('lbl.DELETE'),
		// 		onClick: (event: any) => {
		// 			ref.gridRef.current.removeRow(event.rowIndex);
		// 		},
		// 	},
		// },
		{
			dataField: 'yyyymm',
			headerText: t('lbl.STOCKMONTH'), //재고월
			dataType: 'date',
			formatString: 'yyyy-mm',
			editable: false,
		},

		{
			dataField: 'organize',
			headerText: t('lbl.STORAGELOC'), //저장위치
			editable: false,
		},
		{
			dataField: 'organizeName',
			headerText: t('lbl.STORAGELOC_NM'), //저장위치명
			editable: false,
		},
		{
			dataField: 'fileCnt',
			headerText: t('lbl.FILE'), //파일
			dataType: 'numeric',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				labelText: t('lbl.FILE'),
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					openPopup(item, 'UPLOADFILE');
				},
			},
			// commRenderer: {
			// 	type: 'popup',
			// 	onClick: function (e: any) {
			// 		//파일 팝업
			// 		openPopup(e.item, 'UPLOADFILE');
			// 	},
			// },
		},
		{
			dataField: 'lovItem',
			headerText: t('lbl.ITEM'), //Item
			dataType: 'numeric',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				labelText: t('lbl.FILE'),
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					openPopup(item, 'ITEMINFO');
				},
			},
			// commRenderer: {
			// 	type: 'popup',
			// 	onClick: function (e: any) {
			// 		//Item 팝업
			// 		openPopup(e.item, 'ITEMINFO');
			// 	},
			// },
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'), //Status
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'transactionCd',
			headerText: t('lbl.TRANSACTION'), //Transaction
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'attributes2',
			headerText: t('lbl.COSTCATEGORY'), //비용종류
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'erpApprStatus',
			headerText: t('lbl.ERP_APPR'), //재무결재
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'internalApprStatus',
			headerText: t('lbl.INTERNAL_APPR'), //내부결재
			dataType: 'code',
			editable: false,
			labelFunction: statusApprLabelFunc,
		},
		{
			dataField: 'ifStatus',
			headerText: t('lbl.IF_STATUS'), //IF Status
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				labelText: t('lbl.FILE'),
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					openPopup(item, 'IF_STATUS');
				},
			},
			// commRenderer: {
			// 	type: 'popup',
			// 	onClick: function (e: any) {
			// 		//IF Status 팝업
			// 		openPopup(e.item, 'IF_STATUS');
			// 	},
			// },
		},
		{
			dataField: 'fiIfStatusName',
			headerText: t('lbl.POSTING STATUS'), //Posting Status
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				//return getCommonCodeList('STATUS_FI_IF')
				return getCommonCodeList('STATUS_EXPENSE_KX')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
		},
		{
			dataField: 'keyNo',
			headerText: t('lbl.DOCUMENT_NO'), //Document No
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				labelText: t('lbl.DOCUMENT_NO'),
				baseUrl: 'javascript',
				jsCallback: (rowIndex: any, columnIndex: any, value: any, item: any) => {
					openPopup(item, 'DOCUMENTINFO');
				},
			},
			// commRenderer: {
			// 	type: 'popup',
			// 	onClick: function (e: any) {
			// 		//문서정보 팝업
			// 		openPopup(e.item, 'DOCUMENTINFO');
			// 	},
			// },
		},
		{
			dataField: 'fiscalYear',
			headerText: t('lbl.FISCAL_YEAR'), //Fiscal Year
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'issueDate',
			headerText: t('lbl.ISSUEDATE'), //Document Date
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'taxYmd',
			headerText: t('lbl.TAX_DATE'), //증빙일
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'postingDate',
			headerText: t('lbl.POSTING_DATE'), //Posting Date
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'adjustmentSupplierCode',
			headerText: t('lbl.SUPPLIER_CODE'), //Supplier Code
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'adjustmentSupplierName',
			headerText: t('lbl.SUPPLIER_NAME'), //Supplier Name
			editable: false,
		},
		{
			dataField: 'poNo',
			headerText: t('lbl.PONO'), //P/O No
			editable: false,
			visilbe: false,
			visible: false,
		},
		{
			dataField: 'ifDocNo',
			headerText: t('lbl.IF_NO'), //I/F No
			editable: false,
		},
		{
			dataField: 'invNo',
			headerText: t('lbl.INV_NO'), //MM송장번호
			editable: false,
		},
		{
			dataField: 'slipNo',
			headerText: t('lbl.SLIPNO'), //Slip No
			editable: false,
		},
		{
			dataField: 'taxTag',
			headerText: t('lbl.TAX_INVOICE'), //Tax Invoice
			editable: false,
		},
		{
			dataField: 'taxNo',
			headerText: t('lbl.TAX_NO'), //Tax No
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'supplyPrice',
			headerText: t('lbl.SUPPLY_PRICE'), //Supply Price
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'taxAmount',
			headerText: t('lbl.TAX_AMOUNT'), //Tax Amount
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'amount',
			headerText: t('lbl.AMOUNT'), //Amount
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'accountDetail',
			headerText: t('lbl.ACCOUNT_DETAIL'), //Account Detail
			editable: false,
		},
		{
			dataField: 'actualSupplierCode',
			headerText: t('lbl.SUPPLIER_CODE_ACTUAL'), //Supplier Code(Actual)
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'actualSupplierName',
			headerText: t('lbl.SUPPLIER_NAME_ACTUAL'), //Supplier Name(Actual)
			editable: false,
			visible: false,
		},
		{
			dataField: 'summary',
			headerText: t('lbl.SUMMARY'), //Summary
			editable: false,
		},
		{
			dataField: 'taxTypeName',
			headerText: t('lbl.TAXCODE'), //세금코드
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'), //등록자
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), //등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:mm:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'), //수정자
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), //수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:mm:ss',
			editable: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'statusCode',
			visible: false,
		},
		{
			dataField: 'tplType',
			visible: false,
		},
		{
			dataField: 'fiIfStatus',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		isLegacyRemove: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'supplyPrice',
			positionField: 'supplyPrice',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'taxAmount',
			positionField: 'taxAmount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'amount',
			positionField: 'amount',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드에서 삭제 상태를 제외한 체크 항목 조회
	 * @returns {any[]} 삭제 상태를 제외한 체크된 항목들의 배열
	 */
	const getCheckedItmes = () => {
		// 전체 체크 항목
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
		// 삭제 체크된 항목
		const deleteItems = ref.gridRef.current.getRemovedItems();
		// deleteItems의 serialkey만 추출
		const removedSerialKeys = deleteItems.map((item: any) => item.serialkey);
		// checkedItems에서 deleteItems에 없는 데이터만 필터링
		const filteredItems = checkedItems.filter((item: any) => !removedSerialKeys.includes(item.serialkey));

		return filteredItems;
	};

	/**
	 * 팝업을 열어 문서 정보를 표시한다.
	 * @param {any} item 그리드 행
	 * @param {string} type 팝업 타입
	 */
	const openPopup = (item: any, type: string) => {
		setSelectedSerialKey(item.serialkey); // serialkey 저장
		if (type === 'DOCUMENTINFO') {
			// 문서 정보 팝업
			refDocumentModal.current?.handlerOpen();
		} else if (type === 'ITEMINFO') {
			// Item 정보 팝업
			refItemModal.current?.handlerOpen();
		} else if (type === 'UPLOADFILE') {
			// 업로드 파일 팝업
			refUploadfileModal.current?.handlerOpen();
		} else if (type === 'IF_STATUS') {
			// IF Status 팝업
			refIfstatusModal.current?.handlerOpen();
		}
	};

	/**
	 * 팝업 처리 후 콜백
	 */
	const callBackDocumentPopup = () => {
		closeEventDocumentPopup();
	};

	/**
	 * 문서정보 팝업 닫기
	 */
	const closeEventDocumentPopup = () => {
		refDocumentModal.current?.handlerClose();
	};

	/**
	 * 아이템정보 팝업 닫기
	 */
	const closeEventItemPopup = () => {
		refItemModal.current?.handlerClose();
	};

	/**
	 * IF Status 팝업 닫기
	 */
	const closeEventIfStatusPopup = () => {
		refIfstatusModal.current?.handlerClose();
	};

	/**
	 * 승인요청 팝업 콜백
	 */
	const callbackEventApprovalPopup = () => {
		refApprovalModal.current?.handlerClose();
		props.callBackFn();
	};

	/**
	 * 승인요청 팝업 닫기
	 */
	const closeEventApprovalPopup = () => {
		refApprovalModal.current?.handlerClose();
	};

	/**
	 * 파일 업로드 팝업 처리 후 콜백
	 * @param {any} param 파일 첨부 결과
	 * @param {number} fileCnt 첨부파일 갯수
	 */
	const callBackFileUploadPopup = (param: any, fileCnt: number) => {
		// 파일 컬럼에 첨부파일 갯수 업데이트
		const rowIndex = ref.gridRef.current.getSelectedIndex()[0];
		const updatedRow = ref.gridRef.current.getItemByRowIndex(rowIndex);
		updatedRow.fileCnt = fileCnt;

		// 해당 행에 값 업데이트
		ref.gridRef.current.updateRow(updatedRow, rowIndex);
	};

	/**
	 * 파일 업로드 팝업 닫기
	 */
	const closeEventFileUploadPopup = () => {
		refUploadfileModal.current.handlerClose();
	};

	/**
	 * 일괄 파일 업로드 팝업 처리 후 콜백
	 * @param {any} param 파일 첨부 결과
	 * @param {number} fileCnt 첨부파일 갯수
	 */
	const callBackFileUploadMultiPopup = (param: any, fileCnt: number) => {
		refUploadfileMultiModal.current?.handlerClose();
		props.callBackFn?.();
	};

	/**
	 * 일괄 파일 업로드 팝업 닫기
	 */
	const closeEventFileUploadMultiPopup = () => {
		refUploadfileMultiModal.current?.handlerClose();
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.success > 0) {
				props.callBackFn?.();
			}
		}
	};

	/**
	 * 그리드에서 선택한 데이터의 삭제를 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const deleteMasterList = () => {
		// 삭제 체크된 건만 삭제
		const checkedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_043'));
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/deleteMasterList',
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'EXPENSE_DELETE',
				fixdccode: props.dccode,
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 확정
	 */
	const confirmMasterList = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_022'), () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/saveConfirm',
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'EXPENSE_CONFIRM',
				fixdccode: props.dccode,
				saveDataList: filteredItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 확정취소
	 */
	const cancelConfirmMasterList = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of filteredItems) {
			// if (item.statusCode !== 'CFM') {
			// 	showMessage({
			// 		content: 'Confirm 항목만 처리 가능합니다.',
			// 		modalType: 'warning',
			// 	});
			// 	return;
			// } else if (['1', '2'].includes(item.internalApprStatus)) {
			// 	showMessage({
			// 		content: '결재가 진행중인 항목은 선택할 수 없습니다.',
			// 		modalType: 'warning',
			// 	});
			// 	return;
			// }

			if (['1', '2'].includes(item.internalApprStatus)) {
				showMessage({
					content: '결재가 진행중인 항목은 취소할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_016'), () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/saveConfirmCancel',
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'EXPENSE_CONFIRM_CANCEL',
				fixdccode: props.dccode,
				saveDataList: filteredItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 승인요청
	 */
	const approvalMasterList = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of filteredItems) {
			if (item.statusCode !== 'CFM') {
				showMessage({
					content: 'Confirm 항목만 결재처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			} else if (item.internalApprStatus === '3') {
				showMessage({
					content: '이미 결재가 완료된 항목은 선택할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			} else if (['1', '2'].includes(item.internalApprStatus)) {
				showMessage({
					content: '결재가 진행중인 항목은 선택할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		// 결재요청 팝업 실행
		// refApprovalModal.current.handlerOpen();

		// 결재요청
		const params = {
			avc_DCCODE: props.dccode,
			avc_COMMAND: 'REQUEST_TRANSACT',
			saveList: filteredItems,
		};

		// API 실행
		apiPostSaveApprovalRequest(params).then(res => {
			if (res.statusCode === 0) {
				// 저장 후 콜백 함수 호출
				const formId = 'SCM12';
				const returnmsg = res.statusMessage;
				const approvalReqDt = commUtil.gfnGetParameter('SELECT', returnmsg, 'APPROVALREQDT', '');
				const approvalReqNo = commUtil.gfnGetParameter('SELECT', returnmsg, 'APPROVALREQNO', '');
				const ssoId = commUtil.gfnGetParameter('SELECT', returnmsg, 'SSOID', '');
				const approvalParams = {
					formSerial: formId,
					systemID: 'SCM',
					DATA_KEY1: approvalReqDt,
					DATA_KEY2: approvalReqNo,
					OTU_ID: ssoId,
				};
				extUtil.openApproval(approvalParams);
			}
		});
	};

	/**
	 * Posting
	 */
	const postingMasterList = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of filteredItems) {
			if (item.internalApprStatus !== '3') {
				showMessage({
					content: '내부결재 완결된 항목만 Posting 처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			} else if (item.fiIfStatus === 'CNF') {
				showMessage({
					content: 'Posting 완료된 항목은 선택할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			} else if (item.tplType === '020') {
				showMessage({
					content: '위탁물류 항목은 선택할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		const msg = 'Posting 하시겠습니까?';
		showConfirm(null, msg, () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/savePosting',
				avc_DCCODE: props.dccode,
				fixdccode: props.dccode,
				saveDataList: filteredItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * Posting취소
	 */
	const cancelPostingMasterList = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of filteredItems) {
			if (item.internalApprStatus !== '3') {
				showMessage({
					content: '내부결재 완결된 항목만 Posting 처리 가능합니다.',
					modalType: 'warning',
				});
				return;
			} else if (item.tplType === '020') {
				showMessage({
					content: '위탁물류 항목은 선택할 수 없습니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		const msg = 'Posting 취소 하시겠습니까?';
		showConfirm(null, msg, () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/savePostingCancel',
				avc_DCCODE: props.dccode,
				fixdccode: props.dccode,
				saveDataList: filteredItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 일괄 파일 첨부
	 */
	const uploadMultiFiles = () => {
		const filteredItems = getCheckedItmes();

		if (filteredItems && filteredItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of filteredItems) {
			if (item.statusCode !== 'ENT') {
				showMessage({
					content: 'Entered 항목만 파일등록이 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		refUploadfileMultiModal.current.handlerOpen();
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
					btnType: 'delete', // 행삭제
					//	callBackFn: confirmMasterList,
				},
				{
					btnType: 'btn1', // 확정
					callBackFn: confirmMasterList,
				},
				{
					btnType: 'btn2', // 확정취소
					callBackFn: cancelConfirmMasterList,
				},
				{
					btnType: 'btn3', // 전자결재
					callBackFn: approvalMasterList,
				},
				{
					btnType: 'btn4', // Posting
					callBackFn: postingMasterList,
				},
				{
					btnType: 'btn5', // Posting취소
					callBackFn: cancelPostingMasterList,
				},
				{
					btnType: 'btn6', // 파일첨부
					callBackFn: uploadMultiFiles,
				},
				{
					btnType: 'save', // 삭제
					callBackFn: deleteMasterList,
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
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// ref.gridRef.current.addCheckedRowsByValue('serialkey', event.item.serialkey);
		});

		/**
		 * 그리드 셀 더블클릭6
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {});

		/**
		 * 그리드 체크박스 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowCheckClick', (event: any) => {
			// 전체 체크 항목
			const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
			// 삭제 체크된 항목
			const deleteItems = ref.gridRef.current.getRemovedItems();
			// deleteItems의 serialkey만 추출
			const removedSerialKeys = deleteItems.map((item: any) => item.serialkey);
			// checkedItems에서 deleteItems에 없는 데이터만 필터링
			const filteredItems = checkedItems.filter((item: any) => !removedSerialKeys.includes(item.serialkey));
			// serialkey 컬럼 값만 추출해서 리스트 생성
			const serialkeyList = filteredItems.map((item: any) => item.serialkey);
			setSelectedItems(serialkeyList);
		});

		/**
		 * 그리드 체크박스 전체 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowAllChkClick', (event: any) => {
			// 전체 체크 항목
			const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
			// 삭제 체크된 항목
			const deleteItems = ref.gridRef.current.getRemovedItems();
			// deleteItems의 serialkey만 추출
			const removedSerialKeys = deleteItems.map((item: any) => item.serialkey);
			// checkedItems에서 deleteItems에 없는 데이터만 필터링
			const filteredItems = checkedItems.filter((item: any) => !removedSerialKeys.includes(item.serialkey));
			// serialkey 컬럼 값만 추출해서 리스트 생성
			const serialkeyList = filteredItems.map((item: any) => item.serialkey);
			setSelectedItems(serialkeyList);
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

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />

			{/* 문서정보 팝업 영역 정의 */}
			<CustomModal ref={refDocumentModal} width="1200px">
				<IbExpenseDocumentInfoPopup
					callBack={callBackDocumentPopup}
					close={closeEventDocumentPopup}
					popupType={'DOCUMENTINFO'}
					serialkey={selectedSerialKey} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>

			{/* ITEM 팝업 영역 정의 */}
			<CustomModal ref={refItemModal} width="1000px">
				<IbExpenseDocumentInfoPopup
					callBack={callBackDocumentPopup}
					close={closeEventItemPopup}
					popupType={'ITEMINFO'}
					serialkey={selectedSerialKey} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>

			{/* 파일 팝업 영역 정의 */}
			<CustomModal ref={refUploadfileModal} width="1000px" draggable>
				<IbExpeneFileUploadPopup
					callBack={callBackFileUploadPopup}
					close={closeEventFileUploadPopup}
					serialkey={selectedSerialKey} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>

			{/* IF Status 팝업 영역 정의 */}
			<CustomModal ref={refIfstatusModal} width="1000px">
				<IbExpenseIfStatusPopup
					close={closeEventIfStatusPopup}
					serialkey={selectedSerialKey} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>

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

			{/* 결재 팝업 영역 정의 */}
			<CustomModal ref={refApprovalModal} width="1000px" draggable>
				<IbExpenseApprovalRequestPopup
					close={closeEventApprovalPopup}
					selectedItems={selectedItems} // 선택한 행들의 serialkey를 전달
					dccode={props.dccode}
					callBack={callbackEventApprovalPopup}
				/>
			</CustomModal>

			{/* 일괄 파일 팝업 영역 정의 */}
			<CustomModal ref={refUploadfileMultiModal} width="1000px" draggable>
				<IbExpeneFileUploadMultiPopup
					callBack={callBackFileUploadMultiPopup}
					close={closeEventFileUploadMultiPopup}
					selectedItems={selectedItems} // 선택한 행들의 serialkey를 전달
				/>
			</CustomModal>
		</>
	);
});

export default IbExpenseDetail;
