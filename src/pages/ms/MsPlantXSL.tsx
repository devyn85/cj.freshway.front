/*
 ############################################################################
 # FiledataField	: MsPlantXSL.tsx
 # Description		: 저장위치정보 조회
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsPlantXSLDetail from '@/components/ms/plantXSL/MsPlantXSLDetail';
import MsPlantXSLSearch from '@/components/ms/plantXSL/MsPlantXSLSearch';

// store

// API Call Function
import { apiGetPlantXSLList } from '@/api/ms/apiMsPlantXSL';

// util
import { validateForm } from '@/util/FormUtil';
// hook

// type

// asset
const MsPlantXSL = () => {
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
		organizeName: null,
		organize: null,
		plant: '2170',
		dccode: '2170',
		qtyyn: null,
		contractyn: 'Y',
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
		// 상세폼이 수정된 상태이면 확인 메시지 출력
		// if (refs.current.isChangeForm()) {
		// 	// showMessage({
		// 	// 	content: t('msg.MSG_COM_CFM_009'),
		// 	// 	modalType: 'info',
		// 	// });
		// 	// return;
		// 	const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
		// 	if (!isConfirm) return;
		// }
		refs.current.resetDetail();
		const params = form.getFieldsValue();

		apiGetPlantXSLList(params).then(res => {
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
				<MsPlantXSLSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<MsPlantXSLDetail ref={refs} data={gridData} totalCnt={totalCnt} searchApi={searchMaterList} />
		</>
	);
};

export default MsPlantXSL;
