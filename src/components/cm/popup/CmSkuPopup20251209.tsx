/*
 ############################################################################
 # FiledataField	: CmSkuPopup.tsx
 # Description		: 상품조회팝업
 # Author			: JeongHyeongCheol
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
import { InputText, SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function

interface PropsType {
	callBack?: any;
	searchName?: string;
	preResult?: boolean;
	gridData?: Array<object>;
	search?: any;
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	totalCount?: number;
	kit?: string;
}

const CmSkuPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		callBack,
		searchName,
		preResult,
		gridData,
		search,
		selectionMode,
		close,
		setCurrentPage,
		gridRef,
		form,
		name,
		totalCount,
		kit,
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
			// 상품코드
			headerText: '상품코드',
			dataField: 'code',
			dataType: 'code',
		},
		{
			// 상품명칭
			headerText: '상품명칭',
			dataField: 'name',
		},
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
		if (commUtil.isEmpty(kit) || kit === 'N') {
			if (commUtil.isNull(form.getFieldValue(name)) && commUtil.isNull(form.getFieldValue('multiSelect'))) {
				showAlert(null, '상품코드/명 항목은 필수 입력입니다.'); // 항목은 필수값입니다.
				return;
			}
		}
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));
	}, []);

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
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
		form.resetFields();
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
		form.resetFields();
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
		form.setFieldsValue({ multiSelect: transformedText });
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

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
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
		// "preResult" 기능을 잘 모르겠음...
		// if (!searchName || preResult) {
		if (!searchName) {
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', '');
			return;
		} else if (searchName.includes(',') && selectionMode === 'multipleRows') {
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
		// }, [searchName, preResult]);
	}, [searchName]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', function () {
			selectRowData();
		});
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
		if (gridData.length > 0) {
			gridRef.current.appendData(gridData);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		} else {
			// 데이터 없을경우 워터마크
			gridRef.current.setGridData([]);
		}
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`${!commUtil.isEmpty(kit) && kit === 'Y' ? 'KIT' : ''}상품코드조회`} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2" isAlwaysVisible>
				{/* <li>
					<CmStorerKeySelectBox nameKey="storerKey" label={'회사'} />
				</li> */}
				<li>
					<InputText
						name={name}
						placeholder={t('msg.placeholder2', ['상품코드 또는 이름'])}
						onPressEnter={onClickSearchButton}
						label={'상품코드/명'}
						required
					/>
				</li>
				<li style={{ gridColumn: 'span 2' }}>
					<InputText
						name="multiSelect"
						onPaste={handlePaste}
						disabled={selectionMode === 'singleRow'}
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

export default CmSkuPopup;
