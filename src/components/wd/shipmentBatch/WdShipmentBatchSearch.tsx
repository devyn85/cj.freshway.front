/*
 ############################################################################
 # FiledataField	: WdShipmentBatchSearch.tsx
 # Description		: 출고확정처리 Search
 # Author			: 공두경
 # Since			: 25.10.23
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

// CSS

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
const dateFormat = 'YYYY-MM-DD';

const WdShipmentBatchSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { form, search } = props;
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *	02. 함수
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
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')}
					name="slipdtRange"
					defaultValue={dates}
					format={dateFormat}
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
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} //물류센터(에러)
					mode={'single'}
					disabled={form.getFieldValue('fixdccodeDisabled')}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_WD')} //주문번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
					onPressEnter={search}
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
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					name="organizeNm"
					code="organize"
					label={t('lbl.ORGANIZE')}
					dccode={fixdccode}
					/*창고*/
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_WD')} //주문유형
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS_WD')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.INSPECTSTATUS_WD')} //검수진행상태
					name="inspectstatus"
					placeholder="선택해주세요"
					options={getCommonCodeList('INSPECTSTATUS_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')} //저장유무
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.DELIVERYGROUP')} // POP번호
					name="deliverygroup"
					placeholder={t('msg.placeholder1', ['POP번호'])}
					onPressEnter={search}
				/>
			</li>
			<li>
				{/* 차량 팝업 */}
				<CmCarSearch form={form} code="carno" name="carnoNm" label="차량번호" />
			</li>
			<li>
				<InputText
					label={t('lbl.BLNO')} //B/L 번호
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.SERIALNO')} //이력번호
					name="serialno"
					placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					name="contractcompanyNm"
					code="contractcompany"
					label={t('lbl.CONTRACTCOMPANY')} /*계약업체*/
				/>
			</li>
		</>
	);
});

export default WdShipmentBatchSearch;
