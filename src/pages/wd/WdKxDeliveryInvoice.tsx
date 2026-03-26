/*
 ############################################################################
 # FiledataField	: WdKxDeliveryInvoice.tsx
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인)
 # Author					: 
 # Since					: 2025.12.22.
 ############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import WdKxDeliveryInvoiceSearch from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoiceSearch';

import WdKxDeliveryInvoiceDetail1 from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoiceDetail1';
import WdKxDeliveryInvoiceDetail2 from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoiceDetail2';
import WdKxDeliveryInvoiceDetail5 from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoiceDetail5';

// Util
import dayjs from 'dayjs';

// Store

// API
import {
	apiGetMasterList5,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostMasterT2List,
} from '@/api/wd/apiKxDeliveryInvoice';
import WdKxDeliveryInvoiceDetail6 from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoiceDetail6';

// Hooks

// type

// asset

const WdKxDeliveryInvoice = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const refs6: any = useRef(null);

	// antd Form 사용
	const [gridForm] = Form.useForm();

	// grid data
	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [gridData4, setGridData4] = useState([]);
	const [totalCnt4, setTotalCnt4] = useState(0);
	const [gridData5, setGridData5] = useState([]);
	const [totalCnt5, setTotalCnt5] = useState(0);
	const [gridData6, setGridData6] = useState([]);
	const [totalCnt6, setTotalCnt6] = useState(0);

	// 탭 key
	const [activeKeyMaster, setactiveKeyMaster] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		reqDate: dayjs(), // 요청일자
		exceptReasonCd: '', // 제외사유
		docno: '', // 주문고유번호
		invoiceno: '', // 운송장번호
		ordertype: '', // 접수구분
		deliverySvcTypeTab: '', // 배송서비스구분
		rcptHourType: '', // 접수시간대
		sku: '', // 상품
		storagetype5: '', // 저장조건
		boxnm5: '', // 박스명
		useYn5: 'Y', // 사용여부
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * Tab click handler
	 * @param key
	 */
	const handleTabClick = (key: string) => {
		setactiveKeyMaster(key); // 현재 tab key 설정

		if (key === '1') {
			if (refs.gridRef?.current) {
				refs.gridRef?.current?.resize('100%', '100%');
			}
			if (refs.gridRef2?.current) {
				refs.gridRef2?.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			if (refs2.gridRef?.current) {
				refs2.gridRef?.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			if (refs3.gridRef?.current) {
				refs3.gridRef?.current?.resize('100%', '100%');
			}
		} else if (key === '4') {
			if (refs4?.current) {
				refs4?.current?.resize('100%', '100%');
			}
		} else if (key === '5') {
			if (refs5?.current) {
				refs5?.current?.resize('100%', '100%');
			}
		} else if (key === '6') {
			if (refs6?.current) {
				refs6?.current?.resize('100%', '100%');
			}
		}

		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		const commonParams = {
			...form.getFieldsValue(),
			//status: form.getFieldValue('status')?.join(',') ?? '', // 상태
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일 // 임시용
			fixdccode: '2900', // TODO임시용
		};

		// 주문
		if (activeKeyMaster === '1') {
			refs.gridRef.current.clearGridData();
			const params = {
				...commonParams,
				usePgm: storeUtil.getMenuInfo().progCd,
			};
			searchMasterListImp01(params);
			//
			//
			//
			// N배송
		} else if (activeKeyMaster === '2') {
			const params = {
				...commonParams,
				deliverySvcTypeTab: '03', // N배송 -> 배송서비스구분 - 01:일반,02:반품,03:N배송
			};
			searchMasterListImp02(params);
			//
			//
			//
			// 일반
		} else if (activeKeyMaster === '3') {
			const params = {
				...commonParams,
				deliverySvcTypeTab: '01', // 일반배송 -> 배송서비스구분 - 01:일반,02:반품,03:N배송
			};
			searchMasterListImp03(params);
			//
			//
			//
			// 반품
		} else if (activeKeyMaster === '4') {
			const params = {
				...commonParams,
				deliverySvcTypeTab: '02', // 배송서비스구분 - 01:일반,02:반품,03:N배송
			};
			searchMasterListImp04(params);
			//
			//
			//
			// 택배기준
		} else if (activeKeyMaster === '5') {
			const params = {
				storagetype: form.getFieldValue('storagetype5'),
				boxnm: form.getFieldValue('boxnm5'),
				useYn: form.getFieldValue('useYn5'),
			};

			apiGetMasterList5(params).then(res => {
				setGridData5(res.data);
				setTotalCnt5(res.data.length);
			});
		} else if (activeKeyMaster === '6') {
			const params = {
				...commonParams,
				// 기준정보
				dccode: form.getFieldValue('fixdccode'),
				usePgm: storeUtil.getMenuInfo().progCd,
			};

			searchMasterListImp06(params);
		}
	};

	/**
	 * 조회 구현 함수 - 주문
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp01 = (params: any) => {
		apiPostMasterList(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수 - N배송
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp02 = (params: any) => {
		apiPostMasterList2(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수 - 일반
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp03 = (params: any) => {
		apiPostMasterList2(params).then(res => {
			setGridData3(res.data);
			setTotalCnt3(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수 - 반품
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp04 = (params: any) => {
		apiPostMasterList2(params).then(res => {
			setGridData4(res.data);
			setTotalCnt4(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수 - 반품
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp06 = (params: any) => {
		apiPostMasterT2List(params).then(res => {
			setGridData6(res.data);
			setTotalCnt6(res.data.length);
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * 모든 그리드 데이터 초기화 (조건 변경 시 사용)
	 */
	const clearAllGridData = () => {
		// refs.gridRef.current?.clearGridData();
		// // 상태도 초기화
		// setGridData([]);
		// setTotalCnt(0);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 공통 props 객체
	const commonProps = {
		form: form,
		activeKey: activeKeyMaster,
		search: searchMasterList,
		clearAllGridData, // 모든 그리드 데이터 초기화 함수
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdKxDeliveryInvoiceSearch {...commonProps} activeKeyMaster={activeKeyMaster} />
			</SearchFormResponsive>

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<Tabs defaultActiveKey="1" onTabClick={handleTabClick} className="contain-wrap">
				<Tabs.TabPane tab={t('lbl.ORDER_COUNT')} key="1">
					{/*1.주문*/}
					<WdKxDeliveryInvoiceDetail1 {...commonProps} ref={refs} data={gridData1} totalCnt={totalCnt1} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={t('lbl.DLV_DV_NEXT')} key="2">
					{/*2.N배송*/}
					<WdKxDeliveryInvoiceDetail2
						{...commonProps}
						ref={refs2}
						data={gridData2}
						totalCnt={totalCnt2}
						deliverySvcTypeTab="03" // 배송서비스구분 - 01:일반,02:반품,03:N배송
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={t('lbl.DLV_DV_STD')} key="3">
					{/*3.일반택배*/}
					<WdKxDeliveryInvoiceDetail2
						{...commonProps}
						ref={refs3}
						data={gridData3}
						totalCnt={totalCnt3}
						deliverySvcTypeTab="01" // 배송서비스구분 - 01:일반,02:반품,03:N배송
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={t('lbl.DLV_DV_RT')} key="4">
					{/*4.반품택배*/}
					<WdKxDeliveryInvoiceDetail2
						{...commonProps}
						ref={refs4}
						data={gridData4}
						totalCnt={totalCnt4}
						deliverySvcTypeTab="02" // 배송서비스구분 - 01:일반,02:반품,03:N배송
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={t('lbl.DLV_DV_BASE')} key="5">
					{/*5.택배기준*/}
					<WdKxDeliveryInvoiceDetail5 {...commonProps} ref={refs5} data={gridData5} totalCnt={totalCnt5} />
				</Tabs.TabPane>
				{/*6.정열기준정보*/}
				{
					<Tabs.TabPane tab={t('lbl.SEQ_STD_INFO')} key="6">
						<WdKxDeliveryInvoiceDetail6 {...commonProps} ref={refs6} data={gridData6} totalCnt={totalCnt6} />
					</Tabs.TabPane>
				}
			</Tabs>
		</>
	);
};

export default WdKxDeliveryInvoice;
