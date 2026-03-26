/*
 ############################################################################
 # FiledataField	: CmOrganizePopup.tsx
 # Description		: 창고조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
// lib
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// API Call Function

interface PropsType {
	callBack?: any;
	searchParam?: string;
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
	dccodeDisabled?: boolean;
	currentPage?: any;
}

const CmOrganizePopup = (props: PropsType) => {
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
		dccodeDisabled,
		currentPage,
	} = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			// 창고코드
			headerText: '코드',
			dataField: 'code',
		},
		{
			// 창고명
			headerText: '명',
			dataField: 'name',
			style: 'left',
		},
	];

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
	const onClickSearchButton = () => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', multiSelect: '' });
		gridRef.current.clearGridData();
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

		const pastedText = commUtil.nvl(event.clipboardData.getData('text/plain'), '').trim();
		let transformedText = commUtil.nvl(pastedText.replace(/(?:\r\n|\r|\n)/g, ','), '').trim();

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// 중복 문자열 제거
		transformedText = [...new Set(transformedText.split(','))].join(',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 999) {
			showAlert(null, t('msg.maxMultiSelect'));
			return;
		}

		setMultiSelectCount(multiCnt);
		form.setFieldsValue({ multiSelect: transformedText });
	};

	const onChangeMultiSelect = (e: any) => {
		const value = e.target.value;
		if (value === '') {
			setMultiSelectCount(0);
			return;
		}

		const multiCnt = value.split(',').length;

		if (multiCnt > 999) {
			showAlert(null, t('msg.maxMultiSelect'));
			return;
		}

		setMultiSelectCount(multiCnt);
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
		if (!searchName) {
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', '');
			return;
		} else if (selectionMode === 'multipleRows' && searchName.split(',').length > 1) {
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', searchName);
			onChangeMultiSelect({ target: { value: searchName } });
		} else {
			form.setFieldValue(name, searchName);
			form.setFieldValue('multiSelect', searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
			setTimeout(() => {
				// 검색 후 삭제
				form.setFieldValue('multiSelect', '');
			});
		}

		onClickSearchButton();
	}, [searchName]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', function () {
			selectRowData();
		});
	});

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			// 다중선택 모드일 때는 현재 로드된 데이터와 총 개수를 비교하여 페이징 여부 결정
			const multiSelectValue = form.getFieldValue('multiSelect');
			if (multiSelectValue && multiSelectValue.trim() !== '') {
				// 현재 그리드에 로드된 데이터 개수 확인
				const currentDataCount = gridRef.current.getGridData().length;
				// 총 개수와 비교하여 모든 데이터가 로드되었으면 추가 페이징 하지 않음
				if (currentDataCount >= totalCount) {
					return;
				}
			}
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		// 페이징 처리가 아닌 그냥 조회일 경우 그리드 기존 DATA 삭제 처리
		// 검색영역을 통해 검색시 기존 DATA 남아 있는 이슈 해결 위해 추가
		if (currentPage === 1) {
			gridRef.current.clearGridData();
		}

		gridRef.current.appendData(gridData);

		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="창고조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<CmGMultiDccodeSelectBox
								name="dccode"
								fieldNames={{ label: 'dcname', value: 'dccode' }}
								label={t('lbl.DCCODE')}
								disabled={dccodeDisabled}
							/>
						</li>
						<li>
							<InputText
								width={80}
								name={name}
								label={'창고코드/명'}
								placeholder={t('msg.placeholder2', ['창고코드 또는 이름'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								name="multiSelect"
								label={'다중선택'}
								onPaste={handlePaste}
								disabled={selectionMode === 'singleRow'}
								onChange={onChangeMultiSelect}
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

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					취소
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmOrganizePopup;
