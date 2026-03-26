// Lib
import { Form } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdShipmentBatchDetail from '@/components/wd/shipmentBatch/WdShipmentBatchDetail';
import WdShipmentBatchSearch from '@/components/wd/shipmentBatch/WdShipmentBatchSearch';

import { SearchFormResponsive } from '@/components/common/custom/form';

const WdShipmentBatch = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData] = useState([]);

	// 조회 총 건수
	const [totalCount] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 목록 조회
	 */
	const search = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 그리드 초기화
		refs.gridRef?.current.clearGridData();
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
			<MenuTitle authority="searchYn" name="출고확정처리" />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdShipmentBatchSearch form={form} />
			</SearchFormResponsive>

			<WdShipmentBatchDetail ref={refs} gridData={gridData} totalCount={totalCount} search={search} />
		</>
	);
});

export default WdShipmentBatch;
