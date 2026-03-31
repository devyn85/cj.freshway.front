/*
 ############################################################################
 # FiledataField	: CmPurchaseBuyerHstPopup.tsx
 # Description		: 수급담당 변경이력 조회 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.05.15
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
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
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
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	totalCount?: number;
	sku?: string;
}

const CmPurchaseBuyerHstPopup = (props: PropsType) => {
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
		sku,
	} = props;

	const { t } = useTranslation();

	const [searchBox] = useState({
		name: '',
	});

	const gridId = uuidv4() + '_gridWrap';

	const custTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	const gridCol = [
		{
			// 물류센터
			headerText: t('lbl.DCCODE'),
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			// 구매처유형
			headerText: t('lbl.CUSTTYPE_PO'),
			dataField: 'custtype',
			dataType: 'code',
			labelFunction: custTypeLabelFunc,
		},
		{
			// 상품코드
			headerText: t('lbl.SKUCD'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			// 변경이력
			headerText: '변경이력',
			dataField: 'hstTxt',
			dataType: 'string',
		},
		{
			// 로그일자
			headerText: t('lbl.LOGDATE'),
			dataField: 'logdate',
			dataType: 'date',
			format: 'YYYY-MM-DD HH:mm:ss',
		},
		{
			// 로그생성자
			headerText: t('lbl.LOGWHO'),
			dataField: 'logwho',
			dataType: 'manager',
			managerDataField: 'logwho',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'multipleCells',
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
		enableRowCheck: selectionMode === 'multipleRows',
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
		// 필수 입력 검증
		if (commUtil.isNull(form.getFieldValue(name))) {
			showAlert(null, '상품코드는 필수 입력입니다.');
			return;
		}
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name));
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ [name]: '' });
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
			form.setFieldValue(name, searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
			setTimeout(() => {
				// 검색 후 변경
				form.setFieldValue(name, searchName);
			});
		}

		onClickSearchButton();
	}, [searchName]);

	/**
	 * sku props가 전달되면 상품코드 input에 설정하고 자동 조회
	 */
	useEffect(() => {
		if (sku) {
			form.setFieldValue(name, sku);
			// 자동 조회 실행
			setTimeout(() => {
				onClickSearchButton();
			}, 100);
		}
	}, [sku]);

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		if (!gridRef.current) return;

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
		gridRef.current.addRow(gridData);

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="수급담당 변경이력 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							{/* 물류센터 */}
							<CmGMultiDccodeSelectBox
								name="gMultiDccode"
								label={t('lbl.DCCODE')}
								mode="single"
								// disabled={true}
								required
							/>
						</li>

						<li>
							<InputText
								label={t('lbl.SKUCD')}
								width={80}
								name={name}
								placeholder={t('msg.placeholder2', ['상품코드'])}
								onPressEnter={onClickSearchButton}
								required
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

export default CmPurchaseBuyerHstPopup;
