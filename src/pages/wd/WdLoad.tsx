/*
 ############################################################################
 # FiledataField	: WdLoad.tsx
 # Description		: 출고 > 출차지시 > 출차지시처리
 # Author					: JiHoPark
 # Since					: 2025.11.12.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import WdLoadDetail1 from '@/components/wd/load/WdLoadDetail1';
import WdLoadDetail2 from '@/components/wd/load/WdLoadDetail2';
import WdLoadSearch from '@/components/wd/load/WdLoadSearch';

// Util
import dayjs from 'dayjs';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetLoadReportInfo, apiGetMasterList, apiGetMasterList2 } from '@/api/wd/apiWdLoad';
import Splitter from '@/components/common/Splitter';

// Hooks

// type

// asset

const WdLoad = () => {
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
		slipdt: [dayjs(), dayjs()], // 출고일자
		channel: '', // 저장유무
		toCustkey: '', // 관리처
		sku: '', // 상품
		organize: '', // 창고
		vendor: '', // 협력사
		deliverygroup: '', // POP
		status: '', // 검수진행상태
		inspectedyn: '', // 검수완료여부
		carno: '', // 차량번호
		searchtype: '0', // 출력기준
		searchgubun: '0', // 출력유형
	});

	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const gDccode = globalVariable?.gDccode;
	const dsAutodc = getCommonCodeList('AUTO_TM_DC');
	const [autodc, setAutodc] = useState(dsAutodc.find((item: any) => item.comCd === gDccode));

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 출력기준/출력유형 handler
	 */
	const autodcHandler = () => {
		const curDccode = searchForm.getFieldValue('gMultiDccode');
		//공통코드 AUTO_TM_DC에 물류센터를 설정하는 방식
		//const findedAutodc = dsAutodc.find((item: any) => item.comCd === curDccode);
		//7000번대의 물류센터이면 자동 설정하는 방식
		const findedAutodc = curDccode.indexOf('7') >= 0 ? { comCd: curDccode } : null;

		if (!findedAutodc) {
			searchForm.setFieldValue('deliverygroup', '');
			searchForm.setFieldValue('searchtype', '0');
			searchForm.setFieldValue('searchgubun', '0');
		}
		setAutodc(findedAutodc);
	};

	/**
	 * 목록 조회 event
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		const searchParam = searchForm.getFieldsValue();

		// 목록 초기화
		gridRefs1.current.clearGridData();
		gridRefs2.current.clearGridData();

		const params = {
			fromSlipdt: searchParam.slipdt[0].format('YYYYMMDD'),
			toSlipdt: searchParam.slipdt[1].format('YYYYMMDD'),
			dccode: searchParam.gMultiDccode,
			channel: searchParam.channel,
			toCustkey: searchParam.toCustkey,
			sku: searchParam.sku,
			organize: searchParam.organize,
			vendor: searchParam.vendor,
			deliverygroup: searchParam.deliverygroup,
			status: searchParam.status,
			inspectedyn: searchParam.inspectedyn,
			carno: searchParam.carno,
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
		const searchParam = searchForm.getFieldsValue();

		// 목록 초기화
		gridRefs2.current.clearGridData();

		const params = {
			...item,
			channel: searchParam.channel,
			toCustkey: searchParam.toCustkey,
			sku: searchParam.sku,
			status: searchParam.status,
		};

		apiGetMasterList2(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	/**
	 * 상차지시서 출력 데이터 조회
	 * @param items
	 */
	const searchLoadPrintInfo = (items: any) => {
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const searchParam = searchForm.getFieldsValue();
			const channelCdNm = getCommonCodebyCd('PUTAWAYTYPE', searchParam.channel)?.cdNm;

			const params = {
				processtype: 'WD_LOAD',
				dccode: searchParam.gMultiDccode,
				organize: searchParam.organize,
				channel: searchParam.channel,
				channelnm: commUtil.isNotEmpty(channelCdNm) ? channelCdNm : t('lbl.ALL'),
				toCustkey: searchParam.toCustkey,
				deliverygroup: searchParam.deliverygroup,
				searchtype: searchParam.searchtype,
				searchgubun: searchParam.searchgubun,
				fromSlipdt: searchParam.slipdt[0].format('YYYYMMDD'),
				toSlipdt: searchParam.slipdt[1].format('YYYYMMDD'),
				printMasterList: items,
			};

			apiGetLoadReportInfo(params).then(res => {
				// RD 레포트 xml
				// 1. 리포트 파일명
				let fileName = '';
				if (autodc && searchParam.searchgubun === '0') {
					fileName = 'WD_Load_Type_ver3.mrd';
				} else {
					fileName = 'WD_Load_Type_ver2.mrd';
				}

				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_reportHeader: res.data.dsReportHeader,
					ds_reportMemo: res.data.dsReportMemo,
					ds_reportDetail: res.data.dsReportDetail,
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {
					TITLE: t('lbl.LOADTASKDOC'), // 상차지시서
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
				<WdLoadSearch form={searchForm} autodcHandler={autodcHandler} autodc={autodc} />
			</SearchFormResponsive>

			{/* 데이터 그리드/상세/시뮬레이션 탭 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<WdLoadDetail1
						key="WdLoadDetail1"
						ref={gridRefs1}
						data={gridData1}
						totalCnt={totalCnt1}
						searchDetailList={searchDetailList}
						searchLoadPrintInfo={searchLoadPrintInfo}
					/>,
					<WdLoadDetail2 key="WdLoadDetail2" ref={gridRefs2} data={gridData2} totalCnt={totalCnt2} />,
				]}
			/>
		</>
	);
};

export default WdLoad;
