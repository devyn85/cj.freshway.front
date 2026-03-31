/*
 ############################################################################
 # FiledataField	: StAdjustmentBatch.tsx
 # Description		: 재고 > 재고조정 > 일괄재고조정
 # Author					: JiHoPark
 # Since					: 2025.09.24.
 ############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import StAdjustmentBatchDetail1 from '@/components/st/adjustmentBatch/StAdjustmentBatchDetail1';
import StAdjustmentBatchDetail2 from '@/components/st/adjustmentBatch/StAdjustmentBatchDetail2';
import StAdjustmentBatchSearch from '@/components/st/adjustmentBatch/StAdjustmentBatchSearch';

// Util
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetMasterList, apiGetZoneList } from '@/api/st/apiStAdjustmentBatch';

// Hooks

// type

// asset

const StAdjustmentBatch = () => {
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

	// grid Ref
	const gridRefs1: any = useRef(null);
	const gridRefs2: any = useRef(null);

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
		lottable01yn: '', // 유통기한여부
		stocktype: '', // 재고위치
		stockgrade: '', // 재고속성
		serialno: '', // 이력번호
		zone: '', // 피킹존
		fromloc: '', // FROM 로케이션
		toloc: '', // TO 로케이션
		convserialno: '', // B/L번호
	});

	// 재고조정 선택적용 초기 셋팅
	const [requiredBox] = useState({
		docdt: dayjs(), // 조정일자
		processmain: '', // 물류귀책배부
		reasoncode: 'MTOM', // 발생사유
		tranqty: '', // 처리수량
		imputetype: '12', // 귀책
		costcd: '', // 귀속부서
		costcdname: '',
		custkey: '', // 거래처
		custname: '',
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
			setZoneList(arrZoneList.filter((item: any) => item.dccode === gDccode || commUtil.isEmpty(item.comCd)));
		});
	};

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		gridRefs1.current.clearGridData();
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

			const params = {
				...searchParam,
				fixdccode: curFixdccode,
			};

			apiGetMasterList(params).then(res => {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
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

	//
	/**
	 * 탭 목록
	 * @param key
	 */
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.AJ'), // 재고조정
			children: (
				<StAdjustmentBatchDetail1
					ref={gridRefs1}
					form={gridForm}
					data={gridData1}
					totalCnt={totalCnt1}
					initialValues={requiredBox}
					dccode={searchForm.getFieldValue('gMultiDccode')}
					handleGridData2={handleGridData2}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.PROCESSFLAG'), // 처리결과
			children: <StAdjustmentBatchDetail2 ref={gridRefs2} data={gridData2} totalCnt={totalCnt2} />,
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
			<MenuTitle func={titleFunc} isShowMenuAuthButton={currentTabKey === '1' ? true : false} />

			{/* 검색 영역 정의 */}
			{currentTabKey === '1' && (
				<SearchFormResponsive form={searchForm} initialValues={searchBox}>
					<StAdjustmentBatchSearch form={searchForm} zoneList={zoneList} />
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

export default StAdjustmentBatch;
