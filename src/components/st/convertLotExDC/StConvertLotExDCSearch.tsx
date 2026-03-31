/*
 ############################################################################
 # FiledataField	: StConvertLotExDCSearch.tsx
 # Description		: 외부비축소비기한변경
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store

// Component
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Button, InputText, MultiInputText } from '@/components/common/custom/form';

// API

interface StConvertLotExDCSearchProps {
	form: any;
}

const StConvertLotExDCSearch = (props: StConvertLotExDCSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const organize = Form.useWatch('organize', props.form);
	const dccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 창고 URL 팝업
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
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li className="flex-wrap">
				<CmOrganizeSearch //창고
					dccodeDisabled={true}
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
				/>
				<span>
					<Button onClick={openUrl} size="small">
						{t('lbl.LINK')}
					</Button>
				</span>
			</li>
			<li>
				<CmSkuSearch
					form={props.form}
					name="skuName"
					code="skuCode"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>

			<li></li>

			<li>
				<MultiInputText
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li>
				<InputText
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
			<li>
				<CmCustSearch
					form={props.form}
					name="contractcompanyName"
					code="contractcompany"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
		</>
	);
};

export default StConvertLotExDCSearch;
