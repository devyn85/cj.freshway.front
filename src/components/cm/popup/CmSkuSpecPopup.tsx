/*
 ############################################################################
 # FiledataField	: CmSkuSpecPopup.tsx
 # Description		: 상품 분류 조회 팝업
 # Author			: KimSunHo
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// component
import PopupMenuTitle2 from '@/components/common/custom/PopupMenuTitle2';
import { SearchForm } from '@/components/common/custom/form';
// Utils
// Store
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
}

const CmSkuSpecPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, searchName, gridData, search, selectionMode, close, setCurrentPage, gridRef, form, name } = props;
	const { t } = useTranslation();

	const [searchBox] = useState({
		searchVal: '',
		multiSelect: '',
		defDccode: '2600',
	});

	const gridId = uuidv4() + '_gridWrap';

	// 그리드 칼럼 정의
	const gridCol = [
		{
			// 상품분류코드
			headerText: '상품분류',
			dataField: 'spec',
			style: 'left',
		},
		{
			// 상품분류코드
			headerText: '상품분류코드',
			dataField: 'speccode',
			visible: false,
		},
		{
			// 상품분류명
			headerText: '상품분류명',
			dataField: 'specdescr',
			style: 'left',
			visible: false,
		},
		{
			dataField: 'refUpperSpecCode',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
	];

	// 그리드 속성 정의
	const gridProps = {
		editable: false,
		enterKeyColumnBase: true,
		useContextMenu: false,
		enableFilter: false,
		// 헤더 표시하지 않음
		showHeader: false,
		// 줄번호 칼럼 렌더러 출력 안함
		showRowNumColumn: false,
		// singleRow 선택모드
		selectionMode: 'singleRow',
		// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
		treeColumnIndex: 0,
		// 최초 보여질 때 모두 열린 상태로 출력 여부 -> 이 설정이 적용되지 않아서 그리드의 ready 이벤트에서 collapseAll() 호출함
		displayTreeOpen: false,
		// 일반 데이터를 트리로 표현할지 여부(treeIdField, treeIdRefField 설정 필수)
		flat2tree: true,
		// 행의 고유 필드명
		rowIdField: 'rowId',
		// 트리의 고유 필드명
		treeIdField: 'speccode',
		// 계층 구조에서 내 부모 행의 treeIdField 참고 필드명
		treeIdRefField: 'refUpperSpecCode',
		// 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		fillColumnSizeMode: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	const init = () => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));
	};

	/**
	 * 메뉴 타이틀에 연결할 함수
	 */
	const titleFunc = () => {
		/**/
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
			// //console.log('선택된 로우 0');
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
	 * 화면 초기화
	 */
	useEffect(() => {
		init();
	}, []);

	/**
	 * 부모페이지의 검색어를 가져온다.
	 *  - 검색어에 관계없이 전체 데이터를 조회한다.
	 */
	useEffect(() => {
		//form.setFieldValue(name, searchName);
	}, [searchName]);

	/**
	 * data가 조회되면 그리드에 바인딩
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData);
		}
	}, [gridData]);

	/**
	 * 그리드 데이터 바인딩 이벤트
	 */
	useEffect(() => {
		gridRef.current.bind('ready', () => {
			// 그리드 데이터 바인딩 후에 트리를 모두 닫기로 설정
			gridRef.current.collapseAll();
		});
	});

	/**
	 * 그리드 셀 더블클릭 이벤트 - 해당 로우를 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', () => {
			selectRowData();
		});
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle2 name="상품분류" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
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
			</SearchForm>
		</>
	);
};

export default CmSkuSpecPopup;
