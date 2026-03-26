/*
 ############################################################################
 # FiledataField	: StDailyInoutEXDC.tsx
 # Description		: 외부비축상품별수불현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StDailyInoutExDcDetail from '@/components/st/dailyInoutEXDC/StDailyInoutExDcDetail';
import StDailyInoutExDcSearch from '@/components/st/dailyInoutEXDC/StDailyInoutExDcSearch';

// store

// API Call Function
import { apiGetMasterList } from '@/api/st/apiStDailyInoutEXDC';

// util

// hook

// type

// asset
const StDailyInoutExDc = () => {
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
		fixDcCode: '2170',
		date: dayjs(),
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	const dcCode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = async () => {
		//2170 외 사용 불가

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const params = form.getFieldsValue();

		refs.gridRef.current.clearGridData();
		refs.gridRef1.current.clearGridData();
		const searchParam = {
			...params,
			fromDeliveryDate: params.date[0].format('YYYYMMDD'),
			toDeliveryDate: params.date[1].format('YYYYMMDD'),
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
				<StDailyInoutExDcSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<StDailyInoutExDcDetail ref={refs} data={gridData} totalCnt={totalCnt} form={form} />
		</>
	);
};

export default StDailyInoutExDc;
