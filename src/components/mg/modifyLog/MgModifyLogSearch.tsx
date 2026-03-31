/*
 ############################################################################
 # FiledataField	: StInoutResultSearch.tsx
 # Description		: 재고 > 재고현황 > 재고변경사유현황 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const dateFormat = 'YYYY-MM-DD';

const MgModifyLogSearch = forwardRef((props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { form, activeKey } = props; // Antd Form
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 사유코드 통합 옵션을 위한 커스텀 훅
	const getCombinedReasonCodes = () => {
		const cgCodes = getCommonCodeList('REASONCODE_CG', '');
		const clCodes = getCommonCodeList('REASONCODE_CL', '');
		const mvCodes = getCommonCodeList('REASONCODE_MV', '');

		// "전체" 옵션을 맨 앞에 추가
		const allOption = [{ comCd: '', cdNm: t('lbl.ALL') }]; // "전체"

		return [...allOption, ...cgCodes, ...clCodes, ...mvCodes];
	};

	// * 초기값 세팅
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}

		form.setFieldValue('reasoncode', ''); // 전체 선택을 위해 빈 값으로 설정
	}, []);

	return (
		<>
			{activeKey === '1' ? (
				<>
					{/* 조회기간 */}
					<li>
						<Rangepicker
							label="조회기간"
							name="docdt"
							defaultValue={dates}
							format={dateFormat}
							span={24}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder={t('lbl.SELECT')}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.DCCODE')}
							mode={'single'}
							required
						/>
					</li>
					{/* 로케이션 */}
					<li>
						<InputText label={t('lbl.LOC')} name="loc" onPressEnter={null} />
					</li>
					{/* 상품코드 */}
					<li>
						<span>
							<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
						</span>
					</li>
					{/* 이력유무 */}
					<li>
						<SelectBox
							label={t('lbl.SERIALYN_ST')}
							name="serialyn"
							defaultValue=""
							placeholder={t('msg.selectBox')}
							options={getCommonCodeList('SERIALYN', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 사유코드 */}
					<li>
						<SelectBox
							name="reasoncode"
							label={t('lbl.REASONCODE')}
							defaultValue=""
							options={getCombinedReasonCodes()}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 구분 */}
					<li>
						<SelectBox
							label="구분"
							name="modifytype"
							defaultValue=""
							placeholder={t('msg.selectBox')}
							options={getCommonCodeList('MODIFYTYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			) : (
				<>
					{/* 변경일자 */}
					<li>
						<Rangepicker
							label={t('lbl.MODIFYDATE')}
							name="docdt"
							defaultValue={dates}
							format={dateFormat}
							span={24}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="fixdccode"
							placeholder={t('lbl.SELECT')}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.DCCODE')}
							mode={'single'}
							required
							disabled
						/>
					</li>

					{/* 상품코드 */}
					<li>
						<span>
							<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
						</span>
					</li>
					{/* B/L 번호 */}
					<li>
						<InputText label={t('lbl.BLNO')} name="blno" span={24} />
					</li>
					{/* 이력번호 */}
					<li>
						<InputText label={t('lbl.SERIALNO')} name="serialno" span={24} />
					</li>
					{/* 계약업체 */}
					<li>
						<CmCustSearch form={form} label={t('lbl.CONTRACTCOMPANY')} name="custkeyNm" code="custkey" />
					</li>
				</>
			)}
		</>
	);
});

export default MgModifyLogSearch;
