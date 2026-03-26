/*
 ############################################################################
 # FiledataField	: StTransactionSearch.tsx
 # Description		: 재고처리현황
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const StTransactionSearch = (props: any) => {
	const { form } = props;
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dateFormat = 'YYYY-MM-DD';
	const [expanded] = useState(false);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const groupRef = useRef<HTMLUListElement>(null);

	// * 초기값 설정
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
				{/* 조회기간 */}
				<li>
					<Rangepicker
						label={t('lbl.SEARCH_TERM')}
						name="dt"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.SEARCH_TERM')]) }]}
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
				{/* 문서번호 */}
				<li>
					<InputText label={t('lbl.DOCNO')} name="docno" onPressEnter={null} />
				</li>
				{/* 상품코드 */}
				<li>
					<span>
						<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</span>
				</li>
				{/* 트랜잭션유형 */}
				<li>
					<SelectBox
						label={t('lbl.TRANTYPE')}
						name="trantype"
						placeholder={t('msg.selectBox')}
						options={getCommonCodeList('TRANTYPE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						onChange={null}
						defaultValue={t('lbl.ALL')}
					/>
				</li>
				{/* 식별번호유무 */}
				<li>
					<SelectBox
						label={t('lbl.SERIALYN')}
						name="serialyn"
						defaultValue={t('lbl.ALL')}
						placeholder={t('msg.selectBox')}
						options={getCommonCodeList('SERIALYN', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				{/* 로케이션 */}
				<li>
					<InputText label={t('lbl.LOC')} name="loc" onPressEnter={null} />
				</li>
				{/* 세트여부 */}
				<li>
					<SelectBox
						label={t('lbl.SET_YN')}
						name="setYn"
						defaultValue={t('lbl.ALL')}
						placeholder={t('msg.selectBox')}
						options={getCommonCodeList('YN2', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default StTransactionSearch;
