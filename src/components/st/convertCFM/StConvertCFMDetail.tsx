/*
 ############################################################################
 # FiledataField	: StConvertCFMDetail.tsx
 # Description		: 중계영업확정처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostDetailList, apiPostSaveMasterList } from '@/api/st/apiStConvertCFM';

import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import StConvertCFMDetailConfirm from '@/components/st/convertCFM/StConvertCFMDetailConfirm';
import StConvertCFMDetailReject from '@/components/st/convertCFM/StConvertCFMDetailReject';

interface StConvertCFMDetailProps {
	fixdccode: any;
	gridData: any;
	totalCount: any;
	searchForm: any;
	callBackFn: any;
}

const StConvertCFMDetail = forwardRef((props: StConvertCFMDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 그리드 데이터
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// 탭 번호
	const currentTabItem = useRef('1');
	const [activeTabKey, setActiveTabKey] = useState('1');

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 진행상태 컬럼 표시
	const exdcAutoStatusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_AUTO_STATUS', value)?.cdNm;
	};

	// 구매유형 컬럼 표시
	const exdcOrderTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_ORDERTYPE', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'mapkeyNo',
			headerText: t('lbl.POREQNO'), //구매요청번호
			editable: false,
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCINFO'), //문서정보
			children: [
				{
					dataField: 'pokey',
					headerText: t('lbl.NORMAL_PONO'), //정상구매번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'dpSourcekey',
					headerText: t('lbl.ADJ_PONO'), //조정구매번호
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.DTINFO'), //일자정보
			children: [
				{
					dataField: 'deliverydate',
					headerText: t('lbl.DOCDT_DP'), //입고일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'docdt',
					headerText: t('lbl.CREATEDATE'), //생성일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CUSTINFO_PARTNER'), //협력사정보
			children: [
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.VENDOR'), //협력사코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromCustname',
					headerText: t('lbl.VENDORNAME'), //협력사명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.ORGANIZEINFO'), //창고정보
			children: [
				{
					dataField: 'organize',
					headerText: t('lbl.ORGANIZE'), //창고코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'organizename',
					headerText: t('lbl.ORGANIZENAME'), //창고명
					editable: false,
				},
			],
		},

		{
			dataField: 'createwhoNm',
			headerText: t('lbl.CREATEWHO'), //생성인
			dataType: 'manager',
			managerDataField: 'createwho',
			editable: false,
		},

		{
			dataField: 'regwhoNm',
			headerText: t('lbl.REGISTER'), //등록자
			dataType: 'manager',
			managerDataField: 'regwho',
			editable: false,
		},
		{
			dataField: 'regdate',
			headerText: t('lbl.REGDATTM'), //등록일시
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'lastwhoNm',
			headerText: t('lbl.CONFIRMWHO'), //확정자
			dataType: 'manager',
			managerDataField: 'lastwho',
			editable: false,
		},
		{
			dataField: 'lastdate',
			headerText: t('lbl.CONFIRMDATE'), //확정일시
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'serialinfoCfmYn',
			headerText: t('lbl.STATUS_DP'), //진행상태
			labelFunction: exdcAutoStatusLabelFunc,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'exdcrateYn',
			headerText: t('lbl.EXDCRATE_YN'), //요율등록여부
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'createwho',
			visible: false,
		},
		{
			dataField: 'regwho',
			visible: false,
		},
		{
			dataField: 'lastwho',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		height: '100%',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.bgcolor === 'gray') {
				if (item.fontcolor === 'red') {
					return 'bg-gray-red';
				} else {
					return 'bg-gray';
				}
			} else if (item.bgcolor === 'pink') {
				if (item.fontcolor === 'red') {
					return 'bg-pink-red';
				} else {
					return 'bg-pink';
				}
			} else if (item.fontcolor === 'red') {
				return 'color-danger';
			}
			return '';
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세 목록을 조회한다.
	 * @param {any} tabItem 확정/반려 탭 순번
	 */
	const searchDetailList = async (tabItem: any) => {
		const rows = ref.gridRef.current?.getSelectedItems(true);
		const item = rows[0]?.item;

		if (item) {
			// 조회 조건 설정
			const searchParams = dataTransform.convertSearchData(props.searchForm.getFieldsValue());
			const params = {
				dccode: item.dccode,
				slipdtFrom: dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'),
				slipdtTo: dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'),
				mapDiv: props.searchForm.getFieldValue('mapDiv'),
				mapkeyNo: item.mapkeyNo,
				pokey: item.pokey,
				cfmType: tabItem === '1' ? 'C' : 'R',
			};

			if (tabItem === '1') {
				const res = await apiPostDetailList(params);
				setGridData2(res.data);
			} else {
				const res = await apiPostDetailList(params);
				setGridData3(res.data);
			}
		}
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		let checkedItems: any[] = [];
		if (currentTabItem.current === '1') {
			checkedItems = ref.gridRef2.current?.getCheckedRowItemsAll();
		} else {
			checkedItems = ref.gridRef3.current?.getCheckedRowItemsAll();
		}

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				fixdccode: props.fixdccode,
				mapDiv: props.searchForm.getFieldValue('mapDiv'),
				saveList: checkedItems,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 탭 변경 이벤트
	 * @param {string} key
	 */
	const onChangeTab = (key: string) => {
		currentTabItem.current = key;
		setActiveTabKey(key);

		if (key === '1') {
			ref.gridRef2?.current?.resize();
		} else if (key === '2') {
			ref.gridRef3?.current?.resize();
		}

		setTimeout(() => {
			searchDetailList(key);
		}, 50);
	};

	/**
	 * 그리드 버튼 함수 설정. 마스터 그리드.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 마스터 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			return;
		});

		/**
		 * 마스터 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('selectionConstraint', (event: any) => {
			if (event.rowIndex !== event.toRowIndex) {
				// 선택된 행의 상세 정보를 조회한다.
				setTimeout(() => {
					searchDetailList(currentTabItem.current);
				}, 50);
			}
		});

		/**
		 * 확정 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			return;
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		// * 그리드 이벤트 바인딩은 최초 1회만 수행한다.
		initEvent();
	}, []);

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		form.setFieldsValue({
			taskdtAj: dayjs(),
		});
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		// * ref.gridRef를 의존성에 포함하면 render마다 ref 객체/내부값 변화로 재실행될 수 있어 제외한다.
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.();
		ref.gridRef2?.current?.resize?.();
		ref.gridRef3?.current?.resize?.();
	}, []);

	// *  탭 목록
	const tabItemList = [
		{
			key: '1',
			label: t('lbl.CONFIRM'),
			children: (
				<StConvertCFMDetailConfirm
					ref={ref}
					gridData={gridData2}
					searchForm={props.searchForm}
					callBackFn={props.callBackFn}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.REJECT'),
			children: (
				<StConvertCFMDetailReject
					ref={ref}
					gridData={gridData3}
					searchForm={props.searchForm}
					callBackFn={props.callBackFn}
				/>
			),
		},
	];

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount} />
						</AGrid>
						<GridAutoHeight id="stConvertCFM-grid">
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<TabsArray
						key="stConvertCFM-tab"
						activeKey={activeTabKey}
						onChange={onChangeTab}
						items={tabItemList.map(item => {
							return {
								label: item.label,
								key: item.key,
								children: item.children,
							};
						})}
					/>,
				]}
			/>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default StConvertCFMDetail;
