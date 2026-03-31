/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSN.tsx
 # Description		: 이력배송라벨출력
 # Author			: 공두경
 # Since			: 25.10.15
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList, apiGetTab3MasterList } from '@/api/wd/apiWdDeliveryLabelSN';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDeliveryLabelSNSearch from '@/components/wd/deliveryLabelSN/WdDeliveryLabelSNSearch';
import WdDeliveryLabelSNTap1Detail from '@/components/wd/deliveryLabelSN/WdDeliveryLabelSNTap1Detail';
import WdDeliveryLabelSNTap2Detail from '@/components/wd/deliveryLabelSN/WdDeliveryLabelSNTap2Detail';
import WdDeliveryLabelSNTap3Detail from '@/components/wd/deliveryLabelSN/WdDeliveryLabelSNTap3Detail';
import WdDeliveryLabelSNTap4Detail from '@/components/wd/deliveryLabelSN/WdDeliveryLabelSNTap4Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import { apiPostMasterT2List } from '@/api/wd/apiWdDeliveryLabelForce';
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdDeliveryLabelSN = () => {
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);

	const comboDccode = Form.useWatch('fixdccode', form);
	const comboPrintOrder = Form.useWatch('printOrder', form);

	const [printOrderList, setPrintOrderList] = useState([]);
	const [orgPrintOrderList, setOrgPrintOrderList] = useState([]);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		crossDc: '',
		ordertype: null,
		skugroup: null,
		storagetype: null,
		printmethod: 'NEW',
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (activeKeyMaster !== '4') {
			if (commUtil.isNull(params.searchDate)) {
				showAlert('', '출고일자를 선택해주세요.');
				return;
			}

			params.slipdt = params.searchDate.format('YYYYMMDD');

			if (Array.isArray(params.zone) && params.zone.length > 0) {
				params.zone = params.zone.join(',');
			} else {
				params.zone = '';
			}
		}

		if (activeKeyMaster === '1') {
			// 조회생성(일반)
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 진행현황
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		} else if (activeKeyMaster === '3') {
			// 피킹작업자현황
			apiGetTab3MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		} else if (activeKeyMaster === '4') {
			// 기준정보
			params.dccode = params.fixdccode;
			params.usePgm = storeUtil.getMenuInfo().progCd;

			apiPostMasterT2List(params).then(res => {
				setGridData4(res.data);
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
			setActiveKeyMaster('1');
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
			if (refs.gridRef2.current) {
				refs.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveKeyMaster('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '4') {
			setActiveKeyMaster('4');
			if (refs4.current) {
				refs4.current?.resize('100%', '100%');
			}
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
		form.setFieldValue('printOrder', printOrderList);
		form.setFieldValue('printOrder', '');
	};

	const gridSort = async () => {
		// 폼에서 선택된 printOrder 값 가져오기
		const printOrder = form.getFieldValue('printOrder');
		if (!printOrder) {
			refs2.gridRef.current.clearSortingAll();
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
		if (gridData2.length > 0) {
			if (sortingInfo.length > 0) {
				refs2.gridRef.current.setSorting(sortingInfo);
				// 선택을 첫 셀로 이동 (선택사항)
				refs2.gridRef.current.setSelectionByIndex(0, 0);
			} else {
				refs2.gridRef.current.clearSortingAll();
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
		if (activeKeyMaster === '1' || activeKeyMaster === '2') {
			if (comboDccode) {
				searchPrintOrder();
			}
		}
	}, [comboDccode]);

	useEffect(() => {
		if (comboPrintOrder) {
			// gridSort가 async 이므로 에러를 잡아 로그로 남김
			gridSort().catch(err => {
				//
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
			label: '분류표생성',
			children: (
				<WdDeliveryLabelSNTap1Detail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '2',
			label: '분류표출력',
			children: (
				<WdDeliveryLabelSNTap2Detail
					ref={refs2}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					search={searchMasterList}
					gridSort={gridSort}
				/>
			),
		},
		{
			key: '3',
			label: '회수리스트',
			children: (
				<WdDeliveryLabelSNTap3Detail
					ref={refs3}
					form={form}
					data={gridData3}
					totalCnt={totalCnt3}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '4',
			label: '기준정보',
			children: (
				<WdDeliveryLabelSNTap4Detail
					gridRef1={refs4}
					form={form}
					gridData1={gridData4}
					searchMasterList={searchMasterList}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdDeliveryLabelSNSearch
					ref={refs}
					search={searchMasterList}
					form={form}
					activeKey={activeKeyMaster}
					printOrderList={printOrderList}
				/>
			</SearchFormResponsive>
			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default WdDeliveryLabelSN;
