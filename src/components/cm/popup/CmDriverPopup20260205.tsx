/*
 ############################################################################
 # FiledataField : CmDriverPopup.tsx
 # Description   : 기사정보 조회 팝업
 # Author        : ParkJinWoo
 # Since         : 25.05.21
 ############################################################################
*/

// lib
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// utils
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

/**
 * =====================================================================
 * 01. 변수 선언부
 * =====================================================================
 */
interface PropsType {
	callBack?: any;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	totalCnt?: number;
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
}

const CmDriverPopup = (props: PropsType) => {
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
		totalCnt,
	} = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
		// defDccode: '2600',
	});
	const [multiSelectCount, setMultiSelectCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.DRIVERID'),
			dataField: 'code',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DRIVERNAME'),
			dataField: 'name',
			dataType: 'code',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
		showAutoNoDataMessage: true,
		showRowAllCheckBox: true,
	};

	/**
	 * =====================================================================
	 * 02. 함수
	 * =====================================================================
	 */

	/** 검색 버튼 클릭 */
	const onClickSearchButton = () => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));
	};

	/** 새로고침 버튼 클릭 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', multiSelect: '' });
		gridRef.current.clearGridData();
	};

	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/** 행 선택 시 */
	const selectRowData = (): void => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
	};

	/** 확인 버튼 클릭 시 */
	const checkRowData = (): void => {
		let checkedRow = gridRef.current.getCheckedRowItemsAll();
		if (selectionMode === 'singleRow') {
			checkedRow = gridRef.current.getSelectedRows();
		}
		if (checkedRow.length === 0) {
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
	 * 03. react hook event
	 * 예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/** 검색어 초기 셋팅 */
	useEffect(() => {
		if (!searchName) return;
		if (searchName.includes(',') && selectionMode === 'multipleRows') {
			form.setFieldValue('multiSelect', searchName);
			setMultiSelectCount && setMultiSelectCount(searchName.split(',').length);
			form.setFieldValue(name, '');
		} else {
			form.setFieldValue(name, searchName);
			form.setFieldValue('multiSelect', '');
			setMultiSelectCount && setMultiSelectCount(0);
		}
	}, [searchName]);

	/** 더블클릭 시 데이터 선택 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', () => {
			selectRowData();
		});
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCnt,
	});

	/** 그리드 데이터 업데이트 시 반영 */
	useEffect(() => {
		gridRef.current.appendData(gridData);
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	/** 그리드 데이터 없을 경우 input 포커스 */
	useEffect(() => {
		if (gridData.length === 0) {
			const formItem = form.getFieldInstance(name);
			if (formItem) {
				const node = formItem?.input || formItem;
				node?.focus?.();
			}
		}
	}, [gridData]);

	return (
		<>
			<PopupMenuTitle name="기사조회" func={titleFunc} />
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								label="기사 ID/명"
								width={80}
								name={name}
								placeholder={t('msg.placeholder2', ['기사ID 혹은 기사명'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								label="다중선택"
								name="multiSelect"
								onPaste={handlePaste}
								onChange={onChangeMultiSelect}
								disabled={selectionMode === 'singleRow'}
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
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
				<Button type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmDriverPopup;
