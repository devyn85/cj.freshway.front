/*
 ############################################################################
 # FiledataField	: StExDCEtcFeePopup.tsx
 # Description		: 외부창고정산 - 기타비용등록 팝업 
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
import { SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import StExDCEtcFeePopupDetail from '@/components/st/exDCStorage/StExDCEtcFeePopupDetail';
import StExDCEtcFeePopupSearch from '@/components/st/exDCStorage/StExDCEtcFeePopupSearch';

// API Call Function
import { apiPosJournalcodeList } from '@/api/st/apiStExDCStorage';

interface PropsType {
	dccode: any;
	callBack?: any;
	close?: any;
	checkedList: any;
}

const StExDCEtcFeePopup = (props: PropsType) => {
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
	const [searchBox] = useState({
		custkey: null,
		custname: '',
	});

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
		const params = {
			fixdccode: props.dccode,
		};

		apiPosJournalcodeList(params).then((res: any) => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
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
			<PopupMenuTitle name="기타비용등록" func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StExDCEtcFeePopupSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<StExDCEtcFeePopupDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				checkedList={props.checkedList}
				callBack={props.callBack}
				dccode={props.dccode}
			/>

			{/* 하단 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default StExDCEtcFeePopup;
