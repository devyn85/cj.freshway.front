/*
 ############################################################################
 # FiledataField	: TmClaimCar.tsx
 # Description		: 클레임정보(RDC검증중)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.07
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
import { apiGetMasterList } from '@/api/tm/apiTmClaimCar';
import TmClaimCarDetail from '@/components/tm/claimCar/TmClaimCarDetail';
import TmClaimCarSearch from '@/components/tm/claimCar/TmClaimCarSearch';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
// hook

// type

// asset
const TmClaimCar = () => {
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
		fromDt: dayjs(),
		toCustkey: null,
		claimtypeL: '',
		claimtypeM: '',
		claimtypeS: '',
		// claimDtlIdS: null,
		claimtypeD: '',
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
		if (refs.gridRef.current.getChangedData().length > 0) {
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
		// console.log(params.date1);
		const searchParam = {
			...params,
			fromDeliverydt: params.date[0].format('YYYYMMDD'),
			toDeliverydt: params.date[1].format('YYYYMMDD'),
			fromdt: isEmpty(params?.date1) ? null : params?.date1[0].format('YYYYMMDD'),
			todt: isEmpty(params?.date1) ? null : params?.date1[1].format('YYYYMMDD'),
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
				<TmClaimCarSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmClaimCarDetail ref={refs} data={gridData} totalCnt={totalCnt} fnCallBack={searchMaterList} form={form} />
		</>
	);
};

export default TmClaimCar;
