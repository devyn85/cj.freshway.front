/*
 ############################################################################
 # FiledataField	: IbConsignMastDetail2.tsx
 # Description		: 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산[기준정보TAB]
 # Author		    	: 고혜미
 # Since			    : 25.09.24
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { apiPostSaveTab2MasterList } from '@/api/ib/apiIbConsignMast';
import { getUserDccodeList } from '@/store/core/userStore';
//Api
// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useSelector } from 'react-redux';
//types
import { getCommonCodeList } from '@/store/core/comCodeStore';

const IbConsignMastDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props;
	//조회 팝업
	const modalRef = useRef(null);
	const userDccodeList = getUserDccodeList('') ?? [];

	// popup 속성
	const [popupType, setPopupType] = useState('');

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)
	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 기타(4/4)

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			width: 200,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode',
				valueField: 'dcname',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const found = userDccodeList.find(opt => opt.dccode === value);
				return found ? found.dcname : value; // dcname(명칭) 보여주기
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isEmpty(item)) {
					return 'isEdit';
				} else {
					if (item.rowStatus !== 'I') {
						// 편집 가능 class 삭제
						ref.current.removeEditClass(columnIndex);
					} else {
						// 편집 가능 class 추가
						return 'isEdit';
					}
				}
			},
			filter: {
				showIcon: true,
			},
			required: true,
		}, // 물류센터

		{
			dataField: 'custkey',
			headerText: t('lbl.VENDOR'),
			editable: false,
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.custkey,
						custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					ref.current.openPopup(params, 'cust');
				},
			},
			required: true,
			style: 'isEdit',
		}, //협력사코드
		{ dataField: 'custName', headerText: t('lbl.VENDORNAME'), dataType: 'string', width: 150, editable: false }, // 협력사코드명
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			width: 80,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.current.openPopup(params, 'sku');
				},
			},
			required: true,
			editable: false,
			style: 'isEdit',
		}, //상품코드
		{
			dataField: 'skunm',
			headerText: t('lbl.SKUNM'),
			dataType: 'string',
			width: 500,
			editable: false,
		}, // 상품명[SKUNM]
		{
			headerText: '기준정보', // 기준정보
			children: [
				{
					dataField: 'salesUnitType',
					headerText: '금액/율',
					dataType: 'code',
					width: 100,
					editRenderer: {
						type: 'DropDownListRenderer',
						list: getCommonCodeList('CALCULATE_METHOD', ''),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.rowStatus !== 'I') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						const list = getCommonCodeList('CALCULATE_METHOD', '');
						const found = list.find(opt => opt.comCd === value);
						return found ? found.cdNm : value;
					},
					required: true,
				}, // 금액/율
				{
					dataField: 'uom',
					headerText: t('lbl.UOM'),
					dataType: 'code',
					width: 80,
					editRenderer: {
						type: 'DropDownListRenderer',
						list: getCommonCodeList('UOM', '').filter(opt => !['G', 'KG', 'PAC'].includes(opt.comCd)),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.rowStatus !== 'I') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						const list = getCommonCodeList('UOM', '');
						const found = list.find(opt => opt.comCd === value);
						return found ? found.cdNm : value;
					},
					editable: true,
					required: true,
				}, // 단위
				{
					dataField: 'grAmount',
					headerText: t('lbl.DP_PRICE'),
					dataType: 'numeric',
					width: 100,
					style: 'isEdit',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 입고료
				{
					dataField: 'giAmount',
					headerText: t('lbl.WD_PRICE'),
					dataType: 'numeric',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 출고료
				{
					dataField: 'stockAmount',
					headerText: t('lbl.STORAGEPRICE'),
					dataType: 'numeric',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 창고료
				{
					dataField: 'wghAmount',
					headerText: t('lbl.WGHPRICE'),
					dataType: 'numeric',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 계근료
				{
					dataField: 'workAmount',
					headerText: t('lbl.WORK_AMOUNT'),
					dataType: 'numeric',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 작업료
				{
					dataField: 'courierAmount',
					headerText: t('lbl.DELIVERYFEE_EXDC'),
					dataType: 'numeric',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
				}, // 운송료
				{
					dataField: 'grFeeRt',
					headerText: '입고정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 입고정산율
				{
					dataField: 'giFeeRt',
					headerText: '출고정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 출고정산율
				{
					dataField: 'stockFeeRt',
					headerText: '창고정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					editable: true,
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 창고정산율
				{
					dataField: 'wghFeeRt',
					headerText: '계근정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 계근정산율
				{
					dataField: 'workFeeRt',
					headerText: '작업정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 작업정산율
				{
					dataField: 'courierFeeRt',
					headerText: '운송정산율',
					width: 100,
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (commUtil.isEmpty(item)) {
							return 'isEdit';
						} else {
							if (item.salesUnitType !== '10') {
								// 편집 가능 class 삭제
								ref.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						}
					},
					style: 'text-align: right',
					editRenderer: {
						type: 'InputEditRenderer',
						regExp: '^[0-9]+\\.?[0-9]{0,2}?$',
						textAlign: 'right',
					},
				}, // 운송정산율
			],
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
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			width: 80,
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			width: 170,
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.current?.exportToXlsxGrid(params);
		},
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
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			const editableFields = ['grAmount', 'giAmount', 'stockAmount', 'wghAmount', 'workAmount', 'courierAmount'];
			const percentFields = ['grFeeRt', 'giFeeRt', 'stockFeeRt', 'wghFeeRt', 'workFeeRt', 'courierFeeRt'];
			const { item, dataField } = event;

			if (
				event.item.rowStatus !== 'I' &&
				(event.dataField === 'dccode' || event.dataField === 'salesUnitType' || event.dataField === 'uom')
			) {
				return false;
			} else {
				if (editableFields.includes(dataField)) {
					// 금액형만 가능
					if (item.salesUnitType !== '10') {
						return false;
					}
				}

				if (percentFields.includes(dataField)) {
					// 정산율형만 가능
					if (item.salesUnitType === '10') {
						return false;
					}
				}

				return true;
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditEnd', (event: any) => {
			//
		});

		/**
		 * 그리드 셀 클릭 이벤트 조회 팝업 호출
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellClick', (event: any) => {
			if (ref.current.getCellValue(event.rowIndex, 'rowStatus') === 'I') {
				if (event.dataField === 'sku') {
					setPopupType('sku');
				} else if (event.dataField === 'custkey') {
					setPopupType('partner');
				} else {
					return;
				}

				modalRef.current.handlerOpen();
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!ref.current.validateRequiredGridData()) return;

		// 저장 실행
		ref.current.showConfirmSave(() => {
			apiPostSaveTab2MasterList(updatedItems).then(res => {
				if (res.statusCode === 0) {
					// 전체 체크 해제
					ref.current.setAllCheckedRows(false);
					// AUIGrid 변경이력 Cache 삭제
					ref.current.resetUpdatedItems();

					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출
							},
						});
					}
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref,
		btnArr: [
			{
				btnType: 'plus',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					if (commUtil.isEmpty(form.getFieldValue('custkey'))) {
						showMessage({
							content: '협력사코드 값을 입력하시거나 조회해주세요.', // 협력사를 선택해주세요.
						});
						return;
					}
					const initValue = {
						storerkey: 'FW00',
						dccode: gDccode,
						custkey: form.getFieldValue('custkey'),
						custName: form.getFieldValue('custName'),
						sku: '',
						skunm: '',
						delYn: 'N',
						salesUnitType: '10',
						rowStatus: 'I',
					};
					// 신규행 추가
					ref.current.addRow(initValue, 'selectionDown');
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'sku') {
			ref.current.setCellValue(ref.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
			ref.current.setCellValue(ref.current.getSelectedIndex()[0], 'skunm', selectedRow[0].name);
		} else if (popupType === 'partner') {
			ref.current.setCellValue(ref.current.getSelectedIndex()[0], 'custkey', selectedRow[0].code);
			ref.current.setCellValue(ref.current.getSelectedIndex()[0], 'custkeyname', selectedRow[0].name);
		}

		modalRef.current.handlerClose();

		// PK validation
		if (!ref.current.validatePKGridData(['dccode', 'sku', 'custkey'])) {
			return;
		}
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
		const gridRefCur = ref.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 상품LIST */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.PRODUCTLIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
		</>
	);
});
export default IbConsignMastDetail2;
