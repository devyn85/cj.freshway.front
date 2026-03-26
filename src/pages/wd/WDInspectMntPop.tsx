/*
 ############################################################################
 # FiledataField	: WDInspectMntPop.tsx
 # Description		: 모니터링 > 검수 > 검수 공정별 현황_PDP용 팝업
 # Author			: KimDongHan
 # Since			: 2025.11.18
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import { apiPostPopList } from '@/api/wd/apiWdItemTrace';
import GridTopBtn from '@/components/common/GridTopBtn';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { CheckBox, SearchForm, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

// props: any
const WDInspectMntPop = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [storageOptions, setStorageOptions] = useState<any>([]);
	const [paramDccode, setParamDccode] = useState<any>(null);
	const [paramPopType, setParamPopType] = useState<any>(null);
	const [titleName, setTitleName] = useState<any>(null);

	const intervalRef = useRef<number | null>(null);

	const [form] = Form.useForm();

	const { t } = useTranslation();

	const gridRef = useRef(null);
	const gridRef1 = useRef(null);

	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);

	const [totalCount, setTotalCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);

	// window.open으로 열렸는지 확인
	const isWindowPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;

	const deliverygroupW = 150;
	const fromCustnameW = 300;
	const toCustnameW = 300;
	const skunameW = 860;
	const uomW = 150;
	const qty1W = 150;
	const qty2W = 150;

	const deliverygroupTW = 130;
	const fromCustnameTW = 150;
	const toCustnameTW = 150;
	const skunameTW = 350;
	const uomTW = 80;
	const qty1TW = 80;
	const qty2TW = 80;

	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: null as any,
			},
		],
	};

	const gridProps = {
		editable: false,
		selectionMode: 'singleRow',
		extraColumnOrders: 'showRowNumColumn',
		showRowCheckColumn: false,
		showRowNumColumn: false,
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const gridColDp = [
		{
			// POP
			dataField: 'deliverygroup',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
			width: deliverygroupW,
		},
		{
			// 협력사
			dataField: 'fromCustname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'text',
			editable: false,
			width: fromCustnameW,
		},
		{
			// 거래처
			dataField: 'toCustname',
			headerText: t('lbl.LB_VENDOR_NM'),
			dataType: 'text',
			editable: false,
			width: toCustnameW,
		},
		{
			// 상품명
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'),
			dataType: 'text',
			editable: false,
			width: skunameW,
		},
		{
			// 단위
			dataField: 'storeruom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
			width: uomW,
		},
		{
			// 예정량
			dataField: 'storeropenqty',
			headerText: t('lbl.INPLANQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty1W,
		},
		{
			// 입고량
			dataField: 'dpInspectqty',
			headerText: t('lbl.RECEIPTQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty2W,
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: 'red',
				};
			},
		},
	];

	const gridColWd = [
		{
			// POP
			dataField: 'deliverygroup',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
			width: deliverygroupW,
		},
		{
			// 협력사
			dataField: 'fromCustname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'text',
			editable: false,
			width: fromCustnameW,
		},
		{
			// 거래처
			dataField: 'toCustname',
			headerText: t('lbl.LB_VENDOR_NM'),
			dataType: 'text',
			editable: false,
			width: toCustnameW,
		},
		{
			// 상품명
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'),
			dataType: 'text',
			editable: false,
			width: skunameW,
		},
		{
			// 단위
			dataField: 'storeruom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
			width: uomW,
		},
		{
			// 입고량
			dataField: 'dpInspectqty',
			headerText: t('lbl.RECEIPTQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty1W,
		},
		{
			// 출고량
			dataField: 'wdInspectqty',
			headerText: t('lbl.WDQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty2W,
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: 'red',
				};
			},
		},
	];

	const gridColTDp = [
		{
			// POP
			dataField: 'deliverygroup',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
			width: deliverygroupTW,
		},
		{
			// 협력사
			dataField: 'fromCustname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'text',
			editable: false,
			width: fromCustnameTW,
		},
		{
			// 거래처
			dataField: 'toCustname',
			headerText: t('lbl.LB_VENDOR_NM'),
			dataType: 'text',
			editable: false,
			width: toCustnameTW,
		},
		{
			// 상품명
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'),
			dataType: 'text',
			editable: false,
			width: skunameTW,
		},
		{
			// 단위
			dataField: 'storeruom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
			width: uomTW,
		},
		{
			// 예정량
			dataField: 'storeropenqty',
			headerText: t('lbl.INPLANQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty1TW,
		},
		{
			// 입고량
			dataField: 'dpInspectqty',
			headerText: t('lbl.RECEIPTQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty2TW,
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: 'red',
				};
			},
		},
	];

	const gridColTWd = [
		{
			// POP
			dataField: 'deliverygroup',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
			width: deliverygroupTW,
		},
		{
			// 협력사
			dataField: 'fromCustname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'text',
			editable: false,
			width: fromCustnameTW,
		},
		{
			// 거래처
			dataField: 'toCustname',
			headerText: t('lbl.LB_VENDOR_NM'),
			dataType: 'text',
			editable: false,
			width: toCustnameTW,
		},
		{
			// 상품명
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'),
			dataType: 'text',
			editable: false,
			width: skunameTW,
		},
		{
			// 단위
			dataField: 'storeruom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
			width: uomTW,
		},
		{
			// 입고량
			dataField: 'dpInspectqty',
			headerText: t('lbl.RECEIPTQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty1TW,
		},
		{
			// 출고량
			dataField: 'wdInspectqty',
			headerText: t('lbl.WDQTY'),
			dataType: 'numeric',
			editable: false,
			width: qty2TW,
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: 'red',
				};
			},
		},
	];

	const popSearchBox = {
		storagetype: '',
	};

	const changeCheckbox = async (e: any) => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		// timer 초기화
		if (intervalRef.current) {
			window.clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		const checked = form.getFieldValue('onYn'); // Replace 'checkboxName' with the actual name of your checkbox field

		if (checked) {
			// 즉시 한 번 실행하고 1분(60000ms) 간격으로 반복
			searchMasterList();
			if (intervalRef.current) {
				window.clearInterval(intervalRef.current);
			}
			intervalRef.current = window.setInterval(() => {
				searchMasterList();
			}, 60000);
		} else {
			if (intervalRef.current) {
				window.clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	};

	const searchMasterList = async () => {
		const requestParams = form.getFieldsValue();

		requestParams.deliverydate = requestParams.deliverydate.format('YYYYMMDD');
		requestParams.dccode = paramDccode;

		if (paramPopType === '1') {
			gridRef.current?.clearGridData();
			requestParams.gubun = 'DP';
			const { data } = await apiPostPopList(requestParams);
			setGridData(data || []);
		} else if (paramPopType === '2') {
			gridRef1.current?.clearGridData();
			requestParams.gubun = 'WD';
			const { data } = await apiPostPopList(requestParams);
			setGridData1(data || []);
		} else if (paramPopType === '3') {
			gridRef2.current?.clearGridData();
			requestParams.gubun = 'DP';
			const { data } = await apiPostPopList(requestParams);

			setGridData(data || []);

			gridRef3.current?.clearGridData();
			requestParams.gubun = 'WD';
			const { data: data1 } = await apiPostPopList(requestParams);

			setGridData1(data1 || []);
		}
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	useEffect(() => {
		if (!isWindowPopup) return;

		const now = dayjs();

		const handleMessage = (event: MessageEvent) => {
			// 보안: origin 체크 (개발 환경에서는 같은 origin) 여기서 막혀서 주석처리함.
			//if (event.origin !== window.location.origin) return;
			if (!event.data.dccode) {
				return;
			}
			setParamDccode(event.data.dccode);
			setParamPopType(event.data.popType);
			setStorageOptions(event.data.storageOptions);

			if (event.data.popType === '1') {
				setTitleName(t('lbl.WD_INSPECT_MNT_POP_1'));
				const defaultDelivery = now.hour() < 12 ? now : now.add(1, 'day');
				form.setFieldValue('deliverydate', defaultDelivery);
			} else if (event.data.popType === '2') {
				setTitleName(t('lbl.WD_INSPECT_MNT_POP_2'));
				form.setFieldValue('deliverydate', now);
			} else if (event.data.popType === '3') {
				setTitleName(t('lbl.WD_INSPECT_MNT_POP_3'));
				form.setFieldValue('deliverydate', now);
			}
		};

		window.addEventListener('message', handleMessage);

		// 부모 창에 준비 완료 신호 전송
		if (window.opener) {
			window.opener.postMessage('popup-ready', window.location.origin);
		}

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [isWindowPopup]);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				window.clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (gridRef?.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);
		}

		if (gridRef2?.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData);
			gridRef2.current?.setSelectionByIndex(0, 0);
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1?.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);
		}

		if (gridRef3?.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(gridData1);
			gridRef3.current?.setSelectionByIndex(0, 0);
		}
	}, [gridData1]);

	/**
	 * 팝업 닫기
	 */
	const handleClose = () => {
		if (isWindowPopup) {
			window.close();
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<div className="pdp-monitor">
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name={`${titleName}`} />

				<SearchForm form={form} initialValues={popSearchBox} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-4">
							<li>
								{/* 출고 */}
								<DatePicker
									label={
										paramPopType == '1'
											? t('lbl.DOCDT_DP')
											: paramPopType == '2'
											? t('lbl.DOCDT_WD')
											: t('lbl.DOCDT_PLT')
									}
									name="deliverydate"
									allowClear
									showNow={true}
									format="YYYY-MM-DD"
									required={true}
									onChange={changeCheckbox}
								/>
							</li>
							<li>
								<SelectBox
									name="storagetype"
									options={storageOptions}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.STORAGETYPE')}
								/>
							</li>
							<li className="flex-wrap pl10" style={{ gridColumn: 'span 2' }}>
								<CheckBox name={'onYn'} label="On" value={'Y'} onChange={changeCheckbox}></CheckBox>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>

				{paramPopType === '1' && (
					<div className="h100 pm-blue">
						<AGrid>
							<AUIGrid ref={gridRef} columnLayout={gridColDp} gridProps={gridProps} />
						</AGrid>
					</div>
				)}
				{paramPopType === '2' && (
					<div className="h100 pm-blue">
						<AGrid>
							<AUIGrid ref={gridRef1} columnLayout={gridColWd} gridProps={gridProps} />
						</AGrid>
					</div>
				)}
				{paramPopType === '3' && (
					<>
						<Row className="h100">
							<Col span={12} className="pm-blue">
								<AGrid className="h100">
									<GridTopBtn gridTitle={t('lbl.WD_INSPECT_MNT_POP_1')} gridBtn={gridBtn} />
									<AUIGrid ref={gridRef2} columnLayout={gridColTDp} gridProps={gridProps} />
								</AGrid>
							</Col>
							<Col span={12} className="pm-red">
								<AGrid className="h100">
									<GridTopBtn gridTitle={t('lbl.WD_INSPECT_MNT_POP_2')} gridBtn={gridBtn} />
									<AUIGrid ref={gridRef3} columnLayout={gridColTWd} gridProps={gridProps} />
								</AGrid>
							</Col>
						</Row>
					</>
				)}

				{/* <ButtonWrap data-props="single">
					<Button onClick={handleClose}>{t('lbl.CLOSE')}</Button>
				</ButtonWrap> */}
			</div>
		</>
	);
};

export default WDInspectMntPop;
