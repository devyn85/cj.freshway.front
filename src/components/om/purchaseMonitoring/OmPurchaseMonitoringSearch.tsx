/*
 ############################################################################
 # FiledataField	: OmPurchaseMonitoringSearch.tsx
 # Description		: 주문 > 주문등록 > 저장품발주현황
 # Author			: JeongHyeongCheol
 # Since			: 25.09.10
 ############################################################################
*/
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

interface OmPurchaseMonitoringSearchProps {
	form?: any;
	activeTabKey?: string;
}

const OmPurchaseMonitoringSearch = (props: OmPurchaseMonitoringSearchProps) => {
	const { form, activeTabKey } = props;
	const { t } = useTranslation();

	const purchasetypeOptions = [
		{ comCd: null, cdNm: t('lbl.ALL') },
		{ comCd: 'PO', cdNm: 'PO' },
		{ comCd: 'STO', cdNm: 'STO' },
	];

	const stepOptions = [
		{ comCd: 1, cdNm: t('lbl.RECEIVING_SCHEDULED_DATE') + '(1단계)' }, // 입고예정일
		{ comCd: 2, cdNm: t('lbl.DP_CENTER') + '(2단계)' }, // 입고센터
		{ comCd: 3, cdNm: t('lbl.POMDCODE') + '(3단계)' }, // 수급담당
		{ comCd: 4, cdNm: t('lbl.PARTNER') + '(4단계)' }, // 협력사
		{ comCd: 5, cdNm: t('lbl.SKU2') + '(5단계)' }, // 상품
	];

	const cbxGrpopts = [
		{
			label: t('lbl.ALL'),
			value: 'ALL',
		},
		{
			label: 'PO',
			value: 'PO',
		},
		{
			label: 'STO',
			value: 'STO',
		},
	];

	/**
	 * 날짜 set
	 */
	useEffect(() => {
		const date = dayjs();
		form.setFieldValue('requestdt', [date, date]);
		form.setFieldValue('requestdt2', [date, date]);
	}, []);

	return (
		<>
			{activeTabKey === '1' && (
				<>
					{/* 입고일자 */}
					<li>
						<Rangepicker
							name="requestdt"
							allowClear
							showNow={false}
							label={t('lbl.DOCDT_DP')}
							hasCheckboxForPeriodExtension={true}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 입고센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="dccode"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							mode="multiple"
							label={t('lbl.DP_CENTER')}
						/>
					</li>
					{/* 수급담당 */}
					<li>
						<SelectBox
							name="buyerkey"
							label={t('lbl.POMDCODE')}
							options={getCommonCodeList('BUYERKEY', t('lbl.ALL'), 'all')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							mode="multiple"
						/>
					</li>
					{/* 발주구분 */}
					<li>
						<SelectBox
							name="purchasetype"
							label={t('lbl.PURCHASETYPE_PO')}
							options={purchasetypeOptions}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 협력사코드 */}
					<li>
						<CmPartnerSearch
							label={t('lbl.PARTNER_CD')}
							form={form}
							name="custkeyname"
							code="custkey"
							selectionMode="multipleRows"
						/>
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>

					{/* 저장조건 */}
					<li>
						<SelectBox
							name="storagetype"
							label={t('lbl.STORAGETYPE')}
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							mode="multiple"
						/>
					</li>
					{/* 단계 */}
					<li>
						<SelectBox
							name="level"
							label={'단계'}
							initval={1}
							options={stepOptions}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{activeTabKey === '2' && (
				<>
					{/* 입고일자 */}
					<li>
						<Rangepicker
							name="requestdt2"
							allowClear
							showNow={false}
							label={t('lbl.DOCDT_DP')}
							hasCheckboxForPeriodExtension={true}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 입고센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="dccode2"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							mode="multiple"
							label={t('lbl.DP_CENTER')}
						/>
					</li>
					{/* 수급담당 */}
					<li>
						<SelectBox
							name="buyerkey2"
							label={t('lbl.POMDCODE')}
							options={getCommonCodeList('BUYERKEY', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							mode="multiple"
						/>
					</li>
					{/* 발주구분 */}
					<li>
						<RadioBox
							label={t('lbl.PURCHASETYPE_PO')}
							name="purchasetype2"
							span={24}
							options={cbxGrpopts}
							required
							rules={[{ required: false, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							name="storagetype2"
							label={t('lbl.STORAGETYPE')}
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							mode="multiple"
						/>
					</li>
				</>
			)}
		</>
	);
};

export default OmPurchaseMonitoringSearch;
