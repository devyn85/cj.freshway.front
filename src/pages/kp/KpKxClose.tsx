/*
 ############################################################################
 # FiledataField	: KpKxClose.tsx
 # Description		: KX마감진행 현황
 # Author			: 
 # Since			: 
 ############################################################################
*/
// lib

import { Form, Tabs } from 'antd';
// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// store
// API Call Function
import {
	apiDataIfStatusList,
	apiGetDataNotRcvList,
	apiGetKxAjRequestList,
	apiGetKxCdiiList,
	apiGetKxCheckList,
	apiGetKxCloseList,
	apiGetKxCloseListIF,
	apiGetKxDocList,
	apiGetKxInoutListForSku,
	apiGetKxRPList,
	apiGetKxStDiffList,
	apiGetKxStockList,
	apiGetKxSubulMonthList,
} from '@/api/kp/apiKpKxClose';

// util
import TabsArray from '@/components/common/TabsArray';
import KpKxCloseT01Detail from '@/components/kp/kxClose/KpKxCloseT01Detail';
import KpKxCloseT01Search from '@/components/kp/kxClose/KpKxCloseT01Search';
import KpKxCloseT02Detail from '@/components/kp/kxClose/KpKxCloseT02Detail';
import KpKxCloseT02Search from '@/components/kp/kxClose/KpKxCloseT02Search';
import KpKxCloseT03Detail from '@/components/kp/kxClose/KpKxCloseT03Detail';
import KpKxCloseT03Search from '@/components/kp/kxClose/KpKxCloseT03Search';
import KpKxCloseT04Detail from '@/components/kp/kxClose/KpKxCloseT04Detail';
import KpKxCloseT04Search from '@/components/kp/kxClose/KpKxCloseT04Search';
import KpKxCloseT05Detail from '@/components/kp/kxClose/KpKxCloseT05Detail';
import KpKxCloseT05Search from '@/components/kp/kxClose/KpKxCloseT05Search';
import KpKxCloseT06Detail from '@/components/kp/kxClose/KpKxCloseT06Detail';
import KpKxCloseT06Search from '@/components/kp/kxClose/KpKxCloseT06Search';
import KpKxCloseT07Detail from '@/components/kp/kxClose/KpKxCloseT07Detail';
import KpKxCloseT07Search from '@/components/kp/kxClose/KpKxCloseT07Search';
import KpKxCloseT08Detail from '@/components/kp/kxClose/KpKxCloseT08Detail';
import KpKxCloseT08Search from '@/components/kp/kxClose/KpKxCloseT08Search';
import KpKxCloseT09Detail from '@/components/kp/kxClose/KpKxCloseT09Detail';
import KpKxCloseT10Detail from '@/components/kp/kxClose/KpKxCloseT10Detail';
import KpKxCloseT10Search from '@/components/kp/kxClose/KpKxCloseT10Search';
import KpKxCloseT11Detail from '@/components/kp/kxClose/KpKxCloseT11Detail';
import KpKxCloseT11Search from '@/components/kp/kxClose/KpKxCloseT11Search';
import KpKxCloseT13Detail from '@/components/kp/kxClose/KpKxCloseT13Detail';
import KpKxCloseT13Search from '@/components/kp/kxClose/KpKxCloseT13Search';
import KpKxCloseT14Detail from '@/components/kp/kxClose/KpKxCloseT14Detail';
import KpKxCloseT14Search from '@/components/kp/kxClose/KpKxCloseT14Search';
import KpKxCloseT15Detail from '@/components/kp/kxClose/KpKxCloseT15Detail';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

// hook

// type

// asset
const KpKxClose = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();
	const [form8] = Form.useForm();
	const [form3] = Form.useForm();
	const [form4] = Form.useForm();
	const [form5] = Form.useForm();
	const [gridData8, setGridData8] = useState([]);
	const [gridData8Filtered, setGridData8Filtered] = useState([]);
	const [totalCnt8, setTotalCnt8] = useState(0);
	const [form6] = Form.useForm();
	const [form7] = Form.useForm();
	const [form10] = Form.useForm();
	const [form11] = Form.useForm();
	const [form13] = Form.useForm();
	const [form14] = Form.useForm();
	const [form15] = Form.useForm();

	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [dataList, setDataList] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [originData4, setOriginData4] = useState([]);
	const [totalCnt4, setTotalCnt4] = useState(0);
	const [gridData5, setGridData5] = useState([]);
	const [totalCnt5, setTotalCnt5] = useState(0);
	const [gridData6, setGridData6] = useState([]);
	const [totalCnt6, setTotalCnt6] = useState(0);
	const [gridData7, setGridData7] = useState([]);
	const [totalCnt7, setTotalCnt7] = useState(0);
	const [gridData10, setGridData10] = useState([]);
	const [totalCnt10, setTotalCnt10] = useState(0);
	const [gridData11, setGridData11] = useState([]);
	const [totalCnt11, setTotalCnt11] = useState(0);
	const [gridData13, setGridData13] = useState([]);
	const [totalCnt13, setTotalCnt13] = useState(0);
	const [gridData14, setGridData14] = useState([]);
	const [totalCnt14, setTotalCnt14] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox1] = useState({
		deliveryDate: dayjs(), // 실행일자
	});
	const [searchBox2] = useState({
		basedtRange: [dayjs().startOf('month'), dayjs()], // 기준일
	});
	const [searchBox8] = useState({
		deliveryDateRange: [dayjs().startOf('month'), dayjs()], // 배송일자
	});
	const [searchBox10] = useState({
		fixdccode: '1000', // 센터코드
	});
	const [searchBox14] = useState({
		ifDateRange: [dayjs().subtract(3, 'day'), dayjs()], // I/F 일자 (시작일 3일 전)
	});

	// Declare react Ref(2/4)
	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const refs6: any = useRef(null);
	const refs7: any = useRef(null);
	const refs8: any = useRef(null);
	const refs9: any = useRef(null);
	const refs10: any = useRef(null);
	const refs11: any = useRef(null);
	const refs13: any = useRef(null);
	const refs14: any = useRef(null);

	const [activeTabKey, setActiveTabKey] = useState('1');
	const [selectedEvent, setSelectedEvent] = useState<any>(null); // 문서내역 탭으로 전달할 이벤트 데이터
	const [searchBox3, setSearchBox3] = useState({ docno: '' });

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 탭1 - 마감현황 조회
	const searchMaterList1 = async () => {
		refs1.gridRefDoc.current?.clearGridData();
		refs1.gridRefIF.current?.clearGridData();
		refs1.gridRefDocDtl.current?.clearGridData();
		refs1.gridRefIFDtl.current?.clearGridData();

		if (refs1.gridRefDoc.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}
		const params = form1.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');

		apiGetKxCloseList(params).then(res => {
			const newData = res.data.map((item: any) => ({
				...item,
				status: item.TRate === '100' ? '완료' : '진행중',
			}));
			setGridData1(newData);
			setTotalCnt1(newData.length);
		});

		if (params.ifSearchYn === '1') {
			apiGetKxCloseListIF(params).then(res => {
				const newData = res.data.map((item: any) => ({
					...item,
					status: item.TRate === '100' ? '완료' : '진행중',
				}));
				refs1.gridRefIF.current?.setGridData(newData);
				setDataList(newData);
			});
		}
	};

	// 탭2 - KX검증 조회
	const searchMaterList2 = async () => {
		refs2.gridRef.current?.clearGridData();
		const formdata = form2.getFieldsValue();
		const params = {
			...formdata,
			deliveryDateFrom: dayjs(formdata.basedtRange[0]).format('YYYYMMDD'),
			deliveryDateTo: dayjs(formdata.basedtRange[1]).format('YYYYMMDD'),
		};

		apiGetKxCheckList(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	// 탭3 - 문서내역 조회
	const searchMaterList3 = async () => {
		refs3.gridRef1?.current?.clearGridData();
		const formdata = form3.getFieldsValue();
		const params = {
			...formdata,
		};

		if (
			commUtil.isNull(params.docno) &&
			commUtil.isNull(params.slipno) &&
			commUtil.isNull(params.sourcekey) &&
			commUtil.isNull(params.pokey)
		) {
			showAlert('', '문서번호 or KX 오더번호 \n or 원주문번호 or 구매전표 중에 \n 하나는 필수 입니다.');
			return;
		}

		apiGetKxDocList(params).then(res => {
			setGridData3(res.data);
			setTotalCnt3(res.data.length);

			// [FWNEXTWMS-8092] 문서내역 DATA가 없어도 IF내역 DATA 노출시켜야 함 (AS-IS와 동일하게)
			if (commUtil.isEmpty(res.data)) {
				refs3?.current?.searchDtl2(params.docno);
			}
		});
	};

	// 탭4 - 인수거절 조회
	const searchMaterList4 = async () => {
		refs4.gridRef.current?.clearGridData();
		const params = form4.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');

		apiGetKxCdiiList(params).then(res => {
			setOriginData4(res.data); // 전체 데이터 저장
			setGridData4(res.data); // 초기값은 전체 데이터
			setTotalCnt4(res.data.length);
		});
	};

	// 탭5 - 수불확인 조회
	const searchMaterList5 = async () => {
		refs5.gridRef.current?.clearGridData();

		const params = form5.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');

		const isValid = await validateForm(form5);
		if (!isValid) {
			return;
		}

		apiGetKxInoutListForSku(params).then(res => {
			setGridData5(res.data);
			setTotalCnt5(res.data.length);
		});
	};

	// 탭6 - 조정내역반영
	const searchMaterList6 = async () => {
		refs6.gridRef.current?.clearGridData();
		refs6.gridRef2.current?.clearGridData();

		const params = form6.getFieldsValue();

		const isValid = await validateForm(form6);
		if (!isValid) {
			return;
		}
		apiGetKxAjRequestList(params).then(res => {
			setGridData6(res.data);
			setTotalCnt6(res.data.length);
		});
	};
	// 탭7 - 협력사반출
	const searchMaterList7 = async () => {
		refs7.gridRef.current?.clearGridData();
		refs7.gridRef1.current?.clearGridData();

		const params = form7.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');
		const isValid = await validateForm(form7);
		if (!isValid) {
			return;
		}
		apiGetKxRPList(params).then(res => {
			setGridData7(res.data);
			setTotalCnt7(res.data.length);
		});
	};
	// 탭8 - 실적미수신
	/**
	 * 필터링 로직:
	 * 체크박스 선택 상태에 따라 DOCTYPE 필터링 적용
	 * 예시:
	 * - stoWdYn 체크 해제 → DOCTYPE!='광역출고' 필터 적용
	 * - stoDpYn 체크 해제 → DOCTYPE!='광역입고' 필터 적용
	 * - wdYn 체크 해제 → DOCTYPE!='출고' 필터 적용
	 * - dpYn 체크 해제 → DOCTYPE!='입고' 필터 적용
	 * - rtYn 체크 해제 → DOCTYPE!='반품' 필터 적용
	 * - ajYn 체크 해제 → DOCTYPE!='조정' 필터 적용
	 *필터 조건들은 AND로 연결됨
	 * 모든 체크박스가 언체크되면 필터링하지 않음 (전체 데이터 표시)
	 */
	const searchMaterList8 = async () => {
		refs8.gridRef.current?.clearGridData();
		const formdata = form8.getFieldsValue();
		const params = {
			...formdata,
			deliveryDateFrom: dayjs(formdata.deliveryDateRange[0]).format('YYYYMMDD'),
			deliveryDateTo: dayjs(formdata.deliveryDateRange[1]).format('YYYYMMDD'),
		};

		apiGetDataNotRcvList(params).then(res => {
			let data = res.data;
			setGridData8(data);

			// 체크된 항목이 하나라도 있는지 확인
			const hasAnyChecked =
				formdata?.stoWdYn === '1' ||
				formdata?.stoDpYn === '1' ||
				formdata?.wdYn === '1' ||
				formdata?.dpYn === '1' ||
				formdata?.rtYn === '1' ||
				formdata?.ajYn === '1';

			// 체크된 항목이 있을 때만 필터링 적용
			if (hasAnyChecked) {
				const filters: string[] = [];
				if (formdata?.stoWdYn !== '1') {
					filters.push('광역출고');
				}
				if (formdata?.stoDpYn !== '1') {
					filters.push('광역입고');
				}
				if (formdata?.wdYn !== '1') {
					filters.push('출고');
				}
				if (formdata?.dpYn !== '1') {
					filters.push('입고');
				}
				if (formdata?.rtYn !== '1') {
					filters.push('반품');
				}
				if (formdata?.ajYn !== '1') {
					filters.push('조정');
				}

				// 제외된 DOCTYPE의 데이터 필터링
				data = data.filter((item: any) => !filters.includes(item.doctype));
			}

			setGridData8Filtered(data);
			setTotalCnt8(data.length);
		});
	};
	// 탭10 - 재고 조회
	const searchMaterList10 = async () => {
		const isValid = await validateForm(form10);
		if (!isValid) return;

		refs10.gridRef.current?.clearGridData();
		setTotalCnt10(0);

		const params = form10.getFieldsValue();

		apiGetKxStockList(params).then(res => {
			setGridData10(res.data);
			setTotalCnt10(res.data.length);
		});
	};
	// 탭11 - 수불비교 조회
	const searchMaterList11 = async () => {
		refs11.gridRef1.current?.clearGridData();
		refs11.gridRef2.current?.clearGridData();
		refs11.gridRef3.current?.clearGridData();

		const params = form11.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');

		apiGetKxSubulMonthList(params).then(res => {
			setGridData11(res.data);
			setTotalCnt11(res.data?.length);
		});
	};

	// 탭13 - 재고비교 조회
	const searchMaterList13 = async () => {
		refs13.gridRef.current?.clearGridData();

		const params = form13.getFieldsValue();
		params.deliveryDate = params.deliveryDate.format('YYYYMM');

		apiGetKxStDiffList(params).then(res => {
			setGridData13(res.data);
			setTotalCnt13(res.data.length);
		});
	};

	const searchMaterList14 = async () => {
		refs14.gridRef.current?.clearGridData();

		const formdata = form14.getFieldsValue();

		const deliveryDateFrom = commUtil.isNull(form14.getFieldValue('ifDateRange'))
			? ''
			: form14.getFieldValue('ifDateRange')[0].format('YYYYMMDD');
		const deliveryDateTo = commUtil.isNull(form14.getFieldValue('ifDateRange'))
			? ''
			: form14.getFieldValue('ifDateRange')[1].format('YYYYMMDD');

		// 날짜 범위 체크 (7일 이내)
		const dateFrom = dayjs(form14.getFieldValue('ifDateRange')[0]);
		const dateTo = dayjs(form14.getFieldValue('ifDateRange')[1]);
		const daysDiff = dateTo.diff(dateFrom, 'day');

		if (daysDiff > 7) {
			showAlert(null, '최대 7일간의 데이터만 조회 가능합니다.');
			return;
		}

		const params = {
			...formdata,
			deliveryDateFrom: deliveryDateFrom,
			deliveryDateTo: deliveryDateTo,
		};

		apiDataIfStatusList(params).then(res => {
			setGridData14(res.data);
			setTotalCnt14(res.data.length);
		});
	};

	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		switch (activeTabKey) {
			case '1':
				return searchMaterList1();
			case '2':
				return searchMaterList2();
			case '3':
				return searchMaterList3();
			case '4':
				return searchMaterList4();
			case '5':
				return searchMaterList5();
			case '6':
				return searchMaterList6();
			case '7':
				return searchMaterList7();
			case '8':
				return searchMaterList8();
			case '10':
				return searchMaterList10();
			case '11':
				return searchMaterList11();
			case '13':
				return searchMaterList13();
			case '14':
				return searchMaterList14();
			default:
				break;
		}
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// 페이지 버튼 함수 바인딩
	// const titleFunc1 = {
	// 	searchYn: () => {
	// 		switch (activeTabKey) {
	// 			case '1':
	// 				return searchMaterList1();
	// 			case '2':
	// 				return searchMaterList2();
	// 			case '3':
	// 				return searchMaterList3();
	// 			case '4':
	// 				return searchMaterList4();
	// 			case '5':
	// 				return searchMaterList5();
	// 			case '6':
	// 				return searchMaterList6();
	// 			case '7':
	// 				return searchMaterList7();
	// 			case '11':
	// 				return searchMaterList11();
	// 			case '13':
	// 				return searchMaterList13();
	// 			case '14':
	// 				return searchMaterList14();
	// 			default:
	// 				break;
	// 		}
	// 	},
	// };

	// 탭 아이템 영역
	const tabClick = (key: string) => {
		setActiveTabKey(key);
		switch (key) {
			case '1':
				refs1.gridRefDoc.current?.resize('100%', '100%');
				refs1.gridRefIF.current?.resize('100%', '100%');
				refs1.gridRefDocDtl.current?.resize('100%', '100%');
				refs1.gridRefIFDtl.current?.resize('100%', '100%');
				break;
			case '2':
				refs2.gridRef?.current?.resize('100%', '100%');
				break;
			case '3':
				refs3.gridRef1?.current?.resize('100%', '100%');
				refs3.gridRef2?.current?.resize('100%', '100%');
				break;
			case '4':
				refs4.gridRef?.current?.resize();
				break;
			case '5':
				refs5.gridRef?.current?.resize();
				break;
			case '6':
				refs6.gridRef?.current?.resize();
				refs6.gridRef2?.current?.resize();
				break;
			case '7':
				refs7.gridRef?.current?.resize();
				refs7.gridRef1?.current?.resize();
				break;
			case '8':
				refs8.gridRef?.current?.resize();
				break;
			case '9':
				refs9.gridRef?.current?.resize();
				refs9.gridRef2?.current?.resize();
				break;
			case '10':
				refs10.gridRef?.current?.resize();
				break;
			case '11':
				refs11.gridRef1?.current?.resize();
				refs11.gridRef2?.current?.resize();
				refs11.gridRef3?.current?.resize();
				break;
			case '13':
				refs13.gridRef?.current?.resize();
				break;
			case '14':
				refs14.gridRef?.current?.resize();
				break;
		}
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		if (changedValues.ifSearchYn_checkbox) {
			// 체크했을 때
			const filtered = originData4.filter(item => item.rtYn === 'N');
			setGridData4(filtered);
		} else {
			setGridData4(originData4);
		}
	};

	const handleValuesChange10 = (changedValues: any) => {
		if (changedValues?.stockidChgYn) {
			refs10.gridRef.current?.setFilter('stockId', (dataField: string, value: any, item: any) => {
				return item?.stockId !== 'STD';
			});
		} else {
			refs10.gridRef.current?.clearFilter('stockId');
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 첫 로딩시 이동하는 탭 - 문서내역탭 고정
		setActiveTabKey('3');
	}, []);

	useEffect(() => {
		if (activeTabKey === '3') {
			// 폼이 렌더링된 이후에만 값 세팅
			if (selectedEvent?.docno) {
				setSearchBox3({ docno: selectedEvent.docno });
				form3.setFieldsValue({ docno: selectedEvent.docno });
				searchMaterList3();
			} else {
				setSearchBox3({ docno: '' });
				form3.setFieldsValue({ docno: '' });
			}
		}
	}, [activeTabKey, selectedEvent]);

	// 공통 props 객체
	const commonProps = {
		search: searchMasterList,
		setGridData8Filtered,
		gridData8,
		setTotalCnt8,
	};

	// * 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '마감현황',
			children: (
				<KpKxCloseT01Detail
					ref={refs1}
					data={gridData1}
					totalCnt={totalCnt1}
					form={form1}
					dataList={dataList}
					search={searchMaterList1}
					setActiveTabKey={setActiveTabKey}
					setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '2',
			label: 'KX 검증',
			children: (
				<KpKxCloseT02Detail ref={refs2} data={gridData2} totalCnt={totalCnt2} form={form2} search={searchMaterList2} />
			),
		},
		{
			key: '3',
			label: '문서내역',
			children: (
				<KpKxCloseT03Detail
					ref={refs3}
					eventData={selectedEvent}
					data={gridData3}
					totalCnt={totalCnt3}
					form={form3}
					search={searchMaterList3}
					setActiveTabKey={setActiveTabKey}
				/>
			),
		},
		{
			key: '4',
			label: '인수거절확인',
			children: (
				<KpKxCloseT04Detail
					ref={refs4}
					data={gridData4}
					totalCnt={totalCnt4}
					form={form4}
					search={searchMaterList4}
					setActiveTabKey={setActiveTabKey}
					setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '5',
			label: '수불확인',
			children: (
				<KpKxCloseT05Detail
					ref={refs5}
					data={gridData5}
					totalCnt={totalCnt5}
					form={form5}
					search={searchMaterList5}
					setActiveTabKey={setActiveTabKey}
					setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '6',
			label: '조정내역반영',
			children: (
				<KpKxCloseT06Detail
					ref={refs6}
					data={gridData6}
					totalCnt={totalCnt6}
					form={form6}
					search={searchMaterList6}
					setActiveTabKey={setActiveTabKey}
				/>
			),
		},
		{
			key: '7',
			label: '협력사반출확인',
			children: (
				<KpKxCloseT07Detail
					ref={refs7}
					data={gridData7}
					totalCnt={totalCnt7}
					form={form7}
					search={searchMaterList7}
					setActiveTabKey={setActiveTabKey}
				/>
			),
		},
		{
			key: '8',
			label: '실적미수신',
			children: (
				<KpKxCloseT08Detail
					ref={refs8}
					data={gridData8Filtered}
					totalCnt={totalCnt8}
					form={form8}
					search={searchMaterList8}
					setActiveTabKey={setActiveTabKey}
					setSelectedEvent={setSelectedEvent}
				/>
			),
		},
		{
			key: '9',
			label: '소유권확인',
			children: <KpKxCloseT09Detail ref={refs9} setActiveTabKey={setActiveTabKey} />,
		},
		{
			key: '10',
			label: '재고조회',
			children: (
				<KpKxCloseT10Detail
					ref={refs10}
					data={gridData10}
					totalCnt={totalCnt10}
					form={form10}
					search={searchMaterList10}
					setActiveTabKey={setActiveTabKey}
				/>
			),
		},
		{
			key: '11',
			label: '수불비교',
			children: (
				<KpKxCloseT11Detail
					ref={refs11}
					data={gridData11}
					totalCnt={totalCnt11}
					form={form11}
					search={searchMaterList11}
					setActiveTabKey={setActiveTabKey}
				/>
			),
		},
		{
			key: '13',
			label: '재고비교',
			children: (
				<KpKxCloseT13Detail
					ref={refs13}
					data={gridData13}
					totalCnt={totalCnt13}
					form={form13}
					search={searchMaterList13}
				/>
			),
		},
		{
			key: '14',
			label: 'I/F관리',
			children: (
				<KpKxCloseT14Detail
					ref={refs14}
					{...commonProps}
					data={gridData14}
					totalCnt={totalCnt14}
					form={form14}
					search={searchMaterList14}
				/>
			),
		},
		{
			key: '15',
			label: '조정전표수정',
			children: <KpKxCloseT15Detail form={form15} />,
		},
	];
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{activeTabKey === '1' && (
				<SearchFormResponsive form={form1} initialValues={searchBox1}>
					<KpKxCloseT01Search {...commonProps} form={form1} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '2' && (
				<SearchFormResponsive form={form2} initialValues={searchBox2}>
					<KpKxCloseT02Search {...commonProps} form={form2} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '3' && (
				<SearchFormResponsive form={form3} initialValues={searchBox3}>
					<KpKxCloseT03Search {...commonProps} form={form3} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '4' && (
				<SearchFormResponsive form={form4} initialValues={searchBox1} onValuesChange={handleValuesChange}>
					<KpKxCloseT04Search {...commonProps} form={form4} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '5' && (
				<SearchFormResponsive form={form5} initialValues={searchBox1}>
					<KpKxCloseT05Search {...commonProps} form={form5} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '6' && (
				<SearchFormResponsive form={form6} initialValues={searchBox1}>
					<KpKxCloseT06Search {...commonProps} form={form6} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '7' && (
				<SearchFormResponsive form={form7} initialValues={searchBox1}>
					<KpKxCloseT07Search {...commonProps} form={form7} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '8' && (
				<SearchFormResponsive form={form8} initialValues={searchBox8}>
					<KpKxCloseT08Search {...commonProps} form={form8} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '10' && (
				<SearchFormResponsive form={form10} initialValues={searchBox10} onValuesChange={handleValuesChange10}>
					<KpKxCloseT10Search {...commonProps} form={form10} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '11' && (
				<SearchFormResponsive form={form11} initialValues={searchBox1}>
					<KpKxCloseT11Search {...commonProps} form={form11} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '13' && (
				<SearchFormResponsive form={form13} initialValues={searchBox1}>
					<KpKxCloseT13Search {...commonProps} form={form13} />
				</SearchFormResponsive>
			)}
			{activeTabKey === '14' && (
				<SearchFormResponsive form={form14} initialValues={searchBox14}>
					<KpKxCloseT14Search {...commonProps} form={form14} />
				</SearchFormResponsive>
			)}

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<TabsArray key="right" activeKey={activeTabKey} onChange={tabClick} items={tabs} />
		</>
	);
};

export default KpKxClose;
