// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import { Col, Form, Row, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import PageGridBtn from '@/components/common/PageGridBtn';
import TmPopUnregisterCustList from '@/components/tm/popUnregister/TmPopUnregisterDetail';
import TmPopUnregisterCustDelivery from '@/components/tm/popUnregister/TmPopUnregisterDetailCustDelivery';
import TmPopUnregisterRcmdPop from '@/components/tm/popUnregister/TmPopUnregisterDetailRcmdPop';
import TmPopUnregisterSearch from '@/components/tm/popUnregister/TmPopUnregisterSearch';

// Util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// Type

// Store

// API
import {
	// apiGetCarRolltainerList,
	// apiGetCustDeliveryList,
	// apiGetCustPopNoneList,
	// apiGetRecommendPopList,
	apiPostSaveCustPop,
} from '@/api/tm/apiTmPopUnregister';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

const TmPopUnregister = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 페이징 조회 제한 함수
	const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 차량*롤테이너 배송 이력 데이터
	const [carRolltainerData, setCarRolltainerData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 총 페이지 수
	const [totalPages, setTotalPages] = useState(0);

	// 현재 페이지 번호
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSrc, setCurrentPageSrc] = useState(1);
	const [currentPageAutoSrc, setCurrentPageAutoSrc] = useState(1);

	// 페이지당 행 수
	const [pageSize, setPageSize] = useState(2000);

	// 조회 실행 중인지 여부
	const [isLoading, setIsLoading] = useState(false);
	const isLoadingRef = useRef(false);

	// 탭
	const { TabPane } = Tabs;

	// searchForm data 초기화
	const searchBox = {
		deliverydate: dayjs(),
		custCode: '',
		custName: '',
		custtype: null,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * POP 미등록 거래처 목록 조회
	 */
	const search = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef1.current.clearGridData();
		refs.gridRef2?.current.clearGridData();
		refs.gridRef3?.current.clearGridData();

		// 조회 실행 중
		setIsLoading(true);

		const searchParams = searchForm.getFieldsValue();

		// validation
		if (commUtil.isEmpty(searchParams.deliverydate)) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DELIVERYDATE')]));
			return;
		}

		// 조회 조건 설정
		// const tt = 0;
		const params = {
			//dccode: searchBox.dccode,
			deliverydate: searchParams.deliverydate.format('YYYYMMDD'),
			custtype: searchParams.custtype,
			custkey: searchParams.custCode,
			//startRow: 0 + tt * pageSize,
			//listCount: pageSize,
		};

		// API 호출
		// apiGetCustPopNoneList(params).then(res => {
		// 	setGridData(res.data);
		// 	setTotalCount(res.data.length);
		// });
	};

	/**
	 * 거래처별 배송이력 조회
	 * @param {any} param
	 */
	const searchCustDeliveryList = (param: any) => {
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			custtype: param.custtype,
			custkey: param.custkey,
		};

		// API 호출
		// apiGetCustDeliveryList(params).then(res => {
		// 	setGridData2(res.data);
		// });
	};

	/**
	 * 추천 POP 조회
	 * @param {any} param
	 */
	const searchRecommendPopList = (param: any) => {
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			custtype: param.custtype,
			custkey: param.custkey,
		};

		// API 호출
		// apiGetRecommendPopList(params).then((res: any) => {
		// 	const data = [
		// 		{
		// 			dccode: '2600',
		// 			custkey: param.custkey,
		// 			custtype: param.custtype,
		// 			popno: '1',
		// 			carno: '12-1234',
		// 			avgweight: 20,
		// 			rolltainerNo: '',
		// 		},
		// 		{
		// 			dccode: '2600',
		// 			custkey: param.custkey,
		// 			custtype: param.custtype,
		// 			popno: '2',
		// 			carno: '12-9999',
		// 			avgweight: 20,
		// 			rolltainerNo: '',
		// 		},
		// 	];

		// 	setGridData3(data);

		// 	// setRcmdGridData(res.data.list);
		// });
	};

	/**
	 * 차량별 롤테이너별 배송이력 조회
	 * @param {any} param p
	 * @returns
	 */
	const searchCarRolltainerList = async (param: any) => {
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			popno: param.popno,
			carno: param.carno,
		};

		// API 호출
		// const res = await apiGetCarRolltainerList(params);

		const myList = {
			data: [
				{
					id: 'header',
					rolltainerNo: '롤테이너번호',
					avgweight: '일평균 물량(kg)',
					avgvolumn: '일평균 체적(m3)',
					avgcount: '일평균 고객(건)',
				},
				{
					id: 'first',
					rolltainerNo: '2024-0001',
					avgweight: 15,
					avgvolumn: 19,
					avgcount: 1,
				},
				{
					id: '#Cust1',
					rolltainerNo: '2024-0002',
					avgweight: 25,
					avgvolumn: 20,
					avgcount: 2,
				},
				{
					id: '#Cust2',
					rolltainerNo: '2024-0003',
					avgweight: 15,
					avgvolumn: 20,
					avgcount: 3,
				},
				{
					id: '#Cust3',
					rolltainerNo: '2024-0004',
					avgweight: 15,
					avgvolumn: 35,
					avgcount: 4,
				},
				{
					id: '#Cust4',
					rolltainerNo: '2024-0005',
					avgweight: 15,
					avgvolumn: 15,
					avgcount: 5,
				},
				{
					id: 'last',
					rolltainerNo: '2024-0006',
					avgweight: 25,
					avgvolumn: 25,
					avgcount: 6,
				},
			],
		};
		setCarRolltainerData(myList);

		return myList;

		//setCarRolltainerData(res.data);
	};

	/**
	 * 거래처별 POP 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const save = (rowItems: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			// 저장할 item에 rowStatus를 지정해야 한다
			// rowItems.map((item: any) => {
			// 	item.rowStatus = 'I';
			// });

			for (const item of rowItems) {
				item.rowStatus = 'I';
			}

			const params = {
				saveList: rowItems,
			};

			// API 호출
			apiPostSaveCustPop(params).then(res => {
				if (res.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					search();
				}
			});
		});
	};

	/**
	 * 탭 클릭 이벤트
	 * @param {string} activeKey 탭 번호
	 */
	const onTabChange = (activeKey: string) => {
		if (activeKey === '1') {
			refs.gridRef2?.current?.resize();
		} else if (activeKey === '2') {
			refs.gridRef3?.current?.resize();
		}
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: search, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmPopUnregisterSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<Row gutter={8} className="h100">
				<Col span={12}>
					<TmPopUnregisterCustList
						ref={refs}
						gridData={gridData}
						totalCount={totalCount}
						searchCustDeliveryList={searchCustDeliveryList}
						searchRecommendPopList={searchRecommendPopList}
						searchCarRolltainerList={searchCarRolltainerList}
					/>
				</Col>

				<Col span={12}>
					<AGrid>
						{/*<GridTopBtn gridTitle={'1 '} gridBtn={setGridBtn()} /> */}
						<PageGridBtn gridTitle={''} />
						<Tabs defaultActiveKey="1" onChange={onTabChange}>
							<TabPane tab={t('lbl.DELIVERY_HISOTY')} key="1">
								<TmPopUnregisterCustDelivery
									ref={refs}
									gridData={gridData2}
									save={save}
									carRolltainerData={carRolltainerData}
									searchCarRolltainerList={searchCarRolltainerList}
								/>
							</TabPane>
							<TabPane tab={t('lbl.RECOMMEND_POP')} key="2">
								<TmPopUnregisterRcmdPop
									ref={refs}
									gridData={gridData3}
									save={save}
									carRolltainerData={carRolltainerData}
									searchCarRolltainerList={searchCarRolltainerList}
								/>
							</TabPane>
						</Tabs>
					</AGrid>
				</Col>
			</Row>
		</>
	);
};

export default TmPopUnregister;
