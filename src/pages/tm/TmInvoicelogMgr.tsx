/*
 ############################################################################
 # FiledataField	: TmInvoicelogMgr.tsx
 # Description		: 납품서출력로그(관리자)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
// import MenuTitle from '@/components/common/custom/MenuTitle';
import MenuTitle from '@/components/common/custom/MenuTitle';

// store

// API Call Function

// util
import { apiGetInvoiceLogList } from '@/api/tm/apiTmInvoicelogMgr';
import TmInvoicelogMgrDetail from '@/components/tm/InvoicelogMgr/TmInvoicelogMgrDetail';
import TmInvoicelogMgrSearch from '@/components/tm/InvoicelogMgr/TmInvoicelogMgrSearch';
import dayjs from 'dayjs';
// hook

// type

// asset
const TmInvoicelogMgr = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fromDt: dayjs(),
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = () => {
		const params = form.getFieldsValue();
		if (params.dcCode === '0000') {
			params.dcCode = '';
		}
		const searchParam = {
			...params,
			fromInvoiceDt: params.fromDt.format('YYYYMMDD'),
			toInvoiceDt: params.fromDt.format('YYYYMMDD'),
			prtData01: params.prtData01?.format('YYYYMMDD'),
		};

		apiGetInvoiceLogList(searchParam).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<TmInvoicelogMgrSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmInvoicelogMgrDetail ref={refs} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default TmInvoicelogMgr;
