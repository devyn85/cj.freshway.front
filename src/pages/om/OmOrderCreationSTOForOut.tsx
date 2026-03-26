/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForOut.tsx
 # Description		: 외부센터 보충발주
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.08
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCreationSTOForOutDetail from '@/components/om/orderCreationSTOForOut/OmOrderCreationSTOForOutDetail';
import OmorderCreationSTOForOutSearch from '@/components/om/orderCreationSTOForOut/OmOrderCreationSTOForOutSearch';
import { useTranslation } from 'react-i18next';

// Util
import { showAlert } from '@/util/MessageUtil';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/om/apiOmOrderCreationSTOForOut';

// Hooks

const OmOrderCreationSTOForOut = () => {
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
		deliverydate: dayjs(),
		skuCode: null,
		storagetype: null,
		stockgrade: null,
		blno: null,
		serialno: null,
		contractcompanyName: '',
		contractcompany: null,
		organizeName: '',
		organize: null,
		fromDccode: '2170',
		toDccode: globalVariable.gDccode,
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

		// 조회 조건 설정
		const searchParams = searchForm.getFieldsValue();

		if (searchParams.fromDccode === searchParams.toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();
		refs.gridRef2?.current.clearGridData();

		const openCenterList = getCommonCodeList('OPENCENTER');

		// 공급받는 센터가 오픈센터에 존재하는지 확인
		// const isExist = openCenterList.some((center: any) => center.comCd === searchParams.toDccode);

		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// } else {
		// 조회 조건 설정
		const params = {
			sku: searchParams.skuCode,
			storagetype: searchParams.storagetype,
			deliverydate: dayjs(searchParams.deliverydate).format('YYYYMMDD'),
			fromDccode: searchParams.fromDccode,
			toDccode: searchParams.toDccode,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			organize: searchParams.organize,
		};

		// API 호출
		apiPostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCount(res.data.length);
		});
		// }
	};

	/**
	 * 처리결과 조회
	 */
	const searchResultList = async () => {
		// 그리드 초기화
		refs.gridRef2?.current.clearGridData();
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
				<OmorderCreationSTOForOutSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<OmOrderCreationSTOForOutDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterList}
				searchForm={searchForm}
			/>
		</>
	);
};

export default OmOrderCreationSTOForOut;
