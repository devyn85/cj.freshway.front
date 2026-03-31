/*
 ############################################################################
 # FiledataField : CmCarPopPopup.tsx
 # Description   : 차량/POP 번호 팝업
 # Author        : ParkJinWoo
 # Since         : 25.05.13
 ############################################################################
*/

// Lib
import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

// Component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

interface PropsType {
	callBack?: any;
	searchParam?: string;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	totalCount?: number;
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	multiSelectCount?: number;
	setMultiSelectCount?: any;
	handlePaste?: any;
	onChangeMultiSelect?: any;
}

const CmCarPopPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
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
		multiSelectCount,
		setMultiSelectCount,
		handlePaste,
		onChangeMultiSelect,
	} = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
		contractType: null,
		// defDccode: '2600',
	});
	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.POPNO'), // POP번호
			dataField: 'name',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CARNO'), // 차량번호
			dataField: 'code',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DRIVER'), // 운전자
			dataField: 'driverName',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CONTRACTTYPE'), // 계약유형
			dataField: 'contractType',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
			},
		},
		// {
		// 	headerText: t('lbl.CARRIERTYPE'), // 운송협력사
		// 	dataField: 'custKey',
		// 	dataType: 'code',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('CARRIERTYPE', value)?.cdNm;
		// 	},
		// },
	];

	const gridProps = {
		editable: false,
		selectionMode: selectionMode,
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/** 검색 버튼 클릭 */
	const onClickSearchButton = useCallback(() => {
		const multiSelectValue = form.getFieldValue('multiSelect');
		const contractTypeValue = form.getFieldValue('contractType');

		// 다중선택 999건 제한 체크
		if (multiSelectValue && multiSelectValue.split(',').length > 999) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), multiSelectValue, contractTypeValue);
	}, []);

	/** 새로고침 버튼 클릭 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', multiSelect: '', contractType: null });
		setMultiSelectCount && setMultiSelectCount(0);
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
	/** 행 선택 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
	};

	/** 확인 버튼 */
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
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
	}, []);

	// 스크롤 이벤트
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

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="차량/POP 번호 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<SelectBox
								name="contractType"
								placeholder={t('msg.placeholder2', ['계약유형'])}
								options={getCommonCodeList('CONTRACTTYPE', '전체')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								label={t('lbl.CONTRACTTYPE')}
							/>
						</li>
						<li>
							<InputText
								width={80}
								name={name}
								placeholder={t('msg.placeholder2', ['차량번호 혹은 POP번호'])}
								onPressEnter={onClickSearchButton}
								label={'차량번호/POP번호'}
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

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

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

export default CmCarPopPopup;
