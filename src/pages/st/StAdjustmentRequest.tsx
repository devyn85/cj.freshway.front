/*
 ############################################################################
 # FiledataField	: StAdjustmentRequest.tsx
 # Description		: 재고 > 재고조정 > 재고조정처리
 # Author					: JiHoPark
 # Since					: 2025.10.10.
 ############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import StAdjustmentRequestDetail1 from '@/components/st/adjustmentRequest/StAdjustmentRequestDetail1';
import StAdjustmentRequestDetail2 from '@/components/st/adjustmentRequest/StAdjustmentRequestDetail2';
import StAdjustmentRequestDetail3 from '@/components/st/adjustmentRequest/StAdjustmentRequestDetail3';
import StAdjustmentRequestDetail4 from '@/components/st/adjustmentRequest/StAdjustmentRequestDetail4';
import StAdjustmentRequestSearch from '@/components/st/adjustmentRequest/StAdjustmentRequestSearch';

// Util
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import {
	apiGetMasterList,
	apiGetMasterList3,
	apiGetMasterList4,
	apiGetZoneList,
} from '@/api/st/apiStAdjustmentRequest';

// Hooks

// type

// asset

const StAdjustmentRequest = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();
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

	// grid Ref
	const gridRefs1: any = useRef(null);
	const gridRefs2: any = useRef(null);
	const gridRefs3: any = useRef(null);
	const gridRefs4: any = useRef(null);

	// zone 목록
	const [zoneList, setZoneList] = useState([]);

	// 글로벌 변수
	const gDccode = useAppSelector(state => state.global.globalVariable.gDccode);

	// 탭 key
	const [currentTabKey, setCurrentTabKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		organize: '', // 창고
		sku: '', // 상품코드
		storagetype: '', // 저장조건
		zone: '', // 피킹존
		stocktype: '', // 재고위치
		stockgrade: '', // 재고속성
		serialno: '', // 이력번호
		convserialno: '', // B/L번호
		fromloc: '', // FROM 로케이션
		toloc: '', // TO 로케이션
		organize3: '', // 창고
		sku3: '', // 상품코드
		basedtFromTo: [dayjs().endOf('month'), dayjs().endOf('month')], // 기준일
		organize4: '', // 창고
		sku4: '', // 상품코드
		storagetype4: '', // 저장조건
		zone4: '', // 피킹존
		stocktype4: '', // 재고위치
		stockgrade4: '', // 재고속성
		serialno4: '', // 이력번호
		convserialno4: '', // B/L번호
		searchDate: 'APPRREQDT', // 구분
		searchTermDt: [dayjs(), dayjs()], // 조회기간
		apprstatus: '', // 진행상태
	});

	// 재고조정 선택적용 초기 셋팅
	const [requiredBox] = useState({
		docdt: dayjs().endOf('month'), // 결재요청일자
		processmain: '', // 물류귀책배부
		reasoncode: '', // 발생사유
		stocktranstype: '', // 이동유형
		imputetype: '12', // 귀책
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
		setCurrentTabKey(key); // 현재 tab key 설정
		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * Zone 목록 조회
	 */
	const searchZoneList = () => {
		apiGetZoneList().then(res => {
			const arrZoneList = res.data;
			arrZoneList.unshift({ cdNm: '전체', comCd: '' });
			setZoneList(arrZoneList);
		});
	};

	/**
	 *Zone 목록 filter
	 * @param filterVal
	 * @returns {Array}
	 */
	const getFilterZoneList = (filterVal: string) => {
		return zoneList.filter((item: any) => {
			if ((commUtil.isEmpty(filterVal) && item.dccode === gDccode) || commUtil.isEmpty(item.comCd)) {
				return true;
			} else {
				return item.dccode === filterVal || commUtil.isEmpty(item.comCd);
			}
		});
	};

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		const searchParam = searchForm.getFieldsValue();
		const curFixdccode = searchParam.gMultiDccode;

		if (curFixdccode === '2170') {
			return;
		}

		// 재고조정 조회
		if (currentTabKey === '1') {
			if (gridRefs1.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			// 목록 초기화
			gridRefs1.current.clearGridData();
			// 이동유형 선택으로 변경
			gridForm.setFieldValue('stocktranstype', '');

			const params = {
				...searchParam,
				fixdccode: curFixdccode,
				serialnoyn:
					commUtil.isNotEmpty(searchParam.serialno) || commUtil.isNotEmpty(searchParam.convserialno) ? 'Y' : '',
			};

			apiGetMasterList(params).then(res => {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			});
		} else if (currentTabKey === '3') {
			// 재고조정 결재 탭 조회
			// 목록 초기화
			gridRefs3.current.clearGridData();

			const params = {
				...searchParam,
				fixdccode: curFixdccode,
				organize: searchParam.organize3,
				sku: searchParam.sku3,
				basedtFrom: searchParam.basedtFromTo[0].format('YYYYMMDD'),
				basedtTo: searchParam.basedtFromTo[1].format('YYYYMMDD'),
				approvaltype: 'DDRAJ', // 유형: DDRAJ(감모), code: APPROVALTYPE
			};

			apiGetMasterList3(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		} else if (currentTabKey === '4') {
			// 재고조정 처리 탭 조회
			// 목록 초기화
			gridRefs4.current.clearGridData();

			// 조회기간
			const fromDt = searchParam.searchTermDt[0].format('YYYYMMDD');
			const toDt = searchParam.searchTermDt[1].format('YYYYMMDD');

			const params = {
				...searchParam,
				fixdccode: curFixdccode,
				organize: searchParam.organize4,
				sku: searchParam.sku4,
				storagetype: searchParam.storagetype4,
				zone: searchParam.zone4,
				stocktype: searchParam.stocktype4,
				stockgrade: searchParam.stockgrade4,
				serialno: searchParam.serialno4,
				convserialno: searchParam.convserialno4,
				fromApprreqdt: searchParam.searchDate === 'APPRREQDT' ? fromDt : '',
				toApprreqdt: searchParam.searchDate === 'APPRREQDT' ? toDt : '',
				fromSlipdt: searchParam.searchDate === 'SLIPDT' ? fromDt : '',
				toSlipdt: searchParam.searchDate === 'SLIPDT' ? toDt : '',
				apprstatus: searchParam.apprstatus,
				serialnoyn:
					commUtil.isNotEmpty(searchParam.serialno) || commUtil.isNotEmpty(searchParam.convserialno) ? 'Y' : '',
			};

			apiGetMasterList4(params).then(res => {
				setGridData4(res.data);
				setTotalCnt4(res.data.length);
			});
		}
	};

	// 요청처리결과 데이터 설정
	const handleGridData2 = (data: any) => {
		const rtnList: any[] = [];
		let nSucc = 0;
		let nFail = 0;

		for (const objData of data) {
			if (objData.processflag === 'Y') {
				nSucc++;
			} else {
				nFail++;
			}

			rtnList.push(objData);
		}

		// 성공 : {{0}}건 실패 : {{1}}건 처리되었습니다. 결과탭으로 이동합니다.
		showAlert('', t('msg.MSG_COM_VAL_212', [nSucc, nFail]), () => {
			gridRefs1.current.clearGridData();

			setGridData2(rtnList);
			setTotalCnt2(rtnList.length);

			setCurrentTabKey('2');
			window.dispatchEvent(new Event('resize'));
		});
	};

	/**
	 * 탭 목록
	 * @param key
	 */
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.REQUEST_AJ'), // 재고조정 요청
			children: (
				<StAdjustmentRequestDetail1
					ref={gridRefs1}
					form={gridForm}
					data={gridData1}
					totalCnt={totalCnt1}
					initialValues={requiredBox}
					dccode={searchForm.getFieldValue('gMultiDccode')}
					searchHandler={searchMasterList}
					handleGridData2={handleGridData2}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.REQ_PROCESSFLAG'), // 요청처리결과
			children: <StAdjustmentRequestDetail2 ref={gridRefs2} data={gridData2} totalCnt={totalCnt2} />,
		},
		{
			key: '3',
			label: t('lbl.APPROVAL_AJ'), // 재고조정 결재
			children: (
				<StAdjustmentRequestDetail3
					ref={gridRefs3}
					data={gridData3}
					totalCnt={totalCnt3}
					gDccode={gDccode}
					searchHandler={searchMasterList}
				/>
			),
		},
		{
			key: '4',
			label: t('lbl.PROCESS_AJ'), // 재고조정 처리
			children: (
				<StAdjustmentRequestDetail4
					ref={gridRefs4}
					data={gridData4}
					totalCnt={totalCnt4}
					searchHandler={searchMasterList}
				/>
			),
		},
	];

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		// 존 목록 조회
		searchZoneList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} isShowMenuAuthButton={currentTabKey !== '2'} />

			{/* 검색 영역 정의 */}
			{currentTabKey !== '2' && (
				<SearchFormResponsive form={searchForm} initialValues={searchBox}>
					<StAdjustmentRequestSearch
						form={searchForm}
						getFilterZoneList={getFilterZoneList}
						currentTabKey={currentTabKey}
					/>
				</SearchFormResponsive>
			)}

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<Tabs
				defaultActiveKey="1"
				activeKey={currentTabKey}
				onTabClick={handleTabClick}
				items={tabItemList.map(item => {
					return {
						label: item.label,
						key: item.key,
						children: item.children,
					};
				})}
				className="contain-wrap"
			/>
		</>
	);
};

export default StAdjustmentRequest;
