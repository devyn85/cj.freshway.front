/*
 ############################################################################
 # FiledataField	: TmMonitoringCustomerDetail.tsx
 # Description		: 배송 > 배차현황 > 배송고객모니터링 (목록)
 # Author					: JiHoPark
 # Since					: 2025.11.24.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface TmMonitoringCustomerDetailProps {
	data: any;
	totalCnt: any;
	onSaveHandler: any;
	onSendEmailHandler: any;
}

const TmMonitoringCustomerDetail = forwardRef((props: TmMonitoringCustomerDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.VHCNUM'), /*차량번호*/ dataField: 'carno', dataType: 'code', editable: false },
		{ headerText: t('lbl.DELIVERY_DRIVER'), /*배송기사*/ dataField: 'driver', dataType: 'code', editable: false },
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*관리처코드*/ dataField: 'custkey',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'cust');
				},
			},
		},
		{ headerText: t('lbl.TO_CUSTNAME_WD'), /*관리처명*/ dataField: 'custname', dataType: 'string', editable: false },
		{
			headerText: t('lbl.WEIGHT_KG'),
			/*중량*/ dataField: 'weight',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			headerText: t('lbl.PHOTOSHOOTING_YN'),
			/*사진촬영 유/무*/ dataField: 'photoYn',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.LOAD_YN'),
			/*적온적재 유/무*/ dataField: 'loadtypeYn',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.TMISSUER_YN'),
			/*배송이슈 등재*/ dataField: 'issueYn',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
		},
		{ headerText: t('lbl.MACODE'), /*담당MA*/ dataField: 'maname', dataType: 'code', editable: false },
		{ headerText: t('lbl.SHORTAGECNT'), /*결품건수*/ dataField: 'cancelqty', dataType: 'numeric', editable: false },
		{
			headerText: 'OTD시작',
			/*배송요청 시간*/ dataField: 'fromDeliveryreqdt',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: 'OTD종료',
			/*배송요청 시간*/ dataField: 'deliveryreqdt',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.INCOMINGTIME_PLAN'),
			/*도착시간 (예정)*/ dataField: 'custarrivaldt',
			dataType: 'code',
			editable: false,
			editRenderer: {
				type: 'MaskEditRenderer',
				mask: '99:99',
				textAlign: 'center',
				placeholder: '__:__', // 플레이스홀더
				applyMaskValue: true, // 실제 데이터 적용은 마스크 풀린 값이 적용됨.
				validator: function (oldValue: any, newValue: any, item: any) {
					// 에디팅 유효성 검사
					let isValid = true;
					const timeArr = newValue.split(':');

					// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
					if (parseInt(timeArr[0]) > 23 || parseInt(timeArr[1]) > 59) {
						isValid = false;
					}

					return { validate: isValid, message: t('msg.MSG_COM_VAL_221') };
				},
			},
		},
		{ headerText: t('lbl.LBL_MEMO'), /*특이사항*/ dataField: 'memo', dataType: 'string' },
		{
			headerText: t('lbl.DELIVERYDATE'),
			/*배송일자*/ dataField: 'deliverydt',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 이메일 발송 callback
	 * @returns {void}
	 */
	const sendEmailCallback = () => {
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_007', ['이메일 전송대상 ']), // 이메일 전송 대상 을(를) 선택해 주십시오.
				modalType: 'info',
			});
			return;
		}

		if (ref.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			showMessage({
				content: t('msg.MSG_COM_CFM_011'), // 변경사항이 있습니다. 저장 후 처리하십시요.
				modalType: 'info',
			});
			return;
		}

		props.onSendEmailHandler(chkDataList);
	};

	/**
	 * 배송고객모니터링 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const chkDataList = ref.current.getChangedData();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		props.onSaveHandler(chkDataList);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 이메일 발송
				callBackFn: sendEmailCallback,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
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
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</AGrid>
		</>
	);
});

export default TmMonitoringCustomerDetail;
