/*
 ############################################################################
 # FiledataField	: DpSkuLabelSTOSearch.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력(광역) 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.07
 ############################################################################
*/

// Components
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { MultiInputText } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store

// Libs

// Utils

const DpSkuLabelSTOSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

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

	useEffect(() => {
		// 요건.공급센터가 전체가 선택되게 처리
		form.setFieldValue('fromcustkeyNm', '');
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD_STO')} //광역입고일자
					name="slipdt"
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
					name="fromCustkey"
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
					name="toCustkey"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')} // 공급받는센터
					mode={'single'}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('광역전표번호')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('광역전표번호')])}
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
		</>
	);
};

export default DpSkuLabelSTOSearch;
