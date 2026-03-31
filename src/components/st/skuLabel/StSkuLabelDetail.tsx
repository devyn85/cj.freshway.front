/*
 ############################################################################
 # FiledataField	: StSkuLabelDetail.tsx
 # Description		: 상품이력번호등록
 # Author			    : Baechan
 # Since			    : 25.08.25
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import { apiPostSaveMasterList } from '@/api/st/apiStSkuLabel';
import CustomModal from '@/components/common/custom/CustomModal';
import StSkuLabelUploadExcelPopup from '@/components/st/skuLabel/StSkuLabelUploadExcelPopup';
import { useDatepickerInputToDayjs } from '@/hooks/cm/useDatepickerInputToDayjs';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { Button } from 'antd';
import dayjs from 'dayjs';

const contractTypeCommonCodeList = getCommonCodeList('CONTRACTTYPE_SN', '');

const StSkuLabelDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const modalExcelRef = useRef(null);
	const gridExcelPopupRef = useRef(null);
	const gridId = uuidv4() + '_gridWrap';

	const columnStyleFunction = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		const classNames = ['left'];

		if (item.rowStatus === 'I') {
			classNames.push('isEdit');
		} else {
			ref.current.removeEditClass(columnIndex);
		}

		return classNames.join(' ');
	};

	const columnStyleFunctionDuration = (
		rowIndex: number,
		columnIndex: number,
		value: any,
		headerText: string,
		item: any,
	) => {
		ref?.current?.removeEditClass(columnIndex);

		return item?.rowStatus === 'I'
			? 'isEdit'
			: {
					backgroundColor: commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
			  };
	};

	const { convertDatePickerInputToDayjs } = useDatepickerInputToDayjs();

	// 그리드 컬럼 세팅
	const gridCol = [
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
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.current.openPopup(e.item, 'sku');
						},
					},
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
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataType: 'code',
			required: true,
			styleFunction: columnStyleFunctionDuration,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataType: 'code',
			required: true,
			styleFunction: columnStyleFunctionDuration,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return dayjs(value).format('YYYY-MM-DD') ?? '';
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
		{ dataField: 'lastlottable01', headerText: '기존유통기한', dataType: 'code', editable: false },
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
					dataType: 'code',
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
								cdNm: code.cdNm, // 표시될 텍스트
							}));
						},
					},
					labelFunction: function (rowIndex: number, columnIndex: number, value: string, item: any) {
						// 선택된 값(comCd)을 기준으로 해당 항목을 찾아서 "comCd - cdNm" 형태로 표시
						const foundItem = contractTypeCommonCodeList?.find((code: any) => code.comCd === value);
						if (foundItem) {
							//return `${foundItem.comCd} - ${foundItem.cdNm}`;
							return foundItem.cdNm;
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
					dataField: 'wdCustName', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'code',
					formatString: 'yyyy-mm-dd',
					styleFunction: columnStyleFunction,
					disableMoving: true,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'code',
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
			dataType: 'code',
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
	];

	// 그리드 footer
	const footerLayout = [
		{
			labelText: '합계',
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'printedqty',
			positionField: 'printedqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 라벨출력수량
	];

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @param gridRef
	 * @returns {void}
	 */
	const saveMasterListPop = (gridRef?: any) => {
		// 1 변경 데이터 확인
		//const updatedItems = gridRef.current.getChangedData();

		// 2 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef?.current?.getCheckedRowItemsAll();

		// validation
		if (updatedItems.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		gridRef.current.showConfirmSave(() => {
			updatedItems.forEach((row: any) => {
				// updatedItems 항목이 { item: ... } 형태일 수 있어 실제 객체를 r로 통일
				const r = row?.item ?? row;
				if (r?.contracttype) {
					const found = Array.isArray(contractTypeCommonCodeList)
						? contractTypeCommonCodeList.find((d: any) => String(d.cdNm) === String(r.contracttype))
						: null;
					if (found) {
						// comNm과 같으면 comCd로 치환
						r.contracttype = found.comCd;
					}
				}
			});

			const params = {
				avc_COMMAND: 'BATCHCREATION_ST',
				saveList: updatedItems,
			};

			apiPostSaveMasterList(params).then((res: any) => {
				// gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
				// 	gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				// });
				// gridRef.current.setAllCheckedRows(false);
				// gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});

					const skuList = (updatedItems || [])
						.map((row: any) => {
							const r = row?.item ?? row;
							return (r?.sku ?? '').toString().trim();
						})
						.filter((s: string) => !!s);
					const skunameList = (updatedItems || [])
						.map((row: any) => {
							const r = row?.item ?? row;
							return (r?.skuname ?? '').toString().trim();
						})
						.filter((s: string) => !!s);

					// 중복 제거 (원본 순서 유지)
					const uniqueSkuList = Array.from(new Set(skuList));
					const uniqueSkunameList = Array.from(new Set(skunameList));

					const skuLine = uniqueSkuList.join(', ');
					const skunameLine = uniqueSkunameList.join(', ');

					props.form.setFieldValue('sku', skuLine);
					props.form.setFieldValue('skuName', skunameLine);

					modalExcelRef.current?.handlerClose();
					props.searchMasterListRun();
				}
			});
		});

		// 1. 팝업 닫고
		// 2. distcnt sku
		// 3. 조회

		// if (!updatedItems || updatedItems.length < 1) {
		// 	showAlert(null, t('msg.MSG_COM_VAL_020'));
		// 	return;
		// }

		// // validation
		// if (updatedItems.length > 0 && !gridRef.current.validateRequiredGridData()) {
		// 	return;
		// }

		// gridRef.current.showConfirmSave(() => {
		// 	const params = {
		// 		avc_COMMAND: 'BATCHCREATION_ST',
		// 		saveList: updatedItems,
		// 	};

		// 	apiPostSaveMasterList(params).then((res: any) => {
		// 		gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
		// 			gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
		// 		});
		// 		gridRef.current.setAllCheckedRows(false);
		// 		gridRef.current.resetUpdatedItems();

		// 		if (res.statusCode > -1) {
		// 			showMessage({
		// 				content: t('msg.MSG_COM_SUC_003'),
		// 				modalType: 'info',
		// 			});
		// 		}
		// 	});
		// });
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @param gridRef
	 * @returns {void}
	 */
	const saveMasterList = (gridRef?: any) => {
		// 1 변경 데이터 확인
		//const updatedItems = gridRef.current.getChangedData();

		// 2 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef?.current?.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (updatedItems.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		gridRef.current.showConfirmSave(() => {
			const params = {
				avc_COMMAND: 'BATCHCREATION_ST',
				saveList: updatedItems,
			};

			apiPostSaveMasterList(params).then((res: any) => {
				// gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
				// 	gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				// });
				// gridRef.current.setAllCheckedRows(false);
				// gridRef.current.resetUpdatedItems();

				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					props.searchMasterListRun();
				}
			});
		});
	};
	/**
	 * 그리드 신규 행 초기 값 설정
	 * @param rowIndex 행 인덱스
	 * @returns 그리드 신규 행 초기 값
	 */
	const gridInitValue: any = {
		docline: null,
		statusname: '임의등록',
		barcode: null,
		slipdt: null,
		slipno: null,
		slipline: null,
		rowStatus: 'I',
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref,
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					...gridInitValue,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'print', // print
			},
			{
				btnType: 'save', // 저장
				callBackFn: () => saveMasterList(ref),
			},
		],
	};

	//그리드 Props
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		showFooter: true,
	};

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	const initEvent = (gridRefCurrent: any) => {
		gridRefCurrent?.bind('ready', () => {
			gridRefCurrent?.setSelectionByIndex(0, 0);
		});
		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRefCurrent?.bind('cellEditBegin', (event: any) => {
			// 라벨출력수량 편집 허용
			if (event.dataField === 'printedqty') {
				return true;
			}

			// 신규 행만 편집 허용
			if (event.item.rowStatus === 'I') {
				return true;
			}

			return false;
		});

		gridRefCurrent?.bind('cellEditEnd', (event: any) => {
			if (['manufacturedt', 'expiredt', 'fromvaliddt', 'tovaliddt'].includes(event.dataField)) {
				const { rowIndex, dataField, headerText, value } = event;
				const { duration } = gridRefCurrent?.getGridData()[rowIndex];

				const { formattedDate, dayjsDate } = convertDatePickerInputToDayjs(value, 'date');

				if (!formattedDate) {
					showAlert(null, `${headerText} ${t('msg.typeValid')}`);
					gridRefCurrent?.setCellValue(rowIndex, dataField, null);
					return;
				}

				gridRefCurrent?.setCellValue(rowIndex, dataField, formattedDate);

				if (dataField === 'manufacturedt') {
					const expiredt = dayjsDate.add(duration - 1, 'day').format('YYYYMMDD');
					gridRefCurrent?.setCellValue(rowIndex, 'expiredt', expiredt);

					if (event.item.durationtype === '1') {
						gridRefCurrent?.setCellValue(rowIndex, 'lottable01', expiredt);
					} else if (event.item.durationtype === '2') {
						gridRefCurrent?.setCellValue(rowIndex, 'lottable01', formattedDate);
					} else {
						throw new Error('durationtype이 없습니다.');
					}
				}

				if (dataField === 'expiredt') {
					const manufacturedt = dayjsDate.subtract(duration - 1, 'day').format('YYYYMMDD');
					gridRefCurrent?.setCellValue(rowIndex, 'manufacturedt', manufacturedt);

					if (event.item.durationtype === '1') {
						gridRefCurrent?.setCellValue(rowIndex, 'lottable01', formattedDate);
					} else if (event.item.durationtype === '2') {
						gridRefCurrent?.setCellValue(rowIndex, 'lottable01', manufacturedt);
					} else {
						throw new Error('durationtype이 없습니다.');
					}
				}

				//TODO: durationtype이 없을 경우 select해와야함
			}
		});
	};

	const excelModalOpen = () => {
		modalExcelRef.current.handlerOpen();
	};

	const excelModalClose = () => {
		modalExcelRef.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	// 화면 초기 세팅
	useEffect(() => {
		initEvent(ref.current);
	}, []);

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
					<Button onClick={excelModalOpen}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={ref} name={gridId} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			<CustomModal ref={modalExcelRef} width="1000px">
				<StSkuLabelUploadExcelPopup
					title="상품이력번호등록"
					close={excelModalClose}
					gridCol={gridCol}
					gridProps={{ ...gridProps, editable: false }}
					gridInitValue={gridInitValue}
					saveMasterListPop={saveMasterListPop}
					saveMasterList={saveMasterList}
					gridExcelPopupRef={gridExcelPopupRef}
				/>
			</CustomModal>
		</>
	);
});
export default StSkuLabelDetail;
