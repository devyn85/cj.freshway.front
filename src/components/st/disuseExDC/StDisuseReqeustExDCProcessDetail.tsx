/*
 ############################################################################
 # FiledataField	: StDisuseRequeStExDCDetail.tsx
 # Description		: 저장위치정보 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
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
import { GridBtnPropsType } from '@/types/common';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { useAppSelector } from '@/store/core/coreHook';
import dateUtil from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

interface StDisuseReqeustExDCProcessDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
	detailForm: any;
}

const StDisuseReqeustExDCProcessDetail = forwardRef((props: StDisuseReqeustExDCProcessDetailProps, ref: any) => {
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
	const initValues = {
		rowStatus: 'I',
		apprreqdt: today,
	};

	const userAuthInfo = useAppSelector(state => state.user.userInfo);

	//마스터 그리드 생성시 필요한 변수들
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{ dataField: 'approvalreqno', headerText: '품의요청번호', dataType: 'text', editable: false },
		{ dataField: 'approvalno', headerText: '전자문서번호', dataType: 'text', editable: false },
		{ dataField: 'approvaldate', headerText: '전자문서시간', dataType: 'date', editable: false },
		{ dataField: 'approvalstatus', headerText: '결재진행상태', dataType: 'code', editable: false, visible: false },
		{ dataField: 'approvalstatusname', headerText: '결재진행상태', dataType: 'code', editable: false },
		{ dataField: 'statusaj', headerText: '처리상태', dataType: 'code', editable: false },
		{ dataField: 'slipdt', headerText: '조정일자', dataType: 'code', editable: false },
		{ dataField: 'dccode', headerText: '물류센터', dataType: 'code', editable: false },
		{ dataField: 'storerkey', headerText: '창고', dataType: 'code', editable: false },
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), // 창고명
			dataType: 'string',
			editable: false,
		},
		{ dataField: 'stocktypenm', headerText: '재고위치', dataType: 'code', editable: false },
		{ dataField: 'stockgradename', headerText: '재고속성', dataType: 'code', editable: false },
		{ dataField: 'stocktype', headerText: '재고위치', dataType: 'text', editable: false, visible: false },
		{ dataField: 'stockgrade', headerText: '재고속성', dataType: 'text', editable: false, visible: false },
		{ dataField: 'zone', headerText: '피킹존', dataType: 'code', editable: false },
		{ dataField: 'loc', headerText: '로케이션', dataType: 'code', editable: false },

		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', dataType: 'code', editable: false },
				{ dataField: 'skuname', headerText: '상품명', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'uom', headerText: '단위', dataType: 'code', editable: false },
		{
			dataField: 'tranqty',
			headerText: '조정수량',
			dataType: 'numeric',
			editable: false,
			required: false,
			formatString: '#,##0.###',
		},
		{ dataField: 'disusetypename', headerText: '폐기유형', dataType: 'code', editable: false },
		{ dataField: 'reasoncodename', headerText: '발생사유', dataType: 'code', editable: false },
		{ dataField: 'disusetype', headerText: '폐기유형', dataType: 'code', editable: false, visible: false },
		{ dataField: 'reasoncode', headerText: '발생사유', dataType: 'code', editable: false, visible: false },
		{ headerText: t('lbl.PROCESSREASON_ETC'), dataField: 'reasonmsg', dataType: 'string', width: 160 },
		{ dataField: 'reference01', headerText: '비고', dataType: 'text', editable: false, width: 270 },

		{
			headerText: '박스환산정보',
			children: [
				{ dataField: 'boxflag', headerText: '박스여부', dataType: 'numeric', editable: false, visible: false },
				{
					dataField: 'avgweight',
					headerText: '평균중량',
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{ dataField: 'calbox', headerText: '환산박스', dataType: 'numeric', editable: false },
				{ dataField: 'realorderbox', headerText: '실박스예정', dataType: 'numeric', editable: false },
				{ dataField: 'realcfmbox', headerText: '실박스확정', dataType: 'numeric', editable: false },
				{ dataField: 'tranbox', headerText: '작업박스수량', dataType: 'numeric', editable: false, required: false },
			],
		},

		{ dataField: 'reference08', headerText: '보관료', dataType: 'numeric', editable: false },
		{ dataField: 'reference09', headerText: 'reference09', dataType: 'numeric', editable: false, visible: false },
		{ dataField: 'imputetypename', headerText: '귀책', dataType: 'code', editable: false, visible: false },
		{ dataField: 'imputetype', headerText: '귀책', dataType: 'code', editable: false, visible: false },
		{ dataField: 'processmain', headerText: '물류귀책배부', dataType: 'code', editable: false, visible: false },

		{
			headerText: '귀속부서',
			children: [
				{ dataField: 'costcd', headerText: '귀속부서', dataType: 'code', editable: false },
				{ dataField: 'costcdname', headerText: '귀속부서명', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '거래처',
			children: [
				{ dataField: 'custkey', headerText: '거래처', dataType: 'code', editable: false },
				{ dataField: 'custname', headerText: '거래처명', dataType: 'text', editable: false },
			],
		},

		{
			dataField: 'neardurationyn',
			headerText: '유통기한임박여부',
			dataType: 'code',
			editable: false,
		},
		{ dataField: 'lottable01', headerText: '기준일(유통,제조)', dataType: 'date', editable: false },
		{ dataField: 'durationterm', headerText: '유통기간(잔여/전체)', dataType: 'code', editable: false },

		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialno', headerText: '이력번호', dataType: 'text', editable: false },
				{ dataField: 'barcode', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'convserialno', headerText: 'B/L번호', dataType: 'code', editable: false },
				{ dataField: 'butcherydt', headerText: '도축일자', dataType: 'date', editable: false },
				{ dataField: 'factoryname', headerText: '도축장', dataType: 'text', editable: false },
				{ dataField: 'contracttype', headerText: '계약유형', dataType: 'code', editable: false, visible: false },
				{ dataField: 'contracttypename', headerText: '계약유형', dataType: 'code', editable: false },
				{ dataField: 'contractcompany', headerText: '계약업체', dataType: 'code', editable: false },
				{ dataField: 'contractcompanyname', headerText: '계약업체명', dataType: 'text', editable: false },
				{ dataField: 'fromvaliddt', headerText: '유효일자(FROM)', dataType: 'date', editable: false },
				{ dataField: 'tovaliddt', headerText: '유효일자(TO)', dataType: 'date', editable: false },
			],
		},
		{
			dataField: 'area',
			headerText: '지역',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'docdt',
			headerText: '전표 날짜',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'docno',
			headerText: '전표번호',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'docline',
			headerText: '전표라인',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'slipno',
			headerText: '전표번호',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'slipline',
			headerText: '전표라인',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'sliptype',
			headerText: '전표유형',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{ dataField: 'stockid', headerText: 'stockid', visible: false },
		{ dataField: 'lot', headerText: '로트', visible: false },
		{ dataField: 'iotype', headerText: '입출고타입', visible: false },
		{ dataField: 'addwho', headerText: '생성인', dataType: 'text', editable: false },
		{ dataField: 'adddate', headerText: '등록일자', dataType: 'date', editable: false },
	];

	// AUIGrid 옵션
	const gridProps = {
		editable: true,
		//editBeginMode: 'doubleClick',
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
		rowCheckDisabledFunction: (rowIndex: number, item: any) => {
			return item.approvalstatus !== '3'; // true 반환 시 체크박스 비활성화
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		ref.gridRef?.current.bind('beforeBeginEdit', (evt: any) => {
			// 클릭된 컬럼의 dataField (colid) 확인
			const col = evt.column?.dataField;
			const rowIndex = evt.rowIndex;

			// 예: 'costcd' 컬럼 클릭 시 팝업 띄우기
			if (col === 'costcd') {
				const rowData = ref.gridRef?.current.getRowData(rowIndex);
				refModal.current?.handlerOpen();
				return false;
			}

			// 다른 컬럼들을 추가로 체크하고 싶으면 else if...
		});
	};

	/**
	 * 폐기 처리 저장
	 */
	const saveMaster = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		// 그리드 validation 체크
		if (!ref.gridRef?.current.validateRequiredGridData()) {
			showAlert(null, t('msg.requiredInputNoArg'));
			return;
		}

		for (const row of checkedRows) {
			if (row.approvalstatus !== '3') {
				alert('최종결재완료건만 처리 가능합니다.'); // 또는 사용자 정의 메시지 함수 사용
				ref.gridRef?.current.setFocusedCell(row.rowIndex, 'CHECKYN');
				return;
			}
		}

		const isValid = await validateForm(props.detailForm);
		if (!isValid) {
			return;
		}

		showConfirm(null, '저장하시겠습니까?', () => {
			const formdata = props.form.getFieldsValue();
			const detailFormData = props.detailForm.getFieldsValue();
			const params = {
				dataKey: 'saveProcessList',
				apiUrl: '/api/st/disusereqeust/v1.0/saveDisuseProcessList',
				...detailFormData,
				apprreqdt: dayjs(detailFormData.apprreqdt).format('YYYYMMDD'),
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			refLoopModal.current.handlerOpen();
		});
	};

	/**
	 * 폐기 처리 삭제
	 * 20251220
	 */
	/*
	const deleteMaster = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		// userAuthInfo 배열 내에 관리자 권한("00", "05")이 있는지 체크
		if (userAuthInfo.authority === '00' || userAuthInfo.authority === '05') {
			for (const row of checkedRows) {
				if (row.approvalstatus !== '3') {
					alert('최종결재완료건만 처리 가능합니다.'); // 또는 사용자 정의 메시지 함수 사용
					ref.gridRef?.current.setFocusedCell(row.rowIndex, 'CHECKYN');
					return;
				}
			}
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
	*/

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'btn1', // 삭제
			// 	btnLabel: '삭제',
			// 	callBackFn: deleteMaster,
			// },
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
			props.detailForm.resetFields();
			ref.gridRef.current.clearGridData();
		},
		isChangeForm: () => props.detailForm.getFieldValue('rowStatus') === 'U',
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
				gridRefCur.setColumnPropByDataField('reference01', { width: 270 });
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록3" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});

export default StDisuseReqeustExDCProcessDetail;
