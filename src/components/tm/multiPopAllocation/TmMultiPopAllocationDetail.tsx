/*
 ############################################################################
 # FiledataField	: TmMultiPopAllocationDetail.tsx
 # Description		: 운송비정산
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.23
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
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveTmInplan } from '@/api/tm/apiTmMultiPopAllocation';

interface TmMultiPopAllocationDetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	form: any;
}

const TmMultiPopAllocationDetail = forwardRef((props: TmMultiPopAllocationDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 셀 팝업용 Ref
	const refModal = useRef(null);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	// 그리드 컬럼을 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'doctype',
			visible: false,
		},
		{
			dataField: 'slipno',
			visible: false,
		},
		{
			dataField: 'deliverydt',
			headerText: t('lbl.DELIVERYDATE'), //배송일자
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'shptoId',
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'shptoIdName',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'mngplcId',
			headerText: t('lbl.MNGPLCID'), //분할관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'mngplcIdName',
			headerText: t('lbl.MNGPLCIDNM'), //분할관리처명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'predeliverygroup',
			headerText: t('lbl.PREDELIVERYGROUP'), //선배차POP
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP_POP'), //배차POP
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
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), //상품명
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'storeruom',
			headerText: t('lbl.UOM_WD'), //주문단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storeropenqty',
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'weightkg',
			headerText: t('lbl.WEIGHT_KG_UOM'), //중량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'cube',
			headerText: t('lbl.CUBE_UOM'), //체적
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		/*
		{
			headerText: t('lbl.DISPATCH_CHANGE'), //배차변경
			children: [
				{
					dataField: 'newDeliverygroup',
					headerText: t('lbl.POPNO'), //POP번호
					editable: false,
					required: true,
					commRenderer: {
						type: 'search',
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							const rowItem = e.item;
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {},
								popupType: 'carPOP',
								onConfirm: (selectedRows: any[]) => {
									if (!selectedRows || selectedRows.length === 0) return;
									const selectedData = selectedRows[0];
									// 수정할 값 구성
									const updatedRow = {
										...rowItem,
										newCarno: selectedData.code,
										newDeliverygroup: selectedData.name,
									};
									// 해당 행에 값 업데이트
									ref.gridRef.current.updateRow(updatedRow, rowIndex);
									// 칼럼 사이즈 조정
									const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
									ref.gridRef.current.setColumnSizeList(colSizeList);
									// 팝업 닫기
									refModal.current?.handlerClose();
								},
							});
						},
					},
				},
				{
					dataField: 'newCarno',
					headerText: t('lbl.CARNO'), //차량번호
					editable: false,
					required: true,
					commRenderer: {
						type: 'search',
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							const rowItem = e.item;
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {},
								popupType: 'car',
								onConfirm: (selectedRows: any[]) => {
									if (!selectedRows || selectedRows.length === 0) return;
									const selectedData = selectedRows[0];
									// 수정할 값 구성
									const updatedRow = {
										...rowItem,
										newCarno: selectedData.code,
										newDeliverygroup: null,
									};
									// 해당 행에 값 업데이트
									ref.gridRef.current.updateRow(updatedRow, rowIndex);
									// 칼럼 사이즈 조정
									const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
									ref.gridRef.current.setColumnSizeList(colSizeList);
									// 팝업 닫기
									refModal.current?.handlerClose();
								},
							});
						},
					},
				},
				{
					dataField: 'newPriority',
					headerText: t('lbl.RETURNDRIVECNT'), //회차
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true,
					},
				},
			],
		},
		*/
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 저장
		ref.gridRef.current.showConfirmSave(() => {
			const params = {
				fixdccode: fixdccode,
				saveList: checkedItems,
			};

			apiPostSaveTmInplan(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				// {
				// 	btnType: 'save', //저장
				// 	callBackFn: saveMasterList,
				// },
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
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid dataProps={'row-single'}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 공통 검색 팝업 래퍼 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default TmMultiPopAllocationDetail;
