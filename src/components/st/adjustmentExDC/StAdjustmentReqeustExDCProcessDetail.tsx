/*
 ############################################################################
 # FiledataField	: StAdjustmentRequeStExDCDetail.tsx
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
import { getCommonCodeListByData } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import dateUtil from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

interface StAdjustmentReqeustExDCProcessDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
	detailForm: any;
}

const StAdjustmentReqeustExDCProcessDetail = forwardRef(
	(props: StAdjustmentReqeustExDCProcessDetailProps, ref: any) => {
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
			{ dataField: 'checkyn', headerText: '선택', type: 'checkbox', editable: false },
			{ dataField: 'approvalreqno', headerText: '품의요청번호', editable: false },
			{ dataField: 'approvalno', headerText: '전자문서번호', editable: false },
			{ dataField: 'approvaldate', headerText: '전자문서시간', dataType: 'date', editable: false },
			{ dataField: 'approvalstatusname', headerText: '결재진행상태', editable: false },
			{ dataField: 'statusaj', headerText: '처리상태', editable: false },
			{ dataField: 'slipdt', headerText: '조정일자', editable: false },
			{ dataField: 'dccode', headerText: '물류센터', editable: false },
			{ dataField: 'organize', headerText: '창고', editable: false },
			{ dataField: 'stocktype', headerText: '재고위치(코드)', editable: false },
			{ dataField: 'stocktypenm', headerText: '재고위치(명칭)', editable: false },
			{ dataField: 'stockgrade', headerText: '재고속성(코드)', editable: false },
			{ dataField: 'stockgradename', headerText: '재고속성(명칭)', editable: false },
			{ dataField: 'zone', headerText: '피킹존', editable: false },
			{ dataField: 'loc', headerText: '로케이션', editable: false },
			{ dataField: 'sku', headerText: '상품정보(상품코드)', editable: false },
			{ dataField: 'skuname', headerText: '상품정보(상품명칭)', editable: false },
			{ dataField: 'uom', headerText: '단위', editable: false },
			{ dataField: 'tranqty', headerText: '조정수량', dataType: 'numeric', editable: true },
			{
				dataField: 'reasoncode',
				headerText: '발생사유',
				width: 120,
				dataType: 'code',
				required: true,
				renderer: {
					// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
					type: 'DropDownListRenderer',
					list: getCommonCodeListByData('REASONCODE_AJAJ', null, null, null, '2170', ''),
					keyField: 'comCd', // key 에 해당되는 필드명
					valueField: 'cdNm',
				},
			},
			{ dataField: 'reference01', headerText: '발생사유', editable: false },
			{ dataField: 'avgweight', headerText: '박스환산정보(평균중량)', dataType: 'numeric', editable: false },
			{ dataField: 'calbox', headerText: '박스환산정보(환산박스)', dataType: 'numeric', editable: false },
			{ dataField: 'realorderbox', headerText: '박스환산정보(실박스예정)', dataType: 'numeric', editable: false },
			{ dataField: 'realcfmbox', headerText: '박스환산정보(실박스확정)', dataType: 'numeric', editable: false },
			{ dataField: 'tranboxqty', headerText: '박스환산정보(작업박스수량)', dataType: 'numeric', editable: false },
			{ dataField: 'processmain', headerText: '귀책', editable: false },
			{ dataField: 'other03', headerText: '물류귀책배부', editable: false },
			{
				headerText: '귀속부서',
				children: [
					{
						dataField: 'costcd',
						headerText: '귀속부서',
						width: 109,
						dataType: 'text',
						required: true,
						editable: true,
						commRenderer: {
							type: 'search',
							onClick: function (e: any) {
								refModal.current.open({
									gridRef: ref.gridRef,
									rowIndex: e.rowIndex,
									dataFieldMap: { costcd: 'code', costcdname: 'name' },
									popupType: 'costCenter',
								});
							},
						},
					},
					{ dataField: 'costcdname', headerText: '귀속부서명', width: 156, dataType: 'text', editable: false },
				],
			},
			{
				headerText: '거래처',
				children: [
					{
						dataField: 'custkey',
						headerText: '거래처',
						width: 109,
						dataType: 'text',
						required: true,
						editable: true,
						commRenderer: {
							type: 'search',
							onClick: function (e: any) {
								refModal.current.open({
									gridRef: ref.gridRef,
									rowIndex: e.rowIndex,
									dataFieldMap: { custkey: 'code', custname: 'name' },
									popupType: 'cust',
								});
							},
						},
					},
					{ dataField: 'custname', headerText: '인도처명', width: 156, dataType: 'text', editable: false },
				],
			},
			{ dataField: 'neardurationyn', headerText: '유통기한임박여부', editable: false },
			{
				headerText: '기준일',
				children: [
					{ dataField: 'fromvaliddt', headerText: '유통기준일', dataType: 'text', editable: false },
					{ dataField: 'tovaliddt', headerText: '제조기준일', dataType: 'text', editable: false },
				],
			},
			{ dataField: 'durationterm', headerText: '유통기간(잔여/전체)', editable: false },
			{
				headerText: '상품이력정보',
				children: [
					{ dataField: 'serialno', headerText: '이력번호', editable: false },
					{ dataField: 'barcode', headerText: '바코드', editable: false },
					{ dataField: 'blno', headerText: 'B/L번호', editable: false },
					{ dataField: 'butcherydt', headerText: '도축일자', editable: false },
					{ dataField: 'factoryname', headerText: '도축장', editable: false },
					{ dataField: 'contracttype', headerText: '계약유형', editable: false },
					{ dataField: 'contractcompany', headerText: '계약업체', editable: false },
					{ dataField: 'contractcompanyname', headerText: '계약업체명', editable: false },
					{ dataField: 'adddate', headerText: '등록일자', dataType: 'date', editable: false },
					{
						dataField: 'addwho',
						headerText: '생성인',
						editable: false,
						dataType: 'manager',
						manager: 'addwho',
					},
				],
			},
			{ dataField: 'lot', headerText: 'LOT', editable: false },
			{ dataField: 'stockid', headerText: 'STOCKID', editable: false },
			{ dataField: 'area', headerText: 'AREA', editable: false },
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
			{ dataField: 'iotype', headerText: '입출고타입', visible: false },
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
		 * 감모 처리 저장
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

			for (const element of checkedRows) {
				const row = element.item;

				if (row.approvalstatus !== '3') {
					alert('최종결재완료건만 처리 가능합니다.'); // 또는 사용자 정의 메시지 함수 사용
					ref.gridRef?.current.setFocusedCell(element.rowIndex, 'CHECKYN');
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
					dataKey: 'adjustmentProcessList',
					apiUrl: '/api/st/adjustmentreqeust/v1.0/saveAdjustmentProcessList',
					apprreqdt: dayjs(detailFormData.apprreqdt).format('YYYYMMDD'),
					...detailFormData,
					saveProcessList: checkedRows, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				refLoopModal.current.handlerOpen();
			});
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

			// userAuthInfo 배열 내에 관리자 권한("00", "05")이 있는지 체크
			if (
				userAuthInfo.roles?.includes('00') ||
				userAuthInfo.roles?.includes('05') ||
				userAuthInfo.roles?.includes('000') ||
				userAuthInfo.roles?.includes('010')
			) {
				for (const element of checkedRows) {
					const row = element.item;

					if (row.approvalstatus !== '3') {
						alert('최종결재완료건만 처리 가능합니다.'); // 또는 사용자 정의 메시지 함수 사용
						ref.gridRef?.current.setFocusedCell(element.rowIndex, 'CHECKYN');
						return;
					}
				}
			}

			showConfirm(null, '삭제하시겠습니까??', () => {
				const form = props.form.getFieldsValue();
				const params = {
					dataKey: 'saveApprovalList',
					apiUrl: '/api/st/adjustmentreqeust/v1.0/cancelAdjustmentApproval',
					...form,
					saveProcessList: checkedRows, // 선택된 행의 데이터
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
					btnType: 'save', // 저장
					callBackFn: saveMaster,
				},
				// {
				// 	btnType: 'excelUpload', // 엑셀업로드
				// },
				{
					btnType: 'btn1', // 삭제
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
				props.detailForm.resetFields();
				ref.gridRef.current.clearGridData();
			},
			isChangeForm: () => props.detailForm.getFieldValue('rowStatus') === 'U',
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

export default StAdjustmentReqeustExDCProcessDetail;
