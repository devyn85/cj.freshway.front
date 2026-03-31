/*
 ############################################################################
 # FiledataField	: TmTrxCalculationResultDetail.tsx
 # Description		: 운송비정산현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils
import dateUtils from '@/util/dateUtil';
// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API

interface TmTrxCalculationResultDetailProps {
	gridData: any;
	totalCount: any;
	workDay: any;
	callBackFn: any;
	form: any;
}

const TmTrxCalculationResultDetail = forwardRef((props: TmTrxCalculationResultDetailProps, ref: any) => {
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
			dataField: 'sttlDate',
			headerText: t('lbl.DATE'), //일자
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'courierName',
			headerText: t('lbl.CARRIER'), //운송사(운송사)
			dataType: 'string',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'slaveCourierName',
			headerText: t('lbl.SLAVE_COURIER'), //2차운송사(2차운송사)
			dataType: 'string',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'sttlTypeName',
			headerText: t('lbl.STTL_TYPE'), //정산구분-배송,수송,조달,...
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'contracttypeName',
			headerText: t('lbl.CONTRACTTYPE'), //차량유형(계약유형)
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'), //차량번호
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'driverName',
			headerText: t('lbl.DRIVERNAME'), //기사
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'tonName',
			headerText: t('lbl.CARCAPACITY'), //톤급
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'weightKg',
			headerText: t('lbl.DELIVERYWEIGHT'), //물량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		// {
		// 	dataField: 'workDay',
		// 	headerText: t('lbl.STDWORKDAYS'), //기준근무
		// 	dataType: 'numeric',
		// 	editable: false,
		// 	cellMerge: true,
		// 	mergeRef: 'rowDist',
		// 	mergePolicy: 'restrict',
		// },
		{
			dataField: 'closetypeName',
			headerText: t('lbl.CLOSETYPE'), //마감유형
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		},
		{
			headerText: t('lbl.DESTINATION'), //착지
			children: [
				{
					dataField: 'ctrngDestCnt',
					headerText: t('lbl.FS'), //급식
					dataType: 'numeric',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					formatString: '#,###',
				},
				{
					dataField: 'dinoutDestCnt',
					headerText: t('lbl.FB'), //외식
					dataType: 'numeric',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					formatString: '#,###',
				},
				{
					dataField: 'totDestCnt',
					headerText: t('lbl.SUB_SUM'), //계
					dataType: 'numeric',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					formatString: '#,###',
				},
			],
		},
		{
			dataField: 'allowanceName',
			headerText: t('lbl.BENEFIT'), //수당
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'amount',
			headerText: t('lbl.AMT'), //금액
			dataType: 'numeric',
			editable: false,
		},
		{ dataField: 'rowDist', visible: false }, // 세로병합용(숨김)
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableCellMerge: true,
		cellMergePolicy: 'valueWithNull',
		enableFilter: true,
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.gridRef.current?.exportToXlsxGrid(params);
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정. 마스터 그리드.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'excelDownload',
					isActionEvent: false,
					callBackFn: () => {
						onExcelDownLoad();
					},
				},
			],
		};

		return gridBtn;
	};
	const onExcelDownLoad = () => {
		// 그리드 데이터 체크
		ref.gridRef.current.setColumnPropByDataField('sttlDate', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('courierName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('slaveCourierName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('sttlTypeName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('contracttypeName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('carno', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('driverName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('tonName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('weightKg', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('closetypeName', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('ctrngDestCnt', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('dinoutDestCnt', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('totDestCnt', { cellMerge: false });

		const gridData = getGridBtn().tGridRef.current.getGridData();

		if (!gridData || gridData.length === 0) {
			showAlert(null, '다운로드할 데이터가 없습니다.');
			return;
		}

		const params = {
			fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
		};
		getGridBtn().tGridRef.current.exportToXlsxGrid(params);
		setTimeout(() => {
			ref.gridRef.current.setColumnPropByDataField('sttlDate', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('courierName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('slaveCourierName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('sttlTypeName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('contracttypeName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('carno', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('driverName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('tonName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('weightKg', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('closetypeName', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('ctrngDestCnt', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('dinoutDestCnt', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('totDestCnt', { cellMerge: true });
		}, 500);
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
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default TmTrxCalculationResultDetail;
