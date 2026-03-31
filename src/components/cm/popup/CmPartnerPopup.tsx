/*
 ############################################################################
 # FiledataField	: CmPartnerPopup.tsx
 # Description		: 협력사조회 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.05.14
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
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';

// Utils

// API Call Function
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

/**
 * =====================================================================
 *	01. 변수 선언부
 * =====================================================================
 */
interface PropsType {
	callBack?: any;
	searchParam?: string;
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
	totalCount?: number;
	currentPage?: any;
}

const CmPartnerPopup = (props: PropsType) => {
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
		currentPage,
	} = props;

	const [multiSelectCount, setMultiSelectCount] = useState(0);
	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
		defDccode: '2600',
	});

	const gridId = uuidv4() + '_gridWrap';

	const custTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	const gridCol = [
		{
			// 협력사코드
			headerText: t('lbl.CUSTKEY_KP'),
			dataField: 'code',
			dataType: 'code',
		},
		{
			// 협력사명
			headerText: t('lbl.CUSTNAME_KP'),
			dataField: 'name',
			dataType: 'string',
		},
		{
			// 협력사유형
			headerText: t('lbl.VENDORTYPE'),
			dataField: 'custType',
			dataType: 'code',
			labelFunction: custTypeLabelFunc,
		},
		{
			// 기본주소
			headerText: t('lbl.ADDRESS1'),
			dataField: 'address1',
			dataType: 'string',
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
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'), 1);
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
	 * 확인 버튼 클릭 시
	 */
	const checkRowData = () => {
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

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="협력사조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						{/* <li style={{ gridColumn: 'span 2' }}> */}
						<li>
							<InputText
								label={t('lbl.VENDORCODENAME')}
								width={80}
								name={name}
								placeholder={t('msg.MSG_COM_VAL_054', ['협력사코드 또는 이름'])}
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

export default CmPartnerPopup;
