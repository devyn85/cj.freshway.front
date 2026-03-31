/*
 ############################################################################
 # FiledataField	: StAdjustmentRequeStExDCDetail.tsx
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
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// asset
import { apiSaveAdjustmentRequestList } from '@/api/st/apiStAdjustmentRequeStExDC';
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { Button, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';
import dateUtil from '@/util/dateUtil';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

interface StAdjustmentRequestExDCReqeustDetailProps {
	data: any;
	totalCnt: any;
	callBackFn: any;
	form: any;
	detailForm: any;
	onSaveCallback: (data: any[]) => void;
}

const StAdjustmentRequestExDCReqeustDetail = forwardRef(
	(props: StAdjustmentRequestExDCReqeustDetailProps, ref: any) => {
		/**
		 * =====================================================================
		 *	01. 변수 선언부
		 * =====================================================================
		 */
		const { t } = useTranslation();

		const today = dayjs(dateUtil.getToDay('YYYY-MM-DD'));

		// grid Ref
		ref.gridRef = useRef();
		const refModal = useRef(null);
		const initValues = {
			rowStatus: 'I',
			apprreqdt: today,
		};
		const excelInputRef = useRef(null);
		const [approvalInfoOpen, setApprovalInfoOpen] = useState(false);

		//마스터 그리드 생성시 필요한 변수들
		const gridId = uuidv4() + '_gridWrap';
		const gridCol = [
			{ dataField: 'dccode', headerText: '물류센터', width: 80, editable: false },
			{ dataField: 'organize', headerText: '창고', width: 80, editable: false },
			{
				headerText: '재고위치',
				children: [
					{ dataField: 'stocktype', headerText: '코드', width: 80, editable: false },
					{ dataField: 'stocktypenm', headerText: '명칭', width: 80, editable: false },
				],
			},
			{
				headerText: '재고속성',
				children: [
					{ dataField: 'stockgrade', headerText: '코드', width: 80, editable: false },
					{ dataField: 'stockgradename', headerText: '명칭', width: 80, editable: false },
				],
			},
			{ dataField: 'zone', headerText: '피킹존', width: 80, editable: false },
			{ dataField: 'loc', headerText: '로케이션', width: 80, editable: false },
			{
				headerText: '상품정보',
				children: [
					{ dataField: 'sku', headerText: '상품코드', width: 80, editable: false },
					{ dataField: 'skuname', headerText: '상품명칭', width: 320, editable: false },
				],
			},
			{ dataField: 'uom', headerText: '단위', width: 80, editable: false },
			{ dataField: 'qtyperbox', headerText: '입수량', width: 80, dataType: 'numeric', editable: false },
			{ dataField: 'qty', headerText: '현재고수량', width: 80, dataType: 'numeric', editable: false },
			{ dataField: 'openqty', headerText: '가용재고수량', width: 80, dataType: 'numeric', editable: false },
			{ dataField: 'qtyallocated', headerText: '재고할당수량', width: 80, dataType: 'numeric', editable: false },
			//	{ dataField: 'qtypicked', headerText: '피킹재고', width: 80, dataType: 'numeric', editable: false },
			{
				dataField: 'tranqty',
				headerText: '조정수량',
				width: 80,
				dataType: 'numeric',
				editable: true,
				required: true,
				editRenderer: {
					type: 'InputEditRenderer',
					onlyInteger: true, // 정수만 입력
					allowNegative: true,
					// min: 0, // 최소값 제한
					// max: 9999, // 최대값 제한
				},
			},
			{
				dataField: 'reasoncode',
				headerText: '발생사유',
				width: 200,
				editable: true,
				required: true,
				renderer: {
					type: 'DropDownListRenderer',
					list: getCommonCodeListByData('REASONCODE_AJAJ', null, null, null, '2170', ''),
					keyField: 'comCd',
					valueField: 'cdNm',
				},
			},
			{
				headerText: '박스환산정보',
				children: [
					{ dataField: 'avgweight', headerText: '평균중량', width: 80, dataType: 'numeric', editable: false },
					{ dataField: 'calbox', headerText: '환산박스', width: 80, dataType: 'numeric', editable: false },
					{ dataField: 'realorderbox', headerText: '실박스예정', width: 80, dataType: 'numeric', editable: false },
					{ dataField: 'realcfmbox', headerText: '실박스확정', width: 80, dataType: 'numeric', editable: false },
					{
						dataField: 'tranbox',
						headerText: '작업박스수량',
						width: 80,
						dataType: 'numeric',
						editable: true,
						required: true,
						editRenderer: {
							type: 'InputEditRenderer',
							onlyInteger: true, // 정수만 입력
							allowNegative: true, // 음수 입력 허용
							// min: 0, // 최소값 제한
							// max: 9999, // 최대값 제한
						},
					},
				],
			},
			// {
			// 	dataField: 'other01Dmd',
			// 	headerText: '귀책',
			// 	width: 80,
			// 	editable: true,
			// 	required: true,
			// 	renderer: {
			// 		type: 'DropDownListRenderer',
			// 		list: getCommonCodeListByData('OTHER01_DMD_AJ', null, null, null, null, ''),
			// 		keyField: 'comCd',
			// 		valueField: 'cdNm',
			// 	},
			// },
			// {
			// 	dataField: 'other05Dmd',
			// 	headerText: '물류귀책배부',
			// 	width: 80,
			// 	editable: true,
			// 	required: true,
			// 	renderer: {
			// 		type: 'DropDownListRenderer',
			// 		list: getCommonCodeListByData('OTHER05_DMD_AJ', null, null, null, null, ''),
			// 		keyField: 'comCd',
			// 		valueField: 'cdNm',
			// 	},
			// },
			{
				headerText: '귀속부서',
				children: [
					{
						dataField: 'costcd',
						headerText: '귀속부서',
						width: 109,
						dataType: 'text',
						required: true,
						editable: true,
						commRenderer: {
							type: 'search',
							onClick: function (e: any) {
								refModal.current.open({
									gridRef: ref.gridRef,
									rowIndex: e.rowIndex,
									dataFieldMap: { costcd: 'code', costcdname: 'name' },
									popupType: 'costCenter',
								});
							},
						},
					},
					{ dataField: 'costcdname', headerText: '귀속부서명', width: 156, dataType: 'text', editable: false },
				],
			},
			{
				headerText: '거래처',
				children: [
					{
						dataField: 'custkey',
						headerText: '거래처',
						width: 109,
						dataType: 'text',
						required: true,
						editable: true,
						commRenderer: {
							type: 'search',
							onClick: function (e: any) {
								refModal.current.open({
									gridRef: ref.gridRef,
									rowIndex: e.rowIndex,
									dataFieldMap: { custkey: 'code', custname: 'name' },
									popupType: 'cust',
								});
							},
						},
					},
					{ dataField: 'custname', headerText: '거래처명', width: 156, dataType: 'text', editable: false },
				],
			},
			{ dataField: 'neardurationyn', dataType: 'code', headerText: '유통기한임박여부', width: 100, editable: false },
			{ dataField: 'lottable01', headerText: '기준일(유통,제조)', width: 100, editable: false },
			{ dataField: 'durationTerm', headerText: '유효기간(잔여/전체)', width: 100, editable: false },
			{
				headerText: '상품이력정보',
				children: [
					{ dataField: 'serialno', headerText: '이력번호', width: 180, editable: false },
					{ dataField: 'barcode', headerText: '바코드', width: 220, editable: false },
					{ dataField: 'convserialno', headerText: 'B/L번호', width: 180, editable: false },
					{
						dataField: 'contracttype',
						headerText: '계약유형',
						width: 80,
						editable: false,
						labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
							return getCommonCodebyCd('CONTRACTTYPE_SN', value)?.cdNm;
						},
					},
					{ dataField: 'contractcompany', headerText: '계약업체', width: 80, editable: false },
					{ dataField: 'contractcompanyname', headerText: '계약업체명', width: 150, editable: false },
				],
			},
			{ dataField: 'lot', headerText: 'LOT', width: 80, editable: false, visible: false },
			{ dataField: 'stockid', headerText: 'STOCKID', width: 80, editable: false, visible: false },
			{ dataField: 'area', headerText: 'AREA', width: 80, editable: false, visible: false },
			{ dataField: 'other03', headerText: 'OTHER03', width: 0, editable: false, visible: false },
			{ dataField: 'boxflag', headerText: 'boxflag', width: 0, editable: false, visible: false },
		];

		// AUIGrid 옵션
		const gridProps = {
			editable: true,
			//editBeginMode: 'doubleClick',
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
			enableFilter: true,
		};

		// DETAIL VIEW 상단 버튼 설정
		const setTableBtn = (): TableBtnPropsType => ({
			tGridRef: ref.gridRef,
			btnArr: [
				{
					btnType: 'save',
					btnLabel: '적용',
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
							showAlert(null, t('msg.MSG_COM_VAL_020'));
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

						showAlert(null, t('msg.MSG_COM_SUC_018'), () => {
							setApprovalInfoOpen(false);
						});
					},
				},
			],
		});
		/**
		 * =====================================================================
		 *	02. 함수 선언부
		 * =====================================================================
		 */

		/**
		 * 그리드 이벤트 초기화
		 */
		const initEvent = () => {
			ref.gridRef?.current.bind('beforeBeginEdit', (evt: any) => {
				// 클릭된 컬럼의 dataField (colid) 확인
				const col = evt.column?.dataField;
				const rowIndex = evt.rowIndex;

				// 예: 'costcd' 컬럼 클릭 시 팝업 띄우기
				if (col === 'costcd') {
					const rowData = ref.gridRef?.current.getRowData(rowIndex);
					refModal.current?.handlerOpen();
					return false;
				}

				// 다른 컬럼들을 추가로 체크하고 싶으면 else if...
			});
			ref.gridRef?.current.bind('cellEditEnd', (evt: any) => {
				const col = evt.column?.dataField;
				const { rowIndex, newValue, item } = evt;

				if (col === 'tranqty' && item.boxflag !== 'D') {
					// TRANQTY 값 변경 시
					const avgWeight = Number(item.avgWeight) || 0;
					if (newValue || Number(newValue) == 0) {
						ref.gridRef.current.setCellValue(rowIndex, 'TRANQTY', '0');
						ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', '0');
					} else {
						if (item.boxflag === 'Y' && avgWeight > 0) {
							const rounded = Math.round(Number(newValue) / avgWeight);
							ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', rounded);
						} else if (Number(newValue) > 0 && Number(newValue) / avgWeight < 1) {
							ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', 1);
						} else if (Number(newValue) < 0 && Number(newValue) / avgWeight > -1) {
							ref.gridRef.current.setCellValue(rowIndex, 'TRANBOX', -1);
						}
					}
				}

				if (col === 'tranbox' && item.boxflag !== 'D') {
					if (!newValue || Number(newValue) == 0) {
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
		 * 감모 요청 저장
		 */
		const saveMaster = async () => {
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
			// reasoncode에 data2 = 'Y' 인 경우

			showConfirm(null, '저장하시겠습니까?', () => {
				const formdata = props.form.getFieldsValue();
				const detailFormData = props.detailForm.getFieldsValue();
				const params = {
					saveRequestList: checkedRows,
					...formdata,
					...detailFormData,
					apprreqdt: dayjs(detailFormData.apprreqdt).format('YYYYMMDD'),
				};
				apiSaveAdjustmentRequestList(params).then(res => {
					if (res.data && res.data.errorCode != '-1') {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
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
					btnType: 'save', // 저장
					callBackFn: saveMaster,
				},
				// {
				// 	btnType: 'elecApproval', // 전자결재
				// },
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

			if (data === undefined || data.length < 1) {
				showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
				return;
			}

			// 그리드 컬럼 헤더 정보 가져옴.
			const dataFieldsWithMeta = ref.gridRef.current
				.getColumnInfoList()
				.map((col: any, index: number) => ({
					index,
					dataField: col.dataField,
					visible: col.visible !== false,
				}))
				.filter((col: { dataField: any }) => !!col.dataField);

			// 그리드 데이터 생성
			const excelGridData = data.map((row: any) => {
				const newRow: any = {};
				let excelIndex = 0;

				// 엑셀 데이터와 그리드 컬럼 매칭
				dataFieldsWithMeta.forEach(({ dataField, visible }: { dataField: string; visible: boolean }) => {
					if (visible) {
						// visible한 컬럼은 엑셀의 실제 순서와 매칭
						newRow[dataField] = row[excelIndex];
						excelIndex++;
					} else {
						// visible == false인 컬럼 초기값 세팅
						if (dataField === 'boxflag') {
							newRow[dataField] = 'Y';
						}
					}
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
			ref.gridRef?.current.resize(); // 그리드 크기 조정
		}, []);

		useEffect(() => {
			const gridRefCur = ref.gridRef.current;
			if (gridRefCur) {
				gridRefCur?.setGridData(props.data);
				gridRefCur?.setSelectionByIndex(0, 0);
			}
		}, [props.data]);

		return (
			<>
				<div className={approvalInfoOpen ? '' : 'hidden'}>
					<Form form={props.detailForm} onValuesChange={onValuesChange} initialValues={initValues}>
						<AGrid>
							<TableTopBtn tableBtn={setTableBtn()} tableTitle="결재정보" />
							<UiDetailViewArea>
								<UiDetailViewGroup className="grid-column-4">
									<li>
										<DatePicker
											name="apprreqdt"
											label="결재요청일자"
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<SelectBox
											name="reasoncode"
											span={24}
											options={getCommonCodeListByData('REASONCODE_AJAJ', null, null, null, '2170', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											placeholder="선택해주세요"
											label={'발생사유'}
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
										<CmPartnerSearch
											form={props.detailForm}
											selectionMode="singleRow"
											name="wdcustname"
											code="wdcust"
											returnValueFormat="name"
											label="출고자"
											required={true}
										/>
									</li>
									<li>
										<SelectBox
											name="wdmethod"
											span={24}
											options={getCommonCodeList('DELIVERYTYPE_FS', '전체', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											placeholder="선택해주세요"
											label={'출고방법'}
											required={true}
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</li>
									<li>
										<InputText name="wdmemo" label="비고" />
									</li>
									<li></li>
								</UiDetailViewGroup>
							</UiDetailViewArea>
						</AGrid>
					</Form>
				</div>
				<AGrid>
					<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt}>
						<Button onClick={() => setApprovalInfoOpen(prev => !prev)}>{'일괄적용'}</Button>
						<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
					</GridTopBtn>
					<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				<CmSearchWrapper ref={refModal} />
				{/* 엑셀 업로드 영역 정의 */}
				<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} />
			</>
		);
	},
);

export default StAdjustmentRequestExDCReqeustDetail;
