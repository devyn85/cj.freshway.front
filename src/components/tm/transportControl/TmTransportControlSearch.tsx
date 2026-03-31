/*
 ############################################################################
 # FiledataField	: TmTransportControlSearch.tsx
 # Description		: 정산 > 운송비정산 > 수송배차조정 (조회)
 # Author					: JiHoPark
 # Since					: 2025.11.05.
 ############################################################################
*/

import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface TmTransportControlSearchProps {
	form: any;
}

const TmTransportControlSearch = (props: TmTransportControlSearchProps) => {
	const { t } = useTranslation();
	const { form } = props;

	return (
		<>
			{/* 배송일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DELIVERYDATE')}
					name="deliverydt"
					format={'YYYY-MM-DD'}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 출발물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					label={t('lbl.FROMDCCODE2')}
					allLabel={t('lbl.ALL')}
					disabled={false}
					name={'fromDcCode'}
				/>
			</li>
			{/* 도착물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					label={t('lbl.TODCCODE2')}
					allLabel={t('lbl.ALL')}
					disabled={false}
					name={'toDcCode'}
				/>
			</li>
			{/* 차량번호 */}
			<li>
				<CmCarSearch label={t('lbl.VHCNUM')} form={form} code="carno" name="carnoNm" selectionMode="multipleRows" />
			</li>
			{/* 운송사코드/명 */}
			<li>
				<CmCarrierSearch
					form={form}
					selectionMode="multipleRows"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
				/>
			</li>
			{/* 계약유형 */}
			<li>
				<SelectBox
					label={t('lbl.CONTRACTTYPE')}
					name="contracttype"
					options={getCommonCodeList('CONTRACTTYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					options={getCommonCodeList('TM_CARRIER_STORAGE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 톤급 */}
			<li>
				<SelectBox
					label={t('lbl.TON_GRADE')}
					name="carcapacity"
					options={getCommonCodeList('CARCAPACITY', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 경유여부 */}
			<li>
				<SelectBox
					label={t('lbl.ROUTEYN')}
					name="routeYn"
					options={getCommonCodeList('YN', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default TmTransportControlSearch;
