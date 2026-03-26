/*
 ############################################################################
 # FiledataField	: StConvertContractSNDetail.tsx
 # Description		: 상품이력계약정보변경
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.11.14
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Button, Form } from 'antd';
import { isEmpty } from 'lodash';
// API Call Function
import { apiSaveMasterList } from '@/api/st/apiStConvertContractSN';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';

//store
const StConvertContractSNDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const dcCode = Form.useWatch('dcCode', props.form);
	const [formVal] = Form.useForm();
	const [contractTypeCd, setContractTypeCd] = useState<string>('');
	const [contractCompany, setContractCompany] = useState<string>('');
	const courier = Form.useWatch('courier', props.form);
	const courierNm = Form.useWatch('courierName', props.form);
	const user = useAppSelector(state => state.user.userInfo);
	const refModal = useRef(null);

	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE_SN', '');
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE_SN', value)?.cdNm;

		// return list;
	};

	const gridCol = [
		{
			dataField: 'sku',
			headerText: '상품코드',
			dataType: 'string',
			editable: false,

			width: 120,
		},
		{
			dataField: 'skuName',
			headerText: '상품명',
			dataType: 'string',
			editable: false,
			width: 180,
		},
		{
			// 검수건수
			headerText: t('상품이력정보'),
			children: [
				{
					dataField: 'serialNo',
					headerText: '이력번호',
					dataType: 'string',
					editable: false,
					width: 160,
				},

				{
					dataField: 'barcode',
					headerText: '바코드',

					dataType: 'string',
					editable: false,
					width: 140,
				},
				{
					dataField: 'convSerialNo',
					headerText: 'BL번호',
					editable: false,
					dataType: 'string',
					width: 140,
				},
				// {
				// 	dataField: 'butcheryDt',
				// 	headerText: '도축일자',
				// 	dataType: 'string', // 필요하면 프론트에서 날짜 포맷 변환
				// 	width: 110,
				// },
				{
					dataField: 'contractType',
					headerText: '계약유형',
					dataType: 'code',
					width: 100,
					// editable: false,
					editRenderer: {
						type: 'DropDownListRenderer',
						list: getContractTypeCommonCodeList(),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
					labelFunction: getContractTypeCommonCode,
				},
				{
					dataField: 'contractCompany',
					headerText: '계약업체코드',
					dataType: 'code',
					width: 130,
					// editable: false,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								contractCompany: 'code',
								contractCompanyName: 'name',
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;

							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								codeName: e.text,
								dataFieldMap: {
									contractCompany: 'code',
									contractCompanyName: 'name',
								},
								popupType: 'cust',
							});
						},
					},
				},
				{
					dataField: 'contractCompanyName',
					headerText: '계약업체명',
					dataType: 'string',
					width: 160,
					editable: false,
				},
				{
					dataField: 'contractCompanyEmpName1',
					headerText: '관리 사원명1',
					dataType: 'string',
					width: 140,
					editable: false,
				},
				{
					dataField: 'fromValidDt',
					headerText: '유효일자(From)',
					dataType: 'string',
					// visible: false,
					editable: false,
					width: 120,
					commRenderer: {
						type: 'calender',
						showExtraDays: true,
						onlyCalendar: false,
					},
				},
				{
					dataField: 'toValidDt',
					headerText: '유효일자(To)',
					dataType: 'string',
					// visible: false,
					editable: false,
					commRenderer: {
						type: 'calender',
						showExtraDays: true,
						onlyCalendar: false,
					},
					width: 120,
				},
			],
		},
		{
			dataField: 'poKey',
			headerText: '구매전표',
			dataType: 'string',
			width: 140,
			editable: false,
		},
		{
			dataField: 'poLine',
			headerText: '구매라인',
			dataType: 'code',
			width: 140,
			editable: false,
		},

		{
			dataField: 'headerSerialKey',
			headerText: '헤더시리얼키',
			dataType: 'string',
			width: 140,
			visible: false, // 화면에서 안 쓸 거면 숨겨두기
		},
		{
			dataField: 'detailSerialKey',
			headerText: '디테일시리얼키',
			dataType: 'string',
			width: 140,
			visible: false,
		},
		{
			dataField: 'contractCompanyOrg',
			headerText: '원본계약업체코드',
			dataType: 'string',
			width: 150,
			visible: false, // 비교용/전송용이면 숨기는 게 깔끔
		},
		{
			dataField: 'contractTypeOrg',
			headerText: '원본계약유형',
			dataType: 'string',
			width: 130,
			visible: false,
		},
		{
			dataField: 'factoryName',
			headerText: '공장명',
			dataType: 'string',
			width: 140,
			editable: false,
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		// showStateColumn: true,
		// editable: true,
		//editBeginMode: 'doubleClick',
		// fillColumnSizeMode: false,
		// enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		// enableFilter: true,
		isLegacyRemove: true,
	};
	const footerLayout = [
		{
			// dataField: 'slipDt',
			// positionField: 'slipDt',
			// operation: 'COUNT',
			// postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl = ref.gridRef.current.getChangedData({ validationYn: false });
		const validChk = ref.gridRef.current.getGridData();
		const valList = codeDtl.filter((item: any) => {
			return item.contractTypeOrg === '90' || item.contractType === '90';
		});

		if (!codeDtl || codeDtl.length < 1) {
			ref.gridRef.current.showConfirmSave(() => {
				return;
			});
		} else if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		} else if (
			valList.length > 0 &&
			!user.roles?.includes('00') &&
			!user.roles?.includes('000') &&
			!user.roles?.includes('05') &&
			!user.roles?.includes('010')
		) {
			showAlert('', '당일매입매출건을 변경 처리 할 수 없습니다.');

			return;
		} else {
			ref.gridRef.current.showConfirmSave(() => {
				const saveList = {
					saveList: codeDtl,
				};

				//console.log((saveList);
				apiSaveMasterList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							ref.gridRef.current.clearGridData();
							props.fnCallBack(); // 저장 성공 후에만 호출
							showAlert('저장', '저장되었습니다.');
						} else {
							return false;
						}
					})
					.catch(e => {
						return false;
					});
			});
		}
	};

	/**
	 * 선택적용
	 * @param type
	 * @returns
	 */
	const changeVal = (type: string) => {
		const gridRefDtl = ref.gridRef.current;
		const data = formVal.getFieldsValue();
		const checkedRows = gridRefDtl.getCheckedRowItems?.();
		const contractType = data.contractType;
		const contractCompany = data.contractCompany;
		const wdCustKeyNm = data.wdCustKeyNm;

		if (checkedRows < 0) {
			showAlert('', '변경적용할 대상 자료를 선택해 주세요.');
			return;
		}

		if (type === 'contractCompany') {
			//업체 변경

			if (isEmpty(contractCompany) || isEmpty(wdCustKeyNm)) {
				showAlert('', '변경할 계약업체정보를 입력해주세요.');
				return;
			}
			checkedRows.forEach((row: any) => {
				const rowIndex = row.rowIndex;
				if (contractCompany) gridRefDtl.setCellValue(rowIndex, 'contractCompany', contractCompany);
				if (wdCustKeyNm) gridRefDtl.setCellValue(rowIndex, 'contractCompanyName', wdCustKeyNm);

				// }
				// if()
			});
		} else if (type === 'contractType') {
			//계약 변경

			if (isEmpty(contractType)) {
				showAlert('', '변경할 계약유형을 선택해주세요.');
				return;
			}
			checkedRows.forEach((row: any) => {
				const rowIndex = row.rowIndex;
				if (contractType) gridRefDtl.setCellValue(rowIndex, 'contractType', contractType);

				// }
				// if()
			});
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'btn1', // 행삭제
			// 	callBackFn: importCourier,
			// },
			// {
			// 	btnType: 'plus', // 행추가
			// 	initValues: {
			// 		entrustedCarYn: 'N',
			// 		fixCarYn: 'N',
			// 		tmpCarYn: 'N',
			// 		actualCostCarYn: 'N',
			// 		dcCode: dcCode,
			// 		rowStatus: 'I',
			// 		courier: courier,
			// 		courierName: courierNm?.replace(/\[\d+\]/g, ''),
			// 	},
			// 	// callBackFn: () => {
			// 	// 	if (isEmpty(courier)) {
			// 	// 		const rowindex = ref.gridRef.current.getSelectedIndex()[0];
			// 	// 		ref.gridRef.current.removeRow(rowindex);
			// 	// 		showAlert('', '검색 조건의 운송사 코드/명을 입력해주세요');
			// 	// 	}
			// 	// },
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
				//console.log((props.data);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGridWrap className="contain-wrap">
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
						<Form form={formVal} layout="inline" className="sect">
							<Form.Item name="partnerCd" label="">
								{/* 선택 시 form.setFieldsValue({organizeCode, organizeName}) 하도록 구현 */}
								<CmCustSearch
									form={formVal}
									// selectionMode="multipleRows"
									name="wdCustKeyNm"
									code="contractCompany"
									returnValueFormat="name"
									label={t('lbl.CONTRACTCOMPANY')} /*계약업체*/
									value={contractCompany}
									// onChange={setContractCompany}
									className="bg-white"
								/>
							</Form.Item>
							<Button
								type={'default'}
								onClick={() => {
									changeVal('contractCompany');
								}}
							>
								계약고객적용
							</Button>

							<Form.Item name="contractType" label="계약유형">
								<SelectBox
									options={getCommonCodeList('CONTRACTTYPE_SN', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									name="contractTypeCd"
									value={contractTypeCd}
									onChange={setContractTypeCd}
									className="bg-white"
									style={{ width: 130 }}
								/>
							</Form.Item>
							<Button
								type={'default'}
								onClick={() => {
									changeVal('contractType');
								}}
							>
								계약유형적용
							</Button>
						</Form>
					</GridTopBtn>
					<AUIGrid
						ref={ref.gridRef}
						name={gridId}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={footerLayout}
					/>
				</AGrid>
			</AGridWrap>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default StConvertContractSNDetail;
