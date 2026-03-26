// CSS

// Lib
import { Form, Tabs } from 'antd';

// Util

// Type

// ComponentP
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmCrmWmsMemoSearch from '@/components/tm/crmWmsMemo/TmCrmWmsMemoSearch';
import TmCrmWmsMemoTab1 from '@/components/tm/crmWmsMemo/TmCrmWmsMemoTab1';
import TmCrmWmsMemoTab2 from '@/components/tm/crmWmsMemo/TmCrmWmsMemoTab2';

// Store
// API
import { apiGetMasterList as apiGetCrmWmsMemoList } from '@/api/tm/apiTmCrmWmsMemo';
import { apiGetMasterList } from '@/api/tm/apiTmIssue';
import TabsArray from '@/components/common/TabsArray';
import dayjs from 'dayjs';

const TmCrmWmsMemo = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { TabPane } = Tabs;

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid 데이터(Tab1, Tab2)
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// 조회 총 건수(Tab1, Tab2)
	const [totalCount1, setTotalCount1] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	// 현재 탭 정보
	const [activeTabKey, setActiveTabKey] = useState('1');

	// 탭별 검색 조건 초기 세팅
	const searchBox = useMemo(
		() =>
			({
				'1': {
					timezoneCd: 'Asia/Seoul',
					dateRange: [dayjs().subtract(4, 'day'), dayjs()],
					schSourceSystem: '', // 작성 출처
					schStatus: '', // 진행 상태.
					schCustKey: '', // 관리처코드
					schCustName: '', // 관리처명
					schCarCode: '', // 차량 번호
					schMemoType: '', // 메모 유형.
					schExcludConfirm: '', // 확정 제외
					schStorerKey: '', // 물류센터
					schDcCode: '', // 회사코드
				},
				'2': {
					schDeliveryDt: dayjs(),
					schCustKey: '', // 관리처코드
					schCustName: '', // 관리처명
					schStatus: '', // 진행 상태.
					schStorerKey: '',
					schDcCode: '',
				},
			} as Record<string, any>),
		[],
	);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 페이지 버튼 함수 바인딩 (탭별로 다른 조회 함수 호출)
	const titleFunc = {
		searchYn: () => {
			if (activeTabKey === '1') loadCrmWmsMemoList();
			else loadIssueList();
		},
	};

	/**
	 * 탭 클릭
	 * @param {string} key 탭 키
	 */
	const tabClick = (key: string) => {
		setActiveTabKey(key);
		if (key === '1') gridRef1.current?.resize('100%', '100%');
		else gridRef2.current?.resize('100%', '100%');
	};

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 *  Tab1 일별메모 - CRM요청관리 목록 조회
	 */
	const loadCrmWmsMemoList = async () => {
		try {
			const searchVals = await form.validateFields(); // 검증 및 값 가져오기
			// dateRange가 존재할 경우에만 YYYYMMDD 포맷으로 변환
			const params = {
				...searchVals,
				// dateRange: searchVals.dateRange?.map((date: any) => date.format('YYYYMMDD')),
				schMemoDateFrom: searchVals?.dateRange[0].format('YYYYMMDD'), // 조회 시작일
				schMemoDateTo: searchVals?.dateRange[1].format('YYYYMMDD'), // 조회 종료일
			};

			const res = await apiGetCrmWmsMemoList(params);
			const resList = res.data?.map((row: any) => ({
				...row,
				rowStatus: 'R',
			}));
			setGridData1(resList);
			setTotalCount1(resList.length || 0);
		} catch (errorInfo: any) {
			// 검증 실패 시 첫 번째 에러 메시지를 알림창으로 표시
			if (errorInfo.errorFields.length > 0) {
				const firstError = errorInfo.errorFields[0].errors[0];
				showMessage({
					content: firstError,
					modalType: 'info',
				});
				return false;
			}
		}
	};

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Tab2 배송이슈 목록 조회
	 */
	const loadIssueList = async () => {
		try {
			const searchVals = await form.validateFields(); // 검증 및 값 가져오기

			const params = {
				...searchVals,
				schDeliveryDt: searchVals.schDeliveryDt?.format('YYYYMMDD'),
				schStatus: searchVals?.schStatus || '',
			};

			const res = await apiGetMasterList(params);
			const resList = res.data?.map((row: any) => ({
				...row,
				rowStatus: 'R',
			}));
			setGridData2(resList);
			setTotalCount2(resList.length || 0);
		} catch (errorInfo: any) {
			// 검증 실패 시 첫 번째 에러 메시지를 알림창으로 표시
			if (errorInfo.errorFields.length > 0) {
				const firstError = errorInfo.errorFields[0].errors[0];
				showMessage({
					content: firstError,
					modalType: 'info',
				});
				return false;
			}
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (activeTabKey === '1') gridRef1.current?.resize('100%', '100%');
		else gridRef2.current?.resize('100%', '100%');
	}, [activeTabKey, form]);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '일별 메모',
			children: (
				<TmCrmWmsMemoTab1
					gridRef={gridRef1}
					data={gridData1}
					searchForm={form}
					totalCnt={totalCount1}
					onSearch={loadCrmWmsMemoList}
					activeTabKey={activeTabKey}
				/>
			),
		},
		{
			key: '2',
			label: '배송이슈',
			children: (
				<TmCrmWmsMemoTab2
					gridRef={gridRef2}
					data={gridData2}
					searchForm={form}
					totalCnt={totalCount2}
					onSearch={loadIssueList}
				/>
			),
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} key={activeTabKey} initialValues={searchBox[activeTabKey]}>
				<TmCrmWmsMemoSearch form={form} activeKey={activeTabKey} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<TabsArray activeKey={activeTabKey} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default TmCrmWmsMemo;
