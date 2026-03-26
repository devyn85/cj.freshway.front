/*
 ############################################################################
 # FiledataField	: RoInvoiceSearch.tsx
 # Description		: 입고 > 입고작업 > 반출명세서출력 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.16
 ############################################################################
*/

// Components
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';

const RoInvoiceSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	const [, setExpanded] = useState(false);
	const [, setShowToggleBtn] = useState(false);
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
		<UiFilterArea>
			<UiFilterGroup ref={groupRef}>
				{/* 배송일자 */}
				<li>
					<DatePicker label={t('lbl.DELIVERYDATE')} name="invoicedt" allowClear showNow={true} format="YYYY-MM-DD" />
				</li>
				{/* 물류센터 */}
				<li>
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						required
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')}
						mode={'single'}
					/>
				</li>
				{/* 고객코드/명 */}
				<li>
					<CmCustSearch
						form={form}
						label={t('lbl.CUSTCODENAME')}
						name="toCustName"
						code="toCustkey"
						returnValueFormat="name"
					/>
				</li>
				{/* 차량번호 */}
				<li>
					<CmCarSearch
						form={form}
						label={t('lbl.CARNO')}
						name="carName"
						code="carno"
						selectionMode={'multipleRows'}
						returnValueFormat="name"
					/>
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default RoInvoiceSearch;
