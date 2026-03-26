/*
 ############################################################################
 # FiledataField	: CmCarrierPopup.tsx
 # Description		: 운송사 조회 팝업
 # Author			: KimSunHo
 # Since			: 25.05.09
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
import { Button } from 'antd';
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
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
// API Call Function

interface PropsType {
	callBack?: any;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	selectionMode?: string;
	carrierTypeHiddenYn?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	// 팝업파라미터 정의
	totalCount?: number;
	carrierType?: string;
}

const CmCarrierPopup = (props: PropsType) => {
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
		carrierType,
		carrierTypeHiddenYn = props.carrierTypeHiddenYn || null,
	} = props;

	const { t } = useTranslation();

	const [searchBox] = useState({
		searchVal: '',
		multiSelect: '',
		carrierType: carrierType || null,
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	// 그리드 칼럼 정의
	const getGridCol = () => {
		if (carrierTypeHiddenYn === 'Y') {
			return [
				{
					// 운송사코드
					headerText: '운송사',
					dataField: 'code',
					dataType: 'code',
				},
				{
					// 운송사명
					headerText: '운송사명',
					dataField: 'name',
					dataType: 'default',
				},
			];
		}
		return [
			{
				// 운송사코드
				headerText: '운송사',
				dataField: 'code',
				dataType: 'code',
			},
			{
				// 운송사명
				headerText: '운송사명',
				dataField: 'name',
				dataType: 'default',
			},
			{
				// 구분
				headerText: '운송사유형',
				dataField: 'carrierType',
				dataType: 'code',
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('CARRIERTYPE', value)?.cdNm;
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
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		onClickSearchButtonImp(setCurrentPage, gridRef, form, name ?? '', search, form.getFieldsValue());
	}, []);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', multiSelect: '', carrierType: null });
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
		const res = selectRowDataImp(gridRef, callBack, form);
		if (!res.ok) return;
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const res = checkRowDataImp(gridRef, selectionMode ?? '', callBack, close, form);
		if (!res.ok) return;
	};

	/**
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		return handlePasteImp(event, form, setMultiSelectCount, 5000, t);
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
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * carrierType prop이 변경될 때 form 값 업데이트
	 */
	useEffect(() => {
		if (form && carrierType) {
			form.setFieldsValue({ carrierType: carrierType });
		}
	}, [carrierType, form]);

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
			<PopupMenuTitle name="운송사조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						{carrierTypeHiddenYn === 'Y' ? (
							<li style={{ gridColumn: 'span 2' }}>
								<InputText
									name={name}
									label={'운송사코드/명'}
									placeholder={t('msg.placeholder2', ['운송사코드 또는 이름'])}
									onPressEnter={onClickSearchButton}
								/>
							</li>
						) : (
							<>
								<li>
									<InputText
										name={name}
										label={'운송사코드/명'}
										placeholder={t('msg.placeholder2', ['운송사코드 또는 이름'])}
										onPressEnter={onClickSearchButton}
									/>
								</li>
								<li>
									<SelectBox
										name="carrierType"
										// 2차 운송사(SUBC) 또는 운송사(LOCAL) 선택 시 고정
										disabled={carrierType === 'SUBC' || carrierType === 'LOCAL'}
										placeholder={'운송사유형'}
										options={getCommonCodeList('CARRIERTYPE', '전체')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										label={t('lbl.CARRIERTYPE')}
									/>
								</li>
							</>
						)}
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								name="multiSelect"
								label={'다중선택'}
								onPaste={handlePaste}
								onChange={onChangeMultiSelect}
								onPressEnter={onClickSearchButton}
								disabled={selectionMode === 'singleRow'}
								count={{
									show: true,
									max: 999,
									strategy: () => multiSelectCount,
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

export default CmCarrierPopup;
