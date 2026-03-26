/*
 ############################################################################
 # FiledataField	: StInquiryInplanSearch.tsx
 # Description		: 재고 > 재고작업 > 재고 실사 지시 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.10.28
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputNumber, InputRange, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';
import { useSelector } from 'react-redux';

const StInquiryInplanSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, activeKey } = props; // Antd Form
	const [zoneOptions, setZoneOptions] = useState([]); // 피킹존 옵션 상태
	const [exZoneOptions, setExZoneOptions] = useState([]); // 제외존

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const fixdccode = Form.useWatch('fixdccode', form);

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

		// 제외존
		//setExZoneOptions([{ comCd: '', cdNm: t('lbl.SELECT') }, ...zoneMap]);
		setExZoneOptions([...zoneMap]);

		form.setFieldValue('fromzone', '');
		form.setFieldValue('tozone', '');
		//form.setFieldValue('excludeZone', '');

		// gridRef.current?.clearGridData();
		// gridRef1.current?.clearGridData();
		// gridRef.current?.setGridData?.([]);
		// gridRef1.current?.setGridData?.([]);
	};

	useEffect(() => {
		// 센터에 해당되는 zone 정보 조회
		loadZone();

		form.setFieldValue('fixdccode', gDccode);
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					onChange={async () => {
						loadZone(); // 센터에 해당되는 zone 정보 조회
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
			{/* 제외존 */}
			<li>
				<SelectBox
					name="excludeZone"
					span={24}
					label={t('lbl.EXCLUDE_ZONE')}
					mode="multiple"
					options={exZoneOptions}
					initval={[]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder={t('msg.selectBox')}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label={t('lbl.STORAGETYPE')}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 피킹존 */}
			<li className="range-align">
				<SelectBox
					label={t('lbl.ZONE')}
					name="fromzone"
					options={zoneOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				<span>-</span>
				<SelectBox name="tozone" options={zoneOptions} fieldNames={{ label: 'cdNm', value: 'comCd' }} />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					label={t('lbl.STOCKTYPE')}
					name="stocktype"
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					label={t('lbl.STOCKGRADE')}
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션(From~To) */}
			<li>
				<InputRange
					label={t('lbl.LOCATION_FROM_TO')}
					fromName="fromloc"
					toName="toloc"
					onPressEnter={() => props.search()}
				/>
			</li>
			{/* 로케이션종류 */}
			<li>
				<SelectBox
					label={t('lbl.LOCCATEGORY')}
					name="loccategory"
					options={getCommonCodeList('LOCCATEGORY', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 소비기한잔여(%)  */}
			<li>
				<InputNumber name="usebydatefreert" label={t('lbl.USEBYDATE_FREE_RT')} />
			</li>
			{/* 소비기한(전체)  */}
			<li>
				<InputNumber name="duration" label={t('소비기한(전체)')} />
			</li>

			{/* 실사구분 */}
			{/* <li>
				<RadioBox
					label={t('lbl.INV_CHECK_TYPE')}
					name="searchtype"
					options={radioOption}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li> */}
		</>
	);
};
export default StInquiryInplanSearch;
