/*
 ############################################################################
 # FiledataField	: StTplCalcResult.tsx
 # Description		: 정산 > 위탁물류 >  위탁정산내역현황 
 # Author			: ParkYoSep
 # Since			: 2025.11.12
 ############################################################################
*/
// lib
import { Form } from 'antd';

//Api
import { apipostDetailList } from '@/api/st/apiStTplCalcResult';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StTplCalcResultDetail from '@/components/st/tplCalcResult/StTplCalcResultDetail';
import StTplCalcResultSearch from '@/components/st/tplCalcResult/StTplCalcResultSearch';
import dayjs from 'dayjs';

// lib
const StTplCalcResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		dcCode: '2170',
		month: dayjs(),
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		if (refs.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		refs.current.clearGridData();

		const params = form.getFieldsValue();
		const searchParam = {
			...params,
			month: dayjs(params.month).format('YYYYMM'),
			// fromDate: params.date[0].format('YYYYMMDD'),
			// toDate: params.date[1].format('YYYYMMDD'),
			// custkey: form.getFieldValue('custkey'),
			// vendor: form.getFieldValue('vendor'),
		};

		searchMasterListImp(searchParam);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apipostDetailList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// 출력 버튼
	const savePrintList = async () => {
		const checkedItems = refs.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			// 1. 리포트 파일명
			const fileName = 'ST_TplCalcResult.mrd';

			// 2. 리포트 파라미터로 사용할 조회 조건 데이터 생성 (배열 안에 객체 형태로)
			const searchParams = form.getFieldsValue();
			const reportParams = [
				{
					// FROMDATE: searchParams.date[0].format('YYYY-MM-DD'),
					// TODATE: searchParams.date[1].format('YYYY-MM-DD'),
					MONTH: searchParams.month.format('YYYY-MM'),
					TPLUSERNAME: searchParams.tplUserName,
					PRINTDATE: dayjs().format('YYYYMMDD'),
				},
			];
			// 3. 리포트에 전달할 데이터 가공 (체크된 항목에서 특정 열만 추출)

			const reportData = checkedItems.map((item: any) => ({
				deliverydate: item.deliverydate, // 일자
				ioFlag: item.ioFlag, // 구분
				sku: item.sku, // 상품코드
				skuNm: item.skuNm, //상품명
				quantity: item.quantity, // 수량
				uom: item.uom, // 단위
				convserialno: item.convserialno, //B/L NO
				grAmount: item.grAmount, // 입고금액
				giAmount: item.giAmount, // 출고금액
				stockAmount: item.stockAmount, // 보관금액
				wghprice: item.wghprice, // 계근금액
				palletprice: item.palletprice, // 파레트금액
				workAmount: item.workAmount, // 작업비금액
				transprice: item.transprice, // 운송료
				sumAmount: item.sumAmount, // 합계금액
			}));

			// 4. 리포트에 전달할 전체 데이터셋 구성
			const dataSet = {
				ds_report: reportData, // 가공된 데이터 전달
			};

			reportUtil.openAgentReportViewer(fileName, dataSet, reportParams[0]);
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
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StTplCalcResultSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StTplCalcResultDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} savePrintList={savePrintList} />
		</>
	);
};

export default StTplCalcResult;
