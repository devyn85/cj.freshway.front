/*
 ############################################################################
 # FiledataField	: StTransactionSnSearch.tsx
 # Description		: 이력재고처리현황
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StTransactionSnSearch = (props: any) => {
	const dateFormat = 'YYYY-MM-DD';
	const { form } = props;
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [expanded] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	// * 초기값 세팅
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('dt', [dt1, dt2]);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<UiFilterArea>
			<UiFilterGroup className={!expanded ? 'hide' : ''} ref={groupRef}>
				{/* 발생일자 */}
				<li>
					<Rangepicker
						label={t('lbl.TRANDATE')}
						name="dt"
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
						<CmSkuSearch
							label={t('lbl.SKUCD')}
							form={form}
							name="skuName"
							code="sku"
							selectionMode="multipleRows"
							required
						/>
					</span>
				</li>
				{/* 트랜잭션유형 */}
				<li>
					<SelectBox
						label={t('lbl.TRANTYPE')}
						name="trantype"
						placeholder={t('msg.selectBox')} //"선택해주세요"
						options={getCommonCodeList('TRANTYPE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				{/* 식별번호유무 */}
				<li>
					<SelectBox
						label={t('lbl.SERIALYN')}
						name="serialyn"
						defaultValue={t('lbl.ALL')} //"전체"
						placeholder={t('msg.selectBox')} //"선택해주세요"
						options={getCommonCodeList('SERIALYN', t('lbl.ALL'))} // "전체"
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				{/* B/L 번호 */}
				<li>
					<InputText label={t('lbl.BLNO')} name="blno" onPressEnter={null} />
				</li>
				{/* 이력 번호 */}
				<li>
					<InputText label={t('lbl.SERIALNO')} name="serialno" onPressEnter={null} />
				</li>
				{/* 계약업체 */}
				<li>
					<CmCustSearch
						label={t('lbl.CONTRACTCOMPANY')}
						form={form}
						name="contractcompanyName"
						code="contractcompany"
						returnValueFormat="name"
						selectionMode="multipleRows"
					/>
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default StTransactionSnSearch;
