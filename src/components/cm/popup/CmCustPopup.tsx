/*
 ############################################################################
 # FiledataField	: CmCustPopup.tsx
 # Description		: 거래처조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// Css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
// Store
import { getUserDccodeList } from '@/store/core/userStore';

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
	expandedColumns?: string;
	labelChange?: string;
	setTotalCount?: any;
}

const CmCustPopup = (props: PropsType) => {
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
		expandedColumns,
		labelChange,
		setTotalCount,
	} = props;
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	// const custTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
	// 	return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	// };

	/**
	 * 확장 컬럼용 라벨 함수 생성
	 * @param {string} keyField 키 필드명
	 * @param {string} nameField 이름 필드명
	 * @returns {Function} 라벨 함수
	 */
	const createCombinedLabelFunc = (keyField: string, nameField: string) => {
		return (rowIndex: any, columnIndex: any, value: any, headerText: string, item: any) => {
			const key = item[keyField];
			const name = item[nameField];
			if (key && name) {
				return `[${key}]${name}`;
			}
			return '';
		};
	};

	/**
	 * 값이 존재하는 셀에 bg-green 스타일 적용
	 * @returns {Function} 스타일 함수
	 */
	// const createValueExistsStyleFunc = () => {
	// 	return (rowIndex: any, columnIndex: any, value: any) => {
	// 		return value && value !== '' && value !== null && value !== -1 ? 'bg-green' : '';
	// 	};
	// };

	const baseGridCol = [
		{
			// 거래처코드
			headerText: t('lbl.CUST_CODE'),
			dataField: 'code',
			dataType: 'code',
		},
		{
			// 거래처명
			headerText: t('lbl.CUST_NAME'),
			dataField: 'name',
			dataType: 'default',
		},
		{
			// 거래처유형
			headerText: t('lbl.STORERTYPE'),
			dataField: 'custType',
			// labelFunction: custTypeLabelFunc,
			dataType: 'code',
		},
		{
			// 기본주소
			headerText: t('lbl.ADDRESS1'),
			dataField: 'address1',
			dataType: 'default',
		},
	];

	const expandedGridCol = [
		{
			// 본점코드
			headerText: t('lbl.BRAND_CUSTKEY'),
			// dataField: 'dlvCustKey',
			dataField: 'hqCustKey',
			cellMerge: true,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				// 쉼표 없이 숫자만 표시, 빈 값(-1)은 빈 문자열로
				return value === -1 || value === '' || value == null ? '' : String(value);
			},
			// styleFunction: createValueExistsStyleFunc(),
			// [코드]명꼴로 합쳐야 할 경우 사용, 기획변경으로 인해 주석처리
			// labelFunction: createCombinedLabelFunc('dlvcustkey', 'dlvdescription'),
		},
		{
			// 본점명
			headerText: t('lbl.BRAND_CUSTNAME2'),
			// dataField: 'dlvdescription',
			dataField: 'hqName',
			cellMerge: true,
			dataType: 'default',
			// styleFunction: createValueExistsStyleFunc(),
		},
		{
			// 판매처코드
			headerText: t('lbl.TO_VATNO'),
			dataField: 'saleCustKey',
			cellMerge: true,
			dataType: 'code',
			// styleFunction: createValueExistsStyleFunc(),
		},
		{
			// 판매처명
			headerText: t('lbl.TO_VATOWNER'),
			// dataField: 'saleCustName',
			dataField: 'saleName',
			cellMerge: true,
			dataType: 'default',
			// styleFunction: createValueExistsStyleFunc(),
		},
		// {
		// 	// 실착지코드
		// 	headerText: t('lbl.TRUTH_CUSTKEY'),
		// 	dataField: 'truthCustKey',
		// 	cellMerge: true,
		// 	dataType: 'code',
		// 	styleFunction: createValueExistsStyleFunc(),
		// },
		// {
		// 	// 실착지명
		// 	headerText: t('lbl.TRUTH_CUSTNAME'),
		// 	dataField: 'truthCustName',
		// 	cellMerge: true,
		// 	dataType: 'default',
		// 	styleFunction: createValueExistsStyleFunc(),
		// },
		{
			// 관리처코드
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			// dataField: 'childCustKey',
			dataField: 'mngCustkey',
			cellMerge: true,
			dataType: 'code',
			// styleFunction: createValueExistsStyleFunc(),
		},
		{
			// 관리처명
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			// dataField: 'childCustName',
			dataField: 'mngName',
			cellMerge: true,
			dataType: 'default',
			// styleFunction: createValueExistsStyleFunc(),
		},

		{
			// 센터코드/명
			headerText: t('lbl.CENTER_CODENAME'),
			dataField: 'dlvDccode',
			dataType: 'code',
			// 넘어오는 코드로 "[물류센터코드]물류센터명" 형태로 표시
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === -1 || value === '' || value == null
					? ''
					: getUserDccodeList().find((item: any) => item.dccode === value)?.dcname;
			},
		},
		{
			// 기본주소
			headerText: t('lbl.ADDRESS1'),
			dataField: 'address1',
			dataType: 'default',
		},
	];

	const gridCol = expandedColumns === 'Y' ? expandedGridCol : baseGridCol;

	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		enableCellMerge: true,
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// /**
	//  * labelChange 값에 따른 팝업 제목 반환
	//  * @returns {string} 팝업 제목
	//  */
	// const getPopupTitle = () => {
	// 	const labelMap: { [key: string]: string } = {
	// 		dlv: '본점 고객 조회',
	// 		saleCust: '판매처 고객 조회',
	// 		childCust: '관리처 고객 조회',
	// 	};

	// 	return labelChange && labelMap[labelChange] ? labelMap[labelChange] : '거래처조회';
	// };

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		setCurrentPage(1);
		gridRef.current.clearGridData();

		// 확장 모드일 때 추가 검색 조건들을 포함
		const searchParams = {
			name: form.getFieldValue(name),
			multiSelect: form.getFieldValue('multiSelect'),
			...(expandedColumns === 'Y' && {
				dlvSearchVal: form.getFieldValue('dlvSearchVal'),
				saleCustSearchVal: form.getFieldValue('saleCustSearchVal'),
				multiSelect: form.getFieldValue('multiSelect'), // 관리처코드/명
			}),
		};

		search(true, searchParams);
	}, [expandedColumns]);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '', multiSelect: '', saleCustSearchVal: '', dlvSearchVal: '' });
		setTotalCount(0);
		setMultiSelectCount(0);
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
		} else if (expandedColumns === 'Y') {
			// 확장 컬럼 모드이며, 다중선택 모드가 아닌 [코드]명 형태로 검색어가 들어왔을 때
			form.setFieldValue(name, '');
			form.setFieldValue('multiSelect', searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
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
		gridRef.current.bind('cellDoubleClick', function (event: any) {
			const selectedRow = gridRef.current?.getSelectedRows();

			// Shift + 더블클릭 시
			if (event?.orgEvent?.shiftKey) {
				const selectedCell = gridRef?.current?.getSelectedItems();

				// 하나만 선택가능하도록
				if (!selectedCell || selectedCell?.length !== 1) {
					return;
				}

				// expandedGridCol에 속한 dataField를 더블클릭했다면 선택된 dataField의 코드와 이름 전달
				if (expandedGridCol?.some((col: any) => col.dataField === selectedCell[0]?.dataField)) {
					// 클릭한 dataField
					// const clickedDataField = selectedCell[0]?.dataField;

					// 클릭한 DataField의 값을 꺼내고 구조분해할당으로..
					const { code, name } = selectedCell[0]?.item || {};

					// 선택된 행과 코드, 이름을 search input에 바인딩
					callBack(selectedRow, { code: code, name: name });

					return;
				}
			}

			callBack(selectedRow);
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
		gridRef.current.appendData(gridData);

		// 확장 컬럼일 때 본점코드 기준 내림차순 정렬 적용
		if (expandedColumns === 'Y' && gridData?.length > 0) {
			const sortingInfo = [];
			sortingInfo[0] = { dataField: 'hqCustKey', sortType: -1 }; // 내림차순 정렬
			gridRef.current.setSorting(sortingInfo);
		}

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData, expandedColumns]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			{/* <PopupMenuTitle name={getPopupTitle()} func={titleFunc} /> */}
			<PopupMenuTitle name={expandedColumns === 'Y' ? '고객 조회' : '거래처조회'} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			{expandedColumns === 'Y' ? (
				<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2" isAlwaysVisible>
					<li>
						{/* 물류센터 */}
						<CmGMultiDccodeSelectBox
							name="dccode"
							label={t('lbl.DCCODE')}
							mode="multiple"
							placeholder="선택해주세요"
							// rules={[{ required: true, validateTrigger: 'none' }]}
							initval={userDccodeList.map((item: any) => item.dccode)}
						/>
					</li>
					{/* 본점 고객코드/명 */}
					<li>
						<InputText
							width={80}
							name="dlvSearchVal"
							placeholder={t('msg.MSG_COM_VAL_006', ['본점 고객코드 또는 이름'])}
							onPressEnter={onClickSearchButton}
							label={t('lbl.DLVCODENAME')}
							onPaste={(event: any) => {
								event.preventDefault(); // 기본 붙여넣기 동작 방지

								// 붙여넣기시 첫번째 코드만 설정
								const pastedText = event?.clipboardData?.getData('text/plain');
								if (commUtil.isNotEmpty(pastedText)) {
									const transformedText = pastedText.replaceAll(/(?:\r\n|\r|\n)/g, ',');
									const first = transformedText.split(',')[0];
									form.setFieldsValue({ ['dlvSearchVal']: first });
								}
							}}
						/>
					</li>
					{/* 판매처 고객코드/명 */}
					<li>
						<InputText
							width={80}
							name="saleCustSearchVal"
							placeholder={t('msg.MSG_COM_VAL_006', ['판매처 고객코드 또는 이름'])}
							onPressEnter={onClickSearchButton}
							label={t('lbl.SALECUSTCODENAME')}
							onPaste={(event: any) => {
								event.preventDefault(); // 기본 붙여넣기 동작 방지

								// 붙여넣기시 첫번째 코드만 설정
								const pastedText = event?.clipboardData?.getData('text/plain');
								if (commUtil.isNotEmpty(pastedText)) {
									const transformedText = pastedText.replaceAll(/(?:\r\n|\r|\n)/g, ',');
									const first = transformedText.split(',')[0];
									form.setFieldsValue({ ['saleCustSearchVal']: first });
								}
							}}
						/>
					</li>
					{/* 관리처 고객코드/명 */}
					<li>
						<InputText
							width={80}
							// name="childCustSearchVal"
							name="multiSelect"
							placeholder={t('msg.MSG_COM_VAL_006', ['관리처 고객코드 또는 이름'])}
							label={t('lbl.CHILDCUSTCODENAME')}
							onPaste={handlePaste}
							onChange={onChangeMultiSelect}
							onPressEnter={onClickSearchButton}
							count={{
								show: true,
								max: 5000,
								strategy: () => multiSelectCount,
							}}
						/>
					</li>
				</SearchFormResponsive>
			) : (
				<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2" isAlwaysVisible>
					<li>
						<InputText
							width={80}
							name={name}
							placeholder={t('msg.MSG_COM_VAL_006', ['거래처코드 또는 이름'])}
							onPressEnter={onClickSearchButton}
							label={t('lbl.CUSTCODENAME')}
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
				</SearchFormResponsive>
			)}

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{/* 행 확장모드일경우 '확인'을 '적용'으로 표시 */}
					{expandedColumns === 'Y' ? t('lbl.BTN_APPLY') : t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmCustPopup;
