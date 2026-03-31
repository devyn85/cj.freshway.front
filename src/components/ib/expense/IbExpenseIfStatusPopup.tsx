/*
 ############################################################################
 # FiledataField	: IbExpenseIfStatusPopup.tsx
 # Description		: 비용기표 - 인터페이스 결과 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.08
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// Type

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostIFStatusList } from '@/api/ib/apiIbExpense';

interface PropsType {
	serialkey: any;
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

	// grid data
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const gridRef: any = useRef(null);

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: '문서유형', //문서유형
			dataField: 'transactionCd',
			dataType: 'code',
		},
		{
			headerText: '인터페이스번호', //인터페이스번호
			dataField: 'zinvoice',
			dataType: 'code',
		},
		{
			headerText: '수신번호', //수신번호
			dataField: 'zreturn',
			dataType: 'code',
		},
		{
			headerText: '식별코드', //식별코드
			dataField: 'ifId',
			dataType: 'code',
		},
		{
			headerText: '결과상태', //결과상태
			dataField: 'fiIfStatus',
			dataType: 'code',
		},
		{
			headerText: '결과메시지', //결과메시지
			dataField: 'xmsgs',
		},
		{
			headerText: '처리자', //처리자
			dataField: 'editwho',
			dataType: 'code',
		},
		{
			headerText: '처리일자', //처리일자
			dataField: 'editdate',
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
		const params = {
			serialkey: props.serialkey,
		};

		apiPostIFStatusList(params).then((res: any) => {
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

	// 페이지 버튼 함수 바인딩
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
		searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="IF Status 조회" func={titleFunc} />

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
					닫기
				</Button>
			</ButtonWrap>
		</>
	);
};

export default IbExpenseElecTaxPopup;
