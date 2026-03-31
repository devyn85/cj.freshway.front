/*
 ############################################################################
 # FiledataField	: TmMngplcIDUndone.tsx
 # Description		: 배송 > 배차작업 > 분할 미적용 관리처
 # Author					: JiHoPark
 # Since					: 2025.11.20.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import TmMngplcIDUndoneDetail from '@/components/tm/mngplcIDUndone/TmMngplcIDUndoneDetail';
import TmMngplcIDUndoneSearch from '@/components/tm/mngplcIDUndone/TmMngplcIDUndoneSearch';

// Util
import dayjs from 'dayjs';

// Store

// API
import { apiGetMasterList } from '@/api/tm/apiTmMngplcIDUndone';

// Hooks

// type

// asset

const TmMngplcIDUndone = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// grid data
	const [gridData, setGridData1] = useState([]);
	const [totalCnt, setTotalCnt1] = useState(0);

	// grid Ref
	const gridRefs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		docno: '', // 주문번호
		deliverydate: [dayjs(), dayjs()], // 출고일자
		toCustkey: '', // 관리처 고객
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		if (gridRefs.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		// 목록 초기화
		gridRefs.current.clearGridData();

		const searchParam = searchForm.getFieldsValue();
		const params = {
			dccode: searchParam.gMultiDccode,
			deliverydateFrom: searchParam.deliverydate[0].format('YYYYMMDD'),
			deliverydateTo: searchParam.deliverydate[1].format('YYYYMMDD'),
			toCustkey: searchParam.toCustkey,
			docno: searchParam.docno,
		};

		apiGetMasterList(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
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
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmMngplcIDUndoneSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<TmMngplcIDUndoneDetail ref={gridRefs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default TmMngplcIDUndone;
