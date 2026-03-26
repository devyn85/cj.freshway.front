/*
 ############################################################################
 # FiledataField	: StDisuseReqeustExDCApprovalDetail.tsx
 # Description		: 외부비축재고폐기요청 결재
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.07.14
 ############################################################################
*/
// lib
import { v4 as uuidv4 } from 'uuid';

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// api

// util

// hook

// type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// asset
import { apiSaveElectApproval } from '@/api/st/apiStDisuseRequeStExDC';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import dateUtil from '@/util/dateUtil';
import dayjs from 'dayjs';

interface StDisuseReqeustExDCApprovalDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
	setNoElectApprovalList: any;
}

const StDisuseReqeustExDCApprovalDetail = forwardRef((props: StDisuseReqeustExDCApprovalDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const today = dayjs(dateUtil.getToDay('YYYY-MM-DD'));

	// grid Ref
	ref.gridRef = useRef();
	const refModal = useRef(null);
	const refLoopModal = useRef(null);
	const [loopTrParams, setLoopTrParams] = useState({});

	//마스터 그리드 생성시 필요한 변수들
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{ dataField: 'dccode', headerText: '물류센터', dataType: 'code', editable: false },
		{ dataField: 'organize', headerText: '창고', dataType: 'code', editable: false },
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), // 창고명
			dataType: 'string',
			editable: false,
		},
		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', dataType: 'code', editable: false },
				{ dataField: 'skuname', headerText: '상품명칭', dataType: 'text', editable: false },
			],
		},
		{ dataField: 'inquirytype', headerText: '유형', dataType: 'code', editable: false, visible: false },
		{ dataField: 'inquirytypename', headerText: '유형', dataType: 'code', editable: false },
		{ dataField: 'costcenter', headerText: '귀속부서', dataType: 'code', editable: false, visible: false },
		{ dataField: 'costcentername', headerText: '귀속부서명', dataType: 'text', editable: false },
		{ dataField: 'approvalreason', headerText: '전자결재유형', dataType: 'code', editable: false, visible: false },
		{ dataField: 'approvalreasonname', headerText: '전자결재유형', dataType: 'string', editable: false },
		{
			dataField: 'reasoncodename',
			headerText: t('lbl.REASONCODE_AJ'), // 발생사유
			dataType: 'string',
			editable: false,
		},
		{ dataField: 'uom', headerText: '단위', dataType: 'code', editable: false },
		{ dataField: 'orderqty', headerText: '수량', dataType: 'numeric', editable: false },
		{
			headerText: '박스환산정보',
			children: [
				{
					dataField: 'avgweight',
					headerText: '평균중량',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'calbox',
					headerText: '환산박스',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{ dataField: 'realorderbox', headerText: '실박스예정', dataType: 'numeric', editable: false },
				{ dataField: 'realcfmbox', headerText: '실박스확정', dataType: 'numeric', editable: false },
			],
		},
		{
			dataField: 'stockamt',
			headerText: '금액',
			dataType: 'numeric',
			width: 100,
			required: true,
		},
		{ dataField: 'stockamtmsg', headerText: '사유', dataType: 'text', editable: false },
		{ dataField: 'neardurationyn', headerText: '유통기한임박여부', dataType: 'code', editable: false, width: 80 },
		{ dataField: 'lottable01', headerText: '기준일(유통,제조)', dataType: 'date', editable: false, width: 180 },
		{ dataField: 'durationTerm', headerText: '유통기간(잔여/전체)', dataType: 'code', editable: false, width: 180 },
		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialno', headerText: '이력번호', dataType: 'code', editable: false },
				{ dataField: 'barcode', headerText: '바코드', dataType: 'text', editable: false, width: 250 },
				{ dataField: 'convserialno', headerText: 'B/L번호', dataType: 'text', editable: false, width: 250 },
				{ dataField: 'butcherydt', headerText: '도축일자', dataType: 'date', editable: false },
				{ dataField: 'factoryname', headerText: '도축장', dataType: 'text', editable: false },
				{ dataField: 'contracttype', headerText: '계약유형', dataType: 'code', editable: false, visible: false },
				{ dataField: 'contracttypename', headerText: '계약유형', dataType: 'code', editable: false },
				{ dataField: 'contractcompany', headerText: '계약업체', dataType: 'code', editable: false, width: 100 },
				{ dataField: 'contractcompanyname', headerText: '계약업체명', dataType: 'text', editable: false, width: 180 },
				{ dataField: 'fromvaliddt', headerText: '유효일자(FROM)', dataType: 'date', editable: false, width: 100 },
				{ dataField: 'tovaliddt', headerText: '유효일자(TO)', dataType: 'date', editable: false, width: 100 },
			],
		},
		{ dataField: 'addwho', headerText: '생성인', dataType: 'text', editable: false, width: 100 },
		{ dataField: 'adddate', headerText: '등록일자', dataType: 'date', editable: false, width: 150 },
		{ dataField: 'price', headerText: '단가', dataType: 'numeric', editable: false, width: 100, visible: false },
	];

	// AUIGrid 옵션
	const gridProps = {
		editable: false,
		//editBeginMode: 'doubleClick',
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		// rowCheckDisabledFunction: (rowIndex: number, item: any) => {
		// 	return item.stockamt == 0; // true 반환 시 체크박스 비활성화
		// },
	};

	// DETAIL VIEW 상단 버튼 설정
	const setTableBtn = (): TableBtnPropsType => ({
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'save',
				btnLabel: 'wjr',
				callBackFn: async () => {
					alert('적용되었습니다.');
				},
			},
		],
	});
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
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
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		ref.gridRef?.current.bind('beforeBeginEdit', (evt: any) => {
			// 클릭된 컬럼의 dataField (colid) 확인
			// 다른 컬럼들을 추가로 체크하고 싶으면 else if...
		});
		ref.gridRef?.current.bind('afterValueChanged', (evt: any) => {
			const col = evt.column?.dataField;
			const { rowIndex, newValue, item } = evt;

			if (col === 'tranqty' && item.boxflag !== 'D') {
				const tranQty = Number(newValue) || 0;
				const avgWeight = Number(item.avgWeight) || 1;

				if (tranQty <= 0) {
					ref.gridRef.current.setCellValue(rowIndex, 'tranqty', 0);
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
				} else {
					const calculatedBox = Math.ceil(tranQty / avgWeight);
					const finalBox = calculatedBox < 1 ? 1 : calculatedBox;
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', finalBox);
				}
			}

			if (col === 'tranbox' && item.boxflag !== 'D') {
				const tranBox = Number(newValue) || 0;
				if (tranBox <= 0) {
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
				}
			}
		});

		ref.gridRef?.current.bind('cellEditBegin', (evt: any) => {
			const col = evt.dataField;
			const { rowIndex, newValue, item } = evt;
			if (col === 'tranqty') {
				if (item.approvalstatus !== '승인완료') {
					return true; // boxflag가 Y면 편집 허용
				} else {
				}
			}
			return false;
		});
	};

	/**
	 * 전자결재
	 */
	const approvalMaster = async () => {
		let errReason = '';
		const delGridData = ref.gridRef?.current.getChangedData();
		if (delGridData.length > 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_214'), // 삭제 진행중인 데이터가 존재합니다.
				modalType: 'info',
			});
			return;
		}

		const chkDataList = ref.gridRef?.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// 그리드 validation 체크
		if (!ref.gridRef?.current.validateRequiredGridData()) {
			showAlert(null, t('msg.requiredInputNoArg'));
			return;
		}

		const findData = chkDataList.find((item: any) => {
			if (Number(item.stockamt) === 0 || commUtil.isNotEmpty(item.stockamtmsg)) {
				errReason = item.stockamtmsg;
				return true;
			}

			// if (commUtil.isEmpty(item.serialno)) {
			// 	errReason = t('lbl.SERIALNO_SKU');
			// 	return true;
			// }

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

		const formdata = props.form.getFieldsValue();
		const params = {
			saveApprovalList: chkDataList,
			...formdata,
		};

		apiSaveElectApproval(params).then(res => {
			if (res.statusCode == 0) {
				// 전자결재 요청된 건을 filtering 해서 보여지지 않도록 변경
				props.setNoElectApprovalList();

				// 저장 후 콜백 함수 호출
				let formId = 'SCM08'; // 'SCM03' -> SCM08;
				if (formdata.approvaltype == 'DDRAJ') {
					if (formdata.gMultiDccode == '2170') {
						formId = 'SCM08'; // 'SCM03' -> SCM08;
					} else {
						formId = 'SCM06'; // SCM01 -> SCM06
					}
				} else {
					if (formdata.gMultiDccode == '1000') {
						formId = 'SCM09'; // SCM04 -> SCM09
					} else {
						formId = 'SCM07'; // SCM02 -> SCM07
					}
				}
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
	 * 폐기 처리 삭제
	 */
	const deleteMaster = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		const form = props.form.getFieldsValue();
		showConfirm(null, '삭제하시겠습니까??', () => {
			const params = {
				dataKey: 'saveProcessList',
				apiUrl: '/api/st/disusereqeust/v1.0/cancelDisuseApproval',
				...form,
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			refLoopModal.current.handlerOpen();
		});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'elecApproval', // 전자결재
				callBackFn: approvalMaster,
			},
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			{
				btnType: 'save', // 삭제
				btnLabel: '삭제',
				callBackFn: deleteMaster,
			},
		],
	};
	/**
	 * 팝업 닫기
	 */
	const closeEventLoop = () => {
		refLoopModal.current.handlerClose();
		props.callBackFn();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useImperativeHandle(ref, () => ({
		resetDetail: () => {
			ref.gridRef.current.clearGridData();
		},
	}));
	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
		ref.gridRef?.current.resize(); // 그리드 크기 조정
	});

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록2" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});

export default StDisuseReqeustExDCApprovalDetail;
