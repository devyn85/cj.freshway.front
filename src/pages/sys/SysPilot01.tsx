/*
 ############################################################################
 # FiledataField	: SysPilot01.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램
 # Author			: YangChangHwan
 # Since			: 25.05.08
 ############################################################################
*/
// Lib
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Divider, Form } from 'antd';

// Utils
// Store

// Component
import CmCarAreaSearch from '@/components/cm/popup/CmCarAreaSearch';
import CmDcSearch from '@/components/cm/popup/CmDcSearch';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';
import SysPilot01Detail from '@/components/sys/pilot01/SysPilot01Detail';
import SysPilot01Search from '@/components/sys/pilot01/SysPilot01Search';

// API Call Function
import { apiPostSaveSysPilot01, apiSearchSysPilot01List } from '@/api/sys/apiSysPilot01';

const SysPilot01 = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [carAreaSingleForm] = Form.useForm();
	const [carAreaMultiForm] = Form.useForm();
	const [dcSingleForm] = Form.useForm();
	const [dcMultiForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const areaRef = useRef(null);

	//검색영역 초기 세팅
	const [searchBox] = useState({});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiSearchSysPilot01List(params).then(res => {
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
			apiPostSaveSysPilot01(menus).then(() => {
				search();
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, // 조회
		saveYn: save, // 저장
	};

	//Form 수정된값 출력
	const onValuesChange = (changedValues: any, allValues: any) => {
		// //console.log(allValues);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	// 화면 초기 세팅
	useEffect(() => {
		// search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			<div className="grid-column-2">
				<SearchForm form={carAreaMultiForm} onValuesChange={null}>
					<Divider orientation="left">차량+권역 팝업 조회 (multipleRows)</Divider>
					<CmCarAreaSearch
						form={carAreaMultiForm}
						name="name"
						code="code"
						selectionMode="multipleRows"
						returnValueFormat="name"
					/>
					<InputText label="권역" form={carAreaMultiForm} name="area" id="area" ref={areaRef} readOnly />
				</SearchForm>
				<SearchForm form={carAreaSingleForm} onValuesChange={null}>
					<Divider orientation="left">차량+권역 팝업 조회 (singleRow)</Divider>
					<CmCarAreaSearch
						form={carAreaSingleForm}
						name="name"
						code="code"
						selectionMode="singleRow"
						returnValueFormat="name"
					/>
					<InputText label="권역" form={carAreaSingleForm} name="area" id="area" ref={areaRef} readOnly />
				</SearchForm>

				<SearchForm form={dcMultiForm} onValuesChange={null}>
					<Divider orientation="left">센터 팝업 조회 (multipleRows)</Divider>
					<CmDcSearch form={dcMultiForm} code="cd" name="nm" selectionMode="multipleRows" returnValueFormat="name" />
				</SearchForm>
			</div>

			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox} onValuesChange={onValuesChange}>
				<SysPilot01Search form={form} search={search} />
			</SearchForm>

			{/* 화면 상세 영역 정의 */}
			<SysPilot01Detail ref={gridRef} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default SysPilot01;
