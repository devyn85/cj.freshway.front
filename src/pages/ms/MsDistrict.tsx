/*
 ############################################################################
 # FiledataField	: MsDistrict.tsx
 # Description		: 기준정보 > 권역기준정보 > 권역별차량관리
 # Author			: jangjaehyun
 # Since			: 25.08.08
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsDistrictDetail from '@/components/ms/district/MsDistrictDetail';
import MsDistrictSearch from '@/components/ms/district/MsDistrictSearch';

// Store

// API
import { apiGetMasterList } from '@/api/ms/apiMsDistrict';
import dayjs from 'dayjs';

const MsDistrict = () => {
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

	// 글로벌 센터코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 선택한 센터코드
	const [selectDcCode, setSelectDcCode] = useState(gDccode);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: gDccode,
		districtCode: null,
		delYn: 'N',
		effectiveDate: dayjs(),
	});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchDistrictList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchDistrictListRun();
			});
		} else {
			searchDistrictListRun();
		}
	};

	/**
	 * 조회
	 * @returns {void}
	 */
	const searchDistrictListRun = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();
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
		searchYn: searchDistrictList, // 조회
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
				<MsDistrictSearch form={form} search={searchDistrictList} setSelectDcCode={setSelectDcCode} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsDistrictDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchDistrictList}
				form={form}
				selectDcCode={selectDcCode}
			/>
		</>
	);
};
export default MsDistrict;
