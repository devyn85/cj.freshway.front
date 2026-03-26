/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseFOSearch.tsx
 # Description		: 당일광역보충발주(FO)
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmDistancetypeSearch from '@/components/cm/popup/CmDistancetypeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { Form } from 'antd';

// API
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface OmOrderCreationSTOOrdBaseFOSearchProps {
	form: any;
	currentTabKey: string;
	gDccode: string;
	dsOrdbaseDcset?: any;
	callBack?: any;
}

const OmOrderCreationSTOOrdBaseFOSearch = (props: OmOrderCreationSTOOrdBaseFOSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 공급센터 변경 캐치
	const fromDccodeWatch = Form.useWatch('fromDccode', props.form);

	// 공급받는센터 변경 캐치
	const toDccodeWatch = Form.useWatch('toDccode', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 초기화
	 */
	useEffect(() => {
		if (props.dsOrdbaseDcset && props.dsOrdbaseDcset.length > 0) {
			const filteredList = props.dsOrdbaseDcset.filter((v: any) => v.comCd === props.gDccode);
			if (filteredList && filteredList.length > 0 && commUtil.isNotEmpty(filteredList[0].data1)) {
				props.form.setFieldValue('fromDccode', filteredList[0].data1);
			}
		}
	}, []);

	/**
	 * 공급센터 조회 조건 변경
	 */
	useEffect(() => {
		props.callBack?.();
	}, [fromDccodeWatch]);

	/**
	 * 공급받는센터 조회 조건 변경
	 */
	useEffect(() => {
		if (props.dsOrdbaseDcset && props.dsOrdbaseDcset.length > 0) {
			const filteredList = props.dsOrdbaseDcset.filter((v: any) => v.comCd === toDccodeWatch);
			if (filteredList && filteredList.length > 0 && commUtil.isNotEmpty(filteredList[0].data1)) {
				props.form.setFieldValue('fromDccode', filteredList[0].data1);
			}
		}
	}, [toDccodeWatch]);

	return (
		<>
			{(props.currentTabKey === '1' || props.currentTabKey === '2') && (
				<>
					{/* 이체일자 */}
					<li>
						<DatePicker
							name="deliverydate"
							label={t('lbl.DOCDT_STO')}
							required
							showSearch
							allowClear
							showNow={true}
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 공급센터 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fromDccode'} label={t('lbl.FROM_DCCODE')} required />
					</li>
					{/* 공급받는센터 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'toDccode'} label={t('lbl.TO_DCCODE')} required />
					</li>
					{/* 재고량산정조건 */}
					<li>
						<span>
							<CheckBox label={t('lbl.STOCK_CALC_COND')} name="stqtyyn" trueValue={'1'} falseValue={'0'}>
								{t('lbl.FROM_DC_STOCKQTY')}
							</CheckBox>
							<CheckBox name="opqtyyn" trueValue={'1'} falseValue={'0'}>
								{t('lbl.PO_DC_STOCKQTY')}
							</CheckBox>
						</span>
					</li>
					{/* 상품 */}
					<li>
						<CmSkuSearch
							form={props.form}
							name="skuName"
							code="sku"
							selectionMode="multipleRows"
							returnValueFormat="name"
						/>
					</li>
					{/* 제외상품 */}
					<li>
						<CmSkuSearch
							form={props.form}
							name="skuexceptName"
							code="skuexcept"
							selectionMode="multipleRows"
							returnValueFormat="name"
							label={t('lbl.SKU_EXCEPT')}
						/>
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							name="storagetype"
							span={24}
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder="선택해주세요"
							label={t('lbl.STORAGETYPE')}
						/>
					</li>
					{/* 고객마감유형 */}
					<li>
						<SelectBox
							name="custorderclosetype"
							span={24}
							options={getCommonCodeList('CUSTORDERCLOSETYPE', t('lbl.ALL'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder="선택해주세요"
							label={t('lbl.CUSTORDERCLOSETYPE')}
						/>
					</li>
					{/* 지정원거리유형 */}
					<li>
						<CmDistancetypeSearch
							form={props.form}
							name="distancetypeName"
							code="distancetype"
							selectionMode="multipleRows"
							returnValueFormat="name"
							label={t('lbl.DISTANCETYPE_2')}
						/>
					</li>
					{/* 제외원거리유형 */}
					<li>
						<CmDistancetypeSearch
							form={props.form}
							name="setdistancetypeName"
							code="setdistancetype"
							selectionMode="multipleRows"
							returnValueFormat="name"
							label={t('lbl.SET_DISTANCETYPE')}
						/>
					</li>
					{/* ... */}
					<li>
						<span>
							<CheckBox label={t('')} name="stuseyn" trueValue={'1'} falseValue={'0'} disabled>
								{t('lbl.ST_USE_YN')}
							</CheckBox>
							<CheckBox name="serialyn" trueValue={'1'} falseValue={'0'} disabled>
								{t('lbl.SERIAL_YN')}
							</CheckBox>
							<CheckBox name="ordcrossyn" trueValue={'1'} falseValue={'0'}>
								{t('lbl.ORD_CROSS_YN')}
							</CheckBox>
							<CheckBox name="ignorecrossyn" trueValue={'1'} falseValue={'0'}>
								{t('lbl.IGNORE_CROSS_YN')}
							</CheckBox>
						</span>
					</li>
				</>
			)}
			{props.currentTabKey === '3' && (
				<>
					{/* 출고일자 */}
					<li>
						<DatePicker
							name="deliverydate2"
							label={t('lbl.DOCDT_WD')}
							required
							showSearch
							allowClear
							showNow={true}
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 공급센터 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fromDccode2'} label={t('lbl.FROM_DCCODE')} />
					</li>
					{/* 공급받는센터 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'toDccode2'} label={t('lbl.TO_DCCODE')} />
					</li>
					{/* 상품 */}
					<li>
						<CmSkuSearch
							form={props.form}
							name="skuName2"
							code="sku2"
							selectionMode="multipleRows"
							returnValueFormat="name"
						/>
					</li>
					{/* 관리처코드 */}
					<li>
						<CmCustSearch
							form={props.form}
							name="toCustkeyName"
							code="toCustkey"
							selectionMode="multipleRows"
							returnValueFormat="name"
						/>
					</li>
					{/* 주문번호 */}
					<li>
						<MultiInputText
							name="docno"
							label={t('lbl.DOCNO_WD')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DOCNO_WD')])}
							allowClear
						/>
					</li>
					{/* 이체주문번호 */}
					<li>
						<InputText
							name="stoDocno"
							label={t('lbl.STO_DOCNO_WD')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.STO_DOCNO_WD')])}
							allowClear
						/>
					</li>
				</>
			)}
		</>
	);
};

export default OmOrderCreationSTOOrdBaseFOSearch;
