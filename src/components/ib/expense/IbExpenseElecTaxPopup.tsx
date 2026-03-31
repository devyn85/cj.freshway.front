/*
 ############################################################################
 # FiledataField	: IbExpenseElecTaxPopup.tsx
 # Description		: 비용기표 - 매입세금계산서 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.08
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';

// Hook
import { useKeydownAUIGrid } from '@/hooks/useKeydownAUIGrid';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostElecTaxList } from '@/api/ib/apiIbExpense';

interface PropsType {
	serialkey: any;
	adjustmentSupplierCode: any;
	adjustmentSupplierName: any;
	cbRegisno: any;
	callBack?: any;
	close?: any;
}

const IbExpenseElecTaxPopup = (props: PropsType) => {
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
		docFlag: '',
	});

	// 기간 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');

	// 입고일자 기간 초기값
	const [rangeDates, setRangeDates] = useState([dayjs(), dayjs()]);

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: '회사코드', //회사코드
			dataField: 'bukrs',
			dataType: 'code',
		},
		{
			headerText: '승인번호', //승인번호
			dataField: 'issueId',
			dataType: 'code',
		},
		{
			headerText: '일련번호', //일련번호
			dataField: 'invSeq',
			dataType: 'code',
		},
		{
			headerText: '총공급가', //총공급가
			dataField: 'chargetotal',
			dataType: 'numeric',
		},
		{
			headerText: '총세액', //총세액
			dataField: 'taxtotal',
			dataType: 'numeric',
		},
		{
			headerText: '총액', //총액
			dataField: 'grandtotal',
			dataType: 'numeric',
		},
		{
			headerText: '주소', //주소
			dataField: 'bpAddr',
			editable: false,
		},
		{
			headerText: '대표자명', //대표자명
			dataField: 'bpRepres',
			dataType: 'code',
		},
		{
			headerText: '담당부서', //담당부서
			dataField: 'bpDeptname',
		},
		{
			headerText: '담당자명', //담당자명
			dataField: 'bpPersname',
			dataType: 'code',
		},
		{
			headerText: '이메일', //이메일
			dataField: 'email',
			dataType: 'code',
		},
		{
			headerText: '발행일', //발행일
			dataField: 'issueDt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: '작성일', //작성일
			dataField: 'issueDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: '변경일', //변경일
			dataField: 'aedat',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		selectionMode: 'singleRow',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * Mapping을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getMapping = () => {
		const types = [
			{ comCd: '', cdNm: 'No Mapping' },
			{ comCd: 'X', cdNm: 'Mapping' },
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
			serialkey: props.serialkey,
			bupla: '1',
			adjustmentSupplierCode: props.adjustmentSupplierCode,
			adjustmentSupplierName: '',
			cbRegisno: props.cbRegisno,
			issuedateFrom: dayjs(searchParams.dtRange[0]).format('YYYYMMDD'),
			issuedateTo: dayjs(searchParams.dtRange[1]).format('YYYYMMDD'),
			docFlag: searchParams.docFlag,
		};

		apiPostElecTaxList(params).then((res: any) => {
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
			//props.setElecTaxRow(data[0]);
			props.callBack(data[0]);
			props.close();
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
		const initialStart = dayjs().subtract(10, 'day');
		const initialEnd = dayjs().add(10, 'day');
		setRangeDates([initialStart, initialEnd]);
		form.setFieldValue('dtRange', [initialStart, initialEnd]);
	}, []);

	// Component Updated
	useEffect(() => {
		initEvent();
	}, []);

	// Ctrl+F Hook이 "GridTopBtn.tsx" 파일에 존재하는데 해당 파일엔 쓰지 않아 예외적으로 추가
	useKeydownAUIGrid(
		{ key: 'F', ctrlKey: true },
		() => {
			gridRef?.current?.openFindPopup();
		},
		gridRef,
	);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="매입세금계산서" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2">
				<li>
					<Rangepicker //작성일자
						name="dtRange"
						label={t('작성일자')}
						defaultValue={rangeDates} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						span={24}
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<SelectBox
						name="docFlag"
						options={getMapping()}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('전표매핑유무')}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			</SearchFormResponsive>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>

			{/* 그리드 영역 정의 */}
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

export default IbExpenseElecTaxPopup;
