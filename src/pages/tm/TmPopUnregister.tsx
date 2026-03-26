/*
 ############################################################################
 # FiledataField	: TmPopUnregister.tsx
 # Description		: 거래처별POP미등록현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.02
 ############################################################################
*/
// CSS

// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridLoading from '@/components/common/GridLoading';
import TmPopUnregisterDetail from '@/components/tm/popUnregister/TmPopUnregisterDetail';
import TmPopUnregisterSearch from '@/components/tm/popUnregister/TmPopUnregisterSearch';

// Util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

// Type

// Store

// API
import {
	apiPostCustDeliveryList,
	apiPostMasterList,
	apiPostRecommendPOPList,
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

	// 선택한 거래처 정보
	const [selectedCustType, setSelectedCustType] = useState(null);
	const [selectedCustKey, setSelectedCustKey] = useState(null);

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
	const [isLoadingGrid, setIsLoadingGrid] = useState(false);

	// 탭
	const { TabPane } = Tabs;

	// searchForm data 초기화
	interface SearchBoxType {
		deliverydate: dayjs.Dayjs;
		custCode: string;
		custName: string;
		custtype: string | null;
	}
	const searchBox: SearchBoxType = {
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
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef1.current?.clearGridData();
		refs.gridRef2?.current?.clearGridData();
		refs.gridRef3?.current?.clearGridData();

		const searchParams = searchForm.getFieldsValue();

		// validation
		if (commUtil.isEmpty(searchParams.deliverydate)) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DELIVERYDATE')]));
			return;
		}

		// 조회 조건 설정
		// const tt = 0;
		const params = {
			fixdccode: searchParams.fixdccode,
			deliverydate: searchParams.deliverydate.format('YYYYMMDD'),
			custtype: searchParams.custtype,
			custkey: searchParams.custCode,
			//startRow: 0 + tt * pageSize,
			//listCount: pageSize,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});
	};

	/**
	 * 거래처별 배송이력 조회 및 추천 POP 조회
	 * @param param
	 */
	const searchDetailList = async (param: any) => {
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			custtype: param.custtype,
			custkey: param.custkey,
		};

		const [resCustDeliveryList, resRecommendPOPList] = await Promise.all([
			apiPostCustDeliveryList(params),
			apiPostRecommendPOPList(params),
		]);
		setGridData2(resCustDeliveryList.data);
		setGridData3(resRecommendPOPList.data);
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

		refs.gridRef2?.current.clearGridData();

		// API 호출
		apiPostCustDeliveryList(params).then(res => {
			setGridData2(res.data);
		});
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

		refs.gridRef3?.current.clearGridData();

		// API 호출
		apiPostRecommendPOPList(params).then(res => {
			setGridData3(res.data);
		});
	};

	/**
	 * 거래처별 POP 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveCustXPop = (rowItems: any) => {
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			// 저장할 목록
			const params = {
				saveList: rowItems,
			};

			// 거래처 정보 설정
			// params.saveList.forEach((item: any) => {
			// 	item.custtype = selectedCustType;
			// 	item.custkey = selectedCustKey;
			// });

			// API 호출
			apiPostSaveCustPop(params).then(res => {
				if (res.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					searchMasterList();
					//searchCustDeliveryList(rowItems[0]);
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
			refs.gridRef2?.current?.resize('100%', '100%');
		} else if (activeKey === '2') {
			refs.gridRef3?.current?.resize('100%', '100%');
		}

		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 목록에서 선택한 거래처 코드 값을 받음
	 * @param custtype
	 * @param custkey
	 */
	const onChangeCust = (custtype: any, custkey: any) => {
		setSelectedCustType(custtype);
		setSelectedCustKey(custkey);
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<GridLoading isLoading={isLoadingGrid} />

			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmPopUnregisterSearch form={searchForm} />
			</SearchFormResponsive>

			<TmPopUnregisterDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				saveCustXPop={saveCustXPop}
				carRolltainerData={carRolltainerData}
				onChangeCust={onChangeCust}
			/>

			{/* 상세 영역 정의 */}
			{/*
			<Row gutter={8} className="h100">
				<Col span={12}>
					<TmPopUnregisterDetailCustList
						ref={refs}
						gridData={gridData}
						totalCount={totalCount}
						searchDetailList={searchDetailList}
						searchCustDeliveryList={searchCustDeliveryList}
						searchRecommendPopList={searchRecommendPopList}
					/>
				</Col>

				<Col span={12}>
					<AGrid dataProps={'row-single'}>
						<PageGridBtn gridTitle={''} />
						<Tabs defaultActiveKey="1" onChange={onTabChange}>
							<TabPane tab={t('lbl.DELIVERY_HISOTY')} key="1">
								<TmPopUnregisterDetailCustDelivery
									ref={refs}
									gridData={gridData2}
									save={saveCustXPop}
									carRolltainerData={carRolltainerData}
								/>
							</TabPane>
							<TabPane tab={t('lbl.RECOMMEND_POP')} key="2">
								<TmPopUnregisterDetailRcmdPop
									ref={refs}
									gridData={gridData3}
									save={saveCustXPop}
									carRolltainerData={carRolltainerData}
								/>
							</TabPane>
						</Tabs>
					</AGrid>
				</Col>
			</Row>
			 */}
		</>
	);
};

export default TmPopUnregister;
