/*
 ############################################################################
 # FiledataField	: RtInplanSNSearch.tsx
 # Description		: 이력상품반품현황(Search)
 # Author			: 공두경
 # Since			: 25.05.28
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Col, Form } from 'antd';
import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD';

const RtInplanSNSearch = (props: any) => {
	const { search, form } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	const { t } = useTranslation();

	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 기간(반품요청일자/반품입고일자) */}
			<li>
				<span>
					<Col span={7}>
						<SelectBox
							name="searchDateType"
							placeholder="선택해주세요"
							required
							options={getCommonCodeList('DATETYPE_RT', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</Col>
					<Col span={16}>
						<Rangepicker
							name="docdtRange"
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
					form={props.form}
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
				<InputText
					label={t('lbl.SOURCEKEY_RT')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
					onPressEnter={search}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 상품코드(상품코드/명) */}
			<li>
				<CmSkuSearch form={form} label={t('lbl.SKU')} name="skuNm" code="sku" />
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장유무 */}
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')}
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					label={t('lbl.STATUS_RT')}
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 주문사유 */}
			{/*<li>
				<SelectBox
					label={t('lbl.POTYPE_RT')} 
					name="potype"
					placeholder="선택해주세요"
					options={getCommonCodeList('SOTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>*/}
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
			{/* 반품유형 */}
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_RT')}
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* B/L 번호 */}
			<li>
				<InputText
					label={t('lbl.BLNO')}
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					onPressEnter={search}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText
					label={t('lbl.SERIALNO')}
					name="serialno"
					placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
					onPressEnter={search}
				/>
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch form={form} label={t('lbl.CONTRACTCOMPANY')} name="custkeyNm" code="custkey" />
			</li>
		</>
	);
};

export default RtInplanSNSearch;
