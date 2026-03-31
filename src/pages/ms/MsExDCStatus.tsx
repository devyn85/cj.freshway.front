/*
 ############################################################################
 # FiledataField	: MsExDCStatus.tsx
 # Description		: 외부창고현황 관리 조회
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib

import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsExDCStatusDetail from '@/components/ms/exDCStatus/MsExDCStatusDetail';
import MsExDCStatusSearch from '@/components/ms/exDCStatus/MsExDCStatusSearch';

// store

// api
import { apiGetExDCStatusList } from '@/api/ms/apiMsExDCStatus';

// util
import { showMessage } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// hook

// type

// asset
const MsExDCStatus = () => {
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
	const year = dayjs().get('year');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		organizeName: '',
		organize: '',
		plant: '2170',
		dccode: '2170',
		storagetype: '',
		district: '',
		area: '',
		searchDt: [dayjs(year + '0101').startOf('month'), dayjs(year + '1201').endOf('month')],
		fixDcCode: '2170',
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
		const formData = form.getFieldsValue();
		// 상세폼이 수정된 상태이면 확인 메시지 출력
		if (refs.current.isChangeForm()) {
			showMessage({
				content: t('msg.MSG_COM_CFM_009'),
				modalType: 'info',
			});
			return;
		}
		if (commUtil.isNull(formData.searchDt)) {
			showAlert('', '계약일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(formData.searchDt[0]) || commUtil.isNull(formData.searchDt[1])) {
			showAlert('', '계약일자를 선택해주세요.');
			return;
		}
		refs.current.resetDetail();

		const params = {
			...formData,
			fromDt: formData.searchDt[0].format('YYYYMMDD'),
			thruDt: formData.searchDt[1].format('YYYYMMDD'),
		};

		apiGetExDCStatusList(params).then(res => {
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
				<MsExDCStatusSearch form={form} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<MsExDCStatusDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} callBackFn={searchMaterList} />
		</>
	);
};

export default MsExDCStatus;
