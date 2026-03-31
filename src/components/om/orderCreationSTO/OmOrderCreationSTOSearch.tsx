import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const OmOrderCreationSTOSearch = ({ form }: any) => {
	const [zoneOptions, setZoneOptions] = useState([]);

	const { t } = useTranslation();

	// 이체유형 값 감시
	const stotype = Form.useWatch('stotype', { form });
	const fixToDccode = Form.useWatch('todccode', form);
	const fixFromDccode = Form.useWatch('fromdcname', form);

	/**
	 * 센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: t('lbl.ALL'), baseCode: '' }, ...getMsZoneList(form.getFieldValue('fromdcname'))]);
		form.setFieldValue('zone', '');
	};

	/**
	 * 이체유형 변경 시 재고위치 옵션 필터링
	 * 1. 이체유형이 '일반 STO'(STO) => 재고위치 항목 중 정상(1000)만 선택 가능
	 * 2. 이체유형이 '반품 STO'(RSTO) => 재고위치 항목 중 불량(2000)만 선택 가능
	 */
	const filterStocktype = () => {
		const allOptions = getCommonCodeList('STOCKTYPE');

		if (stotype === 'STO') {
			form.setFieldValue('stocktype', 'GOOD');
			return allOptions.filter(opt => opt.comCd === 'GOOD' || opt.comCd === '');
		} else if (stotype === 'RSTO') {
			form.setFieldValue('stocktype', 'BAD');
			return allOptions.filter(opt => opt.comCd === 'BAD' || opt.comCd === '');
		}

		// 이체유형 미선택 시 전체
		return allOptions;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 2025-11-14 타 페이지에서 변경한 물류센터로 동기화 되는 문제가 있어서 수정
	useEffect(() => {
		// if (gDccode) {
		// 	form.setFieldValue('fromdcname', gDccode);

		// 	/**
		// 	 * 요청사항(초기 로드시 회색 상태로)
		// 	 * CmOrganizeSearch 컴포넌트에서 code 필드도 설정하여 readOnly 상태 활성화
		// 	 * settingSelectData()
		// 	 */
		// 	// form.setFieldValue('fromdccode', gDccode);
		// }

		loadZone();
	}, []);

	useEffect(() => {
		form.setFieldsValue({
			organizenm: '',
			organize: '',
		});
	}, [fixToDccode]);
	useEffect(() => {
		form.setFieldsValue({
			fromOrganizenm: '',
			fromOrganize: '',
		});
	}, [fixFromDccode]);

	return (
		<>
			{/* 이체일자 */}
			<li>
				<DatePicker
					name="deliverydate"
					label={t('lbl.DOCDT_STO')}
					required
					allowClear
					showNow={true}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 공급센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'fromdcname'}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.FROM_DCCODE')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 창고(공급센터) */}
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="fromOrganizenm"
					code="fromOrganize"
					returnValueFormat="name"
					dccode={Array.isArray(fixFromDccode) ? fixFromDccode[0] : fixFromDccode}
					label="창고(공급센터)"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixFromDccode)) {
							if (fixFromDccode.length < 1) {
								return true;
							}
							return fixFromDccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixFromDccode !== '2170' && fixFromDccode !== '1000';
						}
					})()}
				/>
			</li>
			{/* 이체유형 */}
			<li>
				<SelectBox
					label={t('lbl.STOTYPE')}
					name="stotype"
					options={[
						{ comCd: 'STO', cdNm: '일반 STO' },
						{ comCd: 'RSTO', cdNm: '반품 STO' },
					]}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.STOTYPE')])}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
					required
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" label={t('lbl.SKU')} />
			</li>
			{/* 공급받는센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'todccode'}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')}
				/>
			</li>
			{/* 창고(공급받는센터) */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={Array.isArray(fixToDccode) ? fixToDccode[0] : fixToDccode}
					label="창고(공급받는센터)"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixToDccode)) {
							if (fixToDccode.length < 1) {
								return true;
							}
							return fixToDccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixToDccode !== '2170' && fixToDccode !== '1000';
						}
					})()}
				/>
			</li>
			{/* 식별번호유무 */}
			<li>
				<SelectBox
					name="identifynumber"
					label={t('lbl.SERIALYN')}
					options={getCommonCodeList('SERIALYN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션(FROM~TO)  */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromlocation" toName="tolocation" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					name="stocktype"
					label={t('lbl.STOCKTYPE')}
					options={filterStocktype()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					label={t('lbl.STOCKGRADE')}
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label={t('lbl.STORAGETYPE')}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 소비기한여부 */}
			<li>
				<SelectBox
					name="lottable01yn"
					label={t('lbl.LOTTABLE01YN')}
					options={getCommonCodeList('LOTTABLE01_YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 정렬순서 */}
			<li>
				<SelectBox
					name="sortorder"
					label={t('lbl.SORTKEY')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					options={[
						{ comCd: 'LOC', cdNm: '로케이션/상품/기준일 순' },
						{ comCd: 'DATE', cdNm: '상품/기준일 순' },
						{ comCd: null, cdNm: t('lbl.ALL') },
					]}
				/>
			</li>
			{/* 피킹존 */}
			<li>
				<SelectBox
					name="zone"
					label={t('lbl.ZONE')}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
				/>
			</li>
			{/* B/L 번호 */}
			<li>
				<InputText name="blno" label={t('lbl.BLNO')} placeholder={t('msg.placeholder1', [t('lbl.BLNO')])} />
			</li>
			{/* 이력번호 */}
			<li>
				<InputText name="serialno" label={t('lbl.SERIALNO')} placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])} />
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch form={form} name="custkey" code="custkey" label={t('lbl.CONTRACTCOMPANY')} />
			</li>
		</>
	);
};

export default OmOrderCreationSTOSearch;
