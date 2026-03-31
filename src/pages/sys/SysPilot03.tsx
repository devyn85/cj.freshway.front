/*
 ############################################################################
 # FiledataField	: Pilot03.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램
 # Author			: JeongHyeongCheol
 # Since			: 25.05.09
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';
import SysmgtPilot03Detail from '@/components/sys/pilot03/SysPilot03Detail';
import SysPilot03Search from '@/components/sys/pilot03/SysPilot03Search';

// API Call Function
import { apiGetSysPilot03List, apiPostSaveSysPilot03 } from '@/api/sys/apiSysPilot03';

const Pilot03 = () => {
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

	//검색영역 초기 세팅
	const [searchBox] = useState({});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const search = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetSysPilot03List(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			if (colSizeList && colSizeList.length > 1) {
				// 트리 구조는 정확히 계산을 못해서 예외 처리
				colSizeList[1] = 200;
			}
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 저장
	const save = (): void => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData();

		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			// apiPostSaveSysPilot03(menus).then(() => {
			// 	search();
			// });
			apiPostSaveSysPilot03(menus);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, // 조회
		saveYn: save, // 저장
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 화면 초기 세팅
	useEffect(() => {
		search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|saveYn">
				{/* <Button size={'small'} onClick={save}>
					save test
				</Button> */}
			</MenuTitle>

			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				{/* 팝업 */}
				<SysPilot03Search form={form} />
			</SearchForm>

			{/* 화면 상세 영역 정의 */}
			<SysmgtPilot03Detail ref={gridRef} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default Pilot03;
