/*
 ############################################################################
 # FiledataField	: TmTrasportRouting.tsx
 # Description		: 정산 > 운송비정산 >  수송경로관리 API
 # Author			: ParkYoSep
 # Since			: 2025.10.14
 ############################################################################
*/
// lib
import { Form } from 'antd';

//Api
import { apipostMasterList, getToCenterList } from '@/api/tm/apiTmTrasportRouting';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import TmTrasportRoutingDetail from '@/components/tm/trasportRouting/TmTrasportRoutingDetail';
import TmTrasportRoutingSearch from '@/components/tm/trasportRouting/TmTrasportRoutingSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib
const TmTrasportRouting = () => {
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
	const [dcCodeOptions, setDcCodeOptions] = useState([]); // Search 컴포넌트용 state

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const dcCodeOptionsRef = useRef([]); // Detail에서 공통으로 사용할 도착센터 목록

	// Declare init value(3/4)
	const [searchBox] = useState({
		//
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
		if (refs.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		refs.gridRef.current.clearGridData();
		refs.gridRef2.current.clearGridData();
		// const params = {
		// 	// 	storagetype: commUtil.nvl(form.getFieldValue('storagetype'), ''),
		// };
		const params = form.getFieldsValue();

		const searchParam = {
			...params,
			fromDate: params.date[0].format('YYYYMMDD'),
			toDate: params.date[1].format('YYYYMMDD'),
		};

		searchMasterListImp(searchParam);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apipostMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 컴포넌트가 처음 마운트될 때 도착센터 목록을 조회하여 ref에 저장합니다.
	useEffect(() => {
		// 도착센터 옵션 목록을 생성하는 비동기 함수
		const createDcCodeOptions = async () => {
			// 1. 공통 코드에서 기본 센터 목록을 가져와 포맷팅
			const commonDcList = getCommonCodeList('WMS_MNG_DC').map((item: any) => ({
				comCd: item.comCd,
				cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
			}));

			// 2. API를 통해 추가 센터 목록을 가져와 포맷팅
			const apiRes = await getToCenterList({});
			const apiDcList = (apiRes?.data || []).map((item: any) => ({
				comCd: item.tcCode,
				cdNm: item.tcName ? `[${item.tcCode}] ${item.tcName}` : item.tcName,
			}));

			// 3. 전체 옵션 추가
			const allOption = [{ comCd: '', cdNm: t('lbl.ALL') }]; // '전체' 옵션

			// 4. 목록 합치기
			const combinedList = [...allOption, ...commonDcList, ...apiDcList];

			// 5. Detail 컴포넌트를 위해 ref에 저장하고, Search 컴포넌트를 위해 state를 업데이트
			dcCodeOptionsRef.current = combinedList;
			setDcCodeOptions(combinedList);
		};

		createDcCodeOptions();
	}, []); // 의존성 배열이 비어 있으므로 한 번만 실행됩니다.

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<TmTrasportRoutingSearch search={searchMasterList} form={form} dcCodeOptions={dcCodeOptions} />
			</SearchFormResponsive>
			<TmTrasportRoutingDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				search={searchMasterList}
				dcCodeOptionsRef={dcCodeOptionsRef}
			/>
		</>
	);
};

export default TmTrasportRouting;
