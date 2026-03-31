/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: IbConsignMastSearch.tsx
 # Description		: 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산
 # Author		    	: 고혜미
 # Since			    : 25.09.23
 ############################################################################
*/

// Component
//Lib
// Lib
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';
// API Call Function
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
//Util
import { fetchMsZone } from '@/store/biz/msZoneStore'; // Utils
import { useSelector } from 'react-redux';

const dateFormat = 'YYYY-MM';

const StAdjustmentSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { form, activeKey } = props;
	//const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	센터에 해당되는 zone 정보 조회
	 */
	const loadZone = async () => {
		await fetchMsZone();
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		loadZone(); // 센터에 해당되는 zone 정보 조회

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	if (activeKey === '1') {
		return (
			<>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						label={t('lbl.DCCODE')}
						name="multiDcCode"
						options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						mode={'multiple'}
						required
					/>
				</li>

				<li>
					{/* 거래처코드/명 */}
					<CmPartnerSearch
						form={form}
						name="custName"
						code="custkey"
						label={t('lbl.FROM_CUSTKEY_DP')} /*거래처코드*/
						selectionMode="singleRows"
						required
					/>
				</li>

				<li>
					{/*정산월*/}
					<DatePicker
						label={t('lbl.COSTDATE_MONTH')}
						name="month"
						format="YYYY-MM"
						picker="month"
						required
						allowClear
					/>
				</li>
			</>
		);
	} else if (activeKey === '2') {
		return (
			<>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						label={t('lbl.DCCODE')}
						name="multiDcCode"
						options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						mode={'multiple'}
						required
					/>
				</li>

				<li>
					{/* 거래처코드/명 */}
					<CmPartnerSearch
						form={form}
						name="custName"
						code="custkey"
						label={t('lbl.FROM_CUSTKEY_DP')} /*거래처코드*/
						selectionMode="singleRows"
						required
					/>
				</li>
			</>
		);
	}
});

export default StAdjustmentSearch;
