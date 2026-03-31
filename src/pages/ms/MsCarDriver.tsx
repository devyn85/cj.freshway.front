/*
 ############################################################################
 # FiledataField	: MsCarDriver.tsx
 # Description		: 기준정보 > 차량기준정보 > 차량정보
 # Author			: jangjaehyun
 # Since			: 25.08.13
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCarDriverDetail from '@/components/ms/carDriver/MsCarDriverDetail';
import MsCarDriverSearch from '@/components/ms/carDriver/MsCarDriverSearch';
import MsVehicleExitGroupCfgPopup from '@/components/ms/popup/MsVehicleExitGroupCfgPopup';

// API Call Function
import { apiGetEntryInfoList, apiGetMasterList } from '@/api/ms/apiMsCarDriver';

// Hooks

// Store
import { fetchCarGroup, fetchCarGroupRefresh } from '@/store/biz/msCarGroupStore';
// import { fetchMsCarrier } from '@/store/biz/msCarrierStore';

const MsCarDriver = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();
	const vehicleExitGroupCfgModal = useRef(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		carNo: '',
		driver1: '',
		delYn: 'N',
		contractType: null,
		datePickerBasic1: dayjs(),
		datePickerBasic2: dayjs(),
		isExpirationDateExpired: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridRef1 = useRef(null);

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);
	// const location = useLocation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (
			detailForm.getFieldValue('rowStatus') === 'U' ||
			gridRef.current.getChangedData({ validationYn: false }).length > 0
		) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		gridRef1?.current.setGridData([]);
		//상세 영역 초기화
		setGridData([]);
		detailForm.resetFields();

		// 조회 조건 설정
		const searchParams = form.getFieldsValue();
		const params = {
			...searchParams,
		};

		// API 호출
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
		setting: () => {
			handleOpenVehicleExitGroupCfgPopup();
		},
	};

	// 출차그룹설정 팝업 열기
	const handleOpenVehicleExitGroupCfgPopup = () => {
		vehicleExitGroupCfgModal.current?.handlerOpen();
		// 팝업이 열린 후 약간의 지연을 두고 값 설정
		setTimeout(() => {
			const multiDcCode = form.getFieldValue('multiDcCode');
			if (multiDcCode && vehicleExitGroupCfgModal.current) {
				// vehicleExitGroupCfgModal.current.setMultiDcCode(multiDcCode);
			}
		}, 300);
	};
	// 출차그룹설정 팝업 닫기
	const handleCloseVehicleExitGroupCfgPopup = async () => {
		const selectedRow = gridRef?.current.getSelectedRows();
		if (selectedRow.length < 1) {
			vehicleExitGroupCfgModal.current?.handlerClose();
			return;
		}
		const params = selectedRow[0];
		await fetchCarGroupRefresh();
		apiGetEntryInfoList(params).then(res => {
			gridRef1.current?.setGridData(res.data);
		});
		vehicleExitGroupCfgModal.current?.handlerClose();
	};

	const getSelectDccodeList = () => {
		const dcCode = form.getFieldValue('multiDcCode');
		if (dcCode && dcCode.length > 0) {
			return dcCode.join(',').split(',')[0];
		} else {
			return gDccode;
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 출차그룹 데이터 초기화 및 조회
	useEffect(() => {
		const loadCarGroup = async () => {
			await fetchCarGroup();
		};
		loadCarGroup();
	}, []);

	/**
	 * 팝업에서 바로가기 했을때 실행
	 */
	// useEffect(() => {
	// 	if (location.state.CarDriver !== undefined && location.state.CarDriver !== '') {
	// 		// CarDriver 파라미터가 있을 경우 해당 값으로 검색
	// 		form.setFieldsValue({ CarDriverCode: location.state.CarDriver, CarDriverName: location.state.CarDriverDescr });
	// 		searchMasterList();
	// 	}
	// }, [location]);

	// 운송사 데이터 초기화 및 조회
	// useEffect(() => {
	// 	const fetchInitStore = async () => {
	// 		await fetchMsCarrier();
	// 	};
	// 	// init store
	// 	fetchInitStore();
	// }, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsCarDriverSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsCarDriverDetail
				ref={gridRef}
				gridRef1={gridRef1}
				detailForm={detailForm}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
				callBackFn={searchMasterList}
			/>

			{/* 출차그룹설정 팝업 */}
			<CustomModal ref={vehicleExitGroupCfgModal} width="1280px">
				<MsVehicleExitGroupCfgPopup close={handleCloseVehicleExitGroupCfgPopup} customDccode={getSelectDccodeList()} />
			</CustomModal>
		</>
	);
};
export default MsCarDriver;
