/*
 ############################################################################
 # FiledataField	: TmTrxCalculationReportDetail.tsx
 # Description		: 운송비정산서
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.10
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import TmTrxCalculationSendemailPopup from '@/components/tm/trxCalculationReport/TmTrxCalculationSendemailPopup';

// API

interface TmTrxCalculationReportDetailProps {
	gridData: any;
	totalCount: any;
	workDay: any;
	callBackFn: any;
	form: any;
}

const TmTrxCalculationReportDetail = forwardRef((props: TmTrxCalculationReportDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();

	// 메일발송  팝업용 Ref
	const refSendemailModal = useRef(null);

	// 물류센터
	const fixdccode = Form.useWatch('fixdccode', props.form);
	// 운송사 코드
	const courier = Form.useWatch('courier', props.form);
	// 운송사 명
	const courierName = Form.useWatch('courierName', props.form);
	// 조회 기간
	const slipdtRange = Form.useWatch('slipdtRange', props.form);

	// 그리드 컬럼을 설정
	const gridCol = [
		{
			dataField: 'courierName',
			headerText: t('lbl.CARRIER'), //운송사(운송사)
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'slaveCourierName',
			headerText: t('lbl.SLAVE_COURIER'), //2차운송사(2차운송사)
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'sttlTypeName',
			headerText: t('lbl.STTL_TYPE'), //정산구분-배송,수송,조달,...
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'contracttypeName',
			headerText: t('lbl.CONTRACTTYPE'), //차량유형(계약유형)
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'), //차량번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'driverName',
			headerText: t('lbl.DRIVERNAME'), //기사
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tonName',
			headerText: t('lbl.CARCAPACITY'), //톤급
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'closetypeName',
			headerText: t('lbl.CLOSETYPE'), //마감유형
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverydaycnt',
			headerText: t('lbl.DELIVERYDAYCNT'), //운행일수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'weightKg',
			headerText: t('lbl.DELIVERYWEIGHT'), //물량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.DESTINATION'), //착지
			children: [
				{
					dataField: 'ctrngDestCnt',
					headerText: t('lbl.FS'), //급식
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'dinoutDestCnt',
					headerText: t('lbl.FB'), //외식
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'totDestCnt',
					headerText: t('lbl.SUB_SUM'), //계
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			dataField: 'sttlAmount',
			headerText: t('lbl.STTLAMOUNT'), //정산금액
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'baseAmount',
			headerText: t('lbl.BASEPAY'), //기본급
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'procureAllowance',
			headerText: t('lbl.PROCURE'), //조달
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'feeAmount',
			headerText: t('lbl.CHARGE_FEE'), //수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			headerText: t('lbl.STOPDRIVE'), //결행
			children: [
				{
					dataField: 'penaltyAmount',
					headerText: t('lbl.PENALTY'), //패널티
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'altAmount',
					headerText: t('lbl.ALTER_VEHICLE'), //대체차량
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			dataField: 'unpaidAmount',
			headerText: t('lbl.HOLIDAYXPAY'), //무급휴무
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			headerText: t('lbl.OVERTIMEWORK'), //특근
			children: [
				{
					dataField: 'inspectAllowance',
					headerText: t('lbl.INSPECTION'), //검사
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'educationAllowance',
					headerText: t('lbl.EDUCATION'), //교육
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'holidayAllowance',
					headerText: t('lbl.HOLIDAY'), //휴일
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			headerText: t('lbl.BENEFIT'), //수당
			children: [
				{
					dataField: 'roundAllowance',
					headerText: t('lbl.DELIVERY_ROT'), //지입회전
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'subdriverAllowance',
					headerText: t('lbl.ASSISTANT'), //보조원
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'bossAllowance',
					headerText: t('lbl.GROUPLEADER'), //조장
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'distanceAllowance',
					headerText: t('lbl.DISTANT_LONG'), //격오지/장거리
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'diffcultAllowance',
					headerText: t('lbl.UNLOAD_DIFFICULTY'), //하차난이도
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'faceAllowance',
					headerText: t('lbl.FACE_TO_FACE_INSPECTION'), //대면검수/납품대기
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'kidsAllowance',
					headerText: t('lbl.KIDS_CATEGORY'), //키즈분류
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			headerText: t('lbl.BUSINESS_EXPENSES'), //업무비
			children: [
				{
					dataField: 'tollCharge',
					headerText: t('lbl.TOLLFEE'), //통행료
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'parkingCharge',
					headerText: t('lbl.PARKING_FEE'), //주차비
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'washCharge',
					headerText: t('lbl.CARWASH_FEE'), //세차비
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			headerText: t('lbl.INCENTIVE'), //인센티브
			children: [
				{
					dataField: 'weigthIncentive',
					headerText: t('lbl.DELIVERYWEIGHT'), //물량(물동)
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'destIncentive',
					headerText: t('lbl.DESTINATION'), //착지
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'distanceIncentive',
					headerText: t('lbl.DISTANCE'), //거리
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'zoneIncentive',
					headerText: t('lbl.DISTRICTMOVE'), //권역이동
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			headerText: t('lbl.DEDUCTION'), //공제
			children: [
				{
					dataField: 'disuseDeduction',
					headerText: t('lbl.DISUSE_DEDUCTION'), //폐기공제
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
				{
					dataField: 'quickDeduction',
					headerText: t('lbl.QUICK_DEDUCTION'), //퀵공제
					dataType: 'numeric',
					editable: false,
					formatString: '#,###',
				},
			],
		},
		{
			dataField: 'newcarIncentive',
			headerText: t('lbl.NEW_CAR_SUBSIDY'), //신차지원금
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'communicationExpense',
			headerText: t('lbl.COMMUNICATION_EXPENSE'), //통신비
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'fuelExpense',
			headerText: t('lbl.GASBILL'), //유류비
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'retroactiveExpense',
			headerText: t('lbl.RETROACTIVE_PAY'), //정산누락 및 소급분
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
		{
			dataField: 'etcAllowance',
			headerText: t('lbl.ETC'), //기타
			dataType: 'numeric',
			editable: false,
			formatString: '#,###',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		//showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.gridRef.current?.exportToXlsxGrid(params);
		},
	};

	// 그리드 푸터 레이아웃 설정
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), //합계
			positionField: 'closetypeName',
		},
		{
			dataField: 'sttlAmount',
			positionField: 'sttlAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'baseAmount',
			positionField: 'baseAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'procureAllowance',
			positionField: 'procureAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'feeAmount',
			positionField: 'feeAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'penaltyAmount',
			positionField: 'penaltyAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'altAmount',
			positionField: 'altAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'unpaidAmount',
			positionField: 'unpaidAmount',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'inspectAllowance',
			positionField: 'inspectAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'educationAllowance',
			positionField: 'educationAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'holidayAllowance',
			positionField: 'holidayAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'roundAllowance',
			positionField: 'roundAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'subdriverAllowance',
			positionField: 'subdriverAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'bossAllowance',
			positionField: 'bossAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'distanceAllowance',
			positionField: 'distanceAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'diffcultAllowance',
			positionField: 'diffcultAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'faceAllowance',
			positionField: 'faceAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'kidsAllowance',
			positionField: 'kidsAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'tollCharge',
			positionField: 'tollCharge',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'parkingCharge',
			positionField: 'parkingCharge',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'washCharge',
			positionField: 'washCharge',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'weigthIncentive',
			positionField: 'weigthIncentive',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'destIncentive',
			positionField: 'destIncentive',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'zoneIncentive',
			positionField: 'zoneIncentive',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'disuseDeduction',
			positionField: 'disuseDeduction',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'quickDeduction',
			positionField: 'quickDeduction',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'newcarIncentive',
			positionField: 'newcarIncentive',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'communicationExpense',
			positionField: 'communicationExpense',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'fuelExpense',
			positionField: 'fuelExpense',
			operation: 'SUM',
			formatString: '#,###',
		},
		{
			dataField: 'etcAllowance',
			positionField: 'etcAllowance',
			operation: 'SUM',
			formatString: '#,###',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 메일발송
	 * @param form
	 * @param popupForm
	 */
	const sendEmail = (popupForm: any) => {
		if (popupForm) {
			const params = popupForm.getFieldsValue(true);
		}

		refSendemailModal.current.handlerClose();
	};

	/**
	 * 메일발송 팝업 열기
	 */
	const openEmailPopup = () => {
		refSendemailModal.current.handlerOpen();
	};

	/**
	 * 메일발송 팝업 닫기
	 */
	const closeSendemailPopup = () => {
		refSendemailModal.current.handlerClose();
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
					btnType: 'btn1', // 메일발송
					callBackFn: openEmailPopup,
				},
				{
					btnType: 'excelDownload',
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
			// 컬럼 고정
			ref.gridRef.current.setFixedColumnCount(8);
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn
					gridTitle={t('lbl.LIST')}
					gridBtn={getGridBtn()}
					totalCnt={props.totalCount}
					customCont={props.workDay}
				/>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 비용마감 팝업 영역 정의 */}
			<CustomModal ref={refSendemailModal} width="640px">
				<TmTrxCalculationSendemailPopup
					dccode={fixdccode}
					courier={courier}
					courierName={courierName}
					slipdtRange={slipdtRange}
					close={closeSendemailPopup}
					callBack={sendEmail}
				></TmTrxCalculationSendemailPopup>
			</CustomModal>
		</>
	);
});

export default TmTrxCalculationReportDetail;
