/*
 ############################################################################
 # FiledataField	: IbExpenseStatusHouseBLNoPopup.tsx
 # Description		: 원가관리리포트 - Houser BL No 팝업
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
import { apiPostPopupHouseBLNoInfo } from '@/api/ib/apiIbExpenseStatus';

interface PropsType {
	houseblno?: any;
	callBack?: any;
	close?: any;
}

const IbExpenseStatusHouseBLNoPopup = (props: PropsType) => {
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
		searchVal: null,
		dateType: 'REG_DATE',
		searchDateCategory: 'regdate',
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
			headerText: 'ERP P/O No', //ERP P/O No
			dataField: 'erpPoId',
			dataType: 'code',
		},
		{
			headerText: 'P/O No', //P/O No
			dataField: 'poNo',
			dataType: 'code',
		},
		{
			headerText: 'C/L Rest', //C/L Rest
			dataField: 'customsFlag',
			dataType: 'code',
		},
		{
			headerText: 'Doc No', //Doc No
			dataField: 'keyNo',
			dataType: 'code',
		},
		{
			headerText: 'B/L No', //B/L No
			dataField: 'houseBlNo',
			dataType: 'code',
		},
		{
			headerText: 'Pur.Person', //Pur.Person
			dataField: 'purPerson',
			dataType: 'code',
		},
		{
			headerText: 'Payment Type', //Payment Type
			dataField: 'paymentType',
			dataType: 'code',
		},
		{
			headerText: 'Vendor Name', //Vendor Name
			dataField: 'shipperName',
			dataType: 'string',
		},
		{
			headerText: 'Curr.', //Curr.
			dataField: 'totalAmountUnit',
			dataType: 'numeric',
		},
		{
			headerText: 'Amount', //Amount
			dataField: 'totalAmount',
			dataType: 'numeric',
		},
		{
			headerText: 'Unit.', //Unit.
			dataField: 'totalAuantityUnit',
			dataType: 'code',
		},
		{
			headerText: 'Quantity', //Quantity
			dataField: 'totalQuantity',
			dataType: 'numeric',
		},
		{
			headerText: 'B/L Date', //B/L Date
			dataField: 'onboardDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'ETA', //ETA
			dataField: 'arrivalDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'B/L Date', //B/L Date
			dataField: 'issueDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'Carrier', //Carrier
			dataField: 'carrierName',
			dataType: 'string',
		},
		{
			headerText: 'S.Port', //S.Port
			dataField: 'shippingPortName',
			dataType: 'code',
		},
		{
			headerText: 'D.Port', //D.Port
			dataField: 'arrivalPortName',
			dataType: 'code',
		},
		{
			headerText: 'Delivey Type', //Delivey Type
			dataField: 'priceTermsCode',
			dataType: 'code',
		},
		{
			headerText: 'TransPort Kind', //TransPort Kind
			dataField: 'transportKind',
			dataType: 'code',
		},
		{
			headerText: 'Reg Id', //Reg Id
			dataField: 'regId',
			dataType: 'code',
		},
		{
			headerText: 'Reg Date', //Reg Date
			dataField: 'regDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'Mod Id', //Mod Id
			dataField: 'modId',
			dataType: 'code',
		},
		{
			headerText: 'Mod Date', //Mod Date
			dataField: 'modDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
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
			{ comCd: 'REG_DATE', cdNm: 'Reg. Date' },
			{ comCd: 'ISSUE_DATE', cdNm: 'Issue Date' },
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
			houseblno: searchParams.searchVal,
		};

		if (searchParams.searchDateCategory) {
			if (searchParams.dtRange) {
				params[searchParams.searchDateCategory + 'From'] = dayjs(searchParams.dtRange[0]).format('YYYYMMDD');
				params[searchParams.searchDateCategory + 'To'] = dayjs(searchParams.dtRange[1]).format('YYYYMMDD');
			} else {
				params['regdateFrom'] = dayjs().format('YYYYMMDD');
				params['regdateTo'] = dayjs().format('YYYYMMDD');
			}
		}

		apiPostPopupHouseBLNoInfo(params).then((res: any) => {
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

		form.setFieldValue('dateType', 'REG_DATE');
		form.setFieldValue('searchDateCategory', 'regdate');
		form.setFieldValue('searchVal', props.houseblno);

		// searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="House BL No 조회" func={titleFunc} />

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
					<InputText name="searchVal" label={t('House BL No')} allowClear />
				</li>

				<Form.Item name="searchDateCategory" hidden>
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

export default IbExpenseStatusHouseBLNoPopup;
