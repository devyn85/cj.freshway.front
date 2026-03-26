/*
 ############################################################################
 # FiledataField	: TmResultTempCar.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmResultTempCarDetail from '@/components/tm/resultTempCar/TmResultTempCarDetail';
import TmResultTempCarSearch from '@/components/tm/resultTempCar/TmResultTempCarSearch';

// store

// API Call Function

// util
import { apiGetMasterList } from '@/api/tm/apiTmResultTempCar';

// hook

// type

// asset
const TmResultTempCar = () => {
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

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		deliverydt: dayjs(),
		contractType: null,
		courier: null,
		carrier: null,
		tmDeliveryType: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = () => {
		const params = form.getFieldsValue();
		params.deliverydt = params.deliverydt.format('YYYYMM');
		const searchParam = {
			...params,
			// fromDeliverydt: params.date[0].format('YYYYMMDD'),
			// toDeliverydt: params.date[1].format('YYYYMMDD'),
		};

		apiGetMasterList(searchParam).then(res => {
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
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<TmResultTempCarSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmResultTempCarDetail ref={refs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default TmResultTempCar;
