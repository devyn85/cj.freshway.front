// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTOForDc';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Hooks
import CustomModal from '@/components/common/custom/CustomModal';
import OmOrderCreationSTOForDcExcelPopup from '@/components/om/orderCreationSTOForDc/OmOrderCreationSTOForDcExcelPopup';
import { Button } from 'antd';
import dayjs from 'dayjs';

const OmOrderCreationSTOForDcTab1 = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const modalExcelRef = useRef(null);

	const excelRef = useRef(null);

	const [dataLength, setDataLength] = useState(0);

	// 그리드 초기화
	const gridCol = [
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					headerText: t('lbl.SKU'), // 상품코드
					dataField: 'sku',
					dataType: 'code',
					editable: false,
				},
				{
					headerText: t('lbl.SKUNAME'), // 상품명칭
					dataField: 'skuName',
					dataType: 'default',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') + '코드', // 재고속성
			dataField: 'stockgrade',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataField: 'stockgrade',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STOCKGRADE', value)?.cdNm || '';
			},
			editable: false,
		},
		{
			headerText: t('lbl.ORDERUNIT'), // 주문단위
			dataField: 'uom',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					headerText: t('lbl.POSBQTY'), // 이동가능량
					dataField: 'openqty',
					dataType: 'numeric',
					editable: false,
				},
				{
					headerText: t('lbl.INPLANQTY_DP'), // 입고예정량
					dataField: 'dpQty',
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					headerText: t('lbl.POSBQTY'), // 이동가능량
					dataField: 'toOpenqty',
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.REQ_QTY'), // 요청량
			dataField: 'req',
			dataType: 'numeric',
		},
	];

	// 그리드 속성
	const gridPropsTab1 = {
		editable: true,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 업로드 팝업
	 */
	const excelUpload = () => {
		modalExcelRef.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalExcelRef.current?.handlerClose();
	};

	/**
	 * 저장 함수
	 */
	const saveMasterList = () => {
		const searchParams: any = props.searchForm?.getFieldsValue();
		const fromDccode = searchParams.fromDccode;
		const toDccode = searchParams.toDccode;
		const deliverydate = searchParams.deliverydate;

		if (!deliverydate) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DOCDT_STO')]));
			return;
		}
		if (!fromDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.FROM_DCCODE')]));
			return;
		}
		if (!toDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.TO_DCCODE')]));
			return;
		}

		// 공급센터와 공급받는센터가 같은지 검증
		if (fromDccode === toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		const grid: any = props.gridRef?.current;
		if (!grid || !grid.getCheckedRowItemsAll) {
			showAlert(null, '그리드 데이터를 불러올 수 없습니다.');
			return;
		}

		const checked = grid.getCustomCheckedRowItems({ isGetRowIndex: true }).map((item: any) => item['item']) || [];
		//
		// const allRows = grid.getGridData();
		// const checked = allRows.filter((r: any) => r?.check === 1 || r?.check === '1');
		//

		if (!checked || checked.length === 0) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		const targetList: any[] = [];
		for (const row of checked) {
			const qty = Number(row.req ?? row.toOrderqty ?? row.orderqty ?? 0);
			if (!row.sku || !row.uom || !row.stockgrade || qty <= 0) {
				continue;
			}
			targetList.push({
				fromStorerkey: row.storerkey,
				fromDccode,
				fromOrganize: row.organize ?? fromDccode,
				fromArea: '1000',
				fromSku: row.sku,
				fromUom: row.uom,
				fromStockgrade: row.stockgrade,
				fromStockid: row.stockid ?? null,
				toOrderqty: qty,
				toDccode,
				toStorerkey: row.storerkey,
				toOrganize: row.organize ?? toDccode,
				toArea: '1000',
				toSku: row.sku,
				toUom: row.uom,
				toStockgrade: row.stockgrade,
				toStockid: row.stockid ?? null,
			});
		}

		if (!targetList.length) {
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		const body = {
			avc_DCCODE: fromDccode,
			avc_COMMAND: 'CONFIRM',
			DC_A: fromDccode,
			DC_B: toDccode,
			fromDccode,
			toDccode,
			DELIVERYDATE: dayjs(deliverydate).format('YYYYMMDD'),
			saveList: targetList,
		};

		// 기존 컨펌 알럿으로 변경 (FWNEXTWMS-3098)
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMasterList(body).then(res => {
				if (res?.statusCode === 0) {
					// 저장 성공 시 부모에게 결과 데이터와 함께 알려서 Tab2로 이동
					props.onSaveSuccess?.(res.data);
				}
			});
		});
	};

	/*
	 * 엑셀 팝업에서 불러온 데이터 설정
	 */
	const loadExcelLit = () => {
		props.gridRef.current.clearGridData();
		props.gridRef.current.setGridData(excelRef.current?.getGridData());

		const length = props.gridRef.current.getGridData().length;
		setDataLength(length);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 */
		props.gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			props.gridRef?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
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

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCount}>
					<Button onClick={excelUpload}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridPropsTab1} />
			</AGrid>

			{/* 엑셀 팝업 */}
			<CustomModal ref={modalExcelRef} width="1000px">
				<OmOrderCreationSTOForDcExcelPopup
					close={closeEvent}
					searchForm={props.searchForm}
					onSaveSuccess={props.onSaveSuccess}
					onLoadSuccess={loadExcelLit}
					ref={excelRef}
				/>
			</CustomModal>
		</>
	);
});

export default OmOrderCreationSTOForDcTab1;
