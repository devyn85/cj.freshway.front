/*
 ############################################################################
 # FiledataField	: StDisuseRequeStExDCDetail.tsx
 # Description		: 저장위치정보 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib
import { Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// api

// util

// hook

// type
import { GridBtnPropsType } from '@/types/common';

// asset
import { apiSaveDisuseRequestList } from '@/api/st/apiStDisuseRequeStExDC';
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { Button, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

interface StDisuseRequestExDCReqeustDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
	initialValues: any;
	detailForm: any;
	onSaveCallback: (data: any[]) => void;
}

const StDisuseRequestExDCReqeustDetail = forwardRef((props: StDisuseRequestExDCReqeustDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();
	const refModal = useRef(null);
	const excelInputRef = useRef(null);

	//마스터 그리드 생성시 필요한 변수들
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			width: 80,
			dataType: 'code',
			editable: false,
		},
		{ dataField: 'organize', headerText: '창고', width: 80, dataType: 'code', editable: false },
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), // 창고명
			width: 200,
			dataType: 'string',
			editable: false,
		},
		{
			headerText: '재고위치',
			children: [
				{ dataField: 'stocktype', headerText: '코드', width: 80, dataType: 'code', visible: false, editable: false },
				{ dataField: 'stocktypenm', headerText: '명칭', width: 80, dataType: 'code', visible: false, editable: false },
			],
		},
		{ dataField: 'stockgrade', headerText: '코드', width: 80, dataType: 'code', visible: false, editable: false },
		{ dataField: 'stockgradename', headerText: '재고속성', width: 80, dataType: 'code', editable: false },
		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', width: 80, dataType: 'code', editable: false },
				{ dataField: 'skuname', headerText: '상품명', width: 320, dataType: 'text', editable: false },
			],
		},
		{
			dataField: 'uom',
			headerText: '단위',
			width: 80,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: '입수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'qty',
			headerText: '현재고수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'openqty',
			headerText: '가용재고수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'qtyallocated',
			headerText: '재고할당수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'qtypicked',
			headerText: '피킹재고',
			width: 100,
			dataType: 'numeric',
			editable: false,
			visible: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'boxflag',
			headerText: '박스여부',
			width: 100,
			dataType: 'code',
			visible: false,
		},
		{
			dataField: 'tranqty',
			headerText: '조정수량',
			width: 100,
			dataType: 'numeric',
			required: true,
			formatString: '#,##0.###',
		},
		{
			dataField: 'disusetype',
			headerText: '폐기유형',
			width: 120,
			dataType: 'code',
			required: true,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DISUSETYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'reasoncode',
			headerText: '발생사유',
			width: 120,
			dataType: 'code',
			required: true,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeListByData('REASONCODE_DISUSE', null, null, null, '2170', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			headerText: '박스환산정보',
			children: [
				{
					dataField: 'avgweight',
					headerText: '평균중량',
					width: 80,
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'calbox',
					headerText: '환산박스',
					width: 80,
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{ dataField: 'realorderbox', headerText: '실박스예정', width: 80, dataType: 'numeric', editable: false },
				{ dataField: 'realcfmbox', headerText: '실박스확정', width: 80, dataType: 'numeric', editable: false },
				{
					dataField: 'tranbox',
					headerText: '작업박스수량',
					width: 80,
					dataType: 'numeric',
					editable: true, // 필수
					styleFunction: (rowIndex: number, columnIndex: number, value: any, item: any) => {
						const styles: any = {
							textAlign: 'right',
						};

						if (item.boxflag === 'Y') {
							styles.background = 'var(--aui-user12)'; // AUIGrid에 등록된 user12 색상
						}

						return styles;
					},
					editRenderer: {
						type: 'NumberEditRenderer',
						onlyNumeric: true,
						limitDecimal: 0, // 소수점 입력 제한
					},
				},
			],
		},
		{
			headerText: t('lbl.COSTCENTER'), //귀속부서
			children: [
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'), //귀속부서
					width: 109,
					dataType: 'code',
					editable: true,
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								costcd: 'code',
								costcdname: 'name',
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									costcd: 'code',
									costcdname: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), //귀속부서명
					width: 156,
					dataType: 'text',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CUST'), //거래처
			children: [
				{
					dataField: 'custkey',
					headerText: t('lbl.CUST_CODE'), //거래처
					dataType: 'code',
					editable: true,
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								custkey: 'code',
								custname: 'name',
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									custkey: 'code',
									custname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
				},
				{
					dataField: 'custname',
					headerText: t('lbl.CUST_NAME'), //거래처명
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: '유통기한임박여부',
			width: 140,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lottable01',
			headerText: '기준일(유통/제조)',
			width: 140,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '유통기간(잔여/전체)',
			dataField: 'durationTerm',
			width: 140,
			dataType: 'code',
			editable: false,
		},
		{ dataField: 'zone', headerText: '피킹존', width: 80, dataType: 'code', visible: false, editable: false },
		{ dataField: 'loc', headerText: '로케이션', width: 80, dataType: 'code', visible: false, editable: false },

		// {
		// 	dataField: 'imputetype',
		// 	headerText: '귀책',
		// 	width: 80,
		// 	dataType: 'text',
		// 	required: true,
		// 	renderer: {
		// 		// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('OTHER01_DMD', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },
		// {
		// 	dataField: 'processmain',
		// 	headerText: '물류귀책배부',
		// 	width: 80,
		// 	dataType: 'text',
		// 	required: true,
		// 	renderer: {
		// 		// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('YN', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },

		{
			headerText: '상품이력정보',
			children: [
				{
					dataField: 'serialno',
					headerText: '이력번호',
					width: 120,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: '바코드',
					width: 140,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: 'B/L번호',
					width: 140,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'butcherydt',
					headerText: '도축일자',
					width: 120,
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: '도축장',
					width: 120,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: '계약유형',
					width: 120,
					dataType: 'code',
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return getCommonCodebyCd('CONTRACTTYPE_SN', value)?.cdNm;
					},
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: '계약업체',
					width: 140,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: '계약업체명',
					width: 160,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: '유효일자(From)',
					width: 120,
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: '유효일자(To)',
					width: 120,
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'lot',
			headerText: 'LOT',
			width: 120,
			dataType: 'text',
			editable: false,
			visible: false,
		},
		{
			dataField: 'stockid',
			headerText: 'STOCKID',
			width: 120,
			dataType: 'text',
			editable: false,
			visible: false,
		},
		{
			dataField: 'area',
			headerText: 'AREA',
			width: 120,
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// AUIGrid 옵션
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		ref.gridRef?.current.bind('afterValueChanged', (evt: any) => {
			const col = evt.column?.dataField;
			const { rowIndex, newValue, item } = evt;

			if (col === 'tranqty' && item.boxflag !== 'D') {
				// TRANQTY 값 변경 시
				const avgWeight = Number(item.avgWeight) || 0;
				if (!newValue || Number(newValue) <= 0) {
					ref.gridRef.current.setCellValue(rowIndex, 'TRANQTY', '0');
					ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', '0');
				} else {
					const weight = avgWeight > 0 ? avgWeight : 1;
					const calculatedBox = Math.ceil(Number(newValue) / weight);
					const finalBox = Number(newValue) > 0 && calculatedBox < 1 ? 1 : calculatedBox;
					ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', finalBox.toString());
				}
			}

			if (col === 'tranbox' && item.boxflag !== 'D') {
				if (!newValue || Number(newValue) <= 0) {
					ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', '0');
				}
			}
		});
		ref.gridRef?.current.bind('cellEditBegin', (evt: any) => {
			const col = evt.dataField;
			const { rowIndex, newValue, item } = evt;
			if (col === 'tranbox') {
				if (item.boxflag === 'Y') {
					return true; // boxflag가 Y면 편집 허용
				} else {
					return false; // 그 외는 편집 금지
				}
			}
			return true;
		});
	};
	// 1) 박스환산 재계산 함수 분리
	const calc_boxconversionbyTransQty = (rowIndex: number, newQty: number, rowData: any) => {
		if (rowData.BOXFLAG === 'D') return;

		const avgWeight = Number(rowData.AVGWEIGHT) || 0;
		const qty = Number(newQty) || 0;

		if (qty <= 0) {
			ref.gridRef.current?.setCellValue(rowIndex, 'TRANQTY', '0');
			ref.gridRef.current?.setCellValue(rowIndex, 'TRANBOX', '0');
			return;
		}

		if (rowData.BOXFLAG === 'Y' && avgWeight > 0) {
			const calculatedBox = qty / avgWeight;
			if (calculatedBox < 1) {
				ref.gridRef.current?.setCellValue(rowIndex, 'TRANBOX', '1');
			} else {
				ref.gridRef.current?.setCellValue(rowIndex, 'TRANBOX', Math.round(calculatedBox).toString());
			}
		}
	};
	const calc_boxconversionbyTranBox = (rowIndex: number, newBox: number, rowData: any) => {
		if (rowData.BOXFLAG === 'D') return;

		const box = Number(newBox) || 0;

		if (box <= 0) {
			ref.gridRef.current?.setCellValue(rowIndex, 'TRANBOX', '0');
		}
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			props.detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 폐기 요청 저장
	 */
	const saveCallback = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		// 그리드 validation 체크
		if (!ref.gridRef?.current.validateRequiredGridData()) {
			showAlert(null, t('msg.requiredInputNoArg'));
			return;
		}

		const isValid = await validateForm(props.detailForm);
		if (!isValid) {
			return;
		}

		showConfirm(null, '저장하시겠습니까?', () => {
			const formdata = props.form.getFieldsValue();
			const detailFormData = props.detailForm.getFieldsValue();

			const params = {
				saveRequestList: checkedRows,
				...formdata,
				...detailFormData,
				apprreqdt: dayjs(detailFormData.apprreqdt).format('YYYYMMDD'),
			};
			apiSaveDisuseRequestList(params).then(res => {
				if (res.data && res.data.errorCode != '-1') {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장 성공 메시지
						modalType: 'success',
					});
					// 저장 후 콜백 함수 호출
					props.onSaveCallback(res.data);
				}
			});
		});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 선택적용
				// callBackFn: applySelectedDataCallback,
				callBackFn: async () => {
					const grid = ref.gridRef.current;
					// TODO: form validation 체크
					const isValid = await validateForm(props.detailForm);
					if (!isValid) {
						return;
					}
					const formValues = props.detailForm.getFieldsValue();

					if (!grid) return;

					const checkedRows = grid.getCheckedRowItems(); // 체크된 행들

					if (!checkedRows || checkedRows.length === 0) {
						alert('선택된 항목이 없습니다.');
						return;
					}

					// 체크된 각 행에 대해 detailForm 값 덮어쓰기
					checkedRows.forEach((rowItem: { rowIndex: number; item: any }) => {
						const { rowIndex, item } = rowItem;

						const newRowData = {
							...item,
							...formValues,
							apprreqdt: dayjs(formValues.apprreqdt).format('YYYYMMDD'),
						};

						grid.updateRow(newRowData, rowIndex);
					});
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
	};

	/**
	 * 엑셀 업로드 버튼 클릭 이벤트
	 */
	const excelUpload = () => {
		excelInputRef.current?.click();
	};

	/**
	 * 엑셀 데이터 업로드 이벤트
	 * @param data
	 */
	const onDataExcel = (data: any) => {
		// 현재 그리드 데이터

		ref.gridRef.current.clearGridData();
		const newRow: any = {};

		if (data === undefined || data.length < 1) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}

		// 그리드 컬럼 헤더 정보 가져옴.
		const dataFieldsWithMeta = ref.gridRef.current.getColumnInfoList().map((col: any, index: number) => ({
			index,
			dataField: col.dataField,
		}));

		// 그리드 데이터 생성
		const excelGridData = data.map((row: any) => {
			const newRow: any = {};
			let excelIndex = 1;

			// 엑셀 데이터와 그리드 컬럼 매칭
			dataFieldsWithMeta.forEach(({ dataField }: { dataField: string }) => {
				if (dataField === 'boxflag') {
					newRow[dataField] = 'Y';
				} else {
					newRow[dataField] = row[excelIndex];
				}
				excelIndex++;
			});

			// boxflag 계산
			const requiredFields = ['dccode', 'loc', 'sku', 'uom', 'lot', 'stockid', 'stockgrade', 'stocktype'];
			const isMissingRequired = requiredFields.some(field => !newRow[field] || newRow[field] === '');
			const tranqty = Number(newRow.tranqty);

			if (isMissingRequired) {
				newRow.boxflag = 'D';
			} else if (tranqty > 0) {
				newRow.boxflag = 'Y';
			} else {
				newRow.boxflag = ''; // 또는 'N'
			}

			return newRow;
		});

		ref.gridRef.current.setGridData(excelGridData);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useImperativeHandle(ref, () => ({
		resetDetail: () => {
			props.detailForm.resetFields();
			ref.gridRef.current.clearGridData();
		},
		isChangeForm: () => props.detailForm.getFieldValue('rowStatus') === 'U',
	}));

	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
		ref.gridRef?.current.resize(1700, 240);
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('disusetype', { width: 120 });
				gridRefCur.setColumnPropByDataField('reasoncode', { width: 135 });
				gridRefCur.setColumnPropByDataField('costcd', { width: 115 });
				gridRefCur.setColumnPropByDataField('costcdname', { width: 215 });
				gridRefCur.setColumnPropByDataField('custkey', { width: 110 });
				gridRefCur.setColumnPropByDataField('custname', { width: 250 });
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="h-auto">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt}>
					<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<UiDetailViewArea>
					<Form form={props.detailForm} onValuesChange={onValuesChange} initialValues={props.initialValues}>
						<UiDetailViewGroup className="grid-column-4">
							<li>
								<DatePicker
									name="apprreqdt"
									label={t('lbl.APPROVALREQDT')} // 결재요청일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="disusetype"
									span={24}
									options={getCommonCodeList('DISUSETYPE', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={'폐기유형'}
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={getCommonCodeListByData('REASONCODE_DISUSE', null, null, null, '2170', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={t('lbl.INQUIRYREASONCODE')} // 발생사유
								/>
							</li>
							<li>
								<CmCostCenterSearch
									form={props.detailForm}
									selectionMode="singleRow"
									name="costcdname"
									code="costcd"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<CmCustSearch
									form={props.detailForm}
									selectionMode="singleRow"
									name="custname"
									code="custkey"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<CmCustSearch
									form={props.detailForm}
									selectionMode="singleRow"
									name="wdCustname"
									code="wdCust"
									selectedCode={'100000'}
									customDccode={'1000'}
									returnValueFormat="name"
									required
									label={t('lbl.DELIVERY_WHO')} // 출고자
								/>
							</li>
							<li>
								<SelectBox
									name="wdmethod"
									span={24}
									options={getCommonCodeList('DELIVERYTYPE_FS', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={t('lbl.DELIVERY_TYPE')} // 출고방법
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<InputText
									name="wdMemo"
									label={t('lbl.WD_DOC_MEMO')} // 출고증 비고
								/>
							</li>
							<li>
								<InputText
									name="reasonmsg"
									placeholder="처리사유 입력하세요."
									label={t('lbl.PROCESSREASON_ETC')} // 처리사유
								/>
							</li>
							{/* <li>
								<SelectBox
									name="other01dmd"
									span={24}
									options={getCommonCodeList('OTHER01_DMD', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={'귀책'}
								/>
							</li>
							<li>
								<SelectBox
									name="other05dmd"
									span={24}
									options={getCommonCodeList('YN', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={'물류귀책배부'}
								/>
							</li> */}
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
				<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} />
		</>
	);
});

export default StDisuseRequestExDCReqeustDetail;
