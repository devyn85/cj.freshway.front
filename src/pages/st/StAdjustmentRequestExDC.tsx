/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestExDC.tsx
 # Description		: 재고 > 재고조정 > 외부비축재고조정처리
 # Author					: JiHoPark
 # Since					: 2025.08.25.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import StAdjustmentRequestExDCSearch from '@/components/st/adjustmentRequestExDC/StAdjustmentRequestExDCSearch';

import StAdjustmentRequestExDCDetail1 from '@/components/st/adjustmentRequestExDC/StAdjustmentRequestExDCDetail1';
import StAdjustmentRequestExDCDetail2 from '@/components/st/adjustmentRequestExDC/StAdjustmentRequestExDCDetail2';
import StAdjustmentRequestExDCDetail3 from '@/components/st/adjustmentRequestExDC/StAdjustmentRequestExDCDetail3';
import StAdjustmentRequestExDCDetail4 from '@/components/st/adjustmentRequestExDC/StAdjustmentRequestExDCDetail4';

// Util
import dayjs from 'dayjs';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetMasterList, apiGetMasterList3, apiGetMasterList4 } from '@/api/st/apiStAdjustmentRequeStExDC';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

const StAdjustmentRequestExDC = () => {
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
	const [gridData4, setGridData4] = useState([]); // 결재 요청 결과 데이터
	const [totalCnt4, setTotalCnt4] = useState(0); // 결재 요청 결과 데이터

	// grid Ref
	const gridRefs1: any = useRef(null);
	const gridRefs2: any = useRef(null);
	const gridRefs3: any = useRef(null);
	const gridRefs4: any = useRef(null);

	// 탭 key
	const [currentTabKey, setCurrentTabKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: '2170',
		organize: '', // 창고
		sku: '', // 상품코드
		stocktype: '', // 재고위치
		stockgrade: '', // 재고속성
		serialno: '', // 이력번호
		convserialno: '', // B/L번호
		serialnoyn: '', // serialnoyn
		basedtFromTo: [dayjs(), dayjs()], // 기준일 from to
		organize2: '', // 창고
		sku2: '', // 상품코드
		organize3: '', // 창고
		sku3: '', // 상품코드
		stocktype3: '', // 재고위치
		stockgrade3: '', // 재고속성
		serialno3: '', // 이력번호
		convserialno3: '', // B/L번호
		apprstatus: '', // 진행상태
		searchDate: 'APPRREQDT', // 일자유형
		apprreqdtSlipdtFromTo: [dayjs(), dayjs()], // 조정/조정요청 일자 from to
	});

	// 재고조정 요청 저장 조건
	const [requiredBox] = useState({
		docdt: dayjs(), // 결재요청일자
		reasoncode: '', // 발생사유
		costcd: '',
		costcdname: '',
		custkey: '',
		custname: '',
		wdCust: '', // 출고자
		wdMethod: '', // 출고방법
		wdMemo: '', // 출고증 비고
		reasonmsg: '', // 처리사유
	});

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const gUserId = globalVariable['gUserId'];
	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// MS자체감모 처리권한자(AJDC)
	const ajdcUserCmCd = getCommonCodeList('AJDC_PROC_USER');
	const bAjdcUser = ajdcUserCmCd.find(val => val.comCd.toUpperCase() === gUserId.toUpperCase());

	// 외부비축 재고조정에서 사용되는 발생사유 코드 filter
	const dsReasonCode = getCommonCodeList('REASONCODE_AJAJ', t('lbl.SELECT'), '').filter(item => {
		const comCd = item.comCd;
		const data4 = item.data4;
		//if (globalVariable.gAuthority !== '00' && globalVariable.gAuthority !== '05' && !bAjdcUser) {
		if (!user.roles?.includes('000') && !user.roles?.includes('010') && !bAjdcUser) {
			// 발생사유
			return (
				comCd === '' ||
				(comCd !== 'AJDC' &&
					comCd !== 'MTOM' &&
					comCd !== 'AJ-07' &&
					comCd !== 'AJ-25' &&
					comCd !== 'AJ-26' &&
					data4 === '2170')
			);
		} else {
			return (
				comCd === '' ||
				(data4 === '2170' && comCd !== 'MTOM' && comCd !== 'AJ-07' && comCd !== 'AJ-25' && comCd !== 'AJ-26')
			);
		}
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
	 * 전자결재 실행하지 않은 list 설정
	 * @param key
	 */
	const setNoElectApprovalList = () => {
		const filteredDataList = gridRefs3?.current.getGridData().filter((item: any) => item.chk !== '1');
		setGridData3(filteredDataList);
		setTotalCnt3(filteredDataList.length);
	};

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		const searchParam = searchForm.getFieldsValue();

		// 물류센터가 2170이 아닌경우 return
		if (searchParam.fixdccode !== '2170') {
			return;
		}

		if (currentTabKey === '1') {
			// 요청 목록 조회
			if (gridRefs1.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			// 목록 초기화
			gridRefs1.current.clearGridData();
			gridRefs2.current.clearGridData();

			const params = {
				...searchParam,
				serialnoyn: (searchParam.serialno || searchParam.convserialno) && 'Y',
			};

			apiGetMasterList(params).then(res => {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			});
		} else if (currentTabKey === '2') {
			// 결재 목록 조회
			const params = {
				fixdccode: searchParam.fixdccode,
				organize: searchParam.organize2,
				basedtFrom: searchParam.basedtFromTo[0].format('YYYYMMDD'),
				basedtTo: searchParam.basedtFromTo[1].format('YYYYMMDD'),
				sku: searchParam.sku2,
				approvaltype: 'DDRAJ',
			};

			apiGetMasterList3(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		} else if (currentTabKey === '3') {
			// 조정처리 목록 조회
			const params = {
				fixdccode: searchParam.fixdccode,
				sku: searchParam.sku3,
				stocktype: searchParam.stocktype3,
				stockgrade: searchParam.stockgrade3,
				serialno: searchParam.serialno3,
				convserialno: searchParam.convserialno3,
				organize: searchParam.organize3,
				apprstatus: searchParam.apprstatus,
				searchDate: searchParam.searchDate,
				fromApprreqdtSlipdt: searchParam.apprreqdtSlipdtFromTo[0].format('YYYYMMDD'),
				toApprreqdtSlipdt: searchParam.apprreqdtSlipdtFromTo[1].format('YYYYMMDD'),
				serialnoyn: (searchParam.serialno3 || searchParam.convserialno3) && 'Y',
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
		const chkDataList = gridRefs1.current.getCheckedRowItemsAll();

		let nSucc = 0;
		let nFail = 0;

		for (const objData of data) {
			if (objData.processflag === 'Y') {
				nSucc++;
			} else {
				nFail++;
			}

			const findData = chkDataList.find((item: any) => {
				return (
					item.loc === objData.loc &&
					item.sku === objData.sku &&
					item.lot === objData.lot &&
					item.stockid === objData.stockid &&
					item.stockgrade === objData.stockgrade &&
					item.stocktype === objData.stocktype
				);
			});

			if (findData) {
				const rtnItem = {
					...objData,
					avgweight: findData.avgweight,
					calbox: findData.calbox,
					realorderbox: findData.realorderbox,
					realcfmbox: findData.realcfmbox,
					costcdname: findData.costcdname,
					custname: findData.custname,
				};

				rtnList.push(rtnItem);
			} else {
				rtnList.push(objData);
			}
		}

		showMessage({
			content: t('msg.MSG_COM_VAL_238', [nSucc, nFail]), // 성공 : {{0}}건 실패 : {{1}}건 처리되었습니다.
		});

		gridRefs1.current.clearGridData();
		gridRefs2.current.clearGridData();
		searchMasterList();

		setGridData2(rtnList);
		setTotalCnt2(rtnList.length);
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRefs1?.current?.resize?.('100%', '100%');
		gridRefs2?.current?.resize?.('100%', '100%');
	}, []);

	// *  탭 목록
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.REQUEST_AJ'),
			children: (
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<StAdjustmentRequestExDCDetail1
							key="StAdjustmentRequestExDCDetail1"
							ref={gridRefs1}
							form={gridForm}
							data={gridData1}
							totalCnt={totalCnt1}
							initialValues={requiredBox}
							fixdccode={searchForm.getFieldValue('fixdccode')}
							handleGridData2={handleGridData2}
							reasonCodeList={dsReasonCode}
							globalVariable={globalVariable}
						/>,
						<StAdjustmentRequestExDCDetail2
							key="StAdjustmentRequestExDCDetail2"
							ref={gridRefs2}
							form={gridForm}
							data={gridData2}
							totalCnt={totalCnt2}
						/>,
					]}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.APPROVAL_AJ'),
			children: (
				<StAdjustmentRequestExDCDetail3
					ref={gridRefs3}
					form={gridForm}
					data={gridData3}
					totalCnt={totalCnt3}
					fixdccode={searchForm.getFieldValue('fixdccode')}
					searchHandler={searchMasterList}
					setNoElectApprovalList={setNoElectApprovalList}
				/>
			),
		},
		{
			key: '3',
			label: t('lbl.PROCESS_AJ'),
			children: (
				<StAdjustmentRequestExDCDetail4
					ref={gridRefs4}
					form={gridForm}
					data={gridData4}
					totalCnt={totalCnt4}
					fixdccode={searchForm.getFieldValue('fixdccode')}
					searchHandler={searchMasterList}
					globalVariable={globalVariable}
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

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StAdjustmentRequestExDCSearch form={searchForm} currentTabKey={currentTabKey} />
			</SearchFormResponsive>

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<TabsArray activeKey={currentTabKey} onChange={handleTabClick} items={tabItemList} />
		</>
	);
};

export default StAdjustmentRequestExDC;
