/*
 ############################################################################
 # FiledataField	: DpSkuLabelInspectSearch.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(검수) 조회 조건 화면
 # Author			: YangChangHwan
 # Since			: 25.06.23
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpSkuLabelInspectSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, initialValues, dates, setDates } = props;
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	// const { dates, setDates } = initialValues;

	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const datesChangeEvent = useCallback(
		(value: any[], dateStrings: string[]) => {
			const [slipdtFrom, slipdtTo] = value;

			form.setFieldValue('slipdtFrom', slipdtFrom);
			form.setFieldValue('slipdtTo', slipdtTo);
			// form.setFieldsValue({ slipdtFrom, slipdtTo });

			setDates(() => {
				form.setFieldValue('slipdtFrom', slipdtFrom);
				form.setFieldValue('slipdtTo', slipdtTo);
				// form.setFieldsValue({ slipdtFrom, slipdtTo });

				return [...value];
			});
		},
		// [form],
		[],
	);

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//검색영역 줄 높이
	useEffect(() => {
		setExpanded(true);

		setTimeout(() => {
			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) return;

			const firstLiHeight = liElements[0].offsetHeight;
			const totalHeight = el.offsetHeight;
			const lineCount = totalHeight / firstLiHeight;

			setShowToggleBtn(lineCount > 3);
			setExpanded(false); // 다시 닫기
		}, 100);
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')} //광역입고일자
					name="slipdt"
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
				<InputText label={t('lbl.SLIPNO_DP')} name="docno" onPressEnter={null} />
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromCustkeyName"
					code="fromCustkey"
					label={t('lbl.FROM_CUSTKEY_DP')}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" />
			</li>
			<li>
				<SelectBox
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				<SelectBox
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.ORDERTYPE_DP')}
				/>
			</li>
		</>
	);
};

export default DpSkuLabelInspectSearch;
