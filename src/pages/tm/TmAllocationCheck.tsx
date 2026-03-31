/*
 ############################################################################
 # FiledataField	: TmAllocationCheck.tsx
 # Description		: 배차마스터체크결과
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmAllocationCheckDetail from '@/components/tm/allocationCheck/TmAllocationCheckDetail';
import TmAllocationCheckSearch from '@/components/tm/allocationCheck/TmAllocationCheckSearch';

// store

// API Call Function
import { apiGetMasterList } from '@/api/tm/apiTmAllocationCheck';
// util

import dayjs from 'dayjs';
// hook

// type

// asset
const TmAllocationCheck = () => {
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
		pvcDeliveryDt: dayjs(),
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
		//form 필수값 체크
		if (!validateForm(form)) {
			return;
		}
		refs.gridRef1.current.clearGridData();
		const searchParam = {
			...params,
			pvcDeliveryDt: params.pvcDeliveryDt.format('YYYYMMDD'),
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
				<TmAllocationCheckSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmAllocationCheckDetail ref={refs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default TmAllocationCheck;
