/*
 ############################################################################
 # FiledataField	: TmTransportControl.tsx
 # Description		: 정산 > 운송비정산 > 수송배차조정
 # Author					: JiHoPark
 # Since					: 2025.11.05.
 ############################################################################
*/

import { apiGetMasterList, apiGetMasterList2 } from '@/api/tm/apiTmTransportControl';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import Splitter from '@/components/common/Splitter';
import TmTransportControlDetail1 from '@/components/tm/transportControl/TmTransportControlDetail1';
import TmTransportControlDetail2 from '@/components/tm/transportControl/TmTransportControlDetail2';
import TmTransportControlSearch from '@/components/tm/transportControl/TmTransportControlSearch';
import { Form } from 'antd';
import dayjs from 'dayjs';

const TmTransportControl = () => {
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
		fromDcCode: '', // 출발물류센터
		toDcCode: '', // 도착물류센터
		deliverydt: [dayjs(), dayjs()], // 기준일자
		courier: '', // 운송사
		carno: '', // 차량번호
		contracttype: '', // 계약유형
		storagetype: '', // 저장조건
		carcapacity: '', // 톤급
		routeYn: '', // 경유여부
	});

	/**
	 * 목록 조회 event
	 */
	const searchMasterList = async () => {
		if (gridRefs1.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		const searchParam = searchForm.getFieldsValue();

		// 목록 초기화
		gridRefs1.current.clearGridData();
		gridRefs2.current.clearGridData();

		const params = {
			...searchParam,
			deliverydt: '',
			fromDeliverydt: searchParam.deliverydt[0].format('YYYYMMDD'),
			toDeliverydt: searchParam.deliverydt[1].format('YYYYMMDD'),
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
	const searchDetailList = async (item: any) => {
		const curUid = item._$uid;
		const curRowVal = searchForm.getFieldValue('rowIdVal');
		searchForm.setFieldValue('rowIdVal', curUid);

		if (item.rowStatus === 'I') {
			// 목록 초기화
			gridRefs2.current.clearGridData();
			return;
		}

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
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRefs1.current?.resize?.('100%', '100%');
		gridRefs2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmTransportControlSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<TmTransportControlDetail1
						key="TmTransportControlDetail1"
						ref={gridRefs1}
						data={gridData1}
						totalCnt={totalCnt1}
						onSearchMaster={searchMasterList}
						searchDetailList={searchDetailList}
					/>,
					<TmTransportControlDetail2
						key="TmTransportControlDetail2"
						ref={gridRefs2}
						data={gridData2}
						totalCnt={totalCnt2}
					/>,
				]}
			/>
		</>
	);
};

export default TmTransportControl;
