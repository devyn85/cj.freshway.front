/*
 ############################################################################
 # FiledataField	: KpWdLoadMonitoringSearch.tsx
 # Description		: 상차검수현황 Search
 # Author			: 박요셉
 # Since			: 25.12.12
 ############################################################################
*/

//Component
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Lib

// API Call Function
//Util

const dateFormat = 'YYYY-MM-DD';

const KpWdLoadMonitoringSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, exception } = props;
	//const [dates, setDates] = useState([dayjs(), dayjs()]);

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
	useEffect(() => {}, []);

	return (
		<>
			<li>
				<Rangepicker label={'출고일자'} name="date" />
				{/* <Rangepicker (기존 코드)
					label={t('lbl.TERM')} //기간
					name="date"
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/> */}
			</li>
			<li>
				<CmCarSearch form={form} selectionMode="multipleRows" name="carnoName" code="carno" returnValueFormat="name" />
			</li>
			<li>
				<CmCustSearch
					form={form} //관리처
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.TO_CUSTKEY_WD')}
					/*관리처코드*/ selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form} //상품
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					required={false}
				/>
			</li>
			{/* <li>
				<CmPartnerSearch
					form={form}
					name="custkeyName"
					code="custkey"
					label={t('lbl.VENDOR')}
					selectionMode={'multipleRows'}
				/>
			</li> */}
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
				{/* 계약유형 */}
				<SelectBox
					name="contractType"
					placeholder="선택해주세요"
					options={getCommonCodeList('CONTRACTTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CONTRACTTYPE')}
				/>
			</li>
		</>
	);
});

export default KpWdLoadMonitoringSearch;
