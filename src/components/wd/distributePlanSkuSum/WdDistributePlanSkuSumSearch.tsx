/*
 ############################################################################
 # FiledataField	: WdDistributePlanSkuSumSearch.tsx
 # Description		: 출고 > 출고현황 > 미출예정확인(상품별합계) 조회 조건 화면
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/

// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { SearchForm } from '@/components/common/custom/form';
import CheckBox from '@/components/common/custom/form/CheckBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { CheckboxChangeEvent } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

// Store

// Libs

// Utils

const WdDistributePlanSkuSumSearch = ({ form, initialValues }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// form data 초기화
	const initFormData = useMemo(
		() => ({
			...initialValues,
			slipdt: dayjs(),
			chkyn: 1,
		}),
		[initialValues],
	);

	/**
	 * TF 값 지정 체크박스 onChage Event Handler
	 * @param {CheckboxChangeEvent} e onChange Event
	 */
	const onChangeCheckYn = useCallback(
		(e: CheckboxChangeEvent) => {
			form.setFieldValue('chkyn', e.target.checked ? 1 : 0);
		},
		[form],
	);

	return (
		<UiFilterArea>
			<UiFilterGroup>
				<li>
					{/* 출고전표일자 */}
					{/*<label data-required>{t('lbl.WD_SLIPDT')}</label>*/}
					<span>
						<SearchForm form={form} initialValues={initFormData}>
							<DatePicker
								label={t('lbl.WD_SLIPDT')}
								name="slipdt"
								format="YYYY-MM-DD"
								placeholder={`${t('lbl.WD_SLIPDT')}를 입력해 주세요.`}
								required
								autoFocus
								// preserveInvalidOnBlur
								colon={false}
								allowClear
								showNow
								minLength={10}
								maxLength={10}
								rules={[
									{
										required: true,
										// message: `${t('lbl.WD_SLIPDT')}를 입력해 주세요.`,
										validateTrigger: 'none',
									},
								]}
							/>
						</SearchForm>
					</span>
				</li>
				{/* <li>
					물류센터
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
					창고
					<CmOrganizeSearch
						form={form}
						name="organizeNm"
						code="organize"
						label={t('lbl.ORGANIZE')}
						dccode={dccode}
						selectionMode="multipleRows"
					/>
				</li> */}
				<li>
					{/* 상품코드 */}
					<span>
						<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />
					</span>
				</li>
				<li>
					{/* 입고예정포함 */}
					<span>
						<CheckBox name="chkyn" onChange={onChangeCheckYn} checked={form.getFieldValue('chkyn') === 1}>
							입고예정포함
						</CheckBox>
					</span>
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default WdDistributePlanSkuSumSearch;
