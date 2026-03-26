/*
 ############################################################################
 # FiledataField	: MsBlankLoc.tsx
 # Description		: 기준정보 > 센터기준정보 > 기둥/빈 공간 정보
 # Author			: jangjaehyun
 # Since			: 25.06.24
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsBlankLocDetail from '@/components/ms/blankLoc/MsBlankLocDetail';
import MsBlankLocSearch from '@/components/ms/blankLoc/MsBlankLocSearch';

// API
import { apiGetMasterList } from '@/api/ms/apiMsBlankLoc';

// Store
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';

const MsBlankLoc = () => {
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
		dcCode: gDccode,
		zone: null,
		loc: null,
		locType: null,
	});

	const [zoneOptions, setZoneOptions] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchBlankLoc = () => {
		if (gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchBlankLocRun();
			});
		} else {
			searchBlankLocRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchBlankLocRun = () => {
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
		searchYn: searchBlankLoc, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	// 피킹존 데이터 초기화 및 조회
	useEffect(() => {
		const loadZone = async () => {
			await fetchMsZone();
			const zones = getMsZoneList(form.getFieldValue('dcCode'));
			setZoneOptions(zones);
		};
		loadZone();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsBlankLocSearch
					form={form}
					search={searchBlankLoc}
					zoneOptions={zoneOptions}
					setZoneOptions={setZoneOptions}
				/>
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsBlankLocDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchBlankLoc} />
		</>
	);
};
export default MsBlankLoc;
