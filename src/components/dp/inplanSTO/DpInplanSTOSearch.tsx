/*
 ############################################################################
 # FiledataField	: DpInplanSTOSearch.tsx
 # Description		: 광역입고현황 Search
 # Author			: 공두경
 # Since			: 25.06.18
 ############################################################################
*/

//Component
import { MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const DpInplanSTOSearch = forwardRef((props: any) => {
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

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP_STO')} //광역입고일자
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
					name="fromDccode"
					placeholder="전체"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.FROM_DCCODE')} // 공급센터
					mode={'single'}
					allLabel={t('lbl.ALL')}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					required
					name="toDccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')} // 공급받는센터
					mode={'single'}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_DP_STO')} //구매번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_DP')])}
					onPressEnter={search}
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
				<CmSkuSearch
					form={form}
					selectionMode={'multipleRows'}
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
			<li></li>
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
		</>
	);
});

export default DpInplanSTOSearch;
