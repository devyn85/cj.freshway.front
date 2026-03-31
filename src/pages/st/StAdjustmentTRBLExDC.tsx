/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: StAdjustmentTRBLExDC.tsx
 # Description		: 외부비축BL내재고이관
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import StAdjustmentTRBLExDCDetail from '@/components/st/adjustmentTRBLExDC/StAdjustmentTRBLExDCDetail';
import StAdjustmentTRBLExDCSearch from '@/components/st/adjustmentTRBLExDC/StAdjustmentTRBLExDCSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/st/apiStAdjustmentTRBLExDC';

// Hooks

const StAdjustmentTRBLExDC = () => {
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
		skuName: '',
		sku: null,
		stocktype: null,
		stockgrade: null,
		blno: null,
		serialno: null,
		contractcompanyName: '',
		contractcompany: null,
		organizeName: '',
		organize: null,
		taskdtAj: null,
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
		// 2170 물류센터만 처리 가능
		if (searchForm.getFieldValue('fixdccode') !== '2170') {
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
		const searchParams = searchForm.getFieldsValue();
		const params = {
			fixdccode: searchParams.fixdccode,
			sku: searchParams.sku,
			stocktype: searchParams.stocktype,
			stockgrade: searchParams.stockgrade,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			contractcompany: searchParams.contractcompany,
			organize: searchParams.organize,
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
				<StAdjustmentTRBLExDCSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<StAdjustmentTRBLExDCDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				dccode={searchForm.getFieldValue('fixdccode')}
			/>
		</>
	);
};

export default StAdjustmentTRBLExDC;
