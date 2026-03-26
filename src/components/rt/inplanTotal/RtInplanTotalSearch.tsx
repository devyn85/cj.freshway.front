/*
 ############################################################################
 # FiledataField	: RtInplanTotalSearch.tsx
 # Description		: 반품진행현황(Search)
 # Author			: 공두경
 # Since			: 25.06.04
 ############################################################################
*/

import { apiPostClaimTypeList } from '@/api/rt/apiRtQCConfirmResult';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckboxGroup, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Col, Form } from 'antd';

const dateFormat = 'YYYY-MM-DD';

const RtInplanTotalSearch = (props: any) => {
	const { search, form } = props;
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [claimtypeOptions, setClaimtypeOptions] = useState([]);

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const initEvent = async () => {
		const { data } = await apiPostClaimTypeList({});
		const options = [
			{ label: t('lbl.ALL'), value: '' },
			...data.map((item: any) => ({
				label: item.LABEL,
				value: item.VALUE,
			})),
		];
		const distinct = Object.values(
			options.reduce((acc: any, { label, value }: any) => {
				if (!acc[label]) {
					acc[label] = { label, value: [] };
				}
				acc[label].value.push(value);
				return acc;
			}, {}),
		).map((item: any) => ({
			label: item.label,
			value: item.value.join(','),
		}));
		setClaimtypeOptions(distinct);
	};

	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 기간(반품요청일자/반품입고일자)*/}
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
				<MultiInputText
					label={t('lbl.SOURCEKEY_RT')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
					onPressEnter={search}
				/>
			</li>
			{/* 관리처 코드(고객코드/명) */}
			<li>
				<CmCustSearch form={form} label={t('lbl.FROM_VATNO')} name="fromcustkeyNm" code="fromcustkey" />
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
					name="sotype"
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
			{/* VoC(소) */}
			<li>
				<SelectBox
					label={t('lbl.CLAIMDTLIDS')}
					name="claimdtlids"
					placeholder="선택해주세요"
					options={claimtypeOptions}
				/>
			</li>
			{/* 반품회수정보 포함 */}
			<li>
				<CheckboxGroup
					label={t('lbl.ETC')}
					name="returnInfoYn"
					options={[{ label: '반품회수정보 포함', value: '1' }]}
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
};

export default RtInplanTotalSearch;
