/*
 ############################################################################
 # FiledataField	: TmDeliveryMemo.tsx
 # Description		: 배송 > 배차현황 > 거래처별 메모사항 조회
 # Author					: JiHoPark
 # Since					: 2025.10.27.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import TmDeliveryMemoDetail from '@/components/tm/deliveryMemo/TmDeliveryMemoDetail';
import TmDeliveryMemoSearch from '@/components/tm/deliveryMemo/TmDeliveryMemoSearch';

// Util
import dayjs from 'dayjs';

// Store

// API
import { apiGetMasterList } from '@/api/tm/apiTmDeliveryMemo';

// Hooks

// type

// asset

const TmDeliveryMemo = () => {
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
		deliverydt: [dayjs(), dayjs()], // 배송일자
		carno: '', // 차량번호
		toCustkey: '', // 거래처
		chkMemo: 'Y', // 입력건만 조회
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
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 목록 초기화
		gridRefs.current.clearGridData();

		const searchParam = searchForm.getFieldsValue();
		const params = {
			...searchParam,
			dccode: searchParam.gMultiDccode,
			fromDeliverydt: searchParam.deliverydt[0].format('YYYYMMDD'),
			toDeliverydt: searchParam.deliverydt[1].format('YYYYMMDD'),
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
				<TmDeliveryMemoSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<TmDeliveryMemoDetail ref={gridRefs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default TmDeliveryMemo;
