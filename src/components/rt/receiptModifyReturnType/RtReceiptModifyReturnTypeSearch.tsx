/*
 ############################################################################
 # FiledataField	: RtReceiptModifyReturnTypeSearch.tsx
 # Description		: 반품 > 반품작업 > 반품회수/미회수변경 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.09.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Col, Form } from 'antd';

const RtReceiptModifyReturnTypeSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	const dateFormat = 'YYYY-MM-DD';
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	const { t } = useTranslation();

	return (
		<>
			{/* 일자(반품요청일자/입고일자) */}
			<li>
				<span>
					<Col span={7}>
						<SelectBox
							name="searchDate"
							placeholder="선택해주세요"
							required
							options={[
								{
									label: t('lbl.DOCDT_RT'),
									value: 'req',
								},
								{
									label: t('lbl.RETURNDATE_RT'),
									value: 'return',
								},
							]}
						/>
					</Col>
					<Col span={16}>
						<Rangepicker
							name="slipdt"
							defaultValue={dates}
							format={dateFormat}
							span={24}
							allowClear
							showNow={false}
							//nChange={handleDateChange}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</Col>
				</span>
			</li>
			{/* 물류센터(물류센터코드/명) */}
			<li>
				{/* 물류센터(물류센터코드/명) */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>
			{/* 구분 */}
			<li>
				{/* 창고코드 */}
				<CmOrganizeSearch //창고
					form={form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						return fixdccodeWatch !== '2170' && fixdccodeWatch !== '1000';
					})()}
				/>
			</li>
			{/* 고객반품주문번호 */}
			<li>
				<MultiInputText
					label={t('lbl.SOURCEKEY_RT')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
				/>
			</li>
			{/* 반품유형 */}
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_RT')}
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_RT', t('lbl.ALL')).filter((item: any) => !['90'].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" required={false} />
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
			{/* 저장유무 */}
			<li>
				<SelectBox
					name="channel"
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			{/* 주문사유 */}
			{/* <li>
				<SelectBox
					name="potype"
					span={24}
					options={getCommonCodeList('POTYPE_RT', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.POTYPE_RT')}
				/>
			</li> */}
			{/* 회수여부 */}
			<li>
				<SelectBox
					label={t('lbl.RETURNTYPE_RT')}
					name="returntype"
					placeholder="선택해주세요"
					options={getCommonCodeList('RETURNTYPE_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 협력사반품 */}
			<li>
				<SelectBox
					label={t('lbl.VENDORETURNYN')}
					name="vendoreturn"
					placeholder="선택해주세요"
					options={getCommonCodeList('VENDORETURNYN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default RtReceiptModifyReturnTypeSearch;
