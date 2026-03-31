/*
 ############################################################################
 # FiledataField	: StTplReceiptReqSearch.tsx
 # Description		: ​​정산항목관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.04
 ############################################################################
*/
// lib
// component
import { apiGetOrganizePopupList } from '@/api/cm/apiCmSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, Rangepicker } from '@/components/common/custom/form';
import StTplUserSearch from '@/components/st/popup/StTplUserSearch';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';
import dayjs from 'dayjs';

// store

// api

// util

// hook

// type

// asset

const StTplReceiptReqSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	const dccode = Form.useWatch('dcCode', form);
	const [dates, setDates] = useState([dayjs().subtract(1, 'month'), dayjs()]);
	const dateFormat = 'YYYY-MM-DD';
	const user = useAppSelector(state => state.user.userInfo);
	const tplUser = Form.useWatch('tplUser', form);
	const organize = Form.useWatch('organize', form);
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
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
					disabled
				/>
			</li>
			<li>
				<Rangepicker
					label="입고요청일자"
					name="date"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					// onChange={onChange}
					// span={16}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmOrganizeSearch //창고
					label="창고"
					form={props.form}
					// selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
					disabled={user.emptype === 'A01' ? true : false}
					required
				/>
			</li>

			<li>
				{/* <CmCustSearch
					form={form}
					label={'화주'} // 계약업체
					name="custkeyNm"
					code="custkey"
					disabled={user.emptype === 'A01' ? true : false}
				/> */}
				<StTplUserSearch
					form={form}
					name="tplUserName"
					code="tplUser"
					custkey="custkey"
					vendor="vendor"
					disabled={user.emptype === 'A01' ? true : false}
					required
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					// 파라미터 정의
					disabled={!tplUser || !organize} //
					callFrom="1" // 호출하는곳(1:화주상품,2:KIT상품)
				/>
			</li>
			<li>
				<InputText name="blNo" label="B/L번호" maxLength={32} />
			</li>
			<li>
				<InputText name="serialNo" label="이력번호" maxLength={32} />
			</li>
		</>
	);
});
export default StTplReceiptReqSearch;
