/*
 ############################################################################
 # FiledataField	: CmFaxHistoryPopupDetail.tsx
 # Description		: 팩스 발송 이력 팝업 상세 영역
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

interface CmFaxHistoryPopupDetailProps {
	form: any;
	data: any;
	totalCnt: any;
	callBack: any;
}

const CmFaxHistoryPopupDetail = forwardRef((props: CmFaxHistoryPopupDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid data
	const [totalCnt, setTotalCnt] = useState(0);

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRefDtl = useRef();

	// 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: t('lbl.TR_SENDDATE'), //송신예정일시
			dataField: 'trSenddate',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TR_SENDSTAT'), //송신상태
			dataField: 'trSendstatNm',
			editable: false,
		},
		{
			headerText: t('lbl.TR_SENDRESULT'), //송신결과
			dataField: 'trRsltstatNm',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TR_SENDEDTIME'), //송신처리일시
			dataField: 'trSendtime',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TR_FAXTITLE'), //팩스제목
			dataField: 'trTitle',
			editable: false,
		},
		{
			headerText: t('lbl.TR_SENDER'), //송신자
			dataField: 'trSendname',
			editable: false,
		},
		{
			headerText: t('lbl.TR_SENDERFAXNUM'), //송신자FAX번호
			dataField: 'trSendfaxnum',
			editable: false,
		},
		{
			headerText: t('lbl.TR_RECEIVER'), //수신자
			dataField: 'trName',
			editable: false,
		},
		{
			headerText: t('lbl.TR_RECEIVERFAXNUM'), //수신자FAX번호
			dataField: 'trPhone',
			editable: false,
		},
	];

	// 그룹코드 그리드 속성 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1', // 조회
			// 	callBackFn: props.callBack,
			// 	btnLabel: t('lbl.SEARCH'),
			// },
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCnt(0);
			}

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridBtn={gridBtn} gridTitle={''} totalCnt={props.totalCnt}>
				*최근 7일간의 기록만 조회 가능합니다.
			</GridTopBtn>
			<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default CmFaxHistoryPopupDetail;
