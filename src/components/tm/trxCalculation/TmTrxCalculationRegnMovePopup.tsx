/*
 ############################################################################
 # FiledataField	: TmTrxCalculationRegnMovePopup.tsx
 # Description		: 운송비정산 - 권역이동 횟수 조회
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.12.21
 ############################################################################
 */

// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Utils

// Store

// Component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPosRegnMoveList } from '@/api/tm/apiTmTrxCalculation';

interface PropsType {
	dccode: any;
	close?: any;
	serialkey: any;
}

const TmTrxCalculationRegnMovePopup = (props: PropsType) => {
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
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// grid Ref
	const gridRef = useRef<{ setGridData: (data: any) => void; clearGridData?: () => void }>(null);

	// searchForm data 초기화
	const [searchBox] = useState({
		custkey: null,
		custname: '',
	});

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'), //회전수
			dataType: 'code',
			editable: false,
			formatString: '#,##0',
		},
		{
			dataField: 'regnMoveCnt',
			headerText: t('lbl.DISTRICTMOVE'), //권역이동
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		},
	];

	// 그룹코드 그리드 속성 설정
	const gridProps = {
		editable: false,
		showRowNumColumn: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
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
		const params = {
			dccode: props.dccode,
			serialkey: props.serialkey,
		};

		apiPosRegnMoveList(params).then((res: any) => {
			if (gridRef.current) {
				gridRef.current.setGridData(res.data);
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

	/**
	 * 초기 실행
	 */
	useEffect(() => {
		searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.DISTRICTMOVE')} func={titleFunc} />

			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 하단 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.CLOSE')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default TmTrxCalculationRegnMovePopup;
