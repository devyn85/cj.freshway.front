// CSS

// Lib
import { Form, Tabs } from 'antd';

// Util

// Type

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';

import { apiGetTab1MasterList, apiGetTab2MasterList, apiGetTab3MasterList } from '@/api/kp/apiKpProcessResult';
import KpProcessResultT01Search from '@/components/kp/ProcessResult/KpProcessResultT01Search';
import KpProcessResultT02Search from '@/components/kp/ProcessResult/KpProcessResultT02Search';
import KpProcessResultT03Search from '@/components/kp/ProcessResult/KpProcessResultT03Search';
import KpProcessResultTab1Detail from '@/components/kp/ProcessResult/KpProcessResultTab1Detail';
import KpProcessResultTab2Detail from '@/components/kp/ProcessResult/KpProcessResultTab2Detail';
import KpProcessResultTab3Detail from '@/components/kp/ProcessResult/KpProcessResultTab3Detail';
import TabPane from 'antd/es/tabs/TabPane';

// Store

// API

const kpProcessResult = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();
	const [form3] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);

	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const [activeTabKey, setActiveTabKey] = useState('1');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList1 = () => {
		// 조회 조건 설정
		const searchParams = form1.getFieldsValue();

		if (commUtil.isNull(searchParams.modifyDt[0]) || commUtil.isNull(searchParams.modifyDt[1])) {
			showAlert('', '일자를 선택해주세요.');
			return;
		}
		// //console.log('searchParams', searchParams);
		const params = {
			...searchParams,
			fromModifyDate: form1.getFieldValue('modifyDt')[0]
				? form1.getFieldValue('modifyDt')[0].format('YYYYMMDDHHmm')
				: '',
			toModifyDate: form1.getFieldValue('modifyDt')[1] ? form1.getFieldValue('modifyDt')[1].format('YYYYMMDDHHmm') : '',
		};

		apiGetTab1MasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const searchMasterList2 = () => {
		// 조회 조건 설정
		const searchParams = form2.getFieldsValue();
		if (commUtil.isNull(searchParams.modifyDt[0]) || commUtil.isNull(searchParams.modifyDt[1])) {
			showAlert('', '일자를 선택해주세요.');
			return;
		}
		// //console.log('searchParams', searchParams);
		const params = {
			...searchParams,
			fromModifyDate: form2.getFieldValue('modifyDt')[0]
				? form2.getFieldValue('modifyDt')[0].format('YYYYMMDDHHmm')
				: '',
			toModifyDate: form2.getFieldValue('modifyDt')[1] ? form2.getFieldValue('modifyDt')[1].format('YYYYMMDDHHmm') : '',
		};

		apiGetTab2MasterList(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	const searchMasterList3 = () => {
		// 조회 조건 설정
		const searchParams = form3.getFieldsValue();
		if (commUtil.isNull(searchParams.modifyDt[0]) || commUtil.isNull(searchParams.modifyDt[1])) {
			showAlert('', '일자를 선택해주세요.');
			return;
		}
		// //console.log('searchParams', searchParams);
		const params = {
			...searchParams,
			fromModifyDate: form3.getFieldValue('modifyDt')[0]
				? form3.getFieldValue('modifyDt')[0].format('YYYYMMDDHHmm')
				: '',
			toModifyDate: form3.getFieldValue('modifyDt')[1] ? form3.getFieldValue('modifyDt')[1].format('YYYYMMDDHHmm') : '',
		};

		apiGetTab3MasterList(params).then(res => {
			setGridData3(res.data);
			setTotalCnt3(res.data.length);
		});
	};
	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.gridRef.current) {
				refs1.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveTabKey('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current.resize('100%', '100%');
			}
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => {
			switch (activeTabKey) {
				case '1':
					return searchMasterList1();
				case '2':
					return searchMasterList2();
				case '3':
					return searchMasterList3();
				default:
					break;
			}
		},
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} />
			{activeTabKey === '1' && <KpProcessResultT01Search form={form1} search={searchBox} />}
			{activeTabKey === '2' && <KpProcessResultT02Search form={form2} search={searchBox} />}
			{activeTabKey === '3' && <KpProcessResultT03Search form={form3} search={searchBox} />}
			<Tabs activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="센터별" key="1">
					<KpProcessResultTab1Detail ref={refs1} data={gridData} totalCnt={totalCnt} search={searchMasterList1} />
				</TabPane>
				<TabPane tab="작업자별" key="2">
					<KpProcessResultTab2Detail ref={refs2} data={gridData2} totalCnt={totalCnt2} search={searchMasterList2} />
				</TabPane>
				<TabPane tab="Raw" key="3">
					<KpProcessResultTab3Detail ref={refs3} data={gridData3} totalCnt={totalCnt3} search={searchMasterList3} />
				</TabPane>
			</Tabs>
		</>
	);
});

export default kpProcessResult;
