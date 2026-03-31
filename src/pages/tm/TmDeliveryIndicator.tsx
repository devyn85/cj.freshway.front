/*
 ############################################################################
 # FiledataField	: TmDeliveryIndicator.tsx
 # Description		: 통합수당관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.12
 ############################################################################
*/
// lib
import { Form } from 'antd';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// store

// API Call Function

import { apiGetMasterList } from '@/api/tm/apiTmDeliveryIndicator';
import TmDeliveryIndicatorDetail from '@/components/tm/deliveryIndicator/TmDeliveryIndicatorDetail';
import TmDeliveryIndicatorSearch from '@/components/tm/deliveryIndicator/TmDeliveryIndicatorSearch';
import dayjs from 'dayjs';
// util

// hook

// type

// asset
const TmDeliveryIndicator = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [gridDataByMonth, setGridDataByMonth] = useState([]);
	const [totalCntByMonth, setTotalCntByMonth] = useState(0);
	const [gridDataByDay, setGridDataByDay] = useState([]);
	const [totalCntByDay, setTotalCntByDay] = useState(0);
	// const dcCode = Form.useWatch('dcCode', form);z
	// const dcCode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		deliverydt: dayjs(),
		// dcCode: dcCode,
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
			rateStd: form1.getFieldValue('rateStd') ? form1.getFieldValue('rateStd') : '100',
			deliveryDt: params.deliverydt.format('YYYYMMDD'),
		};

		apiGetMasterList(searchParam).then(res => {
			setGridDataByMonth(res.data.monthly);
			setTotalCntByMonth(res.data.monthly.length);
			setGridDataByDay(res.data.daily);
			setTotalCntByDay(res.data.daily.length);
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
				<TmDeliveryIndicatorSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}

			<TmDeliveryIndicatorDetail
				ref={refs}
				data={gridDataByMonth}
				totalCnt={totalCntByMonth}
				data1={gridDataByDay}
				totalCnt1={totalCntByDay}
				fnCallBack={searchMaterList}
				form={form}
				form1={form1}
			/>
		</>
	);
};

export default TmDeliveryIndicator;
