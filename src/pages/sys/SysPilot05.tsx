/*
 ############################################################################
 # FiledataField	: SysPilot05.tsx
 # Description		: TEST > 임시 > Pilot05
 # Author			: Kwonjungyun
 # Since			: 25.05.08
 ############################################################################
*/
// Lib
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Divider, Form } from 'antd';

// Utils
// Store

// Component
import { apiPostSaveSysPilot05, apiSearchSysPilot05List } from '@/api/sys/apiSysPilot05';
import CmCarAreaSearch from '@/components/cm/popup/CmCarAreaSearch';
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmDcSearch from '@/components/cm/popup/CmDcSearch';
import CmDistrictSearch from '@/components/cm/popup/CmDistrictSearch';
import CmDriverSearch from '@/components/cm/popup/CmDriverSearch';
import CmLocationSearch from '@/components/cm/popup/CmLocationSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmPurchaseBuyerHstSearch from '@/components/cm/popup/CmPurchaseBuyerHstSearch';
import CmSkuGroup1Search from '@/components/cm/popup/CmSkuGroup1Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmSkuSpecSearch from '@/components/cm/popup/CmSkuSpecSearch';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';

// API Call Function

const Pliot05 = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [popupForm] = Form.useForm();
	const refModal = useRef(null);
	const [params, setParams] = useState({});
	const [extraParams, setExtraParams] = useState({});

	//검색영역 초기 세팅
	const gridRef = useRef(null);
	// 화면 초기 세팅
	useEffect(() => {
		//	search();
	}, []);

	// form data 초기화
	const initFormData = {
		carAreaName: '',
		carAreaCode: '',
		carPopName: '',
		carPopCode: '',
		carName: '',
		carCode: '',
		carrierName: '',
		carrierCode: '',
		costCenterName: '',
		costCenterCode: '',
		custBrandName: '',
		custBrandCode: '',
		custName: '',
		custCode: '',
		dcName: '',
		dcCode: '',
		districtName: '',
		districtCode: '',
		driverName: '',
		driverCode: '',
		locName: '',
		locCode: '',
		orgName: '',
		orgCode: '',
		partnerName: '',
		partnerCode: '',
		buyerName: '',
		buyerCode: '',
		skuGroupName: '',
		skuGroupCode: '',
		skuName: '',
		skuCode: '',
		skuSpecName: '',
		skuSpecCode: '',
		userCfgName: '',
		userCfgCode: '',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiSearchSysPilot05List(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 저장
	const save = (): void => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('com.msg.confirmSave'), () => {
			apiPostSaveSysPilot05(menus).then(() => {
				search();
			});
		});
	};

	//Form 수정된값 출력
	const onValuesChange = (changedValues: any, allValues: any) => {};

	/**
	 * 팝업에서 선택된 데이터 처리
	 * @param rows
	 * @returns
	 */
	const selectedRowHandler = (rows: any) => {
		if (!rows || rows.length === 0) return;
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, // 조회
		saveYn: save, // 저장
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />

			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<Divider orientation="left">CarPop 팝업영역</Divider>
				<CmCarPopSearch
					form={form}
					name="carPopName"
					code="carPopCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">로케이션 팝업영역</Divider>
				<CmCarAreaSearch
					form={form}
					name="carAreaName"
					code="carAreaCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Car 팝업영역</Divider>
				<CmCarSearch form={form} name="carName" code="carCode" selectionMode="multipleRows" returnValueFormat="code" />

				<Divider orientation="left">Carrier 팝업영역</Divider>
				<CmCarrierSearch
					form={form}
					name="carrierName"
					code="carrierCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">CostCenter 팝업영역</Divider>
				<CmCostCenterSearch
					form={form}
					name="costCenterName"
					code="costCenterCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">CustBrand 팝업영역</Divider>
				<CmCustBrandSearch
					form={form}
					name="custBrandName"
					code="custBrandCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Cust 팝업영역</Divider>
				<CmCustSearch
					form={form}
					name="custName"
					code="custCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Dc 팝업영역</Divider>
				<CmDcSearch form={form} name="dcName" code="dcCode" selectionMode="multipleRows" returnValueFormat="code" />

				<Divider orientation="left">District 팝업영역</Divider>
				<CmDistrictSearch
					form={form}
					name="districtName"
					code="districtCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Driver 팝업영역</Divider>
				<CmDriverSearch
					form={form}
					name="driverName"
					code="driverCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Location 팝업영역</Divider>
				<CmLocationSearch
					form={form}
					name="locName"
					code="locCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Organize 팝업영역</Divider>
				<CmOrganizeSearch
					form={form}
					name="orgName"
					code="orgCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Partner 팝업영역</Divider>
				<CmPartnerSearch
					form={form}
					name="partnerName"
					code="partnerCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">PurchaseBuyerHst 팝업영역(테스트상품코드: 108374)</Divider>
				<CmPurchaseBuyerHstSearch
					form={form}
					name="buyerName"
					code="buyerCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">SkuGroup1 팝업영역</Divider>
				<CmSkuGroup1Search
					form={form}
					name="skuGroupName"
					code="skugroup"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>

				<Divider orientation="left">Sku 팝업영역</Divider>
				<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />

				<Divider orientation="left">SkuSpec 팝업영역</Divider>
				<CmSkuSpecSearch
					form={form}
					name="skuSpecName"
					code="skuSpecCode"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>
			</SearchForm>
		</>
	);
};
export default Pliot05;
