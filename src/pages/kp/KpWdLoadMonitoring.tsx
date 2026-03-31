/*
 ############################################################################
 # FiledataField	: KpWdLoadMonitoring.tsx
 # Description		: 지표/모니터링 > 검수지표 > 상차검수현황 
 # Author			: ParkYoSep
 # Since			: 2025.12.12
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Util

// Type

// Component
import { apiPostMasterList } from '@/api/kp/apiKpWdLoadMonitoring';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpWdLoadMonitoringDetail from '@/components/kp/wdLoadMonitoring/KpWdLoadMonitoringDetail';
import KpWdLoadMonitoringSearch from '@/components/kp/wdLoadMonitoring/KpWdLoadMonitoringSearch';

// Store

// API

const KpWdLoadMonitoring = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	// const refs = useRef(null);
	const refs: any = useRef(null);

	const searchMasterList = async () => {
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		// refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		const searchParam = {
			...params,
			fromDate: params.date[0].format('YYYYMMDD'),
			toDate: params.date[1].format('YYYYMMDD'),
		};

		searchMasterListImp(searchParam);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		refs.gridRef1.current.clearGridData();
		apiPostMasterList(params).then(res => {
			const data = res.data || [];
			setGridData(data);
			setTotalCnt(data.length);
		});
	};

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
		date: [dayjs(), dayjs()],
	});
	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" name={'상차검수현황'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<KpWdLoadMonitoringSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<KpWdLoadMonitoringDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default KpWdLoadMonitoring;
