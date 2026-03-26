import { apiGetStatusList } from '@/api/om/apiOmInplan';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const OmInplanSearch = (props: any) => {
	const { form } = props;
	const { t } = useTranslation();

	const [statusOptions, setStatusOptions] = useState([]);

	useEffect(() => {
		const params = {};
		apiGetStatusList(params).then(res => {
			res.data.unshift({
				BASEDESCR: '--- 전체---',
				BASECODE: '',
			});

			setStatusOptions(res.data || []);
		});
	}, []);

	return (
		<>
			{/* 출고일자 */}
			<li>
				<Rangepicker name="rangeDocDt" allowClear showNow={false} label={t('lbl.DOCDT_WD')} />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			{/* 주문번호 */}
			<li>
				<InputText name="docNo" placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.ORDRNUM')])} label={t('lbl.ORDRNUM')} />
			</li>
			{/* 협력사코드 */}
			<li>
				<CmPartnerSearch form={form} label={t('lbl.VENDOR')} name="venderNm" code="venderCd" />
			</li>
			{/* 상품코드(상품코드/명) */}
			<li>
				<CmSkuSearch form={form} label={t('lbl.LBL_SKU')} name="skuNm" code="skuCd" selectionMode="multipleRows" />
			</li>
			{/* 관리처코드(고객코드/명) */}
			<li>
				<CmCustSearch form={form} label={t('lbl.TO_CUSTKEY_WD')} name="custNm" code="custKey" />
			</li>
			{/* 저장유무 */}
			<li>
				<SelectBox
					name="channelD"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', '--- 전체---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'저장유무'}
				/>
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					name="status"
					placeholder="선택해주세요"
					options={statusOptions}
					fieldNames={{ label: 'BASEDESCR', value: 'BASECODE' }}
					label={t('lbl.STATUS')}
				/>
			</li>
			{/* 삭제여부 */}
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'삭제여부'}
				/>
			</li>
			{/* 영업조직 */}
			<li>
				<SelectBox
					name="saleGroup"
					placeholder="선택해주세요"
					options={getCommonCodeList('SALEORGANIZE', '--- 전체---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SALEGROUP')}
				/>
			</li>
			{/* 수정일시: format 키보드로 12자리 입력할 수 있게 추가 */}
			<li>
				<Rangepicker
					name="modifyDt"
					allowClear
					showNow={false}
					label={t('lbl.EDITDATE')}
					showTime={{ format: 'HH:mm' }}
					format={'YYYY-MM-DD HH:mm'}
				/>
			</li>
		</>
	);
};

export default OmInplanSearch;
