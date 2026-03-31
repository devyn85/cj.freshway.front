/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: StConvertCFM.tsx
 # Description		: 중계영업확정처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import StConvertCFMDetail from '@/components/st/convertCFM/StConvertCFMDetail';
import StConvertCFMSearch from '@/components/st/convertCFM/StConvertCFMSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/st/apiStConvertCFM';

// Hooks

const StConvertCFM = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		slipdtRange: [dayjs(), dayjs()],
		sku: null,
		mapDiv: '20', //'중계영업매입매출'
		mapkeyNo: null,
		blno: null,
		serialno: null,
		pokey: null,
		docno: null,
		custkeyName: '',
		custkey: null,
		organizeName: '',
		organize: null,
		stockgrade: null,
		serialinfoCfmYn: null,
		tempYn: null,
		moveYn: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 목록 조회
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef.current?.clearGridData();
		refs.gridRef2.current?.clearGridData();
		refs.gridRef3?.current?.clearGridData();

		// 조회 조건 설정
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());
		const params = {
			fixdccode: searchParams.fixdccode,
			slipdtFrom: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			slipdtTo: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
			mapDiv: searchParams.mapDiv,
			mapkeyNo: searchParams.mapkeyNo,
			pokey: searchParams.docno,
			fromCustkey: searchParams.custkey,
			sku: searchParams.sku,
			serialinfoCfmYn: searchParams.serialinfoCfmYn,
			stockgrade: searchParams.stockgrade,
			organize: searchParams.organize,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			tempYn: searchParams.tempYn,
			moveYn: searchParams.moveYn,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});
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
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StConvertCFMSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<StConvertCFMDetail
				ref={refs}
				fixdccode={searchForm.getFieldValue('fixdccode')}
				gridData={gridData}
				totalCount={totalCount}
				searchForm={searchForm}
				callBackFn={searchMasterList}
			/>
		</>
	);
};

export default StConvertCFM;
