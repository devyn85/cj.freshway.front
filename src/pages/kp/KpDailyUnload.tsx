/*
 ############################################################################
 # FiledataField	: KpDailyUnload.tsx
 # Description		: 지표 > 생산성 > 데일리 생산성 하역 지표 관리
 # Author					: JiHoPark
 # Since					: 2026.01.19.
 ############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import KpDailyUnloadSearch from '@/components/kp/dailyUnload/KpDailyUnloadSearch';

import KpDailyUnloadDatail1 from '@/components/kp/dailyUnload/KpDailyUnloadDatail1';
import KpDailyUnloadDatail2 from '@/components/kp/dailyUnload/KpDailyUnloadDetail2';

// Util
import dayjs from 'dayjs';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiGetMasterList, apiSaveMasterList } from '@/api/kp/apiKpDailyUnload';

// Hooks

// type

// asset

const KpDailyUnload = () => {
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

	// 글로벌 변수
	const gDccode = useAppSelector(state => state.global.globalVariable.gDccode);

	// 탭 key
	const [currentTabKey, setCurrentTabKey] = useState('1');

	const [dailyColumns, setDailyColumns] = useState([]);

	// 투입인원 인원 수정 목록
	const modifyList = useRef<any>([]);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode1: gDccode,
		dccode2: gDccode,
		deliverydtFromTo: [dayjs(), dayjs()], // 일자
		deliverydt: dayjs(), // 일자
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
	 * 그리드 수정 데이터 목록
	 * @param item
	 */
	const onModifyListHandler = (item: any) => {
		modifyList.current = [...modifyList.current, item];
	};

	/**
	 * 그리드 일자 컬럼 설정
	 * @param beginDt 시작일자
	 * @param endDt 종료일자
	 */
	const getDailyColumn = (beginDt: number, endDt: number) => {
		const columnObj = [];

		for (let i = beginDt; i <= endDt; i++) {
			const prefix = 'd' + String(i).padStart(2, '0');
			columnObj.push({
				headerText: i + '일',
				children: [
					{
						headerText: t('lbl.PERSONNUM') /*투입인원*/,
						dataField: prefix + 'Workperson',
						dataType: 'numeric',
						editable: true,
						width: 70,
						editRenderer: {
							type: 'InputEditRenderer',
							onlyNumeric: true, // 0~9 까지만 허용
							allowNegative: false, //음수허용
						},
					},
					{
						headerText: t('lbl.WORKMM'),
						/*인시*/ dataField: prefix + 'Workmm',
						dataType: 'numeric',
						editable: false,
						width: 70,
					},
				],
			});
		}

		setDailyColumns(columnObj);
	};

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		const searchParam = searchForm.getFieldsValue();

		if (currentTabKey === '1') {
			if (gridRefs1.current.getChangedData({ validationYn: false })?.length > 0) {
				// 그리드 수정여부 체크
				const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
				if (!isConfirm) return;
			}

			const fromDate = searchParam.deliverydtFromTo[0];
			const toDate = searchParam.deliverydtFromTo[1];

			// 동일한 년월이 아니면 조회 불가
			if (fromDate.format('YYYYMM') !== toDate.format('YYYYMM')) {
				showMessage({
					content: t('msg.MSG_COM_VAL_239'), // 동일한 년월의 기간으로만 조회가 가능합니다.
					modalType: 'info',
				});
				return;
			}

			// 목록 초기화
			gridRefs1.current.clearGridData();

			const params = {
				dccode: searchParam.dccode1,
				yyyymm: fromDate.format('YYYYMM'),
				deliverydtFrom: fromDate.format('YYYYMMDD'),
				deliverydtTo: toDate.format('YYYYMMDD'),
			};

			apiGetMasterList(params).then(res => {
				// 수정 목록 초기화
				modifyList.current = [];

				// 일자 column 설정
				getDailyColumn(fromDate.date(), toDate.date());

				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			});
		} else if (currentTabKey === '2') {
			const params = {
				dccode: searchParam.dccode2,
				deliverydt: searchParam.deliverydt.format('YYYYMM'),
			};
		}
	};

	/**
	 * 저장 event
	 * @param saveList
	 */
	const saveMaster = (saveList: any) => {
		// 저장하시겠습니까?\n(신규 : {{0}}건, 수정 : {{1}}건, 삭제 : {{2}}건)
		showConfirm(null, t('msg.MSG_COM_VAL_207', [0, saveList.length, 0]), () => {
			const arrSave: any = [];
			gridRefs1.current.clearGridData();

			// 변경된 목록 그룹화 시킴
			const result = Object.groupBy(modifyList.current, (item: any) => Object.keys(item)[0]);

			for (const key in result) {
				// 변경 목록 중복제거
				const arrUnique = [...new Map(result[key].map(item => [item[key], item])).values()];

				const saveItem = saveList.find((item: any) => {
					return item.serialkey == key;
				});

				if (saveItem) {
					for (const value of arrUnique) {
						const findKey = value[key];
						const item = {
							orgSerialkey: key,
							dccode: saveItem['dccode'],
							deliverydt: saveItem['yyyymm'] + findKey.slice(1, 3),
							gubun1: saveItem['gubun1'],
							gubun2: saveItem['gubun2'],
							gubun3: saveItem['gubun3'],
							fromHour: saveItem['fromHour'],
							toHour: saveItem['toHour'],
							worktime: saveItem['worktime'],
							workperson: saveItem[findKey],
						};

						arrSave.push(item);
					}
				}
			}

			const param = {
				saveMasterList: arrSave,
			};

			apiSaveMasterList(param).then(res => {
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
	};

	/**
	 * 탭 목록
	 * @param key
	 */
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.PERSONNUM'), // 투입인원
			children: (
				<KpDailyUnloadDatail1
					ref={gridRefs1}
					form={gridForm}
					data={gridData1}
					totalCnt={totalCnt1}
					saveMaster={saveMaster}
					dailyColumns={dailyColumns}
					onModifyListHandler={onModifyListHandler}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.DELIVERYWEIGHT_LABEL_TIME'), // 물량/라벨/시간
			children: <KpDailyUnloadDatail2 ref={gridRefs2} form={gridForm} data={gridData2} totalCnt={totalCnt2} />,
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

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<KpDailyUnloadSearch form={searchForm} currentTabKey={currentTabKey} />
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
};

export default KpDailyUnload;
