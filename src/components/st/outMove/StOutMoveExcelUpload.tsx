/*
 ############################################################################
 # FiledataField	: StOutMoveExcelUpload.tsx
 # Description		:  엑셀 업로드 예제 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostExcelUpload } from '@/api/cm/apiCmExcel';
import { apiGetExcelValChk } from '@/api/st/apiStOutMove';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { round, toNumber } from 'lodash';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	gridProps?: any;
	setSepecCodeDetail?: any;
	dcCode: any;
	// callBack?: any;
}

const StOutMoveExcelUpload = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const refModal = useRef(null);
	const excelUploadFileRef = useRef(null);
	// 다국어
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const getTmcaclItmeCommonCodeList = () => {
		const list = getCommonCodeList('TM_CALC_ITEM');

		return list.filter(item => item.data1 === 'P' && item.data3 === 'Y');
		// return list;
	};
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;

		// return list;
	};
	const getCustOrderCloseTypeCommonCodeList = () => {
		// //console.log((getCommonCodeList('CUSTORDERCLOSETYPE', ''));
		//추후 공통 코드 추가 후 변경 예정(data1)
		return getCommonCodeList('VIHICLE_TYPE_CD');
	};
	const getCustOrderCloseTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('VIHICLE_TYPE_CD', value)?.cdNm;

		// return list;
	};
	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY', '공통', '');
	};
	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		// return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
		const list = getCommonCodeList('CARCAPACITY', '공통', null);
		const convert = list.map(item => ({
			...item,
			// display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		//console.log((convert);
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.cdNm : null;

		// return list;
	};
	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE');
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;

		// return list;
	};
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param value
	 * @returns
	 */
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('SUPPLY_DC');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		excelImport(e, 0, gridBtn.tGridRef, 1);
	};

	const onDataCheckClick = () => {
		// 변경 데이터 확인
		// const gpsList = gridRef1.current.getChangedData({ validationYn: false });
		const gpsList = gridRef1.current.getGridData();
		if (!gpsList || gpsList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (gpsList.length > 0 && !gridRef1.current.validateRequiredGridData()) {
			return;
		} else {
			const params = {
				// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
				fixDcCode: props.dcCode,
				dcCode: props.dcCode,
				saveList: gpsList,
			};
			gridRef1.current.clearGridData();
			apiGetExcelValChk(params).then((res: any) => {
				// gridRef.current.addRow(res.data);

				setGridData(res.data);
				gridRef1.current?.setGridData(res.data);

				gridRef1.current?.addCheckedRowsByValue('errCode', 'N');
				// setAvgChk(true);
			});
		}
	};
	/**
	 * 엑셀의 내용을 Dataset 에 import 한다.
	 * @param {any} e React.ChangeEvent<HTMLInputElement>
	 * @param {number} nSheetIdx 읽어올 엑셀의 sheet index ('0' base)
	 * @param {any} gridRef 타겟 그리드 Ref
	 * @param {number} nStartRow 읽어올 시작 row. (default = 1)
	 * @returns {void}
	 */
	const excelImport = (e: React.ChangeEvent<HTMLInputElement>, nSheetIdx: number, gridRef: any, nStartRow: number) => {
		const target = e.currentTarget;

		const file = target.files[0];

		if (file === undefined) {
			return;
		} else {
			// 칼럼의 계층형 최대 높이 구하기
			let depth = 1;
			const columnLayout = gridRef?.current?.getColumnLayout();
			const getColumnDepth = (columnLayoutList: any) => {
				columnLayoutList?.map((layout: any) => {
					if (layout.depth > depth) {
						depth = layout.depth;
					}

					if (commUtil.isNotEmpty(layout.children)) {
						getColumnDepth(layout.children);
					}
				});
			};
			getColumnDepth(columnLayout);

			// 그리드 자식들의 칼럼 Key 목록
			const columnKeyList: any[] = [];
			if (gridRef?.current?.props?.gridProps?.showRowNumColumn !== false) {
				// 로우 넘버링 유무에 따른 칼럼 추가
				columnKeyList.push('no');
			}
			const columnInfoList = gridRef?.current?.getColumnInfoList();
			columnInfoList?.map((columnInfo: any) => {
				columnKeyList.push(columnInfo.dataField);
			});

			const jsonData = { startRow: depth, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);

			const params = formData;

			for (const pair of params.entries()) {
			}
			gridRef?.current?.clearGridData();
			apiPostExcelUpload(params).then((res: any) => {
				if (res.statusCode == 0) {
					// gridRef.current?.addRow(res.data.rowsData);
					gridRef.current?.setGridData(res.data.rowsData);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);

					onDataCheckClick();
				}
			});
		}
	};
	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};
	const uploadSave = () => {
		const codeDtl = gridRef1.current.getGridData();

		const saveList1 = codeDtl.filter(item => item.errCode === 'N');

		if (saveList1.length == 0) {
			showAlert('', '데이터가 없습니다.');
			return;
		}
		let insertCount = 0;
		const updateCount = 0;
		let deleteCount = 0;

		saveList1?.forEach((item: any) => {
			switch (item.errCode) {
				case 'N':
					insertCount++;
					break;
				case 'U':
					insertCount++;
					break;
				case 'D':
					deleteCount++;
					break;
			}
		});

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`;
		showConfirm(
			null,
			messageWithRowStatusCount,
			() => {
				const saveList = { saveList: saveList1 };
				props.save(saveList1);
			},
			() => {
				return;
			},
		);
		const downloadExcel = () => {
			const params = {
				fileName: '마감주문반영목록',
				exportWithStyle: true, // 스타일 적용 여부
				progressBar: true, // 진행바 표시 여부
			};
			gridRef1.current.exportToXlsxGrid(params);
		};
		// //console.log(saveList);
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
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

			{
				btnType: 'save',
				callBackFn: () => {
					uploadSave();
				},
			},
		],
	};

	const extendedGridCol = [
		{ dataField: 'organize', headerText: '창고', editable: false },

		{ dataField: 'organizeName', headerText: '창고명', editable: false },
		{
			headerText: '재고위치',
			children: [
				{ dataField: 'stockType', headerText: '코드', editable: false }, // FROM_STOCKTYPE
				{ dataField: 'stockTypeName', headerText: '명칭', editable: false }, // STOCKTYPENAME
			],
		},

		{
			headerText: '재고속성',
			children: [
				{ dataField: 'stockGrade', headerText: '코드', editable: false }, // FROM_STOCKGRADE
				{ dataField: 'stockGradeName', headerText: '명칭', editable: false }, // STOCKGRADENAME
			],
		},

		{ dataField: 'loc', headerText: '로케이션', editable: false },
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef1.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{ dataField: 'storageType', headerText: '저장조건', editable: false },

		{
			headerText: '재고정보',
			children: [
				{ dataField: 'uom', headerText: '단위', editable: false },
				{ dataField: 'qty', headerText: '현재고수량', dataType: 'numeric', editable: false },
				{ dataField: 'qtyAllocated', headerText: '재고할당수량', dataType: 'numeric', editable: false },
				{ dataField: 'qtyPicked', headerText: '피킹재고', dataType: 'numeric', editable: false },
				{ dataField: 'posbQty', headerText: '이동가능수량', dataType: 'numeric', editable: false },
			],
		},

		{
			headerText: '환산재고',
			children: [
				{ dataField: 'avgweight', headerText: '평균중량', dataType: 'numeric', editable: false },
				{ dataField: 'calbox', headerText: '환산박스', dataType: 'numeric', editable: false },
				{ dataField: 'qtyperbox', headerText: '박스입수', dataType: 'numeric', editable: false },
				{ dataField: 'realBox', headerText: '실박스', dataType: 'numeric', editable: false },
			],
		},

		{
			headerText: '이동정보',
			children: [
				{
					dataField: 'toOrderqty',
					headerText: '이동수량',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: { type: 'number' },
				}, // TO_ORDERQTY
				{ dataField: 'uom', headerText: '단위', editable: false }, // UOM
				{ dataField: 'etcqty2', headerText: '작업박스수량', dataType: 'numeric', required: true, editable: false }, // etcqty2 → 작업 BOX 수량
			],
		},
		{ dataField: 'stockPrice', headerText: 'stockPrice', dataType: 'numeric', editable: false, visible: false },
		{
			dataField: 'storageFee',
			headerText: '보관료',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
				const qty = toNumber(item.toOrderQty);
				const price = toNumber(item.stockPrice);
				// NaN 방지: 둘 중 하나라도 NaN이면 0으로 처리
				const safeQty = isNaN(qty) ? 0 : qty;
				const safePrice = isNaN(price) ? 0 : price;
				return round(safeQty * safePrice, 2);
			},
		},

		{
			dataField: 'tranDeliveryPrice',
			headerText: '운송료(공급가)',
			dataType: 'numeric',
			// required: true,
			editable: true,
			editRenderer: { type: 'number' },
		},
		{
			dataField: 'deliveryFeeTaxExdc',
			headerText: '운송료(세엑)',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
				return round(item.tranDeliveryPrice * 0.1);
			},
		},
		{ dataField: 'taxCls', headerText: '세금코드', editable: false },

		{
			dataField: 'nearDurationYn',
			headerText: '소비기한임박여부',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lotTable01',
			headerText: '소비기준일(유통,제조)',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: '소비기한(잔여/전체)',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},

		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialNo', headerText: '이력번호', editable: false },
				{ dataField: 'barcode', headerText: '바코드', editable: false },
				{ dataField: 'convSerialNo', headerText: 'B/L번호', editable: false },
				// { dataField: 'butcheryDt', headerText: 'BUTCHERYDT' },
				// { dataField: 'factoryName', headerText: 'FACTORYNAME' },
				{ dataField: 'contractType', headerText: '계약유형', editable: false },
				{ dataField: 'contractCompany', headerText: '계약업체', editable: false },
				{ dataField: 'contractCompanyName', headerText: '계약업체명', editable: false },
				{ dataField: 'fromValidDt', headerText: '유효일자(FROM)', editable: false },
				{ dataField: 'toValidDt', headerText: '유효일자(TO)', editable: false },
			],
		},
		{ dataField: 'fromLot', headerText: '로트', editable: false, editRenderer: { type: 'text' } },
		{ dataField: 'fromStockid', headerText: '개체식별/유통이력', editable: false },
		{ dataField: 'fromArea', headerText: '작업구역', editable: false },
		{
			headerText: '이동사유',
			children: [
				{
					dataField: 'processmsg',
					headerText: '사유코드',
					editable: true,
					required: true,
					renderer: {
						// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
						type: 'DropDownListRenderer',
						list: getCommonCodeList('REASONCODE_OUTMV', ''),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
				},
				{ dataField: 'memo1', headerText: '사유내용', editable: true, required: true },
			],
		},

		{
			dataField: 'toOrganize',
			headerText: '창고',
			width: 109,
			dataType: 'text',
			required: true,
			editable: false,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;

					refModal.current.open({
						gridRef: gridRef1,
						rowIndex,
						customDccode: e.item.dcCode,
						codeName: e.value,
						dataFieldMap: {
							toOrganize: 'code',
							toOrganizeName: 'name',
						},
						popupType: 'organize',
					});
				},
			},
		},
		{ visible: true, dataField: 'toOrganizeName', headerText: '창고명', editable: false },
		{
			dataField: 'errMsg',
			headerText: '에러메시지',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'errCode',
			headerText: '에러코드',
			dataType: 'string',
			editable: false,
		},
		// { dataField: 'dcCode', headerText: 'DCCODE', visible: false },
		// // { dataField: 'fromStorerkey', headerText: 'fromStorerkey', visible: false },

		// { dataField: 'other05', headerText: 'other05', editable: false, visible: false },
		// { dataField: 'workNo', headerText: 'workNo', editable: false, visible: false },
		// { dataField: 'boxflag', headerText: 'boxflag', editable: false, visible: false },
		// { dataField: 'duration', headerText: 'duration', editable: false, visible: false },
		// { dataField: 'durationType', headerText: 'durationType', editable: false, visible: false },
	];
	const gridProps = {
		editable: true,

		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableMovingColumn: false,
		// rowIdField: '_$uid',
		// isLegacyRemove: true,
	};
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="외부비축센터간이동 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* <Button onClick={onDataCheckClick}>{'유효성검증'}</Button> */}
				</GridTopBtn>
				<AUIGrid ref={gridRef1} columnLayout={extendedGridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 파일 업로드 INPUT 영역 */}
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

export default StOutMoveExcelUpload;
