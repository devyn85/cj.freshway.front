/*
 ############################################################################
 # FiledataField	: CmCarrierPopup20251220.tsx
 # Description		: 운송사 조회 팝업
 # Author			: KimSunHo
 # Since			: 25.05.09
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
import { v4 as uuidv4 } from 'uuid';
// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
// Utils
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
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
		carrierTypeHiddenYn = props.carrierTypeHiddenYn || null,
		close,
		setCurrentPage,
		gridRef,
		form,
		name,
		totalCount,
		carrierType,
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
					headerText: t('lbl.CARRIERCODE'),
					dataField: 'code',
					dataType: 'code',
				},
				{
					// 운송사명
					headerText: t('lbl.CARRIERNAME'),
					dataField: 'name',
					dataType: 'default',
				},
			];
		}
		return [
			{
				// 운송사코드
				headerText: t('lbl.CARRIER'),
				dataField: 'code',
				dataType: 'code',
			},
			{
				// 운송사명
				headerText: t('lbl.CARRIERNAME'),
				dataField: 'name',
				dataType: 'default',
			},
			{
				// 구분
				headerText: t('lbl.CARRIERTYPE'),
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
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'), form.getFieldValue('carrierType'));
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

	/**
	 * 다중선택 입력란 변경 이벤트
	 * @param {any} e 입력 이벤트
	 */
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

		// carrierType 초기값 설정
		form.setFieldValue('carrierType', carrierType || null);
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

	/**
	 * 그리드 다음 페이지 Data 조회되면 그리드에 추가
	 */
	useEffect(() => {
		gridRef.current.setGridData(gridData);

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
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
									label={t('lbl.CARRIERCODENAME')}
									placeholder={t('msg.placeholder2', ['운송사코드 또는 이름'])}
									onPressEnter={onClickSearchButton}
								/>
							</li>
						) : (
							<>
								<li>
									<InputText
										name={name}
										label={t('lbl.CARRIERCODENAME')}
										placeholder={t('msg.placeholder2', ['운송사코드 또는 이름'])}
										onPressEnter={onClickSearchButton}
									/>
								</li>
								<li>
									<SelectBox
										name="carrierType"
										// 2차 운송사(SUBC) 또는 운송사(LOCAL) 선택 시 고정
										disabled={carrierType === 'SUBC' || carrierType === 'LOCAL'}
										placeholder={t('msg.placeholder2', ['운송사유형'])}
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
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmCarrierPopup;
