/*
 ############################################################################
 # FiledataField	: batchHistory.tsx
 # Description		: 배치 > 배치관리 > 배치 이력
 # Author			: yewon.kim
 # Since			: 25.07.08
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';

import BatchHistoryList from '@/components/batch/batchHistory/BatchHistoryList';
import BatchHistorySearch from '@/components/batch/batchHistory/BatchHistorySearch';

// API Call Function
import { apiGetBatchJobHistList } from '@/api/batch/apiBatchHistory';
import { SearchFormResponsive } from '@/components/common/custom/form';
import { showAlert } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';

// hooks

const BatchHistory = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const refs: any = useRef(null);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
		jobResult: null,
		stepResult: null,
        errorStatus: null,
	});

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const gridRefs: any = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회버튼
	 * @returns {void}
	 */
	const searchHistoryList = (): void => {
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.excutionDt)) {
			showAlert('', '실행일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.excutionDt[0]) || commUtil.isNull(params.excutionDt[1])) {
			showAlert('', '실행일자를 선택해주세요.');
			return;
		}
		params.execStartDt = params.excutionDt[0].format('YYYYMMDD');
		params.execEndDt = params.excutionDt[1].format('YYYYMMDD');

		if (dateUtil.getDaysDiff(params.execStartDt, params.execEndDt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		searchHistoryListRun();
	};

	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchHistoryListRun = (): void => {
		gridRefs.gridJobRef.current.clearGridData();
		//gridRefs.gridParamRef.current.clearGridData();
		//gridRefs.gridStepRef.current.clearGridData();
        gridRefs.gridJobDetailRef.current.clearGridData();

		const params = form.getFieldsValue();
		params.execStartDt = params.excutionDt[0].format('YYYYMMDD');
		params.execEndDt = params.excutionDt[1].format('YYYYMMDD');

		apiGetBatchJobHistList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchHistoryList, // 조회
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
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<BatchHistorySearch ref={refs} search={searchHistoryList} form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<BatchHistoryList ref={gridRefs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default BatchHistory;
