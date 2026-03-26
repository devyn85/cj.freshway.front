/*
 ############################################################################
 # FiledataField	: CmDcManager.tsx
 # Description		: 기준정보 > 사용자및센터정보 > 물류센터관리
 # Author			: jangjaehyun
 # Since			: 25.07.18
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import CmDcManagerDetail from '@/components/cm/dc/CmDcManagerDetail';
import CmDcManagerSearch from '@/components/cm/dc/CmDcManagerSearch';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API Call Function
import { apiGetMasterList } from '@/api/cm/apiCmDcManager';

// Hooks

const CmDcManager = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (detailForm.getFieldValue('rowStatus') === 'U' || gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		//상세 영역 초기화
		setGridData([]);
		detailForm.resetFields();

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			if (res.data.length > -1) {
				setTotalCnt(res.data.length);
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<CmDcManagerSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<CmDcManagerDetail
				ref={gridRef}
				detailForm={detailForm}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMasterList}
			/>
		</>
	);
};
export default CmDcManager;
