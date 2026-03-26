/*
############################################################################
 # FiledataField	: TmHjdPopUp.tsx
 # Description		: 센터별구간설정(행정동팝업)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
 ############################################################################
*/
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// component
import { InputText, SearchFormResponsive } from '@/components/common/custom/form';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';
// API Call Function
import { apiPostStTplIssueReqPopupData } from '@/api/st/apiStTplIssueReq';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { isEmpty } from 'lodash';

interface PropsType {
	// type?: string;
	callBack?: any;
	close?: any;
	codeName?: string;
	data: any;
}

const StTplReqSkuPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);
	const [multiSelectCount, setMultiSelectCount] = useState(0);
	const throttle = useThrottle();

	// scroll Paging
	const [gridData, setGridData] = useState([]);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const [searchBox] = useState({
		codeName: '',
	});

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const gridId = uuidv4() + '_gridWrap';

	const gridColWd = [
		{
			headerText: '상품코드',
			dataField: 'sku',
			width: 246,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '상품명',
			dataField: 'skuName',
			visible: true,
			editable: false,
		},
		{
			headerText: '단위',
			dataField: 'uom',
			dataType: 'code',
			visible: true,
			editable: false,
		},
		{
			headerText: '현재고',
			dataField: 'qty',
			dataType: 'numeric',
			visible: true,
			editable: false,
		},
		{
			headerText: '출고량',
			dataField: 'orderQty',
			dataType: 'numeric',
			visible: true,
			editable: true,
		},
		{
			headerText: '입고일',
			dataField: 'deliveryDate',
			dataType: 'date',
			visible: true,
			editable: false,
		},
		{
			headerText: 'BL번호',
			dataField: 'convSerialNo',
			visible: true,
			editable: false,
		},
		{
			headerText: '이력번호',
			dataField: 'serialNo',
			visible: true,
			editable: false,
		},
	];

	const gridColDp = [
		{
			headerText: '상품코드',
			dataField: 'sku',
			width: 246,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '상품명',
			dataField: 'skuName',
			visible: true,
			editable: false,
		},
		{
			headerText: '단위',
			dataField: 'baseUom',
			dataType: 'code',
			visible: true,
			editable: false,
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: props.data.docType === 'WD' ? true : false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param prarms
	 */
	const search = (prarms: any) => {
		apiPostStTplIssueReqPopupData(prarms).then((res: any) => {
			setGridData(res?.data?.list);
		});
	};
	const init = () => {
		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef.current.bind('cellEditEnd', (event: any) => {
			const row = event.rowIndex;

			const e = event.dataField;
			const data = event.item;
			if (event.dataField === 'orderQty') {
				if (data.orderQty > data.qty) {
					showAlert('', '현재고 보다 출고 수량이 더 많습니다.');
					gridRef.current.setCellValue(row, 'orderQty', event.oldValue);
					return;
				}
				if (data.orderQty <= 0) {
					if (String(event.value ?? '') === String(event.oldValue ?? '')) return;
					showAlert('', '출고량은 0보다 작을 수 없습니다.');
					gridRef.current.setCellValue(row, 'orderQty', event.oldValue);
					return false;
				}
			}
		});

		gridRef.current.clearGridData();
		// search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));

		const param = {
			custkey: props.data.custKey,
			organize: props.data.organize,
			dcCode: props.data.dcCode,
			sku: form.getFieldsValue().sku,
			docType: props.data.docType,
			tplUser: props.data.tplBcnrId,
			listCount: 500,
		};
		search(param);
	};
	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		gridRef.current.clearGridData();
		const param = {
			custkey: props.data.custKey,
			organize: props.data.organize,
			dcCode: props.data.dcCode,
			sku: form.getFieldsValue().sku,
			docType: props.data.docType,
			tplUser: props.data.tplBcnrId,
			multiSelect: form.getFieldValue('multiSelect'),
			listCount: 500,
		};
		search(param);
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ sku: '', skuName: '' });
		gridRef.current.clearGridData();
	};
	/**
	 * 메뉴 타이틀에 연결할 함수
	 */
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
	 * @param event
	 */
	const checkRowData = (event: any) => {
		const checkedRow = gridRef.current.getCheckedRowItemsAll();

		if (checkedRow.length === 0) {
			const selectedRow = gridRef.current.getSelectedRows();
			if (!isEmpty(selectedRow)) {
				callBack(selectedRow);
			}
			return;
		}
		callBack(checkedRow);
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

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		init();
	}, []);

	/**
	 * 부모페이지의 검색어를 가져온다.
	 *  - 검색어에 관계없이 전체 데이터를 조회한다.
	 */

	/**
	 * data가 조회되면 그리드에 바인딩
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData);
			if (gridData.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
			}
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
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;
		const layout = props.data?.docType === 'WD' ? gridColWd : gridColDp;
		// AUIGrid API: setColumnLayout 또는 setColumnProp 사용 가능하면 호출
		if (typeof grid.setColumnLayout === 'function') {
			grid.setColumnLayout(layout);
		} else {
			// 없으면 강제 리바인드(대안: key로 리마운트)
			grid.clearGridData();
			grid.setGridData([]);
		}
	}, [props.data?.docType]);
	/**
	 * 그리드 셀 더블클릭 이벤트 - 해당 로우를 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', (event: any) => {
			// const selectedRow = gridRef.current.getSelectedRow();
			const selectedRow = gridRef.current.getSelectedRows();
			// //console.log(selectedRow);
			// selectRowData();
			callBack([selectedRow[0]]);
		});
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="위탁입출고 상품검색" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox} isAlwaysVisible groupClass="grid-column-2">
				{/* <UiFilterArea>
					<UiFilterGroup className="grid-column-4"> */}
				<li>
					<InputText
						name="sku"
						placeholder={t('msg.placeholder2', ['상품코드 또는 이름'])}
						onPressEnter={onClickSearchButton}
						label={'상품코드/명'}
						// required
					/>
				</li>
				{/* <li style={{ gridColumn: 'span 2' }}>
					<InputText
						name="multiSelect"
						onPaste={handlePaste}
						// disabled={selectionMode === 'singleRow'}
						onPressEnter={onClickSearchButton}
						label={'다중선택'}
						onChange={onChangeMultiSelect}
						count={{
							show: true,
							max: 5000,
							strategy: () => multiSelectCount,
						}}
					/>
				</li> */}
				{/* </UiFilterGroup>
				</UiFilterArea> */}
			</SearchFormResponsive>
			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid
					ref={gridRef}
					columnLayout={props.data.docType === 'WD' ? gridColWd : gridColDp}
					gridProps={gridProps}
					name={gridId}
				/>
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={props.close}>취소</Button>
				<Button type="primary" onClick={checkRowData}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default StTplReqSkuPopup;
