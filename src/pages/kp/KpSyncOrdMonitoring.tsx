/*
 ############################################################################
 # FiledataField	: KpSyncOrdMonitoring.tsx
 # Description		: 주문동기화 모니터링
 # Author			    :
 # Since			    :
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpSyncOrdMonitoringDetail from '@/components/kp/syncOrdMonitoring/KpSyncOrdMonitoringDetail';
import KpSyncOrdMonitoringSearch from '@/components/kp/syncOrdMonitoring/KpSyncOrdMonitoringSearch';

// store
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function
import { apiGetMasterList } from '@/api/kp/apiKpSyncOrdMonitoring';
// util
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';

import { useMoveMenu } from '@/hooks/useMoveMenu';
import dayjs from 'dayjs';

const KpSyncOrdMonitoring = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { moveMenu } = useMoveMenu();
	const [form] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅 (배송일자: 기간 from~to)
	const [searchBox] = useState({
		pvcDeliveryDt: [dayjs(), dayjs()],
		orderCompleteYn: '0',
	});

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 글로벌 기본 물류센터 (디폴트 선택 시 폼 값 동기화용)
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 디폴트 물류센터가 있을 때 폼 필드에 반영 (미반영 시 조회 시 필수값 오류 방지)
	useEffect(() => {
		if (!form || !globalVariable?.gDccode) return;
		const currentDcCode = form.getFieldValue('dcCode');
		if (currentDcCode == null || (Array.isArray(currentDcCode) && currentDcCode.length === 0)) {
			form.setFieldsValue({ dcCode: [globalVariable.gDccode] });
		}
	}, [globalVariable?.gDccode]);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 조회
	const searchMaterList = async () => {
		// 물류센터: 디폴트가 있거나 문자열로 들어온 경우 검증 전에 배열로 맞춤 (필수값/type:array 검증 통과)
		const gDccode = globalVariable?.gDccode;
		const currentDcCode = form.getFieldValue('dcCode');
		const isEmpty =
			currentDcCode == null || currentDcCode === '' || (Array.isArray(currentDcCode) && currentDcCode.length === 0);
		const isString = typeof currentDcCode === 'string' && currentDcCode !== '';
		if (isEmpty && commUtil.isNotEmpty(gDccode)) {
			form.setFieldsValue({ dcCode: [gDccode] });
		} else if (isString) {
			// 화면에는 디폴트(문자열)로 보이지만 폼에는 문자열만 들어가 있으면 type:array 검증 실패 → 배열로 정규화
			form.setFieldsValue({ dcCode: [currentDcCode] });
		}

		const params = form.getFieldsValue();
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		refs.gridRef1.current.clearGridData();
		const range = params.pvcDeliveryDt;
		const pvcDeliveryDtFrom = Array.isArray(range) && range[0] ? range[0].format('YYYYMMDD') : '';
		const pvcDeliveryDtTo = Array.isArray(range) && range[1] ? range[1].format('YYYYMMDD') : '';
		// 체크박스 값이 boolean 등으로 올 수 있으므로 API에는 반드시 문자열 '1'/'0'으로 전달
		const orderCompleteYn = params.orderCompleteYn;
		const orderCompleteYnStr =
			orderCompleteYn === '1' || orderCompleteYn === true || String(orderCompleteYn).toLowerCase() === 'true'
				? '1'
				: '0';
		const searchParam = {
			pvcDeliveryDtFrom,
			pvcDeliveryDtTo,
			dcCode: Array.isArray(params.dcCode) ? params.dcCode.join(',') : params.dcCode,
			docType: params.docType ?? '',
			orderCompleteYn: orderCompleteYnStr,
			workProcessCode: params.workProcessCode?.trim?.() ?? '',
		};

		apiGetMasterList(searchParam).then(res => {
			const data = res.data ?? [];
			setGridData(data);
			setTotalCnt(data.length);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMaterList,
	};

	// Detail 그리드 로우 더블클릭 시 상세 모니터링 화면으로 이동 (기존 탭 재사용, state로 dccode/docno/docline/doctype 전달)
	const handleDetailRowDoubleClick = (payload: {
		dccode: string;
		docno: string;
		docline: number | string;
		doctype: string;
	}) => {
		const tabKey = ['DP', 'RT', 'WD', 'AJ', 'ST'].includes(payload.doctype) ? payload.doctype : 'DP';
		moveMenu('/kp/KpSyncOrdDtlMonitoring', {
			fromSyncOrdMonitoring: true,
			dccode: payload.dccode,
			docno: payload.docno,
			docline: payload.docline,
			doctype: tabKey,
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			<MenuTitle func={titleFunc} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<KpSyncOrdMonitoringSearch />
			</SearchFormResponsive>
			<KpSyncOrdMonitoringDetail
				ref={refs}
				data={gridData}
				totalCnt={totalCnt}
				onDetailRowDoubleClick={handleDetailRowDoubleClick}
			/>
		</>
	);
};

export default KpSyncOrdMonitoring;
