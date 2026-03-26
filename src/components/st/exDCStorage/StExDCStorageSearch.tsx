/*
 ############################################################################
 # FiledataField	: StExDCStorageSearch.tsx
 # Description		: 외부창고정산
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

// CSS

// Lib
import { Col, Form, Input } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, MultiInputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

// API

interface StExDCStorageSearchProps {
	form: any;
}

const StExDCStorageSearch = (props: StExDCStorageSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택 조건 변경 이벤트
	 * @param value
	 * @param option
	 */
	const onChangeSelectCategory = (value: string | number, option: object) => {
		if (value) {
			props.form.setFieldValue('category', String(value).toLowerCase().replaceAll('_', ''));
		} else {
			props.form.setFieldValue('category', null);
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 구분의 값을 입고와 출고만 표시한다.
	 * @returns {any} 공통코드
	 */
	const getDoctypeVessel = () => {
		const types = getCommonCodeList('DOCTYPE_VESSEL', t('lbl.ALL'), null).filter(
			(item: any) => item.comCd === 'DP' || item.comCd === 'WD' || item.comCd === null,
		);

		return types;
	};

	/**
	 * 조회 카테고리의 일부를 표시한다.
	 * @returns {any} 공통코드
	 */
	const getContracttype = () => {
		const types = getCommonCodeList('SEARCHCATEGORY', t('lbl.ALL'), null).filter(
			(item: any) =>
				item.comCd === null || (item.comCd !== 'SKU' && item.comCd !== 'SKUNM' && item.comCd !== 'CONVSERIALNO'),
		);

		return types;
	};

	return (
		<>
			<li>
				<DatePicker //재고월
					name="stockmonth"
					label={t('lbl.STOCKMONTH')}
					format="YYYY-MM"
					showSearch
					allowClear
					picker="month"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="singlRow"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</li>
			<li>
				<SelectBox //구분
					name="gubun"
					span={24}
					options={getDoctypeVessel()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.GUBUN_2')}
				/>
			</li>
			<li>
				<SelectBox //유형
					name="type"
					span={24}
					options={getCommonCodeList('IOTYPE_SN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.TYPE')}
				/>
			</li>
			<li>
				<SelectBox //세금코드
					name="taxCls"
					span={24}
					options={getCommonCodeList('TAX_CLS', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.TAXCODE')}
				/>
			</li>
			<li>
				<CmSkuSearch //상품
					form={props.form}
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<MultiInputText
					name="convserialno" //BL번호
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li>
				<MultiInputText
					name="docno" //입출고번호
					label={t('lbl.IO_NO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.IO_NO')])}
					allowClear
					style={{ width: '260px' }}
				/>
			</li>

			{/*
 					<SelectBox
 						name="searchCategory"
-						//options={getCommonCodeList('SEARCHCATEGORY', t('lbl.SELECT'), '')}
 						options={getContracttype()}
 						fieldNames={{ label: 'cdNm', value: 'comCd' }}
 						placeholder="선택해주세요"
 					/>
 					<InputText name="searchVal" allowClear />
 				*/}

			<li style={{ gridColumn: 'span 3' }} className="flex-wrap">
				<Col span={3}>
					<CheckBox name="contracttype" trueValue={'1'} falseValue={'0'}>
						{t('lbl.EXCLUDE_SAMEDAY_PURCHAE_SALES')}
					</CheckBox>
				</Col>
				<Col>
					<CheckBox name="qtyxzero" trueValue={'1'} falseValue={'0'}>
						{t('lbl.SELECT_ZERO_QTY')}
					</CheckBox>
				</Col>
			</li>
			<Form.Item name="category" hidden>
				<Input />
			</Form.Item>
		</>
	);
};

export default StExDCStorageSearch;
