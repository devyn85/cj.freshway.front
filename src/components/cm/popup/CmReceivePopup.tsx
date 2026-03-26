/*
 ############################################################################
 # FiledataField	: CmReceivePopup.tsx
 # Description		: 수신처 검색 팝업
 # Author			: KimJiSoo
 # Since			: 25.09.19
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
const { TabPane } = Tabs;

// utils
import Constants from '@/util/constants';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiGetRcvGrpHeaderList } from '@/api/cm/apiCmReceiveGroup';
import { apiGetUserPopupList } from '@/api/cm/apiCmSearch';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	callBack?: any;
	searchName?: string;
	selectionMode?: string;
	close?: any;
	defaultActiveKey?: string;
	tab1Disabled?: boolean;
}

const CmReceivePopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { callBack, searchName, selectionMode, close, defaultActiveKey = '1', tab1Disabled = false } = props;
	const { t } = useTranslation();

	const [popupForm] = Form.useForm(); // 팝업 내부 폼
	const gridRef1 = useRef<any>(); // 그리드 Ref
	const gridRef2 = useRef<any>(); // 그리드 Ref
	const [popupList, setPopupList] = useState<any[]>([]);
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지
	const [totalCountState, setTotalCountState] = useState(0); // 총 개수
	const [dataToAppend, setDataToAppend] = useState<any[]>([]); // 새로 추가할 데이터 (스크롤 시)
	const [activeKey, setActiveKey] = useState(defaultActiveKey);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	const emptypeList = getCommonCodeList('EMPTYPE2', '전체', '');

	const gridCol1 = [
		{
			headerText: t('유형'), // 수신처유형
			dataField: 'rcvcustType',
			editable: false,
			// editable 막기위해 사용
			editRenderer: {
				type: 'DropDownListRenderer',
				// list: getCommonCodeList('DEL_YN'),
				list: [
					{
						comCd: 'R',
						cdNm: '수신그룹',
					},
					{
						comCd: 'U',
						cdNm: '사용자',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === 'R' ? '수신그룹' : '사용자';
			},
		},
		{
			headerText: t('공지그룹명'), // 수신그룹
			dataField: 'recvGroupNm',
		},
		{
			headerText: t('비고'), // 메모
			dataField: 'memo',
		},
	];

	const gridProps = {
		showRowCheckColumn: true,
	};

	// 그룹 상세 그리드 칼럼 레이아웃 설정
	const gridCol2 = [
		{
			headerText: t('유형'), // 수신처유형
			dataField: 'rcvcustType',
			editable: false,
			// editable 막기위해 사용
			editRenderer: {
				type: 'DropDownListRenderer',
				// list: getCommonCodeList('DEL_YN'),
				list: [
					{
						comCd: 'R',
						cdNm: '수신그룹',
					},
					{
						comCd: 'U',
						cdNm: '사용자',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === 'R' ? '수신그룹' : '사용자';
			},
		},
		{
			headerText: t('소속'), // 소속
			dataField: 'empType',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return emptypeList.filter((empType: any) => empType.comCd === value).map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('lbl.DEPARTMENT'), // 부서
			dataField: 'department',
		},
		{
			headerText: t('lbl.USER_ID'), // 사용자ID
			dataField: 'userIdDisp',
		},
		{
			headerText: t('lbl.USER_NM'), // 사용자명
			dataField: 'userNm',
		},
		// {
		// 	headerText: t('lbl.CELLULAR'), // 핸드폰번호
		// 	dataField: 'handphoneNo',
		// },
		// {
		// 	headerText: t('lbl.EMAIL_CNT'), // 이메일
		// 	dataField: 'mailId',
		// },
	];
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKey('1');
			gridRef1.current?.resize('100%', '100%');
		} else {
			setActiveKey('2');
			gridRef2.current?.resize('100%', '100%');
		}
		return;
	};

	/**
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */
	const fetchGridData = (isSearchButtonClicked = false) => {
		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		if (isSearchButtonClicked) {
			setCurrentPageScr(1);
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
		}

		const params = {
			userId: popupForm.getFieldValue('userId') || '',
			empType: popupForm.getFieldValue('empType') || '',
			depthrNm: popupForm.getFieldValue('depthrNm') || '',
			userNm: popupForm.getFieldValue('userNm') || '',
			recvGroupNm: popupForm.getFieldValue('recvGroupNm') || '',
			startRow: (currentPageScr - 1) * pageSizeScr,
			listCount: pageSizeScr,
		};

		if (1 === 1) {
			// 추가적인 처리 로직 필요 시 여기에 작성
		}

		const apiResult = activeKey === '1' ? apiGetRcvGrpHeaderList(params) : apiGetUserPopupList(params);
		if (apiResult) {
			apiResult.then((res: any) => {
				// 모든 데이터 항목에 _checked: false 속성 추가
				const processedList =
					activeKey === '1'
						? res.data?.map((item: any) => ({ ...item, rcvcustType: 'R' }))
						: res.data.list?.map((item: any) => ({ ...item, rcvcustType: 'U' })) ?? [];

				if (isSearchButtonClicked) {
					// 검색 버튼 클릭 또는 초기 로드 시: 페이지 리셋, 총 개수 업데이트
					setCurrentPageScr(1); // 페이지 상태 1로 리셋
					setTotalCountState(res.data.totalCount ?? 0); // 총 개수 업데이트
					setPopupList(processedList); // 전체 데이터 목록 업데이트
					setDataToAppend([]); // 초기 로드 시 dataToAppend 초기화
				} else {
					// 스크롤 시: 새로 받아온 데이터만 dataToAppend에 설정, 전체 데이터 목록 누적
					setDataToAppend(processedList); // 새로 받아온 데이터만 설정
					setPopupList(prev => [...prev, ...processedList]); // 전체 데이터 목록 누적
				}
			});
		}
	};
	/**
	 * 확인 버튼 클릭
	 */
	const onClickConfirmButton = () => {
		if (callBack && callBack instanceof Function) {
			const selectedRow1 = gridRef1.current?.getCheckedRowItemsAll() || [];
			const selectedRow2 = gridRef2.current?.getCheckedRowItemsAll() || [];
			const selectedRow = [...selectedRow1, ...selectedRow2];
			callBack(selectedRow);
		}
		close();
	};

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		fetchGridData(true);
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		popupForm.resetFields();
		fetchGridData(true);
	};

	// 타이틀 func
	const titleFunc = {
		refresh: onClickRefreshButton,
		searchYn: onClickSearchButton,
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow1 = gridRef1.current?.getSelectedRows() || [];
		const selectedRow2 = gridRef2.current?.getSelectedRows() || [];
		const selectedRow = [...selectedRow1, ...selectedRow2];

		callBack(selectedRow);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 부모페이지의 검색어를 가져와 초기 값 설정
	 */
	useEffect(() => {
		if (!tab1Disabled) {
			// 사용자 TAB 초기 검색 안되게 수정
			fetchGridData(true);
		}
	}, [searchName, selectionMode]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef1.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});

		gridRef2.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, [selectRowData]);

	// 스크롤 이벤트
	useScrollPagingAUIGrid({
		gridRef: gridRef1,
		callbackWhenScrollToEnd: () => {
			setCurrentPageScr((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCountState,
	});
	useScrollPagingAUIGrid({
		gridRef: gridRef2,
		callbackWhenScrollToEnd: () => {
			setCurrentPageScr((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCountState,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (currentPageScr > 1) {
			fetchGridData(false); // 스크롤 시 데이터 추가 (페이지 리셋 안함)
		}
	}, [currentPageScr]);

	// popupList 변경 시 그리드 데이터 업데이트 및 컬럼 사이즈 조정
	useEffect(() => {
		if (!gridRef1.current && !gridRef2.current) return; // 그리드 Ref가 없으면 리턴

		if (currentPageScr === 1 && popupList.length > 0) {
			activeKey === '1' ? gridRef1.current?.setGridData(popupList) : gridRef2.current?.setGridData(popupList); // 첫 페이지 조회 또는 검색 시: setGridData로 전체 데이터 교체
		} else if (dataToAppend.length > 0) {
			activeKey === '1' ? gridRef1.current?.appendData(dataToAppend) : gridRef2.current?.appendData(dataToAppend); // 스크롤 시: appendData로 데이터 추가
		}

		// 조회된 결과에 맞게 칼럼 넓이를 구하고 적용 시킴.
		const colSizeList1 = gridRef1.current?.getFitColumnSizeList(true);
		const colSizeList2 = gridRef2.current?.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef1.current?.setColumnSizeList(colSizeList1);
		gridRef2.current?.setColumnSizeList(colSizeList2);
	}, [popupList]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('공지대상 추가')} func={titleFunc} />

			{/* 그리드 영역 */}
			<AGrid>
				<Tabs defaultActiveKey={defaultActiveKey} activeKey={activeKey} onTabClick={tabClick}>
					<TabPane tab={t('공지대상 그룹')} key="1" disabled={tab1Disabled}>
						{/* 조회 컴포넌트 */}
						<SearchForm form={popupForm} isAlwaysVisible>
							{/*2행*/}
							<UiFilterArea>
								<UiFilterGroup className="grid-column-2">
									<li>
										<InputText name="recvGroupNm" label={t('공지그룹명')} onPressEnter={onClickSearchButton} />
									</li>
								</UiFilterGroup>
							</UiFilterArea>
						</SearchForm>

						<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps} />
					</TabPane>
					<TabPane tab={t('lbl.USER')} key="2">
						{/* 조회 컴포넌트 */}
						<SearchForm form={popupForm} isAlwaysVisible>
							{/*2행*/}
							<UiFilterArea>
								<UiFilterGroup className="grid-column-2">
									<li>
										<SelectBox
											name="empType"
											label={'소속'}
											initval={''}
											options={emptypeList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText label={t('부서')} name="depthrNm" onPressEnter={onClickSearchButton} />
									</li>
									<li>
										<InputText
											label={t('lbl.USER_NM')} // 사용자명
											name="userNm"
											onPressEnter={onClickSearchButton}
										/>
									</li>
								</UiFilterGroup>
							</UiFilterArea>
						</SearchForm>
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps} />
					</TabPane>
				</Tabs>
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={onClickConfirmButton}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmReceivePopup;
