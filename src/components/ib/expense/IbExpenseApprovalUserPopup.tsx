/*
 ############################################################################
 # FiledataField	: IbExpenseApprovalUserPopup.tsx
 # Description		: 비용기표 - 결재자 선택 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.08
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Input } from 'antd';

// Type

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostPopupApprovalUserInfo } from '@/api/ib/apiIbExpense';

interface PropsType {
	callBack?: any;
	close?: any;
	useridnm?: any;
}

const IbExpenseApprovalUserPopup = (props: PropsType) => {
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
		searchtype: '',
	});

	// 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: 'Code', //Code
			dataField: 'userId',
			dataType: 'code',
		},
		{
			headerText: 'Name', //Name
			dataField: 'userNm',
			dataType: 'code',
		},
		{
			headerText: 'Duty', //Duty
			dataField: 'duty',
			dataType: 'code',
		},
		{
			headerText: 'Division', //Division
			dataField: 'storernm',
			dataType: 'code',
		},
		{
			headerText: 'Dept', //Dept
			dataField: 'deptnm',
			dataType: 'code',
		},
		{
			headerText: 'e-Mail', //e-Mail
			dataField: 'email',
			dataType: 'code',
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
			{ comCd: 'userid', cdNm: 'User Id' },
			{ comCd: 'usernm', cdNm: 'User Name' },
			{ comCd: 'userdept', cdNm: 'User Dept' },
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
			useridnm: props.useridnm ? props.useridnm : '',
			requesttype: '1',
		};

		if (searchParams.searchType && searchParams.searchVal) {
			params[searchParams.searchType] = searchParams.searchVal;
		}

		apiPostPopupApprovalUserInfo(params).then((res: any) => {
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
	const onChangeSelect = (value: string | number, option: object) => {
		if (value) {
			form.setFieldValue('searchType', value.toLowerCase().replaceAll('_', ''));
		} else {
			form.setFieldValue('searchType', null);
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

	// 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// Component Updated
	useEffect(() => {
		initEvent();
		searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="결재자 조회" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2">
				<li>
					<SelectBox
						name="searchType"
						options={getMapping()}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={''}
						onChange={onChangeSelect}
					/>
				</li>
				<li>
					<InputText name="searchVal" allowClear />
				</li>
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

			<Form.Item name="searchTypeApproval" hidden>
				<Input />
			</Form.Item>
		</>
	);
};

export default IbExpenseApprovalUserPopup;
