/*
 ############################################################################
 # FiledataField	: MsCenterSto.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터이체마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import Splitter from '@/components/common/Splitter';
import MsCenterStoDetail from '@/components/ms/centerSto/MsCenterStoDetail';
import MsCenterStoMaster from '@/components/ms/centerSto/MsCenterStoMaster';

// API Call Function
// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsCenterSto';
// hooks

const MsCenterSto = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [masterData, setMasterData] = useState(null);
	const [priorityData, setPriorityData] = useState(null);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const gridRef = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param data
	 */
	const changeMasterGrid = (data: any) => {
		setMasterData(data);
	};
	/**
	 * 센터이체 우선순위 목록 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		apiGetMasterList().then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		searchMasterList();
	}, []);

	// 센터이체 우선순위 목록 그리드
	useEffect(() => {
		if (priorityData) {
			searchMasterList();
		}
	}, [priorityData]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<MsCenterStoMaster
							ref={gridRef}
							changeMasterGrid={changeMasterGrid}
							priorityData={priorityData}
							gridData={gridData}
							totalCnt={totalCnt}
							search={searchMasterList}
						/>
					</>,
					<>
						<MsCenterStoDetail masterData={masterData} setPriorityData={setPriorityData} />
					</>,
				]}
			/>
		</>
	);
};
export default MsCenterSto;
