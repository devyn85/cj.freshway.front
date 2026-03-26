/*
 ############################################################################
 # FiledataField	: TmWorklogByCar.tsx
 # Description		: 배차작업로그(차량별) 조회
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
import { apiGetWorkLogByCarList } from '@/api/tm/apiTmWorklogByCar';

// util
import { SearchFormResponsive } from '@/components/common/custom/form';
import TmWorklogByCarDetail from '@/components/tm/workLog/TmWorklogByCarDetail';
import TmWorklogByCarSearch from '@/components/tm/workLog/TmWorklogByCarSearch';
import dateUtils from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// hook

// type

// asset
const TmWorklogByCar = () => {
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
		custName: '',
		custCode: '',
		deliverydate: dayjs(today),
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
			...formData,
			dccode: formData.gMultiDccode,
			deliverydate: dayjs(formData.deliverydate).format('YYYYMMDD'),
		};
		apiGetWorkLogByCarList(params).then(res => {
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
				<TmWorklogByCarSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmWorklogByCarDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} callBackFn={searchMaterList} />
		</>
	);
};

export default TmWorklogByCar;
