/*
 ############################################################################
 # FiledataField	: CmCustBrandPopup.tsx
 # Description		: 본점조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, SearchForm } from '@/components/common/custom/form';

// Store
import TotalCount from '@/assets/styled/Container/TotalCount';
// Utils

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import commUtil from '@/util/commUtil';

// API Call Function
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
}
const CmCustBrandPopup = (props: PropsType) => {
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
		storerkey: 'FW00',
		name: '',
		multiSelect: '',
	});

	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			// 본점코드
			headerText: t('lbl.BRAND_CUSTKEY'),
			dataField: 'code',
			dataType: 'code',
		},
		{
			// 본점명
			headerText: t('lbl.BRAND_CUSTNAME2'),
			dataField: 'name',
			dataType: 'default',
		},
		{
			// 거래유형
			headerText: t('lbl.CUST_TYPE'),
			dataField: 'custtype',
			dataType: 'code',
		},
		{
			// 주소
			headerText: t('lbl.ADDRESS'),
			dataField: 'address1',
			dataType: 'default',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: selectionMode,
		extraColumnOrders: ['showRowNumColumn', 'showRowCheckColumn'],
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
		//setCurrentPage(1);
		gridRef.current.clearGridData();
		/*
		if (commUtil.isNull(form.getFieldValue(name)) && commUtil.isNull(form.getFieldValue('multiSelect'))) {
			showAlert('', '코드/명 또는 다중선택을 입력하십시오.');
			return;
		}
			*/

		search(true, 'FW00', form.getFieldValue(name), form.getFieldValue('multiSelect'), 1);
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ storerkey: 'FW00', [name]: '', multiSelect: '' });
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

		if (multiCnt > 999) {
			showAlert(null, t('msg.maxMultiSelect'));
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
		if (gridData && gridData.length > 0) {
			// gridRef.current.setGridData(gridData);
			gridRef.current.appendData(gridData);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		} else {
			// 빈 데이터 바인딩으로 noDataMessage 노출
			gridRef.current.setGridData([]);
		}
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="본점 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						{/* <li style={{ gridColumn: 'span 2' }}>
							<span>
								<SelectBox
									label="회사"
									name="storerkey"
									placeholder="선택해주세요"
									options={[{ cdNm: '[FW00]씨제이프레시웨이', comCd: 'FW00' }]}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									disabled
								/>
							</span>
						</li> */}

						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								label={'본점코드/명'}
								width={80}
								name={name}
								placeholder={t('msg.placeholder2', ['본점코드 또는 이름'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li style={{ gridColumn: 'span 2' }}>
							<InputText
								label="다중선택"
								name="multiSelect"
								onPaste={handlePaste}
								disabled={selectionMode === 'singleRow'}
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
export default CmCustBrandPopup;
