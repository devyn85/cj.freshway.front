/*
 ############################################################################
 # FiledataField	: DpInspectDailyPrintSearch.tsx
 # Description		: 입고 > 입고작업 > 일배입고검수출력 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.10
 ############################################################################
*/

// Components
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpInspectDailyPrintSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	const { t } = useTranslation();

	const rangeRef = useRef(null);

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//검색영역 줄 높이
	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')} //입고일자
					name="docdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
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
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
			<li>
				<MultiInputText label={t('lbl.SLIPNO_DP')} name="docno" onPressEnter={null} />
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromcustkeyNm"
					code="fromcustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
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
				<SelectBox //저장유무
					name="channel"
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), '').filter(item =>
						['2', '3', ''].includes(item.comCd),
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CHANNEL_DMD')}
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
					label={t('lbl.ORDERTYPE_DP')} //구매유형
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={'배차변경여부'} //배차변경여부 asis에서 param을 받지않음
					name="modifyYn"
					placeholder="선택해주세요"
					options={[
						{ label: t('lbl.ALL'), value: '' },
						{ label: 'Yes', value: 'Y' },
						{ label: 'No', value: 'N' },
					]}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.PRINTPICKINGLIST')} //출력유형 검색에 영향을주지않고 프린트에서 영향을 줌
					name="printType"
					placeholder="선택해주세요"
					options={getCommonCodeList('DPINSPECTLISTDAILY')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default DpInspectDailyPrintSearch;
