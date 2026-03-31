/*
 ############################################################################
 # FiledataField	: CmPickingPopup.tsx
 # Description		: 피킹그룹설정팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.11.05
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsPickBatchGroup';

// Store
import { fetchMsPlant, getMsPlantList } from '@/store/biz/msPlantStore';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

interface PropsType {
	callBack?: any;
	gridData?: Array<object>;
	search?: any;
	searchMode?: string;
	close?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	totalCount?: number;
	dccode?: string;
}

const CmPickingPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, gridData, search, searchMode, close, gridRef, form, name, totalCount, dccode } = props;

	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];
	const gridCol =
		searchMode !== 'search'
			? [
					{
						dataField: 'dcCode',
						headerText: t('lbl.DCCODE'),
						dataType: 'code',
						filter: {
							showIcon: true,
						},
						editable: false,
					},
					{
						dataField: 'dcName',
						headerText: t('lbl.DCNAME'),
						dataType: 'code',
						editable: false,
						filter: {
							showIcon: true,
						},
						labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
							const dcCode = item.dcCode;
							return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
						},
					},
					{
						dataField: 'plant',
						headerText: t('lbl.PLANT'),
						dataType: 'string',
						filter: {
							showIcon: true,
						},
						editRenderer: {
							type: 'ComboBoxRenderer',
							autoCompleteMode: true, // 자동완성 모드 설정
							autoEasyMode: true, // 자동완성 모드일 때 자동 선택할지 여부 (기본값 : false)
							showEditorBtnOver: true, // 마우스 오버 시 에디터버튼 보이기
							matchFromFirst: false, // 설정 시 앞에서 부터 일치가 아닌 단순 포함으로 리스트에 출력
							listFunction: (rowIndex: number, colIndex: number, item: any) => {
								// 물류센터 코드에 따라 플랜트 리스트를 가져온다.
								return getMsPlantList(item.dcCode);
							},
							keyField: 'plantName', // key 에 해당되는 필드명
							valueField: 'plantName', // value 에 해당되는 필드명
							// 에디팅 유효성 검사
							validator: function (
								oldValue: any,
								newValue: any,
								item: any,
								dataField: any,
								fromClipboard: any,
								which: any,
							) {
								const valueField = this.valueField;
								const isValid = getMsPlantList(item.dcCode).some(v => v[valueField] === newValue);
								return { validate: isValid };
							},
						},
						required: true,
						styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
							if (item.rowStatus !== 'I') {
								gridRef.current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						},
					},
					{
						dataField: 'distanceType',
						// headerText: t('lbl.DISTANCETYPE'),
						headerText: t('lbl.PICKINGTYPE'), // 피킹유형
						dataType: 'code',
						commRenderer: {
							type: 'dropDown',
							keyField: 'comCd',
							valueField: 'comCd',
							list: getCommonCodeList('DISTANCETYPE', ''),
							disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
								if (item.rowStatus !== 'I') {
									return true;
								}
								return false;
							},
						},
						labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
							return getCommonCodebyCd('DISTANCETYPE', value)?.cdNm;
						},
						required: true,
					},
					{
						dataField: 'description',
						// headerText: t('lbl.DESCRIPTION'),
						headerText: '피킹유형명',
						dataType: 'string',
						filter: {
							showIcon: true,
						},
					},
					{
						dataField: 'storageType',
						headerText: t('lbl.STORAGETYPE'),
						dataType: 'code',
						commRenderer: {
							type: 'dropDown',
							list: getCommonCodeList('STORAGETYPE', ''),
							disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
								if (item.rowStatus !== 'I') {
									return true;
								}
								return false;
							},
						},
						required: true,
					},
					{
						dataField: 'alloUom',
						headerText: '분배단위',
						dataType: 'code',
						commRenderer: {
							type: 'dropDown',
							list: [
								{ comCd: 'PLT', cdNm: 'PLT' },
								{ comCd: 'BOX', cdNm: 'BOX' },
								{ comCd: 'EA', cdNm: 'EA' },
							],
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						},
					},
					{
						dataField: 'usebyDateFreeRt',
						headerText: '소비기한(%)',
						editRenderer: {
							type: 'InputEditRenderer',
							onlyNumeric: true,
							maxlength: 3,
							//allowPoint: true,
							textAlign: 'right',
						},
					},
					{
						dataField: 'batchGroup',
						headerText: t('lbl.BATCHGROUP'),
						dataType: 'code',
						maxlength: 20,
						filter: {
							showIcon: true,
						},
						required: true,
						editRenderer: {
							type: 'InputEditRenderer',
							regExp: '[^ㄱ-힣]+$',
						},
					},
					{
						headerText: t('lbl.USE_YN'), // 사용여부
						dataField: 'delYn',

						width: 80,
						style: 'ta-c', // 체크박스 중앙정렬
						// dataType: 'boolean',
						renderer: {
							type: 'CheckBoxEditRenderer',
							checkValue: 'N', // 체크 = 사용
							unCheckValue: 'Y', // 체크 해제 = 미사용
							editable: true,
						},
					},
			  ]
			: [
					{
						dataField: 'dcCode',
						headerText: t('lbl.DCCODE'),
						dataType: 'code',
						filter: {
							showIcon: true,
						},
						editable: false,
					},
					{
						dataField: 'dcName',
						headerText: t('lbl.DCNAME'),
						dataType: 'code',
						editable: false,
						filter: {
							showIcon: true,
						},
						labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
							const dcCode = item.dcCode;
							return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
						},
					},
					{
						dataField: 'distanceType',
						// headerText: t('lbl.DISTANCETYPE'),
						headerText: t('lbl.PICKINGTYPE'), // 피킹유형
						dataType: 'code',
						commRenderer: {
							type: 'dropDown',
							list: getCommonCodeList('DISTANCETYPE', ''),
							editable: false,
							disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
								return true;
							},
						},
						labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
							return getCommonCodebyCd('DISTANCETYPE', value)?.cdNm;
						},
						editable: false,
					},
			  ];

	const gridProps = {
		editable: searchMode !== 'search',
		selectionMode: 'multipleCells',
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
	};

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr:
			searchMode !== 'search'
				? [
						{
							btnType: 'plus' as const,
							initValues: {
								dcCode: dccode,
								dcName: userDccodeList.find((item: any) => item.dccode === dccode)?.dcname.split(']')[1] || '',
								status: '90',
								delYn: 'N',
								storerkey: 'FW00',
								rowStatus: 'I',
							},
						},
						{
							btnType: 'delete' as const,
						},
						{
							btnType: 'save' as const,
							callBackFn: () => savePickingList(),
						},
				  ]
				: [],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 * @returns {void}
	 */
	const savePickingList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		// 플랜트 세팅
		for (const item of updatedItems) {
			item.plant = item.plant.substring(1, 5);
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							close();
						},
					});
				}
			});
		});
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const checkedRow = gridRef.current.getCheckedRowItemsAll();

		if (checkedRow.length === 0) {
			close();
			return;
		}
		callBack(checkedRow);
		form.resetFields();
	};

	const initEvent = () => {
		// 플랜트 데이터 초기화 및 조회
		const fetchInitStore = async () => {
			await fetchMsPlant();
		};
		// init store
		fetchInitStore();

		gridRef?.current.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'plant') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});

		gridRef?.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'usebyDateFreeRt' && Number(event.value) === 0) {
				setTimeout(() => {
					gridRef.current.setCellValue(event.rowIndex, event.dataField, null);
				});
				// const uncheckedIds = event.item._$uid;
				// 오류케이스 체크 해제
				// gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		initEvent();
	}, []);

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
			<PopupMenuTitle name="피킹그룹목록" />

			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
				{searchMode === 'search' && (
					<Button type="primary" onClick={checkRowData}>
						{t('lbl.BTN_CONFIRM')}
					</Button>
				)}
			</ButtonWrap>
		</>
	);
};

export default CmPickingPopup;
