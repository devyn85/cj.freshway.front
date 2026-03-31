/*
 ############################################################################
 # FiledataField	: CmFaxHistoryPopup.tsx
 # Description		: 팩스 발송 이력 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
 */

// Lib
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { Button, Form } from 'antd';

// Utils

// Store

// Component
import CmFaxHistoryPopupDetail from '@/components/cm/popup/CmFaxHistoryPopupDetail';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { getPostDataFaxHistlist } from '@/api/cm/apiCmFaxHistory';

interface PropsType {
	callBack?: any;
	close?: any;
}

const CmFaxHistoryPopup = (props: PropsType) => {
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

	// searchForm data 초기화
	const [searchBox] = useState({});

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
		refs.gridRef.current.clearGridData();
		const params = {};

		getPostDataFaxHistlist(params).then((res: any) => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
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
	 * 초기 실행
	 */
	useEffect(() => {
		searchMasterList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.FAX_SEND_HISTORY')} func={titleFunc} />

			{/* 검색 영역 정의
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CmFaxHistoryPopupSearch form={form} />
			</SearchFormResponsive>
			 */}

			{/* 화면 상세 영역 정의 */}
			<CmFaxHistoryPopupDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} callBack={searchMasterList} />

			{/* 하단 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmFaxHistoryPopup;
