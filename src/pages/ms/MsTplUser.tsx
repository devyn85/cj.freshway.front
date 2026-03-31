/*
 ############################################################################
 # FiledataField	: MsTplUser.tsx
 # Description		: 정산 > 위탁물류 >  화주관리 
 # Author			: ParkYoSep
 # Since			: 2025.10.23
 ############################################################################
*/
// lib
import { Form } from 'antd';

//Api
import { apipostDetailList } from '@/api/ms/apiMsTplUser';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import MsTplUserDetail from '@/components/ms/tplUser/MsTplUserDetail';
import { default as MsTplUserSearch } from '@/components/ms/tplUser/MsTplUserSearch';

// lib
const MsTplUser = () => {
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
		apipostDetailList(params).then(res => {
			if (res.data?.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			} else {
				setGridData([]);
				setTotalCnt(0);
			}
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

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MsTplUserSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<MsTplUserDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
		</>
	);
};

export default MsTplUser;
