/*
 ############################################################################
 # FiledataField	: CmCustPopup.tsx
 # Description		: 거래처조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
const { TabPane } = Tabs;

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

import CmStorerKeySelectBox from '@/components/cm/user/CmStorerKeySelectBox';
import { InputSearch, InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import TextArea from 'antd/es/input/TextArea';

// API Call Function

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

const CmTestPopup = (props: PropsType) => {
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

	const custTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	const gridCol = [
		{
			// 거래처코드
			headerText: '거래처코드',
			dataField: 'code',
		},
		{
			// 거래처명
			headerText: '거래처명',
			dataField: 'name',
			style: 'left',
		},
		{
			// 거래처유형
			headerText: '거래처유형',
			dataField: 'custType',
			labelFunction: custTypeLabelFunc,
		},
		{
			// 기본주소
			headerText: '기본주소',
			dataField: 'address1',
			style: 'left',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: selectionMode,
		showRowCheckColumn: selectionMode === 'multipleRows' ? true : false,
		showAutoNoDataMessage: true,
		noDataMessage: 'asdfasdf',
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
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain');
		const transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 999) {
			showAlert(null, t('msg.maxMultiSelect'));
			return;
		}

		setMultiSelectCount(multiCnt);
		form.setFieldsValue({ multiSelect: transformedText });
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
			setMultiSelectCount(searchName.split(',')?.length);
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

	// 스크롤 이벤트
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

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="거래처조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<span>
								<CmStorerKeySelectBox nameKey="storerKey" label={'회사'} />
							</span>
						</li>
						<li>
							<span>
								<InputText
									width={80}
									name={name}
									placeholder={t('msg.placeholder2', ['거래처코드 또는 이름'])}
									onPressEnter={onClickSearchButton}
									label={'거래처코드/명'}
								/>
							</span>
						</li>
						<li>
							<span>
								<InputText
									name="multiSelect"
									onPaste={handlePaste}
									disabled={selectionMode === 'singleRow'}
									label={'다중선택'}
								/>
								{/* <Button size={'small'}>다중선택</Button> */}({multiSelectCount}/999)
							</span>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			<Tabs defaultActiveKey="1">
				<TabPane tab="거래처 정보" key="1" />
				<TabPane tab="상세정보" key="2" />
				<TabPane tab="품목정보" key="3" />
				<TabPane tab="변경이력" key="4" />
			</Tabs>

			<table className="data-table">
				<colgroup>
					<col style={{ width: '15%' }} />
					<col />
					<col style={{ width: '15%' }} />
					<col />
				</colgroup>
				<thead>
					<tr>
						<th colSpan={4}>거래처 정보</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>회사</th>
						<td>dd</td>
						<th>거래처</th>
						<td>dd</td>
					</tr>
					<tr>
						<th>내역</th>
						<td colSpan={3}>dd</td>
					</tr>
					<tr>
						<th>차량 소유주명</th>
						<td>dd</td>
						<th>우편번호</th>
						<td>dd</td>
					</tr>
					<tr>
						<th>주소</th>
						<td className="ta-l" colSpan={3}>
							경상북도 김천시 아포읍 한지2길 45 한마음지역아동센터
						</td>
					</tr>
					<tr>
						<th>사업자 등록</th>
						<td>dd</td>
						<th>사업자등록 종목</th>
						<td>dd</td>
					</tr>
					<tr>
						<th>사업자등록번호</th>
						<td>dd</td>
						<th>전화번호</th>
						<td>dd</td>
					</tr>
					<tr>
						<th>메모</th>
						<td colSpan={3}>
							경상북도 김천시 아포읍 한지2길 45 한마음지역아동센터 경상북도 김천시 아포읍 한지2길 45 한마음지역아동센터
							경상북도 김천시 아포읍 한지2길 45 한마음지역아동센터 경상북도 김천시 아포읍 한지2길 45 한마음지역아동센터
						</td>
					</tr>
				</tbody>
			</table>

			<table className="data-table">
				<colgroup>
					<col style={{ width: '15%' }} />
					<col />
					<col style={{ width: '15%' }} />
					<col />
				</colgroup>
				<thead>
					<tr>
						<th colSpan={4}>거래처 정보</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>회사</th>
						<td>
							<InputText placeholder="입력" />
						</td>
						<th>거래처</th>
						<td>
							<InputText placeholder="입력" />
						</td>
					</tr>
					<tr>
						<th>내역</th>
						<td colSpan={3}>
							<InputSearch placeholder="검색어 입력" />
						</td>
					</tr>
					<tr>
						<th>차량 소유주명</th>
						<td>
							<InputText placeholder="입력" />
						</td>
						<th>우편번호</th>
						<td>
							<InputText placeholder="입력" />
						</td>
					</tr>
					<tr>
						<th>주소</th>
						<td className="ta-l" colSpan={3}>
							<InputText placeholder="입력" />
						</td>
					</tr>
					<tr>
						<th>사업자 등록</th>
						<td>
							<InputText placeholder="입력" />
						</td>
						<th>사업자등록 종목</th>
						<td>
							<InputText placeholder="입력" />
						</td>
					</tr>
					<tr>
						<th>사업자등록번호</th>
						<td>
							<InputText placeholder="입력" />
						</td>
						<th>전화번호</th>
						<td>
							<InputText placeholder="입력" />
						</td>
					</tr>
					<tr>
						<th>메모</th>
						<td colSpan={3}>
							<TextArea placeholder="입력" autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: '100%' }} />
						</td>
					</tr>
				</tbody>
			</table>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					취소
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					확인
				</Button>
			</ButtonWrap>

			<ButtonWrap data-props="single">
				<Button size={'middle'} block>
					바로가기
				</Button>
			</ButtonWrap>
			<ButtonWrap data-props="message">
				<div>
					<Button size={'middle'}>Excel 선택</Button>
					<Button size={'middle'}>유효성검증</Button>
				</div>
				<div>
					<Button size={'middle'}>닫기</Button>
					<Button size={'middle'} type={'primary'}>
						저장
					</Button>
				</div>
			</ButtonWrap>
		</>
	);
};

export default CmTestPopup;
