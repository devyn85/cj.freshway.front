/*
 ############################################################################
 # FiledataField	: WdInplanTotalDetail.tsx
 # Description		: 출고진행현황 Detail
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import FileSaver from 'file-saver';
//Lib
import axios from '@/api/Axios';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// API Call Function
import { apiGetDeliveryStatus } from '@/api/wd/apiWdHomeDeliveryInvoic';
import { apiPostLargeDataExcel } from '@/api/wd/apiWdInplan';
import WdDeliveryStatusPopup from '@/components/wd/homeDeliveryInvoice/WdDeliveryStatusPopup';
import { useAppSelector } from '@/store/core/coreHook';

const WdInplanTotalDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRefPop = useRef(null);

	const [form] = Form.useForm();
	const refModal = useRef(null);
	const { t } = useTranslation();

	const [popupList, setPopupList] = useState([]);
	const [popupParams, setPopupParams] = useState({});
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const gUserId = globalVariable['gUserId'];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	const searchDtl = (authority: string) => {
		// ref.gridRef2.current.clearGridData();
		props.form.resetFields();
		if (commUtil.isEmpty(authority)) {
			const selectedRow = ref.gridRef.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.gridRef.current.isAddedById(selectedRow[0]._$uid)) {
				authority = selectedRow[0].authority; // 현재 행
			} else {
				return;
			}
		}
	};

	const getSearchApi = (isPopup: boolean, value: string) => {
		const params = {
			docno: value,
		};

		apiGetDeliveryStatus(params).then(res => {
			if (!isPopup) {
				refModal.current.handlerOpen();
			}
			ref.gridRefPop.current.clearGridData();
			setPopupList(res.data.list);
		});
	};

	const initEvent = () => {
		ref.gridRef.current?.bind('cellDoubleClick', function (event: any) {
			// 셀 클릭으로 row의 checkbox (un)check
			/*
			alert(
				' ( ' +
					event.rowIndex +
					', ' +
					event.columnIndex +
					') :  ' +
					event.value +
					' clicked!!' +
					ref.gridRef.current?.getCellValue(event.rowIndex, 'slipdt'),
			);*/
			if (event.dataField == 'docno') {
				const params = { docno: event.value, docdt: ref.gridRef.current?.getCellValue(event.rowIndex, 'slipdt') };

				setPopupParams(params);
				refModal.current.handlerOpen();
			}
		});
	};

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = props.form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (params.fromSlipdt != params.toSlipdt) {
			if (commUtil.isNull(params.toCustkey) && commUtil.isNull(params.sku)) {
				showAlert('', '출고일자가 하루이상인 경우\n관리처코드,상품코드 중 하나를 \n입력하셔야 합니다.');
				if (gUserId?.toUpperCase() !== 'DEV01') {
					return;
				}
			}
		}

		apiPostLargeDataExcel(params).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});

		// const params = {
		// 	fileName: '출고진행현황',
		// 	exportWithStyle: true, // 스타일 적용 여부
		// 	progressBar: true, // 진행바 표시 여부
		// };
		// ref.gridRef.current.exportToXlsxGrid(params);
	};

	/**
	 * 선택상품제외처리
	 */
	const onClickException = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['상품제외']), () => {
			const params = {
				avc_COMMAND: 'BATCHPROCESSCONFIRM',
				saveList: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiPostSaveInquiry(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
					return;
				}
			});
		});
	};

	/**
	 * 상품제외처리
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiPostSaveInquiry = (params: any) => {
		return axios.post('/api/wd/inplan/v1.0/saveInquiry', params).then(res => res.data);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			// 출고일자
			headerText: t('lbl.DOCDT_WD'), //출고일자
			dataField: 'slipdt',
			dataType: 'date',
			//formatstring: 'yyyy-mm-dd',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
			},
		},
		{
			// 마감여부
			headerText: t('lbl.CLOSEYN'), //마감여부
			dataField: 'closeyn',
			dataType: 'code',
		},
		{
			// 주문유형
			headerText: t('lbl.ORDERTYPE_WD'), //주문유형
			dataField: 'ordertype',
			dataType: 'code',
		},
		{
			// 주문사유
			headerText: t('lbl.POTYPE_WD'),
			dataField: 'sotype',
			dataType: 'code',
		},
		{
			// 통합배송 주문유형
			headerText: t('lbl.TPL_TYPE_NM'),
			dataField: 'tplTypeNm',
			dataType: 'code',
		},
		{
			// 주문번호
			headerText: t('lbl.DOCNO_WD'),
			dataField: 'docno',
			dataType: 'code',
		},
		{
			// 물류센터
			headerText: t('lbl.DCCODE'),
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			// 창고
			headerText: t('lbl.ORGANIZE'),
			dataField: 'organize',
			dataType: 'code',
		},
		{
			// 영업조직
			headerText: t('lbl.SALEGROUP'),
			dataField: 'saleorganize',
			dataType: 'code',
		},
		{
			// 사업장
			headerText: t('lbl.SALEDEPARTMENT'),
			dataField: 'saledepartment',
		},
		{
			// 영업그룹
			headerText: t('lbl.CUSTGROUP'),
			dataField: 'salegroup',
		},
		{
			// 영업경로(대)
			headerText: t('lbl.SALECUSHRC1'),
			dataField: 'salecushrc1',
		},
		{
			// 영업경로(중)
			headerText: t('lbl.SALECUSHRC2'),
			dataField: 'salecushrc2',
		},
		{
			// 영업경로(소)
			headerText: t('lbl.SALECUSHRC3'),
			dataField: 'salecushrc3',
		},
		{
			// 판매처코드
			headerText: t('lbl.TO_VATNO'),
			dataField: 'billtocustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.billtocustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			// 판매처명
			headerText: t('lbl.TO_VATOWNER'),
			dataField: 'billtocustname',
			filter: {
				showIcon: true,
			},
		},
		{
			// 관리처코드
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataField: 'toCustkey',
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
			// 관리처명
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
		},
		{
			// 분할관리처코드
			headerText: t('lbl.MNGPLCID'),
			dataField: 'mngplcId',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.mngplcId,
						},
						'cust',
					);
				},
			},
		},
		{
			// 분할관리처명
			headerText: t('lbl.MNGPLCIDNM'),
			dataField: 'mngplcName',
			filter: {
				showIcon: true,
			},
		},
		{
			// 진행상태
			headerText: t('lbl.STATUS_WD'),
			dataField: 'status',
			dataType: 'code',
		},
		{
			// POP번호
			headerText: t('lbl.DELIVERYGROUP'),
			dataField: 'deliverygroup',
			dataType: 'code',
		},
		{
			// 회수위치
			headerText: t('lbl.LOADPLACE'),
			dataField: 'loadplace',
			dataType: 'code',
		},
		{
			// 차량번호
			headerText: t('lbl.CARNO'),
			dataField: 'carno',
			dataType: 'code',
		},
		{
			// 품목번호
			headerText: t('lbl.DOCLINE'),
			dataField: 'docline',
			dataType: 'code',
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
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
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			// 배송수단
			headerText: t('lbl.DELIVERYTYPE'),
			dataField: 'deliverytype',
			dataType: 'code',
		},
		{
			// 이력관리대상
			headerText: t('lbl.SERIALMGTYN'),
			dataField: 'serialyn',
			dataType: 'code',
		},
		{
			// 비정량여부
			headerText: t('lbl.SKUNOTFIXEDAMOUNTYN'),
			dataField: 'line01',
			dataType: 'code',
		},
		{
			// 플랜트
			headerText: t('lbl.PLANT'),
			dataField: 'plantDescr',
			dataType: 'code',
		},
		{
			// 경유지
			headerText: t('lbl.ROUTE'),
			dataField: 'routeDescr',
			dataType: 'code',
		},
		{
			// 저장유무
			headerText: t('lbl.CHANNEL_DMD'),
			dataField: 'channel',
			dataType: 'code',
		},
		{
			// 저장조건
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			dataType: 'code',
		},
		{
			// 유통이력
			headerText: t('lbl.SERIALTYPENAME3'),
			dataField: 'serialtypename',
			dataType: 'code',
		},
		{
			// 박스입수
			headerText: t('lbl.QTYPERBOX'),
			dataField: 'qtyperbox',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 판매단위
			headerText: t('lbl.UOM_SO'),
			dataField: 'uom',
			dataType: 'code',
		},
		{
			// 주문수량
			headerText: t('lbl.ORDERQTY'),
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 주문중량
			headerText: t('lbl.ORDERWEIGHT'),
			dataField: 'orderweight',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 분배량
			headerText: t('lbl.DISTRIBUTEQTY_WD'),
			dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 피킹량
			headerText: t('lbl.WORKQTY_WD'),
			dataField: 'workqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 출고검수량
			headerText: t('lbl.INSPECTQTY_WD'),
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 출고수량
			headerText: t('lbl.CONFIRMQTY_WD'),
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 취소량
			headerText: t('lbl.CANCELQTY'),
			dataField: 'cancelqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 출고중량
			headerText: t('lbl.CONFIRMWEIGHT_WD'),
			dataField: 'confirmweight',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 사전주문조정의료여부
			headerText: t('lbl.BEFORESHORTAGEPLANYN'),
			dataField: 'beforeShortageplanyn',
			dataType: 'code',
		},
		{
			// 우편번호
			headerText: t('lbl.ZIPCODE'),
			dataField: 'toZipcode',
			dataType: 'code',
		},
		{
			// 실배송지
			headerText: t('lbl.TO_VATADDRESS2'),
			dataField: 'toVataddress1',
		},
		{
			// 등록자
			headerText: t('lbl.ADDWHO'),
			dataField: 'addwho',
			dataType: 'code',
		},
		{
			// 등록일자
			headerText: t('lbl.ADDDATE'),
			dataField: 'adddate',
			dataType: 'date',
			minWidth: 170,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		autoGridHeight: false, // 자동 높이 조절

		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		//independentAllCheckBox: true,
		// fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: true,
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: false,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: false,

		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.delYn != 'N') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'orderweight',
			positionField: 'orderweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				callBackFn: downloadExcel,
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
			},
			// {
			// 	btnType: 'btn1', // 선택상품제외처리
			// 	btnLabel: t('lbl.CHECK_SKU_EXCEPTION_PROCESS'), // 선택상품제외처리
			// 	callBackFn: onClickException,
			// },
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		initEvent();
	});

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="출고진행목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refModal} width="1280px">
				<WdDeliveryStatusPopup refModal={refModal} close={closeEvent} popupParams={popupParams}></WdDeliveryStatusPopup>
			</CustomModal>
		</>
	);
});

export default WdInplanTotalDetail;
