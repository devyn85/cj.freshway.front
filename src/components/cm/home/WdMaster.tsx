/*
 ############################################################################
 # FiledataField	: CmCode.tsx
 # Description		: 코드마스터 
 # Author			: JangGwangSeok
 # Since			: 25.04.30
 ############################################################################
 */

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

// API Call Function
// Store
import { apiGetDetailList } from '@/api/om/apiOmClose';
import { apiPostMainMasterList } from '@/api/wd/apiWdInplan';
import WdMasterDetail from '@/components/cm/home/WdMasterDetail';
import WdMasterSearch from '@/components/cm/home/WdMasterSearch';
import { useAppSelector } from '@/store/core/coreHook';
import dayjs from 'dayjs';
import styled from 'styled-components';

const WdMaster = ({ isActive }: { isActive: boolean }) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const userColorMap: any = {
		gcUser0: '#fff',
		gcUser1: '#e7ebf1',
		gcUser2: '#f4f5f9',
		gcUser3: '#879fe7',
		gcUser4: '#b3b3b3',
		gcUser5: '#555',
		gcUser6: '#38424e',
		gcUser7: '#cccecd',
		gcUser8: '#384053',
		gcUser9: '#333333',
		gcUser10: '#c2e9ff',
		gcUser11: '#ced8f2',
		gcUser12: '#ffedc6',
		gcUser13: '#c6cdff',
		gcUser14: '#f0f0f0',
		gcUser15: '#030303',
		gcUser16: '#323232',
		gcUser17: '#3f5f7f',
		gcUser18: '#313131',
		gcUser19: '#2f3130',
		gcUser20: '#35302d',
		gcUser21: '#737373',
		gcUser22: '#02497f',
		gcUser23: '#c8c9cd',
		gcUser24: '#3a3a3a',
		gcUser25: '#6288ca',
		gcUser26: '#b6ccd7',
		gcUser27: '#d8e7ef',
		gcUser28: '#223d6f',
		gcUser29: '#e8f0da',
		gcUser30: '#fff',
		gcUser31: '#8199ab',
		gcUser32: '#ffa200',
		gcUser33: '#f5f2c7',
		gcUser34: '#303030',
		gcUser35: '#f4f4f4',
		gcUser36: '#fff7dc',
		gcUser37: '#eee',
		gcUser38: '#707070',
		gcUser39: '#a6c4e6',
		gcUser40: '#e3e3e3',
		gcUser41: '#cc3300',
		gcUser42: '#f0ffae',
		gcUser43: '#364252',
		gcUser44: '#92b7d2',
		gcUser45: '#f5f5f5',
		gcUser46: '#b3b3b3',
		gcUser47: '#f4e9dd',
		gcUser48: '#01659e',
		gcUser49: '#1478ae',
		gcUser50: '#989898',
		gcUser51: '#f4fb00',
		gcUser52: '#807f7f',
		gcUser53: '#f1f4ff',
		gcUser54: '#1ad002',
		gcUser55: '#d80000',
		gcUser56: '#055fb5',
		gcUser57: '#ffc19e',
		gcUser58: '#e2e3e5',
		/*
		* 색상전달드립니다!
		1. 물동량 꺽은선 그래프 : #007651
		2. 라벨수 꺽은선 그래프 : #F44336
		3. 저장물동량 막대 그래프 : #4FC3F7
		4. 일배물동량 막대 그래프 : #FF6961
 */
		color1: '#4FC3F7',
		color2: '#FF6961',
		color3: '#007651',
		color4: '#F44336',
	};

	// Antd Form 사용
	const [form] = Form.useForm();

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	const searchBox = {
		slipdt: [dayjs().add(-5, 'day'), dayjs().add(1, 'day')],
	};

	// grid data
	const prevValue = useRef(null);
	const [isFirst, setFirst] = useState(true);
	const [gridData, setGridData] = useState([]);
	const [labels, setLabels] = useState([]);
	const [chartData, setChartData] = useState<any>({
		labels: [],
		datasets: [
			{
				label: '',
				data: [],
			},
		],
	});
	const [totalCnt, setTotalCnt] = useState(0);

	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 신규 마스터 정보 조회
	 * @returns {void}
	 */
	const searchMasterList = async () => {
		if (!initialized) return false;
		if (!isActive) return false;

		const requestParams = form.getFieldsValue();

		if (!requestParams.fixdccode) {
			return false;
		}

		//keep-alive 무시 처리
		if (JSON.stringify(prevValue.current) === JSON.stringify(requestParams)) {
			return;
		}

		prevValue.current = requestParams;

		const calcRequestParams = { ...requestParams };
		const [slipdtFrom, slipdtTo] = calcRequestParams.slipdt;
		calcRequestParams.fromSlipdt = slipdtFrom.format('YYYYMMDD');
		calcRequestParams.toSlipdt = slipdtTo.format('YYYYMMDD');
		delete calcRequestParams.slipdt;

		const { data } = await apiPostMainMasterList(calcRequestParams);
		//빈날짜 채우기
		const diffDays = slipdtTo.diff(slipdtFrom, 'day') + 1;
		const dateSet = new Set(data.map((el: any) => el.deliverydate));
		for (let i = 0; i < diffDays; i++) {
			const findDate = slipdtFrom.add(i, 'day').format('YYYYMMDD');
			if (!dateSet.has(findDate)) {
				data.push({
					deliverydate: findDate,
					cnt1: 0,
					cnt2: 0,
					cnt3: 0,
					cnt4: 0,
				});
			}
		}
		data.sort((a: any, b: any) => a.deliverydate.localeCompare(b.deliverydate));
		const labelsTemp = data?.map((el: any) => el.deliverydate) || [];
		//마지막날짜 디테일 조회
		if (labelsTemp.length > 0) {
			searchDetailList(labelsTemp[labelsTemp.length - 1]);
		}

		setLabels(labelsTemp);
		setChartData({
			labels: labelsTemp.map((el: any) => dayjs(el, 'YYYYMMDD').locale('ko').format('YYYY-MM-DD(ddd)')),
			datasets: [
				{
					type: 'bar',
					label: '저장출고물량',
					data: data?.map((el: any) => el.cnt1) || [],
					backgroundColor: userColorMap['color1'],
					order: 3,
				},
				{
					type: 'bar',
					label: '일배출고물량',
					data: data?.map((el: any) => el.cnt2) || [],
					backgroundColor: userColorMap['color2'],
					order: 4,
				},
				{
					type: 'line',
					label: '주문물량',
					data: data?.map((el: any) => el.cnt3) || [],
					fill: false,
					borderColor: userColorMap['color3'],
					backgroundColor: userColorMap['color3'],
					order: 1,
				},
				{
					type: 'line',
					label: '라벨건수',
					data: data?.map((el: any) => el.cnt4) || [],
					fill: false,
					borderColor: userColorMap['color4'],
					backgroundColor: userColorMap['color4'],
					order: 2,
				},
			],
		});
	};
	const searchDetailList = async (dt: string) => {
		const formData = form.getFieldsValue();
		if (!initialized) return false;
		if (!formData.fixdccode) {
			return false;
		}
		const params = {
			dcCode: formData.fixdccode,
			deliveryDt: dt,
			docType: 'WD',
			workProcessCode: 'SO',
		};
		const { data } = await apiGetDetailList(params);
		setGridData(data);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (isFirst && isActive && initialized) {
			searchMasterList();
			setFirst(false);
		}
	}, [isActive, initialized]);

	// 2. 브라우저 리사이즈 대응 (디바운싱 적용)
	useEffect(() => {
		//
	}, [isActive]);

	return (
		<Wrap>
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdMasterSearch form={form} search={searchMasterList} />
			</SearchFormResponsive>
			{/* 화면 상세 영역 정의 */}
			<WdMasterDetail
				isActive={isActive}
				ref={refs}
				data={gridData}
				chartData={chartData}
				labels={labels}
				form={form}
				searchDetailList={searchDetailList}
			/>
		</Wrap>
	);
};

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export default WdMaster;
