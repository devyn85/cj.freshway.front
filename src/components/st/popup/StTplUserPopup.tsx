/*
 ############################################################################
 # FiledataField	: StTplUserPopup.tsx
 # Description		: 화주조회 팝업
 # Author			: yosep.park
 # Since			: 25.11.05
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

import { Datepicker, InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';

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
}

const StTplUserPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, gridData, search, close, setCurrentPage, gridRef, form, name, totalCount } = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
	});

	const dateFormat = 'YYYY-MM-DD';
	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.TPLUSER_ID'),
			dataField: 'code',
		},
		{
			headerText: t('lbl.TPLUSER_NAME'),
			dataField: 'name',
		},
		{
			headerText: t('lbl.CUSTNAME_WD'),
			dataField: 'custNm',
		},
		{
			headerText: t('lbl.PARTNER_NAME'),
			dataField: 'vendorNm',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'singleRow', // 부모로부터 받은 selectionMode를 직접 사용
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
		const dateValue = form.getFieldValue('date');
		const formattedDate = dateValue ? dateValue.format('YYYYMMDD') : null;

		search(true, form.getFieldValue(name), formattedDate);
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', date: null });
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
		const checkedRow = gridRef.current.getSelectedRows();
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
	 * 부모페이지의 검색어를 가져온다.
	 */
	useEffect(() => {
		if (!searchName) {
			form.setFieldValue(name, '');
			return;
		} else {
			form.setFieldValue(name, searchName);
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
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		gridRef.current.appendData(gridData);

		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="화주조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<Datepicker
								name="date"
								allowClear
								showNow={false}
								label={t('lbl.BASEDT')}
								rules={[{ required: true, validateTrigger: 'none' }]}
								picker="date"
								dataformat={dateFormat}
							/>
						</li>
						<li>
							<InputText
								width={80}
								name={name}
								label={t('lbl.TPLUSER_ID_NAME')}
								placeholder={t('msg.placeholder2', ['화주ID 또는 이름'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						{/* <li style={{ gridColumn: 'span 2' }}>
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
						</li> */}
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

export default StTplUserPopup;
