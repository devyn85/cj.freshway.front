/*
 ############################################################################
 # FiledataField	: WdInplanSTO.tsx
 # Description		: 광역출고현황
 # Author			: YeoSeungCheol
 # Since			: 25.11.12
 ############################################################################
*/

// CSS

// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useRef, useState } from 'react';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdInplanSTOSearch from '@/components/wd/inplanSTO/WdInplanSTOSearch';
import WdInplanSTOTab1 from '@/components/wd/inplanSTO/WdInplanSTOTab1';
import WdInplanSTOTab2 from '@/components/wd/inplanSTO/WdInplanSTOTab2';
import WdInplanSTOTab3 from '@/components/wd/inplanSTO/WdInplanSTOTab3';

// Store

// API
import {
	apiGetMasterList,
	apiGetMasterListTab1,
	apiGetMasterListTab2,
	apiGetMasterListTab3,
	apiGetPrintMasterInvoice,
} from '@/api/wd/apiWdInplanSTO';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import WdInplanSTODetail from '@/components/wd/inplanSTO/WdInplanSTODetail';
//import { console } from 'inspector';

const WdInplanSTO = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);
	const fromDccode = Form.useWatch('fromDccode', form);
	const toDccode = Form.useWatch('toDccode', form);

	// Declare react Ref(2/4)

	// 그리드 접근을 위한 Ref Tab 순서대로
	const gridRef = useRef(null);
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		docdtWdSto: [dayjs(), dayjs()],
		toDccode: [],
		storagetype: '',
		delYn: '',
	}); // 그리드 데이터
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 조회 건수
	const [totalCount, setTotalCount] = useState(0);
	const [totalCount1, setTotalCount1] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);
	const [totalCount3, setTotalCount3] = useState(0);

	const [activeTabKey, setActiveTabKey] = useState('1');
	const activeTabKeyRef = useRef(activeTabKey);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // TODO: 액셀 다운로드 팝업
				},
				// TODO: 인쇄 버튼 구현
			],
		};

		return gridBtn;
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
		],
	};

	const searchMasterList = () => {
		try {
			const params = form.getFieldsValue();
			params.fromSlipdt = params.docdtWdSto[0].format('YYYYMMDD');
			params.toSlipdt = params.docdtWdSto[1].format('YYYYMMDD');
			params.fromDccode = [].concat(params.fromDccode).join(',');
			params.toDccode = [].concat(params.toDccode).join(',');

			// const res = await apiGetMasterList(params);
			// setGridData(res?.data || res || []);
			// setTotalCount((res?.data || res || []).length || 0);
			initDetailGridEvent();

			apiGetMasterList(params).then(res => {
				setGridData(res.data);
				setTotalCount(res.data.length);
			});
		} catch (e) {}
	};

	// 선택행 기반 탭별 로더
	const buildDetailParams = (selected: any) => {
		const base = form.getFieldsValue();
		base.fromDccode = [].concat(base.fromDccode).join(',');
		base.toDccode = [].concat(base.toDccode).join(',');

		return {
			dccode: selected?.dccode ?? selected?.fromDccode ?? '',
			storerkey: selected?.storerkey ?? '',
			docdt: selected?.docdt ?? '',
			docno: selected?.docno ?? '',
			doctype: selected?.doctype ?? 'WD',
			toDccode: selected?.toDccode ?? '',
			delYn: base?.delYn ?? 'N',
			storagetype: selected?.storagetype ?? '',
		} as any;
	};

	const loadTab1 = async (selected: any) => {
		try {
			const params = buildDetailParams(selected);
			const res = await apiGetMasterListTab1(params);
			setGridData1(res?.data || res || []);
			setTotalCount1((res?.data || res || []).length || 0);
		} catch (e) {
			setGridData1([]);
			setTotalCount1(0);
		}
	};

	const loadTab2 = async (selected: any) => {
		try {
			const params = buildDetailParams(selected);
			const res = await apiGetMasterListTab2(params);
			setGridData2(res?.data || res || []);
			setTotalCount2((res?.data || res || []).length || 0);
		} catch (e) {
			setGridData2([]);
			setTotalCount2(0);
		}
	};

	const loadTab3 = async (selected: any) => {
		try {
			const params = buildDetailParams(selected);
			const res = await apiGetMasterListTab3(params);
			setGridData3(res?.data || res || []);
			setTotalCount3((res?.data || res || []).length || 0);
		} catch (e) {
			setGridData3([]);
			setTotalCount3(0);
		}
	};

	/**
	 * 공통 탭 데이터 로더
	 * @param {any} selectedRow 선택된 행 데이터
	 * @param {string} tabKey 탭 키 (기본값: 현재 activeTabKey)
	 */
	const loadCurrentTabData = (selectedRow: any, tabKey: string = activeTabKeyRef.current) => {
		if (!selectedRow) return;

		if (tabKey === '1') {
			loadTab1(selectedRow);
		} else if (tabKey === '2') {
			loadTab2(selectedRow);
		} else if (tabKey === '3') {
			loadTab3(selectedRow);
		}
	};

	const printMasterList = () => {
		// 리스트 로직 구현
		// const allRows = gridRef.current?.getGridData();
		// const checkedRows = allRows.filter((r: any) => r?.check === 1 || r?.check === '1');
		const checkedRows = gridRef.current?.getCheckedRowItemsAll(); // 커스텀 체크박스 대응

		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				dccode: checkedRows[0]?.dccode,
				docno: checkedRows
					.map((r: any) => r?.docno)
					.filter(Boolean)
					.join(','),
			};

			apiGetPrintMasterInvoice(params).then(res => {
				//rd리포트 호출
				if (res.statusCode > -1) {
					// //console.log('viewRdReportMaster res1:', res.data.masterList);
					// //console.log('viewRdReportMaster res2:', res.data.detailList);
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		const { data } = res;

		// 1. 리포트 파일명
		const fileName = 'STO_Confirm.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_reportHeader: data.masterList, // 헤더 정보
			ds_reportDetail: data.detailList, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => searchMasterList(),
	};

	const tabClick = (key: string, e: any) => {
		// Detail은 화면에서 계속 고정, 탭은 1,2,3이며 왔다갔다해도 계속 100% 100%로 유지되어야 함
		setActiveTabKey(key);

		// 현재 선택된 행으로 탭 데이터 로드
		const selectedRow = gridRef.current?.getSelectedRows()?.[0];
		loadCurrentTabData(selectedRow, key);

		// 그리드 리사이즈
		if (key === '1') {
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef1.current) {
				gridRef1.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef2.current) {
				gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			if (gridRef.current) {
				gridRef.current?.resize('100%', '100%');
			}
			if (gridRef3.current) {
				gridRef3.current?.resize('100%', '100%');
			}
		}
		return;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 셀 선택 변경
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const selectedRow = gridRef.current.getSelectedRows()?.[0];
			loadCurrentTabData(selectedRow);
		});
	};

	const initDetailGridEvent = () => {
		gridRef1.current?.clearGridData?.();
		gridRef2.current?.clearGridData?.();
		gridRef3.current?.clearGridData?.();
		setGridData1([]);
		setTotalCount1(0);
		setGridData2([]);
		setTotalCount2(0);
		setGridData3([]);
		setTotalCount3(0);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		activeTabKeyRef.current = activeTabKey;
	}, [activeTabKey]);

	useEffect(() => {
		initEvent();

		// cleanup 함수로 이벤트 언바인딩
		return () => {
			gridRef?.current?.unbind('selectionChange');
		};
	}, []);

	useEffect(() => {
		initDetailGridEvent();
	}, [activeTabKey]);

	const commonProps = {
		form: form,
		fromDccode: fromDccode,
		toDccode: toDccode,
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	// *  탭 목록
	const tabItems = [
		{
			key: '1',
			label: '주문현황',
			children: (
				<WdInplanSTOTab1
					key="WdInplanSTOTab1-grid"
					gridRef={gridRef1}
					form={form}
					data={gridData1}
					totalCnt={totalCount1}
				/>
			),
		},
		{
			key: '2',
			label: '이력현황',
			children: (
				<WdInplanSTOTab2
					key="WdInplanSTOTab2-grid"
					gridRef={gridRef2}
					form={form}
					data={gridData2}
					totalCnt={totalCount2}
				/>
			),
		},
		{
			key: '3',
			label: '출고이력정보',
			children: (
				<WdInplanSTOTab3
					key="WdInplanSTOTab3-grid"
					gridRef={gridRef3}
					form={form}
					data={gridData3}
					totalCnt={totalCount3}
				/>
			),
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdInplanSTOSearch {...commonProps} activeKey={activeTabKey} />
			</SearchFormResponsive>

			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<GridAutoHeight key="sto-status-between-centers" id="sto-status-between-centers-grid">
						<WdInplanSTODetail
							gridRef={gridRef}
							form={form}
							data={gridData}
							totalCnt={totalCount}
							printMasterList={printMasterList}
						/>
					</GridAutoHeight>,
					<TabsArray
						key="sto-status-between-tabs"
						activeKey={activeTabKey}
						onChange={key => {
							tabClick(key, null);
						}}
						items={tabItems}
					/>,
				]}
			/>
		</>
	);
});

export default WdInplanSTO;
