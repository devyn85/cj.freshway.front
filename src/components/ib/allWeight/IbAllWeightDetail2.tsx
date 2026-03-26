/*
 ############################################################################
 # FiledataField	: IbAllWeightDetail.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 정산 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.11.12
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { showAlert } from '@/util/MessageUtil';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const IbAllWeightDetail2 = ({ gridRef1, gridData2, copyMasterList, saveMasterList, addRow }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const userDccodeList = getUserDccodeList('') ?? [];
	const MS_MULDONG_BASE1_LIST = getCommonCodeList('MS_MULDONG_BASE1'); //대분류
	const MS_MULDONG_BASE2_LIST = getCommonCodeList('MS_MULDONG_BASE2'); //중분류
	const PUTAWAYTYPE_LIST = getCommonCodeList('PUTAWAYTYPE'); //저장유무
	const MS_MULDONG_BASE3_LIST = getCommonCodeList('MS_MULDONG_BASE3'); //단가구분
	const MS_MULDONG_BASE4_LIST = getCommonCodeList('MS_MULDONG_BASE4'); //단위
	const refModal = useRef(null);
	const excelParams = {
		fileName: '센터별물동량 정산',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					addRow();
				},
			},
			{
				btnType: 'delete', //
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					const checkedData = gridRef1.current.getCheckedRowItemsAll();

					if (checkedData.length == 0) {
						showAlert(null, '삭제할 행을 선택하세요.');
					}
					// const gridData = gridRef1.current.getGridData();
					// const checkedUids = checkedData.map((item: any) => item?._$uid);
					const checkRowIdxArr = gridRef1.current.getCheckedRowItems().map((item: any) => item.rowIndex);
					gridRef1.current.removeRow(checkRowIdxArr);
				},
			},
			// {
			// 	btnType: 'btn1',
			// 	btnLabel: '전월복사',
			// 	authType: 'new',
			// 	callBackFn: () => {
			// 		copyMasterList();
			// 	},
			// },
			{
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	const gridCol1 = [
		// 공급센터
		{
			dataField: 'dccode',
			cellMerge: true,
			headerText: t('공급센터'),
			width: 100,
			required: true,
			dataType: 'code',
			editRenderer: { type: 'DropDownListRenderer', list: userDccodeList, keyField: 'dccode', valueField: 'dcname' },
			filter: { showIcon: true },
		},
		// 공급센터명
		{
			dataField: 'dcname',
			cellMerge: true,
			headerText: t('공급센터명'),
			width: 120,
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dccode = item?.dccode;

				return userDccodeList.find((item: any) => item?.dccode === dccode)?.dcname.split(']')[1] || '';
			},
		},
		// 협력사코드
		{
			dataField: 'custkey',
			cellMerge: true,
			headerText: t('협력사코드'),
			width: 100,
			dataType: 'code',
			editable: true,
			required: true,
			commRenderer: {
				type: 'search',
				popupType: 'partner',
				searchDropdownProps: { dataFieldMap: { custkey: 'code', custname: 'name' } },
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					refModal.current.open({
						gridRef: gridRef1,
						codeName: e.text,
						rowIndex,
						dataFieldMap: { custkey: 'code', custname: 'name' },
						popupType: 'partner',
					});
				},
			},
		},
		// 협력사명
		{
			dataField: 'custname',
			cellMerge: true,
			headerText: t('협력사명'),
			width: 150,
			dataType: 'text',
			editable: false,
		},
		// 단가구분
		{
			dataField: 'priceCl',
			headerText: t('lbl.GUBUN'),
			width: 100,
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: MS_MULDONG_BASE3_LIST },
		},
		// 대분류
		{
			dataField: 'lclCd',
			headerText: t('lbl.CLASS_BIG'),
			width: 100,
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: MS_MULDONG_BASE1_LIST },
		},
		// 중분류
		{
			dataField: 'mclCd',
			headerText: t('lbl.CLASS_MIDDLE'),
			width: 100,
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				listFunction: (rowIndex: any, columnIndex: any, item: any, dataField: any) => {
					return MS_MULDONG_BASE2_LIST.filter((el: any) => {
						return item?.lclCd == el.data1;
					});
				},
			},
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.CHANNEL_DMD'), // 저장유무
			width: 80,
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: PUTAWAYTYPE_LIST },
		},
		{
			dataField: 'price',
			headerText: t('lbl.FACTORYPRICE'), // 단가
			width: 150,
			editable: true,
			dataType: 'numeric',
			formatString: '#,##0.###',
			editRenderer: { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: true },
		},
		{
			dataField: 'uomStd',
			headerText: t('lbl.UOM'), // 단위
			width: 60,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'dropDown', list: MS_MULDONG_BASE4_LIST },
		},
		{
			dataField: 'uomQty',
			headerText: t('lbl.UOM_PRICE'), // 단위수량
			width: 80,
			editable: true,
			dataType: 'numeric',
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: false,
			},
		},
		{
			dataField: 'amount',
			headerText: t('lbl.AMT'), // 금액
			width: 200,
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'costAllocRate',
			headerText: t('분담율'),
			editable: true,
			dataType: 'code',
			style: 'ta-r',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				allowPoint: true,
			},
		}, // 분담율
		{
			dataField: 'ppm',
			headerText: t('PPM'),
			editable: true,
			dataType: 'code',
			style: 'ta-r',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				allowPoint: true,
			},
		}, // PPM
		{
			dataField: 'dcMerge',
			headerText: t('lbl.CENTER_MERGE'), // 센터병합
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: [{ dccode: '', dcname: '' }, ...userDccodeList],
				keyField: 'dccode',
				valueField: 'dcname',
			},
			filter: { showIcon: true },
		},
		{
			dataField: 'dcMergeName',
			headerText: t('센터병합명'), // 센터병합명
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dccode = item?.dcMerge;
				return userDccodeList.find((item: any) => item?.dccode === dccode)?.dcname.split(']')[1] || '';
			},
		},
		// 비고
		{ dataField: 'rmk', headerText: t('비고'), dataType: 'string', editable: true },
		// 기준일 FROM
		{
			dataField: 'fromSttlBaseDate',
			headerText: t('기준일FROM'),
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'calender', onlyCalendar: false },
		},
		// 기준일 TO
		{
			dataField: 'toSttlBaseDate',
			headerText: t('기준일TO'),
			required: true,
			dataType: 'code',
			editable: true,
			commRenderer: { type: 'calender', onlyCalendar: false },
		},
		// 등록자
		{ dataField: 'addwhoName', headerText: t('등록자'), dataType: 'code', editable: false },
		// 등록일시
		{ dataField: 'adddate', headerText: t('등록일시'), dataType: 'date', editable: false },
		// 수정자
		{ dataField: 'editwhoName', headerText: t('수정자'), dataType: 'code', editable: false },
		// 수정일시
		{ dataField: 'editdate', headerText: t('수정일시'), dataType: 'date', editable: false },
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
	const gridProps1: any = {
		editable: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,

		showCustomRowCheckColumn: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
	};

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		gridRef1.current.bind('cellEditEnd', (e: any) => {
			if (['sttlYm'].includes(e.dataField)) {
				const v = String(e.value).trim();

				// 4자리만 입력한 경우 → 20 + 입력값
				if (/^\d{4}$/.test(v)) {
					const newVal = '20' + v;
					gridRef1.current.setCellValue(e.rowIndex, 'sttlYm', newVal);
				}
			}
			//대분류변경
			if (['priceCl'].includes(e.dataField)) {
				const { rowIndex, value } = e;
				if (value == '50') {
					//임대료 대 중 자동 부여
					gridRef1.current.setCellValue(rowIndex, 'lclCd', 'H');
					gridRef1.current.setCellValue(rowIndex, 'mclCd', 'H001');
				}
				if (value == '60') {
					//추가비용 대 중 자동 부여
					gridRef1.current.setCellValue(rowIndex, 'lclCd', 'J');
					gridRef1.current.setCellValue(rowIndex, 'mclCd', 'J001');
				}
			}

			//대분류변경
			if (['lclCd'].includes(e.dataField)) {
				const { rowIndex } = e;
				// 새로 필터링된 2열 옵션 목록 구하기
				const filtered = MS_MULDONG_BASE2_LIST.filter(el => el.data1 === e.value);

				// 비어 있지 않다면 첫 번째 옵션으로 mclCd 값을 바꿔주기
				if (filtered.length > 0) {
					const firstVal = filtered[0].comCd;

					gridRef1.current.setCellValue(rowIndex, 'mclCd', firstVal);
				}
			}

			//금액계산
			if (['price', 'uomQty'].includes(e.dataField)) {
				const { rowIndex } = e;
				const { price, uomQty } = gridRef1.current.getGridData()[rowIndex];

				setTimeout(() => {
					gridRef1.current.setCellValue(rowIndex, 'amount', (Number(price) || 0) * (Number(uomQty) || 0));
				}, 0);
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(
				gridData2.map((item: any) => ({
					...item,
					amount: (Number(item?.price) || 0) * (Number(item?.uomQty) || 0) || '',
				})),
			);
			gridRef1.current?.setSelectionByIndex(0, 0);

			// if (gridData2.length > 0) {
			// 	// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 	// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			// 	const colSizeList = gridRef1.current.getFitColumnSizeList(true);
			//
			// 	// 구해진 칼럼 사이즈를 적용 시킴.
			// 	gridRef1.current.setColumnSizeList(colSizeList);
			// }
		}
	}, [gridData2]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn1} totalCnt={gridData2?.length} />
				<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
			</AGrid>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default IbAllWeightDetail2;
