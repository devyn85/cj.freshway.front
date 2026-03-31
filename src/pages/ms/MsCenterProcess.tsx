/*
 ############################################################################
 # FiledataField	: MsCenterProcess.tsx
 # Description		: 기준정보 > 센터기준정보 > 분류피킹공정셋팅
 # Author			: jangjaehyun
 # Since			: 25.06.30
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
// import MsCenterProcessDetail from '@/components/ms/centerProcess/MsCenterProcessDetail';
// import MsCenterProcessSearch from '@/components/ms/centerProcess/MsCenterProcessSearch';

// API
// import { apiGetPickBatchGroupList } from '@/api/ms/apiMsPickBatchGroup';

const MsCenterProcess = () => {
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

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		batchGroup: null,
		description: null,
	});

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
	const searchPickBatchGroupList = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		// apiGetPickBatchGroupList(params).then(res => {
		// 	setGridData(res.data);
		// 	setTotalCnt(res.data.length); // 전체 데이터 개수 설정

		// 	// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		// 	const colSizeList = gridRef.current.getFitColumnSizeList(true);

		// 	// 구해진 칼럼 사이즈를 적용 시킴.
		// 	gridRef.current.setColumnSizeList(colSizeList);
		// });
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchPickBatchGroupList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				{/* <MsCenterProcessSearch form={form} search={searchPickBatchGroupList} /> */}
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			{/* <MsCenterProcessDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchPickBatchGroupList} /> */}
		</>
	);
};
export default MsCenterProcess;
