/*
 ############################################################################
 # FiledataField	: KpWdRequestCancelqtySearch.tsx
 # Description		: 결품대응현황 Search
 # Author			: 공두경
 # Since			: 25.08.07
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
//Util

const dateFormat = 'YYYY-MM-DD';

const KpWdRequestCancelqtySearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, exception, activeKey } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dccode = Form.useWatch('fixdccode', props.form);

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

	// 상태콤보값 세팅
	const stausOption = [
		{ label: '--- 전체 ---', value: null },
		{ label: '배송분류표미출력', value: '1' },
		{ label: '피킹미완료', value: '2' },
		{ label: '피킹완료', value: '3' },
		{ label: 'STO피킹완료', value: '4' },
		{ label: 'STO출고확정', value: '5' },
		{ label: '출고확정', value: '6' },
	];

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
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('slipdtRange', [initialStart, initialEnd]);

		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')} //출고일자
					name="slipdtRange"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} //물류센터(에러)
					mode={'single'}
					disabled={form.getFieldValue('fixdccodeDisabled')}
					required
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					name="organizeNm"
					code="organize"
					label={t('lbl.ORGANIZE')}
					dccode={dccode}
					/*창고*/ selectionMode="multipleRows"
					dccodeDisabled={true}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_REQCANCEL', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					disabled={activeKey === '2' ? true : false}
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.TO_CUSTKEY_WD')}
					/*관리처코드*/ selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					name="skuNm"
					code="sku"
					label={t('lbl.SKU')}
					/*상품코드*/ selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')} //저장조건
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')} //저장유무
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					name="fromcustkeyNm"
					code="fromcustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
				/>
			</li>
			<li>
				{/* 차량 팝업 */}
				<CmCarSearch form={form} code="carno" name="carnoNm" label="차량번호" selectionMode="multipleRows" />
			</li>
			<li>
				{/* POP 팝업 */}
				<CmPopSearch form={form} code="popno" name="popnoNm" label="POP번호" selectionMode="multipleRows" />
			</li>
		</>
	);
});

export default KpWdRequestCancelqtySearch;
