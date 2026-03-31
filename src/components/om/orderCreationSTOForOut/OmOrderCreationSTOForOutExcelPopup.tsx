/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForOutExcelPopup.tsx
 # Description		: 외부센터보충발주 - 엑셀 업로드 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import dayjs from 'dayjs';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// API Call Function
import { apiPostSaveExcelList, apiPostValidateExcel } from '@/api/om/apiOmOrderCreationSTOForOut';

interface PropsType {
	close?: any;
	fromDccode?: string;
	toDccode?: string;
	deliverydate?: any;
	searchForm?: any;
}

const OmOrderCreationSTOForOutExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, fromDccode, toDccode, deliverydate } = props;

	// 다국어
	const { t } = useTranslation();

	// 그리드 Ref
	const gridRef = useRef(null);

	// 업로드 파일 Ref
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			dataField: 'organizeName',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			headerText: t('lbl.TO_STOCKTYPE'), //재고위치
			children: [
				{
					dataField: 'fromStocktype',
					headerText: t('lbl.CODE'), //코드
					dataType: 'code',
					editable: false,
					required: true,
				},
				{
					dataField: 'stocktypename',
					headerText: t('lbl.DESCR'), //명칭
					editable: false,
					required: true,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), //재고속성
			children: [
				{
					dataField: 'fromStockgrade',
					headerText: t('lbl.CODE'), //코드
					dataType: 'code',
					editable: false,
					required: true,
				},
				{
					dataField: 'stockgradename',
					headerText: t('lbl.DESCR'), //명칭
					editable: false,
					required: true,
				},
			],
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'), //로케이션
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			headerText: t('lbl.STOCKINFO_WD'), //재고정보
			children: [
				{
					dataField: 'uom',
					headerText: t('lbl.UOM'), //단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'), //현재고수량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'boxqty',
					headerText: t('lbl.BOXQTY'), //박스수량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'), //재고할당수량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'), //피킹재고
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.POSBQTY'), //이동가능수량
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPEROUTBOX'), //박스입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stbox',
			headerText: t('lbl.STBOX'), //현재고박스환산
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'line02',
			headerText: t('lbl.STDWEIGHT'), //표준중량
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.MOVEINFO'), //이동정보
			children: [
				{
					dataField: 'toOrderqty',
					headerText: t('lbl.TOORDERQTY'), //이동수량
					dataType: 'numeric',
					editable: false,
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: false,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
					required: true,
				},
				{
					dataField: 'purchaseuom',
					headerText: t('lbl.PURCHASEUOM_WD'), //발주단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'etcqty2',
					headerText: t('lbl.BOXQTY'), //박스수량
					dataType: 'numeric',
					editable: true,
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: any,
					) => {
						if (item.boxflag === 'Y') {
							return 'isEdit';
						}
						gridRef.current.removeEditClass(columnIndex);
					},
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: true,
						allowNegative: false,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.MOVEBOXINFO'), //이동수량박스환산정보
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'calbox',
					headerText: t('lbl.CALBOX'), //환산박스
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'realorderbox',
					headerText: t('lbl.REALOPENBOX'), //실박스예정
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			dataField: 'usebydateFreeRt',
			headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여율
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), //계약유형
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), //계약업체명
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			dataField: 'fromLot',
			headerText: t('lbl.LOT'), //로트
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromStockid',
			headerText: t('lbl.STOCKID'), //개체식별/유통이력
			editable: false,
		},
		{
			dataField: 'fromArea',
			headerText: t('lbl.AREA'), //작업구역
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'memo1',
			headerText: t('lbl.MEMO1'), //비고
			width: 200,
			editable: false,
		},
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
		{
			dataField: 'storerkey', //고객사코드
			visible: false,
		},
		{
			dataField: 'boxCal', //박스단위환산
			visible: false,
		},
		{
			dataField: 'boxflag', //박스처리유무
			visible: false,
		},
		{
			dataField: 'stockgrade', //재고속성
			visible: false,
		},
		{
			dataField: 'stockid', //개체식별/유통이력
			visible: false,
		},
		{
			dataField: 'area',
			visible: false,
		},
		{
			dataField: 'lot',
			visible: false,
		},
		{
			dataField: 'stocktype',
			visible: false,
		},
		{
			dataField: 'fromDccode',
			visible: false,
		},
		{
			dataField: 'fromStorerkey',
			visible: false,
		},
		{
			dataField: 'fromOrganize',
			visible: false,
		},
		{
			dataField: 'fromSku',
			visible: false,
		},
		{
			dataField: 'fromLoc',
			visible: false,
		},
		{
			dataField: 'fromOrderqty',
			visible: false,
		},
		{
			dataField: 'fromUom',
			visible: false,
		},
		{
			dataField: 'toCccode',
			visible: false,
		},
		{
			dataField: 'toStorerkey',
			visible: false,
		},
		{
			dataField: 'toArea',
			visible: false,
		},
		{
			dataField: 'toSku',
			visible: false,
		},
		{
			dataField: 'toLoc',
			visible: false,
		},
		{
			dataField: 'toLot',
			visible: false,
		},
		{
			dataField: 'toStockid',
			visible: false,
		},
		{
			dataField: 'toStockgrade',
			visible: false,
		},
		{
			dataField: 'toStocktype',
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'ectqty1',
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/*
	 * 엑셀 양식 다운로드
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '외부창고▶물류센터STO_양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};

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
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const checkedItems = gridRef.current.getGridData();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (gridRef.current.validateRequiredGridData()) {
			gridRef.current.clearGridData();
			const searchParams = props.searchForm.getFieldsValue();
			const params = {
				sku: searchParams.skuCode,
				storagetype: searchParams.storagetype,
				deliverydate: dayjs(searchParams.deliverydate).format('YYYYMMDD'),
				fromDccode: searchParams.fromDccode,
				toDccode: searchParams.toDccode,
				serialno: searchParams.serialno,
				blno: searchParams.blno,
				contractcompany: searchParams.contractcompany,
				organize: searchParams.organize,
				saveList: checkedItems,
			};

			apiPostValidateExcel(params).then((res: any) => {
				if (res.status == 200) {
					gridRef.current?.addRow(res.data.data);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);
				}
			});
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
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

		// 저장하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			if (!checkedItems || checkedItems.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_010'), () => {
					return;
				});
			} else {
				if (props.fromDccode === props.toDccode) {
					showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
					return;
				}

				const targetList: Record<string, any>[] = [];

				// 그리드 입력 값 검증
				for (const row of checkedItems) {
					const item = row.item;
					const req = item.toOrderqty;
					const box = item.etcqty2;
					const boxflag = item.boxflag;

					if (commUtil.isEmpty(item.serialno)) {
						const msg = '이력정보가 존재하지 않는 재고에 대해 이체오더를 생성할 수 없습니다.';
						showMessage({
							content: msg,
							modalType: 'warning',
						});
						return;
					} else if (req <= 0) {
						const msg = '이동수량을 입력하세요.';
						showMessage({
							content: msg,
							modalType: 'warning',
						});
						return;
					} else if (req > item.posbqty) {
						const msg = '이동가능수량 까지만 이체요청을 할 수 있습니다.';
						showMessage({
							content: msg,
							modalType: 'warning',
						});
						return;
					} else if (box <= 0 && item.boxflag === 'Y') {
						const msg = '박스수량을 입력하세요.';
						showMessage({
							content: msg,
							modalType: 'warning',
						});
						return;
					}

					if (req > 0) {
						const dsTarget = {
							fromStorerkey: item.storerkey,
							fromDccode: props.fromDccode,
							fromOrganize: item.fromOrganize,
							fromArea: '1000',
							fromSku: item.sku,
							fromUom: item.uom,
							fromStockgrade: item.fromStockgrade,
							fromStocktype: item.fromStocktype,
							fromStockid: item.stockid,
							fromLoc: item.loc,
							fromLot: item.fromLot,
							serialno: item.serialno,
							toStorerkey: item.storerkey,
							toDccode: props.toDccode,
							toOrganize: props.toDccode,
							toArea: '1000',
							toSku: item.sku,
							toUom: item.uom,
							toStockgrade: item.stockgrade,
							toStockid: item.stockid,
							toStocktype: item.fromStocktype,
							toOrderqty: req,
							memo1: item.memo1,
							etcqty2: boxflag === 'Y' ? item.etcqty2 : 0,
						};

						targetList.push(dsTarget);
					} else if (req < 0) {
						const msg = '음수값은 지정할 수 없습니다.';
						showMessage({
							content: msg,
							modalType: 'warning',
						});
						return;
					}
				}

				if (!gridRef.current.validateRequiredGridData()) {
					return;
				}

				const params = {
					avc_DCCODE: props.fromDccode,
					avc_COMMAND: 'CONFIRM',
					fromDccode: props.fromDccode,
					toDccode: props.toDccode,
					deliverydate: props.deliverydate.format('YYYYMMDD'),
					saveList: targetList,
				};

				apiPostSaveExcelList(params).then(res => {
					if (res.statusCode === 0) {
						showAlert(null, t('msg.MSG_COM_SUC_003'));
					}
				});
			}
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelForm',
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},

			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */
	/**
	 * 초기화
	 */
	useEffect(() => {}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="외부창고 ▶ 물류센터 STO 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>{t('lbl.EXCELFORM')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>

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

export default OmOrderCreationSTOForOutExcelPopup;
