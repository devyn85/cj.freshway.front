/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ############################################################################
 # FiledataField	: DpReceiptExDC.tsx
 # Description		: 외부비축입고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpReceiptExDCDetail from '@/components/dp/receiptExDC/DpReceiptExDCDetail';
import DpReceiptExDCSearch from '@/components/dp/receiptExDC/DpReceiptExDCSearch';
import { useTranslation } from 'react-i18next';

// Util
import { validateForm } from '@/util/FormUtil';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostMasterList } from '@/api/dp/apiDpReceiptExDC';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';

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
	const refModal = useRef(null);
	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// searchForm data 초기화
	const [searchBox] = useState({
		fixdccode: '2170',
		slipdtRange: [dayjs(), dayjs()],
		sku: null,
		mapkeyNo: null,
		blno: null,
		serialno: null,
		docno: null,
		custkeyName: '',
		custkey: null,
		organizeName: '',
		organize: null,
		ordertype: null,
		channel: null,
		tempYn: '',
		storagetype: null,
		dpCustkeyName: '',
		dpCustkey: null,
		status: null,
		sokeyYn: null,
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
		// refs.gridRef2.current?.clearGridData();
		// refs.gridRef3?.current?.clearGridData();

		// 조회 조건 설정
		const searchParams = dataTransform.convertSearchData(searchForm.getFieldsValue());
		const params = {
			fixdccode: searchParams.fixdccode,
			slipdtFrom: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
			slipdtTo: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
			docno: searchParams.docno,
			mapkeyNo: searchParams.mapkeyNo,
			fromCustkey: searchParams.custkey,
			status: searchParams.status,
			tempYn: searchParams.tempYn,
			organize: searchParams.organize,
			sku: searchParams.sku,
			ordertype: searchParams.ordertype,
			channel: searchParams.channel,
			storagetype: searchParams.storagetype,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			dpCustkey: searchParams.dpCustkey,
			sokeyYn: searchParams.sokeyYn,
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
				<DpReceiptExDCSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<DpReceiptExDCDetail
				ref={refs}
				gridData={gridData}
				totalCount={totalCount}
				searchForm={searchForm}
				callBackFn={searchMasterList}
				dccode={searchForm.getFieldValue('fixdccode')}
			/>
			{/* 외부창고 입출고 관리담당자 팝업 */}
			<CustomModal ref={refModal} width="1200px">
				<CmUserCdCfgPopup codeType={'EXDC_MANAGE_USER'} close={handleClosePopPopup} />
			</CustomModal>
		</>
	);
};

export default StConvertCFM;
