/*
 ############################################################################
 # FiledataField	: TmCarPositionHistory.tsx
 # Description		: 배송 > 차량관제 > 운행일지
 # Author					: JiHoPark
 # Since					: 2025.11.14.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import TmCarPositionHistoryDetail1 from '@/components/tm/carPositionHistory/TmCarPositionHistoryDetail1';
import TmCarPositionHistoryDetail2 from '@/components/tm/carPositionHistory/TmCarPositionHistoryDetail2';
import TmCarPositionHistorySearch from '@/components/tm/carPositionHistory/TmCarPositionHistorySearch';

// Util
import dayjs from 'dayjs';

// Store

// API
import { apiGetCarPositionHistoryInfo, apiGetMasterList, apiGetMasterList2 } from '@/api/tm/apiTmCarPositionHistory';
import Splitter from '@/components/common/Splitter';

// Hooks

// type

// asset

const TmCarPositionHistory = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// grid data
	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	// grid Ref
	const gridRefs1: any = useRef(null);
	const gridRefs2: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: '', // 물류센터
		docdt: [dayjs(), dayjs()], // 배송일자
		toCustkey: '', // 거래처
		carno: '', // 차량번호
		contracttype: '', // 계약유형
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 목록 조회 event
	 */
	const searchMasterList = () => {
		const searchParam = searchForm.getFieldsValue();

		// 목록 초기화
		gridRefs1.current.clearGridData();
		gridRefs2.current.clearGridData();

		const params = {
			dccode: searchParam.gMultiDccode,
			fromDocdt: searchParam.docdt[0].format('YYYYMMDD'),
			toDocdt: searchParam.docdt[1].format('YYYYMMDD'),
			toCustkey: searchParam.toCustkey,
			carno: searchParam.carno,
			contracttype: searchParam.contracttype,
		};

		apiGetMasterList(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 상세 목록 조회 event
	 * @param item
	 */
	const searchDetailList = (item: any) => {
		const curUid = item._$uid;
		const curRowVal = searchForm.getFieldValue('rowIdVal');
		searchForm.setFieldValue('rowIdVal', curUid);

		if (curUid === curRowVal) {
			return;
		}

		// 목록 초기화
		gridRefs2.current.clearGridData();

		const params = {
			...item,
		};

		apiGetMasterList2(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	/**
	 * 차량운행일지 출력 데이터 조회
	 * @param items
	 */
	const searchCarPositionHistoryPrintInfo = (items: any) => {
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				processtype: 'TM_DRIVEHISTORY',
				printMasterList: items,
			};

			apiGetCarPositionHistoryInfo(params).then(res => {
				// RD 레포트 xml
				// 1. 리포트 파일명
				const fileName = 'TM_DriveHistoryRP.mrd';

				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_reportHeader: res.data.dsReportHeader,
					ds_reportDetail: res.data.dsReportDetail,
				};

				// // 3. 리포트에 전송할 파라미터
				const params: any = {
					TITLE: t('lbl.CARDELOVERYDOC'), // 차량운행일지
				};

				reportUtil.openAgentReportViewer(fileName, dataSet, params);
			});
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRefs1?.current?.resize?.('100%', '100%');
		gridRefs2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmCarPositionHistorySearch form={searchForm} />
			</SearchFormResponsive>

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<TmCarPositionHistoryDetail1
						key="TmCarPositionHistoryDetail1"
						ref={gridRefs1}
						data={gridData1}
						totalCnt={totalCnt1}
						searchDetailList={searchDetailList}
						searchCarPositionHistoryPrintInfo={searchCarPositionHistoryPrintInfo}
					/>,
					<TmCarPositionHistoryDetail2
						key="TmCarPositionHistoryDetail2"
						ref={gridRefs2}
						data={gridData2}
						totalCnt={totalCnt2}
					/>,
				]}
			/>
		</>
	);
};

export default TmCarPositionHistory;
