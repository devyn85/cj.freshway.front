/*
 ############################################################################
 # FiledataField	: SysAuthority.tsx
 # Description		: ADMIN > 시스템운영 > 권한그룹 관리
 # Author			: JangGwangSeok
 # Since			: 25.05.14
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import SysAuthorityDetail from '@/components/sys/authority/SysAuthorityDetail';
import SysAuthoritySearch from '@/components/sys/authority/SysAuthoritySearch';

// API
import { apiGetSysAuthorityGroupList } from '@/api/sys/apiSysAuthority';

const SysAuthority = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// form
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
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

	// 페이지 버튼 function 연동
	const titleFunc = {
		searchYn: search,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<SysAuthoritySearch search={search} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<SysAuthorityDetail ref={refs} data={gridData} totalCnt={totalCntGrp} callBackFn={search} />
		</>
	);
};

export default SysAuthority;
