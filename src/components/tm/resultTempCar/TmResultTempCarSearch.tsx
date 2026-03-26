/*
 ############################################################################
 # FiledataField	: TmResultTempCar.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 ############################################################################
*/

import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface TmResultTempCarProps {
	form: any;
}
const TmResultTempCarSearch = (props: TmResultTempCarProps) => {
	const { t } = useTranslation();
	const form = props.form;

	return (
		<>
			{/* 출고일자 */}
			<li>
				<Datepicker
					name="deliverydt"
					allowClear
					showNow={false}
					label={t('lbl.DOCDT_WD')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="month"
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
				/>
			</li>
			{/* 운송사코드/명 */}
			<li>
				<CmCarrierSearch
					form={form}
					name="carrierName"
					code="carrier"
					selectionMode="singleRow"
					returnValueFormat="name"
				/>
			</li>
			{/* 차량/POP 번호 조회 */}
			<li>
				<CmCarPopSearch
					form={form}
					name="carnoName"
					code="carno"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			{/* 배송유형 : 전체, 배송, 수송, 조달(일배), 조달(저장), 반품, 고객자차 */}
			<li>
				<SelectBox
					name="tmDeliveryType"
					label="배송유형"
					options={getCommonCodeList('TM_DELIVERYTYPE', '전체').filter(
						item => item.comCd !== '5' && item.comCd !== '8',
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* <li>
				<SelectBox
					name="contractType"
					label="차량분류"
					options={getCommonCodeList('CONTRACTTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					// span={24}
				/>
			</li>
			<li>
				<SelectBox
					name="courier"
					label="배송그룹"
					options={getCommonCodeList('COURIER', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					// span={24}
				/>
			</li>
			<li>
				<CmDistrictSearch
					form={form}
					name="districtName"
					code="district"
					selectionMode="singleRow"
					returnValueFormat="name"
				/>
			</li> */}
		</>
	);
};

export default TmResultTempCarSearch;
