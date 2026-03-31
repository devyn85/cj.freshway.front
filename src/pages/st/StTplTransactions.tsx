/*
 ############################################################################
 # FiledataField	: StTplTransactions.tsx
 # Description		: 정산 > 위탁물류 >  위탁입출고현황 
 # Author			: ParkYoSep
 # Since			: 2025.10.30
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';

//Api
import { apipostDetailList } from '@/api/st/apiStTplTransactions';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StTplTransactionsDetail from '@/components/st/tplTransactions/StTplTransactionsDetail';
import StTplTransactionsSearch from '@/components/st/tplTransactions/StTplTransactionsSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib
const StTplTransactions = () => {
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
			fromDate: params.date[0].format('YYYYMMDD'),
			toDate: params.date[1].format('YYYYMMDD'),
			custkey: form.getFieldValue('custkey'),
			vendor: form.getFieldValue('vendor'),
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
			const fileName = 'ST_TplTransactions.mrd';

			// 2. 리포트 파라미터로 사용할 조회 조건 데이터 생성 (배열 안에 객체 형태로)
			const searchParams = form.getFieldsValue();
			const reportParams = [
				{
					FROMDATE: searchParams.date[0].format('YYYY-MM-DD'),
					TODATE: searchParams.date[1].format('YYYY-MM-DD'),
					TPLUSERNAME: searchParams.tplUserName,
					PRINTDATE: dayjs().format('YYYYMMDD'), // 테스트용 고정 날짜
				},
			];

			// 3. 리포트에 전달할 데이터 가공 (체크된 항목에서 특정 열만 추출)
			const inoutTypeList = getCommonCodeList('EXDC_INOUT_TYPE', '전체');
			const reportData = checkedItems.map((item: any) => ({
				docDt: item.docDt,
				// inoutType 코드값을 이름으로 변환
				inoutType: inoutTypeList.find((codeItem: any) => codeItem.comCd === item.inoutType)?.cdNm || item.inoutType,
				sku: item.sku, // 예시: 'sku' 열만 포함
				skunm: item.skunm,
				qty: item.qty,
				uom: item.uom,
				convSerialNo: item.convSerialNo,
				// 필요에 따라 다른 열들을 여기에 추가할 수 있습니다.
				// skunm: item.skunm,
				// qty: item.qty,
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
				<StTplTransactionsSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StTplTransactionsDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				savePrintList={savePrintList}
			/>
		</>
	);
};

export default StTplTransactions;
