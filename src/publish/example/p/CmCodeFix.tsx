// Lib
import { Form } from 'antd';
// Utils

// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';

// API Call Function
import { apiGetCmCodeList } from '@/api/cm/apiCmCode';
import CmCodeDetail from '@/components/cm/code/CmCodeDetail';
import CmCodeSearch from '@/components/cm/code/CmCodeSearch';

const CmCodeFix = () => {
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

	// 검색영역 초기 세팅
	const [searchBox] = useState({ codelist: 'DISTANCETYPE' });

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	// 조회
	const searchCmCodeList = () => {
		// 그리드 초기화
		refs.gridRef.current.clearGridData();
		refs.gridRefDtl.current.clearGridData();

		const params = form.getFieldsValue();

		apiGetCmCodeList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchCmCodeList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<CmCodeSearch codelistDisabled={true} />
			</SearchForm>
			{/* 화면 상세 영역 정의 */}
			<CmCodeDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={searchCmCodeList} />
		</>
	);
};

export default CmCodeFix;
