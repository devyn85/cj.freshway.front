// lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MgModifyLogExDcDetail from '@/components/mg/modifyLogExDc/MgModifyLogExDcDetail';
import MgModifyLogExDcSearch from '@/components/mg/modifyLogExDc/MgModifyLogExDcSearch';

// store

// API Call Function
import { apiGetMasterList } from '@/api/mg/apiMgModifyLogExDC';
// util

// hook

// type

// asset
const MgModifyLogExDC = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const [form] = Form.useForm();
	// const [form1] = Form.useForm();
	// const [activeTabKey, setActiveTabKey] = useState('1');

	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	// const [gridData1, setGridData1] = useState([]);
	// const [totalCnt1, setTotalCnt1] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		date: dayjs(),
	});

	// const [searchBox1] = useState({
	// 	date: dayjs(),
	// });

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	// const refs1: any = useRef(null);

	// const dcCode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMasterList = () => {
		const params = form.getFieldsValue();
		refs.gridRef.current.clearGridData();

		const searchParam = {
			...params,
			modifyDateFrom: params.date[0].format('YYYYMMDD'),
			modifyDateTo: params.date[1].format('YYYYMMDD'),
		};

		apiGetMasterList(searchParam).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => {
			searchMasterList();
		},
	};

	// // 탭 아이템 영역
	// const tabs = [
	// 	{
	// 		key: '1',
	// 		label: '변경이력',
	// 		children: (

	// 		),
	// 	},
	// 	{
	// 		key: '2',
	// 		label: '상품이력번호변경',
	// 		children: (
	// 			<>
	// 				<SearchFormResponsive form={form1} initialValues={searchBox1}>
	// 					<MgModifyLogExDcSkuSearch form={form1} />
	// 				</SearchFormResponsive>
	// 				<MgModifyLogExDcSkuDetail ref={refs1} data={gridData1} totalCount={totalCnt1} />
	// 			</>
	// 		),
	// 	},
	// ];

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<>
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<MgModifyLogExDcSearch form={form} />
				</SearchFormResponsive>
				<MgModifyLogExDcDetail ref={refs} data={gridData} totalCount={totalCnt} />
			</>
		</>
	);
};

export default MgModifyLogExDC;
