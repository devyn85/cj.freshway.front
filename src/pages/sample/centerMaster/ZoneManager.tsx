/*
 ############################################################################
 # FiledataField	: ZoneManager.tsx
 # Description		: 존 정보 관리
 # Author			: Canal Frame
 # Since			: 25.04.21
 ############################################################################
 */

// Lib
import { Form } from 'antd';

// Utils
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import DetailZoneManager from '@/components/sample/centerMaster/zoneManager/DetailZoneManager';
import SearchZoneManager from '@/components/sample/centerMaster/zoneManager/SearchZoneManager';

// API Call Function
import { apiGetZoneManagerList, apiPostSaveZone } from '@/api/sample/apiZoneManager';

const ZoneManager = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	// 조회 조건 초기화
	const [searchBox] = useState({
		schZone: '',
		schDescription: '',
	});

	// 상세 정보 변경 구분 : true: 변경됨 , false: 변경 안 됨
	const changeDetailRef = useRef(false);

	// 조회 실행 구분 : 0: 일반 조회, 1: 수정 후 조회
	const [saveMode, setSaveMode] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const ref: any = useRef(null);

	// 상세 컴포넌트 접근을 위한 Ref
	const detailZoneManagerRef = useRef<any>(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/*
    ### 조회 ###
    */
	const search = (m: number | undefined): void => {
		if (ref?.gridRef?.current) {
			ref.gridRef.current.clearGridData();
		}
		const params = form.getFieldsValue();

		setSaveMode(m ? m : 0);

		apiGetZoneManagerList(params).then(res => {
			setGridData(res.data);
		});
	};

	/*
    ### 저장 ###
    */
	const save = async () => {
		// 변경 여부 확인
		if (!changeDetailRef.current) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		// const roleMenus = ref.gridRef2.current.getChangedData();
		// if (!roleMenus || roleMenus.length < 1) {
		// 	showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
		// 	return;
		// }

		// 저장 실행
		showConfirm(null, t('com.msg.confirmSave'), async () => {
			// 입력 폼 검증
			const isValid = await validateForm(detailForm);

			if (!isValid) {
				//showAlert('', 'Validation 검증 실패');
				return;
			}

			const data = detailForm.getFieldsValue(true);
			data.rowStatus = data.rowStatus ? (data.rowStatus === 'I' ? 'I' : 'U') : 'U'; // rowStatus : I(추가), U(수정), D(삭제)

			const params = {
				zones: [data],
			};

			apiPostSaveZone(params).then(res => {
				if (res.status === 200) {
					// 저장 성공
					showAlert(null, t('com.msg.successSave'));
					search(1);
				}
			});
		});
	};

	/*
    ### 신규 ###
    */
	const addNew = (): void => {
		if (detailZoneManagerRef.current) {
			detailZoneManagerRef.current.resetForm();
		}
	};

	// 상세정보 초기화
	// 폼 데이터 (상세정보) 변경 이벤트 핸들러
	// const onFormChange = (changedValues: any, allValues: any) => {
	// 	setChangedDetail(true);
	// };

	/*
	 * 상세 정보 변경 여부 설정
	 */
	const setChangedStatus = (changed: boolean): void => {
		changeDetailRef.current = changed;
	};

	/*
	 * 상세 정보 변경 여부 체크
	 */
	const checkChangedStatus = (): boolean => {
		if (changeDetailRef?.current === true) {
			showAlert(null, '변경 사항이 있습니다.');
			return true;
		} else {
			return false;
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search,
		newYn: addNew,
		saveYn: save,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//화면 초기 세팅
	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|newYn|saveYn" />
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchZoneManager search={search} />
			</SearchForm>
			<DetailZoneManager
				ref={ref}
				detailZoneManagerRef={detailZoneManagerRef}
				form={detailForm}
				data={gridData}
				setChangedStatus={setChangedStatus}
				checkChangedStatus={checkChangedStatus}
				saveMode={saveMode}
			/>
		</>
	);
};

export default ZoneManager;
