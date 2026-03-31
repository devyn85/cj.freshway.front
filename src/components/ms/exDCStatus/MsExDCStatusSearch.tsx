import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
interface MsExDCStatusProps {
	form: any;
}
const MsExDCStatusSearch = (props: MsExDCStatusProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;
	// 플랜트 옵션
	const dccode = Form.useWatch('plant', form);
	const fixDcCode = Form.useWatch('fixDcCode', form);
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 최초 마운트시 초기화
	return (
		<>
			<li>
				{/* <DatePicker
					name="searchDt"
					label={t('lbl.CONTRACTDATE')} // 계약일자
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/> */}
				<Rangepicker
					label={t('lbl.CONTRACTDATE')} // 계약일자
					name="searchDt"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
				{/* <DateRange label={'시작일자'} name="searchDt" format="YYYY-MM-DD" fromName="fromDt" toName="thruDt" /> */}
			</li>

			<li>
				<SelectBox
					name="fixDcCode" //IF Status
					span={24}
					options={getCommonCodeList('SUPPLY_DC').map(item => ({
						...item,

						cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
					}))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DCCODENAME')}
					required
					disabled
				/>
			</li>
			<li>
				<CmOrganizeSearch form={form} name="organizeName" code="organize" returnValueFormat="name" dccode={fixDcCode} />
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText name="district" span={24} label={t('lbl.BASE_DISTRICT')} />
			</li>
			<li>
				<InputText name="area" span={24} placeholder="지역명을 입력해주세요" label={'지역'} />
			</li>
		</>
	);
};

export default MsExDCStatusSearch;
