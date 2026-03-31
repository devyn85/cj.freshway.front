/*
 ############################################################################
 # FiledataField	: CbCommunity.tsx
 # Description		: 시스템운영자열람자료 
 # Author			: KimJiSoo
 # Since			: 25.08.29
 ############################################################################
 */

// Lib
import { Form } from 'antd';
// Utils

// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import { apiGetCommuintyList } from '@/api/cb/apiCbCommunity';
import CbCommunityDetail from '@/components/cb/community/CbCommunityDetail';
import CbCommunitySearch from '@/components/cb/community/CbCommunitySearch';

const CbCommunity = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

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
		refs.gridRef.current?.clearGridData();

		const params = form.getFieldsValue();
		params.brdDocDivCd = 'ADMINBOARD';

		apiGetCommuintyList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CbCommunitySearch ref={refs} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<CbCommunityDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={search} detailForm={detailForm} />
		</>
	);
};

export default CbCommunity;
