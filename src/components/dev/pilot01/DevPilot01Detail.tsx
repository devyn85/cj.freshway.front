/*
 ############################################################################
 # FiledataField	: DevPilot01Detail.tsx
 # Description		: 센터상품속성
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Input, Row } from 'antd';

// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputNumber, InputText, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// API

interface DevPilot01DetailProps {
	data: any;
	totalCount: any;
	setCurrentPage: any;
	searchDtl: any;
	detailData: any;
	saveGrid: any;
	saveDetailInfo: any;
}

const DevPilot01Detail = forwardRef((props: DevPilot01DetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [form] = Form.useForm();

	// 센터상품속성 상세 정의
	interface DetailInfo {
		rowStatus: string | null;
		serialkey: string | null;
		dccode: string | null;
		storerkey: string | null;
		sku: string | null;
		skuName: string | null;
		crossdocktype: string | null;
		putawaytype: string | null;
		wharea: string | null;
		whareafloor: number | null;
		loccategory: string | null;
		loclevel: string | null;
		zone: string | null;
		loc: string | null;
		abc: string | null;
		minpoqty: number | null;
		targetpoqty: number | null;
		effectivedate: string | null;
		other01: string | null;
		other02: string | null;
		other03: string | null;
		other04: string | null;
		other05: string | null;
		status: string | null;
		cpYn: string | null;
		smsYn: string | null;
		invoiceCrtType: string | null;
		delYn: string | null;
		cubeYn: string | null;
		adddate: string | null;
		editdate: string | null;
		addwho: string | null;
		editwho: string | null;
	}

	// 그리드 제목
	const [gridTitle] = useState<string>(t('lbl.SKUDCSET_GRID_TITLE'));

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 진행상태 컬럼 표시
	 * @param {any} rowIndex 행
	 * @param {any} columnIndex 열
	 * @param {any} value 코드
	 * @returns {string} 코드명
	 */
	const statusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_SKU', value)?.cdNm;
	};

	/**
	 * C/D타입 컬럼 표시
	 * @param {any} rowIndex 행
	 * @param {any} columnIndex 열
	 * @param {any} value 코드
	 * @returns {string} 코드명
	 */
	const crossdocktypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CROSSDOCKTYPE', value)?.cdNm;
	};

	/**
	 * 적치유형 컬럼 표시
	 * @param {any} rowIndex 행
	 * @param {any} columnIndex 열
	 * @param {any} value 코드
	 * @returns {string} 코드명
	 */
	const putawaytypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
	};

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 배열
	 */
	const getGridCol = () => [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'storerkey', headerText: t('lbl.STORERKEY'), dataType: 'code', editable: false }, // 회사
		{ dataField: 'sku', headerText: t('lbl.SKUCD'), editable: false, dataType: 'code', filter: { showIcon: true } }, // 상품코드
		{ dataField: 'skuDescr', headerText: t('lbl.SKUNM'), editable: false, innerWidth: 100, filter: { showIcon: true } }, // 상품명
		{
			dataField: 'crossdocktype',
			headerText: t('lbl.CROSSDOCKTYPE'),
			dataType: 'code',
			editable: false,
			labelFunction: crossdocktypeLabelFunc,
		},
		{
			dataField: 'putawaytype',
			headerText: t('lbl.PUTAWAYTYPE'),
			editable: false,
			labelFunction: putawaytypeLabelFunc,
		},
		{ dataField: 'wharea', headerText: t('lbl.WHAREA'), editable: false },
		{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), dataType: 'code', editable: false },
		{ dataField: 'loccategory', headerText: t('lbl.LOCCATEGORY'), editable: false },
		{ dataField: 'loclevel', headerText: t('lbl.LOCLEVEL'), editable: false },
		{ dataField: 'zone', headerText: t('lbl.ZONE'), editable: false },
		{ dataField: 'loc', headerText: t('lbl.LOC'), editable: false },
		{ dataField: 'abc', headerText: t('lbl.ABC'), dataType: 'code', editable: false },
		{ dataField: 'minpoqty', headerText: t('lbl.MINPOQTY'), dataType: 'numeric', editable: false },
		{ dataField: 'targetpoqty', headerText: t('lbl.TARGETPOQTY'), dataType: 'numeric', editable: false },
		{ dataField: 'effectivedate', headerText: t('lbl.EFFECTIVEDATE'), dataType: 'date', editable: false },
		{ dataField: 'other01', headerText: t('lbl.INVOICE_CRT_PRT_SEQ'), editable: false },
		{ dataField: 'other02', headerText: t('lbl.ALLOCFIXTYPE'), editable: false },
		{ dataField: 'other03', headerText: t('lbl.OTHER03'), editable: false },
		{ dataField: 'other04', headerText: t('lbl.OTHER04'), editable: false },
		{ dataField: 'other05', headerText: t('lbl.OTHER05'), editable: false },
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editable: false,
			labelFunction: statusLabelFunc,
		},
		{
			dataField: 'smsYn',
			headerText: t('lbl.SMS_YN'),
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN2', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'invoiceCrtType',
			headerText: t('lbl.INVOICE_CRT_TYPE'),
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('INVOICE_CRT_TYPE', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ dataField: 'delYn', headerText: '', visible: false },
		{ dataField: 'serialkey', headerText: '', visible: false },
		{ dataField: 'cubeYn', headerText: t('lbl.CUBE_YN'), dataType: 'code', editable: false },
		{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), editable: false },
		{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), dataType: 'date', editable: false },
		{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), editable: false },
		{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'date', editable: false },
	];

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		const gridProps = {
			editable: true,
			//editBeginMode: 'doubleClick',
			fillColumnSizeMode: false,
			enableColumnResize: false,
			showRowCheckColumn: true,
			enableFilter: true,
		};

		return gridProps;
	};

	/**
	 * 상세 정보 행을 추가한다.
	 */
	const addDeatilInfo = () => {
		// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
		if (form.getFieldValue('rowStatus') === 'I') {
			showAlert(null, t('msg.MSG_COM_ERR_054'));
		}

		// 초기화된 상세 정보 객체를 생성한다.
		const initValues: DetailInfo = {
			rowStatus: 'I',
			serialkey: null,
			dccode: null,
			storerkey: null,
			sku: null,
			skuName: null,
			crossdocktype: 'STD',
			putawaytype: '',
			wharea: null,
			whareafloor: null,
			loccategory: null,
			loclevel: null,
			zone: null,
			loc: null,
			abc: null,
			minpoqty: 0,
			targetpoqty: 0,
			effectivedate: null,
			other01: null,
			other02: null,
			other03: null,
			other04: null,
			other05: null,
			status: '00',
			cpYn: null,
			smsYn: null,
			invoiceCrtType: null,
			delYn: 'N',
			cubeYn: null,
			adddate: null,
			editdate: null,
			addwho: null,
			editwho: null,
		};

		// 폼에 초기화된 값을 설정한다.
		form.setFieldsValue(initValues);
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @returns {void}
	 */
	const handleSaveGrid = () => {
		// 1 변경 데이터 확인
		//const updatedItems = gridRef.current.getChangedData();

		// 2 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (updatedItems.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		props.saveGrid(updatedItems);
	};

	/**
	 * 상세 정보를 확인하고, 유효성 검사를 거쳐 저장을 진행한다.
	 */
	const handleSaveDeatilInfo = async () => {
		try {
			await form.validateFields();
			if (form.getFieldValue('rowStatus') === 'R') {
				showAlert(null, t('msg.MSG_COM_VAL_020'));
				return;
			}
			props.saveDetailInfo([form.getFieldsValue(true) as DetailInfo]);
		} catch (error: any) {
			showAlert(null, error.errorFields[0].errors[0]);

			// 에러 메시지 추출 (antd v4 기준)
			//if (error && error.errorFields && error.errorFields.length > 0) {
			//	showAlert(null, error.errorFields[0].errors[0]);
			//} else {
			//showAlert(null, t('msg.existsEmptyFields'));
			//}
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'copy', // 행복사
					initValues: {
						menuId: '',
						regId: '',
						regDt: '',
					},
				},
				{
					btnType: 'plus', // 행추가
					initValues: {
						menuYn: 0,
						useYn: 0,
					},
				},
				// {
				// 	btnType: 'delete', // 행삭제
				// },
				{
					btnType: 'save', // 저장
					callBackFn: handleSaveGrid,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const setTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'pre', // 이전
				},
				{
					btnType: 'post', // 다음
				},
				// {
				// 	btnType: 'delete', // 행삭제
				// },
				{
					btnType: 'btn1', // 사용자 정의버튼1
				},
				{
					btnType: 'btn2', // 사용자 정의버튼2
				},
				{
					btnType: 'btn3', // 사용자 정의버튼3
				},
				{
					btnType: 'new', // 신규
					callBackFn: addDeatilInfo,
				},
				{
					btnType: 'save', // 저장
					callBackFn: handleSaveDeatilInfo,
				},
			],
		};

		return tableBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.addCheckedRowsByValue('serialkey', event.item.serialkey);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellDoubleClick', (event: any) => {
			// 선택된 셀(행)의 상세 정보를 조회한다.
			//searchDtl(event.item);
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const primeCell = event.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			props.searchDtl(primeCell.item);
		});
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			props.setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: props.totalCount,
	});

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			if (form.getFieldValue('rowStatus') === 'R') {
				form.setFieldValue('rowStatus', 'U');
			}
		}
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
	});

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (gridRef?.current && props.data) {
			gridRef.current.appendData(props.data);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(gridRef.current.getRowCount());
		}
	}, [props.data, gridRef]);

	/**
	 * 상세 데이터를 조회하면 상세 영역에 바인딩한다.
	 */
	useEffect(() => {
		form.resetFields();

		form.setFieldsValue({
			...props.detailData,
		});
	}, [props.detailData]);

	return (
		<>
			<Row gutter={12}>
				<Col span={8}>
					{/* 그리드 영역 정의 */}
					<AGrid>
						<GridTopBtn gridTitle={gridTitle} gridBtn={setGridBtn()} totalCnt={props.totalCount} />
						<AUIGrid ref={gridRef} columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</Col>
				{/* 상세 영역 정의 */}
				<Col span={16}>
					<Form form={form} onValuesChange={onValuesChange}>
						<AGrid>
							<TableTopBtn tableBtn={setTableBtn()} />
							<UiDetailViewArea>
								<UiDetailViewGroup>
									<Form.Item name="rowStatus" hidden>
										<Input />
									</Form.Item>
									<li>
										<SelectBox
											name="dccode"
											label={t('lbl.DCCODE')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getUserDccodeList('')}
											fieldNames={{ label: 'dcname', value: 'dccode' }}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText
											name="storerkey"
											label={t('lbl.STORERKEY')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.STORERKEY')])}
											maxLength={20}
											showCount
											required
											rules={[
												{ required: true, validateTrigger: 'none' },
												() => ({
													validator(_, value) {
														if (commUtil.isNotEmpty(value) && value.length < 4) {
															return Promise.reject(new Error(t('msg.minLen3')));
														}
														return Promise.resolve();
													},
													validateTrigger: 'none',
												}),
											]}
										/>
									</li>
									<li style={{ gridColumn: '3 / span 2' }}>
										<CmSkuSearch
											form={form}
											selectionMode="singleRow"
											name="skuName"
											label={t('lbl.SKUCD')}
											code="sku"
											returnValueFormat="name"
										/>
									</li>
									<li>
										<InputText
											name="wharea"
											label={t('lbl.WHAREA')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.WHAREA')])}
											maxLength={20}
											showCount
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputNumber
											name="whareafloor"
											label={t('lbl.WHAREAFLOOR')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.WHAREAFLOOR')])}
											min={0}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText
											name="loccategory"
											label={t('lbl.LOCCATEGORY')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCCATEGORY')])}
											maxLength={20}
											showCount
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText
											name="loclevel"
											label={t('lbl.LOCLEVEL')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCLEVEL')])}
											maxLength={20}
											showCount
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText
											name="zone"
											label={t('lbl.ZONE')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ZONE')])}
											maxLength={20}
											showCount
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText
											name="loc"
											label={t('lbl.LOC')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOC')])}
											maxLength={20}
											showCount
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<SelectBox
											name="putawaytype"
											label={t('lbl.PUTAWAYTYPE')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('PUTAWAYTYPE', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											name="crossdocktype"
											label={t('lbl.CROSSDOCKTYPE')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('CROSSDOCKTYPE', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText
											name="other01"
											label={t('lbl.INVOICE_CRT_PRT_SEQ')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.배송분류표출력순위')])}
											maxLength={20}
											showCount
										/>
									</li>
									<li>
										<SelectBox
											name="other02"
											label={t('lbl.ALLOCFIXTYPE')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('ALLOCFIXTYPE', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText
											name="other03"
											label={t('lbl.OTHER03')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER03')])}
											maxLength={20}
											showCount
										/>
									</li>
									<li>
										<InputText
											name="other04"
											label={t('lbl.OTHER04')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER04')])}
											maxLength={20}
											showCount
										/>
									</li>
									<li>
										<InputText
											name="other05"
											label={t('lbl.OTHER05')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER05')])}
											maxLength={20}
											showCount
										/>
									</li>
									<li>
										<SelectBox
											name="cpYn"
											label={t('lbl.CP_YN')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('YN2', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											name="smsYn"
											label={t('lbl.SMS_YN')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('YN2', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											name="invoiceCrtType"
											label={t('lbl.INVOICE_CRT_TYPE')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('INVOICE_CRT_TYPE', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											name="status"
											label={t('lbl.STATUS')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('STATUS_SKU', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<SelectBox
											name="delYn"
											label={t('lbl.DEL_YN')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('DEL_YN', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required
										/>
									</li>
									<li>
										<SelectBox
											name="cubeYn"
											label={t('lbl.CUBE_YN')}
											span={24}
											placeholder={t('msg.selectBox')}
											options={getCommonCodeList('YN2', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li></li>
									<li>
										<InputText name="adddate" label={t('lbl.ADDDATE')} maxLength={20} disabled={true} />
									</li>
									<li>
										<InputText name="editdate" label={t('lbl.EDITDATE')} maxLength={20} disabled={true} />
									</li>
									<li>
										<InputText name="addwho" label={t('lbl.ADDWHO')} maxLength={20} disabled={true} />
									</li>
									<li>
										<InputText name="editwho" label={t('lbl.EDITWHO')} maxLength={20} disabled={true} />
									</li>
								</UiDetailViewGroup>
							</UiDetailViewArea>
						</AGrid>
					</Form>
				</Col>
			</Row>
		</>
	);
});

export default DevPilot01Detail;
