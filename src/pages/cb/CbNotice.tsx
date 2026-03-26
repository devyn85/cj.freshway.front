/*
 ############################################################################
 # FiledataField	: CbNotice.tsx
 # Description		: 공지사항
 # Author			: KimJiSoo
 # Since			: 25.09.19
 ############################################################################
 */

// Lib
import { Form } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import { apiGetNoticeList } from '@/api/cb/apiCbNotice';
import CbNoticeDetail from '@/components/cb/notice/CbNoticeDetail';
import CbNoticeSearch from '@/components/cb/notice/CbNoticeSearch';

const CbNotice = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const location = useLocation();
	const navigate = useNavigate();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({ useYn: '' });

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	// 조회
	const search = () => {
		// 그리드 초기화
		refs.gridRef.current.clearGridData();
		refs.gridRefFile.current.clearGridData();
		refs.gridRefRcv.current.clearGridData();

		const params = form.getFieldsValue();
		params.brdDocDivCd = 'NOTICE';

		params.brdStDt = params.brdDt && params.brdDt[0] ? params.brdDt[0].format('YYYYMMDD') : '';
		params.brdExprDt = params.brdDt && params.brdDt[1] ? params.brdDt[1].format('YYYYMMDD') : '';

		// "/cb/cbNotice?brdNum="" 으로 접근시
		const brdNum = location?.state?.brdNum;
		if (commUtil.isNotEmpty(brdNum)) {
			params.brdNum = brdNum;

			// "brdNum" state 값 삭제
			navigate('.', {
				replace: true,
				state: {
					...location?.state,
					brdNum: '',
				},
			});
		}

		apiGetNoticeList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = refs.gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			refs.gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CbNoticeSearch ref={refs} form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<CbNoticeDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={search} detailForm={detailForm} />
		</>
	);
};

export default CbNotice;
