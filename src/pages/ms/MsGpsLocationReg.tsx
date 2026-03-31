/*
 ############################################################################
 # FiledataField	: searchlatlng.tsx
 # Description		: 기준정보 > 거래처기준정보 > 거래처별전용차량정보
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { throttle } from 'lodash';

// Util
import Constants from '@/util/constants';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import SearchlatlngDetail from '@/components/ms/gpsLocationReg/MsGpsLocationRegDetail';
import SearchlatlngSearch from '@/components/ms/gpsLocationReg/MsGpsLocationRegSearch';

// API Call Function
import { apiGetGpsMasterList } from '@/api/ms/apiMsCustDeliveryInfo';
import { useAppSelector } from '@/store/core/coreHook';

// hooks

const Searchlatlng = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	const globalVariable = useAppSelector(state => state.global.globalVariable);
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dlvDccode: globalVariable.gDccode,
		custName: '',
	});
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	/**
	 * API 조회
	 * @param {boolean} isScroll
	 * @returns {void}
	 */
	const apiGetMasterListRun = () => {
		const tt = currentPageScr - 1;
		const searchDccode = form.getFieldValue('dlvDccode');
		const params = {
			...form.getFieldsValue(),
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr !== 1,
			dlvDccode: searchDccode ? String(searchDccode) : null,
		};
		apiGetGpsMasterList(params).then(res => {
			const gridData = res.data.list;
			setGridData(gridData);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	};

	/**
	 * 조회버튼 이벤트
	 * @returns {void}
	 */
	const searchMasterList = useCallback(() => {
		if (detailForm.getFieldValue('rowStatus') === 'U') {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	}, []);

	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		setCurrentPageScr(1);
		setTotalCount(0);
		detailForm.resetFields();
		gridRef.current.clearGridData();
		apiGetMasterListRun();
	};

	/**
	 * 그리드 스크롤
	 * @returns {void}
	 */
	const searchScroll = throttle(() => {
		apiGetMasterListRun();
	}, 500);

	// 페이지 버튼 함수 바인딩
	const titleFunc = useMemo(
		() => ({
			searchYn: searchMasterList, // 조회
		}),
		[searchMasterList],
	);

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 스크롤하여 페이지 이동되면 데이터 조회
	useEffect(() => {
		if (currentPageScr > 1) {
			searchScroll();
		}
	}, [currentPageScr]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<SearchlatlngSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<SearchlatlngDetail
				form={detailForm}
				ref={gridRef}
				gridData={gridData}
				setGridData={setGridData}
				totalCount={totalCount}
				setCurrentPage={setCurrentPageScr}
			/>
		</>
	);
};
export default Searchlatlng;
