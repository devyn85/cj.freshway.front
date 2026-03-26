/*
 ############################################################################
 # FiledataField	: IbApprovalListResultPopup.tsx
 # Description		: 비용결재 - 결재 결과 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.25
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Utils

// Store

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
//import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { apiPostApprovalLine } from '@/api/ib/apiIbApprovalList';
import { LabelText } from '@/components/common/custom/form';

interface PropsType {
	serialkey: any;
	title: any;
	close?: any;
}

const IbApprovalListResultPopup = (props: PropsType) => {
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
			headerText: '종류', //종류
			dataField: 'lineTypeName',
			dataType: 'code',
		},
		{
			headerText: '직위', //직위
			dataField: 'personPosition',
			dataType: 'code',
			visible: false,
		},
		{
			headerText: '성명', //성명
			dataField: 'personName',
			dataType: 'code',
		},
		// {
		// 	headerText: '전화번호', //전화번호
		// 	dataField: 'phone',
		// 	dataType: 'code',
		// },
		{
			headerText: '상태', //상태
			dataType: 'code',
			dataField: 'apprStatusName',
		},
		{
			headerText: '일시', //일시
			dataField: 'apprDate',
			dataType: 'date',
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		selectionMode: 'singleRow',
	};

	// 헤더  General Information 영역
	const gridBtnHeader: GridBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 헤더 나머지 영역 제목
	const tableBtnHeader: TableBtnPropsType = {
		tGridRef: gridRef, // 그리드 Ref
		btnArr: [],
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

		apiPostApprovalLine(params).then((res: any) => {
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
		//searchYn: searchMasterList,
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
			<PopupMenuTitle name="결재현황" func={titleFunc} />

			{/* 결재명 영역 정의 */}
			<UiDetailViewArea>
				<UiDetailViewGroup>
					<li style={{ gridColumn: '1 / span 4' }}>
						<LabelText name="summary" label={t('lbl.TITLE')} value={props.title} readOnly />
					</li>
				</UiDetailViewGroup>
			</UiDetailViewArea>

			{/* 그리드 영역 정의 */}
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

export default IbApprovalListResultPopup;
