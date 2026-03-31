/*
 ############################################################################
 # FiledataField	: TmTransportControlDetail1.tsx
 # Description		: 정산 > 운송비정산 > 수송배차조정 (목록)
 # Author					: JiHoPark
 # Since					: 2025.11.05.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import TmTransportControlRoutingPopup from '@/components/tm/transportControl/TmTransportControlRoutingPopup';

// Util
import dayjs from 'dayjs';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// API
import { apiGetCarInfo, apiGetTotPrice, apiSaveMasterList } from '@/api/tm/apiTmTransportControl';

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface TmTransportControlDetail1Props {
	data: any;
	totalCnt: any;
	onSearchMaster: any;
	searchDetailList: any;
}

const TmTransportControlDetail1 = forwardRef((props: TmTransportControlDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 노선 조회 팝업 ref
	const refModal = useRef(null);

	// 차량조회 팝업 ref
	const refModal2 = useRef(null);

	// 우송사 팝업 ref
	const refModal3 = useRef(null);

	// 노선 조회 팝업 parameter
	const [popupParams, setPopupParams] = useState({});

	// 차량 조회 팝업 parameter
	const [carno, setCarno] = useState('');

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DATE'), //일자
			dataField: 'deliverydt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.rowStatus !== 'I' || item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.VHCNUM'), //차량번호
			dataField: 'carno',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'center',
				onClick: function (event: any) {
					if (event.item.status !== 'C') {
						return;
					}

					ref.current['curRowIdx'] = event.rowIndex;
					setCarno(event.item.carno);

					refModal2.current.handlerOpen();
				},
			},
		},
		{
			headerText: t('lbl.CARRIER'), //운송사
			dataField: 'couriername',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						couriername: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const curRow = e.rowIndex;
						ref.current['curRowIdx'] = curRow;

						const updatedRow = {
							...e.item,
							courier: e.code,
							couriername: e.name,
							totPrice: null,
						};

						ref.current.updateRow(updatedRow, curRow);

						getTotPrice();
					},
				},
				params: {
					carrierType: 'LOCAL',
				},
				onClick: function (e: any) {
					if (e.item.status !== 'C') {
						return;
					}

					const rowIndex = e.rowIndex;
					refModal3.current.open({
						gridRef: ref,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							couriername: 'name',
						},
						carrierType: 'LOCAL',
						popupType: 'carrier',
						onConfirm: (selectedRows: any[]) => {
							refModal3.current?.handlerClose();
							if (!selectedRows || selectedRows.length === 0) return;

							const selectedData = selectedRows[0];
							const updateRow = {
								courier: selectedData.code,
								couriername: selectedData.name,
							};
							ref.current.updateRow(updateRow, rowIndex);
							ref.current['curRowIdx'] = rowIndex;

							getTotPrice();
						},
					});
				},
			},
		},
		{
			headerText: t('lbl.SLAVE_COURIER'), //2차운송사
			dataField: 'slaveCouriername',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						slaveCourier: 'code',
						slaveCouriername: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const curRow = e.rowIndex;
						ref.current['curRowIdx'] = curRow;

						const updatedRow = {
							...e.item,
							slaveCourier: e.code,
							slaveCouriername: e.name,
						};

						ref.current.updateRow(updatedRow, curRow);
					},
				},
				params: {
					carrierType: 'SUBC',
				},
				onClick: function (e: any) {
					if (e.item.status !== 'C') {
						return;
					}

					const rowIndex = e.rowIndex;
					refModal3.current.open({
						gridRef: ref,
						rowIndex,
						dataFieldMap: {
							slaveCourier: 'code',
							slaveCouriername: 'name',
						},
						carrierType: 'SUBC',
						popupType: 'carrier',
						onConfirm: (selectedRows: any[]) => {
							refModal3.current?.handlerClose();
							if (!selectedRows || selectedRows.length === 0) return;

							const selectedData = selectedRows[0];
							const updateRow = {
								slaveCourier: selectedData.code,
								slaveCouriername: selectedData.name,
							};
							ref.current.updateRow(updateRow, rowIndex);
							ref.current['curRowIdx'] = rowIndex;
						},
					});
				},
			},
		},
		{
			headerText: t('lbl.TON_GRADE'), //톤급
			dataField: 'carcapacity',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.STORAGETYPE'),
			/*저장조건*/ dataField: 'storagetype',
			required: true,
			dataType: 'code',
			editable: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('TM_CARRIER_STORAGE', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.LN'), //노선
			dataField: 'routeNm',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'center',
				onClick: function (event: any) {
					if (event.item.status !== 'C') {
						return;
					}

					ref.current['curRowIdx'] = event.rowIndex;
					setPopupParams({
						fromDcCode: event.item.dccode,
						deliverydt: event.item.deliverydt,
					});

					refModal.current.handlerOpen();
				},
			},
		},
		{ headerText: t('lbl.FROMDCCODE'), /*출발센터*/ dataField: 'fromDccodename', dataType: 'string', editable: false },
		{ headerText: t('lbl.TODCCODE'), /*도착센터*/ dataField: 'toDccodename', dataType: 'string', editable: false },
		{
			headerText: t('lbl.ROUTEYN'), //경유여부
			dataField: 'routeYn',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: true,
				checkableFunction: (rowIndex: number, columnIndex: number, value: any, isChecked: boolean, item: any) => {
					if (item?.status !== 'C') {
						return false;
					}
					return true;
				},
			},
		},
		{
			headerText: t('lbl.STATUS_RT'), //진행상태
			dataField: 'status',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('TM_TRANSPORT_STATUS', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.PRIORITY'), //회차
			dataField: 'carrierCnt',
			dataType: 'numeric',
			formatString: '#,##0',
			required: true,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (item?.status !== 'C') {
					ref.current?.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				maxlength: 3,
				onlyNumeric: true, // 0~9 까지만 허용
				allowNegative: false, //음수허용
			},
		},
		{
			headerText: t('lbl.COST'), //비용
			dataField: 'totPrice',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.REMARK'), //비고
			dataField: 'rmk',
			dataType: 'string',
		},
		{
			headerText: t('lbl.FROMDCCODE'), //출발센터
			dataField: 'dccode',
			dataType: 'string',
			editable: false,
			required: true,
			visible: false,
		},
		{
			headerText: t('lbl.TODCCODE'), //도착센터
			dataField: 'toDccode',
			dataType: 'string',
			editable: false,
			required: true,
			visible: false,
		},
		{
			headerText: t('lbl.CARRIER'), //운송사
			dataField: 'courier',
			dataType: 'string',
			editable: false,
			required: true,
			visible: false,
		},
		{
			headerText: t('lbl.SLAVE_COURIER'), //2차운송사
			dataField: 'slaveCourier',
			dataType: 'string',
			editable: false,
			required: true,
			visible: false,
		},
		{
			headerText: t('lbl.LN'), //노선
			dataField: 'carrierRouteId',
			dataType: 'string',
			editable: false,
			required: true,
			visible: false,
		},
		{
			headerText: t('lbl.CONTRACTTYPE'), //계약유형
			dataField: 'contracttype',
			dataType: 'string',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 비용 조회
	 * @param params
	 * @param row
	 */
	const getTotPrice = () => {
		const curRowIdx = ref.current['curRowIdx'];
		const selectedRow = ref.current.getItemByRowIndex(curRowIdx);

		if (
			commUtil.isNotEmpty(selectedRow.deliverydt) &&
			commUtil.isNotEmpty(selectedRow.carno) &&
			commUtil.isNotEmpty(selectedRow.courier) &&
			commUtil.isNotEmpty(selectedRow.carcapacity) &&
			commUtil.isNotEmpty(selectedRow.storagetype) &&
			commUtil.isNotEmpty(selectedRow.carrierRouteId) &&
			commUtil.isNotEmpty(selectedRow.routeYn) &&
			commUtil.isNotEmpty(selectedRow.contracttype) &&
			commUtil.isNotEmpty(selectedRow.carrierCnt) &&
			selectedRow.carrierCnt > 0
		) {
			const param = {
				masterInfo: selectedRow,
			};

			apiGetTotPrice(param).then(res => {
				const updatedRow = {
					...selectedRow,
					totPrice: commUtil.isEmpty(res.data) ? null : res.data.totPrice,
				};

				ref.current.updateRow(updatedRow, curRowIdx);
			});
		} else {
			const updatedRow = {
				...selectedRow,
				totPrice: null,
			};
			ref.current.updateRow(updatedRow, curRowIdx);
		}
	};

	/**
	 * 챠량정보 조회
	 * @param params
	 * @param row
	 */
	const getCarInfo = () => {
		const curRowIdx = ref.current['curRowIdx'];
		const selectedRow = ref.current.getItemByRowIndex(curRowIdx);

		if (commUtil.isNotEmpty(selectedRow.carno)) {
			const param = {
				masterInfo: selectedRow,
			};

			apiGetCarInfo(param).then(res => {
				const updatedRow = {
					...selectedRow,
					carcapacity: res.data.carcapacity,
					contracttype: res.data.contracttype,
					courier: res.data.courier,
					couriername: res.data.couriername,
					slaveCourier: res.data.slaveCourier,
					slaveCouriername: res.data.slaveCouriername,
				};
				ref.current.updateRow(updatedRow, curRowIdx);

				// 비용 재조회
				getTotPrice();
			});
		} else {
			const updatedRow = {
				...selectedRow,
				totPrice: null,
			};
			ref.current.updateRow(updatedRow, curRowIdx);
		}
	};

	/**
	 * 노선 조회 선택 callback
	 * @param params
	 */
	const onCallbackHandler = (params: any) => {
		refModal.current?.handlerClose();

		if (params) {
			const curRowIdx = ref.current['curRowIdx'];
			const selectedRow = ref.current.getItemByRowIndex(curRowIdx);

			const updatedRow = {
				...selectedRow,
				carrierRouteId: params.serialkey,
				routeNm: params.routeNm,
				dccode: params.fromDccode,
				fromDccodename: params.fromDccodename,
				toDccode: params.toDccode,
				toDccodename: params.toDccodename,
			};

			ref.current.updateRow(updatedRow, curRowIdx);

			// 비용 재조회
			getTotPrice();
		}
	};

	/**
	 * 노선 조회 팝업 close callback
	 */
	const onCloseCallback = () => {
		refModal.current?.handlerClose();
	};

	/**
	 * 차량 조회 선택 callback
	 * @param params
	 */
	const onCallbackHandlerCar = (params: any) => {
		refModal2.current?.handlerClose();
		const curRowIdx = ref.current['curRowIdx'];

		if (params.length > 0) {
			const selectedRow = ref.current.getItemByRowIndex(curRowIdx);

			const updatedRow = {
				...selectedRow,
				carno: params[0].code,
			};

			ref.current.updateRow(updatedRow, curRowIdx);

			getCarInfo();
		}
	};

	/**
	 * 차량 조회 선택 close callback
	 * @param params
	 */
	const onCloseCallbackCar = () => {
		refModal2.current.handlerClose();
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * row change
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('selectionChange', (event: any) => {
			const primeCell = event.primeCell;

			// 선택된 행의 상세 정보를 조회한다.
			props.searchDetailList(primeCell.item);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			if (event.item.status !== 'C') {
				return false;
			}

			const curDataField = event.dataField;
			if (curDataField === 'deliverydt') {
				if (event.item.rowStatus !== 'I') {
					return false; // false 반환. 기본 행위인 편집 불가
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditEnd', (event: any) => {
			const curDataField = event.dataField;
			const { rowIndex } = event;
			const curRowData = ref.current.getGridData()[rowIndex];
			ref.current['curRowIdx'] = rowIndex;

			if (curDataField === 'deliverydt') {
				const updatedRow = {
					...curRowData,
					carrierRouteId: '',
					routeNm: '',
					dccode: '',
					fromDccodename: '',
					toDccode: '',
					toDccodename: '',
					totPrice: null,
				};

				ref.current.updateRow(updatedRow, rowIndex);
			} else if (curDataField === 'carno') {
				const { carno } = ref.current.getGridData()[rowIndex];
				setCarno(carno);

				const updatedRow = {
					...curRowData,
					carno: '',
					carcapacity: '',
					contracttype: '',
					totPrice: null,
				};

				ref.current.updateRow(updatedRow, rowIndex);

				refModal2.current.handlerOpen();
			} else if (curDataField === 'routeNm') {
				const { deliverydt, dccode } = curRowData;

				setPopupParams({
					fromDcCode: dccode,
					deliverydt: deliverydt,
				});

				const updatedRow = {
					...curRowData,
					carrierRouteId: '',
					routeNm: '',
					dccode: '',
					fromDccodename: '',
					toDccode: '',
					toDccodename: '',
					totPrice: null,
				};

				ref.current.updateRow(updatedRow, rowIndex);

				refModal.current.handlerOpen();
			} else if (curDataField === 'couriername') {
				const { courier, couriername } = curRowData;

				const updatedRow = {
					...curRowData,
					courier: '',
					couriername: '',
					totPrice: null,
				};

				ref.current.updateRow(updatedRow, rowIndex);
			} else if (curDataField === 'slaveCouriername') {
				const { slaveCourier, slaveCouriername } = curRowData;

				const updatedRow = {
					...curRowData,
					slaveCourier: '',
					slaveCouriername: '',
				};

				ref.current.updateRow(updatedRow, rowIndex);
			} else if (curDataField === 'carrierCnt' || curDataField === 'routeYn' || curDataField === 'storagetype') {
				const updatedRow = {
					...curRowData,
					totPrice: null,
				};

				ref.current.updateRow(updatedRow, rowIndex);

				getTotPrice();
			}
		});
	};

	/**
	 * 수송배차조정 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const chkDataList = ref.current.getChangedData();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const insertList: any[] = [];
		const updateList: any[] = [];

		chkDataList.forEach((item: any) => {
			if (item.rowStatus === 'I') {
				insertList.push(item);
			} else {
				updateList.push(item);
			}
		});

		const params = {
			insertMasterList: insertList,
			updateMasterList: updateList,
		};

		ref.current.showConfirmSave(() => {
			ref.current.clearGridData();

			apiSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});

					// 재조회
					props.onSearchMaster();
				}
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
					deliverydt: dayjs().format('YYYYMMDD'),
					status: 'C',
					routeYn: 'N',
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
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

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</GridAutoHeight>
			{/* 노선 조회 팝업 */}
			<CustomModal ref={refModal} width="700px">
				<TmTransportControlRoutingPopup
					params={popupParams}
					onCallbackHandler={onCallbackHandler}
					onCloseHandler={onCloseCallback}
				/>
			</CustomModal>

			{/* 차량 조회 팝업 */}
			<CustomModal ref={refModal2} width="1000px">
				<CmSearchPopup
					type={'car'}
					codeName={carno}
					callBack={onCallbackHandlerCar}
					close={onCloseCallbackCar}
				></CmSearchPopup>
			</CustomModal>

			{/* 공통 검색 팝업 래퍼 */}
			<CmSearchCarrierWrapper ref={refModal3} />
		</>
	);
});

export default TmTransportControlDetail1;
