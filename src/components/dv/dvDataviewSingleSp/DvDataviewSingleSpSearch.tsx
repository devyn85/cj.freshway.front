/*
 ############################################################################
 # FiledataField	: StTransactionSnSearch.tsx
 # Description		: 재고 > 재고현황 > 이력재고처리현황 조회 조건 화면
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

const DvDataviewSingleSpSearch = (props: any) => {
	const dateFormat = 'YYYY-MM-DD';
	const { t } = useTranslation();
	const { form, ifDate } = props;
	const [expanded, setExpanded] = useState(false);
	const [, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	//검색영역 줄 높이
	useEffect(() => {
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
		<>
			<UiFilterArea>
				<UiFilterGroup className={!expanded ? 'hide' : ''} ref={groupRef}>
					{/* 전송시간 */}
					<li>
						<DatePicker
							label={t('lbl.IF_DATE')}
							name="ifDate"
							format={dateFormat}
							placeholder={`${t('lbl.IF_DATE')}를 입력해 주세요.`}
							required
							autoFocus
							defaultValue={ifDate}
							colon={false}
							allowClear
							showNow
							minLength={10}
							maxLength={10}
							rules={[
								{
									required: true,
									validateTrigger: 'none',
								},
							]}
						/>
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
					{/* 문서번호 */}
					<li>
						<InputText label={t('lbl.DOCNO')} name="docno" onPressEnter={null} />
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default DvDataviewSingleSpSearch;
