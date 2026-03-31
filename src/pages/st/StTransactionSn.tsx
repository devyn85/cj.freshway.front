/*
 ############################################################################
 # FiledataField	: StTransactionSn.tsx
 # Description		: 재고 > 재고현황 > 이력재고처리현황
 # Author			: YangChangHwan
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

// lib
import { apiGetMasterList } from '@/api/st/apiStTransactionSn';
import { SearchForm } from '@/components/common/custom/form';
import StTransactionSnDetail from '@/components/st/transactionSn/StTransactionSnDetail';
import StTransactionSnSearch from '@/components/st/transactionSn/StTransactionSnSearch';
import { t } from 'i18next';

const StTransactionSn = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: null, // 물류센터코드 (고정)
		trantype: null, //
		organizenm: null, // 창고명
		sortKey: null, // 정렬키
		skuName: null, // 상품명/코드
		storagetype: null, // 보관유형
		lottable01yn: null, // 유통기한 여부
		stocktype: null, // 재고유형
		stockgrade: null, // 재고등급
		zone: null, // 존
		fromloc: null, // 시작 로케이션
		toloc: null, // 종료 로케이션
		blno: null, // BL번호
		serialno: null, // 시리얼번호
		zeroQtyYn: null, // 재고수량 0 포함여부
		dt: null, // 조회기간 (시작일~종료일)
		contractcompany: null, // 계약업체
		searchserial: null, // 시리얼 검색여부
	}); // 검색영역 초기값

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = async () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		if (params.fromloc || params.blno || params.contractcompany) {
			params.searchserial = 'Y';
		}

		// 30일 체크
		const dtArr = form.getFieldValue('dt');
		if (dtArr && dtArr[0] && dtArr[1]) {
			const start = dtArr[0];
			const end = dtArr[1];
			const diffDays = end.diff(start, 'day');
			if (diffDays > 180) {
				showAlert(null, t('msg.checkDateTerm', [180])); // 조회 기간은 최대 {{0}}일까지 가능합니다.
				return;
			}
			params.dt1 = start.format('YYYYMMDD');
			params.dt2 = end.format('YYYYMMDD');
		}

		//refs.current.setHandlerSearch();

		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/**
	 * 공통버튼 클릭
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		//
	}, []);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchForm form={form} initialValues={searchBox}>
				<StTransactionSnSearch search={searchMasterList} form={form} />
			</SearchForm>
			<StTransactionSnDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StTransactionSn;
