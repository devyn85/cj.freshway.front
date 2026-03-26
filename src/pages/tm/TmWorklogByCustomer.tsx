/*
 ############################################################################
 # FiledataField	: TmWorklogByCustomer.tsx
 # Description		: 배차작업로그(거래처별) 조회
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib

import { Form } from 'antd';

// component
import MenuTitle from '@/components/common/custom/MenuTitle';

// store

// api
import { apiGetWorkLogByCustomerList } from '@/api/tm/apiTmWorklogByCustomer';

// util
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmWorklogByCustomerDetail from '@/components/tm/workLog/TmWorklogByCustomerDetail';
import TmWorklogByCustomerSearch from '@/components/tm/workLog/TmWorklogByCustomerSearch';
import dateUtils from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// hook

// type

// asset
const TmWorklogByCustomer = () => {
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
	const today = dateUtils.getToDay('YYYY-MM-DD');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		truthcustkeyname: '',
		truthcustkey: '',
		deliverydt: dayjs(today),
		carno: '',
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 조회
	const searchMaterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		refs.current.resetDetail();
		const formData = form.getFieldsValue();
		const params = {
			dccode: formData.gMultiDccode,
			deliverydt: dayjs(formData.deliverydt).format('YYYYMMDD'),
			carno: formData.carno,
			truthcustkey: formData.truthcustkey,
		};
		apiGetWorkLogByCustomerList(params).then(res => {
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
	 *	02. 함수 선언부
	 * =====================================================================
	 */

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
				<TmWorklogByCustomerSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmWorklogByCustomerDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMaterList}
			/>
		</>
	);
};

export default TmWorklogByCustomer;
