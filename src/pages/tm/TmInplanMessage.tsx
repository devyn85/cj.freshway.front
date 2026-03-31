/*
 ############################################################################
 # FiledataField	: TmInplanMessage.tsx
 # Description		: 배송전달사항
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
// import MenuTitle from '@/components/common/custom/MenuTitle';
import MenuTitle from '@/components/common/custom/MenuTitle';

// store

// API Call Function

// util
import { apiGetMasterList } from '@/api/tm/apiTmInplanMessage';
import TmInplanMessageDetail from '@/components/tm/InplanMessage/TmInplanMessageDetail';
import TmInplanMessageSearch from '@/components/tm/InplanMessage/TmInplanMessageSearch';
import dayjs from 'dayjs';
// hook

// type

// asset
const TmInplanMessage = () => {
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
		dcCode: '',
		fromDt: dayjs(),
		toCustkey: null,
		saleOrganize: null,
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
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					searchApi();
				},
				() => {
					return false;
				},
			);
		} else {
			searchApi();
		}
	};
	const searchApi = () => {
		const params = form.getFieldsValue();

		const searchParam = {
			...params,
			fromDocdt: params.date[0].format('YYYYMMDD'),
			toDocdt: params.date[1].format('YYYYMMDD'),
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
				<TmInplanMessageSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmInplanMessageDetail ref={refs} data={gridData} totalCnt={totalCnt} fnCallBack={searchMaterList} form={form} />
		</>
	);
};

export default TmInplanMessage;
