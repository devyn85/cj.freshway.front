/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: WdSendOutOrder.tsx
 # Description		: 외부비축출고지시서
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.19
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import WdSendOutOrderDetail from '@/components/wd/sendOutOrder/WdSendOutOrderDetail';
import WdSendOutOrderSearch from '@/components/wd/sendOutOrder/WdSendOutOrderSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import dataTransform from '@/util/dataTransform';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetDatalistNotOrder, apiGetDatalistOrder, apiGetUserEmailByUserId } from '@/api/wd/apiWdSendOutOrder';

// Hooks

const WdSendOutOrder = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 페이징 조회 제한 함수
	// const throttle = useThrottle();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 상세 데이터
	// const [detailData, setDetailData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 이메일
	const [emailAddr, setEmailAddr] = useState();

	// 현재 페이지 번호
	// const [currentPageSrc, setCurrentPageSrc] = useState(1);

	// 페이지당 행 수
	// const [pageSize] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		slipdtRange: [dayjs(), dayjs()],
		exdcinstructtype: 'ORDER', // 지시서유형 기본값 '오더있음'
		organizeName: '',
		organize: null,
		toCustkeyNm: '',
		toCustkey: null,
		skuCode: null,
		docno: null,
		blno: null,
		mapkeyNo: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 이메일 조회
	 */
	const searchEmail = () => {
		const params = {
			userId: globalVariable.gUserId,
		};
		// API 호출
		apiGetUserEmailByUserId(params).then(res => {
			if (res?.data?.emailAddr) {
				setEmailAddr(res.data.emailAddr);
			}
		});
	};

	/**
	 * 목록 조회
	 */
	const search = async () => {
		//2170 센터만 조회 가능
		const result = getCommonCodeList('WMS_MNG_DC')?.find(
			v => v['comCd'] === searchForm.getFieldValue('fixdccode') && v['data3'] === 'Y',
		);

		if (result === undefined) {
			showAlert(null, searchForm.getFieldValue('fixdccode') + '센터는 현재 화면 사용이 불가합니다.');
			return;
		}

		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();

		// 조회 조건 설정
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());
		const params = {
			fixdccode: searchParams.fixdccode,
			fromSlipdt: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			toSlipdt: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
			organize: searchParams.organize,
			exdcinstructtype: searchParams.exdcinstructtype,
			tocustkey: searchParams.toCustkey,
			sku: searchParams.skuCode,
			docno: searchParams.docno,
			blno: searchParams.blno,
			mapkeyNo: searchParams.mapkeyNo,
			cfyn: searchParams.cfyn ?? 0,
			send: searchParams.send ?? 0,
			errorsend: searchParams.errorsend ?? 0,
			allCancelStatus: searchParams.allCancelStatus ?? 0,
			noNormal: searchParams.noNormal ?? 0,
		};

		if (params.exdcinstructtype === 'ORDER' || params.exdcinstructtype === 'RETURN') {
			// API 호출
			apiGetDatalistOrder(params).then(res => {
				setGridData(res.data);
				setTotalCount(res.data.length);
			});
		} else {
			//(params.exdcinstructtype === 'NOTORDER')
			// API 호출
			apiGetDatalistNotOrder(params).then(res => {
				setGridData(res.data);
				setTotalCount(res.data.length);
			});
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

	useEffect(() => {
		searchEmail();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<WdSendOutOrderSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<WdSendOutOrderDetail
				ref={refs}
				searchForm={searchForm}
				gridData={gridData}
				totalCount={totalCount}
				search={search}
				dccode={searchForm.getFieldValue('fixdccode')}
				emailAddr={emailAddr}
			/>
		</>
	);
};

export default WdSendOutOrder;
