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
import CmUserDetail from '@/components/cm/user/CmUserDetail';
import CmUserSearch from '@/components/cm/user/CmUserSearch';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API
import { apiGetCmUserList } from '@/api/cm/apiCmUser';

const CmUser = () => {
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
	const searchConfirm = () => {
		if (refs.current?.checkChangeData()) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				refs.current?.resetUserData();
				search();
			});
		} else {
			refs.current?.resetUserData();
			search();
		}
	};

	// 조회
	const search = () => {
		// 그리드 초기화
		refs.gridRefUser.current.clearGridData();
		refs.gridRefConnect.current.clearGridData();
		refs.gridRefAuthority.current.clearGridData();

		const params = form.getFieldsValue();

		apiGetCmUserList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);

			// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
			refs.gridRefUser.current.setColumnSizeList(refs.gridRefUser.current.getFitColumnSizeList(true));
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchConfirm,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CmUserSearch search={search} form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<CmUserDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={search} />
		</>
	);
};

export default CmUser;
