/*
 ############################################################################
 # FiledataField	: DpInplanSearch.tsx
 # Description		: 입고진행현황 Search
 # Author			: 공두경
 # Since			: 25.06.16
 ############################################################################
*/

//Component
import { MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';

// API Call Function
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
//Util

const dateFormat = 'YYYY-MM-DD';

const DpInplanSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, exception } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

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
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')} //입고일자
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
					name={'fixdccode'}
					required
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						return fixdccodeWatch !== '2170' && fixdccodeWatch !== '1000';
					})()}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_DP')} //입고전표번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SLIPNO_DP')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<CmPartnerSearch
					selectionMode={'multipleRows'}
					form={form}
					name="fromcustkeyNm"
					code="fromcustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					selectionMode="multipleRows"
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
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
				<SelectBox
					label={t('lbl.STATUS_DP')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label="통합배송"
					name="tpltype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDR_TPL', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_DP')} //구매유형
					name="ordertype"
					mode={'multiple'}
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'), 'all')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.SERIALTYPENAME3')} //이력관리기관
					name="serialtype"
					placeholder="선택해주세요"
					options={getCommonCodeList('PRODUCT-DRTYN', t('lbl.ALL')).filter(item => !['2', '3'].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 25_0923_조회조건표준화 추가		
			<li>
				<InputText
					label={t('B/L번호')} //B/L번호
				/>
			</li>
			<li>
				<InputText
					label={t('이력번호')} //이력번호
				/>
			</li>
			<li>
				<InputText
					label={t('계약업체')} //계약업체
				/>
			</li>
			<li>
				<CheckBox name={'name'} label="축육이력상품여부" value={'Y'}></CheckBox>
			</li>
			 */}
		</>
	);
});

export default DpInplanSearch;
