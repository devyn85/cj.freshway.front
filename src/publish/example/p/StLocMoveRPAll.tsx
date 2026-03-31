// Lib
import { Form } from 'antd';

// Util
import MenuTitle from '@/components/common/custom/MenuTitle';

// Type

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
// import StLocMoveRPAllDetail from '@/components/st/locMoveRPAll/StLocMoveRPAllDetail';
import StLocMoveRPAllSearch from '@/components/st/locMoveRPAll/StLocMoveRPAllSearch';

// API
import { apiGetMasterList } from '@/api/cm/apiCmDcXOrganizeManager';

const StLocMoveRPAll = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

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

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length); // 전체 데이터 개수 설정

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name="출고재고보충(전센터)" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveRPAllSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>

			{/* <StLocMoveRPAllDetail ref={gridRef} data={gridData} totalCnt={totalCnt} search={searchMasterList} /> */}
		</>
	);
});

export default StLocMoveRPAll;
