/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSNTap1Detail.tsx
 # Description		: 이력배송라벨출력-분류표생성 Detail
 # Author			: 공두경
 # Since			: 25.10.15
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { apiGetTab1DetailList, apiSaveCreationSN, apiSaveOrderclose } from '@/api/wd/apiWdDeliveryLabelSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const WdDeliveryLabelSNTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

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
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			slipdt: selectedRow[0].slipdt,
			docno: selectedRow[0].docno,
			doctype: selectedRow[0].doctype,
			sku: searchParams.sku,
			skugroup: searchParams.skugroup,
			storagetype: searchParams.storagetype,
		};

		apiGetTab1DetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 생성
	 */
	const onCreationSN = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'CREATION_SN',
				saveCreationSNList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveCreationSN(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 마감주문반영
	 */
	const onSaveOrderclose = async () => {
		showConfirm(null, t('msg.MSG_COM_CFM_020', ['마감주문반영']), () => {
			const searchParams = props.form.getFieldsValue();
			const params = {
				avc_COMMAND: 'INVOICECANCEL_SN',
				dccode: searchParams.fixdccode,
				slipdt: searchParams.searchDate.format('YYYYMMDD'),
			};

			apiSaveOrderclose(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.CREATEYN'), /*생성유무*/ dataField: 'createdescr', dataType: 'code' },
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.ORGANIZE'), /*창고*/ dataField: 'organize', dataType: 'code' },
		{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plant', dataType: 'code' },
		{ headerText: t('lbl.DOCDT_WD'), /*출고일자*/ dataField: 'slipdt', dataType: 'date' }, // 날짜 필드이므로 'date'로 변환
		{ headerText: t('lbl.ORDERTYPE_WD'), /*주문유형*/ dataField: 'ordertype', dataType: 'code' },
		{ headerText: t('lbl.POTYPE_WD'), /*주문사유*/ dataField: 'potype', dataType: 'code' },
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code' },
		{ headerText: t('lbl.ORGANIZE'), /*창고*/ dataField: 'organize', dataType: 'code' }, // 중복 필드
		{ headerText: t('lbl.SALEGROUP'), /*영업조직*/ dataField: 'salegroup' },
		{ headerText: t('lbl.SALEDEPARTMENT'), /*사업장*/ dataField: 'saledepartment', dataType: 'code' },
		{ headerText: t('lbl.CUSTGROUP'), /*영업그룹*/ dataField: 'custgroup', dataType: 'code' },
		{
			headerText: t('lbl.TO_VATNO'),
			/*판매처코드*/ dataField: 'toVatno',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.TO_VATOWNER'),
			/*판매처명*/ dataField: 'toVatowner',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*관리처코드*/ dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD'),
			/*관리처명*/ dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.STATUS_WD'), /*진행상태*/ dataField: 'status', dataType: 'code' },
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
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.createyn === 'Y') {
				return 'color-info';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '생성', // 생성
				callBackFn: onCreationSN,
			},
			{
				btnType: 'btn2',
				btnLabel: '마감주문반영', // 마감주문반영
				callBackFn: onSaveOrderclose,
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{ headerText: t('lbl.DOCLINE'), /*품목번호*/ dataField: 'docline', dataType: 'code' },
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
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
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plantDescr', dataType: 'code' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*Channel Dmd*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY_WD'),
			/*주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.UOM_SO'), /*판매단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.STATUS_WD'), /*진행상태*/ dataField: 'status', dataType: 'code' },
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [{}];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0 ', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0 ', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdDeliveryLabelSNTap1Detail;
