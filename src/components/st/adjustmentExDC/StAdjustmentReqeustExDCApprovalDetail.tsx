/*
 ############################################################################
 # FiledataField	: StAdjustmentReqeustExDCApprovalDetail.tsx
 # Description		: 외부비축재고감모요청 결재
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
import { apiSaveAdjustmentRequestList } from '@/api/st/apiStAdjustmentRequeStExDC';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import dateUtil from '@/util/dateUtil';
import dayjs from 'dayjs';

interface StAdjustmentReqeustExDCApprovalDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
}

const StAdjustmentReqeustExDCApprovalDetail = forwardRef(
	(props: StAdjustmentReqeustExDCApprovalDetailProps, ref: any) => {
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
			{ dataField: 'dccode', headerText: '물류센터', dataType: 'text', editable: false },
			{ dataField: 'organize', headerText: '창고', dataType: 'text', editable: false },
			{
				headerText: '상품정보',
				children: [
					{ dataField: 'sku', headerText: '상품코드', dataType: 'text', editable: false },
					{ dataField: 'skuname', headerText: '상품명칭', dataType: 'text', editable: false },
				],
			},
			{ dataField: 'storagetype', headerText: '저장조건', dataType: 'code', editable: false, visible: false },
			{ dataField: 'storagetypename', headerText: '저장조건', dataType: 'code', editable: false },
			{ dataField: 'inquirytype', headerText: '유형', dataType: 'text', editable: false, visible: false },
			{ dataField: 'inquirytypename', headerText: '유형', dataType: 'text', editable: false },
			{ dataField: 'costcenter', headerText: '귀속부서', dataType: 'text', editable: false, visible: false },
			{ dataField: 'costcentername', headerText: '귀속부서명', dataType: 'text', editable: false },
			{ dataField: 'approvalreason', headerText: '전자결재유형', dataType: 'text', editable: false, visible: false },
			{ dataField: 'approvalreasonname', headerText: '전자결재유형', dataType: 'text', editable: false },
			{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
			{ dataField: 'orderqty', headerText: '수량', dataType: 'number', editable: false },
			{
				headerText: '박스환산정보',
				children: [
					{ dataField: 'avgweight', headerText: '평균중량', dataType: 'number', editable: false },
					{ dataField: 'calbox', headerText: '환산박스', dataType: 'number', editable: false },
					{ dataField: 'realorderbox', headerText: '실박스예정', dataType: 'number', editable: false },
					{ dataField: 'realcfmbox', headerText: '실박스확정', dataType: 'number', editable: false },
				],
			},
			{ dataField: 'stockamt', headerText: '금액', dataType: 'number', editable: false },
			{ dataField: 'stockamtmsg', headerText: '사유', dataType: 'text', editable: false },
			{ dataField: 'neardurationyn', headerText: '유통기한임박여부', dataType: 'code', editable: false },
			{ dataField: 'lottable01', headerText: '기준일(유통,제조)', dataType: 'date', editable: false },
			{ dataField: 'duration_term', headerText: '유통기간(잔여/전체)', dataType: 'date', editable: false },
			{
				headerText: '상품이력정보',
				children: [
					{ dataField: 'serialno_org', headerText: '이력번호', dataType: 'code', editable: false },
					{ dataField: 'barcode', headerText: '바코드', dataType: 'code', editable: false },
					{ dataField: 'convserialno', headerText: 'B/L번호', dataType: 'code', editable: false },
					{ dataField: 'butcherydt', headerText: '도축일자', dataType: 'date', editable: false },
					{ dataField: 'factoryname', headerText: '도축장', dataType: 'text', editable: false },
					{ dataField: 'contracttype', headerText: '계약유형', dataType: 'code', editable: false, visible: false },
					{ dataField: 'contracttypename', headerText: '계약유형', dataType: 'code', editable: false },
					{ dataField: 'contractcompany', headerText: '계약업체', dataType: 'code', editable: false },
					{ dataField: 'contractcompanyname', headerText: '계약업체명', dataType: 'text', editable: false },
					{ dataField: 'fromvaliddt', headerText: '유효일자(FROM)', dataType: 'date', editable: false },
					{ dataField: 'tovaliddt', headerText: '유효일자(TO)', dataType: 'date', editable: false },
					{
						dataField: 'addwho',
						headerText: '생성인',
						editable: false,
						dataType: 'manager',
						manager: 'addwho',
					},
					{ dataField: 'adddate', headerText: '등록일자', dataType: 'date', editable: false },
				],
			},
		];

		// AUIGrid 옵션
		const gridProps = {
			editable: false,
			//editBeginMode: 'doubleClick',
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
			enableFilter: true,
			rowCheckDisabledFunction: (rowIndex: number, item: any) => {
				return item.stockamt === 0; // true 반환 시 체크박스 비활성화
			},
		};

		// DETAIL VIEW 상단 버튼 설정
		const setTableBtn = (): TableBtnPropsType => ({
			tGridRef: ref.gridRef,
			btnArr: [
				{
					btnType: 'save',
					btnLabel: '저장',
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

			showConfirm(null, '저장하시겠습니까?', () => {
				const formdata = props.form.getFieldsValue();
				const params = {
					saveRequestList: checkedRows,
					...formdata,
				};
				apiSaveAdjustmentRequestList(params).then(res => {
					if (res.data && res.data.errorCode != '-1') {
						showMessage({
							content: t('msg.MSG_COM_SUC_001'),
							modalType: 'success',
						});
						// 저장 후 콜백 함수 호출
					} else {
						showAlert(null, t('msg.MSG_COM_ERR_001'));
					}
				});
			});
			const params = {
				formSerial: 'SCM01',
				systemID: 'SCM',
				DATA_KEY1: '20150717',
				DATA_KEY2: '0000000011',
				OTU_ID: '03a4cf0fcf7374ef3b9aee2eeff3068a6',
			};
			extUtil.openApproval(params);
		};

		/**
		 * 감모 처리 삭제
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
					dataKey: 'saveApprovalList',
					apiUrl: '/api/st/adjustmentreqeust/v1.0/cancelAdjustmentApproval',
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
		}, []);

		useEffect(() => {
			const gridRefCur = ref.gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(props.data);
				gridRefCur?.setSelectionByIndex(0, 0);
			}
		}, [props.data]);

		return (
			<>
				<AGrid>
					<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
					<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				<CmSearchWrapper ref={refModal} />
				<CustomModal ref={refLoopModal} width="1000px">
					<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
				</CustomModal>
			</>
		);
	},
);

export default StAdjustmentReqeustExDCApprovalDetail;
