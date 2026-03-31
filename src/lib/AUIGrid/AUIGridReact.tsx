/**
 * AUIGridReact.tsx for React.js + Typescript v1.5.20250922
 * Based on AUIGrid v3.0.16.13
 * Copyright © AUISoft Co., Ltd.
 * www.auisoft.net
 */
/* eslint-disable */
import * as IGrid from 'aui-grid';
import * as React from 'react';

// 프로젝트 경로에 맞게 바꾸세요
import './AUIGrid';
import './AUIGridLicense';
import './AUIGrid_style.scss';

import * as gridUtil from './auIGridUtil';
//import './AUIGrid_style.css';   //scss 대체
//import './AUIGrid_style.scss';

// AUIGrid.defaultProps 에 공통적인 속성을 설정합니다.
// AUIGrid.defaultProps 설정은 AUIGrid.js 정의 이후 선언해야 합니다.
// 선언하면 AUIGrid 를 생성 할 때 기본적으로 defaultProps 를 확장하여 생성합니다.
// 따라서 매 페이지의 그리드를 생성할 때 공통적인 속성을 여기서 작성하십시오.
if (typeof window !== 'undefined' && typeof window.AUIGrid !== 'undefined') {
	window.AUIGrid.defaultProps = {
		// 모바일인 경우 자동으로 작은 사이즈의 스크롤을 표시할지 여부
		// 여기서 정의했기 때문에 앞으로 모든 그리드는 속성 autoScrollSize: true 를 상속 받아 적용됨.
		autoScrollSize: true,

		// selectionChange 이벤트 발생 시 간소화된 정보만 받을지 여부를 지정합니다.
		// 간소화한 경우 selectionChange 이벤트의 파라메터 요소인 event.selectedItems 를 포함시키지 않습니다.
		// 성능 향상을 위해 true 설정을 권장합니다.
		simplifySelectionEvent: true,
	};
}

// 이 아래 소스는 절대 수정하지 마세요.
interface IProps {
	name?: string;
	autoResize?: boolean;
	resizeDelayTime?: number;
	gridProps?: IGrid.Props | null | any; // any 추가
	columnLayout?: IGrid.Column[] | any; // any 추가
	footerLayout?: IGrid.Footer[] | any; // any 추가
}

export interface IState {
	uuid: string;
	id: string;
	pid: string;
	timerId: any;
	className: string;
}
declare global {
	interface Window {
		AUIGrid: any;
	}
}
const $ag: any = typeof window === 'undefined' ? {} : window.AUIGrid;
let uuid: number = 0;

// 전역 핸들러 관리 객체 (모듈 수준)
const globalGridEventHandlers: { [key: string]: Array<(event: any) => any> } = {};

/**
 * 전역 핸들러 관리 객체에 추가하지 않을 이벤트 목록
 * @description 하위 이벤트 들은 globalGridEventHandlers에 저장시켰더니 동작이 안되어 직접 추가
 * @param name 이벤트 이름
 * @returns 전역 핸들러 관리 객체에 추가하지 않을 이벤트 목록
 */
const isNoGlobalGridEvent = (name: string | string[]) => {
	const eventNames = Array.isArray(name) ? name : [name];
	return eventNames.some(
		eventName =>
			eventName === 'copyBegin' ||
			eventName === 'pasteBegin' ||
			eventName === 'cellEditBegin' ||
			eventName === 'selectionConstraint' ||
			eventName === 'cellClick' ||
			eventName === 'keyDown' ||
			eventName === 'cellDoubleClick',
	);
};

class AUIGrid extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		// const uuidStr = uuid.toString();
		//crypto 로 uuid 생성함. (유니크 값)
		const uuidStr = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
		const id = 'aui-grid-wrap-' + (props.name !== '' ? props.name : uuidStr);
		const className = 'aui-grid-wrap'; // 고정된 클래스 이름
		uuid++;
		this.state = {
			uuid: uuidStr,
			id: id,
			pid: '#' + id,
			timerId: null,
			className: className,
		};
		this.__globalResizeHandler = this.__globalResizeHandler.bind(this);
		this.__globalClickHandler = this.__globalClickHandler.bind(this);
		this.__globalScrollHandler = this.__globalScrollHandler.bind(this);
	}

	static defaultProps: IProps = {
		name: '',
		autoResize: true,
		resizeDelayTime: 10,
		gridProps: null,
		columnLayout: [],
		footerLayout: [],
	};

	componentDidMount() {
		try {
			// custom - gridProps, columnLayout
			// const gridProps = gridUtil.adjustProps(this.props.gridProps);
			const gridProps = gridUtil.adjustProps2(this.props.gridProps, this);
			let columnLayout = gridUtil.adjustColModel(this.props.columnLayout, this, gridProps);
			$ag.create(this.state.pid, columnLayout, gridProps);
			// $ag.create(this.state.pid, this.props.columnLayout, this.props.gridProps);
			$ag.setFooter(this.state.pid, this.props.footerLayout);
			this.__setupGlobalResize();
			this.__setupGlobalClick();
			this.__setupGlobalScroll();
			// custom - 초기 resize
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 0);

			// custom - 공통적으로 그리드 이벤트 bind
			gridUtil.bindEvent(this, gridProps);
		} catch (e) {}
	}

	componentWillUnmount() {
		this.__resetGlobalResize();
		this.__resetGlobalClick();
		this.__resetGlobalScroll();

		// 해당 그리드의 모든 이벤트 핸들러 정리
		Object.keys(globalGridEventHandlers).forEach(key => {
			if (key.startsWith(`${this.state.pid}_`)) {
				delete globalGridEventHandlers[key];
			}
		});

		// custom - 공통적으로 그리드 이벤트 unbind
		gridUtil.unbindEvent(this);

		if ($ag.isCreated(this.state.pid)) $ag.destroy(this.state.pid);
	}

	render() {
		return <div id={this.state.id} className={this.state.className}></div>;
	}

	private __setupGlobalResize() {
		if (!this.props.autoResize) return;
		window.addEventListener('resize', this.__globalResizeHandler);
	}

	private __resetGlobalResize() {
		if (!this.props.autoResize) return;
		window.removeEventListener('resize', this.__globalResizeHandler);
	}

	private __globalResizeHandler(event: Event) {
		const state = this.state;
		if (state.timerId !== null) {
			clearTimeout(state.timerId);
		}
		const timerId = setTimeout(function () {
			if ($ag.isCreated(state.pid)) {
				// custom console error - parentId if 문
				const parentId = document.getElementById(state.id);
				if (parentId) {
					try {
						$ag.resize(state.pid);
					} catch (e) {}
				}
			}
		}, this.props.resizeDelayTime);
		this.setState({ timerId: timerId });
	}

	private __setupGlobalClick() {
		window.addEventListener('click', this.__globalClickHandler);
	}

	private __resetGlobalClick() {
		window.removeEventListener('click', this.__globalClickHandler);
	}

	private __globalClickHandler(event: any) {
		const gridEl = document.getElementById(this.state.id);
		if (!gridEl) return;

		/**
		 * 기존에 열려있던 context menu 제거
		 */
		const removeOpenedContextMenu = () => {
			const contextMenuElements = document.querySelectorAll('.aui-grid-context-popup-layer');
			// 기존 context menu 제거
			contextMenuElements?.forEach((element: any) => {
				element.remove();
			});
		};

		// 그리드 필터 팝업 외 영역 클릭시 닫기
		const filterEl = document.querySelector('.aui-grid-filter-popup-layer');

		// 외부 클릭 조건 체크
		if (filterEl && !filterEl.contains(event.target)) {
			// 팝업 닫기
			if (filterEl) this.closeFilterLayer();
		}

		// 그리드 컨텍스트 팝업 외 영역 클릭시 닫기
		const contextEl = document.querySelector('.aui-grid-context-popup-layer');

		// 외부 클릭 조건 체크
		if (contextEl && !contextEl.contains(event.target)) {
			// 팝업 닫기
			if (contextEl) removeOpenedContextMenu();
		}
	}

	private __setupGlobalScroll() {
		document.addEventListener('scroll', this.__globalScrollHandler, true);
		window.addEventListener('scroll', this.__globalScrollHandler, true);
	}

	private __resetGlobalScroll() {
		document.removeEventListener('scroll', this.__globalScrollHandler, true);
		window.removeEventListener('scroll', this.__globalScrollHandler, true);
	}

	// AUI그리드 내 "DropDownListRenderer" SelectBox 펼쳐 졌을때 스크롤 이벤트 발생시 SelectBox 닫기
	private __globalScrollHandler(event: any) {
		const dropdown: any = document.querySelector('.aui-grid-drop-list-item-wrapper');
		if (event?.target?.classList?.contains('ant-splitter-panel')) {
			if (dropdown && dropdown.style.display !== 'none') {
				dropdown.style.display = 'none';
			}
		}
	}

	create(columnLayout: IGrid.Column[], props: IGrid.Props) {
		$ag.create(this.state.pid, columnLayout, props);
		this.__setupGlobalResize();
		return this.state.pid;
	}

	addCheckedRowsByIds(rowIds: string | number | string[] | number[]) {
		$ag.addCheckedRowsByIds.call($ag, this.state.pid, arguments[0]);
	}
	addCheckedRowsByValue(dataField: string, value: any) {
		$ag.addCheckedRowsByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	addColumn(
		cItems: IGrid.Column | IGrid.Column[],
		position: number | 'first' | 'last' | 'selectionLeft' | 'selectionRight',
	) {
		gridUtil.setColumnOption(arguments[0]);
		$ag.addColumn.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	addRow(items: any | any[], rowIndex?: number | 'first' | 'last' | 'selectionUp' | 'selectionDown') {
		$ag.addRow.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	addTreeColumn(cItems: IGrid.Column | IGrid.Column[], parentDataField: string, position: number | 'first' | 'last') {
		$ag.addTreeColumn.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	addTreeRow(item: any, parentRowId: any, position?: 'first' | 'last' | 'selectionUp' | 'selectionDown') {
		$ag.addTreeRow.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	addTreeRowByIndex(items: any, rowIndex: number) {
		$ag.addTreeRowByIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	addUncheckedRowsByIds(rowIds: string | number | string[] | number[]) {
		$ag.addUncheckedRowsByIds.call($ag, this.state.pid, arguments[0]);
	}
	addUncheckedRowsByValue(dataField: string, value: any) {
		$ag.addUncheckedRowsByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	appendData(items: any) {
		$ag.appendData.call($ag, this.state.pid, arguments[0]);
		// bind 메서드 중복 핸들러 처리로 인해 아래 함수 주석 처리하고, bind('ready') 이벤트 핸들러에서 처리
		// gridUtil.afterAppendData(this); // 그리드 요청된 데이터 추가 후 처리 함수 호출
	}
	// bind 메서드 오버라이드 - 중복 핸들러 지원
	bind(name: string | string[], func: (event: any) => any) {
		// 하위 이벤트 들은 globalGridEventHandlers에 저장시켰더니 동작이 안되어 직접 추가
		if (isNoGlobalGridEvent(name)) {
			$ag.bind.call($ag, this.state.pid, name, gridUtil.preBindFunc(this, name, func));
			return;
		}

		const eventNames = Array.isArray(name) ? name : [name];

		eventNames.forEach(eventName => {
			const key = `${this.state.pid}_${eventName}`;

			// 처음 생성하는 거면 전역 핸들러 생성
			if (!globalGridEventHandlers[key]) {
				globalGridEventHandlers[key] = [];

				// 실제 AUIGrid에는 통합 핸들러만 등록
				$ag.bind.call($ag, this.state.pid, eventName, (event: any) => {
					// 등록된 모든 핸들러 순차 실행
					globalGridEventHandlers[key]?.forEach(handler => {
						try {
							handler(event);
						} catch (error) {}
					});
				});
			}

			// 핸들러를 전역 핸들러에 추가
			globalGridEventHandlers[key].push(func);
		});
		// $ag.bind.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	// AUI그리드 커스텀 엑스트라 체크박스 이벤트 강제 호출
	bindCall(name: string | string[], event: any) {
		const key = `${this.state.pid}_${name}`;
		globalGridEventHandlers[key]?.forEach(handler => {
			try {
				handler(event);
			} catch (error) {}
		});
	}
	changeColumnLayout(newLayout: IGrid.Column[]) {
		$ag.changeColumnLayout.call($ag, this.state.pid, arguments[0]);
	}
	changeExtraColumnOrders(orders: string[]) {
		$ag.changeExtraColumnOrders.call($ag, this.state.pid, arguments[0]);
	}
	changeExtraColumnWidth(name: string, width: number) {
		$ag.changeExtraColumnWidth.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	changeFooterLayout(newLayout: IGrid.Footer[]) {
		$ag.changeFooterLayout.call($ag, this.state.pid, arguments[0]);
	}
	clearFilter(dataField: string) {
		$ag.clearFilter.call($ag, this.state.pid, arguments[0]);
	}
	clearFilterAll() {
		$ag.clearFilterAll.call($ag, this.state.pid);
	}
	clearGridData() {
		$ag.clearGridData.call($ag, this.state.pid);
	}
	clearSelection() {
		$ag.clearSelection.call($ag, this.state.pid);
	}
	clearSortingAll() {
		$ag.clearSortingAll.call($ag, this.state.pid);
	}
	clearUndoRedoStack() {
		$ag.clearUndoRedoStack.call($ag, this.state.pid);
	}
	closeFilterLayer() {
		$ag.closeFilterLayer.call($ag, this.state.pid);
	}
	collapseAll() {
		$ag.collapseAll.call($ag, this.state.pid);
	}
	destroy() {
		$ag.destroy.call($ag, this.state.pid);
	}
	expandAll() {
		$ag.expandAll.call($ag, this.state.pid);
	}
	expandItemByRowId(rowId: any, open?: boolean, recursive?: boolean) {
		$ag.expandItemByRowId.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	exportAsCsv(props?: any) {
		$ag.exportAsCsv.call($ag, this.state.pid, arguments[0]);
	}
	exportAsJson(keyValueMode?: boolean, props?: any): any {
		$ag.exportAsJson.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	exportAsObject(keyValueMode?: boolean): any {
		return $ag.exportAsObject.call($ag, this.state.pid, arguments[0]);
	}
	exportAsPdf(props?: any) {
		$ag.exportAsPdf.call($ag, this.state.pid, arguments[0]);
	}
	exportAsTxt(props?: any) {
		$ag.exportAsTxt.call($ag, this.state.pid, arguments[0]);
	}
	exportAsXlsx(exportWithStyle?: any, props?: any) {
		$ag.exportAsXlsx.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	exportAsXml(props?: any) {
		$ag.exportAsXml.call($ag, this.state.pid, arguments[0]);
	}
	exportToCsv(props?: any) {
		$ag.exportToCsv.call($ag, this.state.pid, arguments[0]);
	}
	exportToJson(keyValueMode?: boolean, props?: any): any {
		$ag.exportToJson.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	exportToObject(keyValueMode?: boolean): any {
		return $ag.exportToObject.call($ag, this.state.pid, arguments[0]);
	}
	exportToPdf(props?: any) {
		$ag.exportToPdf.call($ag, this.state.pid, arguments[0]);
	}
	exportToTxt(props?: any) {
		$ag.exportToTxt.call($ag, this.state.pid, arguments[0]);
	}
	exportToXlsx(exportWithStyle?: any, props?: any) {
		$ag.exportToXlsx.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	exportToXlsxMulti(subGridIds: string[], props: any[]) {
		$ag.exportToXlsxMulti.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	exportToXml(props?: any) {
		$ag.exportToXml.call($ag, this.state.pid, arguments[0]);
	}
	forceEditingComplete(value: any, cancel?: boolean) {
		$ag.forceEditingComplete.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getAddedColumnFields(): string[] {
		return $ag.getAddedColumnFields.call($ag, this.state.pid);
	}
	getAddedRowItems(): any[] {
		return $ag.getAddedRowItems.call($ag, this.state.pid);
	}
	getAscendantsByRowId(rowId: any): any[] {
		return $ag.getAscendantsByRowId.call($ag, this.state.pid, arguments[0]);
	}
	getCellElementByIndex(rowIndex: number, columnIndex: number): any {
		return $ag.getCellElementByIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getCellFormatValue(rowIndex: number, dataField: string): any {
		return $ag.getCellFormatValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getCellValue(rowIndex: number, dataField: string): any {
		return $ag.getCellValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getCheckedRowItems(): any[] {
		return $ag.getCheckedRowItems.call($ag, this.state.pid);
	}
	getCheckedRowItemsAll(): any[] {
		return $ag.getCheckedRowItemsAll.call($ag, this.state.pid);
	}
	getColumnCount(): number {
		return $ag.getColumnCount.call($ag, this.state.pid);
	}
	getColumnDistinctValues(dataField: string, total?: boolean): any[] {
		return $ag.getColumnDistinctValues.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getColumnIndexByDataField(dataField: string): number {
		return $ag.getColumnIndexByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getColumnInfoList(): IGrid.Column[] {
		return $ag.getColumnInfoList.call($ag, this.state.pid);
	}
	getColumnItemByDataField(dataField: string): IGrid.Column | null {
		return $ag.getColumnItemByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getColumnItemByIndex(columnIndex: number): IGrid.Column | null {
		return $ag.getColumnItemByIndex.call($ag, this.state.pid, arguments[0]);
	}
	getColumnLayout(): IGrid.Column[] {
		return $ag.getColumnLayout.call($ag, this.state.pid);
	}
	getColumnValues(dataField: string, total?: boolean): any[] {
		return $ag.getColumnValues.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getColumnWidthByDataField(dataField: string): number {
		return $ag.getColumnWidthByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getColumnWidthList(): number[] {
		return $ag.getColumnWidthList.call($ag, this.state.pid);
	}
	getCurrentPageData(): any[] {
		return $ag.getCurrentPageData.call($ag, this.state.pid);
	}
	getDataFieldByColumnIndex(columnIndex: number): string {
		return $ag.getDataFieldByColumnIndex.call($ag, this.state.pid, arguments[0]);
	}
	getDepthByRowId(rowId: any): number {
		return $ag.getDepthByRowId.call($ag, this.state.pid, arguments[0]);
	}
	getDescendantsByRowId(rowId: any): any[] {
		return $ag.getDescendantsByRowId.call($ag, this.state.pid, arguments[0]);
	}
	getEditedRowColumnItems(): any[] {
		return $ag.getEditedRowColumnItems.call($ag, this.state.pid);
	}
	getEditedRowItems(): any[] {
		return $ag.getEditedRowItems.call($ag, this.state.pid);
	}
	getFilterCache() {
		return $ag.getFilterCache.call($ag, this.state.pid);
	}
	getFilterInlineTexts(): any[] {
		return $ag.getFilterInlineTexts.call($ag, this.state.pid);
	}
	getFitColumnSizeByDataField(dataField: string): number {
		return $ag.getFitColumnSizeByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getFitColumnSizeList(fitToGrid?: boolean): number[] {
		const sizeList = $ag.getFitColumnSizeList.call($ag, this.state.pid, arguments[0]);

		// 커스텀 엑스트라 체크박스 width 값 고정
		if (this.props.gridProps?.['showCustomRowCheckColumn']) sizeList[0] = 30;

		return sizeList;
	}
	getFooterData(): any[] {
		return $ag.getFooterData.call($ag, this.state.pid);
	}
	getFooterFormatValueByDataField(posField: string): any {
		return $ag.getFooterFormatValueByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getFooterLayout(): IGrid.Footer[] {
		return $ag.getFooterLayout.call($ag, this.state.pid);
	}
	getFooterValueByDataField(posField: string): any {
		return $ag.getFooterValueByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getGridData(): any[] {
		return $ag.getGridData.call($ag, this.state.pid);
	}
	getGridDataWithState(stateField: string, option?: { added?: string; edited?: string; removed?: string }) {
		return $ag.getGridDataWithState.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getHiddenColumnDataFields(): string[] {
		return $ag.getHiddenColumnDataFields.call($ag, this.state.pid);
	}
	getHiddenColumnIndexes(): number[] {
		return $ag.getHiddenColumnIndexes.call($ag, this.state.pid);
	}
	getIndexesByEvent(mouseEvent: any): any {
		return $ag.getIndexesByEvent.call($ag, this.state.pid, arguments[0]);
	}
	getInitCellValue(rowId: any, dataField: string): any {
		return $ag.getInitCellValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getInitValueItem(rowId: any): any {
		return $ag.getInitValueItem.call($ag, this.state.pid, arguments[0]);
	}
	getItemByRowId(rowId: any): any {
		return $ag.getItemByRowId.call($ag, this.state.pid, arguments[0]);
	}
	getItemByRowIndex(rowIndex: number): any {
		return $ag.getItemByRowIndex.call($ag, this.state.pid, arguments[0]);
	}
	getItemsByValue(dataField: string, value: any): any {
		return $ag.getItemsByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMergeEndColumnIndex(rowIndex: number, columnIndex: number): number {
		return $ag.getMergeEndColumnIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMergeEndRowIndex(rowIndex: number, columnIndex: number): number {
		return $ag.getMergeEndRowIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMergeItems(rowIndex: number, columnIndex: number): any[] {
		return $ag.getMergeItems.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMergeStartColumnIndex(rowIndex: number, columnIndex: number): number {
		return $ag.getMergeStartColumnIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMergeStartRowIndex(rowIndex: number, columnIndex: number): number {
		return $ag.getMergeStartRowIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getMobileMode() {
		return $ag.getMobileMode.call($ag, this.state.pid);
	}
	getOrgGridData(): any[] {
		return $ag.getOrgGridData.call($ag, this.state.pid);
	}
	getParentColumnByDataField(dataField: string): IGrid.Column | null {
		return $ag.getParentColumnByDataField.call($ag, this.state.pid, arguments[0]);
	}
	getParentItemByRowId(rowId: any): any {
		return $ag.getParentItemByRowId.call($ag, this.state.pid, arguments[0]);
	}
	getProp(name: string): any {
		return $ag.getProp.call($ag, this.state.pid, arguments[0]);
	}
	getProperty(name: string): any {
		return $ag.getProperty.call($ag, this.state.pid, arguments[0]);
	}
	getRemovedColumnFields(): string[] {
		return $ag.getRemovedColumnFields.call($ag, this.state.pid);
	}
	getRemovedItems(includeAdded?: boolean): any[] {
		return $ag.getRemovedItems.call($ag, this.state.pid, arguments[0]);
	}
	getRemovedNewItems(): any[] {
		return $ag.getRemovedNewItems.call($ag, this.state.pid);
	}
	getRowCount(): number {
		return $ag.getRowCount.call($ag, this.state.pid);
	}
	getRowIndexesByValue(dataField: string, values: any): number[] {
		return $ag.getRowIndexesByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getRowPosition(): number {
		return $ag.getRowPosition.call($ag, this.state.pid);
	}
	getRowsByValue(dataField: string, values: any): any[] {
		return $ag.getRowsByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	getScaleFactor(): number {
		return $ag.getScaleFactor.call($ag, this.state.pid);
	}
	getSelectedColIndexes(): number[] {
		return $ag.getSelectedColIndexes.call($ag, this.state.pid);
	}
	getSelectedIndex(): number[] {
		return $ag.getSelectedIndex.call($ag, this.state.pid);
	}
	getSelectedItems(performanceMode?: boolean): any[] {
		return $ag.getSelectedItems.call($ag, this.state.pid, arguments[0]);
	}
	getSelectedPrimeIndexOnMerge(): number[] {
		return $ag.getSelectedPrimeIndexOnMerge.call($ag, this.state.pid);
	}
	getSelectedRowIndexes(): number[] {
		return $ag.getSelectedRowIndexes.call($ag, this.state.pid);
	}
	getSelectedRows(): any[] {
		return $ag.getSelectedRows.call($ag, this.state.pid);
	}
	getSelectedText(exceptHidden?: boolean): string {
		return $ag.getSelectedText.call($ag, this.state.pid, arguments[0]);
	}
	getSortingFields(): any[] {
		return $ag.getSortingFields.call($ag, this.state.pid);
	}
	getStateCache(): any {
		return $ag.getStateCache.call($ag, this.state.pid);
	}
	getTextDataProvider(): any {
		return $ag.getTextDataProvider.call($ag, this.state.pid);
	}
	getTreeFilteredFlatData(): any[] {
		return $ag.getTreeFilteredFlatData.call($ag, this.state.pid);
	}
	getTreeFlatData(): any[] {
		return $ag.getTreeFlatData.call($ag, this.state.pid);
	}
	getTreeGridData(): any[] {
		return $ag.getTreeGridData.call($ag, this.state.pid);
	}
	getTreeTotalDepth(): number {
		return $ag.getTreeTotalDepth.call($ag, this.state.pid);
	}
	hideColumnByDataField(dataField: string) {
		$ag.hideColumnByDataField.call($ag, this.state.pid, arguments[0]);
	}
	hideColumnGroup(dataField: string) {
		$ag.hideColumnGroup.call($ag, this.state.pid, arguments[0]);
	}
	hideExtraColumn(name: string) {
		$ag.hideExtraColumn.call($ag, this.state.pid, arguments[0]);
	}
	hideFooterLater() {
		$ag.hideFooterLater.call($ag, this.state.pid);
	}
	indentTreeDepth() {
		$ag.indentTreeDepth.call($ag, this.state.pid);
	}
	indexToRowId(rowIndex: number): any {
		return $ag.indexToRowId.call($ag, this.state.pid, arguments[0]);
	}
	isAddedById(rowId: any): boolean {
		return $ag.isAddedById.call($ag, this.state.pid, arguments[0]);
	}
	isAddedByRowIndex(rowIndex: number): boolean {
		return $ag.isAddedByRowIndex.call($ag, this.state.pid, arguments[0]);
	}
	isAvailabePdf(): boolean {
		return $ag.isAvailabePdf.call($ag, this.state.pid);
	}
	isAvailableLocalDownload(): boolean {
		return $ag.isAvailableLocalDownload.call($ag, this.state.pid);
	}
	isCheckedRowById(rowId: any): boolean {
		return $ag.isCheckedRowById.call($ag, this.state.pid, arguments[0]);
	}
	isCreated(): boolean {
		return $ag.isCreated.call($ag, this.state.pid);
	}
	isEditedById(rowId: any): boolean {
		return $ag.isEditedById.call($ag, this.state.pid, arguments[0]);
	}
	isEditedByRowIndex(rowIndex: number): boolean {
		return $ag.isEditedByRowIndex.call($ag, this.state.pid, arguments[0]);
	}
	isEditedCell(rowId: any, dataField: string): boolean {
		return $ag.isEditedCell.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	isEditedCellByIndex(rowIndex: number, columnIndex: number): boolean {
		return $ag.isEditedCellByIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	isFilteredGrid(): boolean {
		return $ag.isFilteredGrid.call($ag, this.state.pid);
	}
	isItemBranchByRowId(rowId: any): boolean {
		return $ag.isItemBranchByRowId.call($ag, this.state.pid, arguments[0]);
	}
	isItemOpenByRowId(rowId: any): boolean {
		return $ag.isItemOpenByRowId.call($ag, this.state.pid, arguments[0]);
	}
	isItemVisibleByRowId(rowId: any): boolean {
		return $ag.isItemVisibleByRowId.call($ag, this.state.pid, arguments[0]);
	}
	isLazyRequestedByIndex(rowIndex: number): boolean {
		return $ag.isLazyRequestedByIndex.call($ag, this.state.pid, arguments[0]);
	}
	isMergedCell(rowIndex: number, columnIndex: number): boolean {
		return $ag.isMergedCell.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	isMergedCellByColumn(rowIndex: number, columnIndex: number): boolean {
		return $ag.isMergedCellByColumn.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	isMergedCellByRow(rowIndex: number, columnIndex: number): boolean {
		return $ag.isMergedCellByRow.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	isOpenFilterLayer(): boolean {
		return $ag.isOpenFilterLayer.call($ag, this.state.pid);
	}
	isRemovedById(rowId: any): boolean {
		return $ag.isRemovedById.call($ag, this.state.pid, arguments[0]);
	}
	isRemovedByRowIndex(rowIndex: number): boolean {
		return $ag.isRemovedByRowIndex.call($ag, this.state.pid, arguments[0]);
	}
	isSelectionReversed(): boolean {
		return $ag.isSelectionReversed.call($ag, this.state.pid);
	}
	isSortedGrid(): boolean {
		return $ag.isSortedGrid.call($ag, this.state.pid);
	}
	isTreeGrid(): boolean {
		return $ag.isTreeGrid.call($ag, this.state.pid);
	}
	isUniqueValue(dataField: string, value: any): boolean {
		return $ag.isUniqueValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	movePageTo(pageNum: number, keepVScrollPos?: boolean, keepHScrollPos?: boolean) {
		$ag.movePageTo.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	moveRowToIndex(rowId: any, toRowIndex: number) {
		$ag.moveRowToIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	moveRows2Down() {
		$ag.moveRows2Down.call($ag, this.state.pid);
	}
	moveRows2Up() {
		$ag.moveRows2Up.call($ag, this.state.pid);
	}
	moveRowsToDown() {
		$ag.moveRowsToDown.call($ag, this.state.pid);
	}
	moveRowsToUp() {
		$ag.moveRowsToUp.call($ag, this.state.pid);
	}
	openEditDownListLayer() {
		$ag.openEditDownListLayer.call($ag, this.state.pid);
	}
	openFilterLayer(dataField: string) {
		$ag.openFilterLayer.call($ag, this.state.pid, arguments[0]);
	}
	openInputer() {
		$ag.openInputer.call($ag, this.state.pid);
	}
	outdentTreeDepth() {
		$ag.outdentTreeDepth.call($ag, this.state.pid);
	}
	prependData(items: any) {
		$ag.prependData.call($ag, this.state.pid, arguments[0]);
	}
	redo() {
		$ag.redo.call($ag, this.state.pid);
	}
	redoable(): boolean {
		return $ag.redoable.call($ag, this.state.pid);
	}
	refresh() {
		$ag.refresh.call($ag, this.state.pid);
	}
	refreshRows(items: any, style?: string, flashTime?: number) {
		$ag.refreshRows.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	removeAjaxLoader() {
		$ag.removeAjaxLoader.call($ag, this.state.pid);
	}
	removeCheckedRows() {
		$ag.removeCheckedRows.call($ag, this.state.pid);
	}
	removeColumn(columnIndex: number | number[] | 'selectedIndex') {
		$ag.removeColumn.call($ag, this.state.pid, arguments[0]);
	}
	removeInfoMessage() {
		$ag.removeInfoMessage.call($ag, this.state.pid);
	}
	removeRow(rowIndex: number | string) {
		$ag.removeRow.call($ag, this.state.pid, arguments[0]);
	}
	removeRowByRowId(rowIds: string | number | string[] | number[]) {
		$ag.removeRowByRowId.call($ag, this.state.pid, arguments[0]);
	}
	removeSoftRows(ids?: any) {
		return $ag.removeSoftRows.call($ag, this.state.pid, arguments[0]);
	}
	removeToastMessage() {
		$ag.removeToastMessage.call($ag, this.state.pid);
	}
	resetLazyStateByIndex(rowIndex: number) {
		$ag.resetLazyStateByIndex.call($ag, this.state.pid, arguments[0]);
	}
	resetUpdatedColumns(option?: 'c' | 'd' | 'a') {
		$ag.resetUpdatedColumns.call($ag, this.state.pid, arguments[0]);
	}
	resetUpdatedItemById(rowId: any, option?: 'c' | 'u' | 'e' | 'd' | 'a') {
		$ag.resetUpdatedItemById.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	resetUpdatedItems(option?: 'c' | 'u' | 'e' | 'd' | 'a') {
		$ag.resetUpdatedItems.call($ag, this.state.pid, arguments[0]);
	}
	resize(width?: number, height?: number) {
		$ag.resize.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	restoreEditedCells(cells: any) {
		$ag.restoreEditedCells.call($ag, this.state.pid, arguments[0]);
	}
	restoreEditedRows(rowIndex: number | string) {
		$ag.restoreEditedRows.call($ag, this.state.pid, arguments[0]);
	}
	restoreSoftRows(option: string | number) {
		$ag.restoreSoftRows.call($ag, this.state.pid, arguments[0]);
	}
	rowIdToIndex(rowId: any): number {
		return $ag.rowIdToIndex.call($ag, this.state.pid, arguments[0]);
	}
	search(
		dataField: string,
		term: string,
		opts?: { direction?: boolean; caseSensitive?: boolean; wholeWord?: boolean; wrapSearch?: boolean },
	) {
		$ag.search.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	searchAll(
		term: string,
		opts?: { direction?: boolean; caseSensitive?: boolean; wholeWord?: boolean; wrapSearch?: boolean },
	) {
		$ag.searchAll.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	selectRowsByRowId(rowId: any) {
		$ag.selectRowsByRowId.call($ag, this.state.pid, arguments[0]);
	}
	setAllCheckedRows(check: boolean) {
		$ag.setAllCheckedRows.call($ag, this.state.pid, arguments[0]);
	}
	setCellMerge(flag: boolean) {
		$ag.setCellMerge.call($ag, this.state.pid, arguments[0]);
	}
	setCellValue(rowIndex: number, dataField: string, value: any, noSetCellValue?: boolean) {
		$ag.setCellValue.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);

		// setCellValue시 캐치하기 위해 추가
		gridUtil.setCheckedRows(this, rowIndex, noSetCellValue);
	}
	setCheckedRowsByIds(rowIds: string | number | string[] | number[]) {
		$ag.setCheckedRowsByIds.call($ag, this.state.pid, arguments[0]);
	}
	setCheckedRowsByValue(dataField: string, value: any) {
		$ag.setCheckedRowsByValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setColumnChildOrder(dataFieldOrders: string[]) {
		$ag.setColumnChildOrder.call($ag, this.state.pid, arguments[0]);
	}
	setColumnOrder(dataFieldOrders: string[]) {
		$ag.setColumnOrder.call($ag, this.state.pid, arguments[0]);
	}
	setColumnProp(columnIndex: number, propObj: IGrid.Column) {
		$ag.setColumnProp.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setColumnPropByDataField(dataField: string, propObj: IGrid.Column) {
		$ag.setColumnPropByDataField.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setColumnSizeList(sizeList: (number | null)[]) {
		return $ag.setColumnSizeList.call($ag, this.state.pid, arguments[0]);
	}
	setCsvGridData(csvData: string, isSimpleMode?: boolean) {
		$ag.setCsvGridData.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setEditingInputValue(value: any) {
		$ag.setEditingInputValue.call($ag, this.state.pid, arguments[0]);
	}
	setFilter(dataField: string, func: (dataField: string, value: any, item: any) => boolean) {
		$ag.setFilter.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setFilterByValues(dataField: string, values: any) {
		$ag.setFilterByValues.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setFilterCache(cache: any) {
		$ag.setFilterCache.call($ag, this.state.pid, arguments[0]);
	}
	setFilterInlineTexts(values: string | string[]) {
		$ag.setFilterInlineTexts.call($ag, this.state.pid, arguments[0]);
	}
	setFixedColumnCount(count: number) {
		// 커스텀 엑스트라 체크박스 컬럼 고정 처리
		if (this.props.gridProps?.['showCustomRowCheckColumn'] && arguments[0] < 1) {
			$ag.setFixedColumnCount.call($ag, this.state.pid, arguments[0] + 1);
		} else {
			$ag.setFixedColumnCount.call($ag, this.state.pid, arguments[0]);
		}
	}
	setFixedRowCount(count: number) {
		$ag.setFixedRowCount.call($ag, this.state.pid, arguments[0]);
	}
	setFocus() {
		$ag.setFocus.call($ag, this.state.pid);
	}
	setFooter(footerLayout: IGrid.Footer[]) {
		$ag.setFooter.call($ag, this.state.pid, arguments[0]);
	}
	setGridData(data: any[]) {
		$ag.setGridData.call($ag, this.state.pid, arguments[0]);
		// bind 메서드 중복 핸들러 처리로 인해 아래 함수 주석 처리하고, bind('ready') 이벤트 핸들러에서 처리
		// gridUtil.afterAppendData(this); // 그리드 요청된 데이터 추가 후 처리 함수 호출

		// CheckBoxHeaderRenderer 사용시 setGridData 호출시 체크박스 상태값 초기화 안되는 이슈가 있음
		if (this.props.gridProps?.['showCustomRowCheckColumn']) {
			this.setHeaderRendererPropByDataField(this.getProp('customRowCheckColumnDataField'), { checked: false });
		}
	}
	setGroupBy(groupingFields: any, summaryProps?: any) {
		$ag.setGroupBy.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setHScrollPosition(columnIndex: number) {
		$ag.setHScrollPosition.call($ag, this.state.pid, arguments[0]);
	}
	setHScrollPositionByPx(pixel: number) {
		$ag.setHScrollPositionByPx.call($ag, this.state.pid, arguments[0]);
	}
	setHeaderRendererProp(columnIndex: number, propObj: any) {
		$ag.setHeaderRendererProp.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setHeaderRendererPropByDataField(dataField: string, propObj: any) {
		$ag.setHeaderRendererPropByDataField.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setHoverMode(mode: 'singleCell' | 'singleRow' | 'none') {
		return $ag.setHoverMode.call($ag, this.state.pid, arguments[0]);
	}
	setInfoMessage(msgHTML: string) {
		$ag.setInfoMessage.call($ag, this.state.pid, arguments[0]);
	}
	setPageRowCount(count: number) {
		$ag.setPageRowCount.call($ag, this.state.pid, arguments[0]);
	}
	setProp(obj: any, value?: any) {
		$ag.setProp.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setProperty(obj: any, value?: any) {
		$ag.setProperty.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setRendererProp(columnIndex: number, propObj: any) {
		$ag.setRendererProp.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setRowPosition(rowPosition: number | string) {
		$ag.setRowPosition.call($ag, this.state.pid, arguments[0]);
	}
	setScaleFactor(scaleFactor: number) {
		$ag.setScaleFactor.call($ag, this.state.pid, arguments[0]);
	}
	setSelectionAll() {
		$ag.setSelectionAll.call($ag, this.state.pid);
	}
	setSelectionBlock(startRowIndex: number, endRowIndex?: number, startColumnIndex?: number, endColumnIndex?: number) {
		$ag.setSelectionBlock.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
	}
	setSelectionByIndex(rowIndex: number, columnIndex: number) {
		$ag.setSelectionByIndex.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setSelectionColumn(startColIdx: number, endColIdx?: number) {
		$ag.setSelectionColumn.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setSelectionMode(mode: 'singleCell' | 'singleRow' | 'multipleCells' | 'multipleRows' | 'none') {
		$ag.setSelectionMode.call($ag, this.state.pid, arguments[0]);
	}
	setSorting(sortingInfoArr: { dataField: string; sortType: number }[], onlyLastDepthSorting?: boolean) {
		$ag.setSorting.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	setXmlGridData(xmlData: any, tagName?: string) {
		$ag.setXmlGridData.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	showAjaxLoader() {
		$ag.showAjaxLoader.call($ag, this.state.pid);
	}
	showAllColumns() {
		$ag.showAllColumns.call($ag, this.state.pid);
	}
	showColumnByDataField(dataField: string) {
		$ag.showColumnByDataField.call($ag, this.state.pid, arguments[0]);
	}
	showColumnGroup(dataField: string) {
		$ag.showColumnGroup.call($ag, this.state.pid, arguments[0]);
	}
	showExtraColumn(name: string) {
		$ag.showExtraColumn.call($ag, this.state.pid, arguments[0]);
	}
	showFooterLater() {
		$ag.showFooterLater.call($ag, this.state.pid);
	}
	showInfoMessage(msgHTML: string) {
		$ag.showInfoMessage.call($ag, this.state.pid, arguments[0]);
	}
	showItemsOnDepth(depth: number) {
		$ag.showItemsOnDepth.call($ag, this.state.pid, arguments[0]);
	}
	showToastMessage(rowIndex: number, columnIndex: number, message: string) {
		$ag.showToastMessage.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);
	}
	syncGridData(gridData: any[], stateCache: any) {
		$ag.syncGridData.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	// unbind 메서드 오버라이드 - 중복 핸들러 지원
	unbind(name: string | string[], func?: (event: any) => any) {
		if (isNoGlobalGridEvent(name)) {
			$ag.unbind.call($ag, this.state.pid, name, func);
			return;
		}

		const eventNames = Array.isArray(name) ? name : [name];

		eventNames.forEach(eventName => {
			const key = `${this.state.pid}_${eventName}`;

			if (globalGridEventHandlers[key]) {
				if (func) {
					// 특정 핸들러만 제거
					const index = globalGridEventHandlers[key].indexOf(func);
					if (index > -1) {
						globalGridEventHandlers[key].splice(index, 1);
					}
				} else {
					// 모든 핸들러 제거
					globalGridEventHandlers[key] = [];
				}

				// 핸들러가 없으면 실제 이벤트도 unbind
				if (globalGridEventHandlers[key].length === 0) {
					$ag.unbind.call($ag, this.state.pid, eventName);
					delete globalGridEventHandlers[key];
				}
			}
		});
	}

	// unbind(name: string | string[]) {
	// 	$ag.unbind.call($ag, this.state.pid, arguments[0]);
	// }
	undo() {
		$ag.undo.call($ag, this.state.pid);
	}
	undoable(): boolean {
		return $ag.undoable.call($ag, this.state.pid);
	}
	update() {
		$ag.update.call($ag, this.state.pid);
	}
	updateAllToValue(dataField: string, value: any) {
		$ag.updateAllToValue.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	updateExpFuncAll() {
		$ag.updateExpFuncAll.call($ag, this.state.pid);
	}
	updateGrouping() {
		$ag.updateGrouping.call($ag, this.state.pid);
	}
	updateRow(item: any, rowIndex?: number | string, isMarkEdited?: boolean) {
		$ag.updateRow.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);

		// updateRows시 캐치하기 위해 추가
		gridUtil.setCheckedRows(this, arguments[1]);
	}
	updateRowBlockToValue(
		startRowIndex: number,
		endRowIndex: number,
		dataFields: string | string[],
		values: any | any[],
	) {
		$ag.updateRowBlockToValue.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
	}
	updateRows(items: any[], rowIndexes: number[], isMarkEdited?: boolean) {
		$ag.updateRows.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2]);

		// updateRows시 캐치하기 위해 추가
		gridUtil.setCheckedRows(this);
	}
	updateRowsById(items: any, isMarkEdited?: boolean) {
		$ag.updateRowsById.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	validateChangedGridData(requireFields: string | string[], message: string): boolean {
		return $ag.validateChangedGridData.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	validateGridData(requireFields: string | string[], message: string): boolean {
		return $ag.validateGridData.call($ag, this.state.pid, arguments[0], arguments[1]);
	}
	validateGridDataByFunc(
		requireFields: string | string[],
		validFunc: (item: any, dataField: string) => boolean,
		message: string,
		onlyByFunc?: boolean,
	): boolean {
		return $ag.validateGridDataByFunc.call($ag, this.state.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
	}
}

export default AUIGrid;

export const agUtils: {
	readonly version: string;
	readonly releaseDate: string;
	isCreated: () => boolean;
	formatDate: (date: string | Date, formatString: string) => string;
	formatNumber: (number: number, formatString: string, rouding?: 'rounding' | 'ceil' | 'floor') => string;
	getActiveGrid: () => string | null;
	getCreatedGridAll: () => string[];
	makeValueMasked: (mask: string, value: string) => string;
	makeValueUnmasked: (mask: string, value: string) => string;
} = {
	releaseDate: $ag.releaseDate,
	version: $ag.version,
	isCreated: $ag.isCreated,
	formatDate: $ag.formatDate,
	formatNumber: $ag.formatNumber,
	getActiveGrid: $ag.getActiveGrid,
	getCreatedGridAll: $ag.getCreatedGridAll,
	makeValueMasked: $ag.makeValueMasked,
	makeValueUnmasked: $ag.makeValueUnmasked,
};
