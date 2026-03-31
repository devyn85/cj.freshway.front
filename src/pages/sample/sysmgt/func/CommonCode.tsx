/*
 ############################################################################
 # FiledataField	: CommonCode.tsx
 # Description		: 공통코드 
 # Author			: Canal Frame
 # Since			: 23.09.27
 ############################################################################
 */

// Lib
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Form } from 'antd';
// Utils

// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';

// API Call Function
import { apiGetCmmCdSearchGrpCd, apiPostSaveCommonCode } from '@/api/common/apiSysmgt';
import DetailCommonCode from '@/components/sysmgt/func/commonCode/DetailCommonCode';
import SearchCommonCode from '@/components/sysmgt/func/commonCode/SearchCommonCode';

const CommonCode = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	//다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);

	//검색영역 초기 세팅
	const [searchBox] = useState({ useYn: '' });

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/*
	### 조회 ###
	*/
	const search = () => {
		//그리드 초기화
		refs.gridRef1.current.clearGridData();
		refs.gridRef2.current.clearGridData();

		const params = form.getFieldsValue();

		apiGetCmmCdSearchGrpCd(params).then(res => {
			setGridData(res.data);
		});
	};

	/*
		### 저장버튼 ###
	*/
	const save = () => {
		// 변경 데이터 확인
		const codeGrps = refs.gridRef1.current.getChangedData();
		const codeDtls = refs.gridRef2.current.getChangedData();

		if ((!codeGrps || codeGrps.length < 1) && (!codeDtls || codeDtls.length < 1)) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		// validation
		if (codeGrps.length > 0 && !refs.gridRef1.current.validateRequiredGridData()) {
			return;
		}

		if (codeDtls.length > 0 && !refs.gridRef2.current.validateRequiredGridData()) {
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				codeGrps: codeGrps,
				codeDtls: codeDtls,
			};
			apiPostSaveCommonCode(params).then(() => {
				search();
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search,
		saveYn: save,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	//화면 초기 세팅
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchCommonCode search={search} />
			</SearchForm>
			{/* 화면 상세 영역 정의 */}
			<DetailCommonCode ref={refs} data={gridData} />
		</>
	);
};

export default CommonCode;
