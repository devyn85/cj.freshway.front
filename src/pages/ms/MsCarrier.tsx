/*
 ############################################################################
 # FiledataField	: MsCarrier.tsx
 # Description		: 기준정보 > 센터기준정보 > 운송사정보
 # Author			: YeoSeungCheol
 # Since			: 25.07.18
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsCarrierDetail from '@/components/ms/carrier/MsCarrierDetail';
import MsCarrierSearch from '@/components/ms/carrier/MsCarrierSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsCarrier';

// Store

const MsCarrier = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);

	// 조회 총 건수
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		carrierType: null,
		carrierName: null,
		statusCode: null,
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
	 */
	const searchMasterList = () => {
		if (detailForm.getFieldValue('rowStatus') === 'U' || gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * 조회 실행
	 */
	const searchMasterListRun = () => {
		gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);

		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 운송사 검색에서는 특별한 처리가 필요하지 않음
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
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
			<SearchFormResponsive form={form} initialValues={searchBox} onValuesChange={onValuesChange}>
				<MsCarrierSearch form={form} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsCarrierDetail
				ref={gridRef}
				detailForm={detailForm}
				data={gridData}
				totalCnt={totalCnt}
				form={form}
				callBackFn={searchMasterList}
			/>
		</>
	);
};

export default MsCarrier;
