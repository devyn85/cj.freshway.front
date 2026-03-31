/*
 ############################################################################
 # FiledataField	: MsSkuDcLabelDetail.tsx
 # Description		: 기준정보 > 상품기준정보 > 센터라벨상품
 # Author			: YeoSeungCheol
 # Since			: 25.07.16
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util
import { showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveMasterList } from '@/api/ms/apiMsSkuDcLabel';

// Store
import { apiGetSkuList } from '@/api/cm/apiCmSearch';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';

const MsSkuDcLabelDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// gDccode store에서 가져오기
	const gDccode = useAppSelector((state: any) => state.global.globalVariable.gDccode);
	const dcCode = Form.useWatch('dcCode', props.form);
	// 상품정보 팝업 관련
	const [custModalParam, setCustModalParam] = useState<any>({});
	const refCustModal = useRef(null);
	const refModal = useRef(null);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE1'), //  물류센터
			dataType: 'code',
			editable: false,

			// 물류센터 팝업 돋보기
			// commRenderer: {
			// 	type: 'search',
			// 	align: 'center',
			// 	iconPosition: 'right',
			// 	dataType: 'code',
			// 	onClick: function (e: any) {
			// 		const rowIndex = e.rowIndex;

			// 		refModal.current.open({
			// 			gridRef,
			// 			rowIndex,

			// 			popupType: 'dc',

			// 			onConfirm: (selectedRows: any[]) => {
			// 				const dataFieldMap = {
			// 					dcCode: 'code',
			// 					dcName: 'name',
			// 				};

			// 				const rowData = selectedRows[0];
			// 				const updateObj: Record<string, any> = {};
			// 				Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
			// 					updateObj[targetField] = rowData[sourceField];
			// 				});
			// 				gridRef.current.updateRow(updateObj, rowIndex);
			// 				refModal.current.handlerClose();
			// 			},
			// 		});
			// 	},
			// },
		},
		{
			// 물류센터명(물류센터코드를 라벨펑션으로 감아서)
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm;
			},
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드, 팝업
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
				},
				onClick: (e: any) => {
					refModal.current.handlerOpen();
				},
			},
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'), // 상품명칭
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'storageGubun',
			headerText: t('lbl.MS_STORAGETYPE'), // 분류(저장조건), 콤보
			dataType: 'code',
			required: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('MS_SKUDCLABEL_STORAGE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('MS_SKUDCLABEL_STORAGE', value)?.cdNm;
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'), // 삭제여부, 콤보
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DEL_YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
		},
		{
			dataField: 'addWho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addWhoId',
			visible: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editWhoId',
			visible: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		// /*START.hidden 컬럼*/
		// { dataField: 'rowStatus', editable: false, visible: true },
		// /*END.hidden 컬럼*/
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: true,
		showRowNumColumn: true,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		if (!gridRef?.current) return;

		/**
		 * 그리드 바인딩 완료
		 */
		gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		gridRef.current.bind('addRow', (event: any) => {
			event.items.forEach((element: any) => {
				const rowIndex = gridRef.current.rowIdToIndex(element._$uid);
				gridRef.current.setCellValue(rowIndex, 'dcCode', props.form.getFieldValue('dcCode'));
				gridRef.current.setCellValue(rowIndex, 'delYn', 'N');
				gridRef.current.setCellValue(rowIndex, 'rowStatus', 'I');
			});
		});
		/**
		 * 그리드 셀 편집 종료
		 */
		gridRef.current.bind('cellEditEnd', (event: any) => {
			// 상품코드 편집 완료 시 상품명 자동 조회
			if (event.dataField === 'sku') {
				if (commUtil.isEmpty(event.item.skuName)) {
					gridRef.current.setCellValue(event.rowIndex, 'sku', '');
				}

				const skuValue = event.item.sku;

				// 'S' + 숫자 다섯 자리 또는 숫자 6자리가 아닐 경우 유효하지 않은 값으로 판단하여 셀 비움
				if (!/^(S\d{5}|\d{6})$/.test(skuValue)) {
					gridRef.current.setCellValue(event.rowIndex, 'sku', '');
					gridRef.current.setCellValue(event.rowIndex, 'skuName', '');
				} else {
					setTimeout(() => {
						// listCount값이 포함되지 않아서 totalCount는 있으나 데이터는 안넘어옴
						apiGetSkuList({ name: skuValue, isEnter: 'Y', listCount: 500 } as any).then((res: any) => {
							if (res.data.list && res.data.list.length > 0) {
								gridRef.current.setCellValue(event.rowIndex, 'sku', res.data.list[0].code);
								gridRef.current.setCellValue(event.rowIndex, 'skuName', res.data.list[0].name);
							} else {
								gridRef.current.setCellValue(event.rowIndex, 'sku', '');
								gridRef.current.setCellValue(event.rowIndex, 'skuName', '');
							}
						});
					});
				}
			}

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		/**
		 * 더블클릭시 상품정보상세 호출
		 */
		gridRef.current.bind('cellDoubleClick', function (event: any) {
			if (event.dataField == 'sku' && !commUtil.isEmpty(event.item.sku)) {
				onOpenCustModal(event.item);
			}
		});
	};

	/**
	 * 센터상품라벨속성 저장
	 */
	const saveMasterList = () => {
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// PK validation - 신규행은 체크된것만, 나머지는 모두 (삭제행 제외)
		if (!gridRef.current.validatePKGridData(['dcCode', 'sku'], '1')) {
			return;
		}

		// 상품코드 미입력시 알럿
		if (updatedItems.some((item: any) => !item.sku)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_055', [t('lbl.SKU')]),
				modalType: 'info',
			});
			return;
		}

		// 분류(저장조건) 미입력시 알럿
		if (updatedItems.some((item: any) => !item.storageGubun)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_054', [t('lbl.MS_STORAGETYPE')]),
				modalType: 'info',
			});
			return;
		}

		if (!gridRef.current.validateRequiredGridData()) return;

		/**
		 * 저장 실행
		 */
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
						gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 저장 성공 후 조회 재실행
						},
					});
				}
			});
		});
	};

	/**
	 * 신규 상품라벨속성 추가
	 * @returns {void}
	 */
	const addNewSkuDcLabel = () => {
		// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
		// getFieldValue 없는 함수로 주석 처리합니다.
		// if (gridRef.current.getFieldValue('rowStatus') === 'I') {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_ERR_054'), // 이미 신규 행이 존재합니다
		// 		modalType: 'warning',
		// 	});
		// 	return;
		// }
	};

	// 상품정보상세 팝업 열기
	const onOpenCustModal = (row: any) => {
		const params = row;
		setCustModalParam(params);
		refCustModal.current.handlerOpen();
	};

	// 상품정보상세 팝업 닫기
	const onCloseCustModal = () => {
		refCustModal?.current.handlerClose();
		setCustModalParam({});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus',
				callBackFn: addNewSkuDcLabel,
				initValues: {
					dcCode: dcCode, // 물류센터 기본값 (사용자 센터코드)
					delYn: 'N', // 삭제여부 기본값 "정상"
					rowStatus: 'I', // 신규행
				},
			},
			{
				btnType: 'delete',
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	const confirmPopup = (selectedRow: any) => {
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'skuName', selectedRow[0].name);
		refModal.current.handlerClose();
	};

	const closeEvent = () => {
		if (commUtil.isEmpty(gridRef.current.getCellValue(gridRef.current.getSelectedIndex()[0], 'skuName'))) {
			gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'sku', '');
		} else {
			gridRef.current.restoreEditedCells([gridRef.current.getSelectedIndex()[0], 'sku']);
			gridRef.current.restoreEditedCells([gridRef.current.getSelectedIndex()[0], 'skuName']);
		}
		refModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []); // 의존성 배열 추가

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refCustModal} width="1000px">
				<CmSkuInfoPopup
					titleName={'상품상세'}
					refModal={refCustModal}
					apiParams={custModalParam}
					close={onCloseCustModal}
				/>
			</CustomModal>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			{/* <CmSearchWrapper ref={refModal} /> */}
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup type={'sku'} codeName={''} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default MsSkuDcLabelDetail;
