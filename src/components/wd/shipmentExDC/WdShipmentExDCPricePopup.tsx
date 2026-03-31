/*
 ############################################################################
 # FiledataField	: WdShipmentExDCPricePopup.tsx
 # Description		: 운송비 저장 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.11.11
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useEffect } from 'react';

// Type
import { GridBtnPropsType } from '@/types/common';

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import WdShipmentExDCCarrierPricePopup from '@/components/wd/shipmentExDC/WdShipmentExDCCarrierPricePopup';

// API
import { apiPostPriceList, apiPostPriceMasterList, apiPostSavePriceList } from '@/api/wd/apiWdShipmentExDC';

interface PropsType {
	closeEventHandler?: any;
	fromSlipdt?: any;
	toSlipdt?: any;
	sendData?: any;
}

const WdShipmentExDCPricePopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 그리드 Ref
	const gridRef = useRef(null);

	// 운송비 팝업 Ref
	const refCarrierPriceModal = useRef(null);

	// 운송료 적용 대상인 출고 목록
	const [filteredSendData, setFilteredSendData] = useState<any[]>([]);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'courierNm',
			headerText: t('lbl.CARRIER'), //운송사
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tonNm',
			headerText: t('lbl.TON_GRADE'), //톤급
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetypeNm',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'carcnt',
			headerText: t('lbl.CARCNT'), //차량대수
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'price',
			headerText: t('lbl.UNITPRICE'), //단가
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'shipFee',
			headerText: t('lbl.DELIVERYFEE_EXDC'), //운송료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'addFee',
			headerText: t('lbl.OPTION_COST'), //추가비용
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'rmk',
			headerText: t('lbl.REMARK'), //비고
			dataType: 'string',
			editable: true,
		},
		{
			dataField: 'routeId', //노선 아이디
			visible: false,
		},
		{
			dataField: 'courier', //운송사
			visible: false,
		},
		{
			dataField: 'ton', //톤급
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'serialkeyGroup',
			visible: false,
		},
		{
			dataField: 'tcrSerialkey',
			visible: false,
		},
		{
			dataField: 'storagetype',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showFooter: true,
		isLegacyRemove: true,
	};

	// 그리드 푸터 레이아웃
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), //합계
			positionField: 'shipFee',
		},
		{
			dataField: 'addFee',
			positionField: 'addFee',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
			expFunction: (_columnValues: any) => {
				// allRows는 그리드의 모든 행 데이터 배열.
				// 각 row의 shipFee addFee 더한 값의 합계를 구한다.
				const allRows: any[] = gridRef.current?.getGridData() || [];
				const removedRows = gridRef.current.getRemovedItems();
				const sum = allRows.reduce((acc, row) => {
					const matchedRow = removedRows.filter((v: any) => v.tcrSerialkey === row.tcrSerialkey);
					if (matchedRow.length <= 0) {
						const shipFee = Number(row.shipFee) || 0;
						const addFee = Number(row.addFee) || 0;
						return acc + shipFee + addFee;
					} else {
						return acc;
					}
				}, 0);
				return sum;
			},
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleClose = (param: any) => {
		props.closeEventHandler(param);
	};

	/**
	 * 대상 출고 목록 조회
	 */
	const searchPriceMasterList = () => {
		let serialkeyGroup = null;
		let dccode = null;

		for (const item of props.sendData) {
			dccode = item.dccode;
			serialkeyGroup = item.serialkeyGroup !== null ? item.serialkeyGroup : serialkeyGroup;
		}

		if (serialkeyGroup !== null) {
			const params = {
				dccode: dccode,
				fromSlipdt: props.fromSlipdt,
				toSlipdt: props.toSlipdt,
				serialkeyGroup: serialkeyGroup,
			};

			// API 호출
			apiPostPriceMasterList(params).then(res => {
				if (res.data.length > 0) {
					const filteredData = props.sendData.filter((item: any) => item.serialkeyGroup === null);

					const combined = [...filteredData, ...res.data];
					setFilteredSendData(combined);
				}
			});
		} else {
			setFilteredSendData(props.sendData);
		}
	};

	/**
	 * 운송료 (또는 단가) 목록 조회
	 */
	const searchPriceList = () => {
		if (filteredSendData && filteredSendData.length > 0) {
			// 조회용 파라미터
			const dccode = filteredSendData[0].dccode;
			const organize = filteredSendData[0].organize;
			const toCustkey = filteredSendData[0].toCustkey;
			const storagetype = filteredSendData[0].storagetype;
			let fromdt = filteredSendData[0].docdt;
			let todt = filteredSendData[0].docdt;
			let serialkeyGroup = null;

			for (const item of filteredSendData) {
				if (item.docdt < fromdt) {
					fromdt = item.docdt;
				}
				if (item.docdt > todt) {
					todt = item.docdt;
				}

				serialkeyGroup = item.serialkeyGroup !== null ? item.serialkeyGroup : serialkeyGroup;
			}

			if (serialkeyGroup !== null) {
				const params = {
					dccode: dccode,
					organize: organize,
					toCustkey: toCustkey,
					storagetype: storagetype,
					fromdt: fromdt,
					todt: todt,
					serialkeyGroup: serialkeyGroup,
				};

				// 그리드 초기화
				gridRef?.current.clearGridData();

				// API 호출
				apiPostPriceList(params).then(res => {
					gridRef.current.setGridData(res.data);

					if (res.data.length > 0) {
						// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
						// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
						const colSizeList = gridRef.current.getFitColumnSizeList(true);
						// 구해진 칼럼 사이즈를 적용 시킴.
						gridRef.current.setColumnSizeList(colSizeList);
					}
				});
			}
		}
	};

	/**
	 * 배부 버튼 클릭 이벤트
	 */
	const saveMasterList = async () => {
		// 배부할 운송료 금액 합산
		//const allRows: any[] = gridRef.current.getGridData();
		const allRows: any[] = gridRef.current.getCheckedRowItemsAll();
		const sum = allRows.reduce((acc, row) => {
			const removedRows = gridRef.current.getRemovedItems();
			const matchedRow = removedRows.filter((v: any) => v.tcrSerialkey === row.tcrSerialkey);
			if (matchedRow.length <= 0) {
				const shipFee = Number(row.shipFee) || 0;
				const addFee = Number(row.addFee) || 0;
				return acc + shipFee + addFee;
			} else {
				return acc;
			}
		}, 0);

		if (!allRows || allRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 출고 건별로 중량에 따라서 금액 배분
		const totalWeight = filteredSendData.reduce((acc, row) => {
			const weight = Number(row.weight) || 0;
			return acc + weight;
		}, 0);

		let accAmount = 0;

		for (const item of filteredSendData) {
			const amount = Number(Math.trunc(Number(sum * Number(item.weight / totalWeight))));
			item.carrierAmount = amount;
			accAmount = accAmount + amount;
		}

		// 금액을 배부하고 잔여 금액이 있으면 마지막 건에 추가한다
		if (accAmount < sum) {
			const remainder = sum - accAmount;
			filteredSendData[filteredSendData.length - 1].carrierAmount =
				filteredSendData[filteredSendData.length - 1].carrierAmount + remainder;
		}

		const priceRows: any[] = gridRef.current.getCheckedRowItemsAll();

		if (!priceRows || priceRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 체크하지 않은 행은 삭제 대상으로 포함한다
		let priceList: any[] = [];
		priceList = [...priceRows];

		gridRef.current.getGridData().forEach((element: any) => {
			const filteredRows = priceRows.filter(
				(v: any) =>
					v.courierNm === element.courierNm && v.tonNm === element.tonNm && v.storagetypeNm === element.storagetypeNm,
			);

			if (!filteredRows || filteredRows === undefined || filteredRows.length <= 0) {
				element.rowStatus = 'D';
				priceList = [...[element]];
			}
		});

		// 운송료저장 그룹키가 없는 행은 운송료저장 그룹키를 저장한다
		const serialkeyGroupRows = priceList.filter((v: any) => commUtil.isNotEmpty(v.serialkeyGroup));
		if (serialkeyGroupRows && serialkeyGroupRows.length > 0) {
			const serialkeyGroupCd = serialkeyGroupRows[0].serialkeyGroup;
			priceList.forEach((element: any) => {
				if (commUtil.isEmpty(element.serialkeyGroup)) {
					element.serialkeyGroup = serialkeyGroupCd;
				}
			});
		}

		// 전송 파라미터
		const params = {
			saveList: filteredSendData,
			savePriceList: priceList,
		};

		// API 호출
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSavePriceList(params).then(() => {
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
				handleClose('R');
			});
		});
	};

	/**
	 * 운송료 단가 팝업에서 선택한 운임단가를 그리드에 추가
	 * @param {any} params 운임단가 목록
	 */
	const setCarrierPrice = (params: any) => {
		// 중복된 운임단가가 있는지 체크한다.
		for (const item of params) {
			const gridData = gridRef.current.getGridData();
			const dupleList = gridData.filter((v: any) => item.tcrSerialkey === v.tcrSerialkey);

			if (dupleList && dupleList.length > 0) {
				showAlert(null, '중복된 운임단가를 선택할 수 없습니다.');
				return;
			}
		}

		// 팝업에서 선택한 운임단가를 그리드에 추가한다.
		gridRef.current.appendData(params);
	};

	/**
	 * 운송료 단가 팝업
	 */
	const openCarrierPricePopup = () => {
		refCarrierPriceModal.current?.handlerOpen();
	};

	/**
	 * 운송비 팝업 닫기
	 */
	const closeEventCarrierPricePopup = () => {
		refCarrierPriceModal.current?.handlerClose();
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} evnt 이벤트
	 * @param event
	 */
	const calculateColumnValue = (event: any) => {
		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'carcnt') {
			const rowIndex = event.rowIndex;
			// 운송료 = 차량대수 * 단가
			const shipFee = Math.round(Number(event.item.carcnt) * Number(event.item.price));
			gridRef.current.setCellValue(rowIndex, 'shipFee', shipFee);
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'plus', //추가
					isActionEvent: false,
					callBackFn: () => {
						openCarrierPricePopup();
					},
				},
				{
					btnType: 'delete', //삭제
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
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef.current?.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			calculateColumnValue(event);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {};

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
		searchPriceMasterList();
	}, []);

	/**
	 * 목록 조회 실행
	 */
	useEffect(() => {
		searchPriceList();
	}, [filteredSendData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="운송비" func={titleFunc} />

			{/* 화면 상세 영역 정의 */}
			<Form form={form}>
				<AGrid className="h100">
					<GridTopBtn gridBtn={getGridBtn()}></GridTopBtn>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</AGrid>
			</Form>

			{/* 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={handleClose}>
					취소
				</Button>
				<Button size={'middle'} onClick={saveMasterList} type="primary">
					배부
				</Button>
			</ButtonWrap>

			{/* 운송비 팝업 영역 정의 */}
			<CustomModal ref={refCarrierPriceModal} width="600px">
				<WdShipmentExDCCarrierPricePopup
					closeEventHandler={closeEventCarrierPricePopup}
					callBack={setCarrierPrice}
					sendData={filteredSendData}
					fromSlipdt={props.fromSlipdt}
					toSlipdt={props.toSlipdt}
				/>
			</CustomModal>
		</>
	);
};

export default WdShipmentExDCPricePopup;
