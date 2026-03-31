/*
 ############################################################################
 # FiledataField	: OmOrderCustDailySearch.tsx
 # Description		: 일배협력사별주문현황 Search
 # Author			: 공두경
 # Since			: 25.06.20
 ############################################################################
*/

//Component
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const OmOrderCustDailySearch = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);

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
					label="출고일자"
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
				<InputText
					width={80}
					name="name"
					label={'창고코드/명'}
					placeholder={t('msg.placeholder2', ['창고코드 또는 이름'])}
					// onPressEnter={onClickSearchButton}
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
				<CmPartnerSearch
					form={form}
					name="fromcustkeyNm"
					code="fromcustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')} //저장조건
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
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
				<CmCustSearch
					form={form}
					label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
					name="tocustkeyNm"
					code="tocustkey"
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.BLNO')} //B/L 번호
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<MultiInputText
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
			<li>
				<SelectBox
					label={t('lbl.DELETE_YN')} //삭제여부
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default OmOrderCustDailySearch;
