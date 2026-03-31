/*
 ############################################################################
 # FiledataField	: MsLocation.tsx
 # Description		: 기준정보 > 센터기준정보 > 로케이션정보
 # Author			: YeoSeungCheol
 # Since			: 25.06.26
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsLocationDetail from '@/components/ms/location/MsLocationDetail';
import MsLocationSearch from '@/components/ms/location/MsLocationSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsLocation';

// Store
import { useAppSelector } from '@/store/core/coreHook';

const MsLocation = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 글로벌 변수 및 사용자 정보
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const user = useAppSelector(state => state.user.userInfo);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// 물류센터 코드 상태
	const [dccode, setDccode] = useState([]);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		loc: null,
		description: null,
		whAreaFloor: null,
		zone: null,
		locType: null,
		locCategory: null,
		locLevel: null,
		locFlag: null,
		delYn: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 */
	const searchMasterList = async () => {
		const formDccodeValue = form.getFieldsValue().dccode;
		if (!formDccodeValue) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DCCODE')]));
			return;
		}

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
	 */
	const searchMasterListRun = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);

		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.dcCode) {
			setDccode(changedValues.dcCode);
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 첫진입시 물류센터 코드 세팅
	useEffect(() => {
		const initialDccode = globalVariable.gDccode || user?.defDccode;
		if (initialDccode) {
			setDccode([initialDccode]);
		}
	}, [globalVariable.gDccode, user?.defDccode]);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} onValuesChange={onValuesChange}>
				<MsLocationSearch form={form} dccode={dccode} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsLocationDetail
				ref={gridRef}
				detailForm={detailForm}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
				callBackFn={searchMasterList}
			/>
		</>
	);
};

export default MsLocation;
