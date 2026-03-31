/*
 ############################################################################
 # FiledataField	: KpLocationCapaScanSearch.tsx
 # Description		: 지표 > 재고 운영 > 물류센터 Capa 스캔 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.09
 ############################################################################
*/

// Components
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Store
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Libs

// Utils

const KpLocationCapaScanSearch = ({
	form,
	//initialValues,
	dates,
	//setDates,
	activeKey,
	zoneItems,
	searchMasterList,
}: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	//const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

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
		form.setFieldValue('fixdccode', gDccode);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 요약_탭 */}
			{activeKey === '1' && (
				<>
					<li>
						{/* 조회일자 */}
						<DatePicker
							label={t('lbl.DATE')}
							name="smydt"
							allowClear
							showNow={true}
							format="YYYY-MM-DD"
							required={true}
						/>
					</li>
				</>
			)}
			{/* 센터별 상세_탭 */}
			{activeKey === '2' && (
				<>
					<li>
						{/* 일별 */}
						<Rangepicker
							label={t('lbl.DATE')}
							name="slipdt"
							defaultValue={dates}
							format={dateFormat}
							//span={24}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						{/* 저장조건 */}
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE_ZONE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 피킹존 */}
						<SelectBox
							label={t('lbl.ZONE')}
							name="zone"
							//options={zoneItems}
							options={[{ cdNm: t('lbl.ALL'), comCd: '' }, ...zoneItems]}
							//items={[{ label: t('lbl.ALL'), value: '' }, ...zoneItems]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 로케이션 */}
						<InputText
							label={t('lbl.LOC_ST')}
							name="loc"
							placeholder={t('msg.placeholder1', [t('lbl.LOC_ST')])}
							onPressEnter={searchMasterList}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default KpLocationCapaScanSearch;
