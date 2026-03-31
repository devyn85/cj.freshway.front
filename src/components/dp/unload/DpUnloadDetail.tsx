/*
 ############################################################################
 # FiledataField	: DpUnloadDetail.tsx
 # Description		: 입고 > 입고작업 > 입고하차관리 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.07.28
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DpUnloadDetail = ({
	gridData,
	gridDataCarLog,
	gridDataDetail,
	gridDataExcel1,
	gridDataExcel2,
	searchDetailList,
	searchExcelList,
	saveCarLog,
	gridRef,
	gridRef1,
	gridRef2,
	gridRef3,
	gridRef4,
	openModal,
	openModal2,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const coldCode = getCommonCodeList('LIMIT_COLD_TEMP')?.[0]?.comCd;
	const freezeCode = getCommonCodeList('LIMIT_FREEZE_TEMP')?.[0]?.comCd;

	const { t } = useTranslation();
	const excelParams = {
		fileName: '입고하차관리',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const channelOptions = getCommonCodeList('PUTAWAYTYPE'); // 채널 옵션

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'down', // 아래로
			// },
			// {
			// 	btnType: 'up', // 위로
			// },
			// {
			// 	btnType: 'excelForm', // 엑셀양식
			// },
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			// {
			// 	btnType: 'copy', // 행복사
			// 	initValues: {
			// 		menuId: '',
			// 		regId: '',
			// 		regDt: '',
			// 	},
			// },
			// {
			// 	btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			// },
			// {
			// 	btnType: 'plus', // 행추가
			// 	initValues: {
			// 		menuYn: 0,
			// 		useYn: 0,
			// 	},
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
			// {
			// 	btnType: 'detailView', // 상세보기
			// },
			// {
			// 	btnType: 'btn1', // 사용자 정의버튼1
			// },
			// {
			// 	btnType: 'btn2', // 사용자 정의버튼2
			// },
			// {
			// 	btnType: 'btn3', // 사용자 정의버튼3
			// },
			// {
			// 	btnType: 'print', // 인쇄
			// },
			// {
			// 	btnType: 'new', // 신규
			// },
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: null,
			// },
			// {
			// 	btnType: 'elecApproval', // 전자결재
			// },
		],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete',
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '적정온도기준',
				authType: 'new',
				callBackFn: openModal,
			},
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcelList,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCarLog,
			},
		],
	};
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.fromCustkey,
						custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
	];

	const gridCol1 = [
		{
			dataField: 'docno',
			headerText: t('lbl.PONO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.BATCHCNT_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toIntime',
			headerText: t('lbl.INPLANDATETIME_DP'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				return !value ? '' : value?.slice(0, 2) + ':' + value?.slice(2);
			},
		},
		{
			dataField: 'temperature1',
			headerText: t('lbl.REFRIGETEMPERATURE'),
			dataType: 'code',
			style: 'ta-r',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				allowPoint: true,
			},
		},
		{
			dataField: 'temperature2',
			headerText: t('lbl.FREEZINGTEMPERATURE'),
			dataType: 'code',
			style: 'ta-r',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				allowPoint: true,
			},
		},
		{
			dataField: 'tempoptitype',
			headerText: t('lbl.TEMPOPTIYN'),
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value === 'S' ? '적정' : value === 'F' ? '이탈' : '';
			},
		},
		{
			dataField: 'insptime',
			headerText: t('lbl.UNLOADTIME'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverytime',
			headerText: t('입고검수시간'),
			dataType: 'user',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				return value != 'null' && value ? `${value.slice(0, 2)}:${value.slice(2, 4)}` : '';
			},
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: false,
				maxLength: 4,
			},
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return channelOptions.find(item => item.comCd === value)?.cdNm;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				showEditorBtn: false,
				showEditorBtnOver: false,
				keyField: 'comCd', // code 에 해당되는 필드명
				valueField: 'cdNm', // name 에 해당되는 필드명
				list: channelOptions,
			},
		},
		{
			dataField: 'deliverymemo',
			headerText: t('lbl.REASONMSG_INCONG'),
			dataType: 'string',
		},
	];

	const gridCol2 = [
		{
			dataField: 'docno',
			headerText: t('lbl.PONO'),
			dataType: 'code',
		},
		{
			dataField: 'ordertypeName',
			headerText: t('lbl.ORDERTYPE_DP'),
			dataType: 'code',
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					gridRef2.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'storagetypeName',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_DP'),
			align: 'right',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_DP'),
			align: 'right',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
	];

	const gridCol3 = [
		{
			dataField: 'docno',
			headerText: t('lbl.PONO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.BATCHCNT_DP'),
			dataType: 'code',
		},
		{
			dataField: 'temperature1',
			headerText: t('lbl.REFRIGETEMPERATURE'),
			dataType: 'code',
		},
		{
			dataField: 'temperature2',
			headerText: t('lbl.FREEZINGTEMPERATURE'),
			dataType: 'code',
		},
		{
			dataField: 'tempoptitype',
			headerText: t('lbl.TEMPOPTIYN'),
			dataType: 'code',
		},
		{
			dataField: 'insptime',
			headerText: t('lbl.UNLOADTIME'),
			dataType: 'code',
		},
		{
			dataField: 'deliverytime',
			headerText: '하차검수시간',
			dataType: 'code',
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'deliverymemo',
			headerText: t('lbl.REASONMSG_INCONG'),
			dataType: 'code',
		},
		{
			dataField: 'docno',
			headerText: t('lbl.PONO'),
			dataType: 'code',
		},
		{
			dataField: 'ordertypeName',
			headerText: t('lbl.ORDERTYPE_DP'),
			dataType: 'code',
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					gridRef3.current.openPopup(params, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'storagetypeName',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_DP'),
			dataType: 'code',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_DP'),
			dataType: 'code',
		},
	];

	const gridCol4 = [
		{
			dataField: 'docno',
			headerText: t('lbl.PONO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'invoicetime',
			headerText: t('lbl.INPLANDATETIME_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			filter: {
				showIcon: true,
			},
			dataType: 'string',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.BATCHCNT_DP'),
			dataType: 'code',
		},
		{
			dataField: 'temperature1',
			headerText: t('lbl.REFRIGETEMPERATURE'),
			dataType: 'code',
		},
		{
			dataField: 'temperature2',
			headerText: t('lbl.FREEZINGTEMPERATURE'),
			dataType: 'code',
		},
		{
			dataField: 'tempoptitype',
			headerText: t('lbl.TEMPOPTIYN'),
			dataType: 'code',
		},
		{
			dataField: 'insptime',
			headerText: t('lbl.UNLOADTIME'),
			dataType: 'code',
		},
		{
			dataField: 'deliverytime',
			headerText: '하차검수시간',
			dataType: 'code',
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'deliverymemo',
			headerText: t('lbl.REASONMSG_INCONG'),
			dataType: 'code',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 속성
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps1 = {
		editable: true,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		isLegacyRemove: true, // 기존행 삭제 가능 옵션
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};
	const gridProps2 = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	const footerLayout2 = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'docno',
			// colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList(gridRef.current.getSelectedRows()[0]);
		});

		gridRef1.current.bind('cellEditEnd', (e: any) => {
			const { rowIndex, oldValue } = e;
			//검수시간
			if (['deliverytime'].includes(e.dataField)) {
				// HHMM 또는 HH:mm 형태로 들어오는지 확인
				const { deliverytime } = gridRef1.current.getGridData()[rowIndex];

				const hh = parseInt(deliverytime.substring(0, 2), 10);
				const mm = parseInt(deliverytime.substring(2, 4), 10);

				// 범위 검사 (00:00 ~ 23:59)
				if (hh > 23) {
					showAlert('', t('msg.MSG_COM_VAL_022'));
					gridRef1.current.setCellValue(rowIndex, 'deliverytime', oldValue);
					return;
				}
				if (mm > 59) {
					showAlert('', t('msg.MSG_COM_VAL_023'));
					gridRef1.current.setCellValue(rowIndex, 'deliverytime', oldValue);
					return;
				}
				const len = deliverytime.length;

				let time = deliverytime;
				if (len === 1) {
					time = `0${time}00`; // 1 → 0100
				} else if (len === 2) {
					time = `${time}00`; // 11 → 1100
				} else if (len === 3) {
					time = `${time}0`; // 111 → 1110
				} else if (len >= 4) {
					time = deliverytime.substring(0, 4);
				}
				gridRef1.current.setCellValue(rowIndex, 'deliverytime', time);
			}

			if (['temperature1', 'temperature2'].includes(e.dataField)) {
				const { temperature1: t1, temperature2: t2 } = gridRef1.current.getGridData()[rowIndex];
				const cold1 = Number(coldCode.split('-')[0]);
				const cold2 = Number(coldCode.split('-')[1]);
				const freeze1 = Number(freezeCode);
				const isFilled = (v: any) => v !== null && v !== undefined && v !== '';
				const n1 = Number(t1);
				const n2 = Number(t2);
				let result = '';

				if (isFilled(t1) && !isFilled(t2)) {
					result = n1 >= cold1 && n1 <= cold2 ? 'S' : 'F';
				} else if (!isFilled(t1) && isFilled(t2)) {
					result = n2 <= freeze1 ? 'S' : 'F';
				} else if (isFilled(t1) && isFilled(t2)) {
					result = n1 >= cold1 && n1 <= cold2 && n2 <= freeze1 ? 'S' : 'F';
				}

				gridRef1.current.setCellValue(rowIndex, 'tempoptitype', result);
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			prevRowIndex = null;
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataCarLog);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataCarLog.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridDataCarLog]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridDataDetail);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current.setColumnSizeList(colSizeList);
			}
			gridRef.current.setFocus();
		}
	}, [gridDataDetail]);

	useDidMountEffect(() => {
		if (gridRef3.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(gridDataExcel1);
			gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridDataExcel1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef3.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef3.current.setColumnSizeList(colSizeList);
				gridRef3.current?.exportToXlsxGrid(excelParams);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		}
	}, [gridDataExcel1]);

	useDidMountEffect(() => {
		if (gridRef4.current) {
			// 그리드 초기화
			gridRef4.current?.setGridData(gridDataExcel2);
			gridRef4.current?.setSelectionByIndex(0, 0);

			if (gridDataExcel2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef4.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef4.current.setColumnSizeList(colSizeList);
				gridRef4.current?.exportToXlsxGrid(excelParams);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		}
	}, [gridDataExcel2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="DpUnload-top-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridTitle={'하차 등록 목록'} gridBtn={gridBtn1} totalCnt={gridDataCarLog?.length} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
								</GridAutoHeight>
							</>,
						]}
					/>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn2} totalCnt={gridDataDetail?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef3} columnLayout={gridCol3} />
			</AGrid>
			<AGrid className={'dp-none'}>
				<AUIGrid ref={gridRef4} columnLayout={gridCol4} />
			</AGrid>
		</>
	);
};

export default DpUnloadDetail;
