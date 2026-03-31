/*
 ############################################################################
 # FiledataField	: IbExpenseDocumentInfoHeaderPopup.tsx
 # Description		: 비용기표 - 문서정보 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.06
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Lib
import { Button, Form, Input } from 'antd';
import dayjs from 'dayjs';

// component
import CmPaymentTermSearch from '@/components/cm/popup/CmPaymentTermSearch';
import CmSupplierSearch from '@/components/cm/popup/CmSupplierSearch';
import CmTaxTypeSearch from '@/components/cm/popup/CmTaxTypeSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { CheckBox, InputNumber, InputSearch, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import IbExpenseElecTaxPopup from '@/components/ib/expense/IbExpenseElecTaxPopup';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function

interface PropsType {
	headerData?: any;
	popupType: string;
	serialkey: any;
	save?: any;
}

const IbExpenseDocumentInfoHeaderPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { headerData, popupType, serialkey } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 그리드 접근을 위한 Ref
	ref.gridRef = useRef();

	// 세금계산서 팝업용 Ref
	const refElecTaxModal = useRef(null);

	// 입력 활성화 여부
	const [isDisable, setIsDisable] = useState(true);

	// 저장 버튼 활성화 여부
	const [isVisibleSave, setIsVisibleSave] = useState(false);
	const [isTaxRateReadOnly, setIsTaxRateReadOnly] = useState(false);
	const [isTaxTypeCodeReadOnly, setIsTaxTypeCodeReadOnly] = useState(false);
	const [isTaxTypeCodeEnabled, setIsTaxTypeCodeEnabled] = useState(true);
	const [isTaxNoReadOnly, setIsTaxNoReadOnly] = useState(false);
	const [isTaxNoEnabled, setIsTaxNoEnabled] = useState(true);
	const [isInvSignEnabled, setIsInvSignEnabled] = useState(false);
	const [isTaxYmdEnabled, setIsTaxYmdEnabled] = useState(true);

	// General Information 영역
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 그리드 Ref
		btnArr: [],
	};

	// 나머지 영역 제목
	const tableBtnDetail: TableBtnPropsType = {
		tGridRef: ref.gridRef, // 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * Payment Term을 표시한다.
	 * @returns {any} 공통코드
	 */
	const getTaxAutoFlag = () => {
		const types = [
			{ comCd: 'Y', cdNm: 'Automatically' },
			{ comCd: 'N', cdNm: 'Manually' },
		];

		return types;
	};

	/**
	 * 입력 항목들의 활성화 여부를 설정한다.
	 * @param {boolean} enabled - 활성화 여부를 지정합니다.
	 */
	const setEnabled = (enabled: boolean) => {
		//setIsDisable(!enabled);
		setIsDisable(false); //임시

		if (enabled && props.headerData.taxAutoFlag !== 'Y') {
			setTaxFlagEnabled(true);
		} else {
			setTaxFlagEnabled(false);
		}

		if (enabled) {
			if (props.headerData.taxTag === 'A01') {
				setTaxTagEnabled(true);
			} else {
				setTaxTagEnabled(false);
			}
		}
	};

	/**
	 * TaxType  활성화 여부를 설정한다.
	 * @param enabled
	 */
	const setTaxFlagEnabled = (enabled: boolean) => {
		setIsTaxRateReadOnly(!enabled);
		setIsTaxTypeCodeReadOnly(!enabled);
		setIsTaxTypeCodeEnabled(enabled);
	};

	/**
	 * TaxNo  활성화 여부를 설정한다.
	 * @param enabled
	 */
	const setTaxTagEnabled = (enabled: boolean) => {
		setIsTaxNoReadOnly(enabled);
		setIsTaxNoEnabled(enabled);
		setIsInvSignEnabled(!enabled);
		setIsTaxYmdEnabled(!enabled);
	};

	/**
	 * 상세 정보 바인딩
	 */
	const setMasterInfo = () => {
		if (props.headerData) {
			//Document Date 설정
			const issueDate = dayjs(props.headerData.issueDate, 'YYYYMMDD');
			props.headerData.issueDate = issueDate;

			//Postin Date 설정
			const postingDate = dayjs(props.headerData.postingDate, 'YYYYMMDD');
			props.headerData.postingDate = postingDate;

			//Tax Ymd 설정
			const taxYmd = dayjs(props.headerData.taxYmd, 'YYYYMMDD');
			props.headerData.taxYmd = taxYmd;

			//역발행여부 (체크박스) 설정
			props.headerData.invSign = props.headerData.invSign === 'Y';

			//Supplier 코드+명칭 설정
			let adjustmentSupplierCdName = '';
			if (props.headerData.adjustmentSupplierCode) {
				adjustmentSupplierCdName =
					'[' + (props.headerData.adjustmentSupplierCode || '') + ']' + (props.headerData.adjustmentSupplierName || '');
			}
			props.headerData.adjustmentSupplierCdName = adjustmentSupplierCdName;

			//Supplier (Acutal) 코드+명칭 설정
			let actualSupplierName = '';
			if (props.headerData.actualSupplierCode) {
				actualSupplierName =
					'[' + (props.headerData.actualSupplierCode || '') + ']' + (props.headerData.actualSupplierName || '');
			}
			props.headerData.actualSupplierName = actualSupplierName;

			//Payment Term 코드+명칭 설정
			let paymentTermCdName = '';
			if (props.headerData.paymentTerm) {
				paymentTermCdName = '[' + (props.headerData.paymentTerm || '') + ']' + (props.headerData.paymentTermName || '');
			}
			props.headerData.paymentTermCdName = paymentTermCdName;

			//Tax Type 코드+명칭 설정
			let taxTypeName = '';
			if (props.headerData.taxTypeCode) {
				taxTypeName = '[' + (props.headerData.taxTypeCode || '') + ']' + (props.headerData.taxTypeName || '');
			}
			props.headerData.taxTypeName = taxTypeName;

			form.setFieldsValue(props.headerData);

			// 입력 활성화 여부 설정
			if (props.headerData.status !== 'ENT' && props.headerData.status !== 'R' && props.popupType === 'DOCUMENTINFO') {
				setEnabled(false);
			} else {
				setEnabled(true);
			}
		}
	};

	/**
	 * 헤더 정보를 저장한다.
	 */
	const saveMaster = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		props.save();
	};

	/**
	 * 파일을 저장한다.
	 */
	const attachFile = () => {};

	/**
	 * Tax Type 변경 이벤트
	 * @param {any} value
	 */
	const onChangeSelectTaxType = (value: any) => {
		if (value === 'Y') {
			setTaxFlagEnabled(false);
		} else {
			setTaxFlagEnabled(true);
		}
	};

	/**
	 *Tax Invoice 변경 이벤트
	 * @param value
	 */
	const onChangeSelectTaxInvoice = (value: any) => {
		form.setFieldValue('taxNo', '');
		if (value === 'A01') {
			setTaxTagEnabled(true);
		} else {
			setTaxTagEnabled(false);
		}
	};

	/**
	 * 전자세금계산서 팝업 오픈
	 */
	const openElecTaxPopup = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('adjustmentSupplierCode')) ||
			commUtil.isEmpty(form.getFieldValue('adjustmentSupplierName')) ||
			commUtil.isEmpty(form.getFieldValue('cbRegisno'))
		) {
			showMessage({
				content: 'Supplier를 입력하세요.',
				modalType: 'warning',
			});
			return;
		}

		refElecTaxModal.current.handlerOpen();
	};

	/**
	 * 세금계산서 팝업 처리 후 콜백
	 * @param param
	 */
	const callBackElecTaxPopup = (param: any) => {
		if (param) {
			form.setFieldValue('taxNo', param.issueId ?? '');

			const taxYmd = dayjs(param.issueDate ?? '', 'YYYYMMDD');
			form.setFieldValue('taxYmd', taxYmd);

			if (param.invSign && param.invSign === 'Y') {
				form.setFieldValue('invSign', true);
			} else {
				form.setFieldValue('invSign', false);
			}
		}
	};

	/**
	 * 세금계산서 팝업 닫기
	 */
	const closeEventElecTaxPopup = () => {
		refElecTaxModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		setMasterInfo();
	}, [props.headerData]);

	return (
		<>
			{/* 헤더 영역 */}
			<Form form={form}>
				<AGrid>
					<GridTopBtn gridTitle={'General Information'} gridBtn={gridBtnDetail}>
						{!isDisable && (
							<Button onClick={attachFile} disabled={isDisable}>
								{t('Attach File')}
							</Button>
						)}
						{!isDisable && (
							<Button onClick={saveMaster} disabled={isDisable}>
								{t('lbl.SAVE')}
							</Button>
						)}
					</GridTopBtn>
					<UiDetailViewArea>
						<UiDetailViewGroup>
							<li style={{ gridColumn: '1 / span 2' }}>
								<InputText //Document No
									name="serialkey"
									label={t('Document No')}
									disabled={isDisable}
									readOnly
								/>
							</li>
							<li style={{ gridColumn: '3 / span 2' }}>
								<CmSupplierSearch //Supplier
									form={form}
									name="adjustmentSupplierCdName"
									code="adjustmentSupplierCode"
									paymentTerm="paymentTerm"
									paymentTermName="paymentTermName"
									paymentTermCdName="paymentTermCdName"
									vatno="cbRegisno"
									selectionMode="singleRow"
									returnValueFormat="name"
									label={t('Supplier')}
									isResetForm={false}
									required
									disabled={isDisable}
								/>
							</li>
							<li style={{ gridColumn: '1 / span 2' }}>
								<DatePicker //Document Date
									name="issueDate"
									label={t('Document Date(전기일)')}
									disabled={isDisable}
									required
								/>
							</li>
							{/*
						<li style={{ gridColumn: '3 / span 2' }}>
							<CmPartnerSearch //Supplier (Acutal)
								form={form}
								name="actualSupplierName"
								code="actualSupplierCode"
								selectionMode="singleRow"
								returnValueFormat="name"
								label={t('Supplier(Acutal)')}
							/>
						</li>
						*/}
						</UiDetailViewGroup>
					</UiDetailViewArea>

					<TableTopBtn tableTitle={'Slip Information'} tableBtn={tableBtnDetail} />
					<UiDetailViewArea>
						<UiDetailViewGroup>
							<li style={{ gridColumn: '1 / span 1' }}>
								<InputText name="journalTypeCode" label={t('Journal Type')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '2 / span 1' }}>
								<InputText name="journalTypeName" disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '3 / span 1' }}>
								<InputText name="accountCrCode" label={t('Credit Account')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '4 / span 1' }}>
								<InputText name="accountCrName" disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '1 / span 2' }}>
								<InputText name="slipNo" label={t('Slip No')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '3 / span 1' }}>
								<InputText name="fiscalYear" label={t('Fiscal, Posting Date')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '4 / span 1' }}>
								<DatePicker name="postingDate" disabled={isDisable} />
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>

					<TableTopBtn tableTitle={'Payment Information'} tableBtn={tableBtnDetail} />
					<UiDetailViewArea>
						<UiDetailViewGroup>
							{/*
							<li style={{ gridColumn: '1 / span 1' }}>
								<InputText name="paymentTerm" label={t('Payment Terms')} disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '2 / span 1' }}>
								<InputText name="paymentTermName" disabled={isDisable} />
							</li>
						  */}
							<li style={{ gridColumn: '1 / span 2' }}>
								<CmPaymentTermSearch //PaymentTerm
									form={form}
									name="paymentTermCdName"
									code="paymentTerm"
									selectionMode="singleRow"
									returnValueFormat="name"
									label={t('Payment Terms')}
									isResetForm={false}
									disabled={isDisable}
									required
								/>
							</li>
							<li style={{ gridColumn: '3 / span 2' }}>
								<span>
									<InputNumber
										name="supplyPrice"
										min={0}
										formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
										label={t('Supply Price/Tax')}
										disabled={isDisable}
										readOnly
									/>
									<InputNumber
										name="taxAmount"
										min={0}
										formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
										disabled={isDisable}
										readOnly
									/>
								</span>
							</li>
							<li style={{ gridColumn: '1 / span 1' }}>
								<SelectBox
									name="taxAutoFlag"
									options={getTaxAutoFlag()}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									onChange={onChangeSelectTaxType}
									label={t('Tax Type')}
									disabled={isDisable}
								/>
							</li>
							{/*
							<li style={{ gridColumn: '2 / span 1' }}>
								<InputText name="taxTypeCode" disabled={isDisable} />
							</li>
							<li style={{ gridColumn: '3 / span 1' }}>
								<InputText name="taxTypeName" disabled={isDisable} />
							</li>
							*/}
							<li style={{ gridColumn: '2 / span 2' }}>
								<CmTaxTypeSearch
									form={form}
									name="taxTypeName"
									code="taxTypeCode"
									data1="taxRate"
									selectionMode="singleRow"
									returnValueFormat="name"
									label={t('')}
									isResetForm={false}
									disabled={isDisable || !isTaxTypeCodeEnabled}
									readOnly={isTaxTypeCodeReadOnly}
									required
								/>
							</li>
							<li style={{ gridColumn: '4 / span 1' }}>
								<InputNumber
									name="taxRate"
									min={0}
									formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
									disabled={isDisable}
									readOnly={isTaxRateReadOnly}
								/>
							</li>

							<li style={{ gridColumn: '1 / span 2' }}>
								<DatePicker
									name="taxYmd"
									label={t('Tax Date(전표증빙일)')}
									disabled={isDisable || !isTaxYmdEnabled}
									required
								/>
							</li>
							<li style={{ gridColumn: '3 / span 2' }}>
								<InputNumber
									name="amount"
									min={0}
									label={t('Amount')}
									formatter={(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value: string) => value?.replace(/\\s?|(,*)/g, '')}
									disabled={isDisable}
									readOnly
								/>
							</li>
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputText name="summary" label={t('Summary')} disabled={isDisable} />
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>

					<TableTopBtn tableTitle={'Tax Invoice Information'} tableBtn={tableBtnDetail} />
					<UiDetailViewArea>
						<UiDetailViewGroup>
							<li style={{ gridColumn: '1 / span 2' }}>
								<SelectBox
									name="taxTag"
									options={getCommonCodeList('TAX_TAG', t('lbl.ALL'), null)}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder="선택해주세요"
									onChange={onChangeSelectTaxInvoice}
									label={t('Tax InvoiNoce')}
									disabled={isDisable}
									required
								/>
							</li>
							<li style={{ gridColumn: '3 / span 2' }}>
								<span>
									<InputSearch
										label={t('Tax No')}
										name="taxNo"
										onSearch={openElecTaxPopup}
										disabled={isDisable}
										readOnly={isTaxNoReadOnly}
										hidden
									/>
									<CheckBox name="invSign" disabled={isDisable && !isInvSignEnabled}>
										{t('역발행여부')}
									</CheckBox>
								</span>
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>

					<Form.Item name="accountDetailCode" hidden>
						<Input />
					</Form.Item>
					<Form.Item name="cbRegisno" hidden>
						<Input />
					</Form.Item>
					<Form.Item name="adjustmentSupplierName" hidden>
						<Input />
					</Form.Item>
					<Form.Item name="paymentTermName" hidden>
						<Input />
					</Form.Item>
				</AGrid>
			</Form>

			{/* 세금계산서 팝업 영역 정의 */}
			<CustomModal ref={refElecTaxModal} width="1000px">
				<IbExpenseElecTaxPopup
					callBack={callBackElecTaxPopup}
					close={closeEventElecTaxPopup}
					serialkey={form.getFieldValue('serialkey')}
					adjustmentSupplierCode={form.getFieldValue('adjustmentSupplierCode')}
					adjustmentSupplierName={form.getFieldValue('adjustmentSupplierName')}
					cbRegisno={form.getFieldValue('cbRegisno')}
				/>
			</CustomModal>
		</>
	);
});

export default IbExpenseDocumentInfoHeaderPopup;
