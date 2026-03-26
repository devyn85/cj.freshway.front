/*
 ############################################################################
 # FiledataField	: QuickMonCloseDetail.tsx
 # Description		: 출고 > 출고작업 > 퀴배송상세(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################


 저장 saveMasterList

정산데이터 수신 처리 saveMasterReveiveList

 마감 처리 saveMasterCloseList


*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import {
	apiPostSaveMasterCloseList,
	apiPostSaveMasterList,
	apiPostsaveMasterReveiveList,
} from '@/api/wd/apiWdQuickMonClose';
import { Datepicker } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
// Utils
// Redux
// API Call Function

const QuickMonCloseDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, clearAllGridData } = props; // Antd Form
	const refModal = useRef(null);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);
	const [formRef] = Form.useForm();
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);
	const [isFirstRowClosed, setIsFirstRowClosed] = useState(false); // 첫 번째 행 마감 여부

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.sttlCloseYn, 'N') == 'Y') {
			// 정산마감여부 되었으면 이상은 편집 불가
			return true;
		}

		// API로 수신된 데이터는 편집 불가 - API: 퀵배송업체에서 수신된 데이터
		if (item?.dataFlag == 'API') {
			return true;
		}
		return false;
	};

	/**
	 * 그리드 데이터 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef.current;
		if (!gridRef) return;

		// START.rowStatus 처리
		// 체크된 행 + 삭제된 행(rowStatus === 'D') 모두 포함
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		const removedItems = gridRef.getRemovedItems(); // 삭제된 행
		const removedUidSet = new Set<string>((removedItems || []).map((ri: any) => ri.item?._$uid ?? ri._$uid));
		// 체크된 데이터 중 삭제된 행은 rowStatus='D'로, 신규행은 'I'로, 수정된 행은 'U'로 세팅
		const saveList = (checkedRows || []).map((ci: any) => {
			const it = ci.item ?? ci;
			if (removedUidSet.has(it._$uid) || it.delYn === 'Y' || it.rowStatus === 'D') {
				return { ...it, rowStatus: 'D', delYn: it.delYn ?? 'Y' };
			}
			// 신규 행 체크 (rowStatus가 'I'이거나 기존에 없던 행)
			if (it.rowStatus === 'I') {
				return { ...it, rowStatus: 'I' };
			}
			return { ...it, rowStatus: 'U' };
		});
		// END.rowStatus 처리

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// validation
		if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				saveList: saveList,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	/**
	 * 마감 처리
	 */
	const saveMasterCloseList = async () => {
		const gridRef = ref.gridRef.current;
		if (!gridRef) return;

		// 체크된 행 가져오기
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();

		showConfirm(
			null,
			formRef.getFieldValue('sttlYm')?.format('YYYY-MM') +
				(isFirstRowClosed ? t('의 실적을 마감취소를 처리하시겠습니까?') : t('의 실적을 마감을 처리하시겠습니까?')),
			() => {
				const params = {
					sttlYm: formRef.getFieldValue('sttlYm')?.format('YYYYMM') ?? '', // 정산월
					isClosedYn: isFirstRowClosed ? 'Y' : 'N', //  마감 여부
				};

				apiPostSaveMasterCloseList(params).then(res => {
					if (res.statusCode === 0) {
						showAlert(null, t('msg.save1')); // 저장되었습니다
						props.search();
					}
				});
			},
		);
	};

	/**
	 * 정산데이터 수신 처리
	 */
	const saveMasterReveiveList = async () => {
		showConfirm(null, t('정산 데이터를 수신하시겠습니까?'), () => {
			const sttlYmDate = formRef.getFieldValue('sttlYm');

			// 마감월 = 전월26일~당월25일
			const dt1 = sttlYmDate.subtract(1, 'month').date(26).format('YYYY-MM-DD'); // 전월 26일
			const dt2 = sttlYmDate.date(25).format('YYYY-MM-DD'); // 당월 25일

			const params = {
				...form.getFieldsValue(),
				currentPage: 1,
				limit: 1000,
				dt1: dt1,
				dt2: dt2,
				sttlYm: sttlYmDate.format('YYYYMM') ?? '', // 정산월
			};

			// 기존 방식(전체 데이터 한번에 저장)
			// apiPostsaveMasterReveiveList(params).then(res => {
			// 	if (res.statusCode === 0) {
			// 		showAlert(null, t('msg.save1')); // 저장되었습니다
			// 		props.search();
			// 	}
			// });

			saveMasterReveiveListImp(params);
		});
	};

	// 저장 처리 구현 함수
	const saveMasterReveiveListImp = (params: any, totalProcessCnt = 0) => {
		apiPostsaveMasterReveiveList(params).then(res => {
			// 페이지 정보
			const totalCount = res.data.totalCount;
			const totalPage = res.data.totalPage;
			const currentPage = res.data.currentPage;

			setTotalCount(totalCount);
			setTotalPage(totalPage);
			setCurrentPage(currentPage);

			// processCnt 누적
			const accumulatedCnt = totalProcessCnt + (res.data?.processCnt || 0);

			if (currentPage < totalPage) {
				saveMasterReveiveListImp({ ...params, currentPage: (currentPage ?? 1) + 1 }, accumulatedCnt);
			} else {
				if (res.statusCode === 0) {
					showAlert(null, `총 ${accumulatedCnt}건 처리되었습니다`);
					props.search();
				}
			}
		});
	};

	/**
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	/**
	 * 퀵 주문상탱 스타일 함수 - 상태명 컬럼
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 */
	const styleBackGround02 = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		const status = item?.orderState ?? '';
		if (status === '취소') return 'gc-user50'; // 취소(회색)
		return '';
	};

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'dataFlag',
			headerText: t('데이터구분'),
			headerTooltip: {
				show: true,
				tooltipHtml:
					'- WMS/API : WMS에 등록된 데이터이면서 퀵배송업체에서 수신된 데이터<br>- WMS : WMS에 등록된 데이터<br>- API : 퀵배송업체에서 수신된 데이터<br>',
			},
			width: 80,
			editable: false,
		},
		{ dataField: 'quickDate', headerText: t('접수일시'), width: 140, editable: false },
		{ dataField: 'reservedate', headerText: t('예약일시'), width: 140, editable: false },
		{ dataField: 'status', headerText: t('진행상태코드'), width: 100, visible: false, editable: false },
		{ dataField: 'statusnm', headerText: t('진행상태'), width: 120, styleFunction: styleBackGround02, editable: false },
		{ dataField: 'quickDocno', headerText: t('퀵주문번호'), width: 150, editable: false },
		// 요청자정보
		{ dataField: 'reqDepartmentnm', headerText: t('접수부서'), width: 120, editable: false },
		{ dataField: 'reqId', headerText: t('요청자ID'), width: 100, visible: false, editable: false },
		{ dataField: 'reqNm', headerText: t('요청자'), width: 100, editable: false },
		{ dataField: 'vocno', headerText: t('VOC번호'), width: 120, editable: false },
		{
			dataField: 'respDept',
			headerText: t('귀책부서'), // 귀책부서
			width: 120,
			dataType: 'code',
			required: true,
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('RESP_DEPT_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef.current.removeEditClass(columnIndex); // 편집 가능 class 삭제
				} else {
					return 'isEdit'; // 편집 가능 class 추가
				}
			},
		},
		{
			dataField: 'respReason',
			headerText: t('귀책사유'), // 귀책사유
			width: 120,
			dataType: 'code',
			required: true,
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('RESP_REASON_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'respEmp',
			headerText: t('귀책담당자'), // 귀책담당자
			width: 120,
			dataType: 'code',
			editable: true,
			maxlength: 20,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef.current.removeEditClass(columnIndex); // 편집 가능 class 삭제
				} else {
					return 'isEdit'; // 편집 가능 class 추가
				}
			},
		},
		{
			headerText: t('퀵업체 정보'), // 퀵업체 정보
			children: [
				{ dataField: 'apiQuickDocno', headerText: t('퀵주문번호'), width: 150, editable: false },
				{ dataField: 'apiRespDeptnm', headerText: t('귀책부서'), width: 120, dataType: 'code', editable: false },
				{ dataField: 'apiRespReasonnm', headerText: t('귀책사유'), width: 120, dataType: 'code', editable: false },
				{ dataField: 'apiRespEmp', headerText: t('귀책담당자'), width: 120, dataType: 'code', editable: false, maxlength: 20 },
			],
		},
		{ dataField: 'gthSeq', headerText: t('집하지방문순서'), width: 80, dataType: 'numeric', style: 'aui-right', editable: false },
		{ dataField: 'gthCd', headerText: t('집하지코드'), width: 100, editable: false },
		{ dataField: 'gthNm', headerText: t('집하지명'), width: 150, editable: false },
		{ dataField: 'gthAddr', headerText: t('집하지주소'), width: 250, editable: false },
		{ dataField: 'gthAddrdtl', headerText: t('집하지상세주소'), width: 200, editable: false },
		{ dataField: 'gthEmpNm', headerText: t('집하지담당자'), width: 100, editable: false },
		{ dataField: 'gthTel', headerText: t('집하지연락처'), width: 120, editable: false },
		// 배송정보
		{
			dataField: 'deliverytype',
			headerText: t('배송방법'),
			width: 100,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DOC_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		{
			dataField: 'deliveryMethod',
			headerText: t('배송수단'),
			width: 100,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('KIND_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		{
			dataField: 'deliveryOption',
			headerText: t('배송선택'),
			width: 100,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DELIVERY_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		{
			dataField: 'articleType',
			headerText: t('물품종류'),
			width: 100,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('ITEMTYPE_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		{
			dataField: 'payType',
			headerText: t('지급구분'),
			width: 100,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('PAYGBN_QUICK', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
		},
		// 요금정보
		{ dataField: 'basicCost', headerText: t('기본요금'), width: 100, dataType: 'numeric', formatString: '#,##0', style: 'aui-right', editable: false },
		{ dataField: 'addCost', headerText: t('추가요금'), width: 100, dataType: 'numeric', formatString: '#,##0', style: 'aui-right', editable: false },
		{ dataField: 'deliveryCost', headerText: t('탁송요금'), width: 100, dataType: 'numeric', formatString: '#,##0', style: 'aui-right', editable: false },
		{ dataField: 'totalAmount', headerText: t('지급금액'), width: 120, dataType: 'numeric', formatString: '#,##0', style: 'aui-right', editable: false },
		// 정산정보
		{ dataField: 'storerkey', headerText: t('고객사코드'), width: 100, visible: false, editable: false },
		{ dataField: 'dccode', headerText: t('물류센터'), width: 100, dataType: 'code', editable: false },
		{ dataField: 'sttlYm', headerText: t('정산월'), dataType: 'code', width: 80, editable: false },
		{ dataField: 'sttlCloseYn', headerText: t('정산마감여부'), dataType: 'code', width: 100, editable: false },
		{ dataField: 'sttlCloseDate', headerText: t('정산마감일시'), width: 140, editable: false },
	];

	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		independentAllCheckBox: false,
		// 헤더 전체체크 숨김
		//showRowAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: true,
		fixedColumnCount: 2,
		enableCellMerge: true, // 셀 병합 실행
		// 행 체크 칼럼(엑스트라 체크박스)의 병합은 rcptNo 필드와 동일하게 병합 설정
		rowCheckMergeField: 'rcptNo',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// FooterLayout Props
	const footerLayout: any[] = [];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1' as const, // 수신
				btnLabel: t('정산데이터수신'), // 수신
				authType: 'save', // 권한
				callBackFn: saveMasterReveiveList,
			},
			{
				btnType: 'btn2' as const, // 저장
				btnLabel: t('정보저장'), // 정보저장
				authType: 'save', // 권한
				callBackFn: saveMasterList,
			},
			{
				btnType: 'save' as const, // 마감
				btnLabel: isFirstRowClosed ? t('월마감 취소') : t('월마감'), // 월마감 / 월마감 취소
				authType: 'save', // 권한
				callBackFn: saveMasterCloseList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);

				// 첫 번째 행의 sttlCloseYn 확인
				const firstRow = props.data[0];
				if (firstRow?.sttlCloseYn === 'Y') {
					setIsFirstRowClosed(true);
				} else {
					setIsFirstRowClosed(false);
				}
			}
		}
	}, [props.data]);

	useEffect(() => {
		// 요청월을 당월로 설정
		formRef.setFieldValue('sttlYm', dayjs());
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={formRef} layout="inline">
						<li>
							<Datepicker
								label={t('정산월')} // 정산월
								name="sttlYm"
								format="YYYY-MM"
								picker="month"
								span={24}
								allowClear
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
								onChange={() => {
									// 기준월 변경 시 모든 그리드 데이터 초기화
									//if (props.clearAllGridData) {
									//	props.clearAllGridData();
									//}
								}}
							/>
						</li>
					</Form>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default QuickMonCloseDetail;
