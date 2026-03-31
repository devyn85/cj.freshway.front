/*
 ############################################################################
 # FiledataField	: IpAllow.tsx
 # Description		: ip허용 예외관리
 # Author			: Canal Frame
 # Since			: 23.08.09
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
import DetailIpAllow from '@/components/sysmgt/func/ipallow/DetailIpAllow';
import SearchIpAllow from '@/components/sysmgt/func/ipallow/SearchIpAllow';

// API Call Function
import { apiGetIpAllowList, apiPostIpAllowSave } from '@/api/common/apiSysmgt';

const IpAllow = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	//다국어
	const { t } = useTranslation();
	//Antd Form 사용
	const [form] = Form.useForm();
	// grid data
	const [gridData, setGridData] = useState([]);
	//검색영역 초기 세팅
	const [searchBox] = useState({
		userId: '',
		ipAddr: '',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const onClickSearchButton = () => {
		const params = form.getFieldsValue();
		apiGetIpAllowList({ ...params, listCount: 10, startRow: 0 }).then(res => {
			setGridData(res.data.list);
		});
	};

	/**
	 * 저장 버튼 클릭
	 * TO-DO validation check 검토
	 * @returns {void}
	 */
	const onClickSaveButton = () => {
		// 변경 데이터 확인
		const gridItem = gridRef.current.getChangedData();
		if (!gridItem || gridItem.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		// 중복 체크
		if (!gridRef.current.checkDuplicateValue(['userId', 'ipAddr'])) {
			return false;
		}
		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				ipAllows: gridItem,
			};
			apiPostIpAllowSave(params).then(() => {
				onClickSearchButton();
			});
		});
	};

	/**
	 * 메뉴 타이틀 함수
	 */
	const titleFunc = {
		searchYn: onClickSearchButton,
		saveYn: onClickSaveButton,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	useEffect(() => {
		// 조회
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />
			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchIpAllow search={onClickSearchButton}></SearchIpAllow>
			</SearchForm>
			{/* 화면 상세 영역 정의*/}
			<DetailIpAllow ref={gridRef} data={gridData} />
		</>
	);
};

export default IpAllow;
