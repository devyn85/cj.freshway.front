/*
 ############################################################################
 # FiledataField	: ExcLog.tsx
 # Description		: 시스템 예외 이력
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import dataTransform from '@/util/dataTransform';
import dateUtils from '@/util/dateUtil';

// Store

// Component
import SearchForm from '@/components/common/custom/form/SearchForm';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DetailExcLog from '@/components/sysmgt/func/excLog/DetailExcLog';
import SearchExcLog from '@/components/sysmgt/func/excLog/SearchExcLog';

// API Call Function
import { apiGetExcLogSearch } from '@/api/common/apiSysmgt';

const ExcLog = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//Antd Form 사용
	const [form] = Form.useForm();
	// grid data
	const [gridData, setGridData] = useState([]);
	//오늘날짜 세팅
	const today = dateUtils.getToDay('YYYY-MM-DD');
	//검색영역 초기 세팅
	const [searchBox] = useState({
		fromDt: dayjs(dateUtils.subtractYear(today, 1, 'YYYY-MM-DD')),
		thruDt: dayjs(today),
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회 ###
    */
	const search = () => {
		//날짜 데이터 전환
		const params = dataTransform.convertSearchData(form.getFieldsValue());
		apiGetExcLogSearch({ ...params, listCount: 10, startRow: 0 }).then(res => {
			const gridData = res.data.list;
			setGridData(gridData);
		});
	};

	//메뉴 타이틀 버튼 정의
	const titleFunc = {
		searchYn: search,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//화면 초기 세팅
	useEffect(() => {
		search();
	}, []);

	// 컴포넌트 접근을 위한 Ref
	const ref = useRef(null);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 검색 영역 정의 */}
			<SearchForm form={form} initialValues={searchBox}>
				<SearchExcLog />
			</SearchForm>
			{/* 화면 상세 영역 정의*/}
			<DetailExcLog ref={ref} data={gridData} />
		</>
	);
};

export default ExcLog;
