import { Button, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';

import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// Utils
import { showAlert } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';

import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// API Call Function
import { apiGetCmCarList } from '@/api/cm/apiCmSearch';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface PropsType {
	callBack?: any;
	searchName?: string;
	selectionMode?: string;
	close?: any;
	customDccode?: string; // 커스텀 물류센터 코드
}
const CmCarPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, selectionMode, close, customDccode } = props;
	const { t } = useTranslation();

	const [popupForm] = Form.useForm(); // 팝업 내부 폼
	const gridRef = useRef<any>(); // 그리드 Ref
	const [popupList, setPopupList] = useState<any[]>([]);
	const [currentPageScr, setCurrentPageScr] = useState(1); // 스크롤 페이징 현재 페이지
	const [totalCountState, setTotalCountState] = useState(0); // 총 개수
	const [dataToAppend, setDataToAppend] = useState<any[]>([]); // 새로 추가할 데이터 (스크롤 시)
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const [searchBox] = useState({
		name: '',
		multiSelect: '',
		defDccode: '2600',
		contracttype: null, // 계약유형 기본값 설정
	});

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			// 차량번호
			headerText: t('lbl.CARNO'),
			dataField: 'code',
			dataType: 'code',
		},
		{
			// 운전자
			headerText: t('lbl.DRIVER'),
			dataField: 'name',
			dataType: 'code', //WEB_026
		},
		{
			// 계약유형
			headerText: t('lbl.CONTRACTTYPE'),
			dataField: 'contracttype',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
			},
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
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */
	const fetchGridData = (isSearchButtonClicked = false) => {
		const name = popupForm.getFieldValue('name');
		const multiSelect = popupForm.getFieldValue('multiSelect');
		const contracttype = popupForm.getFieldValue('contracttype');

		// 검색 버튼 클릭 시 또는 초기 로드 시 페이지 리셋
		if (isSearchButtonClicked) {
			setCurrentPageScr(1);
			gridRef.current?.clearGridData();
		}

		const params = {
			name: name,
			multiSelect: multiSelect,
			contracttype: contracttype,
			customDccode: customDccode,
			startRow: (currentPageScr - 1) * pageSizeScr,
			listCount: pageSizeScr,
		};

		// API 호출 (실제 API 함수명으로 변경 필요)
		apiGetCmCarList(params).then((res: any) => {
			// 모든 데이터 항목에 _checked: false 속성 추가
			const processedList = res.data.list?.map((item: any) => ({ ...item, _checked: false })) ?? [];

			if (isSearchButtonClicked) {
				// 검색 버튼 클릭 또는 초기 로드 시: 페이지 리셋, 총 개수 업데이트
				setCurrentPageScr(1); // 페이지 상태 1로 리셋
				setTotalCountState(res.data.totalCount ?? 0); // 총 개수 업데이트
				setPopupList(processedList); // 전체 데이터 목록 업데이트
				setDataToAppend([]); // 초기 로드 시 dataToAppend 초기화
			} else {
				// 스크롤 시: 새로 받아온 데이터만 dataToAppend에 설정, 전체 데이터 목록 누적
				setDataToAppend(processedList); // 새로 받아온 데이터만 설정
				setPopupList(prev => [...prev, ...processedList]); // 전체 데이터 목록 누적
			}
		});
	};

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		fetchGridData(true); // 검색 버튼 클릭 시 true 전달하여 페이지 리셋
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		// 모든 검색조건 초기화
		popupForm.setFieldsValue({
			name: '',
			multiSelect: '',
			contracttype: null,
		});
		setMultiSelectCount(0);

		// 조회결과 초기화
		setPopupList([]);
		setDataToAppend([]);
		setCurrentPageScr(1);
		setTotalCountState(0);

		// 그리드 데이터 초기화
		gridRef.current?.clearGridData();
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
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
		popupForm.setFieldsValue({ multiSelect: transformedText });
	};

	/**
	 * 차량번호/운전자 입력 시 공백 제거
	 * @param e
	 */
	const handleCarDriverInputChange = (e: any) => {
		const trimmedValue = e.target.value.trim();
		popupForm.setFieldValue('name', trimmedValue);
	};

	/**
	 * 차량번호/운전자 붙여넣기 시 공백 제거
	 * @param e
	 */
	const handleCarDriverPaste = (e: any) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData('text/plain').trim();
		popupForm.setFieldValue('name', pastedText);
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

		// 다중선택 개수 증가 예정
		if (multiCnt > 999) {
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
	 * 부모페이지의 검색어를 가져와 초기 값 설정
	 */
	useEffect(() => {
		if (searchName) {
			if (selectionMode === 'multipleRows' && searchName.split(',').length > 1) {
				popupForm.setFieldValue('multiSelect', searchName);
				setMultiSelectCount(searchName.split(',').length);
			} else {
				popupForm.setFieldValue('name', searchName);
				popupForm.setFieldValue('multiSelect', searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
				setTimeout(() => {
					// 검색 후 삭제
					popupForm.setFieldValue('multiSelect', '');
				});
			}
			fetchGridData(true);
		}
	}, [searchName, selectionMode]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPageScr((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: totalCountState,
	});

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (currentPageScr > 1) {
			fetchGridData(false); // 스크롤 시 데이터 추가 (페이지 리셋 안함)
		}
	}, [currentPageScr]);

	// popupList 변경 시 그리드 데이터 업데이트 및 컬럼 사이즈 조정
	useEffect(() => {
		if (!gridRef.current) return; // 그리드 Ref가 없으면 리턴

		if (currentPageScr === 1 && popupList.length > 0) {
			gridRef.current?.setGridData(popupList); // 첫 페이지 조회 또는 검색 시: setGridData로 전체 데이터 교체
		} else if (dataToAppend.length > 0) {
			gridRef.current?.appendData(dataToAppend); // 스크롤 시: appendData로 데이터 추가
		}

		// 조회된 결과에 맞게 칼럼 넓이를 구하고 적용 시킴.
		const colSizeList = gridRef.current?.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current?.setColumnSizeList(colSizeList);
	}, [popupList]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="차량조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							{/* 회사 */}
							<SelectBox
								name="contracttype"
								placeholder={t('msg.placeholder2', ['계약유형'])}
								options={getCommonCodeList('CONTRACTTYPE', '전체')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								label={t('lbl.CONTRACTTYPE')}
							/>
						</li>

						<li>
							<InputText
								label={t('lbl.CARNO') + '/' + t('lbl.DRIVER')}
								width={80}
								name="name"
								placeholder={t('msg.MSG_COM_VAL_054', ['차량번호 또는 기사명'])}
								onPressEnter={onClickSearchButton}
								onChange={handleCarDriverInputChange}
								onPaste={handleCarDriverPaste}
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
				<span>총 {commUtil.changeNumberFormatter(totalCountState)}건</span>
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
export default CmCarPopup;
