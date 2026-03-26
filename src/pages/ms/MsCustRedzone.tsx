/*
 ############################################################################
 # FiledataField	: MsCustRedzone.tsx
 # Description		: 기준정보 > 거래처기준정보 > 특별관리고객현황
 # Author			: YeoSeungCheol
 # Since			: 25.05.28
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsCustRedzoneDetail from '@/components/ms/custRedzone/MsCustRedzoneDetail';
import MsCustRedzoneSearch from '@/components/ms/custRedzone/MsCustRedzoneSearch';

// API
import { apiGetMasterList } from '@/api/ms/apiMSCustRedzone';

const MsCustRedzone = () => {
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
		custName: '',
		custCode: '',
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
	const searchMaster = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		apiGetMasterList({ ...params }).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length); // 전체 데이터 개수 설정

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaster, // 조회
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
				<MsCustRedzoneSearch form={form} search={searchMaster} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsCustRedzoneDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={searchMaster} />
		</>
	);
};
export default MsCustRedzone;
