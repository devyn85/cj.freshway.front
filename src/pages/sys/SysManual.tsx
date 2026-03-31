/*
 ############################################################################
 # FiledataField	: Program.tsx
 # Description		: ADMIN > 시스템운영 > 매뉴얼
 # Author			: JangGwangSeok
 # Since			: 26.01.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import SysManualDetail from '@/components/sys/manual/SysManualDetail';

// API
import { apiGetSysManualList } from '@/api/sys/apiSysManual';

const SysManual = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
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
	const search = () => {
		gridRef.current.clearGridData();
		apiGetSysManualList(null).then(res => {
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

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: search, // 조회
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
			<MenuTitle func={titleFunc} isShowSearchFormButton={false} />

			{/* 화면 상세 영역 정의 */}
			<SysManualDetail ref={gridRef} data={gridData} totalCnt={totalCnt} callBackFn={search} form={form} />
		</>
	);
};
export default SysManual;
