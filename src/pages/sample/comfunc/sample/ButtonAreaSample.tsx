/*
 ############################################################################
 # FiledataField	: ButtonAreaSample.tsx
 # Description		: 버튼 영역 샘플
 # Author			: JangGwangSeok
 # Since			: 25.04.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// CSS

// Util

// Store

// Component
import GridButtonSample from '@/components/comfunc/sample/button/GridButtonSample';
import GridButtonSearch from '@/components/comfunc/sample/button/GridButtonSearch';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API
import { apiGetSysProgramList } from '@/api/sys/apiSysProgram';

const ButtonAreaSample = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns {void}
	 */
	const searchFn = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		apiGetSysProgramList(params).then(res => {
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

	/**
	 * 조회
	 * @returns {void}
	 */
	const resetFn = () => {
		gridRef.current.clearGridData();
		form.resetFields();
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		reset: resetFn, // 초기화
		searchYn: searchFn, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 화면 초기 세팅
	useEffect(() => {
		searchFn();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form}>
				<GridButtonSearch />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<GridButtonSample ref={gridRef} data={gridData} totalCnt={totalCnt} />
		</>
	);
};
export default ButtonAreaSample;
