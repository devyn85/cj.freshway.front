/*
 ############################################################################
 # FiledataField	: StDisuseRequestExDCReqeustUploadExcelPopup.tsx
 # Description		: 폐기 요청 엑셀 업로드 팝업
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.07.11
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import DatePicker from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiSaveDisuseRequestList } from '@/api/st/apiStDisuseRequeStExDC';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { InputText, SelectBox } from '@/components/common/custom/form';
import TableTopBtn from '@/components/common/TableTopBtn';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';

// API

interface PropsType {
	close?: any;
}

const StDisuseRequestExDCReqeustUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const refModal = useRef(null);
	const [detailForm] = Form.useForm();
	const today = dayjs(dateUtil.getToDay('YYYY-MM-DD'));
	const initValues = {
		rowStatus: 'I',
		apprreqdt: today,
	};
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			width: 80,
			dataType: 'text',
			editable: false,
		},
		{ dataField: 'organize', headerText: '창고', width: 80, dataType: 'text', editable: false },
		{
			headerText: '재고위치',
			children: [
				{ dataField: 'stocktype', headerText: '코드', width: 80, dataType: 'text', editable: false },
				{ dataField: 'stocktypename', headerText: '명칭', width: 80, dataType: 'text', editable: false },
			],
		},
		{
			headerText: '재고속성',
			children: [
				{ dataField: 'stockgrade', headerText: '코드', width: 80, dataType: 'text', editable: false },
				{ dataField: 'stockgradename', headerText: '명칭', width: 80, dataType: 'text', editable: false },
			],
		},
		{ dataField: 'zone', headerText: '피킹존', width: 80, dataType: 'text', editable: false },
		{ dataField: 'loc', headerText: '로케이션', width: 80, dataType: 'text', editable: false },
		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', width: 80, dataType: 'text', editable: false },
				{ dataField: 'skuname', headerText: '상품명', width: 320, dataType: 'text', editable: false },
			],
		},
		{
			dataField: 'uom',
			headerText: '단위',
			width: 80,
			dataType: 'text',
			editable: false,
		},
		{
			dataField: 'avgweight',
			headerText: '입수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'qtySt',
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
			formatString: '#,##0.###',
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
			dataField: 'boxflag',
			headerText: '박스여부',
			width: 100,
			dataType: 'code',
			visible: false,
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
				list: getCommonCodeList('REASONCODE_DISUSE', ''),
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
				{ dataField: 'calbox', headerText: '환산박스', width: 80, dataType: 'numeric', editable: false },
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
			headerText: '귀속부서',
			children: [
				{
					dataField: 'costcd',
					headerText: '귀속부서',
					width: 109,
					dataType: 'text',
					required: true,
					commRenderer: {
						type: 'search',
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: gridRef,
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
					commRenderer: {
						type: 'search',
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: gridRef,
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
				{ dataField: 'custname', headerText: '거래처명', width: 156, dataType: 'text', editable: false },
			],
		},
		{
			dataField: 'isexpiringsoon',
			headerText: '유통기한임박여부',
			width: 140,
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '기준일',
			children: [
				{
					dataField: 'standarddatetype',
					headerText: '기준일(유통/제조)',
					width: 140,
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: '유통기간',
			children: [
				{
					dataField: 'shelfliferemaining',
					headerText: '잔여일수',
					width: 100,
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'shelflifetotal',
					headerText: '전체일수',
					width: 100,
					dataType: 'numeric',
					editable: false,
				},
			],
		},
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
					dataField: 'blno',
					headerText: 'B/L번호',
					width: 140,
					dataType: 'text',
					editable: false,
				},
				{
					dataField: 'slaughterdate',
					headerText: '도축일자',
					width: 120,
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'slaughterhouse',
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
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: '계약업체',
					width: 140,
					dataType: 'text',
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
					dataField: 'validfrom',
					headerText: '유효일자(From)',
					width: 120,
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'validto',
					headerText: '유효일자(To)',
					width: 120,
					dataType: 'date',
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
		},
		{
			dataField: 'stockid',
			headerText: 'STOCKID',
			width: 120,
			dataType: 'text',
			editable: false,
		},
		{
			dataField: 'area',
			headerText: 'AREA',
			width: 120,
			dataType: 'text',
			editable: false,
		},
		{
			dataField: 'qtyst',
			headerText: '현재고수량',
			width: 100,
			dataType: 'numeric',
			editable: false,
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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: () => {
					// 저장 버튼 클릭 시
					const changedData = gridRef.current.getChangedData({ validationYn: true });
					if (changedData && changedData.length > 0) {
						gridRef.current.saveGridData(changedData);
					} else {
						showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
							return;
						});
					}
				},
			},
			{ btnType: 'excelUpload' },
		],
	};
	/**
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		gridRef?.current.bind('beforeBeginEdit', (evt: any) => {
			// 클릭된 컬럼의 dataField (colid) 확인
			const col = evt.column?.dataField;
			const rowIndex = evt.rowIndex;

			// 예: 'costcd' 컬럼 클릭 시 팝업 띄우기
			if (col === 'costcd') {
				alert('클릭');
				const rowData = gridRef?.current.getRowData(rowIndex);
				refModal.current?.handlerOpen();
				return false;
			}

			// 다른 컬럼들을 추가로 체크하고 싶으면 else if...
		});
		gridRef?.current.bind('afterValueChanged', (evt: any) => {
			const col = evt.column?.dataField;
			const { rowIndex, newValue, item } = evt;

			if (col === 'tranqty' && item.boxflag !== 'D') {
				// TRANQTY 값 변경 시
				const avgWeight = Number(item.avgWeight) || 0;
				if (!newValue || Number(newValue) <= 0) {
					gridRef.current.setCellValue(rowIndex, 'TRANQTY', '0');
					gridRef.current.setCellValue(rowIndex, 'TRANBOX', '0');
				} else {
					const weight = avgWeight > 0 ? avgWeight : 1;
					const calculatedBox = Math.ceil(Number(newValue) / weight);
					const finalBox = Number(newValue) > 0 && calculatedBox < 1 ? 1 : calculatedBox;
					gridRef.current.setCellValue(rowIndex, 'TRANBOX', finalBox.toString());
				}
			}

			if (col === 'tranbox' && item.boxflag !== 'D') {
				if (!newValue || Number(newValue) <= 0) {
					gridRef.current.setCellValue(rowIndex, 'TRANBOX', '0');
				}
			}
		});
		gridRef?.current.bind('cellEditBegin', (evt: any) => {
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
	 * 폐기 요청 저장
	 */
	const saveMaster = async () => {
		const checkedRows = gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		// 그리드 validation 체크
		if (!gridRef?.current.validateRequiredGridData()) {
			showAlert(null, t('msg.requiredInputNoArg'));
			return;
		}

		const isValid = await validateForm(detailForm);
		if (!isValid) {
			return;
		}

		showConfirm(null, '저장하시겠습니까?', () => {
			const detailFormData = detailForm.getFieldsValue();
			const params = {
				saveRequestList: checkedRows,
				...detailFormData,
				apprreqdt: dayjs(detailFormData.apprreqdt).format('YYYYMMDD'),
			};
			apiSaveDisuseRequestList(params).then(res => {
				if (res.data && res.data.errorCode != '-1') {
					showMessage({
						content: t('msg.MSG_COM_SUC_001'),
						modalType: 'success',
					});
					// 저장 후 팝업닫기
					close();
				} else {
					showAlert(null, t('msg.MSG_COM_ERR_001'));
				}
			});
		});
	};
	// DETAIL VIEW 상단 버튼 설정
	const setTableBtn = (): TableBtnPropsType => ({
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'save',
				btnLabel: '적용',
				callBackFn: async () => {
					const grid = gridRef.current;
					// TODO: form validation 체크
					const isValid = await validateForm(detailForm);
					if (!isValid) {
						return;
					}
					const formValues = detailForm.getFieldsValue();

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

					alert('적용되었습니다.');
				},
			},
		],
	});

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	useEffect(() => {
		initEvent();
		gridRef?.current.resize(); // 그리드 크기 조정
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	// const onDataCheckClick = () => {
	// 	// 변경 데이터 확인
	// 	const skuList = gridRef.current.getChangedData({ validationYn: false });

	// 	if (!skuList || skuList.length < 1) {
	// 		showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
	// 			return;
	// 		});
	// 	} else if (skuList.length > 0 && !gridRef.current.validateRequiredGridData()) {
	// 		return;
	// 	} else {
	// 		//console.log(skuList);
	// 	}
	// };

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="폐기요청 엑셀 업로드" showButtons={false} />
			<Form form={detailForm} onValuesChange={onValuesChange} initialValues={initValues}>
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
								<InputText name="tranqty" label="처리수량" />
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
									options={getCommonCodeList('REASONCODE_DISUSE', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									label={'발생사유'}
								/>
							</li>
							<li>
								<CmCostCenterSearch
									form={detailForm}
									selectionMode="singleRow"
									name="costcdname"
									code="costcd"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<CmCustSearch
									form={detailForm}
									selectionMode="singleRow"
									name="custname"
									code="custkey"
									returnValueFormat="name"
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
							<li>
								<CmPartnerSearch
									form={detailForm}
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
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* <Button onClick={onDataCheckClick}>{'유효성검증'}</Button> */}
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
		</>
	);
};

export default StDisuseRequestExDCReqeustUploadExcelPopup;
