/*
 ############################################################################
 # FiledataField	: TmAmountDaily.tsx
 # Description		: 일자별 수당관리
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.08.06
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import { apiGetMasterList } from '@/api/tm/apiTmAmountDaily';
import TmAmountDailyDetail from '@/components/tm/amountdaily/TmAmountDailyDetail';
import TmAmountDailySearch from '@/components/tm/amountdaily/TmAmountDailySearch';
import { showConfirmAsync } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const TmAmountDaily = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		basedtRange: [dayjs().startOf('week'), dayjs().endOf('week')],
		sttlitemcd: '',
		courier: '',
		courierName: null,
		carno: null,
		carnoName: null,
		carcapacity: '',
		contractType: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const refs = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		// 그리드 수정여부 체크
		if (refs.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}
		// 그리드 데이터 초기화
		refs.gridRef.current.clearGridData();
		const formdata = form.getFieldsValue();
		const params = {
			...formdata,
			fromdt: dayjs(formdata.basedtRange[0]).format('YYYYMMDD'),
			todt: dayjs(formdata.basedtRange[1]).format('YYYYMMDD'),
		};
		delete params.basedtRange;
		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 운송사 검색에서는 특별한 처리가 필요하지 않음
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox} onValuesChange={onValuesChange}>
				<TmAmountDailySearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<TmAmountDailyDetail ref={refs} data={gridData} totalCnt={totalCnt} callBackFn={searchMasterList} form={form} />
		</>
	);
};

export default TmAmountDaily;
