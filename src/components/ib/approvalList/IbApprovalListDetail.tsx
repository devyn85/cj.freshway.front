/*
 ############################################################################
 # FiledataField	: IbApprovalListDetail.tsx
 # Description		: 비용결재
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.25
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// API
import { apiPostCancelMasterList } from '@/api/ib/apiIbApprovalList';
import IbApprovalListResultPopup from '@/components/ib/approvalList/IbApprovalListResultPopup';

interface IbApprovalListDetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	searchForm: any;
	dccode: any;
}

const IbApprovalListDetail = forwardRef((props: IbApprovalListDetailProps, ref: any) => {
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
	const refResultModal = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// 선택한 행의 데이터 번호
	const [selectedSerialKey, setSelectedSerialKey] = useState<string | null>(null);

	// 선택한 행의 결재 제목
	const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

	// 선택한 행들의 데이터 번호
	const [selectedItems, setSelectedItems] = useState<[] | null>(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 작업 결과 코드
	const statusApprLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_APPR', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'apprStatus',
			visible: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'approvalwho',
			visible: false,
		},
		{
			dataField: 'expenseSn',
			visible: false,
		},
		{
			dataField: 'apprStatusName',
			headerText: t('lbl.STATUS_DP'), //진행상태
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				labelText: t('lbl.STATUS_DP'),
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					openPopup(item, 'APPROVAL_RESULT');
				},
			},
		},
		{
			dataField: 'apprNo',
			headerText: t('lbl.APPROVALNUMBER'), //결재번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'title',
			headerText: t('lbl.APPROVALNAME'), //결재명
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'addwhoname',
			headerText: t('lbl.APPROVREQWHO'), //결재요청자
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},

		{
			dataField: 'reqdt',
			headerText: t('lbl.APPROVALREQDT'), //결재요청일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:mm:ss',
			editable: false,
		},
		{
			dataField: 'approvalwho',
			visible: false,
		},
		{
			dataField: 'approvalwhoname',
			headerText: t('lbl.APPROVALWHO'), //결재자
			dataType: 'manager',
			managerDataField: 'approvalwho',
			editable: false,
		},
		{
			dataField: 'approvaldt',
			headerText: t('lbl.APPROVALDT'), //결재일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:mm:ss',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: false,
		rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
			if (item.apprStatus == '0' || item.apprStatus == '1') {
				// 진행상태 : '0'(요청) 또는 '1'(결재중)이면
				return true;
			}
			return false;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 팝업을 열어 문서 정보를 표시한다.
	 * @param {any} item 그리드 행
	 * @param {string} type 팝업 타입
	 */
	const openPopup = (item: any, type: string) => {
		setSelectedSerialKey(item.serialkey); // serialkey 저장
		setSelectedTitle(item.title); // 제목 저장
		if (type === 'APPROVAL_RESULT') {
			// 결재라인 정보 팝업
			refResultModal.current?.handlerOpen();
		}
	};

	/**
	 * 문서정보 팝업 닫기
	 */
	const closeResultPopup = () => {
		refResultModal.current?.handlerClose();
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
	 * 상신취소를 실행한다.
	 * 결재요청자가 본인이면서 결재상태가 '0:대기, 1:미결'인 경우에만 상신취소가 가능하다.
	 */
	const cancelMasterList = () => {
		// 체크된 건만 처리
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			if (item.addwho !== globalVariable.gUserId) {
				const msg = '기안자가 아닙니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			// 결재상태가 '0:대기'가 아닌 경우 상신취소가 불가능하다
			if (!['0'].includes(item.apprStatus)) {
				const msg = '상신취소가 불가능한 상태입니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		const msg = '상신취소 하시겠습니까?';
		showConfirm(null, msg, () => {
			const params = {
				saveList: checkedItems,
			};

			apiPostCancelMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 반려를 실행한다.
	 * 결재자가 본인이면서 결재상태가 '1:미결'인 경우에만 반려가 가능하다.
	 */
	const rejectMasterList = () => {
		// 체크된 건만 처리
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			if (item.approvalwho !== globalVariable.gUserId) {
				const msg = '결재처리자가 아닙니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			// 결재상태가 '1:미결'가 아닌 경우 반려가 불가능하다
			if (!['1'].includes(item.apprStatus)) {
				const msg = '결재상태가 미결인 항목만 반려가 가능합니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		const msg = '반려 하시겠습니까?';
		showConfirm(null, msg, () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/approvalList/v1.0/saveApprovelMasterList',
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'APPROVAL_TRANSACT',
				approvalType: '3',
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 결재를 실행한다.
	 * 결재자가 본인이면서 결재상태가 '1:미결'인 경우에만 결재가 가능하다.
	 */
	const approveMasterList = () => {
		// 체크된 건만 처리
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			if (item.approvalwho !== globalVariable.gUserId) {
				const msg = '결재처리자가 아닙니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}
			// 결재상태가 '1:미결'가 아닌 경우 결재가 불가능하다
			if (!['1'].includes(item.apprStatus)) {
				const msg = '결재상태가 미결인 항목만 결재가 가능합니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}
		}

		// API 실행
		const msg = '결재 하시겠습니까?';
		showConfirm(null, msg, () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/approvalList/v1.0/saveApprovelMasterList',
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'APPROVAL_TRANSACT',
				approvalType: '2',
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
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
					btnType: 'btn1', // 상신취소
					callBackFn: cancelMasterList,
				},
				{
					btnType: 'btn2', // 반려
					callBackFn: rejectMasterList,
				},
				{
					btnType: 'btn3', // 결재
					callBackFn: approveMasterList,
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
		ref.gridRef.current.bind('ready', (event: any) => {});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {});

		/**
		 * 그리드 셀 더블클릭
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
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />

			{/* 문서정보 팝업 영역 정의 */}
			<CustomModal ref={refResultModal} width="1000px">
				<IbApprovalListResultPopup
					close={closeResultPopup}
					serialkey={selectedSerialKey} // 선택한 행의 serialkey를 전달
					title={selectedTitle} // 결재제목
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

export default IbApprovalListDetail;
