/*
 ############################################################################
 # FiledataField	: StStockLabelSearch.tsx
 # Description		: 재고 > 재고현황 > 재고라벨출력 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const StStockLabelSearch = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { form } = props; // Antd Form
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const user = useAppSelector(state => state.user.userInfo);
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: '전체', baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	// * 초기값 세팅
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		form.setFieldValue('docdt', [dt1, dt2]);

		loadZone(); // 센터에 해당되는 zone 정보 조회

		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}

		// 권한에 따라 DC 선택박스 활성화/비활성화
		if (
			user.roles?.includes('00') ||
			user.roles?.includes('20') ||
			user.roles?.includes('000') ||
			user.roles?.includes('200')
		) {
			form.setFieldValue('fixdccodeDisabled', false); // 사용가능
		} else {
			form.setFieldValue('fixdccodeDisabled', true);
		}

		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					mode={'single'}
					disabled={form.getFieldValue('fixdccodeDisabled')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					onChange={async () => {
						loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
					label="창고"
				/>
			</li>
			{/* 소비기한여부 */}
			<li>
				<SelectBox
					name="lottable01yn"
					label="소비기한여부"
					options={getCommonCodeList('YN2', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					name="stocktype"
					label="재고위치"
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					label="재고속성"
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label="저장조건"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* 개체식별/소비이력 */}
			<li>
				<InputText label={t('lbl.STOCKID')} name="stockid" />
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
			{/* 이력번호 */}
			<li style={{ gridColumn: ' / span 0' }}>
				<InputText label="이력번호" name="serialno" />
			</li>
		</>
	);
});

export default StStockLabelSearch;
