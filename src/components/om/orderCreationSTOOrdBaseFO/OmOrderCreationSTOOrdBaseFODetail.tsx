/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseFODetail.tsx
 # Description		: 당일광역보충발주(FO) - 이체대상
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTOOrdBaseFO';

interface OmOrderCreationSTOOrdBaseFODetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	searchForm: any;
	dcname: any;
}

const OmOrderCreationSTOOrdBaseFODetail = forwardRef((props: OmOrderCreationSTOOrdBaseFODetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// const deliverydate = Form.useWatch('deliverydate', props.searchForm);
	// const fromDccode = Form.useWatch('fromDccode', props.searchForm);
	// const toDccode = Form.useWatch('toDccode', props.searchForm);

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKUCD'), //코드
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						// onClick: function (e: any) {
						// 	setSelectedRow(e.item); // 선택한 row를 state로 저장
						// 	refDocumentModal.current?.handlerOpen();
						// },
					},
				},
				{
					dataField: 'description',
					headerText: t('lbl.SKUNAME'), //명칭
					editable: false,
				},
			],
		},
		{
			dataField: 'stockgrade',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.STORERUOM'), //주문단위
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STOCK_QTY'), //재고량
			children: [
				{
					dataField: 'openqty1',
					headerText: t('lbl.UNSELECT'), //공급1
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'openqty5',
					headerText: t('lbl.SUPDCCODE'), //발주센터
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},
		{
			dataField: 'fromCrossdocktypeName',
			headerText: t('lbl.FROM_CROSSDOCKTYPE'), //공급센터CROSS타입
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCrossdocktypeName',
			headerText: t('lbl.TO_CROSSDOCKTYPE'), //공급받는센터CROSS타입
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dpQty',
			headerText: t('lbl.DPINPLAN'), //입고예정
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.STOREROPENQTY'), //주문량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'processqty',
			headerText: t('lbl.QTYALLOCATED'), //분배량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'reqOrderqty',
			headerText: t('lbl.REQ_ORDERQTY'), //발주예정
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'unOrderqty',
			headerText: t('lbl.UNPURCHASEQTY_DP'), //미발주량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item?.unOrderqty < 0) {
					return 'bg-danger';
				} else if (item?.unOrderqty === 0) {
					//
				} else {
					return 'bg-info';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
		},
		{
			headerText: t('lbl.ORDERQTY_STO'), //발주량(STO)
			children: [
				{
					dataField: 'reqSum',
					headerText: t('lbl.UNSELECT'), //합계
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'req1',
					headerText: t('lbl.SUPDCCODE'), //공급1
					dataType: 'numeric',
					editable: true,
					formatString: '#,##0.###',
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: true,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			dataField: 'fromCrossdocktype',
			visible: false,
		},
		{
			dataField: 'toCrossdocktype',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'req1',
			positionField: 'req1',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
			labelFunction: function (value: any, columnValues: any, footerValues: any) {
				const length = columnValues.filter((item: any) => item > 0).length;
				return length + '건';
			},
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'req1') {
			const newValue = event.item.req1;
			const reqOrderqty = event.item.reqOrderqty;

			if (!newValue || newValue === 0) {
				ref.gridRef.current.setCellValue(rowIndex, 'req1', 0);
			}

			ref.gridRef.current.setCellValue(rowIndex, 'unOrderqty', reqOrderqty - newValue);
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(props.searchForm);
		if (!isValid) {
			return;
		}

		const searchParams = props.searchForm.getFieldsValue();

		if (searchParams.fromDccode === searchParams.toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		const dcA = searchParams.fromDccode;
		const ignorecrossyn = searchParams.ignorecrossyn;
		const targetList: Record<string, any>[] = [];

		// 그리드 입력 값 검증
		for (const item of updatedItems) {
			const req1 = item.req1;

			if (req1 === 0) {
				const msg = '발주량을 1이상 입력하시기 바랍니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (item.uom === 'KG') {
				const msg = 'KG 상품이 포함되어 있습니다. KG 상품 제외 후 진행해 주시기 바랍니다.';
				showMessage({
					content: msg,
					modalType: 'warning',
				});
				return;
			}

			if (req1 > 0 && commUtil.isNotEmpty(dcA)) {
				const formattedDocnoList = item.docnoList
					.split(',')
					.map((item: any) => `'${item}'`)
					.join(',');

				const dsTarget = {
					fromStorerkey: item.storerkey,
					fromDccode: dcA,
					fromOrganize: dcA,
					fromArea: '1000',
					fromSku: item.sku,
					fromUom: item.uom,
					fromStockgrade: item.stockgrade,
					toStorerkey: item.storerkey,
					toDccode: item.dccode,
					toOrganize: item.dccode,
					toArea: '1000',
					toSku: item.sku,
					toUom: item.uom,
					toStockgrade: item.stockgrade,
					toOrderqty: req1,
					openqty1: item.openqty1,
					fromCrossdocktype: item.fromCrossdocktype,
					docnoList: formattedDocnoList,
				};

				if (ignorecrossyn === '1') {
					dsTarget.fromCrossdocktype = 'CROSS';
				}

				targetList.push(dsTarget);
			}
		}

		if (targetList && targetList.length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				const params = {
					avc_COMMAND: 'CONFIRM',
					toDccode: searchParams.toDccode,
					toOrganize: searchParams.toDccode,
					deliverydate: searchParams.deliverydate.format('YYYYMMDD'),
					saveList: targetList,
				};

				apiPostSaveMasterList(params).then(res => {
					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(res.data);
							},
						});
					}
				});
			});
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
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
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'etcqty2') {
				//박스수량 컬럼 편집 가능 여부
				if (event.item.boxflag === 'Y') {
					return true;
				} else {
					return false;
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			calculateColumnValue(event);

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// ref.gridRef.current.addCheckedRowsByValue('serialkey', event.item.serialkey);
		});

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
	 * 그리드 이벤트 바인딩
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

			setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef]);

	/**
	 * 공급센터를 변경하면 그 공급센터명을 그리드에 표시한다.
	 */
	useEffect(() => {
		const name = props.dcname.replace(/^\[.*?\]/, '').replace('물류센터', '');
		ref.gridRef.current.setColumnPropByDataField('openqty1', { headerText: name });
		ref.gridRef.current.setColumnPropByDataField('reqSum', { headerText: name });
	}, [props.dcname]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default OmOrderCreationSTOOrdBaseFODetail;
