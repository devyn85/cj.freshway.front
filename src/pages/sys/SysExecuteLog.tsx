/*
 ############################################################################
 # FiledataField	: SysExecuteLog.tsx
 # Description		: 시스템운영 > 시스템운영 > 프로시저실행로그
 # Author			: KimJiSoo
 # Since			: 25.07.17
 ############################################################################
*/

// CSS

// Lib
import dateUtils from '@/util/dateUtil';
import { Form } from 'antd';
import dayjs from 'dayjs';

//Api
import { apiGetMasterList } from '@/api/sys/apiSysExecuteLog';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
// import { CheckBox, InputText, InputTextArea, SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
import SysExecuteLogDetail from '@/components/sys/excecuteLog/SysExecuteLogDetail';
import SysExecuteLogSearch from '@/components/sys/excecuteLog/SysExecuteLogSearch';

const SysExecuteLog = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const refs: any = useRef(null);

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
		executeDt: dayjs(dateUtils.getToDay('YYYY-MM-DD')), // 초기값 설정_오늘날짜
		error: '1', // 초기값 설정_에러만 조회
	});
	const onChange = (value: string) => {};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);

		const formData = form.getFieldsValue();
		const executeDt = dayjs(formData.executeDt).format('YYYYMMDD');
		const params = {
			...formData,
			executeDt: executeDt,
		};

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" name={t('lbl.PREXECUTELOG')} func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<SysExecuteLogSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			{/* 그리드 영역 정의 */}
			<SysExecuteLogDetail ref={refs} form={detailForm} data={gridData} />
		</>
	);
};

export default SysExecuteLog;
