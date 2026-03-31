/*
 ############################################################################
 # FiledataField	: KpEXstorageMonitoring.tsx
 # Description		: 지표/모니터링 > 재고운영지표 > 외부창고재고모니터링
 # Author			: ParkJinWoo (jwpark1104@cj.net)
 # Since			: 25.07.15
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import KpEXstorageMonitoringDetail from '@/components/kp/eXstorageMonitoring/KpEXstorageMonitoringDetail';
import KpEXstorageMonitoringSearch from '@/components/kp/eXstorageMonitoring/KpEXstorageMonitoringSearch';

// API
import { apiGetMaster1List, apiGetMaster2List, apiGetMasterList } from '@/api/kp/apiKpEXstorageMonitoring';
import { isEmpty } from 'lodash';

const KpEXstorageMonitoring = () => {
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

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		slipdtRange: [dayjs(), dayjs()],
		mapDiv: null,
		serialinfoCfmYn: null,
		contractType: null,
		exdcOrderType: null,
		tempYn: null,
		moveYn: null,
		skuL: null,
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
		const params = form.getFieldsValue();
		const isValid = await validateForm(form);
		const divMap = params.mapDiv;
		const searchCategory = params.searchCategory;

		if (!isValid) {
			return;
		}

		const searchParms = {
			...params,
			slipDtFrom: params.slipdtRange[0].format('YYYYMMDD'),
			slipDtTo: params.slipdtRange[1].format('YYYYMMDD'),
			...(params.searchCategory ? { searchCategory: params.searchValue } : {}),
		};

		if (!isEmpty(params.searchCategory)) {
			const key = params?.searchCategory.replace(/_/g, '').toLowerCase();
			searchParms[key] = params?.searchValue;
		}

		if (divMap === '20') {
			apiGetMasterList(searchParms).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (divMap === '10' || divMap === '30') {
			apiGetMaster1List(searchParms).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (divMap === '40') {
			apiGetMaster2List(searchParms).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		}
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
				<KpEXstorageMonitoringSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<KpEXstorageMonitoringDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMasterList}
				form={form}
			/>
		</>
	);
};
export default KpEXstorageMonitoring;
