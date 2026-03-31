/*
 ############################################################################
 # FiledataField	: WdSendOutOrderDetail.tsx
 # Description		: 외부비축출고지시서
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.19
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostPrintMastrerList } from '@/api/wd/apiWdSendOutOrder';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import WdSendOutOrderSendFaxPopup from '@/components/wd/sendOutOrder/WdSendOutOrderSendFaxPopup';
import WdSendOutOrderSendMailPopup from '@/components/wd/sendOutOrder/WdSendOutOrderSendMailPopup';

interface WdSendOutOrderDetailProps {
	dccode: any;
	searchForm: any;
	gridData: any;
	totalCount: any;
	search: any;
	emailAddr: any;
}

const WdSendOutOrderDetail = forwardRef((props: WdSendOutOrderDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// 팩스 팝업용 Ref
	const refFaxModal = useRef(null);

	// 이메일 팝업용 Ref
	const refMailModal = useRef(null);

	// 발송 정보
	const [sendInfo, setSenInfo] = useState<any>();

	// 발송 대상 리스트
	const [sendData, setSendData] = useState<any>();

	// 리포트 파일명
	const [rptFileName, setRptFileName] = useState('');

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	//유저 정보
	const user = useAppSelector(state => state.user.userInfo);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'mapkeyNo',
			headerText: t('lbl.MAPKEY_NO'), //승인번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'normalNo',
			headerText: t('lbl.NORMAL_ORDER'), //정상오더
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataType: 'code',
			editable: false,
		},

		{
			headerText: t('lbl.SLIPINFO'), //전표정보
			children: [
				{
					dataField: 'slipdt',
					headerText: t('lbl.R_DOCDT'), //전표일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'docno',
					headerText: t('lbl.R_DOCNO'), //전표번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'docline',
					headerText: t('lbl.DOCLINE'), //품목번호
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CUST_INFO'), //거래처정보
			children: [
				{
					dataField: 'custkey',
					headerText: t('lbl.CUST'), //거래처
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'custname',
					headerText: t('lbl.CUST_NAME'), //거래처명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), //상품코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), //상품명칭
					editable: false,
				},
				{
					dataField: 'qtyperbox',
					headerText: t('lbl.QTYPERBOX'), //박스입수
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.ORDERUNIT'), //주문단위
			children: [
				{
					dataField: 'storeruom',
					headerText: t('lbl.ORDERUNIT'), //주문단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'orderqty',
					headerText: t('lbl.ORDERQTY'), //주문수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
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
					formatString: '#,##0.###',
				},
				{
					dataField: 'realorderbox',
					headerText: t('lbl.REALOPENBOX'), //실박스예정
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'realcfmbox',
					headerText: t('lbl.REALCFMBOX'), //실박스확정
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN2'), //유통기한임박여부
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'usebydateFreeRt',
			headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여(%)
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
					headerText: t('lbl.CONVERTLOT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
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
				{
					dataField: 'grossweight',
					headerText: t('lbl.GROSSWEIGHT'), //총중량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'), //등록자명
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.SD_WD_SENDOUTORDER_DT'), //영업출고지시시간
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'deliverytypename',
			headerText: t('lbl.DELIVERY_TYPE'), //출고방법
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasoncodename',
			headerText: t('lbl.WDEX_MANUAL_REASON'), //수기출고사유
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'memo1',
			headerText: t('lbl.SD_REMARK'), //영업비고
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'memo2',
			headerText: t('lbl.SCM_REMARK'), //SCM비고
			dataType: 'string',
			editable: true,
		},
		{
			headerText: t('lbl.PRT_YN_RSLT'), //출력여부및결과
			children: [
				{
					dataField: 'faxCnt',
					headerText: t('lbl.FAX_CNT'), //팩스발송
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'faxSuccCnt',
					headerText: t('lbl.FAX_SUCC_CNT'), //팩스성공
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'faxSuccTrPhone',
					headerText: t('lbl.FAX_SUCC_TR_PHONE'), //팩스발송번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'faxSuccTrSenddate',
					headerText: t('lbl.FAX_SUCC_TR_DT'), //팩스발송시간
					dataType: 'date',
					format: 'YYYY-MM-DD HH:mm:ss',
					editable: false,
				},

				{
					dataField: 'faxSuccTrSendname',
					headerText: t('lbl.FAX_SUCC_TR_SENDER'), //팩스발송자명
					dataType: 'manager',
					managerDataField: 'faxSuccTrSenduser',
					editable: false,
				},
				{
					dataField: 'faxFailCnt',
					headerText: t('lbl.FAX_FAIL_CNT'), //팩스실패
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'faxFailTrPhone',
					headerText: t('lbl.FAX_FAIL_TR_PHONE'), //실패발송번호
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'faxFailTrSenddate',
					headerText: t('lbl.FAX_FAIL_TR_DT'), //실패 발송시간
					dataType: 'date',
					format: 'YYYY-MM-DD HH:mm:ss',
					editable: false,
				},
				{
					dataField: 'faxFailTrSendname',
					headerText: t('lbl.FAX_FAIL_TR_SENDER'), //실패 발송자명
					dataType: 'manager',
					managerDataField: 'faxFailTrSenduser',
					editable: false,
				},
				{
					dataField: 'emailCnt',
					headerText: t('lbl.EMAIL_CNT'), //메일
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'emailTrSenddate',
					headerText: t('lbl.EMAIL_TR_DT'), //메일발송시간
					dataType: 'date',
					format: 'YYYY-MM-DD HH:mm:ss',
					editable: false,
				},

				{
					dataField: 'emailTrSendname',
					headerText: t('lbl.EMAIL_TR_SENDER'), //메일발송자명
					dataType: 'manager',
					managerDataField: 'emailTrSenduser',
					editable: false,
				},
				{
					dataField: 'prtCnt',
					headerText: t('lbl.PRT_CNT'), //인쇄
					dataType: 'code',
					editable: false,
				},
			],
		},

		{
			dataField: 'docnoconfirmNm',
			headerText: t('lbl.SEND_REQ_USER'), //발송요청자명
			dataType: 'manager',
			managerDataField: 'docnoconfirm',
			editable: false,
		},
		{
			dataField: 'commCode',
			headerText: t('lbl.SENDOUTORDER_TYPE'), //출고지시수단
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodeList('COMM_CODE')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
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
			dataField: 'allCancelStatus', //전체 취소 상태
			visible: false,
		},
		{
			dataField: 'doctype', //문서유형
			visible: false,
		},
		{
			dataField: 'addwhoNm',
			visible: false,
		},
		{
			dataField: 'faxSuccTrSenduser', //팩스발송자
			visible: false,
		},
		{
			dataField: 'faxFailTrSenduser', //실패 발송자
			visible: false,
		},
		{
			dataField: 'emailTrSenduser', //메일발송자
			visible: false,
		},
		{
			dataField: 'docnoconfirm', //발송요청자
			visible: false,
		},
		{
			dataField: 'checkyn',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.allCancelStatus === 'Y') {
				// 결품처리가 있으면 색상 표시함
				return 'color-danger';
			}
			return '';
		},
	};

	// 그리드 푸터 레이아웃
	const footerLayout = [
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
			dataField: 'grossweight',
			positionField: 'grossweight',
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
	 * 이메일을 발송한다.
	 * @param {any} res API 응답 데이터
	 */
	const sendMail = (res: any) => {
		if (res.data.reportHeader.length < 1) {
			showAlert(null, t('msg.MSG_COM_ERR_053')); // 데이터가 없습니다.
			return;
		}

		const reportHeader = res.data.reportHeader;
		const reportHeaderSum: any[] = [];

		for (const row of res.data.reportHeader) {
			const filterList = reportHeaderSum.filter((item: any) => [row.printkey].includes(item.printkey));
			if (filterList === null || filterList.length === 0) {
				reportHeaderSum.push({
					printkey: row.printkey,
					printtype: row.printtype,
				});
			}
		}

		for (const row of reportHeader) {
			if (row.realorderbox === 0) {
				if (row.boxqty === 0) {
					row.realorderbox = row.orderqty;
					row.boxuom = row.storeruom;
				} else {
					row.realorderbox = row.boxqty;
					row.boxuom = 'BOX';
				}
			}
		}

		let fileName = '';
		if (!commUtil.isEmpty(res.data.reportHeader[0].mapkeyNo)) {
			if (res.data.reportHeader[0].allCancelStatus === 'Y') {
				fileName = 'WD_SendOutOrder_ver4.mrd';
			} else {
				fileName = 'WD_SendOutOrder_ver5.mrd';
			}
		} else {
			fileName = 'WD_SendOutOrder_ver3.mrd';
		}

		// 리포트 파라미터 설정
		const dataSet = {
			ds_reportHeader: res.data.reportHeader,
			ds_reportHeaderSum: reportHeaderSum,
		};

		// 발송 정보
		const sendInfo = {
			EMAIL_TITLE:
				'[CJ프레시웨이] 상품/재고 출고 요청 (' +
				res.data.reportHeader[0].slipdt +
				')' +
				'. ' +
				res.data.reportHeader[0].custname,
			EMAIL_CONTS: '안녕하세요. CJ프레시웨이 입니다.\n\n첨부된 출고지시서 내역으로 출고 부탁드립니다.',
			RECV_EMAIL: res.data.reportHeader[0].recvemail ? res.data.reportHeader[0].recvemail : '',
			RECV_EMAIL2: res.data.reportHeader[0].recvemail2 ? res.data.reportHeader[0].recvemail2 : '',
			RECV_NAME: res.data.reportHeader[0].recvname ? res.data.reportHeader[0].recvname : '',
			SEND_NAME: globalVariable.gUserId,
			SEND_EMAIL: props.emailAddr,
		};

		// 발송 팝업에 전달할 값 설정
		setRptFileName(fileName);
		setSendData(dataSet);
		setSenInfo(sendInfo);

		// 팝업 오픈
		refMailModal.current.handlerOpen();
	};

	/**
	 * 메일발송 팝업 닫기
	 */
	const closeEventMailPopup = () => {
		refMailModal.current.handlerClose();
	};

	/**
	 * 팩스를 발송한다.
	 * @param {any} res API 응답 데이터
	 */
	const sendFax = (res: any) => {
		if (res.data.reportHeader.length < 1) {
			showAlert(null, t('msg.MSG_COM_ERR_053')); // 데이터가 없습니다.
			return;
		}

		const reportHeader = res.data.reportHeader;
		const reportHeaderSum: any[] = [];

		for (const row of res.data.reportHeader) {
			const filterList = reportHeaderSum.filter((item: any) => [row.printkey].includes(item.printkey));
			if (filterList === null || filterList.length === 0) {
				reportHeaderSum.push({
					printkey: row.printkey,
					printtype: row.printtype,
				});
			}
		}

		for (const row of reportHeader) {
			if (row.realorderbox === 0) {
				if (row.boxqty === 0) {
					row.realorderbox = row.orderqty;
					row.boxuom = row.storeruom;
				} else {
					row.realorderbox = row.boxqty;
					row.boxuom = 'BOX';
				}
			}
		}

		let fileName = '';
		if (!commUtil.isEmpty(res.data.reportHeader[0].mapkeyNo)) {
			if (res.data.reportHeader[0].allCancelStatus === 'Y') {
				fileName = 'WD_SendOutOrder_ver4.mrd';
			} else {
				fileName = 'WD_SendOutOrder_ver5.mrd';
			}
		} else {
			fileName = 'WD_SendOutOrder_ver3.mrd';
		}

		// 리포트 파라미터 설정
		const dataSet = {
			ds_reportHeader: res.data.reportHeader,
			ds_reportHeaderSum: reportHeaderSum,
		};

		// ORGANIZE 값 가져오기
		const organize = res.data.reportHeader[0].organize;
		// 문자열의 5번째부터 4자리 추출
		const orgCode = Number(organize.substring(4, 8)); // SubStr(5,4) → substring(4,8)
		// 조건 비교 후 fax 번호 결정
		const fax = orgCode >= 1000 && orgCode <= 4000 ? '0000000000' : '0221496609';

		// 발송 정보
		const sendInfo = {
			FAX_TITLE:
				'[CJ프레시웨이] 상품/재고 출고 요청 (' +
				res.data.reportHeader[0].slipdt +
				')' +
				'. ' +
				res.data.reportHeader[0].custname,
			RECV_FAX: res.data.reportHeader[0].recvfaxno ? res.data.reportHeader[0].recvfaxno : '',
			RECV_FAX2: res.data.reportHeader[0].recvfaxno2 ? res.data.reportHeader[0].recvfaxno2 : '',
			RECV_NAME: res.data.reportHeader[0].recvname ? res.data.reportHeader[0].recvname : '',
			SEND_NAME: globalVariable.gUserId,
			SEND_FAX: fax,
		};

		// 발송 팝업에 전달할 값 설정
		setRptFileName(fileName);
		setSendData(dataSet);
		setSenInfo(sendInfo);

		// 팝업 오픈
		refFaxModal.current.handlerOpen();
	};

	/**
	 * 팩스발송 팝업 닫기
	 */
	const closeEventFaxPopup = () => {
		refFaxModal.current.handlerClose();
	};

	/**
	 * 수기출고 삭제한다.
	 */
	const deleteOrder = () => {
		// 지시서 유형이 [오더없음]일 경우만 처리 가능하다
		const searhParams = props.searchForm.getFieldsValue();
		if (searhParams.exdcinstructtype !== 'NOTORDER') {
			showAlert(null, '지시서 유형이 [오더없음]일 경우만 처리 가능합니다.');
			return;
		}

		// 삭제할 대상 선택 검증
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 삭제할 대상의 데이터 검증
		for (const item of updatedItems) {
			if (item.allCancelStatus === 'Y') {
				showAlert(null, '이미 삭제된 건은 처리할 수 없습니다.');
				return;
			}
		}

		// 삭제 실행
		showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
			loopTransaction(updatedItems, 0, updatedItems.length);
		});
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 */
	const loopTransaction = (rowItems: any, index: number, total: number) => {
		// loop transaction
		const saveParams = {
			apiUrl: '/api/wd/sendoutorder/v1.0/deleteOrder',
			avc_DCCODE: props.dccode,
			avc_COMMAND: 'DELETE',
			fixdccode: props.dccode,
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
			if (trProcessCnt?.total === trProcessCnt?.success) {
				props.search?.();
			}
		}
	};

	/**
	 * 인쇄, fax, email 공통 마스터리스트 출력
	 * @param {string} param
	 */
	const printMasterList = (param: string) => {
		const checkedItem = ref.gridRef.current.getCheckedRowItemsAll();

		const checkedItems = checkedItem.map(item => ({
			...item,
			docName: param === 'FAX' ? `fc_${dayjs().format('YYYYMMDD')}${user.userId}_${item?.docno ?? ''}` : null,
		}));
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		if (['EMAIL', 'FAX'].includes(param)) {
			const organize = checkedItems[0].organize;
			const diffOrganizes = checkedItems.filter((v: any) => v.organize !== organize);
			if (diffOrganizes && diffOrganizes.length > 0) {
				if ('EMAIL' === param) {
					showAlert(null, '메일 송신시 다중 창고를 선택할 수 없습니다.');
				} else if ('FAX' === param) {
					showAlert(null, '팩스 송신시 다중 창고를 선택할 수 없습니다.');
				}
				return;
			}
		}
		const searchParams = dataTransform.convertSearchData(props.searchForm.getFieldsValue());
		const instructtype = searchParams.exdcinstructtype;
		// if (commUtil.isEmpty(checkedItems[0].mapkeyNo)) {
		// 	instructtype = searchParams.exdcinstructtype;
		// } else {
		// 	instructtype = 'NOTORDER';
		// }

		const params = {
			avc_DCCODE: props.dccode,
			avc_COMMAND: 'WD_SENDOUTORDER',
			fixdccode: props.dccode,
			fromSlipdt: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			toSlipdt: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
			docno: searchParams.docno,
			tocustkey: searchParams.toCustkey,
			sku: searchParams.skuCode,
			instructtype: instructtype,
			saveList: checkedItems,
			printType: param,
		};

		apiPostPrintMastrerList(params).then(res => {
			if (res.statusCode === 0) {
				if (param === 'FAX') {
					sendFax(res);
				} else if (param === 'EMAIL') {
					sendMail(res);
				} else if (param === 'PRINT') {
					// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
					showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
						viewRdReport(res);
					});
				}
			}
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReport = (res: any) => {
		if (res.data.reportHeader.length < 1) {
			showAlert(null, t('msg.MSG_COM_ERR_053')); // 데이터가 없습니다.
			return;
		}

		const reportHeader = res.data.reportHeader;
		const reportHeaderSum: any[] = [];

		for (const row of res.data.reportHeader) {
			const filterList = reportHeaderSum.filter((item: any) => [row.printkey].includes(item.printkey));
			if (filterList === null || filterList.length === 0) {
				reportHeaderSum.push({
					printkey: row.printkey,
					printtype: row.printtype,
				});
			}
		}

		for (const row of reportHeader) {
			if (row.realorderbox === 0) {
				if (row.boxqty === 0) {
					row.realorderbox = row.orderqty;
					row.boxuom = row.storeruom;
				} else {
					row.realorderbox = row.boxqty;
					row.boxuom = 'BOX';
				}
			}
		}

		let fileName = '';
		if (!commUtil.isEmpty(res.data.reportHeader[0].mapkeyNo)) {
			if (res.data.reportHeader[0].allCancelStatus === 'Y') {
				fileName = 'WD_SendOutOrder_ver4.mrd';
			} else {
				fileName = 'WD_SendOutOrder_ver5.mrd';
			}
		} else {
			fileName = 'WD_SendOutOrder_ver3.mrd';
		}

		// 리포트 파라미터 설정
		const dataSet = {
			ds_reportHeader: res.data.reportHeader,
			ds_reportHeaderSum: reportHeaderSum,
		};

		// 리포트 파라미터 설정
		//setReprotFileName(fileName); // 파일명
		//setReportDataSet(dataSet);   // 데이터셋
		// reportUtil.openHtmlReportViewer(fileName, dataSet);
		reportUtil.openAgentReportViewer(fileName, dataSet);

		ref.gridRef.current.setAllCheckedRows(false);
		ref.gridRef.current.resetUpdatedItems();
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
					btnType: 'btn1', //팩스
					// callBackFn: sendFax,
					callBackFn: () => {
						printMasterList('FAX');
					},
				},
				{
					btnType: 'btn2', //메일
					// callBackFn: sendMail,
					callBackFn: () => {
						printMasterList('EMAIL');
					},
				},
				{
					btnType: 'print', //출력
					callBackFn: () => {
						printMasterList('PRINT');
					},
				},
				{
					btnType: 'btn3', //수기출고 삭제
					callBackFn: deleteOrder,
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
			ref.gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {});

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
	 * 화면 초기화
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
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 이메일 팝업 영역 정의 */}
			<CustomModal ref={refMailModal} width="1000px">
				<WdSendOutOrderSendMailPopup
					closeEventHandler={closeEventMailPopup}
					rptFileName={rptFileName}
					sendInfo={sendInfo}
					sendData={sendData}
				/>
			</CustomModal>

			{/* 팩스 팝업 영역 정의 */}
			<CustomModal ref={refFaxModal} width="1000px">
				<WdSendOutOrderSendFaxPopup
					closeEventHandler={closeEventFaxPopup}
					rptFileName={rptFileName}
					sendInfo={sendInfo}
					sendData={sendData}
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
		</>
	);
});

export default WdSendOutOrderDetail;
