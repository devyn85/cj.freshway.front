/*
 ############################################################################
 # FiledataField	: KpDpShortageResult.tsx
 # Description		: 지표 > 센터 운영 > 입고 결품 현황
 # Author			: KimDongHan
 # Since			: 2025.09.08
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import {
	apiPostMasterT1List,
	apiPostMasterT2List,
	apiPostMasterT3List,
	apiPostMasterT4List,
} from '@/api/kp/apiKpDpShortageResult';
import KpDpShortageResultDetail from '@/components/kp/kpShortageResult/KpDpShortageResultDetail';
import KpDpShortageResultSearch from '@/components/kp/kpShortageResult/KpDpShortageResultSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const KpDpShortageResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	const [activeKey, setActiveKey] = useState('3');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	//const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();
		requestParams.docdt = requestParams.docdt.format('YYYYMMDD');

		let data;
		if (activeKey === '1') {
			gridRef.current?.clearGridData();
			({ data } = await apiPostMasterT1List(requestParams));
			setGridData(data || []);
		} else if (activeKey === '2') {
			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(requestParams));
			setGridData1(data || []);
		} else if (activeKey === '3') {
			gridRef2.current?.clearGridData();
			({ data } = await apiPostMasterT3List(requestParams));
			setGridData2(data || []);
		} else if (activeKey === '4') {
			gridRef3.current?.clearGridData();
			({ data } = await apiPostMasterT4List(requestParams));
			setGridData3(data || []);
		}
	};

	// 검색영역 초기 세팅
	const searchBox = {
		docdt: dayjs(), // 조회일자
		reasoncode: '', // 결품사유
		reasontype: '', // 귀책구분
		pomdcode: '', // 수급담당
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearSortingAll();
		// 	gridRef1.current?.clearSortingAll();
		// 	gridRef2.current?.clearSortingAll();
		// 	gridRef3.current?.clearSortingAll();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
		// 	gridRef2.current?.clearGridData();
		// 	gridRef3.current?.clearGridData();
		// },
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearSortingAll();
		gridRef1.current?.clearSortingAll();
		gridRef2.current?.clearSortingAll();
		gridRef3.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<KpDpShortageResultSearch {...formProps} />
			</SearchFormResponsive>

			{/* <Tabs
				activeKey={activeKey}
				onChange={key => setActiveKey(key)}
				items={tabItems}
			// tabBarStyle={{ marginBottom: 0 }} // 공간 없애기
			/> */}
			<KpDpShortageResultDetail
				activeKey={activeKey}
				activeKeyRef={activeKeyRef}
				gridRef={gridRef} // 1. 일배_탭
				gridRef1={gridRef1} // 2. 저장_탭
				gridRef2={gridRef2} // 3. 일배요약_탭
				gridRef3={gridRef3} // 4. 저장요약_탭
				gridData={gridData} // 1. 일배_탭
				gridData1={gridData1} // 2. 저장_탭
				gridData2={gridData2} // 3. 일배요약_탭
				gridData3={gridData3} // 4. 저장요약_탭
				setActiveKey={setActiveKey}
			/>
		</>
	);
};

export default KpDpShortageResult;
