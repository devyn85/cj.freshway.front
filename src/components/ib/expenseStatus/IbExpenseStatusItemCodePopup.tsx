/*
 ############################################################################
 # FiledataField	: IbExpenseStatusItemCodePopup.tsx
 # Description		: 원가관리리포트 - ITEM CODE 팝업
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
import { apiPostPopupItemCodeInfo } from '@/api/ib/apiIbExpenseStatus';

interface PropsType {
	itemcode?: any;
	erppono?: any;
	callBack?: any;
	close?: any;
}

const IbExpenseStatusItemCodePopup = (props: PropsType) => {
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
		searchType: 'ITEM_CODE',
		searchVal: null,
		searchTypeCategory: 'itemcode',
	});

	// 기간 초기값
	const [rangeDates, setRangeDates] = useState([dayjs(), dayjs()]);

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: 'ERP P/O No.', //ERP P/O No.
			dataField: 'erpPoId',
			dataType: 'code',
		},
		{
			headerText: 'Line No', //Line No
			dataField: 'lineNo',
			dataType: 'code',
		},
		{
			headerText: 'Item Code"', //Item Code
			dataField: 'itemCode',
			dataType: 'code',
		},
		{
			headerText: 'Item Desc', //Item Desc
			dataField: 'itemDescription',
			dataType: 'string',
		},
		{
			headerText: 'House B/L No.', //House B/L No.
			dataField: 'houseBlNo',
			dataType: 'code',
		},
		{
			headerText: 'HS Code', //HS Code
			dataField: 'hsCode',
			dataType: 'code',
		},
		{
			headerText: 'Quantity', //Quantity
			dataField: 'quantity',
			dataType: 'numeric',
		},
		{
			headerText: 'Unit', //Unit
			dataField: 'quantityUnit',
			dataType: 'code',
		},
		{
			headerText: 'Unit Price', //Unit Price
			dataField: 'unitPrice',
			dataType: 'numeric',
		},
		{
			headerText: 'Amount', //Amount
			dataField: 'amount',
			dataType: 'numeric',
		},
		{
			headerText: 'Curr.', //Curr
			dataField: 'amountUnit',
			dataType: 'code',
		},
		{
			headerText: 'Net Wt.', //Net Wt.
			dataField: 'netWeight',
			dataType: 'numeric',
		},
		{
			headerText: 'Unit', //Unit
			dataField: 'netWeightUnit',
			dataType: 'code',
		},
		{
			headerText: 'Gross Wt.', //Gross Wt.
			dataField: 'grossWeight',
			dataType: 'numeric',
		},
		{
			headerText: 'Unit', //Unit
			dataField: 'grossWeightUnit',
			dataType: 'code',
		},
		{
			headerText: 'Sales Customer Code', //Sales Customer Code
			dataField: 'saleCustomerCode',
			dataType: 'code',
		},
		{
			headerText: 'Sales Customer Name', //Sales Customer Name
			dataField: 'saleCustomerName',
			dataType: 'string',
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
	 * 조건유형을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getSearchType = () => {
		const types = [
			{ comCd: 'ITEM_CODE', cdNm: 'Item Code' },
			{ comCd: 'ITEM_DESCRIPTION', cdNm: 'Item Name' },
			{ comCd: 'ERP_PO_ID', cdNm: 'ERP P/O No.' },
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

		if (searchParams.dtRange) {
			params['issuedateFrom'] = dayjs(searchParams.dtRange[0]).format('YYYYMMDD');
			params['issuedateTo'] = dayjs(searchParams.dtRange[1]).format('YYYYMMDD');
		} else {
			params['issuedateFrom'] = dayjs().format('YYYYMMDD');
			params['issuedateTo'] = dayjs().format('YYYYMMDD');
		}

		if (params.erppoid || commUtil.isEmpty(params.erppoid)) {
			if (props.erppono) {
				params.erppoid = props.erppono;
			}
		}

		apiPostPopupItemCodeInfo(params).then((res: any) => {
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

		form.setFieldValue('searchTypeCategory', 'itemcode');
		form.setFieldValue('searchType', 'ITEM_CODE');
		if (props.itemcode) {
			form.setFieldValue('searchVal', props.itemcode);
		}

		//searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="ITEM CODE 조회" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2">
				<li>
					<Rangepicker //기간
						label="Issue Date"
						name="dtRange"
						defaultValue={rangeDates} // 초기값 설정
						format="YYYY-MM-DD" // 화면에 표시될 형식
						span={24}
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
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
							/>
						</Col>
						<Col span={14}>
							<InputText name="searchVal" allowClear />
						</Col>
					</span>
				</li>

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

export default IbExpenseStatusItemCodePopup;
