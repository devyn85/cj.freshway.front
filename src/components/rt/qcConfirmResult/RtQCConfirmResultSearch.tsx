/*
 ############################################################################
 # FiledataField	: RtQCConfirmResultSearch.tsx
 # Description		: 입고 > 입고작업 > 반품판정현황 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.21
 ############################################################################
*/

// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch20251208';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
// import { apiGetClaimTypeList } from '@/api/rt/apiRtQCConfirmResult';

// Store

// Libs

// Utils

const RtQCConfirmResultSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const rangeRef = useRef(null);

	const [expanded, setExpanded] = useState(false);
	const [claimtypeOptions, setClaimtypeOptions] = useState([]);
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
	const initOptions = async () => {
		// const { data } = await apiPostClaimTypeList();
		// setClaimtypeOptions([
		// 	{ label: t('lbl.ALL'), value: '' },
		// 	...data.map((item: any) => ({
		// 		label: item.LABEL,
		// 		value: item.VALUE,
		// 	})),
		// ]);
	};

	//검색영역 줄 높이
	useEffect(() => {
		initOptions();
		setExpanded(true);

		setTimeout(() => {
			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) return;

			const firstLiHeight = liElements[0].offsetHeight;
			const totalHeight = el.offsetHeight;
			const lineCount = totalHeight / firstLiHeight;

			setShowToggleBtn(lineCount > 3);
			setExpanded(false); // 다시 닫기
		}, 100);
	}, []);

	return (
		<UiFilterArea>
			<UiFilterGroup ref={groupRef}>
				{/* 반품요청일자 */}
				<li>
					<Rangepicker
						label={t('lbl.DOCDT_RT')}
						name="slipdt"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				{/* 물류센터(물류센터 코드/명) */}
				<li>
					<CmGMultiDccodeSelectBox
						name={'fixdccode'}
						required
						onChange={() => {
							form.setFieldsValue({ organize: '', organizenm: '' });
						}}
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')}
					/>
				</li>
				{/* 창고코드/명 */}
				<li>
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
				{/* 고객반품주문번호 */}
				<li>
					<MultiInputText
						label={t('lbl.SOURCEKEY_RT')}
						name="docno"
						placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
						// required
						// rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				{/* 관리처코드(고객코드) */}
				<li>
					<CmCustSearch
						label={t('lbl.FROM_CUSTKEY_RT')}
						form={form}
						name="custName"
						code="fromCustkey"
						selectionMode={'multipleRows'}
					/>
				</li>
				{/* 상품코드(상품코드/명) */}
				<li>
					<CmSkuSearch form={form} selectionMode={'multipleRows'} label={t('lbl.SKU')} name="skuNm" code="sku" />
				</li>
				{/* 저장조건 */}
				<li>
					<SelectBox
						name="storagetype"
						span={24}
						options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('lbl.STORAGETYPE')}
					/>
				</li>
				{/* 저장유무 */}
				<li>
					<SelectBox
						name="channel"
						span={24}
						options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('lbl.CHANNEL_DMD')}
					/>
				</li>
				{/* 처리상태 */}
				<li>
					<SelectBox
						name="statusRtqc"
						span={24}
						options={getCommonCodeList('STATUS_RTQC', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('lbl.QCSTATUS_RT')}
					/>
				</li>
				{/* 고객주문번호 */}
				<li>
					<MultiInputText
						label={t('lbl.CLNTORDRNUM')}
						name="docnoWd"
						placeholder={t('msg.placeholder1', [t('lbl.CLNTORDRNUM')])}
						// required
						// rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				{/* 협력사반품 */}
				<li>
					<SelectBox
						name="vendoreturn"
						span={24}
						options={getCommonCodeList('VENDORETURNYN', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						placeholder="선택해주세요"
						label={t('lbl.VENDORETURNYN')}
					/>
				</li>
				{/*<li>*/}
				{/*	<SelectBox //클레임사유*/}
				{/*		name="other03"*/}
				{/*		span={24}*/}
				{/*		options={claimtypeOptions}*/}
				{/*		placeholder="선택해주세요"*/}
				{/*		label={t('lbl.OTHER03_DMD_RT')}*/}
				{/*	/>*/}
				{/*</li>*/}
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default RtQCConfirmResultSearch;
