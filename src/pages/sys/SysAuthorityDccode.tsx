/*
 ############################################################################
 # FiledataField	: SysAuthority.tsx
 # Description		: ADMIN > 시스템운영 > 그룹 권한
 # Author			: JangGwangSeok
 # Since			: 25.05.14
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import SysAuthorityDccodeDetail from '@/components/sys/authority/SysAuthorityDccodeDetail';

// API
import { apiGetSysAuthorityGroupList } from '@/api/sys/apiSysAuthority';

const SysAuthorityDccode = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// form
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [searchBox] = useState({});
	const [totalCntGrp, setTotalCntGrp] = useState(0);

	// 검색상자 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const search = () => {
		refs.gridRefGrp.current.clearGridData();
		refs.gridRefDtl.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetSysAuthorityGroupList(params).then(res => {
			setGridData(res.data);
			setTotalCntGrp(res.data.length);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = refs.gridRefGrp.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			refs.gridRefGrp.current.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 초기화
	 * @returns {void}
	 */
	const resetFn = () => {
		refs.gridRefGrp.current.clearGridData();
		refs.gridRefDtl.current.clearGridData();
		setTotalCntGrp(0);
		setGridData([]);
		form.resetFields();
	};

	// 페이지 버튼 function 연동
	const titleFunc = {
		reset: resetFn,
		searchYn: search,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				{/* <SysAuthoritySearch search={search} /> */}
			</SearchForm>

			{/* 화면 상세 영역 정의 */}
			<SysAuthorityDccodeDetail ref={refs} data={gridData} totalCnt={totalCntGrp} callBackFn={search} />
		</>
	);
};

export default SysAuthorityDccode;
