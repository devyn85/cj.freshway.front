/*
 ############################################################################
 # FiledataField	: WdDeliveryLabel.tsx
 # Description		: 배송라벨출력
 # Author			: 공두경
 # Since			: 25.11.15
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList } from '@/api/wd/apiWdDeliveryLabel';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDeliveryLabelSearch from '@/components/wd/deliveryLabel/WdDeliveryLabelSearch';
import WdDeliveryLabelTap1Detail from '@/components/wd/deliveryLabel/WdDeliveryLabelTap1Detail';
import WdDeliveryLabelTap3Detail from '@/components/wd/deliveryLabel/WdDeliveryLabelTap3Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import { apiPostMasterT2List } from '@/api/wd/apiWdDeliveryLabelForce';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
import TabsArray from '@/components/common/TabsArray';
import dayjs from 'dayjs';
const WdDeliveryLabel = () => {
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);

	const comboDccode = Form.useWatch('fixdccode', form);
	const comboPrintOrder = Form.useWatch('printOrder', form);

	const [printOrderList, setPrintOrderList] = useState([]);
	const [orgPrintOrderList, setOrgPrintOrderList] = useState([]);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		pickingMethod: null,
		ordertype: null,
		skugroup: null,
		crossDc: null,
		printmethod: 'NEW',
		crossdocktype: null,
		reporttype: '0',
		storagetype: null,
		distancetype: null,
	});

	const searchMasterList = () => {
		let params = form.getFieldsValue();

		if (activeKeyMaster === '1') {
			if (commUtil.isNull(params.searchDate)) {
				showAlert('', '출고일자를 선택해주세요.');
				return;
			}
			params.slipdt = params.searchDate.format('YYYYMMDD');
			let checkDccode = commUtil.nvl(form.getFieldValue('checkDccode'), []);
			checkDccode = checkDccode.toString(); // 물류센터 ->	문자열 변환[1,2,3]

			params = {
				...params,
				zone: commUtil.nvl(form.getFieldValue('zone'), []).toString(),
				distancetype: commUtil.nvl(form.getFieldValue('distancetype'), []).toString(),
				checkDccode: checkDccode,
			};

			// 조회생성(일반)
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 진행현황
		} else if (activeKeyMaster === '3') {
			// 기준정보
			params.dccode = params.fixdccode;
			params.usePgm = storeUtil.getMenuInfo().progCd;

			apiPostMasterT2List(params).then(res => {
				setGridData3(res.data);
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const [dates, setDates] = useState(dayjs());
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef?.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
			if (refs.gridRef2?.current) {
				refs.gridRef2.current?.resize('100%', '100%');
			}
			form.setFieldValue('searchDate', dates);
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef?.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveKeyMaster('3');
			if (refs3.gridRef?.current) {
				refs3.gridRef.current?.resize('100%', '100%');
			}
			const params = form.getFieldsValue();
			setDates(params.searchDate);
		}
		return;
	};

	const searchPrintOrder = async () => {
		const params = {
			dccode: comboDccode,
			usePgm: storeUtil.getMenuInfo().progCd,
		};

		const printOrderList = await apiPostMasterT2List(params);

		setOrgPrintOrderList(printOrderList.data || []);

		const printOrderMap = printOrderList.data.map((item: any) => ({
			comCd: item.prtNm,
			cdNm: item.prtNm,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		if (printOrderMap.length > 0) {
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }, ...printOrderMap]);
		} else {
			// If nothing returned, keep only the default option
			setPrintOrderList([{ comCd: '', cdNm: t('lbl.SELECT') }]);
		}
	};

	const gridSort = async () => {
		// 폼에서 선택된 printOrder 값 가져오기
		const printOrder = form.getFieldValue('printOrder');

		if (!printOrder) {
			refs.gridRef.current.clearSortingAll();
			return;
		}

		const selected = orgPrintOrderList.find((item: any) => item.prtNm === printOrder) || {};

		// 정렬 정보 배열을 준비
		const sortingInfo: { dataField: string; sortType: number }[] = [];

		// prdOrd1..prdOrd8 및 seq1..seq8 순회
		for (let i = 1; i <= 8; i++) {
			const prdKey = `prdOrd${i}`; // ex: prdOrd1
			const seqKey = `seq${i}`; // ex: seq1

			let prdVal = selected[prdKey];
			const seqVal = selected[seqKey];

			// prdVal 값이 없으면 건너뜀
			if (prdVal == null) continue;
			prdVal = String(prdVal).trim();
			if (!prdVal) continue;

			// 그리드 컬럼명(camelCase)으로 변환 (toCamelCase 헬퍼 재사용)
			const dataField = toCamelCase(prdVal);

			// seqVal 정규화:
			// - 값은 항상 'ASC' 또는 'DESC' 라고 가정
			// - 'ASC' => 1, 'DESC' => -1
			const sortType = String(seqVal).trim().toUpperCase() === 'DESC' ? -1 : 1;

			// 정렬정보 추가
			sortingInfo.push({ dataField, sortType });
		}

		// 그리드에 정렬 적용 (정렬 정보가 없으면 정렬 해제)
		if (gridData.length > 0) {
			if (sortingInfo.length > 0) {
				refs.gridRef.current.setSorting(sortingInfo);
				// 선택을 첫 셀로 이동 (선택사항)
				refs.gridRef.current.setSelectionByIndex(0, 0);
			} else {
				refs.gridRef.current.clearSortingAll();
			}
		}
	};

	const toCamelCase = (input: any) => {
		if (input == null) return '';
		const s = String(input).trim();
		if (!s) return '';
		// If there are no separators and it already looks like camelCase, return as-is
		if (!/[_\-\s]/.test(s) && /[a-z]/.test(s[0])) return s;
		const parts = s.toLowerCase().split(/[_\-\s]+/);
		return parts.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('');
	};

	useEffect(() => {
		if (activeKeyMaster === '1') {
			if (comboDccode) {
				searchPrintOrder();
			}
		}
	}, [comboDccode]);

	useEffect(() => {
		if (comboPrintOrder) {
			// gridSort가 async 이므로 에러를 잡아 로그로 남김
			gridSort().catch(err => {
				return;
			});
		} else {
			if (refs2?.gridRef?.current) {
				refs2.gridRef.current?.clearSortingAll();
			}
		}
	}, [comboPrintOrder]);

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '분류표출력',
			children: (
				<WdDeliveryLabelTap1Detail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '3',
			label: '기준정보',
			children: (
				<WdDeliveryLabelTap3Detail
					gridRef1={refs3}
					form={form}
					gridData1={gridData3}
					searchMasterList={searchMasterList}
				/>
			),
		},
	];
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdDeliveryLabelSearch
					ref={refs}
					search={searchMasterList}
					form={form}
					dates={dates}
					setDates={setDates}
					activeKey={activeKeyMaster}
					printOrderList={printOrderList}
				/>
			</SearchFormResponsive>
			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default WdDeliveryLabel;
