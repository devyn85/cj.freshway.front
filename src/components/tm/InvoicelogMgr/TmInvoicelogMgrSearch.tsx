/*
 ############################################################################
 # FiledataField	: TmInvoicelogMgrSearch.tsx
 # Description		: 납품서출력로그(관리자)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/
// lib

// component

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

// store

// api

// util

// hook

// type

// asset
interface TmInvoicelogMgrProps {
	form: any;
}
const TmInvoicelogMgrSearch = (props: TmInvoicelogMgrProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);

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
	return (
		<>
			<li>
				{/*  */}
				<DatePicker
					label={'전표일자'}
					name="fromDt"
					placeholder={`시작일자를 입력해 주세요.`}
					required
					autoFocus
					// preserveInvalidOnBlur
					colon={false}
					allowClear
					showNow
					rules={[
						{
							required: true,
							validateTrigger: 'none',
						},
					]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dcCode' }}
					mode="single"
					label={t('lbl.DCCODE')}
					dataType=""
					required
				/>
			</li>
			<li>
				<InputText label={t('lbl.DOCNO')} name="docNo" onPressEnter={null} />
			</li>
			<li></li>
			<li>
				<DatePicker
					name="prtData01"
					label={'출력일자'}
					// required
					showSearch
					allowClear
					showNow={true}
					// rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<li>
					<CmCustSearch form={form} name="custName" code="custKey" />
				</li>
			</li>
		</>
	);
};
export default TmInvoicelogMgrSearch;
