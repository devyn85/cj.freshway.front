/*
 ############################################################################
 # FiledataField	: KpWdShortageResult.tsx
 # Description		: 지표/모니터링 > 센터운영지표 > 출고결품실적
 # Author			: KimDongHan
 # Since			: 2025.12.02
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostColList, apiPostMasterT1List, apiPostMasterT2List } from '@/api/kp/apiKpWdShortageResult';
import TabsArray from '@/components/common/TabsArray';
import KpWdShortageResultSearch from '@/components/kp/wdShortageResult/KpWdShortageResultSearch';
import KpWdShortageResultTab1Detail from '@/components/kp/wdShortageResult/KpWdShortageResultTab1Detail';
import KpWdShortageResultTab2Detail from '@/components/kp/wdShortageResult/KpWdShortageResultTab2Detail';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

const KpWdShortageResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const refs = useRef<any>(null);
	const refs2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const [colList, setColList] = useState([]);
	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	const skupartList = [
		{ cdNm: t('lbl.ALL'), comCd: '01' }, // 전체
		{ cdNm: t('lbl.SAVE'), comCd: '02' }, // 저장
		{ cdNm: t('lbl.DAILY_TAB'), comCd: '03' }, // 일배
		{ cdNm: t('lbl.CHAIN'), comCd: '04' }, // 체인
		{ cdNm: t('lbl.JEDANG'), comCd: '05' }, // 제당
		{ cdNm: t('lbl.ORDERCOUNT'), comCd: '06' }, // 주문건수
		{ cdNm: t('lbl.CANCEL_RATE'), comCd: '07' }, // 결품율
	];

	const reasonList1 = getCommonCodeList('REASONCODE_WD');
	const reasonList2 = [
		{ cdNm: t('lbl.ORDERCOUNT'), comCd: 'Z98' }, // 주문건수
		{ cdNm: t('lbl.CANCEL_RATE'), comCd: 'Z99' }, // 결품율
	];

	const reasonList = [...reasonList1, ...reasonList2];

	const [searchBox] = useState({
		docdt: dayjs(), // 조회일자
		channel: null,
		reasoncode: null,
		exReasoncodeYn: '0',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 월별 일자 조회
	const searchColList = async () => {
		refs.current?.clearGridData();
		refs2.current?.clearGridData();

		setGridData([]);

		const requestParams = form.getFieldsValue();
		if (activeKey === '1') {
			requestParams.docdt = requestParams.docdt.format('YYYYMM');
		} else {
			requestParams.docdt = requestParams.searchDate.format('YYYYMMDD');
		}

		const { data } = await apiPostColList(requestParams);
		setColList(data);
	};

	// 조회
	const searchMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();
		requestParams.colList = Array.isArray(colList)
			? colList.map((c: any) => c.colValue).filter((v: any) => v !== undefined && v !== null)
			: [];

		let data;
		if (activeKey === '1') {
			refs.current?.gridRef?.current?.clearGridData();
			refs.current?.gridRef2?.current?.clearGridData();

			requestParams.docdt = requestParams.docdt.format('YYYYMM');

			({ data } = await apiPostMasterT1List(requestParams));

			const newData = (data || []).map((item: any) => ({
				...item,
				skupartname: skupartList.find(s => s.comCd === String(item.skupart))?.cdNm ?? item.skupart,
			}));

			setGridData(newData);
			setTotalCnt2(newData.length);
		} else if (activeKey === '2') {
			if (commUtil.isNull(requestParams.searchDate)) {
				showAlert('', '출고일자를 선택해주세요.');
				return;
			}
			refs2.current?.gridRef?.current?.clearGridData();
			requestParams.slipdt = requestParams.searchDate.format('YYYYMMDD');

			apiPostMasterT2List(requestParams).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		}
	};
	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveKey('1');
			if (refs.current?.gridRef?.current) {
				refs.current?.gridRef?.current?.resize('100%', '100%');
			}
			if (refs.current?.gridRef2?.current) {
				refs.current?.gridRef2?.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKey('2');
		}
		return;
	};

	const formProps = {
		initialValues: searchBox,
		form: form,
		dates,
		activeKey,
		searchColList,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
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
		//refs.current?.clearSortingAll();
		//refs.current?.clearSortingAll();
		//refs2.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		searchColList();
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '월요약',
			children: (
				<KpWdShortageResultTab1Detail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					colList={colList}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '2',
			label: '일요약',
			children: (
				<KpWdShortageResultTab2Detail
					ref={refs2}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					search={searchMasterList}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<KpWdShortageResultSearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default KpWdShortageResult;
