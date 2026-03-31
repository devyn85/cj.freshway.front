/*
 ############################################################################
 # FiledataField	: CmCode.tsx
 # Description		: 코드마스터 
 # Author			: JangGwangSeok
 # Since			: 25.04.30
 ############################################################################
 */

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import { apiGetCmCodeList } from '@/api/cm/apiCmCode';
import CmCodeDetail from '@/components/cm/code/CmCodeDetail';
import CmCodeSearch from '@/components/cm/code/CmCodeSearch';

const CmCode = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

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
		refs.gridRefGrp.current.clearGridData();
		refs.gridRefDtl.current.clearGridData();

		const params = form.getFieldsValue();

		apiGetCmCodeList(params).then(res => {
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
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<CmCodeSearch search={search} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<CmCodeDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={search} form={form} />
		</>
	);
};

export default CmCode;
