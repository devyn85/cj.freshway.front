import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import i18n, { t } from 'i18next';
import AUIGridReact, { IState } from './AUIGridReact';

// APIs
import { apiPostExcelDownload } from '@/api/cm/apiCmExcel';
import { apiGetUserBySelType, apiGetUserEmailByUserId } from '@/api/cm/apiCmMain';
import { apiPostSaveEmail, apiPostSaveSms } from '@/api/cm/apiCmSend';

import CmCarInfoPopup from '@/components/cm/popup/CmCarInfoPopup';
import CmCustInfoPopup from '@/components/cm/popup/CmCustInfoPopup';
import CmGridFindPopup from '@/components/cm/popup/CmGridFindPopup';
import CmPartnerInfoPopup from '@/components/cm/popup/CmPartnerInfoPopup';
import CmSendUserPopup from '@/components/cm/popup/CmSendUserPopup';
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomDraggableModal from '@/components/common/custom/CustomDraggableModal';
import CustomModal from '@/components/common/custom/CustomModal';
import DropdownRendererInGrid from '@/components/common/custom/DropdownRendererInGrid';
import store from '@/store/core/coreStore';
import { dispatchSetLoading } from '@/store/core/loadingStore';
import dataRegex from '@/util/dataRegex';
import dateUtils from '@/util/dateUtil';
import { Dropdown, FormInstance } from 'antd';
import FileSaver from 'file-saver';
import React from 'react';
import * as gridUtil from './auIGridUtil';

/**
 * 팝업 타입
 * @type {popupType} sku : 상품상세 / car : 차량상세 / cust : 거래처상세
 * @description dataField 키와 상관없이 팝업 타입을 지정할 수 있도록 함
 */
type popupType = 'sku' | 'car' | 'cust';

type popupContextMenuType = 'sendEmail' | 'sendSms';

// 부모 클래스의 IState를 확장
interface ICanalState extends IState {
	popupState?: {
		visible: boolean;
		params: any;
		popupType: popupType;
		width?: string;
		height?: string;
	};
	popupContextMenuState?: {
		visible: boolean;
		params: any;
		popupType: popupContextMenuType;
	};
	popupFindState?: {
		visible: boolean;
		params: any;
	};
	searchDropdownState?: {
		visible: boolean;
		[key: string]: any;
	};
}

const initPopupState: ICanalState['popupState'] = {
	visible: false,
	params: {},
	popupType: 'sku',
};

const initPopupContextMenuState: ICanalState['popupContextMenuState'] = {
	visible: false,
	params: {},
	popupType: 'sendSms',
};

const initPopupFindState: ICanalState['popupFindState'] = {
	visible: false,
	params: {},
};

const initSearchDropdownState: ICanalState['searchDropdownState'] = {
	visible: false,
};

class AUIGridReactCanal extends AUIGridReact {
	private modalInfoRef: React.RefObject<any>;
	private modalContextMenuRef: React.RefObject<any>;
	private modalFindRef: React.RefObject<any>;
	private _isMounted = false; // 마운트 상태 추적
	private keydownHandler: (e: KeyboardEvent) => void; // 키보드 이벤트 핸들러
	private keydownHandlerWindow: (e: KeyboardEvent) => void; // 키보드 이벤트 핸들러
	private handleDocumentMouseDown: (e: MouseEvent) => void; // 문서 마우스다운 이벤트 핸들러

	constructor(props: any) {
		super(props);
		this.modalInfoRef = React.createRef();
		this.modalContextMenuRef = React.createRef();
		this.modalFindRef = React.createRef();

		// 키보드 이벤트 핸들러 바인딩
		this.keydownHandler = this.handleKeydown?.bind(this);
		this.keydownHandlerWindow = this.handleKeydownWindow?.bind(this);

		// 타입 단언을 사용하여 상태 초기화
		this.state = {
			...this.state,
			popupState: initPopupState,
			popupContextMenuState: initPopupContextMenuState,
			popupFindState: initPopupFindState,
			searchDropdownState: initSearchDropdownState,
		} as ICanalState;
	}

	private _keyBlockWait = 100; // 연속 입력 무시 시간(ms) - 100~200ms 권장
	private _keyBlocked = false;

	// 스로틀(drop): 첫 입력만 통과, 대기 중 추가 입력은 무시
	private tryEnterKeyWindow(): boolean {
		if (this._keyBlocked) return false;
		this._keyBlocked = true;
		setTimeout(() => (this._keyBlocked = false), this._keyBlockWait);
		return true;
	}

	/**
	 * 키보드 이벤트 핸들러
	 * @param {KeyboardEvent} e 키보드 이벤트
	 * @returns {boolean | void} 이벤트 처리 결과
	 */
	handleKeydown(e: KeyboardEvent) {
		if (['home', 'end'].includes(e.key?.toLowerCase())) {
			e.preventDefault();
			e.stopPropagation();

			if (!this.tryEnterKeyWindow()) return;

			switch (e.key?.toLowerCase()) {
				case 'home':
					gridUtil.moveToColumnCell(this, 'first');
					break;
				case 'end':
					gridUtil.moveToColumnCell(this, 'last');
					break;
				case 'arrowdown':
					gridUtil.moveToRowByAllowUpDown(this, 'arrowDown');
					break;
				case 'arrowup':
					gridUtil.moveToRowByAllowUpDown(this, 'arrowUp');
					break;
			}
			return false;
		}
	}

	/**
	 * 키보드 이벤트 핸들러
	 * @param {KeyboardEvent} e 키보드 이벤트
	 * @returns {boolean | void} 이벤트 처리 결과
	 */
	handleKeydownWindow(e: KeyboardEvent) {
		/**
		 *
		 * @returns {boolean} 마스터 그리드인지 확인
		 */
		const checkMasterGrid = () => {
			const isElements: boolean =
				document.getElementsByClassName('aui-grid-wrap') && document.getElementsByClassName('aui-grid-wrap').length > 0;
			if (isElements && this.state.id !== document.getElementsByClassName('aui-grid-wrap')[0].id) {
				return false;
			}
			return true;
		};

		const handleHomeEndPageUpDown = (e: KeyboardEvent) => {
			if (['home', 'end', 'pageup', 'pagedown'].includes(e.key?.toLowerCase())) {
				if (!(e.shiftKey && e.ctrlKey)) {
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				switch (e.key?.toLowerCase()) {
					case 'home':
						gridUtil.moveToColumnCell(this, 'first');
						break;
					case 'end':
						gridUtil.moveToColumnCell(this, 'last');
						break;
					case 'pageup':
						gridUtil.moveToColumnCellByPageUpDown(this, 'pageUp');
						break;
					case 'pagedown':
						gridUtil.moveToColumnCellByPageUpDown(this, 'pageDown');
						break;
				}
			}
		};

		const isMasterGrid = checkMasterGrid();

		if (!isMasterGrid) {
			return;
		}

		handleHomeEndPageUpDown(e);
	}

	/**
	 * 팝업 상태 초기화
	 */
	initPopupState() {
		// 컴포넌트가 마운트된 상태에서만 setState 호출
		if (this._isMounted) {
			this.setState((prevState: ICanalState) => ({
				...prevState,
				popupState: initPopupState,
			}));
		}
	}

	/**
	 * 컨텍스트 메뉴 팝업 상태 초기화
	 */
	initPopupContextMenuState() {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupContextMenuState: initPopupContextMenuState,
		}));
	}

	/**
	 * 찾기 팝업 상태 초기화
	 */
	initPopupFindState() {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupFindState: initPopupFindState,
		}));
	}

	/**
	 * 검색 드롭다운 팝업 상태 초기화
	 */
	initSearchDropdownState() {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			searchDropdownState: initSearchDropdownState,
		}));
	}

	/**
	 * 팝업 열기
	 * @param {any} params 각 팝업 정보 Get API 파라미터
	 * @param {popupType} popupType 팝업 타입 (sku : 상품상세 / car : 차량상세 / cust : 거래처상세)
	 */
	openPopup(params: any, popupType: popupType) {
		if (!this._isMounted) return;

		let width = '800px';

		if (popupType === 'sku') {
			width = '1080px';
		}

		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupState: {
				visible: true,
				params: params,
				popupType: popupType,
				width: width,
			},
		}));

		// modalRef 안전성 검사
		if (this.modalInfoRef.current?.handlerOpen) {
			this.modalInfoRef.current.handlerOpen();
		}
	}

	/**
	 * 팝업 닫기
	 */
	closePopup() {
		// modalRef 안전성 검사
		if (this.modalInfoRef.current?.handlerClose) {
			this.modalInfoRef.current.handlerClose();
		}
		this.initPopupState();
	}

	/**
	 * 컴포넌트 마운트 시 초기화
	 */
	componentDidMount() {
		super.componentDidMount();
		this._isMounted = true;

		// 키보드 이벤트 리스너 등록
		const gridElement = document.getElementById(this.state.id);
		if (gridElement) {
			gridElement.addEventListener('keydown', this.keydownHandler, true);
			window.addEventListener('keydown', this.keydownHandlerWindow, true);
		}

		// 검색 드롭다운 외부 클릭 이벤트 리스너 등록
		this.handleDocumentMouseDown = (e: any) => {
			const { searchDropdownState } = this.state as ICanalState;
			if (searchDropdownState?.visible) {
				if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'aui-grid-dropdown-content') {
					this.closeSearchDropdownPopup();
				}
			}
		};
		document.addEventListener('mousedown', this.handleDocumentMouseDown);
	}

	/**
	 * 컴포넌트 언마운트 시 초기화
	 */
	componentWillUnmount(): void {
		this._isMounted = false;

		// 키보드 이벤트 리스너 제거
		const gridElement = document.getElementById(this.state.id);
		if (gridElement) {
			gridElement.removeEventListener('keydown', this.keydownHandler, true);
			window.removeEventListener('keydown', this.keydownHandlerWindow, true);
		}

		// 문서 마우스다운 이벤트 리스너 제거
		if (this.handleDocumentMouseDown) {
			document.removeEventListener('mousedown', this.handleDocumentMouseDown);
		}

		this.initPopupState();
		this.initPopupContextMenuState();
		this.initPopupFindState();
		this.initSearchDropdownState();

		// 팝업이 열려있다면 닫기
		if (this.modalInfoRef.current?.handlerClose) {
			this.modalInfoRef.current.handlerClose();
		}

		// 부모 클래스의 정리 작업 호출 ( 메모리 누수 방지 )
		super.componentWillUnmount();
	}

	/**
	 * 그리드의 컬럼 레이아웃 변경 시 공통내용 적용하고자 할 때
	 * @function changeColumnLayout 그리드의 컬럼 레이아웃 변경 시 공통내용 적용하고자 할 때
	 * @param {object} colModel 새 컬럼 모델
	 * @param {boolean} useOpts props 사용여부
	 * @returns {void}
	 */
	changeColumnLayoutData(colModel: object[], useOpts?: boolean) {
		// 공통 함수 처리
		colModel = useOpts
			? gridUtil.adjustColModel(colModel, this, this.props?.gridProps)
			: gridUtil.adjustColModel(colModel, this);
		super.changeColumnLayout(colModel);
		//	ref.current.resize();

		return;
	}

	/**
	 * 그리드의 데이터를 list 형태로 리턴
	 * @function getChangedData
	 * @param {object} addOpt allRowYn: 데이터 전체여부, validationYn : required 검증여부(default : true), andCheckedYn : 체크박스 AND 조건여부(default : true)
	 * @returns {string} 그리드 데이터 list return
	 */
	getChangedData(addOpt?: object) {
		// 기본 함수 옵션
		const defaultOpt = {
			allRowYn: false, // 모든 행 반환 여부
			validationYn: true, //  required 검증여부
			andCheckedYn: true, // 체크박스 AND 조건여부(default : true)
		};

		const dsOpt = { ...defaultOpt, ...addOpt };

		const allRowYn = commUtil.nvl(dsOpt.allRowYn, false);
		const validationYn = commUtil.nvl(dsOpt.validationYn, true);
		const andCheckedYn = commUtil.nvl(dsOpt.andCheckedYn, true);
		const rowIdField = this.props.gridProps?.rowIdField ?? '_$uid';

		let ret = [];
		//현재 그리드에 표시된 전체 데이터 리턴
		if (allRowYn === true) {
			const groupingFields = super.getProp('groupingFields') || []; //그룹핑필드 정보
			const summaryFields = super.getProp('summaryFields') || []; //그룹핑 합계필드 정보
			if (allRowYn === true && groupingFields.length > 0) {
				super.setGroupBy([]); //그룹핑 임시해제
			}
			const allData = super.getOrgGridData();
			if (allRowYn === true && groupingFields.length > 0) {
				super.setGroupBy(groupingFields, summaryFields); //그룹핑 원상복구
			}

			for (const i in allData) {
				allData[i].rowStatus = 'I';
				ret.push(allData[i]); // insert 로 취급
			}
			return ret;
		}

		//변경된 데이터만 리턴 (삭제->수정->신규행 순으로 저장)
		let rowItems = super.getRemovedItems();
		for (const i in rowItems) {
			rowItems[i].rowStatus = 'D';
			ret.push(rowItems[i]);
		}
		rowItems = super.getEditedRowItems();

		// 커스텀 체크박스 칼럼만 수정된 경우 변경된 DATA에서 제외
		const targetKeySet = new Set([
			this.getProp('rowIdField') || '_$uid',
			this.getProp('customRowCheckColumnDataField'),
		]);
		const result = super.getEditedRowColumnItems()?.filter(obj => {
			const objKeys = Object.keys(obj);
			return !(objKeys.length === targetKeySet.size && objKeys.every(key => targetKeySet.has(key)));
		});
		for (const i in rowItems) {
			// 실제 변경된 DATA인 경우에만 변경 목록에 추가
			const exists = result?.some(item => item[rowIdField] === rowItems[i][rowIdField]);
			if (exists) {
				rowItems[i].rowStatus = 'U';
				ret.push(rowItems[i]);
			}
		}

		rowItems = super.getAddedRowItems();
		for (const i in rowItems) {
			rowItems[i].rowStatus = 'I';
			ret.push(rowItems[i]);
		}

		if (andCheckedYn) {
			// 변경된 ROW && 체크된 ROW LIST RETURN
			if (this.props.gridProps?.['showCustomRowCheckColumn']) {
				// 커스텀 엑스트라 체크박스
				// const checkedRowItems = this.getCustomCheckedRowItems();
				ret = ret.filter(
					(row: any) =>
						row.rowStatus === 'D' ||
						row[this.getProp('customRowCheckColumnDataField')] === this.getProp('customRowCheckColumnCheckValue'),
					// checkedRowItems.some((checkedItems: any) => {
					// 	return row[rowIdField] === checkedItems[rowIdField];
					// }),
				);
			} else if (this.props.gridProps?.['showRowCheckColumn']) {
				// 기본 엑스트라 체크박스
				const checkedRowItems = super.getCheckedRowItems();
				ret = ret.filter((row: any) =>
					checkedRowItems.some((checkedItems: any) => {
						return row[rowIdField] === checkedItems['item'][rowIdField];
					}),
				);
			}
		}

		if (!validationYn) {
			return ret;
		}
		// validation
		const validation = this.validateRequiredGridData();
		if (!validation) {
			return null; //throw new Error('Validation Error');
		}

		return ret;
	}

	/**
	 * 그리드의 데이터를 required 체크
	 * @function validateGridData
	 * @returns {boolean} validate 결과
	 */
	validateRequiredGridData(): boolean {
		const requiredList: any[] = []; // 필수값 체크 컬럼
		const primaryList: any[] = []; // PK값 체크 컬럼

		const collectRequiredColumns = (columns: any[]) => {
			for (const item of columns) {
				// 필수 칼럼 추가
				if (item.required) {
					requiredList.push(item);
				}

				// PK 칼럼 추가
				if (item.usePrimaryKey) {
					primaryList.push(item);
				}

				// 자식 칼럼도 체크
				if (item.children && item.children.length > 0) {
					collectRequiredColumns(item.children);
				}
			}
		};
		const columnLayout: any = super.getColumnLayout();
		collectRequiredColumns(columnLayout);

		let rowItems = [];
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			// 커스텀 엑스트라 체크박스
			rowItems = this.getCustomCheckedRowItems();
		} else {
			// 기본 엑스트라 체크박스
			rowItems = super.getCheckedRowItems()?.map(row => row.item);
		}

		// 필수값 체크
		for (const i in rowItems) {
			for (const j in requiredList) {
				const value = rowItems[i][requiredList[j].dataField];
				if (commUtil.isEmpty(value) || (typeof value === 'string' && commUtil.isEmpty(value.trim()))) {
					showAlert(null, requiredList[j].headerText + '은(는) 필수값입니다.');

					// 해당 인덱스로 이동
					if (rowItems[i]._$uid) {
						const rowIndex = super.rowIdToIndex(rowItems[i]._$uid);
						const colIndex = columnLayout.findIndex((col: any) => col.dataField === requiredList[j].dataField);
						super.setSelectionByIndex(rowIndex, colIndex ?? 0);
					}

					return false;
				}
			}
		}

		// PK값 체크
		let gridData = [];
		if (primaryList.length > 0) {
			gridData = super.getGridData();
		}
		for (const i in primaryList) {
			const map = new Map();
			for (const j in gridData) {
				const value = gridData[j][primaryList[i].dataField];

				// 중복된 값이 있을 경우
				if (map.has(value)) {
					showAlert(null, primaryList[i].headerText + '의 중복된 값이 있습니다.');

					// 해당 인덱스로 이동
					if (gridData[j]._$uid) {
						const rowIndex = super.rowIdToIndex(gridData[j]._$uid);
						const colIndex = columnLayout.findIndex((col: any) => col.dataField === primaryList[i].dataField);
						super.setSelectionByIndex(rowIndex, colIndex ?? 0);
					}

					return false;
				} else {
					map.set(value, j);
				}
			}
		}

		return true;
	}

	/**
	 * 그리드 데이터 PK 체크
	 * columnList의 칼럼을 합친 값을 기준으로 PK를 체크 (ex. `${userId}${dccode}${storerkey}`)
	 * @function validatePKGridData
	 * @param {string[]} columnList PK 체크할 칼럼 목록 (ex. ['userId', 'dccode', 'storerkey'])
	 * @param {any[]} validateData 검증 데이터 (전달되면 해당 데이터로 검사, 아니면 그리드 전체 데이터 사용)
	 * @param {boolean} onlyNewRowChecked 신규행만 체크된 것 검증 여부
	 * @returns {boolean} validate 결과
	 */
	validatePKGridData(columnList: string[], onlyNewRowChecked?: string): boolean {
		if (columnList.length < 1) return false;

		const columnInfoList: any[] = []; // 체크 컬럼
		const collectRequiredColumns = (columns: any[]) => {
			for (const item of columns) {
				// 체크 칼럼 추가
				if (columnList.includes(item.dataField)) {
					columnInfoList.push(item);
				}

				// 자식 칼럼도 체크
				if (item.children && item.children.length > 0) {
					collectRequiredColumns(item.children);
				}
			}
		};
		const allColumnLayout: any = super.getColumnLayout();
		collectRequiredColumns(allColumnLayout);

		let gridData = super.getGridData();

		// 20260204@onlyNewRowChecked가 true이면, 신규행은 체크된것만, 나머지는 모두 (삭제행 제외) BY SSS
		// 기존 조회된 행 (rowStatus 없음 또는 'R'): 모두 포함
		// 신규행 (rowStatus === 'I'): 체크된 것만 포함
		// 수정된 행 (rowStatus === 'U'): 모두 포함
		// 삭제행 (rowStatus === 'D'): 제외
		if (onlyNewRowChecked == '1') {
			const checkedRows = this.getCheckedRowItems?.();
			const checkedRowIds = new Set(checkedRows?.map((row: any) => row.item?._$uid || row._$uid) ?? []);
			gridData = gridData.filter((item: any) => {
				// 삭제행(D) 제외
				if (item.rowStatus === 'D') {
					return false;
				}
				// 신규행(I): 체크된 것만 포함
				if (item.rowStatus === 'I') {
					return checkedRowIds.has(item._$uid);
				}
				// 나머지(기존행, 수정된 행): 모두 포함
				return true;
			});
		}

		const map = new Map();
		for (const i in gridData) {
			let value = '';
			for (const j in columnInfoList) {
				value += `${gridData[i][columnInfoList[j].dataField]}`.toUpperCase();
			}

			// 중복된 값이 있을 경우
			if (map.has(value)) {
				const columnTxt = columnInfoList?.map((info: any) => info.headerText).join('+');
				showAlert(null, `[ ${columnTxt} ] 조합의 중복된 값이 있습니다.`);

				// 해당 인덱스로 이동 (validateData가 없을 때만)
				if (gridData[i]._$uid) {
					const rowIndex = super.rowIdToIndex(gridData[i]._$uid);
					const colIndex = allColumnLayout.findIndex((col: any) => col.dataField === columnInfoList[0].dataField);
					super.setSelectionByIndex(rowIndex, colIndex ?? 0);
				}

				return false;
			} else {
				map.set(value, i);
			}
		}

		return true;
	}

	/**
	 * 그리드 수정 시, 여러 dataField에 중복된 값의 조합이 있는지 확인한다
	 * @function checkDuplicateValue
	 * @example dataField1과 dataField2의 조합이 중복되어 존재하는가?
	 * @param {Array} columnNames 중복 검사 대상 컬럼
	 * @returns {boolean} 중복 여부
	 */
	checkDuplicateValue(columnNames: string[]) {
		// for Canal Frame
		const gridData = super.getGridData();
		if (commUtil.isEmpty(gridData)) {
			return true;
		}

		// 1. 첫번째 컬럼의 모든 값을 가져온다
		const firstValues = super.getColumnDistinctValues(columnNames[0]);
		//
		// 2. 첫번째 컬럼의 값과 일치하는 모든 행을 찾고, 두번째 컬럼의 값이 중복되는 행이 있는지 확인한다
		for (const source of firstValues) {
			const findValues = super.getRowsByValue(columnNames[0], source).map((row: any) => row[columnNames[1]]);

			if (findValues.length !== new Set(findValues).size) {
				const duplicateText =
					super.getColumnItemByDataField(columnNames[0]).headerText +
					'와 ' +
					super.getColumnItemByDataField(columnNames[1]).headerText;
				showAlert(null, i18n.t('msg.MSG_COM_ERR_057', [duplicateText]));
				return false;
			}
		}
		return true;
	}

	/**
	 * 그리드의 데이터 엑셀 다운로드
	 * @function exportToXlsx
	 * @param {any} props  추가옵션,  데이터셋 이름, allRowYn: 데이터 전체여부
	 */
	exportToXlsxGrid(props?: any) {
		const exportOption = {
			...props,
			progressBar: false,
			showProcessLoader: false,
			localControl: true,
			exceptColumnFields: [...(props?.exceptColumnFields || []), ...[super.getProp('customRowCheckColumnDataField')]], // 커스텀 엑스트라 체크박스 제외
			beforeRequestCallback: () => {
				dispatchSetLoading(true);
			},
			afterRequestCallback: () => {
				dispatchSetLoading(false);
			},

			/**
			 * AUI 그리드에서 변환된 데이터를 받아 API로 전송 → DRM이 적용된 파일을 다운로드한다
			 * @param {*} data 엑셀 데이터
			 * @returns {void}
			 */
			localControlFunc: function (data: any) {
				const reader = new FileReader();
				reader.readAsDataURL(data);
				reader.onloadend = function () {
					let base64Data = reader.result;
					base64Data = base64Data.toString();
					base64Data = base64Data.split(',')[1];

					// 파일명 없을 경우 기본값 설정
					if (commUtil.isEmpty(props.fileName)) {
						props.fileName = `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`;
					}

					const params = {
						fileName: props.fileName?.replace(/[\/\\]/g, '_'),
						data: base64Data,
						drmUseYn: props.drmUseYn,
					};

					apiPostExcelDownload(params).then(res => {
						FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
					});
				};
			},
		};
		// setTimeout(() => {
		// 로딩바가 정상적으로 노출되지 않아 setTimeout 추가
		super.exportToXlsx(exportOption);
		// }, 100);
	}

	/**
	 * 저장 전 데이터 검증 후 확인 메시지 표시 ( 신규, 수정, 삭제 건수 표시 )
	 * @param {any} onOk 확인 함수
	 * @param {any} onCancel 취소 함수
	 * @param {object} addOpt 추가 옵션
	 * @example
	 * gridRef.current.showConfirmSave(() => {
	 * 	apiPostSave(params).then(res => {
	 * 	...
	 * });
	 */
	showConfirmSave(onOk?: any, onCancel?: any, addOpt?: object) {
		if (!gridUtil.validateRequiredBeforeSave(this)) {
			return;
		}

		let insertCount = 0;
		let updateCount = 0;
		let deleteCount = 0;

		const changedData = this.getChangedData({ validationYn: false });

		changedData?.forEach((item: any) => {
			switch (item.rowStatus) {
				case 'I':
					insertCount++;
					break;
				case 'U':
					updateCount++;
					break;
				case 'D':
					deleteCount++;
					break;
			}
		});

		const messageWithRowStatusCount = `${t('msg.MSG_COM_CFM_003')}
		신규 : ${insertCount}건
		수정 : ${updateCount}건
		삭제 : ${deleteCount}건`;

		showConfirm(null, messageWithRowStatusCount, onOk, onCancel, addOpt);
	}

	/**
	 * 현재 선택된 그리드의 ROW DATA 설정
	 * @param {object} params 설정할 DATA
	 * @param {number} rowIdx 설정할 ROW Index
	 */
	setSelectedRowValue(params: any, rowIdx?: number) {
		// params Object 타입 체크
		if (params instanceof Object) {
			// Row Index 설정
			if (commUtil.isEmpty(rowIdx) && commUtil.isNotEmpty(super.getSelectedIndex())) {
				rowIdx = super.getSelectedIndex()[0];
			}

			// 전달된 DATA를 그리드에 설정
			if (commUtil.isNotEmpty(rowIdx)) {
				Object.keys(params).forEach((key: any) => {
					super.setCellValue(rowIdx, key, params[key]);
				});
			}
		}
	}

	/**
	 * 현재 선택된 ROW의 이전 ROW 선택하기
	 */
	setPrevRowSelected() {
		// 현재 index 정보
		const curIdxPre = super.getSelectedIndex();
		// 첫번째 row가 아닐 경우
		if (!commUtil.isEmpty(curIdxPre) && curIdxPre[0] !== 0) {
			super.setSelectionByIndex(curIdxPre[0] - 1, curIdxPre[1]);
		}
	}

	/**
	 * 현재 선택된 ROW의 다음 ROW 선택하기
	 */
	setNextRowSelected() {
		// 현재 index 정보
		const curIdxPost = super.getSelectedIndex();
		// 마지막 row가 아닐 경우
		if (!commUtil.isEmpty(curIdxPost) && curIdxPost[0] !== super.getRowCount()) {
			super.setSelectionByIndex(curIdxPost[0] + 1, curIdxPost[1]);
		}
	}

	/**
	 * 전화걸기 팝업 열기
	 * @param {string} rcvrId 담당자 userId
	 * @param {string} telType [ 회사 / 핸드폰 ] 타입 구분
	 */
	openDialPopup(rcvrId: string, telType: string) {
		const { VITE_CLICK_TO_DIAL_URL } = import.meta.env;
		const user = store.getState().user.userInfo; // Redux store에서 직접 가져오기

		if (!rcvrId) {
			showAlert(null, '담당자 정보가 없습니다.');
			return;
		}

		// 담당자 전화번호 조회
		apiGetUserBySelType({ selType: 'telNo', userId: rcvrId }).then(res => {
			if (res.statusCode === 0) {
				if (
					(telType === 'phone' && commUtil.isNotEmpty(res.data?.mobNo)) ||
					(telType === 'cotel' && commUtil.isNotEmpty(res.data?.telNo))
				) {
					const params = {
						REQ: 'C2C',
						caller: user.telNo?.replaceAll('-', ''),
						called: telType === 'phone' ? res.data?.mobNo?.replaceAll('-', '') : res.data?.telNo?.replaceAll('-', ''),
					};
					const options = {
						width: '200',
						height: '200',
					};
					extUtil.openWindowAndPost(VITE_CLICK_TO_DIAL_URL, params, options);
				} else {
					showAlert(null, '담당자 정보가 없습니다.');
				}
			}
		});
	}

	/**
	 * 이메일 전송 팝업 열기
	 * @param {string} rcvrId 수신자 ID
	 */
	openSendEmailPopup({ rcvrId }: { rcvrId: string }) {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupContextMenuState: {
				visible: true,
				params: { rcvrId },
				popupType: 'sendEmail',
			},
		}));
		this.modalContextMenuRef.current.handlerOpen();
	}

	/**
	 * SMS 전송 팝업 열기
	 * @param {string} rcvrId 수신자 ID
	 */
	openSendSmsPopup({ rcvrId }: { rcvrId: string }) {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupContextMenuState: {
				visible: true,
				params: { rcvrId },
				popupType: 'sendSms',
			},
		}));
		this.modalContextMenuRef.current.handlerOpen();
	}

	openTeamsPopup({ rcvrId }: { rcvrId: string }) {
		if (!rcvrId) {
			showAlert(null, '담당자 정보가 없습니다.');
			return;
		}

		// 담당자 전화번호 조회
		apiGetUserEmailByUserId({ userId: rcvrId }).then(res => {
			if (res.statusCode === 0) {
				const emailAddr = res.data?.emailAddr;
				if (commUtil.isNotEmpty(emailAddr)) {
					commUtil.aLinkClick(`msteams://teams.microsoft.com/l/chat/0/0?users=${emailAddr}`, '_blank');
				} else {
					showAlert(null, '담당자 정보가 없습니다.');
				}
			}
		});
	}

	openFindPopup() {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			popupFindState: {
				visible: true,
			},
		}));
		this.modalFindRef.current.handlerOpen();
	}

	renderFindPopup() {
		const { popupFindState } = this.state as ICanalState;

		if (!popupFindState?.visible) {
			return null;
		}

		return (
			<CustomDraggableModal ref={this.modalFindRef} width="380px" title="찾기">
				<CmGridFindPopup gridRef={this} />
			</CustomDraggableModal>
		);
	}

	openSearchDropdownPopup({
		dropdownConfig,
		dropdownData,
		handleDropdownClick,
		cellElementRect,
	}: {
		dropdownConfig: any;
		dropdownData: any;
		handleDropdownClick: any;
		cellElementRect: any;
	}) {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			searchDropdownState: {
				...prevState.searchDropdownState,
				visible: true,
				dropdownConfig,
				dropdownData,
				handleDropdownClick,
				cellElementRect,
			},
		}));
	}

	closeSearchDropdownPopup() {
		this.setState((prevState: ICanalState) => ({
			...prevState,
			searchDropdownState: {
				...prevState.searchDropdownState,
				visible: false,
			},
		}));
	}

	renderSearchDropdownPopup() {
		const { searchDropdownState } = this.state as ICanalState;
		const { dropdownConfig, dropdownData, handleDropdownClick, cellElementRect } = searchDropdownState;

		if (!searchDropdownState?.visible) {
			return null;
		}

		return (
			<Dropdown
				placement="bottom"
				open={true}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={() => (
					<DropdownRendererInGrid
						columns={dropdownConfig.columns}
						dropdownData={dropdownData}
						handleDropdownClick={handleDropdownClick}
						cellElementRect={cellElementRect}
						_tGrid={this}
					/>
				)}
			/>
		);
	}

	renderPopupByContextMenu() {
		const { popupContextMenuState } = this.state as ICanalState;

		if (!popupContextMenuState?.visible) {
			return null;
		}

		/**
		 * API 요청 핸들러
		 * @param {any} param.api API 함수
		 * @param {any} param.params API 파라미터
		 * @param {string} param.successMessage 성공 메시지
		 * @param {string} param.errorMessage 에러 메시지
		 * @param {Function} param.onClose onClose함수
		 */
		const handleApiRequest = ({
			api,
			params,
			successMessage,
			errorMessage,
			onOk,
		}: {
			api: any;
			params: any;
			successMessage: string;
			errorMessage: string;
			onOk: () => void;
		}) => {
			api(params).then((res: any) => {
				if (res.data.statusCode === 0) {
					showAlert(null, successMessage, onOk);
				}
			});
		};

		const handleCallBack = async (form: FormInstance<any>) => {
			const { title, contents: cnts } = await form.validateFields();

			if (commUtil.isEmpty(title) || commUtil.isEmpty(cnts)) {
				showAlert(null, '제목과 내용은 필수 입력입니다.');
				return;
			}

			const params = {
				...popupContextMenuState?.params,
				title,
				cnts,
			};

			switch (popupContextMenuState?.popupType) {
				case 'sendEmail':
					handleApiRequest({
						api: apiPostSaveEmail,
						params,
						successMessage: '이메일 전송이 완료되었습니다.',
						errorMessage: '이메일 전송 실패',
						onOk: handleClosePopup,
					});
					break;
				case 'sendSms':
					handleApiRequest({
						api: apiPostSaveSms,
						params,
						successMessage: 'SMS 전송이 완료되었습니다.',
						errorMessage: 'SMS 전송 실패',
						onOk: handleClosePopup,
					});
					break;
			}
		};

		const handleClosePopup = () => {
			this.modalContextMenuRef.current.handlerClose();
			this.setState((prevState: ICanalState) => ({
				...prevState,
				popupContextMenuState: initPopupContextMenuState,
			}));
		};

		return (
			<CustomModal ref={this.modalContextMenuRef} width="640px">
				<CmSendUserPopup
					params={popupContextMenuState?.params}
					popupType={popupContextMenuState?.popupType}
					close={handleClosePopup}
					callBack={handleCallBack}
				/>
			</CustomModal>
		);
	}

	/**
	 * 편집 가능 'isEdit' 클래스 삭제
	 * @param {number} columnIndex 칼럼 인덱스
	 */
	removeEditClass(columnIndex: number) {
		const columnItem = this.getColumnItemByIndex(columnIndex);
		const oldStyle = columnItem.style;
		if (oldStyle.includes('isEdit')) {
			const newStyle = oldStyle.replace('isEdit', '');
			this.setColumnProp(columnIndex, { style: newStyle });
		}
	}

	/**
	 * addCheckedRowsByIds 전 처리
	 * @param {any} rowIds rowIds
	 * @param {string} rowIdField rowIdField
	 * @param {boolean} noSetCellValue setCellValue 메소드 호출여부
	 */
	addCheckedRowsByIdsBefore(rowIds: any, rowIdField?: string, noSetCellValue?: boolean) {
		if (commUtil.isEmpty(rowIdField)) {
			rowIdField = this.getProp('rowIdField') || '_$uid';
		}

		if (!this.props.gridProps?.['showCustomRowCheckColumn']) {
			// addCheckedRowsByIds 사용시 Array가 길어지면 속도가 느려지는 이슈가 있음
			// isCheckedRowById 사용해서 체크 안된 항목만 addCheckedRowsByIds 호출할 수 있게 변경
			rowIds.map((row: string) => {
				if (!super.isCheckedRowById(row)) {
					super.addCheckedRowsByIds(row);
				}
			});

			// 수정된 행 다시 수정시 "aui-grid-extra-checked-row" 클래스가 사라지는 이슈가 있어 update() 호출
			super.update();
		}

		// 커스텀 엑트스라 체크박스 설정
		if (
			this.props.gridProps?.['showCustomRowCheckColumn'] &&
			!noSetCellValue &&
			commUtil.isNotEmpty(rowIds) &&
			Array.isArray(rowIds)
		) {
			const updateItems = rowIds
				// ?.filter(
				// 	(id: string) =>
				// 		// 체크박스 비활성화 목록만 필터링
				// 		super.getItemByRowId(id)?.[this.getProp('customRowCheckColumnDataField')] ===
				// 		this.getProp('customRowCheckColumnUnCheckValue'),
				// )
				?.map((id: string) => ({
					[rowIdField]: id,
					[this.getProp('customRowCheckColumnDataField')]: this.getProp('customRowCheckColumnCheckValue'),
				}));
			super.updateRowsById(updateItems);

			// 삭제된 행일 경우 복구 후 수정한 다음 다시 삭제 (삭제행 수정 안되는 이슈)
			// const rows = super.getRowIndexesByValue(rowIdField, rowIds);
			// rows.forEach((row: any) => {
			// 	if (gridUtil.getRowStatusByIndex(this, row) === 'D') {
			// 		super.restoreSoftRows(row);
			// 		super.setCellValue(
			// 			row,
			// 			this.getProp('customRowCheckColumnDataField'),
			// 			this.getProp('customRowCheckColumnCheckValue'),
			// 			true,
			// 		);
			// 		super.removeRow(row);
			// 	}
			// });
		}
	}

	/**
	 * addUncheckedRowsByIds 전 처리
	 * @param {any} rowIds rowIds
	 * @param {string} rowIdField rowIdField
	 * @param {boolean} noSetCellValue setCellValue 메소드 호출여부
	 */
	addUncheckedRowsByIdsBefore(rowIds: any, rowIdField?: string, noSetCellValue?: boolean) {
		if (commUtil.isEmpty(rowIdField)) {
			rowIdField = this.getProp('rowIdField') || '_$uid';
		}

		if (!this.props.gridProps?.['showCustomRowCheckColumn']) {
			// addUncheckedRowsByIds 사용시 Array가 길어지면 속도가 느려지는 이슈가 있음
			// isCheckedRowById 사용해서 체크된 항목만 addUncheckedRowsByIds 호출할 수 있게 변경
			rowIds.map((row: string) => {
				if (super.isCheckedRowById(row)) {
					super.addUncheckedRowsByIds(row);
				}
			});
		}

		// 커스텀 엑트스라 체크박스 설정
		if (
			this.props.gridProps?.['showCustomRowCheckColumn'] &&
			!noSetCellValue &&
			commUtil.isNotEmpty(rowIds) &&
			Array.isArray(rowIds)
		) {
			const updateItems = rowIds
				// ?.filter(
				// 	(id: string) =>
				// 		// 체크박스 활성화 목록만 필터링
				// 		super.getItemByRowId(id)?.[this.getProp('customRowCheckColumnCheckValue')] ===
				// 		this.getProp('customRowCheckColumnUnCheckValue'),
				// )
				?.map((id: string) => ({
					[rowIdField]: id,
					[this.getProp('customRowCheckColumnDataField')]: this.getProp('customRowCheckColumnUnCheckValue'),
				}));
			super.updateRowsById(updateItems);
		}
	}

	/**
	 * 그룹핑 된 AUI그리드의 최종 하위 DATA 가져오기
	 * @param {any} node super.getOrgGridData()
	 * @returns {any} 최종 하위 DATA
	 */
	getLeafNodes(node: any) {
		const leaves: any = [];

		/**
		 * 최종 하위 DATA를 찾기 위한 재귀 함수
		 * @param {any} current 현재 DTA
		 * @returns {any} 마지막 최종 하위 DATA
		 */
		function dfs(current: any) {
			// children이 없거나 빈 배열이면 leaf
			if (!current?.children || current?.children?.length === 0) {
				leaves.push(current);
				return;
			}

			// children이 있으면 계속 아래로 탐색
			current?.children.forEach((child: any) => dfs(child));
		}

		for (const item of node) {
			dfs(item);
		}
		return leaves;
	}

	/**
	 * 커스텀 체크박스 체크된 목록
	 * @param {any} opt 옵션
	 *   isGetRowIndex : "rowIndex" 칼럼까지 조회 (AUI그리드 기본 메소드 "getCheckedRowItems" 대응)
	 *   isGetRowIndexInItem : "rowIndex" 칼럼 item에 포함해서 return
	 * @returns {any} 커스텀 체크박스 체크된 목록
	 */
	getCustomCheckedRowItems(opt?: any) {
		let allData = super.getGridData();

		// "rowIndex" 설정
		if (opt?.isGetRowIndex || opt?.isGetRowIndexInItem) {
			allData = allData.map((item: any, index: number) => ({
				...item,
				rowIndex: index,
			}));
		}

		// [그룹핑 / 트리] 최종 DATA 가져오기
		if ((this.getProp('groupingFields') && this.getProp('groupingFields').length > 0) || this.getProp('flat2tree')) {
			allData = this.getLeafNodes(allData);
			allData = allData.map((item: any, index: number) => ({
				...item,
				rowIndex: index,
			}));
		}

		const checkedItems = allData.filter((data: any) => {
			return data?.[this.getProp('customRowCheckColumnDataField')] === this.getProp('customRowCheckColumnCheckValue');
		});

		// AUI그리드 기본 메소드 "getCheckedRowItems" 대응
		if (opt?.isGetRowIndex) {
			const checkedItemsTmp = [];
			for (const item of checkedItems) {
				checkedItemsTmp.push({ rowIndex: item['rowIndex'], item: item });
			}
			return checkedItemsTmp;
		}

		return checkedItems;
	}

	/**
	 * GridTopBtn 'delete' 로직 구현
	 * @returns {boolean} 삭제 결과값
	 */
	deleteRowItems(): boolean {
		const rowIdField = this.props?.gridProps['rowIdField'] ?? '_$uid';
		let checkedRowItems = [];
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			// 커스텀 엑스트라 체크박스
			checkedRowItems = this.getCustomCheckedRowItems()?.map((item: any) => {
				item['rowIndex'] = this.getRowIndexesByValue(rowIdField, item[rowIdField])[0];
				return item;
			});
		} else {
			checkedRowItems = this.getCheckedRowItems();
		}
		let result = true;
		if (checkedRowItems.length > 0) {
			// 선택된 Row Index
			const checkedRowIndexList: any = checkedRowItems?.map((item: any) => item.rowIndex) ?? [];

			// 신규 Row 여부
			const filterArr = this.getChangedData({ validationYn: false })?.filter((chageItem: any) => {
				return chageItem.rowStatus === 'I';
			});
			const isEdited = filterArr?.length > 0;

			// 기존 조회된 DATA 삭제 유무
			const isLegacyRemove = this.props?.gridProps?.isLegacyRemove;

			if (isLegacyRemove || isEdited) {
				// 체크된 행이 있는 경우에만 행 삭제
				if (checkedRowIndexList.length > 0) {
					// 우선 수정된 ROW 롤백
					// this.restoreEditedRows(checkedRowIndexList);

					// 조회된 ROW 삭제 불가시
					if (!isLegacyRemove) {
						// 신규행만 삭제
						if (isEdited) {
							const rowIndexesByValue: any = this.getRowIndexesByValue(
								rowIdField,
								filterArr.map((item: any) => item[rowIdField]) ?? [],
							);
							this.removeRow(rowIndexesByValue);
						}
					} else {
						this.removeRow(checkedRowIndexList);
					}

					// 행삭제시 선택된 Cell 사라지는 현상 보완
					const selectedIndex = this.getSelectedIndex();
					if (selectedIndex && selectedIndex.length > 0 && selectedIndex[0] === -1) {
						// 마지막 행으로 이동
						this.setSelectionByIndex(this.getRowCount(), 0);
					}
				} else {
					showAlert(null, '삭제할 행을 선택하세요.');
					result = false;
				}
			} else {
				showAlert(null, '신규행만 삭제가 가능합니다.');
				result = false;
			}
		} else {
			showAlert(null, '삭제할 행을 선택하세요.');
			result = false;
		}
		return result;
	}

	/**
	 * Override 후 커스텀
	 * 엑스트라 행 체크박스가 설정된 경우 체크박스로 체크된 모든 행의 아이템과 행인덱스를 갖는 배열을 반환 합니다.
	 * @returns {any[]} 체크된 행 아이템 및 행 인덱스 배열
	 */
	getCheckedRowItems(): any[] {
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			return this.getCustomCheckedRowItems({ isGetRowIndex: true });
		} else {
			return super.getCheckedRowItems();
		}
	}

	/**
	 * Override 후 커스텀
	 * 엑스트라 행 체크박스가 설정된 경우 체크박스로 체크된 모든 행의 아이템을 반환합니다.
	 * @param {any} opt 옵션
	 * @returns {any[]} 체크된 행 아이템 배열
	 */
	getCheckedRowItemsAll(opt?: any): any[] {
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			return this.getCustomCheckedRowItems(opt);
		} else {
			return super.getCheckedRowItemsAll();
		}
	}

	/**
	 * Override 후 커스텀
	 * 엑스트라 행 체크박스가 설정된 경우행 고유 값(rowIdField 값)을 이용해 특정 행에 체크를 설정합니다.
	 * 이 메소드는 기존에 체크된 항목이 제거되고 새로 설정된 값으로만 체크됩니다.
	 * @param {string | number | string[] | number[]} rowIds 행 고유 값(rowIdField 값)들을 요소로 갖는 배열
	 */
	addCheckedRowsByIds(rowIds: string | number | string[] | number[]) {
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			this.addCheckedRowsByIdsBefore(rowIds);
		} else {
			super.addCheckedRowsByIds(rowIds);
		}
	}

	/**
	 * Override 후 커스텀
	 * 엑스트라 행 체크박스가 설정된 경우 행 고유 값(rowIdField 값)을 이용해 특정 행에 체크 해제를 설정합니다.
	 * 부분적으로 엑스트라 행 체크박스를 해제하고자 할 때 유용합니다.
	 * @param {string | number | string[] | number[]} rowIds 행 고유 값(rowIdField 값)들을 요소로 갖는 배열
	 */
	addUncheckedRowsByIds(rowIds: string | number | string[] | number[]) {
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			this.addUncheckedRowsByIdsBefore(rowIds);
		} else {
			super.addUncheckedRowsByIds(rowIds);
		}
	}

	/**
	 * Override 후 커스텀
	 * 엑스트라 행 체크박스가 설정된 경우 특정 행의 dataField 의 값과 일치하는 행에 체크를 표시합니다.
	 * 이 메소드는 기존에 체크된 항목에 누적해서 체크됩니다.
	 * @param {string} dataField 행 아이템에서 체크하고자 하는 필드명
	 * @param {any} value 행 아이템에서 체크하고자 하는 필드의 값(value), 복수의 값을 체크하고자 한다면 배열로 설정(예: ["Anna", "Steve"])
	 */
	addCheckedRowsByValue(dataField: string, value: any) {
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			// 전체 DATA 가져오기
			let allData = super.getOrgGridData();

			// [그룹핑 / 트리] 최종 DATA 가져오기
			if ((this.getProp('groupingFields') && this.getProp('groupingFields').length > 0) || this.getProp('flat2tree')) {
				allData = this.getLeafNodes(allData);
			}

			// 체크할 항목 가져오기
			const rowIds = allData
				?.filter((data: any) => {
					return data?.[dataField] === value || (Array.isArray(value) && value.includes(data?.[dataField]));
				})
				?.map((data2: any) => data2[super.getProp('rowIdField')]);

			this.addCheckedRowsByIdsBefore(rowIds);
		} else {
			super.addCheckedRowsByValue(dataField, value);
		}
	}

	/**
	 * 팝업 렌더링
	 * @description 팝업 타입에 따라 각 팝업 컴포넌트를 렌더링한다
	 * @returns {React.ReactElement | null} React 엘리먼트 또는 null
	 */
	renderPopup() {
		const { popupState } = this.state as ICanalState;

		if (!popupState?.visible) {
			return null;
		}

		const { params, popupType, width, height } = popupState;

		const modalProps: any = { width: width || '500px' };
		if (height) {
			modalProps.height = height;
		}

		return (
			<CustomModal ref={this.modalInfoRef} {...modalProps}>
				{popupType === 'sku' && (
					<CmSkuInfoPopup
						titleName={'상품상세'}
						refModal={this.modalInfoRef}
						apiParams={params}
						close={() => this.closePopup()}
					/>
				)}
				{popupType === 'car' && (
					<CmCarInfoPopup
						titleName={'차량상세'}
						refModal={this.modalInfoRef}
						apiParams={params}
						close={() => this.closePopup()}
					/>
				)}
				{popupType === 'cust' &&
					(params?.custtype === 'P' ? (
						<CmPartnerInfoPopup
							titleName="협력사상세"
							refModal={this.modalInfoRef}
							apiParams={params}
							close={() => this.closePopup()}
						/>
					) : (
						<CmCustInfoPopup
							titleName="거래처상세"
							refModal={this.modalInfoRef}
							apiParams={params}
							close={() => this.closePopup()}
						/>
					))}
			</CustomModal>
		);
	}

	render() {
		return (
			<>
				{super.render()}
				{this.renderPopup()}
				{this.renderPopupByContextMenu()}
				{this.renderFindPopup()}
				{this.renderSearchDropdownPopup()}
			</>
		);
	}
}

export default AUIGridReactCanal;
