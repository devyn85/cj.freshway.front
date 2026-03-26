/*
 ############################################################################
 # FiledataField	: MsKit.tsx
 # Description		: 기준정보 > 상품기준정보 > Kit상품 정보
 # Author			: jangjaehyun
 # Since			: 25.07.02
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import { useSelector } from 'react-redux';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsKitDetail from '@/components/ms/kit/MsKitDetail';
import MsKitSearch from '@/components/ms/kit/MsKitSearch';

// API
import { apiGetMasterList } from '@/api/ms/apiMsKit';

const MsKit = () => {
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
		kitSku: '',
		kitSkuName: '',
		delYn: null,
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
	const searchMaster = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterRun();
			});
		} else {
			searchMasterRun();
		}
	};

	/**
	 * 조회 실행
	 * @returns {void}
	 */
	const searchMasterRun = () => {
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
		searchYn: searchMaster, // 조회
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
				<MsKitSearch form={form} search={searchMaster} setSelectDcCode={setSelectDcCode} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsKitDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				callBackFn={searchMaster}
				selectDcCode={selectDcCode}
			/>
		</>
	);
};
export default MsKit;
