/*
 ############################################################################
 # FiledataField	: DpTaskSearch.tsx
 # Description		: 입고 > 입고작업 > 입고검수지정 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.31
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuGroup1Search from '@/components/cm/popup/CmSkuGroup1Search';
import CmSkuGroup2Search from '@/components/cm/popup/CmSkuGroup2Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store

// Libs
import { Form } from 'antd';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch20251208';

// Utils

const DpTaskSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const rangeRef = useRef(null);

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const skugroup1 = Form.useWatch('skugroup1', form);
	const skuGroup2SearchRef = useRef(null);
	useEffect(() => {
		form.setFieldValue('skugroupname2', skugroup1);
		if (commUtil.isNotEmpty(skugroup1)) {
			skuGroup2SearchRef.current.searchEnter(skugroup1);
		}
	}, [skugroup1]);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.INSPINPLANDT_DP')} //광역입고일자
					name="docdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
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
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromcustkeyNm"
					code="fromcustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
				/>
			</li>
			<li>
				<CmSkuGroup1Search
					form={form} //상품
					// selectionMode="multipleRows"
					name="skugroupname1"
					code="skugroup1"
					required={false}
					label={t('lbl.SKUGROUP1')}
				/>
			</li>
			<li>
				<CmSkuGroup2Search
					form={form} //상품
					// selectionMode="multipleRows"
					name="skugroupname2"
					code="skugroup2"
					required={false}
					label={t('lbl.SKUGROUP2')}
					ref={skuGroup2SearchRef}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form} //상품
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					required={false}
				/>
			</li>
		</>
	);
};

export default DpTaskSearch;
