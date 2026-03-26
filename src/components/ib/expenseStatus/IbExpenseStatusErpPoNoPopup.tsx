/*
 ############################################################################
 # FiledataField	: IbExpenseStatusErpPoNoPopup.tsx
 # Description		: 원가관리리포트 - ERP PO 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.02
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Input } from 'antd';
import dayjs from 'dayjs';

// Type

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostPopupErpPoNoInfo } from '@/api/ib/apiIbExpenseStatus';

interface PropsType {
	erppono?: any;
	callBack?: any;
	close?: any;
}

const IbExpenseStatusErpPoNoPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const gridRef: any = useRef(null);

	// searchForm data 초기화
	const [searchBox] = useState({
		searchType: 'ERP_PO_ID',
		searchVal: null,
		dateType: 'ISSUE_DATE',
		searchTypeCategory: 'hblNo',
		searchDateCategory: 'issuedate',
	});

	// 기간 초기값
	const [rangeDates, setRangeDates] = useState([dayjs(), dayjs()]);

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: 'Status', //Status
			dataField: 'status',
			dataType: 'code',
		},
		{
			headerText: 'Shipment', //Shipment
			dataField: 'invoiceFlag',
			dataType: 'code',
		},
		{
			headerText: 'Business Type', //Business Type
			dataField: 'businessTypeName',
			dataType: 'code',
		},
		{
			headerText: 'ERP P/O No', //ERP P/O No
			dataField: 'erpPoId',
			dataType: 'code',
		},
		{
			headerText: 'P/O No', //P/O No
			dataField: 'keyNo',
			dataType: 'code',
		},
		{
			headerText: 'Item', //Item
			dataField: 'lovItem',
			dataType: 'code',
		},
		{
			headerText: 'B/L No', //B/L No
			dataField: 'hblNo',
			dataType: 'code',
		},
		{
			headerText: 'Rev No', //Rev No
			dataField: 'revisionNo',
			dataType: 'code',
		},
		{
			headerText: 'Approval Date', //Approval Date
			dataField: 'issueDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'Shipping Type', //Shipping Type
			dataField: 'transport',
			dataType: 'code',
		},
		{
			headerText: 'Supplier', //Supplier
			dataField: 'supplierName',
			dataType: 'code',
		},
		{
			headerText: 'Delivery Type', //Delivery Type
			dataField: 'priceTermsCode',
			dataType: 'code',
		},
		{
			headerText: 'Payment Name', //Payment Name
			dataField: 'paymentName',
			dataType: 'string',
		},
		{
			headerText: 'Curr', //Curr
			dataField: 'totalAmountUnit',
			dataType: 'code',
		},
		{
			headerText: 'Amount', //Amount
			dataField: 'totalAmount',
			dataType: 'numeric',
		},
		{
			headerText: 'Reg.Name', //Reg.Name
			dataField: 'regId',
			dataType: 'code',
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 날짜유형을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getDateType = () => {
		const types = [
			{ comCd: 'ISSUE_DATE', cdNm: 'Issue Date' },
			{ comCd: 'SHIPPING_DATE', cdNm: 'Shipping Date' },
			{ comCd: 'EXPIRY_DATE', cdNm: 'Expiry Date' },
			{ comCd: 'ARRIVAL_DATE', cdNm: 'Arrival Date' },
			{ comCd: 'REG_DATE', cdNm: 'Reg. Date' },
			{ comCd: 'MOD_DATE', cdNm: 'Mod. Date' },
		];

		return types;
	};

	/**
	 * 조건유형을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getSearchType = () => {
		const types = [
			{ comCd: 'KEY_NO', cdNm: 'P/O No.' },
			{ comCd: 'SUPPLIER_NAME', cdNm: 'Supplier Name' },
			{ comCd: 'BUSINESS_TYPE_NAME', cdNm: 'Business Type' },
			{ comCd: 'ERP_PO_ID', cdNm: 'ERP P/O No.' },
			{ comCd: 'HBL_NO', cdNm: 'B/L No' },
		];

		return types;
	};

	/**
	 * 닫기 버튼 클릭
	 */
	const close = () => {
		props.close();
	};

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		// 그리드 초기화
		gridRef.current.clearGridData();

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();

		const params = {
			...searchParams,
		};

		if (searchParams.searchTypeCategory && searchParams.searchVal) {
			params[searchParams.searchTypeCategory] = searchParams.searchVal;
		}

		if (searchParams.searchDateCategory) {
			if (searchParams.dtRange) {
				params[searchParams.searchDateCategory + 'From'] = dayjs(searchParams.dtRange[0]).format('YYYYMMDD');
				params[searchParams.searchDateCategory + 'To'] = dayjs(searchParams.dtRange[1]).format('YYYYMMDD');
			} else {
				params['issuedateFrom'] = dayjs().format('YYYYMMDD');
				params['issuedateTo'] = dayjs().format('YYYYMMDD');
			}
		}

		apiPostPopupErpPoNoInfo(params).then((res: any) => {
			const gridRefCur = gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(res.data);
				gridRefCur?.setSelectionByIndex(0, 0);

				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);

				// 총건수 초기화
				if (res.data?.length > 0) {
					setTotalCnt(res.data.length);
				}
			}
		});
	};

	/**
	 * 확인
	 */
	const confirm = () => {
		const data = gridRef.current?.getSelectedRows();

		if (data && data.length > 0) {
			props.callBack(data[0]);
			props.close();
		}
	};

	/**
	 * 날짜 선택 조건 변경 이벤트
	 * @param value
	 * @param option
	 */
	const onChangeSelectDate = (value: string | number, option: object) => {
		if (value) {
			form.setFieldValue('searchDateCategory', value.toLowerCase().replaceAll('_', ''));
		} else {
			form.setFieldValue('searchDateCategory', null);
		}
	};

	/**
	 * 조건 선택 조건 변경 이벤트
	 * @param value
	 * @param option
	 */
	const onChangeSelectType = (value: string | number, option: object) => {
		if (value) {
			form.setFieldValue('searchTypeCategory', value.toLowerCase().replaceAll('_', ''));
		} else {
			form.setFieldValue('searchTypeCategory', null);
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 마스터 그리드 바인딩 완료
		 * @param {any} cellDoubleClick 이벤트
		 */
		gridRef.current.bind('cellDoubleClick', (event: any) => {
			confirm();
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 날짜를 셋팅한다.
	 */
	useEffect(() => {
		initEvent();

		form.setFieldValue('dateType', 'ISSUE_DATE');
		form.setFieldValue('searchDateCategory', 'issuedate');
		// form.setFieldValue('searchType', 'HBL_NO');
		if (props.erppono) {
			form.setFieldValue('searchVal', props.erppono);
			form.setFieldValue('searchTypeCategory', 'erpPoId');
		} else {
			form.setFieldValue('searchTypeCategory', 'hblNo');
		}

		// searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="ERP PO 조회" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2">
				<li>
					<span>
						<Col span={10}>
							<SelectBox //날짜선택조건
								name="dateType"
								span={24}
								options={getDateType()}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								placeholder="선택해주세요"
								onChange={onChangeSelectDate}
								required
							/>
						</Col>
						<Col span={14}>
							<Rangepicker //기간
								name="dtRange"
								defaultValue={rangeDates} // 초기값 설정
								format="YYYY-MM-DD" // 화면에 표시될 형식
								span={24}
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Col>
					</span>
				</li>

				<li>
					<span>
						<Col span={10}>
							<SelectBox
								name="searchType"
								options={getSearchType()}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								placeholder="선택해주세요"
								label={''}
								onChange={onChangeSelectType}
								disabled
							/>
						</Col>
						<Col span={14}>
							<InputText name="searchVal" allowClear />
						</Col>
					</span>
				</li>

				<Form.Item name="searchDateCategory" hidden>
					<Input />
				</Form.Item>
				<Form.Item name="searchTypeCategory" hidden>
					<Input />
				</Form.Item>
			</SearchFormResponsive>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>

			{/* 화면 상세 영역 정의 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					취소
				</Button>
				<Button size={'middle'} onClick={confirm} type="primary">
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default IbExpenseStatusErpPoNoPopup;
