// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils
import Constants from '@/util/constants';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function
import { apiGetUserPopupList } from '@/api/cm/apiCmSearch';
import AGrid from '@/assets/styled/AGrid/AGrid';
import TotalCount from '@/assets/styled/Container/TotalCount';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	callBack?: any;
	searchName?: string;
	selectionMode?: string;
	close?: any;
}

const CmUserPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, selectionMode, close } = props;

	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const [popupForm] = Form.useForm(); // 팝업 내부 폼
	const gridRef = useRef<any>(); // 그리드 Ref
	const [popupList, setPopupList] = useState<any[]>([]);
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지
	const [totalCountState, setTotalCountState] = useState(0); // 총 개수
	const [dataToAppend, setDataToAppend] = useState<any[]>([]); // 새로 추가할 데이터 (스크롤 시)
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.USER_ID'), // 사용자ID
			dataField: 'userIdDisp',
		},
		{
			headerText: t('lbl.USER_ID'), // 사용자ID
			dataField: 'userId',
			visible: false,
		},
		{
			headerText: t('lbl.USER_NM'), // 사용자명
			dataField: 'userNm',
		},
		{
			headerText: t('lbl.EMPLOYEE_TP'), // 사원구분
			dataField: 'empType',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('EMPTYPE', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.DEPARTMENT'), // 부서
			dataField: 'department',
		},
		{
			headerText: t('lbl.CELLULAR'), // 핸드폰번호
			dataField: 'handphoneNo',
		},
		{
			headerText: t('lbl.EMAIL_CNT'), // 이메일
			dataField: 'mailId',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: selectionMode,
		showRowCheckColumn: selectionMode === 'multipleRows',
		enableRowCheck: selectionMode === 'multipleRows',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */
	const fetchGridData = (isSearchButtonClicked = false) => {
		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		if (isSearchButtonClicked) {
			setCurrentPageScr(1);
			gridRef.current?.clearGridData();
		}

		const params = {
			userId: popupForm.getFieldValue('userId') || '',
			userNm: popupForm.getFieldValue('userNm') || '',
			startRow: (currentPageScr - 1) * 100,
			listCount: 100,
		};

		const apiResult = apiGetUserPopupList(params);
		if (apiResult) {
			apiResult.then((res: any) => {
				// 모든 데이터 항목에 _checked: false 속성 추가
				const processedList = res.data.list?.map((item: any) => ({ ...item, _checked: false })) ?? [];

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
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		fetchGridData(true); // 검색 버튼 클릭 시 true 전달하여 페이지 리셋
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		fetchGridData(true); // 새로고침 시 true 전달하여 페이지 리셋
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
		refresh: onClickRefreshButton,
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		let checkedRow = gridRef.current.getCheckedRowItemsAll();
		if (selectionMode === 'singleRow') {
			checkedRow = gridRef.current.getSelectedRows();
		}
		if (checkedRow.length === 0) {
			close();
			return;
		}
		callBack(checkedRow);
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
		fetchGridData(true);
	}, [searchName, selectionMode]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	// 스크롤 이벤트
	useScrollPagingAUIGrid({
		gridRef,
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
		if (!gridRef.current) return; // 그리드 Ref가 없으면 리턴

		if (currentPageScr === 1 && popupList.length > 0) {
			gridRef.current?.setGridData(popupList); // 첫 페이지 조회 또는 검색 시: setGridData로 전체 데이터 교체
		} else if (dataToAppend.length > 0) {
			gridRef.current?.appendData(dataToAppend); // 스크롤 시: appendData로 데이터 추가
		}

		// 조회된 결과에 맞게 칼럼 넓이를 구하고 적용 시킴.
		const colSizeList = gridRef.current?.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current?.setColumnSizeList(colSizeList);
	}, [popupList]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="사용자 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								label={t('lbl.USER_ID')} // 사용자ID
								width={80}
								name="userId"
								placeholder={t('msg.placeholder2', [t('lbl.USER_ID')])}
								onPressEnter={onClickSearchButton}
							/>
						</li>

						<li>
							<InputText
								label={t('lbl.USER_NM')} // 사용자명
								width={80}
								name="userNm"
								placeholder={t('msg.placeholder2', [t('lbl.USER_NM')])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCountState)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmUserPopup;
