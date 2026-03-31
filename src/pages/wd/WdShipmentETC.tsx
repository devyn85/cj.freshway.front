/*
 ############################################################################
 # FiledataField	: WdShipmentETC.tsx
 # Description		: 출고 > 기타출고 > 매각출고처리
 # Author			    : 고혜미
 # Since			    : 25.10.15
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList, apiGetTab3MasterList } from '@/api/wd/apiWdShipmentETC';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import WdShipmentETCSearch from '@/components/wd/shipmentETC/WdShipmentETCSearch';
import WdShipmentETCTap1Detail from '@/components/wd/shipmentETC/WdShipmentETCTab1Detail';
import WdShipmentETCTap2Detail from '@/components/wd/shipmentETC/WdShipmentETCTap2Detail';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

// Util
// Util
import dayjs from 'dayjs';
// lib

const WdShipmentETC = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();

	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	const [totalCnt1, setTotalCnt1] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);

	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: '', // 물류센터
		organize: '', // 창고
		sku: '', // 상품코드
		fromLocName: '', //로케이션
		toLocName: '', //로케이션
		stockgrade: '', // 재고속성
		docDt: [dayjs(), dayjs()], // 매각기간
	});

	// 기타출고 요청 일괄적용 초기 셋팅
	const [requiredBox] = useState({
		wdDate: dayjs(), // 처리일자
		potype: '', // 처리유형
		reasoncode: '', // 처리사유
		reasonmsg: '', // 세부사유
		other05: '', // 물류귀책배부
		costcd: '', // 귀속부서
		costcdname: '',
		custkey: '', // 거래처
		custname: '',
		other03: '', // 기타
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKeyMaster(key);
		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 조회
	 * @param tabKey
	 * @returns {void}
	 */
	const searchMasterList = async (tabKey = activeKeyMaster) => {
		const params = searchForm.getFieldsValue();

		if (tabKey === '1') {
			// 기타출고
			if (refs1.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			refs1.gridRef.current?.clearGridData();
			apiGetTab1MasterList(params).then(res => {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			});
		} else if (tabKey === '2') {
			// 처리결과
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
				window.dispatchEvent(new Event('resize'));
			});
		} else if (tabKey === '3') {
			// 매각내역
			if (refs3.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			refs3?.gridRef?.current?.clearGridData();
			const docDt = params.docDt ?? [dayjs(), dayjs()];
			params.fromDisposeDate = docDt?.[0]?.format('YYYYMMDD');
			params.toDisposeDate = docDt?.[1]?.format('YYYYMMDD');
			apiGetTab3MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
				window.dispatchEvent(new Event('resize'));
			});
		}
	};

	// 요청처리결과 데이터 설정
	const handleGridData2_backup = (data: any) => {
		//매각
		if (form.getFieldValue('potype') === '3') {
			showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
				searchForm.setFieldValue('docDt', [form.getFieldValue('wdDate'), form.getFieldValue('wdDate')]);
				setActiveKeyMaster('3');
				setTimeout(() => searchMasterList('3'), 0);
				refs1.gridRef.current?.clearGridData();
			});
		}

		//기부
		if (form.getFieldValue('potype') === '10') {
			showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
				setActiveKeyMaster('2');
				setTimeout(() => searchMasterList('2'), 0);
				refs1.gridRef.current?.clearGridData();
			});
		}
	};

	const handleGridData2 = (data: any) => {
		// //매각
		// if (form.getFieldValue('potype') === '3') {
		// 	showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
		// 		searchForm.setFieldValue('docDt', [form.getFieldValue('wdDate'), form.getFieldValue('wdDate')]);
		// 		setActiveKeyMaster('3');
		// 		setTimeout(() => searchMasterList('3'), 0);
		// 		refs1.gridRef.current?.clearGridData();
		// 	});
		// }
		// //기부
		// if (form.getFieldValue('potype') === '10') {
		// 	showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
		// 		setActiveKeyMaster('2');
		// 		setTimeout(() => searchMasterList('2'), 0);
		// 		refs1.gridRef.current?.clearGridData();
		// 	});
		// }
		// 처리되었습니다.\r\n결과탭으로 이동합니다.
		showAlert(null, t('msg.MSG_WD_SHIPMENT_ETC_001'), () => {
			searchForm.setFieldValue('docDt', [form.getFieldValue('wdDate'), form.getFieldValue('wdDate')]);
			setActiveKeyMaster('2');
			//setTimeout(() => searchMasterList('3'), 0);
			searchMasterList('2');
			refs1.gridRef.current?.clearGridData();
		});
	};
	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 * @param res
	 */
	return (
		<>
			<MenuTitle func={titleFunc} isShowMenuAuthButton={activeKeyMaster !== '2' ? true : false} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<WdShipmentETCSearch form={searchForm} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="기타출고" key="1">
					<WdShipmentETCTap1Detail
						ref={refs1}
						form={form}
						data={gridData1}
						totalCnt={totalCnt1}
						initialValues={requiredBox}
						fixdccode={searchForm.getFieldValue('fixdccode')}
						searchMasterList={searchMasterList}
						handleGridData2={handleGridData2}
					/>
				</TabPane>
				{/* <TabPane tab="매각내역" key="3">
					<WdShipmentETCTap3Detail
						ref={refs3}
						form={form}
						callBackFn={searchMasterList}
						data={gridData3}
						totalCnt={totalCnt3}
					/>
				</TabPane> */}
				<TabPane tab="처리결과" key="2">
					<WdShipmentETCTap2Detail ref={refs2} form={form} data={gridData2} totalCnt={totalCnt2} />
				</TabPane>
			</Tabs>
		</>
	);
};

export default WdShipmentETC;
