/*
 ############################################################################
 # FiledataField	: KpDpInspectMonitoringSTODetail.tsx
 # Description		: 광역출고검수현황 Detail
 # Author			: 공두경
 # Since			: 25.11.29
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiGetDetailList } from '@/api/kp/apiKpDpInspectMonitoringSTO';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function

const KpDpInspectMonitoringSTODetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			fromDc: selectedRow[0].fromDc,
			toDc: selectedRow[0].toDc,
			slipdt: selectedRow[0].slipdt,
			channel: selectedRow[0].channel,
			status: searchParams.status,
			toCustkey: searchParams.toCustkey,
			sku: searchParams.sku,
			vendor: searchParams.vendor,
		};
		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);

			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'), // 출고일자
			dataType: 'date',
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					dataField: 'fromDc',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					dataField: 'toDc',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			dataField: 'channelname',
			headerText: t('lbl.CHANNEL_DMD'), // 저장유무
			dataType: 'code',
		},
		{
			dataField: 'loadplancnt',
			headerText: t('lbl.LOADPLANCNT'), // 상차예정건수
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'loadcmpcnt',
			headerText: t('lbl.LOADCMPCNT'), // 상차완료건수
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'loadrate',
			headerText: t('lbl.LOADRATE'), // 상차진행률
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortagecnt',
			headerText: t('lbl.SHORTAGECNT'), // 결품건수
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortagerate',
			headerText: t('lbl.SHORTAGERATE'), // 결품율(%)
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'forcecmpcnt',
			headerText: t('lbl.FORCECMPCNT'), // 강제완료건수
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'forcecmprate',
			headerText: t('lbl.FORCECMPRATE'), // 강제완료률
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'forcecmpyn',
			headerText: t('lbl.FORCECMPYN'), // 검수완료여부
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼
	const gridCol2 = [
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'), // 차량번호
			dataType: 'code',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP_WD'), // POP번호
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), // 상품명칭
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'assortpickcust',
			headerText: t('lbl.ASSORTPICKCUST'), // 분류피킹업체
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'), // 저장유무
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_WD'), // 주문수량
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'scanqty',
			headerText: t('lbl.SCANQTY_WD'), // 스캔완료수량
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY_WD'), // 현결품수량
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_WD'), // 주문단위
			dataType: 'code',
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.VENDORNAME'), // 협력사명
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_VATOWNER'), // 판매처명
		},
		{
			dataField: 'status',
			headerText: t('lbl.INSPECTSTATUS_WD'), // 검수진행상태
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	// FooterLayout Props
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'carno',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'scanqty',
			positionField: 'scanqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			ref.gridRef2.current.clearGridData();

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem) return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" />
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
			</AGrid>
		</>
	);
});

export default KpDpInspectMonitoringSTODetail;
