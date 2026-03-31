/*
 ############################################################################
 # FiledataField	: StStockOutOrg.tsx
 # Description		: 외부비축센터간이동
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.25
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// store
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
// API Call Function
import { apiGetDataHeaderList } from '@/api/st/apiStOutMove';
import StOutMoveDetail from '@/components/st/outMove/StOutMoveDetail';
import StOutMoveSearch from '@/components/st/outMove/StOutMoveSearch';
import dayjs from 'dayjs';

// util

// hook

// type

// asset
const StOutMove = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [zoneOptions, setZoneOptions] = useState([]);
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		SKU_L: '',
		SKU_M: '',
		SKU_D: '',
		SKU_S: '',
		stockStatus: 10,
		storageType: null,
		stockType: null,
		stockGrade: null,
		fixDcCode: '2170',
		slipDt: dayjs(),
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}
		const params = form.getFieldsValue();

		const slipDt = params.slipDt?.format('YYYYMMDD');
		const searchParms = {
			...params,
			slipDt: slipDt ? slipDt : null,
		};

		apiGetDataHeaderList(searchParms).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
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
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StOutMoveSearch form={form} searchMaterList={searchMaterList} setZoneOptions={setZoneOptions} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<StOutMoveDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={searchMaterList} form={form} />
		</>
	);
};

export default StOutMove;
