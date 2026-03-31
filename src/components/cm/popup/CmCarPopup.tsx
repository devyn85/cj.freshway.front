/*
 ############################################################################
 # FiledataField	: CmCarPopup.tsx
 # Description		: 차량 조회 팝업
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.19
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
// lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
// Utils
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
// Store
import {
	appendGridDataImp,
	applySearchNameToFormImp,
	bindInitImp,
	checkRowDataImp,
	handleMultiSelectChangeImp,
	handlePasteImp,
	onClickSearchButtonImp,
	selectRowDataImp,
} from '@/api/cm/apiCmSearch';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
// API Call Function

interface PropsType {
	callBack?: any;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	apiFunction?: any;
	selectionMode?: string;
	carrierTypeHiddenYn?: string;
	close?: any;
	setCurrentPage?: any;
	pageSizeScr?: number;
	gridRef?: any;
	form?: any;
	name?: string;
	// 팝업파라미터 정의
	customDccode?: string; // 커스텀 물류센터 코드
	totalCount?: number;
	carrierType?: string;
	carnoList?: string[];
}

const CmCarPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// Declare variable(1/4)
	const { t } = useTranslation();
	const [popUpform] = Form.useForm();
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지

	const {
		callBack,
		searchName,
		gridData,
		search,
		selectionMode,
		close,
		setCurrentPage,
		pageSizeScr,
		gridRef,
		form,
		name,
		totalCount,
		// 팝업파라미터 정의
		carrierType,
		carrierTypeHiddenYn = props.carrierTypeHiddenYn || null,
	} = props;

	// form prop 없으면 popUpform 사용
	const activeForm = form ?? popUpform;

	const [searchBox] = useState({
		searchVal: '',
		multiSelect: '',
		contracttype: null, // 계약유형 기본값 설정
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);
	const isInitialMount = useRef(true);

	const gridId = uuidv4() + '_gridWrap';

	// 그리드 칼럼 정의
	const getGridCol = () => {
		return [
			{
				// 차량번호
				headerText: t('lbl.CARNO'),
				dataField: 'code',
				dataType: 'code',
			},
			{
				// 운전자
				headerText: t('lbl.DRIVER'),
				dataField: 'name',
				dataType: 'code', //WEB_026
			},
			{
				// 계약유형
				headerText: t('lbl.CONTRACTTYPE'),
				dataField: 'contracttype',
				dataType: 'code',
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
				},
			},
		];
	};

	// 그리드 속성 정의
	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
	};

	/**
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */
	const fetchGridData = (isSearchButtonClicked = false) => {
		const name = activeForm.getFieldValue('name');
		const multiSelect = activeForm.getFieldValue('multiSelect');
		const contracttype = activeForm.getFieldValue('contracttype');

		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		if (isSearchButtonClicked) {
			setCurrentPage(1);
			gridRef.current?.clearGridData();
		}

		// const params = {
		// 	name: name,
		// 	multiSelect: multiSelect,
		// 	customDccode: customDccode,
		// 	startRow: (currentPageScr - 1) * pageSizeScr,
		// 	listCount: pageSizeScr,
		// };

		const params = {
			name: name,
			multiSelect: multiSelect,
			startRow: (currentPageScr - 1) * pageSizeScr,
			listCount: pageSizeScr,
			// parameter
			customDccode: props.customDccode, // 커스텀 물류센터 코드
		};

		// // API 호출 (실제 API 함수명으로 변경 필요)
		// apiFunction(params).then((res: any) => {
		// 	// 모든 데이터 항목에 _checked: false 속성 추가
		// 	const processedList = res.data.list?.map((item: any) => ({ ...item, _checked: false })) ?? [];

		// 	if (isSearchButtonClicked) {
		// 		// 검색 버튼 클릭 또는 초기 로드 시: 페이지 리셋, 총 개수 업데이트
		// 		setCurrentPageScr(1); // 페이지 상태 1로 리셋
		// 		setTotalCountState(res.data.totalCount ?? 0); // 총 개수 업데이트
		// 		setPopupList(processedList); // 전체 데이터 목록 업데이트
		// 		setDataToAppend([]); // 초기 로드 시 dataToAppend 초기화
		// 	} else {
		// 		// 스크롤 시: 새로 받아온 데이터만 dataToAppend에 설정, 전체 데이터 목록 누적
		// 		setDataToAppend(processedList); // 새로 받아온 데이터만 설정
		// 		setPopupList(prev => [...prev, ...processedList]); // 전체 데이터 목록 누적
		// 	}
		// });
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		onClickSearchButtonImp(setCurrentPage, gridRef, activeForm, name ?? '', search, activeForm.getFieldsValue());
	}, [setCurrentPage, gridRef, activeForm, name, search]);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		activeForm.setFieldsValue({ [name]: '', multiSelect: '', carrierType: null });
		gridRef.current.clearGridData();
	};

	/**
	 * 메뉴 타이틀에 연결할 함수
	 */
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const res = selectRowDataImp(gridRef, callBack, activeForm);
		if (!res.ok) return;
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const res = checkRowDataImp(gridRef, selectionMode ?? '', callBack, close, activeForm);
		if (!res.ok) return;
	};

	/**
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		return handlePasteImp(event, activeForm, setMultiSelectCount, 5000, t);
	};

	/**
	 * 다중선택 입력란 변경 이벤트
	 * @param {any} e 입력 이벤트
	 */
	const onChangeMultiSelect = (e: any) => {
		const res = handleMultiSelectChangeImp(e, setMultiSelectCount, 5000, t);
		if (!res.ok) return;
	};

	/**
	 * 입력값 변경 이벤트
	 * @param {any} e 입력 이벤트
	 */
	const handleInputChange = (e: any) => {
		// Handle input change if needed
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * carrierType prop이 변경될 때 form 값 업데이트
	 */
	useEffect(() => {
		if (activeForm && carrierType) {
			activeForm.setFieldsValue({ carrierType: carrierType });
		}
	}, [carrierType, activeForm]);

	/**
	 * 부모페이지의 검색어를 가져온다.
	 */
	useEffect(() => {
		// 초기 마운트 시에만 searchName 적용 (조회 버튼 클릭 후 재실행 방지)
		if (isInitialMount.current && searchName) {
			if (
				applySearchNameToFormImp(activeForm, name ?? '', searchName ?? '', selectionMode ?? '', onChangeMultiSelect)
			) {
				onClickSearchButton();
			}
			isInitialMount.current = false;
		}
	}, [searchName, activeForm, name, selectionMode, onChangeMultiSelect, onClickSearchButton]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		bindInitImp(gridRef, selectRowData);
	}, []);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시 (공통 구현으로 위임)
	 */
	useEffect(() => {
		bindInitImp(gridRef, selectRowData);
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가 (공통 구현으로 위임)
	useEffect(() => {
		appendGridDataImp(gridRef, gridData);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="차량조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={activeForm} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							{/* 회사 */}
							<SelectBox
								name="contracttype"
								placeholder={t('msg.placeholder2', ['계약유형'])}
								options={getCommonCodeList('CONTRACTTYPE', '전체')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								label={t('lbl.CONTRACTTYPE')}
							/>
						</li>

						<li>
							<InputText
								label={t('lbl.CARNO') + '/' + t('lbl.DRIVER')}
								width={80}
								name="name"
								placeholder={t('msg.MSG_COM_VAL_054', ['차량번호 또는 기사명'])}
								onPressEnter={onClickSearchButton}
								onPaste={handlePaste}
							/>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								name="multiSelect"
								onPaste={handlePaste}
								onChange={onChangeMultiSelect}
								disabled={selectionMode === 'singleRow'}
								label={'다중선택'}
								onPressEnter={onClickSearchButton}
								count={{
									show: true,
									max: 999,
									strategy: () => multiSelectCount || 0,
								}}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 총 갯수 영역 */}
			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={getGridCol()} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
					{/* 취소 */}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
					{/* 확인 */}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmCarPopup;
