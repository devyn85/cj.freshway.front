/*
 ############################################################################
 # FiledataField	: RtQCConfirmSearch.tsx
 # Description		: 반품 > 반품작업 > 반품판정처리 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.09.23
 ############################################################################
*/
import { apiPostClaimTypeList } from '@/api/rt/apiRtQCConfirmResult';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const RtQCConfirmSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const dateFormat = 'YYYY-MM-DD';
	const [claimtypeOptions, setClaimtypeOptions] = useState([]);

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	// * 클레임사유(반품사유) 옵션을 서버에서 조회 후 "전체" 옵션을 포함해 셀렉트 옵션으로 변환한다.
	const initOptions = async () => {
		const { data } = await apiPostClaimTypeList({});
		setClaimtypeOptions([
			{ label: t('lbl.ALL'), value: '' },
			...data.map((item: any) => ({
				label: item.LABEL,
				value: item.VALUE,
			})),
		]);
	};

	/**
	 * =====================================================================
	 *	02. 렌더링 : 기존과 동일한 렌더링 순서를 보장하기 위해 "순서 단위"로만 묶어서 재사용
	 * =====================================================================
	 */

	// * activeKey=1에서만 등장하는 상단(슬립일자~상품코드) 구간 매핑
	const renderTab1HeadFields = () => (
		<>
			{/*<li>*/}
			{/*	<InputText*/}
			{/*		label={t('lbl.DOCNO_RT')} //주문번호 */}
			{/*		name="docnoWd"*/}
			{/*		placeholder={t('msg.placeholder1', [t('lbl.DOCNO_RT')])}*/}
			{/*		// required*/}
			{/*		// rules={[{ required: true, validateTrigger: 'none' }]}*/}
			{/*	/>*/}
			{/*</li>*/}

			{/* 반품요청일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_RT')}
					name="slipdt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 물류센터(물류센터코드/명) */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>

			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
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

			{/* 고객코드(고객코드/명) */}
			<li>
				<CmCustSearch form={form} name="fromCustkeyNm" code="fromCustkey" label={t('lbl.CUSTKEY_WD')} />
			</li>

			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" required={false} />
			</li>
		</>
	);

	// * activeKey=1 (판정 탭)에서만 등장하는 하단(저장조건~사업장) 구간 매핑
	const renderTab1TailFields = () => (
		<>
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

			{/* 협력사코드(협력사코드/명) */}
			<li>
				<CmPartnerSearch form={form} name="toCustkeyNm" code="toCustkey" label={t('lbl.PARTNER_CD')} />
			</li>

			{/* 클레임사유 */}
			<li>
				<SelectBox
					label={t('lbl.OTHER03_DMD_RT')}
					name="other03"
					placeholder="선택해주세요"
					options={claimtypeOptions}
				/>
			</li>

			{/* 협력사반품 */}
			<li>
				<SelectBox
					name="vendoreturnyn"
					span={24}
					options={getCommonCodeList('VENDORETURNYN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.VENDORETURNYN')}
				/>
			</li>

			{/* 처리상태 */}
			<li>
				<SelectBox
					label={t('lbl.QCSTATUS_RT')}
					name="statusRtqc"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_RTQC', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>

			{/* 영업조직 */}
			<li>
				<SelectBox
					name="salegroup"
					span={24}
					options={getCommonCodeList('SALEGROUP', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SALEGROUP')}
				/>
			</li>

			{/* 사업장 */}
			<li>
				<SelectBox
					name="saledepartment"
					span={24}
					options={getCommonCodeList('SALEDEPARTMENT', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SALEDEPARTMENT')}
				/>
			</li>
		</>
	);

	// * activeKey=2,3에서 공통으로 쓰는 상단(슬립일자~창고) 구간 매핑
	const renderTab23HeadFields = () => (
		<>
			{/* 반품요청일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_RT')}
					name="slipdt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 물류센터(물류센터코드/명) */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>

			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
		</>
	);

	// * activeKey=2,3 (판정, 처리 탭)에서 공통으로 쓰는 하단(고객~사업장) 구간 매핑
	const renderTab23TailFields = () => (
		<>
			{/* 고객코드(고객코드/명) */}
			<li>
				<CmCustSearch form={form} name="fromCustkeyNm" code="fromCustkey" label={t('lbl.CUSTKEY_WD')} />
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

			{/* 협력사코드(협력사코드/명) */}
			<li>
				<CmPartnerSearch form={form} name="toCustkeyNm" code="toCustkey" label={t('lbl.PARTNER_CD')} />
			</li>

			{/* 영업조직 */}
			<li>
				<SelectBox
					name="salegroup"
					span={24}
					options={getCommonCodeList('SALEGROUP', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SALEGROUP')}
				/>
			</li>

			{/* 사업장 */}
			<li>
				<SelectBox
					name="saledepartment"
					span={24}
					options={getCommonCodeList('SALEDEPARTMENT', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SALEDEPARTMENT')}
				/>
			</li>
		</>
	);

	// * activeKey=2 (처리 탭)에서만 존재하는 처리구분 필드
	const renderTab2MidFields = () => (
		<>
			{/* 처리구분 */}
			<li>
				<SelectBox
					name="qctype"
					span={24}
					required
					options={getCommonCodeList('QCTYPE_RT')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.QCTYPE_RT')}
				/>
			</li>
		</>
	);

	/**
	 * =====================================================================
	 *  04. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initOptions();
	}, []);

	return (
		<>
			{activeKey === '1' && (
				<>
					{renderTab1HeadFields()}
					{renderTab1TailFields()}
				</>
			)}

			{activeKey === '2' && (
				<>
					{renderTab23HeadFields()}
					{renderTab2MidFields()}
					{renderTab23TailFields()}
				</>
			)}

			{activeKey === '3' && (
				<>
					{renderTab23HeadFields()}
					{renderTab23TailFields()}
				</>
			)}
		</>
	);
};

export default RtQCConfirmSearch;
