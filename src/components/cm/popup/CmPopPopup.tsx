/*
 ############################################################################
 # FiledataField : CmPopPopup.tsx
 # Description   : POP 조회 팝업
 # Author        : YeoSeungCheol
 # Since         : 25.06.16
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils
import Constants from '@/util/constants';

// Store
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiGetPopList } from '@/api/cm/apiCmPop';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	callBack?: any;
	searchName?: string;
	selectionMode?: string;
	customDccode?: string; // 커스텀 물류센터 코드
	close?: any;
}

const CmPopPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, selectionMode, close, customDccode } = props;

	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const [popupForm] = Form.useForm(); // 팝업 내부 폼
	const gridRef = useRef<any>(); // 그리드 Ref
	const [popupList, setPopupList] = useState<any[]>([]);
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지
	const [totalCountState, setTotalCountState] = useState(0); // 총 개수
	const [dataToAppend, setDataToAppend] = useState<any[]>([]); // 새로 추가할 데이터 (스크롤 시)
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const [searchBox] = useState({
		popCode: '',
		multiSelect: '',
	});

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			// 물류센터코드
			headerText: t('lbl.DCCODE'),
			dataField: 'dcCode',
			dataType: 'code',
		},
		{
			// 물류센터명
			headerText: t('lbl.DCNAME'),
			dataField: 'dcName',
			dataType: 'string',
		},
		{
			// POP
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataField: 'popCode',
			dataType: 'code',
		},
		{
			// 권역명
			headerText: t('lbl.DISTRICTNAME'),
			dataField: 'districtName',
			dataType: 'string',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: true,
		enableRowCheck: true,
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
		const dccode = popupForm.getFieldValue('dcCodeSelect');
		const popCode = popupForm.getFieldValue('popCode');
		const multiSelect = popupForm.getFieldValue('multiSelect');

		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		if (isSearchButtonClicked) {
			setCurrentPageScr(1);
			gridRef.current?.clearGridData();
		}

		const params = {
			dcCode: dccode,
			popCode: popCode,
			multiSelect: multiSelect,
			startRow: (currentPageScr - 1) * pageSizeScr,
			listCount: pageSizeScr,
		};

		const apiResult = apiGetPopList(params);
		if (apiResult) {
			apiResult.then((res: any) => {
				// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
				// const processedList = res.data.list?.map((item: any) => ({ ...item, _checked: false })) ?? [];
				const processedList = (res.data || []).map((item: any) => ({ ...item, _checked: false }));

				if (isSearchButtonClicked) {
					// 검색 버튼 클릭 또는 초기 로드 시: 페이지 리셋, 총 개수 업데이트
					setCurrentPageScr(1); // 페이지 상태 1로 리셋
					// [페이징 로직 제거] 기존: res.data.totalCount 변경: res.data.length
					// setTotalCountState(res.data.totalCount ?? 0);
					setTotalCountState(res.data?.length ?? 0); // 총 개수 업데이트
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
		popupForm.setFieldsValue({ dcCodeSelect: user?.defDccode, popCode: '', multiSelect: '' }); // 물류센터 기본값으로 재설정
		setMultiSelectCount(0);
		fetchGridData(true); // 새로고침 시 true 전달하여 페이지 리셋
	};

	const onChangeMultiSelect = (e: any) => {
		let value = e.target.value;
		if (value === '') {
			setMultiSelectCount(0);
			return;
		}

		//value 제일 끝 문자가 ','로 끝나면 제거하고 카운트
		if (value.endsWith(',')) {
			value = value.slice(0, -1);
		}

		const multiCnt = value.split(',').length;

		// 다중선택 개수 증가 예정
		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
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
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain');
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// 중복 문자열 제거
		transformedText = [...new Set(transformedText.split(','))].join(',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
		popupForm.setFieldsValue({ multiSelect: transformedText });
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 팝업 열릴 때 초기 데이터 로드 및 물류센터 목록 조회
	 */
	useEffect(() => {
		//popupForm.setFieldsValue({ dcCodeSelect: user?.defDccode }); // 물류센터 기본값 설정
		// 2025.10.23 김동한 물류센터 파라미터가 있는 경우 파라미터를 우선으로 처리
		popupForm.setFieldsValue({ dcCodeSelect: customDccode || user?.defDccode }); // 물류센터 기본값 설정
		fetchGridData(true); // 초기 데이터 로드 (페이지 리셋)
	}, [user?.defDccode]); // user?.defDccode 변경 시 재실행

	/**
	 * 부모페이지의 검색어를 가져와 초기 값 설정
	 */
	useEffect(() => {
		if (searchName) {
			if (selectionMode === 'multipleRows' && searchName.split(',').length > 1) {
				popupForm.setFieldValue('multiSelect', searchName);
				setMultiSelectCount(searchName.split(',').length);
			} else {
				popupForm.setFieldValue('popCode', searchName);
			}
			fetchGridData(true);
		}
	}, [searchName, selectionMode]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

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
			<PopupMenuTitle name="POP 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<SelectBox
								label={t('lbl.DCCODE')} // 물류센터
								width={80}
								name="dcCodeSelect"
								options={getUserDccodeList('')}
								fieldNames={{ label: 'dcname', value: 'dccode' }}
								initval={user?.defDccode} // 사용자 기본 물류센터 코드로 초기화
								disabled={true}
							/>
						</li>

						<li>
							<InputText
								label={t('lbl.LBL_DELIVERYGROUP')} // POP
								width={80}
								name="popCode"
								placeholder={t('msg.placeholder2', [t('lbl.DELIVERYGROUP_WD')])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								name="multiSelect"
								onPaste={handlePaste}
								disabled={selectionMode === 'singleRow'}
								label={'다중선택'}
								onChange={onChangeMultiSelect}
								onPressEnter={onClickSearchButton}
								count={{
									show: true,
									max: 5000,
									strategy: () => multiSelectCount,
								}}
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

export default CmPopPopup;
