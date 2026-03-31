/*
############################################################################
 # FiledataField	: TmDistanceBand.tsx
 # Description		: 센터별구간설정
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TmDistanceBandDetail from '@/components/tm/distanceBand/TmDistanceBandDetail';
import TmDistanceBandSearch from '@/components/tm/distanceBand/TmDistanceBandSearch';

// store

// API Call Function
import { apiGetMasterList as apiGetMasterList1 } from '@/api/tm/apiTmDistanceBand';
import { apiGetMasterList } from '@/api/tm/apiTmEntityRule';

// util

// hook

// type

// asset
const TmDistanceBand = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDtlData, setGridDtlData] = useState([]);
	const [dtlTotalCnt, setDtlTotalCnt] = useState(0);
	const [totalCnt, setTotalCnt] = useState(0);
	// const dcCode = Form.useWatch('dcCode', form);z
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		date: dayjs(),
		dcCode: gDccode,
		sttlItemCd: null,
		contractType: null,
		ton: null,
		closeType: null,
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 조회
	 * @returns
	 */
	const searchMaterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}
		refs.gridRef.current.clearGridData();
		refs.gridRef1.current.clearGridData();
		const params = form.getFieldsValue();

		const searchParam = {
			...params,
			contractYn: false,
			standardFromDate: params.date[0].format('YYYYMMDD'),
			standardToDate: params.date[1].format('YYYYMMDD'),
		};

		apiGetMasterList(searchParam).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};
	const searchMaterList1 = async (searchList: any) => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		refs.gridRef1.current.clearGridData();
		const params = form.getFieldsValue();

		const searchParam = {
			...searchList,
			carrierRange: searchList.base,
			serialYn: params.serialYn,
			fromDate: params.date[0].format('YYYYMMDD'),
			toDate: params.date[1].format('YYYYMMDD'),
		};
		searchParam.fromDate = params.date[0].format('YYYYMMDD');
		searchParam.toDate = params.date[1].format('YYYYMMDD');
		apiGetMasterList1(searchParam).then(res => {
			setGridDtlData(res.data);
			setDtlTotalCnt(res.data.length);
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
				<TmDistanceBandSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<TmDistanceBandDetail
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				fnCallBack={searchMaterList}
				form={form}
				searchDtl={searchMaterList1}
				dataDtl={gridDtlData}
				totalCntDtl={dtlTotalCnt}
				fnDtlCallBack={searchMaterList1}
			/>
		</>
	);
};

export default TmDistanceBand;
