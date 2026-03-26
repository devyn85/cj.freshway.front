/*
 ############################################################################
 # FiledataField	: WdSendOutOrderSearch.tsx
 # Description		: 외부비축출고지시서
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.19
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Button, CheckBox, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';

interface WdSendOutOrderSearchProps {
	form: any;
}

const WdSendOutOrderSearch = (props: WdSendOutOrderSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');

	// 창고
	const organize = Form.useWatch('organize', props.form);
	const organizeName = Form.useWatch('organizeName', props.form);

	// 물류센터
	const dccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * checkboxp의 onChange Event Handler
	 * @param list current checked option list
	 */
	const onChangeCheckbox = (list: any) => {};

	/**
	 * 창고 홈페이지 열기
	 */
	const openUrl = () => {
		if (organize == null || organize == '') {
			showAlert('', '선택된 창고가 없습니다.');
			return;
		}
		const searchParam = {
			plant: dccode,
			organize: organize,
			storageloc: organize.replace(/^[^-]+-/, ''),
		};

		apiGetExDCStatusDtl(searchParam).then(res => {
			if (!res.data.siteaddr) {
				showAlert('', '사이트 정보가 존재하지 않습니다');
			} else {
				const fileLink = document.createElement('a');
				fileLink.href = res.data.siteaddr;

				fileLink.setAttribute('target', '_blank');
				document.body.appendChild(fileLink);
				fileLink.click();
				fileLink.remove();
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')}
					name="slipdtRange"
					//defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li className="flex-wrap">
				<CmOrganizeSearch
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
				<span>
					<Button size="small" onClick={openUrl}>
						{t('lbl.LINK')}
					</Button>
				</span>
			</li>
			<li>
				<MultiInputText
					name="docno"
					label={t('lbl.ORDRNUM')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ORDRNUM')])}
					allowClear
				/>
			</li>
			<li>
				<CmCustSearch
					form={props.form}
					selectionMode="multipleRows"
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.CUSTCODENAME')}
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={props.form}
					selectionMode="multipleRows"
					name="skuName"
					code="skuCode"
					returnValueFormat="name"
				/>
			</li>

			<li>
				<SelectBox
					name="exdcinstructtype"
					span={24}
					options={getCommonCodeList('EXDCINSTRUCTTYPE')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.EXDCINSTRUCTTYPE')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText
					name="mapkeyNo"
					label={t('lbl.MAPKEY_NO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.MAPKEY_NO')])}
					allowClear
				/>
			</li>
			<li>
				<MultiInputText
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li style={{ gridColumn: ' span 3 ' }}>
				<span>
					<CheckBox name="cfyn" trueValue={'1'} falseValue={'0'}>
						영업지원확인
					</CheckBox>
					<CheckBox name="send" trueValue={'1'} falseValue={'0'} onChange={onChangeCheckbox}>
						창고미발송
					</CheckBox>
					<CheckBox name="errorsend" trueValue={'1'} falseValue={'0'} onChange={onChangeCheckbox}>
						창고발송에러
					</CheckBox>
					<CheckBox name="allCancelStatus" trueValue={'1'} falseValue={'0'} onChange={onChangeCheckbox}>
						취소조회
					</CheckBox>
					<CheckBox name="noNormal" trueValue={'1'} falseValue={'0'} onChange={onChangeCheckbox}>
						정상오더없음
					</CheckBox>
				</span>
			</li>
		</>
	);
};

export default WdSendOutOrderSearch;
