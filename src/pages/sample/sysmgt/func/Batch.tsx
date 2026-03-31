/*
 ############################################################################
 # FiledataField	: Batch.tsx
 # Description		: 배치수행이력
 # Author			: Canal Frame
 # Since			: 23.09.27
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
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DetailBatch from '@/components/sysmgt/func/batch/DetailBatch';
import SearchBatch from '@/components/sysmgt/func/batch/SearchBatch';

// API Call Function
import { apiGetJobList } from '@/api/common/apiSysmgt';

const Batch = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//Antd Form 사용
	const [form] = Form.useForm();
	//배치 Step 결과 메세지
	const [stepMessage, setStepMessage] = useState('');
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
    ### 조회버튼 ###
    */
	const search = () => {
		// 그리드 및 메시지 초기화
		refs.ref1.current.clearGridData();
		refs.ref2.current.clearGridData();
		setStepMessage(null);

		//날짜 데이터 전환
		const params = dataTransform.convertSearchData(form.getFieldsValue());
		apiGetJobList({ ...params, listCount: 10, startRow: 0 }).then(res => {
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
	const refs: any = {
		ref1: useRef(null),
		ref2: useRef(null),
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 검색 영역 정의 */}

			<SearchForm form={form} initialValues={searchBox}>
				<SearchBatch />
			</SearchForm>

			{/* 화면 상세 영역 정의 */}
			<DetailBatch ref={refs} stepMessage={stepMessage} setStepMessage={setStepMessage} data={gridData} />
		</>
	);
};
export default Batch;
