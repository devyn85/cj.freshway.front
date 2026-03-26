/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorODetail.tsx
 # Description		: 외부비축재고속성변경 페이징 및 상세영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.05.25
 ############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type

// Component
import { apiGetMasterList } from '@/api/st/apiStExdcTransIndicatorO';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StExdcTransIndicatorODetail from '@/components/st/exdcTransIndicatorO/StExdcTransIndicatorODetail';
import StExdcTransIndicatorOSearch from '@/components/st/exdcTransIndicatorO/StExdcTransIndicatorOSearch';
import dayjs from 'dayjs';

const StExdcTransIndicatorO = forwardRef((props: any, gridRef: any) => {
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
		date: dayjs(),
		// dcCode: '2170',
		storageType: null,
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
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}
		const params = form.getFieldsValue();
		// //console.log(params.date.format('YYYY'));
		// //console.log(params);
		const searchParam = {
			...params,
			year: params.date.format('YYYY'),
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
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} name={'년도별 운송료지표'} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StExdcTransIndicatorOSearch form={form} />
			</SearchFormResponsive>
			<StExdcTransIndicatorODetail
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				fnCallBack={searchMaterList}
				form={form}
			/>
		</>
	);
});

export default StExdcTransIndicatorO;
