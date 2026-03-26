/*
 ############################################################################
 # FiledataField	: KpCenterDayState.tsx
 # Description		: 지표 > 센터 운영 > 출고 유형별 물동 현황
 # Author			: KimDongHan
 # Since			: 2025.09.03
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
import { apiPostMasterT1List, apiPostMasterT2List, apiPostMasterT3List } from '@/api/kp/apiKpCenterDayState';
import KpCenterDayStateDetail from '@/components/kp/centerDayState/KpCenterDayStateDetail';
import KpCenterDayStateSearch from '@/components/kp/centerDayState/KpCenterDayStateSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const KpCenterDayState = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	/*
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param item
	 */

	// 합계
	const getTotalNm = (item: any) => {
		if (item.course === '00') {
			// 합계
			return t('lbl.TOTAL');
		} else {
			return item.coursenm;
		}
	};

	// 소계
	const getSubTotalNm = (item: any) => {
		if (activeKey === '1' || activeKey === '2') {
			if (item.channel === '0') {
				// 소계
				return t('lbl.SUBTOTAL');
			} else {
				return item.channelnm;
			}
		} else if (activeKey === '3') {
			if (item.capacity === '0') {
				// 소계
				return t('lbl.SUBTOTAL');
			} else {
				return item.capacitynm;
			}
		}
	};

	// 지표
	const getIndicatorNm = (item: any) => {
		// 배송물동 탭
		if (activeKey === '1') {
			if (item.indicator === '01') {
				// 물동량
				return t('lbl.QUANTITY');
			} else if (item.indicator === '02') {
				// 배송처
				return t('lbl.DELIVERY_DESTINATION');
			} else if (item.indicator === '03') {
				// 배송처당 물동량
				return t('lbl.DELIVERY_DESTINATION_BY_QUANTITY');
			} else {
				return item.indicator;
			}
		}

		// 배송물동 탭
		if (activeKey === '2') {
			if (item.indicator === '01') {
				// 물동량
				return t('lbl.QUANTITY');
			} else if (item.indicator === '02') {
				// 투입대수
				return t('lbl.INPUT_VEHICLE_CNT');
			} else if (item.indicator === '03') {
				// 대당 물동량
				return t('lbl.QUANTITY_PER_VEHICLE');
			} else {
				return item.indicator;
			}
		}

		// 배송차량 탭
		if (activeKey === '3') {
			if (item.indicator === '01') {
				// 투입대수
				return t('lbl.INPUT_VEHICLE_CNT');
			} else if (item.indicator === '02') {
				// 적재율
				return t('lbl.LOAD_RATE');
			} else if (item.indicator === '03') {
				// 착지생산성
				return t('lbl.DESTINATION_PRODUCTIVITY');
			} else {
				return item.indicator;
			}
		}
	};

	// 단위
	const getUomNm = (item: any) => {
		if (activeKey === '1') {
			if (item.uom === '01') {
				// KG
				return t('lbl.KG');
			} else if (item.uom === '02') {
				// 처
				return t('lbl.PORTION');
			} else if (item.uom === '03') {
				// KG/처
				return t('lbl.KG_PORTION');
			} else {
				return item.uom;
			}
		}

		if (activeKey === '2') {
			if (item.uom === '01') {
				// KG
				return t('lbl.KG');
			} else if (item.uom === '02') {
				// 대
				return t('lbl.UNIT2');
			} else if (item.uom === '03') {
				// KG/대
				return t('lbl.KG_UNIT');
			} else {
				return item.uom;
			}
		}

		if (activeKey === '3') {
			if (item.uom === '01') {
				// 대
				return t('lbl.UNIT2');
			} else if (item.uom === '02') {
				// &
				return t('lbl.PERCENT');
			} else if (item.uom === '03') {
				// 처/대
				return t('lbl.PORTION_PER_UNIT');
			} else {
				return item.uom;
			}
		}
	};

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
			const newData = data.map((item: any) => ({
				...item,
				coursenm: getTotalNm(item),
				channelnm: getSubTotalNm(item),
				indicator: getIndicatorNm(item),
				uom: getUomNm(item),
			}));
			setGridData(newData || []);
		} else if (activeKey === '2') {
			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(requestParams));
			const newData = data.map((item: any) => ({
				...item,
				coursenm: getTotalNm(item),
				channelnm: getSubTotalNm(item),
				indicator: getIndicatorNm(item),
				uom: getUomNm(item),
			}));
			setGridData1(newData || []);
		} else if (activeKey === '3') {
			gridRef2.current?.clearGridData();
			({ data } = await apiPostMasterT3List(requestParams));
			const newData = data.map((item: any) => ({
				...item,
				coursenm: getTotalNm(item),
				capacitynm: getSubTotalNm(item),
				indicator: getIndicatorNm(item),
				uom: getUomNm(item),
			}));
			setGridData2(newData || []);
		}
	};

	// 검색영역 초기 세팅
	const searchBox = {
		dccode: '',
		docdt: dayjs(), // 조회일자
		course: '', // 경로
		channel: '', // 저장유무
		contracttype: '', // 차량종류
		carcapacity: '', // 차량톤수
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
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<KpCenterDayStateSearch {...formProps} />
			</SearchFormResponsive>

			{/* <Tabs
				activeKey={activeKey}
				onChange={key => setActiveKey(key)}
				items={tabItems}
			//tabBarStyle={{ marginBottom: 0 }} // 공간 없애기
			/> */}

			<KpCenterDayStateDetail
				activeKey={activeKey}
				activeKeyRef={activeKeyRef}
				setActiveKey={setActiveKey}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridData={gridData}
				gridData1={gridData1}
				gridData2={gridData2}
			/>
		</>
	);
};

export default KpCenterDayState;
