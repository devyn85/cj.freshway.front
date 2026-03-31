/*
 ############################################################################
 # FiledataField	: TmManageEntity.tsx
 # Description		: 통합수당관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.12
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmEntityRuleDetail from '@/components/tm/entityRule/TmEntityRuleDetail';
import TmEntityRuleSearch from '@/components/tm/entityRule/TmEntityRuleSearch';

// store

// API Call Function
import { apiGetMasterList } from '@/api/tm/apiTmEntityRule';
import { useSelector } from 'react-redux';
// util

// hook

// type

// asset
const TmManageEntity = () => {
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
	// const dcCode = Form.useWatch('dcCode', form);z
	const dcCode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		date: dayjs(),
		dcCode: dcCode,
		sttlItemCd: '',
		contractType: null,
		ton: '',
		closeType: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns
	 */
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

		const searchParam = {
			...params,
			contractYn: true,
			standardFromDate: params.date[0].format('YYYYMMDD'),
			standardToDate: params.date[1].format('YYYYMMDD'),
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
				<TmEntityRuleSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmEntityRuleDetail ref={refs} data={gridData} totalCnt={totalCnt} fnCallBack={searchMaterList} form={form} />
		</>
	);
};

export default TmManageEntity;
