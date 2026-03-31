/*
 ############################################################################
 # FiledataField	: CmCarAreaPopup.tsx
 # Description		:  차량+권역 조회 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
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

const CmCarAreaPopup = (props: PropsType) => {
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
	} = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
		defDccode: '2600',
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.VHCNUM'),
			dataField: 'code',
		},
		{
			headerText: t('lbl.BASE_DISTRICT'),
			dataField: 'name',
			style: 'left',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: selectionMode,
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
		event.preventDefault();

		const pastedText = event.clipboardData.getData('text/plain').trim();
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		// 각 항목의 앞뒤 공백 제거
		transformedText = transformedText
			.split(',')
			.map((item: string) => item.trim())
			.filter((item: string) => item !== '') // 빈 문자열 제거
			.join(',');

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

	/**
	 * 차량번호 입력 시 공백 제거
	 * @param e
	 */
	const handleVehicleInputChange = (e: any) => {
		const trimmedValue = e.target.value.trim();
		form.setFieldValue(name, trimmedValue);
	};

	/**
	 * 차량번호 붙여넣기 시 공백 제거
	 * @param e
	 */
	const handleVehiclePaste = (e: any) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData('text/plain').trim();
		form.setFieldValue(name, pastedText);
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
			// 다중선택 모드일 때는 페이징하지 않음
			const multiSelectValue = form.getFieldValue('multiSelect');
			if (multiSelectValue && multiSelectValue.trim() !== '') {
				return;
			}
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
			<PopupMenuTitle name="차량 + 권역 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								label={t('lbl.VHCNUM')}
								width={80}
								name={name}
								placeholder={t('msg.placeholder2', ['차량번호'])}
								onPressEnter={onClickSearchButton}
								onChange={handleVehicleInputChange}
								onPaste={handleVehiclePaste}
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
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
				<Button type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmCarAreaPopup;
