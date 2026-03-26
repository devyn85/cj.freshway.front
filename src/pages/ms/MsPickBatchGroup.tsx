/*
 ############################################################################
 # FiledataField	: MsPickBatchGroup.tsx
 # Description		: 기준정보 > 센터기준정보 > 피킹그룹정보
 # Author			: jangjaehyun
 # Since			: 25.06.23
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsPickBatchGroupDetail from '@/components/ms/pickBatchGroup/MsPickBatchGroupDetail';
import MsPickBatchGroupSearch from '@/components/ms/pickBatchGroup/MsPickBatchGroupSearch';

// Store
import { fetchMsPlant } from '@/store/biz/msPlantStore';

// API
import { apiGetMasterList } from '@/api/ms/apiMsPickBatchGroup';

const MsPickBatchGroup = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		batchGroup: null,
		description: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchPickBatchGroupList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchPickBatchGroupListRun();
			});
		} else {
			searchPickBatchGroupListRun();
		}
	};

	/**
	 * 조회
	 * @returns {void}
	 */
	const searchPickBatchGroupListRun = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length); // 전체 데이터 개수 설정

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchPickBatchGroupList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 플랜트 데이터 초기화 및 조회
	useEffect(() => {
		const fetchInitStore = async () => {
			await fetchMsPlant();
		};
		// init store
		fetchInitStore();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsPickBatchGroupSearch form={form} search={searchPickBatchGroupList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsPickBatchGroupDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchPickBatchGroupList}
				form={form}
			/>
		</>
	);
};
export default MsPickBatchGroup;
