/*
 ############################################################################
 # FiledataField	: StInquirySearch.tsx
 # Description		: 재고 > 재고작업 > 재고조사등록 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.11.02
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputRange, InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';
import { useSelector } from 'react-redux';

const StInquirySearch = forwardRef((props: any) => {
	const { t } = useTranslation();
	const { form, dates, activeKey, searchTypeList } = props;
	const dateFormat = 'YYYY-MM-DD';
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const fixdccode = Form.useWatch('fixdccode', form);
	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();

		// 현재 선택된 물류센터(dccode)에 해당하는 zone 리스트를 안전하게 읽기
		const zones = getMsZoneList(form.getFieldValue('fixdccode')) || [];

		// zones 객체의 필드 네이밍은 여러 형태(baseCode/basecode/BASECODE 등)일 수 있으므로 안전하게 추출
		const zoneMap = zones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }, ...zoneMap]);

		form.setFieldValue('fromZone', '');
		form.setFieldValue('toZone', '');
	};

	// 센터에 해당되는 zone 정보 조회
	useEffect(() => {
		loadZone();

		form.setFieldValue('fixdccode', gDccode);
	}, []);

	return (
		<>
			{activeKey === '1' && (
				<>
					{/* 조사일자 */}
					<li>
						<Rangepicker
							label={t('lbl.INQUIRYDT')}
							name="inquirydt"
							defaultValue={dates}
							format={dateFormat}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
				</>
			)}
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					onChange={async () => {
						loadZone();
					}}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="single"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccode}
					label="창고"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixdccode)) {
							if (fixdccode.length < 1) {
								return true;
							}
							return fixdccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixdccode !== '2170' && fixdccode !== '1000';
						}
					})()}
				/>
			</li>
			{activeKey === '1' && (
				<>
					{/* 조사번호 */}
					<li>
						<InputText
							label={t('lbl.INQUIRYNO')}
							name="inquiryno"
							placeholder={t('msg.placeholder2', [t('lbl.INQUIRYNO')])}
							onPressEnter={() => props.search}
						/>
					</li>
				</>
			)}
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 피킹존 */}
			<li className="range-align">
				<SelectBox
					label={t('lbl.ZONE')}
					name="fromZone"
					options={zoneOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				<span>-</span>
				<SelectBox name="toZone" options={zoneOptions} fieldNames={{ label: 'cdNm', value: 'comCd' }} />
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					label={t('lbl.INQUIRYSTATUS')}
					name="status"
					options={getCommonCodeList('STATUS_INQUIRY', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{activeKey === '1' && (
				<>
					{/* 재고조사 별칭 */}
					<li>
						<InputText
							label={t('lbl.INQUIRY_ALIAS')}
							name="inquiryAlias"
							placeholder={t('msg.placeholder1', [t('lbl.INQUIRY_ALIAS')])}
							onPressEnter={() => props.search}
						/>
					</li>
					{/* 로케이션(From~To) */}
					<li>
						<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromLoc" toName="toLoc" />
					</li>
					{/* 실사구분 */}
					<li>
						<SelectBox
							label={t('lbl.INV_CHECK_TYPE')}
							name="lottype"
							options={searchTypeList}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>

					{/* 창고구분 */}
					<li>
						<SelectBox
							label={t('lbl.WHAREA')}
							name="wharea"
							options={getCommonCodeList('WHAREA', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
});

export default StInquirySearch;
