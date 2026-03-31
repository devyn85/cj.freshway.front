/*
 ############################################################################
 # FiledataField	: KpDailyUnloadMasterPopup.tsx
 # Description		:  지표 > 생산성 > 데일리 생산성 하역 지표 관리(투입인원) 엑셀 팝업
 # Author			: JiHoPark
 # Since			: 2026.01.22.
 ############################################################################
*/
// Lib
import { Form, Tabs } from 'antd';

// component
import { SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

import KpDailyUnloadMasterPopupDetail1 from '@/components/kp/dailyUnload/KpDailyUnloadMasterPopupDetail1';
import KpDailyUnloadMasterPopupDetail2 from '@/components/kp/dailyUnload/KpDailyUnloadMasterPopupDetail2';
import KpDailyUnloadMasterPopupDetail3 from '@/components/kp/dailyUnload/KpDailyUnloadMasterPopupDetail3';

import KpDailyUnloadMasterPopupSearch from '@/components/kp/dailyUnload/KpDailyUnloadMasterPopupSearch';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Util
import dayjs from 'dayjs';

// CSS

// Type

// API
import {
	apiGetPopupMasterList,
	apiGetPopupMasterList2,
	apiGetPopupMasterList3,
	apiSavePopupMasterList,
	apiSavePopupMasterList2,
	apiSavePopupMasterList3,
} from '@/api/kp/apiKpDailyUnload';

interface KpDailyUnloadMasterPopupProps {
	close?: any;
}

const KpDailyUnloadMasterPopup = forwardRef((props: KpDailyUnloadMasterPopupProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchFormPopup] = Form.useForm();

	// grid data
	const [gridData1Popup, setGridData1Popup] = useState([]);
	const [totalCnt1Popup, setTotalCnt1Popup] = useState(0);
	const [gridData2Popup, setGridData2Popup] = useState([]);
	const [totalCnt2Popup, setTotalCnt2Popup] = useState(0);
	const [gridData3Popup, setGridData3Popup] = useState([]);
	const [totalCnt3Popup, setTotalCnt3Popup] = useState(0);

	// grid Ref
	const gridRefs1Popup: any = useRef(null);
	const gridRefs2Popup: any = useRef(null);
	const gridRefs3Popup: any = useRef(null);

	// 탭 key
	const [currentTabKey, setCurrentTabKey] = useState('1');

	const today = dayjs();
	const dayEndofYear = dayjs().endOf('year');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		contractDate: today, // 조회년도
		contractDate2: today, // 조회년도
		excptDate: today, // 조회년도
	});

	// 물류센터
	const dsDccode = getCommonCodeList('DAILY_PROC_DCCODE', t('lbl.SELECT'), '');

	// 대분류
	const dsDailyU1 = getCommonCodeList('DAILY_U_1', t('lbl.SELECT'), '');

	/**
	 * =====================================================================
	 *	02. 함수
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
	 * 조회 event
	 */
	const searchMasterList = async () => {
		const searchParam = searchFormPopup.getFieldsValue();

		if (currentTabKey === '1') {
			if (gridRefs1Popup.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			// 목록 초기화
			gridRefs1Popup.current.clearGridData();

			const params = {
				contractDate: searchParam.contractDate.format('YYYY'),
			};

			apiGetPopupMasterList(params).then(res => {
				setGridData1Popup(res.data);
				setTotalCnt1Popup(res.data.length);
			});
		} else if (currentTabKey === '2') {
			if (gridRefs2Popup.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			// 목록 초기화
			gridRefs2Popup.current.clearGridData();

			const params = {
				contractDate: searchParam.contractDate2.format('YYYY'),
			};

			apiGetPopupMasterList2(params).then(res => {
				setGridData2Popup(res.data);
				setTotalCnt2Popup(res.data.length);
			});
		} else if (currentTabKey === '3') {
			if (gridRefs3Popup.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			// 목록 초기화
			gridRefs3Popup.current.clearGridData();

			const params = {
				excptDate: searchParam.excptDate.format('YYYY'),
			};

			apiGetPopupMasterList3(params).then(res => {
				setGridData3Popup(res.data);
				setTotalCnt3Popup(res.data.length);
			});
		}
	};

	/**
	 * 마스터설정 저장 event
	 * @param itemList
	 */
	const savePopupMasterHandler = (itemList: any) => {
		if (currentTabKey === '1') {
			gridRefs1Popup.current.showConfirmSave(() => {
				gridRefs1Popup.current.clearGridData();

				const insertList: any[] = [];
				const updateList: any[] = [];
				const deleteList: any[] = [];

				itemList.forEach((item: any) => {
					if (item.rowStatus === 'I') {
						insertList.push(item);
					} else if (item.rowStatus === 'U') {
						updateList.push(item);
					} else if (item.rowStatus === 'D') {
						deleteList.push(item);
					}
				});

				const params = {
					insertPopupMasterList: insertList,
					updatePopupMasterList: updateList,
					deletePopupMasterList: deleteList,
				};

				apiSavePopupMasterList(params).then(res => {
					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
							modalType: 'info',
						});

						// 재조회
						searchMasterList();
					}
				});
			});
		} else if (currentTabKey === '2') {
			gridRefs2Popup.current.showConfirmSave(() => {
				gridRefs2Popup.current.clearGridData();
				const insertList: any[] = [];
				const updateList: any[] = [];
				const deleteList: any[] = [];

				itemList.forEach((item: any) => {
					if (item.rowStatus === 'I') {
						insertList.push(item);
					} else if (item.rowStatus === 'U') {
						updateList.push(item);
					} else if (item.rowStatus === 'D') {
						deleteList.push(item);
					}
				});

				const params = {
					insertPopupMasterList: insertList,
					updatePopupMasterList: updateList,
					deletePopupMasterList: deleteList,
				};

				apiSavePopupMasterList2(params).then(res => {
					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
							modalType: 'info',
						});

						// 재조회
						searchMasterList();
					}
				});
			});
		} else if (currentTabKey === '2') {
			gridRefs2Popup.current.showConfirmSave(() => {
				gridRefs2Popup.current.clearGridData();
				const insertList: any[] = [];
				const updateList: any[] = [];
				const deleteList: any[] = [];

				itemList.forEach((item: any) => {
					if (item.rowStatus === 'I') {
						insertList.push(item);
					} else if (item.rowStatus === 'U') {
						updateList.push(item);
					} else if (item.rowStatus === 'D') {
						deleteList.push(item);
					}
				});

				const params = {
					insertPopupMasterList: insertList,
					updatePopupMasterList: updateList,
					deletePopupMasterList: deleteList,
				};

				apiSavePopupMasterList2(params).then(res => {
					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
							modalType: 'info',
						});

						// 재조회
						searchMasterList();
					}
				});
			});
		} else if (currentTabKey === '3') {
			gridRefs3Popup.current.showConfirmSave(() => {
				gridRefs3Popup.current.clearGridData();
				const insertList: any[] = [];
				const updateList: any[] = [];
				const deleteList: any[] = [];

				itemList.forEach((item: any) => {
					if (item.rowStatus === 'I') {
						insertList.push(item);
					} else if (item.rowStatus === 'U') {
						updateList.push(item);
					} else if (item.rowStatus === 'D') {
						deleteList.push(item);
					}
				});

				const params = {
					insertPopupMasterList3: insertList,
					updatePopupMasterList3: updateList,
					deletePopupMasterList3: deleteList,
				};

				apiSavePopupMasterList3(params).then(res => {
					if (res.statusCode === 0) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
							modalType: 'info',
						});

						// 재조회
						searchMasterList();
					}
				});
			});
		}
	};

	/**
	 * 탭 목록
	 * @param key
	 */
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.DCCODE_TASK_MNG'), // 센터업무관리
			children: (
				<KpDailyUnloadMasterPopupDetail1
					ref={gridRefs1Popup}
					data={gridData1Popup}
					totalCnt={totalCnt1Popup}
					dsDccode={dsDccode}
					dsDailyU1={dsDailyU1}
					today={today}
					dayEndofYear={dayEndofYear}
					onSaveHandler={savePopupMasterHandler}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.DCCODE_TASK_MNGEXCPT'), // 센터업무관리(예외)
			children: (
				<KpDailyUnloadMasterPopupDetail2
					ref={gridRefs2Popup}
					data={gridData2Popup}
					totalCnt={totalCnt2Popup}
					dsDccode={dsDccode}
					dsDailyU1={dsDailyU1}
					today={today}
					onSaveHandler={savePopupMasterHandler}
				/>
			),
		},
		{
			key: '3',
			label: t('lbl.ASSORTPICKCUST_EXCPT'), // 분류피킹 제외대상 고객
			children: (
				<KpDailyUnloadMasterPopupDetail3
					ref={gridRefs3Popup}
					data={gridData3Popup}
					totalCnt={totalCnt3Popup}
					dsDccode={dsDccode}
					today={today}
					onSaveHandler={savePopupMasterHandler}
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
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle
				func={titleFunc}
				name={t('lbl.DAILY_PRODUCTIVITY_UNLOAD_MASTER_MNG')} // 데일리생산성(하역) 마스터 설정
			/>

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchFormPopup} initialValues={searchBox}>
				<KpDailyUnloadMasterPopupSearch form={searchFormPopup} currentTabKey={currentTabKey} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<Tabs
				defaultActiveKey="1"
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
});

export default KpDailyUnloadMasterPopup;
