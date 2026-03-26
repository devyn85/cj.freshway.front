/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenterDetail4.tsx
 # Description		: 재고 > 재고현황 > 전자결재(4/5)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiSaveElectApproval } from '@/api/st/apiStDisuseRequestCenter';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import Datepicker from '@/components/common/custom/form/Datepicker';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
// Utils
import commUtil from '@/util/commUtil';
import extUtil from '@/util/extUtil';
// API Call Function

const StDisuseRequestCenterDetail4 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKey, formRef, setNoElectApprovalList } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refLoopModal = useRef(null);

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
		// 값이 없으면 ''가 아니고 null임
		//alert(commUtil.nvl(item.status, ''));
		// if (commUtil.nvl(item?.status, '00') == '30') {
		// 	// 30:요청 상태일 때만 편집 가능
		// 	return false;
		// }
		return false;
	};

	/**
	 * 스타일 함수
	 * @param rowIndex 행 인덱스
	 * @param columnIndex 열 인덱스
	 * @param value 셀 값
	 * @param headerText 헤더 텍스트
	 * @param item 데이터 항목
	 * @returns 스타일 객체
	 */
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		//return item.processflag === 'E' ? { backgroundColor: 'darkorange' } : {};
		return {};
	};
	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), // 물류센터
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), // 조직
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'planorder',
			headerText: '계획오더', // 계획오더
			width: 0,
			editable: false,
			dataType: 'code',
			align: 'center',
			visible: false,
			styleFunction,
		},
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'center',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명
					width: 320,
					editable: false,
					dataType: 'name',
					align: 'left',
					autosizing: 'keep',
					styleFunction,
					disableMoving: true,
				},
			],
		},
		{ dataField: 'seq', headerText: t('lbl.SEQ'), width: 80, dataType: 'code', editable: false }, // SEQ
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장유형
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'inquirytypename',
			headerText: t('lbl.APPROVALTYPE'), // 승인유형
			width: 80,
			editable: false,
			dataType: 'name',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'costcentername',
			headerText: t('lbl.COSTCENTERNAME'), // 코스트센터명
			width: 80,
			editable: false,
			dataType: 'name',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'approvalreasonname',
			headerText: t('lbl.APPROVALREASONNAME'), // 승인사유명
			width: 80,
			editable: false,
			dataType: 'name',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'), // 단위
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.QTY'), // 수량
			width: 80,
			editable: true,
			dataType: 'numeric',
			align: 'right',
			styleFunction,
		},
		{
			dataField: 'purchaseprice',
			headerText: t('lbl.AMT'), // 금액
			width: 79,
			editable: false,
			dataType: 'numeric',
			align: 'right',
			formatString: '#,##0',
			styleFunction,
		},
		{
			dataField: 'stockamtmsg',
			headerText: t('lbl.REASON'), // 사유
			width: 80,
			editable: false,
			dataType: 'name',
			align: 'left',
			styleFunction,
		},
		//
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 유통기한임박여부
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
			styleFunction,
		},
		{
			headerText: t('lbl.MANUFACTUREDT'),
			dataField: 'manufacturedt', // 제조일자
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'),
			dataField: 'expiredt', // 소비일자
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATION_TERM'), // 유효기간-소비기간(잔여/전체)
			dataField: 'durationTerm',
			dataType: 'code',
			formatString: 'yyyy-mm-dd',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'), // 소비기한잔여(%)
			dataField: 'usebydatefreert',
			dataType: 'numeric',
			filter: { showIcon: true },
			formatString: '#,##0',
		},
		// END.제조일자/소비일자/유효기간/소비기한잔여(%)
		//
		{
			dataField: 'memo2',
			headerText: '비고(사유)', // 비고(사유)
			width: 120,
			editable: false,
			dataType: 'name',
			align: 'left',
			styleFunction,
		},
		{
			headerText: t('lbl.SERIALINFO'), // 시리얼정보
			children: [
				{
					dataField: 'serialnoOrg',
					headerText: t('lbl.SERIALNO'), // 시리얼번호
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), // 바코드
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), // BL번호
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), // 도축일
					width: 80,
					editable: false,
					dataType: 'date',
					align: 'center',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), // 공장명
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), // 계약유형
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), // 계약회사
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약회사명
					width: 80,
					editable: false,
					dataType: 'name',
					align: 'left',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), // 유효시작일
					width: 80,
					editable: false,
					dataType: 'date',
					align: 'center',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), // 유효종료일
					width: 80,
					editable: false,
					dataType: 'date',
					align: 'center',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'statusnm',
					headerText: '상태', // 상태
					dataType: 'string',
					editable: false,
					disableMoving: true,
				},
				{
					dataField: 'rmk',
					headerText: t('lbl.REMARK'), // 비고
					dataType: 'name',
					width: 300,
				},
				/*START.hidden 컬럼*/
				{ dataField: 'status', editable: false, visible: false }, // 상태

				{ dataField: 'toRespDeptCd', visible: false }, // 변경귀속부서코드
				{ dataField: 'chgCustkey', visible: false }, // 변경거래처코드

				{ dataField: 'serialkey', visible: false }, // serialkey
				{ dataField: 'disuseDiv', visible: false }, // 폐기구분
				{ dataField: 'disuseDivNm', visible: false }, // 폐기구분명
				{ dataField: 'storerkey', visible: false }, // 화주코드
				{ dataField: 'area', visible: false }, // 구역
				{ dataField: 'docdt', visible: false }, // 문서일자
				{ dataField: 'docno', visible: false }, // 문서번호
				{ dataField: 'docline', visible: false }, // 문서라인
				{ dataField: 'slipdt', visible: false }, // 전표일자
				{ dataField: 'slipno', visible: false }, // 전표번호
				{ dataField: 'slipline', visible: false }, // 전표라인
				{ dataField: 'sliptype', visible: false }, // 전표유형
				{ dataField: 'openqty', visible: false }, // 가용수량
				{ dataField: 'tranqty', visible: false }, // 조정수량
				{ dataField: 'ordertype', visible: false }, // 오더유형
				{ dataField: 'iotype', visible: false }, // 입출유형
				{ dataField: 'duration', visible: false }, // 유통기한기간
				{ dataField: 'durationtype', visible: false }, // 유통기한구분
				{ dataField: 'price', visible: false }, // 단가
				{ dataField: 'weight', visible: false }, // 중량
				{ dataField: 'reasoncode', visible: false }, // 사유코드
				{ dataField: 'other04', visible: false }, // 기타4
				{ dataField: 'other02', visible: false }, // 기타2
				{ dataField: 'serialno', visible: false }, // 시리얼번호
				{ dataField: 'poline', visible: false }, // PO라인
				{ dataField: 'storageloc', visible: false }, // 재고위치명
				{ dataField: 'qty', visible: false }, // 수량
				{ dataField: 'other03', visible: false }, // 기타3
				{ dataField: 'loc', visible: false }, // 로케이션
				{ dataField: 'lot', visible: false }, // 로트
				{ dataField: 'stockgrade', visible: false }, // 재고등급
				{ dataField: 'stockid', visible: false }, // 재고ID
				{ dataField: 'serialtype', visible: false }, // 시리얼타입
				{ dataField: 'kitSku', visible: false }, // 키트상품코드
				/*END.hidden 컬럼*/
			],
		},
	];

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		isLegacyRemove: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			} else if (item.chkamt !== 'S') {
				return 'color-danger';
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	/**
	 * 전자결재
	 */
	const saveElectApprovalCallback = () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// stockamt가 0인 데이터 제거
		const newDataList = checkedRows.filter(({ stockamt }: { stockamt: string }) => stockamt !== '0');

		// 결재하시겠습니까?
		showConfirm(null, '결재하시겠습니까?', () => {
			const params = {
				avc_DCCODE: props.fixdccode,
				temptabletype: 'AJ',
				processtype: 'AJ_APPROVAL',
				avc_COMMAND: 'APPROVAL_DU', // AJ_APPROVAL_DU	:	폐기결재
				requestMm: formRef.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
				callFrom: '1', // 호출구분(1:재고폐기요청)
				saveElectApprovalList: checkedRows.map((item: any) => ({
					...item.item,
					rowStatus: 'U', // 저장 시 변경됨 상태로 전송
				})),
			};

			apiSaveElectApproval(params).then(res => {
				if (res.statusCode > -1) {
					props.setNoElectApprovalList(); // 전자결재 요청된 건을 filtering 해서 보여지지 않도록 변경
					openElectApproval(res.data.returnMessage); // 전자결재 호출
				}
			});
		});
	};

	/**
	 * 전자결재 open
	 * @param xmlVal XML 문자열
	 * @param returnMessage
	 */
	const openElectApproval = (returnMessage: string) => {
		// xmlVal 유효성 체크
		if (!returnMessage || typeof returnMessage !== 'string' || returnMessage.trim() === '') {
			showAlert(null, '전자결재 정보가 올바르지 않습니다.');
			return;
		}

		try {
			// 필수 요소들 존재 여부 체크
			const approvalReqDt = commUtil.gfnGetParameter('SELECT', returnMessage, 'APPROVALREQDT', '');
			const approvalReqNo = commUtil.gfnGetParameter('SELECT', returnMessage, 'APPROVALREQNO', '');
			const ssoId = commUtil.gfnGetParameter('SELECT', returnMessage, 'SSOID', '');

			if (!approvalReqDt || !approvalReqNo || !ssoId) {
				showAlert(null, '필수 전자결재 정보가 누락되었습니다.');
				return;
			}

			let formId = 'SCM08'; // 기본값
			const systemID = 'SCM'; // 기본값

			if (props.fixdccode === '1000') {
				// KX센터
				formId = 'SCM09'; // SCM04 -> SCM09 변경(25.10.11)
			} else {
				formId = 'SCM07'; // SCM02 -> SCM07 변경(25.10.11)
			}

			const params = {
				formSerial: formId,
				systemID: systemID,
				DATA_KEY1: approvalReqDt, // PG에서 생성
				DATA_KEY2: approvalReqNo, // PG에서 생성
				OTU_ID: ssoId,
			};

			extUtil.openApproval(params);
		} catch (error) {
			showAlert(null, '전자결재 처리 중 오류가 발생했습니다.');
		}
	};

	/**
	 * 삭제
	 */
	const deleteMasterList = async () => {
		const gridRef = ref.gridRef.current;

		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const form = props.form.getFieldsValue();
		showConfirm(null, '삭제하시겠습니까??', () => {
			const params = {
				apiUrl: '/api/st/disuseRequestCenter/v1.0/deleteMasterList',
				avc_COMMAND: 'APPROVAL_CANCELDU',
				dataKey: 'saveElectApprovalList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			refLoopModal.current.handlerOpen();
		});
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3', // 삭제
				callBackFn: deleteMasterList,
			},
			{
				btnType: 'elecApproval', // 전자결재
				callBackFn: saveElectApprovalCallback,
			},
			,
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
			}
		}
	}, [props.data]);

	useEffect(() => {
		// 요청월을 당월로 설정
		formRef.setFieldValue('requestMm', dayjs());
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 요청처리결과 */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />

				<UiDetailViewArea>
					<Form form={formRef}>
						<UiDetailViewGroup>
							<li>
								<Datepicker
									label={t('lbl.BASEMONTH')}
									name="requestMm" // 요청월
									//defaultValue={dates} // 초기값 설정
									format="YYYY-MM"
									picker="month"
									span={24}
									allowClear
									showNow={false}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									onChange={() => {
										// 기준월 변경 시 모든 그리드 데이터 초기화
										if (props.clearAllGridData) {
											props.clearAllGridData();
										}
									}}
								/>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StDisuseRequestCenterDetail4;
