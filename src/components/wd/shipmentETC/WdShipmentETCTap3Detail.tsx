/*
 ############################################################################
 # FiledataField	: WdShipmentETCTap2Detail.tsx
 # Description		: 출고 > 기타출고 > 매각출고처리 (매각내역)
 # Author			    : 고혜미
 # Since		    	: 25.10.17
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { apiSaveMasterList03 } from '@/api/wd/apiWdShipmentETC';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const WdShipmentETCTap3Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE') /*물류센터*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: '매각등록일' /*매각등록일*/,
			dataField: 'disposeDate',
			dataType: 'date',
			editable: false,
			width: 120,
		},
		{
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC') /*로케이션*/,
			dataType: 'code',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU') /*상품코드*/,
					dataType: 'code',
					editable: false,
					width: 80,
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
					headerText: t('lbl.SKUNAME') /*상품명칭*/,
					editable: false,
					width: 380,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST') /*단위*/,
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			dataField: 'lot',
			headerText: t('lbl.LOT') /*LOT*/,
			dataType: 'code',
			editable: false,
			width: 170,
		},
		{
			dataField: 'disposeQty',
			headerText: '매각수량' /*매각수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: true,
			width: 120,
		},
		{
			dataField: 'disposeAmount',
			headerText: '매각금액' /*매각금액*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: true,
			width: 120,
		},
		{
			dataField: 'rmk',
			headerText: t('lbl.MEMO1') /*비고*/,
			dataType: 'stirng',
			editable: true,
			width: 120,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			width: 80,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			width: 170,
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 저장
	 */
	const saveMasterList = () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		if (!isChanged || isChanged.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				saveList3: updatedItems, // 선택된 행의 데이터
			};

			apiSaveMasterList03(params).then(res => {
				// 전체 체크 해제
				ref.gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				ref.gridRef.current.resetUpdatedItems();

				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
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
		const gridRefCur1 = ref.gridRef.current;
		gridRefCur1?.setGridData(props.data);
		gridRefCur1?.setSelectionByIndex(0, 0);
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="매각내역목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default WdShipmentETCTap3Detail;
