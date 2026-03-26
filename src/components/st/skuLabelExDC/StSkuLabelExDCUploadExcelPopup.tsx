/*
 ############################################################################
 # FiledataField	: StSkuLabelExDCUploadExcelPopup.tsx
 # Description		: 상품이력번호등록(재고생성) 엑셀 업로드 팝업
 # Author					: Baechan
 # Since					: 25.09.03
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiGetExcelUploadSkuLabelExDCList } from '@/api/st/apiStSkuLabelExDC';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';
import dayjs from 'dayjs';
import { t } from 'i18next';

// API

interface PropsType {
	close?: any;
	gridCol?: any;
	gridProps?: any;
	gridInitValue?: any;
	title?: string;
	saveMasterList?: any;
}

const StSkuLabelExDCUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, gridCol, title, gridProps, saveMasterList, gridInitValue } = props;
	const excelUploadFileRef = useRef(null);
	const gridExcelPopupRef = useRef(null);
	const contractTypeCommonCodeList = getCommonCodeList('CONTRACTTYPE_SN', '');
	const columnStyleFunction = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		const classNames = ['left'];

		return classNames.join(' ');
	};
	const gridColumnLayout = [
		{
			dataField: 'regtype',
			headerText: t('lbl.CREATESTOCKYN'),
			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			headerText: t('lbl.ORGANIZEINFO'), //창고정보
			children: [
				{
					dataField: 'organize',
					headerText: t('lbl.ORGANIZE'), //창고코드
					dataType: 'code',
					editable: false,
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'organizename',
					headerText: t('lbl.ORGANIZENAME'), //창고명
					editable: false,
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKUCD'), //상품코드
					dataType: 'code',
					editable: false,
					disableMoving: true,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), //상품명
					editable: false,
					disableMoving: true,
				},
			],
		},
		{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric' }, // 라벨출력수량
		{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false }, // 박스입수
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'), //구매단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_DP'), //구매수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'), //로케이션
			dataType: 'code',
			editable: true,
		},
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataType: 'code',
			required: true,
			// styleFunction: columnStyleFunctionDuration,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataType: 'code',
			required: true,
			// styleFunction: columnStyleFunctionDuration,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			formatString: 'yyyy-mm-dd',
			editable: false,
			required: true,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유효기간-소비기간(잔여/전체)
		{ dataField: 'lastlottable01', headerText: '기존유통기한', dataType: 'date', editable: false },
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					required: true,
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
					editRenderer: {
						type: 'CalendarRenderer',
						onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
						showExtraDays: false,
					},
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contracttype', //계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editRenderer: {
						type: 'DropDownListRenderer',
						keyField: 'comCd', // 실제 저장될 값
						valueField: 'cdNm', // 화면에 표시될 값
						listFunction: function () {
							return contractTypeCommonCodeList?.map((code: any) => ({
								comCd: code.comCd, // 실제 값
								cdNm: `${code.comCd} - ${code.cdNm}`, // 표시될 텍스트
							}));
						},
					},
					labelFunction: function (rowIndex: number, columnIndex: number, value: string, item: any) {
						// 선택된 값(comCd)을 기준으로 해당 항목을 찾아서 "comCd - cdNm" 형태로 표시
						const foundItem = contractTypeCommonCodeList?.find((code: any) => code.comCd === value);
						if (foundItem) {
							return `${foundItem.comCd} - ${foundItem.cdNm}`;
						}
						return value || '';
					},
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contractcustkey', //계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'wdCustname', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'grossweight',
					headerText: t('lbl.GROSSWEIGHT'), //총중량
					dataType: 'numeric',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
			],
		},
		{ headerText: t('lbl.POKEY'), dataField: 'pokey', dataType: 'code', styleFunction: columnStyleFunction }, // 구매전표
		{ headerText: t('lbl.POLINE'), dataField: 'poline', dataType: 'code', styleFunction: columnStyleFunction }, // 구매라인
		{
			headerText: t('lbl.SLIPDT_DP'), //입고전표일자
			dataField: 'slipdt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			headerText: t('lbl.SLIPNO_DP'), //입고전표번호
			dataField: 'slipno',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SLIPLINE_DP'), //입고전표라인
			dataField: 'slipline',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'realYn',
			headerText: '가/진PO 여부',
			width: 100,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('REAL_YN', value)?.cdNm;
			},
			editable: false,
		},
		{ dataField: 'serialtype', headerText: t('lbl.SERIALTYPE'), visible: false },
		{
			dataField: 'processflag',
			headerText: 'PROCESSFLAG',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processmsg',
			headerText: 'PROCESSMSG',
			dataType: 'string',
			editable: false,
		},
	];
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// excelImport(e, 0, gridBtn.tGridRef, 1);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};
	// 엑셀 업로드 동작 2. 엑셀 정보 import
	const onDataCheckClick = () => {
		const validatedList = gridExcelPopupRef.current.getGridData();

		if (!validatedList || validatedList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (validatedList.length > 0 && !gridExcelPopupRef.current.validateRequiredGridData()) {
			return;
		}

		const convertedData = validatedList.map((row: any) => {
			const newRow = { ...row, rowStatus: 'I' };

			return newRow;
		});

		const params = {
			saveList: convertedData,
		};
		gridExcelPopupRef.current.clearGridData();
		apiGetExcelUploadSkuLabelExDCList(params).then((res: any) => {
			// const filteredData = res.data.filter((item: any) => item.skuname && item.skuname !== '');
			gridExcelPopupRef.current?.addRow(res.data);
			// gridExcelPopupRef.current?.setGridData(res.data);
		});
	};

	/**
	 * 엑셀 저장
	 * @param gridRef
	 */
	const saveExcelList = (gridRef?: any) => {
		const checkedItems = gridRef.current.getCheckedRowItems();
		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = checkedItems.some((item: any) => item.item.processflag !== 'Y');
		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		saveMasterList(gridRef);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridExcelPopupRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelForm',
			},
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			{
				btnType: 'save',
				callBackFn: () => saveExcelList(gridExcelPopupRef),
			},
		],
	};

	const columnResize = (ref: any) => {
		const refCurrent = ref?.current;

		if (!refCurrent) {
			return;
		}

		const colSizeList = refCurrent.getFitColumnSizeList(true);
		refCurrent.setColumnSizeList(colSizeList);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	// useEffect(() => {
	// 	gridExcelPopupRef.current.bind('addRow', (event: any) => {
	// 		//console.log('12323123121!!!!!');
	// 		if (!event?.items?.length) {
	// 			return;
	// 		}
	// 		apiGetDurationTypeListByExcelUploadList({ excelUploadList: event?.items }).then((res: any) => {
	// 			// 현재 그리드 데이터 가져오기
	// 			const currentGridData = gridExcelPopupRef.current.getGridData();
	// 			//console.log('res : ', res);
	// 			// response 데이터와 매칭하여 업데이트할 행들 준비
	// 			const updatedItems = currentGridData
	// 				.map((gridItem: any) => {
	// 					const matchedResponse = res.data?.find((responseItem: any) => responseItem.sku === gridItem.sku);

	// 					if (matchedResponse) {
	// 						return {
	// 							...gridItem,
	// 							...gridInitValue,
	// 							durationtype: matchedResponse.durationtype,
	// 							lottable01:
	// 								matchedResponse.durationtype === '1'
	// 									? dayjs(gridItem.expiredt).format('YYYYMMDD')
	// 									: dayjs(gridItem.manufacturedt).format('YYYYMMDD'),
	// 							regtype: '1',
	// 							...(gridItem.barcode && { barcode: gridItem.barcode }),
	// 						};
	// 					}
	// 					return gridItem;
	// 				})
	// 				.filter((item: any) => {
	// 					// 실제로 변경된 행들만 필터링
	// 					return res.data?.some((responseItem: any) => responseItem.sku === item.sku);
	// 				});

	// 			// setGridData 대신 updateRowsById 사용
	// 			if (updatedItems.length > 0) {
	// 				gridExcelPopupRef.current.updateRowsById(updatedItems, true); // isMarkEdited: true
	// 			}

	// 			gridExcelPopupRef.current.setAllCheckedRows(true);
	// 			columnResize(gridExcelPopupRef);
	// 		});
	// 	});
	// }, []);

	useEffect(() => {
		columnResize(gridExcelPopupRef);
	}, [gridExcelPopupRef.current]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`${title} 일괄업로드`} showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridExcelPopupRef} columnLayout={gridColumnLayout} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default StSkuLabelExDCUploadExcelPopup;
