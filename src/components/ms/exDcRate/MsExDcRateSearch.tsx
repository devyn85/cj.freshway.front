/*
 ############################################################################
 # FiledataField   : MsExDcRateSearch.tsx
 # Description     : 외부창고 요율관리 - 검색조건 영역 컴포넌트
 # Author          : Jinwoo Park
 # Since           : 2025.06.13
 ############################################################################
*/

//css

// Lib
import dayjs from 'dayjs';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmSkuSpecSearch from '@/components/cm/popup/CmSkuSpecSearch';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

// Store
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const MsExDcRateSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { searchMaster, form } = props;
	const [dates, setDates] = useState([dayjs().subtract(1, 'year'), dayjs()]);
	const { t } = useTranslation();
	const dateFormat = 'YYYY-MM-DD';

	/**
	 * =====================================================================
	 *  02. 함수 선언부
	 * =====================================================================
	 */
	const dcCode = Form.useWatch('fixDcCode', props.form);
	/**
	 * =====================================================================
	 *  03. 렌더링
	 * =====================================================================
	 */

	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs().subtract(1, 'year');
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			{/* ===================== 검색 조건 영역 ===================== */}

			{/* ============ 1행: 날짜유형/날짜/진행상태/저장조건 ============ */}

			{/* 날짜 유형 + from ~ to */}
			<li>
				<Rangepicker
					label={t('lbl.BASEDATE')} //기준일자
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
			{/* 물류센터 */}
			<li>
				<SelectBox
					name="fixDcCode"
					span={24}
					options={getCommonCodeList('SUPPLY_DC').map(item => ({
						...item,
						cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
					}))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DCCODENAME')} //물류센터
					required
					disabled
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="singleRow"
					name="organizeNm"
					code="organize"
					returnValueFormat="name"
					dccode={dcCode}
				/>
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					name="delYn"
					// span={24}
					label={t('lbl.STATUS')} //진행상태
					options={(getCommonCodeList('MS_USE_YN', t('lbl.ALL'), null) as { comCd: string; cdNm: string }[]).filter(
						item => ['Y', 'N', null].includes(item.comCd),
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storageType"
					label={t('lbl.STORAGETYPE')} //저장조건
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					// span={24}
				/>
			</li>

			{/* ============ 2행: 조직/상품스펙 ============ */}
			<li>
				<CmCustSearch form={form} name="custKeyNm" code="custKey" />
			</li>
			<li>
				<CmSkuSpecSearch
					form={form}
					selectionMode="singleRow"
					name="specName"
					code="specCode"
					returnValueFormat="name"
				/>
			</li>

			{/* ============ 3행: 상품검색 ============ */}

			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
		</>
	);
});

export default MsExDcRateSearch;
