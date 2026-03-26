/*
 ############################################################################
 # FiledataField	: StDailyInoutClose.tsx
 # Description		: 기준정보 > 센터기준정보 > 수불마감정보
 # Author			: jangjaehyun
 # Since			: 25.07.22
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import StDailyInoutCloseDetail from '@/components/st/dailyInoutClose/StDailyInoutCloseDetail';
import StDailyInoutCloseSearch from '@/components/st/dailyInoutClose/StDailyInoutCloseSearch';

// API
import { apiGetMasterList } from '@/api/st/apiStDailyInoutClose';

const StDailyInoutClose = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		inoutDt: dayjs(),
		multiDcCode: [gDccode],
		delYn: '',
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
	const searchMasterList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};
	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterListRun = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		params.inoutDt = params.inoutDt.format('YYYYMM');

		apiGetMasterList(params).then(res => {
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
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StDailyInoutCloseSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<StDailyInoutCloseDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
				callBackFn={searchMasterList}
			/>
		</>
	);
};
export default StDailyInoutClose;
