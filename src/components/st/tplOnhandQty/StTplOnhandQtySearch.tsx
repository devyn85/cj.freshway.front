/*
  ############################################################################
 # FiledataField	: StTplOnhandQtySearch.tsx
 # Description		: 정산 > 위탁물류 >  위탁재고확인
 # Author			: ParkYoSep
 # Since			: 2025.11.17
 ############################################################################
*/

import { Form } from 'antd';
//Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';
import StTplUserSearch from '@/components/st/popup/StTplUserSearch';

//Lib
import { apiGetOrganizePopupList } from '@/api/cm/apiCmSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { useAppSelector } from '@/store/core/coreHook';
// Store

const StTplOnhandQtySearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form
	const dcCode = Form.useWatch('dcCode', form);
	const user = useAppSelector(state => state.user.userInfo);

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 컴포넌트 마운트 시 사용자의 기본 창고 정보로 초기값 설정
		if (user.defOrganize && user.emptype === 'A01') {
			const params = {
				name: user.defOrganize,
				dccode: user.defDccode,
				listCount: 1,
			};
			apiGetOrganizePopupList(params).then(res => {
				if (res.data?.list?.length === 1) {
					const organizeInfo = res.data.list[0];
					props.form.setFieldValue('organize', organizeInfo.code);
					props.form.setFieldValue('organizeName', `[${organizeInfo.code}]${organizeInfo.name}`);
				}
			});
		}
	}, []);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dcCode' }}
					mode="single"
					label={t('lbl.DCCODE')} //물류센터
					required
					disabled
				/>
			</li>
			<li>
				<CmOrganizeSearch
					label={t('lbl.ORGANIZE')} //창고
					form={props.form}
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={dcCode}
					disabled={user.emptype === 'A01' ? true : false}
				/>
			</li>

			<li>
				<StTplUserSearch
					form={form}
					name="tplUserName"
					code="tplUser"
					custkey="custkey"
					vendor="vendor"
					required
					disabled={user.emptype === 'A01' ? true : false}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={props.form}
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<InputText name="convserialno" label="B/L번호" maxLength={32} />
			</li>
			<li>
				<InputText name="serialNo" label="이력번호" maxLength={32} />
			</li>
		</>
	);
});

export default StTplOnhandQtySearch;
