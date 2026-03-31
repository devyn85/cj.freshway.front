/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: WdShipmentExDC.tsx
 # Description		: 외부비축출고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import WdShipmentExDCDetail from '@/components/wd/shipmentExDC/WdShipmentExDCDetail';
import WdShipmentExDCSearch from '@/components/wd/shipmentExDC/WdShipmentExDCSearch';

// Util
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import dataTransform from '@/util/dataTransform';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/wd/apiWdShipmentExDC';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';

// Hooks

const WdShipmentExDC = () => {
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

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	const refModal = useRef(null);
	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		slipdtRange: [dayjs(), dayjs()],
		scmUser: null,
		organizeName: '',
		organize: null,
		fromCustkeyName: '',
		fromCustkey: null,
		status: null,
		skuCode: null,
		docno: null,
		blno: null,
		serialno: null,
		contracttypeSn: null,
		storagetype: null,
		wdCustkeyName: '',
		wdCustkey: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 목록 조회
	 */
	const searchMasterLit = async () => {
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
			fromCustkey: searchParams.fromCustkey,
			wdCustkey: searchParams.wdCustkey,
			status: searchParams.status,
			sku: searchParams.skuCode,
			contracttypeSn: searchParams.contracttypeSn,
			storagetype: searchParams.storagetype,
			docno: searchParams.docno,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			scmUser: searchParams.scmUser,
			stoYn: searchParams.sto ?? 0,
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
		searchYn: searchMasterLit, // 조회
		setting: () => {
			handleOpenPopPopup();
		},
	};
	// 외부창고 입출고 관리담당자 관리 팝업 열기
	const handleOpenPopPopup = () => {
		refModal.current?.handlerOpen();
	};
	// 외부창고 입출고 관리담당자 관리 팝업 닫기
	const handleClosePopPopup = () => {
		refModal.current?.handlerClose();
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
				<WdShipmentExDCSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<WdShipmentExDCDetail
				ref={refs}
				searchForm={searchForm}
				gridData={gridData}
				totalCount={totalCount}
				callBackFn={searchMasterLit}
				dccode={searchForm.getFieldValue('fixdccode')}
			/>
			{/* 외부창고 입출고 관리담당자 팝업 */}
			<CustomModal ref={refModal} width="1200px">
				<CmUserCdCfgPopup codeType={'EXDC_MANAGE_USER'} close={handleClosePopPopup} />
			</CustomModal>
		</>
	);
};

export default WdShipmentExDC;
