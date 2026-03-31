/*
 ############################################################################
 # FiledataField	: IbKxStoragefeeExpenseMM.tsx
 # Description		: 정산 > 1000센터 정산 > 비용기표(1000센터)
 # Author			: ParkYoSep
 # Since			: 25.12.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';

// API
import { apiGetMasterList } from '@/api/ib/apiIbKxStoragefeeExpenseMM';
import IbKxStoragefeeExpenseMMDetail from '@/components/ib/kxStoragefeeExpenseMM/IbKxStoragefeeExpenseMMDetail';
import IbKxStoragefeeExpenseMMSearch from '@/components/ib/kxStoragefeeExpenseMM/IbKxStoragefeeExpenseMMSearch';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const IbKxStoragefeeExpenseMM = () => {
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
		closeDate: dayjs(),
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
		if (gridRef.current.getChangedData().length > 0) {
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
		params.dcCode = gDccode;
		params.closeDate = params.closeDate.format('YYYYMM');
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
				<IbKxStoragefeeExpenseMMSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<IbKxStoragefeeExpenseMMDetail
				ref={gridRef}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
				callBackFn={searchMasterList}
			/>
		</>
	);
};
export default IbKxStoragefeeExpenseMM;
