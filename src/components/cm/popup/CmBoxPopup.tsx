/*
 ############################################################################
 # FiledataField	: CmBoxPopup.tsx
 # Description		: BOX조회팝업
 # Author			: SSS
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchFormResponsive } from '@/components/common/custom/form';

// util
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
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import commUtil from '@/util/commUtil';
interface PropsType {
	callBack?: any;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	totalCount?: number;
	// 팝업파라미터 정의
}

const CmBoxPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		callBack,
		searchName,
		gridData,
		search,
		selectionMode,
		close,
		setCurrentPage,
		gridRef,
		form,
		name,
		totalCount,
		// 팝업파라미터 정의
	} = props;
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('Box');

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: strPrefixNm + '코드', // 코드
			dataField: 'code',
			dataType: 'code',
		},
		{
			headerText: strPrefixNm + '명', // 명칭
			dataField: 'name',
		},
		// {
		// 	headerText: '시작일자', // 시작일자
		// 	dataField: 'fromdate',
		// },
		// {
		// 	headerText: '종료일자', // 종료일자
		// 	dataField: 'todate',
		// },
	];
	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
		showCustomRowCheckColumn: selectionMode === 'multipleRows',
		fillColumnSizeMode: true,
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
		if (1 == 1) {
			onClickSearchButtonImp(setCurrentPage, gridRef, form, name ?? '', search);
		} else {
			//searchScroll(true, params);
		}
	}, []);

	// searchScroll ->정리할 예정
	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */

	// const searchScroll = throttle((isPopup: boolean, value: string | any) => {
	// 	const tt = currentPage - 1;

	// 	const params: any = {
	// 		name: value,
	// 		// dccode: gDccode,
	// 		dccode: props.customDccode ? props.customDccode : gDccode,
	// 		startRow: 0 + tt * pageSizeScr,
	// 		listCount: pageSizeScr,
	// 		skipCount: currentPage !== 1,
	// 		userNm: props.type === 'user' ? value : '',
	// 		customDccode: props.customDccode ? props.customDccode : '', // 추가: customDccode 파라미터 설정
	// 		...(props.data ?? {}),
	// 	};

	// 	const apiFunction = getSearchPopupApiFunction(props.type);

	// 	if (!apiFunction) {
	// 		return;
	// 	}

	// 	const paramsByType = { ...params };

	// 	if (props.type === 'cust') {
	// 		paramsByType.expandedColumns = 'Y';
	// 		paramsByType.name = value.name || '';
	// 		paramsByType.multiSelect = value.multiSelect || '';
	// 		paramsByType.dlvSearchVal = value.dlvSearchVal || '';
	// 		paramsByType.saleCustSearchVal = value.saleCustSearchVal || '';
	// 		paramsByType.childCustSearchVal = value.childCustSearchVal || '';
	// 	}

	// 	switch (props.type) {
	// 		case 'allOrganize':
	// 			paramsByType.dccode = '';
	// 			break;
	// 		case 'directDlv':
	// 			paramsByType.dccode = props.codeName;
	// 			break;
	// 	}
	// 	apiFunction(paramsByType).then((res: any) => {
	// 		settingSelectData(res.data);
	// 	});
	// }, 500);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.resetFields();
		gridRef.current.clearGridData();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/**
	 * 행 선택 (공통 구현으로 위임)
	 */
	const selectRowData = () => {
		const res = selectRowDataImp(gridRef, callBack, form);
		if (!res.ok) return;
	};

	/**
	 * 확인 (공통 구현으로 위임)
	 */
	const checkRowData = () => {
		const res = checkRowDataImp(gridRef, selectionMode ?? '', callBack, close, form);
		if (!res.ok) return;
	};

	/**
	 * 다중선택 붙여넣기 (공통 구현)
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		return handlePasteImp(event, form, setMultiSelectCount, 5000, t);
	};

	/**
	 * 다중선택 입력 변경 처리 (공통 구현)
	 * @param  {any} event 이벤트
	 * @param e
	 */
	const onChangeMultiSelect = (e: any) => {
		const res = handleMultiSelectChangeImp(e, setMultiSelectCount, 5000, t);
		if (!res.ok) return;
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 부모페이지의 검색어를 가져온다.
	 */
	useEffect(() => {
		// 공통 유틸로 폼에 searchName 적용
		if (applySearchNameToFormImp(form, name ?? '', searchName ?? '', selectionMode ?? '', onChangeMultiSelect)) {
			onClickSearchButton();
		}
	}, [searchName]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
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

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		appendGridDataImp(gridRef, gridData);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`${strPrefixNm}코드조회`} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass={'grid-column-2'} isAlwaysVisible>
				<li>
					<InputText
						name={name}
						placeholder={t('msg.placeholder2', [strPrefixNm + '코드 또는 이름'])}
						onPressEnter={onClickSearchButton}
						label={strPrefixNm + '코드/명'}
						required
					/>
				</li>
				{/*멀티일 경우만 활성화*/}
				{selectionMode === 'multipleRows' && (
					<li style={{ gridColumn: 'span 2' }}>
						<InputText
							name="multiSelect"
							onPaste={handlePaste}
							onPressEnter={onClickSearchButton}
							label={'다중선택'}
							onChange={onChangeMultiSelect}
							count={{
								show: true,
								max: 5000,
								strategy: () => multiSelectCount,
							}}
						/>
					</li>
				)}
			</SearchFormResponsive>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
				<Button type="primary" onClick={checkRowData}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmBoxPopup;
