/*
 ############################################################################
 # FiledataField	: OmStockReocation.tsx
 # Description		: 주문 > 주문등록 > 재고재배치조회
 # Author			: JeongHyeongCheol
 # Since			: 25.12.22
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';

// Util

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmStockReocationDetail from '@/components/om/stockReocation/OmStockReocationDetail';
import OmStockReocationSearch from '@/components/om/stockReocation/OmStockReocationSearch';

// API Call Function
import { apiStartOptimization } from '@/api/om/apiOmStockReocation';

// hooks

const OmStockReocation = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	const { VITE_APP_AXIOS_BASE_URL, VITE_ENVIRONMENT } = import.meta.env; // Axios 기본 URL, 개발 환경
	// grid data
	const [activeTabKey, setActiveTabKey] = useState('1');
	const [request, setRequest] = useState(false);

	const gridRef = useRef(null);
	const groupRef = useRef<HTMLUListElement>(null);
	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const refs6: any = useRef(null);
	const refs7: any = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterList = async () => {
		setRequest(false);
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		// 현재배치현황 currentPosition 가공
		const group1 = form.getFieldValue('currentPosition') || [];
		const currentPosition = group1.filter((item: any) => item !== 'yangsan');
		// yangsan이 포함되어 있으면 true(제외), 없으면 false(포함)
		const exceptYangsanCurrent = group1.includes('yangsan');

		// 배치요건설정 targetPosition 가공
		const group2 = form.getFieldValue('targetPosition') || [];
		const targetPosition = group2.filter((item: any) => item !== 'yangsan');
		// yangsan이 포함되어 있으면 true(제외), 없으면 false(포함)
		const exceptYangsanTarget = group2.includes('yangsan');

		// hiddenInputs 설정 (값이 있을 때만 배열 생성, 없으면 null/undefined)
		const dccode = form.getFieldValue('dccode');
		const storagetype = form.getFieldValue('storagetype');
		const capacity = form.getFieldValue('capacity');

		// dccode나 capacity 등 필수 값이 있을 때만 hiddenInputs 구성
		const hiddenInputs =
			dccode && capacity
				? [
						{
							select: `${dccode}_${storagetype}`,
							text: capacity,
						},
				  ]
				: [];

		// targetCapacity: hiddenInputs에 값이 있으면 true, 없으면 false
		const targetCapacityFlag = hiddenInputs.length > 0;

		// 가중치 설정
		const transportWeight = Number(form.getFieldValue('transportWeight'));
		const inventoryWeight = Number(form.getFieldValue('inventoryWeight'));

		if (transportWeight + inventoryWeight !== 1) {
			showMessage({
				content: '가중치 합은 1.0이 되어야합니다.',
				modalType: 'info',
			});
			return;
		}

		// if (gridRef?.current) gridRef?.current.clearGridData();

		// ai 요청 데이터
		const params = {
			aiDto: {
				jobId: dayjs().format('YYYYMMDDHHmm'),
				dateStr: form.getFieldValue('dateStr').endOf('month').format('YYYYMMDD'),
				environment: VITE_ENVIRONMENT,
				//callbackUrl: VITE_APP_AXIOS_BASE_URL + '/api/om/stockReocation/v1.0/optimization',
				filters: {
					//	selectItems: form.getFieldValue('selectItems'),
					flowLow: form.getFieldValue('flowLow'),
					flowHigh: form.getFieldValue('flowHigh'),
					transportWeight: transportWeight,
					inventoryWeight: inventoryWeight,
					currentPosition: currentPosition,
					exceptYangsanCurrent: exceptYangsanCurrent,
					targetPosition: targetPosition,
					exceptYangsanTarget: exceptYangsanTarget,
					//targetCapacity: targetCapacityFlag,
					targetCapacity: true,
					hiddenInputs: hiddenInputs,
				},
			},
		};

		try {
			await apiStartOptimization(params);
		} catch (error) {}
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '재고재배치설정',
			children: <OmStockReocationSearch form={form} groupRef={groupRef} setRequest={setRequest} />,
		},
		{
			key: '2',
			label: '실행결과',
			children: (
				<OmStockReocationDetail
					ref={gridRef}
					groupRef={groupRef}
					gridRef1={refs1}
					gridRef2={refs2}
					gridRef3={refs3}
					gridRef4={refs4}
					gridRef5={refs5}
					gridRef6={refs6}
					gridRef7={refs7}
					// searchVal={form.getFieldValue('selectItems')}
				/>
			),
		},
	];
	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		// searchYn: searchMasterList, // 조회
	};

	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
		} else if (key === '2') {
			setActiveTabKey('2');
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (request) {
			searchMasterList();
		}
	}, [request]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="h100" />
		</>
	);
};
export default OmStockReocation;
