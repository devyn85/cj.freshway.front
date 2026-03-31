import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import Datepicker from '@/components/common/custom/form/Datepicker';

const OmCloseSearch = (props: any) => {
	const { t } = useTranslation();

	return (
		<>
			{/* 전표일자 */}
			<li>
				<Datepicker name="slipDt" allowClear showNow={false} label={t('lbl.SLIPDT')} />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
		</>
	);
};

export default OmCloseSearch;
