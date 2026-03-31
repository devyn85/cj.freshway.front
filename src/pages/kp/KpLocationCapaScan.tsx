/*
 ############################################################################
 # FiledataField	: KpLocationCapaScan.tsx
 # Description		: 지표 > 재고 운영 > 물류센터 Capa 스캔 현황
 # Author			: KimDongHan
 # Since			: 2025.09.09
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterT1List, apiPostMasterT2List, apiPostPickingZoneList } from '@/api/kp/apiKpLocationCapaScan';
import KpLocationCapaScanDetail from '@/components/kp/locationCapaScan/KpLocationCapaScanDetail';
import KpLocationCapaScanSearch from '@/components/kp/locationCapaScan/KpLocationCapaScanSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const KpLocationCapaScan = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const [zoneItems, setZoneItems] = useState([]);
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	/*
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 피킹존 명칭 함수
	const getZoneNm = (item: any) => {
		return (item.zoneNm = item.zoneNm + t('lbl.ZONE_1'));
	};

	// 상태 명칭 함수
	const getStatusNm = (item: any) => {
		let nm = '';
		if (item.status === '0') {
			nm = t('lbl.EMPTY_RACK');
		} else {
			nm = t('lbl.USED_RACK');
		}
		return nm;
	};

	// 피킹존 콤보 조회
	const searchPickingZone = async () => {
		const requestParams = form.getFieldsValue();
		const { data } = await apiPostPickingZoneList(requestParams);

		setZoneItems(data || []);
	};

	// 그리드 조회
	const searchMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		let data;
		if (activeKey === '1') {
			requestParams.smydt = requestParams.smydt.format('YYYYMMDD');

			gridRef.current?.clearGridData();
			({ data } = await apiPostMasterT1List(requestParams));

			const newData = data.map((item: any) => ({
				...item,
				zoneNm: getZoneNm(item),
			}));

			setGridData(newData || []);
		} else if (activeKey === '2') {
			const [fromSlipdt, toSlipdt] = requestParams.slipdt;
			requestParams.fromSlipdt = fromSlipdt.format('YYYYMMDD');
			requestParams.toSlipdt = toSlipdt.format('YYYYMMDD');
			delete requestParams.slipdt;

			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(requestParams));
			const newData = data.map((item: any) => ({
				...item,
				statusNm: getStatusNm(item),
			}));
			setGridData1(newData || []);
		}
	};

	// 검색영역 초기 세팅
	const searchBox = {
		fixdccode: '', // 물류센터
		smydt: dayjs(), // 조회일자
		slipdt: dates, // 조회일자
		storagetype: '', // 저장조건
		zone: '', // 피킹존
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
		zoneItems,
		searchMasterList,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearSortingAll();
		// 	gridRef1.current?.clearSortingAll();
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
		gridRef.current?.clearSortingAll();
		gridRef1.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
	}, [activeKey]);

	useEffect(() => {
		searchPickingZone();
	}, []);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<KpLocationCapaScanSearch {...formProps} />
			</SearchFormResponsive>

			{/* <Tabs
				activeKey={activeKey}
				onChange={key => setActiveKey(key)}
				items={tabItems}
			//tabBarStyle={{ marginBottom: 0 }} // 공간 없애기
			/> */}

			<KpLocationCapaScanDetail
				activeKey={activeKey}
				activeKeyRef={activeKeyRef}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridData1={gridData1}
				setActiveKey={setActiveKey}
			/>
		</>
	);
};

export default KpLocationCapaScan;
