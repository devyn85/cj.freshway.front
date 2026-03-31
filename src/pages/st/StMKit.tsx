/*
 ############################################################################
 # FiledataField	: StMKit.tsx
 # Description		: 재고 > 재고조정 > 키트처리
 # Author		    	: 고혜미
 # Since			    : 25.11.04
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';

//Api
import {
	apiPosMasterResultList01,
	apiPostKitList01,
	apiPostMasterList01,
	apiPostMasterList02,
	apiPostMasterList03,
	apiPostPrintList,
} from '@/api/st/apiStMKit';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import StMKitDetail1 from '@/components/st/mKit/StMKitDetail1';
import StMKitDetail2 from '@/components/st/mKit/StMKitDetail2';
import StMKitDetail3 from '@/components/st/mKit/StMKitDetail3';
import StMKitDetail4 from '@/components/st/mKit/StMKitDetail4';
import StMKitSearch from '@/components/st/mKit/StMKitSearch';
import { showAlert } from '@/util/MessageUtil';
import { useTranslation } from 'react-i18next';

// lib
const StMKit = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [formRef] = Form.useForm();
	const [searchForm] = Form.useForm();

	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const [gridData3, setGridData3] = useState([]);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const [gridData4, setGridData4] = useState([]);
	const [totalCnt4, setTotalCnt4] = useState(0);

	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	const [kitList1, setKitList1] = useState([]);

	// Declare react Ref(2/4)
	const gridRef1: any = useRef(null);
	const gridRef2: any = useRef(null);
	const gridRef3: any = useRef(null);
	const gridRef4: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: null, // 물류센터
		trandtRange: null, // 계획일자 범위
		storagetype: null, //저장조건
		kitSku: '',
		kitSkuName: null, //상품
		procdiv: '1',
	});

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		// 조회 실행
		searchMasterListRun();
		searchKitList();
	};

	/**
	 * 	조회
	 */
	const searchMasterListRun = async () => {
		const searchParam = searchForm.getFieldsValue();
		// 그리드 데이터 초기화
		if (activeKeyMaster === '1') {
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
		} else if (activeKeyMaster === '2') {
			gridRef3.current?.clearGridData();
		} else if (activeKeyMaster === '3') {
			gridRef4.current?.clearGridData();
		}

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		try {
			if (activeKeyMaster === '1') {
				// 탭1: 생산 조회
				const params = {
					fixdccode: searchParam.fixdccode,
					fromDate: searchParam.trandtRange[0].format('YYYYMMDD'),
					toDate: searchParam.trandtRange[1].format('YYYYMMDD'),
					storagetype: searchParam.storagetype,
					kitSku: searchParam.kitSku,
					procdiv: searchParam.procdiv,
				};
				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 전자결재 조회
				const params = {
					fixdccode: searchParam.fixdccode,
					fromDate: searchParam.trandtRange[0].format('YYYYMMDD'),
					toDate: searchParam.trandtRange[1].format('YYYYMMDD'),
					storagetype: searchParam.storagetype,
					kitSku: searchParam.kitSku,
					procdiv: searchParam.procdiv,
				};
				searchMasterListImp02(params);
			} else if (activeKeyMaster === '3') {
				// 탭3: 처리 조회
				const params = {
					fixdccode: searchParam.fixdccode,
					fromDate: searchParam.trandtRange[0].format('YYYYMMDD'),
					toDate: searchParam.trandtRange[1].format('YYYYMMDD'),
					storagetype: searchParam.storagetype,
					kitSku: searchParam.kitSku,
					procdiv: searchParam.procdiv,
				};
				searchMasterListImp03(params);
			}
		} catch (error) {
			showAlert('', t('msg.searchError')); // 조회 중 오류가 발생했습니다.
		}
	};

	/**
	 * 	조회
	 */
	const searchKitList = async () => {
		const searchParam = searchForm.getFieldsValue();

		try {
			if (activeKeyMaster === '1') {
				// 탭1: 이체대상 조회
				const params = {
					fixdccode: searchParam.fixdccode,
					fromDate: searchParam.trandtRange[0].format('YYYYMMDD'),
					toDate: searchParam.trandtRange[1].format('YYYYMMDD'),
					storagetype: searchParam.storagetype,
					kitSku: searchParam.kitSku,
				};
				//API 호출
				apiPostKitList01(params).then(res => {
					setKitList1(res.data);
				});
			}
		} catch (error) {
			showAlert('', t('msg.searchError')); // 조회 중 오류가 발생했습니다.
		}
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp01 = (params: any) => {
		//API 호출
		apiPostMasterList01(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterResultListImp01 = () => {
		const params = {};
		//API 호출
		apiPosMasterResultList01(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	/**
	 * 전자결재 조회
	 * @param params
	 * @returns {void}
	 */
	const searchMasterListImp02 = (params: any) => {
		//API 호출
		apiPostMasterList02(params).then(res => {
			setGridData3(res.data);
			setTotalCnt3(res.data.length);
		});
	};

	/**
	 * 처리 조회
	 * @param params
	 * @returns {void}
	 */
	const searchMasterListImp03 = (params: any) => {
		//API 호출
		apiPostMasterList03(params).then(res => {
			setGridData4(res.data);
			setTotalCnt4(res.data.length);
		});
	};

	/**
	 * 출력
	 */
	const printMasterList = () => {
		// 1. 체크된 데이터
		const checkedRow = gridRef3?.current?.getCheckedRowItemsAll();

		// 2. 체크된 데이터 확인
		if (checkedRow.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 인쇄 를/을 처리하시겠습니까?
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			// 조합(dccode|planDt|kitSku) 기준으로 중복 제거
			const comboMap = new Map<string, { planDt: string; kitSku: string }>();
			for (const row of checkedRow) {
				const planDt = row.planDt;
				const kitSku = row.kitSku;
				const key = `${planDt}|${kitSku}`;
				if (!comboMap.has(key)) {
					comboMap.set(key, { planDt, kitSku });
				}
			}

			const uniqueItems = Array.from(comboMap.values());

			const params = {
				fixdccode: searchForm.getFieldValue('fixdccode'),
				planDt: Array.from(new Set(uniqueItems.map(i => i.planDt)))
					.filter(Boolean)
					.join(','),
				sku: Array.from(new Set(uniqueItems.map(i => i.kitSku)))
					.filter(Boolean)
					.join(','),
			};

			apiPostPrintList(params).then(res => {
				if (res.statusCode > -1) {
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param params
	 * @param res
	 */
	const viewRdReportMaster = (res: any) => {
		if (!res.data || res.data.length < 1) {
			showAlert(null, t('msg.noData')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'ST_M_Kit.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: res.data, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	// const searchMasterListImp02 = (params: any) => {
	// 	// API 호출
	// 	apiPostTab2MasterList(params).then(res => {
	// 		if (res.data != null && res.data.length > 0) {
	// 			setGridData2(res.data);
	// 			setTotalCnt2(res.data.length);
	// 		}
	// 	});
	// };

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		setActiveKeyMaster(key);
		window.dispatchEvent(new Event('resize'));
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '생산',
			children: (
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					sizes={[70, 30]}
					items={[
						<StMKitDetail1
							key="StMKitDetail1"
							ref={gridRef1}
							form={form}
							searchForm={searchForm}
							data={gridData1}
							kitList={kitList1}
							totalCnt={totalCnt1}
							activeKey={activeKeyMaster}
							formRef={formRef}
							callBackFn={searchMasterList}
							callBackResultFn={searchMasterResultListImp01}
							printMasterList={printMasterList}
						/>,
						<StMKitDetail2
							key="StMKitDetail2"
							ref={gridRef2}
							form={form}
							data={gridData2}
							formRef={formRef}
							totalCnt={totalCnt2}
						/>,
					]}
				/>
			),
		},
		{
			key: '2',
			label: '전자결재',
			children: (
				<StMKitDetail3
					ref={gridRef3}
					form={form}
					searchForm={searchForm}
					data={gridData3}
					kitList={kitList1}
					totalCnt={totalCnt1}
					activeKey={activeKeyMaster}
					formRef={formRef}
					callBackFn={searchMasterList}
					printMasterList={printMasterList}
				/>
			),
		},
		{
			key: '3',
			label: '처리',
			children: (
				<StMKitDetail4
					ref={gridRef4}
					form={form}
					searchForm={searchForm}
					data={gridData4}
					kitList={kitList1}
					totalCnt={totalCnt1}
					activeKey={activeKeyMaster}
					formRef={formRef}
					callBackFn={searchMasterList}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StMKitSearch form={searchForm} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default StMKit;
